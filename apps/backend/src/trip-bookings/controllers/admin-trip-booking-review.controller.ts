import { Body, Controller, Get, Param, Patch, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { AuthRequiredGuard } from '../../auth';
import { RequestWithAuthContext } from '../../auth/contracts/auth-context';
import { AdminTripBookingReviewActionRequestContract } from '../contracts/trip-booking-review-action.contract';
import { TripBookingIntentService } from '../services/trip-booking-intent.service';

@Controller('admin/trip-bookings')
@UseGuards(AuthRequiredGuard)
export class AdminTripBookingReviewController {
  constructor(private readonly tripBookingIntentService: TripBookingIntentService) {}

  @Get('intent/:bookingCode/detail')
  async getReviewDetail(
    @Param('bookingCode') bookingCode: string,
    @Req() request: RequestWithAuthContext
  ) {
    this.requireAdminActor(request);

    return this.tripBookingIntentService.getAdminReviewDetail(bookingCode);
  }

  @Patch('intent/:bookingCode/review-action')
  async applyReviewAction(
    @Param('bookingCode') bookingCode: string,
    @Body() body: AdminTripBookingReviewActionRequestContract,
    @Req() request: RequestWithAuthContext
  ) {
    const actor = this.requireAdminActor(request);

    return this.tripBookingIntentService.applyAdminReviewAction(bookingCode, body, {
      userId: actor.userId,
      role: actor.role
    });
  }

  private requireAdminActor(request: RequestWithAuthContext): { userId: string; role: UserRole } {
    const actor = request.auth;

    if (!actor?.userId || !actor.role) {
      throw new UnauthorizedException('Backend admin auth context is required.');
    }

    if (actor.role !== UserRole.ADMIN && actor.role !== UserRole.SUPER_ADMIN) {
      throw new UnauthorizedException('Backend admin role is required.');
    }

    return {
      userId: actor.userId,
      role: actor.role
    };
  }
}