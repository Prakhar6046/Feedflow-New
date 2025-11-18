import BasicBreadcrumbs from '@/app/_components/Breadcrumbs';
import NewFishSupply from '@/app/_components/fishSupply/NewFishSupply';
import { getFarms, getOrganisationForhatchery, getspeciesList } from '@/app/_lib/action';
import { Metadata } from 'next';
import { getCookie } from 'cookies-next';
import { cookies } from 'next/headers';
import { SingleUser } from '@/app/_typeModels/User';
import { getUserAccessConfig } from '@/app/_lib/constants/userAccessMatrix';
import { canEditFishSupply, canViewFishSupply } from '@/app/_lib/utils/permissions/access';
export const metadata: Metadata = {
  title: 'Edit Fish Supply',
};
export default async function Page({
  params,
}: {
  params: { fishSupplyId: string };
}) {
  const loggedUser = getCookie('logged-user', { cookies });
  const user: SingleUser = JSON.parse(loggedUser ?? '');
  
  // Get user's access configuration
  const loggedUserOrgType = user?.organisationType || '';
  const loggedUserType = user?.role || '';
  const userAccess = getUserAccessConfig(loggedUserOrgType, loggedUserType);
  
  const canEdit = canEditFishSupply(userAccess, loggedUserType);
  const canView = canViewFishSupply(userAccess, loggedUserType);
  const isViewOnly = canView && !canEdit;
  
  const heading = isViewOnly ? 'View Fish Supply' : 'Edit Fish Supply';
  const breadcrumbName = isViewOnly ? 'View Fish Supply' : 'Edit Fish Supply';
  
  const organisationForhatchery = await getOrganisationForhatchery();
  const speciesList = await getspeciesList();
  const farms = await getFarms({
    noFilter: true,
    role: '',
    query: '',
  });
  return (
    <>
      <BasicBreadcrumbs
        heading={heading}
        hideSearchInput={true}
        links={[
          { name: 'Dashboard', link: '/dashboard' },
          { name: 'Fish Supply', link: '/dashboard/fishSupply' },
          {
            name: breadcrumbName,
            link: `/dashboard/fishSupply/${params.fishSupplyId}`,
          },
        ]}
        permissions={canEdit}
        userAccess={userAccess}
      />
      <NewFishSupply
        isEdit={true}
        fishSupplyId={params.fishSupplyId}
        farms={farms.data}
        organisations={organisationForhatchery.data}
        speciesList={speciesList}
        userAccess={userAccess}
        isViewOnly={isViewOnly}
      />
    </>
  );
}
