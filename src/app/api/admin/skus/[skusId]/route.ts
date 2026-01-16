import { NextRequest, NextResponse } from 'next/server';
import { updateSkuTyped } from '@/services/product';
import { deleteSku } from '@/services/skus';
import { requireAdmin } from '@/validations/admin';
import { handleError } from '@/lib/api-error-handler';

// PATCH /api/admin/skus/:id
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ skusId: string }> }
) {
  try {
    await requireAdmin();

    const id = parseInt((await params).skusId);
    if (Number.isNaN(id)) {
      return NextResponse.json({ error: 'Invalid productId' }, { status: 400 });
    }

    const body = await req.json();
    const { size_attribute, color_attribute, price } = body.data;

    if (!body.data) {
      return NextResponse.json({ message: 'Missing data' }, { status: 400 });
    }
    const data = { size_attribute, color_attribute, price };
    const skus = await updateSkuTyped(id, data);
    return NextResponse.json({ message: skus }, { status: 200 });
  } catch (e: any) {
    return handleError(e);
  }
}

// DELETE /api/admin/skus/:id
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ skusId: string }> }
) {
  try {
    await requireAdmin();

    const id = parseInt((await params).skusId);
    if (isNaN(id))
      return NextResponse.json({ message: 'Missing id' }, { status: 400 });

    await deleteSku(id);

    return NextResponse.json({ message: 'skus deleted' }, { status: 200 });
  } catch (e: any) {
    return handleError(e);
  }
}
