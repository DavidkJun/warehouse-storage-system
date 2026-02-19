import { IsString } from 'class-validator';

export class WarehouseDto {
  @IsString()
  name: string;

  @IsString()
  address: string;
}
