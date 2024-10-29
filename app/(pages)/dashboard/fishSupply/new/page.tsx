import BasicBreadcrumbs from "@/app/_components/Breadcrumbs";
import NewFishSupply from "@/app/_components/fishSupply/NewFishSupply";
import { getFarms, getOrganisationForhatchery } from "@/app/_lib/action";
import { getCookie } from "cookies-next";
import { cookies } from "next/headers";

export default async function Page() {
  const loggedUser: any = getCookie("logged-user", { cookies });

  const user = JSON.parse(loggedUser);
  const organisationForhatchery = await getOrganisationForhatchery();
  const farms = await getFarms({
    noFilter: true,
    organisationId: "",
    role: "",
    query: "",
  });

  return (
    <>
      <BasicBreadcrumbs
        heading={"New Fish Supply"}
        hideSearchInput={true}
        links={[
          { name: "Dashboard", link: "/dashboard" },
          { name: "Fish Supply", link: "/dashboard/fishSupply" },
          { name: "New Fish Supply", link: "/dashboard/fishSupply/new" },
        ]}
      />

      <NewFishSupply
        farms={farms.data}
        organisations={organisationForhatchery.data}
      />
    </>
  );
}
