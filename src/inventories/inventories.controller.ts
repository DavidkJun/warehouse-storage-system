import {
  Controller,
  Post,
  Body,
  Get,
  Delete,
  ParseIntPipe,
  Param,
  UseGuards,
} from '@nestjs/common';
import { InventoriesService } from './inventories.service';
import { CreateInventoryDto } from '../dtos/createInventory.dto';
import { Inventory } from '@prisma/client';
import { TransferInventoryDto } from '../dtos/transferInventory.dto';
import { JwtGuard } from 'src/Guards/jwt.guard';
import { RolesGuard } from 'src/Guards/roles.guard';
import { Roles } from 'src/Decorators/roles.decorator';

@Controller('inventories')
@UseGuards(JwtGuard, RolesGuard)
export class InventoriesController {
  constructor(private readonly inventoriesService: InventoriesService) {}

  @Get()
  getInventories() {
    return this.inventoriesService.getInventories();
  }

  @Roles('ADMIN')
  @Post()
  async insertInventory(@Body() dto: CreateInventoryDto): Promise<Inventory> {
    return await this.inventoriesService.insertInventory(dto);
  }

  @Roles('ADMIN')
  @Delete(':id')
  async deleteInventory(
    @Param('id', ParseIntPipe) id: number
  ): Promise<Inventory> {
    return await this.inventoriesService.deleteInventory(id);
  }

  @Roles('ADMIN')
  @Post('transfer')
  async transferInventory(@Body() dto: TransferInventoryDto) {
    return await this.inventoriesService.transferInventory(dto);
  }
}
