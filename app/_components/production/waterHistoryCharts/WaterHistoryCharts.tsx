import React, { useEffect, useState } from "react";
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
} from "@mui/material";
import Modal from "@mui/material/Modal";
import { createRoot } from "react-dom/client";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import dayjs from "dayjs";
import WaterTempChart from "../../charts/WaterTempChart";
import {
  Production,
  WaterManageHistoryGroup,
} from "@/app/_typeModels/production";
import { Farm } from "@/app/_typeModels/Farm";
import { setLocalItem } from "@/app/_lib/utils";
import { useRouter } from "next/navigation";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
type Iprops = {
  productions: Production[];
  groupedData: WaterManageHistoryGroup;
  farms: Farm[];
  startDate: string;
  endDate: string;
  waterId: string;
};
export type IdealRangeKeys =
  | "DO"
  | "ph"
  | "NH4"
  | "NO2"
  | "NO3"
  | "TSS"
  | "waterTemp"
  | "visibility";
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

  type IdealRangeKeys =
    | "DO"
    | "ph"
    | "NH4"
    | "NO2"
    | "NO3"
    | "TSS"
    | "waterTemp"
    | "visibility";

  const chartOptions: {
    key: string;
    yDataKey: IdealRangeKeys;
    title: string;
  }[] = [
    {
      key: "waterTempChart",
      yDataKey: "waterTemp",
      title: "Water Temperature",
    },
    { key: "dissolvedOxgChart", yDataKey: "DO", title: "Dissolved Oxygen" },
    { key: "TSS", yDataKey: "TSS", title: "TSS" },
    { key: "ammonia", yDataKey: "NH4", title: "Ammonia" },
    { key: "nitrate", yDataKey: "NO3", title: "Nitrate" },
    { key: "nitrite", yDataKey: "NO2", title: "Nitrite" },
    { key: "ph", yDataKey: "ph", title: "PH" },
    { key: "visibility", yDataKey: "visibility", title: "Visibility" },
  ];

  useEffect(() => {
    if (groupedData?.units && farms) {
      const farm = farms.find((farm) => farm.id === productions[0]?.fishFarmId);
      setCurrentFarm(farm);

      const createdAtArray = groupedData.units.flatMap(
        (unit) =>
          unit.WaterManageHistoryAvgrage?.map((history) =>
            String(history.createdAt)
          ) || []
      );

      const diffInDays = dayjs(endDate).diff(dayjs(startDate), "day");
      setDateDiff(diffInDays);

      const startD = new Date(startDate);
      startD.setHours(0, 0, 0, 0);
      const endD = new Date(endDate);
      endD.setHours(0, 0, 0, 0);

      const filteredTimestamps = createdAtArray.filter((timestamp) => {
        const date = new Date(timestamp);
        date.setHours(0, 0, 0, 0);
        return date >= startD && date <= endD;
      });

      setXAxisData(filteredTimestamps);
    }
  }, [productions, groupedData, farms, startDate, endDate]);

  const handleCheckboxChange = (key: string) => {
    setSelectedCharts((prev) =>
      prev.includes(key)
        ? prev.filter((chartKey) => chartKey !== key)
        : [...prev, key]
    );
  };
  const previewCharts = () => {
    const data = {
      selectedCharts: selectedCharts,
      xAxisData: xAxisData,
      groupedData: groupedData,
      currentFarm: currentFarm,
      startDate: startDate,
      endDate: endDate,
      dateDiff: dateDiff,
    };
    setLocalItem("waterPreviewData", data);
    router.push(`/dashboard/production/water/${waterId}/chartPreview`);
  };
  return (
    <div>
      <Box
        sx={{
          display: "flex",
          justifyContent: "end",
          marginRight: -3,
          marginBottom: 2,
        }}
      >
        <Button
          variant="contained"
          sx={{
            background: "#06A19B",
            fontWeight: "600",
            padding: "8px 24px",
            width: "fit-content",
            textTransform: "capitalize",
            borderRadius: "8px",
            fontSize: 16,
          }}
          onClick={() => setIsModalOpen(true)}
        >
          Select Charts to Download
        </Button>
      </Box>

      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)}>
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
                    "&.Mui-checked": {
                      color: "#06A19B",
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
          {/* <Button onClick={() => setIsModalOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button
            // onClick={downloadChartsAsPDF}
            onClick={previewCharts}
            color="primary"
            disabled={selectedCharts.length === 0}
          >
            Preview
            Download
          </Button> */}
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
            onClick={previewCharts}
          >
            Preview
          </Button>

          <Button
            type="button"
            onClick={() => setIsModalOpen(false)}
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

      <Grid container spacing={3} sx={{ px: { lg: 5, xs: 2.5 } }}>
        {chartOptions.map(({ key, yDataKey, title }) => (
          <Grid item lg={6} xs={12} key={key}>
            {xAxisData.length > 0 && (
              <WaterTempChart
                key={key}
                xAxisData={xAxisData}
                ydata={groupedData.units.flatMap(
                  (unit) =>
                    unit.WaterManageHistoryAvgrage?.map(
                      (history: any) => history[yDataKey]
                    ) || []
                )}
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
