import BasicBreadcrumbs from "@/app/_components/Breadcrumbs";
import { NextPage } from "next";

interface Props {}

const Page: NextPage<Props> = ({}) => {
  return (
    <div>
      <BasicBreadcrumbs heading={"Dashboard"} />
    </div>
  );
};

export default Page;
