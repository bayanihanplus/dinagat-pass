import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { UserRole } from "@prisma/client";
import { RequestWithAuthContext } from "../contracts";
import { DINAGAT_REQUIRED_CAPABILITIES } from "../decorators";

@Injectable()
export class CapabilityGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredCapabilities = this.reflector.getAllAndOverride<string[]>(
      DINAGAT_REQUIRED_CAPABILITIES,
      [context.getHandler(), context.getClass()]
    );

    if (!requiredCapabilities || requiredCapabilities.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<RequestWithAuthContext>();
    const user = request.auth;

    if (!user || !user.isActive) {
      return false;
    }

    if (user.role === UserRole.SUPER_ADMIN) {
      request.auth = {
        ...user,
        capabilityBypass: true
      };

      return true;
    }

    return false;
  }
}
