'use client';
import {
  getChartPredictedValues,
  getFullYear,
  getLocalItem,
} from '@/app/_lib/utils';
import { Farm } from '@/app/_typeModels/Farm';
import {
  Production,
  WaterManageHistoryGroup,
} from '@/app/_typeModels/production';
import { useEffect, useState } from 'react';
import { IdealRangeKeys } from '../waterHistoryCharts/WaterHistoryCharts';
import WaterTempChart from '../../charts/WaterTempChart';
import { Box, Grid, Stack, Typography, Button } from '@mui/material';
import { createRoot } from 'react-dom/client';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Loader from '../../Loader';
import dayjs from 'dayjs';

type ChartDataType = {
  selectedCharts: string[];
  xAxisData: string[];
  groupedData: WaterManageHistoryGroup;
  currentFarm: Farm | undefined;
  startDate: string;
  endDate: string;
  dateDiff: number;
};
export type PredictedValueResult = {
  key: string;
  values: number[];
}[];
function WaterChartDownloadPreview({
  productions,
}: {
  productions: Production[];
}) {
  const [chartData, setChartData] = useState<ChartDataType>();
  const [predictedData, setPredictedData] = useState<PredictedValueResult>([]);
  const [isReportDownload, setIsReportDownload] = useState<boolean>(false);
  const chartOptions: {
    key: string;
    yDataKey: IdealRangeKeys;
    title: string;
  }[] = [
    {
      key: 'waterTempChart',
      yDataKey: 'waterTemp',
      title: 'Water Temperature',
    },
    { key: 'dissolvedOxgChart', yDataKey: 'DO', title: 'Dissolved Oxygen' },
    { key: 'TSS', yDataKey: 'TSS', title: 'TSS' },
    { key: 'ammonia', yDataKey: 'NH4', title: 'Ammonia' },
    { key: 'nitrate', yDataKey: 'NO3', title: 'Nitrate' },
    { key: 'nitrite', yDataKey: 'NO2', title: 'Nitrite' },
    { key: 'ph', yDataKey: 'ph', title: 'PH' },
    { key: 'visibility', yDataKey: 'visibility', title: 'Visibility' },
  ];
  useEffect(() => {
    if (chartData && productions) {
      const result = getChartPredictedValues(
        productions,
        chartData?.startDate,
        chartData?.endDate,
      );
      if (result) {
        setPredictedData(result);
      }
    }
  }, [productions, chartData]);
  const downloadChartsAsPDF = async () => {
    setIsReportDownload(true);
    const pdf = new jsPDF({ orientation: 'landscape' });
    const tempContainer = document.createElement('div');
    // tempContainer.style.position = "absolute";
    // tempContainer.style.top = "-9999px";
    // tempContainer.style.left = "-9999px";
    document.body.appendChild(tempContainer);

    let chartAdded = false;

    for (const chartOption of chartOptions) {
      const { key, title, yDataKey } = chartOption;

      if (!chartData?.selectedCharts.includes(key)) continue;

      const chartDiv = document.createElement('div');
      chartDiv.style.width = '1200px';
      chartDiv.style.height = '900px';
      chartDiv.style.display = 'flex';
      chartDiv.style.flexDirection = 'column';
      chartDiv.style.alignItems = 'center';
      chartDiv.style.justifyContent = 'space-between';
      chartDiv.style.padding = '20px';
      chartDiv.style.boxSizing = 'border-box';
      chartDiv.style.border = '1px solid #ccc';
      tempContainer.appendChild(chartDiv);

      const root = createRoot(chartDiv);
      root.render(
        <div
          style={{
            maxWidth: '100vw',
            width: '100%',
            height: '100%',
            fontFamily: 'Arial, sans-serif',
            margin: 'auto',
          }}
        >
          <div
            style={{
              padding: '12px 20px',
              boxShadow: '0 0 3px rgb(6, 161, 155)',
              backgroundColor: 'rgb(6,161,155)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <img src="/static/img/logo-bigone.jpg" alt="Logo" width={200} />
            <div>
              <h6
                style={{
                  marginBottom: '4px',
                  fontSize: '16px',
                  color: 'white',
                }}
              >
                Production Report
              </h6>
              <p
                style={{
                  fontSize: '14px',
                  color: 'white',
                  marginBottom: '0',
                }}
              >
                {productions[0]?.productionUnit?.name}{' '}
                {productions[0]?.farm?.name} <br />
                <span>
                  {dayjs(chartData?.startDate).format('YYYY/MM/DD')} to
                  {` ${dayjs(chartData?.endDate).format('YYYY/MM/DD')}`}
                </span>
              </p>
            </div>
          </div>
          <div
            style={{
              padding: '32px 20px',
            }}
          >
            <h5
              style={{
                fontSize: '22px',
                fontWeight: 'bold',
                marginBottom: '12px',
              }}
            >
              Production Unit
            </h5>
            <ul
              style={{
                padding: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <li>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                  }}
                >
                  <h6
                    style={{
                      margin: 0,
                      fontSize: '16px',
                    }}
                  >
                    Unit Name :
                  </h6>
                  <p
                    style={{
                      margin: 0,
                      fontSize: '14px',
                    }}
                  >
                    {productions[0]?.productionUnit?.name}
                  </p>
                </div>
              </li>
              <li>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                  }}
                >
                  <h6
                    style={{
                      margin: 0,
                      fontSize: '16px',
                    }}
                  >
                    Type :
                  </h6>
                  <p
                    style={{
                      margin: 0,
                      fontSize: '14px',
                    }}
                  >
                    {productions[0]?.productionUnit?.type}
                  </p>
                </div>
              </li>
              <li>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                  }}
                >
                  <h6
                    style={{
                      margin: 0,
                      fontSize: '16px',
                    }}
                  >
                    Water Flow :
                  </h6>
                  <p
                    style={{
                      margin: 0,
                      fontSize: '14px',
                    }}
                  >
                    {productions[0]?.productionUnit?.waterflowRate} L/H
                  </p>
                </div>
              </li>
              <li>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                  }}
                >
                  <h6
                    style={{
                      margin: 0,
                      fontSize: '16px',
                    }}
                  >
                    Volume :
                  </h6>
                  <p
                    style={{
                      margin: 0,
                      fontSize: '14px',
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
              width: '100%',
              height: '100%',
              fontFamily: 'Arial, sans-serif',
            }}
          >
            {/* Chart */}
            <div
              style={{
                width: '100%',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'start',
              }}
            >
              <div
                style={{ width: '50%', marginBottom: '20px', display: 'flex' }}
              >
                <WaterTempChart
                  key={key}
                  xAxisData={chartData?.xAxisData}
                  ydata={chartData?.groupedData.units.flatMap(
                    (unit) =>
                      unit.waterManageHistory?.map(
                        (history) => history[yDataKey],
                      ) || [],
                  )}
                  maxVal={
                    chartData?.currentFarm?.WaterQualityPredictedParameters[0]
                      ?.YearBasedPredication[0]?.idealRange[yDataKey]?.Max
                  }
                  minVal={
                    chartData?.currentFarm?.WaterQualityPredictedParameters[0]
                      ?.YearBasedPredication[0]?.idealRange[yDataKey]?.Min
                  }
                  predictedValues={
                    predictedData?.find(
                      (val: { key: string; values: number[] }) =>
                        val.key === yDataKey,
                    )?.values || []
                  }
                  startDate={chartData?.startDate}
                  endDate={chartData?.endDate}
                  dateDiff={chartData?.dateDiff || 1}
                  title={title}
                />
              </div>

              <table
                style={{
                  width: '50%',
                  borderCollapse: 'collapse',
                  fontSize: '12px',
                  color: '#333',
                  marginTop: '16px',
                }}
              >
                <thead>
                  <tr>
                    <th
                      style={{
                        border: '1px solid #ccc',
                        padding: '8px 12px',
                        textAlign: 'left',
                        borderTopLeftRadius: '8px',
                        background: '#efefef',
                      }}
                    >
                      Date
                    </th>
                    <th
                      style={{
                        border: '1px solid #ccc',
                        padding: '8px 12px',
                        textAlign: 'left',
                        background: '#efefef',
                      }}
                    >
                      Value
                    </th>
                    <th
                      style={{
                        border: '1px solid #ccc',
                        padding: '8px 12px',
                        textAlign: 'left',
                        background: '#efefef',
                      }}
                    >
                      Predicted Value
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {chartData?.groupedData.units.flatMap((unit) => {
                    return (
                      unit.waterManageHistory
                        ?.filter((value) => {
                          const dateString = getFullYear(value?.currentDate);
                          const date = dayjs(dateString);
                          return (
                            date.unix() >= dayjs(chartData.startDate).unix() &&
                            date.unix() <= dayjs(chartData.endDate).unix()
                          );
                        })
                        ?.map((history) => {
                          const dateString = getFullYear(history?.currentDate);
                          const date = dayjs(dateString);
                          const month = date.format('MMM');
                          const predictions: any =
                            productions[0]?.productionUnit
                              ?.YearBasedPredicationProductionUnit?.[0];
                          const predictedValue =
                            predictions?.[yDataKey]?.[month] || '';

                          return (
                            <tr key={history.currentDate}>
                              <td
                                style={{
                                  border: '1px solid #ccc',
                                  padding: '8px 12px',
                                }}
                              >
                                {getFullYear(history?.currentDate)}
                              </td>
                              <td
                                style={{
                                  border: '1px solid #ccc',
                                  padding: '8px 12px',
                                }}
                              >
                                {history[yDataKey]}
                              </td>
                              <td
                                style={{
                                  border: '1px solid #ccc',
                                  padding: '8px 12px',
                                }}
                              >
                                {predictedValue}
                              </td>
                            </tr>
                          );
                        }) || []
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>,
      );

      await new Promise((resolve) => setTimeout(resolve, 800));

      const canvas = await html2canvas(chartDiv);
      const imgData = canvas.toDataURL('image/png');

      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      if (chartAdded) pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

      chartAdded = true;

      root.unmount();
      tempContainer.removeChild(chartDiv);
    }

    document.body.removeChild(tempContainer);

    if (!chartAdded) {
      alert('No charts selected for download.');
      setIsReportDownload(false);
      return;
    }
    const fileName = `water_report_${new Date()
      .toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
      .replace(/[\s,\/]+/g, '_')}.pdf`;
    pdf.save(fileName);
    setIsReportDownload(false);
    // removeLocalItem("waterPreviewData");
    // router.push("/dashboard/production");
  };
  useEffect(() => {
    const data = getLocalItem('waterPreviewData');
    if (data) {
      setChartData(data);
    }
  }, []);
  useEffect(() => {
    if (isReportDownload) {
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
    };
  }, [isReportDownload]);
  if (isReportDownload) {
    return (
      <Box
        sx={{
          position: 'absolute',
          width: '100%',
          height: '100%',
        }}
      >
        <Loader />
      </Box>
    );
  }
  return (
    <Stack style={{ padding: '20px' }}>
      <Box
        display={'flex'}
        justifyContent={'space-between'}
        alignItems={'center'}
        marginBottom="12px"
      >
        <h3 style={{ fontSize: '20px' }}>Preview Charts</h3>

        <Button
          type="button"
          onClick={downloadChartsAsPDF}
          variant="contained"
          sx={{
            background: '#06A19B',
            fontWeight: 600,
            padding: '6px 16px',
            width: 'fit-content',
            textTransform: 'capitalize',
            borderRadius: '8px',
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
                (option) => option.key === key,
              );
              if (!chartOption) return null;

              const { title, yDataKey } = chartOption;
              return (
                <Box
                  key={title}
                  marginBottom={4}
                  style={{
                    width: '100%',
                    height: '100%',
                    fontFamily: 'Arial, sans-serif',
                    borderBottom: '1px solid #333333',
                  }}
                >
                  <Box
                    style={{
                      padding: '12px 20px',
                      background: 'white',
                      boxShadow: '0 0 3px rgb(6, 161, 155)',
                      backgroundColor: ' rgb(6,161,155)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                    sx={{
                      flexDirection: {
                        xs: 'column',
                        sm: 'row',
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
                          marginBottom: '4px',
                          fontSize: '16px',
                          color: 'white',
                        }}
                      >
                        Production Report
                      </Box>
                      <Box
                        style={{
                          fontSize: '14px',
                          color: 'white',
                          marginBottom: '0',
                        }}
                      >
                        {productions[0]?.productionUnit?.name}{' '}
                        {productions[0]?.farm?.name} <br />
                        <span>
                          {dayjs(chartData?.startDate).format('YYYY/MM/DD')} to
                          {` ${dayjs(chartData?.endDate).format('YYYY/MM/DD')}`}
                        </span>
                      </Box>
                    </Typography>
                  </Box>
                  <Box
                    style={{
                      padding: '32px 30px',
                    }}
                  >
                    <Typography
                      style={{
                        fontSize: '22px',
                        fontWeight: 'bold',
                        marginBottom: '12px',
                      }}
                    >
                      Production Unit
                    </Typography>
                    <ul
                      style={{
                        padding: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                      }}
                    >
                      <li
                        style={{
                          marginInline: '10px',
                        }}
                      >
                        <Typography
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: {
                              xs: 0,
                              sm: '4px',
                              md: '12px',
                            },
                          }}
                        >
                          <h6
                            style={{
                              margin: 0,
                              fontSize: '16px',
                            }}
                          >
                            Unit Name :
                          </h6>
                          <p
                            style={{
                              margin: 0,
                              fontSize: '14px',
                              textWrap: 'wrap',
                            }}
                          >
                            {productions[0]?.productionUnit?.name}
                          </p>
                        </Typography>
                      </li>
                      <li
                        style={{
                          marginInline: '10px',
                        }}
                      >
                        <Typography
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: {
                              xs: 0,
                              sm: '4px',
                              md: '12px',
                            },
                          }}
                        >
                          <h6
                            style={{
                              margin: 0,
                              fontSize: '16px',
                            }}
                          >
                            Type :
                          </h6>
                          <p
                            style={{
                              margin: 0,
                              fontSize: '14px',
                            }}
                          >
                            {productions[0]?.productionUnit?.type}
                          </p>
                        </Typography>
                      </li>
                      <li
                        style={{
                          marginInline: '10px',
                        }}
                      >
                        <Typography
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: {
                              xs: 0,
                              sm: '4px',
                              md: '12px',
                            },
                          }}
                        >
                          <h6
                            style={{
                              margin: 0,
                              fontSize: '16px',
                            }}
                          >
                            Water Flow :
                          </h6>
                          <p
                            style={{
                              margin: 0,
                              fontSize: '14px',
                            }}
                          >
                            {productions[0]?.productionUnit?.waterflowRate} L/H
                          </p>
                        </Typography>
                      </li>
                      <li
                        style={{
                          marginInline: '10px',
                        }}
                      >
                        <Typography
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: {
                              xs: 0,
                              sm: '4px',
                              md: '12px',
                            },
                          }}
                        >
                          <h6
                            style={{
                              margin: 0,
                              fontSize: '16px',
                            }}
                          >
                            Volume :
                          </h6>
                          <p
                            style={{
                              margin: 0,
                              fontSize: '14px',
                            }}
                          >
                            {productions[0]?.productionUnit?.capacity}m3
                          </p>
                        </Typography>
                      </li>
                    </ul>
                  </Box>
                  <Box
                    style={{
                      width: '100%',
                      height: '100%',
                      fontFamily: 'Arial, sans-serif',
                    }}
                  >
                    {/* Chart */}

                    <Grid
                      container
                      style={{
                        width: '100%',
                        marginBottom: '20px',
                        display: 'flex',
                        alignItems: 'start',
                      }}
                    >
                      <Grid item lg={6} xs={12}>
                        <Box
                          style={{
                            marginBottom: '20px',
                            display: 'flex',
                          }}
                        >
                          <WaterTempChart
                            key={key}
                            xAxisData={chartData?.xAxisData}
                            ydata={chartData?.groupedData.units.flatMap(
                              (unit) =>
                                unit.waterManageHistory?.map(
                                  (history) => history[yDataKey],
                                ) || [],
                            )}
                            predictedValues={
                              predictedData?.find(
                                (val: { key: string; values: number[] }) =>
                                  val.key === yDataKey,
                              )?.values || []
                            }
                            maxVal={
                              chartData?.currentFarm
                                ?.WaterQualityPredictedParameters[0]
                                ?.YearBasedPredication[0]?.idealRange[yDataKey]
                                ?.Max
                            }
                            minVal={
                              chartData?.currentFarm
                                ?.WaterQualityPredictedParameters[0]
                                ?.YearBasedPredication[0]?.idealRange[yDataKey]
                                ?.Min
                            }
                            startDate={chartData?.startDate}
                            endDate={chartData?.endDate}
                            dateDiff={chartData?.dateDiff || 1}
                            title={title}
                          />
                        </Box>
                      </Grid>

                      <Grid item lg={6} xs={12}>
                        <table
                          style={{
                            width: '100%',
                            borderCollapse: 'collapse',
                            fontSize: '12px',
                            color: '#333',
                            marginTop: '16px',
                          }}
                        >
                          <thead>
                            <tr>
                              <th
                                style={{
                                  border: '1px solid #ccc',
                                  padding: '8px 12px',
                                  textAlign: 'left',
                                  borderTopLeftRadius: '8px',
                                  background: '#efefef',
                                }}
                              >
                                Date
                              </th>
                              <th
                                style={{
                                  border: '1px solid #ccc',
                                  padding: '8px 12px',
                                  textAlign: 'left',
                                  background: '#efefef',
                                }}
                              >
                                Value
                              </th>
                              <th
                                style={{
                                  border: '1px solid #ccc',
                                  padding: '8px 12px',
                                  textAlign: 'left',
                                  background: '#efefef',
                                }}
                              >
                                Predicted Value
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {chartData?.groupedData.units.flatMap((unit) => {
                              return (
                                unit.waterManageHistory
                                  ?.filter((value) => {
                                    const dateString = getFullYear(
                                      value?.currentDate,
                                    );
                                    const date = dayjs(dateString);
                                    return (
                                      date.unix() >=
                                        dayjs(chartData.startDate).unix() &&
                                      date.unix() <=
                                        dayjs(chartData.endDate).unix()
                                    );
                                  })
                                  ?.map((history) => {
                                    const dateString = getFullYear(
                                      history?.currentDate,
                                    );
                                    const date = dayjs(dateString);
                                    const month = date.format('MMM');
                                    const predictions: any =
                                      productions[0]?.productionUnit
                                        ?.YearBasedPredicationProductionUnit?.[0];
                                    const predictedValue =
                                      predictions?.[yDataKey]?.[month] || '';

                                    return (
                                      <tr key={history.currentDate}>
                                        <td
                                          style={{
                                            border: '1px solid #ccc',
                                            padding: '8px 12px',
                                          }}
                                        >
                                          {getFullYear(history?.currentDate)}
                                        </td>
                                        <td
                                          style={{
                                            border: '1px solid #ccc',
                                            padding: '8px 12px',
                                          }}
                                        >
                                          {history[yDataKey]}
                                        </td>
                                        <td
                                          style={{
                                            border: '1px solid #ccc',
                                            padding: '8px 12px',
                                          }}
                                        >
                                          {predictedValue}
                                        </td>
                                      </tr>
                                    );
                                  }) || []
                              );
                            })}
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
        <p style={{ fontSize: '14px', color: '#666' }}>
          No charts selected for preview.
        </p>
      )}
    </Stack>
  );
}

export default WaterChartDownloadPreview;
