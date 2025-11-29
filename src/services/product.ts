import db from '@/lib/db';
import { Prisma, Product } from '@prisma/client';

export type CreateProductWithSkusInput = {
  product: Prisma.ProductCreateInput;
  skus: Omit<Prisma.ProductsSkusCreateManyInput, 'productId'>[];
};

export async function createProductWithSkusTyped(
  data: CreateProductWithSkusInput
): Promise<Product & { skus: { id: number }[] }> {
  return db.$transaction(async (tx) => {
    const product = await tx.product.create({
      data: data.product
    });

    const skuData: Prisma.ProductsSkusCreateManyInput[] = data.skus.map(
      (sku) => ({
        ...sku,
        productId: product.id
      })
    );

    await tx.productsSkus.createMany({
      data: skuData
    });

    return tx.product.findUniqueOrThrow({
      where: { id: product.id },
      include: { skus: true }
    });
  });
}

import { ProductsSkus } from '@prisma/client';

export async function addSkuToProductTyped(
  data: Prisma.ProductsSkusUncheckedCreateInput
): Promise<ProductsSkus> {
  return db.productsSkus.create({
    data
  });
}

export async function updateProductTyped(
  productId: number,
  data: Prisma.ProductUpdateInput
) {
  return db.product.update({
    where: { id: productId },
    data
  });
}

export async function updateSkuTyped(
  skuId: number,
  data: Prisma.ProductsSkusUpdateInput
) {
  return db.productsSkus.update({
    where: { id: skuId },
    data
  });
}

export async function deleteProductTyped(productId: number) {
  return db.$transaction([
    db.productsSkus.deleteMany({ where: { productId } }),
    db.product.delete({ where: { id: productId } })
  ]);
}

export async function getProductByIdTyped(productId: number) {
  return db.product.findUnique({
    where: { id: productId },
    include: {
      skus: true,
      category: true
    }
  });
}

export type FilterProductType = {
  page?: number;
  pageSize?: number;
};

export type ProductWithCategory = Prisma.ProductGetPayload<{
  include: {
    category: true;
    skus: true;
  };
}>;

export async function getProductsByFilter(
  filter: FilterProductType
): Promise<ProductWithCategory[]> {
  const page = filter.page ? filter.page : 1;
  const pageSize = filter.pageSize ? filter.pageSize : 10;
  console.log(pageSize);

  const items = await db.product.findMany({
    skip: (page - 1) * pageSize,
    take: pageSize,
    where: {
      name: {
        contains: '', // or equals
        mode: 'insensitive'
      }
    },
    include: {
      category: true,
      skus: true
    },
    orderBy: { id: 'asc' }
  });
  return items;
}

export async function getTotalProductsNumber() {
  const totalItems = await db.product.count();
  return totalItems;
}
