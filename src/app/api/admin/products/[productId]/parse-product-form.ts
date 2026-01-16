import { z } from 'zod';

/** SKU schema */
export const skuSchema = z.object({
  id: z.number().min(1).optional(),
  color_attribute: z.string().min(1),
  size_attribute: z.string().min(1),
  price: z.number().min(0)
});

/** Raw form schema (before parsing) */
export const productFormRawSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  categoryId: z.string(), // comes from RHF as string
  skus: z.string() // JSON string
});

/** Parsed & Prisma-ready schema */
export const productParsedSchema = z.object({
  name: z.string(),
  description: z.string(),
  categoryId: z.number().int().positive(),
  skus: z.array(skuSchema)
});

export type ProductParsedInput = z.infer<typeof productParsedSchema>;

export function formDataToObject(formData: FormData) {
  return Object.fromEntries(formData.entries());
}

export function parseProductForm(formData: FormData) {
  // Step 1: FormData → plain object
  const raw = Object.fromEntries(formData.entries());

  // Step 2: Validate raw shape
  const rawParsed = productFormRawSchema.safeParse(raw);
  if (!rawParsed.success) {
    throw rawParsed.error;
  }

  // Step 3: Transform types
  const transformed = {
    ...rawParsed.data,
    categoryId: Number(rawParsed.data.categoryId),
    skus: JSON.parse(rawParsed.data.skus)
  };

  // Step 4: Final validation (Prisma-ready)
  const finalParsed = productParsedSchema.safeParse(transformed);
  if (!finalParsed.success) {
    throw finalParsed.error;
  }

  return finalParsed.data;
}
