import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { DosesService } from './doses.service';
import { ConfirmDoseDto, SkipDoseDto, NextDoseDto, DoseResponseDto } from '../common/dto/dose.dto';

@ApiTags('Doses')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('doses')
export class DosesController {
  constructor(private readonly dosesService: DosesService) {}

  @Get('medicines/:medicineId/next-doses')
  @ApiOperation({ summary: 'Get next doses for a medicine' })
  @ApiParam({ name: 'medicineId', description: 'Medicine ID' })
  @ApiQuery({ name: 'from', description: 'Start date (ISO string)' })
  @ApiQuery({ name: 'to', description: 'End date (ISO string)' })
  @ApiResponse({ status: 200, description: 'Next doses retrieved successfully', type: [DoseResponseDto] })
  async getNextDoses(
    @Param('medicineId') medicineId: string,
    @CurrentUser() user: any,
    @Query() nextDoseDto: NextDoseDto,
  ): Promise<DoseResponseDto[]> {
    return this.dosesService.getNextDoses(medicineId, user.id, nextDoseDto);
  }

  @Post('confirm')
  @ApiOperation({ summary: 'Confirm a dose was taken' })
  @ApiResponse({ status: 201, description: 'Dose confirmed successfully', type: DoseResponseDto })
  async confirmDose(
    @CurrentUser() user: any,
    @Body() confirmDoseDto: ConfirmDoseDto,
  ): Promise<DoseResponseDto> {
    return this.dosesService.confirmDose(user.id, confirmDoseDto);
  }

  @Post('skip')
  @ApiOperation({ summary: 'Skip a dose' })
  @ApiResponse({ status: 201, description: 'Dose skipped successfully', type: DoseResponseDto })
  async skipDose(
    @CurrentUser() user: any,
    @Body() skipDoseDto: SkipDoseDto,
  ): Promise<DoseResponseDto> {
    return this.dosesService.skipDose(user.id, skipDoseDto);
  }
}
