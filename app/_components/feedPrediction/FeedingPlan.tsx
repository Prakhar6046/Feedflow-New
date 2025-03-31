"use clinet";
import {
  Box,
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
import { Dayjs } from "dayjs";
import React from "react";
import { Controller, useForm } from "react-hook-form";
interface FormInputs {
  startDate: Dayjs | null;
  timeInterval: number;
}
const timeIntervalOptions = [
  { id: 1, label: "Daily", value: 1 },
  { id: 2, label: "Weekly", value: 7 },
  { id: 3, label: "Bi-Weekly", value: 14 },
  { id: 4, label: "Monthly", value: 30 },
];
function FeedingPlan() {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormInputs>({
    defaultValues: { startDate: null, timeInterval: 1 },
    mode: "onChange",
  });
  return (
    <Stack>
      <form>
        <Grid container spacing={3} mt={2} mb={5} alignItems={"center"}>
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
                      sx={{
                        width: "100%",
                      }}
                      //   defaultValue={1}
                      // onChange={(date) => {
                      //   if (date && date.isValid()) {
                      //     field.onChange(date); // Set a valid Dayjs date
                      //     setValue("hatchingDate", date);
                      //   } else {
                      //     field.onChange(null); // Clear the field if date is invalid
                      //   }
                      // }}
                      slotProps={{
                        textField: { focused: true },
                      }}
                      value={field.value || null}
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
          </Grid>
          <Grid item lg={3} md={4} sm={6} xs={12}>
            <Box position={"relative"}>
              <TextField
                label="Expected Waste Factory *"
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
                %
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Stack>
  );
}

export default FeedingPlan;
