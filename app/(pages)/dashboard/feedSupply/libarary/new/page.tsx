import BasicBreadcrumbs from "@/app/_components/Breadcrumbs";
import { Metadata } from "next";
import NewFeedSupply from "@/app/_components/feedSupply/NewFeedSupply";
import NewFeedLibarary from "@/app/_components/feedSupply/NewFeedLibarary";

export const metadata: Metadata = {
  title: "Feed Supply",
};
export default function Page() {
  return (
    <>
      <BasicBreadcrumbs
        heading={"New Feed"}
        isTable={false}
        hideSearchInput
        links={[
          { name: "Dashboard", link: "/dashboard" },
          { name: "Feed Supply", link: "/dashboard/feedSupply" },
          { name: "Libarary", link: "/dashboard/feedSupply/libarary" },
          { name: "New", link: "/dashboard/feedSupply/libarary/new" },
        ]}
      />
      <NewFeedLibarary />
    </>
  );
}
