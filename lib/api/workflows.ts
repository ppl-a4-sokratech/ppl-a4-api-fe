import { apiRequest } from "./client";
import type { WorkflowRecord } from "../types/api";

function base(customerId: string) {
  return `/admin/customers/${customerId}/workflows`;
}

export const listWorkflows = (token: string, customerId: string) =>
  apiRequest<{ data: WorkflowRecord[] }>(base(customerId), { token });

export const createWorkflow = (token: string, customerId: string, name: string) =>
  apiRequest<{ data: WorkflowRecord }>(base(customerId), {
    method: "POST",
    token,
    body: { name, status: "active", type: "fraud_prevention" },
  });

export const getWorkflow = (token: string, customerId: string, workflowId: string) =>
  apiRequest<{ data: WorkflowRecord }>(`${base(customerId)}/${workflowId}`, { token });

export const updateWorkflow = (
  token: string,
  customerId: string,
  workflowId: string,
  name: string
) =>
  apiRequest<{ data: WorkflowRecord }>(`${base(customerId)}/${workflowId}`, {
    method: "PATCH",
    token,
    body: { name },
  });

export const deleteWorkflow = (token: string, customerId: string, workflowId: string) =>
  apiRequest<void>(`${base(customerId)}/${workflowId}`, {
    method: "DELETE",
    token,
  });
