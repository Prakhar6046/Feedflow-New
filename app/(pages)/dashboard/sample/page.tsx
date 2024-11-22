"use client";

import { NextPage } from "next";

interface Props {}
import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { EnvironmentIcon } from "@/app/_components/customIcons/Environment";
import { StockIcon } from "@/app/_components/customIcons/stock";
import BasicBreadcrumbs from "@/app/_components/Breadcrumbs";
import SampleTable from "@/app/_components/table/SampleTable";
import { farmManagerHead, sampleHead } from "@/app/_lib/utils/tableHeadData";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const Page: NextPage<Props> = ({}) => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <>
      <BasicBreadcrumbs
        heading={"Sampling"}
        isTable={true}
        links={[
          { name: "Dashboard", link: "/dashboard" },
          { name: "Sampling", link: "/dashboard/sample" },
        ]}
      />
      <Box sx={{ width: "100%" }}>
        <Box
          sx={{ borderBottom: 1, borderColor: "divider" }}
          className="custom-border"
        >
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
            indicatorColor="none"
            className="custom-gap"
          >
            <Tab
              label="Environment"
              icon={<EnvironmentIcon />}
              className="tab-selected"
              aria-label="environment"
              {...a11yProps(0)}
              sx={{
                backgroundColor: "rgba(6, 161, 155, 0.1)",
                borderRadius: "6px",
                width: "200px",
                display: "flex",
                gap: "5px",
                fontWeight: "bold",
                fontSize: "16px",
              }}
            />
            <Tab
              label="Stock"
              icon={<StockIcon />}
              className="tab-selected"
              aria-label="stock"
              {...a11yProps(1)}
              sx={{
                // backgroundColor: "rgba(6, 161, 155, 0.4)",
                borderRadius: "6px",
                backgroundColor: "rgba(6, 161, 155, 0.1)",
                width: "200px",
                display: "flex",
                gap: "5px",
                fontWeight: "bold",
                fontSize: "16px",
              }}
            />
          </Tabs>
        </Box>
        {/* <CustomTabPanel value={value} index={0}>
          Item One
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          Item Two
        </CustomTabPanel>
        <CustomTabPanel value={value} index={2}>
          Item Three
        </CustomTabPanel> */}
      </Box>
      <SampleTable tableData={sampleHead} />
    </>
  );
};

export default Page;
