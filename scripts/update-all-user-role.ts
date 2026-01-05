import db from '@/lib/db';
import {
  getAllUsers,
  getUserFromClerk,
  updateUserRole
} from '@/services/user/user.services';

async function main() {
  const users = await getAllUsers();
  console.log('Users need to update: ', users);

  if (users.length === 0) {
    console.log('❌ No users found.');
    return;
  }

  for (let i = 0; i < users.length; i++) {
    const userClerkId = users[i].clerk_customer_id;
    if (!userClerkId) {
      console.log('How the f this user dont have the clerk id :', users[i]);
      continue;
    }
    try {
      const userInClerk = await getUserFromClerk(userClerkId);
      const role = userInClerk.publicMetadata?.role;
      if (role) {
        continue;
      }
      await updateUserRole(userClerkId, 'USER');
    } catch (e) {
      console.log('err with user clerk id', userClerkId);
    }
  }
  console.log(`Success`);
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
