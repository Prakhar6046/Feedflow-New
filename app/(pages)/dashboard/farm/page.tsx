import BasicBreadcrumbs from '@/app/_components/Breadcrumbs';
import FarmTable from '@/app/_components/table/FarmTable';
import { getFarms } from '@/app/_lib/action';
import { SingleUser } from '@/app/_typeModels/User';
import { getCookie } from 'cookies-next';
import { Metadata } from 'next';
import { cookies } from 'next/headers';
export const metadata: Metadata = {
  title: 'Farm',
};
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
  const cookieStore = cookies();
  const loggedUser: any = cookieStore.get('logged-user')?.value;
  const refreshToken = cookieStore.get('refresh-token')?.value;
  const user: SingleUser = JSON.parse(loggedUser);
  const farms = await getFarms({
    role: user?.role,
    organisationId: user?.organisationId,
    query,
    noFilter: false,
    refreshToken,
  });
  return (
    <>
      <BasicBreadcrumbs
        heading={'Farm'}
        buttonName={'Add Farm'}
        isTable={true}
        buttonRoute="/dashboard/farm/newFarm"
        links={[
          { name: 'Dashboard', link: '/dashboard' },
          { name: 'Farm', link: '/dashboard/farm' },
        ]}
        permissions={user?.permissions?.createFarms}
      />
      <FarmTable
        farms={farms?.data}
        permisions={user?.permissions?.editFarms}
      />
    </>
  );
}
