export const EMAIL_SUBJECT_LIMIT = 150;
export const EMAIL_BUTTON_LABEL_LIMIT = 60;
export const EMAIL_BUTTON_URL_LIMIT = 2048;

export function normalizeWebUrl(value: string) {
  try {
    const url = new URL(value);
    if (
      (url.protocol !== "https:" && url.protocol !== "http:") ||
      url.username ||
      url.password
    ) {
      return null;
    }
    return url.toString();
  } catch {
    return null;
  }
}
