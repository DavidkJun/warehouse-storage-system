import { Type } from 'class-transformer';
import {
  IsString,
  IsInt,
  IsArray,
  ValidateNested,
  Min,
  IsNotEmpty,
} from 'class-validator';

export class OrderItemDto {
  @IsInt()
  @Min(1)
  @Type(() => Number)
  quantity: number;

  @IsString()
  @IsNotEmpty()
  productCode: string;
}

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  shippingAddr: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  orderItems: OrderItemDto[];
}
