import { faker } from '@faker-js/faker';
import { createNewCategory } from '@/services/category';

async function createRandomCategories() {
  const data = {
    name: faker.commerce.product(),
    description: faker.commerce.productDescription()
  };
  const categories = await createNewCategory(data);
  return categories;
}

export async function seedingCategories() {
  const productsToCreate = 10;
  for (let i = 0; i < productsToCreate; i++) {
    try {
      const cat = await createRandomCategories();
      console.log(`Created category: ${cat.name} with ${cat.description} `);
    } catch (e) {
      console.error(e);
    }
  }
}
