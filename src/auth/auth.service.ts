import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Customer } from '@prisma/client';
import { CustomersService } from 'src/customers/customers.service';
import { comparePasswords } from 'src/utils/bcrypt';
@Injectable()
export class AuthService {
  constructor(
    private readonly customerService: CustomersService,
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
    };
    return {
      acces_token: this.jwtService.sign(payload),
    };
  }
}
