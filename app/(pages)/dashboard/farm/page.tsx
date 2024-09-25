import BasicBreadcrumbs from "@/app/_components/Breadcrumbs";
export default async function Page() {
  return (
    <>
      <BasicBreadcrumbs
        heading={"Farm"}
        buttonName={"Add Farm"}
        searchOrganisations={true}
        searchUsers={false}
        isTable={true}
        buttonRoute="/dashboard/farm/newFarm"
        links={[
          { name: "Dashboard", link: "/dashboard" },
          { name: "Farm", link: "/dashboard/farm" },
        ]}
      />
      Farm
    </>
  );
}
