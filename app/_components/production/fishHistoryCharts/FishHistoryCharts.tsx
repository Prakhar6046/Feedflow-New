import {
  FishManageHistoryGroup,
  Production,
} from "@/app/_typeModels/production";
import { Grid } from "@mui/material";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import FishChart from "../../charts/FishChart";

type Iprops = {
  productions: Production[];
  groupedData: FishManageHistoryGroup;
  startDate: string;
  endDate: string;
};
function FishHistoryCharts({
  productions,
  groupedData,
  startDate,
  endDate,
}: Iprops) {
  const [xAxisData, setXAxisData] = useState<(string | any)[]>([]);
  const [dateDiff, setDateDiff] = useState<number>();

  console.log(productions);
  useEffect(() => {
    if (groupedData) {
      const createdAtArray = groupedData.units.flatMap(
        (unit) =>
          unit.fishManageHistory?.map((history) => history.createdAt) || []
      );

      const diffInDays = dayjs(endDate).diff(dayjs(startDate), "day");
      setDateDiff(diffInDays);
      if (startDate && endDate && createdAtArray) {
        const startD = new Date(startDate);
        startD.setHours(0, 0, 0, 0);
        const endD = new Date(endDate);
        endD.setHours(0, 0, 0, 0);
        const filteredTimestamps = createdAtArray?.filter((timestamp) => {
          if (timestamp) {
            const date = new Date(timestamp);
            date.setHours(0, 0, 0, 0);
            return date >= startD && date <= endD;
          }
        });

        setXAxisData(filteredTimestamps);
      } else {
        setXAxisData(createdAtArray);
      }
    }
  }, [productions, startDate, endDate]);
  console.log(groupedData);
  console.log(xAxisData);
  return (
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
      <Grid item lg={6} xs={12}>
        {xAxisData?.length !== 0 && (
          <FishChart
            key={`Fish Count`}
            xAxisData={xAxisData}
            ydata={groupedData.units.flatMap(
              (unit) =>
                unit.fishManageHistory?.map((history) => history.fishCount) ||
                []
            )}
            endDate={endDate}
            startDate={startDate}
            dateDiff={dateDiff ? dateDiff : 1}
            title="Fish Count"
          />
        )}
      </Grid>
      <Grid item lg={6} xs={12}>
        {xAxisData?.length !== 0 && (
          <FishChart
            key={`Biomass`}
            xAxisData={xAxisData}
            ydata={groupedData.units.flatMap(
              (unit) =>
                unit.fishManageHistory?.map((history) => history.biomass) || []
            )}
            endDate={endDate}
            startDate={startDate}
            dateDiff={dateDiff ? dateDiff : 1}
            title="Biomass"
          />
        )}
      </Grid>
      <Grid item lg={6} xs={12}>
        {xAxisData?.length !== 0 && (
          <FishChart
            key={`Mean Weight`}
            xAxisData={xAxisData}
            ydata={groupedData.units.flatMap(
              (unit) =>
                unit.fishManageHistory?.map((history) => history.meanWeight) ||
                []
            )}
            endDate={endDate}
            startDate={startDate}
            dateDiff={dateDiff ? dateDiff : 1}
            title="Mean Weight"
          />
        )}
      </Grid>
      <Grid item lg={6} xs={12}>
        {xAxisData?.length !== 0 && (
          <FishChart
            key={`Mean Length`}
            xAxisData={xAxisData}
            ydata={groupedData.units.flatMap(
              (unit) =>
                unit.fishManageHistory?.map((history) => history.meanLength) ||
                []
            )}
            endDate={endDate}
            startDate={startDate}
            dateDiff={dateDiff ? dateDiff : 1}
            title="Mean Length"
          />
        )}
      </Grid>
      <Grid item lg={6} xs={12}>
        {xAxisData?.length !== 0 && (
          <FishChart
            key={`Stocking density (kg/${"m\u00B3"})`}
            xAxisData={xAxisData}
            ydata={groupedData.units.flatMap(
              (unit) =>
                unit.fishManageHistory?.map(
                  (history) => history.stockingDensityKG
                ) || []
            )}
            endDate={endDate}
            startDate={startDate}
            dateDiff={dateDiff ? dateDiff : 1}
            title={`Stocking density (kg/${"m\u00B3"})`}
          />
        )}
      </Grid>
      <Grid item lg={6} xs={12}>
        {xAxisData?.length !== 0 && (
          <FishChart
            key={`Stocking density (n/${"m\u00B3"})`}
            xAxisData={xAxisData}
            ydata={groupedData.units.flatMap(
              (unit) =>
                unit.fishManageHistory?.map(
                  (history) => history.stockingDensityNM
                ) || []
            )}
            endDate={endDate}
            startDate={startDate}
            dateDiff={dateDiff ? dateDiff : 1}
            title={`Stocking density (n/${"m\u00B3"})`}
          />
        )}
      </Grid>
    </Grid>
  );
}

export default FishHistoryCharts;
