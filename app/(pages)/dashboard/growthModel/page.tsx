import { Metadata } from 'next';
import { getCookie } from 'cookies-next';
import GrowthModelTable from '@/app/_components/table/GrowthModelTable';
import BasicBreadcrumbs from '@/app/_components/Breadcrumbs';
import { cookies } from 'next/headers';
import { SingleUser } from '@/app/_typeModels/User';
import { getUserAccessConfig } from '@/app/_lib/constants/userAccessMatrix';
import { canAddGrowthModel, canEditGrowthModel } from '@/app/_lib/utils/permissions/access';
export const metadata: Metadata = {
  title: 'Growth Models',
};

export default async function GrowthModelPage({
  searchParams,
}: {
  searchParams?: {
    query?: string;
  };
}) {
  // Get user data from cookie
  const query = searchParams?.query || '';
  const loggedUser: any = getCookie('logged-user', { cookies });

  let organisationId = 0;
  let user: SingleUser | null = null;

  if (loggedUser) {
    try {
      user = JSON.parse(loggedUser);
      organisationId = user?.organisationId || 0;
    } catch (error) {
      console.error('Error parsing user data:', error);
    }
  }
  
  // Get user's access configuration
  const loggedUserOrgType = user?.organisationType || '';
  const loggedUserType = user?.role || '';
  const userAccess = getUserAccessConfig(loggedUserOrgType, loggedUserType);
  
  let growthModels = [];

  try {
    let apiUrl = `${process.env.BASE_URL}/api/growth-model?organisationId=${organisationId}`;
    if (query) {
      apiUrl += `&query=${encodeURIComponent(query)}`;
    }

    const response = await fetch(apiUrl, { cache: 'no-store' });

    if (response.ok) {
      const data = await response.json();
      growthModels = data.data || [];
    }
  } catch (error) {
    console.error('Error fetching growth models:', error);
  }

  const tableData = [
    { id: 'name', numeric: false, disablePadding: false, label: 'Name' },
    { id: 'specie', numeric: false, disablePadding: false, label: 'Species' },
    {
      id: 'productionSystem',
      numeric: false,
      disablePadding: false,
      label: 'Production System',
    },
    {
      id: 'createdAt',
      numeric: false,
      disablePadding: false,
      label: 'Created Date',
    },
    { id: 'actions', numeric: false, disablePadding: false, label: 'Actions' },
  ];

  const canAdd = canAddGrowthModel(userAccess, loggedUserType);
  const canEdit = canEditGrowthModel(userAccess, loggedUserType);

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
        permissions={canAdd}
        userAccess={userAccess}
        extraButton={{
          buttonName: 'Species & Production System',
          route: '/dashboard/growthModel/species-production-system',
        }}
      />
      <div>
        <GrowthModelTable
          tableData={tableData}
          growthModels={growthModels}
          permisions={canEdit}
          userAccess={userAccess}
          userRole={loggedUserType}
        />
      </div>
    </>
  );
}
