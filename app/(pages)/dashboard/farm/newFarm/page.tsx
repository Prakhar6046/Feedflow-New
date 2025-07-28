import BasicBreadcrumbs from '@/app/_components/Breadcrumbs';
import NewFarm from '@/app/_components/farm/NewFarm';
import {
  getFarmMangers,
  getFarms,
  getFeedStores,
  getFeedSuppliers,
  getGrowthModels,
} from '@/app/_lib/action';
import { getCookie } from 'cookies-next';
import { Metadata } from 'next';
import { cookies } from 'next/headers';
export const metadata: Metadata = {
  title: 'New Farm',
};
export default async function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
  };
}) {
  const loggedUser = getCookie('logged-user', { cookies });
  const user = JSON.parse(loggedUser ?? '');
  const farmManagers = await getFarmMangers(user.organisationId);
  const growthModels = await getGrowthModels();
  const query = searchParams?.query || '';
  const farms = await getFarms({
    role: '',
    query,
    noFilter: true,
  });
  const stores = await getFeedStores({
    role: user.role,
    organisationId: user.organisationId,
    query,
  });
  const feedSuppliers = await getFeedSuppliers();

  return (
    <>
      <BasicBreadcrumbs
        heading={'New Farm'}
        hideSearchInput={true}
        links={[
          { name: 'Dashboard', link: '/dashboard' },
          { name: 'Farm', link: '/dashboard/farm' },
          { name: 'New Farm', link: '/dashboard/farm/newFarm' },
        ]}
      />

      <NewFarm
        farmMembers={farmManagers?.data?.users}
        growthModels={growthModels?.data}
        farms={farms?.data}
        feedstores={stores?.data}
        feedSuppliers={feedSuppliers?.data}
      />
    </>
  );
}
