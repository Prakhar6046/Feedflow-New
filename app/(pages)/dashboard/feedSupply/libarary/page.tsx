import BasicBreadcrumbs from '@/app/_components/Breadcrumbs';
import FeedStoreTable from '@/app/_components/table/FeedStore';
import { getFeedStores, getFeedSuppliers } from '@/app/_lib/action';
// import { getCookie } from "cookies-next";
import { cookies } from 'next/headers';

interface Props {}

const Page = async ({
  searchParams,
}: {
  searchParams?: {
    query?: string;
  };
}) => {
  const query = searchParams?.query || '';
  // const loggedUser: any = getCookie("logged-user", { cookies });
  // const refreshToken: any = getCookie("refresh-token", { cookies });
  const cookieStore = cookies();
  const loggedUser: any = cookieStore.get('logged-user')?.value;
  const refreshToken = cookieStore.get('refresh-token')?.value;
  const userOrganisationType = JSON.parse(loggedUser);
  const stores = await getFeedStores({
    role: userOrganisationType.role,
    organisationId: userOrganisationType.organisationId,
    query,
    refreshToken,
  });
  const feedSuppliers = await getFeedSuppliers(refreshToken);

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
