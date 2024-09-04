import BasicTable from "@/app/_components/BasicTable";
import BasicBreadcrumbs from "@/app/_components/Breadcrumbs";
import Header from "@/app/_components/Header";
import Sidebar from "@/app/_components/Sidebar";
import { Box, Stack } from "@mui/material";

export default function Page() {
  return (
    <>
      {/* <Stack display={"flex"} direction={"row"} height={"100vh"}>
        <Sidebar />

        <Box width={"100%"} paddingTop={4} paddingInline={5}>
          <Header />
          <BasicBreadcrumbs /> */}
      <BasicTable />
      {/* </Box> */}
      {/* </Stack> */}
    </>
  );
}
