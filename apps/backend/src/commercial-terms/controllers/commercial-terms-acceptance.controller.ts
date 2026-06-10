import { Body, Controller, Post, Req, UseGuards } from "@nestjs/common";
import { AuthRequiredGuard, RequestWithAuthContext } from "../../auth";
import {
  AcceptCommercialTermsBody,
  CommercialTermsAcceptanceContract
} from "../contracts";
import { CommercialTermsService } from "../services";

type AcceptanceRequest = RequestWithAuthContext & {
  headers?: {
    "user-agent"?: string | string[];
    "x-forwarded-for"?: string | string[];
  };
  ip?: string;
};

@Controller("commercial-terms")
export class CommercialTermsAcceptanceController {
  constructor(private readonly commercialTermsService: CommercialTermsService) {}

  @Post("acceptance")
  @UseGuards(AuthRequiredGuard)
  async acceptTerms(
    @Req() request: AcceptanceRequest,
    @Body() body: AcceptCommercialTermsBody
  ): Promise<CommercialTermsAcceptanceContract> {
    return this.commercialTermsService.acceptCommercialTerms({
      commercialTermsId: body.commercialTermsId ?? "",
      operatorRegistryId: body.operatorRegistryId ?? "",
      acceptedByUserId: request.auth?.userId ?? "",
      reason: body.reason ?? "",
      metadata: body.metadata ?? {},
      sourceIp: this.getSourceIp(request),
      userAgent: this.getUserAgent(request)
    });
  }

  private getSourceIp(request: AcceptanceRequest): string | null {
    const forwarded = request.headers?.["x-forwarded-for"];

    if (Array.isArray(forwarded)) {
      return forwarded[0] ?? null;
    }

    if (typeof forwarded === "string" && forwarded.trim().length > 0) {
      const firstForwarded = forwarded.split(",")[0];
      return firstForwarded ? firstForwarded.trim() : null;
    }

    return request.ip ?? null;
  }

  private getUserAgent(request: AcceptanceRequest): string | null {
    const userAgent = request.headers?.["user-agent"];

    if (Array.isArray(userAgent)) {
      return userAgent[0] ?? null;
    }

    return userAgent ?? null;
  }
}
