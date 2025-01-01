import BasicBreadcrumbs from "@/app/_components/Breadcrumbs";
import GrowthModel from "@/app/_components/GrowthModel";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Growth Parameter",
};
export default async function Page() {
  return (
    <>
      <BasicBreadcrumbs
        heading={"Growth Parameter"}
        links={[
          { name: "Dashboard", link: "/dashboard" },
          { name: "Growth Parameter", link: "/dashboard/growthModel" },
        ]}
        hideSearchInput
      />
      <GrowthModel />
    </>
  );
}
