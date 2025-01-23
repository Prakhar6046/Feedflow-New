import {
  FishManageHistoryGroup,
  Production,
} from "@/app/_typeModels/production";
import {
  Grid,
  Button,
  Checkbox,
  FormControlLabel,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import FishChart from "../../charts/FishChart";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { createRoot } from "react-dom/client";

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
  console.log(productions)
  const [xAxisData, setXAxisData] = useState<(string | any)[]>([]);
  const [dateDiff, setDateDiff] = useState<number>();
  const [selectedCharts, setSelectedCharts] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const chartOptions = [
    { key: "Fish Count", yDataKey: "fishCount", title: "Fish Count" },
    { key: "Biomass", yDataKey: "biomass", title: "Biomass" },
    { key: "Mean Weight", yDataKey: "meanWeight", title: "Mean Weight" },
    { key: "Mean Length", yDataKey: "meanLength", title: "Mean Length" },
    {
      key: "Stocking density (kg/m³)",
      yDataKey: "stockingDensityKG",
      title: `Stocking density (kg/${"m\u00B3"})`,
    },
    {
      key: "Stocking density (n/m³)",
      yDataKey: "stockingDensityNM",
      title: `Stocking density (n/${"m\u00B3"})`,
    },
  ];

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
        const filteredTimestamps = createdAtArray?.filter((timestamp: any) => {
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
      chartDiv.style.display = "flex";
      chartDiv.style.flexDirection = "column";
      chartDiv.style.alignItems = "center";
      chartDiv.style.justifyContent = "space-between";
      chartDiv.style.padding = "20px";
      chartDiv.style.boxSizing = "border-box";
      chartDiv.style.border = "1px solid #ccc";
      tempContainer.appendChild(chartDiv);

      // Render the layout
      const root = createRoot(chartDiv);
      root.render(
        <div style={{ width: "100%", height: "100%", fontFamily: "Arial, sans-serif" }}>
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
                  fontSize: "16px"
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
                 {productions[0]?.productionUnit?.name}  {productions[0]?.farm?.name} <br />
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
                      fontSize: "16px"
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
                      fontSize: "16px"
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
                      fontSize: "16px"
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
                      fontSize: "16px"
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
          <div style={{ width: "100%", height: "100%", fontFamily: "Arial, sans-serif" }}>

          {/* Chart */}
          <div style={{width: "100%", marginBottom: "20px" , display: "flex", alignItems: "start"}}>
            <div style={{width: "50%", marginBottom: "20px" , display: "flex",}}>
            <FishChart
              key={key}
              xAxisData={xAxisData}
              ydata={groupedData.units.flatMap(
                (unit) =>
                  unit.fishManageHistory?.map(
                    (history: any) => history[yDataKey]
                  ) || []
              )}
              endDate={endDate}
              startDate={startDate}
              dateDiff={dateDiff || 1}
              title={title}
            />
            </div>

            <table style={{ width: "50%", borderCollapse: "collapse", fontSize: "12px", color: "#333", marginTop: "16px" }}>
              <thead>
                <tr>
                  <th style={{ border: "1px solid #ccc", padding: "8px 12px", textAlign: "left", borderTopLeftRadius: "8px", background: "#efefef" }}>Date</th>
                  <th style={{ border: "1px solid #ccc", padding: "8px 12px", textAlign: "left", background: "#efefef" }}>Value</th>
                  <th style={{ border: "1px solid #ccc", padding: "8px 12px", textAlign: "left", background: "#efefef" }}>Change</th>
                  <th style={{ border: "1px solid #ccc", padding: "8px 12px", textAlign: "left", borderTopRightRadius: "8px", background: "#efefef" }}>Cumulative</th>
                </tr>
              </thead>
              <tbody>
                {groupedData.units.flatMap((unit) =>
                  unit.fishManageHistory?.map((history: any) => (
                    <tr key={history.date}>
                      <td style={{ border: "1px solid #ccc", padding: "8px 12px" }}>{history.date}</td>
                      <td style={{ border: "1px solid #ccc", padding: "8px 12px" }}>{history[yDataKey]}</td>
                      <td style={{ border: "1px solid #ccc", padding: "8px 12px" }}>{history.change || ""}</td>
                      <td style={{ border: "1px solid #ccc", padding: "8px 12px" }}>{history.cumulative || ""}</td>
                    </tr>
                  )) || []
                )}
              </tbody>
            </table>
          </div>
        </div>
        </div>
        
      );

      // Wait for rendering to complete
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Capture as image
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

  return (
    <div>
      <Button
        variant="contained"
        color="primary"
        onClick={() => setIsModalOpen(true)}
      >
        Select Charts to Download
      </Button>

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
                />
              }
              label={title}
            />
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsModalOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={downloadChartsAsPDF}
            color="primary"
            disabled={selectedCharts.length === 0}
          >
            Download
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
                      (history: any) => history[yDataKey]
                    ) || []
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
