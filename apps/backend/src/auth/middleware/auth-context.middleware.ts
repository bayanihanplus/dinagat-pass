import { Injectable, NestMiddleware } from "@nestjs/common";
import { UserRole } from "@prisma/client";
import { FastifyReply, FastifyRequest } from "fastify";
import { AuthService } from "../services";

@Injectable()
export class AuthContextMiddleware implements NestMiddleware {
  constructor(private readonly authService: AuthService) {}

  async use(req: FastifyRequest & { auth?: unknown }, _res: FastifyReply, next: () => void) {
    const header = req.headers.authorization;

    if (typeof header === "string" && header.startsWith("Bearer ")) {
      const token = header.slice("Bearer ".length).trim();
      const resolved = await this.authService.resolveSession(token);

      if (resolved.valid && resolved.userId && resolved.email && resolved.role && resolved.sessionId) {
        req.auth = {
          userId: resolved.userId,
          email: resolved.email,
          role: resolved.role as UserRole,
          isActive: true,
          sessionId: resolved.sessionId
        };
      }
    }

    next();
  }
}
