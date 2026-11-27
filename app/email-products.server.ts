import type {
  NotificationProduct,
  NotificationVariantGroup,
} from "./emails/NewProductNotification";
import { normalizeWebUrl } from "./email-template";
import { translate, type Locale } from "./i18n";

export const NOTIFY_PRODUCTS_QUERY = `#graphql
  query NotifyProducts($ids: [ID!]!) {
    shop {
      name
      primaryDomain { url }
    }
    nodes(ids: $ids) {
      __typename
      ... on Product {
        id
        title
        handle
        onlineStoreUrl
        featuredImage { url }
        hasOnlyDefaultVariant
        priceRangeV2 {
          minVariantPrice { amount currencyCode }
          maxVariantPrice { amount }
        }
        variants(first: 6) {
          pageInfo { hasNextPage }
          nodes { ...NotificationVariant }
        }
      }
      ... on ProductVariant {
        ...NotificationVariant
        product { id }
      }
    }
  }

  fragment NotificationVariant on ProductVariant {
    id
    title
    price
    image { url }
    selectedOptions { name value }
  }
`;

type Variant = {
  id: string;
  title: string;
  price: string;
  image: { url: string } | null;
  selectedOptions: { name: string; value: string }[];
};

type Product = {
  id: string;
  title: string;
  handle: string;
  onlineStoreUrl: string | null;
  featuredImage: { url: string } | null;
  hasOnlyDefaultVariant: boolean;
  priceRangeV2: {
    minVariantPrice: { amount: string; currencyCode: string };
    maxVariantPrice: { amount: string };
  };
  variants: { nodes: Variant[]; pageInfo: { hasNextPage: boolean } };
};

type NotifyNode =
  | ({ __typename: "Product" } & Product)
  | ({ __typename: "ProductVariant"; product: { id: string } } & Variant)
  | { __typename: string }
  | null;

export type NotifyNodesQuery = {
  data?: {
    shop?: { name: string; primaryDomain?: { url: string } | null };
    nodes?: NotifyNode[];
  };
  errors?: { message: string }[];
};

export type RequestedItem = { productId: string; variantId: string };

function imageUrl(value: string | undefined) {
  return value?.startsWith("https://") ? value : undefined;
}

function variantLink(productUrl: string, variant: Variant) {
  const id = variant.id.split("/").pop() ?? "";
  if (!/^\d+$/.test(id)) return null;
  const url = new URL(productUrl);
  url.searchParams.set("variant", id);
  return url.toString();
}

function priceRange(format: Intl.NumberFormat, prices: string[]) {
  const amounts = prices.map(Number);
  const low = Math.min(...amounts);
  const high = Math.max(...amounts);
  return low === high
    ? format.format(low)
    : `${format.format(low)} – ${format.format(high)}`;
}

function countLabel(t: ReturnType<typeof translate>, count: number) {
  return count === 1 ? t("emailOneVariant") : t("emailVariantCount", { count });
}

export function makeNotificationProducts(
  nodes: NotifyNode[],
  items: RequestedItem[],
  shop: string,
  locale: Locale,
):
  | { products: NotificationProduct[] }
  | {
      error: "notifyMissingProduct" | "notifyMissingVariant" | "notifyBadUrl";
    } {
  const t = translate(locale);
  const productsById = new Map<string, Product>();
  const variantsById = new Map<string, Variant & { product: { id: string } }>();
  for (const node of nodes) {
    if (node?.__typename === "Product" && "handle" in node)
      productsById.set(node.id, node);
    if (node?.__typename === "ProductVariant" && "product" in node)
      variantsById.set(node.id, node);
  }

  const selections = new Map<
    string,
    { product: Product; variants: Map<string, Variant>; wholeProduct: boolean }
  >();
  for (const item of items) {
    const product = productsById.get(item.productId);
    if (!product) return { error: "notifyMissingProduct" };
    let selected = selections.get(product.id);
    if (!selected) {
      selected = { product, variants: new Map(), wholeProduct: false };
      selections.set(product.id, selected);
    }
    if (!item.variantId) {
      selected.wholeProduct = true;
      continue;
    }
    const variant = variantsById.get(item.variantId);
    if (!variant || variant.product.id !== product.id)
      return { error: "notifyMissingVariant" };
    selected.variants.set(variant.id, variant);
  }

  const products: NotificationProduct[] = [];
  // Keep the email compact while always including explicitly selected variants.
  let autoVariantsRemaining = Math.max(
    0,
    20 - items.filter((item) => item.variantId).length,
  );
  for (const { product, variants, wholeProduct } of selections.values()) {
    const url = normalizeWebUrl(
      product.onlineStoreUrl || `https://${shop}/products/${product.handle}`,
    );
    if (!url) return { error: "notifyBadUrl" };
    const format = new Intl.NumberFormat(locale === "zh" ? "zh-CN" : "en", {
      style: "currency",
      currency: product.priceRangeV2.minVariantPrice.currencyCode,
    });

    const productImage = imageUrl(product.featuredImage?.url);
    let moreVariants = false;
    if (wholeProduct && !product.hasOnlyDefaultVariant) {
      const automatic = product.variants.nodes.filter(
        (variant) => !variants.has(variant.id),
      );
      const included = automatic.slice(0, autoVariantsRemaining);
      for (const variant of included) variants.set(variant.id, variant);
      autoVariantsRemaining -= included.length;
      moreVariants =
        product.variants.pageInfo.hasNextPage ||
        included.length < automatic.length;
    }

    const groups = new Map<
      string,
      { rows: NotificationVariantGroup["rows"]; prices: string[] }
    >();
    for (const variant of variants.values()) {
      const link = variantLink(url, variant);
      if (!link) return { error: "notifyBadUrl" };
      if (product.hasOnlyDefaultVariant) continue;
      const [first, ...otherOptions] = variant.selectedOptions;
      const label =
        (otherOptions.length ? first?.value : first?.name) ||
        t("emailVariants");
      const group = groups.get(label) ?? { rows: [], prices: [] };
      group.rows.push({
        title: variant.title,
        url: link,
        imageUrl: imageUrl(variant.image?.url) ?? productImage,
        price: priceRange(format, [variant.price]),
      });
      group.prices.push(variant.price);
      groups.set(label, group);
    }

    const prices = wholeProduct
      ? [
          product.priceRangeV2.minVariantPrice.amount,
          product.priceRangeV2.maxVariantPrice.amount,
        ]
      : [...variants.values()].map((variant) => variant.price);
    products.push({
      title: product.title,
      url,
      imageUrl: productImage,
      price: priceRange(format, prices),
      summary: groups.size
        ? `${countLabel(t, variants.size)} · ${groups.size === 1 ? t("emailOneGroup") : t("emailGroupCount", { count: groups.size })}`
        : undefined,
      groups: [...groups].map(([title, group]) => ({
        title,
        countLabel: countLabel(t, group.rows.length),
        price: priceRange(format, group.prices),
        rows: group.rows,
      })),
      moreVariantsLabel: moreVariants ? t("emailMoreVariants") : undefined,
    });
  }
  return { products };
}
