import { apiRequest } from "./client";
import type {
  AdminLoginInput,
  AdminSession,
  CustomerRecord,
  CustomerSetupInput,
} from "../types/api";

export const adminLogin = (input: AdminLoginInput) =>
  apiRequest<AdminSession>("/admin/login", {
    method: "POST",
    body: input,
  });

export const setupCustomer = (token: string, input: CustomerSetupInput) =>
  apiRequest<CustomerRecord>("/customer/setup", {
    method: "POST",
    token,
    body: input,
  });
