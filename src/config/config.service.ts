import { Injectable } from '@nestjs/common';
import { z } from 'zod';

const configSchema = z.object({
  // App
  PORT: z.string().default('3000'),
  DEFAULT_TIMEZONE: z.string().default('America/Puerto_Rico'),

  // Database
  DATABASE_URL: z.string(),

  // Redis
  REDIS_URL: z.string(),

  // Auth/Security
  JWT_ACCESS_SECRET: z.string(),
  JWT_ACCESS_EXPIRES: z.string().default('15m'),
  JWT_REFRESH_SECRET: z.string(),
  JWT_REFRESH_EXPIRES: z.string().default('7d'),
  BCRYPT_SALT_ROUNDS: z.string().default('10'),

  // Zapier
  ZAPIER_HOOK_URL: z.string().optional(),
});

type ConfigSchema = z.infer<typeof configSchema>;

@Injectable()
export class ConfigService {
  private readonly config: ConfigSchema;

  constructor() {
    this.config = configSchema.parse(process.env);
  }

  static validate(config: Record<string, unknown>): ConfigSchema {
    return configSchema.parse(config);
  }

  get port(): number {
    return parseInt(this.config.PORT, 10);
  }

  get defaultTimezone(): string {
    return this.config.DEFAULT_TIMEZONE;
  }

  get databaseUrl(): string {
    return this.config.DATABASE_URL;
  }

  get redisUrl(): string {
    return this.config.REDIS_URL;
  }

  get jwtAccessSecret(): string {
    return this.config.JWT_ACCESS_SECRET;
  }

  get jwtAccessExpires(): string {
    return this.config.JWT_ACCESS_EXPIRES;
  }

  get jwtRefreshSecret(): string {
    return this.config.JWT_REFRESH_SECRET;
  }

  get jwtRefreshExpires(): string {
    return this.config.JWT_REFRESH_EXPIRES;
  }

  get bcryptSaltRounds(): number {
    return parseInt(this.config.BCRYPT_SALT_ROUNDS, 10);
  }

  get zapierHookUrl(): string | undefined {
    return this.config.ZAPIER_HOOK_URL;
  }
}
