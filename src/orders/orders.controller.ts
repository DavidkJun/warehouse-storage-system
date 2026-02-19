import { Body, Controller, Post, UseGuards, Request } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './createOrder.dto';
import { JwtGuard } from 'src/Guards/jwt.guard';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @UseGuards(JwtGuard)
  @Post()
  async createOrder(@Body() dto: CreateOrderDto, @Request() req) {
    const customerId = req.user.id;
    return this.ordersService.placeOrder(customerId, dto);
  }
}
