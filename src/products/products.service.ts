import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ProductDto } from '../dtos/product.dto';
import { CreateProductDto } from '../dtos/createProduct.dto';
@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async getProducts(): Promise<ProductDto[]> {
    const products = await this.prisma.product.findMany({
      select: {
        productCode: true,
        name: true,
        price: true,
      },
    });
    return products.map((product) => ({
      productCode: product.productCode,
      name: product.name,
      price: product.price.toNumber(),
    }));
  }

  async createProduct(data: CreateProductDto) {
    const createdProduct = await this.prisma.product.create({ data });
    return {
      productCode: createdProduct.productCode,
      name: createdProduct.name,
      price: createdProduct.price.toNumber(),
    };
  }
}
