import BasicBreadcrumbs from "@/app/_components/Breadcrumbs";
import EditFarm from "@/app/_components/farm/EditFarm";
import {
  getFarmMangers,
  getFarms,
  getFeedStores,
  getFeedSuppliers,
  getGrowthModels,
} from "@/app/_lib/action";
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
  const refreshToken: any = getCookie("refresh-token", { cookies });
  const user = JSON.parse(loggedUser);
  const farmMembers = await getFarmMangers(user.organisationId, refreshToken);
  const growthModels = await getGrowthModels(refreshToken);
  const query = searchParams?.query || "";
  const farms = await getFarms({
    role: "",
    query,
    noFilter: true,
    refreshToken,
  });
  const stores = await getFeedStores({
    role: user.role,
    organisationId: user.organisationId,
    query,
    refreshToken,
  });
  const feedSuppliers = await getFeedSuppliers(refreshToken);
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
        farmId={params?.farmId}
        farmMembers={farmMembers?.data?.users}
        growthModels={growthModels?.data}
        farms={farms?.data}
        isEdit={true}
        feedstores={stores?.data}
        feedSuppliers={feedSuppliers?.data}
      />
    </>
  );
}
