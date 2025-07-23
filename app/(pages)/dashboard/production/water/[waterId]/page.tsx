import BasicBreadcrumbs from '@/app/_components/Breadcrumbs';
import WaterManageHistoryTable from '@/app/_components/table/WaterManageHistory';
import { getFarms, getProductions } from '@/app/_lib/action';
import { waterManageHistoryHead } from '@/app/_lib/utils/tableHeadData';
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

  // const loggedUser: any = getCookie("logged-user", { cookies });
  // const refreshToken: any = getCookie("refresh-token", { cookies });
  const cookieStore = cookies();
  const loggedUser: any = cookieStore.get('logged-user')?.value;
  const refreshToken = cookieStore.get('refresh-token')?.value;
  const user = JSON.parse(loggedUser);
  const productions = await getProductions({
    role: user.role,
    organisationId: user.organisationId,
    query,
    noFilter: false,
    userId: user.id,
    refreshToken,
  });
  const farms = await getFarms({
    role: user.role,
    organisationId: user.organisationId,
    query: '',
    noFilter: false,
    refreshToken,
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
          (data: any) => data.productionUnitId === params.waterId,
        )}
        waterId={params.waterId}
        farms={farms.data}
      />
    </>
  );
}
