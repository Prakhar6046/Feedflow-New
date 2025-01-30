import BasicBreadcrumbs from "@/app/_components/Breadcrumbs";
import { Metadata } from "next";
import EditOrganisation from "@/app/_components/organisation/EditOrganisation";
import { getAllOrganisations } from "@/app/_lib/action";
export const metadata: Metadata = {
  title: "Edit Organisation",
};
const Page = async ({ params }: { params: { organisationId: string } }) => {
  const organisations = await getAllOrganisations();
  return (
    <>
      <BasicBreadcrumbs
        heading={"Edit Organisation"}
        isTable={false}
        hideSearchInput={true}
        links={[
          { name: "Dashboard", link: "/dashboard" },
          { name: "Organisations", link: "/dashboard/organisation" },
          {
            name: "Edit Organisation",
            link: `/dashboard/organisation/${params.organisationId}`,
          },
        ]}
      />
      <EditOrganisation
        organisationId={params.organisationId}
        organisations={organisations?.data}
      />
    </>
  );
};

export default Page;
