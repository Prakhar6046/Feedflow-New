import BasicBreadcrumbs from "@/app/_components/Breadcrumbs";
import { SelectChangeEvent } from "@mui/material";

import { useState } from "react";

function createData(
  name: string,
  calories: number,
  fat: number,
  carbs: number,
  protein: number
) {
  return { name, calories, fat, carbs, protein };
}

export default function Page() {
  return (
    <>
      <BasicBreadcrumbs
        heading={"Feed Supply"}
        buttonName={"Add Feed"}
        searchOrganisations={false}
        searchUsers={false}
        searchFarm={false}
        isTable={false}
        hideSearchInput={true}
        buttonRoute="/dashboard/feedSupply/new"
        links={[
          { name: "Dashboard", link: "/dashboard" },
          { name: "Feed Supply", link: "/dashboard" },
        ]}
      />
    </>
  );
}
