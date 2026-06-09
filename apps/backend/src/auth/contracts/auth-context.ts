import { UserRole } from "@prisma/client";

export type DinagatCapability =
  | "AUTH_CONTEXT_VERIFY"
  | "AUTH_CAPABILITY_VERIFY"
  | "SUPER_ADMIN_BYPASS";

export interface AuthenticatedUserContext {
  userId: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  sessionId: string;
  capabilityBypass?: boolean;
}

export interface RequestWithAuthContext {
  auth?: AuthenticatedUserContext;
}
