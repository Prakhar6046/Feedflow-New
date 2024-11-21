import BasicBreadcrumbs from "@/app/_components/Breadcrumbs";
import FarmTable from "@/app/_components/table/FarmTable";
import { getFarmMembers, getFarms } from "@/app/_lib/action";
import { getCookie } from "cookies-next";
import { cookies } from "next/headers";
export default async function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
  };
}) {
  const query = searchParams?.query || "";
  const loggedUser: any = getCookie("logged-user", { cookies });
  const user = JSON.parse(loggedUser);

  const famrs = await getFarms({
    role: user.role,
    organisationId: user.organisationId,
    query,
    noFilter: false,
  });
  const farmMembers = await getFarmMembers(user.organisationId);
  console.log(farmMembers);

  return (
    <>
      <BasicBreadcrumbs
        heading={"Farm"}
        buttonName={user.role !== "MEMBER" ? "Add Farm" : ""}
        isTable={true}
        refetch="farm"
        buttonRoute="/dashboard/farm/newFarm"
        links={[
          { name: "Dashboard", link: "/dashboard" },
          { name: "Farm", link: "/dashboard/farm" },
        ]}
      />
      <FarmTable farms={famrs?.data} />
    </>
  );
}
