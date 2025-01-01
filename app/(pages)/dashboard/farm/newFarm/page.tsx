import BasicBreadcrumbs from "@/app/_components/Breadcrumbs";
import NewFarm from "@/app/_components/farm/NewFarm";
import { getFarmMembers } from "@/app/_lib/action";
import { getCookie } from "cookies-next";
import { Metadata } from "next";
import { cookies } from "next/headers";
export const metadata: Metadata = {
  title: "New Farm",
};
export default async function Page() {
  const loggedUser: any = getCookie("logged-user", { cookies });
  const user = JSON.parse(loggedUser);
  const farmMembers = await getFarmMembers(user.organisationId);
  return (
    <>
      <BasicBreadcrumbs
        heading={"New Farm"}
        hideSearchInput={true}
        links={[
          { name: "Dashboard", link: "/dashboard" },
          { name: "Farm", link: "/dashboard/farm" },
          { name: "New Farm", link: "/dashboard/farm/newFarm" },
        ]}
      />

      <NewFarm farmMembers={farmMembers?.data?.users} />
    </>
  );
}
