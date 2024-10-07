import BasicBreadcrumbs from "@/app/_components/Breadcrumbs";
import FeedTable from "@/app/_components/table/FeedTable";
import { getFeedSupplys } from "@/app/_lib/action";


export default async function Page() {
const feeds=await getFeedSupplys()
// console.log(feeds?.data);

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
      <FeedTable feeds={feeds?.data}/>
    </>
  );
}
