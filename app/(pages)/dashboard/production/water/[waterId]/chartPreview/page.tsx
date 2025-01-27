import BasicBreadcrumbs from "@/app/_components/Breadcrumbs";
import WaterChartDownloadPreview from "@/app/_components/production/waterChartDownloadPreview/WaterChartDownloadPreview";
import { getProductions } from "@/app/_lib/action";
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
        heading={"Water History"}
        links={[
          { name: "Dashboard", link: "/dashboard" },
          { name: "Production Manager", link: "/dashboard/production" },
        ]}
        hideSearchInput
      />

      <WaterChartDownloadPreview
        productions={productions?.data?.filter(
          (data: any) => data.productionUnitId === params.waterId
        )}
      />
    </>
  );
}
