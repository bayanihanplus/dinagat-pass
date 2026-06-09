import { Injectable } from "@nestjs/common";
import { AuditActionType } from "@prisma/client";
import { PrismaService } from "../../prisma";

export interface RecordGovernanceAuditInput {
  actorUserId: string;
  actionType: AuditActionType;
  entityType: string;
  entityId?: string;
  reason: string;
  metadata?: Record<string, unknown>;
}

@Injectable()
export class GovernanceAuditService {
  constructor(private readonly prisma: PrismaService) {}

  async recordGovernanceAudit(input: RecordGovernanceAuditInput) {
    if (!input.actorUserId) {
      throw new Error("Governance audit actorUserId is required.");
    }

    if (!input.reason || input.reason.trim().length < 8) {
      throw new Error("Governance audit reason is required.");
    }

    const auditEvent = await this.prisma.auditEvent.create({
      data: {
        actorUserId: input.actorUserId,
        actionType: input.actionType,
        entityType: input.entityType,
        entityId: input.entityId ?? null,
        reason: input.reason.trim(),
        metadata: {
          lane: "DINAGAT-PASS-API-GOVERNANCE-AUDIT-GUARDRAILS-01",
          backendOwned: true,
          frontendOwnsAuthority: false,
          governanceGuardrail: true,
          ...(input.metadata ?? {})
        }
      }
    });

    return {
      auditEventId: auditEvent.id,
      actionType: auditEvent.actionType,
      entityType: auditEvent.entityType,
      entityId: auditEvent.entityId,
      reasonRecorded: true,
      backendOwned: true,
      frontendOwnsAuthority: false
    };
  }

  async getDoctrineSafeCounts() {
    return {
      users: await this.prisma.user.count(),
      credentials: await this.prisma.authCredential.count(),
      sessions: await this.prisma.authSession.count(),
      auditEvents: await this.prisma.auditEvent.count(),
      operators: await this.prisma.operator.count(),
      bookings: await this.prisma.booking.count(),
      scanEvents: await this.prisma.scanEvent.count(),
      visitStamps: await this.prisma.visitStamp.count(),
      marketplaceExposures: await this.prisma.marketplaceExposure.count()
    };
  }
}
