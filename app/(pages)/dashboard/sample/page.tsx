import BasicBreadcrumbs from "@/app/_components/Breadcrumbs";
import ToggleSamplingView from "@/app/_components/sampling/ToggleSamplingView";
import SampleEnvironmentTable from "@/app/_components/table/SampleEnvironmentTable";
import SampleTable from "@/app/_components/table/SampleEnvironmentTable";
import SampleStockTable from "@/app/_components/table/SampleStockTable";
import {
  getFarms,
  getSampleEnvironment,
  getSampleStock,
} from "@/app/_lib/action";
import {
  sampleEnvironmentHead,
  sampleEnvironmentHeadMember,
  sampleStockHead,
  sampleStockHeadMember,
} from "@/app/_lib/utils/tableHeadData";
import { getCookie } from "cookies-next";
import { cookies } from "next/headers";

const Page = async ({
  searchParams,
}: {
  searchParams?: {
    query?: string;
  };
}) => {
  const samplingActiveTable = getCookie("sampling-active-table", { cookies });
  const query = searchParams?.query || "";
  const loggedUser: any = getCookie("logged-user", { cookies });
  const user = JSON.parse(loggedUser);
  const sampleEnvironment = await getSampleEnvironment({
    role: user.role,
    organisationId: user.organisationId,
    query,
    noFilter: false,
  });
  const sampleStock = await getSampleStock({
    role: user.role,
    organisationId: user.organisationId,
    query,
    noFilter: false,
  });
  const farms = await getFarms({
    role: user.role,
    organisationId: user.organisationId,
    query: "",
    noFilter: false,
  });

  return (
    <>
      <BasicBreadcrumbs
        heading={"Sampling"}
        isTable={true}
        links={[
          { name: "Dashboard", link: "/dashboard" },
          { name: "Sampling", link: "/dashboard/sample" },
        ]}
      />
      <ToggleSamplingView />
      <SampleEnvironmentTable
        tableData={
          user.role !== "MEMBER" ? sampleStockHead : sampleStockHeadMember
        }
        farms={farms.data}
        sampleEnvironment={sampleEnvironment?.data}
      />
      {/* {Number(samplingActiveTable) === 1 ? (
        <SampleEnvironmentTable
          tableData={
            user.role !== "MEMBER" ? sampleStockHead : sampleStockHeadMember
          }
          farms={farms.data}
          sampleEnvironment={sampleEnvironment?.data}
        />
      ) : (
        <SampleStockTable
          farms={farms.data}
          tableData={
            user.role !== "MEMBER"
              ? sampleEnvironmentHead
              : sampleEnvironmentHeadMember
          }
          sampleStock={sampleStock?.data}
        />
      )} */}
    </>
  );
};

export default Page;
