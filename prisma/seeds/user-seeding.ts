import { Prisma } from '@prisma/client';
import { faker } from '@faker-js/faker';
import db from '@/lib/db'; // your prisma client

export async function seedUsers(count = 10) {
  const users: Prisma.UserCreateInput[] = [];

  for (let i = 0; i < count; i++) {
    users.push({
      email: faker.internet.email(),
      name: faker.name.fullName(),
      role: 'USER',
      clerk_customer_id: `clerk_${Date.now()}_${i}`,
      phone_number: faker.phone.number(),
      avatar_url: faker.image.avatar()
    });
  }

  const createdUsers = [];
  for (const user of users) {
    const u = await db.user.create({ data: user });
    createdUsers.push(u);
  }
  return createdUsers;
}
