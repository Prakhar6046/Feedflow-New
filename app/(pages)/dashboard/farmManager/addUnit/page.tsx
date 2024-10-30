import BasicBreadcrumbs from "@/app/_components/Breadcrumbs";
import AddUnitForm from "@/app/_components/farmManager/AddUnitForm";
import { getFarms, getFishSupply } from "@/app/_lib/action";
import { getCookie } from "cookies-next";
import { cookies } from "next/headers";

export default async function Page() {
  const loggedUser: any = getCookie("logged-user", { cookies });
  const user = JSON.parse(loggedUser);

  const farms = await getFarms({
    role: user.data.user.role,
    organisationId: user.data.user.organisationId,
    query: "",
    noFilter: false,
  });

  return (
    <>
      <BasicBreadcrumbs
        heading={"Add Unit"}
        hideSearchInput={true}
        links={[
          { name: "Dashboard", link: "/dashboard" },
          { name: "Farm Manager", link: "/dashboard/farmManager" },
          { name: "Add Unit", link: "/dashboard/farmManager/addUnit" },
        ]}
      />
      <AddUnitForm farms={farms.data} />
    </>
  );
}
