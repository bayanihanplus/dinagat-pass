import { Module } from '@nestjs/common';
import { TripBookingReadinessController } from './controllers';
import { TripBookingReadinessService } from './services';

@Module({
  controllers: [TripBookingReadinessController],
  providers: [TripBookingReadinessService],
  exports: [TripBookingReadinessService],
})
export class TripBookingModule {}
