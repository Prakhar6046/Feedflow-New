import BasicBreadcrumbs from '@/app/_components/Breadcrumbs';
import GrowthModel from '@/app/_components/GrowthModel';
import { Metadata } from 'next';
import { getCookie } from 'cookies-next';
import { cookies } from 'next/headers';
import { SingleUser } from '@/app/_typeModels/User';
import { getUserAccessConfig } from '@/app/_lib/constants/userAccessMatrix';
import { canEditGrowthModel, canViewGrowthModel } from '@/app/_lib/utils/permissions/access';

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
  
  const loggedUser = getCookie('logged-user', { cookies });
  const user: SingleUser = JSON.parse(loggedUser ?? '');
  
  // Get user's access configuration
  const loggedUserOrgType = user?.organisationType || '';
  const loggedUserType = user?.role || '';
  const userAccess = getUserAccessConfig(loggedUserOrgType, loggedUserType);
  
  const canEdit = canEditGrowthModel(userAccess, loggedUserType);
  const canView = canViewGrowthModel(userAccess, loggedUserType);
  const isViewOnly = canView && !canEdit;
  
  const heading = isViewOnly ? 'View Growth Model' : 'Edit Growth Model';
  const breadcrumbName = isViewOnly ? 'View Model' : 'Edit Model';
  
  if (!modelData) {
    return (
      <div>
        <BasicBreadcrumbs
          heading={heading}
          links={[
            { name: 'Dashboard', link: '/dashboard' },
            { name: 'Growth Models', link: '/dashboard/growthModel' },
            { name: breadcrumbName, link: `/dashboard/growthModel/${modelId}` },
          ]}
          permissions={canEdit}
          userAccess={userAccess}
        />
        <div>Model not found</div>
      </div>
    );
  }

  return (
    <>
      <BasicBreadcrumbs
        heading={heading}
        links={[
          { name: 'Dashboard', link: '/dashboard' },
          { name: 'Growth Models', link: '/dashboard/growthModel' },
          { name: breadcrumbName, link: `/dashboard/growthModel/${modelId}` },
        ]}
        permissions={canEdit}
        userAccess={userAccess}
      />
      <GrowthModel
        farms={[]}
        editMode={true}
        modelData={modelData}
        modelId={modelId}
        userAccess={userAccess}
        isViewOnly={isViewOnly}
      />
    </>
  );
}
