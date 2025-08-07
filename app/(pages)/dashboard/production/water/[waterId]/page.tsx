import BasicBreadcrumbs from '@/app/_components/Breadcrumbs';
import WaterManageHistoryTable from '@/app/_components/table/WaterManageHistory';
import { getFarms, getProductions } from '@/app/_lib/action';
import { waterManageHistoryHead } from '@/app/_lib/utils/tableHeadData';
import { Production } from '@/app/_typeModels/production';
import { Metadata } from 'next';
import { cookies } from 'next/headers';
export const metadata: Metadata = {
  title: 'Water History',
};
export default async function Page({
  params,
  searchParams,
}: {
  params: { waterId: string };
  searchParams?: {
    query?: string;
  };
}) {
  const query = searchParams?.query || '';

  const cookieStore = cookies();
  const loggedUser = cookieStore.get('logged-user')?.value;
  const user = JSON.parse(loggedUser ?? '');
  const productions = await getProductions({
    role: user.role,
    organisationId: user.organisationId,
    query,
    noFilter: false,
    userId: user.id,
  });
  const farms = await getFarms({
    role: user.role,
    organisationId: user.organisationId,
    query: '',
    noFilter: false,
  });

  return (
    <>
      <BasicBreadcrumbs
        heading={'Water History'}
        isTable={true}
        links={[
          { name: 'Dashboard', link: '/dashboard' },
          { name: 'Production Manager', link: '/dashboard/production' },
          {
            name: 'Water History',
            link: `/dashboard/production/water/${params.waterId}`,
          },
        ]}
        hideSearchInput
      />
      <WaterManageHistoryTable
        tableData={waterManageHistoryHead}
        productions={productions?.data?.filter(
          (data: Production) => data.productionUnitId === params.waterId,
        )}
        waterId={params.waterId}
        farms={farms.data}
      />
    </>
  );
}
