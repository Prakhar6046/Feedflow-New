'use client';
import {
  calculateFishGrowthAfricanCatfish,
  calculateFishGrowthRainBowTrout,
  calculateFishGrowthTilapia,
  CommonFeedPredictionHead,
  exportFeedPredictionToXlsx,
  FeedPredictionHead,
} from '@/app/_lib/utils';
import * as ValidationPatterns from '@/app/_lib/utils/validationPatterns';
import * as ValidationMessages from '@/app/_lib/utils/validationsMessage';
import {
  Box,
  Button,
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
import { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import Loader from '../Loader';
import FishGrowthTable from '../table/FishGrowthTable';
import { speciesOptions, timeIntervalOptions } from './FeedingPlan';
interface FormInputs {
  farm: string;
  unit: string;
  startDate: string;
  endDate: string;
  period: number;
  temp: number;
  fishWeight: number;
  numberOfFishs: number;
  adjustmentFactor: number;
  timeInterval: number;
  species: 'Nile Tilapia' | 'African Catfish' | 'Rainbow Trout';
}
type RawDataItem = {
  date: string;
  teamp: number;
  noOfFish: number;
  fishSize: string;
  growth: number;
  feedType: string;
  feedSize: string;
  estimatedFCR: number;
  feedIntake: string;
  feedingRate: string;
  numberOfFish: number;
  averageProjectedTemp: number;
};
export interface FishFeedingData {
  date: string;
  days: number;
  averageProjectedTemp: number;
  estimatedFCR: number;
  expectedWaste: number;
  feedCost: number;
  feedDE: number;
  feedIntake: string;
  feedPrice: number;
  feedProtein: number;
  feedSize: string;
  feedType: string;
  feedingRate: string;
  fishSize: string;
  growth: number;
  numberOfFish: number;
  partitionedFCR: number;
}
type Iprops = {
  data: FishFeedingData[];
  setData: (val: FishFeedingData[]) => void;
};

function AdHoc({ data, setData }: Iprops) {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormInputs>({
    defaultValues: {
      numberOfFishs: 7500,
      fishWeight: 2,
      adjustmentFactor: 0.05,
      startDate: dayjs().format('YYYY-MM-DD'),
      temp: 24,
      period: 5,
    },
    mode: 'onChange',
  });

  const onSubmit: SubmitHandler<FormInputs> = (data) => {
    const formattedDate = dayjs(data.startDate).format('YYYY-MM-DD');
    const diffInDays = dayjs(data.endDate).diff(dayjs(data.startDate), 'day');
    if (data) {
      if (data.species === 'Rainbow Trout') {
        setData(
          calculateFishGrowthRainBowTrout(
            Number(data.fishWeight),
            Number(data.temp),
            Number(data.numberOfFishs),
            Number(data.adjustmentFactor),
            Number(diffInDays),
            formattedDate,
            1,
            13.9,
          ),
        );
      } else if (data.species === 'African Catfish') {
        setData(
          calculateFishGrowthAfricanCatfish(
            Number(data.fishWeight),
            Number(data.temp),
            Number(data.numberOfFishs),
            Number(data.adjustmentFactor),
            Number(diffInDays),
            formattedDate,
            1,
            13.9,
          ),
        );
      } else {
        setData(
          calculateFishGrowthTilapia(
            Number(data.fishWeight),
            Number(data.temp),
            Number(data.numberOfFishs),
            Number(data.adjustmentFactor),
            Number(diffInDays),
            formattedDate,
            data?.timeInterval,
            13.9,
          ),
        );
      }
    }
  };
  const resetAdHocData = () => {
    reset();
    setData([]);
  };
  const CreateFeedPredictionPDF = async () => {
    if (!data.length) {
      return;
    }
    const formatedData: RawDataItem[] = data?.map((val) => {
      return {
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
        numberOfFish: val.numberOfFish,
        averageProjectedTemp: val.averageProjectedTemp,
      };
    });

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

    for (let i = 0; i < chunks.length; i++) {
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
                Feed Prediction Report
              </h6>
            </div>
          </div>
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
                              idx === FeedPredictionHead.length - 1
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

    pdf.save(`ad_hoc_data.pdf`);
    setLoading(false);
  };
  const createxlsxFile = (
    e: React.MouseEvent<HTMLSpanElement | HTMLButtonElement, MouseEvent>,
  ) => {
    if (!data.length) {
      return;
    }
    const formatedData = data?.map((val) => {
      return {
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
      };
    });
    exportFeedPredictionToXlsx(
      e,
      CommonFeedPredictionHead,
      formatedData,
      'ad_Hoc_Data',
    );
  };

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
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3} mt={2} mb={5} alignItems={'start'}>
          <Grid item lg={3} md={4} sm={6} xs={12}>
            <TextField
              label="Farm *"
              type="text"
              {...register('farm', {
                required: true,
              })}
              className="form-input"
              focused
              sx={{
                width: '100%',
              }}
            />
            {errors.farm && (
              <Typography variant="body2" color="red" fontSize={13} mt={0.5}>
                {ValidationMessages.required}
              </Typography>
            )}
          </Grid>

          <Grid item lg={3} md={4} sm={6} xs={12}>
            <TextField
              label="Unit *"
              type="text"
              {...register('unit', {
                required: true,
              })}
              className="form-input"
              focused
              sx={{
                width: '100%',
              }}
            />
            {errors.unit && (
              <Typography variant="body2" color="red" fontSize={13} mt={0.5}>
                {ValidationMessages.required}
              </Typography>
            )}
          </Grid>

          <Grid item lg={3} md={4} sm={6} xs={12}>
            <FormControl className="form-input" fullWidth focused>
              <InputLabel id="demo-simple-select-label">Speices *</InputLabel>
              <Controller
                name="species"
                control={control}
                defaultValue={'Nile Tilapia'}
                render={({ field }) => (
                  <Select {...field} label="Species *">
                    {speciesOptions.map((option) => (
                      <MenuItem value={option.value} key={option.id}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
            </FormControl>
          </Grid>
        </Grid>

        <Grid container spacing={3} mt={2} mb={5} alignItems={'start'}>
          <Grid item lg={3} md={4} sm={6} xs={12}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Controller
                name="startDate"
                control={control}
                rules={{ required: 'This field is required.' }}
                render={({ field, fieldState: { error } }) => (
                  <>
                    <DatePicker
                      {...field}
                      label="Start Date * "
                      className="form-input"
                      sx={{ width: '100%' }}
                      onChange={(date) => {
                        if (date && date.isValid()) {
                          const formattedDate = date.format('YYYY-MM-DD');
                          field.onChange(formattedDate);
                          setValue('startDate', formattedDate);
                          setValue('endDate', '');
                        } else {
                          field.onChange(null);
                          setValue('startDate', '');
                        }
                      }}
                      slotProps={{
                        textField: { focused: true },
                      }}
                      value={field.value ? dayjs(field.value) : null} // Ensure correct rendering
                      maxDate={dayjs(watch('endDate'))}
                    />

                    {error && (
                      <Typography
                        variant="body2"
                        color="red"
                        fontSize={13}
                        mt={0.5}
                      >
                        {error.message}
                      </Typography>
                    )}
                  </>
                )}
              />
            </LocalizationProvider>
          </Grid>

          <Grid item lg={3} md={4} sm={6} xs={12}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Controller
                name="endDate"
                control={control}
                rules={{ required: 'This field is required.' }}
                render={({ field, fieldState: { error } }) => (
                  <>
                    <DatePicker
                      {...field}
                      label="End Date * "
                      className="form-input"
                      sx={{ width: '100%' }}
                      onChange={(date) => {
                        if (date && date.isValid()) {
                          const formattedDate = date.format('YYYY-MM-DD');
                          field.onChange(formattedDate);
                          setValue('endDate', formattedDate);
                        } else {
                          field.onChange(null);
                          setValue('endDate', '');
                        }
                      }}
                      slotProps={{
                        textField: { focused: true },
                      }}
                      minDate={dayjs(watch('startDate')).add(1, 'day')}
                      value={field.value ? dayjs(field.value) : null} // Ensure correct rendering
                    />

                    {error && (
                      <Typography
                        variant="body2"
                        color="red"
                        fontSize={13}
                        mt={0.5}
                      >
                        {error.message}
                      </Typography>
                    )}
                  </>
                )}
              />
            </LocalizationProvider>
          </Grid>

          {/* <Grid item lg={3} md={4} sm={6} xs={12}>
            <Box position={"relative"}>
              <TextField
                label="Period *"
                type="text"
                {...register("period")}
                value={dayjs(watch("endDate")).diff(
                  dayjs(watch("startDate")),
                  "day"
                )}
                disabled
                className="form-input"
                focused
                sx={{
                  width: "100%",
                }}
              />
              <Typography
                variant="body1"
                color="#555555AC"
                sx={{
                  position: "absolute",
                  right: 13,
                  top: "30%",
                  backgroundColor: "white",
                  paddingInline: "5px",
                }}
              >
                days
              </Typography>
            </Box>
          </Grid> */}
          <Grid item lg={3} md={4} sm={6} xs={12}>
            <FormControl className="form-input" fullWidth focused>
              <InputLabel id="demo-simple-select-label">
                Time Interval *
              </InputLabel>
              <Controller
                name="timeInterval"
                control={control}
                defaultValue={1}
                render={({ field }) => (
                  <Select {...field} label="Time Interval *">
                    {timeIntervalOptions.map((option) => (
                      <MenuItem value={option.value} key={option.id}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
            </FormControl>
          </Grid>

          <Grid item lg={3} md={4} sm={6} xs={12}>
            <Box position={'relative'}>
              <TextField
                label="Average Temperature *"
                type="text"
                {...register('temp', {
                  required: true,
                  pattern: ValidationPatterns.numbersWithDot,
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
                °C
              </Typography>
            </Box>
            {errors.temp && (
              <Typography variant="body2" color="red" fontSize={13} mt={0.5}>
                {errors.temp.type === 'required'
                  ? ValidationMessages.required
                  : errors.temp.type === 'pattern'
                    ? ValidationMessages.OnlyNumbersWithDot
                    : ''}
              </Typography>
            )}
          </Grid>
          {/* <Grid item lg={3} md={4} sm={6} xs={12}>
            <Box position={"relative"}>
              <TextField
                label="Temp *"
                type="text"
                {...register("temp")}
                className="form-input"
                focused
                sx={{
                  width: "100%",
                }}
              />
              <Typography
                variant="body1"
                color="#555555AC"
                sx={{
                  position: "absolute",
                  right: 13,
                  top: "30%",
                  backgroundColor: "white",
                  paddingInline: "5px",
                }}
              >
                °C
              </Typography>
            </Box>
          </Grid>
          <Grid item lg={3} md={4} sm={6} xs={12}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Controller
                name="startDate"
                control={control}
                rules={{ required: "This field is required." }}
                render={({ field, fieldState: { error } }) => (
                  <>
                    <DatePicker
                      {...field}
                      label="Start Date * "
                      className="form-input"
                      sx={{ width: "100%" }}
                      onChange={(date) => {
                        if (date && date.isValid()) {
                          const formattedDate = date.format("YYYY-MM-DD");
                          field.onChange(formattedDate);
                          setValue("startDate", formattedDate);
                        } else {
                          field.onChange(null);
                          setValue("startDate", "");
                        }
                      }}
                      slotProps={{
                        textField: { focused: true },
                      }}
                      value={field.value ? dayjs(field.value) : null} // Ensure correct rendering
                    />

                    {error && (
                      <Typography
                        variant="body2"
                        color="red"
                        fontSize={13}
                        mt={0.5}
                      >
                        {error.message}
                      </Typography>
                    )}
                  </>
                )}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item lg={3} md={4} sm={6} xs={12}>
            <Box position={"relative"}>
              <TextField
                label="Period *"
                type="text"
                {...register("period")}
                className="form-input"
                focused
                sx={{
                  width: "100%",
                }}
              />
              <Typography
                variant="body1"
                color="#555555AC"
                sx={{
                  position: "absolute",
                  right: 13,
                  top: "30%",
                  backgroundColor: "white",
                  paddingInline: "5px",
                }}
              >
                days
              </Typography>
            </Box>
          </Grid> */}
          {/* <Grid item lg={3} md={4} sm={6} xs={12}>
            <FormControl className="form-input" fullWidth focused>
              <InputLabel id="demo-simple-select-label">
                Time Interval *
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Time Interval *"
              >
                {timeIntervalOptions.map((option) => {
                  return (
                    <MenuItem value={option.value} key={option.id}>
                      {option.label}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Grid> */}
          {/* <Grid item lg={3} md={4} sm={6} xs={12}>
            <Box position={"relative"}>
              <TextField
                label="Expected Waste Factory *"
                type="text"
                {...register("expectedWaste")}
                className="form-input"
                focused
                sx={{
                  width: "100%",
                }}
              />
              <Typography
                variant="body1"
                color="#555555AC"
                sx={{
                  position: "absolute",
                  right: 13,
                  top: "30%",
                  backgroundColor: "white",
                  paddingInline: "5px",
                }}
              >
                %
              </Typography>
            </Box>
          </Grid> */}
        </Grid>

        <Grid container spacing={3} mt={2} mb={5} alignItems={'start'}>
          <Grid item lg={3} md={4} sm={6} xs={12}>
            <Box position={'relative'}>
              <TextField
                label="Average Fish Weight *"
                type="text"
                {...register('fishWeight', {
                  required: true,
                  pattern: ValidationPatterns.numbersWithDot,
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
                g
              </Typography>
            </Box>
            {errors.fishWeight && (
              <Typography variant="body2" color="red" fontSize={13} mt={0.5}>
                {errors.fishWeight.type === 'required'
                  ? ValidationMessages.required
                  : errors.fishWeight.type === 'pattern'
                    ? ValidationMessages.OnlyNumbersWithDot
                    : ''}
              </Typography>
            )}
          </Grid>

          <Grid item lg={3} md={4} sm={6} xs={12}>
            <Box position={'relative'}>
              <TextField
                label="Total Number Of Fish *"
                type="text"
                {...register('numberOfFishs', {
                  required: true,
                  pattern: ValidationPatterns.numbersWithDot,
                })}
                className="form-input"
                focused
                sx={{
                  width: '100%',
                }}
              />
              {/* <Typography
                variant="body1"
                color="#555555AC"
                sx={{
                  position: "absolute",
                  right: 13,
                  top: "30%",
                  backgroundColor: "white",
                  paddingInline: "5px",
                }}
              >
                days
              </Typography> */}
            </Box>
            {errors.numberOfFishs && (
              <Typography variant="body2" color="red" fontSize={13} mt={0.5}>
                {errors.numberOfFishs.type === 'required'
                  ? ValidationMessages.required
                  : errors.numberOfFishs.type === 'pattern'
                    ? ValidationMessages.OnlyNumbersWithDot
                    : ''}
              </Typography>
            )}
          </Grid>
        </Grid>

        <Grid container spacing={3} mt={2} mb={5} alignItems={'start'}>
          <Grid item lg={3} md={4} sm={6} xs={12}>
            <Box position={'relative'}>
              <Box position={'relative'}>
                <TextField
                  label="Adjustment Factor *"
                  type="text"
                  {...register('adjustmentFactor', {
                    required: true,
                    pattern: ValidationPatterns.numbersWithDot,
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
            </Box>
            {errors.adjustmentFactor && (
              <Typography variant="body2" color="red" fontSize={13} mt={0.5}>
                {errors.adjustmentFactor.type === 'required'
                  ? ValidationMessages.required
                  : errors.adjustmentFactor.type === 'pattern'
                    ? ValidationMessages.OnlyNumbersWithDot
                    : ''}
              </Typography>
            )}
          </Grid>

          <Grid item lg={3} md={4} sm={6} xs={12}>
            <Box>
              <Button
                type="submit"
                variant="contained"
                sx={{
                  background: '#06A19B',
                  fontWeight: 600,
                  padding: '6px 16px',
                  width: 'fit-content',
                  textTransform: 'capitalize',
                  borderRadius: '8px',
                  mt: 1,
                }}
              >
                Generate
              </Button>
            </Box>
          </Grid>
        </Grid>

        {/* <Box
          sx={{
            display: "flex",
            justifyContent: "end",
          }}
        >
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
              marginLeft: "auto",
              display: "block",
              my: 3,
            }}
          >
            Generate
          </Button>
        </Box> */}
      </form>
      {data?.length !== 0 && (
        <Box>
          <Grid container spacing={3} mt={2} mb={5} alignItems={'flex-end'}>
            <Grid item lg={3} md={4} sm={6} xs={12}>
              <Button
                id="basic-button"
                type="button"
                variant="contained"
                onClick={(e) => createxlsxFile(e)}
                sx={{
                  background: '#fff',
                  color: '#06A19B',
                  fontWeight: 600,
                  padding: '6px 16px',
                  width: 'fit-content',
                  textTransform: 'capitalize',
                  borderRadius: '8px',
                  border: '1px solid #06A19B',
                  marginBottom: '10px',
                  marginTop: '10px',
                  boxShadow: 'none',
                  '&:hover': {
                    boxShadow: 'none',
                  },
                }}
              >
                Create .xlsx File
              </Button>
            </Grid>
            <Grid item lg={3} md={4} sm={6} xs={12}>
              <Button
                id="basic-button"
                type="button"
                variant="contained"
                onClick={CreateFeedPredictionPDF}
                sx={{
                  background: '#fff',
                  color: '#06A19B',
                  fontWeight: 600,
                  padding: '6px 16px',
                  width: 'fit-content',
                  textTransform: 'capitalize',
                  borderRadius: '8px',
                  border: '1px solid #06A19B',
                  marginBottom: '10px',
                  boxShadow: 'none',
                  '&:hover': {
                    boxShadow: 'none',
                  },
                }}
              >
                Create PDF
              </Button>
            </Grid>
            <Grid item lg={3} md={4} sm={6} xs={12}>
              <Button
                id="basic-button"
                type="button"
                onClick={resetAdHocData}
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
                  boxShadow: 'none',
                  '&:hover': {
                    boxShadow: 'none',
                  },
                }}
              >
                Reset
              </Button>
            </Grid>
          </Grid>
          <FishGrowthTable data={data} />
        </Box>
      )}

      {/* {data?.length !== 0 && (
        <div className="mb-5">
          <FishGrowthChart
            xAxisData={data?.map((value) => value?.date) || []}
            yData={data?.map((value) => value?.fishSize) || []}
          />
        </div>
      )} */}
    </Stack>
  );
}

export default AdHoc;
