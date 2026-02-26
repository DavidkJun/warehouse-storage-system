import {
  Body,
  Controller,
  Post,
  Param,
  UseGuards,
  Request,
  Patch,
  ParseIntPipe,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './createOrder.dto';
import { JwtGuard } from 'src/Guards/jwt.guard';
import { RolesGuard } from 'src/Guards/roles.guard';
import { Roles } from 'src/Decorators/roles.decorator';
import { UpdateOrderStatusDto } from './dto/updateOrderStatus.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @UseGuards(JwtGuard)
  @Post()
  async createOrder(@Body() dto: CreateOrderDto, @Request() req) {
    const customerId = req.user.id;
    return this.ordersService.placeOrder(customerId, dto);
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Roles('ADMIN')
  @Patch(':id/status')
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateOrderStatusDto
  ) {
    return this.ordersService.updateOrderStatus(id, dto.status);
  }
}
