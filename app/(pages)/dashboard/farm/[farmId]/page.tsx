import BasicBreadcrumbs from "@/app/_components/Breadcrumbs";
import EditFarm from "@/app/_components/farm/EditFarm";
import { getFarmMembers } from "@/app/_lib/action";
import { getCookie } from "cookies-next";
import { cookies } from "next/headers";
export default async function Page({ params }: { params: { farmId: string } }) {
  const loggedUser: any = getCookie("logged-user", { cookies });
  const user = JSON.parse(loggedUser);
  const farmMembers = await getFarmMembers(user.organisationId);
  return (
    <>
      <BasicBreadcrumbs
        heading={"Edit Farm"}
        hideSearchInput={true}
        links={[
          { name: "Dashboard", link: "/dashboard" },
          { name: "Farm", link: "/dashboard/farm" },
          { name: "Edit Farm", link: `/dashboard/farm/${params.farmId}` },
        ]}
      />
      <EditFarm farmId={params.farmId} farmMembers={farmMembers.data.users} />
    </>
  );
}
