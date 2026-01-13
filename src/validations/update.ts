import { getUserRoleInToken } from '@/services/auth/auth.services';
import { isAdmin } from '@/services/auth/auth.services';
import { auth } from '@clerk/nextjs/server';

export async function requirePermissionToUpdateUser(updatedUserId: string) {
  const authUserRole = await getUserRoleInToken();
  if (await isAdmin(authUserRole)) {
    return true;
  }
  const userAuthId = (await auth()).userId;
  const isValid = updatedUserId === userAuthId;
  if (!isValid) throw new Error('FORBIDDEN');
  return true;
}
