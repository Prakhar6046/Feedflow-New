"use client";
import { formattedDate } from "@/app/_lib/utils";
import { waterSampleHistoryHead } from "@/app/_lib/utils/tableHeadData";
import {
  Production,
  WaterManageHistoryGroup,
} from "@/app/_typeModels/production";
import { Tab } from "@mui/base/Tab";
import { TabPanel } from "@mui/base/TabPanel";
import { Tabs, TabsContext } from "@mui/base/Tabs";
import { TabsList } from "@mui/base/TabsList";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Paper,
  TableBody,
  TableSortLabel,
  Tooltip,
  Typography,
} from "@mui/material";
import Table from "@mui/material/Table";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import React, { useEffect, useState } from "react";
import WaterSampleHistoryModal from "../models/WaterSampleHistory";
import WaterHistoryCharts from "../production/waterHistoryCharts/WaterHistoryCharts";
import { getCookie, setCookie } from "cookies-next";
import { Farm } from "@/app/_typeModels/Farm";
const style = {
  bgcolor: "background.paper",
  boxShadow: 24,
};
interface Props {
  tableData: any;
  productions: Production[];
  farms: Farm[];
}
const WaterManageHistoryTable: React.FC<Props> = ({
  tableData,
  productions,
  farms,
}) => {
  const currentTab = getCookie("waterTab");
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("Farm");
  const [tab, setTab] = useState(currentTab ? currentTab : "list");
  console.log("pro", productions);
  const [isWaterSampleHistory, setIsWaterSampleHistory] =
    useState<boolean>(false);
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

  const groupedData: WaterManageHistoryGroup[] = productions?.reduce(
    (result: any, item) => {
      // Find or create a farm group
      let farmGroup: any = result.find(
        (group: any) => group.farm === item.farm.name
      );
      if (!farmGroup) {
        farmGroup = { unit: item.productionUnit.name, units: [] };
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
        waterManageHistory: item.WaterManageHistory,
        WaterManageHistoryAvgrage: item.WaterManageHistoryAvgrage,
      });

      return result;
    },
    []
  );
  useEffect(() => {
    if (tab) {
      setCookie("waterTab", tab);
    }
  }, [tab]);

  return (
    <Box
      sx={{
        width: "100%",
        borderRadius: "14px",
        boxShadow: "0px 0px 16px 5px #0000001A",
        my: 4,
        px: 5,
        pt: 2.5,
        pb: 5,
      }}
    >
      <Tabs
        defaultValue={1}
        style={{
          width: "100%",
          // overflow: "hidden",
        }}
      >
        {" "}
        <Grid
          container
          columnSpacing={3}
          rowSpacing={1}
          alignItems={"center"}
          flexWrap={"wrap"}
          justifyContent={"space-between"}
          mb={4}
        >
          {" "}
          <Grid item xs={"auto"}>
            <TabsList
              style={{
                borderRadius: "25px",
                border: "1px solid #A6A6A6",
                width: "186px",
              }}
              onClick={(e: any) => {
                const v = e.target;
                setTab(v.id);
              }}
            >
              <Tab
                value={1}
                id="list"
                className={`tab-item ${tab === "list" ? "active" : ""}`}
              >
                List
              </Tab>
              <Tab
                value={2}
                id="graph"
                className={`tab-item ${tab === "graph" ? "active" : ""}`}
              >
                Graph
              </Tab>
            </TabsList>
          </Grid>
          {/*hISTORY-CHART*/}
          {tab === "graph" && (
            <>
              <Grid item xl={4} lg={7} md={9} xs={12} className="form-grid">
                <FormControl>
                  <FormLabel>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DemoContainer
                        sx={{
                          display: "flex",
                          flexDirection: "row",
                          gap: 3,
                          alignItems: "center",
                          margin: "0",
                        }}
                        components={["DatePicker", "DatePicker", "DatePicker"]}
                      >
                        <DatePicker
                          label="Start Date"
                          slotProps={{}}
                          className="date-picker"
                        />
                        <DatePicker
                          label="End Date"
                          slotProps={{}}
                          sx={{
                            marginTop: "0",

                            borderRadius: "6px",
                          }}
                          className="date-picker"
                        />
                      </DemoContainer>
                    </LocalizationProvider>
                  </FormLabel>
                </FormControl>
              </Grid>
              <Grid item xl={6} xs={12} className="form-grid">
                {/* Heading for Annotations */}
                <Typography
                  component="h6"
                  sx={{
                    fontWeight: "500",
                    color: "#67737F",
                    marginLeft: "10px",
                  }}
                >
                  Annotations
                </Typography>

                {/* Container for Checkboxes */}
                <Box
                  display="flex"
                  flexDirection="row"
                  alignItems="center"
                  gap={{
                    xl: "20px",
                    md: "10px",
                    xs: "2px",
                  }}
                >
                  {/* First Checkbox */}
                  <Box>
                    <FormControlLabel
                      style={{ marginInline: "auto" }}
                      control={
                        <Checkbox
                          defaultChecked
                          sx={{
                            color: "#06A19B",
                            "&.Mui-checked": {
                              color: "#06A19B",
                            },
                          }}
                        />
                      }
                      label={
                        <Typography
                          sx={{
                            color: "#67737F",
                            fontWeight: "500",
                          }}
                        >
                          Limits
                        </Typography>
                      }
                    />
                  </Box>

                  {/* Second Checkbox */}
                  <Box display="flex" alignItems="center">
                    <FormControlLabel
                      style={{ marginInline: "auto" }}
                      control={
                        <Checkbox
                          defaultChecked
                          sx={{
                            color: "#06A19B",
                            "&.Mui-checked": {
                              color: "#06A19B",
                            },
                          }}
                        />
                      }
                      label={
                        <Typography
                          sx={{
                            color: "#67737F",
                            fontWeight: "500",
                          }}
                        >
                          Ranges
                        </Typography>
                      }
                    />
                  </Box>

                  {/* Third Checkbox */}
                  <Box display="flex" alignItems="center">
                    <FormControlLabel
                      style={{ marginInline: "auto" }}
                      control={
                        <Checkbox
                          defaultChecked
                          sx={{
                            color: "#06A19B",
                            "&.Mui-checked": {
                              color: "#06A19B",
                            },
                          }}
                        />
                      }
                      label={
                        <Typography
                          sx={{
                            color: "#67737F",
                            fontWeight: "500",
                          }}
                        >
                          Red
                        </Typography>
                      }
                    />
                  </Box>

                  {/* Fourth Checkbox */}
                  <Box display="flex" alignItems="center">
                    <FormControlLabel
                      style={{ marginInline: "auto" }}
                      control={
                        <Checkbox
                          defaultChecked
                          sx={{
                            color: "#06A19B",
                            "&.Mui-checked": {
                              color: "#06A19B",
                            },
                          }}
                        />
                      }
                      label={
                        <Typography
                          sx={{
                            color: "#67737F",
                            fontWeight: "500",
                          }}
                        >
                          Orange
                        </Typography>
                      }
                    />
                  </Box>

                  {/* Fifth Checkbox */}
                  <Box display="flex" alignItems="center">
                    <FormControlLabel
                      style={{ marginInline: "auto" }}
                      control={
                        <Checkbox
                          defaultChecked
                          sx={{
                            color: "#06A19B",
                            "&.Mui-checked": {
                              color: "#06A19B",
                            },
                          }}
                        />
                      }
                      label={
                        <Typography
                          sx={{
                            color: "#67737F",
                            fontWeight: "500",
                          }}
                        >
                          Green
                        </Typography>
                      }
                    />
                  </Box>

                  <Box>
                    <Button
                      type="submit"
                      variant="contained"
                      sx={{
                        color: "#fff",
                        background: "#06A19B",
                        fontWeight: 600,
                        padding: "6px 16px",
                        width: "fit-content",
                        textTransform: "capitalize",
                        borderRadius: "8px",
                        border: "1px solid #06A19B",
                        textWrap: "nowrap",
                      }}
                    >
                      Create Record
                    </Button>
                  </Box>
                </Box>
              </Grid>
            </>
          )}
        </Grid>
        <TabPanel value={1}>
          <Paper
            sx={{
              width: "100%",
              overflow: "hidden",
              borderRadius: "14px",
              boxShadow: "0px 0px 16px 5px #0000001A",
              textAlign: "center",
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
                  {groupedData && groupedData?.length > 0 ? (
                    groupedData?.map(
                      (farm: WaterManageHistoryGroup, i: number) => {
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
                                      padding: "8px 12px",
                                      margin: "8px 0",
                                      textWrap: "nowrap",
                                    }}
                                  >
                                    {unit.productionUnit.name}
                                    <Tooltip
                                      title="View history"
                                      placement="top"
                                    >
                                      <Box
                                        sx={{
                                          pr: 3,
                                        }}
                                      >
                                        <Button
                                          onClick={() =>
                                            setIsWaterSampleHistory(true)
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
                            </TableCell>{" "}
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
                              {farm &&
                                farm.units[0].WaterManageHistoryAvgrage &&
                                farm.units[0].WaterManageHistoryAvgrage.map(
                                  (unit, i) => {
                                    return (
                                      <Typography
                                        key={i}
                                        variant="h6"
                                        sx={{
                                          fontWeight: 500,
                                          fontSize: 14,
                                          backgroundColor: "#F5F6F8",
                                          padding: `${
                                            unit.createdAt
                                              ? "8px 12px 8px 0"
                                              : "19px 12px 19px 0"
                                          }`,
                                          margin: "8px 0",
                                          textWrap: "nowrap",
                                        }}
                                      >
                                        {formattedDate(String(unit.createdAt))}
                                      </Typography>
                                    );
                                  }
                                )}
                            </TableCell>{" "}
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
                              {farm &&
                                farm.units[0].WaterManageHistoryAvgrage &&
                                farm.units[0].WaterManageHistoryAvgrage.map(
                                  (unit, i) => {
                                    return (
                                      <Typography
                                        key={i}
                                        variant="h6"
                                        sx={{
                                          fontWeight: 500,
                                          fontSize: 14,
                                          backgroundColor: "#F5F6F8",
                                          padding: `${
                                            unit?.waterTemp
                                              ? "8px 12px 8px 0"
                                              : "19px 12px 19px 0"
                                          }`,
                                          margin: "8px 0",
                                          // marginBottom: "10px",
                                          // padding: "21px",
                                          textWrap: "nowrap",
                                        }}
                                      >
                                        {unit.waterTemp ?? ""}
                                      </Typography>
                                    );
                                  }
                                )}
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
                              {farm &&
                                farm.units[0].WaterManageHistoryAvgrage &&
                                farm.units[0].WaterManageHistoryAvgrage.map(
                                  (unit, i) => {
                                    return (
                                      <Typography
                                        key={i}
                                        variant="h6"
                                        sx={{
                                          fontWeight: 500,
                                          fontSize: 14,
                                          backgroundColor: "#F5F6F8",
                                          padding: `${
                                            unit.DO
                                              ? "8px 12px 8px 0"
                                              : "19px 12px 19px 0"
                                          }`,
                                          margin: "8px 0",
                                          textWrap: "nowrap",
                                        }}
                                      >
                                        {unit.DO ?? ""}
                                      </Typography>
                                    );
                                  }
                                )}
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
                              {farm &&
                                farm.units[0].WaterManageHistoryAvgrage &&
                                farm.units[0].WaterManageHistoryAvgrage.map(
                                  (unit, i) => {
                                    return (
                                      <Typography
                                        key={i}
                                        variant="h6"
                                        sx={{
                                          fontWeight: 500,
                                          fontSize: 14,
                                          padding: `${
                                            unit.TSS
                                              ? "8px 12px 8px 0"
                                              : "19px 12px 19px 0"
                                          }`,
                                          backgroundColor: "#F5F6F8",
                                          margin: "8px 0",

                                          textWrap: "nowrap",
                                        }}
                                      >
                                        {unit.TSS ?? ""}
                                      </Typography>
                                    );
                                  }
                                )}
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
                              {farm &&
                                farm.units[0].WaterManageHistoryAvgrage &&
                                farm.units[0].WaterManageHistoryAvgrage.map(
                                  (unit, i) => {
                                    return (
                                      <Typography
                                        key={i}
                                        variant="h6"
                                        sx={{
                                          fontWeight: 500,
                                          fontSize: 14,
                                          backgroundColor: "#F5F6F8",
                                          padding: `${
                                            unit?.NH4
                                              ? "8px 12px 8px 0"
                                              : "19px 12px 19px 0"
                                          }`,
                                          margin: "8px 0",
                                          // marginBottom: "10px",
                                          // padding: "21px",
                                          textWrap: "nowrap",
                                        }}
                                      >
                                        {unit?.NH4 ?? ""}
                                      </Typography>
                                    );
                                  }
                                )}
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
                              {farm &&
                                farm.units[0].WaterManageHistoryAvgrage &&
                                farm.units[0].WaterManageHistoryAvgrage.map(
                                  (unit, i) => {
                                    return (
                                      <Typography
                                        key={i}
                                        variant="h6"
                                        sx={{
                                          fontWeight: 500,
                                          fontSize: 14,
                                          backgroundColor: "#F5F6F8",
                                          padding: `${
                                            unit?.NO3
                                              ? "8px 12px 8px 0"
                                              : "19px 12px 19px 0"
                                          }`,
                                          margin: "8px 0",
                                          // marginBottom: "10px",
                                          textWrap: "nowrap",
                                        }}
                                      >
                                        {unit.NO3 ?? ""}
                                      </Typography>
                                    );
                                  }
                                )}
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
                              {farm &&
                                farm.units[0].WaterManageHistoryAvgrage &&
                                farm.units[0].WaterManageHistoryAvgrage.map(
                                  (unit, i) => {
                                    return (
                                      <Typography
                                        key={i}
                                        variant="h6"
                                        sx={{
                                          fontWeight: 500,
                                          fontSize: 14,
                                          backgroundColor: "#F5F6F8",
                                          padding: `${
                                            unit?.NO2
                                              ? "8px 12px 8px 0"
                                              : "19px 12px 19px 0"
                                          }`,
                                          margin: "8px 0",
                                          // marginBottom: "10px",
                                          textWrap: "nowrap",
                                        }}
                                      >
                                        {unit.NO2 ?? ""}
                                      </Typography>
                                    );
                                  }
                                )}
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
                              {farm &&
                                farm.units[0].WaterManageHistoryAvgrage &&
                                farm.units[0].WaterManageHistoryAvgrage.map(
                                  (unit, i) => {
                                    return (
                                      <Typography
                                        key={i}
                                        variant="h6"
                                        sx={{
                                          fontWeight: 500,
                                          fontSize: 14,
                                          backgroundColor: "#F5F6F8",
                                          padding: `${
                                            unit?.ph
                                              ? "8px 12px 8px 0"
                                              : "19px 12px 19px 0"
                                          }`,
                                          margin: "8px 0",
                                          // marginBottom: "10px",
                                          textWrap: "nowrap",
                                        }}
                                      >
                                        {unit.ph ?? ""}
                                      </Typography>
                                    );
                                  }
                                )}
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
                              {farm &&
                                farm.units[0].WaterManageHistoryAvgrage &&
                                farm.units[0].WaterManageHistoryAvgrage.map(
                                  (unit, i) => {
                                    return (
                                      <Typography
                                        key={i}
                                        variant="h6"
                                        sx={{
                                          fontWeight: 500,
                                          fontSize: 14,
                                          backgroundColor: "#F5F6F8",
                                          padding: `${
                                            unit?.visibility
                                              ? "8px 12px 8px 0"
                                              : "19px 12px 19px 0"
                                          }`,
                                          margin: "8px 0",
                                          // marginBottom: "10px",
                                          textWrap: "nowrap",
                                        }}
                                      >
                                        {unit.visibility ?? ""}
                                      </Typography>
                                    );
                                  }
                                )}
                            </TableCell>
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

            <WaterSampleHistoryModal
              open={isWaterSampleHistory}
              setOpen={setIsWaterSampleHistory}
              tableData={waterSampleHistoryHead}
              productions={productions}
            />
          </Paper>
        </TabPanel>
        <TabPanel value={2}>
          <WaterHistoryCharts
            productions={productions}
            groupedData={groupedData}
            farms={farms}
          />
        </TabPanel>
      </Tabs>
    </Box>
  );
};

export default WaterManageHistoryTable;
