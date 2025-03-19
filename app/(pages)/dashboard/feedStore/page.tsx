'use client';
import { NextPage } from "next";
import * as React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { Stack, Button, Tooltip, Typography } from "@mui/material";
import Modal from '@mui/material/Modal';
import Image from "next/image";
import closeIcon from "@/public/static/img/icons/ic-close.svg";

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: 3,
  minWidth: "75%"
};


interface Props { }

const Page: NextPage<Props> = ({ }) => {
  const [value, setValue] = React.useState('1');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);



  return (
    // <div>Feed Store Coming Soon...</div>
    <>
      <Box sx={{ width: '100%', typography: 'body1' }}>
        <TabContext value={value}>
          <Stack display={"flex"} rowGap={2} columnGap={5} justifyContent={"space-between"} sx={{
            flexDirection: {
              md: "row",
              xs: "column"
            },
            alignItems: {
              md: "center",
              xs: "start"
            }
          }}>
            <Box>
              <TabList onChange={handleChange} aria-label="lab API tabs example" className="production-tabs">
                <Tab label="Farm" value="1" />
                <Tab label="Water" value="2" />
                <Tab label="Feeding" value="3" />
              </TabList>
            </Box>

            <Box display={"flex"} gap={1.5} alignItems={"center"} sx={{
              alignSelf: {
                md: "center",
                xs: "end"
              }
            }}>
              <Button
                id="basic-button"
                type="button"
                variant="contained"
                sx={{
                  background: "#06A19B",
                  fontWeight: 600,
                  padding: "6px 16px",
                  width: "fit-content",
                  textTransform: "capitalize",
                  borderRadius: "8px",
                  color: "white",
                  boxShadow: "none",
                  "&:hover": {
                    boxShadow: "none",
                  },
                }}
              >
                Create All Report
              </Button>

              <Tooltip title="Take Screenshot" placement="top">
                <Button
                  id="basic-button"
                  type="button"
                  variant="contained"
                  sx={{
                    background: "#fff",
                    color: "#06A19B",
                    fontWeight: 600,
                    padding: "6px",
                    width: "fit-content",
                    minWidth: "fit-content",
                    textTransform: "capitalize",
                    borderRadius: "8px",
                    border: "1px solid #06A19B",
                    boxShadow: "none",
                    "&:hover": {
                      boxShadow: "none",
                    },
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="1.7em" height="1.7em" viewBox="0 0 48 48">
                    <path fill="currentColor" d="M6 12.5A6.5 6.5 0 0 1 12.5 6h5.343a1.5 1.5 0 0 1 0 3H12.5A3.5 3.5 0 0 0 9 12.5v5.343a1.5 1.5 0 0 1-3 0zm22.657-5a1.5 1.5 0 0 1 1.5-1.5H35.5a6.5 6.5 0 0 1 6.5 6.5v5.343a1.5 1.5 0 0 1-3 0V12.5A3.5 3.5 0 0 0 35.5 9h-5.343a1.5 1.5 0 0 1-1.5-1.5M7.5 28.657a1.5 1.5 0 0 1 1.5 1.5V35.5a3.5 3.5 0 0 0 3.5 3.5h5.343a1.5 1.5 0 0 1 0 3H12.5A6.5 6.5 0 0 1 6 35.5v-5.343a1.5 1.5 0 0 1 1.5-1.5m33 0a1.5 1.5 0 0 1 1.5 1.5V35.5a6.5 6.5 0 0 1-6.5 6.5h-5.343a1.5 1.5 0 0 1 0-3H35.5a3.5 3.5 0 0 0 3.5-3.5v-5.343a1.5 1.5 0 0 1 1.5-1.5M27 24.5a3 3 0 1 0-6 0a3 3 0 0 0 6 0m.865-8.887a2.25 2.25 0 0 0-1.94-1.11h-3.803a2.25 2.25 0 0 0-1.917 1.073L19.33 17h-2.08A3.25 3.25 0 0 0 14 20.25v9.5A3.25 3.25 0 0 0 17.25 33h13.5A3.25 3.25 0 0 0 34 29.75v-9.5A3.25 3.25 0 0 0 30.75 17h-2.07zM19.5 24.5a4.5 4.5 0 1 1 9 0a4.5 4.5 0 0 1-9 0" />
                  </svg>
                </Button>
              </Tooltip>
            </Box>
          </Stack>

          <TabPanel value="1">
            <Button onClick={handleOpen}>
              Capture Feeding
            </Button>
            <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={style}>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  gap={2}
                  alignItems={"center"}
                  p={3}
                  pb={2}
                  borderBottom={"1px solid #D5d5d5"}
                >
                  <Typography
                    id="modal-modal-title"
                    variant="h6"
                    component="h2"
                    color="#000"
                    fontSize={20}
                    fontWeight={600}
                  >
                    Capture Feeding
                  </Typography>

                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    sx={{
                      opacity: 0.5,
                      cursor: "pointer",
                    }}
                    onClick={handleClose}
                  >
                    <Image src={closeIcon} width={25} height={25} alt="Close Icon" />
                  </Box>
                </Box>

                <Box p={3}>

                </Box>
              </Box>
            </Modal>
          </TabPanel>
          <TabPanel value="2">Item Two</TabPanel>
          <TabPanel value="3">Item Three</TabPanel>
        </TabContext>
      </Box>
    </>
  );
};

export default Page;
