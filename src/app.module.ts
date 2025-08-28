import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { BullModule } from '@nestjs/bull';

import { ConfigService } from './config/config.service';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MedicinesModule } from './medicines/medicines.module';
import { SchedulesModule } from './schedules/schedules.module';
import { InventoryModule } from './inventory/inventory.module';
import { DosesModule } from './doses/doses.module';
import { NotificationsModule } from './notifications/notifications.module';
import { JobsModule } from './jobs/jobs.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: (config) => ConfigService.validate(config),
    }),
    ScheduleModule.forRoot(),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        redis: configService.redisUrl,
      }),
      inject: [ConfigService],
    }),
    DatabaseModule,
    AuthModule,
    UsersModule,
    MedicinesModule,
    SchedulesModule,
    InventoryModule,
    DosesModule,
    NotificationsModule,
    JobsModule,
    HealthModule,
  ],
})
export class AppModule {}
