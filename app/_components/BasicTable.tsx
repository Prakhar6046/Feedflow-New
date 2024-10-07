"use client";
import React, { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridRowsProp,
} from "@mui/x-data-grid";
import { Box, Button, Menu, MenuItem, Stack, Typography } from "@mui/material";
import {
  selectOrganisationLoading,
  selectOrganisations,
} from "@/lib/features/organisation/organisationSlice";
import { useAppSelector } from "@/lib/hooks";
import Loader from "./Loader";
import { useRouter } from "next/navigation";
import Image from "next/image";
import toast from "react-hot-toast";
import { SingleOrganisation } from "../_typeModels/Organization";

interface Props {
  organisations: SingleOrganisation[];
}

export default function BasicTable({ organisations }: Props) {
  const router = useRouter();
  const searchedOrganisations = useAppSelector(selectOrganisations);
  const loading = useAppSelector(selectOrganisationLoading);
  const [selectedOrganisation, setSelectedOrganisation] =
    useState<SingleOrganisation | null>(null);
  const [organisationData, setOrganisationData] =
    useState<SingleOrganisation[]>();
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );

  const handleClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    organisation: SingleOrganisation
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedOrganisation(organisation);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedOrganisation(null);
  };
  const handleEdit = (user: any) => {
    router.push(`/dashboard/organisation/${selectedOrganisation?.id}`);
  };
  const handleInviteOrganisation = async () => {
    setAnchorEl(null);
    if (selectedOrganisation) {
      const response = await fetch("/api/invite/organisation", {
        method: "POST",
        body: JSON.stringify({
          organisationId: selectedOrganisation.id,
          users: selectedOrganisation.contact,
        }),
      });
      if (response.ok) {
        const res = await response.json();
        toast.success(res.message);
      }
    }
  };
  const handleSortModelChange = (sortModel: any) => {
    if (organisationData) {
      const sortedData = [...organisationData].sort((a: any, b: any) => {
        const order = sortModel[0].sort === "asc" ? 1 : -1;
        if (sortModel[0].field === "organisation") {
          if (a.name < b.name) return -1 * order;
          if (a.name > b.name) return 1 * order;
          return 0;
        } else if (sortModel[0].field === "contactPerson") {
          if (a.contact[0].name < b.contact[0].name) return -1 * order;
          if (a.contact[0].name > b.contact[0].name) return 1 * order;
          return 0;
        }
      });

      setOrganisationData(sortedData);
    }
  };
  const handleFilterModelChange = (newFilterModel: any) => {
    console.log(newFilterModel);
  };

  const columns: GridColDef[] = [
    {
      field: "organisation",
      headerName: "Organisations",
      flex: 1,
      sortable: true, // Enable sorting
      filterable: true,
      renderCell: (params: GridRenderCellParams) => (
        <Box display={"flex"} alignItems={"center"} gap={1.5}>
          {params.row.imageUrl ? (
            <img
              src={params.row.imageUrl}
              width={80}
              height={40}
              style={{
                borderRadius: "8px",
                objectFit: "contain",
              }}
              alt="Organisation"
            />
          ) : (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              bgcolor="rgba(145, 158, 171, 0.24)"
              sx={{
                width: 80,
                height: 40,
                borderRadius: "8px",
              }}
            >
              {/* Placeholder SVG */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1.7em"
                height="1.7em"
                viewBox="0 0 24 24"
              >
                <g fill="none">
                  <path
                    fill="#637381"
                    d="M16 14a5 5 0 0 1 4.995 4.783L21 19v1a2 2 0 0 1-1.85 1.995L19 22H5a2 2 0 0 1-1.995-1.85L3 20v-1a5 5 0 0 1 4.783-4.995L8 14zM12 2a5 5 0 1 1 0 10a5 5 0 0 1 0-10"
                  />
                </g>
              </svg>
            </Box>
          )}
          {params.row.name}
        </Box>
      ),
    },
    {
      field: "contactNumber",
      headerName: "Contact Number",
      flex: 1,
      sortable: false, // Enable sorting
      renderCell: (params: GridRenderCellParams) => (
        <Typography color="#555555" fontWeight={500}>
          {params.row.contact?.[0]?.phone || ""}
        </Typography>
      ),
    },
    {
      field: "contactPerson",
      headerName: "Contact Person",
      flex: 1,
      sortable: true, // Enable sorting
      renderCell: (params: GridRenderCellParams) => (
        <Typography color="#555555" fontWeight={500}>
          {params.row.contact?.[0]?.name || ""}
        </Typography>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 0.5,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => (
        <Button
          id="basic-button"
          aria-controls={open ? "basic-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={(e) => handleClick(e, params.row)}
          className="table-edit-option"
          sx={{
            background: "transparent",
            color: "#555555",
            boxShadow: "none",
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            viewBox="0 0 16 16"
          >
            <path
              fill="currentColor"
              d="M9.5 13a1.5 1.5 0 1 1-3 0a1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0a1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0a1.5 1.5 0 0 1 3 0"
            />
          </svg>
        </Button>
      ),
    },
  ];
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

  if (loading) {
    return <Loader />;
  }

  return (
    // <Paper
    //   sx={{
    //     width: "100%",
    //     overflow: "hidden",
    //     borderRadius: "14px",
    //     boxShadow: "0px 0px 16px 5px #0000001A",
    //     mt: 4,
    //   }}
    // >
    //   <TableContainer
    //     sx={{
    //       maxHeight: "72.5vh",
    //     }}
    //   >
    //     <Table stickyHeader aria-label="sticky table">
    //       <TableHead>
    //         <TableRow>
    //           <TableCell
    //             sx={{
    //               borderBottom: 0,
    //               color: "#67737F",
    //               background: "#F5F6F8",
    //               fontSize: {
    //                 md: 16,
    //                 xs: 14,
    //               },
    //               fontWeight: 600,
    //               paddingLeft: {
    //                 lg: 10,
    //                 md: 7,
    //                 xs: 4,
    //               },
    //             }}
    //           >
    //             Organisations
    //           </TableCell>
    //           <TableCell
    //             sx={{
    //               borderBottom: 0,
    //               background: "#F5F6F8",
    //               color: "#67737F",
    //               fontSize: {
    //                 md: 16,
    //                 xs: 14,
    //               },
    //               fontWeight: 600,
    //             }}
    //           >
    //             Contact Number
    //           </TableCell>
    //           <TableCell
    //             sx={{
    //               borderBottom: 0,
    //               background: "#F5F6F8",
    //               color: "#67737F",
    //               fontSize: {
    //                 md: 16,
    //                 xs: 14,
    //               },
    //               fontWeight: 600,
    //             }}
    //           >
    //             Contact Person
    //           </TableCell>
    //           <TableCell
    //             sx={{
    //               borderBottom: 0,
    //               color: "#67737F",
    //               background: "#F5F6F8",
    //               fontSize: {
    //                 md: 16,
    //                 xs: 14,
    //               },
    //               fontWeight: 600,
    //             }}
    //           ></TableCell>
    //         </TableRow>
    //       </TableHead>
    //       <TableBody>
    //         {organisationData && organisationData.length > 0 ? (
    //           organisationData?.map((organisation, i) => {
    //             return (
    //               <TableRow
    //                 key={i}
    //                 sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
    //               >
    //                 <TableCell
    //                   sx={{
    //                     borderBottomColor: "#F5F6F8",
    //                     borderBottomWidth: 2,
    //                     color: "#555555",
    //                     fontWeight: 500,
    //                     paddingLeft: {
    //                       lg: 10,
    //                       md: 7,
    //                       xs: 4,
    //                     },
    //                   }}
    //                   component="th"
    //                   scope="row"
    //                 >
    //                   <Box display={"flex"} alignItems={"center"} gap={1.5}>
    //                     {organisation?.imageUrl ? (
    //                       <Image
    //                         src={String(organisation.imageUrl)}
    //                         width={80}
    //                         height={40}
    //                         style={{
    //                           borderRadius: "8px",
    //                           objectFit: "contain",
    //                         }}
    //                         alt="img not found"
    //                       />
    //                     ) : (
    //                       <Box
    //                         display={"flex"}
    //                         justifyContent={"center"}
    //                         alignItems={"center"}
    //                         bgcolor={"rgba(145, 158, 171, 0.24)"}
    //                         sx={{
    //                           width: 80,
    //                           height: 40,
    //                           borderRadius: "8px",
    //                         }}
    //                       >
    //                         <svg
    //                           xmlns="http://www.w3.org/2000/svg"
    //                           width="1.7em"
    //                           height="1.7em"
    //                           viewBox="0 0 24 24"
    //                         >
    //                           <g fill="none">
    //                             <path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z" />
    //                             <path
    //                               fill="#637381"
    //                               d="M16 14a5 5 0 0 1 4.995 4.783L21 19v1a2 2 0 0 1-1.85 1.995L19 22H5a2 2 0 0 1-1.995-1.85L3 20v-1a5 5 0 0 1 4.783-4.995L8 14zM12 2a5 5 0 1 1 0 10a5 5 0 0 1 0-10"
    //                             />
    //                           </g>
    //                         </svg>
    //                       </Box>
    //                     )}

    //                     {organisation.name}
    //                   </Box>
    //                 </TableCell>
    //                 <TableCell
    //                   sx={{
    //                     borderBottomColor: "#F5F6F8",
    //                     borderBottomWidth: 2,
    //                     color: "#555555",
    //                     fontWeight: 500,
    //                   }}
    //                 >
    //                   {(organisation &&
    //                     organisation.contact &&
    //                     organisation.contact[0] &&
    //                     organisation.contact[0].phone) ??
    //                     ""}
    //                 </TableCell>
    //                 <TableCell
    //                   sx={{
    //                     borderBottomColor: "#F5F6F8",
    //                     borderBottomWidth: 2,
    //                     color: "#555555",
    //                     fontWeight: 500,
    //                   }}
    //                 >
    //                   {(organisation &&
    //                     organisation.contact &&
    //                     organisation.contact[0] &&
    //                     organisation.contact[0].name) ??
    //                     ""}
    //                 </TableCell>

    //                 <TableCell
    //                   align="center"
    //                   sx={{
    //                     borderBottomColor: "#F5F6F8",
    //                     borderBottomWidth: 2,
    //                     color: "#555555",
    //                     fontWeight: 500,
    //                   }}
    //                   className="cursor-pointer"
    //                   // onClick={() => handleEdit(user)}
    //                 >
    //                   <Button
    //                     id="basic-button"
    //                     aria-controls={open ? "basic-menu" : undefined}
    //                     aria-haspopup="true"
    //                     aria-expanded={open ? "true" : undefined}
    //                     onClick={(e) => handleClick(e, organisation)}
    //                     className="table-edit-option"
    //                     sx={{
    //                       background: "transparent",
    //                       color: "#555555",
    //                       boxShadow: "none",
    //                     }}
    //                   >
    //                     <svg
    //                       xmlns="http://www.w3.org/2000/svg"
    //                       width="1em"
    //                       height="1em"
    //                       viewBox="0 0 16 16"
    //                     >
    //                       <path
    //                         fill="currentColor"
    //                         d="M9.5 13a1.5 1.5 0 1 1-3 0a1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0a1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0a1.5 1.5 0 0 1 3 0"
    //                       />
    //                     </svg>
    //                   </Button>
    //                   <Menu
    //                     id="basic-menu"
    //                     className="table-edit-menu"
    //                     anchorEl={anchorEl}
    //                     open={open}
    //                     onClose={handleClose}
    //                     MenuListProps={{
    //                       "aria-labelledby": "basic-button",
    //                     }}
    //                   >
    //                     <MenuItem onClick={handleEdit}>
    //                       <Stack
    //                         display="flex"
    //                         gap={1.2}
    //                         alignItems="center"
    //                         direction="row"
    //                       >
    //                         <svg
    //                           xmlns="http://www.w3.org/2000/svg"
    //                           width="1em"
    //                           height="1em"
    //                           viewBox="0 0 24 24"
    //                         >
    //                           <path
    //                             fill="currentColor"
    //                             d="M3 21v-4.25L16.2 3.575q.3-.275.663-.425t.762-.15t.775.15t.65.45L20.425 5q.3.275.438.65T21 6.4q0 .4-.137.763t-.438.662L7.25 21zM17.6 7.8L19 6.4L17.6 5l-1.4 1.4z"
    //                           />
    //                         </svg>

    //                         <Typography variant="subtitle2">Edit</Typography>
    //                       </Stack>
    //                     </MenuItem>
    //                     <MenuItem onClick={handleInviteOrganisation}>
    //                       <Stack
    //                         display="flex"
    //                         gap={1.2}
    //                         alignItems="center"
    //                         direction="row"
    //                       >
    //                         <svg
    //                           xmlns="http://www.w3.org/2000/svg"
    //                           width="1em"
    //                           height="1em"
    //                           viewBox="0 0 24 24"
    //                         >
    //                           <path
    //                             fill="currentColor"
    //                             d="M19 17v2H7v-2s0-4 6-4s6 4 6 4m-3-9a3 3 0 1 0-3 3a3 3 0 0 0 3-3m3.2 5.06A5.6 5.6 0 0 1 21 17v2h3v-2s0-3.45-4.8-3.94M18 5a2.9 2.9 0 0 0-.89.14a5 5 0 0 1 0 5.72A2.9 2.9 0 0 0 18 11a3 3 0 0 0 0-6M8 10H5V7H3v3H0v2h3v3h2v-3h3Z"
    //                           />
    //                         </svg>

    //                         <Typography variant="subtitle2">Invite</Typography>
    //                       </Stack>
    //                     </MenuItem>
    //                   </Menu>
    //                 </TableCell>
    //               </TableRow>
    //             );
    //           })
    //         ) : (
    //           <TableRow
    //             key={"no table"}
    //             sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
    //           >
    //             No Data Found
    //           </TableRow>
    //         )}
    //       </TableBody>
    //     </Table>
    //   </TableContainer>
    // </Paper>
    <Paper
      sx={{
        width: "100%",
        overflow: "hidden",
        borderRadius: "14px",
        boxShadow: "0px 0px 16px 5px #0000001A",
        mt: 4,
      }}
    >
      <Box sx={{ height: "72.5vh", width: "100%" }}>
        <DataGrid
          rows={organisationData}
          columns={columns}
          pageSize={5} // Show only 5 rows
          rowsPerPageOptions={[5, 10, 15]} // Limit rows per page to just 5, no other options
          // pageSizeOptions={[5]} // This will allow user to select 5 per page but no more options will be visible
          getRowId={(row) => row.id}
          onSortModelChange={handleSortModelChange} // Handle sorting
          onFilterModelChange={handleFilterModelChange} // Handle filtering
          disableColumnFilter={false}
        />
      </Box>

      <Menu
        id="basic-menu"
        className="table-edit-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem onClick={handleEdit}>
          <Stack display="flex" gap={1.2} alignItems="center" direction="row">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="1em"
              height="1em"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="M3 21v-4.25L16.2 3.575q.3-.275.663-.425t.762-.15t.775.15t.65.45L20.425 5q.3.275.438.65T21 6.4q0 .4-.137.763t-.438.662L7.25 21zM17.6 7.8L19 6.4L17.6 5l-1.4 1.4z"
              />
            </svg>

            <Typography variant="subtitle2">Edit</Typography>
          </Stack>
        </MenuItem>
        <MenuItem onClick={handleInviteOrganisation}>
          <Stack display="flex" gap={1.2} alignItems="center" direction="row">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="1em"
              height="1em"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="M19 17v2H7v-2s0-4 6-4s6 4 6 4m-3-9a3 3 0 1 0-3 3a3 3 0 0 0 3-3m3.2 5.06A5.6 5.6 0 0 1 21 17v2h3v-2s0-3.45-4.8-3.94M18 5a2.9 2.9 0 0 0-.89.14a5 5 0 0 1 0 5.72A2.9 2.9 0 0 0 18 11a3 3 0 0 0 0-6M8 10H5V7H3v3H0v2h3v3h2v-3h3Z"
              />
            </svg>

            <Typography variant="subtitle2">Invite</Typography>
          </Stack>
        </MenuItem>
      </Menu>
    </Paper>
  );
}
