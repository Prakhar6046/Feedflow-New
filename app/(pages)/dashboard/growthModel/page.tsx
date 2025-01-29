import BasicBreadcrumbs from "@/app/_components/Breadcrumbs";
import GrowthModel from "@/app/_components/GrowthModel";
import { getFarms } from "@/app/_lib/action";
import { getCookie } from "cookies-next";
import { Metadata } from "next";
import { cookies } from "next/headers";
export const metadata: Metadata = {
  title: "Growth Parameter",
};
export default async function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
  };
}) {
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
        heading={"Growth Models"}
        links={[
          { name: "Dashboard", link: "/dashboard" },
          { name: "Growth Models", link: "/dashboard/growthModel" },
        ]}
        hideSearchInput
      />
      <GrowthModel farms={farms?.data} />
    </>
  );
}
