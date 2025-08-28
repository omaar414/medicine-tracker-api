import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, Min, Max, IsArray } from 'class-validator';

export class CreateMedicineDto {
  @ApiProperty({ example: 'Aspirin' })
  @IsString()
  name: string;

  @ApiProperty({ example: 325 })
  @IsNumber()
  @Min(0)
  dose: number;

  @ApiProperty({ example: 'mg' })
  @IsString()
  unit: string;

  @ApiProperty({ example: 'Take with food', required: false })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiProperty({ example: ['Headache', 'Fever'], required: false, description: 'Array of symptoms' })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  symptoms?: string[];

  @ApiProperty({ example: 30, required: false })
  @IsNumber()
  @IsOptional()
  @Min(0)
  refillsTotal?: number;
}

export class UpdateMedicineDto {
  @ApiProperty({ example: 'Aspirin', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ example: 325, required: false })
  @IsNumber()
  @IsOptional()
  @Min(0)
  dose?: number;

  @ApiProperty({ example: 'mg', required: false })
  @IsString()
  @IsOptional()
  unit?: string;

  @ApiProperty({ example: 'Take with food', required: false })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiProperty({ example: ['Headache', 'Fever'], required: false })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  symptoms?: string[];
}

export class MedicineResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  dose: number;

  @ApiProperty()
  unit: string;

  @ApiProperty()
  notes?: string;

  @ApiProperty()
  symptoms: string[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
