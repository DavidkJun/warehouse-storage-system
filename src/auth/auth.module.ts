import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { CustomersModule } from 'src/customers/customers.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from 'src/strategies/local.strategy';
import { JwtStrategy } from 'src/strategies/jwt.strategy';
import { AdminLocalStrategy } from 'src/strategies/admin-local.strategy';
import { AdminsService } from 'src/admins/admins.service';

@Module({
  imports: [
    CustomersModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AdminsService,
    LocalStrategy,
    JwtStrategy,
    AdminLocalStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule {}
