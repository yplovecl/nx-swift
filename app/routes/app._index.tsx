import { useEffect, useRef } from "react";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { useFetcher, useLoaderData, useLocation } from "@remix-run/react";
import {
  Banner,
  BlockStack,
  Button,
  Card,
  InlineGrid,
  InlineStack,
  List,
  Page,
  Text,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import db from "../db.server";
import { shopFromAddress } from "../domain.server";
import { localeFromRequest, translate } from "../i18n";
import {
  applyMailCharge,
  formatPackPrice,
  listMailPacks,
  shopQuota,
  startMailPurchase,
} from "../quota.server";
import { authenticate } from "../shopify.server";

function appReturnUrl(request: Request, shop: string) {
  const current = new URL(request.url);
  const base = process.env.SHOPIFY_APP_URL || current.origin;
  const target = new URL("/app", base);
  target.searchParams.set("shop", shop);
  const host = current.searchParams.get("host");
  if (host) target.searchParams.set("host", host);
  return target.toString();
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { admin, session } = await authenticate.admin(request);
  const locale = await localeFromRequest(request);
  const t = translate(locale);
  const url = new URL(request.url);
  const chargeId = url.searchParams.get("charge_id");
  let purchase: "applied" | "declined" | null = null;
  let purchasedCredits = 0;
  if (chargeId) {
    const result = await applyMailCharge(admin, session.shop, chargeId);
    if (result.state === "applied") {
      purchase = "applied";
      purchasedCredits = result.credits;
    } else if (result.state === "declined") {
      purchase = "declined";
    }
  }

  const [count, domain, address, quota, packs] = await Promise.all([
    db.subscriber.count({ where: { shop: session.shop } }),
    db.shopDomain.findUnique({ where: { shop: session.shop } }),
    shopFromAddress(session.shop),
    shopQuota(session.shop),
    listMailPacks(),
  ]);

  return {
    locale,
    title: t("homeTitle"),
    shop: session.shop,
    summary: t("homeCount", { count }),
    senderLine: address
      ? t("homeSender", { from: address.from })
      : domain
        ? t("homeSenderNoFrom", { domain: domain.name })
        : t("homeNoSender"),
    steps: [t("homeStepBlock"), t("homeStepSender"), t("homeStepNotify")],
    settingsLabel: t("homeSettings"),
    subscribersLabel: t("homeSubscribers"),
    notifyLabel: t("homeNotify"),
    privacyLabel: t("homePrivacy"),
    quotaTitle: t("homeQuotaTitle"),
    totalLabel: t("homeQuotaTotal"),
    remainingLabel: t("homeQuotaRemaining"),
    usedLabel: t("homeQuotaUsed"),
    subscribersStatLabel: t("homeQuotaSubscribers"),
    packsTitle: t("homePacksTitle"),
    buyLabel: t("homeBuy"),
    noPacks: t("homeNoPacks"),
    purchaseFailed: t("homePurchaseFailed"),
    purchaseMessage:
      purchase === "applied"
        ? t("homePurchaseApplied", { credits: purchasedCredits })
        : purchase === "declined"
          ? t("homePurchaseDeclined")
          : "",
    purchaseTone: purchase === "applied" ? "success" : purchase === "declined" ? "warning" : "info",
    quota,
    subscriberCount: count,
    packs: packs.map((pack) => ({
      id: pack.id,
      label: t("homePackLabel", {
        credits: pack.credits,
        price: formatPackPrice(pack.priceCents, pack.currency),
      }),
    })),
  };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { admin, session } = await authenticate.admin(request);
  const t = translate(await localeFromRequest(request));
  const formData = await request.formData();
  const packId = Number(formData.get("packId"));
  if (!Number.isInteger(packId) || packId <= 0) {
    return { message: t("homePurchaseFailed") };
  }
  const started = await startMailPurchase(admin, session.shop, packId, appReturnUrl(request, session.shop));
  if (!started.ok) {
    return { message: started.detail ? `${t("homePurchaseFailed")} ${started.detail}` : t("homePurchaseFailed") };
  }
  return { confirmationUrl: started.confirmationUrl };
};

function buyAction(search: string) {
  const params = new URLSearchParams(search);
  params.set("index", "");
  return `/app?${params.toString()}`;
}

function openEmbeddedPage(path: string, search: string) {
  return (event?: { preventDefault: () => void }) => {
    event?.preventDefault();
    window.location.assign(`${path}${search}`);
  };
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <Card>
      <BlockStack gap="100">
        <Text as="p" variant="bodySm" tone="subdued">
          {label}
        </Text>
        <Text as="p" variant="headingLg">
          {value}
        </Text>
      </BlockStack>
    </Card>
  );
}

export default function Index() {
  const data = useLoaderData<typeof loader>();
  const { search } = useLocation();
  const fetcher = useFetcher<typeof action>();
  const opened = useRef("");
  const pages = [
    { path: "/app/settings", label: data.settingsLabel, primary: true },
    { path: "/app/subscribers", label: data.subscribersLabel, primary: false },
    { path: "/app/notify", label: data.notifyLabel, primary: false },
    { path: "/privacy", label: data.privacyLabel, primary: false },
  ];
  const buying = fetcher.state !== "idle";
  const purchaseError =
    fetcher.data && "message" in fetcher.data ? fetcher.data.message : "";

  useEffect(() => {
    const url = fetcher.data && "confirmationUrl" in fetcher.data ? fetcher.data.confirmationUrl : "";
    if (!url || opened.current === url) return;
    opened.current = url;
    if (window.top) window.top.location.href = url;
  }, [fetcher.data]);

  return (
    <Page title={data.title}>
      <TitleBar title={data.title} />
      <BlockStack gap="400">
        {data.purchaseMessage ? (
          <Banner tone={data.purchaseTone === "success" ? "success" : "warning"}>
            <p>{data.purchaseMessage}</p>
          </Banner>
        ) : null}
        {purchaseError ? (
          <Banner tone="critical">
            <p>{purchaseError}</p>
          </Banner>
        ) : null}
        <BlockStack gap="300">
          <Text as="h2" variant="headingMd">
            {data.quotaTitle}
          </Text>
          <InlineGrid columns={{ xs: 2, sm: 4 }} gap="300">
            <Stat label={data.totalLabel} value={data.quota.total} />
            <Stat label={data.remainingLabel} value={data.quota.remaining} />
            <Stat label={data.usedLabel} value={data.quota.used} />
            <Stat label={data.subscribersStatLabel} value={data.subscriberCount} />
          </InlineGrid>
        </BlockStack>
        <Card>
          <BlockStack gap="300">
            <Text as="h2" variant="headingMd">
              {data.packsTitle}
            </Text>
            {data.packs.length === 0 ? (
              <Text as="p" variant="bodyMd">
                {data.noPacks}
              </Text>
            ) : (
              data.packs.map((pack) => (
                <InlineStack key={pack.id} align="space-between" blockAlign="center">
                  <Text as="span" variant="bodyMd">
                    {pack.label}
                  </Text>
                  <Button
                    disabled={buying}
                    onClick={() => {
                      const body = new FormData();
                      body.set("packId", String(pack.id));
                      fetcher.submit(body, { method: "post", action: buyAction(search) });
                    }}
                  >
                    {data.buyLabel}
                  </Button>
                </InlineStack>
              ))
            )}
          </BlockStack>
        </Card>
        <Card>
          <BlockStack gap="400">
            <Text as="h2" variant="headingMd">
              {data.shop}
            </Text>
            <Text as="p" variant="bodyMd">
              {data.summary} {data.senderLine}
            </Text>
            <List>
              {data.steps.map((step) => (
                <List.Item key={step}>{step}</List.Item>
              ))}
            </List>
            <InlineStack gap="300">
              {pages.map((page) => (
                <Button
                  key={page.path}
                  variant={page.primary ? "primary" : undefined}
                  url={`${page.path}${search}`}
                  onClick={openEmbeddedPage(page.path, search)}
                >
                  {page.label}
                </Button>
              ))}
            </InlineStack>
          </BlockStack>
        </Card>
      </BlockStack>
    </Page>
  );
}
