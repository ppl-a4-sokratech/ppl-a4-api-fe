"use client";

import { useSyncExternalStore } from "react";
import {
  ADMIN_TOKEN_COOKIE,
  ADMIN_USER_COOKIE,
  CUSTOMER_TOKEN_COOKIE,
  CUSTOMER_USER_COOKIE,
  deleteCookie,
  getCookie,
  setCookie,
} from "./cookies";
import type { AdminSession, CustomerSession } from "../types/api";

export type StoredAdmin = {
  adminId: string;
  username: string;
  expiresAt: string;
};

export type StoredCustomer = {
  customerId: string;
  username: string;
  expiresAt: string;
};

const safeParse = <T>(raw: string | null): T | null => {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
};

const isExpired = (expiresAt: string): boolean => {
  const ts = Date.parse(expiresAt);
  if (Number.isNaN(ts)) return true;
  return ts <= Date.now();
};

export const persistAdminSession = (session: AdminSession) => {
  const expires = new Date(session.expiresAt);
  setCookie(ADMIN_TOKEN_COOKIE, session.accessToken, expires);
  setCookie(
    ADMIN_USER_COOKIE,
    JSON.stringify({ adminId: session.adminId, username: session.username, expiresAt: session.expiresAt }),
    expires
  );
};

export const clearAdminSession = () => {
  deleteCookie(ADMIN_TOKEN_COOKIE);
  deleteCookie(ADMIN_USER_COOKIE);
};

export const readAdminSession = (): { token: string; user: StoredAdmin } | null => {
  const token = getCookie(ADMIN_TOKEN_COOKIE);
  const user = safeParse<StoredAdmin>(getCookie(ADMIN_USER_COOKIE));
  if (!token || !user) return null;
  if (isExpired(user.expiresAt)) {
    clearAdminSession();
    return null;
  }
  return { token, user };
};

export const persistCustomerSession = (session: CustomerSession) => {
  const expires = new Date(session.expiresAt);
  setCookie(CUSTOMER_TOKEN_COOKIE, session.accessToken, expires);
  setCookie(
    CUSTOMER_USER_COOKIE,
    JSON.stringify({
      customerId: session.customerId,
      username: session.username,
      expiresAt: session.expiresAt,
    }),
    expires
  );
};

export const clearCustomerSession = () => {
  deleteCookie(CUSTOMER_TOKEN_COOKIE);
  deleteCookie(CUSTOMER_USER_COOKIE);
};

export const readCustomerSession = (): {
  token: string;
  user: StoredCustomer;
} | null => {
  const token = getCookie(CUSTOMER_TOKEN_COOKIE);
  const user = safeParse<StoredCustomer>(getCookie(CUSTOMER_USER_COOKIE));
  if (!token || !user) return null;
  if (isExpired(user.expiresAt)) {
    clearCustomerSession();
    return null;
  }
  return { token, user };
};

const subscribe = () => () => {};

const adminCache: {
  rawToken: string | null;
  rawUser: string | null;
  value: { token: string; user: StoredAdmin } | null;
} = { rawToken: null, rawUser: null, value: null };

const getAdminSnapshot = () => {
  const rawToken = getCookie(ADMIN_TOKEN_COOKIE);
  const rawUser = getCookie(ADMIN_USER_COOKIE);
  if (rawToken === adminCache.rawToken && rawUser === adminCache.rawUser) {
    return adminCache.value;
  }
  adminCache.rawToken = rawToken;
  adminCache.rawUser = rawUser;
  adminCache.value = readAdminSession();
  return adminCache.value;
};

const customerCache: {
  rawToken: string | null;
  rawUser: string | null;
  value: { token: string; user: StoredCustomer } | null;
} = { rawToken: null, rawUser: null, value: null };

const getCustomerSnapshot = () => {
  const rawToken = getCookie(CUSTOMER_TOKEN_COOKIE);
  const rawUser = getCookie(CUSTOMER_USER_COOKIE);
  if (rawToken === customerCache.rawToken && rawUser === customerCache.rawUser) {
    return customerCache.value;
  }
  customerCache.rawToken = rawToken;
  customerCache.rawUser = rawUser;
  customerCache.value = readCustomerSession();
  return customerCache.value;
};

const getServerSessionSnapshot = () => null;

export type AdminSessionState = {
  ready: boolean;
  token?: string;
  user?: StoredAdmin;
};

export type CustomerSessionState = {
  ready: boolean;
  token?: string;
  user?: StoredCustomer;
};

export const useAdminSession = (): AdminSessionState => {
  const session = useSyncExternalStore(
    subscribe,
    getAdminSnapshot,
    getServerSessionSnapshot
  );
  if (typeof document === "undefined") {
    return { ready: false };
  }
  return {
    ready: true,
    token: session?.token,
    user: session?.user,
  };
};

export const useCustomerSession = (): CustomerSessionState => {
  const session = useSyncExternalStore(
    subscribe,
    getCustomerSnapshot,
    getServerSessionSnapshot
  );
  if (typeof document === "undefined") {
    return { ready: false };
  }
  return {
    ready: true,
    token: session?.token,
    user: session?.user,
  };
};
