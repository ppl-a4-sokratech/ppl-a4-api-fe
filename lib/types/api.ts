export type AdminLoginInput = {
  username: string;
  password: string;
};

export type AdminSession = {
  adminId: string;
  accessToken: string;
  expiresAt: string;
};

export type CustomerLoginInput = {
  username: string;
  password: string;
};

export type CustomerSetupInput = {
  username: string;
  password: string;
};

export type CustomerSession = {
  customerId: string;
  username: string;
  accessToken: string;
  expiresAt: string;
};

export type CustomerRecord = {
  customerId: string;
  username: string;
  createdAt: string;
  updatedAt: string;
};

export type WorkflowSummary = {
  id: string;
  customerId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  profilesCount: number;
};

export type IdentityProfileRecipes = {
  behavioral: {
    enabled: boolean;
    touch: boolean;
    drag: boolean;
    scroll: boolean;
    lifecycle: boolean;
    input: boolean;
    sensor: boolean;
  };
  fingerprint: {
    enabled: boolean;
    audio: boolean;
    canvas: boolean;
    graphics: boolean;
    fonts: boolean;
    device: boolean;
    screen: boolean;
  };
  detection: {
    enabled: boolean;
    emulator: boolean;
    webDriver: boolean;
  };
};

export type WorkflowProfileRecord = {
  id: string;
  workflowId: string;
  name: string;
  recipes: IdentityProfileRecipes;
  createdAt: string;
  updatedAt: string;
};

export type CustomerSummary = {
  customer: CustomerRecord;
  workflows: WorkflowSummary[];
  profiles: WorkflowProfileRecord[];
  counts: {
    workflows: number;
    profiles: number;
  };
};

export type WorkflowRecord = {
  id: string;
  customerId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  profilesCount?: number;
  profiles?: WorkflowProfileRecord[];
};

export type ApiErrorBody = {
  error?: string;
  success?: false;
  code?: string;
};

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly body: ApiErrorBody | null,
    message: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}
