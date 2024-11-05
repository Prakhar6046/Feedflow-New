import AddNewUser from "@/app/_components/AddNewUser";
import BasicBreadcrumbs from "@/app/_components/Breadcrumbs";
import { getOrganisations } from "@/app/_lib/action";
import { getCookie } from "cookies-next";
import { cookies } from "next/headers";
// import { getAllOrganisations } from "@/app/_lib/action";
export default async function Page() {
  const loggedUser: any = getCookie("logged-user", { cookies });
  const user = JSON.parse(loggedUser);
  let organisations = await getOrganisations({
    organisationId: user?.organisationId,
    role: user?.role,
    query: "",
  });

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
