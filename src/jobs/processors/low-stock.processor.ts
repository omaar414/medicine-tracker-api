import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { PrismaService } from '../../database/prisma.service';
import { NotificationsService } from '../../notifications/notifications.service';
import { LowStockJob } from '../jobs.service';

@Processor('low-stock')
export class LowStockProcessor {
  private readonly logger = new Logger(LowStockProcessor.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsService: NotificationsService,
  ) {}

  @Process('send-low-stock-alert')
  async handleLowStock(job: Job<LowStockJob>): Promise<void> {
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
        this.logger.warn(`User, medicine, or inventory not found for low stock job: ${job.id}`);
        return;
      }

      // Check if user has email enabled
      if (!user.emailEnabled) {
        this.logger.log(`Email disabled for user ${userId}, skipping low stock alert`);
        return;
      }

      // Check if inventory is actually low
      if (medicine.inventory.currentPills > medicine.inventory.lowThreshold) {
        this.logger.log(`Inventory not low for medicine ${medicineId}, skipping alert`);
        return;
      }

      // Generate and send email
      const notification = this.notificationsService.generateLowStockEmail(
        user.email,
        user.fullName,
        medicine.name,
      );

      await this.notificationsService.sendEmail(notification);
      this.logger.log(`Low stock alert sent to ${user.email} for medicine ${medicine.name}`);

    } catch (error) {
      this.logger.error(`Failed to process low stock job ${job.id}: ${error.message}`, error.stack);
      throw error;
    }
  }
}
