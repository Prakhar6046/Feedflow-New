import BasicBreadcrumbs from "@/app/_components/Breadcrumbs";
import UserTable from "@/app/_components/UserTable";
import { getUsers } from "@/app/_lib/action";
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
  const users = await getUsers({
    role: user.data.user.role,
    organisationId: user.data.user.organisationId,
    query,
  });

  return (
    <>
      <BasicBreadcrumbs
        heading={"Users"}
        buttonName={"Add User"}
        buttonRoute="/dashboard/user/new"
        searchUsers={true}
        searchOrganisations={false}
        isTable={true}
        refetch={"user"}
        links={[
          { name: "Dashboard", link: "/dashboard" },
          { name: "Users", link: "/dashboard/user" },
        ]}
      />
      <UserTable users={users.data} />
    </>
  );
}
