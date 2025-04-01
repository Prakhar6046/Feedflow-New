import BasicBreadcrumbs from "@/app/_components/Breadcrumbs";
import { NextPage } from "next";
import FeedPredictionTable from "@/app/_components/table/FeedPrediction";
import { getCookie } from "cookies-next";
import { cookies } from "next/headers";
import { getFarms, getProductions } from "@/app/_lib/action";
const Page: NextPage = async ({
  searchParams,
}: {
  searchParams?: {
    query?: string;
  };
}) => {
  const query = searchParams?.query || "";
  const loggedUser: any = getCookie("logged-user", { cookies });
  const user = JSON.parse(loggedUser);
  const farms = await getFarms({
    role: user.role,
    organisationId: user.organisationId,
    query: "",
    noFilter: false,
  });
  const productions = await getProductions({
    role: user.role,
    organisationId: user.organisationId,
    query,
    noFilter: false,
    userId: user.id,
  });
  return (
    <>
      <BasicBreadcrumbs
        heading={"Thermal growth coefficient Demo"}
        hideSearchInput={true}
        links={[
          { name: "Dashboard", link: "/dashboard" },
          { name: "Feed Prediction", link: "/dashboard/feedPrediction" },
        ]}
      />
      <FeedPredictionTable farms={farms.data} productions={productions.data} />
    </>
  );
};

export default Page;
