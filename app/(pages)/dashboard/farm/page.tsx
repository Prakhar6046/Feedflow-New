import BasicBreadcrumbs from "@/app/_components/Breadcrumbs";
import { Farm } from "@/app/_components/Farm";
import Loader from "@/app/_components/Loader";
// import CommonTable from "@/app/_components/table/CommonTable";
import FarmTable from "@/app/_components/table/FarmTable";
import { getFarms } from "@/app/_lib/action";
import { Suspense } from "react";
export const revalidate = 0;
export default async function Page() {
  return (
    <>
      <BasicBreadcrumbs
        heading={"Farm"}
        buttonName={"Add Farm"}
        searchOrganisations={false}
        searchUsers={false}
        searchFarm={false}
        isTable={true}
        buttonRoute="/dashboard/farm/newFarm"
        links={[
          { name: "Dashboard", link: "/dashboard" },
          { name: "Farm", link: "/dashboard/farm" },
        ]}
      />
      <Suspense fallback={<Loader />}>
        <Farm />
      </Suspense>
    </>
  );
}
