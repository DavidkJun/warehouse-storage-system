import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ProductsModule } from './products/products.module';
import { WarehousesModule } from './warehouses/warehouses.module';
import { InventoriesModule } from './inventories/inventories.module';
import { CustomersModule } from './customers/customers.module';

@Module({
  imports: [PrismaModule, ProductsModule, WarehousesModule, InventoriesModule, CustomersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
