import BasicBreadcrumbs from '@/app/_components/Breadcrumbs';
import EditUser from '@/app/_components/user/EditUser';
import { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Edit User',
};
export default function Page({ params }: { params: { userId: string } }) {
  return (
    <>
      <BasicBreadcrumbs
        heading={'Edit User'}
        isTable={false}
        hideSearchInput={true}
        links={[
          { name: 'Dashboard', link: '/dashboard' },
          { name: 'Users', link: '/dashboard/user' },
          {
            name: 'Edit User',
            link: `/dashboard/user/${params.userId}`,
          },
        ]}
      />
      <EditUser userId={params.userId} />
    </>
  );
}
