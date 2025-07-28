import BasicBreadcrumbs from '@/app/_components/Breadcrumbs';
import { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Growth Models',
};
export default async function Page() {
  return (
    <>
      <BasicBreadcrumbs
        heading={'Growth Models'}
        links={[
          { name: 'Dashboard', link: '/dashboard' },
          { name: 'Growth Models', link: '/dashboard/growthModel' },
        ]}
        buttonName="Add Model"
        buttonRoute="/dashboard/growthModel/create"
      />
      {/* <GrowthModel farms={farms?.data} /> */}
    </>
  );
}
