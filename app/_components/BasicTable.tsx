"use client";
import React, { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import { styled } from "@mui/material/styles";
// import UploadFileOutlinedIcon from '@mui/icons-material/UploadFileOutlined';
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

import Select, { SelectChangeEvent } from '@mui/material/Select';

import { Box, Button, Divider, FormControl, Grid, InputLabel, Menu, MenuItem, Stack, TextField, Typography } from "@mui/material";
import {
  selectOrganisationLoading,
  selectOrganisations,
} from "@/lib/features/organisation/organisationSlice";
import { useAppSelector } from "@/lib/hooks";
import Loader from "./Loader";
import Link from "next/link";
// import Select from "./theme/overrides/Select";
export interface Organisation {
  id: Number;
  name: String;
  contactNumber: String;
  contactPerson: String;
  image: String;
  organisationCode: String;
  createdAt: String;
  updatedAt: String;
}
interface Props {
  organisations: Organisation[];
}

export default function BasicTable({ organisations }: Props) {
  const searchedOrganisations = useAppSelector(selectOrganisations);
  const loading = useAppSelector(selectOrganisationLoading);
  const [organisationData, setOrganisationData] = useState<Organisation[]>();
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  useEffect(() => {
    if (organisations) {
      setOrganisationData(organisations);
    }
  }, [organisations]);
  useEffect(() => {
    if (searchedOrganisations) {
      setOrganisationData(searchedOrganisations);
    } else {
      setOrganisationData(organisations);
    }
  }, [searchedOrganisations]);

  const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
  });



  if (loading) {
    return <Loader />;
  }

  const [age, setAge] = React.useState('');

  const handleChange = (event: SelectChangeEvent) => {
    setAge(event.target.value as string);
  };
  return (
    // <TableContainer
    //   component={Paper}
    //   sx={{
    //     borderRadius: "14px",
    //     boxShadow: "0px 0px 16px 5px #0000001A",
    //     mt: 4,
    //   }}
    // >
    //   <Table sx={{ minWidth: 650 }} aria-label="simple table">
    //     <TableHead>
    //       <TableRow
    //         sx={{
    //           background: "#",
    //         }}
    //       >
    //         <TableCell
    //           sx={{
    //             borderBottom: 0,
    //             color: "#67737F",
    //             fontSize: {
    //               md: 16,
    //               xs: 14,
    //             },
    //             fontWeight: 600,
    //             paddingLeft: {
    //               lg: 10,
    //               md: 7,
    //               xs: 4,
    //             },
    //           }}
    //         >
    //           Organizations
    //         </TableCell>
    //         <TableCell
    //           sx={{
    //             borderBottom: 0,
    //             color: "#67737F",
    //             fontSize: {
    //               md: 16,
    //               xs: 14,
    //             },
    //             fontWeight: 600,
    //           }}
    //         >
    //           Contact Number
    //         </TableCell>
    //         <TableCell
    //           sx={{
    //             borderBottom: 0,
    //             color: "#67737F",
    //             fontSize: {
    //               md: 16,
    //               xs: 14,
    //             },
    //             fontWeight: 600,
    //           }}
    //         >
    //           Contact Person
    //         </TableCell>
    //         {/* <TableCell
    //           sx={{
    //             borderBottom: 0,
    //             color: "#67737F",
    //             fontSize: {
    //               md: 16,
    //               xs: 14,
    //             },
    //             fontWeight: 600,
    //           }}
    //         >
    //           Product
    //         </TableCell> */}
    //         <TableCell
    //           sx={{
    //             borderBottom: 0,
    //             color: "#67737F",
    //             fontSize: {
    //               md: 16,
    //               xs: 14,
    //             },
    //             fontWeight: 600,
    //           }}
    //         ></TableCell>
    //       </TableRow>
    //     </TableHead>
    //     <TableBody>
    //       {organisationData && organisationData.length > 0 ? (
    //         organisationData?.map((organisation, i) => (
    //           <TableRow
    //             key={i}
    //             sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
    //           >
    //             <TableCell
    //               sx={{
    //                 borderBottomColor: "#F5F6F8",
    //                 borderBottomWidth: 2,
    //                 color: "#555555",
    //                 fontWeight: 500,
    //                 paddingLeft: {
    //                   lg: 10,
    //                   md: 7,
    //                   xs: 4,
    //                 },
    //               }}
    //               component="th"
    //               scope="row"
    //             >
    //               <Box display={"flex"} alignItems={"center"} gap={1.5}>
    //                 <Box
    //                   display={"flex"}
    //                   justifyContent={"center"}
    //                   alignItems={"center"}
    //                   bgcolor={"rgba(145, 158, 171, 0.24)"}
    //                   sx={{
    //                     width: 80,
    //                     height: 40,
    //                     borderRadius: "8px",
    //                   }}
    //                 >
    //                   <svg
    //                     xmlns="http://www.w3.org/2000/svg"
    //                     width="1.7em"
    //                     height="1.7em"
    //                     viewBox="0 0 24 24"
    //                   >
    //                     <g fill="none">
    //                       <path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z" />
    //                       <path
    //                         fill="#637381"
    //                         d="M16 14a5 5 0 0 1 4.995 4.783L21 19v1a2 2 0 0 1-1.85 1.995L19 22H5a2 2 0 0 1-1.995-1.85L3 20v-1a5 5 0 0 1 4.783-4.995L8 14zM12 2a5 5 0 1 1 0 10a5 5 0 0 1 0-10"
    //                       />
    //                     </g>
    //                   </svg>
    //                 </Box>

    //                 {organisation.name}
    //               </Box>
    //             </TableCell>
    //             <TableCell
    //               sx={{
    //                 borderBottomColor: "#F5F6F8",
    //                 borderBottomWidth: 2,
    //                 color: "#555555",
    //                 fontWeight: 500,
    //               }}
    //             >
    //               {organisation.contactNumber}
    //             </TableCell>
    //             <TableCell
    //               sx={{
    //                 borderBottomColor: "#F5F6F8",
    //                 borderBottomWidth: 2,
    //                 color: "#555555",
    //                 fontWeight: 500,
    //               }}
    //             >
    //               {organisation.contactPerson}
    //             </TableCell>
    //             {/* <TableCell
    //             sx={{
    //               borderBottomColor: "#F5F6F8",
    //               borderBottomWidth: 2,
    //               color: "#555555",
    //               fontWeight: 500,
    //             }}
    //           >
    //             {row.carbs}
    //           </TableCell> */}
    //             <TableCell
    //               align="center"
    //               sx={{
    //                 borderBottomColor: "#F5F6F8",
    //                 borderBottomWidth: 2,
    //                 color: "#555555",
    //                 fontWeight: 500,
    //               }}
    //             >
    //               <Button
    //                 id="basic-button"
    //                 aria-controls={open ? "basic-menu" : undefined}
    //                 aria-haspopup="true"
    //                 aria-expanded={open ? "true" : undefined}
    //                 onClick={(e) => handleClick(e)}
    //                 className="table-edit-option"
    //                 sx={{
    //                   background: "transparent",
    //                   color: "#555555",
    //                   boxShadow: "none",
    //                 }}
    //               >
    //                 <svg
    //                   xmlns="http://www.w3.org/2000/svg"
    //                   width="1em"
    //                   height="1em"
    //                   viewBox="0 0 16 16"
    //                 >
    //                   <path
    //                     fill="currentColor"
    //                     d="M9.5 13a1.5 1.5 0 1 1-3 0a1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0a1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0a1.5 1.5 0 0 1 3 0"
    //                   />
    //                 </svg>
    //               </Button>
    //               <Menu
    //                 id="basic-menu"
    //                 className="table-edit-menu"
    //                 anchorEl={anchorEl}
    //                 open={open}
    //                 onClose={handleClose}
    //                 MenuListProps={{
    //                   "aria-labelledby": "basic-button",
    //                 }}
    //               >
    //                 <MenuItem>
    //                   <Stack
    //                     display="flex"
    //                     gap={1.2}
    //                     alignItems="center"
    //                     direction="row"
    //                   >
    //                     <svg
    //                       xmlns="http://www.w3.org/2000/svg"
    //                       width="1em"
    //                       height="1em"
    //                       viewBox="0 0 24 24"
    //                     >
    //                       <path
    //                         fill="currentColor"
    //                         d="M3 21v-4.25L16.2 3.575q.3-.275.663-.425t.762-.15t.775.15t.65.45L20.425 5q.3.275.438.65T21 6.4q0 .4-.137.763t-.438.662L7.25 21zM17.6 7.8L19 6.4L17.6 5l-1.4 1.4z"
    //                       />
    //                     </svg>

    //                     <Typography variant="subtitle2">Edit</Typography>
    //                   </Stack>
    //                 </MenuItem>
    //               </Menu>
    //             </TableCell>
    //           </TableRow>
    //         ))
    //       ) : (
    //         <TableRow
    //           key={"nodata"}
    //           sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
    //         >
    //           No Data Found
    //         </TableRow>
    //       )}
    //     </TableBody>
    //   </Table>
    // </TableContainer>

    <Stack sx={{
      borderRadius: "14px",
      boxShadow: "0px 0px 16px 5px #0000001A",
      mt: 4,
    }}>

      <Box sx={{
        p: {
          md: 3,
          xs: 2
        },
        fontSize: 20,
        fontWeight: 600,
        borderColor: "#0000001A"
      }}>Information
      </Box>

      <Divider />

      <Grid container sx={{
        p: {
          md: 3,
          xs: 2
        },
      }}>
        <Grid
          item
          xl={3}
          md={5}
          xs={12}
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            gap: 3,
            alignItems: {
              md: "flex-start",
              xs: "center",
            },
          }}
        >
          <Button
            component="label"
            role={undefined}
            variant="contained"
            tabIndex={-1}
            startIcon={<CloudUploadIcon />}
            className="upload-file-input"
            sx={{
              textTransform: "unset",
              fontSize: 12,
              width: {
                md: "90%",
                xs: "100%",
              },
              height: 200,
              borderRadius: 3,
              border: "7px solid white",
              outline: "1px dashed rgba(145, 158, 171, 0.32)",
              backgroundColor: "rgb(244, 246, 248)",
              boxShadow: "none",
              color: "rgb(99, 115, 129)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}

            style={{
              margin: "0 !important"
            }}
          >
            <Box>
              Drag file here or <Link href="/" style={{
                color: "#06a19b"
              }}>Upload from Device</Link>
            </Box>
            <VisuallyHiddenInput
              type="file"
              onChange={(event) => console.log(event.target.files)}
              multiple
            />
          </Button>

          <Box display={"flex"} justifyContent={"center"} alignItems={"center"} flexDirection={"row"} sx={{
            width: {
              md: "90%",
              xs: "100%",
            }
          }}>
            <Typography variant="body1" fontSize={12} textAlign={"center"} margin="0 auto" color="#979797">Allowed *.jpeg, *.jpg, *.png, *.gif <br />
              max size of 3.15M byte</Typography>
          </Box>
        </Grid>

        <Grid
          item
          xl={9}
          md={7}
          xs={12}
          sx={{
            mt: {
              md: 0,
              xs: 5
            }
          }}
        >
          <form>
            <TextField
              label="Organisation Name"
              type="text"
              className="form-input"
              focused
              // focused={userData?.data.name ? true : false}
              // value={userData?.data.name}
              sx={{
                width: "100%",
                marginBottom: 2,
              }}
            />


            <Stack display={"flex"} justifyContent={"flex-start"} direction={"row"} sx={{
              width: "100%",
              marginBottom: 2,
              gap: 1.5
            }}>
              <FormControl className="form-input" focused sx={{
                width: {
                  md: "15%",
                  xs: "50%"
                }
              }}>
                <InputLabel id="demo-simple-select-label">Organisation Type</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Organisation Type"
                  onChange={handleChange}
                >
                  <MenuItem value={10}>Ten</MenuItem>
                  <MenuItem value={20}>Twenty</MenuItem>
                  <MenuItem value={30}>Thirty</MenuItem>
                </Select>
              </FormControl>

              <TextField
                label="Organisation Code"
                type="text"
                className="form-input"
                // disabled
                sx={{
                  width: {
                    md: "85%",
                    xs: "50%"
                  }
                }}
                focused
              // focused={true}
              // value={userData?.data.email ?? "Demo@gmail.com"}
              />
            </Stack>

            <Typography
              variant="h6"
              color="rgb(99, 115, 129)"
              fontSize={14}
              marginTop={3}
              marginBottom={2}
            >
              Address
            </Typography>

            <Stack display={"flex"} justifyContent={"flex-start"} direction={"row"} sx={{
              width: "100%",
              marginBottom: 2,
              gap: 1.5
            }}>

              <TextField
                label="Address"
                type="text"
                className="form-input"
                focused
                sx={{
                  width: "100%",
                }}
              />

              <TextField
                label="City"
                type="text"
                className="form-input"
                focused
                sx={{
                  width: "100%",
                }}
              />

            </Stack>

            <Stack display={"flex"} justifyContent={"flex-start"} direction={"row"} sx={{
              width: "100%",
              marginBottom: 2,
              gap: 1.5
            }}>

              <TextField
                label="Province"
                type="text"
                className="form-input"
                focused
                sx={{
                  width: "100%",
                }}
              />

              <TextField
                label="Post Code"
                type="text"
                className="form-input"
                focused
                sx={{
                  width: "100%",
                }}
              />

            </Stack>

            <Typography
              variant="h6"
              color="rgb(99, 115, 129)"
              fontSize={14}
              marginTop={3}
              marginBottom={2}
            >
              Contacts
            </Typography>

            <Stack display={"flex"} justifyContent={"center"} direction={"row"} sx={{
              width: "100%",
              marginBottom: 2,
              gap: 1.5,
              flexWrap: {
                lg: "nowrap",
                xs: "wrap"
              }
            }}>

              <TextField
                label="Name"
                type="text"
                className="form-input"
                focused
                sx={{
                  width: {
                    lg: "100%",
                    md: "48.4%",
                    xs: "100%"
                  },
                }}
              />

              <TextField
                label="Role"
                type="text"
                className="form-input"
                focused
                sx={{
                  width: {
                    lg: "100%",
                    md: "48.4%",
                    xs: "100%"
                  },
                }}
              />

              <TextField
                label="Email"
                type="email"
                className="form-input"
                focused
                sx={{
                  width: {
                    lg: "100%",
                    md: "48.4%",
                    xs: "100%"
                  },
                }}
              />

              <TextField
                label="Phone"
                type="text"
                className="form-input"
                focused
                sx={{
                  width: {
                    lg: "100%",
                    md: "48.4%",
                    xs: "100%"
                  },
                }}
              />

              <Box display={"flex"} justifyContent={"center"} alignItems={"center"} width={150} sx={{
                cursor: "pointer",
                width: {
                  lg: 150,
                  xs: "auto"
                },
              }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="1.4em" height="1.4em" viewBox="0 0 24 24">
                  <g fill="none">
                    <path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z" />
                    <path fill="#ff0000" d="M14.28 2a2 2 0 0 1 1.897 1.368L16.72 5H20a1 1 0 1 1 0 2l-.003.071l-.867 12.143A3 3 0 0 1 16.138 22H7.862a3 3 0 0 1-2.992-2.786L4.003 7.07L4 7a1 1 0 0 1 0-2h3.28l.543-1.632A2 2 0 0 1 9.721 2zm3.717 5H6.003l.862 12.071a1 1 0 0 0 .997.929h8.276a1 1 0 0 0 .997-.929zM10 10a1 1 0 0 1 .993.883L11 11v5a1 1 0 0 1-1.993.117L9 16v-5a1 1 0 0 1 1-1m4 0a1 1 0 0 1 1 1v5a1 1 0 1 1-2 0v-5a1 1 0 0 1 1-1m.28-6H9.72l-.333 1h5.226z" />
                  </g>
                </svg>
              </Box>
            </Stack>

            <Divider
              sx={{
                borderColor: "#979797",
                my: 1,
              }}
            />

            <Stack p={1.5} direction={"row"} borderRadius={3} mt={2} color={"#06a19b"} fontSize={14} fontWeight={500} display={"flex"} alignItems={"center"} justifyContent={"center"} gap={0.5} border={"2px dashed #06a19b"} className="add-contact-btn">
              <svg xmlns="http://www.w3.org/2000/svg" width="1.4em" height="1.4em" viewBox="0 0 24 24">
                <path fill="#06a19b" d="M12 4c4.411 0 8 3.589 8 8s-3.589 8-8 8s-8-3.589-8-8s3.589-8 8-8m0-2C6.477 2 2 6.477 2 12s4.477 10 10 10s10-4.477 10-10S17.523 2 12 2m5 9h-4V7h-2v4H7v2h4v4h2v-4h4z" />
              </svg>

              Add Contact
            </Stack>


            <Button
              type="submit"
              variant="contained"
              sx={{
                background: "#06A19B",
                fontWeight: 600,
                padding: "6px 16px",
                width: "fit-content",
                textTransform: "capitalize",
                borderRadius: "8px",
                marginLeft: "auto",
                display: "block",
                marginTop: 2,
              }}
            >
              Save Changes
            </Button>
          </form>
        </Grid>
      </Grid>

    </Stack>
  );
}
