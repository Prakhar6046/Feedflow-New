import BasicBreadcrumbs from '@/app/_components/Breadcrumbs';
import NewFishSupply from '@/app/_components/fishSupply/NewFishSupply';
import { getFarms, getOrganisationForhatchery } from '@/app/_lib/action';
import { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Edit Fish Supply',
};
export default async function Page({
  params,
}: {
  params: { fishSupplyId: string };
}) {
  const organisationForhatchery = await getOrganisationForhatchery();
  const farms = await getFarms({
    noFilter: true,
    role: '',
    query: '',
  });
  return (
    <>
      <BasicBreadcrumbs
        heading={'Edit Fish Supply'}
        hideSearchInput={true}
        links={[
          { name: 'Dashboard', link: '/dashboard' },
          { name: 'Fish Supply', link: '/dashboard/fishSupply' },
          {
            name: 'Edit Fish Supply',
            link: `/dashboard/fishSupply/${params.fishSupplyId}`,
          },
        ]}
      />
      <NewFishSupply
        isEdit={true}
        fishSupplyId={params.fishSupplyId}
        farms={farms.data}
        organisations={organisationForhatchery.data}
      />
    </>
  );
}
