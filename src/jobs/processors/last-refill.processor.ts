import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { PrismaService } from '../../database/prisma.service';
import { NotificationsService } from '../../notifications/notifications.service';
import { LastRefillJob } from '../jobs.service';

@Processor('last-refill')
export class LastRefillProcessor {
  private readonly logger = new Logger(LastRefillProcessor.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsService: NotificationsService,
  ) {}

  @Process('send-last-refill-alert')
  async handleLastRefill(job: Job<LastRefillJob>): Promise<void> {
    const { userId, medicineId } = job.data;

    try {
      // Get user and medicine details
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      const medicine = await this.prisma.medicine.findUnique({
        where: { id: medicineId },
        include: { inventory: true },
      });

      if (!user || !medicine || !medicine.inventory) {
        this.logger.warn(`User, medicine, or inventory not found for last refill job: ${job.id}`);
        return;
      }

      // Check if user has email enabled
      if (!user.emailEnabled) {
        this.logger.log(`Email disabled for user ${userId}, skipping last refill alert`);
        return;
      }

      // Check if this is actually the last refill
      const remainingRefills = medicine.inventory.refillsTotal - medicine.inventory.refillsUsed;
      if (remainingRefills > 1) {
        this.logger.log(`Not last refill for medicine ${medicineId}, skipping alert`);
        return;
      }

      // Generate and send email
      const notification = this.notificationsService.generateLastRefillEmail(
        user.email,
        user.fullName,
        medicine.name,
      );

      await this.notificationsService.sendEmail(notification);
      this.logger.log(`Last refill alert sent to ${user.email} for medicine ${medicine.name}`);

    } catch (error) {
      this.logger.error(`Failed to process last refill job ${job.id}: ${error.message}`, error.stack);
      throw error;
    }
  }
}
