import { auth, currentUser } from '@clerk/nextjs/server';
import db from '@/lib/db';
import { NextResponse } from 'next/server';
import { AuthProvider } from '@prisma/client';
import { updateUserRole } from '@/services/user';

export async function GET(req: Request) {
  try {
    const clerkUserId = (await auth()).userId;
    if (!clerkUserId) {
      console.log('clerk auth: ', await auth());
      return NextResponse.json({ message: 'Not signed in' }, { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { clerk_customer_id: clerkUserId }
    });

    if (!user) {
      console.log('okay I fucked up');
      return NextResponse.json(
        { message: 'Server fucked up' },
        { status: 500 }
      );
    }
    return NextResponse.json({ user });
  } catch (e) {
    console.error('Server error: ', e);
    return NextResponse.json(
      { message: 'There is something wrong with server' },
      { status: 500 }
    );
  }
}

export async function POST() {
  try {
    const clerkUserId = (await auth()).userId;
    console.log('clerk auth: ', await auth());
    if (!clerkUserId) {
      return NextResponse.json({ message: 'Not signed in' }, { status: 401 });
    }

    const clerkUser = await currentUser();
    if (!clerkUser) {
      console.log('current User: ', clerkUser);
      return NextResponse.json({ message: 'Not signed in' }, { status: 401 });
    }

    let provider: AuthProvider = 'EMAIL';
    if (clerkUser.publicMetadata?.oauthProvider === 'google') {
      provider = 'GOOGLE';
    }

    let user_avatar_url = clerkUser.imageUrl || null;

    let user = await db.user.findUnique({
      where: { clerk_customer_id: clerkUser.id }
    });

    if (user && !user.auth_provider.includes(provider)) {
      const updated_providers = [...user.auth_provider, provider];
      user = await db.user.update({
        where: { id: user.id },
        data: { auth_provider: updated_providers }
      });
    }

    if (!user) {
      const providers = [provider];
      user = await db.user.create({
        data: {
          clerk_customer_id: clerkUser.id,
          email: clerkUser.primaryEmailAddress?.emailAddress ?? '',
          name: `${clerkUser.firstName} ${clerkUser.lastName}`,
          auth_provider: providers,
          avatar_url: user_avatar_url
        }
      });

      await updateUserRole(clerkUserId, 'USER');
    }

    return NextResponse.json({ user });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  const clerkUser = await currentUser();
  if (!clerkUser)
    return NextResponse.json({ message: 'Not signed in' }, { status: 401 });

  const body = await req.json();
  const updatedUser = await db.user.update({
    where: { clerk_customer_id: clerkUser.id },
    data: {
      name: body.name
    }
  });

  return NextResponse.json({ user: updatedUser });
}

export async function DELETE(req: Request) {
  const clerkUser = await currentUser();
  if (!clerkUser)
    return NextResponse.json({ message: 'Not signed in' }, { status: 401 });

  await db.user.delete({
    where: { clerk_customer_id: clerkUser.id }
  });

  return NextResponse.json({ message: 'User deleted' });
}
