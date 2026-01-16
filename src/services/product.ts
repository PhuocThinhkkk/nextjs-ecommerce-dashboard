import db from '@/lib/db';
import { Prisma, Product } from '@prisma/client';

export type CreateProductWithSkusInput = {
  product: Prisma.ProductCreateInput;
  skus: Omit<Prisma.ProductsSkusCreateManyInput, 'productId'>[];
};

export type ProductWithSkus = Prisma.ProductGetPayload<{
  include: {
    skus: true;
  };
}>;

export async function getProductWithSkusById(
  productId: string
): Promise<ProductWithSkus | null> {
  const id = parseInt(productId);
  const product = await db.product.findUnique({
    where: {
      id: id
    },
    include: {
      skus: true
    }
  });
  return product;
}

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
import crypto from 'crypto';

function generateSku(params: {
  productId: number;
  color: string;
  size: string;
}) {
  const base = `${params.productId}-${params.color}-${params.size}-${Date.now()}`;
  const hash = crypto
    .createHash('sha1')
    .update(base)
    .digest('hex')
    .slice(0, 8)
    .toUpperCase();

  return `SKU-${hash}`;
}

export type UpdateProductWithSkusInput = {
  name: string;
  description?: string | null;
  categoryId: number;
  photo_url?: string | null;
  skus: {
    id?: number | undefined;
    size_attribute: string;
    color_attribute: string;
    price: number;
  }[];
};

export async function updateProductWithSkus(
  productId: number,
  data: UpdateProductWithSkusInput
) {
  const incomingIds = data.skus
    .map((s) => s.id)
    .filter((id): id is number => typeof id === 'number');

  const skusToDelete = await db.productsSkus.findMany({
    where: {
      productId,
      ...(incomingIds.length > 0 && {
        id: { notIn: incomingIds }
      })
    },
    select: { id: true }
  });

  if (skusToDelete.length > 0) {
    const usedSku = await db.orderItems.findFirst({
      where: {
        productSkuId: {
          in: skusToDelete.map((s) => s.id)
        }
      }
    });

    if (usedSku) {
      throw new Error('One or more SKUs are already used in orders.');
    }
  }

  await db.$transaction([
    db.product.update({
      where: { id: productId },
      data: {
        name: data.name,
        description: data.description,
        categoryId: data.categoryId,
        photo_url: data.photo_url ?? undefined
      }
    }),

    ...(skusToDelete.length > 0
      ? [
          db.productsSkus.deleteMany({
            where: {
              id: { in: skusToDelete.map((s) => s.id) }
            }
          })
        ]
      : []),

    ...data.skus.map((sku) =>
      sku.id
        ? db.productsSkus.update({
            where: { id: sku.id },
            data: {
              price: sku.price,
              size_attribute: sku.size_attribute,
              color_attribute: sku.color_attribute
            }
          })
        : db.productsSkus.create({
            data: {
              productId,
              size_attribute: sku.size_attribute,
              color_attribute: sku.color_attribute,
              price: sku.price,
              sku: generateSku({
                productId,
                color: sku.color_attribute,
                size: sku.size_attribute
              })
            }
          })
    )
  ]);
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

export async function getProductsWithTotalOrders() {
  const products = await db.product.findMany({
    select: {
      id: true,
      name: true,
      photo_url: true,
      skus: {
        select: {
          orderItems: {
            select: {
              quantity: true
            }
          }
        }
      }
    }
  });

  const result = products.map((product) => {
    const totalOrders =
      product.skus.reduce((skuAcc, sku) => {
        const skuOrders = sku.orderItems.reduce(
          (orderAcc, item) => orderAcc + item.quantity,
          0
        );
        return skuAcc + skuOrders;
      }, 0) || 0;

    return {
      name: product.name,
      photo_url: product.photo_url,
      orders: totalOrders
    };
  });

  return result;
}
