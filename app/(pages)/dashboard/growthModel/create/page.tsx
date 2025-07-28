import BasicBreadcrumbs from '@/app/_components/Breadcrumbs';
import GrowthModel from '@/app/_components/GrowthModel';
import { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Create Growth Model',
};
export default async function Page() {
  return (
    <>
      <BasicBreadcrumbs
        heading={'Add Growth Model'}
        links={[
          { name: 'Dashboard', link: '/dashboard' },
          { name: 'Growth Models', link: '/dashboard/growthModel' },
          { name: 'Create', link: '/dashboard/growthModel/create' },
        ]}
        hideSearchInput
      />
      <GrowthModel />
    </>
  );
}
