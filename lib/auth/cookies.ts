export const ADMIN_TOKEN_COOKIE = "admin_token";
export const ADMIN_USER_COOKIE = "admin_user";
export const CUSTOMER_TOKEN_COOKIE = "customer_token";
export const CUSTOMER_USER_COOKIE = "customer_user";

const isBrowser = () => typeof document !== "undefined";

export const setCookie = (
  name: string,
  value: string,
  expiresAt: Date,
  path = "/"
) => {
  if (!isBrowser()) return;
  const expires = expiresAt.toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=${path}; SameSite=Lax`;
};

export const getCookie = (name: string): string | null => {
  if (!isBrowser()) return null;
  const match = document.cookie
    .split("; ")
    .find((entry) => entry.startsWith(`${name}=`));
  if (!match) return null;
  return decodeURIComponent(match.slice(name.length + 1));
};

export const deleteCookie = (name: string, path = "/") => {
  if (!isBrowser()) return;
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}; SameSite=Lax`;
};
