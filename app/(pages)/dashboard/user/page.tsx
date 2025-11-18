import BasicBreadcrumbs from '@/app/_components/Breadcrumbs';
import UserTable from '@/app/_components/UserTable';
import { getUsers } from '@/app/_lib/action';
import { SingleUser } from '@/app/_typeModels/User';
import { getCookie } from 'cookies-next';
import { Metadata } from 'next';
import { cookies } from 'next/headers';
import { getUserAccessConfig } from '@/app/_lib/constants/userAccessMatrix';
import { canAddUsers, canEditUsers, canViewUsers } from '@/app/_lib/utils/permissions/access';

export const metadata: Metadata = {
  title: 'User',
};
export const dynamic = 'force-dynamic';

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
  
  // Get user's access configuration
  const loggedUserOrgType = user?.organisationType || '';
  const loggedUserType = user?.role || '';
  const userAccess = getUserAccessConfig(loggedUserOrgType, loggedUserType);
  
  const users = await getUsers({
    role: user.role,
    organisationId: user.organisationId,
    query,
  });

  const canAdd = canAddUsers(userAccess, String(user?.role), loggedUserOrgType);
  const canEdit = canEditUsers(userAccess, String(user?.role), loggedUserOrgType);
  const canView = canViewUsers(userAccess, String(user?.role));

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
        permissions={canAdd}
        userAccess={userAccess}
      />
      <UserTable
        users={users.data}
        userAccess={userAccess}
        userRole={String(user?.role)}
        userOrganisationType={loggedUserOrgType}
        canEdit={canEdit}
        canView={canView}
      />
    </>
  );
}
