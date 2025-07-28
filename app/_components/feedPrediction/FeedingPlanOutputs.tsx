'use clinet';
import {
  calculateFishGrowthTilapia,
  CommonFeedPredictionHead,
  exportFeedPredictionToXlsx,
  getLocalItem,
} from '@/app/_lib/utils';
import { FarmGroup } from '@/app/_typeModels/production';
import {
  Box,
  Button,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Controller, useForm } from 'react-hook-form';
import FishGrowthChart from '../charts/FishGrowthChart';
import FishGrowthTable from '../table/FishGrowthTable';
import { FishFeedingData } from './AdHoc';
import Loader from '../Loader';

import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { FeedPredictionData } from './FeedUsageOutputs';
// import MenuItem from "@mui/material/MenuItem";

export interface FarmsFishGrowth {
  farm: string;
  unit: string;
  farmId: string;
  unitId: number;
  fishGrowthData: FishFeedingData[];
}
export const timeIntervalOptions = [
  { id: 1, label: 'Daily', value: 1 },
  { id: 2, label: 'Weekly', value: 7 },
  { id: 3, label: 'Bi-Weekly', value: 14 },
  { id: 4, label: 'Monthly', value: 30 },
];
export const tempSelectionOptions = [
  { label: 'Use Farm Profile', value: 'default' },
  {
    label: 'Specify',
    value: 'new',
  },
];
function FeedingPlanOutput() {
  const [loading, setLoading] = useState(false);

  const [farmOption, setFarmOptions] = useState<
    {
      id: string;
      option: string;
    }[]
  >([]);
  const [unitOption, setUnitOptions] = useState<
    {
      id: number;
      option: string;
    }[]
  >([]);
  const [startDate, setStartDate] = useState<string | null>(
    dayjs().toISOString(),
  );
  const [endDate, setEndDate] = useState<string | null>(dayjs().toISOString());
  const [flatData, setFlatData] = useState<FarmsFishGrowth[]>([]);
  const [formData, setFomData] = useState<any>();
  const { control, setValue, watch, register } = useForm();
  const createxlsxFile = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    if (!flatData.length) {
      return;
    }
    const formatedData = flatData
      ?.filter(
        (val) => val.farmId == watch('farms') && val.unitId == watch('units'),
      )
      .flatMap((growth) =>
        growth.fishGrowthData.map((val) => ({
          date: val.date,
          teamp: val.averageProjectedTemp,
          noOfFish: val.numberOfFish,
          fishSize: val.fishSize,
          growth: val.growth,
          feedType: val.feedType,
          feedSize: val.feedSize,
          estimatedFCR: val.estimatedFCR,
          feedIntake: val.feedIntake,
          feedingRate: val.feedingRate,
        })),
      );
    exportFeedPredictionToXlsx(
      e,
      CommonFeedPredictionHead,
      formatedData,
      'feeding_plan_Data',
    );
  };
  const CreateFeedPredictionPDF = async (
    type: 'table' | 'graph' | 'feedTable',
  ) => {
    if (!flatData.length) {
      return;
    }
    const formatedData = flatData
      ?.filter(
        (val) => val.farmId == watch('farms') && val.unitId == watch('units'),
      )
      .flatMap((growth) =>
        growth.fishGrowthData.map((val) => ({
          date: val.date,
          teamp: val.averageProjectedTemp,
          noOfFish: val.numberOfFish,
          fishSize: val.fishSize,
          growth: val.growth,
          feedType: val.feedType,
          feedSize: val.feedSize,
          estimatedFCR: val.estimatedFCR,
          feedIntake: val.feedIntake,
          feedingRate: val.feedingRate,
          farmName: growth.farm,
          unitName: growth.unit,
          numberOfFish: val.numberOfFish,
          averageProjectedTemp: val.averageProjectedTemp,
        })),
      );

    setLoading(true);
    const chunkArray = <T,>(arr: T[], chunkSize: number): T[][] => {
      const results: T[][] = [];
      for (let i = 0; i < arr.length; i += chunkSize) {
        results.push(arr.slice(i, i + chunkSize));
      }
      return results;
    };
    const pdf = new jsPDF({ orientation: 'landscape' });
    const chunks = chunkArray(formatedData, 20);

    for (let i = 0; i < (type === 'table' ? chunks.length : 1); i++) {
      const tempContainer = document.createElement('div');
      document.body.appendChild(tempContainer);
      const chartDiv = document.createElement('div');
      tempContainer.appendChild(chartDiv);
      const root = createRoot(chartDiv);

      const currentChunk = chunks[i];

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
              backgroundColor: 'rgb(6,161,155)',
              boxShadow: '0 0 3px rgb(6, 161, 155)',
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
                Feeding Plan Report
              </h6>
            </div>
          </div>

          {type === 'table' ? (
            <div
              style={{
                width: '100%',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'start',
              }}
            >
              <div
                style={{
                  width: '100%',
                  margin: '20px',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
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
                      {CommonFeedPredictionHead?.map(
                        (head: string, idx: number) => (
                          <th
                            key={idx}
                            style={{
                              border: '1px solid #ccc',
                              padding: '8px 12px',
                              textAlign: 'left',
                              borderTopLeftRadius:
                                idx === CommonFeedPredictionHead.length - 1
                                  ? '8px'
                                  : '0px',
                              background: '#efefef',
                            }}
                          >
                            {head}
                          </th>
                        ),
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {currentChunk?.map((row, index: number) => (
                      <tr key={index}>
                        <td
                          style={{
                            border: '1px solid #ccc',
                            padding: '8px 12px',
                          }}
                        >
                          {row.date}
                        </td>
                        <td
                          style={{
                            border: '1px solid #ccc',
                            padding: '8px 12px',
                          }}
                        >
                          {row.averageProjectedTemp}
                        </td>
                        <td
                          style={{
                            border: '1px solid #ccc',
                            padding: '8px 12px',
                          }}
                        >
                          {row.numberOfFish}
                        </td>
                        <td
                          style={{
                            border: '1px solid #ccc',
                            padding: '8px 12px',
                          }}
                        >
                          {row.fishSize}
                        </td>
                        <td
                          style={{
                            border: '1px solid #ccc',
                            padding: '8px 12px',
                          }}
                        >
                          {row.growth}
                        </td>
                        <td
                          style={{
                            border: '1px solid #ccc',
                            padding: '8px 12px',
                          }}
                        >
                          {row.feedType}
                        </td>
                        <td
                          style={{
                            border: '1px solid #ccc',
                            padding: '8px 12px',
                          }}
                        >
                          {row.feedSize}
                        </td>
                        <td
                          style={{
                            border: '1px solid #ccc',
                            padding: '8px 12px',
                          }}
                        >
                          {row.estimatedFCR}
                        </td>
                        <td
                          style={{
                            border: '1px solid #ccc',
                            padding: '8px 12px',
                          }}
                        >
                          {row.feedIntake}
                        </td>
                        <td
                          style={{
                            border: '1px solid #ccc',
                            padding: '8px 12px',
                          }}
                        >
                          {row.feedingRate}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : type === 'graph' ? (
            <div style={{ width: '100%', padding: '20px' }}>
              <FishGrowthChart
                xAxisData={formatedData?.map((value) => value?.date) || []}
                yData={formatedData?.map((value) => value?.fishSize) || []}
                graphTitle={`Farm: ${formatedData[0].farmName} Unit: ${formatedData[0].unitName}`}
              />
            </div>
          ) : (
            <div style={{ width: '100%', padding: '20px' }}>
              <Paper
                sx={{
                  overflow: 'hidden',
                  borderRadius: '14px',
                  boxShadow: '0px 0px 16px 5px #0000001A',
                }}
              >
                {flatData
                  .filter(
                    (val) =>
                      val.farmId === watch('farms') &&
                      val.unitId === watch('units'),
                  )
                  .map((growth, index) => {
                    const uniqueFeedTypes = Array.from(
                      new Set(
                        growth?.fishGrowthData?.map((item) => item.feedType),
                      ),
                    );
                    const intakeByFeedType: Record<string, number> = {};

                    growth?.fishGrowthData?.forEach((item) => {
                      const intake = parseFloat(item.feedIntake as string);
                      if (!intakeByFeedType[item.feedType]) {
                        intakeByFeedType[item.feedType] = 0;
                      }
                      intakeByFeedType[item.feedType] += isNaN(intake)
                        ? 0
                        : intake;
                    });
                    const totalIntake: number = Object.values(
                      intakeByFeedType,
                    ).reduce((a: number, b: number) => a + b, 0);
                    const totalBags: string = (totalIntake / 20).toFixed(2);

                    return (
                      <TableContainer component={Paper} key={index}>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell
                                sx={{
                                  borderBottom: 0,
                                  color: '#fff',
                                  background: '#06a19b',
                                  fontSize: {
                                    md: 16,
                                    xs: 14,
                                  },
                                  fontWeight: 600,
                                }}
                              >
                                Supplier
                              </TableCell>
                              <TableCell
                                sx={{
                                  borderBottom: 0,
                                  color: '#fff',
                                  background: '#06a19b',
                                  fontSize: {
                                    md: 16,
                                    xs: 14,
                                  },
                                  fontWeight: 600,
                                }}
                              >
                                Feed
                              </TableCell>
                              <TableCell
                                sx={{
                                  borderBottom: 0,
                                  color: '#fff',
                                  background: '#06a19b',
                                  pr: 0,
                                  fontSize: {
                                    md: 16,
                                    xs: 14,
                                  },
                                  fontWeight: 600,
                                }}
                              >
                                <Typography variant="body2">
                                  {growth.farm}
                                </Typography>
                                <Divider
                                  sx={{
                                    borderWidth: 2,
                                    borderColor: '#fff',
                                    my: 1,
                                  }}
                                />
                                <Typography variant="body2">{`${growth.farm}-${growth.unit}`}</Typography>
                              </TableCell>
                            </TableRow>
                          </TableHead>

                          <TableBody>
                            {uniqueFeedTypes.map((feed, idx) => {
                              const feedKg =
                                intakeByFeedType[feed]?.toFixed(2) || 0;
                              const feedBags =
                                (intakeByFeedType[feed] / 20)?.toFixed(2) || 0;
                              return (
                                <TableRow
                                  key={idx}
                                  sx={{ backgroundColor: '#fff' }}
                                >
                                  {idx === 0 && (
                                    <TableCell
                                      rowSpan={uniqueFeedTypes.length}
                                      sx={{
                                        // borderBottomColor: "#F5F6F8",
                                        borderBottomWidth: 0,
                                        color: '#555555',
                                        backgroundColor: '#fff',
                                        fontWeight: 500,
                                        whiteSpace: 'nowrap',
                                      }}
                                    >
                                      SA Feeds
                                    </TableCell>
                                  )}
                                  <TableCell
                                    sx={{
                                      // borderBottomColor: "#F5F6F8",
                                      borderBottomWidth: 0,
                                      color: '#555555',
                                      fontWeight: 500,
                                      whiteSpace: 'nowrap',
                                      p: 0,
                                    }}
                                  >
                                    <Typography
                                      variant="h6"
                                      sx={{
                                        fontWeight: 500,
                                        fontSize: 14,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        gap: 1,
                                        backgroundColor: '#F5F6F8',
                                        borderTopLeftRadius: '8px',
                                        borderBottomLeftRadius: '8px',
                                        padding: '8px 12px',
                                        margin: '8px 0',
                                        textWrap: 'nowrap',
                                      }}
                                    >
                                      {feed}
                                    </Typography>
                                  </TableCell>
                                  <TableCell
                                    sx={{
                                      // borderBottomColor: "#F5F6F8",
                                      borderBottomWidth: 0,
                                      color: '#555555',
                                      fontWeight: 500,
                                      whiteSpace: 'nowrap',
                                      p: 0,
                                    }}
                                  >
                                    <Typography
                                      variant="h6"
                                      sx={{
                                        fontWeight: 500,
                                        fontSize: 14,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        gap: 1,
                                        backgroundColor: '#F5F6F8',
                                        padding: '8px 12px',
                                        margin: '8px 0',
                                        textWrap: 'nowrap',
                                      }}
                                    >
                                      {`${feedKg} Kg (${feedBags} Bags)`}
                                    </Typography>
                                  </TableCell>
                                </TableRow>
                              );
                            })}

                            <TableRow sx={{ backgroundColor: '#fff' }}>
                              <TableCell
                                sx={{
                                  color: '#555555',
                                  fontWeight: 500,
                                  whiteSpace: 'nowrap',
                                }}
                              ></TableCell>

                              <TableCell
                                sx={{
                                  color: '#555555',
                                  fontWeight: 500,
                                  whiteSpace: 'nowrap',
                                  p: 0,
                                }}
                              ></TableCell>

                              <TableCell
                                sx={{
                                  color: '#555555',
                                  fontWeight: 500,
                                  whiteSpace: 'nowrap',
                                  p: 0,
                                }}
                              >
                                <Typography
                                  variant="h6"
                                  sx={{
                                    fontWeight: 500,
                                    fontSize: 14,
                                    padding: '16px 12px',
                                    // margin: "8px 0",
                                    textWrap: 'nowrap',
                                    background: '#06a19b',
                                    color: '#fff',
                                  }}
                                >
                                  {`${totalIntake.toFixed(
                                    2,
                                  )} Kg (${totalBags} Bags)`}
                                </Typography>
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </TableContainer>
                    );
                  })}
              </Paper>
            </div>
          )}
        </div>,
      );

      await new Promise((resolve) => setTimeout(resolve, 800));

      const canvas = await html2canvas(chartDiv);
      const imgData = canvas.toDataURL('image/png');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      if (i > 0) pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

      root.unmount();
      tempContainer.remove();
    }

    pdf.save(`feeding_plan_${type}.pdf`);
    setLoading(false);
  };

  useEffect(() => {
    const selectedFarm: string = watch('farms');

    if (!selectedFarm && farmOption?.length > 0) {
      const defaultFarmId = farmOption[0].id;
      setValue('farms', defaultFarmId);
      return;
    }

    if (selectedFarm) {
      const getProductionUnits = (
        selectedFarm: string,
        detailedFarms: FarmGroup[],
      ) => {
        const matchedFarm = detailedFarms.find(
          (farm) => farm.units[0].farm.id == selectedFarm,
        );
        return {
          productionUnits: matchedFarm?.units || [],
        };
      };

      const result = getProductionUnits(selectedFarm, formData?.productionData);

      const customUnits = result.productionUnits.map((unit) => ({
        id: unit.id,
        option: unit?.productionUnit?.name,
      }));
      setUnitOptions(customUnits);
    }
  }, [watch('farms'), farmOption]);
  useEffect(() => {
    if (unitOption?.length) {
      setValue('units', unitOption[0]?.id);
    }
  }, [unitOption]);
  useEffect(() => {
    const data: FeedPredictionData | null = getLocalItem('feedPredictionData');
    if (data) {
      const customFarms = data?.productionData?.map((farm: FarmGroup) => {
        return { option: farm.farm, id: farm.units[0].farm.id ?? '' };
      });
      setStartDate(data?.startDate);
      setEndDate(data?.endDate);
      setFarmOptions(customFarms);
      setValue('adjustmentFactor', data.adjustmentFactor);
      setFomData(data);
      const fishGrowthData = data?.productionData?.map(
        (production: FarmGroup) =>
          production.units.map((unit) => {
            const formattedDate = dayjs(data?.startDate).format('YYYY-MM-DD');
            const diffInDays = dayjs(data?.endDate).diff(
              dayjs(data?.startDate),
              'day',
            );
            return {
              farm: production.farm,
              farmId: unit?.farm?.id ?? '',
              unitId: unit.id,
              unit: unit.productionUnit.name,
              fishGrowthData: calculateFishGrowthTilapia(
                Number(data?.fishWeight ?? 0),
                data?.tempSelection === 'default'
                  ? Number(unit?.waterTemp ?? 0)
                  : Number(data?.temp),
                Number(unit.fishCount ?? 0),
                Number(data.adjustmentFactor),
                Number(diffInDays),
                formattedDate,
                data?.timeInterval ?? 0,
                13.47,
              ),
            };
          }),
      );
      if (fishGrowthData?.length) {
        setFlatData([...fishGrowthData].flat());
      }
    }
  }, []);
  useEffect(() => {
    if (loading) {
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
  }, [loading]);

  if (loading) {
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
    <Stack>
      {/* <Box>
        <Button
          type="submit"
          variant="contained"
          sx={{
            background: "#06A19B",
            fontWeight: 600,
            padding: "6px 16px",
            width: "fit-content",
            textTransform: "capitalize",
            borderRadius: "8px",
            mr: 2,
          }}
        >
          Save
        </Button>

        <Button
          type="submit"
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
          Add dropdown here
        </Button>
      </Box> */}

      <Box mb={5}>
        <Grid container spacing={2} mt={1}>
          <Grid item xl={2} lg={4} md={4} sm={6} xs={12}>
            <FormControl fullWidth className="form-input selected" focused>
              <InputLabel
                id="demo-simple-select-label-1 "
                className="custom-input"
              >
                Farms
              </InputLabel>
              <Controller
                name="farms"
                control={control}
                defaultValue={farmOption[0]?.id ?? ''}
                render={({ field }) => (
                  <Select {...field} label="Farm *" value={field.value ?? ''}>
                    {farmOption.map((option) => (
                      <MenuItem value={option.id} key={option.id}>
                        {option.option}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
            </FormControl>
          </Grid>

          <Grid item xl={2} lg={4} md={4} sm={6} xs={12}>
            <FormControl fullWidth className="form-input selected" focused>
              <InputLabel
                id="demo-simple-select-label"
                className="custom-input"
              >
                Units
              </InputLabel>
              <Controller
                name="units"
                control={control}
                defaultValue={unitOption[0]?.id ?? ''}
                render={({ field }) => (
                  <Select {...field} label="Units *" value={field.value ?? ''}>
                    {unitOption.map((option) => (
                      <MenuItem value={option.id} key={option.id}>
                        {option.option}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
            </FormControl>
          </Grid>

          <Grid item xl={2} lg={4} md={4} sm={6} xs={12}>
            <TextField
              label="Generated By"
              type="text"
              // {...register("temp", {
              //   required: true,
              //   pattern: ValidationPatterns.numbersWithDot,
              // })}
              className="form-input"
              focused
              sx={{
                width: '100%',
              }}
            />
          </Grid>

          <Grid item xl={2} lg={4} md={4} sm={6} xs={12}>
            <FormControl fullWidth className={`form-input`} focused>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Generated On"
                  className="date-picker form-input"
                  value={dayjs()} // sets today's date
                  disabled
                />
              </LocalizationProvider>
            </FormControl>
          </Grid>
        </Grid>

        <Grid container spacing={2} mt={3}>
          <Grid item xl={2} lg={4} md={4} sm={6} xs={12}>
            <FormControl fullWidth className={`form-input`} focused>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Start Date"
                  className="date-picker form-input"
                  disabled
                  value={dayjs(startDate)}
                  onChange={(value) => {
                    const isoDate = value?.toISOString();
                    if (isoDate) setStartDate(isoDate);
                  }}
                  maxDate={dayjs(endDate)}
                />
              </LocalizationProvider>
            </FormControl>
          </Grid>

          <Grid item xl={2} lg={4} md={4} sm={6} xs={12}>
            <FormControl fullWidth className={`form-input`} focused>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="End Date"
                  value={dayjs(endDate)}
                  disabled
                  onChange={(value) => {
                    const isoDate = value?.toISOString();
                    if (isoDate) setEndDate(isoDate);
                  }}
                  sx={{
                    marginTop: '0',
                    borderRadius: '6px',
                  }}
                  className="date-picker form-input"
                  minDate={dayjs(startDate)}
                  maxDate={dayjs()}
                />
              </LocalizationProvider>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      <Grid
        container
        spacing={2}
        justifyContent={'space-between'}
        alignItems={'center'}
        mb={5}
      >
        <Grid
          item
          xl={2}
          lg={4}
          md={4}
          sm={6}
          xs={12}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Box position={'relative'} width={'100%'}>
            <TextField
              label="Adjustment Factor *"
              disabled
              type="text"
              {...register('adjustmentFactor', {
                required: true,
                // pattern: ValidationPatterns.numbersWithDot,
              })}
              className="form-input"
              focused
              sx={{
                width: '100%',
              }}
            />
            <Typography
              variant="body1"
              color="#555555AC"
              sx={{
                position: 'absolute',
                right: 13,
                top: '30%',
                backgroundColor: 'white',
                paddingInline: '5px',
              }}
            >
              %
            </Typography>
          </Box>
          {/* {errors.adjustmentFactor && (
            <Typography variant="body2" color="red" fontSize={13} mt={0.5}>
              {errors.adjustmentFactor.type === "required"
                ? ValidationMessages.required
                : errors.adjustmentFactor.type === "pattern"
                ? ValidationMessages.OnlyNumbersWithDot
                : ""}
            </Typography>
          )} */}

          {/* <Tooltip title="Re calculate">
            <Button
              type="submit"
              variant="contained"
              sx={{
                background: "#fff",
                color: "#06A19B",
                fontWeight: 600,
                width: "fit-content",
                padding: "6px",
                textTransform: "capitalize",
                borderRadius: "4px",
                border: "1px solid #06A19B",
                boxShadow: "none",
                "&:hover": {
                  boxShadow: "none",
                },
                minWidth: "fit-content",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 20 20"
              >
                <path
                  fill="currentColor"
                  d="M7 12a1 1 0 1 0 0-2a1 1 0 0 0 0 2m0 3a1 1 0 1 0 0-2a1 1 0 0 0 0 2m2.627-3.072a5.5 5.5 0 0 1 1.178-1.522A.998.998 0 0 0 9 11a1 1 0 0 0 .627.928M6.5 17h3.11q.279.538.663 1H6.5A2.5 2.5 0 0 1 4 15.5v-11A2.5 2.5 0 0 1 6.5 2h7A2.5 2.5 0 0 1 16 4.5v4.688a5.5 5.5 0 0 0-1-.185V4.5A1.5 1.5 0 0 0 13.5 3h-7A1.5 1.5 0 0 0 5 4.5v11A1.5 1.5 0 0 0 6.5 17M6 5.5A1.5 1.5 0 0 1 7.5 4h5A1.5 1.5 0 0 1 14 5.5v1A1.5 1.5 0 0 1 12.5 8h-5A1.5 1.5 0 0 1 6 6.5zM7.5 5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h5a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5zm10 7.48a.5.5 0 0 0 .5-.5v-2a.5.5 0 0 0-1 0v.758a4.5 4.5 0 1 0 2 3.742a.5.5 0 1 0-1 0a3.5 3.5 0 1 1-1.696-3H15.5a.5.5 0 1 0 0 1z"
                />
              </svg>
            </Button>
          </Tooltip> */}
        </Grid>

        {flatData
          .filter(
            (val) =>
              val.farmId == watch('farms') && val.unitId == watch('units'),
          )
          .map((growth, index) => {
            return (
              <Box
                key={index}
                sx={{
                  width: '100%',
                }}
              >
                <Stack
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    flexDirection: 'row',
                    justifyContent: 'end',
                    mt: 2.5,
                    mb: 5,
                  }}
                >
                  <Button
                    type="button"
                    variant="contained"
                    onClick={createxlsxFile}
                    sx={{
                      background: '#06A19B',
                      color: '#fff',
                      fontWeight: 600,
                      padding: '6px 16px',
                      width: 'fit-content',
                      textTransform: 'capitalize',
                      borderRadius: '8px',
                      border: '1px solid #06A19B',
                      mr: 1.5,
                    }}
                  >
                    Create .Xlsx File
                  </Button>
                  <Button
                    type="button"
                    onClick={() => CreateFeedPredictionPDF('table')}
                    variant="contained"
                    sx={{
                      background: '#fff',
                      color: '#06A19B',
                      fontWeight: 600,
                      padding: '6px 16px',
                      width: 'fit-content',
                      textTransform: 'capitalize',
                      borderRadius: '8px',
                      border: '1px solid #06A19B',
                    }}
                  >
                    Create Pdf
                  </Button>
                </Stack>

                <Box>
                  <FishGrowthTable data={growth.fishGrowthData} key={index} />
                </Box>
              </Box>
            );
          })}
      </Grid>

      <Grid
        container
        spacing={4}
        justifyContent={'space-between'}
        alignItems={'start'}
        sx={{
          mb: '20px',
        }}
      >
        <Grid item xs={6}>
          {/* <Typography variant="h6" component={"h6"} fontWeight={600}>
            Fish Growth
          </Typography> */}
          {flatData
            .filter(
              (val) =>
                val.farmId == watch('farms') && val.unitId == watch('units'),
            )
            .map((growth, index) => {
              return (
                <Box
                  key={index}
                  sx={{
                    width: '100%',
                  }}
                >
                  <Box>
                    <FishGrowthChart
                      xAxisData={
                        growth?.fishGrowthData?.map((value) => value?.date) ||
                        []
                      }
                      yData={
                        growth?.fishGrowthData?.map(
                          (value) => value?.fishSize,
                        ) || []
                      }
                      graphTitle={`Farm: ${growth.farm} Unit: ${growth.unit}`}
                    />
                  </Box>
                </Box>
              );
            })}
          <Box>
            {/* <Button
              type="submit"
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
              Add dropdown here
            </Button> */}
            <Button
              type="button"
              variant="contained"
              onClick={() => CreateFeedPredictionPDF('graph')}
              sx={{
                background: '#fff',
                color: '#06A19B',
                fontWeight: 600,
                padding: '6px 16px',
                width: 'fit-content',
                textTransform: 'capitalize',
                borderRadius: '8px',
                border: '1px solid #06A19B',
                mt: 2,
                display: 'block',
                ml: 'auto',
              }}
            >
              Create Pdf
            </Button>
          </Box>
        </Grid>

        <Grid item xs={6}>
          <Paper
            sx={{
              overflow: 'hidden',
              borderRadius: '14px',
              boxShadow: '0px 0px 16px 5px #0000001A',
            }}
          >
            {flatData
              .filter(
                (val) =>
                  val.farmId === watch('farms') &&
                  val.unitId === watch('units'),
              )
              .map((growth, index) => {
                const uniqueFeedTypes = Array.from(
                  new Set(growth?.fishGrowthData?.map((item) => item.feedType)),
                );
                const intakeByFeedType: Record<string, number> = {};

                growth?.fishGrowthData?.forEach((item) => {
                  const intake = parseFloat(item.feedIntake as string);
                  if (!intakeByFeedType[item.feedType]) {
                    intakeByFeedType[item.feedType] = 0;
                  }
                  intakeByFeedType[item.feedType] += isNaN(intake) ? 0 : intake;
                });
                const totalIntake: number = Object.values(
                  intakeByFeedType,
                ).reduce((a: number, b: number) => a + b, 0);
                const totalBags: string = (totalIntake / 20).toFixed(2);

                return (
                  <TableContainer component={Paper} key={index}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell
                            sx={{
                              borderBottom: 0,
                              color: '#fff',
                              background: '#06a19b',
                              fontSize: {
                                md: 16,
                                xs: 14,
                              },
                              fontWeight: 600,
                            }}
                          >
                            Supplier
                          </TableCell>
                          <TableCell
                            sx={{
                              borderBottom: 0,
                              color: '#fff',
                              background: '#06a19b',
                              fontSize: {
                                md: 16,
                                xs: 14,
                              },
                              fontWeight: 600,
                            }}
                          >
                            Feed
                          </TableCell>
                          <TableCell
                            sx={{
                              borderBottom: 0,
                              color: '#fff',
                              background: '#06a19b',
                              pr: 0,
                              fontSize: {
                                md: 16,
                                xs: 14,
                              },
                              fontWeight: 600,
                            }}
                          >
                            <Typography variant="body2">
                              {growth.farm}
                            </Typography>
                            <Divider
                              sx={{
                                borderWidth: 2,
                                borderColor: '#fff',
                                my: 1,
                              }}
                            />
                            <Typography variant="body2">{`${growth.farm}-${growth.unit}`}</Typography>
                          </TableCell>
                        </TableRow>
                      </TableHead>

                      <TableBody>
                        {uniqueFeedTypes.map((feed, idx) => {
                          const feedKg =
                            intakeByFeedType[feed]?.toFixed(2) || 0;
                          const feedBags =
                            (intakeByFeedType[feed] / 20)?.toFixed(2) || 0;
                          return (
                            <TableRow key={idx}>
                              {idx === 0 && (
                                <TableCell
                                  rowSpan={uniqueFeedTypes.length}
                                  sx={{
                                    // borderBottomColor: "#F5F6F8",
                                    borderBottomWidth: 0,
                                    color: '#555555',
                                    fontWeight: 500,
                                    whiteSpace: 'nowrap',
                                  }}
                                >
                                  SA Feeds
                                </TableCell>
                              )}
                              <TableCell
                                sx={{
                                  // borderBottomColor: "#F5F6F8",
                                  borderBottomWidth: 0,
                                  color: '#555555',
                                  fontWeight: 500,
                                  whiteSpace: 'nowrap',
                                  p: 0,
                                }}
                              >
                                <Typography
                                  variant="h6"
                                  sx={{
                                    fontWeight: 500,
                                    fontSize: 14,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    gap: 1,
                                    backgroundColor: '#F5F6F8',
                                    borderTopLeftRadius: '8px',
                                    borderBottomLeftRadius: '8px',
                                    padding: '8px 12px',
                                    margin: '8px 0',
                                    textWrap: 'nowrap',
                                  }}
                                >
                                  {feed}
                                </Typography>
                              </TableCell>
                              <TableCell
                                sx={{
                                  // borderBottomColor: "#F5F6F8",
                                  borderBottomWidth: 0,
                                  color: '#555555',
                                  fontWeight: 500,
                                  whiteSpace: 'nowrap',
                                  p: 0,
                                }}
                              >
                                <Typography
                                  variant="h6"
                                  sx={{
                                    fontWeight: 500,
                                    fontSize: 14,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    gap: 1,
                                    backgroundColor: '#F5F6F8',
                                    padding: '8px 12px',
                                    margin: '8px 0',
                                    textWrap: 'nowrap',
                                  }}
                                >
                                  {`${feedKg} Kg (${feedBags} Bags)`}
                                </Typography>
                              </TableCell>
                            </TableRow>
                          );
                        })}

                        <TableRow>
                          <TableCell
                            sx={{
                              color: '#555555',
                              fontWeight: 500,
                              whiteSpace: 'nowrap',
                            }}
                          ></TableCell>

                          <TableCell
                            sx={{
                              color: '#555555',
                              fontWeight: 500,
                              whiteSpace: 'nowrap',
                              p: 0,
                            }}
                          ></TableCell>

                          <TableCell
                            sx={{
                              color: '#555555',
                              fontWeight: 500,
                              whiteSpace: 'nowrap',
                              p: 0,
                            }}
                          >
                            <Typography
                              variant="h6"
                              sx={{
                                fontWeight: 500,
                                fontSize: 14,
                                padding: '16px 12px',
                                // margin: "8px 0",
                                textWrap: 'nowrap',
                                background: '#06a19b',
                                color: '#fff',
                              }}
                            >
                              {`${totalIntake.toFixed(
                                2,
                              )} Kg (${totalBags} Bags)`}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                );
              })}
          </Paper>
          <Box
            mt={5}
            sx={{
              display: 'flex',
              justifyContent: 'end',
              gap: 1.5,
            }}
          >
            <Button
              type="button"
              variant="contained"
              disabled
              sx={{
                background: '#06A19B',
                color: '#fff',
                fontWeight: 600,
                padding: '6px 16px',
                width: 'fit-content',
                textTransform: 'capitalize',
                borderRadius: '8px',
                border: '1px solid #06A19B',
              }}
            >
              Order Feed
            </Button>

            <Button
              type="button"
              variant="contained"
              onClick={() => CreateFeedPredictionPDF('feedTable')}
              sx={{
                background: '#fff',
                color: '#06A19B',
                fontWeight: 600,
                padding: '6px 16px',
                width: 'fit-content',
                textTransform: 'capitalize',
                borderRadius: '8px',
                border: '1px solid #06A19B',
              }}
            >
              Create PDF
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Stack>
  );
}

export default FeedingPlanOutput;
