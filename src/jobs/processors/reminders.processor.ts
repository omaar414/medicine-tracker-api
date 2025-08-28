import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { PrismaService } from '../../database/prisma.service';
import { NotificationsService } from '../../notifications/notifications.service';
import { ReminderJob } from '../jobs.service';

@Processor('reminders')
export class RemindersProcessor {
  private readonly logger = new Logger(RemindersProcessor.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsService: NotificationsService,
  ) {}

  @Process('send-reminder')
  async handleReminder(job: Job<ReminderJob>): Promise<void> {
    const { userId, medicineId, scheduledAt } = job.data;

    try {
      // Get user and medicine details
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      const medicine = await this.prisma.medicine.findUnique({
        where: { id: medicineId },
      });

      if (!user || !medicine) {
        this.logger.warn(`User or medicine not found for reminder job: ${job.id}`);
        return;
      }

      // Check if user has email enabled
      if (!user.emailEnabled) {
        this.logger.log(`Email disabled for user ${userId}, skipping reminder`);
        return;
      }

      // Check quiet hours
      if (this.isInQuietHours(user.quietHoursStart, user.quietHoursEnd)) {
        this.logger.log(`In quiet hours for user ${userId}, skipping reminder`);
        return;
      }

      // Generate confirmation and skip URLs
      const baseUrl = process.env.APP_URL || 'http://localhost:3000';
      const confirmUrl = `${baseUrl}/api/doses/confirm`;
      const skipUrl = `${baseUrl}/api/doses/skip`;

      // Generate and send email
      const notification = this.notificationsService.generateDoseReminderEmail(
        user.email,
        user.fullName,
        medicine.name,
        medicine.dose,
        medicine.unit,
        new Date(scheduledAt).toLocaleString(),
        confirmUrl,
        skipUrl,
      );

      await this.notificationsService.sendEmail(notification);
      this.logger.log(`Reminder sent to ${user.email} for medicine ${medicine.name}`);

    } catch (error) {
      this.logger.error(`Failed to process reminder job ${job.id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  private isInQuietHours(start?: string, end?: string): boolean {
    if (!start || !end) return false;

    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    const [startHour, startMinute] = start.split(':').map(Number);
    const [endHour, endMinute] = end.split(':').map(Number);

    const startTime = startHour * 60 + startMinute;
    const endTime = endHour * 60 + endMinute;

    if (startTime <= endTime) {
      return currentTime >= startTime && currentTime <= endTime;
    } else {
      // Quiet hours span midnight
      return currentTime >= startTime || currentTime <= endTime;
    }
  }
}
