import BasicBreadcrumbs from "@/app/_components/Breadcrumbs";
import FeedSelection from "@/app/_components/feedSupply/FeedSelection";
import FeedTable from "@/app/_components/table/FeedTable";
import { getFeedSupplys } from "@/app/_lib/action";
import { SingleUser } from "@/app/_typeModels/User";
import { getCookie } from "cookies-next";
import { Metadata } from "next";
import { cookies } from "next/headers";
export const metadata: Metadata = {
  title: "Feed Supply",
};
export default async function Page() {
  const loggedUser: any = getCookie("logged-user", { cookies });
  const user: SingleUser = JSON.parse(loggedUser);

  return (
    <>
      <BasicBreadcrumbs
        heading={"Feed Supply"}
        buttonName={"Add Feed"}
        isTable={false}
        buttonRoute="/dashboard/feedSupply/new"
        links={[
          { name: "Dashboard", link: "/dashboard" },
          { name: "Feed Supply", link: "/dashboard/feedSupply" },
        ]}
        hideSearchInput
        extraButton={{
          route: "/dashboard/feedSupply/libarary",
          buttonName: "Feed Libarary",
        }}
        permissions={user?.permissions?.addFeedSupply}
      />
      <FeedSelection />
      {/* <FeedTable feeds={feeds?.data} /> */}
    </>
  );
}
