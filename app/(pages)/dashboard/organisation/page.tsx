import BasicTable from "@/app/_components/BasicTable";
import BasicBreadcrumbs from "@/app/_components/Breadcrumbs";
import { getOrganisations } from "@/app/_lib/action";
import { getCookie } from "cookies-next";
import { Metadata } from "next";
import { cookies } from "next/headers";
export const metadata: Metadata = {
  title: "Organisations",
};
export default async function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    tab?: string;
  };
}) {
  const query = searchParams?.query || "";
  const tab = searchParams?.tab || "all";
  const loggedUser: any = getCookie("logged-user", { cookies });
  const user = JSON.parse(loggedUser);

  let organisations = await getOrganisations({
    organisationId: user?.organisationId,
    query,
    role: user?.role,
    tab,
  });
  let buttonName = "";
  let buttonRoute = "";
  if (user.role === "SUPERADMIN" || user.role === "ADMIN") {
    if (tab === "feedSuppliers") {
      buttonName = "Add Fish Farmer";
      buttonRoute = "/dashboard/organisation/new?type=fishFarmers";
    } else {
      buttonName = "Add Organisation";
      buttonRoute = "/dashboard/organisation/new";
    }
  }
  return (
    <>
      <BasicBreadcrumbs
        heading={"Organisations"}
        buttonName={buttonName}
        buttonRoute={buttonRoute}
        isTable={true}
        refetch={"organisation"}
        links={[
          { name: "Dashboard", link: "/dashboard" },
          { name: "Organisations", link: buttonRoute },
        ]}
      />
      <BasicTable organisations={organisations?.data} userRole={user?.role} />
    </>
  );
}
