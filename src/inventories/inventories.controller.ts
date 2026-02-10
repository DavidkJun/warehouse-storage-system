import { Controller, Post, Body, Get, Delete } from '@nestjs/common';
import { InventoriesService } from './inventories.service';
import { CreateInventoryDto } from '../dtos/createInventory.dto';
import { Inventory } from '@prisma/client';
import { DeleteInventoryDto } from '../dtos/deleteInventory.dto';
import { TransferInventoryDto } from '../dtos/transferInventory.dto';

@Controller('inventories')
export class InventoriesController {
  constructor(private readonly inventoriesService: InventoriesService) {}
  @Get()
  getInventories() {
    return this.inventoriesService.getInventories();
  }
  @Post()
  async insertInventory(@Body() dto: CreateInventoryDto): Promise<Inventory> {
    return await this.inventoriesService.insertInventory(dto);
  }
  @Delete()
  async deleteInventory(@Body() dto: DeleteInventoryDto): Promise<Inventory> {
    return await this.inventoriesService.deleteInventory(dto);
  }
  @Post('transfer')
  async transferInventory(@Body() dto: TransferInventoryDto) {
    return await this.inventoriesService.transferInventory(dto);
  }
}
