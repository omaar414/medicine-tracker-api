import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateMedicineDto, UpdateMedicineDto, MedicineResponseDto } from '../common/dto/medicine.dto';
import { AddSymptomDto, AddMultipleSymptomsDto, RemoveSymptomDto } from '../common/dto/symptom.dto';

@Injectable()
export class MedicinesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(userId: string): Promise<MedicineResponseDto[]> {
    const medicines = await this.prisma.medicine.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return medicines.map(this.mapToResponseDto);
  }

  async findOne(id: string, userId: string): Promise<MedicineResponseDto> {
    const medicine = await this.prisma.medicine.findUnique({
      where: { id },
    });

    if (!medicine) {
      throw new NotFoundException('Medicine not found');
    }

    if (medicine.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return this.mapToResponseDto(medicine);
  }

  async create(userId: string, createMedicineDto: CreateMedicineDto): Promise<MedicineResponseDto> {
    const { refillsTotal, ...medicineData } = createMedicineDto;

    const medicine = await this.prisma.medicine.create({
      data: {
        ...medicineData,
        userId,
      },
    });

    // Create inventory if refillsTotal is provided
    if (refillsTotal !== undefined) {
      await this.prisma.inventory.create({
        data: {
          medicineId: medicine.id,
          refillsTotal,
        },
      });
    }

    return this.mapToResponseDto(medicine);
  }

  async update(id: string, userId: string, updateMedicineDto: UpdateMedicineDto): Promise<MedicineResponseDto> {
    // Check if medicine exists and belongs to user
    await this.findOne(id, userId);

    const medicine = await this.prisma.medicine.update({
      where: { id },
      data: updateMedicineDto,
    });

    return this.mapToResponseDto(medicine);
  }

  async remove(id: string, userId: string): Promise<void> {
    // Check if medicine exists and belongs to user
    await this.findOne(id, userId);

    await this.prisma.medicine.delete({
      where: { id },
    });
  }

  async addSymptom(id: string, userId: string, addSymptomDto: AddSymptomDto): Promise<MedicineResponseDto> {
    // Check if medicine exists and belongs to user
    const medicine = await this.findOne(id, userId);

    const updatedMedicine = await this.prisma.medicine.update({
      where: { id },
      data: {
        symptoms: {
          push: addSymptomDto.symptom,
        },
      },
    });

    return this.mapToResponseDto(updatedMedicine);
  }

  async addMultipleSymptoms(id: string, userId: string, addMultipleSymptomsDto: AddMultipleSymptomsDto): Promise<MedicineResponseDto> {
    // Check if medicine exists and belongs to user
    const medicine = await this.findOne(id, userId);

    const updatedMedicine = await this.prisma.medicine.update({
      where: { id },
      data: {
        symptoms: {
          push: addMultipleSymptomsDto.symptoms,
        },
      },
    });

    return this.mapToResponseDto(updatedMedicine);
  }

  async removeSymptom(id: string, userId: string, removeSymptomDto: RemoveSymptomDto): Promise<MedicineResponseDto> {
    // Check if medicine exists and belongs to user
    const medicine = await this.findOne(id, userId);

    const currentSymptoms = medicine.symptoms || [];
    const updatedSymptoms = currentSymptoms.filter(symptom => symptom !== removeSymptomDto.symptom);

    const updatedMedicine = await this.prisma.medicine.update({
      where: { id },
      data: {
        symptoms: updatedSymptoms,
      },
    });

    return this.mapToResponseDto(updatedMedicine);
  }

  private mapToResponseDto(medicine: any): MedicineResponseDto {
    return {
      id: medicine.id,
      userId: medicine.userId,
      name: medicine.name,
      dose: medicine.dose,
      unit: medicine.unit,
      notes: medicine.notes,
      symptoms: medicine.symptoms || [],
      createdAt: medicine.createdAt,
      updatedAt: medicine.updatedAt,
    };
  }
}
