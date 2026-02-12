import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './createOrder.dto';
import { Prisma } from '@prisma/client';
@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}
  async placeOrder(customerId: number, order: CreateOrderDto) {
    return this.prisma.$transaction(async (tx) => {
      const codes = order.orderItems.map((item) => item.productCode);
      let totalPrice = 0;
      const itemsToSave: Prisma.OrderItemCreateManyOrderInput[] = [];
      const products = await tx.product.findMany({
        where: {
          productCode: { in: codes },
        },
        include: {
          inventory: true,
        },
      });
      for (const item of order.orderItems) {
        const product = products.find(
          (p) => p.productCode === item.productCode,
        );
        if (!product) {
          throw new NotFoundException(`Product ${item.productCode} not found`);
        }
        const inventory = product.inventory[0];
        if (!inventory || product.inventory[0].quantity < item.quantity) {
          throw new BadRequestException(`Not enough stock for ${product.name}`);
        }
        await tx.inventory.update({
          where: { id: product.inventory[0].id },
          data: {
            quantity: { decrement: item.quantity },
          },
        });
        totalPrice += Number(product.price) * item.quantity;
        itemsToSave.push({
          productId: product.id,
          quantity: item.quantity,
          priceAtPurchase: product.price,
        });
      }
      return tx.order.create({
        data: {
          status: 'PENDING',
          shippingAddr: order.shippingAddr,
          totalPrice: totalPrice,
          orderItems: {
            createMany: {
              data: itemsToSave,
            },
          },
          customer: {
            connect: { id: customerId },
          },
        },
        include: {
          orderItems: true,
        },
      });
    });
  }
}
