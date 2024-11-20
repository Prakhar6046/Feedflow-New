"use client";
import TransferModal from "@/app/_components/models/FarmManager";
import { Farm } from "@/app/_typeModels/Farm";
import { Production } from "@/app/_typeModels/production";
import { breadcrumsAction } from "@/lib/features/breadcrum/breadcrumSlice";
import { selectRole } from "@/lib/features/user/userSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { Button, TableSortLabel } from "@mui/material";
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
    setOpenTransferModal(true);
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
    console.log(property);
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
                        {farm.productionUnit.name ?? ""}
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
                        {farm?.fishSupply?.batchNumber ?? ""}
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
                        {farm?.fishSupply?.age ?? ""}
                        {/* {farm.biomass ? `${farm.biomass}Kg` : ""} */}
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
                        {farm.fishCount ?? ""}
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
                        // align="center"
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
                          // onClick={() => handleEdit(user)}
                        >
                          {/* <Button
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
                          </Button> */}
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
                              padding: "8px 20px",
                              width: {
                                xs: "50%",
                                lg: "fit-content",
                              },
                              textTransform: "capitalize",
                              borderRadius: "12px",
                              marginRight: "auto",
                            }}
                          >
                            Manage
                          </Button>
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
    </>
  );
}
