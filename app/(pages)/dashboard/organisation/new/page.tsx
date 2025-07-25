import AddNewOrganisation from '@/app/_components/AddNewOrganisation';
import BasicBreadcrumbs from '@/app/_components/Breadcrumbs';
import { getAllOrganisations } from '@/app/_lib/action';
import { Metadata } from 'next';
import { cookies } from 'next/headers';
export const metadata: Metadata = {
  title: 'Organisations',
};
export default async function Page({
  searchParams,
}: {
  searchParams?: {
    type?: string;
  };
}) {
  // const loggedUser: any = getCookie("logged-user", { cookies });
  // const refreshToken: any = getCookie("refresh-token", { cookies });
  // const token: any = getCookie("auth-token", { cookies });
  const cookieStore = cookies();
  const loggedUser = cookieStore.get('logged-user')?.value ?? '';
  const refreshToken = cookieStore.get('refresh-token')?.value ?? '';
  const token = cookieStore.get('auth-token')?.value ?? '';

  const organisations = await getAllOrganisations(refreshToken);
  // const organisationCount = await getOrganisationCount(refreshToken);
  const type = searchParams?.type || '';

  return (
    <>
      <BasicBreadcrumbs
        heading={'Organisations'}
        hideSearchInput={true}
        links={[
          { name: 'Dashboard', link: '/dashboard' },
          { name: 'Organisations', link: '/dashboard/organisation' },
          { name: 'New Organisation', link: '/dashboard/organisation/new' },
        ]}
      />
      <AddNewOrganisation
        // key={Object.keys(organisationCount).length}
        organisations={organisations?.data}
        type={type}
        // organisationCount={organisationCount?.data}
        authToken={token}
        loggedUser={JSON.parse(loggedUser)}
      />
    </>
  );
}
