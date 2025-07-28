import BasicBreadcrumbs from '@/app/_components/Breadcrumbs';
import GrowthModel from '@/app/_components/GrowthModel';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create Growth Model',
};

export default function CreateGrowthModelPage() {
  return (
    <>
      <BasicBreadcrumbs
        heading={'Create Growth Model'}
        links={[
          { name: 'Dashboard', link: '/dashboard' },
          { name: 'Growth Models', link: '/dashboard/growthModel' },
          { name: 'Create Model', link: '/dashboard/growthModel/create' },
        ]}
      />
      <GrowthModel 
        farms={[]} 
        editMode={false}
      />
    </>
  );
}
