import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db'; // adjust your prisma import
import {
  isAdmin,
  updateUserByClerkId,
  updateUserRole
} from '@/services/user/user.services';
import { auth, clerkClient } from '@clerk/nextjs/dist/types/server';
import { getUserIdInToken } from '@/validations/auth';

// GET /api/admin/users?role=USER&page=1&limit=10
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get('page') || 1);
  const limit = Number(searchParams.get('limit') || 10);
  const role = searchParams.get('role') as 'USER' | 'ADMIN' | null;

  const where: any = {};
  if (role) where.role = role;

  const users = await db.user.findMany({
    where,
    skip: (page - 1) * limit,
    take: limit,
    include: {
      wishlist: true,
      orders: true,
      payments: true
    }
  });

  const total = await db.user.count({ where });

  return NextResponse.json({ users, total, page, limit });
}

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
