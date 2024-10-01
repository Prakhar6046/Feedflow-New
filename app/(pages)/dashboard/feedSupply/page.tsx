import BasicBreadcrumbs from "@/app/_components/Breadcrumbs";

export default function Page() {
  return (
    <>
      <BasicBreadcrumbs
        heading={"Feed"}
        buttonName={"Add Feed"}
        searchOrganisations={false}
        searchUsers={false}
        searchFarm={false}
        isTable={true}
        buttonRoute="/dashboard/feedSupply/new"
        links={[
          { name: "Dashboard", link: "/dashboard" },
          { name: "Feed Supply", link: "/dashboard/feedSupply" },
          { name: "Feed Supply", link: "/dashboard/feedSupply/new" },
        ]}
      />
    </>
  );
}
