"use client";
import TransferModal from "@/app/_components/models/FarmManager";
import { Farm } from "@/app/_typeModels/Farm";
import { Production } from "@/app/_typeModels/production";
import { breadcrumsAction } from "@/lib/features/breadcrum/breadcrumSlice";
import { selectRole } from "@/lib/features/user/userSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { Box, Button, TableSortLabel } from "@mui/material";
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
import WaterQualityParameter from "../models/WaterQualityParameter";
interface Props {
  productions: Production[];
  tableData: any;
  farms: Farm[];
  batches: { batchNumber: String; id: Number }[];
}
export default function ProductionTable({
  productions,
  tableData,
  farms,
  batches,
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
  const [openTransferModal, setOpenTransferModal] = useState<boolean>(false);
  const [openWaterQualityParameterModal, setOpenWaterQualityParameterModal] =
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
    // setAnchorEl(event.currentTarget);
    // setOpenTransferModal(true);
    setOpenWaterQualityParameterModal(true);
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

    if (productions) {
      const sortedData = [...productions].sort(
        (production1: Production, production2: Production) => {
          const orderType = order === "asc" ? 1 : -1;
          if (property === "Farm") {
            if (production1.farm.name < production2.farm.name)
              return -1 * orderType;
            if (production1.farm.name > production2.farm.name)
              return 1 * orderType;
          } else if (property === "Producton unit") {
            if (
              production1.productionUnit.name < production2.productionUnit.name
            )
              return -1 * orderType;
            if (
              production1.productionUnit.name > production2.productionUnit.name
            )
              return 1 * orderType;
          } else if (property === "Batch number") {
            if (
              production1.fishSupply?.batchNumber <
              production2.fishSupply?.batchNumber
            )
              return -1 * orderType;
            if (
              production1.fishSupply?.batchNumber >
              production2.fishSupply?.batchNumber
            )
              return 1 * orderType;
          } else if (property === "Age (days|months)") {
            if (production1.fishSupply?.age < production2.fishSupply?.age)
              return -1 * orderType;
            if (production1.fishSupply?.age > production2.fishSupply?.age)
              return 1 * orderType;
          } else if (property === "Fish Count") {
            if (production1.fishCount < production2.fishCount)
              return -1 * orderType;
            if (production1.fishCount > production2.fishCount)
              return 1 * orderType;
          } else if (property === "Biomass") {
            if (production1.biomass < production2.biomass)
              return -1 * orderType;
            if (production1.biomass > production2.biomass) return 1 * orderType;
          } else if (property === "Mean weight") {
            if (production1.meanWeight < production2.meanWeight)
              return -1 * orderType;
            if (production1.meanWeight > production2.meanWeight)
              return 1 * orderType;
          } else if (property === "Mean length") {
            if (production1.meanLength < production2.meanLength)
              return -1 * orderType;
            if (production1.meanLength > production2.meanLength)
              return 1 * orderType;
          } else if (property === "Stocking Density") {
            if (production1.stockingDensityKG < production2.stockingDensityKG)
              return -1 * orderType;
            if (production1.stockingDensityKG > production2.stockingDensityKG)
              return 1 * orderType;
          } else if (property === "Stocking density") {
            if (production1.stockingDensityNM < production2.stockingDensityNM)
              return -1 * orderType;
            if (production1.stockingDensityNM > production2.stockingDensityNM)
              return 1 * orderType;
          } else if (property === "Stocking level") {
            if (production1.stockingLevel < production2.stockingLevel)
              return -1 * orderType;
            if (production1.stockingLevel > production2.stockingLevel)
              return 1 * orderType;
          }
          return 0;
        }
      );
      setProductionData(sortedData);
    }
  };

  useEffect(() => {
    if (sortDataFromLocal) {
      const data = JSON.parse(sortDataFromLocal);
      setOrder(data.direction);
      setOrderBy(data.column);
      // handleRequestSort(null, data.column);
      if (productions) {
        const sortedData = [...productions].sort(
          (production1: any, production2: any) => {
            const orderType = data.direction === "asc" ? -1 : 1;
            if (data.column === "Farm") {
              if (production1.farm.name < production2.farm.name)
                return -1 * orderType;
              if (production1.farm.name > production2.farm.name)
                return 1 * orderType;
            } else if (data.column === "Producton unit") {
              if (
                production1.productionUnit.name <
                production2.productionUnit.name
              )
                return -1 * orderType;
              if (
                production1.productionUnit.name >
                production2.productionUnit.name
              )
                return 1 * orderType;
            } else if (data.column === "Batch number") {
              if (
                production1.fishSupply?.batchNumber <
                production2.fishSupply?.batchNumber
              )
                return -1 * orderType;
              if (
                production1.fishSupply?.batchNumber >
                production2.fishSupply?.batchNumber
              )
                return 1 * orderType;
            } else if (data.column === "Age (days|months)") {
              if (production1.fishSupply?.age < production2.fishSupply?.age)
                return -1 * orderType;
              if (production1.fishSupply?.age > production2.fishSupply?.age)
                return 1 * orderType;
            } else if (data.column === "Fish Count") {
              if (production1.fishCount < production2.fishCount)
                return -1 * orderType;
              if (production1.fishCount > production2.fishCount)
                return 1 * orderType;
            } else if (data.column === "Biomass") {
              if (production1.biomass < production2.biomass)
                return -1 * orderType;
              if (production1.biomass > production2.biomass)
                return 1 * orderType;
            } else if (data.column === "Mean weight") {
              if (production1.meanWeight < production2.meanWeight)
                return -1 * orderType;
              if (production1.meanWeight > production2.meanWeight)
                return 1 * orderType;
            } else if (data.column === "Mean length") {
              if (production1.meanLength < production2.meanLength)
                return -1 * orderType;
              if (production1.meanLength > production2.meanLength)
                return 1 * orderType;
            } else if (data.column === "Stocking Density") {
              if (production1.stockingDensityKG < production2.stockingDensityKG)
                return -1 * orderType;
              if (production1.stockingDensityKG > production2.stockingDensityKG)
                return 1 * orderType;
            } else if (data.column === "Stocking density") {
              if (production1.stockingDensityNM < production2.stockingDensityNM)
                return -1 * orderType;
              if (production1.stockingDensityNM > production2.stockingDensityNM)
                return 1 * orderType;
            } else if (data.column === "Stocking level") {
              if (production1.stockingLevel < production2.stockingLevel)
                return -1 * orderType;
              if (production1.stockingLevel > production2.stockingLevel)
                return 1 * orderType;
            }
            return 0;
          }
        );
        setProductionData(sortedData);
      }
    }
  }, [sortDataFromLocal]);
  useEffect(() => {
    if (sortDataFromLocal) {
      const data = JSON.parse(sortDataFromLocal);
      setOrder(data.direction);
      setOrderBy(data.column);
    }
  }, [sortDataFromLocal]);
  useEffect(() => {
    if (productions && !sortDataFromLocal) {
      setProductionData(productions);
    }
  }, [productions]);
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
              onRequestSort={handleRequestSort}
            />
            <TableBody>
              {productionData && productionData?.length > 0 ? (
                productionData.map((farm: Production, i: number) => {
                  return (
                    <TableRow
                      key={i}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                      }}
                    >
                      <TableCell
                        sx={{
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
                        {farm.farm.name ?? ""}
                      </TableCell>
                      <TableCell>
                        <TableRow>
                          <TableCell
                            sx={{
                              borderBottom: "transparent",
                              color: "#555555",
                              fontWeight: 500,
                              pl: 0,
                            }}
                          >
                            fff
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell
                            sx={{
                              borderBottom: "transparent",
                              color: "#555555",
                              fontWeight: 500,
                              pl: 0,
                            }}
                          >
                            Rows
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell
                            sx={{
                              borderBottom: "transparent",
                              color: "#555555",
                              fontWeight: 500,
                              pl: 0,
                            }}
                          >
                            fff
                          </TableCell>
                        </TableRow>
                      </TableCell>
                      <TableCell>
                        <TableRow>
                          <TableCell
                            sx={{
                              borderBottom: "transparent",
                              color: "#555555",
                              fontWeight: 500,
                              pl: 0,
                            }}
                          >
                            {farm?.fishSupply?.batchNumber ?? ""}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell
                            sx={{
                              borderBottom: "transparent",
                              color: "#555555",
                              fontWeight: 500,
                              pl: 0,
                            }}
                          >
                            {farm?.fishSupply?.batchNumber ?? ""}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell
                            sx={{
                              borderBottom: "transparent",
                              color: "#555555",
                              fontWeight: 500,
                              pl: 0,
                            }}
                          >
                            {farm?.fishSupply?.batchNumber ?? ""}
                          </TableCell>
                        </TableRow>
                      </TableCell>
                      <TableCell>
                        <TableRow>
                          <TableCell
                            sx={{
                              borderBottom: "transparent",
                              color: "#555555",
                              fontWeight: 500,
                              pl: 0,
                            }}
                          >
                            {farm?.fishSupply?.age ?? ""}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell
                            sx={{
                              borderBottom: "transparent",
                              color: "#555555",
                              fontWeight: 500,
                              pl: 0,
                            }}
                          >
                            {farm?.fishSupply?.age ?? ""}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell
                            sx={{
                              borderBottom: "transparent",
                              color: "#555555",
                              fontWeight: 500,
                              pl: 0,
                            }}
                          >
                            {farm?.fishSupply?.age ?? ""}
                          </TableCell>
                        </TableRow>
                      </TableCell>
                      <TableCell>
                        <TableRow>
                          <TableCell
                            // align="center"
                            sx={{
                              borderBottom: "transparent",
                              color: "#555555",
                              fontWeight: 500,
                              pl: 0,
                            }}
                          >
                            {farm.fishCount ?? ""}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell
                            // align="center"
                            sx={{
                              borderBottom: "transparent",
                              color: "#555555",
                              fontWeight: 500,
                              pl: 0,
                            }}
                          >
                            {farm.fishCount ?? ""}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell
                            // align="center"
                            sx={{
                              borderBottom: "transparent",
                              color: "#555555",
                              fontWeight: 500,
                              pl: 0,
                            }}
                          >
                            {farm.fishCount ?? ""}
                          </TableCell>
                        </TableRow>
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
                        {farm.biomass ? `${farm.biomass} kg` : ""}
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
                        {farm.meanWeight ? `${farm.meanWeight} g` : ""}
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
                        {farm.meanLength ?? ""}
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
                        {Number(farm.stockingDensityKG).toFixed(2) ?? ""}
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
                        {Number(farm.stockingDensityNM).toFixed(2) ?? ""}
                        {/* {farm.meanWeight ? `${farm.meanWeight}g` : ""} */}
                      </TableCell>{" "}
                      <TableCell
                        sx={{
                          borderBottomColor: "#F5F6F8",
                          borderBottomWidth: 2,
                          color: "#555555",
                          fontWeight: 500,
                          pl: 0,
                        }}
                      >
                        {farm.stockingLevel ? `${farm.stockingLevel}%` : ""}
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
                        >
                          <Box display={"flex"} gap="5px">
                            <Button
                              id="basic-button"
                              aria-controls={open ? "basic-menu" : undefined}
                              aria-haspopup="true"
                              aria-expanded={open ? "true" : undefined}
                              onClick={(e) => handleClick(e, farm)}
                              className=""
                              type="button"
                              variant="contained"
                              sx={{
                                background: "#06A19B",
                                fontWeight: "bold",
                                height: "35px",
                                width: {
                                  xs: "50%",
                                  lg: "fit-content",
                                },
                                paddingBlock: "10px",
                                borderRadius: "12px",
                                alignItems: "center",
                              }}
                            >
                              {" "}
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="40px"
                                height="40px"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  fill="none"
                                  stroke="currentColor"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  stroke-width="1"
                                  d="M6.008 12h-.01M11 16.042c.463.153.908.329 1.31.61m0 0A3.95 3.95 0 0 1 14 19.885a.117.117 0 0 1-.118.116c-2.917-.013-4.224-.507-4.773-1.322L8 16.857c-2.492-.503-4.782-2.094-6-4.774c3-6.597 12.5-6.597 15.5 0m-5.19 4.57c2.17-.66 4.105-2.184 5.19-4.57m-5.19-4.569A3.95 3.95 0 0 0 14 4.282c0-.826-4.308.342-4.89 1.206L8 7.31m9.5 4.773c.333-.66 2.1-2.969 4.5-2.969c-.833.825-2.2 3.959-1 5.938c-1.2 0-3-2.309-3.5-2.969"
                                  color="currentColor"
                                />
                              </svg>
                            </Button>

                            <Button
                              id="basic-button"
                              aria-controls={open ? "basic-menu" : undefined}
                              aria-haspopup="true"
                              aria-expanded={open ? "true" : undefined}
                              onClick={(e) => handleClick(e, farm)}
                              className=""
                              type="button"
                              variant="contained"
                              sx={{
                                background: "#06A19B",
                                fontWeight: "bold",
                                height: "35px",

                                width: {
                                  xs: "50%",
                                  lg: "fit-content",
                                },
                                paddingBlock: "10px",
                                borderRadius: "12px",
                              }}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="30px"
                                height="30px"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  fill="currentColor"
                                  d="M12.275 19q.3-.025.513-.238T13 18.25q0-.35-.225-.562T12.2 17.5q-1.025.075-2.175-.562t-1.45-2.313q-.05-.275-.262-.45T7.825 14q-.35 0-.575.263t-.15.612q.425 2.275 2 3.25t3.175.875M12 22q-3.425 0-5.712-2.35T4 13.8q0-2.5 1.988-5.437T12 2q4.025 3.425 6.013 6.363T20 13.8q0 3.5-2.287 5.85T12 22m0-2q2.6 0 4.3-1.763T18 13.8q0-1.825-1.513-4.125T12 4.65Q9.025 7.375 7.513 9.675T6 13.8q0 2.675 1.7 4.438T12 20m0-8"
                                />
                              </svg>
                            </Button>
                          </Box>
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
        selectedProduction={selectedProduction}
        farms={farms}
        batches={batches}
        productions={productions}
      />
      <WaterQualityParameter
        open={openWaterQualityParameterModal}
        setOpen={setOpenWaterQualityParameterModal}
        selectedProduction={selectedProduction}
        farms={farms}
        batches={batches}
        productions={productions}
      />
    </>
  );
}
