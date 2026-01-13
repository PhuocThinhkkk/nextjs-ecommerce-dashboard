import { getUserRoleInToken } from '@/services/auth/auth.services';
import { isAdmin } from '@/services/auth/auth.services';
import { changeFromUserIdToClerk } from '@/services/user/user.services';
import { auth } from '@clerk/nextjs/server';

export async function requirePermissionToUpdateUser(updatedUserId: string) {
  const authUserRole = await getUserRoleInToken();
  if (await isAdmin(authUserRole)) {
    return true;
  }
  const userAuthId = (await auth()).userId;
  if (!userAuthId) {
    throw new Error('UNAUTHORIZED');
  }
  const userDbId = await changeFromUserIdToClerk(userAuthId);
  const isValid = updatedUserId === userDbId;
  if (!isValid) throw new Error('FORBIDDEN');
  return true;
}
