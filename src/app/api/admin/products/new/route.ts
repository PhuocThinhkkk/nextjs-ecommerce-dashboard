import { NextRequest, NextResponse } from 'next/server';
import {
  createProductWithSkusTyped,
  updateProductWithSkus
} from '@/services/product';
import { requireAdmin } from '@/validations/admin';
import { handleError } from '@/lib/api-error-handler';
import { parseProductForm } from '../[productId]/parse-product-form';

// POST /api/admin/products/:id
export async function POST(req: NextRequest) {
  try {
    await requireAdmin();

    const formData = await req.formData();

    console.log('form: ', formData);

    const dataRaw = parseProductForm(formData);
    if (!dataRaw) {
      return NextResponse.json({ message: 'Missing data' }, { status: 400 });
    }
    console.log(dataRaw);

    const { name, description, categoryId, skus } = dataRaw;
    const data = {
      product: {
        name,
        description,
        categoryId
      },
      skus
    };
    const product = await createProductWithSkusTyped(data);
    return NextResponse.json({ product }, { status: 200 });
  } catch (e: any) {
    return handleError(e);
  }
}
