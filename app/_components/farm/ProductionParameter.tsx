import {
  getLocalItem,
  removeLocalItem,
  setLocalItem,
  Years,
} from "@/app/_lib/utils";
import { waterQualityPredictedHead } from "@/app/_lib/utils/tableHeadData";
import * as validationPattern from "@/app/_lib/utils/validationPatterns/index";
import * as validationMessage from "@/app/_lib/utils/validationsMessage/index";
import { ProductionParaMeterType } from "@/app/_typeModels/Farm";
import { selectFarm, selectIsEditFarm } from "@/lib/features/farm/farmSlice";
import { useAppSelector } from "@/lib/hooks";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { deleteCookie, getCookie } from "cookies-next";
import { useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";

// Function to create data (assuming this structure for the data)

interface Props {
  setActiveStep: (val: number) => void;
  productionParaMeter?: ProductionParaMeterType[];
  editFarm?: any;
}
interface FormData {
  predictedValues: Record<string, Record<number, string>>;
  idealRange: Record<string, { Min: string; Max: string }>;
  applyToAll: Record<string, boolean>;
  growthModel: string;
}
export default function ProductionParaMeter({
  setActiveStep,
  productionParaMeter,
  editFarm,
}: Props) {
  const isEditFarm = getCookie("isEditFarm");

  const farm = useAppSelector(selectFarm);

  const [formProductionParameters, setFormProductionParameters] =
    useState<any>();

  const {
    control,
    handleSubmit,
    watch,
    register,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      predictedValues: {},
    },
  });
  const allWatchObject = {
    predictedValues: watch("predictedValues"),
    idealRange: watch("idealRange"),
    growthModel: watch("growthModel"),
  };
  const onSubmit: SubmitHandler<FormData> = (data) => {
    const payload = {
      waterTemp: data.predictedValues["Water Temperature °C"],
      DO: data.predictedValues["Dissolved Oxygen (DO) mg/L"],
      TSS: data.predictedValues["Total Suspended solids (TSS)"],
      NH4: data.predictedValues["Ammonia (NH₄) mg/L"],
      NO3: data.predictedValues["Nitrate (NO₃) mg/L"],
      NO2: data.predictedValues["Nitrite (NO₂) mg/L"],
      ph: data.predictedValues["pH"],
      visibility: data.predictedValues["Visibility cm"],
      GrowthModel: data.growthModel,
      yearBasedPredicationId: editFarm?.WaterQualityPredictedParameters[0]?.id,
      idealRange: {
        waterTemp: data.idealRange["Water Temperature °C"],
        DO: data.idealRange["Dissolved Oxygen (DO) mg/L"],
        TSS: data.idealRange["Total Suspended solids (TSS)"],
        NH4: data.idealRange["Ammonia (NH₄) mg/L"],
        NO3: data.idealRange["Nitrate (NO₃) mg/L"],
        NO2: data.idealRange["Nitrite (NO₂) mg/L"],
        ph: data.idealRange["pH"],
        visibility: data.idealRange["Visibility cm"],
      },
    };
    setLocalItem("productionParametes", payload);
    setActiveStep(3);
  };
  // const onSubmit: SubmitHandler<FormData> = async (data) => {
  //   const farmData = getLocalItem("farmData");
  //   const farmProductionUnits = getLocalItem("farmProductionUnits");
  //   if (farmData && farmProductionUnits && data) {
  //     // Prevent API call if one is already in progress
  //     if (isApiCallInProgress) return;
  //     setIsApiCallInProgress(true);

  //     try {
  //       const loggedUserData = JSON.parse(userData);
  //       let payload;
  //       if (
  //         isEditFarm === "true" &&
  //         editFarm?.farmAddress?.id &&
  //         editFarm?.WaterQualityPredictedParameters[0]?.id
  //       ) {
  //         payload = {
  //           productionParameter: {
  //             waterTemp: data.predictedValues["Water Temperature °C"],
  //             DO: data.predictedValues["Dissolved Oxygen (DO) mg/L"],
  //             TSS: data.predictedValues["Total Suspended solids (TSS)"],
  //             NH4: data.predictedValues["Ammonia (NH₄) mg/L"],
  //             NO3: data.predictedValues["Nitrate (NO₃) mg/L"],
  //             NO2: data.predictedValues["Nitrite (NO₂) mg/L"],
  //             ph: data.predictedValues["pH"],
  //             visibility: data.predictedValues["Visibility cm"],
  //             GrowthModel: data.growthModel,
  //             yearBasedPredicationId:
  //               editFarm.WaterQualityPredictedParameters[0].id,
  //             idealRange: {
  //               waterTemp: data.idealRange["Water Temperature °C"],
  //               DO: data.idealRange["Dissolved Oxygen (DO) mg/L"],
  //               TSS: data.idealRange["Total Suspended solids (TSS)"],
  //               NH4: data.idealRange["Ammonia (NH₄) mg/L"],
  //               NO3: data.idealRange["Nitrate (NO₃) mg/L"],
  //               NO2: data.idealRange["Nitrite (NO₂) mg/L"],
  //               ph: data.idealRange["pH"],
  //               visibility: data.idealRange["Visibility cm"],
  //             },
  //           },

  //           farmAddress: {
  //             addressLine1: farmData.addressLine1,
  //             addressLine2: farmData.addressLine2,
  //             city: farmData.city,
  //             province: farmData.province,
  //             zipCode: farmData.zipCode,
  //             country: farmData.country,
  //             id: editFarm.farmAddress?.id,
  //           },
  //           productionUnits: farmProductionUnits,
  //           name: farmData.name,
  //           farmAltitude: farmData.farmAltitude,
  //           fishFarmer: farmData.fishFarmer,
  //           lat: farmData.lat,
  //           lng: farmData.lng,
  //           id: editFarm?.id,
  //           organsationId: loggedUserData.organisationId,
  //           productions: editFarm.production,
  //           mangerId: farmData.mangerId ? farmData.mangerId : null,
  //           userId: loggedUserData.id,
  //         };
  //       } else {
  //         payload = {
  //           productionParameter: {
  //             waterTemp: data.predictedValues["Water Temperature °C"],
  //             DO: data.predictedValues["Dissolved Oxygen (DO) mg/L"],
  //             TSS: data.predictedValues["Total Suspended solids (TSS)"],
  //             NH4: data.predictedValues["Ammonia (NH₄) mg/L"],
  //             NO3: data.predictedValues["Nitrate (NO₃) mg/L"],
  //             NO2: data.predictedValues["Nitrite (NO₂) mg/L"],
  //             ph: data.predictedValues["pH"],
  //             visibility: data.predictedValues["Visibility cm"],
  //             GrowthModel: data.growthModel,
  //             idealRange: {
  //               waterTemp: data.idealRange["Water Temperature °C"],
  //               DO: data.idealRange["Dissolved Oxygen (DO) mg/L"],
  //               TSS: data.idealRange["Total Suspended solids (TSS)"],
  //               NH4: data.idealRange["Ammonia (NH₄) mg/L"],
  //               NO3: data.idealRange["Nitrate (NO₃) mg/L"],
  //               NO2: data.idealRange["Nitrite (NO₂) mg/L"],
  //               ph: data.idealRange["pH"],
  //               visibility: data.idealRange["Visibility cm"],
  //             },
  //           },

  //           farmAddress: {
  //             addressLine1: farmData.addressLine1,
  //             addressLine2: farmData.addressLine2,
  //             city: farmData.city,
  //             province: farmData.province,
  //             zipCode: farmData.zipCode,
  //             country: farmData.country,
  //           },
  //           productionUnits: farmProductionUnits,
  //           name: farmData.name,
  //           farmAltitude: farmData.farmAltitude,
  //           lat: farmData.lat,
  //           lng: farmData.lng,
  //           fishFarmer: farmData.fishFarmer,
  //           organsationId: loggedUserData.organisationId,
  //           mangerId: farmData.mangerId ? farmData.mangerId : null,
  //           userId: loggedUserData.id,
  //         };
  //       }

  //       if (Object.keys(payload).length && payload.name) {
  //         const response = await fetch(
  //           `${
  //             isEditFarm === "true"
  //               ? "/api/farm/edit-farm"
  //               : "/api/farm/add-farm"
  //           }`,
  //           {
  //             method: "POST",
  //             headers: {
  //               "Content-Type": "application/json",
  //             },
  //             body: JSON.stringify(payload),
  //           }
  //         );
  //         const responseData = await response.json();
  //         toast.success(responseData.message);

  //         if (responseData.status) {
  //           setActiveStep(4);
  //           deleteCookie("isEditFarm");
  //           removeLocalItem("farmData");
  //           removeLocalItem("farmProductionUnits");
  //           removeLocalItem("productionParametes");
  //         }
  //       } else {
  //         toast.error("Please fill out the all feilds");
  //       }
  //     } catch (error) {
  //       toast.error("Something went wrong. Please try again.");
  //     } finally {
  //       setIsApiCallInProgress(false);
  //     }
  //   }
  // };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const formData = getLocalItem("productionParametes");
      setFormProductionParameters(formData);
    }
  }, []);

  useEffect(() => {
    if (
      isEditFarm &&
      productionParaMeter &&
      productionParaMeter[0]?.YearBasedPredication
    ) {
      const prediction = productionParaMeter[0].YearBasedPredication[0];

      // Creating the idealRange object for Min and Max
      const idealRange = {
        "Water Temperature °C": {
          Min: prediction?.idealRange?.waterTemp?.Min || "",
          Max: prediction?.idealRange?.waterTemp?.Max || "",
        },
        "Dissolved Oxygen (DO) mg/L": {
          Min: prediction?.idealRange?.DO?.Min || "",
          Max: prediction?.idealRange?.DO?.Max || "",
        },
        "Total Suspended solids (TSS)": {
          Min: prediction?.idealRange?.TSS?.Min || "",
          Max: prediction?.idealRange?.TSS?.Max || "",
        },
        "Ammonia (NH₄) mg/L": {
          Min: prediction?.idealRange?.NH4?.Min || "",
          Max: prediction?.idealRange?.NH4?.Max || "",
        },
        "Nitrate (NO₃) mg/L": {
          Min: prediction?.idealRange?.NO3?.Min || "",
          Max: prediction?.idealRange?.NO3?.Max || "",
        },
        "Nitrite (NO₂) mg/L": {
          Min: prediction?.idealRange?.NO2?.Min || "",
          Max: prediction?.idealRange?.NO2?.Max || "",
        },
        pH: {
          Min: prediction?.idealRange?.ph?.Min || "",
          Max: prediction?.idealRange?.ph?.Max || "",
        },
        "Visibility cm": {
          Min: prediction?.idealRange?.visibility?.Min || "",
          Max: prediction?.idealRange?.visibility?.Max || "",
        },
      };

      // Set the values in the form
      setValue("idealRange", idealRange);

      const predictedValues = {
        "Water Temperature °C": { ...prediction.waterTemp },
        "Dissolved Oxygen (DO) mg/L": { ...prediction.DO },
        "Total Suspended solids (TSS)": { ...prediction.TSS },
        "Ammonia (NH₄) mg/L": { ...prediction.NH4 },
        "Nitrate (NO₃) mg/L": { ...prediction.NO3 },
        "Nitrite (NO₂) mg/L": { ...prediction.NO2 },
        pH: { ...prediction.ph },
        "Visibility cm": { ...prediction.visibility },
      };

      setValue("predictedValues", predictedValues);
      setValue("growthModel", prediction.GrowthModel);
    }
  }, [productionParaMeter, isEditFarm, setValue]);

  useEffect(() => {
    if (formProductionParameters) {
      setValue("predictedValues", formProductionParameters.predictedValues);
      setValue("idealRange", formProductionParameters.idealRange);
      setValue("growthModel", formProductionParameters.growthModel);
    }
  }, [formProductionParameters]);
  return (
    <Box>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Paper
          sx={{
            width: "100%",
            overflow: "hidden",
            borderRadius: "14px",
            boxShadow: "0px 0px 16px 5px #0000001A",
          }}
        >
          <Grid container spacing={2}>
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
                        {Years.map((year: any, index) => (
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
                            <Controller
                              name={`predictedValues.${head}.${year}`}
                              rules={{
                                pattern:
                                  validationPattern.negativeNumberWithDot,
                              }}
                              control={control}
                              render={({ field }) => (
                                <input
                                  className="number-items"
                                  {...field}
                                  type="text"
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
                                  onInput={(e) => {
                                    const value = e.currentTarget.value;
                                    const regex = /^-?\d*\.?\d*$/;
                                    if (!regex.test(value)) {
                                      e.currentTarget.value = field.value || "";
                                    } else {
                                      field.onChange(value);
                                    }
                                  }}
                                />
                              )}
                            />
                            {errors?.predictedValues?.[head]?.[year] && (
                              <Typography
                                variant="body2"
                                color="error"
                                fontSize={13}
                                mt={0.5}
                              >
                                {validationMessage.NegativeNumberWithDot}
                              </Typography>
                            )}
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
                    {waterQualityPredictedHead.map((head: any, i) => (
                      <TableRow
                        key={i}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                          backgroundColor: "#F5F6F8",
                          fontWeight: "700",
                        }}
                      >
                        {(["Min", "Max"] as const).map((val, index) => (
                          <TableCell
                            key={index}
                            className="table-border"
                            sx={{
                              borderBottomWidth: 2,
                              borderBottomColor: "#ececec",
                              padding: "5px 1px",
                              textWrap: "nowrap",
                              textAlign: "center",
                            }}
                          >
                            <Controller
                              name={`idealRange.${head}.${val}`}
                              control={control}
                              rules={{
                                pattern:
                                  validationPattern.negativeNumberWithDot,
                              }}
                              render={({ field }) => (
                                <input
                                  className="number-items"
                                  type="text"
                                  {...field}
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
                                  onInput={(e) => {
                                    const value = e.currentTarget.value;
                                    const regex = /^-?\d*\.?\d*$/;
                                    if (!regex.test(value)) {
                                      e.currentTarget.value = field.value || "";
                                    } else {
                                      field.onChange(value);
                                    }
                                  }}
                                />
                              )}
                            />
                            {errors?.idealRange?.[head]?.[val] && (
                              <Typography
                                variant="body2"
                                color="error"
                                fontSize={13}
                                mt={0.5}
                              >
                                {validationMessage.NegativeNumberWithDot}
                              </Typography>
                            )}
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

        <Box>
          <Typography variant="subtitle1" fontWeight={500} marginBottom={3}>
            Growth Parameters
          </Typography>
          {/* div-1 */}
          <Grid item md={6} xs={12}>
            <FormControl fullWidth className="form-input" focused>
              <InputLabel id="feed-supply-select-label5">
                Growth Model *
              </InputLabel>
              <Select
                labelId="feed-supply-select-label5"
                id="feed-supply-select5"
                label="Growth Model *"
                {...register("growthModel")}
                value={watch("growthModel") || ""}
                onChange={(e) => {
                  setValue("growthModel", e.target.value);
                }}
              >
                <MenuItem value={"Module 1"}>Module 1</MenuItem>
                <MenuItem value={"Module 2"}>Module 2</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Box>

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
            onClick={() => {
              setActiveStep(2);
              setLocalItem("productionParametes", allWatchObject);
            }}
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
            type="submit"
            variant="contained"
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
