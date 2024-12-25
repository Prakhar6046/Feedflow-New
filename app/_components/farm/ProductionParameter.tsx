import React, { useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
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

// Function to create data (assuming this structure for the data)
function createData(
  name: string,
  calories: number,
  fat: number,
  carbs: number,
  protein: number
) {
  return { name, calories, fat, carbs, protein };
}

// Initial data
const initialRows = [
  createData("Water Temperature °C"),
  createData("Dissolved Oxygen (DO), mg/L"),
  createData("Total Suspended solids (TSS)"),
  createData("Ammonia (NH₄),mg/L"),
  createData("Nitrate (NO₃),mg/L"),
  createData("Nitrite (NO₂),mg/L"),
  createData("pH"),
  createData("Visibility,cm"),
];

export default function BasicTable() {
  // State to hold the rows of data
  const [rows, setRows] = useState(initialRows);

  // Function to handle input changes
  const handleInputChange = (
    rowIndex: number,
    field: string,
    value: number
  ) => {
    const updatedRows = [...rows];

    setRows(updatedRows);
  };

  return (
    <Box>
      <Paper
        sx={{
          width: "100%",
          overflow: "hidden",
          borderRadius: "14px",
          boxShadow: "0px 0px 16px 5px #0000001A",
        }}
      >
        <Grid container spacing={2}>
          {" "}
          <Grid item lg={9} xs={7}>
            <Typography
              variant="h6"
              fontWeight={700}
              sx={{
                fontSize: {
                  xl: 18,

                  xs: 12,
                },
                margin: 2,
                textWrap: {
                  lg: "nowrap",
                  xs: "wrap",
                },
              }}
            >
              Water Quality Parameters (Predicted)
            </Typography>
            <TableContainer>
              <Table aria-label="sticky table">
                <TableHead>
                  <TableRow
                    sx={{
                      backgroundColor: "#06a19b",
                      textAlign: "center",
                      margin: "0",
                      padding: "0",
                    }}
                  >
                    <TableCell align="center"></TableCell>
                    <TableCell align="center" sx={{ color: "white" }}>
                      Jan
                    </TableCell>
                    <TableCell align="center" sx={{ color: "white" }}>
                      Feb
                    </TableCell>
                    <TableCell align="center" sx={{ color: "white" }}>
                      Mar
                    </TableCell>
                    <TableCell align="center" sx={{ color: "white" }}>
                      Apr
                    </TableCell>
                    <TableCell align="center" sx={{ color: "white" }}>
                      May
                    </TableCell>
                    <TableCell align="center" sx={{ color: "white" }}>
                      Jun
                    </TableCell>
                    <TableCell align="center" sx={{ color: "white" }}>
                      Jul
                    </TableCell>
                    <TableCell align="center" sx={{ color: "white" }}>
                      Aug
                    </TableCell>
                    <TableCell align="center" sx={{ color: "white" }}>
                      Sep
                    </TableCell>
                    <TableCell align="center" sx={{ color: "white" }}>
                      Oct
                    </TableCell>
                    <TableCell align="center" sx={{ color: "white" }}>
                      Nov
                    </TableCell>
                    <TableCell align="center" sx={{ color: "white" }}>
                      Dec
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row, rowIndex) => (
                    <TableRow
                      key={row.name}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                        backgroundColor: "#F5F6F8",
                        fontWeight: "700",
                        padding: "0px",
                        margin: "0px",
                      }}
                    >
                      <TableCell
                        component="td"
                        scope="row"
                        sx={{
                          margin: "0px",
                          padding: "8px",
                          textWrap: "nowrap",
                        }}
                      >
                        {row.name}
                      </TableCell>
                      {[
                        "Jan",
                        "Feb",
                        "Mar",
                        "Apr",
                        "May",
                        "Jun",
                        "Jul",
                        "Aug",
                        "Sep",
                        "Oct",
                        "Nov",
                        "Dec",
                      ].map((field, index) => (
                        <TableCell
                          key={index}
                          className=" table-border"
                          sx={{
                            borderBottomWidth: 2,
                            borderBottomColor: "#ececec",
                            margin: "0",
                            padding: "5px 1px",
                            textWrap: "nowrap",
                            textAlign: "center",
                          }}
                        >
                          <input
                            className="number-items"
                            type="number"
                            placeholder="0"
                            style={{
                              maxWidth: "80px",
                              padding: "4px 2px",

                              border: "none",
                              textAlign: "center",
                              fontSize: "14px",
                              fontWeight: "500",
                              color: "#555555",
                            }}
                          />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          {/* grid-2 */}
          <Grid item lg={2} xs={3}>
            <Typography
              variant="h6"
              fontWeight={700}
              sx={{
                fontSize: {
                  xl: 18,

                  xs: 12,
                },
                margin: 2,
                textWrap: {
                  lg: "nowrap",
                  xs: "wrap",
                },
              }}
            >
              Ideal Range
            </Typography>
            <TableContainer>
              <Table aria-label="sticky table">
                <TableHead>
                  <TableRow
                    sx={{
                      backgroundColor: "#06a19b",
                      textAlign: "center",
                    }}
                  >
                    <TableCell
                      align="center"
                      sx={{ color: "white", borderRight: "1px solid #F5F6F8" }}
                    >
                      Min
                    </TableCell>

                    <TableCell align="center" sx={{ color: "white" }}>
                      Max
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {rows.map((row, rowIndex) => (
                    <TableRow
                      key={row.name}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                        backgroundColor: "#F5F6F8",
                        fontWeight: "700",
                      }}
                    >
                      {["Min", "Max"].map((field, index) => (
                        <TableCell
                          key={index}
                          className=" table-border"
                          sx={{
                            borderBottomWidth: 2,
                            borderBottomColor: "#ececec",

                            padding: "5px 1px",
                            textWrap: "nowrap",
                            textAlign: "center",
                          }}
                        >
                          <input
                            className="number-items"
                            type="number"
                            placeholder="0"
                            style={{
                              maxWidth: "90px",
                              padding: "4px 2px",
                              textWrap: "nowrap",
                              border: "none",
                              textAlign: "center",
                              fontSize: "14px",
                              fontWeight: "500",
                              color: "#555555",
                            }}
                          />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          {/* grid-3 */}
          <Grid item lg={1} xs={2}>
            <Typography
              variant="h6"
              fontWeight={700}
              minWidth={"70px"}
              sx={{
                fontSize: {
                  xl: 18,
                  xs: 12,
                },
                margin: "2",
              }}
            >
              Apply to all units
            </Typography>
            <TableContainer>
              <Table aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={{
                        borderBottom: "0px",
                        paddingTop: "40px",
                      }}
                    ></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row, rowIndex) => (
                    <TableRow
                      key={row.name}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                      }}
                    >
                      <TableCell
                        sx={{
                          textAlign: "center",
                          border: "none",
                          padding: "0px",
                          display: "flex",
                          alignItems: "start",
                        }}
                      >
                        <FormControlLabel
                          style={{
                            fontSize: "14px",
                            fontWeight: "500",
                            color: "#555555",

                            marginInline: "auto",
                          }}
                          control={<Checkbox defaultChecked />}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}
