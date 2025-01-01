import BasicBreadcrumbs from "@/app/_components/Breadcrumbs";
import FeedTable from "@/app/_components/table/FeedTable";
import { getFeedSupplys } from "@/app/_lib/action";
import { getCookie } from "cookies-next";
import { Metadata } from "next";
import { cookies } from "next/headers";
export const metadata: Metadata = {
  title: "Feed Supply",
};
export default async function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
  };
}) {
  const query = searchParams?.query || "";
  const loggedUser: any = getCookie("logged-user", { cookies });

  const userOrganisationType = JSON.parse(loggedUser);
  const feeds = await getFeedSupplys({
    role: userOrganisationType.role,
    organisationId: userOrganisationType.organisationId,
    query,
  });

  return (
    <>
      <BasicBreadcrumbs
        heading={"Feed Supply"}
        buttonName={
          userOrganisationType?.role === "SUPERADMIN" ||
          userOrganisationType?.organisationType === "Fish Farmer" ||
          userOrganisationType?.organisationType === "Feed Supplier"
            ? "Add Feed"
            : ""
        }
        isTable={true}
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
