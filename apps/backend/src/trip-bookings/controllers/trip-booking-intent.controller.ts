import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';

import { AuthRequiredGuard } from '../../auth/guards/auth-required.guard';
import { CreateTripBookingIntentRequestContract } from '../contracts/trip-booking-intent.contract';
import { TripBookingIntentService } from '../services/trip-booking-intent.service';

type AuthenticatedRequest = {
  auth?: {
    userId?: string;
  };
};

@Controller('trip-bookings')
export class TripBookingIntentController {
  constructor(private readonly tripBookingIntentService: TripBookingIntentService) {}

  @Post('intent')
  @UseGuards(AuthRequiredGuard)
  async createIntent(
    @Body() body: CreateTripBookingIntentRequestContract,
    @Req() request: AuthenticatedRequest,
  ) {
    const userId = request.auth?.userId;

    if (userId) {
      return this.tripBookingIntentService.createIntent(body, { userId });
    }

    return this.tripBookingIntentService.createIntent(body, {});
  }

  @Get('intent/:bookingCode')
  @UseGuards(AuthRequiredGuard)
  async getIntentByBookingCode(@Param('bookingCode') bookingCode: string) {
    return this.tripBookingIntentService.getByBookingCode(bookingCode);
  }
}