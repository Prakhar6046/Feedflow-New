import AddNewOrganisation from "@/app/_components/AddNewOrganisation";
import BasicBreadcrumbs from "@/app/_components/Breadcrumbs";

export default async function Page() {
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
      <AddNewOrganisation />
    </>
  );
}
