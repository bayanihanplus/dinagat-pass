import { Injectable } from "@nestjs/common";
import { TermsAcceptanceStatus } from "@prisma/client";
import { PrismaService } from "../../prisma";
import { CommercialTermsReadinessContract } from "../contracts";

@Injectable()
export class CommercialTermsService {
  constructor(private readonly prisma: PrismaService) {}

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
      acceptanceWriteFlowImplemented: false,
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
        acceptanceAuditWriteImplemented: false
      },
      contract: {
        lane: "DINAGAT-PASS-COMMERCIAL-TERMS-BACKEND-CONTRACT-FOUNDATION-01",
        readinessEndpoint: "/commercial-terms/readiness",
        nextMutationLane: "DINAGAT-PASS-COMMERCIAL-TERMS-ACCEPTANCE-BACKEND-CONTRACT-01"
      }
    };
  }
}
