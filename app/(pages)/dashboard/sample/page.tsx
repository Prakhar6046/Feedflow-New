"use client";

import { NextPage } from "next";

interface Props {}
import * as React from "react";
// import Tabs from '@mui/material/Tabs';
// import Tab from '@mui/material/Tab';
// import Box from '@mui/material/Box';

// import PhoneIcon from '@mui/icons-material/Phone';

// import EnvironmentIcon from "@/public/static/img/icons/ic-environment.svg";

// interface TabPanelProps {
//   children?: React.ReactNode;
//   index: number;
//   value: number;
// }

// function CustomTabPanel(props: TabPanelProps) {
//   const { children, value, index, ...other } = props;

//   return (
//     <div
//       role="tabpanel"
//       hidden={value !== index}
//       id={`simple-tabpanel-${index}`}
//       aria-labelledby={`simple-tab-${index}`}
//       {...other}
//     >
//       {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
//     </div>
//   );
// }

// function a11yProps(index: number) {
//   return {
//     id: `simple-tab-${index}`,
//     'aria-controls': `simple-tabpanel-${index}`,
//   };
// }

const Page: NextPage<Props> = ({}) => {
  // const [value, setValue] = React.useState(0);

  // const handleChange = (event: React.SyntheticEvent, newValue: number) => {
  //   setValue(newValue);
  // };

  // return (
  //   <Box sx={{ width: '100%' }}>
  //     <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
  //       <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
  //         <Tab label="Environment" icon={<EnvironmentIcon />} aria-label="phone" {...a11yProps(0)} />
  //         <Tab label="Item Two" {...a11yProps(1)} />
  //         <Tab label="Item Three" {...a11yProps(2)} />
  //       </Tabs>
  //     </Box>
  //     <CustomTabPanel value={value} index={0}>
  //       Item One
  //     </CustomTabPanel>
  //     <CustomTabPanel value={value} index={1}>
  //       Item Two
  //     </CustomTabPanel>
  //     <CustomTabPanel value={value} index={2}>
  //       Item Three
  //     </CustomTabPanel>
  //   </Box>
  // );
  return <div>Sample Coming Soon...</div>;
};

export default Page;
