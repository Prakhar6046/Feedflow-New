import BasicTable from "@/app/_components/BasicTable";
import BasicBreadcrumbs from "@/app/_components/Breadcrumbs";

export default async function Page() {
  // const data = await fetch(`${process.env.BASE_URL}/api/organisation`, {
  //   method: "GET",
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  // });
  // const organisations = await data.json();

  return (
    <>
      <BasicBreadcrumbs
        heading={"Organization"}
        buttonName={"+Add Organization"}
        links={[{ name: "Dashboard" }, { name: "Organisation" }]}
      />
      <BasicTable />
      {/* <BasicTable organisations={organisations.data} /> */}
    </>
  );
}
