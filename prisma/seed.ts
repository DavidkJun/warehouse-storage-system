import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Cleaning database');

  await prisma.inventory.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.priceHistory.deleteMany();

  await prisma.order.deleteMany();

  await prisma.product.deleteMany();
  await prisma.warehouse.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.admin.deleteMany();

  console.log('Database is clean');
  console.log('Seeding database...');

  const warehouseKyiv = await prisma.warehouse.create({
    data: {
      name: 'Kyiv main',
      address: 'Khreschatyk 1',
    },
  });
  const warehouseLviv = await prisma.warehouse.create({
    data: {
      name: 'Lviv branch',
      address: 'Nezaleznosti 5',
    },
  });
  const laptop = await prisma.product.create({
    data: {
      productCode: 'NNN-IPH',
      name: 'Macbook M3 Pro',
      price: 3000.5,
    },
  });
  const phone = await prisma.product.create({
    data: {
      productCode: 'KJS-11I',
      name: 'Iphone 13 Pro',
      price: 1030,
    },
  });
  const hat = await prisma.product.create({
    data: {
      productCode: 'LLL-3KK',
      name: 'The North Face Beanie',
      price: 40.3,
    },
  });

  await prisma.inventory.createMany({
    data: [
      {
        quantity: 10,
        warehouseId: warehouseKyiv.id,
        productId: laptop.id,
      },
      {
        quantity: 2,
        warehouseId: warehouseLviv.id,
        productId: laptop.id,
      },
      {
        quantity: 50,
        warehouseId: warehouseKyiv.id,
        productId: phone.id,
      },
      {
        quantity: 0,
        warehouseId: warehouseLviv.id,
        productId: phone.id,
      },
      {
        quantity: 18,
        warehouseId: warehouseKyiv.id,
        productId: hat.id,
      },
    ],
    skipDuplicates: true,
  });

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
