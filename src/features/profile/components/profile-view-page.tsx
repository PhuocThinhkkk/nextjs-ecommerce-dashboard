import { UserProfile } from '@clerk/nextjs';

export default function ProfileViewPage() {
  return (
    <div className='justtify-center flex w-full flex-col items-center p-4'>
      <UserProfile />
    </div>
  );
}
