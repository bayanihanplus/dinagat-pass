import { UserRole } from "@prisma/client";

export interface CreateCredentialInput {
  email: string;
  displayName?: string;
  role: UserRole;
  password: string;
  isActive?: boolean;
}

export interface CreateCredentialResult {
  userId: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  credentialCreated: boolean;
  sessionIssued: false;
}