import BasicBreadcrumbs from '@/app/_components/Breadcrumbs';
import WaterChartDownloadPreview from '@/app/_components/production/waterChartDownloadPreview/WaterChartDownloadPreview';
import { getProductions } from '@/app/_lib/action';
import { Production } from '@/app/_typeModels/production';
import { cookies } from 'next/headers';
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
  console.log(productions);

  return (
    <>
      <BasicBreadcrumbs
        heading={'Water Chart Preview'}
        // isTable={true}
        links={[
          { name: 'Dashboard', link: '/dashboard' },
          { name: 'Production Manager', link: '/dashboard/production' },
          {
            name: 'Water History',
            link: `/dashboard/production/water/${params.waterId}`,
          },
          {
            name: 'Water Chart Preview',
            link: `/dashboard/production/water/${params.waterId}/chartPreview`,
          },
        ]}
        hideSearchInput
      />

      <WaterChartDownloadPreview
        productions={productions?.data?.filter(
          (data: Production) => data.productionUnitId === params.waterId,
        )}
      />
    </>
  );
}
