import { formattedDate } from "@/app/_lib/utils";
import React, { useEffect, useState } from "react";
import WaterTempChart from "../../charts/WaterTempChart";
import { Grid } from "@mui/material";
import {
  Production,
  WaterManageHistoryGroup,
} from "@/app/_typeModels/production";
import { Farm } from "@/app/_typeModels/Farm";

type Iprops = {
  productions: Production[];
  groupedData: WaterManageHistoryGroup[];
  farms: Farm[];
};
function WaterHistoryCharts({ productions, groupedData, farms }: Iprops) {
  const [xAxisData, setXAxisData] = useState<(string | any)[]>([]);
  const [currentFarm, setCurrentFarm] = useState<Farm>();
  useEffect(() => {
    if (groupedData?.length && farms) {
      const farm = farms.find((farm) => farm.id === productions[0]?.fishFarmId);
      if (farm) {
        setCurrentFarm(farm);
      }
      const createdAtArray = groupedData
        ?.flatMap((farm) =>
          farm.units?.flatMap((unit) =>
            unit.WaterManageHistoryAvgrage?.map((history) =>
              formattedDate(String(history.createdAt))
            )
          )
        )
        .filter(Boolean);
      setXAxisData(createdAtArray);
    }
  }, [productions]);
  console.log(currentFarm);

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
            ydata={groupedData
              ?.flatMap((farm) =>
                farm.units?.flatMap((unit) =>
                  unit.WaterManageHistoryAvgrage?.map(
                    (history) => history.waterTemp
                  )
                )
              )
              .filter(Boolean)}
            maxVal={
              currentFarm?.WaterQualityPredictedParameters[0]
                .YearBasedPredication[0].idealRange.waterTemp?.Max
            }
            title="Water Temperature"
          />
        )}
      </Grid>
      <Grid item lg={6} xs={12}>
        {xAxisData?.length !== 0 && (
          <WaterTempChart
            key={`dissolvedOxgChart`}
            xAxisData={xAxisData}
            ydata={groupedData
              ?.flatMap((farm) =>
                farm.units?.flatMap((unit) =>
                  unit.WaterManageHistoryAvgrage?.map((history) => history.DO)
                )
              )
              .filter(Boolean)}
            maxVal={
              currentFarm?.WaterQualityPredictedParameters[0]
                .YearBasedPredication[0].idealRange.DO?.Max
            }
            title="Dissolved Oxygen"
          />
        )}
      </Grid>
      <Grid item lg={6} xs={12}>
        {xAxisData?.length !== 0 && (
          <WaterTempChart
            key={`TSS`}
            xAxisData={xAxisData}
            ydata={groupedData
              ?.flatMap((farm) =>
                farm.units?.flatMap((unit) =>
                  unit.WaterManageHistoryAvgrage?.map((history) => history.TSS)
                )
              )
              .filter(Boolean)}
            title="Total Suspended Solids"
            maxVal={
              currentFarm?.WaterQualityPredictedParameters[0]
                .YearBasedPredication[0].idealRange.TSS?.Max
            }
          />
        )}
      </Grid>
      <Grid item lg={6} xs={12}>
        {xAxisData?.length !== 0 && (
          <WaterTempChart
            key={`ammonia`}
            xAxisData={xAxisData}
            ydata={groupedData
              ?.flatMap((farm) =>
                farm.units?.flatMap((unit) =>
                  unit.WaterManageHistoryAvgrage?.map((history) => history.NH4)
                )
              )
              .filter(Boolean)}
            title="Ammonia"
            maxVal={
              currentFarm?.WaterQualityPredictedParameters[0]
                .YearBasedPredication[0].idealRange.NH4?.Max
            }
          />
        )}
      </Grid>
      <Grid item lg={6} xs={12}>
        {xAxisData?.length !== 0 && (
          <WaterTempChart
            key={`nitrate`}
            xAxisData={xAxisData}
            ydata={groupedData
              ?.flatMap((farm) =>
                farm.units?.flatMap((unit) =>
                  unit.WaterManageHistoryAvgrage?.map((history) => history.NO3)
                )
              )
              .filter(Boolean)}
            title="Nitrate"
            maxVal={
              currentFarm?.WaterQualityPredictedParameters[0]
                .YearBasedPredication[0].idealRange.NO3?.Max
            }
          />
        )}
      </Grid>
      <Grid item lg={6} xs={12}>
        {xAxisData?.length !== 0 && (
          <WaterTempChart
            key={`nitrite`}
            xAxisData={xAxisData}
            ydata={groupedData
              ?.flatMap((farm) =>
                farm.units?.flatMap((unit) =>
                  unit.WaterManageHistoryAvgrage?.map((history) => history.NO2)
                )
              )
              .filter(Boolean)}
            title="Nitrite"
            maxVal={
              currentFarm?.WaterQualityPredictedParameters[0]
                .YearBasedPredication[0].idealRange.NO2?.Max
            }
          />
        )}
      </Grid>
      <Grid item lg={6} xs={12}>
        {xAxisData?.length !== 0 && (
          <WaterTempChart
            key={`ph`}
            xAxisData={xAxisData}
            ydata={groupedData
              ?.flatMap((farm) =>
                farm.units?.flatMap((unit) =>
                  unit.WaterManageHistoryAvgrage?.map((history) => history.ph)
                )
              )
              .filter(Boolean)}
            title="PH"
            maxVal={
              currentFarm?.WaterQualityPredictedParameters[0]
                .YearBasedPredication[0].idealRange.ph?.Max
            }
          />
        )}
      </Grid>
      <Grid item lg={6} xs={12}>
        {xAxisData?.length !== 0 && (
          <WaterTempChart
            key={`visibility`}
            xAxisData={xAxisData}
            ydata={groupedData
              ?.flatMap((farm) =>
                farm.units?.flatMap((unit) =>
                  unit.WaterManageHistoryAvgrage?.map(
                    (history) => history.visibility
                  )
                )
              )
              .filter(Boolean)}
            title="Visibility"
            maxVal={
              currentFarm?.WaterQualityPredictedParameters[0]
                .YearBasedPredication[0].idealRange.visibility?.Max
            }
          />
        )}
      </Grid>
    </Grid>
  );
}

export default WaterHistoryCharts;
