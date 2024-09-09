import BasicBreadcrumbs from "@/app/_components/Breadcrumbs";
import UserTable from "@/app/_components/UserTable";
import { getOrganisations, getUsers } from "@/app/_lib/action";
import { getCookie } from "cookies-next";
import { cookies } from "next/headers";

export default async function Page() {
  const users = await getUsers();
  let organisations = await getOrganisations();
  const role = getCookie("role", { cookies });

  const filteredUsers =
    role === "SUPERADMIN"
      ? users.data.filter((user: any) => user.role !== "SUPERADMIN")
      : role === "MEMBER"
      ? users.data
          .filter((user: any) => user.role! !== "SUPERADMIN")
          .filter((user: any) => user.role !== "ADMIN")
      : users.data.filter((user: any) => user.role! !== "SUPERADMIN");

  return (
    <>
      <BasicBreadcrumbs
        heading={"User"}
        buttonName={"Add User"}
        organisations={organisations?.data}
        links={[
          { name: "Dashboard", link: "/dashboard" },
          { name: "User", link: "/dashboard/user" },
        ]}
      />
      <UserTable users={filteredUsers} />
    </>
  );
}
