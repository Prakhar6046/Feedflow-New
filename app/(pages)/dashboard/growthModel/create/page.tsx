import BasicBreadcrumbs from "@/app/_components/Breadcrumbs";
import GrowthModel from "@/app/_components/GrowthModel";
import { getFarms } from "@/app/_lib/action";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Create Growth Model",
};
export default async function Page() {
  const farms = await getFarms({
    role: "",
    organisationId: "",
    query: "",
    noFilter: true,
  });
  return (
    <>
      <BasicBreadcrumbs
        heading={"Add Growth Model"}
        links={[
          { name: "Dashboard", link: "/dashboard" },
          { name: "Growth Models", link: "/dashboard/growthModel" },
          { name: "Create", link: "/dashboard/growthModel/create" },
        ]}
        hideSearchInput
      />
      <GrowthModel farms={farms?.data} />
    </>
  );
}
