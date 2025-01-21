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
import React from "react";
import { averagesDropdown, months } from "../_lib/utils";
import dayjs from "dayjs";
interface Props {
  selectedAverage: String;
  setSelectedAverage: (val: any) => void;
  selectedDropDownfarms: Array<string>;
  allFarms: { id: string; option: string }[];
  allUnits: { id: string; option: string }[];
  selectedDropDownUnits: Array<string>;
  selectedDropDownYears: Array<number>;
  setEndMonth: (val: number) => void;
  setStartMonth: (val: number) => void;
  handleYearChange: (e: any) => void;
  handleChange: (e: any, isFarmChange: boolean) => void;
  startMonth: number;
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
  handleChange,
  startMonth,
}: Props) {
  const currentYear = dayjs().year();
  const years = Array.from({ length: 6 }, (_, i) => currentYear - i);
  return (
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
      <Grid
        item
        xs={2}
        sx={{
          width: "fit-content",
          minWidth: 235,
          paddingTop: "8px",
        }}
      >
        <Box sx={{ width: "100%" }}>
          <FormControl fullWidth className="form-input" focused>
            <InputLabel id="demo-simple-select-label-1">All farms</InputLabel>
            <Select
              labelId="demo-simple-select-label-1"
              id="demo-simple-select"
              label="All farms"
              multiple
              value={selectedDropDownfarms.map((farm) => farm.option)}
              onChange={(e) => handleChange(e, true)}
              input={<OutlinedInput label="All farms" />}
              renderValue={(selected) => selected.join(", ")}
              MenuProps={MenuProps}
            >
              {allFarms?.map((farm) => (
                <MenuItem key={farm.id} value={farm.option}>
                  <Checkbox
                    checked={selectedDropDownfarms.some(
                      (selected) => selected.option === farm.option
                    )}
                  />
                  <ListItemText primary={farm.option} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Grid>
      <Grid
        item
        xs={2}
        sx={{
          width: "fit-content",
          minWidth: 235,
          paddingTop: "8px",
        }}
      >
        <Box sx={{ width: "100%" }}>
          <FormControl fullWidth className="form-input" focused>
            <InputLabel
              id="demo-simple-select-label"
              disabled={selectedDropDownfarms.length > 1 ? false : true}
            >
              All units
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="All units"
              multiple
              // readOnly={selectedDropDownfarms.length ? false : true}
              value={selectedDropDownUnits.map((unit) => unit?.option)}
              onChange={(e) => handleChange(e, false)}
              input={<OutlinedInput label="All units" />}
              renderValue={(selected) => selected.join(", ")}
              MenuProps={MenuProps}
            >
              {allUnits.map((unit) => (
                <MenuItem key={unit.id} value={unit.option}>
                  <Checkbox
                    checked={selectedDropDownUnits.some(
                      (selected) => selected?.option === unit.option
                    )}
                  />
                  <ListItemText primary={unit.option} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Grid>
      <Grid
        item
        xs={2}
        sx={{
          width: "fit-content",
          minWidth: 235,
          paddingTop: "8px",
        }}
      >
        <Box sx={{ width: "100%" }}>
          <FormControl fullWidth className="form-input" focused>
            <InputLabel id="demo-simple-select-label-1">Select Year</InputLabel>
            <Select
              labelId="demo-simple-select-label-1"
              id="demo-simple-select"
              label="Select Year"
              multiple
              disabled={selectedDropDownUnits?.length ? false : true}
              value={selectedDropDownYears}
              onChange={(e) => handleYearChange(e)}
              input={<OutlinedInput label="Select Year" />}
              renderValue={(selected) => selected.join(", ")}
              MenuProps={MenuProps}
            >
              {years.map((year) => (
                <MenuItem key={year} value={year}>
                  <Checkbox checked={selectedDropDownYears.includes(year)} />
                  <ListItemText primary={year} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Grid>
      <Grid
        item
        xs={2}
        sx={{
          width: "fit-content",
          minWidth: 235,
          paddingTop: "8px",
        }}
      >
        <Box sx={{ width: "100%" }}>
          <FormControl fullWidth className="form-input" focused>
            <InputLabel id="demo-simple-select-label">Start month</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Start month"
              disabled={selectedDropDownYears?.length ? false : true}
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
        xs={2}
        sx={{
          width: "fit-content",
          minWidth: 235,
          paddingTop: "8px",
        }}
      >
        <Box sx={{ width: "100%" }}>
          <FormControl fullWidth className="form-input" focused>
            <InputLabel id="demo-simple-select-label">End month</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="End month"
              disabled={selectedDropDownYears?.length ? false : true}
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
        xs={2}
        sx={{
          width: "fit-content",
          minWidth: 235,
          paddingTop: "8px",
        }}
      >
        <Box sx={{ width: "100%" }}>
          <FormControl fullWidth className="form-input" focused>
            <InputLabel id="demo-simple-select-label">Averages</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Averages"
              value={selectedAverage}
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
        xs={2}
        sx={{
          width: "fit-content",
          minWidth: 235,
          paddingTop: "8px",
        }}
      >
        <Box sx={{ width: "100%" }}>Clear</Box>
      </Grid> */}
    </Box>
  );
}

export default ProductionManagerFilter;
