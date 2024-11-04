import { NextPage } from "next";
import Loader from "@/app/_components/Loader";
interface Props {}

const Loading: NextPage<Props> = ({}) => {
  return <Loader />;
};

export default Loading;
