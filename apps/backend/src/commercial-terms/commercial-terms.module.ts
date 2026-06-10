import { Module } from "@nestjs/common";
import { CommercialTermsReadinessController } from "./controllers";
import { CommercialTermsService } from "./services";

@Module({
  controllers: [CommercialTermsReadinessController],
  providers: [CommercialTermsService],
  exports: [CommercialTermsService]
})
export class CommercialTermsModule {}
