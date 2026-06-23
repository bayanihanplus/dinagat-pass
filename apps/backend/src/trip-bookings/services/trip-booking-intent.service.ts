import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import {
  TermsAcceptanceStatus,
  TripBookingIntent,
  TripBookingIntentStatus,
  TripBookingPricingMode,
  TripBookingProductType,
  TripBookingSourceChannel,
} from '@prisma/client';

import { PrismaService } from '../../prisma/prisma.service';
import {
  CreateTripBookingIntentRequestContract,
  TripBookingIntentContract,
  TripBookingIntentCreateResponseContract,
} from '../contracts/trip-booking-intent.contract';
import {
  AdminTripBookingReviewActionRequestContract,
  AdminTripBookingReviewActionResponseContract,
  AdminTripBookingReviewDetailContract,
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

  async createIntent(
    body: CreateTripBookingIntentRequestContract,
    auth: AuthenticatedRequestContext,
  ): Promise<TripBookingIntentCreateResponseContract> {
    const requestedByUserId = auth.userId?.trim();

    if (!requestedByUserId) {
      throw new BadRequestException('Authenticated user context is required.');
    }

    const title = body.title?.trim();
    if (!title) {
      throw new BadRequestException('Trip booking title is required.');
    }

    const productType = this.requireEnumValue(
      TripBookingProductType,
      body.productType,
      'productType',
    ) as TripBookingProductType;

    const pricingMode = this.requireEnumValue(
      TripBookingPricingMode,
      body.pricingMode,
      'pricingMode',
    ) as TripBookingPricingMode;

    const sourceChannel = this.optionalEnumValue(
      TripBookingSourceChannel,
      body.sourceChannel,
      TripBookingSourceChannel.DIRECT_TRAVELER,
      'sourceChannel',
    ) as TripBookingSourceChannel;

    const paxCount = Number.isInteger(body.paxCount) && Number(body.paxCount) > 0
      ? Number(body.paxCount)
      : 1;

    let operatorRegistryId: string | null = body.operatorRegistryId?.trim() || null;
    let commercialTermsId: string | null = body.commercialTermsId?.trim() || null;
    let operatorTermsAcceptanceId: string | null =
      body.operatorTermsAcceptanceId?.trim() || null;

    if (operatorRegistryId) {
      if (!operatorTermsAcceptanceId) {
        throw new BadRequestException(
          'operatorTermsAcceptanceId is required when operatorRegistryId is provided.',
        );
      }

      const acceptance = await this.prisma.operatorTermsAcceptance.findUnique({
        where: { id: operatorTermsAcceptanceId },
      });

      if (!acceptance) {
        throw new NotFoundException('Operator terms acceptance was not found.');
      }

      if (acceptance.status !== TermsAcceptanceStatus.ACTIVE) {
        throw new BadRequestException('Operator terms acceptance must be ACTIVE.');
      }

      if (acceptance.operatorRegistryId !== operatorRegistryId) {
        throw new BadRequestException(
          'Operator terms acceptance does not belong to the provided operator registry.',
        );
      }

      commercialTermsId = acceptance.commercialTermsId;
      operatorRegistryId = acceptance.operatorRegistryId;
      operatorTermsAcceptanceId = acceptance.id;
    }

    const booking = await this.prisma.tripBookingIntent.create({
      data: {
        bookingCode: await this.generateBookingCode(),
        productType,
        sourceChannel,
        pricingMode,
        status: TripBookingIntentStatus.REQUESTED,
        requestedByUserId,
        operatorRegistryId,
        commercialTermsId,
        operatorTermsAcceptanceId,
        title,
        destinationName: body.destinationName?.trim() || null,
        routeCode: body.routeCode?.trim() || null,
        serviceDate: body.serviceDate ? new Date(body.serviceDate) : null,
        paxCount,
        currencyCode: body.currencyCode?.trim() || 'PHP',
        estimatedAmount: body.estimatedAmount ?? null,
        travelerRequestJson: this.toJsonInput(body.travelerRequestJson),
        sourceAttributionJson: this.toJsonInput(body.sourceAttributionJson),
        metadata: this.toJsonInput(body.metadata),
        backendOwned: true,
        frontendMayOnlyRequestIntent: true,
        fakeBookingAllowed: false,
        flatOperatorListAllowed: false,
        commercialTermsAcceptanceRequired: true,
        governedOperatorFulfillmentRequired: true,
      },
    });

    return {
      created: true,
      backendOwned: true,
      frontendOwnsBookingAuthority: false,
      frontendOwnsOperatorSelection: false,
      frontendOwnsPaymentAuthority: false,
      requestedByUserIdSource: 'backend-auth-context',
      fakeBookingAllowed: false,
      flatOperatorListAllowed: false,
      operatorTermsAcceptanceRequiredWhenOperatorProvided: true,
      booking: this.toContract(booking),
    };
  }

  async getByBookingCode(bookingCode: string): Promise<TripBookingIntentContract> {
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

    return this.toContract(booking);
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