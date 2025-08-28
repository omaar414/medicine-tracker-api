import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateScheduleDto, UpdateScheduleDto, ScheduleResponseDto } from '../common/dto/schedule.dto';

@Injectable()
export class SchedulesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllByMedicine(medicineId: string, userId: string): Promise<ScheduleResponseDto[]> {
    // Verify medicine belongs to user
    const medicine = await this.prisma.medicine.findFirst({
      where: { id: medicineId, userId },
    });

    if (!medicine) {
      throw new NotFoundException('Medicine not found');
    }

    const schedules = await this.prisma.schedule.findMany({
      where: { medicineId },
      orderBy: { createdAt: 'desc' },
    });

    return schedules.map(this.mapToResponseDto);
  }

  async findOne(id: string, userId: string): Promise<ScheduleResponseDto> {
    const schedule = await this.prisma.schedule.findUnique({
      where: { id },
      include: { medicine: true },
    });

    if (!schedule) {
      throw new NotFoundException('Schedule not found');
    }

    if (schedule.medicine.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return this.mapToResponseDto(schedule);
  }

  async create(medicineId: string, userId: string, createScheduleDto: CreateScheduleDto): Promise<ScheduleResponseDto> {
    // Verify medicine belongs to user
    const medicine = await this.prisma.medicine.findFirst({
      where: { id: medicineId, userId },
    });

    if (!medicine) {
      throw new NotFoundException('Medicine not found');
    }

    const schedule = await this.prisma.schedule.create({
      data: {
        ...createScheduleDto,
        medicineId,
      },
    });

    return this.mapToResponseDto(schedule);
  }

  async update(id: string, userId: string, updateScheduleDto: UpdateScheduleDto): Promise<ScheduleResponseDto> {
    // Check if schedule exists and belongs to user
    await this.findOne(id, userId);

    const schedule = await this.prisma.schedule.update({
      where: { id },
      data: updateScheduleDto,
    });

    return this.mapToResponseDto(schedule);
  }

  async remove(id: string, userId: string): Promise<void> {
    // Check if schedule exists and belongs to user
    await this.findOne(id, userId);

    await this.prisma.schedule.delete({
      where: { id },
    });
  }

  private mapToResponseDto(schedule: any): ScheduleResponseDto {
    return {
      id: schedule.id,
      medicineId: schedule.medicineId,
      timesOfDay: schedule.timesOfDay,
      startDate: schedule.startDate,
      endDate: schedule.endDate,
      daysOfWeek: schedule.daysOfWeek,
      createdAt: schedule.createdAt,
    };
  }
}
