import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { SchedulesService } from './schedules.service';
import { CreateScheduleDto, UpdateScheduleDto, ScheduleResponseDto } from '../common/dto/schedule.dto';

@ApiTags('Schedules')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('medicines/:medicineId/schedules')
export class SchedulesController {
  constructor(private readonly schedulesService: SchedulesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all schedules for a medicine' })
  @ApiParam({ name: 'medicineId', description: 'Medicine ID' })
  @ApiResponse({ status: 200, description: 'Schedules retrieved successfully', type: [ScheduleResponseDto] })
  async findAll(@Param('medicineId') medicineId: string, @CurrentUser() user: any): Promise<ScheduleResponseDto[]> {
    return this.schedulesService.findAllByMedicine(medicineId, user.id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new schedule for a medicine' })
  @ApiParam({ name: 'medicineId', description: 'Medicine ID' })
  @ApiResponse({ status: 201, description: 'Schedule created successfully', type: ScheduleResponseDto })
  async create(
    @Param('medicineId') medicineId: string,
    @CurrentUser() user: any,
    @Body() createScheduleDto: CreateScheduleDto,
  ): Promise<ScheduleResponseDto> {
    return this.schedulesService.create(medicineId, user.id, createScheduleDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a schedule' })
  @ApiParam({ name: 'medicineId', description: 'Medicine ID' })
  @ApiParam({ name: 'id', description: 'Schedule ID' })
  @ApiResponse({ status: 200, description: 'Schedule updated successfully', type: ScheduleResponseDto })
  async update(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body() updateScheduleDto: UpdateScheduleDto,
  ): Promise<ScheduleResponseDto> {
    return this.schedulesService.update(id, user.id, updateScheduleDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a schedule' })
  @ApiParam({ name: 'medicineId', description: 'Medicine ID' })
  @ApiParam({ name: 'id', description: 'Schedule ID' })
  @ApiResponse({ status: 200, description: 'Schedule deleted successfully' })
  async remove(@Param('id') id: string, @CurrentUser() user: any): Promise<void> {
    return this.schedulesService.remove(id, user.id);
  }
}
