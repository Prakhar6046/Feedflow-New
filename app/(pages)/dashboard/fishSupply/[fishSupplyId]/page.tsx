import BasicBreadcrumbs from "@/app/_components/Breadcrumbs";
import NewFishSupply from "@/app/_components/fishSupply/NewFishSupply";

export default async function Page({
  params,
}: {
  params: { fishSupplyId: string };
}) {
  return (
    <>
      <BasicBreadcrumbs
        heading={"Edit Fish Supply"}
        hideSearchInput={true}
        links={[
          { name: "Dashboard", link: "/dashboard" },
          { name: "Fish Supply", link: "/dashboard/fishSupply" },
          {
            name: "Edit",
            link: `/dashboard/fishSupply/${params.fishSupplyId}`,
          },
        ]}
      />
      <NewFishSupply isEdit={true} fishSupplyId={params.fishSupplyId} />
    </>
  );
}
