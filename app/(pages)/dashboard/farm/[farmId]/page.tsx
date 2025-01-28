import BasicBreadcrumbs from "@/app/_components/Breadcrumbs";
import EditFarm from "@/app/_components/farm/EditFarm";
import { getFarmMembers, getFarms, getGrowthModels } from "@/app/_lib/action";
import { getCookie } from "cookies-next";
import { Metadata } from "next";
import { cookies } from "next/headers";
export const metadata: Metadata = {
  title: "Edit Farm",
};
export default async function Page({
  params,
  searchParams,
}: {
  params: { farmId: string };
  searchParams?: { query?: string };
}) {
  const loggedUser: any = getCookie("logged-user", { cookies });
  const user = JSON.parse(loggedUser);
  const farmMembers = await getFarmMembers(user.organisationId);
  const growthModels = await getGrowthModels();
  const query = searchParams?.query || "";
  const farms = await getFarms({
    role: "",
    organisationId: "",
    query,
    noFilter: true,
  });
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
      <EditFarm
        farmId={params.farmId}
        farmMembers={farmMembers.data.users}
        growthModels={growthModels.data}
        farms={farms?.data}
      />
    </>
  );
}
