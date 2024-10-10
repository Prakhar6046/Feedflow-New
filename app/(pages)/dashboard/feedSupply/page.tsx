import BasicBreadcrumbs from "@/app/_components/Breadcrumbs";
import FeedTable from "@/app/_components/table/FeedTable";
import { getFeedSupplys } from "@/app/_lib/action";
import { getCookie } from "cookies-next";
import { cookies } from "next/headers";
export default async function Page() {
  const feeds = await getFeedSupplys();
  const loggedUser: any = getCookie("logged-user", { cookies });
  const userOrganisationType = JSON.parse(loggedUser);

  return (
    <>
      <BasicBreadcrumbs
        heading={"Feed Supply"}
        buttonName={
          userOrganisationType?.data?.user?.organisation.organisationType ===
            "Fish Farmer" ||
          userOrganisationType?.data?.user?.organisation.organisationType ===
            "Feed Supplier"
            ? "Add Feed"
            : ""
        }
        searchOrganisations={false}
        searchUsers={false}
        searchFarm={false}
        isTable={false}
        hideSearchInput={true}
        buttonRoute="/dashboard/feedSupply/new"
        links={[
          { name: "Dashboard", link: "/dashboard" },
          { name: "Feed Supply", link: "/dashboard/feedSupply" },
        ]}
      />
      <FeedTable feeds={feeds?.data} />
    </>
  );
}
