import { isValidRole, Role, ROLES } from '@/types/roles';
import { auth } from '@clerk/nextjs/server';

export async function getUserRoleInToken() {
  const { sessionClaims } = await auth();
  if (!sessionClaims) {
    console.error('No session');
    throw new Error('FORBIDDEN');
  }
  if (!isValidRole(sessionClaims.role)) {
    console.error('Invalid Role');
    throw new Error('FORBIDDEN');
  }
  return sessionClaims.role as Role;
}

export async function getUserIdInToken() {
  const { userId } = await auth();
  if (!userId) {
    throw new Error('FORBIDDEN');
  }
  return userId;
}

export function isAdmin(role: string | Role) {
  if (role !== ROLES.ADMIN) return false;
  return true;
}
