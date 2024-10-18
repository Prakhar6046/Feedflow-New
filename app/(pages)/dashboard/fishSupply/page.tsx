import BasicBreadcrumbs from "@/app/_components/Breadcrumbs";
import CommonTable from "@/app/_components/table/CommonTable";
import { getAllOrganisations, getFishSupply } from "@/app/_lib/action";
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
  "Status",
];
const batchData = [
  {
    id: 1,
    batch: "Lorem ipsum",
    manufactured: "Lorem ipsum dolor sit amet",
    product: "lorem",
  },
];
export default async function Page() {
  const fishSupply = await getFishSupply();

  return (
    <>
      <BasicBreadcrumbs
        heading={"Fish Supply"}
        buttonName={"New Batch"}
        isTable={true}
        buttonRoute="/dashboard/fishSupply/new"
        links={[
          { name: "Dashboard", link: "/dashboard" },
          { name: "Fish Supply", link: "/dashboard/fishSupply" },
        ]}
      />
      <Box className="hatchery-table">
        <CommonTable
          tableData={tableData}
          data={batchData}
          fishSupply={fishSupply.data}
        />
      </Box>
    </>
  );
}
