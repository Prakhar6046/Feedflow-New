import BasicBreadcrumbs from '@/app/_components/Breadcrumbs';
import FishReportPreview from '@/app/_components/production/fishReportDownloadPreview/FishReportPreview';
import { getProductions } from '@/app/_lib/action';
import { Production } from '@/app/_typeModels/production';
import { cookies } from 'next/headers';
export default async function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
  };
}) {
  const query = searchParams?.query || '';
  const cookieStore = cookies();
  const loggedUser = cookieStore.get('logged-user')?.value;
  const selectedUnits = cookieStore.get('selectedUnits')?.value;
  const user = JSON.parse(loggedUser || '');
  const farmUnits = JSON.parse(selectedUnits || '');
  const productions = await getProductions({
    role: user.role,
    organisationId: user.organisationId,
    query,
    noFilter: false,
    userId: user.id,
  });
  const filteredProductions = productions?.data?.filter((prod: Production) =>
    farmUnits.includes(prod?.productionUnitId),
  );
  return (
    <>
      <BasicBreadcrumbs
        heading={'Fish Chart Preview'}
        // isTable={true}
        links={[
          { name: 'Dashboard', link: '/dashboard' },
          { name: 'Production Manager', link: '/dashboard/production' },
          {
            name: 'Create Report',
            link: `/dashboard/production/createReport`,
          },
          {
            name: 'Fish Report Preview',
            link: `/dashboard/production/fish/reportPreview`,
          },
        ]}
        hideSearchInput
      />
      <FishReportPreview productions={filteredProductions} />
    </>
  );
}
