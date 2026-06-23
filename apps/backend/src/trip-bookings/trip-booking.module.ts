import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { TripBookingIntentController } from './controllers/trip-booking-intent.controller';
import { AdminTripBookingReviewController } from './controllers/admin-trip-booking-review.controller';
import { TripBookingReadinessController } from './controllers/trip-booking-readiness.controller';
import { TripBookingIntentService } from './services/trip-booking-intent.service';
import { TripBookingReadinessService } from './services/trip-booking-readiness.service';

@Module({
  imports: [AuthModule],
  controllers: [TripBookingReadinessController, TripBookingIntentController, AdminTripBookingReviewController],
  providers: [TripBookingReadinessService, TripBookingIntentService],
})
export class TripBookingModule {}