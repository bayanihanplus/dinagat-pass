import { Controller, Get } from '@nestjs/common';
import { TripBookingReadinessService } from '../services';
import type { TripBookingReadinessContract } from '../contracts';

@Controller('trip-bookings')
export class TripBookingReadinessController {
  constructor(private readonly readinessService: TripBookingReadinessService) {}

  @Get('readiness')
  getReadiness(): TripBookingReadinessContract {
    return this.readinessService.getReadiness();
  }
}
