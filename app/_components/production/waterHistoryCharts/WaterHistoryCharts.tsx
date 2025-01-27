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

  const [isHandleOpen, setIsHandleOpen] = useState(false);

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

  const downloadChartsAsPDF = async () => {
    const pdf = new jsPDF({ orientation: "landscape" });
    const tempContainer = document.createElement("div");
    tempContainer.style.position = "absolute";
    tempContainer.style.top = "-9999px";
    tempContainer.style.left = "-9999px";
    document.body.appendChild(tempContainer);

    let chartAdded = false;

    for (const chartOption of chartOptions) {
      const { key, title, yDataKey } = chartOption;

      if (!selectedCharts.includes(key)) continue;

      const chartDiv = document.createElement("div");
      chartDiv.style.width = "1200px";
      chartDiv.style.height = "900px";
      tempContainer.appendChild(chartDiv);

      const root = createRoot(chartDiv);
      root.render(
        <div
          style={{
            width: "100%",
            height: "100%",
            fontFamily: "Arial, sans-serif",
          }}
        >
          <div
            style={{
              padding: "12px 20px",
              background: "white",
              boxShadow: "0 0 3px rgb(6, 161, 155)",
              borderBottom: "1px solid rgb(6,161,155)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <img src="/static/img/logo-bigone.jpg" alt="Logo" width={200} />
            <div>
              <h6
                style={{
                  marginBottom: "4px",
                  fontSize: "16px",
                }}
              >
                Production Report
              </h6>
              <p
                style={{
                  fontSize: "14px",
                  color: "#6C757D",
                  marginBottom: "0",
                }}
              >
                {productions[0]?.productionUnit?.name}{" "}
                {productions[0]?.farm?.name} <br />
                <span>2025/01/23 to 2025/01/23</span>
              </p>
            </div>
          </div>
          <div
            style={{
              padding: "32px 20px",
            }}
          >
            <h5
              style={{
                fontSize: "22px",
                fontWeight: "bold",
                marginBottom: "12px",
              }}
            >
              Production Unit
            </h5>
            <ul
              style={{
                padding: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <li>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  <h6
                    style={{
                      margin: 0,
                      fontSize: "16px",
                    }}
                  >
                    Unit Name :
                  </h6>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "14px",
                    }}
                  >
                    {productions[0]?.productionUnit?.name}
                  </p>
                </div>
              </li>
              <li>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  <h6
                    style={{
                      margin: 0,
                      fontSize: "16px",
                    }}
                  >
                    Type :
                  </h6>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "14px",
                    }}
                  >
                    {productions[0]?.productionUnit?.type}
                  </p>
                </div>
              </li>
              <li>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  <h6
                    style={{
                      margin: 0,
                      fontSize: "16px",
                    }}
                  >
                    Water Flow :
                  </h6>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "14px",
                    }}
                  >
                    {productions[0]?.productionUnit?.waterflowRate} L/H
                  </p>
                </div>
              </li>
              <li>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  <h6
                    style={{
                      margin: 0,
                      fontSize: "16px",
                    }}
                  >
                    Volume :
                  </h6>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "14px",
                    }}
                  >
                    {productions[0]?.productionUnit?.capacity}m3
                  </p>
                </div>
              </li>
            </ul>
          </div>
          <div
            style={{
              width: "100%",
              height: "100%",
              fontFamily: "Arial, sans-serif",
            }}
          >
            {/* Chart */}
            <div
              style={{
                width: "100%",
                marginBottom: "20px",
                display: "flex",
                alignItems: "start",
              }}
            >
              <div
                style={{ width: "50%", marginBottom: "20px", display: "flex" }}
              >
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
              </div>

              <table
                style={{
                  width: "50%",
                  borderCollapse: "collapse",
                  fontSize: "12px",
                  color: "#333",
                  marginTop: "16px",
                }}
              >
                <thead>
                  <tr>
                    <th
                      style={{
                        border: "1px solid #ccc",
                        padding: "8px 12px",
                        textAlign: "left",
                        borderTopLeftRadius: "8px",
                        background: "#efefef",
                      }}
                    >
                      Date
                    </th>
                    <th
                      style={{
                        border: "1px solid #ccc",
                        padding: "8px 12px",
                        textAlign: "left",
                        background: "#efefef",
                      }}
                    >
                      Value
                    </th>
                    <th
                      style={{
                        border: "1px solid #ccc",
                        padding: "8px 12px",
                        textAlign: "left",
                        background: "#efefef",
                      }}
                    >
                      Change
                    </th>
                    <th
                      style={{
                        border: "1px solid #ccc",
                        padding: "8px 12px",
                        textAlign: "left",
                        borderTopRightRadius: "8px",
                        background: "#efefef",
                      }}
                    >
                      Cumulative
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {groupedData.units.flatMap(
                    (unit) =>
                      unit.WaterManageHistoryAvgrage?.map((history: any) => (
                        <tr key={history.date}>
                          <td
                            style={{
                              border: "1px solid #ccc",
                              padding: "8px 12px",
                            }}
                          >
                            {history.date}
                          </td>
                          <td
                            style={{
                              border: "1px solid #ccc",
                              padding: "8px 12px",
                            }}
                          >
                            {history[yDataKey]}
                          </td>
                          <td
                            style={{
                              border: "1px solid #ccc",
                              padding: "8px 12px",
                            }}
                          >
                            {history.change || ""}
                          </td>
                          <td
                            style={{
                              border: "1px solid #ccc",
                              padding: "8px 12px",
                            }}
                          >
                            {history.cumulative || ""}
                          </td>
                        </tr>
                      )) || []
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      );

      await new Promise((resolve) => setTimeout(resolve, 800));

      const canvas = await html2canvas(chartDiv);
      const imgData = canvas.toDataURL("image/png");

      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      if (chartAdded) pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

      chartAdded = true;

      root.unmount();
      tempContainer.removeChild(chartDiv);
    }

    document.body.removeChild(tempContainer);

    if (!chartAdded) {
      alert("No charts selected for download.");
      return;
    }

    pdf.save("SelectedCharts.pdf");
    setSelectedCharts([]);
    setIsModalOpen(false);
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
