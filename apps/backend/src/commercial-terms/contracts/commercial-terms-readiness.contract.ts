export interface CommercialTermsReadinessContract {
  serviceReady: true;
  backendOwned: true;
  frontendOwnsTermsAcceptance: false;
  schemaFoundationCommitted: true;
  acceptanceWriteFlowImplemented: false;
  publicSignupCreated: false;
  jwtIssuedByController: false;
  migrationRequiredForThisCheck: false;
  commercialTerms: {
    total: number;
    active: number;
    draft: number;
    pendingReview: number;
    revoked: number;
    superseded: number;
  };
  operatorTermsAcceptances: {
    total: number;
    active: number;
    revoked: number;
    superseded: number;
  };
  audit: {
    auditEvents: number;
    auditModelAvailable: true;
    acceptanceAuditWriteImplemented: false;
  };
  contract: {
    lane: "DINAGAT-PASS-COMMERCIAL-TERMS-BACKEND-CONTRACT-FOUNDATION-01";
    readinessEndpoint: "/commercial-terms/readiness";
    nextMutationLane: "DINAGAT-PASS-COMMERCIAL-TERMS-ACCEPTANCE-BACKEND-CONTRACT-01";
  };
}
