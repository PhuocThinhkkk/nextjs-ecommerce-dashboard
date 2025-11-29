import { seedingProducts } from './seeds/product-seed';
import { seedingCategories } from './seeds/category-seeding';
import { seedPayments } from './seeds/payment-seeding';
import { seedUsers } from './seeds/user-seeding';
import { seedWishlist } from './seeds/wishlist-seeding';

async function main() {
  await seedingCategories();
  await seedingProducts();
  await seedUsers();
  await seedPayments();
  await seedWishlist();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
