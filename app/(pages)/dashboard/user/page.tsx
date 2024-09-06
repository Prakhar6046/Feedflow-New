import BasicBreadcrumbs from "@/app/_components/Breadcrumbs";
import UserTable from "@/app/_components/UserTable";
import { getUsers } from "@/app/_lib/action";

export default async function Page() {
  const users = await getUsers();

  return (
    <>
      <BasicBreadcrumbs
        heading={"User"}
        buttonName={"Add User"}
        links={[
          { name: "Dashboard", link: "/dashboard" },
          { name: "User", link: "/dashboard/user" },
        ]}
      />
      <UserTable users={users?.data} />
    </>
  );
}
