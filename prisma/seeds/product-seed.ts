import { faker } from '@faker-js/faker';
import { createProductWithSkusTyped } from '@/services/product';
import db from '@/lib/db';

const sizes = ['S', 'M', 'L', 'XL', 'XXL'];
const colors = ['Red', 'Blue', 'Green', 'Black', 'White', 'Yellow'];

async function createRandomProduct() {
  const categories = await db.category.findMany();
  if (!categories.length) throw new Error('No categories found!');

  const category = faker.helpers.arrayElement(categories);

  const skuCount = faker.number.int({ min: 1, max: 5 });

  const skus = Array.from({ length: skuCount }).map(() => ({
    sku: faker.string.alphanumeric(10).toUpperCase(),
    price: faker.number.int({ min: 100, max: 50000 }), // Price in cents (e.g., 100 = $1.00)
    size_attribute: faker.helpers.arrayElement(sizes),
    color_attribute: faker.helpers.arrayElement(colors)
  }));

  const productData = {
    product: {
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      category: { connect: { id: category.id } }
    },
    skus
  };

  return createProductWithSkusTyped(productData);
}

export async function seedingProducts() {
  const productsToCreate = 10;
  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < productsToCreate; i++) {
    try {
      const product = await createRandomProduct();
      console.log(
        `Created product: ${product.name} with ${product.skus.length} SKUs`
      );
      successCount++;
    } catch (error) {
      console.error(`Failed to create product ${i + 1}:`, error);
      failCount++;
    }
  }

  console.log(
    `\nSeeding complete: ${successCount} succeeded, ${failCount} failed`
  );
}
