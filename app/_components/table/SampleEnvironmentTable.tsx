"use client";
import TransferModal from "@/app/_components/models/FarmManager";
import { Farm } from "@/app/_typeModels/Farm";
import { Production } from "@/app/_typeModels/production";
import { SampleEnvironment } from "@/app/_typeModels/sample";
import { breadcrumsAction } from "@/lib/features/breadcrum/breadcrumSlice";
import { selectRole } from "@/lib/features/user/userSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  Button,
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
import { getCookie } from "cookies-next";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import SamplingEnvironmentCal from "../models/SamplingEnvironmentCal";
interface Props {
  tableData: any;
  farms?: Farm[];
  sampleEnvironment: SampleEnvironment[];
}
export default function SampleEnvironmentTable({
  tableData,
  farms,
  sampleEnvironment,
}: Props) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const pathName = usePathname();
  // const sortDataFromLocal = "";
  //   const loading = useAppSelector(selectFarmLoading);
  const [selectedProduction, setSelectedProduction] = useState<any>(null);
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );
  const [openSamplingEnvironmentCalModal, setOpenSamplingEnvironmentCalModal] =
    useState<boolean>(false);
  const [productionData, setProductionData] = useState<Production[]>();
  const role = useAppSelector(selectRole);
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("Farm");
  const [sortDataFromLocal, setSortDataFromLocal] = React.useState<any>("");

  useEffect(() => {
    if (pathName && window) {
      setSortDataFromLocal(window.localStorage.getItem(pathName));
    }
  }, [pathName, window]);
  const handleClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    farm: any
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedProduction(farm);
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
      <TableHead className="prod-action">
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

  // const handleRequestSort = (
  //   _: React.MouseEvent<HTMLButtonElement> | null,
  //   property: string
  // ) => {
  //   const isAsc = orderBy === property && order === "asc";
  //   console.log(property);
  //   setOrder(isAsc ? "desc" : "asc");
  //   setOrderBy(property);
  //   dispatch(
  //     breadcrumsAction.handleSort({
  //       direction: isAsc ? "desc" : "asc",
  //       column: property,
  //     })
  //   );

  //   if (productions) {
  //     const sortedData = [...productions].sort(
  //       (production1: Production, production2: Production) => {
  //         const orderType = order === "asc" ? 1 : -1;
  //         if (property === "Farm") {
  //           if (production1.farm.name < production2.farm.name)
  //             return -1 * orderType;
  //           if (production1.farm.name > production2.farm.name)
  //             return 1 * orderType;
  //         } else if (property === "Producton unit") {
  //           if (
  //             production1.productionUnit.name < production2.productionUnit.name
  //           )
  //             return -1 * orderType;
  //           if (
  //             production1.productionUnit.name > production2.productionUnit.name
  //           )
  //             return 1 * orderType;
  //         } else if (property === "Batch number") {
  //           if (
  //             production1.fishSupply?.batchNumber <
  //             production2.fishSupply?.batchNumber
  //           )
  //             return -1 * orderType;
  //           if (
  //             production1.fishSupply?.batchNumber >
  //             production2.fishSupply?.batchNumber
  //           )
  //             return 1 * orderType;
  //         } else if (property === "Age (days|months)") {
  //           if (production1.fishSupply?.age < production2.fishSupply?.age)
  //             return -1 * orderType;
  //           if (production1.fishSupply?.age > production2.fishSupply?.age)
  //             return 1 * orderType;
  //         } else if (property === "Fish Count") {
  //           if (production1.fishCount < production2.fishCount)
  //             return -1 * orderType;
  //           if (production1.fishCount > production2.fishCount)
  //             return 1 * orderType;
  //         } else if (property === "Biomass") {
  //           if (production1.biomass < production2.biomass)
  //             return -1 * orderType;
  //           if (production1.biomass > production2.biomass) return 1 * orderType;
  //         } else if (property === "Mean weight") {
  //           if (production1.meanWeight < production2.meanWeight)
  //             return -1 * orderType;
  //           if (production1.meanWeight > production2.meanWeight)
  //             return 1 * orderType;
  //         } else if (property === "Mean length") {
  //           if (production1.meanLength < production2.meanLength)
  //             return -1 * orderType;
  //           if (production1.meanLength > production2.meanLength)
  //             return 1 * orderType;
  //         } else if (property === "Stocking Density") {
  //           if (production1.stockingDensityKG < production2.stockingDensityKG)
  //             return -1 * orderType;
  //           if (production1.stockingDensityKG > production2.stockingDensityKG)
  //             return 1 * orderType;
  //         } else if (property === "Stocking density") {
  //           if (production1.stockingDensityNM < production2.stockingDensityNM)
  //             return -1 * orderType;
  //           if (production1.stockingDensityNM > production2.stockingDensityNM)
  //             return 1 * orderType;
  //         } else if (property === "Stocking level") {
  //           if (production1.stockingLevel < production2.stockingLevel)
  //             return -1 * orderType;
  //           if (production1.stockingLevel > production2.stockingLevel)
  //             return 1 * orderType;
  //         }
  //         return 0;
  //       }
  //     );
  //     setProductionData(sortedData);
  //   }
  // };

  // useEffect(() => {
  //   if (sortDataFromLocal) {
  //     const data = JSON.parse(sortDataFromLocal);
  //     setOrder(data.direction);
  //     setOrderBy(data.column);
  //     // handleRequestSort(null, data.column);
  //     if (productions) {
  //       const sortedData = [...productions].sort(
  //         (production1: any, production2: any) => {
  //           const orderType = data.direction === "asc" ? -1 : 1;
  //           if (data.column === "Farm") {
  //             if (production1.farm.name < production2.farm.name)
  //               return -1 * orderType;
  //             if (production1.farm.name > production2.farm.name)
  //               return 1 * orderType;
  //           } else if (data.column === "Producton unit") {
  //             if (
  //               production1.productionUnit.name <
  //               production2.productionUnit.name
  //             )
  //               return -1 * orderType;
  //             if (
  //               production1.productionUnit.name >
  //               production2.productionUnit.name
  //             )
  //               return 1 * orderType;
  //           } else if (data.column === "Batch number") {
  //             if (
  //               production1.fishSupply?.batchNumber <
  //               production2.fishSupply?.batchNumber
  //             )
  //               return -1 * orderType;
  //             if (
  //               production1.fishSupply?.batchNumber >
  //               production2.fishSupply?.batchNumber
  //             )
  //               return 1 * orderType;
  //           } else if (data.column === "Age (days|months)") {
  //             if (production1.fishSupply?.age < production2.fishSupply?.age)
  //               return -1 * orderType;
  //             if (production1.fishSupply?.age > production2.fishSupply?.age)
  //               return 1 * orderType;
  //           } else if (data.column === "Fish Count") {
  //             if (production1.fishCount < production2.fishCount)
  //               return -1 * orderType;
  //             if (production1.fishCount > production2.fishCount)
  //               return 1 * orderType;
  //           } else if (data.column === "Biomass") {
  //             if (production1.biomass < production2.biomass)
  //               return -1 * orderType;
  //             if (production1.biomass > production2.biomass)
  //               return 1 * orderType;
  //           } else if (data.column === "Mean weight") {
  //             if (production1.meanWeight < production2.meanWeight)
  //               return -1 * orderType;
  //             if (production1.meanWeight > production2.meanWeight)
  //               return 1 * orderType;
  //           } else if (data.column === "Mean length") {
  //             if (production1.meanLength < production2.meanLength)
  //               return -1 * orderType;
  //             if (production1.meanLength > production2.meanLength)
  //               return 1 * orderType;
  //           } else if (data.column === "Stocking Density") {
  //             if (production1.stockingDensityKG < production2.stockingDensityKG)
  //               return -1 * orderType;
  //             if (production1.stockingDensityKG > production2.stockingDensityKG)
  //               return 1 * orderType;
  //           } else if (data.column === "Stocking density") {
  //             if (production1.stockingDensityNM < production2.stockingDensityNM)
  //               return -1 * orderType;
  //             if (production1.stockingDensityNM > production2.stockingDensityNM)
  //               return 1 * orderType;
  //           } else if (data.column === "Stocking level") {
  //             if (production1.stockingLevel < production2.stockingLevel)
  //               return -1 * orderType;
  //             if (production1.stockingLevel > production2.stockingLevel)
  //               return 1 * orderType;
  //           }
  //           return 0;
  //         }
  //       );
  //       setProductionData(sortedData);
  //     }
  //   }
  // }, [sortDataFromLocal]);
  // useEffect(() => {
  //   if (sortDataFromLocal) {
  //     const data = JSON.parse(sortDataFromLocal);
  //     setOrder(data.direction);
  //     setOrderBy(data.column);
  //   }
  // }, [sortDataFromLocal]);
  // useEffect(() => {
  //   if (productions && !sortDataFromLocal) {
  //     setProductionData(productions);
  //   }
  // }, [productions]);
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
          textAlign: "center",
          mt: 4,
        }}
      >
        <TableContainer>
          <Table stickyHeader aria-label="sticky table">
            <TableHead
              sx={{
                textAlign: "center",
              }}
            >
              <TableRow></TableRow>
            </TableHead>
            <EnhancedTableHead
              order={order}
              orderBy={orderBy}
              // onRequestSort={handleRequestSort}
            />
            <TableBody>
              {sampleEnvironment && sampleEnvironment?.length > 0 ? (
                sampleEnvironment.map(
                  (sample: SampleEnvironment, i: number) => {
                    return (
                      <TableRow
                        key={i}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
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
                            textWrap: "nowrap",
                          }}
                          component="th"
                          scope="row"
                        >
                          {sample.farm.name ?? ""}
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
                          {sample.productionUnit.name ?? ""}
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
                          {sample?.date ?? ""}
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
                          {Number(sample.do).toFixed(2) ?? ""}
                          {/* {farm.meanWeight ? `${farm.meanWeight}g` : ""} */}
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
                          {sample.ammonia ?? ""}
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
                          {sample.TSS ?? ""}
                        </TableCell>
                        {role !== "MEMBER" && (
                          <TableCell
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
                              className="table-edit-option"
                              onClick={(e) => handleClick(e, sample)}
                              sx={{
                                background: "transparent",
                                color: "red",
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
                                onClick={() =>
                                  setOpenSamplingEnvironmentCalModal(true)
                                }
                              >
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
                                    viewBox="0 0 16 16"
                                  >
                                    <path
                                      fill="currentColor"
                                      d="m14.85 2.65l-1.5-1.5L13 1H4.48l-.5.5V4H1.5l-.5.5v10l.5.5h10l.5-.5V12h2.5l.5-.5V3zM11 14H2V5h1v3.07h6V5h.79L11 6.21zM6 7V5h2v2zm8 4h-2V6l-.15-.35l-1.5-1.5L10 4H5V2h7.81l1.21 1.21z"
                                    />
                                  </svg>

                                  <Typography variant="subtitle2">
                                    Capture
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

                                  <Typography variant="subtitle2">
                                    Edit
                                  </Typography>
                                </Stack>
                              </MenuItem>
                            </Menu>
                          </TableCell>
                        )}
                      </TableRow>
                    );
                  }
                )
              ) : (
                <TableRow>No Data Found</TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <SamplingEnvironmentCal
        open={openSamplingEnvironmentCalModal}
        setOpen={setOpenSamplingEnvironmentCalModal}
      />
    </>
  );
}
