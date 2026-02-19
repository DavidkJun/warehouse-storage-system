import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { WarehouseDto } from '../dtos/warehouse.dto';
import { CreateWarehouseDto } from '../dtos/createWarehouse.dto';

@Injectable()
export class WarehousesService {
  constructor(private prisma: PrismaService) {}

  getWarehouses(): Promise<WarehouseDto[]> {
    return this.prisma.warehouse.findMany();
  }

  async createWarehouse(data: CreateWarehouseDto) {
    return await this.prisma.warehouse.create({ data });
  }
}
