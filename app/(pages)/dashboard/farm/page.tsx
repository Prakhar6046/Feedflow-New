import BasicBreadcrumbs from "@/app/_components/Breadcrumbs";
import CommonTable from "@/app/_components/table/CommonTable";
import FarmTable from "@/app/_components/table/FarmTable";
import { getFarms } from "@/app/_lib/action";
export default async function Page() {
  const farms = await getFarms();

  return (
    <>
      <BasicBreadcrumbs
        heading={"Farm"}
        buttonName={"Add Farm"}
        searchOrganisations={false}
        searchUsers={false}
        searchFarm={true}
        isTable={true}
        buttonRoute="/dashboard/farm/newFarm"
        links={[
          { name: "Dashboard", link: "/dashboard" },
          { name: "Farm", link: "/dashboard/farm" },
        ]}
      />
      <FarmTable farms={farms.data} />
    </>
  );
}
