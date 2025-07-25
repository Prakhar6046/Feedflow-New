import {
  FishManageHistoryGroup,
  Production,
} from '@/app/_typeModels/production';
import {
  Grid,
  Button,
  Checkbox,
  FormControlLabel,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Box,
} from '@mui/material';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import FishChart from '../../charts/FishChart';
import { useRouter } from 'next/navigation';
import { setLocalItem } from '@/app/_lib/utils';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import toast from 'react-hot-toast';

type Iprops = {
  productions: Production[];
  groupedData: FishManageHistoryGroup;
  startDate: string;
  endDate: string;
  fishId: string;
};

function FishHistoryCharts({
  productions,
  groupedData,
  startDate,
  endDate,
  fishId,
}: Iprops) {
  const router = useRouter();
  const [xAxisData, setXAxisData] = useState<string[]>([]);
  const [dateDiff, setDateDiff] = useState<number>();
  const [selectedCharts, setSelectedCharts] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const chartOptions = [
    { key: 'Fish Count', yDataKey: 'fishCount', title: 'Fish Count' },
    { key: 'Biomass', yDataKey: 'biomass', title: 'Biomass' },
    { key: 'Mean Weight', yDataKey: 'meanWeight', title: 'Mean Weight' },
    { key: 'Mean Length', yDataKey: 'meanLength', title: 'Mean Length' },
    {
      key: 'Stocking density (kg/m³)',
      yDataKey: 'stockingDensityKG',
      title: `Stocking density (kg/${'m\u00B3'})`,
    },
    {
      key: 'Stocking density (n/m³)',
      yDataKey: 'stockingDensityNM',
      title: `Stocking density (n/${'m\u00B3'})`,
    },
  ];

  useEffect(() => {
    if (groupedData) {
      const createdAtArray: string[] = groupedData.units.flatMap(
        (unit) =>
          unit.fishManageHistory?.map((history) => history.createdAt) ?? [],
      );

      const diffInDays = dayjs(endDate).diff(dayjs(startDate), 'day');
      setDateDiff(diffInDays);

      if (startDate && endDate && createdAtArray) {
        const startD = new Date(startDate);
        startD.setHours(0, 0, 0, 0);
        const endD = new Date(endDate);
        endD.setHours(0, 0, 0, 0);

        const filteredTimestamps = createdAtArray.filter((timestamp) => {
          if (timestamp) {
            const date = new Date(timestamp);
            date.setHours(0, 0, 0, 0);
            return date >= startD && date <= endD;
          }
          return false;
        });

        setXAxisData(filteredTimestamps);
      } else {
        setXAxisData(createdAtArray);
      }
    }
  }, [productions, startDate, endDate]);

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
      startDate: startDate,
      endDate: endDate,
      dateDiff: dateDiff,
    };
    setLocalItem('fishPreviewData', data);
    router.push(`/dashboard/production/fish/${fishId}/chartPreview`);
  };

  return (
    <div>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'end',
          marginRight: -3,
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
          Create report
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

      <Grid
        container
        spacing={3}
        sx={{
          px: {
            lg: 5,
            xs: 2.5,
          },
        }}
      >
        {chartOptions.map(({ key, yDataKey, title }) => (
          <Grid item lg={6} xs={12} className="chart-container" key={key}>
            {xAxisData?.length !== 0 && (
              <FishChart
                key={key}
                xAxisData={xAxisData}
                ydata={groupedData.units.flatMap(
                  (unit) =>
                    unit.fishManageHistory?.map(
                      (history: any) => history[yDataKey],
                    ) || [],
                )}
                endDate={endDate}
                startDate={startDate}
                dateDiff={dateDiff ? dateDiff : 1}
                title={title}
              />
            )}
          </Grid>
        ))}
      </Grid>
    </div>
  );
}

export default FishHistoryCharts;
