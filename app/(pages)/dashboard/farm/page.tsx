import BasicBreadcrumbs from '@/app/_components/Breadcrumbs';
import FarmTable from '@/app/_components/table/FarmTable';
import { getFarms } from '@/app/_lib/action';
import { SingleUser } from '@/app/_typeModels/User';
import { Metadata } from 'next';
import { cookies } from 'next/headers';
import { getUserAccessConfig } from '@/app/_lib/constants/userAccessMatrix';
import { canAddFarm, canEditFarm, canViewFarm } from '@/app/_lib/utils/permissions/access';

export const metadata: Metadata = {
  title: 'Farm',
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
  const cookieStore = cookies();
  const loggedUser = cookieStore.get('logged-user')?.value;
  const user: SingleUser = JSON.parse(loggedUser ?? '');
  
  // Get user's access configuration
  const loggedUserOrgType = user?.organisationType || '';
  const loggedUserType = user?.role || '';
  const userAccess = getUserAccessConfig(loggedUserOrgType, loggedUserType);
  
  const farms = await getFarms({
    role: user?.role,
    organisationId: user?.organisationId,
    query,
    noFilter: false,
  });
  
  const canAdd = canAddFarm(userAccess, String(user?.role));
  const canEdit = canEditFarm(userAccess, String(user?.role));
  const canView = canViewFarm(userAccess, String(user?.role));
  console.log("canAdd", canAdd);
  console.log("canEdit", canEdit);
  console.log("canView", canView);
  return (
    <>
      <BasicBreadcrumbs
        heading={'Farm'}
        buttonName={'Add Farm'}
        isTable={true}
        buttonRoute="/dashboard/farm/newFarm"
        links={[
          { name: 'Dashboard', link: '/dashboard' },
          { name: 'Farm', link: '/dashboard/farm' },
        ]}
        permissions={canAdd}
        userAccess={userAccess}
      />
      <FarmTable  
        farms={farms?.data}
        userAccess={userAccess}
        userRole={String(user?.role)}
        canEdit={canEdit}
        canView={canView}
      />
    </>
  );
}
