"use client";
import { getLocalItem } from "@/app/_lib/utils";
import { Farm } from "@/app/_typeModels/Farm";
import {
  FishManageHistoryGroup,
  Production,
} from "@/app/_typeModels/production";
import { useEffect, useState } from "react";
import FishChart from "../../charts/FishChart";
type ChartDataType = {
  selectedCharts: string[];
  xAxisData: string[];
  groupedData: FishManageHistoryGroup;
  currentFarm: Farm | undefined;
  startDate: string;
  endDate: string;
  dateDiff: number;
};
function FishChartDownloadPreview({
  productions,
}: {
  productions: Production[];
}) {
  const [chartData, setChartData] = useState<ChartDataType>();
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
    const data = getLocalItem("fishPreviewData");
    if (data) {
      setChartData(data);
    }
  }, []);
  return (
    <div style={{ padding: "20px" }}>
      <h3 style={{ fontSize: "20px", marginBottom: "12px" }}>Preview Charts</h3>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "16px",
        }}
      >
        {chartData?.selectedCharts?.map((key: string) => {
          const chartOption = chartOptions.find((option) => option.key === key);
          if (!chartOption) return null;

          const { title, yDataKey } = chartOption;
          return (
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
                    style={{
                      width: "50%",
                      marginBottom: "20px",
                      display: "flex",
                    }}
                  >
                    <FishChart
                      key={key}
                      xAxisData={chartData?.xAxisData}
                      ydata={chartData?.groupedData.units.flatMap(
                        (unit) =>
                          unit.fishManageHistory?.map(
                            (history: any) => history[yDataKey]
                          ) || []
                      )}
                      endDate={chartData?.endDate}
                      startDate={chartData?.startDate}
                      dateDiff={chartData?.dateDiff || 1}
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
                      {chartData?.groupedData.units.flatMap(
                        (unit) =>
                          unit.fishManageHistory?.map((history: any) => (
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
        })}
      </div>
      {chartData?.selectedCharts.length === 0 && (
        <p style={{ fontSize: "14px", color: "#666" }}>
          No charts selected for preview.
        </p>
      )}
    </div>
  );
}

export default FishChartDownloadPreview;
