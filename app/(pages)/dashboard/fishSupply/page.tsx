import BasicBreadcrumbs from '@/app/_components/Breadcrumbs';
import FishSupplyTable from '@/app/_components/table/FishSupplyTable';
import { getFishSupply } from '@/app/_lib/action';
import {
  fishTableHead,
  fishTableHeadMember,
} from '@/app/_lib/utils/tableHeadData';
import { SingleUser } from '@/app/_typeModels/User';
import { Box } from '@mui/material';
import { getCookie } from 'cookies-next';
import { Metadata } from 'next';
import { cookies } from 'next/headers';
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

  const fishSupply = await getFishSupply({
    organisationId: user.organisationId,
    role: user.role,
    query,
  });
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
        permissions={user?.permissions?.createFishSupply}
      />
      <Box className="hatchery-table">
        <FishSupplyTable
          tableData={
            user?.role === 'SUPERADMIN' || user?.permissions?.editFishSupply
              ? fishTableHead
              : fishTableHeadMember
          }
          fishSupply={fishSupply.data}
          permisions={user?.permissions?.editFishSupply}
        />
      </Box>
    </>
  );
}
