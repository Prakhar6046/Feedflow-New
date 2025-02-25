"use client";

import TransferModal from "@/app/_components/models/FarmManager";
import {
  averagesDropdown,
  getLocalItem,
  ProductionSortTables,
  setLocalItem,
} from "@/app/_lib/utils";
import {
  farmManagerFishHead,
  farmManagerFishHeadMember,
  farmManagerWaterHead,
  farmManagerWaterHeadMember,
} from "@/app/_lib/utils/tableHeadData";
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
  ListItemIcon,
  Menu,
  MenuItem,
  Radio,
  RadioGroup,
  TableSortLabel,
  Tooltip,
  Typography,
} from "@mui/material";

import { useBreakpoint } from "@/app/hooks/useBreakPoint";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { getCookie, setCookie } from "cookies-next";
import html2canvas from "html2canvas";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import Test from "../models/Test";
import WaterQualityParameter from "../models/WaterQualityParameter";
import ProductionManagerFilter from "../ProductionManagerFilter";
interface Props {
  productions: Production[];
  tableData?: any;
  farms: Farm[];
  batches: { batchNumber: String; id: Number }[];
}

export default function ProductionTable({
  productions,
  farms,
  batches,
}: Props) {
  const captureRef = useRef(null);
  const router = useRouter();
  const breakpoint = useBreakpoint();
  const dispatch = useAppDispatch();
  const pathName = usePathname();
  const role = useAppSelector(selectRole);
  const searchParams = useSearchParams();
  const isFish = searchParams.get("isFish");
  const isWater = searchParams.get("isWater");
  const [production, setProduction] = useState<any>();
  const loggedUser: any = getCookie("logged-user");
  const [selectedView, setSelectedView] = useState<string>();
  const [isHistoryDisabled, setIsHistoryDisabled] = useState<boolean>(false);
  const [unitManage, setUnitManage] = useState<any>();
  const [selectedProduction, setSelectedProduction] = useState<any>(
    production ?? null
  );
  const [tableHead, setTableHead] = useState<
    {
      id: string;
      numeric: boolean;
      disablePadding: boolean;
      label: string;
    }[]
  >();
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );
  const [anchorE2, setAnchorE2] = React.useState<HTMLButtonElement | null>(
    null
  );
  const [anchorE3, setAnchorE3] = React.useState<HTMLButtonElement | null>(
    null
  );
  const [test, setTest] = useState<boolean>(false);

  const [openTransferModal, setOpenTransferModal] = useState<boolean>(
    isFish ? true : false
  );
  const [openWaterQualityModal, setOpenWaterQualityModal] = useState<boolean>(
    isWater ? true : false
  );
  const handleClickTest = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorE3(event.currentTarget as HTMLButtonElement);
    setAnchorE2(event.currentTarget as HTMLButtonElement);
  };
  const [productionData, setProductionData] = useState<FarmGroup[]>();
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("Farm");
  const [sortDataFromLocal, setSortDataFromLocal] = React.useState<any>("");
  const [selectedDropDownfarms, setSelectedDropDownfarms] =
    useState<{ id: string; option: string }[]>();
  const [selectedDropDownUnits, setSelectedDropDownUnits] =
    useState<{ id: string; option: string }[]>();
  const [selectedDropDownYears, setSelectedDropDownYears] = useState<
    Array<number>
  >([new Date().getFullYear()]);
  const [selectedAverage, setSelectedAverage] = useState(averagesDropdown[0]);
  const [startMonth, setStartMonth] = useState<number>(
    new Date().getMonth() + 1
  );

  const [endMonth, setEndMonth] = useState<number>(new Date().getMonth() + 1);

  const [allFarms, setAllFarms] = useState<{ id: string; option: string }[]>(
    []
  );
  const [allUnits, setAllUnits] = useState<{ id: string; option: string }[]>(
    []
  );
  const handleClose = () => {
    setAnchorEl(null);
    setAnchorE2(null);
    setAnchorE3(null);
  };
  const handleFishManageHistory = (unit: any) => {
    if (selectedView == "fish") {
      router.push(`/dashboard/production/fish/${unit.productionUnit.id}`);
    } else {
      router.push(`/dashboard/production/water/${unit.productionUnit.id}`);
    }
  };
  const captureScreenshot = async () => {
    const tempContainer = document.createElement("div");
    document.body.appendChild(tempContainer);
    const chartDiv = document.createElement("div");
    tempContainer.appendChild(chartDiv);
    const root = createRoot(chartDiv);
    root.render(
      <Paper
        ref={captureRef}
        style={{
          maxWidth: "100vw",
          width: "100%",
          height: "100%",
          fontFamily: "Arial, sans-serif",
          margin: "auto",
        }}
      >
        <div
          style={{
            padding: "12px 20px",
            backgroundColor: "rgb(6,161,155)",
            boxShadow: "0 0 3px rgb(6, 161, 155)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <img src="/static/img/logo-bigone.jpg" alt="Logo" width={200} />
          <div>
            <h6
              style={{
                marginBottom: "4px",
                fontSize: "16px",
                color: "white",
              }}
            >
              Production Report
            </h6>
          </div>
        </div>
        <TableContainer
          sx={{
            overflow: "auto",
          }}
        >
          <Table stickyHeader aria-label="sticky table">
            <TableHead
              sx={{
                textAlign: "center",
                textWrap: "nowrap",
              }}
            >
              <TableRow></TableRow>
            </TableHead>
            <EnhancedTableHead
              sx={{
                backgroundColor: "red",
              }}
            />
            <TableBody>
              {productionData && productionData?.length > 0 ? (
                productionData?.map((farm: FarmGroup, i: number) => {
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
                          paddingRight: "20px",
                          maxWidth: 250,
                          borderBottomColor: "#F5F6F8",
                          borderBottomWidth: 2,
                          fontWeight: 700,
                          textWrap: "nowrap",
                          paddingLeft: {
                            lg: 10,
                            md: 3,
                            xs: 3,
                          },
                          pr: 2,
                        }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          {farm.farm ?? ""}
                          {/* <Button
                      id="basic-data"
                      aria-controls={open ? "basic-list" : undefined}
                      aria-haspopup="true"
                      aria-expanded={open ? "true" : undefined}
                      className="table-edit-option"
                      sx={{
                        background: "red",
                        color: "#555555",
                        boxShadow: "none",
                      }}
                    >
                    <h3 onClick={handleClickTest}>
                      {" "}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="1.1em"
                        style={{
                          marginLeft: "10px",
                          marginTop: "10px",
                        }}
                        height="1.1em"
                        viewBox="0 0 24 24"
                      >
                        <path fill="currentColor" d="M7.5 12L0 4h15z" />
                      </svg>
                    </Button> */}
                        </Box>
                      </TableCell>

                      <TableCell
                        className="table-padding"
                        sx={{
                          borderBottomWidth: 2,
                          borderBottomColor: "#F5F6F8",
                          color: "#555555",
                          fontWeight: 500,
                          pl: 0,
                          textWrap: "nowrap",
                        }}
                      >
                        {farm.units.map((unit, i) => {
                          return (
                            <>
                              <Typography
                                key={i}
                                variant="h6"
                                sx={{
                                  fontWeight: 500,
                                  fontSize: 14,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                  gap: 1,
                                  // backgroundColor: "#F5F6F8",
                                  borderTopLeftRadius: "8px",
                                  borderBottomLeftRadius: "8px",
                                  padding: "8px 12px",
                                  margin: "8px 0",
                                  textWrap: "nowrap",
                                }}
                              >
                                {unit.productionUnit.name}

                                {/* <Tooltip title="View history" placement="top">
                            <Box
                              sx={{
                                pr: 3,
                              }}
                            >
                              <Button
                                onClick={() =>
                                  handleFishManageHistory(unit)
                                }
                                disabled={isDisabled}
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
                          </Tooltip> */}
                              </Typography>
                            </>
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
                          textWrap: "wrap",
                        }}
                      >
                        {farm.units?.map((unit: any, i) => {
                          const value =
                            selectedView === "water"
                              ? selectedAverage === "Monthly average"
                                ? String(
                                    unit.monthlyAveragesWater?.waterTemp
                                  ) || ""
                                : selectedAverage === "Yearly average"
                                ? String(unit.yearlyAveragesWater?.waterTemp) ||
                                  ""
                                : selectedAverage === "All-time average"
                                ? String(
                                    unit.allTimeAveragesWater?.waterTemp
                                  ) || ""
                                : selectedAverage === "Individual average"
                                ? String(
                                    unit.individualAveragesWater?.waterTemp
                                  ) || ""
                                : unit.waterTemp ?? ""
                              : unit?.fishSupply?.batchNumber.length;

                          // Calculate padding based on whether a value exists
                          const paddingValue = value
                            ? "8px 12px 8px 0"
                            : "19px 12px 19px 0";
                          return (
                            <Typography
                              key={i}
                              variant="h6"
                              sx={{
                                fontWeight: 500,
                                fontSize: 14,
                                //   backgroundColor: "#F5F6F8",
                                padding: paddingValue,
                                margin: "8px 0",
                                textWrap: "nowrap",
                              }}
                            >
                              {value}
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
                          textWrap: "wrap",
                        }}
                      >
                        {farm.units.map((unit, i) => {
                          const value =
                            selectedView === "water"
                              ? selectedAverage === "Monthly average"
                                ? String(unit.monthlyAveragesWater?.DO) || ""
                                : selectedAverage === "Yearly average"
                                ? String(unit.yearlyAveragesWater?.DO) || ""
                                : selectedAverage === "All-time average"
                                ? String(unit.allTimeAveragesWater?.DO) || ""
                                : selectedAverage === "Individual average"
                                ? String(unit.individualAveragesWater?.DO) || ""
                                : unit.DO ?? ""
                              : unit?.fishSupply?.age;

                          // Calculate padding based on whether a value exists
                          const paddingValue = value
                            ? "8px 12px 8px 0"
                            : "19px 12px 19px 0";
                          return (
                            <Typography
                              key={i}
                              variant="h6"
                              sx={{
                                fontWeight: 500,
                                fontSize: 14,
                                padding: paddingValue,
                                //   backgroundColor: "#F5F6F8",
                                margin: "8px 0",
                                textWrap: "nowrap",
                              }}
                            >
                              {value}
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
                          textWrap: "wrap",
                        }}
                      >
                        {farm.units.map((unit, i) => {
                          // Determine the value to display
                          const value =
                            selectedView === "water"
                              ? selectedAverage === "Monthly average"
                                ? String(unit.monthlyAveragesWater?.TSS) || ""
                                : selectedAverage === "Yearly average"
                                ? String(unit.yearlyAveragesWater?.TSS) || ""
                                : selectedAverage === "All-time average"
                                ? String(unit.allTimeAveragesWater?.TSS) || ""
                                : selectedAverage === "Individual average"
                                ? String(unit.individualAveragesWater?.TSS) ||
                                  ""
                                : unit.TSS ?? ""
                              : selectedAverage === "Monthly average"
                              ? String(unit.monthlyAverages?.fishCount) || ""
                              : selectedAverage === "Yearly average"
                              ? String(unit.yearlyAverages?.fishCount) || ""
                              : selectedAverage === "All-time average"
                              ? String(unit.allTimeAverages?.fishCount) || ""
                              : selectedAverage === "Individual average"
                              ? String(unit.individualAverages?.fishCount) || ""
                              : unit?.fishCount ?? "";

                          // Calculate padding based on whether a value exists
                          const paddingValue = value
                            ? "8px 12px 8px 0"
                            : "19px 12px 19px 0";

                          return (
                            <Typography
                              key={i}
                              variant="h6"
                              sx={{
                                fontWeight: 500,
                                fontSize: 14,
                                //   backgroundColor: "#F5F6F8",
                                padding: paddingValue,
                                margin: "8px 0",
                                textWrap: "nowrap",
                              }}
                            >
                              {value}
                            </Typography>
                          );
                        })}
                      </TableCell>
                      <TableCell
                        className="table-padding"
                        sx={{
                          borderBottomColor: "#ececec",
                          borderBottomWidth: 2,
                          color: "#555555",
                          fontWeight: 500,
                          pl: 0,
                          textWrap: "nowrap",
                        }}
                      >
                        {farm.units.map((unit, i) => {
                          // Determine the value to display
                          const value =
                            selectedView === "water"
                              ? selectedAverage === "Monthly average"
                                ? String(unit.monthlyAveragesWater?.NH4) || ""
                                : selectedAverage === "Yearly average"
                                ? String(unit.yearlyAveragesWater?.NH4) || ""
                                : selectedAverage === "All-time average"
                                ? String(unit.allTimeAveragesWater?.NH4) || ""
                                : selectedAverage === "Individual average"
                                ? String(unit.individualAveragesWater?.NH4) ||
                                  ""
                                : unit.NH4 ?? ""
                              : selectedAverage === "Monthly average"
                              ? String(unit.monthlyAverages?.biomass) || ""
                              : selectedAverage === "Yearly average"
                              ? String(unit.yearlyAverages?.biomass) || ""
                              : selectedAverage === "All-time average"
                              ? String(unit.allTimeAverages?.biomass) || ""
                              : selectedAverage === "Individual average"
                              ? String(unit.individualAverages?.biomass) || ""
                              : unit.biomass ?? "";

                          // Calculate padding based on whether a value exists
                          const paddingValue = value
                            ? "8px 12px 8px 0"
                            : "19px 12px 19px 0";

                          return (
                            <Typography
                              key={i}
                              variant="h6"
                              sx={{
                                fontWeight: 500,
                                fontSize: 14,
                                //   backgroundColor: "#F5F6F8",
                                padding: paddingValue,
                                margin: "8px 0",
                                textWrap: "nowrap",
                              }}
                            >
                              {value}
                            </Typography>
                          );
                        })}
                      </TableCell>
                      <TableCell
                        className="table-padding"
                        sx={{
                          borderBottomColor: "#ececec",
                          borderBottomWidth: 2,
                          color: "#555555",
                          fontWeight: 500,
                          pl: 0,
                          textWrap: "nowrap",
                        }}
                      >
                        {farm.units.map((unit, i) => {
                          // Determine the value to display
                          const value =
                            selectedView === "water"
                              ? selectedAverage === "Monthly average"
                                ? String(unit.monthlyAveragesWater?.NO3) || ""
                                : selectedAverage === "Yearly average"
                                ? String(unit.yearlyAveragesWater?.NO3) || ""
                                : selectedAverage === "All-time average"
                                ? String(unit.allTimeAveragesWater?.NO3) || ""
                                : selectedAverage === "Individual average"
                                ? String(unit.individualAveragesWater?.NO3) ||
                                  ""
                                : unit.NO3 ?? ""
                              : selectedAverage === "Monthly average"
                              ? String(unit.monthlyAverages?.meanWeight) || ""
                              : selectedAverage === "Yearly average"
                              ? String(unit.yearlyAverages?.meanWeight) || ""
                              : selectedAverage === "All-time average"
                              ? String(unit.allTimeAverages?.meanWeight) || ""
                              : selectedAverage === "Individual average"
                              ? String(unit.individualAverages?.meanWeight) ||
                                ""
                              : unit.meanWeight ?? "";

                          // Calculate padding based on whether a value exists
                          const paddingValue = value
                            ? "8px 12px 8px 0"
                            : "19px 12px 19px 0";

                          return (
                            <Typography
                              key={i}
                              variant="h6"
                              sx={{
                                fontWeight: 500,
                                fontSize: 14,
                                //   backgroundColor: "#F5F6F8",
                                padding: paddingValue,
                                margin: "8px 0",
                                textWrap: "nowrap",
                              }}
                            >
                              {value}
                            </Typography>
                          );
                        })}
                      </TableCell>
                      <TableCell
                        className="table-padding"
                        sx={{
                          borderBottomColor: "#ececec",
                          borderBottomWidth: 2,
                          color: "#555555",
                          fontWeight: 500,
                          pl: 0,
                          textWrap: "nowrap",
                        }}
                      >
                        {farm.units.map((unit, i) => {
                          // Determine the value to display
                          const value =
                            selectedView === "water"
                              ? selectedAverage === "Monthly average"
                                ? String(unit.monthlyAveragesWater?.NO2) || ""
                                : selectedAverage === "Yearly average"
                                ? String(unit.yearlyAveragesWater?.NO2) || ""
                                : selectedAverage === "All-time average"
                                ? String(unit.allTimeAveragesWater?.NO2) || ""
                                : selectedAverage === "Individual average"
                                ? String(unit.individualAveragesWater?.NO2) ||
                                  ""
                                : unit.NO2 ?? ""
                              : selectedAverage === "Monthly average"
                              ? String(unit.monthlyAverages?.meanLength) || ""
                              : selectedAverage === "Yearly average"
                              ? String(unit.yearlyAverages?.meanLength) || ""
                              : selectedAverage === "All-time average"
                              ? String(unit.allTimeAverages?.meanLength) || ""
                              : selectedAverage === "Individual average"
                              ? String(unit.individualAverages?.meanLength) ||
                                ""
                              : unit.meanLength ?? "";

                          // Calculate padding based on whether a value exists
                          const paddingValue = value
                            ? "8px 12px 8px 0"
                            : "19px 12px 19px 0";

                          return (
                            <Typography
                              key={i}
                              variant="h6"
                              sx={{
                                fontWeight: 500,
                                fontSize: 14,
                                //   backgroundColor: "#F5F6F8",
                                padding: paddingValue,
                                margin: "8px 0",
                                textWrap: "nowrap",
                              }}
                            >
                              {value}
                            </Typography>
                          );
                        })}
                      </TableCell>
                      <TableCell
                        className="table-padding"
                        sx={{
                          borderBottomColor: "#ececec",
                          borderBottomWidth: 2,
                          color: "#555555",
                          fontWeight: 500,
                          pl: 0,
                          textWrap: "nowrap",
                        }}
                      >
                        {farm.units.map((unit, i) => {
                          // Determine the value to display
                          const value =
                            selectedView === "water"
                              ? selectedAverage === "Monthly average"
                                ? String(unit.monthlyAveragesWater?.ph) || ""
                                : selectedAverage === "Yearly average"
                                ? String(unit.yearlyAveragesWater?.ph) || ""
                                : selectedAverage === "All-time average"
                                ? String(unit.allTimeAveragesWater?.ph) || ""
                                : selectedAverage === "Individual average"
                                ? String(unit.individualAveragesWater?.ph) || ""
                                : unit.ph ?? ""
                              : selectedAverage === "Monthly average"
                              ? Number(
                                  unit.monthlyAverages?.stockingDensityKG || 0
                                ).toFixed(2)
                              : selectedAverage === "Yearly average"
                              ? Number(
                                  unit.yearlyAverages?.stockingDensityKG || 0
                                ).toFixed(2)
                              : selectedAverage === "All-time average"
                              ? Number(
                                  unit.allTimeAverages?.stockingDensityKG || 0
                                ).toFixed(2)
                              : selectedAverage === "Individual average"
                              ? Number(
                                  unit.individualAverages?.stockingDensityKG ||
                                    0
                                ).toFixed(2)
                              : Number(unit.stockingDensityKG || 0).toFixed(2);

                          // Calculate padding based on whether a value exists
                          const paddingValue = value
                            ? "8px 12px 8px 0"
                            : "19px 12px 19px 0";

                          return (
                            <Typography
                              key={i}
                              variant="h6"
                              sx={{
                                fontWeight: 500,
                                fontSize: 14,
                                //   backgroundColor: "#F5F6F8",
                                padding: paddingValue,
                                margin: "8px 0",
                                textWrap: "nowrap",
                              }}
                            >
                              {value}
                            </Typography>
                          );
                        })}
                      </TableCell>
                      <TableCell
                        className="table-padding"
                        sx={{
                          borderBottomColor: "#ececec",
                          borderBottomWidth: 2,
                          color: "#555555",
                          fontWeight: 500,
                          pl: 0,
                          textWrap: "nowrap",
                        }}
                      >
                        {farm.units.map((unit, i) => {
                          // Determine the value to display
                          const value =
                            selectedView === "water"
                              ? selectedAverage === "Monthly average"
                                ? String(
                                    unit.monthlyAveragesWater?.visibility
                                  ) || ""
                                : selectedAverage === "Yearly average"
                                ? String(
                                    unit.yearlyAveragesWater?.visibility
                                  ) || ""
                                : selectedAverage === "All-time average"
                                ? String(
                                    unit.allTimeAveragesWater?.visibility
                                  ) || ""
                                : selectedAverage === "Individual average"
                                ? String(
                                    unit.individualAveragesWater?.visibility
                                  ) || ""
                                : unit.visibility ?? ""
                              : selectedAverage === "Monthly average"
                              ? Number(
                                  unit.monthlyAverages?.stockingDensityNM || 0
                                ).toFixed(2)
                              : selectedAverage === "Yearly average"
                              ? Number(
                                  unit.yearlyAverages?.stockingDensityNM || 0
                                ).toFixed(2)
                              : selectedAverage === "All-time average"
                              ? Number(
                                  unit.allTimeAverages?.stockingDensityNM || 0
                                ).toFixed(2)
                              : selectedAverage === "Individual average"
                              ? Number(
                                  unit.individualAverages?.stockingDensityNM ||
                                    0
                                ).toFixed(2)
                              : Number(unit.stockingDensityNM || 0).toFixed(2);

                          // Calculate padding based on whether a value exists
                          const paddingValue = value
                            ? "8px 12px 8px 0"
                            : "19px 12px 19px 0";

                          return (
                            <Typography
                              key={i}
                              variant="h6"
                              sx={{
                                fontWeight: 500,
                                fontSize: 14,
                                //   backgroundColor: "#F5F6F8",
                                padding: paddingValue,
                                margin: "8px 0",
                                textWrap: "nowrap",
                              }}
                            >
                              {value}
                            </Typography>
                          );
                        })}
                      </TableCell>

                      {selectedView !== "water" && (
                        <TableCell
                          className="table-padding"
                          sx={{
                            borderBottomColor: "#ececec",
                            borderBottomWidth: 2,
                            color: "#555555",
                            fontWeight: 500,
                            pl: 0,
                            textWrap: "nowrap",
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
                                  // backgroundColor: "#F5F6F8",
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
    );
    await new Promise((resolve) => setTimeout(resolve, 800));
    const canvas = await html2canvas(chartDiv);
    const imgData = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = imgData;
    link.download = "screenshot.png";
    link.click();
    root.unmount();
    tempContainer.removeChild(chartDiv);
    document.body.removeChild(tempContainer);
  };
  const handleClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    unit: any,
    isManage: boolean
  ) => {
    const selectedProd = productions.find((pro) => pro.id === unitManage.id);
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
    setLocalItem("productionData", selectedProd);
    setSelectedProduction(selectedProd);
  };
  const handleResetFilters = () => {
    setSelectedDropDownfarms(allFarms);
    setSelectedDropDownUnits([]);
    setSelectedDropDownYears([new Date().getFullYear()]);
    setSelectedAverage(averagesDropdown[0]);
    setStartMonth(new Date().getMonth() + 1);
    setEndMonth(new Date().getMonth() + 1);
  };
  const handleYearChange = (event: any) => {
    const {
      target: { value },
    } = event;
    setSelectedDropDownYears(
      typeof value === "string" ? value.split(",") : value
    );
  };

  const open = Boolean(anchorEl);
  const open2 = Boolean(anchorE2);
  const open3 = Boolean(anchorE3);

  function EnhancedTableHead(data: any) {
    const { order, orderBy, onRequestSort } = data;
    const createSortHandler =
      (property: string) => (event: React.MouseEvent<HTMLButtonElement>) => {
        onRequestSort(event, property);
      };

    return (
      <TableHead
        className="prod-action"
        sx={{
          textWrap: "nowrap",
        }}
      >
        <TableRow>
          {tableHead?.map((headCell: any, idx: number, headCells: any) => (
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
                  md: idx === 0 ? 3 : 0,
                  xs: idx === 0 ? 3 : 0,
                },
              }}
            >
              {idx === headCells.length - 1 ||
              (selectedView === "fish" && idx === 2) ||
              (selectedView === "fish" && idx === 3) ? (
                breakpoint === "lg" ? (
                  headCell.smallLabel
                ) : (
                  headCell.label
                )
              ) : (
                <TableSortLabel
                  active={orderBy === headCell.id}
                  direction={orderBy === headCell.id ? order : "asc"}
                  onClick={createSortHandler(headCell.id)}
                >
                  {breakpoint === "lg" ? headCell.smallLabel : headCell.label}
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
    if (groupedData && selectedView) {
      const sortedData = ProductionSortTables(
        groupedData,
        order,
        property,
        selectedView,
        false
      );
      setProductionData(sortedData);
    }
  };

  const handleTableView = (value: string) => {
    setSelectedView(value);
    setCookie("productionCurrentView", value);
    router.refresh();
  };

  const groupedData: FarmGroup[] = productions?.reduce((result: any, item) => {
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
      WaterManageHistoryAvgrage: item.WaterManageHistoryAvgrage,
    });

    return result;
  }, []);
  useEffect(() => {
    if (pathName) {
      setSortDataFromLocal(getLocalItem(pathName));
    }
  }, [pathName]);
  useEffect(() => {
    const selectView = getCookie("productionCurrentView");
    if (selectView) {
      setSelectedView(selectView);
    } else {
      setCookie("productionCurrentView", "fish");
    }
  }, [getCookie("productionCurrentView")]);

  useEffect(() => {
    if (sortDataFromLocal) {
      const data = sortDataFromLocal;
      setOrder(data.direction);
      setOrderBy(data.column);
      if (groupedData) {
        const sortedData = ProductionSortTables(
          groupedData,
          data.direction,
          data.column,
          selectedView,
          true
        );
        setProductionData(sortedData);
      }
    }
  }, [sortDataFromLocal]);

  useEffect(() => {
    const user = JSON.parse(loggedUser);
    if (selectedView === "fish") {
      if (user.role !== "MEMBER") {
        setTableHead(farmManagerFishHead);
      } else {
        setTableHead(farmManagerFishHeadMember);
      }
    } else {
      if (user.role !== "MEMBER") {
        setTableHead(farmManagerWaterHead);
      } else {
        setTableHead(farmManagerWaterHeadMember);
      }
    }
  }, [selectedView]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedData = getLocalItem("productionData");
      if (storedData) {
        setProduction(storedData);
      }
    }
    if (groupedData && !sortDataFromLocal) {
      setProductionData(groupedData);
    }
  }, []);
  useEffect(() => {
    router.refresh();
  }, [router]);
  useEffect(() => {
    if (farms) {
      let customFarms: any = farms.map((farm) => {
        return { option: farm.name, id: farm.id };
      });
      // customFarms.unshift({ code: "0", option: "All farms" });
      setAllFarms(customFarms);
      setSelectedDropDownfarms(customFarms);
    }
  }, [farms]);
  useEffect(() => {
    if (selectedDropDownfarms) {
      const getProductionUnits = (
        dynamicFarms: {
          id: string;
          option: string;
        }[],
        detailedFarms: Farm[]
      ) => {
        return dynamicFarms.map((dynamicFarm) => {
          const matchedFarm = detailedFarms.find(
            (farm) => farm.id === dynamicFarm.id
          );
          return {
            farmId: dynamicFarm.id,
            option: dynamicFarm.option,
            productionUnits: matchedFarm?.productionUnits || [],
          };
        });
      };
      const result = getProductionUnits(selectedDropDownfarms, farms);
      let customUnits = result.flatMap((farm) =>
        farm?.productionUnits.map((unit) => ({
          id: unit.id,
          option: unit.name,
        }))
      );
      // customUnits.unshift({ id: "0", option: "All units" });
      setAllUnits(customUnits);
      setSelectedDropDownUnits(customUnits);
    }
  }, [selectedDropDownfarms]);
  useEffect(() => {
    if (!groupedData || !groupedData.length) return;
    // Utility: Filter by farms
    const filterByFarms = (
      data: FarmGroup[],
      selectedFarms: { id: string; option: string }[] | any
    ) => {
      if (!selectedFarms?.length) return data;
      const selectedFarmIds = selectedFarms?.map(
        (farm: { option: string; id: string }) => farm?.id
      );
      return data
        .map((farm) => ({
          ...farm,
          units: farm.units.filter((unit: any) =>
            selectedFarmIds.includes(unit.farm?.id)
          ),
        }))
        .filter((farm) => farm.units.length > 0);
    };

    // Utility: Filter by units
    const filterByUnits = (
      data: FarmGroup[],
      selectedUnits: { id: string; option: string }[] | any
    ) => {
      if (!selectedUnits?.length) return data;
      const selectedUnitIds = selectedUnits?.map(
        (unit: { id: string; option: string }) => unit?.id
      );
      return data
        .map((farm) => ({
          ...farm,
          units: farm.units.filter((unit) =>
            selectedUnitIds.includes(unit.productionUnit?.id)
          ),
        }))
        .filter((farm) => farm.units.length > 0);
    };

    // Utility: Filter by years
    const filterByYears = (data: FarmGroup[], selectedYears: Array<number>) => {
      if (!selectedYears?.length) return data;
      return data
        .map((farm) => ({
          ...farm,
          units: farm.units.filter((unit: any) =>
            selectedYears?.includes(new Date(unit.createdAt).getFullYear())
          ),
        }))
        .filter((farm) => farm.units.length > 0);
    };

    // Utility: Filter by months
    const filterByMonths = (
      data: FarmGroup[],
      years: Array<number>,
      startMonth: number,
      endMonth: number
    ) => {
      if (!years.length || !startMonth || !endMonth) return data;

      const startDates = years.map(
        (year) => new Date(`${year}-${String(startMonth).padStart(2, "0")}-01`)
      );
      const endDates = years.map((year) => {
        const end = new Date(`${year}-${String(endMonth).padStart(2, "0")}-01`);
        end.setMonth(end.getMonth() + 1); // Include the end of the month
        return end;
      });

      return data
        .map((farm) => ({
          ...farm,
          units: farm.units.filter((unit: any) => {
            const createdAt = new Date(unit.createdAt);
            return startDates.some(
              (start, index) =>
                createdAt >= start && createdAt < endDates[index]
            );
          }),
        }))
        .filter((farm) => farm.units.length > 0);
    };

    // Utility: Calculate averages
    const calculateAverages = (data: FarmGroup[], type: string) => {
      const calculateIndividualAverages = (history: any, fields: any) => {
        const totals = fields.reduce((acc: any, field: any) => {
          acc[field] = 0;
          return acc;
        }, {});
        let count = 0;

        history.forEach((entry: any) => {
          fields.forEach((field: any) => {
            totals[field] += parseFloat(entry[field]) || 0;
          });
          count += 1;
        });

        return fields.reduce((averages: any, field: any) => {
          averages[field] = count > 0 ? totals[field] / count : 0;
          return averages;
        }, {});
      };

      switch (type) {
        case "Monthly average":
          return data.map((farm) => ({
            ...farm,
            units: farm.units.map((unit: any) => ({
              ...unit,
              monthlyAverages: calculateIndividualAverages(
                unit.fishManageHistory.filter((entry: any) => {
                  const createdAt = new Date(entry.createdAt);
                  return (
                    createdAt.getMonth() + 1 >= Number(startMonth) &&
                    createdAt.getMonth() + 1 <= Number(endMonth) &&
                    selectedDropDownYears.includes(createdAt.getFullYear())
                  );
                }),
                [
                  "biomass",
                  "fishCount",
                  "meanLength",
                  "meanWeight",
                  "stockingDensityKG",
                  "stockingDensityNM",
                ]
              ),

              monthlyAveragesWater: calculateIndividualAverages(
                unit.WaterManageHistoryAvgrage.filter((entry: any) => {
                  const createdAt = new Date(entry.createdAt);
                  return (
                    createdAt.getMonth() + 1 >= Number(startMonth) &&
                    createdAt.getMonth() + 1 <= Number(endMonth) &&
                    selectedDropDownYears.includes(createdAt.getFullYear())
                  );
                }),

                [
                  "DO",
                  "NH4",
                  "NO2",
                  "NO3",
                  "TSS",
                  "ph",
                  "visibility",
                  "waterTemp",
                ]
              ),
            })),
          }));

        case "Yearly average":
          return data.map((farm) => ({
            ...farm,
            units: farm.units.map((unit: any) => ({
              ...unit,
              yearlyAverages: calculateIndividualAverages(
                unit.fishManageHistory.filter((entry: any) => {
                  const createdAt = new Date(entry.createdAt);
                  return selectedDropDownYears.includes(
                    createdAt.getFullYear()
                  );
                }),
                [
                  "biomass",
                  "fishCount",
                  "meanLength",
                  "meanWeight",
                  "stockingDensityKG",
                  "stockingDensityNM",
                ]
              ),
              yearlyAveragesWater: calculateIndividualAverages(
                unit.WaterManageHistoryAvgrage.filter((entry: any) => {
                  const createdAt = new Date(entry.createdAt);
                  return selectedDropDownYears.includes(
                    createdAt.getFullYear()
                  );
                }),
                [
                  "DO",
                  "NH4",
                  "NO2",
                  "NO3",
                  "TSS",
                  "ph",
                  "visibility",
                  "waterTemp",
                ]
              ),
            })),
          }));

        case "All-time average":
          return data.map((farm) => ({
            ...farm,
            units: farm.units.map((unit: any) => ({
              ...unit,
              allTimeAverages: calculateIndividualAverages(
                unit.fishManageHistory || [],
                [
                  "biomass",
                  "fishCount",
                  "meanLength",
                  "meanWeight",
                  "stockingDensityKG",
                  "stockingDensityNM",
                ]
              ),
              allTimeAveragesWater: calculateIndividualAverages(
                unit.WaterManageHistoryAvgrage || [],
                [
                  "DO",
                  "NH4",
                  "NO2",
                  "NO3",
                  "TSS",
                  "ph",
                  "visibility",
                  "waterTemp",
                ]
              ),
            })),
          }));

        case "Individual average":
          return data.map((farm) => ({
            ...farm,
            units: farm.units.map((unit: any) => ({
              ...unit,
              individualAverages: calculateIndividualAverages(
                unit.fishManageHistory || [],
                [
                  "biomass",
                  "fishCount",
                  "meanLength",
                  "meanWeight",
                  "stockingDensityKG",
                  "stockingDensityNM",
                ]
              ),
              individualAveragesWater: calculateIndividualAverages(
                unit.WaterManageHistoryAvgrage || [],
                [
                  "DO",
                  "NH4",
                  "NO2",
                  "NO3",
                  "TSS",
                  "ph",
                  "visibility",
                  "waterTemp",
                ]
              ),
            })),
          }));

        default:
          return data;
      }
    };

    // Apply filters sequentially
    let filteredData = groupedData;
    filteredData = filterByFarms(filteredData, selectedDropDownfarms);
    filteredData = filterByUnits(filteredData, selectedDropDownUnits);
    filteredData = filterByYears(filteredData, selectedDropDownYears);
    filteredData = filterByMonths(
      filteredData,
      selectedDropDownYears,
      Number(startMonth),
      Number(endMonth)
    );

    // Apply averages
    const processedData = calculateAverages(filteredData, selectedAverage);

    setProductionData(processedData);
  }, [
    selectedDropDownfarms,
    selectedDropDownUnits,
    selectedDropDownYears,
    startMonth,
    endMonth,
    selectedAverage,
  ]);

  return (
    <>
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
              value={selectedView ? selectedView : "fish"}
              name="radio-buttons-group"
              onChange={(e) => {
                handleTableView(e.target.value);
              }}
              className="ic-radio"
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                flexWrap: "nowrap",
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

        <ProductionManagerFilter
          allFarms={allFarms}
          allUnits={allUnits}
          handleYearChange={handleYearChange}
          selectedAverage={selectedAverage}
          handleResetFilters={handleResetFilters}
          selectedDropDownUnits={
            selectedDropDownUnits ? selectedDropDownUnits : []
          }
          selectedDropDownYears={
            selectedDropDownYears ? selectedDropDownYears : []
          }
          selectedDropDownfarms={
            selectedDropDownfarms ? selectedDropDownfarms : []
          }
          setSelectedDropDownfarms={setSelectedDropDownfarms}
          setSelectedDropDownUnits={setSelectedDropDownUnits}
          setEndMonth={setEndMonth}
          setStartMonth={setStartMonth}
          setSelectedAverage={setSelectedAverage}
          startMonth={Number(startMonth)}
          endMonth={Number(endMonth)}
          captureScreenshot={captureScreenshot}
        />
        <Paper
          sx={{
            width: "100%",
            overflow: "auto",
            borderRadius: "14px",
            boxShadow: "0px 0px 16px 5px #0000001A",
            textAlign: "center",
            mt: 4,
          }}
        >
          <TableContainer
            sx={{
              overflow: "auto",
            }}
          >
            <Table stickyHeader aria-label="sticky table">
              <TableHead
                sx={{
                  textAlign: "center",
                  textWrap: "nowrap",
                }}
              >
                <TableRow></TableRow>
              </TableHead>
              <EnhancedTableHead
                order={order}
                orderBy={orderBy}
                sx={{
                  backgroundColor: "red",
                }}
                onRequestSort={handleRequestSort}
              />
              <TableBody>
                {productionData && productionData?.length > 0 ? (
                  productionData?.map((farm: FarmGroup, i: number) => {
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
                            paddingRight: "20px",
                            maxWidth: 250,
                            borderBottomColor: "#F5F6F8",
                            borderBottomWidth: 2,
                            fontWeight: 700,
                            textWrap: "nowrap",
                            paddingLeft: {
                              lg: 10,
                              md: 3,
                              xs: 3,
                            },
                            pr: 2,
                          }}
                        >
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            {farm.farm ?? ""}
                            {/* <Button
                              id="basic-data"
                              aria-controls={open ? "basic-list" : undefined}
                              aria-haspopup="true"
                              aria-expanded={open ? "true" : undefined}
                              className="table-edit-option"
                              sx={{
                                background: "red",
                                color: "#555555",
                                boxShadow: "none",
                              }}
                            >
                            <h3 onClick={handleClickTest}>
                              {" "}
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="1.1em"
                                style={{
                                  marginLeft: "10px",
                                  marginTop: "10px",
                                }}
                                height="1.1em"
                                viewBox="0 0 24 24"
                              >
                                <path fill="currentColor" d="M7.5 12L0 4h15z" />
                              </svg>
                            </Button> */}
                          </Box>
                        </TableCell>

                        <TableCell
                          className="table-padding"
                          sx={{
                            borderBottomWidth: 2,
                            borderBottomColor: "#F5F6F8",
                            color: "#555555",
                            fontWeight: 500,
                            pl: 0,
                            textWrap: "nowrap",
                          }}
                        >
                          {farm.units.map((unit, i) => {
                            return (
                              <>
                                <Menu
                                  id="basic-list"
                                  className="table-edit-farm-menu profile-dropdown"
                                  anchorEl={anchorE3}
                                  open={open3}
                                  onClose={handleClose}
                                  MenuListProps={{
                                    "aria-labelledby": "basic-button",
                                  }}
                                >
                                  <MenuItem
                                    sx={{
                                      fontSize: 14,
                                      fontWeight: 500,
                                    }}
                                  >
                                    <ListItemIcon>
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="1.1em"
                                        height="1.1em"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          fill="currentColor"
                                          d="M6.008 12h-.01M11 16.042c.463.153.908.329 1.31.61m0 0A3.95 3.95 0 0 1 14 19.885a.117.117 0 0 1-.118.116c-2.917-.013-4.224-.507-4.773-1.322L8 16.857c-2.492-.503-4.782-2.094-6-4.774c3-6.597 12.5-6.597 15.5 0m-5.19 4.57c2.17-.66 4.105-2.184 5.19-4.57m-5.19-4.569A3.95 3.95 0 0 0 14 4.282c0-.826-4.308.342-4.89 1.206L8 7.31m9.5 4.773c.333-.66 2.1-2.969 4.5-2.969c-.833.825-2.2 3.959-1 5.938c-1.2 0-3-2.309-3.5-2.969"
                                        />
                                      </svg>
                                    </ListItemIcon>
                                    Manage
                                  </MenuItem>

                                  <MenuItem
                                    disabled={isHistoryDisabled}
                                    sx={{
                                      fontSize: 14,
                                      fontWeight: 500,
                                    }}
                                  >
                                    <ListItemIcon>
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="1.1em"
                                        height="1.1em"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          fill="currentColor"
                                          d="M21 11.11V5a2 2 0 0 0-2-2h-4.18C14.4 1.84 13.3 1 12 1s-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14a2 2 0 0 0 2 2h6.11c1.26 1.24 2.98 2 4.89 2c3.87 0 7-3.13 7-7c0-1.91-.76-3.63-2-4.89M12 3c.55 0 1 .45 1 1s-.45 1-1 1s-1-.45-1-1s.45-1 1-1M5 19V5h2v2h10V5h2v4.68c-.91-.43-1.92-.68-3-.68H7v2h4.1c-.6.57-1.06 1.25-1.42 2H7v2h2.08c-.05.33-.08.66-.08 1c0 1.08.25 2.09.68 3zm11 2c-2.76 0-5-2.24-5-5s2.24-5 5-5s5 2.24 5 5s-2.24 5-5 5m.5-4.75l2.86 1.69l-.75 1.22L15 17v-5h1.5z"
                                        />
                                      </svg>
                                    </ListItemIcon>
                                    History
                                  </MenuItem>

                                  <MenuItem
                                    onClick={() => {
                                      setAnchorE3(null), setTest(true);
                                    }}
                                    sx={{
                                      fontSize: 14,
                                      fontWeight: 500,
                                    }}
                                  >
                                    <ListItemIcon>
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="1.1em"
                                        height="1.1em"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          fill="currentColor"
                                          d="M21 11.11V5a2 2 0 0 0-2-2h-4.18C14.4 1.84 13.3 1 12 1s-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14a2 2 0 0 0 2 2h6.11c1.26 1.24 2.98 2 4.89 2c3.87 0 7-3.13 7-7c0-1.91-.76-3.63-2-4.89M12 3c.55 0 1 .45 1 1s-.45 1-1 1s-1-.45-1-1s.45-1 1-1M5 19V5h2v2h10V5h2v4.68c-.91-.43-1.92-.68-3-.68H7v2h4.1c-.6.57-1.06 1.25-1.42 2H7v2h2.08c-.05.33-.08.66-.08 1c0 1.08.25 2.09.68 3zm11 2c-2.76 0-5-2.24-5-5s2.24-5 5-5s5 2.24 5 5s-2.24 5-5 5m.5-4.75l2.86 1.69l-.75 1.22L15 17v-5h1.5z"
                                        />
                                      </svg>
                                    </ListItemIcon>
                                    Create report
                                  </MenuItem>
                                </Menu>
                                <Typography
                                  key={i}
                                  variant="h6"
                                  sx={{
                                    fontWeight: 500,
                                    fontSize: 14,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    gap: 1,
                                    backgroundColor: "#F5F6F8",
                                    borderTopLeftRadius: "8px",
                                    borderBottomLeftRadius: "8px",
                                    padding: "8px 12px",
                                    margin: "8px 0",
                                    textWrap: "nowrap",
                                  }}
                                >
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
                              </>
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
                            textWrap: "wrap",
                          }}
                        >
                          {farm.units?.map((unit: any, i) => {
                            const value =
                              selectedView === "water"
                                ? selectedAverage === "Monthly average"
                                  ? String(
                                      unit.monthlyAveragesWater?.waterTemp
                                    ) || ""
                                  : selectedAverage === "Yearly average"
                                  ? String(
                                      unit.yearlyAveragesWater?.waterTemp
                                    ) || ""
                                  : selectedAverage === "All-time average"
                                  ? String(
                                      unit.allTimeAveragesWater?.waterTemp
                                    ) || ""
                                  : selectedAverage === "Individual average"
                                  ? String(
                                      unit.individualAveragesWater?.waterTemp
                                    ) || ""
                                  : unit.waterTemp ?? ""
                                : unit?.fishSupply?.batchNumber.length;

                            // Calculate padding based on whether a value exists
                            const paddingValue = value
                              ? "8px 12px 8px 0"
                              : "19px 12px 19px 0";
                            return (
                              <Typography
                                key={i}
                                variant="h6"
                                sx={{
                                  fontWeight: 500,
                                  fontSize: 14,
                                  backgroundColor: "#F5F6F8",
                                  padding: paddingValue,
                                  margin: "8px 0",
                                  textWrap: "nowrap",
                                }}
                              >
                                {value}
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
                            textWrap: "wrap",
                          }}
                        >
                          {farm.units.map((unit, i) => {
                            const value =
                              selectedView === "water"
                                ? selectedAverage === "Monthly average"
                                  ? String(unit.monthlyAveragesWater?.DO) || ""
                                  : selectedAverage === "Yearly average"
                                  ? String(unit.yearlyAveragesWater?.DO) || ""
                                  : selectedAverage === "All-time average"
                                  ? String(unit.allTimeAveragesWater?.DO) || ""
                                  : selectedAverage === "Individual average"
                                  ? String(unit.individualAveragesWater?.DO) ||
                                    ""
                                  : unit.DO ?? ""
                                : unit?.fishSupply?.age;

                            // Calculate padding based on whether a value exists
                            const paddingValue = value
                              ? "8px 12px 8px 0"
                              : "19px 12px 19px 0";
                            return (
                              <Typography
                                key={i}
                                variant="h6"
                                sx={{
                                  fontWeight: 500,
                                  fontSize: 14,
                                  padding: paddingValue,
                                  backgroundColor: "#F5F6F8",
                                  margin: "8px 0",
                                  textWrap: "nowrap",
                                }}
                              >
                                {value}
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
                            textWrap: "wrap",
                          }}
                        >
                          {farm.units.map((unit, i) => {
                            // Determine the value to display
                            const value =
                              selectedView === "water"
                                ? selectedAverage === "Monthly average"
                                  ? String(unit.monthlyAveragesWater?.TSS) || ""
                                  : selectedAverage === "Yearly average"
                                  ? String(unit.yearlyAveragesWater?.TSS) || ""
                                  : selectedAverage === "All-time average"
                                  ? String(unit.allTimeAveragesWater?.TSS) || ""
                                  : selectedAverage === "Individual average"
                                  ? String(unit.individualAveragesWater?.TSS) ||
                                    ""
                                  : unit.TSS ?? ""
                                : selectedAverage === "Monthly average"
                                ? String(unit.monthlyAverages?.fishCount) || ""
                                : selectedAverage === "Yearly average"
                                ? String(unit.yearlyAverages?.fishCount) || ""
                                : selectedAverage === "All-time average"
                                ? String(unit.allTimeAverages?.fishCount) || ""
                                : selectedAverage === "Individual average"
                                ? String(unit.individualAverages?.fishCount) ||
                                  ""
                                : unit?.fishCount ?? "";

                            // Calculate padding based on whether a value exists
                            const paddingValue = value
                              ? "8px 12px 8px 0"
                              : "19px 12px 19px 0";

                            return (
                              <Typography
                                key={i}
                                variant="h6"
                                sx={{
                                  fontWeight: 500,
                                  fontSize: 14,
                                  backgroundColor: "#F5F6F8",
                                  padding: paddingValue,
                                  margin: "8px 0",
                                  textWrap: "nowrap",
                                }}
                              >
                                {value}
                              </Typography>
                            );
                          })}
                        </TableCell>
                        <TableCell
                          className="table-padding"
                          sx={{
                            borderBottomColor: "#ececec",
                            borderBottomWidth: 2,
                            color: "#555555",
                            fontWeight: 500,
                            pl: 0,
                            textWrap: "nowrap",
                          }}
                        >
                          {farm.units.map((unit, i) => {
                            // Determine the value to display
                            const value =
                              selectedView === "water"
                                ? selectedAverage === "Monthly average"
                                  ? String(unit.monthlyAveragesWater?.NH4) || ""
                                  : selectedAverage === "Yearly average"
                                  ? String(unit.yearlyAveragesWater?.NH4) || ""
                                  : selectedAverage === "All-time average"
                                  ? String(unit.allTimeAveragesWater?.NH4) || ""
                                  : selectedAverage === "Individual average"
                                  ? String(unit.individualAveragesWater?.NH4) ||
                                    ""
                                  : unit.NH4 ?? ""
                                : selectedAverage === "Monthly average"
                                ? String(unit.monthlyAverages?.biomass) || ""
                                : selectedAverage === "Yearly average"
                                ? String(unit.yearlyAverages?.biomass) || ""
                                : selectedAverage === "All-time average"
                                ? String(unit.allTimeAverages?.biomass) || ""
                                : selectedAverage === "Individual average"
                                ? String(unit.individualAverages?.biomass) || ""
                                : unit.biomass ?? "";

                            // Calculate padding based on whether a value exists
                            const paddingValue = value
                              ? "8px 12px 8px 0"
                              : "19px 12px 19px 0";

                            return (
                              <Typography
                                key={i}
                                variant="h6"
                                sx={{
                                  fontWeight: 500,
                                  fontSize: 14,
                                  backgroundColor: "#F5F6F8",
                                  padding: paddingValue,
                                  margin: "8px 0",
                                  textWrap: "nowrap",
                                }}
                              >
                                {value}
                              </Typography>
                            );
                          })}
                        </TableCell>
                        <TableCell
                          className="table-padding"
                          sx={{
                            borderBottomColor: "#ececec",
                            borderBottomWidth: 2,
                            color: "#555555",
                            fontWeight: 500,
                            pl: 0,
                            textWrap: "nowrap",
                          }}
                        >
                          {farm.units.map((unit, i) => {
                            // Determine the value to display
                            const value =
                              selectedView === "water"
                                ? selectedAverage === "Monthly average"
                                  ? String(unit.monthlyAveragesWater?.NO3) || ""
                                  : selectedAverage === "Yearly average"
                                  ? String(unit.yearlyAveragesWater?.NO3) || ""
                                  : selectedAverage === "All-time average"
                                  ? String(unit.allTimeAveragesWater?.NO3) || ""
                                  : selectedAverage === "Individual average"
                                  ? String(unit.individualAveragesWater?.NO3) ||
                                    ""
                                  : unit.NO3 ?? ""
                                : selectedAverage === "Monthly average"
                                ? String(unit.monthlyAverages?.meanWeight) || ""
                                : selectedAverage === "Yearly average"
                                ? String(unit.yearlyAverages?.meanWeight) || ""
                                : selectedAverage === "All-time average"
                                ? String(unit.allTimeAverages?.meanWeight) || ""
                                : selectedAverage === "Individual average"
                                ? String(unit.individualAverages?.meanWeight) ||
                                  ""
                                : unit.meanWeight ?? "";

                            // Calculate padding based on whether a value exists
                            const paddingValue = value
                              ? "8px 12px 8px 0"
                              : "19px 12px 19px 0";

                            return (
                              <Typography
                                key={i}
                                variant="h6"
                                sx={{
                                  fontWeight: 500,
                                  fontSize: 14,
                                  backgroundColor: "#F5F6F8",
                                  padding: paddingValue,
                                  margin: "8px 0",
                                  textWrap: "nowrap",
                                }}
                              >
                                {value}
                              </Typography>
                            );
                          })}
                        </TableCell>
                        <TableCell
                          className="table-padding"
                          sx={{
                            borderBottomColor: "#ececec",
                            borderBottomWidth: 2,
                            color: "#555555",
                            fontWeight: 500,
                            pl: 0,
                            textWrap: "nowrap",
                          }}
                        >
                          {farm.units.map((unit, i) => {
                            // Determine the value to display
                            const value =
                              selectedView === "water"
                                ? selectedAverage === "Monthly average"
                                  ? String(unit.monthlyAveragesWater?.NO2) || ""
                                  : selectedAverage === "Yearly average"
                                  ? String(unit.yearlyAveragesWater?.NO2) || ""
                                  : selectedAverage === "All-time average"
                                  ? String(unit.allTimeAveragesWater?.NO2) || ""
                                  : selectedAverage === "Individual average"
                                  ? String(unit.individualAveragesWater?.NO2) ||
                                    ""
                                  : unit.NO2 ?? ""
                                : selectedAverage === "Monthly average"
                                ? String(unit.monthlyAverages?.meanLength) || ""
                                : selectedAverage === "Yearly average"
                                ? String(unit.yearlyAverages?.meanLength) || ""
                                : selectedAverage === "All-time average"
                                ? String(unit.allTimeAverages?.meanLength) || ""
                                : selectedAverage === "Individual average"
                                ? String(unit.individualAverages?.meanLength) ||
                                  ""
                                : unit.meanLength ?? "";

                            // Calculate padding based on whether a value exists
                            const paddingValue = value
                              ? "8px 12px 8px 0"
                              : "19px 12px 19px 0";

                            return (
                              <Typography
                                key={i}
                                variant="h6"
                                sx={{
                                  fontWeight: 500,
                                  fontSize: 14,
                                  backgroundColor: "#F5F6F8",
                                  padding: paddingValue,
                                  margin: "8px 0",
                                  textWrap: "nowrap",
                                }}
                              >
                                {value}
                              </Typography>
                            );
                          })}
                        </TableCell>
                        <TableCell
                          className="table-padding"
                          sx={{
                            borderBottomColor: "#ececec",
                            borderBottomWidth: 2,
                            color: "#555555",
                            fontWeight: 500,
                            pl: 0,
                            textWrap: "nowrap",
                          }}
                        >
                          {farm.units.map((unit, i) => {
                            // Determine the value to display
                            const value =
                              selectedView === "water"
                                ? selectedAverage === "Monthly average"
                                  ? String(unit.monthlyAveragesWater?.ph) || ""
                                  : selectedAverage === "Yearly average"
                                  ? String(unit.yearlyAveragesWater?.ph) || ""
                                  : selectedAverage === "All-time average"
                                  ? String(unit.allTimeAveragesWater?.ph) || ""
                                  : selectedAverage === "Individual average"
                                  ? String(unit.individualAveragesWater?.ph) ||
                                    ""
                                  : unit.ph ?? ""
                                : selectedAverage === "Monthly average"
                                ? Number(
                                    unit.monthlyAverages?.stockingDensityKG || 0
                                  ).toFixed(2)
                                : selectedAverage === "Yearly average"
                                ? Number(
                                    unit.yearlyAverages?.stockingDensityKG || 0
                                  ).toFixed(2)
                                : selectedAverage === "All-time average"
                                ? Number(
                                    unit.allTimeAverages?.stockingDensityKG || 0
                                  ).toFixed(2)
                                : selectedAverage === "Individual average"
                                ? Number(
                                    unit.individualAverages
                                      ?.stockingDensityKG || 0
                                  ).toFixed(2)
                                : Number(unit.stockingDensityKG || 0).toFixed(
                                    2
                                  );

                            // Calculate padding based on whether a value exists
                            const paddingValue = value
                              ? "8px 12px 8px 0"
                              : "19px 12px 19px 0";

                            return (
                              <Typography
                                key={i}
                                variant="h6"
                                sx={{
                                  fontWeight: 500,
                                  fontSize: 14,
                                  backgroundColor: "#F5F6F8",
                                  padding: paddingValue,
                                  margin: "8px 0",
                                  textWrap: "nowrap",
                                }}
                              >
                                {value}
                              </Typography>
                            );
                          })}
                        </TableCell>
                        <TableCell
                          className="table-padding"
                          sx={{
                            borderBottomColor: "#ececec",
                            borderBottomWidth: 2,
                            color: "#555555",
                            fontWeight: 500,
                            pl: 0,
                            textWrap: "nowrap",
                          }}
                        >
                          {farm.units.map((unit, i) => {
                            // Determine the value to display
                            const value =
                              selectedView === "water"
                                ? selectedAverage === "Monthly average"
                                  ? String(
                                      unit.monthlyAveragesWater?.visibility
                                    ) || ""
                                  : selectedAverage === "Yearly average"
                                  ? String(
                                      unit.yearlyAveragesWater?.visibility
                                    ) || ""
                                  : selectedAverage === "All-time average"
                                  ? String(
                                      unit.allTimeAveragesWater?.visibility
                                    ) || ""
                                  : selectedAverage === "Individual average"
                                  ? String(
                                      unit.individualAveragesWater?.visibility
                                    ) || ""
                                  : unit.visibility ?? ""
                                : selectedAverage === "Monthly average"
                                ? Number(
                                    unit.monthlyAverages?.stockingDensityNM || 0
                                  ).toFixed(2)
                                : selectedAverage === "Yearly average"
                                ? Number(
                                    unit.yearlyAverages?.stockingDensityNM || 0
                                  ).toFixed(2)
                                : selectedAverage === "All-time average"
                                ? Number(
                                    unit.allTimeAverages?.stockingDensityNM || 0
                                  ).toFixed(2)
                                : selectedAverage === "Individual average"
                                ? Number(
                                    unit.individualAverages
                                      ?.stockingDensityNM || 0
                                  ).toFixed(2)
                                : Number(unit.stockingDensityNM || 0).toFixed(
                                    2
                                  );

                            // Calculate padding based on whether a value exists
                            const paddingValue = value
                              ? "8px 12px 8px 0"
                              : "19px 12px 19px 0";

                            return (
                              <Typography
                                key={i}
                                variant="h6"
                                sx={{
                                  fontWeight: 500,
                                  fontSize: 14,
                                  backgroundColor: "#F5F6F8",
                                  padding: paddingValue,
                                  margin: "8px 0",
                                  textWrap: "nowrap",
                                }}
                              >
                                {value}
                              </Typography>
                            );
                          })}
                        </TableCell>

                        {selectedView !== "water" && (
                          <TableCell
                            className="table-padding"
                            sx={{
                              borderBottomColor: "#ececec",
                              borderBottomWidth: 2,
                              color: "#555555",
                              fontWeight: 500,
                              pl: 0,
                              textWrap: "nowrap",
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
                              pl: 0,
                              textWrap: "nowrap",
                            }}
                            className="cursor-pointer table-padding"
                          >
                            {farm.units.map((unit) => {
                              return (
                                <Box
                                  sx={{
                                    backgroundColor: "#F5F6F8",
                                    borderTopRightRadius: "8px",

                                    padding: "6px 12px",
                                    // margin: "5px 0 8px 0",
                                    margin: "8px 0",
                                    textWrap: "wrap",
                                  }}
                                  display={"flex"}
                                  gap={1}
                                  mb={1}
                                  key={Number(unit.id)}
                                >
                                  {selectedView === "fish" ? (
                                    // <Tooltip title="Fish" placement="top">
                                    //   <Button
                                    //     id="basic-button"
                                    //     aria-controls={
                                    //       open ? "basic-menu" : undefined
                                    //     }
                                    //     aria-haspopup="true"
                                    //     aria-expanded={
                                    //       open ? "true" : undefined
                                    //     }
                                    //     onClick={(e) =>
                                    //       handleClick(e, unit, true)
                                    //     }
                                    //     disabled={unit.isManager ? false : true}
                                    //     className=""
                                    //     type="button"
                                    //     variant="contained"
                                    //     sx={{
                                    //       background: "#06A19B",
                                    //       fontWeight: "bold",
                                    //       paddingX: 0.75,
                                    //       paddingY: 0.25,
                                    //       borderRadius: "8px",
                                    //       alignItems: "center",
                                    //       minWidth: "fit-content",
                                    //       margin: "auto",
                                    //     }}
                                    //   >
                                    //     <svg
                                    //       xmlns="http://www.w3.org/2000/svg"
                                    //       width="22px"
                                    //       height="22px"
                                    //       viewBox="0 0 24 24"
                                    //     >
                                    //       <path
                                    //         fill="none"
                                    //         stroke="currentColor"
                                    //         strokeLinecap="round"
                                    //         strokeLinejoin="round"
                                    //         strokeWidth="1"
                                    //         d="M6.008 12h-.01M11 16.042c.463.153.908.329 1.31.61m0 0A3.95 3.95 0 0 1 14 19.885a.117.117 0 0 1-.118.116c-2.917-.013-4.224-.507-4.773-1.322L8 16.857c-2.492-.503-4.782-2.094-6-4.774c3-6.597 12.5-6.597 15.5 0m-5.19 4.57c2.17-.66 4.105-2.184 5.19-4.57m-5.19-4.569A3.95 3.95 0 0 0 14 4.282c0-.826-4.308.342-4.89 1.206L8 7.31m9.5 4.773c.333-.66 2.1-2.969 4.5-2.969c-.833.825-2.2 3.959-1 5.938c-1.2 0-3-2.309-3.5-2.969"
                                    //         color="currentColor"
                                    //       />
                                    //     </svg>
                                    //   </Button>
                                    // </Tooltip>
                                    <></>
                                  ) : (
                                    <Tooltip title="Water" placement="top">
                                      <Button
                                        id="basic-button"
                                        aria-controls={
                                          open ? "basic-menu" : undefined
                                        }
                                        aria-haspopup="true"
                                        aria-expanded={
                                          open ? "true" : undefined
                                        }
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
                                          margin: "auto",
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
                                            d="M6.008 12h-.01M11 16.042c.463.153.908.329 1.31.61m0 0A3.95 3.95 0 0 1 14 19.885a.117.117 0 0 1-.118.116c-2.917-.013-4.224-.507-4.773-1.322L8 16.857c-2.492-.503-4.782-2.094-6-4.774c3-6.597 12.5-6.597 15.5 0m-5.19 4.57c2.17-.66 4.105-2.184 5.19-4.57m-5.19-4.569A3.95 3.95 0 0 0 14 4.282c0-.826-4.308.342-4.89 1.206L8 7.31m9.5 4.773c.333-.66 2.1-2.969 4.5-2.969c-.833.825-2.2 3.959-1 5.938c-1.2 0-3-2.309-3.5-2.969"
                                            stroke="currentColor"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-width="1"
                                            color="currentColor"
                                          ></path>
                                        </svg>
                                      </Button>
                                    </Tooltip>
                                  )}
                                  <Box
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                    }}
                                  >
                                    <Button
                                      onClick={(e) => {
                                        handleClickTest(e),
                                          setIsHistoryDisabled(
                                            selectedView === "water"
                                              ? unit?.WaterManageHistoryAvgrage
                                                  ?.length == 0
                                              : selectedView === "fish"
                                              ? unit?.fishManageHistory
                                                  ?.length === 0
                                              : false
                                          );
                                      }}
                                    >
                                      {" "}
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="1.1em"
                                        style={{
                                          marginLeft: "10px",
                                          marginTop: "10px",
                                        }}
                                        height="1.1em"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          fill="currentColor"
                                          d="M14 18a2 2 0 1 1-4 0a2 2 0 0 1 4 0m0-6a2 2 0 1 1-4 0a2 2 0 0 1 4 0m-2-4a2 2 0 1 0 0-4a2 2 0 0 0 0 4"
                                        />
                                      </svg>
                                    </Button>
                                  </Box>
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

        <TransferModal
          open={openTransferModal}
          setOpen={setOpenTransferModal}
          selectedProduction={selectedProduction}
          farms={farms}
          batches={batches}
          productions={productions}
        />
        <Test open={test} setOpen={setTest} />
        <WaterQualityParameter
          open={openWaterQualityModal}
          setOpen={setOpenWaterQualityModal}
          selectedProduction={selectedProduction}
          farms={farms}
          productions={productions}
        />
      </>
    </>
  );
}
