import BasicBreadcrumbs from '@/app/_components/Breadcrumbs';
import NewFishSupply from '@/app/_components/fishSupply/NewFishSupply';
import { getFarms, getOrganisationForhatchery } from '@/app/_lib/action';
// import { getCookie } from "cookies-next";
import { Metadata } from 'next';
import { cookies } from 'next/headers';
export const metadata: Metadata = {
  title: 'New Fish Supply',
};
export default async function Page() {
  // const loggedUser: any = getCookie("logged-user", { cookies });
  // const refreshToken: any = getCookie("refresh-token", { cookies });
  const cookieStore = cookies();
  const loggedUser: any = cookieStore.get('logged-user')?.value;
  const refreshToken = cookieStore.get('refresh-token')?.value;
  const user = JSON.parse(loggedUser);
  const organisationForhatchery =
    await getOrganisationForhatchery(refreshToken);
  const farms = await getFarms({
    noFilter: true,
    organisationId: user?.organisationId,
    role: '',
    query: '',
    refreshToken,
  });

  return (
    <>
      <BasicBreadcrumbs
        heading={'New Fish Supply'}
        hideSearchInput={true}
        links={[
          { name: 'Dashboard', link: '/dashboard' },
          { name: 'Fish Supply', link: '/dashboard/fishSupply' },
          { name: 'New Fish Supply', link: '/dashboard/fishSupply/new' },
        ]}
      />

      <NewFishSupply
        farms={farms.data}
        organisations={organisationForhatchery.data}
      />
    </>
  );
}
