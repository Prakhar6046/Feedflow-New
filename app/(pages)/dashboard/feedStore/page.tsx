import FeedStoreTable from "@/app/_components/table/FeedStore";
import { NextPage } from "next";

interface Props {}

const Page: NextPage<Props> = ({}) => {
  // return <div>Feed Store Coming Soon...</div>;
  return (
    <div>
      <FeedStoreTable />
    </div>
  );
};

export default Page;
