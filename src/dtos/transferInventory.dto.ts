import { IsInt, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';
export class TransferInventoryDto {
  @IsInt()
  productId: number;

  @IsInt()
  sourceWarehouseId: number;

  @IsInt()
  targetWarehouseId: number;

  @IsInt()
  @IsPositive()
  @Type(() => Number)
  quantityToTransfer: number;
}
