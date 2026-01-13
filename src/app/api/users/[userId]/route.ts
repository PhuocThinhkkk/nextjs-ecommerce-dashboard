import { NextResponse } from 'next/server';
import {
  changeFromUserIdToClerk,
  executeUserUpdate
} from '@/services/user/user.services';
import { isValidRole } from '@/types/roles';
import { UserUpdateBuilder } from '@/services/user/user.update.builder';
import { requirePermistionToUpdateUser } from '@/validations/update';
import { handleError } from '@/lib/api-error-handler';

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const userId = (await params).userId;
    await requirePermistionToUpdateUser(userId);
    const userClerkId = await changeFromUserIdToClerk(userId);

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
    return handleError(err);
  }
}
