import BasicBreadcrumbs from '@/app/_components/Breadcrumbs';
import { NextPage } from 'next';
import FeedPredictionTable from '@/app/_components/table/FeedPrediction';
import { cookies } from 'next/headers';
import { getFarms, getProductions } from '@/app/_lib/action';
import { getUserAccessConfig } from '@/app/_lib/constants/userAccessMatrix';
import { canViewFeedPrediction, canEditFeedPrediction } from '@/app/_lib/utils/permissions/access';
import { SingleUser } from '@/app/_typeModels/User';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Feed Prediction',
};
export const dynamic = 'force-dynamic';

const Page: NextPage = async ({
  searchParams,
}: {
  searchParams?: {
    query?: string;
  };
}) => {
  const cookieStore = cookies(); // ✅ this is safe here in server component
  const loggedUser = cookieStore.get('logged-user')?.value;
  const query = searchParams?.query || '';

  const user: SingleUser = JSON.parse(loggedUser ?? '');
  
  // Get user's access configuration
  const loggedUserOrgType = user?.organisationType || '';
  const loggedUserType = user?.role || '';
  const userAccess = getUserAccessConfig(loggedUserOrgType, loggedUserType);
  
  const farms = await getFarms({
    role: user.role,
    organisationId: user.organisationId,
    query: '',
    noFilter: false,
  });
  const productions = await getProductions({
    role: user.role,
    organisationId: String(user.organisationId),
    query,
    noFilter: false,
    userId: String(user.id),
  });
  
  const canView = canViewFeedPrediction(userAccess, String(user?.role));
  const canEdit = canEditFeedPrediction(userAccess, String(user?.role));
  
  return (
    <>
      <BasicBreadcrumbs
        heading={'Feed Prediction'}
        hideSearchInput={true}
        links={[
          { name: 'Dashboard', link: '/dashboard' },
          { name: 'Feed Prediction', link: '/dashboard/feedPrediction' },
        ]}
        userAccess={userAccess}
      />
      <FeedPredictionTable 
        farms={farms.data} 
        productions={productions.data}
        userAccess={userAccess}
        userRole={String(user?.role)}
        canEdit={canEdit}
        canView={canView}
      />
    </>
  );
};

export default Page;
