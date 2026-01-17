// Example: tsx scripts/randomizeSkuPrices.ts 300
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

function randomBelow(max: number, min = 1) {
  return Math.random() * (max - min) + min;
}

async function main() {
  const input = process.argv[2];
  const threshold = Number(input);

  if (!input || isNaN(threshold) || threshold <= 0) {
    throw new Error(
      '❌ Please provide a valid positive number. Example: tsx scripts/randomizeSkuPrices.ts 300'
    );
  }

  console.log(`🎲 Randomizing SKU prices that are ABOVE $${threshold}`);

  const skus = await prisma.productsSkus.findMany({
    where: {
      price: {
        gt: threshold
      }
    },
    select: {
      id: true
    }
  });

  if (skus.length === 0) {
    console.log('✅ No SKUs need updating');
    return;
  }

  await prisma.$transaction(
    skus.map((sku) =>
      prisma.productsSkus.update({
        where: { id: sku.id },
        data: {
          price: Number(randomBelow(threshold).toFixed(2))
        }
      })
    )
  );

  console.log(
    `✅ Updated ${skus.length} SKU(s) with random prices below $${threshold}`
  );
}

main()
  .catch((err) => {
    console.error('❌ Error:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
