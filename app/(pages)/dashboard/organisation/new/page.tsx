import AddNewOrganisation from "@/app/_components/AddNewOrganisation";
import BasicBreadcrumbs from "@/app/_components/Breadcrumbs";
import {
  getAllOrganisations,
  getOrganisationCount,
  getOrganisations,
} from "@/app/_lib/action";
import { SingleUser } from "@/app/_typeModels/User";
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
    type?: string;
  };
}) {
  const refreshToken: any = getCookie("refresh-token", { cookies });
  const token: any = getCookie("auth-token", { cookies });
  const organisations = await getAllOrganisations(refreshToken);
  const loggedUser: any = getCookie("logged-user", { cookies });
  const user: SingleUser = JSON.parse(loggedUser);
  // const organisationCount = await getOrganisationCount(refreshToken);
  const type = searchParams?.type || "";

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
      <AddNewOrganisation
        // key={Object.keys(organisationCount).length}
        organisations={organisations?.data}
        type={type}
        // organisationCount={organisationCount?.data}
        authToken={token}
        loggedUser={JSON.parse(loggedUser)}
      />
    </>
  );
}
