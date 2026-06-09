import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { UserRole } from "@prisma/client";
import { RequestWithAuthContext } from "../contracts";
import { AuthService } from "../services";

type RequestWithHeadersAndAuth = RequestWithAuthContext & {
  headers?: {
    authorization?: string | string[];
  };
};

@Injectable()
export class AuthRequiredGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithHeadersAndAuth>();

    if (request.auth?.userId && request.auth?.isActive && request.auth?.sessionId) {
      return true;
    }

    const authorizationHeader = request.headers?.authorization;
    const authorization = Array.isArray(authorizationHeader)
      ? authorizationHeader[0]
      : authorizationHeader;

    const token = typeof authorization === "string" && authorization.startsWith("Bearer ")
      ? authorization.slice("Bearer ".length).trim()
      : "";

    if (!token) {
      return false;
    }

    const resolved = await this.authService.resolveSession(token);

    if (!resolved.valid || !resolved.userId || !resolved.email || !resolved.role || !resolved.sessionId) {
      return false;
    }

    request.auth = {
      userId: resolved.userId,
      email: resolved.email,
      role: resolved.role as UserRole,
      isActive: true,
      sessionId: resolved.sessionId
    };

    return true;
  }
}
