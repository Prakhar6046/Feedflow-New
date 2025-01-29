import AddNewOrganisation from "@/app/_components/AddNewOrganisation";
import BasicBreadcrumbs from "@/app/_components/Breadcrumbs";
import { getAllOrganisations, getOrganisations } from "@/app/_lib/action";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Organisations",
};
export default async function Page() {
  const organisations = await getAllOrganisations();
  return (
    <>
      <BasicBreadcrumbs
        heading={"Organisations"}
        hideSearchInput={true}
        links={[
          { name: "Dashboard", link: "/dashboard" },
          { name: "Organisations", link: "/dashboard/organisation" },
          { name: "New Organisation", link: "/dashboard/organisation/new" },
        ]}
      />
      <AddNewOrganisation organisations={organisations?.data} />
    </>
  );
}
