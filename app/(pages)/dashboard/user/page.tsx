import BasicBreadcrumbs from "@/app/_components/Breadcrumbs";
import UserTable from "@/app/_components/UserTable";
import { getOrganisations } from "@/app/_lib/action";

// import { getCookie } from "cookies-next";
// import { cookies } from "next/headers";

export default async function Page() {
  let organisations = await getOrganisations();
  // let organisations = await getOrganisations();
  // const role = getCookie("role", { cookies });
  // console.log(users);

  // const filteredUsers =
  //   role === "SUPERADMIN"
  //     ? users.data.filter((user: any) => user.role !== "SUPERADMIN")
  //     : role === "MEMBER"
  //     ? users.data
  //         .filter((user: any) => user.role! !== "SUPERADMIN")
  //         .filter((user: any) => user.role !== "ADMIN")
  //     : users.data.filter((user: any) => user.role! !== "SUPERADMIN");
  // console.log(filteredUsers);

  return (
    <>
      <BasicBreadcrumbs
        heading={"User"}
        buttonName={"Add User"}
        searchUsers={true}
        organisations={organisations?.data}
        searchOrganisations={false}
        links={[
          { name: "Dashboard", link: "/dashboard" },
          { name: "User", link: "/dashboard/user" },
        ]}
      />
      <UserTable />
    </>
  );
}
