import { IsInt, Min } from 'class-validator';

export class InventoryDto {
  @IsInt()
  id?: number;

  @IsInt()
  productId?: number;

  @IsInt()
  @Min(1)
  quantity?: number;

  @IsInt()
  warehouseId?: number;
}
