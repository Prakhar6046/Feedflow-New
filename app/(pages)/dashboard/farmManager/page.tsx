import BasicBreadcrumbs from "@/app/_components/Breadcrumbs";
import FarmManagerTable from "@/app/_components/table/FarmManagerTable";
import { getFarmManagers } from "@/app/_lib/action";
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
  const farmManagers = await getFarmManagers({
    role: user.data.user.role,
    organisationId: user.data.user.organisationId,
    query,
    noFilter: false,
  });

  return (
    <>
      <BasicBreadcrumbs
        heading={"Farm Manager"}
        isTable={true}
        buttonName="Add Unit"
        buttonRoute="/dashboard/farmManager/addUnit"
        links={[
          { name: "Dashboard", link: "/dashboard" },
          { name: "Farm Manager", link: "/dashboard/farmManager" },
        ]}
      />
      <FarmManagerTable
        tableData={
          user.data.user.role !== "MEMBER"
            ? farmManagerHead
            : farmManagerHeadMember
        }
        farmManagers={farmManagers.data}
      />
    </>
  );
}
