import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '../config/config.service';
import axios from 'axios';

export interface EmailNotification {
  to: string;
  subject: string;
  html: string;
}

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(private readonly configService: ConfigService) {}

  async sendEmail(notification: EmailNotification): Promise<void> {
    const zapierHookUrl = this.configService.zapierHookUrl;
    
    if (!zapierHookUrl) {
      this.logger.warn('Zapier hook URL not configured, skipping email notification');
      return;
    }

    try {
      await axios.post(zapierHookUrl, notification, {
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      this.logger.log(`Email notification sent to ${notification.to}`);
    } catch (error) {
      this.logger.error(`Failed to send email notification: ${error.message}`, error.stack);
      throw new Error('Failed to send email notification');
    }
  }

  generateDoseReminderEmail(
    userEmail: string,
    userName: string,
    medicineName: string,
    dose: number,
    unit: string,
    scheduledTime: string,
    confirmUrl: string,
    skipUrl: string,
  ): EmailNotification {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Medication Reminder</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #4CAF50; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .button { display: inline-block; padding: 12px 24px; margin: 10px; text-decoration: none; border-radius: 5px; font-weight: bold; }
          .confirm { background: #4CAF50; color: white; }
          .skip { background: #f44336; color: white; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>💊 Medication Reminder</h1>
          </div>
          <div class="content">
            <h2>Hello ${userName},</h2>
            <p>It's time to take your medication:</p>
            <div style="background: white; padding: 20px; border-radius: 5px; margin: 20px 0;">
              <h3>${medicineName}</h3>
              <p><strong>Dose:</strong> ${dose} ${unit}</p>
              <p><strong>Scheduled for:</strong> ${scheduledTime}</p>
            </div>
            <div style="text-align: center;">
              <a href="${confirmUrl}" class="button confirm">✅ Confirm Taken</a>
              <a href="${skipUrl}" class="button skip">⏭️ Skip Dose</a>
            </div>
          </div>
          <div class="footer">
            <p>This is an automated reminder from your Medicine Tracker app.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return {
      to: userEmail,
      subject: `Medication Reminder: ${medicineName}`,
      html,
    };
  }

  generateLowStockEmail(userEmail: string, userName: string, medicineName: string): EmailNotification {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Low Stock Alert</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #ff9800; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>⚠️ Low Stock Alert</h1>
          </div>
          <div class="content">
            <h2>Hello ${userName},</h2>
            <p>Your medication <strong>${medicineName}</strong> is running low on stock.</p>
            <p>Please refill your prescription soon to avoid missing doses.</p>
          </div>
          <div class="footer">
            <p>This is an automated alert from your Medicine Tracker app.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return {
      to: userEmail,
      subject: `Low Stock Alert: ${medicineName}`,
      html,
    };
  }

  generateLastRefillEmail(userEmail: string, userName: string, medicineName: string): EmailNotification {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Last Refill Alert</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #f44336; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🚨 Last Refill Alert</h1>
          </div>
          <div class="content">
            <h2>Hello ${userName},</h2>
            <p>You're on your last refill for <strong>${medicineName}</strong>.</p>
            <p>Please schedule an appointment with your doctor to get a new prescription.</p>
          </div>
          <div class="footer">
            <p>This is an automated alert from your Medicine Tracker app.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return {
      to: userEmail,
      subject: `Last Refill Alert: ${medicineName}`,
      html,
    };
  }
}
