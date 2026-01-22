export class TransferInventoryDto {
  productId: number;
  sourceWarehouseId: number;
  targetWarehouseId: number;
  quantityToTransfer: number;
}
