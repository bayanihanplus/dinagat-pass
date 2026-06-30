import {
  TripBookingIntentStatus,
  TripBookingPricingMode,
  TripBookingProductType,
  TripBookingSourceChannel,
} from '@prisma/client';
export const TRAVELER_TRIP_REQUEST_TYPES = [
  'ISLAND_HOPPING',
  'LAND_ROUTE',
  'LOCAL_TRANSFER',
  'CUSTOM',
] as const;

export type TravelerTripRequestType =
  (typeof TRAVELER_TRIP_REQUEST_TYPES)[number];

export type CreateTravelerTripRequestContract = {
  destination?: string;
  tripType?: TravelerTripRequestType;
  travelDate?: string;
  partySize?: number;
  notes?: string;

  productType?: never;
  sourceChannel?: never;
  pricingMode?: never;
  title?: never;
  destinationName?: never;
  routeCode?: never;
  serviceDate?: never;
  paxCount?: never;
  currencyCode?: never;
  estimatedAmount?: never;
  operatorRegistryId?: never;
  commercialTermsId?: never;
  operatorTermsAcceptanceId?: never;
  travelerRequestJson?: never;
  sourceAttributionJson?: never;
  metadata?: never;
  requestedByUserId?: never;
  backendOwned?: never;
  frontendMayOnlyRequestIntent?: never;
  fakeBookingAllowed?: never;
  flatOperatorListAllowed?: never;
};

export type TripBookingIntentContract = {
  id: string;
  bookingCode: string;
  productType: TripBookingProductType;
  sourceChannel: TripBookingSourceChannel;
  pricingMode: TripBookingPricingMode;
  status: TripBookingIntentStatus;
  requestedByUserId: string;
  operatorRegistryId: string | null;
  commercialTermsId: string | null;
  operatorTermsAcceptanceId: string | null;
  title: string;
  destinationName: string | null;
  routeCode: string | null;
  serviceDate: string | null;
  paxCount: number;
  currencyCode: string;
  estimatedAmount: string | null;
  confirmedAmount: string | null;
  backendOwned: true;
  frontendMayOnlyRequestIntent: true;
  fakeBookingAllowed: false;
  flatOperatorListAllowed: false;
  commercialTermsAcceptanceRequired: true;
  governedOperatorFulfillmentRequired: true;
  createdAt: string;
  updatedAt: string;
};

export type TripBookingSafetyLocksContract = {
  paymentUnlocked: false;
  qrGenerated: false;
  voucherIssued: false;
  operatorAssigned: false;
  fakeConfirmationAllowed: false;
};

export type TravelerTripBookingIntentCreateResponseContract = {
  created: true;
  authority: 'backend';
  frontendOwnsAuthority: false;
  backendOwned: true;
  frontendOwnsBookingAuthority: false;
  frontendOwnsOperatorSelection: false;
  frontendOwnsPaymentAuthority: false;
  requestedByUserIdSource: 'backend-auth-context';
  fakeBookingAllowed: false;
  flatOperatorListAllowed: false;
  booking: TripBookingIntentContract;
  safetyLocks: TripBookingSafetyLocksContract;
};

export const TRAVELER_REQUEST_STATUS_CODES = [
  'REQUEST_RECEIVED',
  'MORE_INFORMATION_NEEDED',
  'UNDER_REVIEW',
  'APPROVED_FOR_NEXT_STEP',
  'NOT_APPROVED',
  'CLOSED',
] as const;

export type TravelerRequestStatusCode =
  (typeof TRAVELER_REQUEST_STATUS_CODES)[number];

export type TravelerRequestStatusProjectionContract = {
  code: TravelerRequestStatusCode;
  label: string;
  guidance: string;
  updatedAt: string;
};

export type TravelerTripBookingRequestContract = {
  bookingCode: string;
  title: string;
  destinationName: string | null;
  serviceDate: string | null;
  paxCount: number;
  travelerStatus: TravelerRequestStatusProjectionContract;
  createdAt: string;
  updatedAt: string;
};

export type TravelerTripBookingIntentListResponseContract = {
  success: true;
  authority: 'backend';
  frontendOwnsAuthority: false;
  total: number;
  requests: TravelerTripBookingRequestContract[];
};

export type TravelerTripBookingIntentDetailResponseContract = {
  success: true;
  authority: 'backend';
  frontendOwnsAuthority: false;
  booking: TravelerTripBookingRequestContract;
};
