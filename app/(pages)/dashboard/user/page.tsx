import BasicBreadcrumbs from "@/app/_components/Breadcrumbs";
import UserTable from "@/app/_components/UserTable";
import { getAllOrganisations } from "@/app/_lib/action";
export default async function Page() {
  let organisations = await getAllOrganisations();

  return (
    <>
      <BasicBreadcrumbs
        heading={"Users"}
        buttonName={"Add User"}
        buttonRoute="/dashboard/user/new"
        searchUsers={true}
        organisations={organisations?.data}
        searchOrganisations={false}
        isTable={true}
        refetch={"user"}
        links={[
          { name: "Dashboard", link: "/dashboard" },
          { name: "Users", link: "/dashboard/user" },
        ]}
      />
      <UserTable />
    </>
  );
}
