import { apiRequest } from "./client";
import type { WorkflowProfileRecord, IdentityProfileRecipes } from "../types/api";

function base(workflowId: string) {
  return `/customer/workflows/${workflowId}/profiles`;
}

export const listProfiles = (token: string, workflowId: string) =>
  apiRequest<{ data: WorkflowProfileRecord[] }>(base(workflowId), { token });

export const createProfile = (
  token: string,
  workflowId: string,
  payload: { name: string; recipes: IdentityProfileRecipes }
) =>
  apiRequest<{ data: WorkflowProfileRecord }>(base(workflowId), {
    method: "POST",
    token,
    body: payload,
  });

export const getProfile = (token: string, workflowId: string, profileId: string) =>
  apiRequest<{ data: WorkflowProfileRecord }>(`${base(workflowId)}/${profileId}`, { token });

export const updateProfile = (
  token: string,
  workflowId: string,
  profileId: string,
  payload: { name: string; recipes: IdentityProfileRecipes }
) =>
  apiRequest<{ data: WorkflowProfileRecord }>(`${base(workflowId)}/${profileId}`, {
    method: "PATCH",
    token,
    body: payload,
  });

export const deleteProfile = (token: string, workflowId: string, profileId: string) =>
  apiRequest<void>(`${base(workflowId)}/${profileId}`, {
    method: "DELETE",
    token,
  });
