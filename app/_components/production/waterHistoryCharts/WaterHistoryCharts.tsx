import { formattedDate } from "@/app/_lib/utils";
import React, { useEffect, useState } from "react";
import WaterTempChart from "../../charts/WaterTempChart";
import { Grid } from "@mui/material";
import {
  Production,
  WaterManageHistoryGroup,
} from "@/app/_typeModels/production";

type Iprops = {
  productions: Production[];
  groupedData: WaterManageHistoryGroup[];
};
function WaterHistoryCharts({ productions, groupedData }: Iprops) {
  const [xAxisData, setXAxisData] = useState<(string | any)[]>([]);
  useEffect(() => {
    if (groupedData?.length) {
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
  return (
    <Grid container spacing={2} gap={1}>
      <Grid item xs={12}>
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
            title="Water Temperature"
          />
        )}
      </Grid>
      <Grid item xs={12}>
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
            title="Dissolved Oxygen"
          />
        )}
      </Grid>
      <Grid item xs={12}>
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
          />
        )}
      </Grid>
      <Grid item xs={12}>
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
          />
        )}
      </Grid>
      <Grid item xs={12}>
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
          />
        )}
      </Grid>
      <Grid item xs={12}>
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
          />
        )}
      </Grid>
      <Grid item xs={12}>
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
          />
        )}
      </Grid>
      <Grid item xs={12}>
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
          />
        )}
      </Grid>
    </Grid>
  );
}

export default WaterHistoryCharts;
