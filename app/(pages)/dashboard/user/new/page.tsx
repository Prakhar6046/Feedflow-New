import AddNewUser from '@/app/_components/AddNewUser';
import BasicBreadcrumbs from '@/app/_components/Breadcrumbs';
import { getOrganisations } from '@/app/_lib/action';
import { SingleUser } from '@/app/_typeModels/User';
import { getCookie } from 'cookies-next';
import { Metadata } from 'next';
import { cookies } from 'next/headers';
export const metadata: Metadata = {
  title: 'New User',
};
export default async function Page() {
  const loggedUser = getCookie('logged-user', { cookies });
  const user: SingleUser = JSON.parse(loggedUser ?? '');
  const organisations = await getOrganisations({
    organisationId: user?.organisationId,
    role: String(user?.role),
    query: '',
  });

  return (
    <>
      <BasicBreadcrumbs
        heading={'Add a new user'}
        hideSearchInput={true}
        links={[
          { name: 'Dashboard', link: '/dashboard' },
          { name: 'Users', link: '/dashboard/user' },
          { name: 'New User', link: '/dashboard/user/new' },
        ]}
      />
      <AddNewUser organisations={organisations?.data} />
    </>
  );
}
