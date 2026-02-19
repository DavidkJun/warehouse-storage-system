import { IsString, IsDecimal } from 'class-validator';

export class ProductDto {
  @IsString()
  productCode: string;

  @IsString()
  name: string;

  @IsDecimal({ decimal_digits: '2', force_decimal: true })
  price: number;
}
