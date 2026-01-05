import { NextRequest, NextResponse } from 'next/server';
import { isAdmin } from '@/services/user/user.services';
import { getUserIdInToken } from '@/validations/auth';
import { deleteProductTyped, updateProductTyped } from '@/services/product';

// PATCH /api/admin/products/:id
export async function PATCH(req: NextRequest) {
  try {
    const userClerkId = await getUserIdInToken();
    const admin = await isAdmin(userClerkId);
    if (!admin) {
      return NextResponse.json({ message: 'not an admin' }, { status: 400 });
    }
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
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/products/:id
export async function DELETE(req: NextRequest) {
  try {
    const userClerkId = await getUserIdInToken();
    const admin = await isAdmin(userClerkId);
    if (!admin) {
      return NextResponse.json({ message: 'not an admin' }, { status: 400 });
    }

    const { searchParams } = new URL(req.url);
    const id = Number(searchParams.get('id'));

    if (!id || isNaN(id) || id <= 0)
      return NextResponse.json({ message: 'Missing id' }, { status: 400 });

    await deleteProductTyped(id);

    return NextResponse.json({ message: 'Product deleted' }, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
