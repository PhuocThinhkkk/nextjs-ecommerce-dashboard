import { faker } from '@faker-js/faker';
import db from '@/lib/db';
import { User } from '@prisma/client';

export async function seedWishlist(users: User[], countPerUser = 5) {
  const products = await db.product.findMany();
  if (!products.length)
    throw new Error('No products found! Seed products first.');

  const wishlists = [];

  for (const user of users) {
    if (!user.clerk_customer_id) {
      console.error('how tf this happend');
      continue;
    }
    for (let i = 0; i < countPerUser; i++) {
      const randomProduct = faker.helpers.arrayElement(products);
      wishlists.push(
        await db.wishlist.create({
          data: {
            userClerkId: user.clerk_customer_id,
            productId: randomProduct.id
          }
        })
      );
    }
  }

  return wishlists;
}
