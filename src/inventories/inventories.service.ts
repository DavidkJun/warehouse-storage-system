import { HttpException, Injectable } from '@nestjs/common';
import { CreateInventoryDto } from '../dtos/createInventory.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Inventory, Prisma } from '@prisma/client';
import { UpdateInventoryDto } from '../dtos/updateInventory.dto';
import { DeleteInventoryDto } from '../dtos/deleteInventory.dto';
import { TransferInventoryDto } from '../dtos/transferInventory.dto';

@Injectable()
export class InventoriesService {
  constructor(private prisma: PrismaService) {}
  async getInventories() {
    return await this.prisma.inventory.findMany();
  }
  getInventory(data: {
    productId: number;
    warehouseId: number;
  }): Promise<Inventory | null> {
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
  async transferInventory(data: TransferInventoryDto) {
    return this.prisma.$transaction(async (tx) => {
      const sourceInventory = await tx.inventory.findFirst({
        where: {
          productId: data.productId,
          warehouseId: data.sourceWarehouseId,
        },
      });
      if (!sourceInventory) throw new HttpException('Inventory not found', 404);
      if (sourceInventory.quantity < data.quantityToTransfer)
        throw new HttpException('Not enough stock to transfer', 404);
      await tx.inventory.update({
        where: { id: sourceInventory.id },
        data: { quantity: sourceInventory.quantity - data.quantityToTransfer },
      });
      const targetInventory = await tx.inventory.findFirst({
        where: {
          productId: data.productId,
          warehouseId: data.targetWarehouseId,
        },
      });
      if (!targetInventory) {
        const dataForCreate: Prisma.InventoryCreateInput = {
          product: { connect: { id: data.productId } },
          quantity: data.quantityToTransfer,
          warehouse: { connect: { id: data.targetWarehouseId } },
        };
        await tx.inventory.create({ data: dataForCreate });
      } else {
        await tx.inventory.update({
          where: { id: targetInventory.id },
          data: {
            quantity: targetInventory.quantity + data.quantityToTransfer,
          },
        });
      }
    });
  }
}
