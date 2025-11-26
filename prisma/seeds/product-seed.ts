import { faker } from '@faker-js/faker';
import { createProductWithSkusTyped } from '@/services/product';
import db from '@/lib/db';

const sizes = ['S', 'M', 'L', 'XL', 'XXL'];
const colors = ['Red', 'Blue', 'Green', 'Black', 'White', 'Yellow'];

async function createRandomProduct() {
  // Pick random category from existing ones
  const categories = await db.category.findMany();
  if (!categories.length) throw new Error('No categories found!');

  const category = faker.helpers.arrayElement(categories);

  // Random number of SKUs per product
  const skuCount = faker.number.int({ min: 1, max: 5 });

  const skus = Array.from({ length: skuCount }).map(() => ({
    sku: faker.commerce.productName(),
    price: parseFloat(faker.commerce.price({ min: 0, max: 500 })),
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
  const productsToCreate = 10; // how many products per run
  for (let i = 0; i < productsToCreate; i++) {
    const product = await createRandomProduct();
    console.log(
      `Created product: ${product.name} with ${product.skus.length} SKUs`
    );
  }
}
