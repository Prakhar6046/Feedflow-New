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
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { getCookie } from 'cookies-next';
import { clientSecureFetch } from '../../_lib/clientSecureFetch';
import Cookies from 'js-cookie';
import { SingleUser } from '@/app/_typeModels/User';

import { Paper } from '@mui/material';
import { FarmsFishGrowth } from './FeedingPlanOutputs';
import FeedUsageTable from '../table/FeedUsageTable';
import { FarmGroup, FarmGroupUnit } from '@/app/_typeModels/production';
import { OrganisationModelResponse } from '@/app/_typeModels/growthModel';
import PrintPreviewDialog from '../PrintPreviewDialog';
import { useMemo } from 'react';

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
  wasteFactor?: number;
  mortalityRate?: number;
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
  const [loading, setLoading] = useState(false);
  const usageTableRef = useRef<HTMLDivElement | null>(null);
  const [dataLoading, setDataLoading] = useState(true);
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
    setDataLoading(true);
    const fetchModels = async () => {
      try {
        const res = await clientSecureFetch(`/api/growth-model?organisationId=${organisationId}`);
        if (!res.ok) throw new Error('Failed to fetch growth models');
        const data = await res.json();
        setGrowthModelData(data.data || []);
      } catch (error) {
        console.error('Error fetching growth model data:', error);
      } finally {
        setDataLoading(false);
      }
    };
    fetchModels();
  }, [organisationId]);

  // Fetch and cache default feeds
  useEffect(() => {
    const fetchDefaultFeeds = async () => {
      try {
        const res = await clientSecureFetch('/api/feed-store');
        if (res.ok) {
          const data = await res.json();
          const defaultFeeds = data.data?.filter((feed: any) => feed.isDefault === true) || [];
          if (typeof window !== 'undefined') {
            localStorage.setItem('defaultFeedsCache', JSON.stringify(defaultFeeds));
          }
        }
      } catch (error) {
        console.error('Error fetching default feeds:', error);
      }
    };
    fetchDefaultFeeds();
  }, []);

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

  // Resolve feedLinks for all selected farms/units (unit-level first, farm-level fallback)
  const allFeedLinks = useMemo(() => {
    try {
      const data: FeedPredictionData | null = getLocalItem('feedPredictionData');
      if (!data || !farmList.length) return [] as any[];

      const feedLinksMap = new Map<string, any>();

      // Collect feedLinks from all selected farms and units
      selectedDropDownfarms.forEach((selectedFarm) => {
        const farm = farmList.find(
          (f: FarmGroup) => f.units?.[0]?.farm?.id === selectedFarm.id,
        );

        if (!farm) return;

        // Get farm-level feedLinks
        const feedProfile = (farm?.farm?.FeedProfile as any[])?.[0];
        const farmLinks = feedProfile?.feedLinks || [];
        farmLinks.forEach((link: any) => {
          const key = link?.feedStore?.productName || '';
          if (key && !feedLinksMap.has(key)) {
            feedLinksMap.set(key, link);
          }
        });

        // Get unit-level feedLinks for selected units
        selectedDropDownUnits.forEach((selectedUnit) => {
          const unit = farm.units.find(
            (u: FarmGroupUnit) => u.id === selectedUnit.id,
          );

          if (unit) {
            const unitLinks =
              unit?.productionUnit?.FeedProfileProductionUnit?.[0]?.feedProfile
                ?.feedLinks || [];
            unitLinks.forEach((link: any) => {
              const key = link?.feedStore?.productName || '';
              if (key) {
                // Unit-level links take precedence over farm-level
                feedLinksMap.set(key, link);
              }
            });
          }
        });
      });

      return Array.from(feedLinksMap.values());
    } catch (e) {
      console.error('Error resolving feedLinks', e);
      return [] as any[];
    }
  }, [selectedDropDownfarms, selectedDropDownUnits, farmList]);

  // Handle loading state to prevent body scrolling
  useEffect(() => {
    let scrollY = 0;
    if (loading) {
      scrollY = window.scrollY;
      document.body.style.top = `-${scrollY}px`;
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    } else {
      const storedY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      if (storedY) {
        const y = parseInt(storedY.replace('px', ''), 10) * -1;
        window.scrollTo(0, y);
      }
    }
  
    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
    };
  }, [loading]);
  
  // Create PDF function with pagination support and header on every page
  const createFeedUsagePDF = async () => {
    if (!filteredData.length) {
      return;
    }

    const node = usageTableRef.current;
    if (!node) return;
     
    const scrollY = window.scrollY;
    setLoading(true);

    try {
      // Wait for render to complete
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Find table elements
      const tableElement = node.querySelector('table') as HTMLTableElement;
      const tableHeadElement = node.querySelector('table thead') as HTMLTableSectionElement;
      const tableBodyElement = node.querySelector('table tbody') as HTMLTableSectionElement;

      if (!tableElement || !tableHeadElement || !tableBodyElement) {
        console.error('Table, header, or body not found');
        setLoading(false);
        return;
      }

      // Create PDF in landscape orientation for table
      const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const margin = 10;
      const availableWidth = pdfWidth - (margin * 2);
      const availableHeight = pdfHeight - (margin * 2);

      // 1. Capture header separately
      const headerCanvas = await html2canvas(tableHeadElement, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });
      const headerImgData = headerCanvas.toDataURL('image/png', 1.0);
      const headerImgProps = pdf.getImageProperties(headerImgData);
      const headerWidthPx = headerImgProps.width;
      const headerHeightPx = headerImgProps.height;

      // Calculate scaled header dimensions
      const headerWidthRatio = availableWidth / headerWidthPx;
      const headerScaledWidth = headerWidthPx * headerWidthRatio;
      const headerScaledHeight = headerHeightPx * headerWidthRatio;

      // 2. Capture body separately
      const bodyCanvas = await html2canvas(tableBodyElement, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        width: tableBodyElement.scrollWidth,
        height: tableBodyElement.scrollHeight,
      });
      const bodyWidthPx = bodyCanvas.width;
      const bodyHeightPx = bodyCanvas.height;

      // Calculate scaled body dimensions
      const bodyWidthRatio = availableWidth / bodyWidthPx;
      const bodyScaledWidth = bodyWidthPx * bodyWidthRatio;
      const bodyScaledHeight = bodyHeightPx * bodyWidthRatio;

      // Available height for body content per page (after header)
      const bodyHeightPerPage = availableHeight - headerScaledHeight;

      // Check if body fits on one page with header
      if (bodyScaledHeight <= bodyHeightPerPage) {
        // Single page - fits on one page
        // Draw header
        pdf.addImage(
          headerImgData,
          'PNG',
          margin,
          margin,
          headerScaledWidth,
          headerScaledHeight,
        );
        // Draw body below header
        pdf.addImage(
          bodyCanvas.toDataURL('image/png', 1.0),
          'PNG',
          margin,
          margin + headerScaledHeight,
          bodyScaledWidth,
          bodyScaledHeight,
        );
      } else {
        // Multiple pages needed - split body and repeat header on each page
        // Calculate how much body height in pixels corresponds to the available height per page
        const bodyHeightPerPageInPx = bodyHeightPerPage / bodyWidthRatio;
        const pagesCount = Math.ceil(bodyHeightPx / bodyHeightPerPageInPx);

        let currentSourceY = 0; // Track position in original body canvas (in pixels)

        for (let i = 0; i < pagesCount; i++) {
          if (i > 0) {
            pdf.addPage();
          }

          // Draw header on every page
          pdf.addImage(
            headerImgData,
            'PNG',
            margin,
            margin,
            headerScaledWidth,
            headerScaledHeight,
          );

          // Calculate the portion of body for this page based on available height
          const remainingHeight = bodyHeightPx - currentSourceY;
          const sourceHeight = Math.min(bodyHeightPerPageInPx, remainingHeight);

          // Calculate scaled height for this page portion
          const pageBodyScaledHeight = sourceHeight * bodyWidthRatio;

          // Create a temporary canvas for this page's body portion
          const pageCanvas = document.createElement('canvas');
          pageCanvas.width = bodyWidthPx;
          pageCanvas.height = Math.ceil(sourceHeight);
          const pageCtx = pageCanvas.getContext('2d');

          if (pageCtx) {
            // Draw the portion of the original body canvas for this page
            pageCtx.drawImage(
              bodyCanvas,
              0,
              currentSourceY,
              bodyWidthPx,
              sourceHeight,
              0,
              0,
              bodyWidthPx,
              sourceHeight,
            );

            const pageBodyImgData = pageCanvas.toDataURL('image/png', 1.0);

            // Draw body chunk below header (ensuring proper spacing)
            pdf.addImage(
              pageBodyImgData,
              'PNG',
              margin,
              margin + headerScaledHeight,
              bodyScaledWidth,
              pageBodyScaledHeight,
            );

            // Move to next portion
            currentSourceY += sourceHeight;
          }
        }
      }

      // Save PDF with a descriptive name
      const fileName = `feed_usage_${dayjs().format('YYYY-MM-DD_HH-mm-ss')}.pdf`;
      pdf.save(fileName);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setLoading(false);
      window.scrollTo(0, scrollY);
    }
  };

  // Build table data ONLY after growth models are loaded and form data is ready
  useEffect(() => {
    const data: FeedPredictionData | null = getLocalItem('feedPredictionData');
    if (!data || !Array.isArray(growthModelData) || growthModelData.length === 0) {
      // If growth models are not loaded yet, keep loading true (managed by growth model fetch)
      // If growth models are loaded but no data, set loading false (nothing to process)
      if (Array.isArray(growthModelData) && growthModelData.length === 0) {
        setDataLoading(false);
      }
      return;
    }
    setDataLoading(true);

    const customFarms: FarmOption[] = data?.productionData?.map(
      (farm: FarmGroup) => {
        return { option: farm.farm.name, id: farm.units[0].farm.id ?? '' };
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
                unit,
                Number(data?.wasteFactor ?? 3),
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
                unit,
                Number(data?.wasteFactor ?? 3),
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
                unit,
                Number(data?.wasteFactor ?? 3),
              ),
        };
      }),
    );
    if (fishGrowthData?.length) {
      setFlatData([...fishGrowthData].flat());
    }
    setDataLoading(false);
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
              paddingTop: '8px'
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
            <Box ref={usageTableRef}>
              <FeedUsageTable 
                flatData={filteredData} 
                feedLinks={allFeedLinks} 
                loading={dataLoading}
              />
            </Box>
          </Paper>
          <Box
            mt={5}
            mb={3}
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
              onClick={createFeedUsagePDF}
              disabled={loading || !filteredData.length}
              sx={{
                background: '#fff',
                color: '#06A19B',
                fontWeight: 600,
                padding: '6px 16px',
                width: 'fit-content',
                textTransform: 'capitalize',
                borderRadius: '8px',
                border: '1px solid #06A19B',
                '&:disabled': {
                  opacity: 0.6,
                },
              }}
            >
              {loading ? 'Creating PDF...' : 'Create PDF'}
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
