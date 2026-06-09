import { AuditActionType } from "@prisma/client";

export interface GovernanceAuditRequirement {
  actionType: AuditActionType;
  entityType: string;
  reason: string;
  metadata?: Record<string, unknown>;
}

export interface GovernanceAuditRequestBody {
  entityId?: string;
  reason?: string;
  metadata?: Record<string, unknown>;
}
