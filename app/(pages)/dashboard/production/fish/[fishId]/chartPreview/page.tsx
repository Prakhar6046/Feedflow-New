import BasicBreadcrumbs from '@/app/_components/Breadcrumbs';
import FishChartDownloadPreview from '@/app/_components/production/fishChartDownloadPreview/FishChartDownloadPreview';
import { getProductions } from '@/app/_lib/action';
import { Production } from '@/app/_typeModels/production';
// import { getCookie } from "cookies-next";
import { cookies } from 'next/headers';
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
  const cookieStore = cookies();
  const loggedUser = cookieStore.get('logged-user')?.value;
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
        heading={'Fish Chart Preview'}
        // isTable={true}
        links={[
          { name: 'Dashboard', link: '/dashboard' },
          { name: 'Production Manager', link: '/dashboard/production' },
          {
            name: 'Fish History',
            link: `/dashboard/production/fish/${params.fishId}`,
          },
          {
            name: 'Fish Chart Preview',
            link: `/dashboard/production/fish/${params.fishId}/chartPreview`,
          },
        ]}
        hideSearchInput
      />
      <FishChartDownloadPreview
        productions={productions?.data?.filter(
          (data: Production) => data.productionUnitId === params.fishId,
        )}
      />
    </>
  );
}
