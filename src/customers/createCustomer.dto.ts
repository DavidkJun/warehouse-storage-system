import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateCustomerDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsString()
  @MinLength(6, { message: 'Password is too short' })
  password: string;
}
