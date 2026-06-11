import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { TripBookingIntentController } from './controllers/trip-booking-intent.controller';
import { TripBookingReadinessController } from './controllers/trip-booking-readiness.controller';
import { TripBookingIntentService } from './services/trip-booking-intent.service';
import { TripBookingReadinessService } from './services/trip-booking-readiness.service';

@Module({
  imports: [AuthModule],
  controllers: [TripBookingReadinessController, TripBookingIntentController],
  providers: [TripBookingReadinessService, TripBookingIntentService],
})
export class TripBookingModule {}