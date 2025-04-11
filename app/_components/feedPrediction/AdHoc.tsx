"use client";
import {
  calculateFishGrowth,
  CommonFeedPredictionHead,
} from "@/app/_lib/utils";
import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import { useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import FishGrowthChart from "../charts/FishGrowthChart";
import Loader from "../Loader";
import FishGrowthTable from "../table/FishGrowthTable";
import { exportFeedPredictionToXlsx } from "@/app/_lib/utils";
import * as ValidationMessages from "@/app/_lib/utils/validationsMessage";
import * as ValidationPatterns from "@/app/_lib/utils/validationPatterns";
import { farmAction } from "@/lib/features/farm/farmSlice";
import { timeIntervalOptions } from "./FeedingPlan";
interface FormInputs {
  farm: string;
  unit: string;
  startDate: string;
  endDate: string;
  period: number;
  temp: number;
  fishWeight: number;
  numberOfFishs: number;
  adjustmentFactor: number;
  timeInterval: number;
}
export interface FishFeedingData {
  date: string;
  days: number;
  averageProjectedTemp: number;
  estimatedFCR: number;
  expectedWaste: number;
  feedCost: number;
  feedDE: number;
  feedIntake: string;
  feedPrice: number;
  feedProtein: number;
  feedSize: string;
  feedType: string;
  feedingRate: string;
  fishSize: string;
  growth: number;
  numberOfFish: number;
  partitionedFCR: number;
}
type Iprops = {
  data: FishFeedingData[];
  setData: (val: FishFeedingData[]) => void;
};

function AdHoc({ data, setData }: Iprops) {
  const [loading, setLoading] = useState(false);

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
      numberOfFishs: 7500,
      fishWeight: 2,
      adjustmentFactor: 0.05,
      startDate: dayjs().format("YYYY-MM-DD"),
      temp: 24,
      period: 5,
    },
    mode: "onChange",
  });

  const onSubmit: SubmitHandler<FormInputs> = (data) => {
    const formattedDate = dayjs(data.startDate).format("YYYY-MM-DD");
    const diffInDays = dayjs(data.endDate).diff(dayjs(data.startDate), "day");
    if (data) {
      setData(
        calculateFishGrowth(
          Number(data.fishWeight),
          Number(data.temp),
          Number(data.numberOfFishs),
          Number(data.adjustmentFactor),
          Number(diffInDays),
          formattedDate,
          1,
          13.47
        )
      );
    }
  };
  const resetAdHocData = () => {
    reset();
    setData([]);
  };
  if (loading) {
    return <Loader />;
  }
  return (
    <Stack>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3} mt={2} mb={5} alignItems={"center"}>
          <Grid item lg={3} md={4} sm={6} xs={12}>
            <TextField
              label="Farm *"
              type="text"
              {...register("farm", {
                required: true,
              })}
              className="form-input"
              focused
              sx={{
                width: "100%",
              }}
            />
            {errors.farm && (
              <Typography variant="body2" color="red" fontSize={13} mt={0.5}>
                {ValidationMessages.required}
              </Typography>
            )}
          </Grid>

          <Grid item lg={3} md={4} sm={6} xs={12}>
            <TextField
              label="Unit *"
              type="text"
              {...register("unit", {
                required: true,
              })}
              className="form-input"
              focused
              sx={{
                width: "100%",
              }}
            />
            {errors.unit && (
              <Typography variant="body2" color="red" fontSize={13} mt={0.5}>
                {ValidationMessages.required}
              </Typography>
            )}
          </Grid>

          <Grid item lg={3} md={4} sm={6} xs={12}>
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
                          setValue("endDate", "");
                        } else {
                          field.onChange(null);
                          setValue("startDate", "");
                        }
                      }}
                      slotProps={{
                        textField: { focused: true },
                      }}
                      value={field.value ? dayjs(field.value) : null} // Ensure correct rendering
                      maxDate={dayjs(watch("endDate"))}
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
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Controller
                name="endDate"
                control={control}
                rules={{ required: "This field is required." }}
                render={({ field, fieldState: { error } }) => (
                  <>
                    <DatePicker
                      {...field}
                      label="End Date * "
                      className="form-input"
                      sx={{ width: "100%" }}
                      onChange={(date) => {
                        if (date && date.isValid()) {
                          const formattedDate = date.format("YYYY-MM-DD");
                          field.onChange(formattedDate);
                          setValue("endDate", formattedDate);
                        } else {
                          field.onChange(null);
                          setValue("endDate", "");
                        }
                      }}
                      slotProps={{
                        textField: { focused: true },
                      }}
                      minDate={dayjs(watch("startDate")).add(1, "day")}
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

          {/* <Grid item lg={3} md={4} sm={6} xs={12}>
            <Box position={"relative"}>
              <TextField
                label="Period *"
                type="text"
                {...register("period")}
                value={dayjs(watch("endDate")).diff(
                  dayjs(watch("startDate")),
                  "day"
                )}
                disabled
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

          <Grid item lg={3} md={4} sm={6} xs={12}>
            <Box position={"relative"}>
              <TextField
                label="Average Fish Weight *"
                type="text"
                {...register("fishWeight", {
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
                g
              </Typography>
            </Box>
            {errors.fishWeight && (
              <Typography variant="body2" color="red" fontSize={13} mt={0.5}>
                {errors.fishWeight.type === "required"
                  ? ValidationMessages.required
                  : errors.fishWeight.type === "pattern"
                  ? ValidationMessages.OnlyNumbersWithDot
                  : ""}
              </Typography>
            )}
          </Grid>

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
              {/* <Typography
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
              </Typography> */}
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
          {/* <Grid item lg={3} md={4} sm={6} xs={12}>
            <Box position={"relative"}>
              <TextField
                label="Temp *"
                type="text"
                {...register("temp")}
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
          </Grid>
          <Grid item lg={3} md={4} sm={6} xs={12}>
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
                type="text"
                {...register("period")}
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
          {/* <Grid item lg={3} md={4} sm={6} xs={12}>
            <FormControl className="form-input" fullWidth focused>
              <InputLabel id="demo-simple-select-label">
                Time Interval *
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Time Interval *"
              >
                {timeIntervalOptions.map((option) => {
                  return (
                    <MenuItem value={option.value} key={option.id}>
                      {option.label}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Grid> */}
          {/* <Grid item lg={3} md={4} sm={6} xs={12}>
            <Box position={"relative"}>
              <TextField
                label="Expected Waste Factory *"
                type="text"
                {...register("expectedWaste")}
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
          </Grid> */}
        </Grid>

        <Box
          sx={{
            display: "flex",
            justifyContent: "end",
          }}
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
      {data?.length !== 0 && (
        <Box>
          <Grid container spacing={3} mt={2} mb={5} alignItems={"flex-end"}>
            <Grid item lg={3} md={4} sm={6} xs={12}>
              <Button
                id="basic-button"
                type="button"
                onClick={resetAdHocData}
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
          <FishGrowthTable data={data} />
        </Box>
      )}

      {/* {data?.length !== 0 && (
        <div className="mb-5">
          <FishGrowthChart
            xAxisData={data?.map((value) => value?.date) || []}
            yData={data?.map((value) => value?.fishSize) || []}
          />
        </div>
      )} */}
    </Stack>
  );
}

export default AdHoc;
