import { UserRole } from '@prisma/client';

import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';

import { RequestWithAuthContext } from '../../auth/contracts/auth-context';
import { RequireRoles } from '../../auth/decorators/roles.decorator';
import { AuthRequiredGuard } from '../../auth/guards/auth-required.guard';
import { RoleGuard } from '../../auth/guards/role.guard';
import { CreateTravelerTripRequestContract } from '../contracts/trip-booking-intent.contract';
import { TripBookingIntentService } from '../services/trip-booking-intent.service';

@Controller('trip-bookings')
@UseGuards(AuthRequiredGuard, RoleGuard)
@RequireRoles(UserRole.TRAVELER)
export class TripBookingIntentController {
  constructor(private readonly tripBookingIntentService: TripBookingIntentService) {}

  @Post('intent')
  async createTravelerIntent(
    @Body() body: CreateTravelerTripRequestContract,
    @Req() request: RequestWithAuthContext,
  ) {
    const userId = this.requireAuthenticatedUserId(request);

    return this.tripBookingIntentService.createTravelerIntent(body, {
      userId,
    });
  }

  @Get('intents/mine')
  async listMyIntents(@Req() request: RequestWithAuthContext) {
    const userId = this.requireAuthenticatedUserId(request);

    return this.tripBookingIntentService.listForTraveler(userId);
  }

  @Get('intent/:bookingCode')
  async getMyIntentByBookingCode(
    @Param('bookingCode') bookingCode: string,
    @Req() request: RequestWithAuthContext,
  ) {
    const userId = this.requireAuthenticatedUserId(request);

    return this.tripBookingIntentService.getForTravelerByBookingCode(
      bookingCode,
      userId,
    );
  }

  private requireAuthenticatedUserId(request: RequestWithAuthContext): string {
    const userId = request.auth?.userId?.trim();

    if (!userId) {
      throw new UnauthorizedException(
        'Backend traveler auth context is required.',
      );
    }

    return userId;
  }
}
