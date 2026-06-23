import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { UserRole } from "@prisma/client";
import { RequestWithAuthContext } from "../contracts";
import { AuthService } from "../services";

const DINAGAT_SESSION_COOKIE = "dinagat_session";

type RequestWithHeadersAndAuth = RequestWithAuthContext & {
  headers?: {
    authorization?: string | string[];
    cookie?: string | string[];
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

    const token = this.extractSessionToken(request);

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

  private extractSessionToken(request: RequestWithHeadersAndAuth): string {
    const authorizationHeader = request.headers?.authorization;
    const authorization = Array.isArray(authorizationHeader)
      ? authorizationHeader[0]
      : authorizationHeader;

    if (typeof authorization === "string" && authorization.startsWith("Bearer ")) {
      return authorization.slice("Bearer ".length).trim();
    }

    const cookieHeader = request.headers?.cookie;
    const cookie = Array.isArray(cookieHeader)
      ? cookieHeader.join("; ")
      : cookieHeader;

    if (!cookie) {
      return "";
    }

    const cookies = cookie.split(";").map((part) => part.trim());

    for (const item of cookies) {
      const [name, ...valueParts] = item.split("=");

      if (name === DINAGAT_SESSION_COOKIE) {
        return decodeURIComponent(valueParts.join("="));
      }
    }

    return "";
  }
}