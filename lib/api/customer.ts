import { apiRequest } from "./client";
import type {
  CustomerLoginInput,
  CustomerSession,
  CustomerSummary,
} from "../types/api";

export const customerLogin = (input: CustomerLoginInput) =>
  apiRequest<CustomerSession>("/customer/login", {
    method: "POST",
    body: input,
  });

export const getCustomerSummary = (token: string) =>
  apiRequest<{ data: CustomerSummary }>("/customer/summary", {
    token,
  });
