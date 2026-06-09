import { Module } from "@nestjs/common";
import { AuthModule } from "../auth";
import { PrismaModule } from "../prisma";
import { GovernanceVerificationController } from "./controllers";
import { GovernanceAuditGuard } from "./guards";
import { GovernanceAuditService } from "./services";

@Module({
  imports: [AuthModule, PrismaModule],
  controllers: [GovernanceVerificationController],
  providers: [GovernanceAuditService, GovernanceAuditGuard],
  exports: [GovernanceAuditService, GovernanceAuditGuard]
})
export class GovernanceModule {}
