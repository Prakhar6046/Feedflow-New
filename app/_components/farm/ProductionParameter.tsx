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
import { Years } from "@/app/_lib/utils";
import { waterQualityPredictedHead } from "@/app/_lib/utils/tableHeadData";
import { SubmitHandler, useForm } from "react-hook-form";

// Function to create data (assuming this structure for the data)

interface Props {
  setActiveStep: (val: number) => void;
}
interface FormData {
  predictedValues: Record<string, Record<number, string>>;
  idealRange: Record<string, { min: string; max: string }>;
  applyToAll: Record<string, boolean>;
}
export default function BasicTable({ setActiveStep }: Props) {
  const { control, handleSubmit } = useForm<FormData>({
    defaultValues: {
      predictedValues: {},
      idealRange: {},
      applyToAll: {},
    },
  });
  const onSubmit: SubmitHandler<FormData> = (data) => {
    console.log("Form Data:", data);
  };
  return (
    <Box>
      <form>
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

                      {Years.map((year, i) => {
                        return (
                          <TableCell
                            align="center"
                            sx={{ color: "white" }}
                            key={i}
                          >
                            {year}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {waterQualityPredictedHead.map((head, i) => (
                      <TableRow
                        key={i}
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
                          {head}
                        </TableCell>
                        {Years.map((year, index) => (
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
                        sx={{
                          color: "white",
                          borderRight: "1px solid #F5F6F8",
                        }}
                      >
                        Min
                      </TableCell>

                      <TableCell align="center" sx={{ color: "white" }}>
                        Max
                      </TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {waterQualityPredictedHead.map((head, i) => (
                      <TableRow
                        key={i}
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
                    {waterQualityPredictedHead.map((head, i) => (
                      <TableRow
                        key={i}
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
                            label=""
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

        <Box
          display={"flex"}
          justifyContent={"flex-end"}
          alignItems={"center"}
          gap={3}
          mt={1}
        >
          <Button
            type="button"
            variant="contained"
            onClick={() => setActiveStep(2)}
            sx={{
              background: "#fff",
              color: "#06A19B",
              fontWeight: 600,
              padding: "6px 16px",
              width: "fit-content",
              textTransform: "capitalize",
              borderRadius: "8px",
              border: "1px solid #06A19B",
            }}

            // onClick={() => setCookie("activeStep", 0)}
          >
            Previous
          </Button>
          <Button
            type="button"
            variant="contained"
            onClick={() => setActiveStep(4)}
            sx={{
              background: "#06A19B",
              fontWeight: 600,
              padding: "6px 16px",
              width: "fit-content",
              textTransform: "capitalize",
              borderRadius: "8px",
            }}
          >
            Next
          </Button>
        </Box>
      </form>
    </Box>
  );
}
