import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { RequestWithAuthContext } from "../../auth";
import { GovernanceAuditRequestBody, GovernanceAuditRequirement } from "../contracts";
import { DINAGAT_GOVERNANCE_AUDIT_REQUIREMENT } from "../decorators";
import { GovernanceAuditService, RecordGovernanceAuditInput } from "../services";

type RequestWithAuthAndBody = RequestWithAuthContext & {
  body?: GovernanceAuditRequestBody;
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

@Injectable()
export class GovernanceAuditGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly governanceAuditService: GovernanceAuditService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requirement = this.reflector.getAllAndOverride<GovernanceAuditRequirement>(
      DINAGAT_GOVERNANCE_AUDIT_REQUIREMENT,
      [context.getHandler(), context.getClass()]
    );

    if (!requirement) {
      return true;
    }

    const request = context.switchToHttp().getRequest<RequestWithAuthAndBody>();
    const user = request.auth;

    if (!user || !user.isActive || !user.userId) {
      return false;
    }

    const reason = request.body?.reason ?? requirement.reason;

    if (!reason || reason.trim().length < 8) {
      return false;
    }

    const auditInput: RecordGovernanceAuditInput = {
      actorUserId: user.userId,
      actionType: requirement.actionType,
      entityType: requirement.entityType,
      reason,
      metadata: {
        requiredByDecorator: true,
        routeGuard: "GovernanceAuditGuard",
        userRole: user.role,
        sessionId: user.sessionId,
        ...(requirement.metadata ?? {}),
        requestMetadata: request.body?.metadata ?? {}
      }
    };

    if (request.body?.entityId) {
      auditInput.entityId = request.body.entityId;
    }

    const audit = await this.governanceAuditService.recordGovernanceAudit(auditInput);

    request.governanceAudit = audit;

    return true;
  }
}
