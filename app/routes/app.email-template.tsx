import { useState } from "react";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { useFetcher, useLoaderData } from "@remix-run/react";
import {
  Banner,
  BlockStack,
  Button,
  Card,
  InlineStack,
  Page,
  TextField,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import db from "../db.server";
import {
  EMAIL_BUTTON_LABEL_LIMIT,
  EMAIL_BUTTON_URL_LIMIT,
  EMAIL_SUBJECT_LIMIT,
  normalizeWebUrl,
} from "../email-template";
import { localeFromRequest, translate } from "../i18n";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const [locale, template] = await Promise.all([
    localeFromRequest(request),
    db.shopEmailTemplate.findUnique({ where: { shop: session.shop } }),
  ]);
  return {
    locale,
    subject: template?.subject ?? "",
    buttonLabel: template?.buttonLabel ?? "",
    buttonUrl: template?.buttonUrl ?? "",
  };
};

function readField(form: FormData, name: string) {
  const value = form.get(name);
  return typeof value === "string" ? value.trim() : "";
}

function isSingleLine(value: string, limit: number) {
  return (
    value.length <= limit &&
    Array.from(value).every((character) => {
      const code = character.charCodeAt(0);
      return code >= 32 && code !== 127 && code !== 0x2028 && code !== 0x2029;
    })
  );
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const t = translate(await localeFromRequest(request));
  const form = await request.formData();
  const subject = readField(form, "subject");
  const buttonLabel = readField(form, "buttonLabel");
  const rawUrl = readField(form, "buttonUrl");
  const buttonUrl = rawUrl ? normalizeWebUrl(rawUrl) : "";

  if (!isSingleLine(subject, EMAIL_SUBJECT_LIMIT)) {
    return {
      ok: false,
      message: t("templateSubjectInvalid", { max: EMAIL_SUBJECT_LIMIT }),
    };
  }
  if (!isSingleLine(buttonLabel, EMAIL_BUTTON_LABEL_LIMIT)) {
    return {
      ok: false,
      message: t("templateButtonInvalid", { max: EMAIL_BUTTON_LABEL_LIMIT }),
    };
  }
  if (buttonUrl === null || buttonUrl.length > EMAIL_BUTTON_URL_LIMIT) {
    return { ok: false, message: t("templateUrlInvalid") };
  }

  const values = { subject, buttonLabel, buttonUrl };
  await db.shopEmailTemplate.upsert({
    where: { shop: session.shop },
    create: { shop: session.shop, ...values },
    update: values,
  });
  return { ok: true, message: t("templateSaved") };
};

export default function EmailTemplatePage() {
  const data = useLoaderData<typeof loader>();
  const fetcher = useFetcher<typeof action>();
  const t = translate(data.locale);
  const [subject, setSubject] = useState(data.subject);
  const [buttonLabel, setButtonLabel] = useState(data.buttonLabel);
  const [buttonUrl, setButtonUrl] = useState(data.buttonUrl);
  const saving = fetcher.state !== "idle";

  return (
    <Page
      title={t("templateTitle")}
      subtitle={t("templateSubtitle")}
      narrowWidth
    >
      <TitleBar title={t("templateTitle")} />
      <BlockStack gap="400">
        {fetcher.data && (
          <Banner tone={fetcher.data.ok ? "success" : "critical"}>
            <p>{fetcher.data.message}</p>
          </Banner>
        )}
        <Card>
          <fetcher.Form method="post">
            <BlockStack gap="400">
              <TextField
                label={t("templateSubject")}
                name="subject"
                value={subject}
                onChange={setSubject}
                autoComplete="off"
                maxLength={EMAIL_SUBJECT_LIMIT}
                helpText={t("templateSubjectHelp")}
                disabled={saving}
              />
              <TextField
                label={t("templateButton")}
                name="buttonLabel"
                value={buttonLabel}
                onChange={setButtonLabel}
                autoComplete="off"
                maxLength={EMAIL_BUTTON_LABEL_LIMIT}
                placeholder={t("emailBrowseAll")}
                disabled={saving}
              />
              <TextField
                label={t("templateUrl")}
                name="buttonUrl"
                value={buttonUrl}
                onChange={setButtonUrl}
                autoComplete="off"
                type="url"
                maxLength={EMAIL_BUTTON_URL_LIMIT}
                helpText={t("templateUrlHelp")}
                disabled={saving}
              />
              <InlineStack>
                <Button variant="primary" submit loading={saving}>
                  {t("templateSave")}
                </Button>
              </InlineStack>
            </BlockStack>
          </fetcher.Form>
        </Card>
      </BlockStack>
    </Page>
  );
}
