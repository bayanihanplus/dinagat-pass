import { TripBookingIntentStatus } from '@prisma/client';
import { TripBookingIntentContract } from './trip-booking-intent.contract';

export const TRIP_BOOKING_REVIEW_ACTIONS = [
  'approve-for-next-step',
  'request-info',
  'reject',
  'hold-review'
] as const;

export type TripBookingReviewAction = (typeof TRIP_BOOKING_REVIEW_ACTIONS)[number];

export type AdminTripBookingReviewActionRequestContract = {
  action?: TripBookingReviewAction;
  reason?: string;
  note?: string;
};

export type AdminTripBookingReviewActionContract = {
  action: TripBookingReviewAction;
  resultingStatus: TripBookingIntentStatus;
  backendOwnedReview: true;
  paymentUnlocked: false;
  qrGenerated: false;
  voucherIssued: false;
  operatorAssigned: false;
  fakeConfirmationAllowed: false;
  reviewedByUserId: string;
  reviewedByRole: string;
  reviewedAt: string;
  reason: string;
  note: string | null;
};

export type AdminTripBookingSafetyLocksContract = {
  paymentUnlocked: false;
  qrGenerated: false;
  voucherIssued: false;
  operatorAssigned: false;
  fakeConfirmationAllowed: false;
};

export type AdminTripBookingListLatestReviewContract = {
  action: TripBookingReviewAction;
  resultingStatus: TripBookingIntentStatus;
  reviewedByRole: string;
  reviewedAt: string;
};

export type AdminTripBookingListItemContract = {
  bookingCode: string;
  title: string;
  destinationName: string | null;
  serviceDate: string | null;
  paxCount: number;
  productType: TripBookingIntentContract['productType'];
  sourceChannel: TripBookingIntentContract['sourceChannel'];
  pricingMode: TripBookingIntentContract['pricingMode'];
  status: TripBookingIntentContract['status'];
  latestReview: AdminTripBookingListLatestReviewContract | null;
  createdAt: string;
  updatedAt: string;
};

export type AdminTripBookingListResponseContract = {
  success: true;
  authority: 'backend';
  frontendOwnsAuthority: false;
  total: number;
  requests: AdminTripBookingListItemContract[];
  safetyLocks: AdminTripBookingSafetyLocksContract;
};

export type AdminTripBookingReviewDetailContract = {
  success: true;
  authority: 'backend';
  frontendOwnsAuthority: false;
  booking: TripBookingIntentContract;
  adminReviewState: AdminTripBookingReviewActionContract | null;
  adminReviewTrail: AdminTripBookingReviewActionContract[];
  safetyLocks: AdminTripBookingSafetyLocksContract;
};

export type AdminTripBookingReviewActionResponseContract = {
  success: true;
  authority: 'backend';
  frontendOwnsAuthority: false;
  bookingCode: string;
  previousStatus: TripBookingIntentStatus;
  currentStatus: TripBookingIntentStatus;
  reviewAction: AdminTripBookingReviewActionContract;
  safetyLocks: AdminTripBookingSafetyLocksContract;
};