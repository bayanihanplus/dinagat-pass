import { SetMetadata } from "@nestjs/common";
import { UserRole } from "@prisma/client";

export const DINAGAT_REQUIRED_ROLES = "DINAGAT_REQUIRED_ROLES";

export function RequireRoles(...roles: UserRole[]) {
  return SetMetadata(DINAGAT_REQUIRED_ROLES, roles);
}