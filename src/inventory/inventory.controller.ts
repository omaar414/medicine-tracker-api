import { Controller, Get, Put, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { InventoryService } from './inventory.service';
import { UpdateInventoryDto, InventoryResponseDto } from '../common/dto/inventory.dto';

@ApiTags('Inventory')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('medicines/:medicineId/inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get()
  @ApiOperation({ summary: 'Get inventory for a medicine' })
  @ApiParam({ name: 'medicineId', description: 'Medicine ID' })
  @ApiResponse({ status: 200, description: 'Inventory retrieved successfully', type: InventoryResponseDto })
  async findByMedicine(@Param('medicineId') medicineId: string, @CurrentUser() user: any): Promise<InventoryResponseDto> {
    return this.inventoryService.findByMedicine(medicineId, user.id);
  }

  @Put()
  @ApiOperation({ summary: 'Update inventory for a medicine' })
  @ApiParam({ name: 'medicineId', description: 'Medicine ID' })
  @ApiResponse({ status: 200, description: 'Inventory updated successfully', type: InventoryResponseDto })
  async update(
    @Param('medicineId') medicineId: string,
    @CurrentUser() user: any,
    @Body() updateInventoryDto: UpdateInventoryDto,
  ): Promise<InventoryResponseDto> {
    return this.inventoryService.update(medicineId, user.id, updateInventoryDto);
  }
}
