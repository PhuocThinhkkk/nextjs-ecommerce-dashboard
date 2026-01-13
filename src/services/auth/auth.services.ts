import { isValidRole, Role, ROLES } from '@/types/roles';
import { auth } from '@clerk/nextjs/server';

export async function getUserRoleInToken() {
  const { sessionClaims } = await auth();
  if (!sessionClaims) throw new Error('FORBIDDEN');
  if (!isValidRole(sessionClaims.role)) throw new Error('FORBIDDEN');
  return sessionClaims.role as Role;
}

export async function getUserIdInToken() {
  const { userId } = await auth();
  if (!userId) {
    throw new Error('FORBIDDEN');
  }
  return userId;
}

export async function isAdmin(role: string | Role) {
  if (role !== ROLES.ADMIN) return false;
  return true;
}
