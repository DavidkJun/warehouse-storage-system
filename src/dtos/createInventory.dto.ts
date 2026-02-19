import { IsInt, IsPositive, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateInventoryDto {
  @IsInt()
  productId: number;

  @IsInt()
  @IsPositive()
  @Type(() => Number)
  quantity: number;

  @IsInt()
  warehouseId: number;
}
