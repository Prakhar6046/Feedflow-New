import BasicBreadcrumbs from '@/app/_components/Breadcrumbs';
import { Metadata } from 'next';
import EditOrganisation from '@/app/_components/organisation/EditOrganisation';
import { getAllOrganisations } from '@/app/_lib/action';
import { cookies } from 'next/headers';
import { getCookie } from 'cookies-next';
import { SingleUser } from '@/app/_typeModels/User';
export const metadata: Metadata = {
  title: 'Edit Organisation',
};
const Page = async ({ params }: { params: { organisationId: string } }) => {
  const organisations = await getAllOrganisations();
  const loggedUser = getCookie('logged-user', { cookies });
  const user: SingleUser = JSON.parse(loggedUser || '');
  return (
    <>
      <BasicBreadcrumbs
        heading={'Edit Organisation'}
        isTable={false}
        hideSearchInput={true}
        links={[
          { name: 'Dashboard', link: '/dashboard' },
          { name: 'Organisations', link: '/dashboard/organisation' },
          {
            name: 'Edit Organisation',
            link: `/dashboard/organisation/${params.organisationId}`,
          },
        ]}
        permissions={user?.permissions.editOrganisation}
      />
      <EditOrganisation
        organisationId={params.organisationId}
        organisations={organisations?.data}
        userRole={String(user?.role)}
        loggedUser={user}
      />
    </>
  );
};

export default Page;
