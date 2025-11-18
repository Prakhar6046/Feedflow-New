import BasicBreadcrumbs from '@/app/_components/Breadcrumbs';
import { Metadata } from 'next';
import EditOrganisation from '@/app/_components/organisation/EditOrganisation';
import { getAllOrganisations } from '@/app/_lib/action';
import { cookies } from 'next/headers';
import { getCookie } from 'cookies-next';
import { SingleUser } from '@/app/_typeModels/User';
import { getUserAccessConfig } from '@/app/_lib/constants/userAccessMatrix';
import { canEditOrganisation, canViewOrganisation, getOrganisationPermissionKey } from '@/app/_lib/utils/permissions/access';
export const metadata: Metadata = {
  title: 'Edit Organisation',
};
const Page = async ({ params }: { params: { organisationId: string } }) => {
  const organisations = await getAllOrganisations();
  const loggedUser = getCookie('logged-user', { cookies });
  const user: SingleUser = JSON.parse(loggedUser || '');
  
  // Get user's access configuration
  const loggedUserOrgType = user?.organisationType || '';
  const loggedUserType = user?.role || '';
  const userAccess = getUserAccessConfig(loggedUserOrgType, loggedUserType);
  
  // Get the organization to determine its type
  const organisation = organisations?.data?.find(org => String(org.id) === params.organisationId);
  const organisationTarget = organisation ? getOrganisationPermissionKey(organisation.organisationType || '') : undefined;
  
  const canEdit = canEditOrganisation(userAccess, organisationTarget, loggedUserType);
  const canView = canViewOrganisation(userAccess, organisationTarget, loggedUserType);
  const isViewOnly = canView && !canEdit;
  
  const heading = isViewOnly ? 'View Organisation' : 'Edit Organisation';
  const breadcrumbName = isViewOnly ? 'View Organisation' : 'Edit Organisation';
  
  return (
    <>
      <BasicBreadcrumbs
        heading={heading}
        isTable={false}
        hideSearchInput={true}
        links={[
          { name: 'Dashboard', link: '/dashboard' },
          { name: 'Organisations', link: '/dashboard/organisation' },
          {
            name: breadcrumbName,
            link: `/dashboard/organisation/${params.organisationId}`,
          },
        ]}
        permissions={canEdit}
      />
      <EditOrganisation
        organisationId={params.organisationId}
        organisations={organisations?.data}
        userRole={String(user?.role)}
        loggedUser={user}
        userAccess={userAccess}
        isViewOnly={isViewOnly}
      />
    </>
  );
};

export default Page;
