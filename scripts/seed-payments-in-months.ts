// npx tsx scripts/seed-payments-in-months.ts 7 100

import { OrderStatus, PaymentStatus } from '@prisma/client';
import crypto from 'crypto';
import db from '@/lib/db';

function parseArgs() {
  const args = process.argv.slice(2);

  if (!args[0] || !args[1]) {
    throw new Error('Usage: seed-payments-in-months.ts <months> <totalOrders>');
  }

  const months = Number(args[0]);
  const totalOrders = Number(args[1]);

  if (!Number.isFinite(months) || months < 1) {
    throw new Error('Months must be a positive integer.');
  }

  if (!Number.isFinite(totalOrders) || totalOrders < 1) {
    throw new Error('totalOrders must be a positive integer.');
  }

  return { months, totalOrders };
}

// Generate a random date between now and N months ago
function randomDateInPastMonths(maxMonths: number): Date {
  const now = new Date();
  const target = new Date();

  const monthOffset = Math.floor(Math.random() * (maxMonths + 1)); // 0..maxMonths
  target.setMonth(now.getMonth() - monthOffset);

  // random day in that month
  const daysInMonth = new Date(
    target.getFullYear(),
    target.getMonth() + 1,
    0
  ).getDate();
  target.setDate(Math.floor(Math.random() * daysInMonth) + 1);

  // random hour/min/sec
  target.setHours(Math.floor(Math.random() * 24));
  target.setMinutes(Math.floor(Math.random() * 60));
  target.setSeconds(Math.floor(Math.random() * 60));

  return target;
}

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function main() {
  const { months, totalOrders } = parseArgs();

  console.log(`Seeding ~${totalOrders} orders across last ${months} months...`);

  const users = await db.user.findMany();
  const productSkus = await db.productsSkus.findMany({
    include: { product: true }
  });

  if (users.length === 0) return console.log('No users found.');
  if (productSkus.length === 0) return console.log('No product SKUs found.');

  let createdOrders = 0;

  while (createdOrders < totalOrders) {
    const user = users[randomInt(0, users.length - 1)];
    const sku = productSkus[randomInt(0, productSkus.length - 1)];

    const timestamp = randomDateInPastMonths(months);
    const quantity = randomInt(1, 2);
    const totalPrice = sku.price * quantity;

    await db.$transaction(async (tx) => {
      const payment = await tx.paymentDetails.create({
        data: {
          userClerkId: user.clerk_customer_id!,
          stripe_payment_id: `seed_${crypto.randomUUID()}`,
          provider: 'stripe',
          amount: totalPrice,
          status: PaymentStatus.PAID,
          created_at: timestamp,
          updated_at: timestamp
        }
      });

      const order = await tx.orderDetails.create({
        data: {
          userClerkId: user.clerk_customer_id!,
          paymentId: payment.id,
          total_amount: totalPrice,
          status: OrderStatus.COMPLETED,
          created_at: timestamp,
          updated_at: timestamp
        }
      });

      await tx.orderItems.create({
        data: {
          orderId: order.id,
          productSkuId: sku.id,
          quantity,
          price: sku.price,
          created_at: timestamp,
          updated_at: timestamp
        }
      });
    });

    createdOrders++;

    if (createdOrders % 10 === 0) {
      console.log(`Progress: ${createdOrders}/${totalOrders} orders`);
    }
  }

  console.log(`Done. Created ${createdOrders} orders.`);
  await db.$disconnect();
}

main();
