import { Body, Controller, ParseIntPipe, Post, Query } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './createOrder.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}
  @Post()
  async createOrder(
    @Body() dto: CreateOrderDto,
    @Query('userId', ParseIntPipe) userId: number,
  ) {
    return this.ordersService.placeOrder(userId, dto);
  }
}
