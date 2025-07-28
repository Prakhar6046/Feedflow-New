'use client';
import { getFullYear, setLocalItem } from '@/app/_lib/utils';
import { Farm, ProductionParaMeterType } from '@/app/_typeModels/Farm';
import { SingleOrganisation } from '@/app/_typeModels/Organization';
import { Production } from '@/app/_typeModels/production';
import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  Stack,
  Typography,
} from '@mui/material';
import { setCookie } from 'cookies-next';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
interface Props {
  farms: Farm[];
  productions: Production[];
}
interface SelectedFarms {
  farm: string | undefined;
  units: {
    id: string;
    name: string;
    farmId: string;
    YearBasedPredicationProductionUnit: ProductionParaMeterType[];
  }[];
}

interface GroupedData {
  farm: string;
  units: {
    id: number;
    productionUnit: {
      YearBasedPredicationProductionUnit?: ProductionParaMeterType[];
      id: string;
      name: string;
      type: string;
      capacity: string;
      waterflowRate: string;
      createdAt: string;
      updatedAt: string;
      farmId: string;
    };
    fishSupply: {
      batchNumber: string;
      age: string;
    };
    organisation: SingleOrganisation;
    farm: Farm;
    biomass: string;
    fishCount: string;
    batchNumberId: number;
    age: string;
    meanLength: string;
    meanWeight: string;
    stockingDensityKG: string;
    stockingDensityNM: string;
    stockingLevel: string;
    createdBy: string;
    updatedBy: string;
    createdAt: string;
    updatedAt: string;
    isManager?: boolean;
    field?: string;
    fishManageHistory: {
      id: number;
      fishFarmId: string;
      productionUnitId: string;
      biomass: string;
      fishCount: string;
      batchNumberId: number;
      currentDate: string;
      age: string;
      meanLength: string;
      meanWeight: string;
      stockingDensityKG: string;
      stockingDensityNM: string;
      stockingLevel: string;
      createdBy: string;
      updatedBy: string;
      createdAt: string;
      updatedAt: string;
      organisationId: number;
      field: string;
      productionId: number;
    }[];
    waterTemp: string;
    DO: string;
    TSS: string;
    NH4: string;
    NO3: string;
    NO2: string;
    ph: string;
    visibility: string;
    waterManageHistory?: {
      id: number;
      currentDate: string;
      waterTemp: string;
      DO: string;
      TSS: string;
      NH4: string;
      NO3: string;
      NO2: string;
      ph: string;
      visibility: string;
      productionId: number;
    }[];
  }[];
}
const fishUnits = [
  'Fish Count',
  'Biomass',
  'Mean Weight',
  'Mean Length',
  'Stocking density (kg/m³)',
  'Stocking density (n/m³)',
];
const waterUnits = [
  'waterTempChart',
  'dissolvedOxgChart',
  'TSS',
  'ammonia',
  'nitrate',
  'nitrite',
  'ph',
  'visibility',
];
function CreateReport({ farms, productions }: Props) {
  const router = useRouter();
  const [selectedUnits, setSelectedUnits] = useState<string[]>([]);
  const [selectedView, setSelectedView] = useState<string>('fish');
  const startDate = dayjs().startOf('month').format();
  const endDate = dayjs().format();
  const [xAxisData, setXAxisData] = useState<string[] | void[]>([]);
  const [selectedFarms, setSelectedFarms] = useState<(string | undefined)[]>(
    [],
  );
  const [extractedData, setExtratedData] = useState<SelectedFarms[]>([]);
  const allFarmIds = farms?.map((prod) => prod.id);
  const allSelected = selectedFarms.length === allFarmIds?.length;
  const groupedData: GroupedData[] = useMemo(() => {
    const filteredFarm = productions?.reduce<GroupedData[]>((result, item) => {
      // Find or create a farm group
      let farmGroup = result.find((group) => group.farm === item.farm.name);
      if (!farmGroup) {
        farmGroup = { farm: item.productionUnit.name, units: [] };
        result.push(farmGroup);
      }

      // Add the current production unit and all related data to the group
      farmGroup.units.push({
        id: item.id,
        productionUnit: item.productionUnit,
        fishSupply: item.fishSupply,
        organisation: item.organisation,
        farm: item.farm,
        biomass: item.biomass,
        fishCount: item.fishCount,
        batchNumberId: Number(item.batchNumberId),
        age: item.age,
        meanLength: item.meanLength,
        meanWeight: item.meanWeight,
        stockingDensityKG: item.stockingDensityKG,
        stockingDensityNM: item.stockingDensityNM,
        stockingLevel: item.stockingLevel,
        createdBy: item.createdBy,
        updatedBy: item.updatedBy,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        isManager: item.isManager ?? false,
        field: item.field,
        fishManageHistory: item.FishManageHistory,
        waterTemp: item.waterTemp,
        DO: item.DO,
        TSS: item.TSS,
        NH4: item.NH4,
        NO3: item.NO3,
        NO2: item.NO2,
        ph: item.ph,
        visibility: item.visibility,
        waterManageHistory: item.WaterManageHistory,
      });

      return result;
    }, []);
    return filteredFarm ?? [];
  }, [productions]);
  const handleFarmChange = (farmId: string | undefined) => {
    setSelectedFarms((prev) =>
      prev.includes(farmId)
        ? prev.filter((id) => id !== farmId)
        : [...prev, farmId],
    );
  };
  const handleUnitSelection = (unitId: string) => {
    setSelectedUnits((prev) =>
      prev.includes(unitId)
        ? prev.filter((id) => id !== unitId)
        : [...prev, unitId],
    );
  };

  const handleSelectAllUnits = (unitIds: string[]) => {
    setSelectedUnits((prev) =>
      unitIds.every((id) => prev.includes(id))
        ? prev.filter((id) => !unitIds.includes(id))
        : [...prev, ...unitIds.filter((id) => !prev.includes(id))],
    );
  };
  const handleSelectAll = () => {
    setSelectedFarms(allSelected ? [] : allFarmIds);
  };
  const handlePreview = () => {
    setCookie('selectedUnits', JSON.stringify(selectedUnits));
    const data = {
      selectedCharts: selectedView === 'water' ? waterUnits : fishUnits,
      xAxisData: xAxisData,
      groupedData: groupedData,
      startDate: startDate,
      endDate: endDate,
      dateDiff: dayjs(endDate).diff(dayjs(startDate), 'day'),
    };
    if (selectedView === 'water') {
      setLocalItem('waterPreviewData', data);
      router.push('/dashboard/production/water/reportPreview');
    } else {
      setLocalItem('fishPreviewData', data);
      router.push('/dashboard/production/fish/reportPreview');
    }
  };
  useEffect(() => {
    if (farms) {
      const getSelectedFarmsData = () => {
        return farms
          .filter((farm) => selectedFarms?.includes(farm.id)) // Filter selected farms
          .map((val) => ({
            farm: val.name,
            units: val?.productionUnits?.map((unit) => ({
              id: unit.id,
              name: unit.name,
              farmId: unit.farmId,
              YearBasedPredicationProductionUnit:
                unit.YearBasedPredicationProductionUnit,
            })),
          }));
      };
      const units: SelectedFarms[] = getSelectedFarmsData();
      setExtratedData(units);
    }
  }, [selectedFarms]);
  useEffect(() => {
    if (groupedData?.length) {
      let createdAtArray = [];
      if (selectedView === 'water') {
        createdAtArray = groupedData?.flatMap((group) =>
          group.units
            ?.flatMap(
              (unit) =>
                unit.waterManageHistory?.map((history) => {
                  getFullYear(history?.currentDate);
                }) || [],
            )
            .filter(Boolean),
        );
      } else {
        createdAtArray = groupedData?.flatMap(
          (group) =>
            group?.units?.flatMap(
              (unit) =>
                unit.fishManageHistory?.map((history) => history.createdAt) ||
                [],
            ) || [],
        );
      }
      if (createdAtArray?.length) {
        setXAxisData(createdAtArray);
      }
    }
  }, [productions, groupedData]);

  return (
    <>
      <FormControl sx={{ width: '100%', mb: 2 }}>
        <RadioGroup
          aria-labelledby="demo-radio-buttons-group-label"
          value={selectedView ? selectedView : 'fish'}
          name="radio-buttons-group"
          onChange={(e) => {
            setSelectedView(e.target.value);
          }}
          className="ic-radio"
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            flexWrap: 'nowrap',
            justifyContent: 'end',
          }}
        >
          <FormControlLabel
            value="fish"
            control={<Radio />}
            label="Fish"
            className="input-btn"
          />
          <FormControlLabel
            value="water"
            control={<Radio />}
            label="Water"
            className="input-btn"
          />
        </RadioGroup>
      </FormControl>
      <Stack
        sx={{
          width: '100%',
          // overflow: "hidden",
          borderRadius: '14px',
          boxShadow: '0px 0px 16px 5px #0000001A',
          p: 3,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        ></Box>
        <Grid container>
          <Grid item xl={3} lg={4} md={5} xs={6}>
            <Box
              mb={3}
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                columnGap: 3,
                rowGap: 1,
                flexWrap: 'wrap',
                pb: 0.5,
                borderBottom: '1px solid #E0E0E0',
              }}
            >
              <Typography
                variant="h6"
                fontWeight={600}
                sx={{
                  fontSize: {
                    xs: 18,
                  },
                }}
              >
                Select Farms
              </Typography>

              <FormControlLabel
                value="selectAllFarms"
                control={
                  <Checkbox checked={allSelected} onChange={handleSelectAll} />
                }
                label="Select All"
                labelPlacement="end"
                className="custom-checkbox"
              />
            </Box>

            <Grid
              container
              spacing={3}
              sx={{
                maxHeight: '600px',
                overflowY: 'auto',
                mt: 3.5,
              }}
            >
              {farms?.map((farm: Farm) => {
                return (
                  <Grid item xs={12} key={String(farm.id)}>
                    <FormControlLabel
                      value={farm.name}
                      control={
                        <Checkbox
                          checked={selectedFarms.includes(farm.id)}
                          onChange={() => handleFarmChange(farm.id)}
                        />
                      }
                      label={farm.name}
                      labelPlacement="end"
                      className="custom-checkbox"
                    />
                  </Grid>
                );
              })}
            </Grid>
          </Grid>
          <Grid
            item
            xs={1}
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Divider orientation="vertical" variant="middle" />
          </Grid>
          <Grid item xl={8} lg={7} md={6} xs={5}>
            <Box
              mb={3}
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                columnGap: 3,
                rowGap: 1,
                flexWrap: 'wrap',
                borderBottom: '1px solid #E0E0E0',
                pb: 0.5,
              }}
            >
              <Typography
                variant="h6"
                fontWeight={600}
                sx={{
                  fontSize: {
                    xs: 18,
                  },
                }}
              >
                Select Units
              </Typography>
            </Box>
            <Stack
              sx={{
                maxHeight: '600px',
                overflowY: 'auto',
              }}
            >
              {selectedFarms?.length && extractedData ? (
                extractedData?.map((farm, index) => {
                  const allUnitIds = farm.units.map((unit) => unit.id);
                  const isAllSelected = allUnitIds.every((id) =>
                    selectedUnits.includes(id),
                  );

                  return (
                    <Grid
                      container
                      key={index}
                      rowSpacing={2}
                      columnSpacing={4}
                    >
                      <Grid item xs={12}>
                        <Box
                          mt={1.5}
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            columnGap: 3,
                            rowGap: 1,
                            flexWrap: 'wrap',
                            borderBottom: '1px solid #E0E0E0',
                            pb: 0.5,
                          }}
                        >
                          <Typography
                            variant="h6"
                            fontWeight={600}
                            sx={{
                              fontSize: {
                                xs: 16,
                              },
                            }}
                          >
                            {farm?.farm}
                          </Typography>

                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={isAllSelected}
                                onChange={() =>
                                  handleSelectAllUnits(allUnitIds)
                                }
                              />
                            }
                            label="Select All"
                            labelPlacement="end"
                            className="custom-checkbox"
                          />
                        </Box>
                      </Grid>
                      {farm.units.map((unit) => (
                        <Grid item xs={'auto'} key={Number(unit.id)}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={selectedUnits.includes(unit.id)}
                                onChange={() => handleUnitSelection(unit.id)}
                              />
                            }
                            label={unit.name}
                            labelPlacement="end"
                            className="custom-checkbox"
                          />
                        </Grid>
                      ))}
                    </Grid>
                  );
                })
              ) : (
                <Grid
                  container
                  rowSpacing={2}
                  columnSpacing={4}
                  alignItems={'center'}
                  justifyContent={'center'}
                  height={450}
                >
                  <Grid item xs="auto">
                    <Box
                      mt={1.5}
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        columnGap: 3,
                        rowGap: 1,
                        flexWrap: 'wrap',
                        pb: 0.5,
                      }}
                    >
                      Please select farms to view the units.
                    </Box>
                  </Grid>
                </Grid>
              )}
            </Stack>
          </Grid>
        </Grid>

        <Box
          display={'flex'}
          justifyContent={'flex-end'}
          alignItems={'center'}
          gap={3}
          mt={3}
        >
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
            disabled={selectedUnits.length === 0}
            onClick={handlePreview}
          >
            Preview
          </Button>
        </Box>
      </Stack>
    </>
  );
}

export default CreateReport;
