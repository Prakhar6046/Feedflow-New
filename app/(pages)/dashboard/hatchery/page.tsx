import BasicBreadcrumbs from "@/app/_components/Breadcrumbs";
import CommonTable from "@/app/_components/table/CommonTable";
import { Box } from "@mui/material";
import React from "react";
const tableData: Array<string> = [
  "Specie",
  "Batch#",
  "Broodstock",
  "Spawning Date",
  "Hatching Date",
  "Age",
  "Hatchery",
  "Fish Farm",
  "Production Unit",
  "Status"
];
const batchData = [
  {
    id: 1,
    batch: "Lorem ipsum",
    manufactured: "Lorem ipsum dolor sit amet",
    product: "lorem",
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
      <Box className="hatchery-table">
        <CommonTable tableData={tableData} data={batchData} />
      </Box>
    </>
  );
}
