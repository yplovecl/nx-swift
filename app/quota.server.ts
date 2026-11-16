import db from "./db.server";

const DEFAULT_KEY = "default_mail_quota";

const SEED_PACKS = [
  { credits: 500, priceCents: 100, sort: 1 },
  { credits: 3000, priceCents: 500, sort: 2 },
  { credits: 8000, priceCents: 1000, sort: 3 },
];

type AdminClient = {
  graphql: (
    query: string,
    options?: { variables?: Record<string, unknown> },
  ) => Promise<Response>;
};

export function formatPackPrice(cents: number, currency: string) {
  const whole = Math.trunc(cents / 100);
  const fraction = Math.abs(cents % 100);
  const amount = fraction === 0 ? String(whole) : `${whole}.${String(fraction).padStart(2, "0")}`;
  return currency === "USD" ? `$${amount}` : `${amount} ${currency}`;
}

function moneyAmount(cents: number) {
  const whole = Math.trunc(cents / 100);
  const fraction = Math.abs(cents % 100);
  return `${whole}.${String(fraction).padStart(2, "0")}`;
}

function readDefault(value: string | undefined) {
  if (!value || !/^\d+$/.test(value)) return 100;
  const parsed = Number(value);
  if (parsed > 1_000_000) return 100;
  return parsed;
}

export async function ensureMailConfig() {
  await db.appSetting.upsert({
    where: { key: DEFAULT_KEY },
    create: { key: DEFAULT_KEY, value: "100" },
    update: {},
  });
  const packs = await db.mailPack.count();
  if (packs === 0) {
    await db.mailPack.createMany({
      data: SEED_PACKS.map((pack) => ({ ...pack, currency: "USD", active: true })),
    });
  }
}

async function defaultAllowance() {
  const setting = await db.appSetting.findUnique({ where: { key: DEFAULT_KEY } });
  return readDefault(setting?.value);
}

export async function shopQuota(shop: string) {
  await ensureMailConfig();
  let balance = await db.shopMailBalance.findUnique({ where: { shop } });
  if (!balance) {
    try {
      balance = await db.shopMailBalance.create({
        data: { shop, allowance: await defaultAllowance() },
      });
    } catch {
      balance = await db.shopMailBalance.findUnique({ where: { shop } });
    }
  }
  if (!balance) throw new Error("mail balance missing");
  const remaining = Math.max(0, balance.allowance - balance.used);
  return { total: balance.allowance, used: balance.used, remaining };
}

export async function listMailPacks() {
  await ensureMailConfig();
  return db.mailPack.findMany({
    where: { active: true },
    orderBy: [{ sort: "asc" }, { id: "asc" }],
  });
}

export async function reserveMails(shop: string, requested: number) {
  if (requested <= 0) return 0;
  await shopQuota(shop);
  for (let attempt = 0; attempt < 2; attempt += 1) {
    const balance = await db.shopMailBalance.findUnique({ where: { shop } });
    if (!balance) return 0;
    const remaining = balance.allowance - balance.used;
    const take = Math.min(requested, Math.max(0, remaining));
    if (take <= 0) return 0;
    const updated = await db.shopMailBalance.updateMany({
      where: {
        shop,
        used: balance.used,
        allowance: { gte: balance.used + take },
      },
      data: { used: { increment: take } },
    });
    if (updated.count === 1) return take;
  }
  return 0;
}

export async function releaseMails(shop: string, count: number) {
  if (count <= 0) return;
  await db.shopMailBalance.updateMany({
    where: { shop, used: { gte: count } },
    data: { used: { decrement: count } },
  });
}

export async function recordDeliveries(
  shop: string,
  recipients: { id: number; email: string }[],
) {
  if (recipients.length === 0) return;
  const ids = recipients.map((recipient) => recipient.id);
  await db.$transaction([
    db.mailDelivery.createMany({
      data: recipients.map((recipient) => ({
        shop,
        subscriberId: recipient.id,
        email: recipient.email,
      })),
    }),
    db.subscriber.updateMany({
      where: { shop, id: { in: ids } },
      data: { receivedCount: { increment: 1 } },
    }),
  ]);
}

export async function startMailPurchase(
  admin: AdminClient,
  shop: string,
  packId: number,
  returnUrl: string,
) {
  await ensureMailConfig();
  const pack = await db.mailPack.findFirst({ where: { id: packId, active: true } });
  if (!pack) return { ok: false as const, detail: "" };

  const planResponse = await admin.graphql(
    `#graphql
      query MailShopPlan {
        shop {
          plan {
            partnerDevelopment
          }
        }
      }`,
  );
  const planPayload = (await planResponse.json()) as {
    data?: { shop?: { plan?: { partnerDevelopment?: boolean } } };
  };
  const test = planPayload.data?.shop?.plan?.partnerDevelopment === true;

  const response = await admin.graphql(
    `#graphql
      mutation MailPurchase(
        $name: String!
        $returnUrl: URL!
        $price: MoneyInput!
        $test: Boolean
      ) {
        appPurchaseOneTimeCreate(
          name: $name
          returnUrl: $returnUrl
          test: $test
          price: $price
        ) {
          confirmationUrl
          userErrors {
            message
          }
          appPurchaseOneTime {
            id
            status
          }
        }
      }`,
    {
      variables: {
        name: `${pack.credits} emails`,
        returnUrl,
        test,
        price: { amount: moneyAmount(pack.priceCents), currencyCode: pack.currency },
      },
    },
  );
  const payload = (await response.json()) as {
    data?: {
      appPurchaseOneTimeCreate?: {
        confirmationUrl?: string | null;
        userErrors?: { message: string }[];
        appPurchaseOneTime?: { id: string; status: string } | null;
      };
    };
    errors?: { message: string }[];
  };
  const created = payload.data?.appPurchaseOneTimeCreate;
  const detail = [
    ...(payload.errors ?? []).map((item) => item.message),
    ...(created?.userErrors ?? []).map((item) => item.message),
  ]
    .filter((item) => item.length > 0)
    .join("; ");
  const purchase = created?.appPurchaseOneTime;
  if (!created?.confirmationUrl || !purchase?.id) {
    return { ok: false as const, detail };
  }

  await db.mailPurchase.create({
    data: {
      shop,
      packId: pack.id,
      credits: pack.credits,
      priceCents: pack.priceCents,
      currency: pack.currency,
      chargeGid: purchase.id,
      status: purchase.status.toLowerCase(),
    },
  });
  return { ok: true as const, confirmationUrl: created.confirmationUrl };
}

async function creditPurchase(
  shop: string,
  purchase: { id: number; credits: number },
) {
  return db.$transaction(async (tx) => {
    const marked = await tx.mailPurchase.updateMany({
      where: { id: purchase.id, applied: false },
      data: { applied: true, status: "active" },
    });
    if (marked.count !== 1) return false;
    await tx.shopMailBalance.update({
      where: { shop },
      data: { allowance: { increment: purchase.credits } },
    });
    return true;
  });
}

const PURCHASE_STATUS_QUERY = `#graphql
  query MailPurchaseStatuses($ids: [ID!]!) {
    nodes(ids: $ids) {
      ... on AppPurchaseOneTime {
        id
        status
      }
    }
  }`;

function readStatuses(payload: {
  data?: { nodes?: Array<{ id?: string; status?: string } | null> };
  errors?: { message: string }[];
}) {
  if (payload.errors?.length) {
    console.error("mail purchase status", payload.errors[0]?.message || "error");
  }
  const statuses = new Map<string, string>();
  for (const node of payload.data?.nodes ?? []) {
    if (node?.id && node.status) statuses.set(node.id, node.status.toUpperCase());
  }
  return statuses;
}

async function purchaseStatuses(admin: AdminClient, shop: string, ids: string[]) {
  const response = await admin.graphql(PURCHASE_STATUS_QUERY, { variables: { ids } });
  const statuses = readStatuses(
    (await response.json()) as {
      data?: { nodes?: Array<{ id?: string; status?: string } | null> };
      errors?: { message: string }[];
    },
  );
  if (statuses.size > 0) return statuses;

  const offline = await db.session.findUnique({ where: { id: `offline_${shop}` } });
  if (!offline?.accessToken) return statuses;
  const fallback = await fetch(`https://${shop}/admin/api/2026-07/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": offline.accessToken,
    },
    body: JSON.stringify({ query: PURCHASE_STATUS_QUERY, variables: { ids } }),
  });
  if (!fallback.ok) return statuses;
  return readStatuses(
    (await fallback.json()) as {
      data?: { nodes?: Array<{ id?: string; status?: string } | null> };
      errors?: { message: string }[];
    },
  );
}

// The return from Shopify's charge page often drops charge_id. Settle any
// recent unapplied purchase by asking Shopify for its current status.
export async function settleMailPurchases(admin: AdminClient, shop: string) {
  await shopQuota(shop);
  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const pending = await db.mailPurchase.findMany({
    where: {
      shop,
      applied: false,
      createdAt: { gte: since },
      NOT: { status: { in: ["declined", "expired"] } },
    },
    orderBy: { createdAt: "desc" },
    take: 10,
  });
  if (pending.length === 0) return { state: "none" as const, credits: 0 };

  const statuses = await purchaseStatuses(
    admin,
    shop,
    pending.map((purchase) => purchase.chargeGid),
  );

  let appliedCredits = 0;
  let declined = false;
  let waiting = false;
  let recentWaitingCredits = 0;
  for (const purchase of pending) {
    const status = statuses.get(purchase.chargeGid) ?? "";
    if (status === "ACTIVE") {
      if (await creditPurchase(shop, purchase)) appliedCredits += purchase.credits;
      continue;
    }
    if (status === "DECLINED" || status === "EXPIRED") {
      await db.mailPurchase.update({
        where: { id: purchase.id },
        data: { status: status.toLowerCase() },
      });
      declined = true;
      continue;
    }
    waiting = true;
    if (Date.now() - purchase.createdAt.getTime() < 15 * 60 * 1000) {
      recentWaitingCredits += purchase.credits;
    }
    console.info("mail purchase status", status || "missing");
  }

  if (appliedCredits > 0) return { state: "applied" as const, credits: appliedCredits };
  if (declined && !waiting) return { state: "declined" as const, credits: 0 };
  if (recentWaitingCredits > 0) return { state: "pending" as const, credits: recentWaitingCredits };
  return { state: "none" as const, credits: 0 };
}
