import db from '@/lib/db';
import { Prisma } from '@prisma/client';
export async function getSkusByProductId(productId: number) {
  return db.productsSkus.findMany({
    where: { productId },
    orderBy: { id: 'asc' }
  });
}

export async function createSku(data: Prisma.ProductsSkusCreateInput) {
  return db.productsSkus.create({
    data
  });
}

export async function deleteSku(skuId: number) {
  return db.productsSkus.delete({
    where: { id: skuId }
  });
}

export type UpdateSkuInput = {
  price?: number;
  size_attribute?: string;
  color_attribute?: string;
  sku?: string;
};

export async function updateSku(skuId: number, data: UpdateSkuInput) {
  return db.productsSkus.update({
    where: { id: skuId },
    data
  });
}

export type BatchUpdateSkuInput = {
  id: number;
  price?: number;
  size_attribute?: string;
  color_attribute?: string;
};

export async function batchUpdateSkus(updates: BatchUpdateSkuInput[]) {
  return db.$transaction(
    updates.map((sku) =>
      db.productsSkus.update({
        where: { id: sku.id },
        data: {
          price: sku.price,
          size_attribute: sku.size_attribute,
          color_attribute: sku.color_attribute
        }
      })
    )
  );
}
