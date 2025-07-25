import BasicBreadcrumbs from '@/app/_components/Breadcrumbs';
import FeedSelection from '@/app/_components/feedSupply/FeedSelection';
import { getFeedStores, getFeedSuppliers } from '@/app/_lib/action';
import { Metadata } from 'next';
import { cookies } from 'next/headers';
export const metadata: Metadata = {
  title: 'Feed Supply',
};
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
  const user = JSON.parse(loggedUser ?? '');
  const stores = await getFeedStores({
    role: user.role,
    organisationId: user.organisationId,
    query,
  });
  const feedSuppliers = await getFeedSuppliers();

  return (
    <>
      <BasicBreadcrumbs
        heading={'Feed Supply'}
        // buttonName={"Add Feed"}
        isTable={false}
        // buttonRoute="/dashboard/feedSupply/new"
        links={[
          { name: 'Dashboard', link: '/dashboard' },
          { name: 'Feed Supply', link: '/dashboard/feedSupply' },
        ]}
        hideSearchInput
        extraButton={{
          route: '/dashboard/feedSupply/libarary',
          buttonName: 'Feed Libarary',
        }}
        permissions={user?.permissions?.addFeedSupply}
      />
      <FeedSelection data={stores?.data} feedSuppliers={feedSuppliers?.data} />
      {/* <FeedTable feeds={feeds?.data} /> */}
    </>
  );
}
