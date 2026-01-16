import z from 'zod';

export const skuSchema = z.object({
  id: z
    .preprocess((v) => {
      if (v === '' || v === null || v === undefined) return undefined;
      if (typeof v === 'string') return Number(v);
      return v;
    }, z.any())
    .optional(),
  color_attribute: z.string().min(1, 'Color is required'),
  size_attribute: z.string().min(1, 'Size is required'),
  price: z.preprocess(
    (v: any) => {
      if (typeof v === 'string') {
        return Number(v);
      }
      if (typeof v === 'number') {
        return v;
      }
    },
    z
      .float64({ message: 'Price must be a number like: 8.9' })
      .min(0, 'Must be greater than 0.')
  )
});

export const productFormSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  categoryId: z.string(),
  image: z.any().optional(),
  skus: z.array(skuSchema).min(1, 'At least one SKU is required')
});

export type FormValues = z.infer<typeof productFormSchema>;
