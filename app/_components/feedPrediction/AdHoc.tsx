"use client";
import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs, { Dayjs } from "dayjs";
import { useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import FishGrowthChart from "../charts/FishGrowthChart";
import Loader from "../Loader";
interface FormInputs {
  fishWeight: number;
  numberOfFishs: number;
  temp: number;
  startDate: string;
  period: number;
  expectedWaste: number;
}
interface FishFeedingData {
  averageProjectedTemp: number;
  date?: string;
  days?: number;
  estimatedFCR?: number;
  feedCost?: number;
  feedDE?: number;
  feedIntake?: string;
  feedPrice?: number;
  feedProtein?: number;
  feedSize?: string;
  feedType?: string;
  feedingRate?: string;
  fishSize?: string;
  growth?: number;
  moralityRate?: number;
  numberOfFish?: number;
  partitionedFCR?: number;
}

function AdHoc() {
  const [numberOfFish, setNumberOfFish] = useState<number>(7500);
  const [fishWeight, setFishWeight] = useState<number>(2);
  const [data, setData] = useState<FishFeedingData[]>();
  const [waterTemp, setWaterTemp] = useState<number>(24);
  const [loading, setLoading] = useState(false);
  const [timeInterval, setTimeInterval] = useState<number>(1);
  const [startDate, setStartDate] = useState();
  const [wasteFator, setWasteFator] = useState<number>(3);
  const [DE, setDE] = useState<number>(13.47);
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormInputs>({
    defaultValues: {
      numberOfFishs: 7500,
      fishWeight: 2,
      expectedWaste: 0.05,
      startDate: dayjs().format("YYYY-MM-DD"),
      temp: 24,
      period: 5,
    },
    mode: "onChange",
  });
  function calculateFBW(
    fishWeight: number,
    temp: number,
    numberOfFishs: number,
    expectedWaste: number,
    period: number,
    startDate: string
  ) {
    const IBW = fishWeight;
    const T = temp;
    let prevWeight = IBW;
    let prevNumberOfFish = numberOfFishs;
    let prevFishSize = IBW;
    let prevGrowth = 0;
    let newData = [];
    function calculateNoOfFish(noOfFish: number, days: number) {
      return (
        noOfFish *
        (1 - (Math.pow(expectedWaste / 100 + timeInterval, days) - 1))
      );
    }

    function calculateFCRDE(fishWeight: number, de: number): number {
      return (0.00643 * fishWeight + 13) / (de / 1.03);
    }

    function calculateFeedingRate(fishSize: number, de: number): number {
      const power1 = Math.pow(fishSize, 0.33333);
      const logPart = -0.003206 + 0.001705 * Math.log(waterTemp - 11.25);
      const power2 = Math.pow(power1 + logPart * waterTemp, 3);
      const fraction = power2 / fishSize - 1;
      const part2 = (0.00643 * fishSize + 13) / (de / 1.03);

      return fraction * part2 * 100;
    }

    function calculateFW(
      IBW: number,
      b: number,
      TGC: number,
      tValues: number[],
      dValues: number[]
    ) {
      if (tValues.length !== dValues.length) {
        throw new Error("tValues and dValues must have the same length");
      }

      // Compute summation of t * d
      let sum_td = tValues.reduce(
        (sum, t, index) => sum + t * dValues[index],
        0
      );

      // Apply the formula
      return Math.pow(Math.pow(IBW, b) + (TGC / 100) * sum_td, 1 / b);
    }

    function calculateGrowth(fcr: number, feedIntake: number, day: number) {
      return fcr * feedIntake * day;
    }
    function calculateDate(date: string, day: number) {
      return dayjs(date, "YYYY-MM-DD").add(day, "day").format("DD-MM-YYYY");
    }
    // Loop through the days and calculate values
    for (let day = 1; day <= period; day += 1) {
      const FBW = calculateFW(prevWeight, 0.35, 0.16, [T], [7]);
      prevNumberOfFish =
        day !== 1 ? calculateNoOfFish(prevNumberOfFish, 1) : prevNumberOfFish;

      const estfcr = Math.floor(calculateFCRDE(prevWeight, DE) * 100) / 100;
      let fishSize =
        day === 1
          ? prevFishSize
          : Number((prevFishSize + prevGrowth).toFixed(3));

      let prevFeedingRate = parseFloat(
        calculateFeedingRate(
          Number(parseFloat(String(fishSize)).toFixed(3)),
          DE
        ).toFixed(3)
      );
      let prevFeedIntake = (
        (Number(prevFeedingRate.toFixed(2)) * fishSize) /
        100
      ).toFixed(3);

      const growth = parseFloat(
        calculateGrowth(estfcr, Number(prevFeedIntake), 1).toFixed(3)
      );

      const newRow = {
        date: calculateDate(startDate, day),
        days: day,
        averageProjectedTemp: T,
        numberOfFish: Math.round(prevNumberOfFish),
        expectedWaste,
        fishSize: fishSize.toFixed(3),
        growth,
        feedType:
          prevWeight >= 50
            ? "Tilapia Starter #3"
            : prevWeight >= 25
            ? "Tilapia Starter #2"
            : "Tilapia Starter #1",
        feedSize: prevWeight >= 50 ? "#3" : prevWeight >= 25 ? "#2" : "#1",
        feedProtein: 400,
        feedDE: 13.47,
        feedPrice: 32,
        estimatedFCR: estfcr,
        feedIntake: prevFeedIntake,
        partitionedFCR: 0.0,
        feedingRate: prevFeedingRate.toFixed(2),
        feedCost: 49409,
      };

      // Store new data
      newData.push(newRow);
      prevFishSize = fishSize;
      prevGrowth = growth;
      prevWeight = FBW;
      prevFeedIntake = prevFeedIntake;
      prevFeedingRate = prevFeedingRate;
    }
    setData(newData);
  }

  const onSubmit: SubmitHandler<FormInputs> = (data) => {
    const formattedDate = dayjs(data.startDate).format("YYYY-MM-DD");
    if (data) {
      setData([]);
      calculateFBW(
        Number(data.fishWeight),
        Number(data.temp),
        Number(data.numberOfFishs),
        Number(data.expectedWaste),
        Number(data.period),
        formattedDate
      );
    }
  };

  // useEffect(() => {
  //   if (numberOfFish && waterTemp && fishWeight) {
  //     console.log("run");

  //     calculateFBW();
  //   }
  // }, [fishWeight, numberOfFish, waterTemp]);
  if (loading) {
    return <Loader />;
  }
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
            <Box position={"relative"}>
              <TextField
                label="Number Of fish *"
                type="text"
                {...register("numberOfFishs")}
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
          </Grid>
          <Grid item lg={3} md={4} sm={6} xs={12}>
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
          </Grid>
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
      {data && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Temp(c)</TableCell>
                <TableCell>Number of Fish</TableCell>
                <TableCell>Fish Size(g)</TableCell>
                <TableCell>Growth(g)</TableCell>
                <TableCell>Feed Type</TableCell>
                <TableCell>Feed Size</TableCell>
                <TableCell>Est. FCR</TableCell>
                <TableCell>Feed Intake (g)</TableCell>
                <TableCell>Feeding Rate</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.date}</TableCell>
                  <TableCell>{row.averageProjectedTemp}</TableCell>
                  <TableCell>{row.numberOfFish}</TableCell>
                  <TableCell>{row.fishSize}</TableCell>
                  <TableCell>{row.growth}</TableCell>
                  <TableCell>{row.feedType}</TableCell>
                  <TableCell>{row.feedSize}</TableCell>
                  <TableCell>{row.estimatedFCR}</TableCell>
                  <TableCell>{row.feedIntake}</TableCell>
                  <TableCell>{row.feedingRate}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {data && (
        <div className="mb-5">
          <FishGrowthChart
            xAxisData={data?.map((value) => value?.date) || []}
            yData={data?.map((value) => value?.fishSize) || []}
          />
        </div>
      )}
    </Stack>
  );
}

export default AdHoc;
