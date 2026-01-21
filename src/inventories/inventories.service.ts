import { HttpException, Injectable } from '@nestjs/common';
import { CreateInventoryDto } from '../dtos/createInventory.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Inventory, Prisma } from '@prisma/client';
import { UpdateInventoryDto } from '../dtos/updateInventory.dto';
import { DeleteInventoryDto } from '../dtos/deleteInventory.dto';

@Injectable()
export class InventoriesService {
  constructor(private prisma: PrismaService) {}
  async getInventories() {
    return await this.prisma.inventory.findMany();
  }
  getInventory(data: { productId: number; warehouseId: number }) {
    return this.prisma.inventory.findFirst({
      where: {
        productId: data.productId,
        warehouseId: data.warehouseId,
      },
    });
  }
  async insertInventory(data: CreateInventoryDto): Promise<Inventory> {
    const inventory = await this.getInventory(data);
    if (!inventory) {
      const dataForCreate: Prisma.InventoryCreateInput = {
        product: { connect: { id: data.productId } },
        quantity: data.quantity,
        warehouse: { connect: { id: data.warehouseId } },
      };
      return this.prisma.inventory.create({ data: dataForCreate });
    }
    const dataForUpdate: UpdateInventoryDto = {
      id: inventory.id,
      quantity: inventory.quantity + data.quantity,
    };
    return this.updateInventory(dataForUpdate);
  }
  async updateInventory(data: UpdateInventoryDto): Promise<Inventory> {
    return this.prisma.inventory.update({
      where: { id: data.id },
      data: { quantity: data.quantity },
    });
  }
  async deleteInventory(data: DeleteInventoryDto) {
    const inventory = await this.getInventory(data);
    if (!inventory) throw new HttpException('Inventory not found', 404);
    return this.prisma.inventory.delete({
      where: { id: inventory.id },
    });
  }
}
