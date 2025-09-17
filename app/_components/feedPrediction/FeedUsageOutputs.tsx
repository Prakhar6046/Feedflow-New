'use clinet';
import { calculateFishGrowthTilapia, calculateFishGrowthRainBowTrout, calculateFishGrowthAfricanCatfish, getLocalItem } from '@/app/_lib/utils';
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
import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { getCookie } from 'cookies-next';
import Cookies from 'js-cookie';
import { SingleUser } from '@/app/_typeModels/User';

import { Paper } from '@mui/material';
import { FarmsFishGrowth } from './FeedingPlanOutputs';
import FeedUsageTable from '../table/FeedUsageTable';
import { FarmGroup, FarmGroupUnit } from '@/app/_typeModels/production';
import { OrganisationModelResponse } from '@/app/_typeModels/growthModel';
import PrintPreviewDialog from '../PrintPreviewDialog';

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
  species?: 'Nile Tilapia' | 'African Catfish' | 'Rainbow Trout';
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
  const [growthModelData, setGrowthModelData] = useState<OrganisationModelResponse[]>([]);
  const [organisationId, setOrganisationId] = useState<number>(0);
  const [startDate, setStartDate] = useState<string | null>(
    dayjs().toISOString(),
  );
  const [endDate, setEndDate] = useState<string | null>(dayjs().toISOString());
  const [flatData, setFlatData] = useState<FarmsFishGrowth[]>([]);
  const [filteredData, setFilteredData] = useState<FarmsFishGrowth[]>([]);
  const { setValue, register } = useForm();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewHtml, setPreviewHtml] = useState<string | null>(null);
  const [previewTitle, setPreviewTitle] = useState<string>('Print Preview');
  const usageTableRef = useRef<HTMLDivElement | null>(null);

  // Fetch organisationId
  useEffect(() => {
    const loggedUser = Cookies.get('logged-user');
    if (loggedUser) {
      try {
        const user: SingleUser = JSON.parse(loggedUser);
        setOrganisationId(user.organisationId);
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);

  // Fetch growth models for organisation
  useEffect(() => {
    if (!organisationId) return;
    const fetchModels = async () => {
      try {
        const res = await fetch(`/api/growth-model?organisationId=${organisationId}`);
        if (!res.ok) throw new Error('Failed to fetch growth models');
        const data = await res.json();
        setGrowthModelData(data.data || []);
      } catch (error) {
        console.error('Error fetching growth model data:', error);
      }
    };
    fetchModels();
  }, [organisationId]);

  // Helper: select growth model per farm and unit
  const selectGrowthModelForUnit = (
    farm: any,
    unit: any,
  ): OrganisationModelResponse | null => {
    try {
      // Resolve speciesId prioritising unit-level history
      const unitHistoryArr = unit?.fishManageHistory || unit?.FishManageHistory || [];
      const unitHistory = Array.isArray(unitHistoryArr) && unitHistoryArr.length > 0 ? unitHistoryArr[0] : null;
      let speciesId = unitHistory?.speciesId || unitHistory?.fishSupplyData?.speciesId || unitHistory?.fishSupplyData?.speciesID || null;

      if (!speciesId) {
        // Fallback: search farm-level history by productionUnitId
        const farmHistory = (farm?.FishManageHistory || []).find(
          (h: any) => String(h.productionUnitId) === String(unit?.productionUnit?.id)
        );
        speciesId = farmHistory?.speciesId || farmHistory?.fishSupplyData?.speciesId || farmHistory?.fishSupplyData?.speciesID || null;
      }

      // Resolve productionSystemId from farm.productionUnits by productionUnit.id
      const prodUnit = (farm?.productionUnits || []).find(
        (pu: any) => String(pu.id) === String(unit?.productionUnit?.id)
      );
      const productionSystemId = prodUnit?.productionSystemId || null;

      if (!speciesId) {
        // If no species found, use any default model as fallback
        const anyDefault = growthModelData.find((gm) => gm.isDefault);
        if (anyDefault) return anyDefault;
        return null;
      }

      // Step 1: Find exact matches by species AND production system
      const exactMatches = growthModelData.filter((gm) => {
        const sameSpecies = gm.models.specieId === speciesId;
        const sameProductionSystem = productionSystemId ? gm.models.productionSystemId === productionSystemId : true;
        return sameSpecies && sameProductionSystem;
      });

      if (exactMatches.length === 1) {
        return exactMatches[0];
      }

      if (exactMatches.length > 1) {
        // If 2+ matches found → use the one with selectedFarms field that includes the current farm
        const farmScoped = exactMatches.find((gm) =>
          Array.isArray(gm.selectedFarms) &&
          gm.selectedFarms.some((sf: any) => sf.farmId === farm?.id)
        );
        if (farmScoped) return farmScoped;
        return exactMatches[0];
      }

      // Step 2: If no exact matches → try species-only matches first, then default
      const speciesMatches = growthModelData.filter((gm) => gm.models.specieId === speciesId);

      if (speciesMatches.length === 1) {
        return speciesMatches[0];
      }

      if (speciesMatches.length > 1) {
        // Multiple species matches - prefer farm-scoped, then default
        const farmScoped = speciesMatches.find((gm) =>
          Array.isArray(gm.selectedFarms) &&
          gm.selectedFarms.some((sf: any) => sf.farmId === farm?.id)
        );
        if (farmScoped) return farmScoped;

        const speciesDefault = speciesMatches.find((gm) => gm.isDefault);
        if (speciesDefault) return speciesDefault;

        return speciesMatches[0];
      }

      // Step 3: If no species matches at all → use any default model
      const anyDefault = growthModelData.find((gm) => gm.isDefault);
      if (anyDefault) return anyDefault;

      return null;
    } catch (e) {
      console.error('Error selecting model for unit', e);
      return null;
    }
  };

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

  // Build table data ONLY after growth models are loaded and form data is ready
  useEffect(() => {
    const data: FeedPredictionData | null = getLocalItem('feedPredictionData');
    if (!data || !Array.isArray(growthModelData) || growthModelData.length === 0) {
      return;
    }

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

        const gm = selectGrowthModelForUnit(unit?.farm || production?.units?.[0]?.farm, unit);

        return {
          farm: unit.farm.name || '',
          farmId: unit?.farm?.id || '',
          unitId: unit.id,
          unit: unit.productionUnit.name,
          fishGrowthData: data?.species === 'Rainbow Trout'
            ? calculateFishGrowthRainBowTrout(
              gm,
              Number(data?.fishWeight ?? 0),
              data?.tempSelection === 'default'
                ? Number(unit?.waterTemp ?? 25)
                : Number(data?.temp ?? 25),
              Number(unit.fishCount ?? 0),
              Number(data.adjustmentFactor),
              Number(diffInDays),
              formattedDate,
              data?.timeInterval ?? 1,
            )
            : data?.species === 'African Catfish'
              ? calculateFishGrowthAfricanCatfish(
                gm,
                Number(data?.fishWeight ?? 0),
                data?.tempSelection === 'default'
                  ? Number(unit?.waterTemp ?? 25)
                  : Number(data?.temp ?? 25),
                Number(unit.fishCount ?? 0),
                Number(data.adjustmentFactor),
                Number(diffInDays),
                formattedDate,
                data?.timeInterval ?? 1,
              )
              : calculateFishGrowthTilapia(
                gm,
                Number(data?.fishWeight ?? 0),
                data?.tempSelection === 'default'
                  ? Number(unit?.waterTemp ?? 25)
                  : Number(data?.temp ?? 25),
                Number(unit.fishCount ?? 0),
                Number(data.adjustmentFactor),
                Number(diffInDays),
                formattedDate,
                data?.timeInterval ?? 1,
              ),
        };
      }),
    );
    if (fishGrowthData?.length) {
      setFlatData([...fishGrowthData].flat());
    }
  }, [growthModelData, setValue]);
  return (
    <Stack>
      <PrintPreviewDialog
        open={previewOpen}
        title={previewTitle}
        html={previewHtml}
        onClose={() => setPreviewOpen(false)}
      />

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
                className={`form-input ${selectedDropDownfarms?.length >= 1 && 'selected'
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
            <Box ref={usageTableRef}>
              <FeedUsageTable flatData={filteredData} />
            </Box>
          </Paper>
          <Box
            mt={5}
            sx={{
              display: 'flex',
              justifyContent: 'end',
              gap: 1.5, pb: 5
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
            <Button
              type="button"
              variant="contained"
              onClick={() => {
                const node = usageTableRef.current;
                if (!node) return;
                setPreviewTitle('Feed Requirement / Usage');
                setPreviewHtml(node.innerHTML);
                setPreviewOpen(true);
              }}
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
              Print
            </Button>
          </Box>
        </Grid>
      </Box>
    </Stack>
  );
};
export default FeedUsageOutput;
