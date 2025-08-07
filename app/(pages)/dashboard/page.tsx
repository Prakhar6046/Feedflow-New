import BasicBreadcrumbs from '@/app/_components/Breadcrumbs';
import Loader from '@/app/_components/Loader';
import { Metadata, NextPage } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Dashboard',
};
const Page: NextPage = () => {
  return (
    <div>
      <Suspense fallback={<Loader />}>
        <BasicBreadcrumbs heading={'Dashboard'} />
      </Suspense>
    </div>
  );
};

export default Page;
