import { NextRequest, NextResponse } from 'next/server';
import { deleteProductTyped, updateProductWithSkus } from '@/services/product';
import { requireAdmin } from '@/validations/admin';
import { handleError } from '@/lib/api-error-handler';
import { parseProductForm } from './parse-product-form';

// PATCH /api/admin/products/:id
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    await requireAdmin();

    const id = parseInt((await params).productId);
    if (!id || isNaN(id) || id <= 0)
      return NextResponse.json({ message: 'Missing id' }, { status: 400 });

    const formData = await req.formData();

    console.log('form: ', formData);

    const dataRaw = parseProductForm(formData);
    if (!dataRaw) {
      return NextResponse.json({ message: 'Missing data' }, { status: 400 });
    }
    console.log(dataRaw);

    const { name, description, categoryId, skus } = dataRaw;
    const data = { name, description, categoryId, skus };
    await updateProductWithSkus(id, data);
    return NextResponse.json({ message: 'success' }, { status: 200 });
  } catch (e: any) {
    return handleError(e);
  }
}

// DELETE /api/admin/products/:id
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    await requireAdmin();

    const id = parseInt((await params).productId);
    if (!id || isNaN(id) || id <= 0)
      return NextResponse.json({ message: 'invalid id' }, { status: 400 });

    await deleteProductTyped(id);

    return NextResponse.json({ message: 'Product deleted' }, { status: 200 });
  } catch (e: any) {
    return handleError(e);
  }
}
