import { Controller, Get } from "@nestjs/common";
import { CommercialTermsReadinessContract } from "../contracts";
import { CommercialTermsService } from "../services";

@Controller("commercial-terms")
export class CommercialTermsReadinessController {
  constructor(private readonly commercialTermsService: CommercialTermsService) {}

  @Get("readiness")
  async readiness(): Promise<CommercialTermsReadinessContract> {
    return this.commercialTermsService.getReadiness();
  }
}
