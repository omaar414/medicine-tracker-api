import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { ConfirmDoseDto, SkipDoseDto, NextDoseDto, DoseResponseDto } from '../common/dto/dose.dto';

@Injectable()
export class DosesService {
  constructor(private readonly prisma: PrismaService) {}

  async getNextDoses(medicineId: string, userId: string, nextDoseDto: NextDoseDto): Promise<DoseResponseDto[]> {
    // Verify medicine belongs to user
    const medicine = await this.prisma.medicine.findFirst({
      where: { id: medicineId, userId },
      include: { schedules: true },
    });

    if (!medicine) {
      throw new NotFoundException('Medicine not found');
    }

    const { from, to } = nextDoseDto;
    const fromDate = new Date(from);
    const toDate = new Date(to);

    // Get all dose logs in the date range
    const doseLogs = await this.prisma.doseLog.findMany({
      where: {
        medicineId,
        scheduledAt: {
          gte: fromDate,
          lte: toDate,
        },
      },
      orderBy: { scheduledAt: 'asc' },
    });

    return doseLogs.map(this.mapToResponseDto);
  }

  async confirmDose(userId: string, confirmDoseDto: ConfirmDoseDto): Promise<DoseResponseDto> {
    const { medicineId, scheduledAt } = confirmDoseDto;

    // Verify medicine belongs to user
    const medicine = await this.prisma.medicine.findFirst({
      where: { id: medicineId, userId },
      include: { inventory: true },
    });

    if (!medicine) {
      throw new NotFoundException('Medicine not found');
    }

    const scheduledDateTime = new Date(scheduledAt);

    // Use transaction to ensure data consistency
    return await this.prisma.$transaction(async (prisma: any) => {
      // Update or create dose log
      const doseLog = await prisma.doseLog.upsert({
        where: {
          medicineId_scheduledAt: {
            medicineId,
            scheduledAt: scheduledDateTime,
          },
        },
        update: {
          status: 'TAKEN',
          takenAt: new Date(),
        },
        create: {
          medicineId,
          scheduledAt: scheduledDateTime,
          status: 'TAKEN',
          takenAt: new Date(),
        },
      });

      // Decrement inventory if it exists
      if (medicine.inventory) {
        await prisma.inventory.update({
          where: { medicineId },
          data: {
            currentPills: Math.max(0, medicine.inventory.currentPills - 1),
            lastUpdatedAt: new Date(),
          },
        });
      }

      return this.mapToResponseDto(doseLog);
    });
  }

  async skipDose(userId: string, skipDoseDto: SkipDoseDto): Promise<DoseResponseDto> {
    const { medicineId, scheduledAt } = skipDoseDto;

    // Verify medicine belongs to user
    const medicine = await this.prisma.medicine.findFirst({
      where: { id: medicineId, userId },
    });

    if (!medicine) {
      throw new NotFoundException('Medicine not found');
    }

    const scheduledDateTime = new Date(scheduledAt);

    const doseLog = await this.prisma.doseLog.upsert({
      where: {
        medicineId_scheduledAt: {
          medicineId,
          scheduledAt: scheduledDateTime,
        },
      },
      update: {
        status: 'SKIPPED',
      },
      create: {
        medicineId,
        scheduledAt: scheduledDateTime,
        status: 'SKIPPED',
      },
    });

    return this.mapToResponseDto(doseLog);
  }

  private mapToResponseDto(doseLog: any): DoseResponseDto {
    return {
      id: doseLog.id,
      medicineId: doseLog.medicineId,
      scheduledAt: doseLog.scheduledAt,
      takenAt: doseLog.takenAt,
      status: doseLog.status,
      createdAt: doseLog.createdAt,
    };
  }
}
