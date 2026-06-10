import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException
} from "@nestjs/common";
import { AuditActionType, Prisma, TermsAcceptanceStatus } from "@prisma/client";
import { GovernanceAuditService } from "../../governance";
import { PrismaService } from "../../prisma";
import {
  CommercialTermsAcceptanceContract,
  CommercialTermsReadinessContract
} from "../contracts";

export interface AcceptCommercialTermsInput {
  commercialTermsId: string;
  operatorRegistryId: string;
  acceptedByUserId: string;
  reason: string;
  metadata: Record<string, unknown>;
  sourceIp: string | null;
  userAgent: string | null;
}

@Injectable()
export class CommercialTermsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly governanceAuditService: GovernanceAuditService
  ) {}

  async getReadiness(): Promise<CommercialTermsReadinessContract> {
    const [
      commercialTerms,
      activeCommercialTerms,
      draftCommercialTerms,
      pendingReviewCommercialTerms,
      revokedCommercialTerms,
      supersededCommercialTerms,
      operatorTermsAcceptances,
      activeOperatorTermsAcceptances,
      revokedOperatorTermsAcceptances,
      supersededOperatorTermsAcceptances,
      auditEvents
    ] = await Promise.all([
      this.prisma.commercialTerms.count(),
      this.prisma.commercialTerms.count({
        where: {
          status: TermsAcceptanceStatus.ACTIVE
        }
      }),
      this.prisma.commercialTerms.count({
        where: {
          status: TermsAcceptanceStatus.DRAFT
        }
      }),
      this.prisma.commercialTerms.count({
        where: {
          status: TermsAcceptanceStatus.PENDING_REVIEW
        }
      }),
      this.prisma.commercialTerms.count({
        where: {
          status: TermsAcceptanceStatus.REVOKED
        }
      }),
      this.prisma.commercialTerms.count({
        where: {
          status: TermsAcceptanceStatus.SUPERSEDED
        }
      }),
      this.prisma.operatorTermsAcceptance.count(),
      this.prisma.operatorTermsAcceptance.count({
        where: {
          status: TermsAcceptanceStatus.ACTIVE
        }
      }),
      this.prisma.operatorTermsAcceptance.count({
        where: {
          status: TermsAcceptanceStatus.REVOKED
        }
      }),
      this.prisma.operatorTermsAcceptance.count({
        where: {
          status: TermsAcceptanceStatus.SUPERSEDED
        }
      }),
      this.prisma.auditEvent.count()
    ]);

    return {
      serviceReady: true,
      backendOwned: true,
      frontendOwnsTermsAcceptance: false,
      schemaFoundationCommitted: true,
      acceptanceWriteFlowImplemented: true,
      publicSignupCreated: false,
      jwtIssuedByController: false,
      migrationRequiredForThisCheck: false,
      commercialTerms: {
        total: commercialTerms,
        active: activeCommercialTerms,
        draft: draftCommercialTerms,
        pendingReview: pendingReviewCommercialTerms,
        revoked: revokedCommercialTerms,
        superseded: supersededCommercialTerms
      },
      operatorTermsAcceptances: {
        total: operatorTermsAcceptances,
        active: activeOperatorTermsAcceptances,
        revoked: revokedOperatorTermsAcceptances,
        superseded: supersededOperatorTermsAcceptances
      },
      audit: {
        auditEvents,
        auditModelAvailable: true,
        acceptanceAuditWriteImplemented: true
      },
      contract: {
        lane: "DINAGAT-PASS-COMMERCIAL-TERMS-BACKEND-CONTRACT-FOUNDATION-01",
        readinessEndpoint: "/commercial-terms/readiness",
        acceptanceEndpoint: "/commercial-terms/acceptance",
        nextMutationLane: "DINAGAT-PASS-COMMERCIAL-TERMS-ACCEPTANCE-BACKEND-CONTRACT-01"
      }
    };
  }

  async acceptCommercialTerms(input: AcceptCommercialTermsInput): Promise<CommercialTermsAcceptanceContract> {
    const acceptedByUserId = this.requireText(input.acceptedByUserId, "Authenticated backend user is required.");
    const commercialTermsId = this.requireText(input.commercialTermsId, "commercialTermsId is required.");
    const operatorRegistryId = this.requireText(input.operatorRegistryId, "operatorRegistryId is required.");
    const reason = this.normalizeReason(input.reason);

    const commercialTerms = await this.prisma.commercialTerms.findUnique({
      where: {
        id: commercialTermsId
      }
    });

    if (!commercialTerms) {
      throw new NotFoundException("Commercial terms record was not found.");
    }

    if (commercialTerms.status !== TermsAcceptanceStatus.ACTIVE) {
      throw new BadRequestException("Commercial terms must be ACTIVE before acceptance.");
    }

    const operatorRegistry = await this.prisma.localOperatorRegistryRecord.findUnique({
      where: {
        id: operatorRegistryId
      }
    });

    if (!operatorRegistry) {
      throw new NotFoundException("Local operator registry record was not found.");
    }

    const requestMetadata = this.toInputJsonObject(input.metadata);

    const snapshot: Prisma.InputJsonObject = {
      capturedAt: new Date().toISOString(),
      backendOwned: true,
      frontendOwnsTermsAcceptance: false,
      acceptedByUserId,
      commercialTerms: {
        id: commercialTerms.id,
        type: commercialTerms.type,
        version: commercialTerms.version,
        title: commercialTerms.title,
        summary: commercialTerms.summary,
        body: commercialTerms.body,
        status: commercialTerms.status,
        effectiveAt: commercialTerms.effectiveAt?.toISOString() ?? null,
        retiredAt: commercialTerms.retiredAt?.toISOString() ?? null
      },
      operatorRegistry: {
        id: operatorRegistry.id,
        registryCode: operatorRegistry.registryCode,
        displayName: operatorRegistry.displayName,
        providerType: operatorRegistry.providerType,
        verificationStatus: operatorRegistry.verificationStatus,
        accreditationStatus: operatorRegistry.accreditationStatus,
        commercialReadinessStatus: operatorRegistry.commercialReadinessStatus,
        exposureStatus: operatorRegistry.exposureStatus
      },
      requestMetadata
    };

    const existingAcceptance = await this.prisma.operatorTermsAcceptance.findUnique({
      where: {
        commercialTermsId_operatorRegistryId: {
          commercialTermsId,
          operatorRegistryId
        }
      }
    });

    if (existingAcceptance?.status === TermsAcceptanceStatus.ACTIVE) {
      return {
        accepted: true,
        backendOwned: true,
        frontendOwnsTermsAcceptance: false,
        acceptedByUserId,
        operatorRegistryId,
        commercialTermsId,
        acceptanceId: existingAcceptance.id,
        status: existingAcceptance.status,
        duplicateHandled: true,
        auditEventId: null,
        snapshotStored: true,
        contract: {
          lane: "DINAGAT-PASS-COMMERCIAL-TERMS-ACCEPTANCE-BACKEND-CONTRACT-01",
          acceptanceEndpoint: "/commercial-terms/acceptance",
          readinessEndpoint: "/commercial-terms/readiness"
        }
      };
    }

    const acceptance = existingAcceptance
      ? await this.prisma.operatorTermsAcceptance.update({
          where: {
            id: existingAcceptance.id
          },
          data: {
            acceptedByUserId,
            status: TermsAcceptanceStatus.ACTIVE,
            acceptedAt: new Date(),
            revokedAt: null,
            acceptanceSnapshotJson: snapshot,
            sourceIp: input.sourceIp,
            userAgent: input.userAgent
          }
        })
      : await this.prisma.operatorTermsAcceptance.create({
          data: {
            commercialTermsId,
            operatorRegistryId,
            acceptedByUserId,
            status: TermsAcceptanceStatus.ACTIVE,
            acceptanceSnapshotJson: snapshot,
            sourceIp: input.sourceIp,
            userAgent: input.userAgent
          }
        });

    const audit = await this.governanceAuditService.recordGovernanceAudit({
      actorUserId: acceptedByUserId,
      actionType: AuditActionType.UPDATE,
      entityType: "OperatorTermsAcceptance",
      entityId: acceptance.id,
      reason,
      metadata: {
        lane: "DINAGAT-PASS-COMMERCIAL-TERMS-ACCEPTANCE-BACKEND-CONTRACT-01",
        backendOwned: true,
        frontendOwnsTermsAcceptance: false,
        commercialTermsId,
        operatorRegistryId,
        duplicateHandled: false,
        sourceIp: input.sourceIp,
        userAgent: input.userAgent,
        requestMetadata
      }
    });

    return {
      accepted: true,
      backendOwned: true,
      frontendOwnsTermsAcceptance: false,
      acceptedByUserId,
      operatorRegistryId,
      commercialTermsId,
      acceptanceId: acceptance.id,
      status: acceptance.status,
      duplicateHandled: false,
      auditEventId: audit.auditEventId,
      snapshotStored: true,
      contract: {
        lane: "DINAGAT-PASS-COMMERCIAL-TERMS-ACCEPTANCE-BACKEND-CONTRACT-01",
        acceptanceEndpoint: "/commercial-terms/acceptance",
        readinessEndpoint: "/commercial-terms/readiness"
      }
    };
  }

  private requireText(value: string, message: string): string {
    const normalized = value.trim();

    if (!normalized) {
      if (message.includes("Authenticated")) {
        throw new UnauthorizedException(message);
      }

      throw new BadRequestException(message);
    }

    return normalized;
  }

  private normalizeReason(reason: string): string {
    const normalized = reason.trim();

    if (!normalized) {
      return "Commercial terms acceptance recorded by backend contract.";
    }

    if (normalized.length < 8) {
      throw new BadRequestException("Acceptance reason must be at least 8 characters.");
    }

    return normalized;
  }

  private toInputJsonObject(value: Record<string, unknown>): Prisma.InputJsonObject {
    return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonObject;
  }
}
