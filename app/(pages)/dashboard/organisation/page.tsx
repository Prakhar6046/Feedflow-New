import BasicTable from '@/app/_components/BasicTable';
import BasicBreadcrumbs from '@/app/_components/Breadcrumbs';
import { getOrganisations } from '@/app/_lib/action';
import { SingleUser } from '@/app/_typeModels/User';
import { getCookie } from 'cookies-next';
import { Metadata } from 'next';
import { cookies } from 'next/headers';
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

  const organisations = await getOrganisations({
    organisationId: Number(user?.organisationId),
    query,
    role: String(user?.role),
    tab,
  });

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
                : tab === 'feedSuppliers'
                  ? 'Feed Suppliers'
                  : 'Fish Producers',
            link: `/dashboard/organisation?tab=${tab}`,
          },
        ]}
        permissions={user?.permissions.editOrganisation}
      />
      <BasicTable
        key={organisations?.data?.length}
        organisations={organisations?.data}
        userRole={String(user?.role)}
        permissions={user?.permissions.editOrganisation}
      />
    </>
  );
}
