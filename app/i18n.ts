import { createCookie } from "@remix-run/node";

const copy = {
  en: {
    navHome: "Home",
    navSubscribers: "Subscribers",
    navSettings: "Sender",
    navNotify: "Send notification",
    homeTitle: "NX Swift",
    homeCount: "This shop has {count} subscribers.",
    homeSender: "Mail is sent as {from}.",
    homeSenderNoFrom:
      "{domain} is not ready to send. Verify its DNS and save a from address under Sender.",
    homeStepBlock:
      "In the theme editor, add the NX Swift app block to a page.",
    homeStepSender:
      "To use your own sending domain, add it, verify the DNS records, and save a from address.",
    homeStepNotify:
      "Choose a product under Send notification to email your subscribers.",
    homeSettings: "Sender settings",
    homeSubscribers: "View subscribers",
    homeNotify: "Send notification",
    homePrivacy: "Privacy policy",
    homeQuotaTitle: "Email quota",
    homeQuotaTotal: "Email Quota",
    homeQuotaRemaining: "Remaining Quota",
    homeQuotaUsed: "Total Emails Sent",
    homeQuotaSubscribers: "Subscribed Customers",
    homePacksTitle: "Buy emails",
    homePackLabel: "{credits} emails · {price}",
    homeBuy: "Buy",
    homePurchaseApplied: "Added {credits} emails.",
    homePurchasePending: "Shopify is still confirming this charge. Refresh this page in a moment.",
    homePurchaseDeclined: "The purchase was not completed.",
    homePurchaseFailed: "Could not start the purchase.",
    homeNoPacks: "No email packs are available.",
    settingsTitle: "Sender",
    settingsSubtitle: "Applies only to {shop}. Other shops save their own sender.",
    settingsName: "Sender name",
    settingsNameHelp: "Name recipients see, such as the shop name. Optional.",
    settingsEmail: "From email",
    settingsEmailHelp: "Must use {domain}. Example: notify@{domain}.",
    settingsSave: "Save",
    settingsNameTooLong: "Sender name must be 80 characters or fewer",
    settingsEmailInvalid: "Enter a valid from email",
    settingsEmailDomain: "The from email must use {domain}.",
    settingsSaved: "Saved. Mail is sent as {from}.",
    settingsDomainLabel: "Sending domain",
    settingsDomainHelp:
      "Each shop verifies its own domain. After it is added, it cannot be edited. Delete it to add a different one.",
    settingsDomainPlaceholder: "example.com",
    settingsDomainAdd: "Add domain",
    settingsDomainInvalid: "Enter a domain such as example.com, without https://.",
    settingsDomainTaken: "This domain is reserved or already in use.",
    settingsDomainExists: "This shop already has a domain. Delete it before adding another.",
    settingsDomainAdded: "Domain added. Create the DNS records below, then click Verify.",
    settingsDomainVerify: "Verify",
    settingsDomainVerified: "{domain} is verified. You can save the from address.",
    settingsDomainPending:
      "Verification started for {domain}. DNS can take a few minutes. Open this page again to refresh the status.",
    settingsDomainFailed: "Verification failed for {domain}. Check the DNS records and try again.",
    settingsDomainDelete: "Delete domain",
    settingsDomainConfirm: "Delete {domain}? The from address is cleared. You can add a domain again afterwards.",
    settingsDomainConfirmButton: "Delete this domain",
    settingsDomainCancel: "Cancel",
    settingsDomainDeleted: "Domain deleted. You can add another one.",
    settingsDomainMissing: "This shop has no sending domain.",
    settingsDomainLocked: "This domain cannot be changed. Delete it to add a different one.",
    settingsDnsTitle: "DNS records",
    settingsDnsName: "Host",
    settingsDnsValue: "Value",
    settingsDnsPriority: "Priority",
    settingsDnsTtl: "TTL",
    settingsCopy: "Copy",
    settingsCopied: "Copied",
    settingsRegion: "Region",
    settingsRegionHelp: "The region is fixed until you delete the domain.",
    settingsSenderTitle: "From address",
    settingsSenderLocked: "Verify the domain before saving a from address.",
    settingsDefaultSender: "Notifications are sent from {from} by default. Add a custom domain to use your own address.",
    settingsNoResend: "RESEND_API_KEY is not configured, so domains cannot be added.",
    domainStatusVerified: "Verified",
    domainStatusPending: "Pending",
    domainStatusFailed: "Failed",
    domainStatusPartial: "Partly verified",
    domainStatusNotStarted: "Not started",
    subscribersTitle: "Subscribers",
    subscribersSubtitle: "{count} subscribers for this shop",
    subscribersEmpty:
      "No subscribers yet. Add the NX Swift block in the theme editor. Emails submitted there appear here.",
    colEmail: "Email",
    colSubscribed: "Subscribed",
    colReceived: "Emails received",
    dataRequestsTitle: "Customer data requests",
    dataRequestsHelp:
      "When a customer asks the shop for their data, the matching subscription is listed here for the merchant. The same summary is emailed to this shop's from address when one is saved.",
    dataRequestsEmpty: "No customer data requests yet.",
    dataRequestFound: "Subscribed {at}",
    dataRequestMissing: "No subscription stored for this email",
    colRequested: "Requested",
    notifyTitle: "Send a new-product email",
    notifySubtitle: "Sends to {count} subscribers of this shop",
    notifyNoKey: "RESEND_API_KEY is not configured, so mail cannot be sent.",
    notifyProductAccessDenied: "Shopify denied access to products. Ask the store owner to check that NX Swift has permission to read products (read_products).",
    notifyDomainPending: "{domain} is not verified yet, so mail cannot be sent.",
    notifyNoSender: "Save a from address on {domain} before sending.",
    notifyFrom: "This shop sends as {from}. Other shops are not used.",
    notifySearch: "Search products",
    notifySearchButton: "Search",
    notifyPick: "Product",
    notifyVariant: "Variant",
    notifyNoVariant: "No variant",
    notifyNone: "No active products",
    notifyPreview:
      "The email includes each product's name, image, and link, in this order.",
    notifyAdd: "Add",
    notifyAdded: "Products in this email",
    notifyAddedEmpty:
      "Add one or more products, up to {count}. Drag them to set their order in the email.",
    notifyRemove: "Remove",
    notifyDrag: "Drag to reorder",
    notifyAlreadyAdded: "This product is already in the list",
    notifyTooMany: "You can add up to {count} products",
    notifySend: "Send",
    notifyHint:
      "Showing up to 50 active products. Search to find others, then add the ones you want. Mail is sent in batches; keep this page open until it finishes.",
    notifyProgress: "Sending… {sent} sent, {failed} failed.",
    notifyDone: "Finished: {sent} sent, {failed} failed.",
    notifySendFailed: "The mail service did not accept this batch.",
    notifySelectProduct: "Add at least one product",
    notifyBadUrl: "Could not build the product link",
    notifyMissingProduct: "Product not found",
    notifyMissingVariant: "Variant not found",
    notifyNoSubscribers: "This shop has no subscribers",
    notifyNoQuota: "This shop has no emails left. Buy more on the home page.",
    notifyQuotaShort: "The remaining quota was used, so the rest of this list was not sent.",
    notifyRemaining: "{remaining} of {total} emails remaining.",
    emailSubject: "New product: {title}",
    emailSubjectMany: "New products from {shop}",
    emailHello: "{shop} added a product you subscribed to:",
    emailHelloMany: "{shop} added products you subscribed to:",
    emailButton: "View product",
    emailUnsubscribe: "Unsubscribe",
    subUnauthorized: "Unauthorized request",
    subBadSignature: "Subscription check failed. Refresh the page and try again.",
    subPostOnly: "POST only",
    subUsePost: "Submit email with POST to subscribe",
    subBadForm: "Could not read the form",
    subBadShop: "Could not identify the shop",
    subBadEmail: "Enter a valid email",
    subSuccess: "Subscribed",
    subAlready: "This email is already subscribed",
    subFailed: "Could not subscribe. Try again.",
    unsubTitle: "Unsubscribed",
    unsubBody: "This email will no longer receive new-product alerts from this shop.",
    unsubInvalidTitle: "Link expired",
    unsubInvalidBody: "This unsubscribe link is invalid. Use the link in the latest email.",
    landingTitle: "NX Swift",
    landingText: "Enter the shop domain to open the app.",
    landingLabel: "Shop domain",
    landingExample: "example.myshopify.com",
    landingSubmit: "Log in",
    landingLanguage: "Language",
    loginMissingShop: "Please enter your shop domain to log in",
    loginInvalidShop: "Please enter a valid shop domain to log in",
    privacyTitle: "Privacy policy",
    privacyIntro:
      "NX Swift stores only what a shop needs to send new-product emails that a person asked for.",
    privacyDataTitle: "Data we store",
    privacyDataShop: "The shop domain, such as example.myshopify.com.",
    privacyDataEmail:
      "The email address a visitor submits in the storefront form, and the time they subscribed.",
    privacyDataSender:
      "The sending domain, sender name, and sender email a merchant saves for that shop.",
    privacyDataRequest:
      "A customer data request from Shopify: the email, whether a subscription exists, and when the request arrived.",
    privacyDataDelivery:
      "Each email that was sent, and which subscriber received it, so the shop can see how many messages a person got.",
    privacyNoSale:
      "We do not sell this data. Each shop sends mail through Resend from an address on a domain that shop verified. Shops do not connect a separate Resend account.",
    privacyKeepTitle: "How long we keep it",
    privacyKeep:
      "A subscription is deleted when the person uses the unsubscribe link in an email, when Shopify sends a customer redact webhook for that email, or when the shop uninstalls the app or Shopify sends a shop redact webhook. Delivery records for that email are deleted with the customer redact. The sending domain, sender settings, quota, and stored data requests for that shop are deleted with the shop data.",
    privacyRequestsTitle: "Requests",
    privacyRequests:
      "Shoppers unsubscribe from the link in the email, or ask the store to remove them. Merchants see customer data requests inside the app under Subscribers. If a from address is saved, the same summary is emailed there.",
  },
  zh: {
    navHome: "首页",
    navSubscribers: "订阅者",
    navSettings: "发件设置",
    navNotify: "发送通知",
    homeTitle: "玄鸟",
    homeCount: "当前已有 {count} 位顾客订阅新品通知。",
    homeSender: "邮件以 {from} 发出。",
    homeSenderNoFrom: "{domain} 还不能发信。请在「发件设置」完成 DNS 验证并保存发件邮箱。",
    homeStepBlock: "在线商店 → 自定义 → 应用区块，把「玄鸟」拖到页面上。",
    homeStepSender: "如需使用自定义发件地址，请添加域名，验证 DNS 记录并保存发件邮箱。",
    homeStepNotify: "在「发送通知」选择商品，即可向订阅者发送邮件。",
    homeSettings: "发件设置",
    homeSubscribers: "查看订阅者",
    homeNotify: "发送通知",
    homePrivacy: "隐私政策",
    homeQuotaTitle: "邮件额度",
    homeQuotaTotal: "邮件额度",
    homeQuotaRemaining: "剩余额度",
    homeQuotaUsed: "累计发送邮件",
    homeQuotaSubscribers: "已订阅顾客",
    homePacksTitle: "购买邮件额度",
    homePackLabel: "{credits} 封 · {price}",
    homeBuy: "购买",
    homePurchaseApplied: "已增加 {credits} 封。",
    homePurchasePending: "Shopify 仍在确认这笔费用。请稍后再刷新本页。",
    homePurchaseDeclined: "购买没有完成。",
    homePurchaseFailed: "无法发起购买。",
    homeNoPacks: "当前没有可购买的邮件包。",
    settingsTitle: "发件设置",
    settingsSubtitle: "只对 {shop} 生效，其他店铺需要各自填写",
    settingsName: "发件人名称",
    settingsNameHelp: "收件人看到的名称，例如店铺名。可以留空。",
    settingsEmail: "发件邮箱",
    settingsEmailHelp: "必须使用 {domain}。例如 notify@{domain}。",
    settingsSave: "保存",
    settingsNameTooLong: "发件人名称不能超过 80 个字符",
    settingsEmailInvalid: "请填写有效的发件邮箱",
    settingsEmailDomain: "发件邮箱必须使用 {domain}。",
    settingsSaved: "已保存。邮件以 {from} 发出。",
    settingsDomainLabel: "发件域名",
    settingsDomainHelp: "每个店铺单独验证自己的域名。添加后不能修改，只能删除后重新添加。",
    settingsDomainPlaceholder: "example.com",
    settingsDomainAdd: "添加域名",
    settingsDomainInvalid: "请填写域名，例如 example.com，不要带 https://。",
    settingsDomainTaken: "此域名已保留或正在使用。",
    settingsDomainExists: "本店已经有域名。请先删除，再添加另一个。",
    settingsDomainAdded: "域名已添加。请在 DNS 服务商处添加下面的记录，然后点击验证。",
    settingsDomainVerify: "验证",
    settingsDomainVerified: "{domain} 已验证。现在可以保存发件邮箱。",
    settingsDomainPending: "已开始验证 {domain}。DNS 可能需要几分钟。重新打开本页可刷新状态。",
    settingsDomainFailed: "{domain} 验证失败。请检查 DNS 记录后再试。",
    settingsDomainDelete: "删除域名",
    settingsDomainConfirm: "删除 {domain}？发件邮箱会一并清除。之后可以重新添加域名。",
    settingsDomainConfirmButton: "确认删除",
    settingsDomainCancel: "取消",
    settingsDomainDeleted: "域名已删除。可以重新添加。",
    settingsDomainMissing: "本店还没有发件域名。",
    settingsDomainLocked: "域名不能修改。要更换，请先删除再添加。",
    settingsDnsTitle: "DNS 记录",
    settingsDnsName: "主机记录",
    settingsDnsValue: "记录值",
    settingsDnsPriority: "优先级",
    settingsDnsTtl: "TTL",
    settingsCopy: "复制",
    settingsCopied: "已复制",
    settingsRegion: "区域",
    settingsRegionHelp: "区域在删除域名前不能更改。",
    settingsSenderTitle: "发件地址",
    settingsSenderLocked: "请先验证域名，再保存发件邮箱。",
    settingsDefaultSender: "通知默认从 {from} 发出。添加自定义域名后，可以使用自己的发件地址。",
    settingsNoResend: "服务器尚未配置 RESEND_API_KEY，暂时不能添加域名。",
    domainStatusVerified: "已验证",
    domainStatusPending: "验证中",
    domainStatusFailed: "验证失败",
    domainStatusPartial: "部分验证",
    domainStatusNotStarted: "未开始",
    subscribersTitle: "订阅者",
    subscribersSubtitle: "当前店铺共 {count} 位订阅者",
    subscribersEmpty:
      "还没有订阅者。在主题编辑器中添加「玄鸟」区块后，顾客提交的邮箱会显示在这里。",
    colEmail: "邮箱",
    colSubscribed: "订阅时间",
    colReceived: "已收邮件",
    dataRequestsTitle: "顾客数据请求",
    dataRequestsHelp:
      "顾客向店铺要求导出个人数据时，匹配到的订阅会列在这里。若已保存发件邮箱，同一份摘要也会发到该邮箱。",
    dataRequestsEmpty: "还没有顾客数据请求。",
    dataRequestFound: "已订阅，时间 {at}",
    dataRequestMissing: "没有保存这个邮箱的订阅",
    colRequested: "请求时间",
    notifyTitle: "发送新品通知",
    notifySubtitle: "将发送给当前店铺的 {count} 位订阅者",
    notifyNoKey: "服务器尚未配置 RESEND_API_KEY，暂时不能发信。",
    notifyProductAccessDenied: "Shopify 拒绝了商品读取请求。请让店主确认 NX Swift 已获得读取商品权限（read_products）。",
    notifyDomainPending: "{domain} 尚未验证，暂时不能发信。",
    notifyNoSender: "请先在 {domain} 上保存发件邮箱，然后再发送。",
    notifyFrom: "本店将以 {from} 发信。不会使用其他店铺的邮箱。",
    notifySearch: "搜索商品",
    notifySearchButton: "搜索",
    notifyPick: "选择商品",
    notifyVariant: "规格",
    notifyNoVariant: "不选择规格",
    notifyNone: "没有在售商品",
    notifyPreview: "邮件会按此顺序包含每个商品的名称、图片和链接。",
    notifyAdd: "添加",
    notifyAdded: "本次邮件中的商品",
    notifyAddedEmpty: "添加一个或多个商品，最多 {count} 个。拖拽可调整它们在邮件里的顺序。",
    notifyRemove: "移除",
    notifyDrag: "拖拽排序",
    notifyAlreadyAdded: "这个商品已经在列表中",
    notifyTooMany: "最多添加 {count} 个商品",
    notifySend: "发送通知",
    notifyHint:
      "列表最多显示 50 个在售商品，可用搜索查找其他商品，再添加到本次通知。邮件分批发送，请保持页面打开直到结束。",
    notifyProgress: "正在发送… 成功 {sent} 封，失败 {failed} 封。",
    notifyDone: "发送完成：成功 {sent} 封，失败 {failed} 封。",
    notifySendFailed: "邮件服务没有接受这批邮件。",
    notifySelectProduct: "请至少添加一个商品",
    notifyBadUrl: "无法生成商品链接",
    notifyMissingProduct: "找不到该商品",
    notifyMissingVariant: "找不到该规格",
    notifyNoSubscribers: "当前店铺还没有订阅者",
    notifyNoQuota: "本店的邮件额度已用完。请到首页购买。",
    notifyQuotaShort: "剩余额度已用完，名单中其余的人这次没有发送。",
    notifyRemaining: "额度剩余 {remaining} / {total}。",
    emailSubject: "新品上架：{title}",
    emailSubjectMany: "新品上架：{shop}",
    emailHello: "您好！您订阅的店铺 {shop} 上新了：",
    emailHelloMany: "{shop} 上新了这些商品：",
    emailButton: "查看商品详情",
    emailUnsubscribe: "退订",
    subUnauthorized: "未授权的请求",
    subBadSignature: "订阅校验失败，请刷新页面后重试",
    subPostOnly: "仅支持 POST",
    subUsePost: "请使用 POST 提交 email 完成订阅",
    subBadForm: "无法读取表单",
    subBadShop: "无法识别店铺",
    subBadEmail: "邮箱格式不正确",
    subSuccess: "订阅成功",
    subAlready: "该邮箱已订阅，无需重复提交",
    subFailed: "订阅失败，请稍后重试",
    unsubTitle: "已退订",
    unsubBody: "这个邮箱不会再收到该店铺的新品通知。",
    unsubInvalidTitle: "链接无效",
    unsubInvalidBody: "退订链接无效。请使用最近一封邮件里的退订链接。",
    landingTitle: "玄鸟",
    landingText: "输入店铺域名以打开应用。",
    landingLabel: "店铺域名",
    landingExample: "example.myshopify.com",
    landingSubmit: "登录",
    landingLanguage: "语言",
    loginMissingShop: "请输入店铺域名后再登录",
    loginInvalidShop: "请输入有效的店铺域名后再登录",
    privacyTitle: "隐私政策",
    privacyIntro: "玄鸟只保存店铺发送顾客主动订阅的新品邮件所需要的信息。",
    privacyDataTitle: "我们保存的数据",
    privacyDataShop: "店铺域名，例如 example.myshopify.com。",
    privacyDataEmail: "访客在店面表单提交的邮箱，以及订阅时间。",
    privacyDataSender: "商家为本店保存的发件域名、发件人名称和发件邮箱。",
    privacyDataRequest:
      "Shopify 发来的顾客数据请求：邮箱、是否存在订阅，以及请求到达的时间。",
    privacyDataDelivery: "每一封已发出的邮件，以及收到它的订阅者，便于查看每人一共收到多少封。",
    privacyNoSale:
      "我们不会出售这些数据。每个店铺通过 Resend，从该店铺已验证域名上的地址发信。店铺不能接入单独的 Resend 账号。",
    privacyKeepTitle: "保存期限",
    privacyKeep:
      "顾客使用邮件里的退订链接、Shopify 针对该邮箱发送顾客删除通知、店铺卸载应用，或 Shopify 发送店铺删除通知时，对应的订阅会被删除。顾客删除通知也会删掉该邮箱的发送记录。该店铺的发件域名、发件设置、额度和已保存的数据请求会随店铺数据一起删除。",
    privacyRequestsTitle: "请求",
    privacyRequests:
      "顾客可以通过邮件中的退订链接退订，也可以请店铺删除自己的记录。商家在应用的「订阅者」页面查看顾客数据请求。如果已保存发件邮箱，同一份摘要也会发到该邮箱。",
  },
} as const;

export type Locale = keyof typeof copy;
export type CopyKey = keyof typeof copy.en;

export function resolveLocale(value: string | null | undefined): Locale {
  return value?.toLowerCase().startsWith("zh") ? "zh" : "en";
}

export const localeCookie = createCookie("npn_locale", {
  path: "/",
  sameSite: "none",
  secure: true,
  httpOnly: true,
  maxAge: 60 * 60 * 24 * 365,
});

export async function localeFromRequest(request: Request): Promise<Locale> {
  const query = new URL(request.url).searchParams.get("locale");
  if (query) return resolveLocale(query);
  const saved = await localeCookie.parse(request.headers.get("Cookie"));
  if (typeof saved === "string" && saved.length > 0) return resolveLocale(saved);
  return "en";
}

/** Public pages also follow the browser language when no locale was chosen yet. */
export async function localeForLanding(request: Request): Promise<Locale> {
  const query = new URL(request.url).searchParams.get("locale");
  if (query) return resolveLocale(query);
  const saved = await localeCookie.parse(request.headers.get("Cookie"));
  if (typeof saved === "string" && saved.length > 0) return resolveLocale(saved);

  const header = request.headers.get("Accept-Language") ?? "";
  const tags = header.split(",").map((part) => part.trim().split(";")[0] ?? "");
  for (const tag of tags) {
    const language = tag.toLowerCase();
    if (language.startsWith("zh")) return "zh";
    if (language.startsWith("en")) return "en";
  }
  return "en";
}

export function localeCookieHeader(request: Request, locale: Locale) {
  return localeCookie.serialize(locale, {
    secure: new URL(request.url).protocol === "https:",
  });
}

export function translate(locale: Locale) {
  const dictionary = copy[locale];
  return (key: CopyKey, vars?: Record<string, string | number>) => {
    let text: string = dictionary[key];
    if (!vars) return text;
    for (const [name, value] of Object.entries(vars)) {
      text = text.replaceAll(`{${name}}`, String(value));
    }
    return text;
  };
}
