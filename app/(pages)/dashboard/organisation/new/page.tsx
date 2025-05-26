import AddNewOrganisation from "@/app/_components/AddNewOrganisation";
import BasicBreadcrumbs from "@/app/_components/Breadcrumbs";
import {
  getAllOrganisations,
  getOrganisationCount,
  getOrganisations,
} from "@/app/_lib/action";
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
  const organisations = await getAllOrganisations();
  const loggedUser: any = getCookie("logged-user", { cookies });
  const organisationCount = await getOrganisationCount();
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
        organisations={organisations?.data}
        type={type}
        organisationCount={organisationCount?.data}
        loggedUser={JSON.parse(loggedUser)}
      />
    </>
  );
}
