import { NextRequest, NextResponse } from 'next/server';
import { isAdmin } from '@/services/user';
import { getUserIdInToken } from '@/validations/auth';
import { updateSkuTyped } from '@/services/product';
import { deleteSku } from '@/services/skus';

// PATCH /api/admin/skus/:id
export async function PATCH(req: NextRequest) {
  try {
    const userClerkId = await getUserIdInToken();
    const admin = await isAdmin(userClerkId);
    if (!admin) {
      return NextResponse.json({ message: 'not an admin' }, { status: 400 });
    }
    const body = await req.json();
    const { size_attribute, color_attribute, price } = body;

    if (!body.data) {
      return NextResponse.json(
        { message: 'Missing id or data' },
        { status: 400 }
      );
    }
    const { searchParams } = new URL(req.url);
    const skusId = Number(searchParams.get('id'));
    if (!skusId)
      return NextResponse.json({ message: 'Missing id' }, { status: 400 });
    const data = { size_attribute, color_attribute, price };
    const skus = await updateSkuTyped(skusId, data);
    return NextResponse.json({ message: skus }, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ message: 'shit server' }, { status: 500 });
  }
}

// DELETE /api/admin/skus/:id
export async function DELETE(req: NextRequest) {
  try {
    const userClerkId = await getUserIdInToken();
    const admin = await isAdmin(userClerkId);
    if (!admin) {
      return NextResponse.json({ message: 'not an admin' }, { status: 400 });
    }

    const { searchParams } = new URL(req.url);
    const id = Number(searchParams.get('id'));

    if (!id)
      return NextResponse.json({ message: 'Missing id' }, { status: 400 });

    await deleteSku(id);

    return NextResponse.json({ message: 'skus deleted' }, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ message: 'shit server' }, { status: 500 });
  }
}
