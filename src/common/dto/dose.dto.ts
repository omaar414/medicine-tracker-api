import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDateString } from 'class-validator';

export class ConfirmDoseDto {
  @ApiProperty()
  @IsString()
  medicineId: string;

  @ApiProperty({ example: '2024-01-01T08:00:00Z' })
  @IsDateString()
  scheduledAt: string;
}

export class SkipDoseDto {
  @ApiProperty()
  @IsString()
  medicineId: string;

  @ApiProperty({ example: '2024-01-01T08:00:00Z' })
  @IsDateString()
  scheduledAt: string;
}

export class NextDoseDto {
  @ApiProperty({ example: '2024-01-01T00:00:00Z' })
  @IsDateString()
  from: string;

  @ApiProperty({ example: '2024-01-02T00:00:00Z' })
  @IsDateString()
  to: string;
}

export class DoseResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  medicineId: string;

  @ApiProperty()
  scheduledAt: Date;

  @ApiProperty()
  takenAt?: Date;

  @ApiProperty({ enum: ['SCHEDULED', 'TAKEN', 'MISSED', 'SKIPPED'] })
  status: string;

  @ApiProperty()
  createdAt: Date;
}
