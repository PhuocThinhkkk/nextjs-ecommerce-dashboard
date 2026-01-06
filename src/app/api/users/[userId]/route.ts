import { NextResponse } from 'next/server';
import { getUserIdInToken } from '@/validations/auth';
import {
  changeFromUserIdToClerk,
  executeUserUpdate,
  isAdmin,
  isValidRole
} from '@/services/user/user.services';
import { UserUpdateBuilder } from '@/services/user/user.update.builder';

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const userId = (await params).userId;
    let userReqId: string;
    try {
      userReqId = await getUserIdInToken();
    } catch {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const admin = await isAdmin(userReqId);
    const userClerkId = await changeFromUserIdToClerk(userId);
    if (!admin && userClerkId !== userReqId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    const formData = await req.formData();
    const name = formData.get('name') as string | null;
    const role = formData.get('role') as string | null;

    if (!name && !role) {
      return NextResponse.json({ error: 'invalid field!' }, { status: 400 });
    }
    if (!isValidRole(role)) {
      return NextResponse.json({ error: 'invalid role!' }, { status: 400 });
    }

    let intent;
    try {
      intent = new UserUpdateBuilder().setName(name).setRole(role).build();
    } catch (err) {
      return NextResponse.json(
        { error: (err as Error).message },
        { status: 400 }
      );
    }

    await executeUserUpdate(userClerkId, intent);

    return NextResponse.json({ message: 'update success!' }, { status: 200 });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: 'Update failed' }, { status: 400 });
  }
}
