import AddNewOrganisation from "@/app/_components/AddNewOrganisation";
import BasicTable from "@/app/_components/BasicTable";
import BasicBreadcrumbs from "@/app/_components/Breadcrumbs";
import Loader from "@/app/_components/Loader";
import { getOrganisations } from "@/app/_lib/action";
import { getCookie } from "cookies-next";
import { cookies } from "next/headers";
import { Suspense } from "react";

export default async function Page() {
  const loggedUser: any = getCookie("logged-user", { cookies });
  const user = JSON.parse(loggedUser);

  let organisations = await getOrganisations(
    user?.data?.user?.organisationId,
    user?.data?.user?.role
  );

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
