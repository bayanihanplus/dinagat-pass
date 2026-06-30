import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import {
  TripBookingIntent,
  TripBookingIntentStatus,
  TripBookingPricingMode,
  TripBookingProductType,
  TripBookingSourceChannel,
} from '@prisma/client';

import { PrismaService } from '../../prisma/prisma.service';
import {
  CreateTravelerTripRequestContract,
  TravelerTripBookingIntentCreateResponseContract,
  TravelerTripBookingIntentDetailResponseContract,
  TravelerTripBookingIntentListResponseContract,
  TravelerTripBookingRequestContract,
  TravelerRequestStatusProjectionContract,
  TravelerTripRequestType,
  TRAVELER_TRIP_REQUEST_TYPES,
  TripBookingIntentContract,
  TripBookingSafetyLocksContract,
} from '../contracts/trip-booking-intent.contract';
import {
  AdminTripBookingReviewActionRequestContract,
  AdminTripBookingReviewActionResponseContract,
  AdminTripBookingReviewDetailContract,
  AdminTripBookingListResponseContract,
  AdminTripBookingReviewActionContract,
  TripBookingReviewAction,
  TRIP_BOOKING_REVIEW_ACTIONS
} from '../contracts/trip-booking-review-action.contract';

type AuthenticatedRequestContext = {
  userId?: string;
};

@Injectable()
export class TripBookingIntentService {
  constructor(private readonly prisma: PrismaService) {}

  async createTravelerIntent(
    body: CreateTravelerTripRequestContract,
    auth: AuthenticatedRequestContext,
  ): Promise<TravelerTripBookingIntentCreateResponseContract> {
    const requestBody = this.requireTravelerRequestBody(body);
    const requestedByUserId = this.requireAuthenticatedUserId(auth.userId);
    const destinationName = this.requireTravelerDestination(
      requestBody.destination,
    );
    const tripType = this.requireTravelerTripType(requestBody.tripType);
    const serviceDate = this.requireTravelerServiceDate(
      requestBody.travelDate,
    );
    const paxCount = this.requireTravelerPaxCount(requestBody.partySize);
    const notes = this.normalizeTravelerNotes(requestBody.notes);
    const productType = this.mapTravelerTripTypeToProductType(tripType);
    const title = this.buildTravelerRequestTitle(
      tripType,
      destinationName,
    );

    const booking = await this.prisma.tripBookingIntent.create({
      data: {
        bookingCode: await this.generateBookingCode(),
        productType,
        sourceChannel: TripBookingSourceChannel.DIRECT_TRAVELER,
        pricingMode: TripBookingPricingMode.REQUEST_TO_CONFIRM,
        status: TripBookingIntentStatus.REQUESTED,
        requestedByUserId,
        operatorRegistryId: null,
        commercialTermsId: null,
        operatorTermsAcceptanceId: null,
        title,
        destinationName,
        routeCode: null,
        serviceDate,
        paxCount,
        currencyCode: 'PHP',
        estimatedAmount: null,
        travelerRequestJson: this.toJsonInput({
          schemaVersion: 1,
          tripType,
          notes,
        }),
        sourceAttributionJson: this.toJsonInput({
          sourceChannel: TripBookingSourceChannel.DIRECT_TRAVELER,
          ownershipSource: 'backend-auth-context',
        }),
        metadata: this.toJsonInput({
          travelerContractVersion: 1,
          safetyLocks: this.getTravelerSafetyLocks(),
        }),
        backendOwned: true,
        frontendMayOnlyRequestIntent: true,
        fakeBookingAllowed: false,
        flatOperatorListAllowed: false,
        commercialTermsAcceptanceRequired: true,
        governedOperatorFulfillmentRequired: true,
        requestedAt: new Date(),
      },
    });

    return {
      created: true,
      authority: 'backend',
      frontendOwnsAuthority: false,
      backendOwned: true,
      frontendOwnsBookingAuthority: false,
      frontendOwnsOperatorSelection: false,
      frontendOwnsPaymentAuthority: false,
      requestedByUserIdSource: 'backend-auth-context',
      fakeBookingAllowed: false,
      flatOperatorListAllowed: false,
      booking: this.toContract(booking),
      safetyLocks: this.getTravelerSafetyLocks(),
    };
  }

  async listForTraveler(
    userId: string,
  ): Promise<TravelerTripBookingIntentListResponseContract> {
    const normalizedUserId = this.requireAuthenticatedUserId(userId);

    const bookings = await this.prisma.tripBookingIntent.findMany({
      where: {
        requestedByUserId: normalizedUserId,
      },
      take: 100,
      orderBy: [
        {
          updatedAt: 'desc',
        },
        {
          createdAt: 'desc',
        },
      ],
    });

    const requests = bookings.map((booking) =>
      this.toTravelerRequestContract(booking),
    );

    return {
      success: true,
      authority: 'backend',
      frontendOwnsAuthority: false,
      total: requests.length,
      requests,
    };
  }

  async getForTravelerByBookingCode(
    bookingCode: string,
    userId: string,
  ): Promise<TravelerTripBookingIntentDetailResponseContract> {
    const normalizedBookingCode = bookingCode?.trim();
    const normalizedUserId = this.requireAuthenticatedUserId(userId);

    if (!normalizedBookingCode) {
      throw new BadRequestException('bookingCode is required.');
    }

    const booking = await this.prisma.tripBookingIntent.findFirst({
      where: {
        bookingCode: normalizedBookingCode,
        requestedByUserId: normalizedUserId,
      },
    });

    if (!booking) {
      throw new NotFoundException(
        'Trip booking intent was not found.',
      );
    }

    return {
      success: true,
      authority: 'backend',
      frontendOwnsAuthority: false,
      booking: this.toTravelerRequestContract(booking),
    };
  }

  async listForAdmin(): Promise<AdminTripBookingListResponseContract> {
    const bookings = await this.prisma.tripBookingIntent.findMany({
      take: 100,
      orderBy: [
        {
          updatedAt: 'desc',
        },
        {
          createdAt: 'desc',
        },
      ],
    });

    const requests = bookings.map((booking) => {
      const metadata =
        booking.metadata &&
        typeof booking.metadata === 'object' &&
        !Array.isArray(booking.metadata)
          ? (booking.metadata as Record<string, unknown>)
          : {};

      const latestReviewState =
        this.toAdminReviewActionOrNull(
          metadata.adminReviewState,
        );

      return {
        bookingCode: booking.bookingCode,
        title: booking.title,
        destinationName: booking.destinationName,
        serviceDate: booking.serviceDate?.toISOString() ?? null,
        paxCount: booking.paxCount,
        productType: booking.productType,
        sourceChannel: booking.sourceChannel,
        pricingMode: booking.pricingMode,
        status: booking.status,
        latestReview: latestReviewState
          ? {
              action: latestReviewState.action,
              resultingStatus:
                latestReviewState.resultingStatus,
              reviewedByRole:
                latestReviewState.reviewedByRole,
              reviewedAt:
                latestReviewState.reviewedAt,
            }
          : null,
        createdAt: booking.createdAt.toISOString(),
        updatedAt: booking.updatedAt.toISOString(),
      };
    });

    return {
      success: true,
      authority: 'backend',
      frontendOwnsAuthority: false,
      total: requests.length,
      requests,
      safetyLocks: this.getTravelerSafetyLocks(),
    };
  }

  async getAdminReviewDetail(bookingCode: string): Promise<AdminTripBookingReviewDetailContract> {
    const normalizedBookingCode = bookingCode?.trim();

    if (!normalizedBookingCode) {
      throw new BadRequestException('bookingCode is required.');
    }

    const booking = await this.prisma.tripBookingIntent.findUnique({
      where: { bookingCode: normalizedBookingCode },
    });

    if (!booking) {
      throw new NotFoundException('Trip booking intent was not found.');
    }

    const metadata =
      booking.metadata && typeof booking.metadata === 'object' && !Array.isArray(booking.metadata)
        ? (booking.metadata as Record<string, unknown>)
        : {};

    const adminReviewState = this.toAdminReviewActionOrNull(metadata.adminReviewState);
    const adminReviewTrail = Array.isArray(metadata.adminReviewTrail)
      ? metadata.adminReviewTrail
          .map((entry) => this.toAdminReviewActionOrNull(entry))
          .filter((entry): entry is AdminTripBookingReviewActionContract => entry !== null)
      : [];

    return {
      success: true,
      authority: 'backend',
      frontendOwnsAuthority: false,
      booking: this.toContract(booking),
      adminReviewState,
      adminReviewTrail,
      safetyLocks: {
        paymentUnlocked: false,
        qrGenerated: false,
        voucherIssued: false,
        operatorAssigned: false,
        fakeConfirmationAllowed: false
      }
    };
  }


  async applyAdminReviewAction(
    bookingCode: string,
    body: AdminTripBookingReviewActionRequestContract,
    actor: { userId: string; role: string }
  ): Promise<AdminTripBookingReviewActionResponseContract> {
    const normalizedBookingCode = bookingCode?.trim();

    if (!normalizedBookingCode) {
      throw new BadRequestException('bookingCode is required.');
    }

    if (!actor.userId || !actor.role) {
      throw new BadRequestException('Backend auth context is required for admin review actions.');
    }

    const action = this.requireReviewAction(body.action);
    const reason = this.requireReviewReason(body.reason);
    const note = this.normalizeOptionalText(body.note);

    const booking = await this.prisma.tripBookingIntent.findUnique({
      where: { bookingCode: normalizedBookingCode }
    });

    if (!booking) {
      throw new NotFoundException('Trip booking intent was not found.');
    }

    const resultingStatus = this.getReviewActionResultingStatus(action);
    const reviewedAt = new Date().toISOString();

    const reviewAction = {
      action,
      resultingStatus,
      backendOwnedReview: true as const,
      paymentUnlocked: false as const,
      qrGenerated: false as const,
      voucherIssued: false as const,
      operatorAssigned: false as const,
      fakeConfirmationAllowed: false as const,
      reviewedByUserId: actor.userId,
      reviewedByRole: actor.role,
      reviewedAt,
      reason,
      note
    };

    const currentMetadata =
      booking.metadata && typeof booking.metadata === 'object' && !Array.isArray(booking.metadata)
        ? (booking.metadata as Record<string, unknown>)
        : {};

    const existingReviewTrail = Array.isArray(currentMetadata.adminReviewTrail)
      ? currentMetadata.adminReviewTrail
      : [];

    const updatedMetadata = {
      ...currentMetadata,
      adminReviewState: {
        action,
        resultingStatus,
        reviewedByUserId: actor.userId,
        reviewedByRole: actor.role,
        reviewedAt,
        reason,
        note,
        backendOwnedReview: true,
        paymentUnlocked: false,
        qrGenerated: false,
        voucherIssued: false,
        operatorAssigned: false,
        fakeConfirmationAllowed: false
      },
      adminReviewTrail: [
        ...existingReviewTrail,
        reviewAction
      ],
      safetyLocks: {
        paymentUnlocked: false,
        qrGenerated: false,
        voucherIssued: false,
        operatorAssigned: false,
        fakeConfirmationAllowed: false
      }
    };

    const updatedBooking = await this.prisma.tripBookingIntent.update({
      where: { id: booking.id },
      data: {
        status: resultingStatus,
        metadata: updatedMetadata,
        confirmedAt: null,
        cancelledAt: action === 'reject' ? new Date(reviewedAt) : booking.cancelledAt
      }
    });

    return {
      success: true,
      authority: 'backend',
      frontendOwnsAuthority: false,
      bookingCode: updatedBooking.bookingCode,
      previousStatus: booking.status,
      currentStatus: updatedBooking.status,
      reviewAction,
      safetyLocks: {
        paymentUnlocked: false,
        qrGenerated: false,
        voucherIssued: false,
        operatorAssigned: false,
        fakeConfirmationAllowed: false
      }
    };
  }

  private requireTravelerRequestBody(
    value: unknown,
  ): Record<string, unknown> {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      throw new BadRequestException(
        'Traveler trip request body must be a JSON object.',
      );
    }

    const requestBody = value as Record<string, unknown>;
    const allowedFields = new Set<string>([
      'destination',
      'tripType',
      'travelDate',
      'partySize',
      'notes',
    ]);

    const unsupportedFields = Object.keys(requestBody)
      .filter((field) => !allowedFields.has(field))
      .sort();

    if (unsupportedFields.length > 0) {
      throw new BadRequestException(
        'Unsupported traveler request fields: ' +
          unsupportedFields.join(', ') +
          '.',
      );
    }

    return requestBody;
  }

  private requireAuthenticatedUserId(value: unknown): string {
    if (typeof value !== 'string' || !value.trim()) {
      throw new BadRequestException(
        'Authenticated user context is required.',
      );
    }

    return value.trim();
  }

  private requireTravelerDestination(value: unknown): string {
    if (typeof value !== 'string') {
      throw new BadRequestException('destination is required.');
    }

    const destination = value.trim();

    if (destination.length < 2 || destination.length > 160) {
      throw new BadRequestException(
        'destination must contain between 2 and 160 characters.',
      );
    }

    return destination;
  }

  private requireTravelerTripType(
    value: unknown,
  ): TravelerTripRequestType {
    if (
      typeof value !== 'string' ||
      !TRAVELER_TRIP_REQUEST_TYPES.includes(
        value as TravelerTripRequestType,
      )
    ) {
      throw new BadRequestException('tripType is invalid.');
    }

    return value as TravelerTripRequestType;
  }

  private requireTravelerServiceDate(value: unknown): Date {
    if (
      typeof value !== 'string' ||
      !/^\d{4}-\d{2}-\d{2}$/.test(value)
    ) {
      throw new BadRequestException(
        'travelDate must use YYYY-MM-DD format.',
      );
    }

    const serviceDate = new Date(value + 'T00:00:00.000Z');

    if (
      Number.isNaN(serviceDate.getTime()) ||
      serviceDate.toISOString().slice(0, 10) !== value
    ) {
      throw new BadRequestException('travelDate is invalid.');
    }

    const now = new Date();
    const philippineNow = new Date(
      now.getTime() + 8 * 60 * 60 * 1000,
    );

    const minimumDate = new Date(
      Date.UTC(
        philippineNow.getUTCFullYear(),
        philippineNow.getUTCMonth(),
        philippineNow.getUTCDate(),
      ),
    );

    const maximumDate = new Date(minimumDate);
    maximumDate.setUTCMonth(maximumDate.getUTCMonth() + 24);

    if (serviceDate < minimumDate || serviceDate > maximumDate) {
      throw new BadRequestException(
        'travelDate must be within the next 24 months.',
      );
    }

    return serviceDate;
  }

  private requireTravelerPaxCount(value: unknown): number {
    if (
      typeof value !== 'number' ||
      !Number.isInteger(value) ||
      value < 1 ||
      value > 30
    ) {
      throw new BadRequestException(
        'partySize must be an integer between 1 and 30.',
      );
    }

    return value;
  }

  private normalizeTravelerNotes(value: unknown): string | null {
    if (value === undefined || value === null || value === '') {
      return null;
    }

    if (typeof value !== 'string') {
      throw new BadRequestException('notes must be text.');
    }

    const notes = value.trim();

    if (!notes) {
      return null;
    }

    if (notes.length > 2000) {
      throw new BadRequestException(
        'notes must not exceed 2000 characters.',
      );
    }

    return notes;
  }

  private mapTravelerTripTypeToProductType(
    tripType: TravelerTripRequestType,
  ): TripBookingProductType {
    if (tripType === 'LOCAL_TRANSFER') {
      return TripBookingProductType.TRANSPORT;
    }

    if (
      tripType === 'ISLAND_HOPPING' ||
      tripType === 'LAND_ROUTE'
    ) {
      return TripBookingProductType.TOUR;
    }

    return TripBookingProductType.OTHER;
  }

  private buildTravelerRequestTitle(
    tripType: TravelerTripRequestType,
    destinationName: string,
  ): string {
    const labels: Record<TravelerTripRequestType, string> = {
      ISLAND_HOPPING: 'Island hopping',
      LAND_ROUTE: 'Dinagat land route',
      LOCAL_TRANSFER: 'Local transfer',
      CUSTOM: 'Custom Dinagat',
    };

    return labels[tripType] + ' request to ' + destinationName;
  }

  private toTravelerRequestContract(
    booking: TripBookingIntent,
  ): TravelerTripBookingRequestContract {
    const metadata =
      booking.metadata &&
      typeof booking.metadata === 'object' &&
      !Array.isArray(booking.metadata)
        ? (booking.metadata as Record<string, unknown>)
        : {};

    const reviewState = this.toAdminReviewActionOrNull(
      metadata.adminReviewState,
    );

    return {
      bookingCode: booking.bookingCode,
      title: booking.title,
      destinationName: booking.destinationName,
      serviceDate: booking.serviceDate?.toISOString() ?? null,
      paxCount: booking.paxCount,
      travelerStatus: this.toTravelerStatusProjection(
        booking,
        reviewState,
      ),
      createdAt: booking.createdAt.toISOString(),
      updatedAt: booking.updatedAt.toISOString(),
    };
  }

  private toTravelerStatusProjection(
    booking: TripBookingIntent,
    reviewState: AdminTripBookingReviewActionContract | null,
  ): TravelerRequestStatusProjectionContract {
    const validatedReview =
      reviewState &&
      reviewState.resultingStatus === booking.status
        ? reviewState
        : null;

    if (validatedReview?.action === 'request-info') {
      return {
        code: 'MORE_INFORMATION_NEEDED',
        label: 'More information needed',
        guidance:
          'Dinagat Pass needs additional details before review can continue. Follow the official request instructions when they appear.',
        updatedAt: validatedReview.reviewedAt,
      };
    }

    if (validatedReview?.action === 'hold-review') {
      return {
        code: 'UNDER_REVIEW',
        label: 'Under review',
        guidance:
          'Your request remains under review. No action is required unless Dinagat Pass contacts you.',
        updatedAt: validatedReview.reviewedAt,
      };
    }

    if (validatedReview?.action === 'approve-for-next-step') {
      return {
        code: 'APPROVED_FOR_NEXT_STEP',
        label: 'Approved for next step',
        guidance:
          'Your request passed the current review step. Continue only through official next steps shown by Dinagat Pass.',
        updatedAt: validatedReview.reviewedAt,
      };
    }

    if (validatedReview?.action === 'reject') {
      return {
        code: 'NOT_APPROVED',
        label: 'Not approved',
        guidance:
          'This request will not advance in its current form. You may start a new request when ready.',
        updatedAt: validatedReview.reviewedAt,
      };
    }

    const updatedAt = booking.updatedAt.toISOString();

    switch (booking.status) {
      case TripBookingIntentStatus.DRAFT:
      case TripBookingIntentStatus.REQUESTED:
        return {
          code: 'REQUEST_RECEIVED',
          label: 'Request received',
          guidance:
            'Your request was received and is waiting for backend review. It is not yet a confirmed booking.',
          updatedAt,
        };

      case TripBookingIntentStatus.PENDING_OPERATOR_MATCH:
        return {
          code: 'UNDER_REVIEW',
          label: 'Under review',
          guidance:
            'Dinagat Pass is continuing the protected review of your request.',
          updatedAt,
        };

      case TripBookingIntentStatus.PENDING_CONFIRMATION:
      case TripBookingIntentStatus.READY_FOR_PAYMENT:
      case TripBookingIntentStatus.PAYMENT_PENDING:
      case TripBookingIntentStatus.CONFIRMED:
        return {
          code: 'APPROVED_FOR_NEXT_STEP',
          label: 'Approved for next step',
          guidance:
            'Your request has advanced. Continue only through official next steps shown by Dinagat Pass.',
          updatedAt,
        };

      case TripBookingIntentStatus.REJECTED:
        return {
          code: 'NOT_APPROVED',
          label: 'Not approved',
          guidance:
            'This request will not advance in its current form. You may start a new request when ready.',
          updatedAt,
        };

      case TripBookingIntentStatus.CANCELLED:
      case TripBookingIntentStatus.EXPIRED:
        return {
          code: 'CLOSED',
          label: 'Request closed',
          guidance:
            'This request is no longer active. Start a new request when you are ready.',
          updatedAt,
        };

      default:
        return {
          code: 'UNDER_REVIEW',
          label: 'Under review',
          guidance:
            'Dinagat Pass is reviewing the current request state.',
          updatedAt,
        };
    }
  }

  private getTravelerSafetyLocks(): TripBookingSafetyLocksContract {
    return {
      paymentUnlocked: false,
      qrGenerated: false,
      voucherIssued: false,
      operatorAssigned: false,
      fakeConfirmationAllowed: false,
    };
  }

  private toAdminReviewActionOrNull(value: unknown): AdminTripBookingReviewActionContract | null {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      return null;
    }

    const record = value as Record<string, unknown>;

    if (!TRIP_BOOKING_REVIEW_ACTIONS.includes(record.action as TripBookingReviewAction)) {
      return null;
    }

    const resultingStatus = record.resultingStatus;
    if (typeof resultingStatus !== 'string') {
      return null;
    }

    if (typeof record.reviewedByUserId !== 'string' || typeof record.reviewedByRole !== 'string') {
      return null;
    }

    if (typeof record.reviewedAt !== 'string' || typeof record.reason !== 'string') {
      return null;
    }

    return {
      action: record.action as TripBookingReviewAction,
      resultingStatus: resultingStatus as TripBookingIntentStatus,
      backendOwnedReview: true,
      paymentUnlocked: false,
      qrGenerated: false,
      voucherIssued: false,
      operatorAssigned: false,
      fakeConfirmationAllowed: false,
      reviewedByUserId: record.reviewedByUserId,
      reviewedByRole: record.reviewedByRole,
      reviewedAt: record.reviewedAt,
      reason: record.reason,
      note: typeof record.note === 'string' ? record.note : null
    };
  }
  private requireReviewAction(action: unknown): TripBookingReviewAction {
    if (typeof action !== 'string') {
      throw new BadRequestException('review action is required.');
    }

    if (!TRIP_BOOKING_REVIEW_ACTIONS.includes(action as TripBookingReviewAction)) {
      throw new BadRequestException('Unsupported trip booking review action.');
    }

    return action as TripBookingReviewAction;
  }

  private requireReviewReason(reason: unknown): string {
    if (typeof reason !== 'string' || reason.trim().length < 3) {
      throw new BadRequestException('review reason is required.');
    }

    return reason.trim();
  }

  private normalizeOptionalText(value: unknown): string | null {
    if (typeof value !== 'string') {
      return null;
    }

    const normalized = value.trim();

    return normalized.length > 0 ? normalized : null;
  }

  private getReviewActionResultingStatus(action: TripBookingReviewAction): TripBookingIntentStatus {
    if (action === 'approve-for-next-step') {
      return TripBookingIntentStatus.PENDING_CONFIRMATION;
    }

    if (action === 'reject') {
      return TripBookingIntentStatus.REJECTED;
    }

    return TripBookingIntentStatus.REQUESTED;
  }
  private async generateBookingCode(): Promise<string> {
    for (let attempt = 0; attempt < 5; attempt += 1) {
      const now = new Date();
      const stamp = [
        now.getUTCFullYear(),
        String(now.getUTCMonth() + 1).padStart(2, '0'),
        String(now.getUTCDate()).padStart(2, '0'),
        String(now.getUTCHours()).padStart(2, '0'),
        String(now.getUTCMinutes()).padStart(2, '0'),
        String(now.getUTCSeconds()).padStart(2, '0'),
      ].join('');

      const suffix = Math.random().toString(36).slice(2, 8).toUpperCase();
      const bookingCode = `DPB-${stamp}-${suffix}`;

      const existing = await this.prisma.tripBookingIntent.findUnique({
        where: { bookingCode },
        select: { id: true },
      });

      if (!existing) {
        return bookingCode;
      }
    }

    throw new BadRequestException('Unable to generate unique trip booking code.');
  }

  private requireEnumValue(
    enumObject: Record<string, string>,
    value: unknown,
    fieldName: string,
  ): string {
    if (typeof value !== 'string' || !Object.values(enumObject).includes(value)) {
      throw new BadRequestException(`${fieldName} is invalid.`);
    }

    return value;
  }

  private optionalEnumValue(
    enumObject: Record<string, string>,
    value: unknown,
    fallback: string,
    fieldName: string,
  ): string {
    if (value === undefined || value === null || value === '') {
      return fallback;
    }

    return this.requireEnumValue(enumObject, value, fieldName);
  }

  private toJsonInput(
    value: Record<string, unknown> | undefined,
  ): Prisma.NullableJsonNullValueInput | Prisma.InputJsonValue {
    return value === undefined ? Prisma.JsonNull : (value as Prisma.InputJsonValue);
  }

  private toContract(booking: TripBookingIntent): TripBookingIntentContract {
    return {
      id: booking.id,
      bookingCode: booking.bookingCode,
      productType: booking.productType,
      sourceChannel: booking.sourceChannel,
      pricingMode: booking.pricingMode,
      status: booking.status,
      requestedByUserId: booking.requestedByUserId ?? '',
      operatorRegistryId: booking.operatorRegistryId,
      commercialTermsId: booking.commercialTermsId,
      operatorTermsAcceptanceId: booking.operatorTermsAcceptanceId,
      title: booking.title,
      destinationName: booking.destinationName,
      routeCode: booking.routeCode,
      serviceDate: booking.serviceDate?.toISOString() ?? null,
      paxCount: booking.paxCount,
      currencyCode: booking.currencyCode,
      estimatedAmount: booking.estimatedAmount?.toString() ?? null,
      confirmedAmount: booking.confirmedAmount?.toString() ?? null,
      backendOwned: true,
      frontendMayOnlyRequestIntent: true,
      fakeBookingAllowed: false,
      flatOperatorListAllowed: false,
      commercialTermsAcceptanceRequired: true,
      governedOperatorFulfillmentRequired: true,
      createdAt: booking.createdAt.toISOString(),
      updatedAt: booking.updatedAt.toISOString(),
    };
  }
}