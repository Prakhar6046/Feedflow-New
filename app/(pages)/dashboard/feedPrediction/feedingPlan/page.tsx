import BasicBreadcrumbs from '@/app/_components/Breadcrumbs';
import FeedingOutputTable from '@/app/_components/table/FeedingOutputTable';
import { getFarms, getProductions } from '@/app/_lib/action';
// import { getCookie } from "cookies-next";
import { NextPage } from 'next';
import { cookies } from 'next/headers';
const Page: NextPage = async ({
  searchParams,
}: {
  searchParams?: {
    query?: string;
  };
}) => {
  const query = searchParams?.query || '';
  const cookieStore = cookies();
  const loggedUser = cookieStore.get('logged-user')?.value;
  const refreshToken = cookieStore.get('refresh-token')?.value;
  // const loggedUser: any = getCookie("logged-user", { cookies });
  // const refreshToken: any = getCookie("refresh-token", { cookies });
  const user = JSON.parse(loggedUser ?? '');
  const farms = await getFarms({
    role: user.role,
    organisationId: user.organisationId,
    query: '',
    noFilter: false,
    refreshToken,
  });
  const productions = await getProductions({
    role: user.role,
    organisationId: user.organisationId,
    query,
    noFilter: false,
    userId: user.id,
    refreshToken,
  });
  return (
    <>
      <BasicBreadcrumbs
        heading={'Feed Prediction'}
        hideSearchInput={true}
        links={[
          { name: 'Dashboard', link: '/dashboard' },
          { name: 'Feed Prediction', link: '/dashboard/feedPrediction' },
          { name: 'Feeding Plan', link: '/dashboard/feedingPlan' },
        ]}
      />
      <FeedingOutputTable farms={farms.data} productions={productions.data} />
    </>
  );
};

export default Page;
