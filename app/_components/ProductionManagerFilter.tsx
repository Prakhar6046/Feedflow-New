import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
} from '@mui/material';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import { MultiSelect } from 'primereact/multiselect';
import 'primereact/resources/primereact.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import React, { useEffect, useState } from 'react';
import { averagesDropdown } from '../_lib/utils';
import { Farm } from '../_typeModels/Farm';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import {
  commonFilterAction,
  selectAllFarms,
  selectAllUnits,
  selectDropDownYears,
  selectEndDate,
  selectSelectedAverage,
  selectSelectedFarms,
  selectSelectedUnits,
  selectStartDate,
} from '@/lib/features/commonFilters/commonFilters';
import { FarmGroup } from '../_typeModels/production';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
interface Props {
  selectedView?: string | undefined;
  farmsList: Farm[];
  groupedData: FarmGroup[];
  setProductionData: (val: FarmGroup[]) => void;
  reset: boolean;
}
type HistoryEntry = {
  createdAt: string;
  [key: string]: any;
};
function ProductionManagerFilter({
  selectedView,
  farmsList,
  groupedData,
  setProductionData,
  reset,
}: Props) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const allFarms = useAppSelector(selectAllFarms);
  const allUnits = useAppSelector(selectAllUnits);
  const selectedDropDownfarms = useAppSelector(selectSelectedFarms);
  const selectedDropDownUnits = useAppSelector(selectSelectedUnits);
  const selectedDropDownYears = useAppSelector(selectDropDownYears);
  const startDate = useAppSelector(selectStartDate);
  const endDate = useAppSelector(selectEndDate);
  const selectedAverage = useAppSelector(selectSelectedAverage);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenNext, setIsModalOpenNext] = useState(false);
  const [farms, setFarms] = useState<
    {
      id: string;
      option: string;
    }[]
  >([]);
  const [units, setUnits] = useState<
    {
      id: string;
      option: string;
    }[]
  >([]);

  // const handleResetFilters = () => {
  //   dispatch(commonFilterAction.setSelectedDropDownfarms(allFarms));
  //   dispatch(commonFilterAction.setSelectedDropDownUnits([]));
  //   dispatch(
  //     commonFilterAction.setSelectedDropDownYears([new Date().getFullYear()])
  //   );
  //   dispatch(commonFilterAction.setSelectedAverage(averagesDropdown[0]));
  //   dispatch(commonFilterAction.setStartDate(dayjs().startOf("year").format()));
  //   dispatch(commonFilterAction.setEndDate(dayjs().format()));
  // };
  useEffect(() => {
    if (allFarms || allUnits) {
      setFarms(allFarms);
      setUnits(allUnits);
    }
  }, [allFarms, allUnits]);
  useEffect(() => {
    if (selectedDropDownfarms) {
      const getProductionUnits = (
        dynamicFarms: {
          id: string;
          option: string;
        }[],
        detailedFarms: Farm[],
      ) => {
        return dynamicFarms.map((dynamicFarm) => {
          const matchedFarm = detailedFarms?.find(
            (farm) => farm.id === dynamicFarm.id,
          );
          return {
            farmId: dynamicFarm.id,
            option: dynamicFarm.option,
            productionUnits: matchedFarm?.productionUnits || [],
          };
        });
      };
      const result = getProductionUnits(selectedDropDownfarms, farmsList);
      const customUnits = result.flatMap((farm) =>
        farm?.productionUnits.map((unit) => ({
          id: unit.id,
          option: unit.name,
        })),
      );
      dispatch(commonFilterAction.setAllUnits(customUnits));
      dispatch(commonFilterAction.setSelectedDropDownUnits(customUnits));
    }
  }, [selectedDropDownfarms]);
  useEffect(() => {
    if (!groupedData || !groupedData.length) return;
    // Utility: Filter by farms
    const filterByFarms = (
      data: FarmGroup[],
      selectedFarms: { id: string; option: string }[],
    ) => {
      if (!selectedFarms?.length) return data;
      const selectedFarmIds = selectedFarms?.map(
        (farm: { option: string; id: string }) => farm?.id,
      );
      return data
        .map((farm) => ({
          ...farm,
          units: farm.units.filter((unit) =>
            selectedFarmIds.includes(unit.farm.id ?? ''),
          ),
        }))
        .filter((farm) => farm.units.length > 0);
    };

    // Utility: Filter by units
    const filterByUnits = (
      data: FarmGroup[],
      selectedUnits: { id: string; option: string }[],
    ) => {
      if (!selectedUnits?.length) return data;
      const selectedUnitIds = selectedUnits?.map(
        (unit: { id: string; option: string }) => unit?.id,
      );
      return data
        .map((farm) => ({
          ...farm,
          units: farm.units.filter((unit) =>
            selectedUnitIds.includes(unit.productionUnit?.id),
          ),
        }))
        .filter((farm) => farm.units.length > 0);
    };

    // Utility: Filter by years
    // const filterByYears = (data: FarmGroup[], selectedYears: Array<number>) => {
    //   if (!selectedYears?.length) return data;
    //   return data
    //     .map((farm) => ({
    //       ...farm,
    //       units: farm.units.filter((unit: any) =>
    //         selectedYears?.includes(new Date(unit.createdAt).getFullYear())
    //       ),
    //     }))
    //     .filter((farm) => farm.units.length > 0);
    // };

    // Utility: Filter by months
    // const filterByMonths = (
    //   data: FarmGroup[],
    //   years: Array<number>,
    //   startMonth: number,
    //   endMonth: number,
    // ) => {
    //   if (!years.length || !startMonth || !endMonth) return data;

    //   const startDates = years.map(
    //     (year) => new Date(`${year}-${String(startMonth).padStart(2, '0')}-01`),
    //   );
    //   const endDates = years.map((year) => {
    //     const end = new Date(`${year}-${String(endMonth).padStart(2, '0')}-01`);
    //     end.setMonth(end.getMonth() + 1); // Include the end of the month
    //     return end;
    //   });

    //   return data
    //     .map((farm) => ({
    //       ...farm,
    //       units: farm.units.filter((unit) => {
    //         const createdAt = new Date(unit.createdAt);
    //         return startDates.some(
    //           (start, index) =>
    //             createdAt >= start && createdAt < endDates[index],
    //         );
    //       }),
    //     }))
    //     .filter((farm) => farm.units.length > 0);
    // };
    const filterByDates = (
      data: FarmGroup[],
      startDate: string,
      endDate: string,
    ) => {
      if (!startDate || !endDate) return data;
      const start = dayjs(startDate).format('YYYY-MM-DD');
      const end = dayjs(endDate).format('YYYY-MM-DD');

      return data
        .map((farm) => ({
          ...farm,
          units: farm.units.filter((unit) => {
            const created = dayjs(unit.createdAt).format('YYYY-MM-DD');
            return created >= start && created <= end;
          }),
        }))
        .filter((farm) => farm.units.length > 0);
    };
    // Utility: Calculate averages
    const calculateAverages = (data: FarmGroup[], type: string) => {
      const calculateIndividualAverages = (
        history: HistoryEntry[] | undefined,
        fields: string[],
      ): Record<string, number> => {
        const totals: Record<string, number> = fields.reduce(
          (acc, field) => {
            acc[field] = 0;
            return acc;
          },
          {} as Record<string, number>,
        );
        let count = 0;

        history?.forEach((entry) => {
          fields.forEach((field) => {
            totals[field] += parseFloat(entry[field]) || 0;
          });
          count += 1;
        });

        return fields.reduce(
          (averages, field) => {
            averages[field] = count > 0 ? totals[field] / count : 0;
            return averages;
          },
          {} as Record<string, number>,
        );
      };

      switch (type) {
        case 'Monthly average':
          return data.map((farm) => ({
            ...farm,
            units: farm.units.map((unit) => ({
              ...unit,
              monthlyAverages: calculateIndividualAverages(
                unit.fishManageHistory.filter(
                  (entry: { createdAt: string }) => {
                    const createdAt = new Date(entry.createdAt);
                    const startMonth = dayjs(startDate).month() + 1;
                    const endMonth = dayjs(endDate).month() + 1;
                    return (
                      createdAt.getMonth() + 1 >= Number(startMonth) &&
                      createdAt.getMonth() + 1 <= Number(endMonth) &&
                      selectedDropDownYears.includes(createdAt.getFullYear())
                    );
                  },
                ),
                [
                  'biomass',
                  'fishCount',
                  'meanLength',
                  'meanWeight',
                  'stockingDensityKG',
                  'stockingDensityNM',
                ],
              ),

              monthlyAveragesWater: calculateIndividualAverages(
                unit?.WaterManageHistoryAvgrage?.filter((entry) => {
                  const createdAt = new Date(entry.createdAt);
                  const startMonth = dayjs(startDate).month() + 1;
                  const endMonth = dayjs(endDate).month() + 1;
                  return (
                    createdAt.getMonth() + 1 >= Number(startMonth) &&
                    createdAt.getMonth() + 1 <= Number(endMonth) &&
                    selectedDropDownYears.includes(createdAt.getFullYear())
                  );
                }),
                [
                  'DO',
                  'NH4',
                  'NO2',
                  'NO3',
                  'TSS',
                  'ph',
                  'visibility',
                  'waterTemp',
                ],
              ),
            })),
          }));

        case 'Yearly average':
          return data.map((farm) => ({
            ...farm,
            units: farm.units.map((unit) => ({
              ...unit,
              yearlyAverages: calculateIndividualAverages(
                unit.fishManageHistory.filter(
                  (entry: { createdAt: string }) => {
                    const createdAt = new Date(entry.createdAt);
                    return selectedDropDownYears.includes(
                      createdAt.getFullYear(),
                    );
                  },
                ),
                [
                  'biomass',
                  'fishCount',
                  'meanLength',
                  'meanWeight',
                  'stockingDensityKG',
                  'stockingDensityNM',
                ],
              ),
              yearlyAveragesWater: calculateIndividualAverages(
                unit?.WaterManageHistoryAvgrage?.filter(
                  (entry: { createdAt: string }) => {
                    const createdAt = new Date(entry.createdAt);
                    return selectedDropDownYears.includes(
                      createdAt.getFullYear(),
                    );
                  },
                ),
                [
                  'DO',
                  'NH4',
                  'NO2',
                  'NO3',
                  'TSS',
                  'ph',
                  'visibility',
                  'waterTemp',
                ],
              ),
            })),
          }));

        case 'All-time average':
          return data.map((farm) => ({
            ...farm,
            units: farm.units.map((unit) => ({
              ...unit,
              allTimeAverages: calculateIndividualAverages(
                unit.fishManageHistory || [],
                [
                  'biomass',
                  'fishCount',
                  'meanLength',
                  'meanWeight',
                  'stockingDensityKG',
                  'stockingDensityNM',
                ],
              ),
              allTimeAveragesWater: calculateIndividualAverages(
                unit.WaterManageHistoryAvgrage || [],
                [
                  'DO',
                  'NH4',
                  'NO2',
                  'NO3',
                  'TSS',
                  'ph',
                  'visibility',
                  'waterTemp',
                ],
              ),
            })),
          }));

        case 'Individual average':
          return data.map((farm) => ({
            ...farm,
            units: farm.units.map((unit) => ({
              ...unit,
              individualAverages: calculateIndividualAverages(
                unit.fishManageHistory || [],
                [
                  'biomass',
                  'fishCount',
                  'meanLength',
                  'meanWeight',
                  'stockingDensityKG',
                  'stockingDensityNM',
                ],
              ),
              individualAveragesWater: calculateIndividualAverages(
                unit.WaterManageHistoryAvgrage || [],
                [
                  'DO',
                  'NH4',
                  'NO2',
                  'NO3',
                  'TSS',
                  'ph',
                  'visibility',
                  'waterTemp',
                ],
              ),
            })),
          }));

        default:
          return data;
      }
    };

    // Apply filters sequentially
    let filteredData = groupedData;
    console.log('grouped data', groupedData);

    filteredData = filterByFarms(filteredData, selectedDropDownfarms);
    filteredData = filterByUnits(filteredData, selectedDropDownUnits);
    // filteredData = filterByYears(filteredData, selectedDropDownYears);
    // filteredData = filterByMonths(
    //   filteredData,
    //   selectedDropDownYears,
    //   startDate,
    //   endDate
    // );
    filteredData = filterByDates(filteredData, startDate, endDate);

    // Apply averages
    const processedData = calculateAverages(
      filteredData as FarmGroup[],
      selectedAverage,
    ) as FarmGroup[];

    setProductionData(processedData);
  }, [
    selectedDropDownfarms,
    selectedDropDownUnits,
    selectedDropDownYears,
    startDate,
    endDate,
    selectedAverage,
  ]);
  useEffect(() => {
    if (farmsList) {
      const customFarms = farmsList.map((farm: Farm) => {
        return { option: farm.name, id: farm.id };
      });
      // customFarms.unshift({ code: "0", option: "All farms" });
      dispatch(commonFilterAction.setAllFarms(customFarms));
      dispatch(commonFilterAction.setSelectedDropDownfarms(customFarms));
    }
  }, [farmsList]);
  return (
    <Box>
      <Box sx={{ display: 'flex', gap: 2, width: '100%', flexWrap: 'wrap' }}>
        <Box>
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
              selectAllLabel="Select All"
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
              className="w-100 max-w-100 custom-select"
            />
          </FormControl>
        </Box>

        <Box>
          <Box sx={{ width: '100%' }}>
            <FormControl
              fullWidth
              className={`form-input ${
                selectedDropDownfarms?.length >= 1 && 'selected'
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
                selectAllLabel="Select All"
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
                className="w-100 max-w-100 custom-select"
              />
            </FormControl>
          </Box>
        </Box>

        <Box>
          <Box sx={{ width: '100%' }}>
            <FormControl
              fullWidth
              className={`form-input ${
                selectedDropDownfarms?.length &&
                selectedDropDownUnits?.length &&
                // selectedDropDownYears?.length &&
                startDate &&
                endDate &&
                'selected'
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
                  startDate &&
                  endDate
                    ? false
                    : true
                }
                onChange={(e) =>
                  dispatch(
                    commonFilterAction.setSelectedAverage(e.target.value),
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
        </Box>

        <Box>
          <Box sx={{ width: '100%' }}>
            <FormControl
              fullWidth
              className={`form-input ${
                selectedDropDownfarms?.length &&
                selectedDropDownUnits?.length &&
                ''
              }`}
              focused
            >
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Start Date"
                  className="date-picker form-input"
                  value={dayjs(startDate)}
                  onChange={(value) => {
                    const isoDate = value?.toISOString();
                    if (isoDate)
                      dispatch(commonFilterAction.setStartDate(isoDate));
                  }}
                  maxDate={dayjs(endDate)}
                />
              </LocalizationProvider>
            </FormControl>
          </Box>
        </Box>

        <Box>
          <Box sx={{ width: '100%' }}>
            <FormControl
              fullWidth
              className={`form-input ${
                selectedDropDownfarms?.length &&
                selectedDropDownUnits?.length &&
                startDate &&
                ''
              }`}
              focused
            >
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="End Date"
                  value={dayjs(endDate)}
                  onChange={(value) => {
                    const isoDate = value?.toISOString();
                    if (isoDate)
                      dispatch(commonFilterAction.setEndDate(isoDate));
                  }}
                  sx={{
                    marginTop: '0',
                    borderRadius: '6px',
                  }}
                  className="date-picker form-input"
                  minDate={dayjs(startDate)}
                  maxDate={dayjs()}
                />
              </LocalizationProvider>
            </FormControl>
          </Box>
        </Box>

        <Box>
          <Box
            sx={{
              display: 'flex',
              gap: '10px',
              mt: 1,
              justifyContent: 'start',
            }}
          >
            {reset && (
              <Button
                id="basic-button"
                type="button"
                variant="contained"
                onClick={() =>
                  dispatch(commonFilterAction.handleResetFilters())
                }
                sx={{
                  background: '#fff',
                  color: '#06A19B',
                  fontWeight: 600,
                  padding: '6px 16px',
                  width: 'fit-content',
                  textTransform: 'capitalize',
                  borderRadius: '8px',
                  border: '1px solid #06A19B',
                  whiteSpace: 'nowrap',
                  boxShadow: 'none',
                  '&:hover': {
                    boxShadow: 'none',
                  },
                }}
              >
                Reset Filters
              </Button>
            )}
            {selectedView === 'feeding' && (
              <Button
                id="basic-button"
                type="button"
                variant="contained"
                sx={{
                  background: '#06A19B',
                  fontWeight: 600,
                  padding: '6px 16px',
                  width: 'fit-content',
                  textTransform: 'capitalize',
                  borderRadius: '8px',
                  color: 'white',
                  whiteSpace: 'nowrap',
                  boxShadow: 'none',
                  '&:hover': {
                    boxShadow: 'none',
                  },
                }}
                onClick={() => router.push('/dashboard/feedPrediction')}
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
        </Box>
      </Box>
      {/* <Grid container spacing={2} mt={1}> */}
      {/* <Grid
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
          
        </Grid> */}

      {/* <Grid
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
          
        </Grid> */}

      {/* <Grid
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
          
        </Grid> */}

      {/* <Grid
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
          
        </Grid> */}

      {/* <Grid
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
          
        </Grid> */}

      {/* <Grid
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
          <Grid container>
            <Grid item xs>
              <Box sx={{ width: "100%" }}>
                <FormControl
                  fullWidth
                  className={`form-input ${selectedDropDownfarms?.length &&
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

          </Grid>
        </Grid> */}

      {/* <Grid
          item
          xs
          sx={{
            pt: 0,
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
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    gap: 3,
                    alignItems: "center",
                    margin: "0",
                  }}
                  components={["DatePicker"]}
                >
                  <DatePicker
                    label="Start Date"
                    className="date-picker"
                    value={dayjs(startDate)}
                    onChange={(value) => {
                      const isoDate = value?.toISOString();
                      if (isoDate)
                        dispatch(commonFilterAction.setStartDate(isoDate));
                    }}
                    maxDate={dayjs(endDate)}
                  />
                  <DatePicker
                    label="End Date"
                    value={dayjs(endDate)}
                    onChange={(value) => {
                      const isoDate = value?.toISOString();
                      if (isoDate)
                        dispatch(commonFilterAction.setEndDate(isoDate));
                    }}
                    sx={{
                      marginTop: "0",

                      borderRadius: "6px",
                    }}
                    className="date-picker"
                    minDate={dayjs(startDate)}
                    maxDate={dayjs()}
                  />
                </DemoContainer>
              </LocalizationProvider>
            </FormControl>
          </Box>
        </Grid> */}

      {/* <Grid
        item
        xs
        sx={{
          width: "fit-content",
          paddingTop: "8px",
        }}
      >
        
      </Grid> */}
      {/* </Grid> */}
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
                  value={'fish'}
                  name="radio-buttons-group"
                  //    onChange={(e) => {
                  //      handleTableView(e.target.value);
                  //    }}
                  className="ic-radio"
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    flexWrap: 'nowrap',
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
                  value={'fish'}
                  name="radio-buttons-group"
                  //    onChange={(e) => {
                  //      handleTableView(e.target.value);
                  //    }}
                  className="ic-radio"
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    flexWrap: 'nowrap',
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
                  value={'fish'}
                  name="radio-buttons-group"
                  //    onChange={(e) => {
                  //      handleTableView(e.target.value);
                  //    }}
                  className="ic-radio"
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    flexWrap: 'nowrap',
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
                  value={'fish'}
                  name="radio-buttons-group"
                  //    onChange={(e) => {
                  //      handleTableView(e.target.value);
                  //    }}
                  className="ic-radio"
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    flexWrap: 'nowrap',
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
              background: '#06A19B',
              fontWeight: 600,
              padding: '6px 16px',
              width: 'fit-content',
              textTransform: 'capitalize',
              borderRadius: '8px',
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
              background: '#fff',
              color: '#06A19B',
              fontWeight: 600,
              padding: '6px 16px',
              width: 'fit-content',
              textTransform: 'capitalize',
              borderRadius: '8px',
              border: '1px solid #06A19B',
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
              <Box sx={{ display: 'flex' }}>Farm one </Box>
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
              background: '#06A19B',
              fontWeight: 600,
              padding: '6px 16px',
              width: 'fit-content',
              textTransform: 'capitalize',
              borderRadius: '8px',
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
              background: '#fff',
              color: '#06A19B',
              fontWeight: 600,
              padding: '6px 16px',
              width: 'fit-content',
              textTransform: 'capitalize',
              borderRadius: '8px',
              border: '1px solid #06A19B',
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
