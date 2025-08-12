'use client';

import BasicBreadcrumbs from "@/app/_components/Breadcrumbs";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import AddSpecies from "@/app/_components/models/AddSpecies";
import Loader from "@/app/_components/Loader";

export default function EditSpeciesPage() {
  const { id } = useParams();
  const [initialData, setInitialData] = useState<{ name: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    (async () => {
      const res = await fetch(`/api/species/${id}`);
      const data = await res.json();
      setInitialData({ name: data.name });
      setLoading(false);
    })();
  }, [id]);

  if (loading) return <Loader/>;

  return (
    <>
      <BasicBreadcrumbs
        heading="Edit Species"
        links={[
          { name: 'Dashboard', link: '/dashboard' },
          { name: 'Growth Models', link: '/dashboard/growthModel' },
          { name: 'Species & Production System', link: '/dashboard/growthModel/species-production-system' },
          { name: 'Edit Species', link: `/dashboard/growthModel/species-production-system/editSpecies/${id}` }
        ]}
        permissions={true}
      />
      {initialData && (
        <AddSpecies mode="edit" id={id as string} initialData={initialData} />
      )}
    </>
  );
}
