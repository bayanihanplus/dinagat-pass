import {
  DinagatBookingStatus,
  DinagatOperatorApprovalStatus,
  DinagatOperatorCapabilityStatus,
  DinagatPaymentReadinessStatus,
  DinagatQrStatus,
  DinagatScanEventStatus,
  DinagatVisitStampStatus,
  DinagatMarketplaceExposureStatus
} from "./enums";

export function isPaymentAllowed(status: DinagatPaymentReadinessStatus): boolean {
  return status === DinagatPaymentReadinessStatus.READY_FOR_PAYMENT;
}

export function isBookingCommerciallyConfirmed(status: DinagatBookingStatus): boolean {
  return status === DinagatBookingStatus.CONFIRMED ||
    status === DinagatBookingStatus.IN_PROGRESS ||
    status === DinagatBookingStatus.COMPLETED;
}

export function isQrOperationallyValid(status: DinagatQrStatus): boolean {
  return status === DinagatQrStatus.ACTIVE;
}

export function canScanCreateVisitStamp(status: DinagatScanEventStatus): boolean {
  return status === DinagatScanEventStatus.VALIDATED;
}

export function isVisitStampIssued(status: DinagatVisitStampStatus): boolean {
  return status === DinagatVisitStampStatus.ISSUED;
}

export function hasOperatorFulfillmentAuthority(
  approvalStatus: DinagatOperatorApprovalStatus,
  capabilityStatus: DinagatOperatorCapabilityStatus
): boolean {
  return approvalStatus === DinagatOperatorApprovalStatus.APPROVED &&
    capabilityStatus === DinagatOperatorCapabilityStatus.APPROVED;
}

export function isMarketplacePubliclyVisible(status: DinagatMarketplaceExposureStatus): boolean {
  return status === DinagatMarketplaceExposureStatus.EXPOSED;
}