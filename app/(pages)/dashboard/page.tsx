import BasicBreadcrumbs from "@/app/_components/Breadcrumbs";
import { Metadata, NextPage } from "next";

interface Props {}
export const metadata: Metadata = {
  title: "Dashboard",
};
const Page: NextPage<Props> = ({}) => {
  return (
    <div>
      <BasicBreadcrumbs heading={"Dashboard"} />
    </div>
  );
};

export default Page;
