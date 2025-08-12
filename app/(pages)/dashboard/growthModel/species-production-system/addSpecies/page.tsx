'use client';

import BasicBreadcrumbs from "@/app/_components/Breadcrumbs";
import AddSpecies from "@/app/_components/models/AddSpecies";


export default function AddSpeciesPage() {
    return (
        <>
            <BasicBreadcrumbs
                heading="Add Species"
                links={[
                    { name: 'Dashboard', link: '/dashboard' },
                    { name: 'Growth Models', link: '/dashboard/growthModel' },
                    { name: 'Species & Production System', link: '/dashboard/growthModel/species-production-system' },
                    { name: 'Add Species', link: '/dashboard/growthModel/species-production-system/addSpecies' }
                ]}
                permissions={true}
            />
            <AddSpecies mode="add" />
        </>
    );
}