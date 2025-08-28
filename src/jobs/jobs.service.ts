import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bullmq';

export interface ReminderJob {
  userId: string;
  medicineId: string;
  scheduledAt: string;
}

export interface LowStockJob {
  userId: string;
  medicineId: string;
}

export interface LastRefillJob {
  userId: string;
  medicineId: string;
}

@Injectable()
export class JobsService {
  private readonly logger = new Logger(JobsService.name);

  constructor(
    @InjectQueue('reminders') private readonly remindersQueue: Queue,
    @InjectQueue('low-stock') private readonly lowStockQueue: Queue,
    @InjectQueue('last-refill') private readonly lastRefillQueue: Queue,
  ) {}

  async addReminderJob(job: ReminderJob): Promise<void> {
    await this.remindersQueue.add('send-reminder', job, {
      delay: this.calculateDelay(job.scheduledAt),
    });
    this.logger.log(`Added reminder job for medicine ${job.medicineId} at ${job.scheduledAt}`);
  }

  async addLowStockJob(job: LowStockJob): Promise<void> {
    await this.lowStockQueue.add('send-low-stock-alert', job);
    this.logger.log(`Added low stock job for medicine ${job.medicineId}`);
  }

  async addLastRefillJob(job: LastRefillJob): Promise<void> {
    await this.lastRefillQueue.add('send-last-refill-alert', job);
    this.logger.log(`Added last refill job for medicine ${job.medicineId}`);
  }

  private calculateDelay(scheduledAt: string): number {
    const scheduledTime = new Date(scheduledAt).getTime();
    const now = Date.now();
    const delay = scheduledTime - now;
    return Math.max(0, delay);
  }
}
