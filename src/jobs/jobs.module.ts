import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { JobsService } from './jobs.service';
import { RemindersProcessor } from './processors/reminders.processor';
import { LowStockProcessor } from './processors/low-stock.processor';
import { LastRefillProcessor } from './processors/last-refill.processor';

@Module({
  imports: [
    BullModule.registerQueue(
      { name: 'reminders' },
      { name: 'low-stock' },
      { name: 'last-refill' },
    ),
  ],
  providers: [JobsService, RemindersProcessor, LowStockProcessor, LastRefillProcessor],
  exports: [JobsService],
})
export class JobsModule {}
