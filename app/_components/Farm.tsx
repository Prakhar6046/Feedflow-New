"use server";
import { getFarms } from "../_lib/action";
import FarmTable from "./table/FarmTable";

export const Farm = async () => {
  const farms = await getFarms();

  return <FarmTable farms={farms?.data} />;
};
