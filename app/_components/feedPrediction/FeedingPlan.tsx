"use clinet";
import {
  calculateFishGrowth,
  getLocalItem,
  setLocalItem,
} from "@/app/_lib/utils";
import { FarmGroup } from "@/app/_typeModels/production";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Tab,
  TextField,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import FishGrowthTable from "../table/FishGrowthTable";
import { FishFeedingData } from "./AdHoc";
import { useAppDispatch } from "@/lib/hooks";
import * as ValidationMessages from "@/app/_lib/utils/validationsMessage";
import * as ValidationPatterns from "@/app/_lib/utils/validationPatterns";
import { feedPredictionAction } from "@/lib/features/feedPrediction/feedPredictionSlice";
import { commonFilterAction } from "@/lib/features/commonFilters/commonFilters";
import { useRouter } from "next/navigation";

interface Props {
  productionData: FarmGroup[] | undefined;
  startDate: string;
  endDate: string;
  data: FarmsFishGrowth[][];
  setData: (val: FarmsFishGrowth[][]) => void;
}
interface FormInputs {
  startDate: string;
  timeInterval: number;
  period: number;
  fishWeight: number;
  tempSelection: string;
  temp: number;
  numberOfFishs: number;
  adjustmentFactor: number;
}
export interface FarmsFishGrowth {
  farm: string;
  unit: string;
  fishGrowthData: FishFeedingData[];
}
export const timeIntervalOptions = [
  { id: 1, label: "Daily", value: 1 },
  { id: 2, label: "Weekly", value: 7 },
  { id: 3, label: "Bi-Weekly", value: 14 },
  { id: 4, label: "Monthly", value: 30 },
];
export const tempSelectionOptions = [
  { label: "Use Farm Profile", value: "default" },
  {
    label: "Specify",
    value: "new",
  },
];
function FeedingPlan({
  productionData,
  startDate,
  endDate,
  data,
  setData,
}: Props) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [flatData, setFlatData] = useState<FarmsFishGrowth[]>([]);

  // Set initial value as the first farm name
  const [currentTab, setCurrentTab] = useState("");

  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    setCurrentTab(newValue);
    dispatch(feedPredictionAction.setFarmTab(newValue));
  };
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormInputs>({
    defaultValues: {
      fishWeight: 2,
      // startDate: dayjs().format("YYYY-MM-DD"),
      timeInterval: 1,
      // period: 30,
      tempSelection: "default",
      adjustmentFactor: 0.05,
    },
    mode: "onChange",
  });
  const onSubmit: SubmitHandler<FormInputs> = (data) => {
    const formattedDate = dayjs(startDate).format("YYYY-MM-DD");
    const diffInDays = dayjs(endDate).diff(dayjs(startDate), "day");
    const payload = {
      productionData: productionData,
      fishWeight: data.fishWeight,
      tempSelection: data.tempSelection,
      adjustmentFactor: data.adjustmentFactor,
      startDate: startDate,
      endDate: endDate,
      timeInterval: data.timeInterval,
      temp: data.temp,
    };
    setLocalItem("feedPredictionData", payload);
    router.push("/dashboard/feedPrediction/feedingPlan");
    // const fishGrowthData: any = productionData?.map((production) =>
    //   production.units.map((unit) => {
    //     console.log(unit);

    //     return {
    //       farm: production.farm,
    //       unit: unit.productionUnit.name,
    //       fishGrowthData: calculateFishGrowth(
    //         Number(data.fishWeight),
    //         data.tempSelection === "default"
    //           ? Number(unit?.waterTemp)
    //           : Number(data.temp),
    //         Number(unit.fishCount),
    //         Number(data.adjustmentFactor),
    //         Number(diffInDays),
    //         formattedDate,
    //         data.timeInterval,
    //         13.47
    //       ),
    //     };
    //   })
    // );
    // if (fishGrowthData?.length) {
    //   setData([...fishGrowthData]);
    // }
  };
  const resetFeedPlanData = () => {
    setData([]);
    setFlatData([]);
    dispatch(commonFilterAction.handleResetFilters());
    reset();
  };
  useEffect(() => {
    if (!data?.length) return;
    const flattened = data.flat();
    setFlatData(flattened);
    if (flattened.length > 0) {
      setCurrentTab(`${flattened[0].farm}/${flattened[0].unit}`);
      dispatch(
        feedPredictionAction.setFarmTab(
          `${flattened[0].farm}/${flattened[0].unit}`
        )
      );
    }
  }, [data]);

  return (
    <Stack>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3} mt={2} mb={5} alignItems={"center"}>
          <Grid item lg={3} md={4} sm={6} xs={12}>
            <Box position={"relative"}>
              <TextField
                label="Fish Weight *"
                type="text"
                {...register("fishWeight")}
                className="form-input"
                focused
                sx={{
                  width: "100%",
                }}
              />
              <Typography
                variant="body1"
                color="#555555AC"
                sx={{
                  position: "absolute",
                  right: 13,
                  top: "30%",
                  backgroundColor: "white",
                  paddingInline: "5px",
                }}
              >
                g
              </Typography>
            </Box>
          </Grid>
          {/* <Grid item lg={3} md={4} sm={6} xs={12}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Controller
                name="startDate"
                control={control}
                rules={{ required: "This field is required." }}
                render={({ field, fieldState: { error } }) => (
                  <>
                    <DatePicker
                      {...field}
                      label="Start Date * "
                      className="form-input"
                      sx={{ width: "100%" }}
                      onChange={(date) => {
                        if (date && date.isValid()) {
                          const formattedDate = date.format("YYYY-MM-DD");
                          field.onChange(formattedDate);
                          setValue("startDate", formattedDate);
                        } else {
                          field.onChange(null);
                          setValue("startDate", "");
                        }
                      }}
                      slotProps={{
                        textField: { focused: true },
                      }}
                      value={field.value ? dayjs(field.value) : null} // Ensure correct rendering
                    />

                    {error && (
                      <Typography
                        variant="body2"
                        color="red"
                        fontSize={13}
                        mt={0.5}
                      >
                        {error.message}
                      </Typography>
                    )}
                  </>
                )}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item lg={3} md={4} sm={6} xs={12}>
            <Box position={"relative"}>
              <TextField
                label="Period *"
                {...register("period")}
                type="text"
                className="form-input"
                focused
                sx={{
                  width: "100%",
                }}
              />
              <Typography
                variant="body1"
                color="#555555AC"
                sx={{
                  position: "absolute",
                  right: 13,
                  top: "30%",
                  backgroundColor: "white",
                  paddingInline: "5px",
                }}
              >
                days
              </Typography>
            </Box>
          </Grid> */}
          <Grid item lg={3} md={4} sm={6} xs={12}>
            <FormControl className="form-input" fullWidth focused>
              <InputLabel id="demo-simple-select-label">
                Time Interval *
              </InputLabel>
              <Controller
                name="timeInterval"
                control={control}
                defaultValue={1}
                render={({ field }) => (
                  <Select {...field} label="Time Interval *">
                    {timeIntervalOptions.map((option) => (
                      <MenuItem value={option.value} key={option.id}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
            </FormControl>
          </Grid>
          <Grid item lg={3} md={4} sm={6} xs={12}>
            <FormControl className="form-input" fullWidth focused>
              <InputLabel id="demo-simple-select-label">
                Temperature Selection *
              </InputLabel>
              <Controller
                name="tempSelection"
                control={control}
                defaultValue="default"
                render={({ field }) => (
                  <Select {...field} label="Temperature Selection *">
                    {tempSelectionOptions.map((option, idx) => (
                      <MenuItem value={option.value} key={idx}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
            </FormControl>
          </Grid>
          {watch("tempSelection") !== "default" && (
            <Grid item lg={3} md={4} sm={6} xs={12}>
              <Box position={"relative"}>
                <TextField
                  label="Average Temperature *"
                  type="text"
                  {...register("temp", {
                    required: true,
                    pattern: ValidationPatterns.numbersWithDot,
                  })}
                  className="form-input"
                  focused
                  sx={{
                    width: "100%",
                  }}
                />
                <Typography
                  variant="body1"
                  color="#555555AC"
                  sx={{
                    position: "absolute",
                    right: 13,
                    top: "30%",
                    backgroundColor: "white",
                    paddingInline: "5px",
                  }}
                >
                  °C
                </Typography>
              </Box>
              {errors.temp && (
                <Typography variant="body2" color="red" fontSize={13} mt={0.5}>
                  {errors.temp.type === "required"
                    ? ValidationMessages.required
                    : errors.temp.type === "pattern"
                    ? ValidationMessages.OnlyNumbersWithDot
                    : ""}
                </Typography>
              )}
            </Grid>
          )}

          <Grid item lg={3} md={4} sm={6} xs={12}>
            <Box position={"relative"}>
              <TextField
                label="Total Number Of Fish *"
                type="text"
                {...register("numberOfFishs", {
                  required: true,
                  pattern: ValidationPatterns.numbersWithDot,
                })}
                className="form-input"
                focused
                sx={{
                  width: "100%",
                }}
              />
            </Box>
            {errors.numberOfFishs && (
              <Typography variant="body2" color="red" fontSize={13} mt={0.5}>
                {errors.numberOfFishs.type === "required"
                  ? ValidationMessages.required
                  : errors.numberOfFishs.type === "pattern"
                  ? ValidationMessages.OnlyNumbersWithDot
                  : ""}
              </Typography>
            )}
          </Grid>
          <Grid item lg={3} md={4} sm={6} xs={12}>
            <Box position={"relative"}>
              <Box position={"relative"}>
                <TextField
                  label="Adjustment Factor *"
                  type="text"
                  {...register("adjustmentFactor", {
                    required: true,
                    pattern: ValidationPatterns.numbersWithDot,
                  })}
                  className="form-input"
                  focused
                  sx={{
                    width: "100%",
                  }}
                />
                <Typography
                  variant="body1"
                  color="#555555AC"
                  sx={{
                    position: "absolute",
                    right: 13,
                    top: "30%",
                    backgroundColor: "white",
                    paddingInline: "5px",
                  }}
                >
                  %
                </Typography>
              </Box>
            </Box>
            {errors.adjustmentFactor && (
              <Typography variant="body2" color="red" fontSize={13} mt={0.5}>
                {errors.adjustmentFactor.type === "required"
                  ? ValidationMessages.required
                  : errors.adjustmentFactor.type === "pattern"
                  ? ValidationMessages.OnlyNumbersWithDot
                  : ""}
              </Typography>
            )}
          </Grid>
        </Grid>
        <Box
          sx={{
            display: "flex",
            justifyContent: "end",
          }}
          // onClick={() => router.push("/dashboard/feedPrediction/feedingPlan")}
        >
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
              marginLeft: "auto",
              display: "block",
              my: 3,
            }}
          >
            Generate
          </Button>
        </Box>
      </form>
      {flatData?.length !== 0 && (
        <Box>
          <Grid container spacing={3} mt={2} mb={5} alignItems={"flex-end"}>
            <Grid item lg={3} md={4} sm={6} xs={12}>
              <Button
                id="basic-button"
                type="button"
                onClick={resetFeedPlanData}
                variant="contained"
                sx={{
                  background: "#fff",
                  color: "#06A19B",
                  fontWeight: 600,
                  padding: "6px 16px",
                  width: "fit-content",
                  textTransform: "capitalize",
                  borderRadius: "8px",
                  border: "1px solid #06A19B",
                  boxShadow: "none",
                  "&:hover": {
                    boxShadow: "none",
                  },
                }}
              >
                Reset
              </Button>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <TabContext value={currentTab}>
              <Box mb={2}>
                <TabList
                  onChange={handleChange}
                  aria-label="farm tabs"
                  className="production-tabs"
                >
                  {flatData.map((growth, index) => (
                    <Tab
                      key={index}
                      label={`${growth.farm}/${growth.unit}`}
                      value={`${growth.farm}/${growth.unit}`}
                    />
                  ))}
                </TabList>
              </Box>

              {flatData
                .filter((val) => `${val.farm}/${val.unit}` === currentTab)
                .map((growth, index) => {
                  console.log(growth);

                  return (
                    <TabPanel
                      key={index}
                      value={`${growth.farm}/${growth.unit}`}
                    >
                      <Box
                        sx={{
                          width: "100%",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <Box>
                            <Typography
                              variant="h6"
                              fontWeight={700}
                              sx={{
                                fontSize: {
                                  md: 24,
                                  xs: 20,
                                },
                                my: 1.5,
                                pb: 1,
                              }}
                              borderBottom={"1px solid black"}
                            >
                              Overall Summary:
                            </Typography>

                            <Stack>
                              <Box
                                display={"flex"}
                                alignItems={"center"}
                                gap={1}
                                mb={0.75}
                              >
                                <Typography
                                  variant="body1"
                                  color="#000"
                                  fontWeight={600}
                                  sx={{
                                    fontSize: {
                                      xs: 16,
                                    },
                                  }}
                                >
                                  Total biomass growth (kg)
                                </Typography>

                                <Typography
                                  variant="body2"
                                  color="#555555AC"
                                  sx={{
                                    fontSize: {
                                      md: 16,
                                      xs: 14,
                                    },
                                  }}
                                >
                                  value
                                </Typography>
                              </Box>

                              <Box
                                display={"flex"}
                                alignItems={"center"}
                                gap={1}
                                mb={0.75}
                              >
                                <Typography
                                  variant="body1"
                                  color="#000"
                                  fontWeight={600}
                                  sx={{
                                    fontSize: {
                                      xs: 16,
                                    },
                                  }}
                                >
                                  Final Farm/unit Biomass
                                </Typography>

                                <Typography
                                  variant="body2"
                                  color="#555555AC"
                                  sx={{
                                    fontSize: {
                                      md: 16,
                                      xs: 14,
                                    },
                                  }}
                                >
                                  val
                                </Typography>
                              </Box>

                              <Box
                                display={"flex"}
                                alignItems={"center"}
                                gap={1}
                                mb={0.75}
                              >
                                <Typography
                                  variant="body1"
                                  color="#000"
                                  fontWeight={600}
                                  sx={{
                                    fontSize: {
                                      xs: 16,
                                    },
                                  }}
                                >
                                  Total feed usage (kg)
                                </Typography>

                                <Typography
                                  variant="body2"
                                  color="#555555AC"
                                  sx={{
                                    fontSize: {
                                      md: 16,
                                      xs: 14,
                                    },
                                  }}
                                >
                                  value
                                </Typography>
                              </Box>
                              <Box
                                display={"flex"}
                                alignItems={"center"}
                                gap={1}
                                mb={0.75}
                              >
                                <Typography
                                  variant="body1"
                                  color="#000"
                                  fontWeight={600}
                                  sx={{
                                    fontSize: {
                                      xs: 16,
                                    },
                                  }}
                                >
                                  <Box
                                    display={"flex"}
                                    alignItems={"center"}
                                    gap={1}
                                    mb={0.75}
                                  >
                                    <Typography
                                      variant="body1"
                                      color="#000"
                                      fontWeight={600}
                                      sx={{
                                        fontSize: {
                                          xs: 16,
                                        },
                                      }}
                                    >
                                      Total feed cost ()
                                    </Typography>

                                    <Typography
                                      variant="body2"
                                      color="#555555AC"
                                      sx={{
                                        fontSize: {
                                          md: 16,
                                          xs: 14,
                                        },
                                      }}
                                    >
                                      value
                                    </Typography>
                                  </Box>
                                </Typography>
                              </Box>
                            </Stack>
                          </Box>
                          <Box>
                            <Typography
                              variant="h6"
                              fontWeight={700}
                              sx={{
                                fontSize: {
                                  md: 24,
                                  xs: 20,
                                },
                                my: 1.5,
                                pb: 1,
                              }}
                              borderBottom={"1px solid black"}
                            >
                              Feed Usage(all farms/units)
                            </Typography>

                            <Stack>
                              <Box
                                display={"flex"}
                                alignItems={"center"}
                                gap={1}
                                mb={0.75}
                              >
                                <Typography
                                  variant="body1"
                                  color="#000"
                                  fontWeight={600}
                                  sx={{
                                    fontSize: {
                                      xs: 16,
                                    },
                                  }}
                                >
                                  SAF Start #0 (kg)-
                                </Typography>

                                <Typography
                                  variant="body2"
                                  color="#555555AC"
                                  sx={{
                                    fontSize: {
                                      md: 16,
                                      xs: 14,
                                    },
                                  }}
                                >
                                  __ Kg
                                </Typography>
                              </Box>

                              <Box
                                display={"flex"}
                                alignItems={"center"}
                                gap={1}
                                mb={0.75}
                              >
                                <Typography
                                  variant="body1"
                                  color="#000"
                                  fontWeight={600}
                                  sx={{
                                    fontSize: {
                                      xs: 16,
                                    },
                                  }}
                                >
                                  SAF Starter #1 (kg)-
                                </Typography>

                                <Typography
                                  variant="body2"
                                  color="#555555AC"
                                  sx={{
                                    fontSize: {
                                      md: 16,
                                      xs: 14,
                                    },
                                  }}
                                >
                                  __ Kg
                                </Typography>
                              </Box>

                              <Box
                                display={"flex"}
                                alignItems={"center"}
                                gap={1}
                                mb={0.75}
                              >
                                <Typography
                                  variant="body1"
                                  color="#000"
                                  fontWeight={600}
                                  sx={{
                                    fontSize: {
                                      xs: 16,
                                    },
                                  }}
                                >
                                  Grower 2mm -
                                </Typography>

                                <Typography
                                  variant="body2"
                                  color="#555555AC"
                                  sx={{
                                    fontSize: {
                                      md: 16,
                                      xs: 14,
                                    },
                                  }}
                                >
                                  __
                                </Typography>
                              </Box>
                            </Stack>
                          </Box>
                          <Box>
                            <Typography
                              variant="h6"
                              fontWeight={700}
                              sx={{
                                fontSize: {
                                  md: 24,
                                  xs: 20,
                                },
                                my: 1.5,
                                pb: 1,
                              }}
                              borderBottom={"1px solid black"}
                            >
                              Feed Usage(Farm 1)
                            </Typography>

                            <Stack>
                              <Box
                                display={"flex"}
                                alignItems={"center"}
                                gap={1}
                                mb={0.75}
                              >
                                <Typography
                                  variant="body1"
                                  color="#000"
                                  fontWeight={600}
                                  sx={{
                                    fontSize: {
                                      xs: 16,
                                    },
                                  }}
                                >
                                  SAF Start #0 -
                                </Typography>

                                <Typography
                                  variant="body2"
                                  color="#555555AC"
                                  sx={{
                                    fontSize: {
                                      md: 16,
                                      xs: 14,
                                    },
                                  }}
                                >
                                  __ Kg
                                </Typography>
                              </Box>

                              <Box
                                display={"flex"}
                                alignItems={"center"}
                                gap={1}
                                mb={0.75}
                              >
                                <Typography
                                  variant="body1"
                                  color="#000"
                                  fontWeight={600}
                                  sx={{
                                    fontSize: {
                                      xs: 16,
                                    },
                                  }}
                                >
                                  SAF Starter #1 -
                                </Typography>

                                <Typography
                                  variant="body2"
                                  color="#555555AC"
                                  sx={{
                                    fontSize: {
                                      md: 16,
                                      xs: 14,
                                    },
                                  }}
                                >
                                  __ Kg
                                </Typography>
                              </Box>

                              <Box
                                display={"flex"}
                                alignItems={"center"}
                                gap={1}
                                mb={0.75}
                              >
                                <Typography
                                  variant="body1"
                                  color="#000"
                                  fontWeight={600}
                                  sx={{
                                    fontSize: {
                                      xs: 16,
                                    },
                                  }}
                                >
                                  Grower 2mm -
                                </Typography>

                                <Typography
                                  variant="body2"
                                  color="#555555AC"
                                  sx={{
                                    fontSize: {
                                      md: 16,
                                      xs: 14,
                                    },
                                  }}
                                >
                                  __
                                </Typography>
                              </Box>
                            </Stack>
                          </Box>
                        </Box>
                        <Box>
                          <FishGrowthTable
                            data={growth.fishGrowthData}
                            key={index}
                          />
                        </Box>
                      </Box>
                    </TabPanel>
                  );
                })}
            </TabContext>
          </Grid>
        </Box>
      )}

      {/* {data?.map((farm, i) =>
        farm?.map((growth) => {
          console.log("growth", growth);

          {
            return <FishGrowthTable data={growth.fishGrowthData} key={i} />;
          }
        })
      )} */}
    </Stack>
  );
}

export default FeedingPlan;
