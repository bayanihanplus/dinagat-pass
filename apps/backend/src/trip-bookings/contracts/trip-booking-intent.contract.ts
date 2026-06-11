import {
  TripBookingIntentStatus,
  TripBookingPricingMode,
  TripBookingProductType,
  TripBookingSourceChannel,
} from '@prisma/client';

export type CreateTripBookingIntentRequestContract = {
  productType: TripBookingProductType;
  sourceChannel?: TripBookingSourceChannel;
  pricingMode: TripBookingPricingMode;
  title: string;
  destinationName?: string;
  routeCode?: string;
  serviceDate?: string;
  paxCount?: number;
  currencyCode?: string;
  estimatedAmount?: number;
  operatorRegistryId?: string;
  commercialTermsId?: string;
  operatorTermsAcceptanceId?: string;
  travelerRequestJson?: Record<string, unknown>;
  sourceAttributionJson?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
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

export type TripBookingIntentCreateResponseContract = {
  created: true;
  backendOwned: true;
  frontendOwnsBookingAuthority: false;
  frontendOwnsOperatorSelection: false;
  frontendOwnsPaymentAuthority: false;
  requestedByUserIdSource: 'backend-auth-context';
  fakeBookingAllowed: false;
  flatOperatorListAllowed: false;
  operatorTermsAcceptanceRequiredWhenOperatorProvided: true;
  booking: TripBookingIntentContract;
};