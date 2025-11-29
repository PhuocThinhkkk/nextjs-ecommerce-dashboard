import { faker } from '@faker-js/faker';
import db from '@/lib/db';

export async function seedWishlist(countPerUser = 5) {
  const users = await db.user.findMany({ take: 30 });
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
      try {
        const randomProduct = faker.helpers.arrayElement(products);
        wishlists.push(
          await db.wishlist.create({
            data: {
              userClerkId: user.clerk_customer_id,
              productId: randomProduct.id
            }
          })
        );
      } catch (e) {
        console.log('Error when seeding wishlists: ', e);
      }
    }
  }

  return wishlists;
}
