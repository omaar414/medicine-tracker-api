import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { ConfigService } from '../config/config.service';
import Redis from 'ioredis';

export interface HealthStatus {
  status: 'ok' | 'error';
  timestamp: string;
  services: {
    database: {
      status: 'ok' | 'error';
      message?: string;
    };
    redis: {
      status: 'ok' | 'error';
      message?: string;
    };
  };
}

@Injectable()
export class HealthService {
  private readonly logger = new Logger(HealthService.name);
  private redis: Redis;

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {
    this.redis = new Redis(this.configService.redisUrl);
  }

  async checkHealth(): Promise<HealthStatus> {
    const timestamp = new Date().toISOString();
    const databaseStatus = await this.checkDatabase();
    const redisStatus = await this.checkRedis();

    const overallStatus = databaseStatus.status === 'ok' && redisStatus.status === 'ok' ? 'ok' : 'error';

    return {
      status: overallStatus,
      timestamp,
      services: {
        database: databaseStatus,
        redis: redisStatus,
      },
    };
  }

  private async checkDatabase(): Promise<{ status: 'ok' | 'error'; message?: string }> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return { status: 'ok' };
    } catch (error) {
      this.logger.error('Database health check failed', error);
      return { status: 'error', message: error.message };
    }
  }

  private async checkRedis(): Promise<{ status: 'ok' | 'error'; message?: string }> {
    try {
      await this.redis.ping();
      return { status: 'ok' };
    } catch (error) {
      this.logger.error('Redis health check failed', error);
      return { status: 'error', message: error.message };
    }
  }
}
