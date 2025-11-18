import BasicBreadcrumbs from '@/app/_components/Breadcrumbs';
import EditFarm from '@/app/_components/farm/EditFarm';
import {
  getFarm,
  getFarmers,
  getFarmMangers,
  getFarms,
  getFeedStores,
  getFeedSuppliers,
  getGrowthModels,
} from '@/app/_lib/action';
import { getCookie } from 'cookies-next';
import { Metadata } from 'next';
import { cookies } from 'next/headers';
import { getUserAccessConfig } from '@/app/_lib/constants/userAccessMatrix';
import { canEditFarm, canViewFarm } from '@/app/_lib/utils/permissions/access';
import { SingleUser } from '@/app/_typeModels/User';

export const metadata: Metadata = {
  title: 'Edit Farm',
};
export const dynamic = 'force-dynamic';

export default async function Page({
  params,
  searchParams,
}: {
  params: { farmId: string };
  searchParams?: { query?: string };
}) {
  const loggedUser = getCookie('logged-user', { cookies });
  const user: SingleUser = JSON.parse(loggedUser ?? '');
  
  // Get user's access configuration
  const loggedUserOrgType = user?.organisationType || '';
  const loggedUserType = user?.role || '';
  const userAccess = getUserAccessConfig(loggedUserOrgType, loggedUserType);
  
  const canEdit = canEditFarm(userAccess, String(user?.role));
  const canView = canViewFarm(userAccess, String(user?.role));
  const isViewOnly = canView && !canEdit;
  
  const heading = isViewOnly ? 'View Farm' : 'Edit Farm';
  const breadcrumbName = isViewOnly ? 'View Farm' : 'Edit Farm';
  
  const farmMembers = await getFarmMangers(String(user.organisationId));
  const growthModels = await getGrowthModels();
  const query = searchParams?.query || '';
  const farms = await getFarms({
    role: '',
    query,
    noFilter: true,
  });
  const stores = await getFeedStores({
    role: user.role,
    organisationId: String(user.organisationId),
    query,
  });
  const feedSuppliers = await getFeedSuppliers();
  const EditFarmData = await getFarm(params?.farmId);
  const fishfarmers = await getFarmers();
  
  return (
    <>
      <BasicBreadcrumbs
        heading={heading}
        hideSearchInput={true}
        links={[
          { name: 'Dashboard', link: '/dashboard' },
          { name: 'Farm', link: '/dashboard/farm' },
          { name: breadcrumbName, link: `/dashboard/farm/${params.farmId}` },
        ]}
        permissions={canEdit}
        userAccess={userAccess}
      />
      <EditFarm
        EditFarmData={EditFarmData.data}
        fishfarmers={fishfarmers?.data}
        farmId={params?.farmId}
        farmMembers={farmMembers?.data?.users}
        growthModels={growthModels?.data}
        farms={farms?.data}
        isEdit={true}
        feedstores={stores?.data}
        feedSuppliers={feedSuppliers?.data}
        userAccess={userAccess}
        isViewOnly={isViewOnly}
      />
    </>
  );
}
