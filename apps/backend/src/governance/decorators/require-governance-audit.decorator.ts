import { SetMetadata } from "@nestjs/common";
import { GovernanceAuditRequirement } from "../contracts";

export const DINAGAT_GOVERNANCE_AUDIT_REQUIREMENT = "DINAGAT_GOVERNANCE_AUDIT_REQUIREMENT";

export function RequireGovernanceAudit(requirement: GovernanceAuditRequirement) {
  return SetMetadata(DINAGAT_GOVERNANCE_AUDIT_REQUIREMENT, requirement);
}
