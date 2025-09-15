import BasicBreadcrumbs from '@/app/_components/Breadcrumbs';
import GrowthModel from '@/app/_components/GrowthModel';
import { Metadata } from 'next';
import { getCookie } from 'cookies-next';

export const metadata: Metadata = {
  title: 'Edit Growth Model',
};

async function getModelData(modelId: string) {
  const response = await fetch(`${process.env.BASE_URL}/api/growth-model/${modelId}`, {
    cache: 'no-store',
  });

  if (response.ok) {
    const data = await response.json();
    return data.data;
  }
  return null;
}


export default async function EditGrowthModelPage({
  params,
}: {
  params: { modelId: string };
}) {
  const modelId = params.modelId;
  const modelData = await getModelData(modelId);
  console.log('++++++', modelData)
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
