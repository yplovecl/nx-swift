import type { CSSProperties } from "react";
import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components";

type ProductLink = {
  title: string;
  imageUrl?: string;
  url: string;
  price: string;
};

export type NotificationVariantGroup = {
  title: string;
  countLabel: string;
  price: string;
  rows: ProductLink[];
};

export type NotificationProduct = ProductLink & {
  summary?: string;
  groups: NotificationVariantGroup[];
  moreVariantsLabel?: string;
};

type Props = {
  lang: string;
  shopName: string;
  brandIconUrl?: string;
  newArrivals: string;
  greeting: string;
  heading: string;
  intro: string;
  products: NotificationProduct[];
  buttonLabel: string;
  buttonUrl: string;
  footer: string;
  unsubscribeUrl: string;
  unsubscribeLabel: string;
};

const ink = "#20242c";
const muted = "#626c7a";
const blue = "#316ff4";
const border = "#e7ebf0";
const body: CSSProperties = {
  backgroundColor: "#edf0f3",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif',
  padding: "14px 8px",
  color: ink,
};
const shell = {
  width: "100%",
  maxWidth: 600,
  backgroundColor: "#fff",
  border: `1px solid ${border}`,
  borderRadius: 20,
};
const padding = { padding: "26px 32px" };
const divider = `1px solid ${border}`;
const text = { color: muted, fontSize: 14, lineHeight: "1.65", margin: "0" };
const card = {
  border: divider,
  borderRadius: 14,
  marginTop: 16,
  width: "100%",
  borderCollapse: "separate" as const,
};
const productLink = { color: ink, textDecoration: "none" };

function Thumbnail({ url, size }: { url?: string; size: number }) {
  const style = {
    height: size,
    width: size,
    borderRadius: size > 40 ? 10 : 8,
    backgroundColor: "#e7ebf0",
  };
  return url ? (
    <Img
      src={url}
      alt=""
      width={size}
      height={size}
      style={{ ...style, objectFit: "cover" }}
    />
  ) : (
    <Section aria-hidden="true" style={style} />
  );
}

function ProductCard({ product }: { product: NotificationProduct }) {
  return (
    <Section style={card}>
      <Row>
        <Column style={{ padding: 16 }}>
          <Row>
            <Column style={{ width: 72 }}>
              <Thumbnail url={product.imageUrl} size={72} />
            </Column>
            <Column style={{ padding: "0 12px", verticalAlign: "middle" }}>
              <Link
                href={product.url}
                style={{ ...productLink, fontSize: 17, fontWeight: 700 }}
              >
                {product.title}
              </Link>
              {product.summary && (
                <Text style={{ ...text, fontSize: 12, marginTop: 3 }}>
                  {product.summary}
                </Text>
              )}
            </Column>
            <Column
              align="right"
              style={{
                width: "1%",
                verticalAlign: "middle",
                fontWeight: 700,
                fontSize: 15,
              }}
            >
              {product.price}
            </Column>
          </Row>
          {product.groups.map((group) => (
            <Section key={group.title} style={{ marginTop: 16 }}>
              <Row>
                <Column style={{ fontSize: 14, fontWeight: 700 }}>
                  {group.title}{" "}
                  <span
                    style={{
                      marginLeft: 4,
                      fontSize: 12,
                      fontWeight: 400,
                      color: muted,
                    }}
                  >
                    {group.countLabel}
                  </span>
                </Column>
                <Column align="right" style={{ fontSize: 13, color: muted }}>
                  {group.price}
                </Column>
              </Row>
              {group.rows.map((variant, index) => (
                <Row
                  key={variant.url}
                  style={{ borderTop: index ? divider : undefined }}
                >
                  <Column style={{ padding: "8px 0", width: 40 }}>
                    <Thumbnail url={variant.imageUrl} size={40} />
                  </Column>
                  <Column style={{ padding: "8px 12px", fontSize: 13 }}>
                    <Link href={variant.url} style={productLink}>
                      {variant.title}
                    </Link>
                  </Column>
                  <Column
                    align="right"
                    style={{ padding: "8px 0", color: muted, fontSize: 13 }}
                  >
                    {variant.price}
                  </Column>
                </Row>
              ))}
            </Section>
          ))}
          {product.moreVariantsLabel && (
            <Text style={{ ...text, marginTop: 12, fontSize: 12 }}>
              <Link href={product.url} style={{ color: blue }}>
                {product.moreVariantsLabel}
              </Link>
            </Text>
          )}
        </Column>
      </Row>
    </Section>
  );
}

export function NewProductNotification({
  lang,
  shopName,
  brandIconUrl,
  newArrivals,
  greeting,
  heading,
  intro,
  products,
  buttonLabel,
  buttonUrl,
  footer,
  unsubscribeUrl,
  unsubscribeLabel,
}: Props) {
  return (
    <Html lang={lang}>
      <Head>
        <style>
          {
            "@media(max-width:480px){.email-padding{padding-left:16px!important;padding-right:16px!important}}"
          }
        </style>
      </Head>
      <Preview>{intro}</Preview>
      <Body style={body}>
        <Container style={shell}>
          <Section
            className="email-padding"
            style={{ ...padding, borderBottom: divider }}
          >
            <Row>
              {brandIconUrl && (
                <Column style={{ width: 30, paddingRight: 10 }}>
                  <Img src={brandIconUrl} width={30} height={30} alt="" />
                </Column>
              )}
              <Column
                style={{
                  fontSize: 18,
                  fontWeight: 750,
                  letterSpacing: "0.04em",
                }}
              >
                {shopName}
              </Column>
              <Column
                align="right"
                style={{
                  color: muted,
                  fontSize: 11,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                {newArrivals}
              </Column>
            </Row>
          </Section>
          <Section className="email-padding" style={padding}>
            <Text style={text}>{greeting}</Text>
            <Heading
              as="h1"
              style={{ fontSize: 25, lineHeight: "1.35", margin: "12px 0" }}
            >
              {heading}
            </Heading>
            <Text style={{ ...text, marginBottom: 26 }}>{intro}</Text>
            {products.map((product) => (
              <ProductCard key={product.url} product={product} />
            ))}
            <Section style={{ textAlign: "center", marginTop: 28 }}>
              <Button
                href={buttonUrl}
                style={{
                  border: `1px solid ${blue}`,
                  borderRadius: 10,
                  color: blue,
                  padding: "13px 24px",
                  fontSize: 14,
                  fontWeight: 700,
                }}
              >
                {buttonLabel}
              </Button>
            </Section>
          </Section>
          <Section
            className="email-padding"
            style={{ ...padding, borderTop: divider }}
          >
            <Text style={{ ...text, fontSize: 12 }}>{footer}</Text>
            <Text style={{ ...text, fontSize: 12, marginTop: 10 }}>
              <Link href={unsubscribeUrl} style={{ color: blue }}>
                {unsubscribeLabel}
              </Link>
            </Text>
            <Text style={{ ...text, fontSize: 12, marginTop: 14 }}>
              © {new Date().getUTCFullYear()} {shopName}
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
