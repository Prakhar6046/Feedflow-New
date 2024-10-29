"use client";
import { feedAction } from "@/lib/features/feed/feedSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  Box,
  Button,
  Divider,
  Menu,
  MenuItem,
  Modal,
  Stack,
  TableSortLabel,
  TextField,
  Typography,
} from "@mui/material";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

import { selectRole, userAction } from "@/lib/features/user/userSlice";
import {
  feedSupplyTableHead,
  feedSupplyTableHeadMember,
} from "@/app/_lib/utils/tableHeadData";
import { breadcrumsAction } from "@/lib/features/breadcrum/breadcrumSlice";
import { getCookie } from "cookies-next";
import BasicBreadcrumbs from "@/app/_components/Breadcrumbs";
import { FeedSupply } from "@/app/_components/feedSupply/FeedSelection";
import CalculateVolume from "@/app/_components/models/FarmManager";
import TransferModal from "@/app/_components/models/FarmManager";
import HarvestModal from "@/app/_components/models/Harvest";
import MortalityModal from "@/app/_components/models/Mortality";

interface Props {
  feeds: FeedSupply[];
}

export default function FarmManager({ feeds }: Props) {
  const FarmManagerTable = [
    {
      id: "Farm",
      numeric: false,
      disablePadding: true,
      label: "Farm",
    },
    {
      id: "Unit",
      numeric: false,
      disablePadding: true,
      label: "Unit",
    },
    {
      id: "Current Batch",
      numeric: false,
      disablePadding: true,
      label: "Current Batch",
    },
    {
      id: "Biomass",
      numeric: true,
      disablePadding: true,
      label: "Biomass",
    },
    {
      id: "Count",
      numeric: true,
      disablePadding: true,
      label: "Count",
    },
    {
      id: "Mean weight",
      numeric: false,
      disablePadding: true,
      label: "Mean weight",
    },
    {
      id: "% Stocked",
      numeric: false,
      disablePadding: true,
      label: "% Stocked",
    },

    {
      id: "action",
      numeric: false,
      disablePadding: true,
      label: "Actions",
    },
  ];
  const router = useRouter();
  const dispatch = useAppDispatch();
  const pathName = usePathname();
  const sortDataFromLocal = getCookie(pathName);
  //   const loading = useAppSelector(selectFarmLoading);
  const [feedsData, setFeedsData] = useState<any>();
  const [selectedFeed, setSelectedFeed] = useState<any>(null);
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );
  const [openTransferModal, setOpenTransferModal] = useState<boolean>(false);
  const role = useAppSelector(selectRole);
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("productName");
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

  useEffect(() => {
    router.refresh();
  }, [router]);
  function EnhancedTableHead(data: any) {
    const { order, orderBy, onRequestSort } = data;
    const createSortHandler =
      (property: string) => (event: React.MouseEvent<HTMLButtonElement>) => {
        onRequestSort(event, property);
      };

    return (
      <TableHead>
        <TableRow>
          {(role !== "MEMBER" ? FarmManagerTable : FarmManagerTable).map(
            (headCell, idx, headCells) => (
              <TableCell
                key={headCell.id}
                sortDirection={
                  idx === headCells.length - 1
                    ? false
                    : orderBy === headCell.id
                    ? order
                    : false
                }
                // align="center"
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
                    lg: idx === 0 ? 10 : 0,
                    md: idx === 0 ? 7 : 0,
                    xs: idx === 0 ? 4 : 0,
                  },
                }}
              >
                {idx === headCells.length - 1 ? (
                  headCell.label
                ) : (
                  <TableSortLabel
                    active={orderBy === headCell.id}
                    direction={orderBy === headCell.id ? order : "asc"}
                    onClick={createSortHandler(headCell.id)}
                  >
                    {headCell.label}
                  </TableSortLabel>
                )}
              </TableCell>
            )
          )}
        </TableRow>
      </TableHead>
    );
  }

  const handleRequestSort = (
    _: React.MouseEvent<HTMLButtonElement> | null,
    property: string
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
    dispatch(
      breadcrumsAction.handleSort({
        direction: isAsc ? "desc" : "asc",
        column: property,
      })
    );

    if (feeds) {
      const sortedData = [...feeds].sort((feed1: any, feed2: any) => {
        const orderType = order === "asc" ? 1 : -1;
        if (property === "productName") {
          if (feed1.productName < feed2.productName) return -1 * orderType;
          if (feed1.productName > feed2.productName) return 1 * orderType;
        } else if (property === "productCode") {
          if (feed1.productCode < feed2.productCode) return -1 * orderType;
          if (feed1.productCode > feed2.productCode) return 1 * orderType;
        } else if (property === "productionIntensity") {
          if (feed1.productionIntensity < feed2.productionIntensity)
            return -1 * orderType;
          if (feed1.productionIntensity > feed2.productionIntensity)
            return 1 * orderType;
        } else if (property === "feedingPhase") {
          if (feed1.feedingPhase < feed2.feedingPhase) return -1 * orderType;
          if (feed1.feedingPhase > feed2.feedingPhase) return 1 * orderType;
        }
        return 0;
      });
      setFeedsData(sortedData);
    }
  };
  useEffect(() => {
    if (pathName === "/dashboard/feedSupply") {
      dispatch(feedAction.resetState());
    }
  }, [pathName]);
  useEffect(() => {
    if (feeds && !sortDataFromLocal) {
      setFeedsData(feeds);
    }
  }, [feeds]);
  useEffect(() => {
    if (sortDataFromLocal) {
      const data = JSON.parse(sortDataFromLocal);
      setOrder(data.direction);
      setOrderBy(data.column);
      // handleRequestSort(null, data.column);
      if (feeds) {
        const sortedData = [...feeds].sort((feed1: any, feed2: any) => {
          const orderType = data.direction === "asc" ? -1 : 1;
          if (data.column === "productName") {
            if (feed1.productName < feed2.productName) return -1 * orderType;
            if (feed1.productName > feed2.productName) return 1 * orderType;
          } else if (data.column === "productCode") {
            if (feed1.productCode < feed2.productCode) return -1 * orderType;
            if (feed1.productCode > feed2.productCode) return 1 * orderType;
          } else if (data.column === "productionIntensity") {
            if (feed1.productionIntensity < feed2.productionIntensity)
              return -1 * orderType;
            if (feed1.productionIntensity > feed2.productionIntensity)
              return 1 * orderType;
          } else if (data.column === "feedingPhase") {
            if (feed1.feedingPhase < feed2.feedingPhase) return -1 * orderType;
            if (feed1.feedingPhase > feed2.feedingPhase) return 1 * orderType;
          }
          return 0;
        });
        setFeedsData(sortedData);
      }
    }
  }, [sortDataFromLocal]);
  //   if (loading) {
  //     return <Loader />;
  //   }
  return (
    <>
      <BasicBreadcrumbs
        heading={"Farm Manager"}
        isTable={true}
        buttonRoute="/dashboard/Farm Manager/new"
        links={[
          { name: "Dashboard", link: "/dashboard" },
          { name: "Farm", link: "/dashboard/feedSupply" },
        ]}
      />
      <Paper
        sx={{
          width: "100%",
          overflow: "hidden",
          borderRadius: "14px",
          boxShadow: "0px 0px 16px 5px #0000001A",
          mt: 4,
        }}
      >
        <TableContainer
          sx={{
            maxHeight: "72.5vh",
          }}
        >
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {/* {tableData.map((field, i) => {
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
                })} */}
              </TableRow>
            </TableHead>
            <EnhancedTableHead
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
            />
            <TableBody>
              {feedsData && feedsData?.length > 0 ? (
                feedsData.map((feed: FeedSupply, i: number) => {
                  return (
                    <TableRow
                      key={i}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell
                        // align="center"
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
                        // align="center"
                        sx={{
                          borderBottomColor: "#F5F6F8",
                          borderBottomWidth: 2,
                          color: "#555555",
                          fontWeight: 500,
                          pl: 0,
                        }}
                      >
                        {feed.productCode ?? ""}
                      </TableCell>
                      <TableCell
                        // align="center"
                        sx={{
                          borderBottomColor: "#F5F6F8",
                          borderBottomWidth: 2,
                          color: "#555555",
                          fontWeight: 500,
                          pl: 0,
                        }}
                      >
                        {feed.productionIntensity ?? ""}
                      </TableCell>
                      <TableCell
                        // align="center"
                        sx={{
                          borderBottomColor: "#F5F6F8",
                          borderBottomWidth: 2,
                          color: "#555555",
                          fontWeight: 500,
                          pl: 0,
                        }}
                      >
                        {feed.feedingPhase ?? ""}
                      </TableCell>
                      <TableCell
                        // align="center"
                        sx={{
                          borderBottomColor: "#F5F6F8",
                          borderBottomWidth: 2,
                          color: "#555555",
                          fontWeight: 500,
                          pl: 0,
                        }}
                      >
                        {feed.specie ?? ""}
                      </TableCell>
                      {role !== "MEMBER" && (
                        <TableCell
                          // align="center"
                          sx={{
                            borderBottomColor: "#F5F6F8",
                            borderBottomWidth: 2,
                            color: "#555555",
                            fontWeight: 500,
                          }}
                          className="cursor-pointer"
                          // onClick={() => handleEdit(user)}
                        ></TableCell>
                      )}
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell
                    sx={{
                      borderBottomColor: "#F5F6F8",
                      borderBottomWidth: 2,
                      color: "#555555",
                      fontWeight: 500,
                      pl: 0,
                    }}
                  ></TableCell>
                  <TableCell
                    sx={{
                      borderBottomColor: "#F5F6F8",
                      borderBottomWidth: 2,
                      color: "#555555",
                      fontWeight: 500,
                      pl: 0,
                    }}
                  ></TableCell>
                  <TableCell
                    sx={{
                      borderBottomColor: "#F5F6F8",
                      borderBottomWidth: 2,
                      color: "#555555",
                      fontWeight: 500,
                      pl: 0,
                    }}
                  ></TableCell>
                  <TableCell
                    sx={{
                      borderBottomColor: "#F5F6F8",
                      borderBottomWidth: 2,
                      color: "#555555",
                      fontWeight: 500,
                      pl: 0,
                    }}
                  ></TableCell>
                  <TableCell
                    sx={{
                      borderBottomColor: "#F5F6F8",
                      borderBottomWidth: 2,
                      color: "#555555",
                      fontWeight: 500,
                      pl: 0,
                    }}
                  ></TableCell>
                  <TableCell
                    sx={{
                      borderBottomColor: "#F5F6F8",
                      borderBottomWidth: 2,
                      color: "#555555",
                      fontWeight: 500,
                      pl: 0,
                    }}
                  ></TableCell>
                  <TableCell
                    sx={{
                      borderBottomColor: "#F5F6F8",
                      borderBottomWidth: 2,
                      color: "#555555",
                      fontWeight: 500,
                      pl: 0,
                    }}
                  ></TableCell>

                  {role !== "MEMBER" && (
                    <TableCell
                      // align="center"
                      sx={{
                        borderBottomColor: "#F5F6F8",
                        borderBottomWidth: 2,
                        color: "#555555",
                        fontWeight: 500,
                      }}
                      className="cursor-pointer"
                      //   onClick={() => handleEdit(user)}
                    >
                      <Button
                        id="basic-button"
                        aria-controls={open ? "basic-menu" : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? "true" : undefined}
                        onClick={(e) => handleClick(e, userAction)}
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
                        className="table-edit-menu-item"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        MenuListProps={{
                          "aria-labelledby": "basic-button",
                        }}
                      >
                        <MenuItem onClick={() => setOpenTransferModal(true)}>
                          <Stack
                            display="flex"
                            gap={1.2}
                            alignItems="center"
                            direction="row"
                          >
                            <Typography variant="subtitle2">
                              Transfers
                            </Typography>
                          </Stack>
                        </MenuItem>
                        <MenuItem>
                          <Stack
                            display="flex"
                            gap={1.2}
                            alignItems="center"
                            direction="row"
                          >
                            <Typography variant="subtitle2">Harvest</Typography>
                          </Stack>
                        </MenuItem>

                        <MenuItem>
                          <Stack
                            display="flex"
                            gap={1.2}
                            alignItems="center"
                            direction="row"
                          >
                            <Typography variant="subtitle2">
                              Mortality
                            </Typography>
                          </Stack>
                        </MenuItem>
                      </Menu>
                    </TableCell>
                  )}
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      {/* 
      <TransferModal open={openTransferModal} setOpen={setOpenTransferModal} /> */}
      {/* <HarvestModal open={openTransferModal} setOpen={setOpenTransferModal} /> */}
      <MortalityModal open={openTransferModal} setOpen={setOpenTransferModal} />
    </>
  );
}
