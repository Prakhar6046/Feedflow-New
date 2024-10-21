import AddNewUser from "@/app/_components/AddNewUser";
import BasicBreadcrumbs from "@/app/_components/Breadcrumbs";
import { getAllOrganisations } from "@/app/_lib/action";
export default async function Page() {
  let organisations = await getAllOrganisations();

  return (
    <>
      <BasicBreadcrumbs
        heading={"Add a new user"}
        hideSearchInput={true}
        links={[
          { name: "Dashboard", link: "/dashboard" },
          { name: "Users", link: "/dashboard/user" },
          { name: "New User", link: "/dashboard/user/new" },
        ]}
      />
      <AddNewUser organisations={organisations?.data} />
    </>
  );
}
