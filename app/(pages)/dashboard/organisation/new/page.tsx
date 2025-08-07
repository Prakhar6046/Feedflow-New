import AddNewOrganisation from '@/app/_components/AddNewOrganisation';
import BasicBreadcrumbs from '@/app/_components/Breadcrumbs';
import Loader from '@/app/_components/Loader';
import { getAllOrganisations } from '@/app/_lib/action';
import { Metadata } from 'next';
import { cookies } from 'next/headers';
import { Suspense } from 'react';
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
  const cookieStore = cookies();
  const loggedUser = cookieStore.get('logged-user')?.value ?? '';
  const token = cookieStore.get('auth-token')?.value ?? '';

  const organisations = await getAllOrganisations();
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
      <Suspense fallback={<Loader />}>
        <AddNewOrganisation
          // key={Object.keys(organisationCount).length}
          organisations={organisations?.data}
          type={type}
          // organisationCount={organisationCount?.data}
          authToken={token}
          loggedUser={JSON.parse(loggedUser)}
        />
      </Suspense>
    </>
  );
}
