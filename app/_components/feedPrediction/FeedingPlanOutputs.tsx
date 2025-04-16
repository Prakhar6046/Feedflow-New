"use clinet";
import {
  calculateFishGrowth,
  getLocalItem,
  setLocalItem,
} from "@/app/_lib/utils";
import { FarmGroup } from "@/app/_typeModels/production";
import { commonFilterAction } from "@/lib/features/commonFilters/commonFilters";
import { feedPredictionAction } from "@/lib/features/feedPrediction/feedPredictionSlice";
import { useAppDispatch } from "@/lib/hooks";
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
  Tooltip,
  Typography,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { FishFeedingData } from "./AdHoc";
import FishGrowthTable from "../table/FishGrowthTable";
import FishGrowthChart from "../charts/FishGrowthChart";

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
function FeedingPlanOutput() {
  const dispatch = useAppDispatch();
  const [farmOption, setFarmOptions] = useState<any[]>([]);
  const [unitOption, setUnitOptions] = useState<any[]>([]);
  const [startDate, setStartDate] = useState<string | null>(
    dayjs().toISOString()
  );
  const [endDate, setEndDate] = useState<string | null>(dayjs().toISOString());
  const [flatData, setFlatData] = useState<FarmsFishGrowth[]>([]);
  const [formData, setFomData] = useState<any>();
  const {
    control,
    setValue,
    watch,
    register,
    formState: { errors },
  } = useForm();
  useEffect(() => {
    const selectedFarm = watch("farms");

    if (!selectedFarm && farmOption?.length > 0) {
      const defaultFarmId = farmOption[0].id;
      setValue("farms", defaultFarmId);
      return;
    }

    if (selectedFarm) {
      const getProductionUnits = (selectedFarm: any, detailedFarms: any) => {
        console.log(detailedFarms);

        const matchedFarm = detailedFarms.find(
          (farm: any) => farm.units[0].farm.id == selectedFarm
        );
        return {
          productionUnits: matchedFarm?.units || [],
        };
      };

      const result = getProductionUnits(selectedFarm, formData?.productionData);

      const customUnits = result.productionUnits.map((unit: any) => ({
        id: unit.id,
        option: unit?.productionUnit?.name,
      }));
      console.log(customUnits);

      setUnitOptions(customUnits);
    }
  }, [watch("farms"), farmOption]);
  useEffect(() => {
    if (unitOption?.length) {
      setValue("units", unitOption[0]?.id);
    }
  }, [unitOption]);
  useEffect(() => {
    const data = getLocalItem("feedPredictionData");
    if (data) {
      let customFarms: any = data?.productionData?.map((farm: any) => {
        return { option: farm.farm, id: farm.units[0].farm.id };
      });
      setStartDate(data?.startDate);
      setEndDate(data?.endDate);
      setFarmOptions(customFarms);
      setValue("adjustmentFactor", data.adjustmentFactor);
      setFomData(data);
      const fishGrowthData: any = data?.productionData?.map((production) =>
        production.units.map((unit) => {
          console.log(unit);
          const formattedDate = dayjs(startDate).format("YYYY-MM-DD");
          const diffInDays = dayjs(endDate).diff(dayjs(startDate), "day");
          return {
            farm: production.farm,
            farmId: unit?.farm?.id,
            unitId: unit.id,
            unit: unit.productionUnit.name,
            fishGrowthData: calculateFishGrowth(
              Number(data?.fishWeight),
              data?.tempSelection === "default"
                ? Number(unit?.waterTemp)
                : Number(data?.temp),
              Number(unit.fishCount),
              Number(data.adjustmentFactor),
              Number(diffInDays),
              formattedDate,
              data?.timeInterval,
              13.47
            ),
          };
        })
      );
      if (fishGrowthData?.length) {
        setFlatData([...fishGrowthData].flat());
      }
    }
  }, []);
  console.log(flatData);
  console.log(watch("farms"), watch("units"));

  return (
    <Stack>
      <Box>
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
            mr: 2,
          }}
        >
          Save
        </Button>

        <Button
          type="submit"
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
          }}
        >
          Add dropdown here
          {/* <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="1em"
                  height="1em"
                  viewBox="0 0 16 16"
                >
                  <path
                    fill="currentColor"
                    d="M9.5 13a1.5 1.5 0 1 1-3 0a1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0a1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0a1.5 1.5 0 0 1 3 0"
                  />
                </svg> */}
        </Button>
      </Box>

      <Box mb={5}>
        <Grid container spacing={2} mt={1}>
          <Grid item xl={2} lg={4} md={4} sm={6} xs={12}>
            <FormControl fullWidth className="form-input selected" focused>
              <InputLabel
                id="demo-simple-select-label-1 "
                className="custom-input"
              >
                Farms
              </InputLabel>
              <Controller
                name="farms"
                control={control}
                defaultValue={farmOption[0]?.id ?? ""}
                render={({ field }) => (
                  <Select {...field} label="Farm *" value={field.value ?? ""}>
                    {farmOption.map((option) => (
                      <MenuItem value={option.id} key={option.id}>
                        {option.option}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
            </FormControl>
          </Grid>
          <Grid item xl={2} lg={4} md={4} sm={6} xs={12}>
            <FormControl fullWidth className={`form-input`} focused>
              <InputLabel
                id="demo-simple-select-label"
                className="custom-input"
              >
                Units
              </InputLabel>
              <Controller
                name="units"
                control={control}
                defaultValue={unitOption[0]?.id ?? ""}
                render={({ field }) => (
                  <Select {...field} label="Units *" value={field.value ?? ""}>
                    {unitOption.map((option) => (
                      <MenuItem value={option.id} key={option.id}>
                        {option.option}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
            </FormControl>
          </Grid>
          <Grid item xl={2} lg={4} md={4} sm={6} xs={12}>
            <TextField
              label="Generated By *"
              type="text"
              // {...register("temp", {
              //   required: true,
              //   pattern: ValidationPatterns.numbersWithDot,
              // })}
              className="form-input"
              focused
              sx={{
                width: "100%",
              }}
            />
          </Grid>
          <Grid item xl={2} lg={4} md={4} sm={6} xs={12}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Generated By"
                className="date-picker"
                value={dayjs()} // sets today's date
                disabled
              />
            </LocalizationProvider>
          </Grid>

          <Grid item xl={2} lg={4} md={4} sm={6} xs={12}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Start Date"
                className="date-picker"
                value={dayjs(startDate)}
                onChange={(value) => {
                  const isoDate = value?.toISOString();
                  if (isoDate) setStartDate(isoDate);
                }}
                maxDate={dayjs(endDate)}
              />
            </LocalizationProvider>
          </Grid>

          <Grid item xl={2} lg={4} md={4} sm={6} xs={12}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="End Date"
                value={dayjs(endDate)}
                onChange={(value) => {
                  const isoDate = value?.toISOString();
                  if (isoDate) setEndDate(isoDate);
                }}
                sx={{
                  marginTop: "0",
                  borderRadius: "6px",
                }}
                className="date-picker"
                minDate={dayjs(startDate)}
                maxDate={dayjs()}
              />
            </LocalizationProvider>
          </Grid>
        </Grid>
      </Box>

      <Grid
        container
        spacing={2}
        justifyContent={"space-between"}
        alignItems={"center"}
        mb={5}
      >
        <Grid
          item
          xs="auto"
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Box position={"relative"}>
            <Box position={"relative"}>
              <TextField
                label="Adjustment Factor *"
                type="text"
                {...register("adjustmentFactor", {
                  required: true,
                  // pattern: ValidationPatterns.numbersWithDot,
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
          {/* {errors.adjustmentFactor && (
            <Typography variant="body2" color="red" fontSize={13} mt={0.5}>
              {errors.adjustmentFactor.type === "required"
                ? ValidationMessages.required
                : errors.adjustmentFactor.type === "pattern"
                ? ValidationMessages.OnlyNumbersWithDot
                : ""}
            </Typography>
          )} */}

          <Tooltip title="Re calculate">
            <Button
              type="submit"
              variant="contained"
              sx={{
                background: "#fff",
                color: "#06A19B",
                fontWeight: 600,
                width: "fit-content",
                padding: "6px",
                textTransform: "capitalize",
                borderRadius: "4px",
                border: "1px solid #06A19B",
                boxShadow: "none",
                "&:hover": {
                  boxShadow: "none",
                },
                minWidth: "fit-content",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 20 20"
              >
                <path
                  fill="currentColor"
                  d="M7 12a1 1 0 1 0 0-2a1 1 0 0 0 0 2m0 3a1 1 0 1 0 0-2a1 1 0 0 0 0 2m2.627-3.072a5.5 5.5 0 0 1 1.178-1.522A.998.998 0 0 0 9 11a1 1 0 0 0 .627.928M6.5 17h3.11q.279.538.663 1H6.5A2.5 2.5 0 0 1 4 15.5v-11A2.5 2.5 0 0 1 6.5 2h7A2.5 2.5 0 0 1 16 4.5v4.688a5.5 5.5 0 0 0-1-.185V4.5A1.5 1.5 0 0 0 13.5 3h-7A1.5 1.5 0 0 0 5 4.5v11A1.5 1.5 0 0 0 6.5 17M6 5.5A1.5 1.5 0 0 1 7.5 4h5A1.5 1.5 0 0 1 14 5.5v1A1.5 1.5 0 0 1 12.5 8h-5A1.5 1.5 0 0 1 6 6.5zM7.5 5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h5a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5zm10 7.48a.5.5 0 0 0 .5-.5v-2a.5.5 0 0 0-1 0v.758a4.5 4.5 0 1 0 2 3.742a.5.5 0 1 0-1 0a3.5 3.5 0 1 1-1.696-3H15.5a.5.5 0 1 0 0 1z"
                />
              </svg>
            </Button>
          </Tooltip>
        </Grid>

        <Grid item xs="auto">
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
              mr: 2,
            }}
          >
            Save
          </Button>

          <Button
            type="submit"
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
            }}
          >
            Add Dropdown Here
          </Button>
        </Grid>
        {flatData
          .filter(
            (val) =>
              val.farmId == watch("farms") && val.unitId == watch("units")
          )
          .map((growth, index) => {
            return (
              <Box
                key={index}
                sx={{
                  width: "100%",
                }}
              >
                <Box>
                  <FishGrowthTable data={growth.fishGrowthData} key={index} />
                </Box>
              </Box>
            );
          })}
      </Grid>

      <Grid
        container
        spacing={2}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <Grid item xs={6}>
          <Typography variant="h6" component={"h6"} fontWeight={600}>
            Fish Growth
          </Typography>
          {flatData
            .filter(
              (val) =>
                val.farmId == watch("farms") && val.unitId == watch("units")
            )
            .map((growth, index) => {
              return (
                <Box
                  key={index}
                  sx={{
                    width: "100%",
                  }}
                >
                  <Box>
                    <FishGrowthChart
                      xAxisData={
                        growth?.fishGrowthData?.map((value) => value?.date) ||
                        []
                      }
                      yData={
                        growth?.fishGrowthData?.map(
                          (value) => value?.fishSize
                        ) || []
                      }
                      graphTitle={`Farm: ${growth.farm} Unit: ${growth.unit}`}
                    />
                  </Box>
                </Box>
              );
            })}
          <Box>
            <Button
              type="submit"
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
              }}
            >
              Add dropdown here
            </Button>
          </Box>
        </Grid>

        <Grid item xs={6}>
          <Typography variant="h6" component={"h6"} fontWeight={600}>
            Feed Requirement
          </Typography>
          Add Graph Here
          <Box>
            <Button
              type="submit"
              variant="contained"
              sx={{
                background: "#06A19B",
                color: "#fff",
                fontWeight: 600,
                padding: "6px 16px",
                width: "fit-content",
                textTransform: "capitalize",
                borderRadius: "8px",
                border: "1px solid #06A19B",
                mr: 2,
              }}
            >
              Order Feed
            </Button>

            <Button
              type="submit"
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
              }}
            >
              Add dropdown here
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Stack>
  );
}

export default FeedingPlanOutput;
