import BasicBreadcrumbs from "@/app/_components/Breadcrumbs";
import NewFarm from "@/app/_components/farm/NewFarm";
import { getFarmMangers, getFarms, getGrowthModels } from "@/app/_lib/action";
import { getCookie } from "cookies-next";
import { Metadata } from "next";
import { cookies } from "next/headers";
export const metadata: Metadata = {
  title: "New Farm",
};
export default async function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
  };
}) {
  const loggedUser: any = getCookie("logged-user", { cookies });
  const refreshToken: any = getCookie("refresh-token", { cookies });
  const user = JSON.parse(loggedUser);
  const farmManagers = await getFarmMangers(user.organisationId, refreshToken);
  const growthModels = await getGrowthModels(refreshToken);
  const query = searchParams?.query || "";
  const farms = await getFarms({
    role: "",
    query,
    noFilter: true,
    refreshToken,
  });

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

      <NewFarm
        farmMembers={farmManagers?.data?.users}
        growthModels={growthModels?.data}
        farms={farms?.data}
      />
    </>
  );
}
