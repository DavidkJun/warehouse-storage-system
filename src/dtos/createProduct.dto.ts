import { IsDecimal, IsString } from 'class-validator';

export class CreateProductDto {
  @IsString()
  productCode: string;

  @IsString()
  name: string;

  @IsDecimal({ decimal_digits: '2', force_decimal: true })
  price: number;
}
