import BasicBreadcrumbs from "@/app/_components/Breadcrumbs";
import CommonTable from "@/app/_components/table/CommonTable";
import React from "react";
const tableData: Array<string> = [
  "Batch#",
  "Product",
  "Manufactured",
  "Production facility",
  "",
];
const batchData = [
  {
    id: 1,
    batch: "BN:06.03.2024.NC",
    manufactured: "06-03-24 00:00 to 00:59",
    product: "Feed Ingredient : Fish meal 65%saf ",
  },
  {
    id: 2,
    batch: "BN:06.03.2024.NC",
    manufactured: "06-03-24 00:00 to 00:59",
    product: "Feed Ingredient : Fish meal 65%saf ",
  },
  {
    id: 3,
    batch: "BN:06.03.2024.NC",
    manufactured: "06-03-24 00:00 to 00:59",
    product: "Feed Ingredient : Fish meal 65%saf ",
  },
  {
    id: 4,
    batch: "BN:06.03.2024.NC",
    manufactured: "06-03-24 00:00 to 00:59",
    product: "Feed Ingredient : Fish meal 65%saf ",
  },
];
export default function Page() {
  return (
    <>
      <BasicBreadcrumbs
        heading={"Hatchery"}
        buttonName={"New Fish Supply"}
        isTable={true}
        buttonRoute="/dashboard/hatchery/new"
        links={[
          { name: "Dashboard", link: "/dashboard" },
          { name: "Hatchery", link: "/dashboard/hatchery" },
        ]}
      />
      <CommonTable tableData={tableData} data={batchData} />
    </>
  );
}
