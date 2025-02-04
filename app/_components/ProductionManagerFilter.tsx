import {
  Box,
  Checkbox,
  FormControl,
  Grid,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { averagesDropdown, months } from "../_lib/utils";
import dayjs from "dayjs";
import { MultiSelect } from "primereact/multiselect";

import "primereact/resources/primereact.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
interface Props {
  selectedAverage: String;
  setSelectedAverage: (val: any) => void;
  selectedDropDownfarms: { id: string; option: string }[] | [];
  allFarms: { option: string; id: string }[];
  allUnits: { option: string; id: string }[];
  selectedDropDownUnits: { id: string; option: string }[] | [];
  selectedDropDownYears: Array<number> | [] | any;
  setEndMonth: (val: number) => void;
  setStartMonth: (val: number) => void;
  handleYearChange: (e: any) => void;
  startMonth: number;
  endMonth: number;
  setSelectedDropDownfarms: any;
  setSelectedDropDownUnits: any;
}
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};
function ProductionManagerFilter({
  selectedAverage,
  setSelectedAverage,
  selectedDropDownfarms,
  allFarms,
  selectedDropDownUnits,
  allUnits,
  selectedDropDownYears,
  setEndMonth,
  setStartMonth,
  handleYearChange,
  startMonth,
  endMonth,
  setSelectedDropDownfarms,
  setSelectedDropDownUnits,
}: Props) {
  const currentYear = dayjs().year();
  const years = Array.from({ length: 6 }, (_, i) => currentYear - i);
  const [farms, setFarms] = useState<any>([]);
  const [units, setUnits] = useState<any>([]);
  useEffect(() => {
    if (allFarms || allUnits) {
      setFarms(allFarms);
      setUnits(allUnits);
    }
  }, [allFarms, allUnits]);
  return (
    <Grid container spacing={2} mt={1}>
      <Grid
        item
        lg={2}
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
            <InputLabel id="demo-simple-select-label-1">Farms</InputLabel>
            {/* <Select
              labelId="demo-simple-select-label-1"
              id="demo-simple-select"
              label="Farms"
              multiple
              sx={{ color: "black" }}
              value={selectedDropDownfarms?.map((farm: any) => farm.option)}
              onChange={(e) => handleChange(e, true)}
              input={<OutlinedInput label="Farms" />}
              renderValue={(selected) => selected.join(", ")}
              MenuProps={MenuProps}
            >
              {allFarms?.map((farm: any) => (
                <MenuItem key={farm.id} value={farm.option}>
                  <Checkbox
                    checked={selectedDropDownfarms?.some(
                      (selected: any) => selected.option === farm.option
                    )}
                  />
                  <ListItemText primary={farm.option} />
                </MenuItem>
              ))}
            </Select> */}
            <MultiSelect
              value={selectedDropDownfarms}
              onChange={(e) => setSelectedDropDownfarms(e.value)}
              options={farms}
              optionLabel="option"
              display="chip"
              placeholder="Select Farms"
              maxSelectedLabels={3}
              className="w-full md:w-20rem"
            />
          </FormControl>
        </Box>
      </Grid>
      <Grid
        item
        lg={2}
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
            <InputLabel id="demo-simple-select-label">Units</InputLabel>
            {/* <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Units"
              multiple
              disabled={selectedDropDownfarms?.length >= 1 ? false : true}
              value={selectedDropDownUnits?.map((unit: any) => unit?.option)}
              onChange={(e) => handleChange(e, false)}
              input={<OutlinedInput label="Units" />}
              renderValue={(selected) => selected.join(", ")}
              MenuProps={MenuProps}
            >
              {allUnits.map((unit: any) => (
                <MenuItem key={unit.id} value={unit.option}>
                  <Checkbox
                    checked={selectedDropDownUnits?.some(
                      (selected: any) => selected?.option === unit.option
                    )}
                  />
                  <ListItemText primary={unit.option} />
                </MenuItem>
              ))}
            </Select> */}
            <MultiSelect
              value={selectedDropDownUnits}
              onChange={(e) => setSelectedDropDownUnits(e.value)}
              options={units}
              optionLabel="option"
              display="chip"
              placeholder="Select Units"
              maxSelectedLabels={3}
              className="w-full md:w-20rem"
            />
          </FormControl>
        </Box>
      </Grid>
      <Grid
        item
        lg={2}
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
              selectedDropDownfarms?.length &&
              selectedDropDownUnits?.length &&
              "selected"
            }`}
            focused
          >
            <InputLabel id="demo-simple-select-label-1">Select Year</InputLabel>
            <Select
              labelId="demo-simple-select-label-1"
              id="demo-simple-select"
              label="Select Year"
              multiple
              // disabled={
              //   selectedDropDownfarms?.length && selectedDropDownUnits?.length
              //     ? false
              //     : true
              // }
              value={selectedDropDownYears}
              onChange={(e) => handleYearChange(e)}
              input={<OutlinedInput label="Select Year" />}
              renderValue={(selected) => selected.join(", ")}
              MenuProps={MenuProps}
            >
              {years.map((year) => (
                <MenuItem key={year} value={year}>
                  <Checkbox checked={selectedDropDownYears?.includes(year)} />
                  <ListItemText primary={year} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Grid>
      <Grid
        item
        lg={2}
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
              selectedDropDownfarms?.length &&
              selectedDropDownUnits?.length &&
              selectedDropDownYears?.length &&
              "selected"
            }`}
            focused
          >
            <InputLabel id="demo-simple-select-label">Start month</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Start month"
              value={startMonth}
              // disabled={
              //   selectedDropDownfarms?.length &&
              //   selectedDropDownUnits?.length &&
              //   selectedDropDownYears?.length
              //     ? false
              //     : true
              // }
              onChange={(e) => setStartMonth(Number(e.target.value))}
            >
              {months.map((month) => (
                <MenuItem value={month.id} key={month.id}>
                  {month.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Grid>
      <Grid
        item
        lg={2}
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
              selectedDropDownfarms?.length &&
              selectedDropDownUnits?.length &&
              selectedDropDownYears?.length &&
              startMonth &&
              "selected"
            }`}
            focused
          >
            <InputLabel id="demo-simple-select-label">End month</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="End month"
              // disabled={
              //   selectedDropDownfarms?.length &&
              //   selectedDropDownUnits?.length &&
              //   selectedDropDownYears?.length &&
              //   startMonth
              //     ? false
              //     : true
              // }
              value={endMonth}
              onChange={(e) => setEndMonth(Number(e.target.value))}
            >
              {months.map((month) => (
                <MenuItem
                  value={month.id}
                  key={month.id}
                  disabled={startMonth >= month.id ? true : false}
                >
                  {month.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Grid>
      <Grid
        item
        lg={2}
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
              selectedDropDownfarms?.length &&
              selectedDropDownUnits?.length &&
              selectedDropDownYears?.length &&
              startMonth &&
              endMonth &&
              "selected"
            }`}
            focused
          >
            <InputLabel id="demo-simple-select-label">Averages</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Averages"
              value={selectedAverage}
              disabled={
                selectedDropDownfarms &&
                selectedDropDownUnits &&
                selectedDropDownYears &&
                startMonth &&
                endMonth
                  ? false
                  : true
              }
              onChange={(e) => setSelectedAverage(e.target.value)}
            >
              {averagesDropdown.map((data, i) => {
                return (
                  <MenuItem value={data} key={i}>
                    {data}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </Box>
      </Grid>
      {/* <Grid
        item
     lg={2}
        sx={{
          width: "fit-content",
         
          paddingTop: "8px",
        }}
      >
        <Box sx={{ width: "100%" }}>Clear</Box>
      </Grid> */}
    </Grid>
  );
}

export default ProductionManagerFilter;
