import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db'; // adjust your prisma import
import { isAdmin, updateUserByClerkId, updateUserRole } from '@/services/user';
import { getUserIdInToken } from '@/validations/auth';

// PATCH /api/admin/users/:id
export async function PATCH(req: NextRequest) {
  try {
    const userClerkId = await getUserIdInToken();
    const admin = await isAdmin(userClerkId);
    if (!admin) {
      return NextResponse.json({ error: 'not an admin' }, { status: 400 });
    }
    const body = await req.json();
    const { name, role } = body; // expect { id, data: { name, role, email, etc } }

    if (!name || !body.data) {
      return NextResponse.json(
        { error: 'Missing id or data' },
        { status: 400 }
      );
    }
    const { searchParams } = new URL(req.url);
    const clerkId = searchParams.get('id');
    if (!clerkId)
      return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    if (role !== 'USER' && role !== 'ADMIN') {
      return NextResponse.json({ error: 'role f up!' }, { status: 400 });
    }
    const updatedUser = await updateUserByClerkId(clerkId, { name: name });
    await updateUserRole(clerkId, role);
    return NextResponse.json({ user: updatedUser });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'shit server' }, { status: 500 });
  }
}

// DELETE /api/admin/users/:id
export async function DELETE(req: NextRequest) {
  try {
    const userClerkId = await getUserIdInToken();
    const admin = await isAdmin(userClerkId);
    if (!admin) {
      return NextResponse.json({ error: 'not an admin' }, { status: 400 });
    }

    const { searchParams } = new URL(req.url);
    const id = Number(searchParams.get('id'));

    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

    await db.user.delete({ where: { id } });

    return NextResponse.json({ message: 'User deleted' });
  } catch (e) {
    return NextResponse.json({ error: 'shit server' }, { status: 500 });
  }
}
