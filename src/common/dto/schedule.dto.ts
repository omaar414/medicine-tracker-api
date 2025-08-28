import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsDateString, IsOptional, IsNumber, Min, Max, IsString } from 'class-validator';

export class CreateScheduleDto {
  @ApiProperty({ example: ['08:00', '20:00'], description: 'Array of times in HH:mm format' })
  @IsArray()
  @IsString({ each: true })
  timesOfDay: string[];

  @ApiProperty({ example: '2024-01-01' })
  @IsDateString()
  startDate: string;

  @ApiProperty({ example: '2024-12-31', required: false })
  @IsDateString()
  @IsOptional()
  endDate?: string;

  @ApiProperty({ example: [1, 2, 3, 4, 5], description: 'Array of days (0=Sunday, 6=Saturday)', required: false })
  @IsArray()
  @IsNumber({}, { each: true })
  @Min(0, { each: true })
  @Max(6, { each: true })
  @IsOptional()
  daysOfWeek?: number[];
}

export class UpdateScheduleDto {
  @ApiProperty({ example: ['08:00', '20:00'], required: false })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  timesOfDay?: string[];

  @ApiProperty({ example: '2024-01-01', required: false })
  @IsDateString()
  @IsOptional()
  startDate?: string;

  @ApiProperty({ example: '2024-12-31', required: false })
  @IsDateString()
  @IsOptional()
  endDate?: string;

  @ApiProperty({ example: [1, 2, 3, 4, 5], required: false })
  @IsArray()
  @IsNumber({}, { each: true })
  @Min(0, { each: true })
  @Max(6, { each: true })
  @IsOptional()
  daysOfWeek?: number[];
}

export class ScheduleResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  medicineId: string;

  @ApiProperty()
  timesOfDay: string[];

  @ApiProperty()
  startDate: Date;

  @ApiProperty()
  endDate?: Date;

  @ApiProperty()
  daysOfWeek?: number[];

  @ApiProperty()
  createdAt: Date;
}
