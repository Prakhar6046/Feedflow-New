import BasicBreadcrumbs from '@/app/_components/Breadcrumbs';
import FeedStoreTable from '@/app/_components/table/FeedStore';
import { getFeedStores, getFeedSuppliers } from '@/app/_lib/action';
// import { getCookie } from "cookies-next";
import { cookies } from 'next/headers';

const Page = async ({
  searchParams,
}: {
  searchParams?: {
    query?: string;
  };
}) => {
  const query = searchParams?.query || '';
  const cookieStore = cookies();
  const loggedUser = cookieStore.get('logged-user')?.value;
  const userOrganisationType = JSON.parse(loggedUser ?? '');
  const stores = await getFeedStores({
    role: userOrganisationType.role,
    organisationId: userOrganisationType.organisationId,
    query,
  });
  const feedSuppliers = await getFeedSuppliers();

  return (
    <div>
      <BasicBreadcrumbs
        heading={'Feed Supply'}
        links={[
          { name: 'Dashboard', link: '/dashboard' },
          { name: 'Feed Supply', link: '/dashboard/feedSupply' },
          { name: 'Feed Libarary', link: '/dashboard/feedSupply/libarary' },
        ]}
        buttonName="Add Feed"
        buttonRoute="/dashboard/feedSupply/libarary/new"
        hideSearchInput
      />
      <FeedStoreTable data={stores?.data} feedSuppliers={feedSuppliers?.data} />
    </div>
  );
};

export default Page;
