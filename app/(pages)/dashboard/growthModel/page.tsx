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
        heading={"Growth Models"}
        links={[
          { name: "Dashboard", link: "/dashboard" },
          { name: "Growth Models", link: "/dashboard/growthModel" },
        ]}
        hideSearchInput
      />
      <GrowthModel />
    </>
  );
}
