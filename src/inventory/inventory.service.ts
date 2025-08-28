import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { UpdateInventoryDto, InventoryResponseDto } from '../common/dto/inventory.dto';

@Injectable()
export class InventoryService {
  constructor(private readonly prisma: PrismaService) {}

  async findByMedicine(medicineId: string, userId: string): Promise<InventoryResponseDto> {
    // Verify medicine belongs to user
    const medicine = await this.prisma.medicine.findFirst({
      where: { id: medicineId, userId },
    });

    if (!medicine) {
      throw new NotFoundException('Medicine not found');
    }

    const inventory = await this.prisma.inventory.findUnique({
      where: { medicineId },
    });

    if (!inventory) {
      throw new NotFoundException('Inventory not found');
    }

    return this.mapToResponseDto(inventory);
  }

  async update(medicineId: string, userId: string, updateInventoryDto: UpdateInventoryDto): Promise<InventoryResponseDto> {
    // Verify medicine belongs to user
    const medicine = await this.prisma.medicine.findFirst({
      where: { id: medicineId, userId },
    });

    if (!medicine) {
      throw new NotFoundException('Medicine not found');
    }

    const inventory = await this.prisma.inventory.upsert({
      where: { medicineId },
      update: {
        ...updateInventoryDto,
        lastUpdatedAt: new Date(),
      },
      create: {
        ...updateInventoryDto,
        medicineId,
        lastUpdatedAt: new Date(),
      },
    });

    return this.mapToResponseDto(inventory);
  }

  private mapToResponseDto(inventory: any): InventoryResponseDto {
    return {
      id: inventory.id,
      medicineId: inventory.medicineId,
      currentPills: inventory.currentPills,
      lowThreshold: inventory.lowThreshold,
      refillsTotal: inventory.refillsTotal,
      refillsUsed: inventory.refillsUsed,
      lastUpdatedAt: inventory.lastUpdatedAt,
    };
  }
}
