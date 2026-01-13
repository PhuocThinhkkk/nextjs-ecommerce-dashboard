import { NextRequest, NextResponse } from 'next/server';
import { isAdmin } from '@/services/user/user.services';
import { getUserIdInToken } from '@/services/auth/auth.services';
import { deleteProductTyped, updateProductTyped } from '@/services/product';
import { requireAdmin } from '@/validations/admin';
import { handleError } from '@/lib/api-error-handler';

// PATCH /api/admin/products/:id
export async function PATCH(req: NextRequest) {
  try {
    await requireAdmin();
    const body = await req.json();

    if (!body.data) {
      return NextResponse.json({ message: 'Missing data' }, { status: 400 });
    }
    const { name, description } = body.data;
    const { searchParams } = new URL(req.url);
    const productId = Number(searchParams.get('id'));
    if (!productId || isNaN(productId) || productId <= 0)
      return NextResponse.json({ message: 'Missing id' }, { status: 400 });
    const data = { name, description };
    const updatedProduct = await updateProductTyped(productId, data);
    return NextResponse.json({ product: updatedProduct }, { status: 200 });
  } catch (e: any) {
    console.error(e);
    return handleError(e);
  }
}

// DELETE /api/admin/products/:id
export async function DELETE(req: NextRequest) {
  try {
    await requireAdmin();

    const { searchParams } = new URL(req.url);
    const id = Number(searchParams.get('id'));

    if (!id || isNaN(id) || id <= 0)
      return NextResponse.json({ message: 'Missing id' }, { status: 400 });

    await deleteProductTyped(id);

    return NextResponse.json({ message: 'Product deleted' }, { status: 200 });
  } catch (e: any) {
    console.error(e);
    return handleError(e);
  }
}
