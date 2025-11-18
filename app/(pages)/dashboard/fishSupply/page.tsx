import BasicBreadcrumbs from '@/app/_components/Breadcrumbs';
import FishSupplyTable from '@/app/_components/table/FishSupplyTable';
import { getFishSupply, getspeciesList } from '@/app/_lib/action';
import {
  fishTableHead,
  fishTableHeadMember,
} from '@/app/_lib/utils/tableHeadData';
import { SingleUser } from '@/app/_typeModels/User';
import { Box } from '@mui/material';
import { getCookie } from 'cookies-next';
import { Metadata } from 'next';
import { cookies } from 'next/headers';
import { getUserAccessConfig } from '@/app/_lib/constants/userAccessMatrix';
import { canAddFishSupply, canEditFishSupply, canViewFishSupply } from '@/app/_lib/utils/permissions/access';
export const metadata: Metadata = {
  title: 'Fish Supply',
};
export default async function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
  };
}) {
  const query = searchParams?.query || '';
  const loggedUser = getCookie('logged-user', { cookies });
  const user: SingleUser = JSON.parse(loggedUser ?? '');
  
  // Get user's access configuration
  const loggedUserOrgType = user?.organisationType || '';
  const loggedUserType = user?.role || '';
  const userAccess = getUserAccessConfig(loggedUserOrgType, loggedUserType);
  
  const speciesList = await getspeciesList();
  const fishSupply = await getFishSupply({
    organisationId: user.organisationId,
    role: user.role,
    query,
  });
  
  const canAdd = canAddFishSupply(userAccess, loggedUserType);
  const canEdit = canEditFishSupply(userAccess, loggedUserType);
  const canView = canViewFishSupply(userAccess, loggedUserType);
  
  return (
    <>
      <BasicBreadcrumbs
        heading={'Fish Supply'}
        buttonName={'New Fish Supply'}
        isTable={true}
        buttonRoute="/dashboard/fishSupply/new"
        links={[
          { name: 'Dashboard', link: '/dashboard' },
          { name: 'Fish Supply', link: '/dashboard/fishSupply' },
        ]}
        permissions={canAdd}
        userAccess={userAccess}
      />
      <Box className="hatchery-table">
        <FishSupplyTable
          tableData={
            (loggedUserType === 'SUPERADMIN' || canEdit || canView)
              ? fishTableHead
              : fishTableHeadMember
          }
          fishSupply={fishSupply.data}
          permisions={canEdit}
          speciesList={speciesList}
          userAccess={userAccess}
          userRole={loggedUserType}
        />
      </Box>
    </>
  );
}
