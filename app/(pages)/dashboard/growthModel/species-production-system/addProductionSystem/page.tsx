'use client';

import BasicBreadcrumbs from "@/app/_components/Breadcrumbs";
import AddProductionSystem from "@/app/_components/models/AddProductionSystem";

export default function AddProductionSystemPage() {
   return (
    <>
      <BasicBreadcrumbs
        heading="Add Production System"
        links={[
          { name: 'Dashboard', link: '/dashboard' },
          { name: 'Growth Models', link: '/dashboard/growthModel' },
          { name: 'Species & Production System', link: '/dashboard/growthModel/species-production-system' },
          { name: 'Add Production System', link: '/dashboard/growthModel/species-production-system/addProductionSystem' }
        ]}
        permissions={true}
      />
      <AddProductionSystem mode="add"/>
    </>
  );
}

