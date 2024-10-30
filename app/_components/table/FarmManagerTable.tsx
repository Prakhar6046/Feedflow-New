"use client";
import { feedAction } from "@/lib/features/feed/feedSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  Button,
  Divider,
  Menu,
  MenuItem,
  Stack,
  TableSortLabel,
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

import TransferModal from "@/app/_components/models/FarmManager";
import HarvestModal from "@/app/_components/models/Harvest";
import MortalityModal from "@/app/_components/models/Mortality";
import { breadcrumsAction } from "@/lib/features/breadcrum/breadcrumSlice";
import { selectRole, userAction } from "@/lib/features/user/userSlice";
import { getCookie } from "cookies-next";
import { FarmManager } from "@/app/_typeModels/farmManager";
import CombineTanks from "../models/CombineTanks";
import { Farm } from "@/app/_typeModels/Farm";
interface Props {
  farmManagers: FarmManager[];
  tableData: any;
  farms: Farm[];
}
export default function FarmManagerTable({
  farmManagers,
  tableData,
  farms,
}: Props) {
  console.log(farmManagers);

  const router = useRouter();
  const dispatch = useAppDispatch();
  const pathName = usePathname();
  const sortDataFromLocal = getCookie(pathName);
  //   const loading = useAppSelector(selectFarmLoading);
  const [feedsData, setFeedsData] = useState<any>();
  const [selectedFarmManager, setSelectedFarmManager] = useState<any>(null);
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );
  const [openTransferModal, setOpenTransferModal] = useState<boolean>(false);
  const [openHarvestModal, setOpenHarvestModal] = useState<boolean>(false);
  const [openMoralityModal, setOpenMoralityModal] = useState<boolean>(false);
  const [openCombineTankModal, setOpenCombineTankModal] =
    useState<boolean>(false);

  const role = useAppSelector(selectRole);
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("productName");
  const handleClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    farm: any
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedFarmManager(farm);
  };
  // const handleEdit = () => {
  //   if (selectedFeed) {
  //     router.push(`/dashboard/feedSupply/${selectedFeed.id}`);
  //     dispatch(feedAction.editFeed(selectedFeed));
  //   }
  // };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);

  function EnhancedTableHead(data: any) {
    const { order, orderBy, onRequestSort } = data;
    const createSortHandler =
      (property: string) => (event: React.MouseEvent<HTMLButtonElement>) => {
        onRequestSort(event, property);
      };

    return (
      <TableHead>
        <TableRow>
          {tableData.map((headCell: any, idx: number, headCells: any) => (
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
          ))}
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

    // if (feeds) {
    //   const sortedData = [...feeds].sort((feed1: any, feed2: any) => {
    //     const orderType = order === "asc" ? 1 : -1;
    //     if (property === "productName") {
    //       if (feed1.productName < feed2.productName) return -1 * orderType;
    //       if (feed1.productName > feed2.productName) return 1 * orderType;
    //     } else if (property === "productCode") {
    //       if (feed1.productCode < feed2.productCode) return -1 * orderType;
    //       if (feed1.productCode > feed2.productCode) return 1 * orderType;
    //     } else if (property === "productionIntensity") {
    //       if (feed1.productionIntensity < feed2.productionIntensity)
    //         return -1 * orderType;
    //       if (feed1.productionIntensity > feed2.productionIntensity)
    //         return 1 * orderType;
    //     } else if (property === "feedingPhase") {
    //       if (feed1.feedingPhase < feed2.feedingPhase) return -1 * orderType;
    //       if (feed1.feedingPhase > feed2.feedingPhase) return 1 * orderType;
    //     }
    //     return 0;
    //   });
    //   setFeedsData(sortedData);
    // }
  };

  // useEffect(() => {
  //   if (feeds && !sortDataFromLocal) {
  //     setFeedsData(feeds);
  //   }
  // }, [feeds]);
  // useEffect(() => {
  //   if (sortDataFromLocal) {
  //     const data = JSON.parse(sortDataFromLocal);
  //     setOrder(data.direction);
  //     setOrderBy(data.column);
  //     // handleRequestSort(null, data.column);
  //     if (feeds) {
  //       const sortedData = [...feeds].sort((feed1: any, feed2: any) => {
  //         const orderType = data.direction === "asc" ? -1 : 1;
  //         if (data.column === "productName") {
  //           if (feed1.productName < feed2.productName) return -1 * orderType;
  //           if (feed1.productName > feed2.productName) return 1 * orderType;
  //         } else if (data.column === "productCode") {
  //           if (feed1.productCode < feed2.productCode) return -1 * orderType;
  //           if (feed1.productCode > feed2.productCode) return 1 * orderType;
  //         } else if (data.column === "productionIntensity") {
  //           if (feed1.productionIntensity < feed2.productionIntensity)
  //             return -1 * orderType;
  //           if (feed1.productionIntensity > feed2.productionIntensity)
  //             return 1 * orderType;
  //         } else if (data.column === "feedingPhase") {
  //           if (feed1.feedingPhase < feed2.feedingPhase) return -1 * orderType;
  //           if (feed1.feedingPhase > feed2.feedingPhase) return 1 * orderType;
  //         }
  //         return 0;
  //       });
  //       setFeedsData(sortedData);
  //     }
  //   }
  // }, [sortDataFromLocal]);
  useEffect(() => {
    router.refresh();
  }, [router]);
  return (
    <>
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
              <TableRow></TableRow>
            </TableHead>
            <EnhancedTableHead
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
            />
            <TableBody>
              {farmManagers && farmManagers?.length > 0 ? (
                farmManagers.map((farm: FarmManager, i: number) => {
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
                        {farm.farm.name ?? ""}
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
                        {farm.farm.name ?? ""}
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
                        {farm.currentBatch ?? ""}
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
                        {farm.biomass ? `${farm.biomass}Kg` : ""}
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
                        {farm.count ?? ""}
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
                        {farm.meanWeight ? `${farm.meanWeight}g` : ""}
                      </TableCell>{" "}
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
                        {farm.stocked ? `${farm.stocked}%` : ""}
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
                        >
                          <Button
                            id="basic-button"
                            aria-controls={open ? "basic-menu" : undefined}
                            aria-haspopup="true"
                            aria-expanded={open ? "true" : undefined}
                            onClick={(e) => handleClick(e, farm)}
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
                            <MenuItem
                              onClick={() => {
                                setOpenTransferModal(true), handleClose();
                              }}
                            >
                              <Stack
                                display="flex"
                                gap={1.2}
                                alignItems="center"
                                direction="row"
                              >
                                {/* <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="1em"
                                        height="1em"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          fill="currentColor"
                                          d="M3 21v-4.25L16.2 3.575q.3-.275.663-.425t.762-.15t.775.15t.65.45L20.425 5q.3.275.438.65T21 6.4q0 .4-.137.763t-.438.662L7.25 21zM17.6 7.8L19 6.4L17.6 5l-1.4 1.4z"
                                        />
                                      </svg> */}

                                <Typography variant="subtitle2">
                                  Transfer
                                </Typography>
                              </Stack>
                            </MenuItem>

                            <Divider
                              sx={{
                                borderColor: "#9797971A",
                                my: 0.5,
                              }}
                            />
                            <MenuItem
                              onClick={() => {
                                setOpenHarvestModal(true), handleClose();
                              }}
                            >
                              <Stack
                                display="flex"
                                gap={1.2}
                                alignItems="center"
                                direction="row"
                              >
                                {/* <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="1em"
                                        height="1em"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          fill="currentColor"
                                          d="M19 17v2H7v-2s0-4 6-4s6 4 6 4m-3-9a3 3 0 1 0-3 3a3 3 0 0 0 3-3m3.2 5.06A5.6 5.6 0 0 1 21 17v2h3v-2s0-3.45-4.8-3.94M18 5a2.9 2.9 0 0 0-.89.14a5 5 0 0 1 0 5.72A2.9 2.9 0 0 0 18 11a3 3 0 0 0 0-6M8 10H5V7H3v3H0v2h3v3h2v-3h3Z"
                                        />
                                      </svg> */}
                                <Typography variant="subtitle2">
                                  Harvest
                                </Typography>
                              </Stack>
                            </MenuItem>

                            <Divider
                              sx={{
                                borderColor: "#9797971A",
                                my: 0.5,
                              }}
                            />
                            <MenuItem
                              onClick={() => {
                                setOpenMoralityModal(true), handleClose();
                              }}
                            >
                              <Stack
                                display="flex"
                                gap={1.2}
                                alignItems="center"
                                direction="row"
                              >
                                {/* <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="1em"
                                        height="1em"
                                        viewBox="0 0 24 24"
                                      >
                                        <g fill="none">
                                          <path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"></path>
                                          <path
                                            fill="#ff0000"
                                            d="M14.28 2a2 2 0 0 1 1.897 1.368L16.72 5H20a1 1 0 1 1 0 2l-.003.071l-.867 12.143A3 3 0 0 1 16.138 22H7.862a3 3 0 0 1-2.992-2.786L4.003 7.07L4 7a1 1 0 0 1 0-2h3.28l.543-1.632A2 2 0 0 1 9.721 2zm3.717 5H6.003l.862 12.071a1 1 0 0 0 .997.929h8.276a1 1 0 0 0 .997-.929zM10 10a1 1 0 0 1 .993.883L11 11v5a1 1 0 0 1-1.993.117L9 16v-5a1 1 0 0 1 1-1m4 0a1 1 0 0 1 1 1v5a1 1 0 1 1-2 0v-5a1 1 0 0 1 1-1m.28-6H9.72l-.333 1h5.226z"
                                          ></path>
                                        </g>
                                      </svg> */}

                                <Typography variant="subtitle2">
                                  Mortality
                                </Typography>
                              </Stack>
                            </MenuItem>
                          </Menu>
                        </TableCell>
                      )}
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>No Data Found</TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <TransferModal
        open={openTransferModal}
        setOpen={setOpenTransferModal}
        selectedFarmManager={selectedFarmManager}
        farms={farms}
      />
      <HarvestModal open={openHarvestModal} setOpen={setOpenHarvestModal} />
      <MortalityModal open={openMoralityModal} setOpen={setOpenMoralityModal} />
      <CombineTanks
        open={openCombineTankModal}
        setOpen={setOpenCombineTankModal}
      />
    </>
  );
}
