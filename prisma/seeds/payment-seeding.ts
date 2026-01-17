import { PaymentStatus, User } from '@prisma/client';
import { faker } from '@faker-js/faker';
import { createPaymentByClerkId } from '@/services/payment';
import db from '@/lib/db';

export async function seedPayments(countPerUser = 3) {
  const payments = [];
  const users = await db.user.findMany({
    take: 30
  });

  for (const user of users) {
    if (!user.clerk_customer_id) {
      console.log('shit');
      continue;
    }
    for (let i = 0; i < countPerUser; i++) {
      const randomAmount = parseFloat(
        faker.finance.amount({ min: 1, max: 99 })
      );
      const statusOptions: PaymentStatus[] = [
        'PENDING',
        'PAID',
        'FAILED',
        'REFUNDED'
      ];
      const data = {
        userClerkId: user.clerk_customer_id,
        provider: faker.helpers.arrayElement(['stripe', 'paypal']),
        status: faker.helpers.arrayElement(statusOptions),
        amount: randomAmount,
        stripe_payment_id: `payment_${Date.now()}_${i}`
      };
      const payment = await createPaymentByClerkId(
        user.clerk_customer_id,
        data
      );
      payments.push(payment);
    }
  }

  const createdPayments = await Promise.all(payments);
  return createdPayments;
}
