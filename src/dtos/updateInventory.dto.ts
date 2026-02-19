import { Type } from 'class-transformer';
import { IsInt, IsPositive } from 'class-validator';

export class UpdateInventoryDto {
  @IsInt()
  id: number;

  @IsInt()
  @IsPositive()
  @Type(() => Number)
  quantity: number;
}
