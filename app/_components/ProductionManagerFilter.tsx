import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Radio,
  RadioGroup,
  Select,
} from "@mui/material";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { MultiSelect } from "primereact/multiselect";
import "primereact/resources/primereact.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import React, { useEffect, useState } from "react";
import { averagesDropdown, months } from "../_lib/utils";
import { Farm } from "../_typeModels/Farm";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  commonFilterAction,
  selectAllFarms,
  selectAllUnits,
  selectDropDownYears,
  selectEndMonth,
  selectSelectedAverage,
  selectSelectedFarms,
  selectSelectedUnits,
  selectStartMonth,
} from "@/lib/features/commonFilters/commonFilters";
interface Props {
  selectedView: string | undefined;
  // selectedAverage: String;
  // setSelectedAverage: (val: any) => void;
  // selectedDropDownfarms: { id: string; option: string }[] | [];
  // selectedDropDownUnits: { id: string; option: string }[] | [];
  // selectedDropDownYears: Array<number> | [] | any;
  // setEndMonth: (val: number) => void;
  // setStartMonth: (val: number) => void;
  // handleYearChange: (e: any) => void;
  // startMonth: number;
  // endMonth: number;
  // setSelectedDropDownfarms: any;
  // setSelectedDropDownUnits: any;
  handleResetFilters: () => void;
  // createXlsxFile: (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => void;
  farmsList: Farm[];
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
  selectedView,
  // selectedAverage,
  // setSelectedAverage,
  // selectedDropDownfarms,
  // allFarms,
  // selectedDropDownUnits,
  // allUnits,
  // selectedDropDownYears,
  // setEndMonth,
  // setStartMonth,
  // handleYearChange,
  // startMonth,
  // endMonth,
  // setSelectedDropDownfarms,
  // setSelectedDropDownUnits,
  handleResetFilters,
  // createXlsxFile,
  farmsList,
}: Props) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const allFarms = useAppSelector(selectAllFarms);
  const allUnits = useAppSelector(selectAllUnits);
  const selectedDropDownfarms = useAppSelector(selectSelectedFarms);
  const selectedDropDownUnits = useAppSelector(selectSelectedUnits);
  const selectedDropDownYears = useAppSelector(selectDropDownYears);
  const startMonth = useAppSelector(selectStartMonth);
  const endMonth = useAppSelector(selectEndMonth);
  const selectedAverage = useAppSelector(selectSelectedAverage);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open4 = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenNext, setIsModalOpenNext] = useState(false);
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
  useEffect(() => {
    if (farmsList) {
      let customFarms: any = farmsList.map((farm: Farm) => {
        return { option: farm.name, id: farm.id };
      });
      // customFarms.unshift({ code: "0", option: "All farms" });
      dispatch(commonFilterAction.setAllFarms(customFarms));
      dispatch(commonFilterAction.setSelectedDropDownfarms(customFarms));
    }
  }, [farmsList]);
  return (
    <Box>
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
                onChange={(e) =>
                  dispatch(commonFilterAction.setSelectedDropDownfarms(e.value))
                }
                options={farms}
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
                onChange={(e) =>
                  dispatch(commonFilterAction.setSelectedDropDownUnits(e.value))
                }
                options={units}
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
                onChange={(e) =>
                  dispatch(
                    commonFilterAction.setSelectedAverage(e.target.value)
                  )
                }
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
        <Grid
          item
          xl={3}
          lg={6}
          sm={6}
          xs={12}
          sx={{
            width: "fit-content",
            paddingTop: "8px",
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={4}>
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
                  <InputLabel id="demo-simple-select-label-1">
                    Select Year
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label-1"
                    id="demo-simple-select"
                    label="Select Year"
                    multiple
                    value={selectedDropDownYears}
                    onChange={(e) =>
                      dispatch(
                        commonFilterAction.handleYearChange(e.target.value)
                      )
                    }
                    input={<OutlinedInput label="Select Year" />}
                    renderValue={(selected) => selected.join(", ")}
                    MenuProps={MenuProps}
                  >
                    {years.map((year) => (
                      <MenuItem key={year} value={year}>
                        <Checkbox
                          checked={selectedDropDownYears?.includes(year)}
                        />
                        <ListItemText primary={year} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Grid>
            <Grid item xs={4}>
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
                  <InputLabel id="demo-simple-select-label">
                    Start month
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="Start month"
                    value={startMonth}
                    onChange={(e) =>
                      dispatch(
                        commonFilterAction.setStartMonth(Number(e.target.value))
                      )
                    }
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
            <Grid item xs={4}>
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
                  <InputLabel id="demo-simple-select-label">
                    End month
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="End month"
                    value={endMonth}
                    onChange={(e) =>
                      dispatch(
                        commonFilterAction.setEndMonth(Number(e.target.value))
                      )
                    }
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
          </Grid>
        </Grid>

        <Grid
          item
          xl={3}
          lg={6}
          xs={12}
          sx={{
            width: "fit-content",
            paddingTop: "8px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              gap: "10px",
              mt: 1,
              justifyContent: "start",
            }}
          >
            <Button
              id="basic-button"
              type="button"
              variant="contained"
              onClick={handleResetFilters}
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
              Reset Filters
            </Button>
            {selectedView === "feeding" && (
              <Button
                id="basic-button"
                type="button"
                variant="contained"
                sx={{
                  background: "#06A19B",
                  fontWeight: 600,
                  padding: "6px 16px",
                  width: "fit-content",
                  textTransform: "capitalize",
                  borderRadius: "8px",
                  color: "white",
                  boxShadow: "none",
                  "&:hover": {
                    boxShadow: "none",
                  },
                }}
                onClick={() => router.push("/dashboard/feedPrediction")}
              >
                Feed Prediction
              </Button>
            )}

            {/* <Button
              sx={{
                background: "#06A19B",
                fontWeight: 600,
                padding: "6px 16px",
                width: "fit-content",
                textTransform: "capitalize",
                borderRadius: "8px",
                color: "white",
              }}
              id="basic-buttonnew"
              aria-controls={open4 ? "basic-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open4 ? "true" : undefined}
              onClick={handleClick}
            >
              Create report
            </Button>
            <Menu
              id="basic-menunew"
              anchorEl={anchorEl}
              open={open4}
              onClose={handleClose}
              MenuListProps={{
                "aria-labelledby": "basic-button",
              }}
              sx={{
                borderRadius: "26px",
              }}
            >
              <MenuItem onClick={captureScreenshot}>Take screenshot</MenuItem>
              <MenuItem
                onClick={() =>
                  router.push("/dashboard/production/createReport")
                }
              >
                Create all report
              </MenuItem>
            </Menu> */}
          </Box>
        </Grid>
      </Grid>
      <Dialog
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
        }}
      >
        <DialogTitle>Select farms</DialogTitle>
        <DialogContent>
          <Grid container>
            <Grid item xs={3}>
              <FormControl>
                <RadioGroup
                  aria-labelledby="demo-radio-buttons-group-label"
                  value={"fish"}
                  name="radio-buttons-group"
                  //    onChange={(e) => {
                  //      handleTableView(e.target.value);
                  //    }}
                  className="ic-radio"
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    flexWrap: "nowrap",
                  }}
                >
                  <FormControlLabel
                    value="fish"
                    control={<Radio />}
                    label="Farm1"
                    className="input-btn"
                  />
                </RadioGroup>
              </FormControl>
            </Grid>
            <Grid item xs={3}>
              <FormControl>
                <RadioGroup
                  aria-labelledby="demo-radio-buttons-group-label"
                  value={"fish"}
                  name="radio-buttons-group"
                  //    onChange={(e) => {
                  //      handleTableView(e.target.value);
                  //    }}
                  className="ic-radio"
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    flexWrap: "nowrap",
                  }}
                >
                  <FormControlLabel
                    value="fish"
                    control={<Radio />}
                    label="Farm2"
                    className="input-btn"
                  />
                </RadioGroup>
              </FormControl>
            </Grid>
            <Grid item xs={3}>
              <FormControl>
                <RadioGroup
                  aria-labelledby="demo-radio-buttons-group-label"
                  value={"fish"}
                  name="radio-buttons-group"
                  //    onChange={(e) => {
                  //      handleTableView(e.target.value);
                  //    }}
                  className="ic-radio"
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    flexWrap: "nowrap",
                  }}
                >
                  <FormControlLabel
                    value="fish"
                    control={<Radio />}
                    label="Farm3"
                    className="input-btn"
                  />
                </RadioGroup>
              </FormControl>
            </Grid>
            <Grid item xs={3}>
              <FormControl>
                <RadioGroup
                  aria-labelledby="demo-radio-buttons-group-label"
                  value={"fish"}
                  name="radio-buttons-group"
                  //    onChange={(e) => {
                  //      handleTableView(e.target.value);
                  //    }}
                  className="ic-radio"
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    flexWrap: "nowrap",
                  }}
                >
                  <FormControlLabel
                    value="fish"
                    control={<Radio />}
                    label="Farm4"
                    className="input-btn"
                  />
                </RadioGroup>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions
          sx={{
            p: 3,
          }}
        >
          <Button
            type="button"
            variant="contained"
            onClick={() => setIsModalOpenNext(true)}
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

          <Button
            type="button"
            onClick={() => {
              setIsModalOpen(false);
            }}
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
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* Next modal for select units*/}

      <Dialog
        open={isModalOpenNext}
        onClose={() => {
          setIsModalOpenNext(false);
        }}
      >
        <DialogTitle>Select </DialogTitle>
        <DialogContent>
          <Grid container>
            <Grid item xs={12}>
              <Box sx={{ display: "flex" }}>Farm one </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions
          sx={{
            p: 3,
          }}
        >
          <Button
            type="button"
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
            finish
          </Button>

          <Button
            type="button"
            onClick={() => {
              setIsModalOpenNext(false);
            }}
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
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default ProductionManagerFilter;
{
  /* <Button
id="basic-button"
type="button"
variant="contained"
onClick={(e) => createXlsxFile(e)}
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
Create .xlsx File
</Button> */
}
