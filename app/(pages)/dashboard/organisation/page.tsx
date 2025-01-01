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
  };
}) {
  const query = searchParams?.query || "";
  const loggedUser: any = getCookie("logged-user", { cookies });
  const user = JSON.parse(loggedUser);

  let organisations = await getOrganisations({
    organisationId: user?.organisationId,
    query,
    role: user?.role,
  });

  return (
    <>
      <BasicBreadcrumbs
        heading={"Organisations"}
        buttonName={user.role === "SUPERADMIN" ? "Add Organisation" : ""}
        buttonRoute={"/dashboard/organisation/new"}
        isTable={true}
        refetch={"organisation"}
        links={[
          { name: "Dashboard", link: "/dashboard" },
          { name: "Organisations", link: "/dashboard/organisation" },
        ]}
      />
      <BasicTable organisations={organisations?.data} userRole={user?.role} />
    </>
  );
}
