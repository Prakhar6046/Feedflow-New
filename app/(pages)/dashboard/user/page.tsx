import BasicBreadcrumbs from '@/app/_components/Breadcrumbs';
import UserTable from '@/app/_components/UserTable';
import { getUsers } from '@/app/_lib/action';
import { SingleUser } from '@/app/_typeModels/User';
import { getCookie } from 'cookies-next';
import { Metadata } from 'next';
import { cookies } from 'next/headers';
export const metadata: Metadata = {
  title: 'User',
};
export default async function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
  };
}) {
  const query = searchParams?.query || '';
  const loggedUser = getCookie('logged-user', { cookies });
  const user: SingleUser = JSON.parse(loggedUser ?? '');
  const users = await getUsers({
    role: user.role,
    organisationId: user.organisationId,
    query,
  });

  return (
    <>
      <BasicBreadcrumbs
        heading={'Users'}
        buttonName={'Add User'}
        buttonRoute="/dashboard/user/new"
        isTable={true}
        links={[
          { name: 'Dashboard', link: '/dashboard' },
          { name: 'Users', link: '/dashboard/user' },
        ]}
        permissions={user?.permissions?.createUsers}
      />
      <UserTable
        users={users.data}
        permissions={user?.permissions?.editUsers}
      />
    </>
  );
}
