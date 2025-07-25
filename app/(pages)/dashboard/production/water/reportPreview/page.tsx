import BasicBreadcrumbs from '@/app/_components/Breadcrumbs';
import WaterReportPreview from '@/app/_components/production/waterReportDownloadPreview/WaterReportPreview';
import { getProductions } from '@/app/_lib/action';
import { Production } from '@/app/_typeModels/production';
// import { getCookie } from "cookies-next";
import { cookies } from 'next/headers';
export default async function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
  };
}) {
  const query = searchParams?.query || '';
  // const loggedUser: any = getCookie("logged-user", { cookies });
  // const refreshToken: any = getCookie("refresh-token", { cookies });
  // const selectedUnits: any = getCookie("selectedUnits", { cookies });
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
        heading={'Water Chart Preview'}
        links={[
          { name: 'Dashboard', link: '/dashboard' },
          { name: 'Production Manager', link: '/dashboard/production' },
          {
            name: 'Create Report',
            link: `/dashboard/production/createReport`,
          },
          {
            name: 'Water Report Preview',
            link: `/dashboard/production/water/reportPreview`,
          },
        ]}
        hideSearchInput
      />
      <WaterReportPreview productions={filteredProductions} />
    </>
  );
}
