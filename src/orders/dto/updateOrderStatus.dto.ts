import { IsEnum } from 'class-validator';
import { OrderStatus } from '@prisma/client';

export class UpdateOrderStatusDto {
  @IsEnum(OrderStatus, {
    message:
      'Status must be a valid OrderStatus (NEW, PENDING, SHIPPED, DELIVERED, CANCELED)',
  })
  status: OrderStatus;
}
