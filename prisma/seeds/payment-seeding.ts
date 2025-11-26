import { PaymentStatus, User } from '@prisma/client';
import { faker } from '@faker-js/faker';
import { createPaymentByClerkId } from '@/services/payment';

export async function seedPayments(users: User[], countPerUser = 3) {
  const payments = [];

  for (const user of users) {
    if (!user.clerk_customer_id) {
      console.log('shit');
      continue;
    }
    for (let i = 0; i < countPerUser; i++) {
      const randomAmount = parseFloat(faker.finance.amount());
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
