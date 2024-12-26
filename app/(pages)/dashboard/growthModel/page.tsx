import BasicBreadcrumbs from "@/app/_components/Breadcrumbs";
import GrowthModel from "@/app/_components/GrowthModel";

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
