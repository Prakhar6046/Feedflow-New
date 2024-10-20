import BasicTable from "@/app/_components/BasicTable";
import BasicBreadcrumbs from "@/app/_components/Breadcrumbs";
import { getOrganisations } from "@/app/_lib/action";
import { getCookie } from "cookies-next";
import { cookies } from "next/headers";

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

  let organisations = await getOrganisations(
    user?.data?.user?.organisationId,
    user?.data?.user?.role,
    query
  );

  return (
    <>
      <BasicBreadcrumbs
        heading={"Organisations"}
        buttonName={"Add Organisation"}
        organisations={organisations?.data}
        buttonRoute={"/dashboard/organisation/new"}
        searchOrganisations={true}
        searchUsers={false}
        isTable={true}
        refetch={"organisation"}
        links={[
          { name: "Dashboard", link: "/dashboard" },
          { name: "Organisations", link: "/dashboard/organisation" },
        ]}
      />
      <BasicTable organisations={organisations?.data} />
    </>
  );
}
