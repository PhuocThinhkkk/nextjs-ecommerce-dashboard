import { getUserRoleInToken } from '@/services/auth/auth.services';
import { ROLES } from '@/types/roles';

export async function requireAdmin() {
  const role = await getUserRoleInToken();
  if (role !== ROLES.ADMIN) throw new Error('UNAUTHORIZED');
  return true;
}
