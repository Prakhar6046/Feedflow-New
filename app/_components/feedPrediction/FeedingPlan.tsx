"use clinet";
import { calculateFishGrowth } from "@/app/_lib/utils";
import { FarmGroup } from "@/app/_typeModels/production";
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
import dayjs, { Dayjs } from "dayjs";
import React, { useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { FishFeedingData } from "./AdHoc";
import FishGrowthTable from "../table/FishGrowthTable";
interface Props {
  productionData: FarmGroup[] | undefined;
}
interface FormInputs {
  startDate: string;
  timeInterval: number;
  period: number;
  expectedWaste: number;
  fishWeight: number;
}
export interface FarmsFishGrowth {
  farm: string;
  unit: string;
  fishGrowthData: FishFeedingData[];
}
interface Fish {
  data: FarmsFishGrowth[];
}
const timeIntervalOptions = [
  { id: 1, label: "Daily", value: 1 },
  { id: 2, label: "Weekly", value: 7 },
  { id: 3, label: "Bi-Weekly", value: 14 },
  { id: 4, label: "Monthly", value: 30 },
];
function FeedingPlan({ productionData }: Props) {
  const [data, setData] = useState<Fish[]>();
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormInputs>({
    defaultValues: {
      fishWeight: 2,
      startDate: dayjs().format("YYYY-MM-DD"),
      timeInterval: 1,
      period: 30,
      expectedWaste: 0.05,
    },
    mode: "onChange",
  });
  const onSubmit: SubmitHandler<FormInputs> = (data) => {
    // console.log(productionData);
    const formattedDate = dayjs(data.startDate).format("YYYY-MM-DD");
    const fishGrowthData = productionData?.map((production) =>
      production.units.map((unit) => {
        return {
          farm: production.farm,
          unit: unit.productionUnit.name,
          fishGrowthData: calculateFishGrowth(
            Number(data.fishWeight),
            Number(unit.waterTemp),
            Number(unit.fishCount),
            Number(data.expectedWaste),
            Number(data.period),
            formattedDate,
            data.timeInterval,
            13.47
          ),
        };
      })
    );
    // setData([...fishGrowthData]);

    // console.log(data);
  };
  console.log(data);

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
          </Grid>
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
          </Grid>
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

      {/* {data?.map((farm, i) =>
        farm?.data.map((growth) => {
          {
            return <FishGrowthTable data={growth.fishGrowthData} key={i} />;
          }
        })
      )} */}
    </Stack>
  );
}

export default FeedingPlan;
