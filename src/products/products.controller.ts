import { Body, Controller, Get, Post } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductDto } from '../dtos/product.dto';
import { CreateProductDto } from '../dtos/createProduct.dto';
@Controller('products')
export class ProductsController {
  constructor(private readonly productService: ProductsService) {}

  @Get()
  getProducts(): Promise<ProductDto[]> {
    return this.productService.getProducts();
  }

  @Post()
  createProduct(@Body() dto: CreateProductDto) {
    return this.productService.createProduct(dto);
  }
}
