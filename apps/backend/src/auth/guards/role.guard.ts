import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { UserRole } from "@prisma/client";
import { RequestWithAuthContext } from "../contracts";
import { DINAGAT_REQUIRED_ROLES } from "../decorators";

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      DINAGAT_REQUIRED_ROLES,
      [context.getHandler(), context.getClass()]
    );

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<RequestWithAuthContext>();
    const user = request.auth;

    if (!user || !user.isActive) {
      return false;
    }

    return requiredRoles.includes(user.role);
  }
}