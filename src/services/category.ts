import db from '@/lib/db';
import { Category, Prisma } from '@prisma/client';

export async function createNewCategory(
  data: Prisma.CategoryCreateInput
): Promise<Category> {
  const category = await db.category.create({
    data: data
  });

  return category;
}
