import BasicBreadcrumbs from "@/app/_components/Breadcrumbs";
import FarmTable from "@/app/_components/table/FarmTable";
import { getFarms } from "@/app/_lib/action";
export default async function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
  };
}) {
  const query = searchParams?.query || "";
  const famrs = await getFarms(query);

  return (
    <>
      <BasicBreadcrumbs
        heading={"Farm"}
        buttonName={"Add Farm"}
        searchOrganisations={false}
        searchUsers={false}
        searchFarm={true}
        isTable={true}
        refetch="farm"
        buttonRoute="/dashboard/farm/newFarm"
        links={[
          { name: "Dashboard", link: "/dashboard" },
          { name: "Farm", link: "/dashboard/farm" },
        ]}
      />
      <FarmTable farms={famrs?.data} />
    </>
  );
}
