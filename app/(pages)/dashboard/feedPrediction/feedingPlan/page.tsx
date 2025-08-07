import BasicBreadcrumbs from '@/app/_components/Breadcrumbs';
import FeedingOutputTable from '@/app/_components/table/FeedingOutputTable';
import { NextPage } from 'next';
const Page: NextPage = async () => {
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
      <FeedingOutputTable />
    </>
  );
};

export default Page;
