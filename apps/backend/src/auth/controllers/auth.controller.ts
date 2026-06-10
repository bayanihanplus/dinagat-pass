import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException
} from "@nestjs/common";
import { FastifyReply, FastifyRequest } from "fastify";
import { AuthService } from "../services";

const DINAGAT_SESSION_COOKIE = "dinagat_session";
const EIGHT_HOURS_IN_SECONDS = 60 * 60 * 8;

interface LoginBody {
  email?: string;
  password?: string;
}

type RequestWithAuthHeaders = FastifyRequest & {
  headers: FastifyRequest["headers"] & {
    authorization?: string | string[];
    cookie?: string;
  };
};

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  async login(
    @Body() body: LoginBody,
    @Res({ passthrough: true }) reply: FastifyReply
  ) {
    try {
      const session = await this.authService.createSession({
        email: this.requireEmail(body.email),
        password: this.requirePassword(body.password)
      });

      reply.header(
        "Set-Cookie",
        this.buildSessionCookie(session.sessionToken, session.expiresAt)
      );

      return {
        authenticated: true,
        authority: "backend",
        frontendOwnsAuthority: false,
        cookieIssuedByController: true,
        jwtIssuedByController: false,
        publicSignupCreated: false,
        sessionTokenReturnedInBody: false,
        session: {
          userId: session.userId,
          email: session.email,
          role: session.role,
          expiresAt: session.expiresAt,
          sessionIssued: session.sessionIssued
        }
      };
    } catch {
      throw new UnauthorizedException("Invalid credentials or inactive user.");
    }
  }

  @Get("me")
  async me(@Req() request: RequestWithAuthHeaders) {
    const token = this.extractSessionToken(request);

    if (!token) {
      return this.unauthenticatedMe();
    }

    const resolved = await this.authService.resolveSession(token);

    if (!resolved.valid || !resolved.userId || !resolved.email || !resolved.role || !resolved.sessionId) {
      return this.unauthenticatedMe();
    }

    return {
      authenticated: true,
      authority: "backend",
      frontendOwnsAuthority: false,
      user: {
        userId: resolved.userId,
        email: resolved.email,
        role: resolved.role,
        sessionId: resolved.sessionId
      }
    };
  }

  @Post("logout")
  async logout(
    @Req() request: RequestWithAuthHeaders,
    @Res({ passthrough: true }) reply: FastifyReply
  ) {
    const token = this.extractSessionToken(request);
    const result = token
      ? await this.authService.revokeSession(token, "User logout via backend auth controller.")
      : { revoked: false };

    reply.header("Set-Cookie", this.buildExpiredSessionCookie());

    return {
      authenticated: false,
      authority: "backend",
      frontendOwnsAuthority: false,
      cookieClearedByController: true,
      revoked: result.revoked
    };
  }

  private extractSessionToken(request: RequestWithAuthHeaders): string {
    const authorizationHeader = request.headers.authorization;
    const authorization = Array.isArray(authorizationHeader)
      ? authorizationHeader[0]
      : authorizationHeader;

    if (typeof authorization === "string" && authorization.startsWith("Bearer ")) {
      return authorization.slice("Bearer ".length).trim();
    }

    const cookieHeader = request.headers.cookie;

    if (!cookieHeader) {
      return "";
    }

    const cookies = cookieHeader.split(";").map((part) => part.trim());

    for (const cookie of cookies) {
      const [name, ...valueParts] = cookie.split("=");

      if (name === DINAGAT_SESSION_COOKIE) {
        return decodeURIComponent(valueParts.join("="));
      }
    }

    return "";
  }

  private buildSessionCookie(sessionToken: string, expiresAt: string): string {
    const secureFlag = this.shouldUseSecureCookie() ? "; Secure" : "";

    return [
      `${DINAGAT_SESSION_COOKIE}=${encodeURIComponent(sessionToken)}`,
      "Path=/",
      "HttpOnly",
      "SameSite=Lax",
      secureFlag.trim(),
      `Max-Age=${EIGHT_HOURS_IN_SECONDS}`,
      `Expires=${new Date(expiresAt).toUTCString()}`
    ]
      .filter(Boolean)
      .join("; ");
  }

  private buildExpiredSessionCookie(): string {
    const secureFlag = this.shouldUseSecureCookie() ? "; Secure" : "";

    return [
      `${DINAGAT_SESSION_COOKIE}=`,
      "Path=/",
      "HttpOnly",
      "SameSite=Lax",
      secureFlag.trim(),
      "Max-Age=0",
      "Expires=Thu, 01 Jan 1970 00:00:00 GMT"
    ]
      .filter(Boolean)
      .join("; ");
  }

  private shouldUseSecureCookie(): boolean {
    const appEnv = (process.env.APP_ENV ?? process.env.NODE_ENV ?? "local").toLowerCase();

    return appEnv === "production" || appEnv === "prod";
  }

  private requireEmail(value: string | undefined): string {
    if (!value || value.trim().length === 0 || !value.includes("@")) {
      throw new BadRequestException("Valid email is required.");
    }

    return value.trim().toLowerCase();
  }

  private requirePassword(value: string | undefined): string {
    if (!value || value.length === 0) {
      throw new BadRequestException("password is required.");
    }

    return value;
  }

  private unauthenticatedMe() {
    return {
      authenticated: false,
      authority: "backend",
      frontendOwnsAuthority: false,
      user: null
    };
  }
}
