import db from '@/lib/db';
import {
  getUserByClerkId,
  updateUserRole
} from '@/services/user/user.services';
import { isValidRole } from '@/types/roles';

const [, , userClerkId, role] = process.argv;

if (!userClerkId || !role) {
  console.error('Usage: npm run db:set-role <userId> <ROLE>');
  process.exit(1);
}

async function main() {
  const user = await getUserByClerkId(userClerkId);

  if (!user?.clerk_customer_id) {
    console.error('shit!');
    process.exit(1);
  }

  if (!isValidRole(role)) {
    console.error('Role must be USER or ADMIN.');
    process.exit(1);
  }

  await updateUserRole(user.clerk_customer_id, role);
  console.log('Success!');
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
