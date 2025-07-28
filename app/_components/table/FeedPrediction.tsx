'use client';
import AdHoc, { FishFeedingData } from '@/app/_components/feedPrediction/AdHoc';
import FeedingPlan from '@/app/_components/feedPrediction/FeedingPlan';
import FeedingSummary from '@/app/_components/feedPrediction/FeedingSummary';
import ProductionManagerFilter from '@/app/_components/ProductionManagerFilter';
import { Farm } from '@/app/_typeModels/Farm';
import { FarmGroup, Production } from '@/app/_typeModels/production';
import {
  selectEndDate,
  selectStartDate,
} from '@/lib/features/commonFilters/commonFilters';
import { useAppSelector } from '@/lib/hooks';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import { Box, Stack, Tab } from '@mui/material';
import { useEffect, useState } from 'react';
interface Props {
  productions: Production[];
  farms: Farm[];
}
const FeedPredictionTable = ({ farms, productions }: Props) => {
  const startDate = useAppSelector(selectStartDate);
  const endDate = useAppSelector(selectEndDate);
  const [adHocData, setAdHocData] = useState<FishFeedingData[]>([]);
  const [selectedFeeding, setSelectedFeeding] = useState<string>('feedingPlan');
  const [productionData, setProductionData] = useState<FarmGroup[]>();

  const handleChange = (newValue: string) => {
    setSelectedFeeding(newValue);
  };
  const groupedData: FarmGroup[] = productions?.reduce(
    (result: FarmGroup[], item) => {
      // Find or create a farm group
      let farmGroup = result.find((group) => group.farm === item.farm.name);
      if (!farmGroup) {
        farmGroup = { farm: item.farm.name, units: [] };
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
        WaterManageHistoryAvgrage: item.WaterManageHistoryAvgrage,
      });

      return result;
    },
    [],
  );
  useEffect(() => {
    if (groupedData) {
      setProductionData(groupedData);
    }
  }, []);

  return (
    <>
      <TabContext value={String(selectedFeeding)}>
        <Stack
          display={'flex'}
          rowGap={2}
          columnGap={5}
          mb={2}
          justifyContent={'space-between'}
          sx={{
            flexDirection: {
              md: 'row',
              xs: 'column',
            },
            alignItems: {
              md: 'center',
              xs: 'start',
            },
          }}
        >
          <Box>
            <TabList
              onChange={(_, value) => handleChange(value)}
              aria-label="lab API tabs example"
              className=" production-tabs"
            >
              <Tab
                label="Feeding Plan"
                value="feedingPlan"
                className={
                  selectedFeeding === 'feedingPlan' ? 'active-tab' : ''
                }
              />

              <Tab
                label="Adhoc"
                value="adhoc"
                className={selectedFeeding === 'adhoc' ? 'active-tab' : ''}
              />
            </TabList>
          </Box>
        </Stack>
      </TabContext>
      {selectedFeeding === 'feedingPlan' && (
        <ProductionManagerFilter
          farmsList={farms}
          groupedData={groupedData}
          setProductionData={setProductionData}
          reset={false}
        />
      )}
      {selectedFeeding === 'feedingPlan' ? (
        <FeedingPlan
          productionData={productionData}
          startDate={startDate}
          endDate={endDate}
        />
      ) : selectedFeeding === 'feedingSummary' ? (
        <FeedingSummary />
      ) : (
        <AdHoc data={adHocData} setData={setAdHocData} />
      )}
    </>
  );
};

export default FeedPredictionTable;
