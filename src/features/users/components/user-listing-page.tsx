import { searchParamsCache } from '@/lib/searchparams';
import { UserTable } from '@/features/users/components/user-tables';
import {
  getTotalUsersNumber,
  getUsersWithRoleAndPaymentByFilter,
  UserWithPaymentAndRole
} from '@/services/user/user.services';
import { PageTableFilterData } from '@/types/data-table';
import { columns } from '@/features/users/components/user-tables/column';

type UserListingPage = {};

export default async function UserListingPage({}: UserListingPage) {
  // Showcasing the use of search params cache in nested RSCs
  const page = searchParamsCache.get('page');
  const search = searchParamsCache.get('name');
  const pageSize = searchParamsCache.get('pageSize');

  const filters = {
    page,
    pageSize,
    ...(search && { search })
  };

  const [data, totalUsers] = await Promise.all([
    getUsersWithRoleAndPaymentByFilter({ page: page, pageSize: pageSize }),
    getTotalUsersNumber()
  ]);

  const pageData: PageTableFilterData = {
    page,
    pageSize,
    ...(search && { search }),
    total: totalUsers
  };

  return (
    <UserTable<UserWithPaymentAndRole>
      data={data}
      totalItems={totalUsers}
      pageData={pageData}
      columns={columns}
    />
  );
}
