'use clinet';
import { calculateFishGrowthTilapia, getLocalItem } from '@/app/_lib/utils';
import { MultiSelect } from 'primereact/multiselect';
import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { Paper } from '@mui/material';
import { FarmsFishGrowth } from './FeedingPlanOutputs';
import FeedUsageTable from '../table/FeedUsageTable';
import { FarmGroup, FarmGroupUnit } from '@/app/_typeModels/production';

interface FarmOption {
  id: string;
  option: string;
}

interface UnitOption {
  id: number;
  option: string;
}

export interface FeedPredictionData {
  productionData: FarmGroup[];
  startDate: string;
  endDate: string;
  adjustmentFactor: number;
  fishWeight?: number;
  tempSelection?: string;
  temp?: number;
  timeInterval?: number;
}

// import MenuItem from "@mui/material/MenuItem";

const FeedUsageOutput: React.FC = () => {
  const [farmList, setFarmList] = useState<FarmGroup[]>([]);
  const [farmOption, setFarmOptions] = useState<FarmOption[]>([]);
  const [unitOption, setUnitOptions] = useState<UnitOption[]>([]);
  const [selectedDropDownfarms, setSelectedDropDownfarms] = useState<
    FarmOption[]
  >([]);
  const [selectedDropDownUnits, setSelectedDropDownUnits] = useState<
    UnitOption[]
  >([]);
  const [startDate, setStartDate] = useState<string | null>(
    dayjs().toISOString(),
  );
  const [endDate, setEndDate] = useState<string | null>(dayjs().toISOString());
  const [flatData, setFlatData] = useState<FarmsFishGrowth[]>([]);
  const [filteredData, setFilteredData] = useState<FarmsFishGrowth[]>([]);
  const { setValue, register } = useForm();

  useEffect(() => {
    if (selectedDropDownfarms) {
      const getProductionUnits = (
        dynamicFarms: FarmOption[],
        detailedFarms: FarmGroup[],
      ) => {
        return dynamicFarms.map((dynamicFarm) => {
          const matchedFarm = detailedFarms.find(
            (farm: FarmGroup) =>
              farm.units?.[0]?.productionUnit?.farmId === dynamicFarm.id,
          );
          return {
            farmId: dynamicFarm.id,
            option: dynamicFarm.option,
            productionUnits: matchedFarm?.units || [],
          };
        });
      };
      const result = getProductionUnits(selectedDropDownfarms, farmList);
      const customUnits: UnitOption[] = result.flatMap((farm) =>
        farm?.productionUnits.map((unit: FarmGroupUnit) => ({
          id: unit.id,
          option: unit.productionUnit?.name,
        })),
      );
      setUnitOptions(customUnits);
      setSelectedDropDownUnits(customUnits);
    }
  }, [selectedDropDownfarms, farmList]);

  useEffect(() => {
    const selectedUnitIds = selectedDropDownUnits.map((unit) => unit.id);
    const data = flatData.filter((unit: FarmsFishGrowth) =>
      selectedUnitIds.includes(unit.unitId),
    );
    setFilteredData(data);
  }, [selectedDropDownUnits, flatData]);

  useEffect(() => {
    const data: FeedPredictionData | null = getLocalItem('feedPredictionData');
    if (data) {
      const customFarms: FarmOption[] = data?.productionData?.map(
        (farm: FarmGroup) => {
          return { option: farm.farm, id: farm.units[0].farm.id ?? '' };
        },
      );
      setFarmList(data?.productionData);
      setStartDate(data?.startDate);
      setEndDate(data?.endDate);
      setFarmOptions(customFarms);
      setSelectedDropDownfarms(customFarms);
      setValue('adjustmentFactor', data.adjustmentFactor);
      const fishGrowthData = data?.productionData?.map((production) =>
        production.units.map((unit) => {
          const formattedDate = dayjs(data?.startDate).format('YYYY-MM-DD');
          const diffInDays = dayjs(data?.endDate).diff(
            dayjs(data?.startDate),
            'day',
          );
          setValue('period', diffInDays);
          return {
            farm: unit.farm.name || '',
            farmId: unit?.farm?.id || '',
            unitId: unit.id,
            unit: unit.productionUnit.name,
            fishGrowthData: calculateFishGrowthTilapia(
              Number(data?.fishWeight ?? 0),
              data?.tempSelection === 'default'
                ? Number(unit?.waterTemp ?? 0)
                : Number(data?.temp),
              Number(unit.fishCount ?? 0),
              Number(data.adjustmentFactor),
              Number(diffInDays),
              formattedDate,
              data?.timeInterval ?? 0,
              13.47,
            ),
          };
        }),
      );
      if (fishGrowthData?.length) {
        setFlatData([...fishGrowthData].flat());
      }
    }
  }, [setValue]);
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
              width: 'fit-content',
              paddingTop: '8px',
            }}
          >
            <Box sx={{ width: '100%' }}>
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
              width: 'fit-content',
              paddingTop: '8px',
            }}
          >
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
                    marginTop: '0',
                    borderRadius: '6px',
                  }}
                  className="date-picker form-input"
                  minDate={dayjs(startDate)}
                  maxDate={dayjs()}
                />
              </LocalizationProvider>
            </FormControl>
          </Grid>
          <Grid item xl={2} lg={4} md={4} sm={6} xs={12}>
            <Box position={'relative'} width={'100%'}>
              <TextField
                label="Period *"
                disabled
                type="text"
                {...register('period', {
                  required: true,
                })}
                className="form-input"
                focused
                sx={{
                  width: '100%',
                }}
              />
              <Typography
                variant="body1"
                color="#555555AC"
                sx={{
                  position: 'absolute',
                  right: 13,
                  top: '30%',
                  backgroundColor: 'white',
                  paddingInline: '5px',
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
              overflow: 'hidden',
              borderRadius: '14px',
              boxShadow: '0px 0px 16px 5px #0000001A',
            }}
          >
            <FeedUsageTable flatData={filteredData} />
          </Paper>
          <Box
            mt={5}
            sx={{
              display: 'flex',
              justifyContent: 'end',
              gap: 1.5,
            }}
          >
            <Button
              type="button"
              variant="contained"
              disabled
              sx={{
                background: '#06A19B',
                color: '#fff',
                fontWeight: 600,
                padding: '6px 16px',
                width: 'fit-content',
                textTransform: 'capitalize',
                borderRadius: '8px',
                border: '1px solid #06A19B',
              }}
            >
              Order Feed
            </Button>

            <Button
              type="button"
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
              Create PDF
            </Button>
          </Box>
        </Grid>
      </Box>
    </Stack>
  );
};
export default FeedUsageOutput;
