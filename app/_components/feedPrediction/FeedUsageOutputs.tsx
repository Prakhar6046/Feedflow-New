"use clinet";
import {
  calculateFishGrowth,
  CommonFeedPredictionHead,
  exportFeedPredictionToXlsx,
  getLocalItem,
} from "@/app/_lib/utils";
import { FarmGroup } from "@/app/_typeModels/production";
import { useAppDispatch } from "@/lib/hooks";
import { MultiSelect } from "primereact/multiselect";
import {
  Box,
  Button,
  Divider,
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
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { Controller, useForm } from "react-hook-form";
import FishGrowthChart from "../charts/FishGrowthChart";
import FishGrowthTable from "../table/FishGrowthTable";
import { FishFeedingData } from "./AdHoc";
import Loader from "../Loader";

import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { FarmsFishGrowth } from "./FeedingPlanOutputs";
import FeedUsageTable from "../table/FeedUsageTable";

// import MenuItem from "@mui/material/MenuItem";

const headerStyle = {
  borderBottom: 0,
  color: "#fff",
  background: "#06a19b",
  fontSize: { md: 16, xs: 14 },
  fontWeight: 600,
};

const cellStyle = {
  borderBottomWidth: 0,
  color: "#555555",
  fontWeight: 500,
  whiteSpace: "nowrap",
  p: 0,
};

const feedStyle = {
  fontWeight: 500,
  fontSize: 14,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  backgroundColor: "#F5F6F8",
  borderTopLeftRadius: "8px",
  borderBottomLeftRadius: "8px",
  padding: "8px 12px",
  margin: "8px 0",
  textWrap: "nowrap",
};

const amountStyle = {
  fontWeight: 500,
  fontSize: 14,
  display: "flex",
  alignItems: "center",
  backgroundColor: "#F5F6F8",
  padding: "8px 12px",
  margin: "8px 0",
  textWrap: "nowrap",
};

const summaryStyle = {
  fontWeight: 500,
  fontSize: 14,
  padding: "16px 12px",
  background: "#06a19b",
  color: "#fff",
};
const FeedUsageOutput = () => {
  const [farmList, setFarmList] = useState<any>([]);
  const [farmOption, setFarmOptions] = useState<any[]>([]);
  const [unitOption, setUnitOptions] = useState<any[]>([]);
  const [selectedDropDownfarms, setSelectedDropDownfarms] = useState<any>([]);
  const [selectedDropDownUnits, setSelectedDropDownUnits] = useState<any>([]);
  const [startDate, setStartDate] = useState<string | null>(
    dayjs().toISOString()
  );
  const [endDate, setEndDate] = useState<string | null>(dayjs().toISOString());
  const [flatData, setFlatData] = useState<FarmsFishGrowth[]>([]);
  const [filteredData, setFilteredData] = useState<FarmsFishGrowth[]>([]);
  const [formData, setFomData] = useState<any>();
  const {
    control,
    setValue,
    watch,
    register,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (selectedDropDownfarms) {
      const getProductionUnits = (
        dynamicFarms: {
          id: string;
          option: string;
        }[],
        detailedFarms: any
      ) => {
        return dynamicFarms.map((dynamicFarm) => {
          const matchedFarm = detailedFarms.find(
            (farm: any) => farm.units?.[0]?.farm?.id === dynamicFarm.id
          );
          return {
            farmId: dynamicFarm.id,
            option: dynamicFarm.option,
            productionUnits: matchedFarm?.units || [],
          };
        });
      };
      const result = getProductionUnits(selectedDropDownfarms, farmList);
      let customUnits = result.flatMap((farm) =>
        farm?.productionUnits.map((unit: any) => ({
          id: unit.id,
          option: unit.productionUnit?.name,
        }))
      );
      setUnitOptions(customUnits);
      setSelectedDropDownUnits(customUnits);
    }
  }, [selectedDropDownfarms]);
  useEffect(() => {
    const selectedUnitIds = selectedDropDownUnits.map((unit: any) => unit.id);

    const data = flatData.filter((unit: any) =>
      selectedUnitIds.includes(unit.unitId)
    );
    setFilteredData(data);
  }, [selectedDropDownUnits]);
  useEffect(() => {
    const data = getLocalItem("feedPredictionData");
    if (data) {
      let customFarms: any = data?.productionData?.map((farm: any) => {
        return { option: farm.farm, id: farm.units[0].farm.id };
      });
      setFarmList(data?.productionData);
      setStartDate(data?.startDate);
      setEndDate(data?.endDate);
      setFarmOptions(customFarms);
      setSelectedDropDownfarms(customFarms);
      setValue("adjustmentFactor", data.adjustmentFactor);
      setFomData(data);
      const fishGrowthData: any = data?.productionData?.map(
        (production: FarmGroup) =>
          production.units.map((unit: any) => {
            const formattedDate = dayjs(data?.startDate).format("YYYY-MM-DD");
            const diffInDays = dayjs(data?.endDate).diff(
              dayjs(data?.startDate),
              "day"
            );
            setValue("period", diffInDays);
            return {
              farm: production.farm,
              farmId: unit?.farm?.id,
              unitId: unit.id,
              unit: unit.productionUnit.name,
              fishGrowthData: calculateFishGrowth(
                Number(data?.fishWeight ?? 0),
                data?.tempSelection === "default"
                  ? Number(unit?.waterTemp ?? 0)
                  : Number(data?.temp),
                Number(unit.fishCount ?? 0),
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
  return (
    <Stack>
      <Box mb={5}>
        <Grid container spacing={2} mt={1}>
          <Grid
            item
            xl={2}
            lg={4}
            md={4}
            sm={6}
            xs={12}
            sx={{
              width: "fit-content",
              paddingTop: "8px",
            }}
          >
            <Box sx={{ width: "100%" }}>
              <FormControl fullWidth className="form-input selected" focused>
                <InputLabel
                  id="demo-simple-select-label-1 "
                  className="custom-input"
                >
                  Farms
                </InputLabel>
                <MultiSelect
                  value={selectedDropDownfarms}
                  onChange={(e) => setSelectedDropDownfarms(e.value)}
                  options={farmOption}
                  optionLabel="option"
                  display="chip"
                  placeholder="Select Farms"
                  dropdownIcon={
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="10"
                      height="10"
                      viewBox="0 0 15 15"
                    >
                      <path fill="currentColor" d="M7.5 12L0 4h15z" />
                    </svg>
                  } // Custom dropdown icon
                  maxSelectedLabels={3}
                  // Custom icon
                  className="w-full md:w-20rem custom-select"
                />
              </FormControl>
            </Box>
          </Grid>

          <Grid
            item
            xl={2}
            lg={4}
            md={4}
            sm={6}
            xs={12}
            sx={{
              width: "fit-content",
              paddingTop: "8px",
            }}
          >
            <Box sx={{ width: "100%" }}>
              <FormControl
                fullWidth
                className={`form-input ${
                  selectedDropDownfarms?.length >= 1 && "selected"
                }`}
                focused
              >
                <InputLabel
                  id="demo-simple-select-label"
                  className="custom-input"
                >
                  Units
                </InputLabel>

                <MultiSelect
                  value={selectedDropDownUnits}
                  onChange={(e) => setSelectedDropDownUnits(e.value)}
                  options={unitOption}
                  optionLabel="option"
                  display="chip"
                  placeholder="Select Units"
                  maxSelectedLabels={3}
                  dropdownIcon={
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="10"
                      height="10"
                      viewBox="0 0 15 15"
                    >
                      <path fill="currentColor" d="M7.5 12L0 4h15z" />
                    </svg>
                  }
                  className="w-full md:w-20rem custom-select"
                />
              </FormControl>
            </Box>
          </Grid>

          <Grid item xl={2} lg={4} md={4} sm={6} xs={12}>
            <FormControl fullWidth className={`form-input`} focused>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Start Date"
                  className="date-picker form-input"
                  disabled
                  value={dayjs(startDate)}
                  onChange={(value) => {
                    const isoDate = value?.toISOString();
                    if (isoDate) setStartDate(isoDate);
                  }}
                  maxDate={dayjs(endDate)}
                />
              </LocalizationProvider>
            </FormControl>
          </Grid>

          <Grid item xl={2} lg={4} md={4} sm={6} xs={12}>
            <FormControl fullWidth className={`form-input`} focused>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="End Date"
                  value={dayjs(endDate)}
                  disabled
                  onChange={(value) => {
                    const isoDate = value?.toISOString();
                    if (isoDate) setEndDate(isoDate);
                  }}
                  sx={{
                    marginTop: "0",
                    borderRadius: "6px",
                  }}
                  className="date-picker form-input"
                  minDate={dayjs(startDate)}
                  maxDate={dayjs()}
                />
              </LocalizationProvider>
            </FormControl>
          </Grid>
          <Grid item xl={2} lg={4} md={4} sm={6} xs={12}>
            <Box position={"relative"} width={"100%"}>
              <TextField
                label="Period *"
                disabled
                type="text"
                {...register("period", {
                  required: true,
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
                days
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>
      <Box>
        <Grid item xs={12}>
          <Paper
            sx={{
              overflow: "hidden",
              borderRadius: "14px",
              boxShadow: "0px 0px 16px 5px #0000001A",
            }}
          >
            <FeedUsageTable flatData={filteredData} />
          </Paper>
          <Box
            mt={5}
            sx={{
              display: "flex",
              justifyContent: "end",
              gap: 1.5,
            }}
          >
            <Button
              type="button"
              variant="contained"
              disabled
              sx={{
                background: "#06A19B",
                color: "#fff",
                fontWeight: 600,
                padding: "6px 16px",
                width: "fit-content",
                textTransform: "capitalize",
                borderRadius: "8px",
                border: "1px solid #06A19B",
              }}
            >
              Order Feed
            </Button>

            <Button
              type="button"
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
              Create PDF
            </Button>
          </Box>
        </Grid>
      </Box>
    </Stack>
  );
};
export default FeedUsageOutput;
