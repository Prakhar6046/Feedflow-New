import BasicTable from "@/app/_components/BasicTable";
import BasicBreadcrumbs from "@/app/_components/Breadcrumbs";

export default function Page() {
  return (
    <>
      <BasicBreadcrumbs
        heading={"Organization"}
        buttonName={"+Add Organization"}
        links={[{ name: "Dashboard" }, { name: "Organisation" }]}
      />
      <BasicTable />
    </>
  );
}
