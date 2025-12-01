import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { Webhook } from 'svix';
import db from '@/lib/db';
import { AuthProvider } from '@prisma/client';

export async function POST(req: Request) {
  console.log('webhook come from clerk to create user');
  const payload = await req.text();
  const headerPayload = headers();

  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET!);

  let event: any;

  try {
    event = wh.verify(payload, {
      'svix-id': (await headerPayload).get('svix-id')!,
      'svix-timestamp': (await headerPayload).get('svix-timestamp')!,
      'svix-signature': (await headerPayload).get('svix-signature')!
    });
  } catch (err) {
    console.error('Webhook signature verification failed', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const { type, data } = event;

  if (
    type === 'user.created' ||
    type === 'user.updated' ||
    type === 'email.created' ||
    type === 'session.created'
  ) {
    try {
      const email = data.email_addresses?.[0]?.email_address ?? null;

      if (!email) {
        return NextResponse.json({ message: 'No email' }, { status: 400 });
      }

      const isGoogle = data.external_accounts?.some(
        (acc: any) => acc.provider === 'google'
      );

      const provider: AuthProvider = isGoogle ? 'GOOGLE' : 'EMAIL';

      const name = `${data.first_name ?? ''} ${data.last_name ?? ''}`.trim();

      const avatar = data.image_url || null;

      // ✅ ATOMIC & SAFE (no duplicates possible)
      await db.user.upsert({
        where: { clerk_customer_id: data.id },
        update: {
          name: name || undefined,
          avatar_url: avatar,
          auth_provider: {
            push: provider
          }
        },
        create: {
          clerk_customer_id: data.id,
          email,
          name,
          avatar_url: avatar,
          role: 'USER',
          auth_provider: [provider]
        }
      });

      return NextResponse.json({ success: true });
    } catch (err) {
      console.error('Webhook DB error:', err);
      return NextResponse.json({ message: 'Database error' }, { status: 500 });
    }
  }

  return NextResponse.json({ ignored: true });
}
