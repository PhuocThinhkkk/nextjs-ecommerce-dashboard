import db from '@/lib/db';
import { Prisma, User } from '@prisma/client';
import { auth, clerkClient } from '@clerk/nextjs/server';
import { UserUpdateIntent } from './user.update.builder';
import { UserDBWithRole } from './user.types';
import { isValidRole, Role } from '@/types/roles';

export async function getUserByClerkId(clerkId: string) {
  return db.user.findUnique({
    where: { clerk_customer_id: clerkId },
    include: {
      wishlist: { include: { product: true } },
      orders: {
        include: { items: { include: { product_sku: true } }, payment: true }
      },
      payments: true
    }
  });
}

export async function getUserById(id: number): Promise<UserDBWithRole> {
  const user = await db.user.findUnique({
    where: { id: id }
  });
  if (!user?.clerk_customer_id) {
    throw new Error(`User with id ${id} does not have a Clerk customer ID`);
  }
  const role = await getUserRoleFromClerk(user?.clerk_customer_id);
  const u = { ...user, role };
  return u;
}

export async function getUserRoleFromClerk(userClerkId: string) {
  const client = await clerkClient();
  const user = await client.users.getUser(userClerkId);
  const role = user.publicMetadata.role;
  if (!role || !isValidRole(role)) {
    throw new Error('INVALID USER ROLE');
  }
  return role as Role;
}

export async function isAdmin(userClerkId: string) {
  const role = await getUserRoleFromClerk(userClerkId);
  if (role === 'ADMIN') {
    return true;
  }
  if (!role) {
    console.warn(
      `User with Clerk ID ${userClerkId} does not have a role assigned in Clerk.`
    );
  }
  return false;
}

export async function getUserFromClerk(clerkId: string) {
  const client = await clerkClient();
  return client.users.getUser(clerkId);
}

export async function getAllUsers(options?: { skip?: number; take?: number }) {
  return db.user.findMany({
    skip: options?.skip,
    take: options?.take
  });
}

export async function updateUserRole(userClerkId: string, role: Role) {
  const client = await clerkClient();

  await client.users.updateUser(userClerkId, {
    publicMetadata: {
      role
    }
  });
}

export async function createUserByClerkId(data: Prisma.UserCreateInput) {
  return db.user.create({ data });
}

export async function updateUserByClerkId(
  clerkId: string,
  data: Partial<{
    email: string;
    name: string;
    stripe_customer_id: string;
    phone_number: string;
    avatar_url: string;
  }>
) {
  return db.user.update({
    where: { clerk_customer_id: clerkId },
    data
  });
}

export async function deleteUserByClerkId(clerkId: string) {
  return db.user.delete({
    where: { clerk_customer_id: clerkId }
  });
}

export async function getTotalUsersNumber(): Promise<number> {
  return db.user.count();
}

export type FilterUserType = {
  page?: number;
  pageSize?: number;
};

export type UserWithPayment = Prisma.UserGetPayload<{
  include: {
    payments: true;
  };
}>;

export type UserWithPaymentAndRole = Prisma.UserGetPayload<{
  include: {
    payments: true;
  };
}> &
  RoleField;

export type RoleField = {
  role: Role;
};

export async function getUsersWithRoleAndPaymentByFilter(
  filter: FilterUserType
): Promise<UserWithPaymentAndRole[]> {
  const page = filter.page ?? 1;
  const pageSize = filter.pageSize ?? 10;

  const users = await db.user.findMany({
    skip: (page - 1) * pageSize,
    take: pageSize,
    where: {
      name: {
        contains: '',
        mode: 'insensitive'
      }
    },
    include: {
      payments: true
    },
    orderBy: { id: 'asc' }
  });

  const clerkUserIds = users.map((u) => u.clerk_customer_id);

  const clerkUsers = await (
    await clerkClient()
  ).users.getUserList({
    userId: clerkUserIds
  });

  const roleMap = new Map<string, Role>();

  clerkUsers.data.forEach((user) => {
    roleMap.set(user.id, (user.publicMetadata.role as Role) ?? 'USER');
  });

  return users.map((user) => ({
    ...user,
    role: roleMap.get(user.clerk_customer_id) ?? 'USER'
  }));
}

export async function executeUserUpdate(
  userClerkId: string,
  intent: UserUpdateIntent
) {
  try {
    if (intent.clerk?.role) {
      await updateUserRole(userClerkId, intent.clerk.role);
    }
    if (intent.db) {
      await updateUserByClerkId(userClerkId, intent.db);
    }
  } catch (error) {
    // Log the error with context about which update failed
    console.error(`Failed to execute user update for ${userClerkId}:`, error);

    // Re-throw to allow caller to handle the error
    throw new Error(
      `User update failed for ${userClerkId}. System may be in inconsistent state. ` +
        `Please verify Clerk and database records.`,
      { cause: error }
    );
  }
}

export async function changeFromUserIdToClerk(id: string) {
  const userId = parseInt(id);
  const user = await db.user.findFirst({
    where: { id: userId }
  });
  if (!user) {
    throw new Error('no user in clerk.');
  }
  return user.clerk_customer_id;
}
