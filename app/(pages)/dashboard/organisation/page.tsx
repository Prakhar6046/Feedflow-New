import BasicTable from '@/app/_components/BasicTable';
import BasicBreadcrumbs from '@/app/_components/Breadcrumbs';
import { getOrganisations } from '@/app/_lib/action';
import { SingleUser } from '@/app/_typeModels/User';
import { getCookie } from 'cookies-next';
import { Metadata } from 'next';
import { cookies } from 'next/headers';
import { getUserAccessConfig } from '@/app/_lib/constants/userAccessMatrix';
import { canEditOrganisation } from '@/app/_lib/utils/permissions/access';
export const metadata: Metadata = {
  title: 'Organisations',
};
export const dynamic = 'force-dynamic';
export default async function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    tab?: string;
  };
}) {
  const query = searchParams?.query || '';
  const tab = searchParams?.tab || 'all';
  const loggedUser = getCookie('logged-user', { cookies });
  const user: SingleUser = JSON.parse(loggedUser ?? '');
  console.log("user", user);
  const organisations = await getOrganisations({
    organisationId: Number(user?.organisationId),
    query,
    role: String(user?.role),
    tab,
  });

  // Get user's access configuration
  const loggedUserOrgType = user?.organisationType || '';
  const loggedUserType = user?.role || '';
  console.log("loggedUserOrgType", loggedUserOrgType);
  console.log("loggedUserType", loggedUserType);
  const userAccess = getUserAccessConfig(loggedUserOrgType, loggedUserType);
 console.log("userAccess", userAccess);
  return (
    <>
      <BasicBreadcrumbs
        heading={'Organisations'}
        buttonName={'Add Organisation'}
        buttonRoute={'/dashboard/organisation/new'}
        isTable={true}
        links={[
          { name: 'Dashboard', link: '/dashboard' },
          { name: 'Organisations', link: '/dashboard/organisation' },
          {
            name:
              tab === 'all'
                ? 'All'
                : tab === 'feedManufacturers'
                  ? 'Feed Manufacturers'
                  : 'Fish Producers',
            link: `/dashboard/organisation?tab=${tab}`,
          },
        ]}
        permissions={canEditOrganisation(userAccess, undefined, String(user?.role))}
        userAccess={userAccess}
      />
      <BasicTable
        key={organisations?.data?.length}
        organisations={organisations?.data}
        userRole={String(user?.role)}
        permissions={canEditOrganisation(userAccess, undefined, String(user?.role))}
        userAccess={userAccess}
        loggedUserOrgType={loggedUserOrgType}
      />
    </>
  );
}
