export const TRIP_BOOKING_COMMERCIAL_STATUSES = [
  "DRAFT",
  "REQUESTED",
  "QUOTED",
  "CONFIRMED",
  "READY_FOR_PAYMENT",
  "PAYMENT_PENDING",
  "PAID",
  "PARTIALLY_PAID",
  "FULFILLMENT_PENDING",
  "FULFILLED",
  "CANCELLED",
  "EXPIRED",
  "ARCHIVED"
] as const;

export type TripBookingCommercialStatus = (typeof TRIP_BOOKING_COMMERCIAL_STATUSES)[number];

export const TRIP_BOOKING_PRODUCT_TYPES = [
  "SITE_ACCESS",
  "TOUR",
  "TRANSPORT",
  "ACCOMMODATION",
  "GUIDE_SERVICE",
  "ACTIVITY",
  "PACKAGE",
  "ADD_ON",
  "OTHER"
] as const;

export type TripBookingProductType = (typeof TRIP_BOOKING_PRODUCT_TYPES)[number];

export const TRIP_BOOKING_SOURCE_CHANNELS = [
  "DIRECT_TRAVELER",
  "LGU_DESK",
  "TOURISM_OFFICE",
  "HOTEL_DESK",
  "TRAVEL_PARTNER",
  "OTA_INTAKE",
  "STAFF_CREATED",
  "SYSTEM_CREATED"
] as const;

export type TripBookingSourceChannel = (typeof TRIP_BOOKING_SOURCE_CHANNELS)[number];

export const TRIP_BOOKING_PRICING_MODES = [
  "FIXED_PRICE",
  "PER_PAX",
  "PER_UNIT",
  "REQUEST_TO_CONFIRM",
  "GOVERNED_RATE",
  "PARTNER_QUOTE",
  "FREE"
] as const;

export type TripBookingPricingMode = (typeof TRIP_BOOKING_PRICING_MODES)[number];

export const TRIP_BOOKING_FULFILLMENT_STATUSES = [
  "NOT_REQUIRED",
  "PENDING_ASSIGNMENT",
  "ASSIGNED",
  "ACCEPTED",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELLED",
  "REASSIGNED",
  "FAILED"
] as const;

export type TripBookingFulfillmentStatus = (typeof TRIP_BOOKING_FULFILLMENT_STATUSES)[number];

export const TRIP_BOOKING_PAYMENT_STATUSES = [
  "NOT_REQUIRED",
  "UNPAID",
  "PARTIALLY_PAID",
  "PAID",
  "REFUND_PENDING",
  "REFUNDED",
  "FAILED",
  "CANCELLED"
] as const;

export type TripBookingPaymentStatus = (typeof TRIP_BOOKING_PAYMENT_STATUSES)[number];

export interface TripBookingCommercialRecord {
  id: string;
  commercialCode: string;
  bookingId?: string | null;
  travelerId?: string | null;
  passId?: string | null;
  sourceChannel: TripBookingSourceChannel;
  productType: TripBookingProductType;
  pricingMode: TripBookingPricingMode;
  commercialStatus: TripBookingCommercialStatus;
  paymentStatus: TripBookingPaymentStatus;
  fulfillmentStatus: TripBookingFulfillmentStatus;
  assignedOperatorRegistryId?: string | null;
  sourcePartnerName?: string | null;
  sourceReferenceHash?: string | null;
  quotedAmountCents?: number | null;
  confirmedAmountCents?: number | null;
  currency: string;
  paxCount?: number | null;
  requestedForDate?: string | Date | null;
  confirmedAt?: string | Date | null;
  cancelledAt?: string | Date | null;
  expiresAt?: string | Date | null;
}

export interface TripBookingLineItemRecord {
  id: string;
  commercialRecordId: string;
  lineItemCode: string;
  productType: TripBookingProductType;
  pricingMode: TripBookingPricingMode;
  title: string;
  quantity: number;
  unitAmountCents?: number | null;
  totalAmountCents?: number | null;
  currency: string;
}

export interface TripBookingFulfillmentRecord {
  id: string;
  commercialRecordId: string;
  fulfillmentCode: string;
  fulfillmentStatus: TripBookingFulfillmentStatus;
  assignedOperatorRegistryId?: string | null;
  assignedByUserId?: string | null;
  acceptedAt?: string | Date | null;
  startedAt?: string | Date | null;
  completedAt?: string | Date | null;
  cancelledAt?: string | Date | null;
  reassignedAt?: string | Date | null;
  fulfillmentReferenceHash?: string | null;
}

export const TRIP_BOOKING_COMMERCIAL_SPINE_FOUNDATION_DOCTRINE = {
  backendOwned: true,
  frontendOwnsCommercialTruth: false,
  standaloneDinagatPass: true,
  bookingRemainsBackendGoverned: true,
  pricingRequiresBackendRecord: true,
  paymentStatusRequiresBackendEvent: true,
  fulfillmentRequiresGovernedAssignment: true,
  operatorAssignmentRequiresRegistryRecord: true,
  otaAndTravelPartnersAreSourceChannelsOnly: true,
  noFrontendConfirmedBookingAllowed: true,
  noFrontendPaymentTruthAllowed: true,
  noFakeCommercialReadinessAllowed: true
} as const;
