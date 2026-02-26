import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Customer, Admin } from '@prisma/client';
import { AdminsService } from 'src/admins/admins.service';
import { CustomersService } from 'src/customers/customers.service';
import { comparePasswords } from 'src/utils/bcrypt';
@Injectable()
export class AuthService {
  constructor(
    private readonly customerService: CustomersService,
    private readonly adminService: AdminsService,
    private readonly jwtService: JwtService
  ) {}

  async validate(email: string, pass: string) {
    const customer = await this.customerService.getCustomerByEmail(email);
    if (customer && (await comparePasswords(pass, customer.password))) {
      const { password, ...result } = customer;
      return result;
    }
    return null;
  }

  async login(customer: Partial<Customer>) {
    const payload = {
      email: customer.email,
      sub: customer.id,
      role: 'CUSTOMER',
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async validateAdmin(email: string, pass: string) {
    const admin = await this.adminService.findAdminByEmail(email);

    if (admin && (await comparePasswords(pass, admin.password))) {
      const { password, ...result } = admin;
      return result;
    }
    return null;
  }

  async loginAdmin(admin: Partial<Admin>) {
    const payload = {
      email: admin.email,
      sub: admin.id,
      role: 'ADMIN',
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
