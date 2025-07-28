import { Metadata } from 'next';
import { getCookie } from 'cookies-next';
import GrowthModelTable from '@/app/_components/table/GrowthModelTable';
import BasicBreadcrumbs from '@/app/_components/Breadcrumbs';
import { cookies } from 'next/headers';
import { SingleUser } from '@/app/_typeModels/User';
export const metadata: Metadata = {
  title: 'Growth Models',
};

export default async function GrowthModelPage() {
  // Get user data from cookie
  const loggedUser: any = getCookie('logged-user', { cookies });
 
  let organisationId = 0;
  
  if (loggedUser) {
    try {
      const user: SingleUser = JSON.parse(loggedUser);
      console.log('user',user);
      organisationId = user.organisationId;
    } catch (error) {
      console.error('Error parsing user data:', error);
    }
  }
  console.log('organisationId',organisationId);
  let growthModels = [];
  
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/growth-model?organisationId=${organisationId}`, {
      cache: 'no-store'
    });
    
    if (response.ok) {
      const data = await response.json();
      growthModels = data.data || [];
    }
  } catch (error) {
    console.error('Error fetching growth models:', error);
  }

  const tableData = [
    { id: 'name', numeric: false, disablePadding: false, label: 'Name' },
    { id: 'specie', numeric: false, disablePadding: false, label: 'Species' },
    { id: 'productionSystem', numeric: false, disablePadding: false, label: 'Production System' },
    { id: 'createdAt', numeric: false, disablePadding: false, label: 'Created Date' },
    { id: 'actions', numeric: false, disablePadding: false, label: 'Actions' }
  ];

  return (
    <>
    <BasicBreadcrumbs
    heading={'Growth Models'}
    links={[
      { name: 'Dashboard', link: '/dashboard' },
      { name: 'Growth Models', link: '/dashboard/growthModel' },
    ]}
    buttonName="Add Model"
    buttonRoute="/dashboard/growthModel/create"
  />
    <div>
      <GrowthModelTable 
        tableData={tableData}
        growthModels={growthModels}
        permisions={true}
      />
    </div>
    </>
  );
}
