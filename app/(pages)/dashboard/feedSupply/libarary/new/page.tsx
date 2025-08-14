import BasicBreadcrumbs from '@/app/_components/Breadcrumbs';
import { Metadata } from 'next';
import NewFeedLibarary from '@/app/_components/feedSupply/NewFeedLibarary';
import { getFeedSuppliers, getspeciesList } from '@/app/_lib/action';
export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
  title: 'Feed Supply',
};
export default async function Page() {
  const feedSuppliers = await getFeedSuppliers();
    const speciesList = await getspeciesList();

  return (
    <>
      <BasicBreadcrumbs
        heading={'New Feed'}
        isTable={false}
        hideSearchInput
        links={[
          { name: 'Dashboard', link: '/dashboard' },
          { name: 'Feed Supply', link: '/dashboard/feedSupply' },
          { name: 'Libarary', link: '/dashboard/feedSupply/libarary' },
          { name: 'New', link: '/dashboard/feedSupply/libarary/new' },
        ]}
      />
      <NewFeedLibarary feedSuppliers={feedSuppliers?.data} speciesList={speciesList}/>
    </>
  );
}
