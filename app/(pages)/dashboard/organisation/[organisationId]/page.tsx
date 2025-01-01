import BasicBreadcrumbs from "@/app/_components/Breadcrumbs";
import { Metadata } from "next";
import EditOrganisation from "@/app/_components/organisation/EditOrganisation";
export const metadata: Metadata = {
  title: "Edit Organisation",
};
const Page = ({ params }: { params: { organisationId: string } }) => {
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
      <EditOrganisation organisationId={params.organisationId} />
    </>
  );
};

export default Page;
