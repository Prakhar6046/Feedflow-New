"use client";
import {
  FishManageHistoryGroup,
  Production,
} from "@/app/_typeModels/production";
import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Paper,
  Stack,
  TableBody,
  TableSortLabel,
  Typography,
  Button,
} from "@mui/material";
import Table from "@mui/material/Table";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Tabs } from "@mui/base/Tabs";
import { TabsList } from "@mui/base/TabsList";
import { TabPanel } from "@mui/base/TabPanel";
import { Tab } from "@mui/base/Tab";
import React, { useState } from "react";
import MuiTextField from "@mui/material/TextField";
import Input from "../theme/overrides/Input";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { DateField } from "@mui/x-date-pickers/DateField";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { pink } from "@mui/material/colors";

const TextField = React.forwardRef((props, ref) => (
  <MuiTextField {...props} ref={ref} size="small" />
));
const style = {
  bgcolor: "background.paper",
  boxShadow: 24,
};
interface Props {
  tableData: any;
  productions: Production[];
}
const FishManageHistoryTable: React.FC<Props> = ({
  tableData,
  productions,
}) => {
  const [value, setValue] = useState(1); // State to track active tab

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("Farm");

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
  const groupedData: any = productions?.reduce((result: any, item) => {
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
    });

    return result;
  }, []);

  return (
    <Box
      sx={{
        width: "100%",
        overflow: "hidden",
        borderRadius: "14px",
        boxShadow: "0px 0px 16px 5px #0000001A",
        margin: 4,
      }}
    >
      <Tabs
        defaultValue={1}
        style={{
          width: "100%",
          overflow: "hidden",
        }}
      >
        {" "}
        <Grid
          container
          spacing={3}
          alignItems={"center"}
          sx={{
            margin: "32px",
            alignItems: "center",
          }}
        >
          {" "}
          <Grid
            item
            xl={2}
            lg={5}
            md={3}
            xs={12}
            alignItems={"center"}
            className="form-grid"
          >
            <TabsList
              style={{
                borderRadius: "25px",

                border: "1px solid #A6A6A6",
                width: "186px",
              }}
            >
              <Tab value={1} className="tab-item">
                List
              </Tab>
              <Tab value={2} className="tab-item">
                Graph
              </Tab>
            </TabsList>
          </Grid>
          {/*hISTORY-CHART*/}
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
        </Grid>
        <TabPanel value={1}>
          <Paper
            sx={{
              width: "100%",
              overflow: "hidden",
              borderRadius: "14px",
              boxShadow: "0px 0px 16px 5px #0000001A",
              textAlign: "center",
              margin: 4,
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
                      (farm: FishManageHistoryGroup, i: number) => {
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
                                maxWidth: 250,
                                borderBottomColor: "#ececec",
                                borderBottomWidth: 2,
                                fontWeight: 700,
                                textWrap: "nowrap",
                                paddingLeft: {
                                  lg: 10,
                                  md: 7,
                                  xs: 4,
                                },
                                pr: 2,
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
                                    <Box
                                      sx={{
                                        pr: 3,
                                      }}
                                    ></Box>
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
                                farm.units[0].fishManageHistory &&
                                farm.units[0].fishManageHistory.map(
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
                                            unit?.fishCount
                                              ? "8px 12px 8px 0"
                                              : "19px 12px 19px 0"
                                          }`,
                                          margin: "8px 0",
                                          // marginBottom: "10px",
                                          // padding: "21px",
                                          textWrap: "nowrap",
                                        }}
                                      >
                                        {unit.currentDate
                                          ? unit.currentDate
                                          : new Date(
                                              String(unit?.updatedAt)
                                            ).toLocaleDateString()}
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
                                farm.units[0].fishManageHistory &&
                                farm.units[0].fishManageHistory.map(
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
                                            unit?.fishCount
                                              ? "8px 12px 8px 0"
                                              : "19px 12px 19px 0"
                                          }`,
                                          margin: "8px 0",
                                          // marginBottom: "10px",
                                          // padding: "21px",
                                          textWrap: "nowrap",
                                        }}
                                      >
                                        {unit.field ? unit.field : "Stock"}
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
                                farm.units[0].fishManageHistory &&
                                farm.units[0].fishManageHistory.map(
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
                                            farm.units[0].fishSupply
                                              ?.batchNumber
                                              ? "8px 12px 8px 0"
                                              : "19px 12px 19px 0"
                                          }`,
                                          margin: "8px 0",
                                          textWrap: "nowrap",
                                        }}
                                      >
                                        {farm.units[0].fishSupply
                                          ?.batchNumber ?? ""}
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
                                farm.units[0].fishManageHistory &&
                                farm.units[0].fishManageHistory.map(
                                  (unit, i) => {
                                    return (
                                      <Typography
                                        key={i}
                                        variant="h6"
                                        sx={{
                                          fontWeight: 500,
                                          fontSize: 14,
                                          padding: `${
                                            farm.units[0].fishSupply?.age
                                              ? "8px 12px 8px 0"
                                              : "19px 12px 19px 0"
                                          }`,
                                          backgroundColor: "#F5F6F8",
                                          margin: "8px 0",

                                          textWrap: "nowrap",
                                        }}
                                      >
                                        {farm.units[0].fishSupply?.age ?? ""}
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
                                farm.units[0].fishManageHistory &&
                                farm.units[0].fishManageHistory.map(
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
                                            unit?.fishCount
                                              ? "8px 12px 8px 0"
                                              : "19px 12px 19px 0"
                                          }`,
                                          margin: "8px 0",
                                          // marginBottom: "10px",
                                          // padding: "21px",
                                          textWrap: "nowrap",
                                        }}
                                      >
                                        {unit?.fishCount ?? ""}
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
                                farm.units[0].fishManageHistory &&
                                farm.units[0].fishManageHistory.map(
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
                                            unit?.biomass
                                              ? "8px 12px 8px 0"
                                              : "19px 12px 19px 0"
                                          }`,
                                          margin: "8px 0",
                                          // marginBottom: "10px",
                                          textWrap: "nowrap",
                                        }}
                                      >
                                        {unit.biomass
                                          ? `${unit.biomass} kg`
                                          : ""}
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
                                farm.units[0].fishManageHistory &&
                                farm.units[0].fishManageHistory.map(
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
                                            unit?.meanWeight
                                              ? "8px 12px 8px 0"
                                              : "19px 12px 19px 0"
                                          }`,
                                          margin: "8px 0",
                                          // marginBottom: "10px",
                                          textWrap: "nowrap",
                                        }}
                                      >
                                        {unit.meanWeight
                                          ? `${unit.meanWeight} g`
                                          : ""}
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
                                farm.units[0].fishManageHistory &&
                                farm.units[0].fishManageHistory.map(
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
                                            unit?.meanLength
                                              ? "8px 12px 8px 0"
                                              : "19px 12px 19px 0"
                                          }`,
                                          margin: "8px 0",
                                          // marginBottom: "10px",
                                          textWrap: "nowrap",
                                        }}
                                      >
                                        {unit.meanLength
                                          ? `${unit.meanLength} mm`
                                          : ""}
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
                                farm.units[0].fishManageHistory &&
                                farm.units[0].fishManageHistory.map(
                                  (unit, i) => {
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
                                        {Number(unit.stockingDensityKG).toFixed(
                                          2
                                        ) ?? ""}
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
                                farm.units[0].fishManageHistory &&
                                farm.units[0].fishManageHistory.map(
                                  (unit, i) => {
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
                                        {Number(unit.stockingDensityNM).toFixed(
                                          2
                                        ) ?? ""}
                                      </Typography>
                                    );
                                  }
                                )}

                              {/* {farm.meanWeight ? `${farm.meanWeight}g` : ""} */}
                            </TableCell>{" "}
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
                              {farm &&
                                farm.units[0].fishManageHistory &&
                                farm.units[0].fishManageHistory.map(
                                  (unit, i) => {
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
          </Paper>
        </TabPanel>
        <TabPanel value={2}>Second page</TabPanel>
      </Tabs>
    </Box>
  );
};

export default FishManageHistoryTable;
