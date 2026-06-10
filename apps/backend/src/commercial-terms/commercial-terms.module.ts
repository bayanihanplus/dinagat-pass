import { Module } from "@nestjs/common";
import { AuthModule } from "../auth";
import { GovernanceModule } from "../governance";
import {
  CommercialTermsAcceptanceController,
  CommercialTermsReadinessController
} from "./controllers";
import { CommercialTermsService } from "./services";

@Module({
  imports: [AuthModule, GovernanceModule],
  controllers: [
    CommercialTermsAcceptanceController,
    CommercialTermsReadinessController
  ],
  providers: [CommercialTermsService],
  exports: [CommercialTermsService]
})
export class CommercialTermsModule {}
