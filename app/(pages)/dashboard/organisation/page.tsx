import BasicTable from "@/app/_components/BasicTable";
import BasicBreadcrumbs from "@/app/_components/Breadcrumbs";
import { getOrganisations } from "@/app/_lib/action";

export default async function Page() {
  const organisations = await getOrganisations();

  return (
    <>
      <BasicBreadcrumbs
        heading={"Organization"}
        buttonName={"+Add Organization"}
        links={[
          { name: "Dashboard", link: "/dashboard" },
          { name: "Organisation", link: "/dashboard/organisation" },
        ]}
      />

      <BasicTable organisations={organisations?.data} />
    </>
  );
}
