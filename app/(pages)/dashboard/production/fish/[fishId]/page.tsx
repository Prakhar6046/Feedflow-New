import BasicBreadcrumbs from '@/app/_components/Breadcrumbs';
import FishManageHistoryTable from '@/app/_components/table/FishManageHistory';
import { getProductions } from '@/app/_lib/action';
import { fishManageHistoryHead } from '@/app/_lib/utils/tableHeadData';
import { Production } from '@/app/_typeModels/production';
import { getCookie } from 'cookies-next';
import { Metadata } from 'next';
import { cookies } from 'next/headers';
export const metadata: Metadata = {
  title: 'Fish History',
};
export default async function Page({
  params,
  searchParams,
}: {
  params: { fishId: string };
  searchParams?: {
    query?: string;
  };
}) {
  const query = searchParams?.query || '';
  const loggedUser = getCookie('logged-user', { cookies });
  const user = JSON.parse(loggedUser || '');
  const productions = await getProductions({
    role: user.role,
    organisationId: user.organisationId,
    query,
    noFilter: false,
    userId: user.id,
  });

  return (
    <>
      <BasicBreadcrumbs
        heading={'Fish History'}
        isTable={true}
        links={[
          { name: 'Dashboard', link: '/dashboard' },
          { name: 'Production Manager', link: '/dashboard/production' },
          {
            name: 'Fish History',
            link: `/dashboard/production/fish/${params.fishId}`,
          },
        ]}
        hideSearchInput
      />
      <FishManageHistoryTable
        tableData={fishManageHistoryHead}
        productions={productions?.data?.filter(
          (data: Production) => data.productionUnitId === params.fishId,
        )}
        fishId={params.fishId}
      />
    </>
  );
}
