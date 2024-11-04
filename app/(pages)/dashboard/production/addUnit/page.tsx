import BasicBreadcrumbs from "@/app/_components/Breadcrumbs";
import AddUnitForm from "@/app/_components/production/AddUnitForm";
import { getFarms } from "@/app/_lib/action";
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
          { name: "Production", link: "/dashboard/production" },
          { name: "Add Unit", link: "/dashboard/production/addUnit" },
        ]}
      />
      <AddUnitForm farms={farms.data} />
    </>
  );
}
