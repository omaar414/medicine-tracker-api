import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { MedicinesService } from './medicines.service';
import { CreateMedicineDto, UpdateMedicineDto, MedicineResponseDto } from '../common/dto/medicine.dto';
import { AddSymptomDto, AddMultipleSymptomsDto, RemoveSymptomDto } from '../common/dto/symptom.dto';

@ApiTags('Medicines')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('medicines')
export class MedicinesController {
  constructor(private readonly medicinesService: MedicinesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all medicines for current user' })
  @ApiResponse({ status: 200, description: 'Medicines retrieved successfully', type: [MedicineResponseDto] })
  async findAll(@CurrentUser() user: any): Promise<MedicineResponseDto[]> {
    return this.medicinesService.findAll(user.id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new medicine' })
  @ApiResponse({ status: 201, description: 'Medicine created successfully', type: MedicineResponseDto })
  async create(
    @CurrentUser() user: any,
    @Body() createMedicineDto: CreateMedicineDto,
  ): Promise<MedicineResponseDto> {
    return this.medicinesService.create(user.id, createMedicineDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific medicine' })
  @ApiParam({ name: 'id', description: 'Medicine ID' })
  @ApiResponse({ status: 200, description: 'Medicine retrieved successfully', type: MedicineResponseDto })
  @ApiResponse({ status: 404, description: 'Medicine not found' })
  async findOne(@Param('id') id: string, @CurrentUser() user: any): Promise<MedicineResponseDto> {
    return this.medicinesService.findOne(id, user.id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a medicine' })
  @ApiParam({ name: 'id', description: 'Medicine ID' })
  @ApiResponse({ status: 200, description: 'Medicine updated successfully', type: MedicineResponseDto })
  @ApiResponse({ status: 404, description: 'Medicine not found' })
  async update(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body() updateMedicineDto: UpdateMedicineDto,
  ): Promise<MedicineResponseDto> {
    return this.medicinesService.update(id, user.id, updateMedicineDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a medicine' })
  @ApiParam({ name: 'id', description: 'Medicine ID' })
  @ApiResponse({ status: 200, description: 'Medicine deleted successfully' })
  @ApiResponse({ status: 404, description: 'Medicine not found' })
  async remove(@Param('id') id: string, @CurrentUser() user: any): Promise<void> {
    return this.medicinesService.remove(id, user.id);
  }

  @Post(':id/symptoms')
  @ApiOperation({ summary: 'Add a symptom to a medicine' })
  @ApiParam({ name: 'id', description: 'Medicine ID' })
  @ApiResponse({ status: 201, description: 'Symptom added successfully', type: MedicineResponseDto })
  @ApiResponse({ status: 404, description: 'Medicine not found' })
  async addSymptom(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body() addSymptomDto: AddSymptomDto,
  ): Promise<MedicineResponseDto> {
    return this.medicinesService.addSymptom(id, user.id, addSymptomDto);
  }

  @Post(':id/symptoms/multiple')
  @ApiOperation({ summary: 'Add multiple symptoms to a medicine' })
  @ApiParam({ name: 'id', description: 'Medicine ID' })
  @ApiResponse({ status: 201, description: 'Symptoms added successfully', type: MedicineResponseDto })
  @ApiResponse({ status: 404, description: 'Medicine not found' })
  async addMultipleSymptoms(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body() addMultipleSymptomsDto: AddMultipleSymptomsDto,
  ): Promise<MedicineResponseDto> {
    return this.medicinesService.addMultipleSymptoms(id, user.id, addMultipleSymptomsDto);
  }

  @Delete(':id/symptoms')
  @ApiOperation({ summary: 'Remove a symptom from a medicine' })
  @ApiParam({ name: 'id', description: 'Medicine ID' })
  @ApiResponse({ status: 200, description: 'Symptom removed successfully', type: MedicineResponseDto })
  @ApiResponse({ status: 404, description: 'Medicine not found' })
  async removeSymptom(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body() removeSymptomDto: RemoveSymptomDto,
  ): Promise<MedicineResponseDto> {
    return this.medicinesService.removeSymptom(id, user.id, removeSymptomDto);
  }
}
