import BasicBreadcrumbs from '@/app/_components/Breadcrumbs';
import GrowthModel from '@/app/_components/GrowthModel';
import { Metadata } from 'next';
import { getCookie } from 'cookies-next';

export const metadata: Metadata = {
  title: 'Edit Growth Model',
};

async function getModelData(modelId: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/growth-model?id=${modelId}&type=models`, {
      cache: 'no-store',
    });
    
    if (response.ok) {
      const data = await response.json();
      return data.data;
    }
    return null;
  } catch (error) {
    console.error('Error fetching model data:', error);
    return null;
  }
}

export default async function EditGrowthModelPage({
  params,
}: {
  params: { modelId: string };
}) {
  const modelId = params.modelId;
  const modelData = await getModelData(modelId);

  if (!modelData) {
    return (
      <div>
        <BasicBreadcrumbs
          heading={'Edit Growth Model'}
          links={[
            { name: 'Dashboard', link: '/dashboard' },
            { name: 'Growth Models', link: '/dashboard/growthModel' },
            { name: 'Edit Model', link: `/dashboard/growthModel/${modelId}` },
          ]}
        />
        <div>Model not found</div>
      </div>
    );
  }

  return (
    <>
      <BasicBreadcrumbs
        heading={'Edit Growth Model'}
        links={[
          { name: 'Dashboard', link: '/dashboard' },
          { name: 'Growth Models', link: '/dashboard/growthModel' },
          { name: 'Edit Model', link: `/dashboard/growthModel/${modelId}` },
        ]}
      />
      <GrowthModel 
        farms={[]} 
        editMode={true}
        modelData={modelData}
        modelId={modelId}
      />
    </>
  );
} 