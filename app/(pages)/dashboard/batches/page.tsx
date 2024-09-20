"use client";
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

export default function Page() {
  return (
    <>
      <BasicBreadcrumbs
        heading={"Batches"}
        buttonName={"New Batch"}
        isTable={true}
        links={[
          { name: "Dashboard", link: "/dashboard" },
          { name: "Batches", link: "/dashboard/batches" },
        ]}
      />
      <CommonTable tableData={tableData} />
    </>
  );
}
