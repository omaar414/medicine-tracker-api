import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray } from 'class-validator';

export class AddSymptomDto {
  @ApiProperty({ example: 'Reduced headache' })
  @IsString()
  symptom: string;
}

export class AddMultipleSymptomsDto {
  @ApiProperty({ example: ['Reduced headache', 'Better sleep'] })
  @IsArray()
  @IsString({ each: true })
  symptoms: string[];
}

export class RemoveSymptomDto {
  @ApiProperty({ example: 'Headache' })
  @IsString()
  symptom: string;
}
