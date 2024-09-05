import BasicBreadcrumbs from "@/app/_components/Breadcrumbs";

export default function Page() {
  return (
    <>
      <BasicBreadcrumbs
        heading={"User"}
        buttonName={"+Add User"}
        links={[
          { name: "Dashboard", link: "/dashboard" },
          { name: "User", link: "/dashboard/user" },
        ]}
      />
      user
    </>
  );
}
