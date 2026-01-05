import FormCardSkeleton from '@/components/form-card-skeleton';
import PageContainer from '@/components/layout/page-container';
import { Suspense } from 'react';
import { getUserById } from '@/services/user/user.services';
import UserViewPage from '@/features/users/components/user-view-page';

export const metadata = {
  title: 'Dashboard : User View'
};

type PageProps = { params: Promise<{ userId: string }> };

export default async function Page(props: PageProps) {
  try {
    const { userId } = await props.params;
    const id = parseInt(userId);
    const user = await getUserById(id);
    if (!user) {
      throw new Error('User not found.');
    }
    return (
      <PageContainer scrollable>
        <div className='flex-1 space-y-4'>
          <Suspense fallback={<FormCardSkeleton />}>
            <UserViewPage userDataOnDB={user} />
          </Suspense>
        </div>
      </PageContainer>
    );
  } catch (e) {
    console.error('Error loading user:', e);
    throw e;
  }
}
