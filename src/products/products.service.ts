import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { ProductDto } from '../dtos/product.dto';
import { CreateProductDto } from '../dtos/createProduct.dto';

const PRODUCTS_CACHE_KEY = 'products:all';
const PRODUCTS_CACHE_TTL = 60;

@Injectable()
export class ProductsService {
  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
  ) {}

  async getProducts(): Promise<ProductDto[]> {
    const cached = await this.redis.get<ProductDto[]>(PRODUCTS_CACHE_KEY);
    if (cached) return cached;

    const products = await this.prisma.product.findMany({
      select: {
        productCode: true,
        name: true,
        price: true,
      },
    });

    const result = products.map((product) => ({
      productCode: product.productCode,
      name: product.name,
      price: product.price.toNumber(),
    }));

    await this.redis.set(PRODUCTS_CACHE_KEY, result, PRODUCTS_CACHE_TTL);
    return result;
  }

  async createProduct(data: CreateProductDto) {
    const createdProduct = await this.prisma.product.create({ data });
    await this.redis.del(PRODUCTS_CACHE_KEY);
    return {
      productCode: createdProduct.productCode,
      name: createdProduct.name,
      price: createdProduct.price.toNumber(),
    };
  }
}
