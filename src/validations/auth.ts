import { auth } from '@clerk/nextjs/dist/types/server';

export async function getUserIdInToken() {
  const { userId } = await auth();
  if (!userId) {
    throw new Error('No user id in the req.');
  }
  return userId;
}
