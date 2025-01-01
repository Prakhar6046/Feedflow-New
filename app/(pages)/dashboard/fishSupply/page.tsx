import BasicBreadcrumbs from "@/app/_components/Breadcrumbs";
import FishSupplyTable from "@/app/_components/table/FishSupplyTable";
import { getFishSupply } from "@/app/_lib/action";
import {
  fishTableHead,
  fishTableHeadMember,
} from "@/app/_lib/utils/tableHeadData";
import { Box } from "@mui/material";
import { getCookie } from "cookies-next";
import { Metadata } from "next";
import { cookies } from "next/headers";
export const metadata: Metadata = {
  title: "Fish Supply",
};
export default async function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
  };
}) {
  const query = searchParams?.query || "";
  const loggedUser: any = getCookie("logged-user", { cookies });
  const user = JSON.parse(loggedUser);

  const fishSupply = await getFishSupply({
    organisationId: user.organisationId,
    role: user.role,
    query,
  });
  return (
    <>
      <BasicBreadcrumbs
        heading={"Fish Supply"}
        buttonName={user.role !== "MEMBER" ? "New Fish Supply" : ""}
        isTable={true}
        buttonRoute="/dashboard/fishSupply/new"
        links={[
          { name: "Dashboard", link: "/dashboard" },
          { name: "Fish Supply", link: "/dashboard/fishSupply" },
        ]}
      />
      <Box className="hatchery-table">
        <FishSupplyTable
          tableData={
            user.role !== "MEMBER" ? fishTableHead : fishTableHeadMember
          }
          fishSupply={fishSupply.data}
        />
      </Box>
    </>
  );
}
