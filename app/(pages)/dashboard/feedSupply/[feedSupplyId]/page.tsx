import BasicBreadcrumbs from '@/app/_components/Breadcrumbs';
import EditFeedSupply from '@/app/_components/feedSupply/EditFeedSupply';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Edit Feed Supply',
};
export default function Page({ params }: { params: { feedSupplyId: string } }) {
  return (
    <>
      <BasicBreadcrumbs
        heading={'Edit Feed Supply'}
        isTable={false}
        hideSearchInput={true}
        links={[
          { name: 'Dashboard', link: '/dashboard' },
          { name: 'Feed Supply', link: '/dashboard/feedSupply' },
          {
            name: 'Edit Feed Supply',
            link: `/dashboard/feedSupply/${params.feedSupplyId}`,
          },
        ]}
      />
      <EditFeedSupply feedSupplyId={params.feedSupplyId} />
    </>
  );
}
