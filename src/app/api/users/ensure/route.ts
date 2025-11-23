import { currentUser } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import { AuthProvider } from 'generated/prisma/enums';

export async function GET(req: Request) {
  const clerkUser = await currentUser();
  if (!clerkUser)
    return NextResponse.json({ error: 'Not signed in' }, { status: 401 });

  const user = await db.user.findUnique({
    where: { clerk_customer_id: clerkUser.id }
  });

  if (!user) {
    console.log('okay I fucked up');
    return NextResponse.json({ error: 'Server fucked up' }, { status: 500 });
  }

  return NextResponse.json({ user });
}

export async function POST() {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser)
      return NextResponse.json({ error: 'Not signed in' }, { status: 401 });

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
          avatar_url: user_avatar_url,
          role: 'USER'
        }
      });
    }

    return NextResponse.json({ user });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  const clerkUser = await currentUser();
  if (!clerkUser) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const body = await req.json();
  const updatedUser = await db.user.update({
    where: { clerk_customer_id: clerkUser.id },
    data: {
      name: body.name,
    },
  });

  return NextResponse.json({ user: updatedUser });
}

export async function DELETE(req: Request) {
  const clerkUser = await currentUser();
  if (!clerkUser) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  await db.user.delete({
    where: { clerk_customer_id: clerkUser.id },
  });

  return NextResponse.json({ message: "User deleted" });
}

