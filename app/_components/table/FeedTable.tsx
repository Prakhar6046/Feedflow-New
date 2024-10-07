"use client";
import {
  farmAction,
  selectFarmLoading,
  selectFarms,
} from "@/lib/features/farm/farmSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  Box,
  Button,
  Divider,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from "@mui/material";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Loader from "../Loader";
import { FeedSupply } from "../feedSupply/FeedSelection";
import { feedAction } from "@/lib/features/feed/feedSlice";
import { DataGrid, GridRenderCellParams } from "@mui/x-data-grid";
interface Props {
  feeds: FeedSupply[];
}
const tableData: Array<string> = [
  "Product Name",
  "Product Code",
  "Production Intensity",
  "Feeding Phase",
  "Specie",
  "",
];
export default function FeedTable({ feeds }: Props) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  //   const loading = useAppSelector(selectFarmLoading);
  const [feedsData, setFeedsData] = useState<any>();
  const [selectedFeed, setSelectedFeed] = useState<any>(null);
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );

  const handleClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    farm: any
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedFeed(farm);
  };
  const handleEdit = () => {
    if (selectedFeed) {
      router.push(`/dashboard/feedSupply/${selectedFeed.id}`);
      dispatch(feedAction.editFeed(selectedFeed));
    }
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  const columns = [
    {
      field: "productName",
      headerName: "Product Name",
      flex: 1,
      sortable: true,
      renderCell: (params: GridRenderCellParams) => (
        <Box display={"flex"} alignItems={"center"} justifyContent={"center"}>
          {params.row.productName ?? ""}
        </Box>
      ),
    },
    {
      field: "productCode",
      headerName: "Product Code",
      flex: 1,
      sortable: true,
      renderCell: (params: GridRenderCellParams) => (
        <Box display={"flex"} alignItems={"center"} justifyContent={"center"}>
          {params.row.productCode ?? ""}
        </Box>
      ),
    },
    {
      field: "productionIntensity",
      headerName: "Production Intensity",
      flex: 1,
      sortable: true,
      renderCell: (params: GridRenderCellParams) => (
        <Box display={"flex"} alignItems={"center"} justifyContent={"center"}>
          {params.row.productionIntensity ?? ""}
        </Box>
      ),
    },
    {
      field: "feedingPhase",
      headerName: "Feeding Phase",
      flex: 1,
      sortable: true,
      renderCell: (params: GridRenderCellParams) => (
        <Box display={"flex"} alignItems={"center"} justifyContent={"center"}>
          {params.row.feedingPhase ?? ""}
        </Box>
      ),
    },
    {
      field: "specie",
      headerName: "Specie",
      flex: 1,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => (
        <Box display={"flex"} alignItems={"center"} justifyContent={"center"}>
          {params.row.specie ?? ""}
        </Box>
      ),
    },
    {
      field: "actions",
      headerName: "",
      flex: 1,
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

  useEffect(() => {
    if (feeds) {
      setFeedsData(feeds);
    }
  }, [feeds]);
  //   if (loading) {
  //     return <Loader />;
  //   }
  return (
    <Paper
      sx={{
        width: "100%",
        overflow: "hidden",
        borderRadius: "14px",
        boxShadow: "0px 0px 16px 5px #0000001A",
        mt: 4,
      }}
    >
      {/* <TableContainer
        sx={{
          maxHeight: "72.5vh",
        }}
      >
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {tableData.map((field, i) => {
                return (
                  <TableCell
                    align="center"
                    key={i}
                    sx={{
                      borderBottom: 0,
                      color: "#67737F",
                      background: "#F5F6F8",
                      fontSize: {
                        md: 16,
                        xs: 14,
                      },
                      fontWeight: 600,
                      paddingLeft: {
                        lg: 10,
                        md: 7,
                        xs: 4,
                      },
                    }}
                  >
                    {field}
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {feeds && feeds?.length > 0 ? (
              feeds.map((feed: FeedSupply, i: number) => {
                return (
                  <TableRow
                    key={i}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell
                      align="center"
                      sx={{
                        borderBottomColor: "#F5F6F8",
                        borderBottomWidth: 2,
                        color: "#555555",
                        fontWeight: 500,
                        paddingLeft: {
                          lg: 10,
                          md: 7,
                          xs: 4,
                        },
                      }}
                      component="th"
                      scope="row"
                    >
                      {feed.productName ?? ""}
                    </TableCell>

                    <TableCell
                      align="center"
                      sx={{
                        borderBottomColor: "#F5F6F8",
                        borderBottomWidth: 2,
                        color: "#555555",
                        fontWeight: 500,
                      }}
                    >
                      {feed.productCode ?? ""}
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        borderBottomColor: "#F5F6F8",
                        borderBottomWidth: 2,
                        color: "#555555",
                        fontWeight: 500,
                      }}
                    >
                      {feed.productionIntensity ?? ""}
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        borderBottomColor: "#F5F6F8",
                        borderBottomWidth: 2,
                        color: "#555555",
                        fontWeight: 500,
                      }}
                    >
                      {feed.feedingPhase ?? ""}
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        borderBottomColor: "#F5F6F8",
                        borderBottomWidth: 2,
                        color: "#555555",
                        fontWeight: 500,
                      }}
                    >
                      {feed.specie ?? ""}
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        borderBottomColor: "#F5F6F8",
                        borderBottomWidth: 2,
                        color: "#555555",
                        fontWeight: 500,
                      }}
                      className="cursor-pointer"
                      // onClick={() => handleEdit(user)}
                    >
                      <Button
                        id="basic-button"
                        aria-controls={open ? "basic-menu" : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? "true" : undefined}
                        onClick={(e) => handleClick(e, feed)}
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
                          <Stack
                            display="flex"
                            gap={1.2}
                            alignItems="center"
                            direction="row"
                          >
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
                      </Menu>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow
                key={"no table"}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                No Data Found
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer> */}
      <Box sx={{ height: "72.5vh", width: "100%" }}>
        <DataGrid
          rows={feedsData}
          columns={columns}
          // onSortModelChange={handleSortModelChange}
          hideFooterPagination={true}
        />
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
        </Menu>
      </Box>
    </Paper>
  );
}
