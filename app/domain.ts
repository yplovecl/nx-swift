export const DEFAULT_SENDING_DOMAIN = "nxlab.app";
export const DEFAULT_FROM_EMAIL = `nx-swift@${DEFAULT_SENDING_DOMAIN}`;

export type StoredRecord = {
  record: string;
  name: string;
  type: string;
  value: string;
  ttl: string;
  status: string;
  priority?: number;
};

export type ShopDomainView = {
  name: string;
  status: string;
  region: string;
  records: StoredRecord[];
};
