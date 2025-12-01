import { PaymentStatus, OrderStatus } from '@prisma/client';

import db from '@/lib/db';

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function main() {
  console.log('🌱 Seeding orders...');

  // ✅ 1. Load required relations
  const users = await db.user.findMany({
    select: { clerk_customer_id: true }
  });

  const skus = await db.productsSkus.findMany({
    select: {
      id: true,
      price: true
    }
  });

  if (!users.length || !skus.length) {
    throw new Error('❌ Users or SKUs are empty. Seed them first.');
  }

  // ✅ 2. Create multiple orders
  for (let i = 0; i < 20; i++) {
    const user = users[randomInt(0, users.length - 1)];

    if (!user.clerk_customer_id) {
      continue;
    }
    // ✅ 3. Create Payment
    const payment = await db.paymentDetails.create({
      data: {
        userClerkId: user.clerk_customer_id,
        stripe_payment_id: `seed_pi_${Date.now()}_${i}`,
        provider: 'stripe',
        status: PaymentStatus.PAID,
        amount: 0 // temp, will update after items are created
      }
    });

    // ✅ 4. Create Order
    const order = await db.orderDetails.create({
      data: {
        userClerkId: user.clerk_customer_id,
        status: OrderStatus.COMPLETED,
        total_amount: 0, // temp
        paymentId: payment.id
      }
    });

    // ✅ 5. Create Order Items
    const itemsCount = randomInt(1, 4);
    let totalAmount = 0;

    for (let j = 0; j < itemsCount; j++) {
      const sku = skus[randomInt(0, skus.length - 1)];
      const quantity = randomInt(1, 3);

      const itemTotal = sku.price * quantity;
      totalAmount += itemTotal;

      await db.orderItems.create({
        data: {
          orderId: order.id,
          productSkuId: sku.id,
          quantity,
          price: sku.price
        }
      });
    }

    // ✅ 6. Update Order & Payment totals
    await db.orderDetails.update({
      where: { id: order.id },
      data: { total_amount: totalAmount }
    });

    await db.paymentDetails.update({
      where: { id: payment.id },
      data: { amount: totalAmount }
    });
  }

  console.log('✅ Orders seeded successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
