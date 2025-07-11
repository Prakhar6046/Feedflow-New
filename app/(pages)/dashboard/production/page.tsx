import BasicBreadcrumbs from "@/app/_components/Breadcrumbs";
import ProductionTable from "@/app/_components/table/ProductionTable";
import { getBatches, getFarms, getProductions } from "@/app/_lib/action";
import { getCookie } from "cookies-next";
import { Metadata } from "next";
import { cookies } from "next/headers";
export const metadata: Metadata = {
  title: "Production Manager",
};
export default async function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
  };
}) {
  const query = searchParams?.query || "";
  const loggedUser: any = getCookie("logged-user", { cookies });
  const refreshToken: any = getCookie("refresh-token", { cookies });
  const user = JSON.parse(loggedUser);
  const productions = await getProductions({
    role: user.role,
    organisationId: user.organisationId,
    query,
    noFilter: false,
    userId: user.id,
    refreshToken,
  });
  const farms = await getFarms({
    role: user.role,
    organisationId: user.organisationId,
    query: "",
    noFilter: false,
    refreshToken,
  });
  const batches = await getBatches({ refreshToken });
  return (
    <>
      <BasicBreadcrumbs
        heading={"Production Manager"}
        isTable={true}
        links={[
          { name: "Dashboard", link: "/dashboard" },
          { name: "Production Manager", link: "/dashboard/production" },
        ]}
      />

      <ProductionTable
        productions={productions.data}
        farms={farms.data}
        batches={batches.data}
      />
    </>
  );
}
