import BasicBreadcrumbs from '@/app/_components/Breadcrumbs';
import ProductionTable from '@/app/_components/table/ProductionTable';
import { getBatches, getFarms, getOrganisationForhatchery, getProductions } from '@/app/_lib/action';
import { Metadata } from 'next';
import { cookies } from 'next/headers';
import { getUserAccessConfig } from '@/app/_lib/constants/userAccessMatrix';
import { canAddProduction, canEditProduction, canViewProduction } from '@/app/_lib/utils/permissions/access';
import { SingleUser } from '@/app/_typeModels/User';

export const metadata: Metadata = {
  title: 'Production Manager',
};
export const dynamic = 'force-dynamic';

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
  const user: SingleUser = JSON.parse(loggedUser ?? '');
  
  // Get user's access configuration
  const loggedUserOrgType = user?.organisationType || '';
  const loggedUserType = user?.role || '';
  const userAccess = getUserAccessConfig(loggedUserOrgType, loggedUserType);
  
  const productions = await getProductions({
    role: user.role,
    organisationId: String(user.organisationId),
    query,
    noFilter: false,
    userId: String(user.id),
  });
  const farms = await getFarms({
    role: user.role,
    organisationId: user.organisationId,
    query: '',
    noFilter: false,
  });
  const batches = await getBatches({});
  const organisationForhatchery = await getOrganisationForhatchery();
  
  const canAdd = canAddProduction(userAccess, String(user?.role));
  const canEdit = canEditProduction(userAccess, String(user?.role));
  const canView = canViewProduction(userAccess, String(user?.role));
  
  return (
    <>
      <BasicBreadcrumbs
        heading={'Production Manager'}
        isTable={true}
        links={[
          { name: 'Dashboard', link: '/dashboard' },
          { name: 'Production Manager', link: '/dashboard/production' },
        ]}
        userAccess={userAccess}
      />

      <ProductionTable
        productions={productions?.data || []}
        farms={farms?.data || []}
        batches={batches?.data || []}
        organisations={organisationForhatchery.data || []}
        userAccess={userAccess}
        userRole={String(user?.role)}
        canEdit={canEdit}
        canView={canView}
      />
    </>
  );
}
