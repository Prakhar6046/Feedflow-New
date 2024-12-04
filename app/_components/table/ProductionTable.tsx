"use client";
import TransferModal from "@/app/_components/models/FarmManager";
import { Farm } from "@/app/_typeModels/Farm";
import { FarmGroup, Production } from "@/app/_typeModels/production";
import { breadcrumsAction } from "@/lib/features/breadcrum/breadcrumSlice";
import { selectRole } from "@/lib/features/user/userSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  TableSortLabel,
  Tooltip,
  Typography,
} from "@mui/material";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { getCookie, setCookie } from "cookies-next";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import WaterQualityParameter from "../models/WaterQualityParameter";
import FishManageHistoryModal from "../models/FishManageHistory";
import {
  fishManageHistoryHead,
  waterManageHistoryHead,
} from "@/app/_lib/utils/tableHeadData";
import WaterManageHistoryModal from "../models/WaterManageHistory";
import Loader from "../Loader";
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
  const production = localStorage.getItem("productionData");
  const dispatch = useAppDispatch();
  const pathName = usePathname();
  const role = useAppSelector(selectRole);
  const searchParams = useSearchParams();
  const isFish = searchParams.get("isFish");
  const isWater = searchParams.get("isWater");

  const [selectedView, setSelectedView] = useState<string>("fish");
  const [selectedProduction, setSelectedProduction] = useState<any>(
    production ? JSON.parse(production) : null
  );
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );
  const [openTransferModal, setOpenTransferModal] = useState<boolean>(
    isFish ? true : false
  );
  const [openWaterQualityModal, setOpenWaterQualityModal] = useState<boolean>(
    isWater ? true : false
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [productionData, setProductionData] = useState<Production[]>();
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("Farm");
  const [sortDataFromLocal, setSortDataFromLocal] = React.useState<any>("");
  const [isFishManageHistory, setIsFishManageHistory] =
    useState<boolean>(false);
  const [isWaterManageHistory, setIsWaterManageHistory] =
    useState<boolean>(false);
  const [selectedUnitId, setSelectedUnitId] = useState<String>();
  const handleFishManageHistory = (unit: any) => {
    setSelectedUnitId(unit.productionUnit.id);
    if (selectedView == "fish") {
      setIsWaterManageHistory(false);
      setIsFishManageHistory(true);
    } else {
      setIsFishManageHistory(false);
      setIsWaterManageHistory(true);
    }
  };

  const handleClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    unit: any,
    isManage: boolean
  ) => {
    const selectedProd = productions.find((pro) => pro.id === unit.id);
    const currentParams = new URLSearchParams(searchParams);
    setAnchorEl(event.currentTarget);
    if (currentParams.size) {
      currentParams.delete("isFish");
      currentParams.delete("isWater");
    }
    if (isManage) {
      currentParams.set("isFish", "true");
      const newPath = `${window.location.pathname}?${currentParams.toString()}`;
      router.replace(newPath);
      setOpenTransferModal(true);
    } else {
      currentParams.set("isWater", "true");
      const newPath = `${window.location.pathname}?${currentParams.toString()}`;
      router.replace(newPath);
      setOpenWaterQualityModal(true);
    }
    localStorage.setItem("productionData", JSON.stringify(selectedProd));
    setSelectedProduction(selectedProd);
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

  const handleTableView = (value: string) => {
    setLoading(true);
    setSelectedView(value), setCookie("productionCurrentView", value);
    router.refresh();
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

  const groupedData: any = productions?.reduce((result: any, item) => {
    // Find or create a farm group
    let farmGroup: any = result.find(
      (group: any) => group.farm === item.farm.name
    );
    if (!farmGroup) {
      farmGroup = { farm: item.farm.name, units: [] };
      result.push(farmGroup);
    }

    // Add the current production unit and all related data to the group
    farmGroup.units.push({
      id: item.id,
      productionUnit: item.productionUnit,
      fishSupply: item.fishSupply,
      organisation: item.organisation,
      farm: item.farm,
      biomass: item.biomass,
      fishCount: item.fishCount,
      batchNumberId: item.batchNumberId,
      age: item.age,
      meanLength: item.meanLength,
      meanWeight: item.meanWeight,
      stockingDensityKG: item.stockingDensityKG,
      stockingDensityNM: item.stockingDensityNM,
      stockingLevel: item.stockingLevel,
      createdBy: item.createdBy,
      updatedBy: item.updatedBy,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      isManager: item.isManager,
      field: item.field,
      fishManageHistory: item.FishManageHistory,
      waterTemp: item.waterTemp,
      DO: item.DO,
      TSS: item.TSS,
      NH4: item.NH4,
      NO3: item.NO3,
      NO2: item.NO2,
      ph: item.ph,
      visibility: item.visibility,
    });

    return result;
  }, []);

  useEffect(() => {
    if (pathName) {
      setSortDataFromLocal(localStorage.getItem(pathName));
    }
  }, [pathName]);
  useEffect(() => {
    const selectView = getCookie("productionCurrentView");
    if (selectView) {
      setSelectedView(selectView);
    }
  }, [getCookie("productionCurrentView")]);
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
  console.log(selectedView);

  useEffect(() => {
    router.refresh();
  }, [router]);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <FormControl>
          <RadioGroup
            aria-labelledby="demo-radio-buttons-group-label"
            value={selectedView}
            name="radio-buttons-group"
            onChange={(e) => {
              handleTableView(e.target.value);
            }}
            className="ic-radio"
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <FormControlLabel
              value="fish"
              control={<Radio />}
              label="Fish"
              className="input-btn"
            />
            <FormControlLabel
              value="water"
              control={<Radio />}
              label="Water"
              className="input-btn"
            />
          </RadioGroup>
        </FormControl>
      </Box>
      {!loading ? (
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
                {groupedData && groupedData?.length > 0 ? (
                  groupedData?.map((farm: FarmGroup, i: number) => {
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
                            borderBottomColor: "#ececec",
                            borderBottomWidth: 2,
                            fontWeight: 700,
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
                          {farm.farm ?? ""}
                        </TableCell>
                        <TableCell
                          className="table-padding"
                          sx={{
                            borderBottomWidth: 2,
                            borderBottomColor: "#ececec",
                            color: "#555555",
                            fontWeight: 500,
                            pl: 0,
                          }}
                        >
                          {farm.units.map((unit, i) => {
                            return (
                              <Typography
                                key={i}
                                variant="h6"
                                sx={{
                                  fontWeight: 500,
                                  fontSize: 14,
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                  backgroundColor: "#F5F6F8",
                                  padding: "8px 12px",
                                  margin: "8px 0",
                                  textWrap: "nowrap",
                                }}
                              >
                                {" "}
                                {unit.productionUnit.name}
                                <Tooltip title="View history" placement="top">
                                  <Box
                                    sx={{
                                      pr: 3,
                                    }}
                                  >
                                    <Button
                                      onClick={() =>
                                        handleFishManageHistory(unit)
                                      }
                                      className=""
                                      type="button"
                                      variant="contained"
                                      style={{
                                        border: "1px solid #06A19B",
                                      }}
                                      sx={{
                                        background: "transparent",
                                        fontWeight: "bold",
                                        padding: 0.25,

                                        borderRadius: "4px",
                                        alignItems: "center",
                                        minWidth: "fit-content",
                                      }}
                                    >
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="1em"
                                        height="1em"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          fill="#06A19B"
                                          d="M21 11.11V5a2 2 0 0 0-2-2h-4.18C14.4 1.84 13.3 1 12 1s-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14a2 2 0 0 0 2 2h6.11c1.26 1.24 2.98 2 4.89 2c3.87 0 7-3.13 7-7c0-1.91-.76-3.63-2-4.89M12 3c.55 0 1 .45 1 1s-.45 1-1 1s-1-.45-1-1s.45-1 1-1M5 19V5h2v2h10V5h2v4.68c-.91-.43-1.92-.68-3-.68H7v2h4.1c-.6.57-1.06 1.25-1.42 2H7v2h2.08c-.05.33-.08.66-.08 1c0 1.08.25 2.09.68 3zm11 2c-2.76 0-5-2.24-5-5s2.24-5 5-5s5 2.24 5 5s-2.24 5-5 5m.5-4.75l2.86 1.69l-.75 1.22L15 17v-5h1.5z"
                                        />
                                      </svg>
                                    </Button>
                                  </Box>
                                </Tooltip>
                              </Typography>
                            );
                          })}
                        </TableCell>
                        <TableCell
                          className="table-padding"
                          sx={{
                            borderBottomWidth: 2,
                            borderBottomColor: "#ececec",
                            color: "#555555",
                            fontWeight: 500,
                            pl: 0,
                          }}
                        >
                          {farm.units.map((unit, i) => {
                            return (
                              <Typography
                                key={i}
                                variant="h6"
                                sx={{
                                  fontWeight: 500,
                                  fontSize: 14,
                                  backgroundColor: "#F5F6F8",
                                  padding: `${
                                    selectedView === "water"
                                      ? unit.waterTemp
                                        ? "8px 12px 8px 0"
                                        : "19px 12px 19px 0"
                                      : unit?.fishSupply?.batchNumber
                                      ? "8px 12px 8px 0"
                                      : "19px 12px 19px 0"
                                  }`,
                                  margin: "8px 0",
                                  textWrap: "nowrap",
                                }}
                              >
                                {selectedView === "water"
                                  ? unit.waterTemp ?? ""
                                  : unit?.fishSupply?.batchNumber ?? ""}
                              </Typography>
                            );
                          })}
                        </TableCell>
                        <TableCell
                          className="table-padding"
                          sx={{
                            borderBottomWidth: 2,
                            borderBottomColor: "#ececec",
                            color: "#555555",
                            fontWeight: 500,
                            pl: 0,
                            p: 0,
                          }}
                        >
                          {farm.units.map((unit, i) => {
                            return (
                              <Typography
                                key={i}
                                variant="h6"
                                sx={{
                                  fontWeight: 500,
                                  fontSize: 14,
                                  padding: `${
                                    selectedView === "water"
                                      ? unit.DO
                                        ? "8px 12px 8px 0"
                                        : "19px 12px 19px 0"
                                      : unit?.fishSupply?.age
                                      ? "8px 12px 8px 0"
                                      : "19px 12px 19px 0"
                                  }`,
                                  backgroundColor: "#F5F6F8",
                                  margin: "8px 0",

                                  textWrap: "nowrap",
                                }}
                              >
                                {selectedView === "water"
                                  ? unit.DO ?? ""
                                  : unit?.fishSupply?.age ?? ""}
                              </Typography>
                            );
                          })}
                        </TableCell>
                        <TableCell
                          className="table-padding"
                          sx={{
                            borderBottomWidth: 2,
                            borderBottomColor: "#ececec",
                            color: "#555555",
                            fontWeight: 500,
                            pl: 0,
                          }}
                        >
                          {farm.units.map((unit, i) => {
                            return (
                              <Typography
                                key={i}
                                variant="h6"
                                sx={{
                                  fontWeight: 500,
                                  fontSize: 14,
                                  backgroundColor: "#F5F6F8",
                                  padding: `${
                                    selectedView === "water"
                                      ? unit.TSS
                                        ? "8px 12px 8px 0"
                                        : "19px 12px 19px 0"
                                      : unit?.fishCount
                                      ? "8px 12px 8px 0"
                                      : "19px 12px 19px 0"
                                  }`,
                                  margin: "8px 0",
                                  // marginBottom: "10px",
                                  // padding: "21px",
                                  textWrap: "nowrap",
                                }}
                              >
                                {selectedView === "water"
                                  ? unit.TSS ?? ""
                                  : unit?.fishCount ?? ""}
                              </Typography>
                            );
                          })}
                        </TableCell>
                        <TableCell
                          className="table-padding"
                          // align="center"
                          sx={{
                            borderBottomColor: "#ececec",
                            borderBottomWidth: 2,
                            color: "#555555",
                            fontWeight: 500,
                            pl: 0,
                          }}
                        >
                          {farm.units.map((unit, i) => {
                            return (
                              <Typography
                                key={i}
                                variant="h6"
                                sx={{
                                  fontWeight: 500,
                                  fontSize: 14,
                                  backgroundColor: "#F5F6F8",
                                  padding: `${
                                    selectedView === "water"
                                      ? unit.NH4
                                        ? "8px 12px 8px 0"
                                        : "19px 12px 19px 0"
                                      : unit?.biomass
                                      ? "8px 12px 8px 0"
                                      : "19px 12px 19px 0"
                                  }`,
                                  margin: "8px 0",
                                  // marginBottom: "10px",
                                  textWrap: "nowrap",
                                }}
                              >
                                {selectedView === "water"
                                  ? unit.NH4 ?? ""
                                  : unit.biomass
                                  ? `${unit.biomass} kg`
                                  : ""}
                              </Typography>
                            );
                          })}
                        </TableCell>
                        <TableCell
                          className="table-padding"
                          // align="center"
                          sx={{
                            borderBottomColor: "#ececec",
                            borderBottomWidth: 2,
                            color: "#555555",
                            fontWeight: 500,
                            pl: 0,
                          }}
                        >
                          {farm.units.map((unit, i) => {
                            return (
                              <Typography
                                key={i}
                                variant="h6"
                                sx={{
                                  fontWeight: 500,
                                  fontSize: 14,
                                  backgroundColor: "#F5F6F8",
                                  padding: `${
                                    selectedView === "water"
                                      ? unit.NO3
                                        ? "8px 12px 8px 0"
                                        : "19px 12px 19px 0"
                                      : unit?.meanWeight
                                      ? "8px 12px 8px 0"
                                      : "19px 12px 19px 0"
                                  }`,
                                  margin: "8px 0",
                                  // marginBottom: "10px",
                                  textWrap: "nowrap",
                                }}
                              >
                                {selectedView === "water"
                                  ? unit.NO3 ?? ""
                                  : unit.meanWeight
                                  ? `${unit.meanWeight} g`
                                  : ""}
                              </Typography>
                            );
                          })}
                        </TableCell>
                        <TableCell
                          className="table-padding"
                          // align="center"
                          sx={{
                            borderBottomColor: "#ececec",
                            borderBottomWidth: 2,
                            color: "#555555",
                            fontWeight: 500,
                            pl: 0,
                          }}
                        >
                          {farm.units.map((unit, i) => {
                            return (
                              <Typography
                                key={i}
                                variant="h6"
                                sx={{
                                  fontWeight: 500,
                                  fontSize: 14,
                                  backgroundColor: "#F5F6F8",
                                  padding: `${
                                    selectedView === "water"
                                      ? unit.NO2
                                        ? "8px 12px 8px 0"
                                        : "19px 12px 19px 0"
                                      : unit?.meanLength
                                      ? "8px 12px 8px 0"
                                      : "19px 12px 19px 0"
                                  }`,
                                  margin: "8px 0",
                                  // marginBottom: "10px",
                                  textWrap: "nowrap",
                                }}
                              >
                                {selectedView === "water"
                                  ? unit.NO2
                                  : unit.meanLength
                                  ? `${unit.meanLength} mm`
                                  : ""}
                              </Typography>
                            );
                          })}
                        </TableCell>
                        <TableCell
                          className="table-padding"
                          // align="center"
                          sx={{
                            borderBottomColor: "#ececec",
                            borderBottomWidth: 2,
                            color: "#555555",
                            fontWeight: 500,
                            pl: 0,
                          }}
                        >
                          {farm.units.map((unit, i) => {
                            return (
                              <Typography
                                key={i}
                                variant="h6"
                                sx={{
                                  fontWeight: 500,
                                  fontSize: 14,
                                  backgroundColor: "#F5F6F8",
                                  padding: `${
                                    selectedView === "water"
                                      ? unit.ph
                                        ? "8px 12px 8px 0"
                                        : "19px 12px 19px 0"
                                      : Number(unit.stockingDensityKG).toFixed(
                                          2
                                        )
                                      ? "8px 12px 8px 0"
                                      : "19px 12px 19px 0"
                                  }`,
                                  margin: "8px 0",
                                  // marginBottom: "10px",
                                  textWrap: "nowrap",
                                }}
                              >
                                {selectedView === "water"
                                  ? unit.ph ?? ""
                                  : Number(unit.stockingDensityKG).toFixed(2) ??
                                    ""}
                              </Typography>
                            );
                          })}
                        </TableCell>
                        <TableCell
                          className="table-padding"
                          // align="center"
                          sx={{
                            borderBottomColor: "#ececec",
                            borderBottomWidth: 2,
                            color: "#555555",
                            fontWeight: 500,
                            pl: 0,
                          }}
                        >
                          {farm.units.map((unit, i) => {
                            return (
                              <Typography
                                key={i}
                                variant="h6"
                                sx={{
                                  fontWeight: 500,
                                  fontSize: 14,
                                  backgroundColor: "#F5F6F8",
                                  padding: `${
                                    selectedView === "water"
                                      ? unit.visibility
                                        ? "8px 12px 8px 0"
                                        : "19px 12px 19px 0"
                                      : Number(unit.stockingDensityNM).toFixed(
                                          2
                                        )
                                      ? "8px 12px 8px 0"
                                      : "19px 12px 19px 0"
                                  }`,
                                  margin: "8px 0",
                                  // marginBottom: "10px",
                                  textWrap: "nowrap",
                                }}
                              >
                                {selectedView === "water"
                                  ? unit.visibility ?? ""
                                  : Number(unit.stockingDensityNM).toFixed(2) ??
                                    ""}
                              </Typography>
                            );
                          })}

                          {/* {farm.meanWeight ? `${farm.meanWeight}g` : ""} */}
                        </TableCell>{" "}
                        {selectedView !== "water" && (
                          <TableCell
                            className="table-padding"
                            sx={{
                              borderBottomColor: "#ececec",
                              borderBottomWidth: 2,
                              color: "#555555",
                              fontWeight: 500,
                              pl: 0,
                            }}
                          >
                            {farm.units.map((unit, i) => {
                              return (
                                <Typography
                                  key={i}
                                  variant="h6"
                                  sx={{
                                    fontWeight: 500,
                                    fontSize: 14,
                                    backgroundColor: "#F5F6F8",
                                    padding: "8px 12px 8px 0",
                                    margin: "8px 0",
                                    // marginBottom: "10px",
                                    textWrap: "nowrap",
                                  }}
                                >
                                  {Number(unit.stockingLevel) ?? ""}
                                </Typography>
                              );
                            })}
                          </TableCell>
                        )}
                        {role !== "MEMBER" && (
                          <TableCell
                            // align="center"
                            sx={{
                              borderBottomColor: "#ececec",
                              borderBottomWidth: 2,
                              color: "#555555",
                              fontWeight: 500,
                            }}
                            className="cursor-pointer table-padding"
                          >
                            {farm.units.map((unit) => {
                              return (
                                <Box
                                  sx={{
                                    backgroundColor: "#F5F6F8",
                                    padding: "6px 12px",
                                    // margin: "5px 0 8px 0",
                                    margin: "8px 0",
                                    textWrap: "nowrap",
                                  }}
                                  display={"flex"}
                                  gap={1}
                                  mb={1}
                                  key={Number(unit.id)}
                                >
                                  <Tooltip title="Fish" placement="top">
                                    <Button
                                      id="basic-button"
                                      aria-controls={
                                        open ? "basic-menu" : undefined
                                      }
                                      aria-haspopup="true"
                                      aria-expanded={open ? "true" : undefined}
                                      onClick={(e) =>
                                        handleClick(e, unit, true)
                                      }
                                      disabled={unit.isManager ? false : true}
                                      className=""
                                      type="button"
                                      variant="contained"
                                      sx={{
                                        background: "#06A19B",
                                        fontWeight: "bold",
                                        paddingX: 0.75,
                                        paddingY: 0.25,
                                        borderRadius: "8px",
                                        alignItems: "center",
                                        minWidth: "fit-content",
                                      }}
                                    >
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="22px"
                                        height="22px"
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
                                  </Tooltip>
                                  <Tooltip title="Water" placement="top">
                                    <Button
                                      id="basic-button"
                                      aria-controls={
                                        open ? "basic-menu" : undefined
                                      }
                                      aria-haspopup="true"
                                      aria-expanded={open ? "true" : undefined}
                                      onClick={(e) =>
                                        handleClick(e, unit, false)
                                      }
                                      disabled={unit.isManager ? false : true}
                                      className=""
                                      type="button"
                                      variant="contained"
                                      sx={{
                                        background: "#06A19B",
                                        fontWeight: "bold",
                                        paddingX: 1,
                                        paddingY: 0.25,
                                        borderRadius: "8px",
                                        alignItems: "center",
                                        minWidth: "fit-content",
                                      }}
                                    >
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="18px"
                                        height="18px"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          fill="currentColor"
                                          d="M12.275 19q.3-.025.513-.238T13 18.25q0-.35-.225-.562T12.2 17.5q-1.025.075-2.175-.562t-1.45-2.313q-.05-.275-.262-.45T7.825 14q-.35 0-.575.263t-.15.612q.425 2.275 2 3.25t3.175.875M12 22q-3.425 0-5.712-2.35T4 13.8q0-2.5 1.988-5.437T12 2q4.025 3.425 6.013 6.363T20 13.8q0 3.5-2.287 5.85T12 22m0-2q2.6 0 4.3-1.763T18 13.8q0-1.825-1.513-4.125T12 4.65Q9.025 7.375 7.513 9.675T6 13.8q0 2.675 1.7 4.438T12 20m0-8"
                                        />
                                      </svg>
                                    </Button>
                                  </Tooltip>
                                </Box>
                              );
                            })}
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
      ) : (
        <Loader />
      )}

      <TransferModal
        open={openTransferModal}
        setOpen={setOpenTransferModal}
        selectedProduction={selectedProduction}
        farms={farms}
        batches={batches}
        productions={productions}
      />
      <WaterQualityParameter
        open={openWaterQualityModal}
        setOpen={setOpenWaterQualityModal}
        selectedProduction={selectedProduction}
        farms={farms}
        productions={productions}
      />
      <FishManageHistoryModal
        open={isFishManageHistory}
        setOpen={setIsFishManageHistory}
        tableData={fishManageHistoryHead}
        productions={productions?.filter(
          (data) => data.productionUnitId === selectedUnitId
        )}
      />
      <WaterManageHistoryModal
        open={isWaterManageHistory}
        setOpen={setIsWaterManageHistory}
        tableData={waterManageHistoryHead}
        productions={productions?.filter(
          (data) => data.productionUnitId === selectedUnitId
        )}
      />
    </>
  );
}
