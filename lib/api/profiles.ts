import { apiRequest } from "./client";
import type { WorkflowProfileRecord, IdentityProfileRecipes } from "../types/api";

function base(customerId: string, workflowId: string) {
  return `/admin/customers/${customerId}/workflows/${workflowId}/profiles`;
}

export const listProfiles = (token: string, customerId: string, workflowId: string) =>
  apiRequest<{ data: WorkflowProfileRecord[] }>(base(customerId, workflowId), { token });

export const createProfile = (
  token: string,
  customerId: string,
  workflowId: string,
  payload: { name: string; recipes: IdentityProfileRecipes }
) =>
  apiRequest<{ data: WorkflowProfileRecord }>(base(customerId, workflowId), {
    method: "POST",
    token,
    body: payload,
  });

export const getProfile = (
  token: string,
  customerId: string,
  workflowId: string,
  profileId: string
) =>
  apiRequest<{ data: WorkflowProfileRecord }>(
    `${base(customerId, workflowId)}/${profileId}`,
    { token }
  );

export const updateProfile = (
  token: string,
  customerId: string,
  workflowId: string,
  profileId: string,
  payload: { name: string; recipes: IdentityProfileRecipes }
) =>
  apiRequest<{ data: WorkflowProfileRecord }>(
    `${base(customerId, workflowId)}/${profileId}`,
    { method: "PATCH", token, body: payload }
  );

export const deleteProfile = (
  token: string,
  customerId: string,
  workflowId: string,
  profileId: string
) =>
  apiRequest<void>(`${base(customerId, workflowId)}/${profileId}`, {
    method: "DELETE",
    token,
  });
