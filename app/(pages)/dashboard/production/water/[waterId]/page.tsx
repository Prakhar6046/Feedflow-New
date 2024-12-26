import BasicBreadcrumbs from "@/app/_components/Breadcrumbs";
import WaterManageHistoryTable from "@/app/_components/table/WaterManageHistory";
import { getProductions } from "@/app/_lib/action";
import {
  fishManageHistoryHead,
  waterManageHistoryHead,
} from "@/app/_lib/utils/tableHeadData";
import { getCookie } from "cookies-next";
import { cookies } from "next/headers";

export default async function Page({
  params,
  searchParams,
}: {
  params: { waterId: string };
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
    userId: user.id,
  });

  return (
    <>
      <BasicBreadcrumbs
        heading={"History"}
        links={[
          { name: "Dashboard", link: "/dashboard" },
          { name: "Production", link: "/dashboard/production" },
          {
            name: "Water",
            link: `/dashboard/production/water/${params.waterId}`,
          },
        ]}
        hideSearchInput
      />
      <WaterManageHistoryTable
        tableData={waterManageHistoryHead}
        productions={productions?.data?.filter(
          (data: any) => data.productionUnitId === params.waterId
        )}
      />
    </>
  );
}
