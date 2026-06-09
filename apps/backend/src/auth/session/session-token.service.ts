import { Injectable } from "@nestjs/common";
import { createHash, randomBytes, timingSafeEqual } from "node:crypto";

export interface SessionTokenPair {
  token: string;
  tokenHash: string;
}

@Injectable()
export class SessionTokenService {
  createSessionToken(): SessionTokenPair {
    const token = randomBytes(48).toString("hex");

    return {
      token,
      tokenHash: this.hashToken(token)
    };
  }

  hashToken(token: string): string {
    if (!token || token.length < 32) {
      throw new Error("Invalid session token.");
    }

    return createHash("sha256").update(token).digest("hex");
  }

  compareToken(rawToken: string, storedHash: string): boolean {
    if (!rawToken || !storedHash) {
      return false;
    }

    const rawHash = this.hashToken(rawToken);
    const rawBuffer = Buffer.from(rawHash, "hex");
    const storedBuffer = Buffer.from(storedHash, "hex");

    if (rawBuffer.length !== storedBuffer.length) {
      return false;
    }

    return timingSafeEqual(rawBuffer, storedBuffer);
  }
}