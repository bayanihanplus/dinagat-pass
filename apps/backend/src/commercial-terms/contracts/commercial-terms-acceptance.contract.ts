import { TermsAcceptanceStatus } from "@prisma/client";

export interface AcceptCommercialTermsBody {
  commercialTermsId?: string;
  operatorRegistryId?: string;
  reason?: string;
  metadata?: Record<string, unknown>;
}

export interface CommercialTermsAcceptanceContract {
  accepted: true;
  backendOwned: true;
  frontendOwnsTermsAcceptance: false;
  acceptedByUserId: string;
  operatorRegistryId: string;
  commercialTermsId: string;
  acceptanceId: string;
  status: TermsAcceptanceStatus;
  duplicateHandled: boolean;
  auditEventId: string | null;
  snapshotStored: true;
  contract: {
    lane: "DINAGAT-PASS-COMMERCIAL-TERMS-ACCEPTANCE-BACKEND-CONTRACT-01";
    acceptanceEndpoint: "/commercial-terms/acceptance";
    readinessEndpoint: "/commercial-terms/readiness";
  };
}
