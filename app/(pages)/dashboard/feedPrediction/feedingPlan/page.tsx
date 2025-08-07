import BasicBreadcrumbs from '@/app/_components/Breadcrumbs';
import FeedingOutputTable from '@/app/_components/table/FeedingOutputTable';

import { NextPage } from 'next';

const Page: NextPage = async () => {
  // Placeholder values until getProductions and getFarms are implemented
  const productions = [];
  const farms = [];

  return (
    <>
      <BasicBreadcrumbs
        heading={'Feed Prediction'}
        hideSearchInput={true}
        links={[
          { name: 'Dashboard', link: '/dashboard' },
          { name: 'Feed Prediction', link: '/dashboard/feedPrediction' },
          { name: 'Feeding Plan', link: '/dashboard/feedingPlan' },
        ]}
      />
      <FeedingOutputTable productions={productions} farms={farms} />
    </>
  );
};

export default Page;
