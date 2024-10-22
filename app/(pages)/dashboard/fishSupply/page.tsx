import BasicBreadcrumbs from "@/app/_components/Breadcrumbs";
import CommonTable from "@/app/_components/table/CommonTable";
import { getAllOrganisations, getFishSupply } from "@/app/_lib/action";
import { Box } from "@mui/material";
import React from "react";
const tableData = [
  {
    id: "specie",
    numeric: false,
    disablePadding: true,
    label: "Specie",
  },
  {
    id: "code",
    numeric: false,
    disablePadding: true,
    label: "Batch#",
  },
  {
    id: "broodstock",
    numeric: false,
    disablePadding: true,
    label: "Broodstock",
  },
  {
    id: "spawningDate",
    numeric: true,
    disablePadding: true,
    label: "Spawning Date",
  },
  {
    id: "hatchingDate",
    numeric: true,
    disablePadding: true,
    label: "Hatching Date",
  },
  {
    id: "age",
    numeric: false,
    disablePadding: true,
    label: "Age",
  },
  {
    id: "name",
    numeric: false,
    disablePadding: true,
    label: "Hatchery",
  },
  {
    id: "fishFarm",
    numeric: false,
    disablePadding: true,
    label: "Fish Farm",
  },
  {
    id: "productionUnits",
    numeric: true,
    disablePadding: true,
    label: "Current Production Unit",
  },
  {
    id: "status",
    numeric: false,
    disablePadding: true,
    label: "Status",
  },
  {
    id: "action",
    numeric: false,
    disablePadding: true,
    label: "Actions",
  },
];

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
  };
}) {
  const query = searchParams?.query || "";
  const fishSupply = await getFishSupply(query);

  return (
    <>
      <BasicBreadcrumbs
        heading={"Fish Supply"}
        buttonName={"New Fish Supply"}
        isTable={true}
        buttonRoute="/dashboard/fishSupply/new"
        links={[
          { name: "Dashboard", link: "/dashboard" },
          { name: "Fish Supply", link: "/dashboard/fishSupply" },
        ]}
      />
      <Box className="hatchery-table">
        <CommonTable tableData={tableData} fishSupply={fishSupply.data} />
      </Box>
    </>
  );
}
