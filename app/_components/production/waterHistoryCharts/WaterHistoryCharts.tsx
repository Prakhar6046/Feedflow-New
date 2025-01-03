import { formattedDate } from "@/app/_lib/utils";
import React, { useEffect, useState } from "react";
import WaterTempChart from "../../charts/WaterTempChart";
import { Grid } from "@mui/material";
import {
  Production,
  WaterManageHistoryGroup,
} from "@/app/_typeModels/production";
import { Farm } from "@/app/_typeModels/Farm";
import dayjs from "dayjs";

type Iprops = {
  productions: Production[];
  groupedData: WaterManageHistoryGroup;
  farms: Farm[];
  startDate: string;
  endDate: string;
};
function WaterHistoryCharts({
  productions,
  groupedData,
  farms,
  startDate,
  endDate,
}: Iprops) {
  const [xAxisData, setXAxisData] = useState<(string | any)[]>([]);
  const [dateDiff, setDateDiff] = useState<number>();
  const [currentFarm, setCurrentFarm] = useState<Farm>();
  useEffect(() => {
    if (groupedData?.unit && farms) {
      const farm = farms.find((farm) => farm.id === productions[0]?.fishFarmId);
      if (farm) {
        setCurrentFarm(farm);
      }
      const createdAtArray = groupedData.units?.flatMap((unit) =>
        unit.WaterManageHistoryAvgrage?.map((history) =>
          String(history.createdAt)
        )
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
          <WaterTempChart
            key={`waterTempChart`}
            xAxisData={xAxisData}
            ydata={groupedData?.units?.flatMap((unit) =>
              unit.WaterManageHistoryAvgrage?.map(
                (history) => history.waterTemp
              )
            )}
            maxVal={
              currentFarm?.WaterQualityPredictedParameters[0]
                .YearBasedPredication[0].idealRange.waterTemp?.Max
            }
            endDate={endDate}
            startDate={startDate}
            dateDiff={dateDiff ? dateDiff : 1}
            title="Water Temperature"
          />
        )}
      </Grid>
      <Grid item lg={6} xs={12}>
        {xAxisData?.length !== 0 && (
          <WaterTempChart
            key={`dissolvedOxgChart`}
            xAxisData={xAxisData}
            ydata={groupedData?.units?.flatMap((unit) =>
              unit.WaterManageHistoryAvgrage?.map((history) => history.DO)
            )}
            maxVal={
              currentFarm?.WaterQualityPredictedParameters[0]
                .YearBasedPredication[0].idealRange.DO?.Max
            }
            endDate={endDate}
            startDate={startDate}
            dateDiff={dateDiff ? dateDiff : 1}
            title="Dissolved Oxygen"
          />
        )}
      </Grid>
      <Grid item lg={6} xs={12}>
        {xAxisData?.length !== 0 && (
          <WaterTempChart
            key={`TSS`}
            xAxisData={xAxisData}
            ydata={groupedData?.units?.flatMap((unit) =>
              unit.WaterManageHistoryAvgrage?.map((history) => history.TSS)
            )}
            title="Total Suspended Solids"
            maxVal={
              currentFarm?.WaterQualityPredictedParameters[0]
                .YearBasedPredication[0].idealRange.TSS?.Max
            }
            endDate={endDate}
            startDate={startDate}
            dateDiff={dateDiff ? dateDiff : 1}
          />
        )}
      </Grid>
      <Grid item lg={6} xs={12}>
        {xAxisData?.length !== 0 && (
          <WaterTempChart
            key={`ammonia`}
            xAxisData={xAxisData}
            ydata={groupedData?.units?.flatMap((unit) =>
              unit.WaterManageHistoryAvgrage?.map((history) => history.NH4)
            )}
            title="Ammonia"
            maxVal={
              currentFarm?.WaterQualityPredictedParameters[0]
                .YearBasedPredication[0].idealRange.NH4?.Max
            }
            endDate={endDate}
            startDate={startDate}
            dateDiff={dateDiff ? dateDiff : 1}
          />
        )}
      </Grid>
      <Grid item lg={6} xs={12}>
        {xAxisData?.length !== 0 && (
          <WaterTempChart
            key={`nitrate`}
            xAxisData={xAxisData}
            ydata={groupedData?.units?.flatMap((unit) =>
              unit.WaterManageHistoryAvgrage?.map((history) => history.NO3)
            )}
            title="Nitrate"
            maxVal={
              currentFarm?.WaterQualityPredictedParameters[0]
                .YearBasedPredication[0].idealRange.NO3?.Max
            }
            endDate={endDate}
            startDate={startDate}
            dateDiff={dateDiff ? dateDiff : 1}
          />
        )}
      </Grid>
      <Grid item lg={6} xs={12}>
        {xAxisData?.length !== 0 && (
          <WaterTempChart
            key={`nitrite`}
            xAxisData={xAxisData}
            ydata={groupedData?.units?.flatMap((unit) =>
              unit.WaterManageHistoryAvgrage?.map((history) => history.NO2)
            )}
            title="Nitrite"
            maxVal={
              currentFarm?.WaterQualityPredictedParameters[0]
                .YearBasedPredication[0].idealRange.NO2?.Max
            }
            endDate={endDate}
            startDate={startDate}
            dateDiff={dateDiff ? dateDiff : 1}
          />
        )}
      </Grid>
      <Grid item lg={6} xs={12}>
        {xAxisData?.length !== 0 && (
          <WaterTempChart
            key={`ph`}
            xAxisData={xAxisData}
            ydata={groupedData?.units?.flatMap((unit) =>
              unit.WaterManageHistoryAvgrage?.map((history) => history.ph)
            )}
            title="PH"
            maxVal={
              currentFarm?.WaterQualityPredictedParameters[0]
                .YearBasedPredication[0].idealRange.ph?.Max
            }
            endDate={endDate}
            startDate={startDate}
            dateDiff={dateDiff ? dateDiff : 1}
          />
        )}
      </Grid>
      <Grid item lg={6} xs={12}>
        {xAxisData?.length !== 0 && (
          <WaterTempChart
            key={`visibility`}
            xAxisData={xAxisData}
            ydata={groupedData?.units?.flatMap((unit) =>
              unit.WaterManageHistoryAvgrage?.map(
                (history) => history.visibility
              )
            )}
            title="Visibility"
            maxVal={
              currentFarm?.WaterQualityPredictedParameters[0]
                .YearBasedPredication[0].idealRange.visibility?.Max
            }
            endDate={endDate}
            startDate={startDate}
            dateDiff={dateDiff ? dateDiff : 1}
          />
        )}
      </Grid>
    </Grid>
  );
}

export default WaterHistoryCharts;
