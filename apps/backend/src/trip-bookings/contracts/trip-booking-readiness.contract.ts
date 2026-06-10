export type TripBookingFulfillmentGate =
  | 'operator_registry_required'
  | 'commercial_terms_acceptance_required'
  | 'pricing_or_request_mode_required'
  | 'capability_match_required'
  | 'availability_or_request_window_required'
  | 'no_unresolved_compliance_issue_required'
  | 'governed_exposure_required';

export type TripBookingReadinessContract = {
  serviceReady: true;
  backendOwned: true;
  frontendOwnsBookingAuthority: false;
  frontendOwnsOperatorSelection: false;
  frontendOwnsPaymentAuthority: false;
  publicSignupCreated: false;
  jwtIssuedByController: false;
  fakeBookingAllowed: false;
  flatOperatorListAllowed: false;
  schemaMigrationRequiredForThisCheck: false;
  commercialTermsAcceptanceRequired: true;
  governedOperatorFulfillmentRequired: true;
  readinessScoringRequired: true;
  fairnessCapsRequired: true;
  auditRequiredForBookingMutations: true;
  qrIssuedByBackendOnly: true;
  contract: {
    lane: 'DINAGAT-PASS-TRIP-BOOKING-READINESS-CONTRACT-FOUNDATION-01';
    readinessEndpoint: '/trip-bookings/readiness';
    nextSchemaLane: 'DINAGAT-PASS-TRIP-BOOKING-SCHEMA-FOUNDATION-01';
    nextMutationLane: 'DINAGAT-PASS-TRIP-BOOKING-BACKEND-CONTRACT-01';
  };
  fulfillmentGates: TripBookingFulfillmentGate[];
  operatorExposureDoctrine: {
    noFlatOperatorDump: true;
    operatorIdentityFromAuthContextOnly: true;
    approvedRegistryRequired: true;
    commercialTermsAcceptedRequired: true;
    categoryCapabilityMatchRequired: true;
    pricingOrRequestModeRequired: true;
    readinessAndFairnessGoverned: true;
  };
  bookingAuthorityDoctrine: {
    backendCreatesBooking: true;
    backendControlsStatus: true;
    backendControlsPaymentReadiness: true;
    backendControlsQrAndVoucherReadiness: true;
    frontendMayOnlyRequestIntent: true;
  };
  timestamp: string;
};
