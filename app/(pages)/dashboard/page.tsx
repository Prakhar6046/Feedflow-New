import BasicBreadcrumbs from "@/app/_components/Breadcrumbs";
import Loader from "@/app/_components/Loader";
import { NextPage } from "next";

interface Props {}

const Page: NextPage<Props> = ({}) => {
  return (
    <div>
      <BasicBreadcrumbs heading={"Dashboard"} />
      <Loader />
    </div>
  );
};

export default Page;
