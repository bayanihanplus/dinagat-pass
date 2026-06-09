import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { AuditActionType } from "@prisma/client";
import { AuthRequiredGuard, CapabilityGuard, RequireCapabilities, RequestWithAuthContext } from "../../auth";
import { GovernanceAuditRequestBody } from "../contracts";
import { RequireGovernanceAudit } from "../decorators";
import { GovernanceAuditGuard } from "../guards";
import { GovernanceAuditService } from "../services";

type RequestWithGovernanceAudit = RequestWithAuthContext & {
  governanceAudit?: {
    auditEventId: string;
    actionType: string;
    entityType: string;
    entityId: string | null;
    reasonRecorded: boolean;
    backendOwned: boolean;
    frontendOwnsAuthority: boolean;
  };
};

@Controller("internal/governance")
export class GovernanceVerificationController {
  constructor(private readonly governanceAuditService: GovernanceAuditService) {}

  @Get("readiness")
  async getGovernanceReadiness() {
    const counts = await this.governanceAuditService.getDoctrineSafeCounts();

    return {
      governanceReady: true,
      backendOwned: true,
      frontendOwnsAuthority: false,
      auditGuardrailReady: true,
      privilegedActionsRequireReason: true,
      productWorkflowsImplemented: false,
      counts
    };
  }

  @Post("audit-guardrail-check")
  @RequireCapabilities("AUTH_CONTEXT_VERIFY")
  @RequireGovernanceAudit({
    actionType: AuditActionType.UPDATE,
    entityType: "GovernanceVerification",
    reason: "Governance audit guardrail verification.",
    metadata: {
      productMutation: false,
      verificationOnly: true
    }
  })
  @UseGuards(AuthRequiredGuard, CapabilityGuard, GovernanceAuditGuard)
  auditGuardrailCheck(@Req() request: RequestWithGovernanceAudit, @Body() _body: GovernanceAuditRequestBody) {
    return {
      authorized: true,
      governanceAuditRequired: true,
      governanceAuditRecorded: Boolean(request.governanceAudit?.auditEventId),
      governanceAudit: request.governanceAudit,
      backendOwned: true,
      frontendOwnsAuthority: false,
      productMutation: false,
      lane: "DINAGAT-PASS-API-GOVERNANCE-AUDIT-GUARDRAILS-01"
    };
  }
}
