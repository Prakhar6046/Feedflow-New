"use server";
import FarmTable from "./table/FarmTable";
interface Props {
  farms: any;
}
export const Farm = async ({ farms }: Props) => {
  return <FarmTable farms={farms} />;
};
