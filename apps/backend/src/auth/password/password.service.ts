import { Injectable } from "@nestjs/common";
import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scrypt = promisify(scryptCallback);

export interface PasswordHashResult {
  hash: string;
  salt: string;
  algorithm: "scrypt";
}

@Injectable()
export class PasswordService {
  private readonly keyLength = 64;

  async hashPassword(password: string): Promise<PasswordHashResult> {
    this.assertPasswordInput(password);

    const salt = randomBytes(32).toString("hex");
    const derivedKey = (await scrypt(password, salt, this.keyLength)) as Buffer;

    return {
      hash: derivedKey.toString("hex"),
      salt,
      algorithm: "scrypt"
    };
  }

  async verifyPassword(password: string, hash: string, salt: string): Promise<boolean> {
    this.assertPasswordInput(password);

    if (!hash || !salt) {
      return false;
    }

    const derivedKey = (await scrypt(password, salt, this.keyLength)) as Buffer;
    const storedHash = Buffer.from(hash, "hex");

    if (storedHash.length !== derivedKey.length) {
      return false;
    }

    return timingSafeEqual(storedHash, derivedKey);
  }

  private assertPasswordInput(password: string): void {
    if (!password || password.length < 12) {
      throw new Error("Password must be at least 12 characters.");
    }
  }
}