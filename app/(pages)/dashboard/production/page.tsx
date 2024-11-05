import BasicBreadcrumbs from "@/app/_components/Breadcrumbs";
import FarmManagerTable from "@/app/_components/table/FarmManagerTable";
import { getFarms, getProductions } from "@/app/_lib/action";
import {
  farmManagerHead,
  farmManagerHeadMember,
  farmTableHead,
} from "@/app/_lib/utils/tableHeadData";
import { getCookie } from "cookies-next";
import { cookies } from "next/headers";

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
  const productions = await getProductions({
    role: user.role,
    organisationId: user.organisationId,
    query,
    noFilter: false,
  });
  const farms = await getFarms({
    role: user.role,
    organisationId: user.organisationId,
    query: "",
    noFilter: false,
  });

  return (
    <>
      <BasicBreadcrumbs
        heading={"Production"}
        isTable={true}
        buttonName="Add Unit"
        buttonRoute="/dashboard/production/addUnit"
        links={[
          { name: "Dashboard", link: "/dashboard" },
          { name: "Production", link: "/dashboard/production" },
        ]}
      />
      <FarmManagerTable
        tableData={
          user.role !== "MEMBER" ? farmManagerHead : farmManagerHeadMember
        }
        productions={productions.data}
        farms={farms.data}
      />
    </>
  );
}
