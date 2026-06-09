import { Module } from "@nestjs/common";
import { AuthFoundationController } from "./controllers";
import { AuthRequiredGuard, CapabilityGuard, RoleGuard } from "./guards";
import { AuthContextMiddleware } from "./middleware";
import { PasswordService } from "./password";
import { SessionTokenService } from "./session";
import { AuthService } from "./services";

@Module({
  controllers: [AuthFoundationController],
  providers: [
    AuthService,
    PasswordService,
    SessionTokenService,
    AuthContextMiddleware,
    AuthRequiredGuard,
    RoleGuard,
    CapabilityGuard
  ],
  exports: [
    AuthService,
    PasswordService,
    SessionTokenService,
    AuthContextMiddleware,
    AuthRequiredGuard,
    RoleGuard,
    CapabilityGuard
  ]
})
export class AuthModule {}
