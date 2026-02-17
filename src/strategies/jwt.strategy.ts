import { Injectable } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import * as process from 'node:process';
import { CustomersService } from 'src/customers/customers.service';
import { UnauthorizedException } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private customersService: CustomersService) {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error(
        'FATAL ERROR: JWT secret is not defined in environment variables'
      );
    }
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }
  async validate(payload: any) {
    const customer = await this.customersService.getCustomerById(payload.sub);
    if (!customer) {
      throw new UnauthorizedException('User not found or token invalid');
    }
    return customer;
  }
}
