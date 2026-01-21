import { Controller, Post, Body, Get, Delete } from '@nestjs/common';
import { InventoriesService } from './inventories.service';
import { CreateInventoryDto } from '../dtos/createInventory.dto';
import { Inventory } from '@prisma/client';
import { DeleteInventoryDto } from '../dtos/deleteInventory.dto';

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
}
