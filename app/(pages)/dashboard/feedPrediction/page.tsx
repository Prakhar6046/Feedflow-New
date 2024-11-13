import BasicBreadcrumbs from "@/app/_components/Breadcrumbs";
import { NextPage } from "next";

interface Props { }

const Page: NextPage<Props> = ({ }) => {
  return (
    <BasicBreadcrumbs heading={"Dashboard"} />
    // <div>Feed Prediction Coming Soon...</div>
  );
};

export default Page;
