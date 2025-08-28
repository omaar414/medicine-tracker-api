import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean, Matches } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ example: 'John Doe', required: false })
  @IsString()
  @IsOptional()
  fullName?: string;

  @ApiProperty({ example: 'America/Puerto_Rico', required: false })
  @IsString()
  @IsOptional()
  timezone?: string;

  @ApiProperty({ example: true, required: false })
  @IsBoolean()
  @IsOptional()
  emailEnabled?: boolean;

  @ApiProperty({ example: '22:00', required: false, pattern: '^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$' })
  @IsString()
  @IsOptional()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: 'quietHoursStart must be in HH:mm format' })
  quietHoursStart?: string;

  @ApiProperty({ example: '08:00', required: false, pattern: '^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$' })
  @IsString()
  @IsOptional()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: 'quietHoursEnd must be in HH:mm format' })
  quietHoursEnd?: string;
}

export class UserResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  fullName: string;

  @ApiProperty()
  timezone: string;

  @ApiProperty()
  emailEnabled: boolean;

  @ApiProperty()
  quietHoursStart?: string;

  @ApiProperty()
  quietHoursEnd?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
