"use client";
import BasicTable from "@/app/_components/BasicTable";
import BasicBreadcrumbs from "@/app/_components/Breadcrumbs";
import Header from "@/app/_components/Header";
import Sidebar from "@/app/_components/Sidebar";
import { selectSwitchSidebar } from "@/lib/features/sidebar/sidebarSlice";
import { useAppSelector } from "@/lib/hooks";
import { Box, Stack } from "@mui/material";
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const switchSidebar = useAppSelector(selectSwitchSidebar);
  return (
    <Stack display={"flex"} direction={"row"} height={"100vh"}>
      <Sidebar />
      {switchSidebar ? (
        <Box width={"100%"} paddingTop={2} paddingRight={5} paddingLeft={39}>
          <Header />
          {children}
        </Box>
      ) : (
        <Box width={"100%"} paddingTop={2} paddingRight={5} paddingLeft={17}>
          <Header />
          {children}
        </Box>
      )}
    </Stack>
  );
}
