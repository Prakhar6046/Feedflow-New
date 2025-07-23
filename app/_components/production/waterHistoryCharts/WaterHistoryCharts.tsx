import { getChartPredictedValues, setLocalItem } from '@/app/_lib/utils';
import { Farm } from '@/app/_typeModels/Farm';
import {
  Production,
  WaterManageHistoryGroup,
} from '@/app/_typeModels/production';
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Grid,
} from '@mui/material';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import WaterTempChart from '../../charts/WaterTempChart';

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import toast from 'react-hot-toast';
type Iprops = {
  productions: Production[];
  groupedData: WaterManageHistoryGroup;
  farms: Farm[];
  startDate: string;
  endDate: string;
  waterId: string;
};
export type IdealRangeKeys =
  | 'DO'
  | 'ph'
  | 'NH4'
  | 'NO2'
  | 'NO3'
  | 'TSS'
  | 'waterTemp'
  | 'visibility';
function WaterHistoryCharts({
  productions,
  groupedData,
  farms,
  startDate,
  waterId,
  endDate,
}: Iprops) {
  const router = useRouter();
  const [xAxisData, setXAxisData] = useState<string[]>([]);
  const [dateDiff, setDateDiff] = useState<number>(0);
  const [currentFarm, setCurrentFarm] = useState<Farm | undefined>();
  const [selectedCharts, setSelectedCharts] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [predictedData, setPredictedData] = useState<any>(null);

  type IdealRangeKeys =
    | 'DO'
    | 'ph'
    | 'NH4'
    | 'NO2'
    | 'NO3'
    | 'TSS'
    | 'waterTemp'
    | 'visibility';

  const chartOptions: {
    key: string;
    yDataKey: IdealRangeKeys;
    title: string;
  }[] = [
    {
      key: 'waterTempChart',
      yDataKey: 'waterTemp',
      title: 'Water Temperature',
    },
    { key: 'dissolvedOxgChart', yDataKey: 'DO', title: 'Dissolved Oxygen' },
    { key: 'TSS', yDataKey: 'TSS', title: 'TSS' },
    { key: 'ammonia', yDataKey: 'NH4', title: 'Ammonia' },
    { key: 'nitrate', yDataKey: 'NO3', title: 'Nitrate' },
    { key: 'nitrite', yDataKey: 'NO2', title: 'Nitrite' },
    { key: 'ph', yDataKey: 'ph', title: 'PH' },
    { key: 'visibility', yDataKey: 'visibility', title: 'Visibility' },
  ];
  useEffect(() => {
    if (groupedData?.units && farms) {
      const farm = farms.find((farm) => farm.id === productions[0]?.fishFarmId);
      setCurrentFarm(farm);
      const createdAtArray = groupedData.units
        ?.flatMap(
          (unit) =>
            unit.waterManageHistory?.map((history) => {
              const datePart = String(history.currentDate).split('T')[0];
              return dayjs(datePart).isValid() ? datePart : null;
            }) || [],
        )
        .filter(Boolean);

      const diffInDays = dayjs(endDate).diff(dayjs(startDate), 'day');
      setDateDiff(diffInDays);

      const startD = dayjs(startDate).startOf('day');
      const endD = dayjs(endDate).startOf('day');

      const filteredTimestamps: any = createdAtArray.filter((timestamp) => {
        const date = dayjs(timestamp).startOf('day');
        return date >= startD && date <= endD;
      });

      setXAxisData(filteredTimestamps);
    }
  }, [productions, groupedData, farms, startDate, endDate]);

  const handleCheckboxChange = (key: string) => {
    setSelectedCharts((prev) =>
      prev.includes(key)
        ? prev.filter((chartKey) => chartKey !== key)
        : [...prev, key],
    );
  };
  const previewCharts = () => {
    if (!selectedCharts?.length) {
      toast.dismiss();
      toast.error('Please select at least one chart to preview.');
      return;
    }
    const data = {
      selectedCharts: selectedCharts,
      xAxisData: xAxisData,
      groupedData: groupedData,
      currentFarm: currentFarm,
      startDate: startDate,
      endDate: endDate,
      dateDiff: dateDiff,
    };
    setLocalItem('waterPreviewData', data);
    router.push(`/dashboard/production/water/${waterId}/chartPreview`);
  };
  useEffect(() => {
    const result = getChartPredictedValues(productions, startDate, endDate);
    if (result) {
      setPredictedData(result);
    }
  }, [productions, startDate, endDate]);
  return (
    <div>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'end',
          marginRight: -3,
          marginBottom: 2,
        }}
      >
        <Button
          variant="contained"
          sx={{
            background: '#06A19B',
            fontWeight: '600',
            padding: '8px 24px',
            width: 'fit-content',
            textTransform: 'capitalize',
            borderRadius: '8px',
            fontSize: 16,
          }}
          onClick={() => setIsModalOpen(true)}
        >
          Create Report
        </Button>
      </Box>

      <Dialog
        open={isModalOpen}
        onClose={() => {
          (setIsModalOpen(false), setSelectedCharts([]));
        }}
      >
        <DialogTitle>Select Charts</DialogTitle>
        <DialogContent>
          {chartOptions.map(({ key, title }) => (
            <FormControlLabel
              key={key}
              control={
                <Checkbox
                  checked={selectedCharts.includes(key)}
                  onChange={() => handleCheckboxChange(key)}
                  className="checkbox-border"
                  icon={<RadioButtonUncheckedIcon />}
                  checkedIcon={<CheckCircleIcon />}
                  sx={{
                    '&.Mui-checked': {
                      color: '#06A19B',
                    },
                  }}
                />
              }
              label={title}
            />
          ))}
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
            onClick={() => {
              setSelectedCharts(chartOptions.map((chart) => chart.key));
            }}
          >
            Select all charts
          </Button>
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
            onClick={previewCharts}
          >
            Preview
          </Button>

          <Button
            type="button"
            onClick={() => {
              (setIsModalOpen(false), setSelectedCharts([]));
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

      <Grid container spacing={3} sx={{ px: { lg: 5, xs: 2.5 } }}>
        {chartOptions.map(({ key, yDataKey, title }) => (
          <Grid item lg={6} xs={12} key={key}>
            {xAxisData.length > 0 && (
              <WaterTempChart
                key={key}
                xAxisData={xAxisData}
                ydata={groupedData.units.flatMap(
                  (unit) =>
                    unit.waterManageHistory?.map(
                      (history: any) => history[yDataKey],
                    ) || [],
                )}
                predictedValues={
                  predictedData?.find(
                    (val: { key: string; values: string[] }) =>
                      val.key === yDataKey,
                  )?.values || []
                }
                maxVal={
                  currentFarm?.WaterQualityPredictedParameters[0]
                    ?.YearBasedPredication[0]?.idealRange[yDataKey]?.Max
                }
                minVal={
                  currentFarm?.WaterQualityPredictedParameters[0]
                    ?.YearBasedPredication[0]?.idealRange[yDataKey]?.Min
                }
                startDate={startDate}
                endDate={endDate}
                dateDiff={dateDiff || 1}
                title={title}
              />
            )}
          </Grid>
        ))}
      </Grid>
    </div>
  );
}

export default WaterHistoryCharts;
