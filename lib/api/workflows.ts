import { apiRequest } from "./client";
import type { WorkflowRecord } from "../types/api";

const base = "/customer/workflows";

export const listWorkflows = (token: string) =>
  apiRequest<{ data: WorkflowRecord[] }>(base, { token });

export const createWorkflow = (token: string, name: string) =>
  apiRequest<{ data: WorkflowRecord }>(base, {
    method: "POST",
    token,
    body: { name },
  });

export const getWorkflow = (token: string, workflowId: string) =>
  apiRequest<{ data: WorkflowRecord }>(`${base}/${workflowId}`, { token });

export const updateWorkflow = (token: string, workflowId: string, name: string) =>
  apiRequest<{ data: WorkflowRecord }>(`${base}/${workflowId}`, {
    method: "PATCH",
    token,
    body: { name },
  });

export const deleteWorkflow = (token: string, workflowId: string) =>
  apiRequest<void>(`${base}/${workflowId}`, {
    method: "DELETE",
    token,
  });
