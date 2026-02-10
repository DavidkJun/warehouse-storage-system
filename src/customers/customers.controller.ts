import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './createCustomer.dto';

@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Get(':id')
  getCustomer(@Param('id', ParseIntPipe) id: number) {
    return this.customersService.getCustomerById(id);
  }

  @Post()
  createCustomer(@Body() createCustomerDto: CreateCustomerDto) {
    return this.customersService.createCustomer(createCustomerDto);
  }

  @Delete(':id')
  deleteCustomer(@Param('id', ParseIntPipe) id: number) {
    return this.customersService.deleteCustomer(id);
  }
}