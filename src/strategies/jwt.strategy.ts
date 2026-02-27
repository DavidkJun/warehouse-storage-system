import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import * as process from 'node:process';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
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
    if (payload.role === 'ADMIN') {
      const admin = await this.prisma.admin.findUnique({
        where: {
          id: payload.sub,
        },
      });

      if (!admin) {
        throw new UnauthorizedException('Admin not found');
      }

      return {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: 'ADMIN',
      };
    } else {
      const customer = await this.prisma.customer.findUnique({
        where: {
          id: payload.sub,
        },
      });
      if (!customer) {
        throw new UnauthorizedException('User not found or token invalid');
      }
      return {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        role: 'customer',
      };
    }
  }
}
