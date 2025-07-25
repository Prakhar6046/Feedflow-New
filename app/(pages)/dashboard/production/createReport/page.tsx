import BasicBreadcrumbs from '@/app/_components/Breadcrumbs';
import CreateReport from '@/app/_components/production/CreateReport';
import { getFarms, getProductions } from '@/app/_lib/action';
import { getCookie } from 'cookies-next';
import { Metadata } from 'next';
import { cookies } from 'next/headers';
export const metadata: Metadata = {
  title: 'Create Report',
};
export default async function Page() {
  const loggedUser = getCookie('logged-user', { cookies });
  const user = JSON.parse(loggedUser || '');
  const farms = await getFarms({
    role: user?.role,
    organisationId: user?.organisationId,
    query: '',
    noFilter: false,
  });
  const productions = await getProductions({
    role: user.role,
    organisationId: user.organisationId,
    query: '',
    noFilter: false,
    userId: user.id,
  });
  return (
    <>
      <BasicBreadcrumbs
        heading={'Water History'}
        isTable={false}
        links={[
          { name: 'Dashboard', link: '/dashboard' },
          { name: 'Production Manager', link: '/dashboard/production' },
          {
            name: 'Create Report',
            link: `/dashboard/production/createReport`,
          },
        ]}
        hideSearchInput
      />
      <CreateReport farms={farms.data} productions={productions.data} />
    </>
  );
}
