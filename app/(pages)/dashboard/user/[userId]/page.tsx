import BasicBreadcrumbs from '@/app/_components/Breadcrumbs';
import EditUser from '@/app/_components/user/EditUser';
import { Metadata } from 'next';
import { getCookie } from 'cookies-next';
import { cookies } from 'next/headers';
import { SingleUser } from '@/app/_typeModels/User';
import { getUserAccessConfig } from '@/app/_lib/constants/userAccessMatrix';
import { canEditUsers, canViewUsers } from '@/app/_lib/utils/permissions/access';

export const metadata: Metadata = {
  title: 'Edit User',
};
export const dynamic = 'force-dynamic';

export default async function Page({ params }: { params: { userId: string } }) {
  const loggedUser = getCookie('logged-user', { cookies });
  const user: SingleUser = JSON.parse(loggedUser ?? '');
  
  // Get user's access configuration
  const loggedUserOrgType = user?.organisationType || '';
  const loggedUserType = user?.role || '';
  const userAccess = getUserAccessConfig(loggedUserOrgType, loggedUserType);
  
  const canEdit = canEditUsers(userAccess, String(user?.role), loggedUserOrgType);
  const canView = canViewUsers(userAccess, String(user?.role));
  const isViewOnly = canView && !canEdit;
  
  const heading = isViewOnly ? 'View User' : 'Edit User';
  const breadcrumbName = isViewOnly ? 'View User' : 'Edit User';
  
  return (
    <>
      <BasicBreadcrumbs
        heading={heading}
        isTable={false}
        hideSearchInput={true}
        links={[
          { name: 'Dashboard', link: '/dashboard' },
          { name: 'Users', link: '/dashboard/user' },
          {
            name: breadcrumbName,
            link: `/dashboard/user/${params.userId}`,
          },
        ]}
        permissions={canEdit}
        userAccess={userAccess}
      />
      <EditUser userId={params.userId} isViewOnly={isViewOnly} />
    </>
  );
}
