import { Body, Controller, Get, Post } from '@nestjs/common';
import { WarehousesService } from './warehouses.service';
import { CreateWarehouseDto } from '../dtos/createWarehouse.dto';

@Controller('warehouses')
export class WarehousesController {
  constructor(private readonly warehouseService: WarehousesService) {}

  @Get()
  getWarehouses() {
    return this.warehouseService.getWarehouses();
  }

  @Post()
  createWarehouse(@Body() dto: CreateWarehouseDto) {
    return this.warehouseService.createWarehouse(dto);
  }
}
