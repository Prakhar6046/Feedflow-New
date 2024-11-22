import BasicBreadcrumbs from "@/app/_components/Breadcrumbs";
import ToggleSamplingView from "@/app/_components/sampling/ToggleSamplingView";
import SampleTable from "@/app/_components/table/SampleTable";
import { sampleHead } from "@/app/_lib/utils/tableHeadData";

const Page = () => {
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
      <SampleTable tableData={sampleHead} />
    </>
  );
};

export default Page;
