import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, Min } from 'class-validator';

export class UpdateInventoryDto {
  @ApiProperty({ example: 15 })
  @IsNumber()
  @Min(0)
  currentPills: number;

  @ApiProperty({ example: 10 })
  @IsNumber()
  @Min(0)
  lowThreshold: number;

  @ApiProperty({ example: 30, required: false })
  @IsNumber()
  @IsOptional()
  @Min(0)
  refillsTotal?: number;

  @ApiProperty({ example: 2, required: false })
  @IsNumber()
  @IsOptional()
  @Min(0)
  refillsUsed?: number;
}

export class InventoryResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  medicineId: string;

  @ApiProperty()
  currentPills: number;

  @ApiProperty()
  lowThreshold: number;

  @ApiProperty()
  refillsTotal: number;

  @ApiProperty()
  refillsUsed: number;

  @ApiProperty()
  lastUpdatedAt: Date;
}
