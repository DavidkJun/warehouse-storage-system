import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCustomerDto } from './createCustomer.dto';
import { Prisma } from '@prisma/client';
import { encodePassword } from '../utils/bcrypt';
import { prepareUpdateData } from 'src/utils/prepareUpdate';

@Injectable()
export class CustomersService {
  constructor(private prisma: PrismaService) {}

  async getCustomerById(id: number) {
    const customer = await this.prisma.customer.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });
    if (!customer) throw new NotFoundException('Customer not found');
    return customer;
  }

  async createCustomer(data: CreateCustomerDto) {
    try {
      const hashedPass = await encodePassword(data.password);
      return await this.prisma.customer.create({
        data: {
          name: data.name,
          email: data.email,
          password: hashedPass,
        },
        select: {
          id: true,
          name: true,
          email: true,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('Email already exists');
        }
      }
      throw new InternalServerErrorException();
    }
  }

  async deleteCustomer(id: number) {
    try {
      return await this.prisma.customer.delete({
        where: { id: id },
        select: {
          id: true,
          name: true,
          email: true,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('Customer not found');
      }
      throw new InternalServerErrorException();
    }
  }

  async getCustomerByEmail(email: string) {
    return this.prisma.customer.findUnique({
      where: {
        email: email,
      },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
      },
    });
  }
  async updateCustomer(id: number, data: Partial<CreateCustomerDto>) {
    const customer = await this.getCustomerById(id);
    if (!customer) throw new NotFoundException('Customer not found');

    const dataForUpdate = prepareUpdateData(data, ['password']);
    return this.prisma.customer.update({
      where: { id: id },
      data: dataForUpdate,
      select: {
        id: true,
        name: true,
        email: true,
      },
    });
  }
}
