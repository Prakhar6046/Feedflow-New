"use client";
import { getLocalItem } from "@/app/_lib/utils";
import { Farm } from "@/app/_typeModels/Farm";
import {
  FishManageHistoryGroup,
  Production,
} from "@/app/_typeModels/production";
import { useEffect, useState } from "react";
import FishChart from "../../charts/FishChart";
import { Box, Stack, Button, Grid, Typography } from "@mui/material";
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
    <Stack style={{ padding: "20px" }}>
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
        marginBottom="12px"
      >
        <h3 style={{ fontSize: "20px", marginBottom: "12px" }}>
          Preview Charts
        </h3>
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
        >
          Download
        </Button>
      </Box>
      <Grid container>
        <Grid item xs>
          <Box>
            {chartData?.selectedCharts?.map((key: string) => {
              const chartOption = chartOptions.find(
                (option) => option.key === key
              );
              if (!chartOption) return null;

              const { title, yDataKey } = chartOption;
              return (
                <Box
                  marginBottom={4}
                  style={{
                    width: "100%",
                    height: "100%",
                    fontFamily: "Arial, sans-serif",
                    borderBottom: "1px solid #333333",
                  }}
                >
                  <Box
                    style={{
                      padding: "12px 20px",
                      background: "white",
                      boxShadow: "0 0 3px rgb(6, 161, 155)",
                      backgroundColor: "rgb(6,161,155)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                    sx={{
                      flexDirection: {
                        xs: "column",
                        sm: "row",
                      },
                    }}
                  >
                    <img
                      src="/static/img/logo-bigone.jpg"
                      alt="Logo"
                      width={200}
                    />
                    <Typography>
                      <Box
                        style={{
                          marginBottom: "4px",
                          fontSize: "16px",
                        }}
                      >
                        Production Report
                      </Box>
                      <Box
                        style={{
                          fontSize: "14px",
                          color: "#6C757D",
                          marginBottom: "0",
                        }}
                      >
                        {productions[0]?.productionUnit?.name}{" "}
                        {productions[0]?.farm?.name} <br />
                        <span>2025/01/23 to 2025/01/23</span>
                      </Box>
                    </Typography>
                  </Box>
                  <Box
                    style={{
                      padding: "32px 20px",
                    }}
                  >
                    <Typography
                      style={{
                        fontSize: "22px",
                        fontWeight: "bold",
                        marginBottom: "12px",
                      }}
                    >
                      Production Unit
                    </Typography>
                    <ul
                      style={{
                        padding: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                      }}
                    >
                      <li
                        style={{
                          marginInline: "10px",
                        }}
                      >
                        <Typography
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: {
                              xs: 0,
                              sm: "4px",
                              md: "12px",
                            },
                          }}
                        >
                          <Box
                            style={{
                              margin: 0,
                              fontSize: "16px",
                            }}
                          >
                            Unit Name :
                          </Box>
                          <Box
                            style={{
                              margin: 0,
                              fontSize: "14px",
                            }}
                          >
                            {productions[0]?.productionUnit?.name}
                          </Box>
                        </Typography>
                      </li>
                      <li
                        style={{
                          marginInline: "10px",
                        }}
                      >
                        <Typography
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: {
                              xs: 0,
                              sm: "4px",
                              md: "12px",
                            },
                          }}
                        >
                          <Box
                            style={{
                              margin: 0,
                              fontSize: "16px",
                            }}
                          >
                            Type :
                          </Box>
                          <Box
                            style={{
                              margin: 0,
                              fontSize: "14px",
                            }}
                          >
                            {productions[0]?.productionUnit?.type}
                          </Box>
                        </Typography>
                      </li>
                      <li
                        style={{
                          marginInline: "10px",
                        }}
                      >
                        <Typography
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: {
                              xs: 0,
                              sm: "4px",
                              md: "12px",
                            },
                          }}
                        >
                          <Box
                            style={{
                              margin: 0,
                              fontSize: "16px",
                            }}
                          >
                            Water Flow :
                          </Box>
                          <Box
                            style={{
                              margin: 0,
                              fontSize: "14px",
                            }}
                          >
                            {productions[0]?.productionUnit?.waterflowRate} L/H
                          </Box>
                        </Typography>
                      </li>
                      <li
                        style={{
                          marginInline: "10px",
                        }}
                      >
                        <Typography
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: {
                              xs: 0,
                              sm: "4px",
                              md: "12px",
                            },
                          }}
                        >
                          <Box
                            style={{
                              margin: 0,
                              fontSize: "16px",
                            }}
                          >
                            Volume :
                          </Box>
                          <Box
                            style={{
                              margin: 0,
                              fontSize: "14px",
                            }}
                          >
                            {productions[0]?.productionUnit?.capacity}m3
                          </Box>
                        </Typography>
                      </li>
                    </ul>
                  </Box>
                  <Box
                    style={{
                      width: "100%",
                      height: "100%",
                      fontFamily: "Arial, sans-serif",
                    }}
                  >
                    {/* Chart */}
                    <Grid
                      container
                      style={{
                        width: "100%",
                        marginBottom: "20px",
                        display: "flex",
                        alignItems: "start",
                      }}
                    >
                      <Grid item lg={6} xs={12}>
                        <Box
                          style={{
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
                        </Box>
                      </Grid>

                      <Grid item lg={6} xs={12}>
                        <table
                          style={{
                            width: "100%",
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
                      </Grid>
                    </Grid>
                  </Box>
                </Box>
              );
            })}
          </Box>
        </Grid>
      </Grid>
      {chartData?.selectedCharts.length === 0 && (
        <p style={{ fontSize: "14px", color: "#666" }}>
          No charts selected for preview.
        </p>
      )}
    </Stack>
  );
}

export default FishChartDownloadPreview;
