import BasicBreadcrumbs from '@/app/_components/Breadcrumbs';
import { Metadata } from 'next';
import NewFeedSupply from '@/app/_components/feedSupply/NewFeedSupply';

export const metadata: Metadata = {
  title: 'Feed Supply',
};
export default function Page() {
  return (
    <>
      <BasicBreadcrumbs
        heading={'Feed Supply'}
        isTable={false}
        hideSearchInput
        links={[
          { name: 'Dashboard', link: '/dashboard' },
          { name: 'Feed Supply', link: '/dashboard/feedSupply' },
          { name: 'New Feed Supply', link: '/dashboard/feedSupply/new' },
        ]}
      />
      <NewFeedSupply />
    </>
  );
}
