'use clinet';
import { setLocalItem } from '@/app/_lib/utils';
import * as ValidationPatterns from '@/app/_lib/utils/validationPatterns';
import * as ValidationMessages from '@/app/_lib/utils/validationsMessage';
import { FarmGroup } from '@/app/_typeModels/production';
import { selectSelectedFarms, selectSelectedAverage } from '@/lib/features/commonFilters/commonFilters';
import { useAppSelector } from '@/lib/hooks';
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
import { useRouter } from 'next/navigation';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { FishFeedingData } from './AdHoc';

interface Props {
  productionData: FarmGroup[] | undefined;
  startDate: string;
  endDate: string;
  canEdit?: boolean;
  canView?: boolean;
}
interface FormInputs {
  startDate: string;
  timeInterval: number;
  period: number;
  fishWeight: number;
  tempSelection: string;
  temp: number;
  numberOfFishs: number;
  adjustmentFactor: number;
  mortalityRate: number;
  wasteFactor: number;
}
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

export const speciesOptions = [
  { id: 1, label: 'Nile Tilapia', value: 'Nile Tilapia' },
  { id: 2, label: 'African Catfish', value: 'African Catfish' },
  { id: 3, label: 'Rainbow Trout', value: 'Rainbow Trout' },
];
export const productionSystemOptions = [
  { id: 1, label: 'Recirculating Aquaculture System (RAS)', value: 'RAS' },
  { id: 5, label: 'Green Water / Bio Floc', value: 'Green Water / Bio Floc' },
  { id: 3, label: 'Intensive', value: 'Intensive' },
  { id: 4, label: 'Ponds', value: 'Ponds' },
  { id: 5, label: 'Raceways', value: 'Raceways' },
  { id: 6, label: 'Cages', value: 'Cages' },
];
export const tempSelectionOptions = [
  { label: 'Use Farm Profile', value: 'default' },
  {
    label: 'Specify',
    value: 'new',
  },
];
function FeedingPlan({ productionData, startDate, endDate, canEdit, canView }: Props) {
  const router = useRouter();
  const selectedDropDownfarms = useAppSelector(selectSelectedFarms);
  const selectedAverage = useAppSelector(selectSelectedAverage);
  
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormInputs>({
    defaultValues: {
      fishWeight: 2,
      // startDate: dayjs().format("YYYY-MM-DD"),
      timeInterval: 1,
      // period: 30,
      tempSelection: 'default',
      adjustmentFactor: 0.05,
      mortalityRate: 0.05,
      wasteFactor: 3,
    },
    mode: 'onChange',
  });

  // Autopopulate fields from production data for all selected farms/units
  useEffect(() => {
    if (productionData && productionData.length > 0 && selectedDropDownfarms && selectedDropDownfarms.length > 0) {
      let fishCountSum = 0;
      let meanWeightSum = 0;
      let unitCount = 0;

      // Iterate through all farms and units in productionData
      productionData.forEach((farmGroup) => {
        if (farmGroup.units && farmGroup.units.length > 0) {
          farmGroup.units.forEach((unit) => {
            // Get fishCount and meanWeight - check averages first based on selected average type, then direct value
            let fishCount = 0;
            let meanWeight = 0;

            // Check for average values based on selected average type
            if (selectedAverage === 'Lastest sample average' || selectedAverage === 'Individual average') {
              if (unit.individualAverages?.fishCount) {
                fishCount = Number(unit.individualAverages.fishCount) || 0;
              } else if (unit.fishCount) {
                fishCount = Number(unit.fishCount) || 0;
              }

              if (unit.individualAverages?.meanWeight) {
                meanWeight = Number(unit.individualAverages.meanWeight) || 0;
              } else if (unit.meanWeight) {
                meanWeight = Number(unit.meanWeight) || 0;
              }
            } else if (selectedAverage === 'Monthly average') {
              if (unit.monthlyAverages?.fishCount) {
                fishCount = Number(unit.monthlyAverages.fishCount) || 0;
              } else if (unit.fishCount) {
                fishCount = Number(unit.fishCount) || 0;
              }

              if (unit.monthlyAverages?.meanWeight) {
                meanWeight = Number(unit.monthlyAverages.meanWeight) || 0;
              } else if (unit.meanWeight) {
                meanWeight = Number(unit.meanWeight) || 0;
              }
            } else if (selectedAverage === 'Yearly average') {
              if (unit.yearlyAverages?.fishCount) {
                fishCount = Number(unit.yearlyAverages.fishCount) || 0;
              } else if (unit.fishCount) {
                fishCount = Number(unit.fishCount) || 0;
              }

              if (unit.yearlyAverages?.meanWeight) {
                meanWeight = Number(unit.yearlyAverages.meanWeight) || 0;
              } else if (unit.meanWeight) {
                meanWeight = Number(unit.meanWeight) || 0;
              }
            } else if (selectedAverage === 'All-time average') {
              if (unit.allTimeAverages?.fishCount) {
                fishCount = Number(unit.allTimeAverages.fishCount) || 0;
              } else if (unit.fishCount) {
                fishCount = Number(unit.fishCount) || 0;
              }

              if (unit.allTimeAverages?.meanWeight) {
                meanWeight = Number(unit.allTimeAverages.meanWeight) || 0;
              } else if (unit.meanWeight) {
                meanWeight = Number(unit.meanWeight) || 0;
              }
            } else {
              // Fallback to direct values if no average type matches
              if (unit.fishCount) {
                fishCount = Number(unit.fishCount) || 0;
              }
              if (unit.meanWeight) {
                meanWeight = Number(unit.meanWeight) || 0;
              }
            }

            // Sum up the values
            if (fishCount > 0) {
              fishCountSum += fishCount;
              unitCount++;
            }
            if (meanWeight > 0) {
              meanWeightSum += meanWeight;
            }
          });
        }
      });

      // Set the values - use sum for fish count, average for mean weight
      if (fishCountSum > 0) {
        setValue('numberOfFishs', fishCountSum);
      }
      if (meanWeightSum > 0 && unitCount > 0) {
        const avgMeanWeight = meanWeightSum / unitCount;
        setValue('fishWeight', avgMeanWeight);
      }
    }
  }, [selectedDropDownfarms, productionData, selectedAverage, setValue]);
  const onSubmit: SubmitHandler<FormInputs> = (data) => {
    // Prevent submission if user doesn't have edit permission
    if (!canEdit) {
      toast.error('You do not have permission to generate feed predictions.');
      return;
    }
    
    // const formattedDate = dayjs(startDate).format('YYYY-MM-DD');
    // const diffInDays = dayjs(endDate).diff(dayjs(startDate), 'day');
    if (!selectedDropDownfarms?.length) {
      toast.dismiss();
      toast.error('Select at least one farm.');
      return;
    }
    if (!productionData || productionData.length === 0) {
      toast.dismiss();
      toast.error('No production data available. Please select farms and units with production data.');
      return;
    }
    if (!startDate || !endDate) {
      toast.dismiss();
      toast.error('Please select both start date and end date.');
      return;
    }

    const payload = {
      productionData: productionData?.map((farm) => ({
        farmId: farm.farmId,

        farm: farm.farm,
        units: farm.units,
      })),
      fishWeight: data.fishWeight,
      tempSelection: data.tempSelection,
      adjustmentFactor: data.adjustmentFactor,
      mortalityRate: data.mortalityRate,
      wasteFactor: data.wasteFactor,
      startDate: startDate,
      endDate: endDate,
      timeInterval: data.timeInterval,
      temp: data.temp,
    };
    setLocalItem('feedPredictionData', payload);
    router.push('/dashboard/feedPrediction/feedingPlan');
    // const fishGrowthData: any = productionData?.map((production) =>
    //   production.units.map((unit) => {

    //     return {
    //       farm: production.farm,
    //       unit: unit.productionUnit.name,
    //       fishGrowthData: calculateFishGrowth(
    //         Number(data.fishWeight),
    //         data.tempSelection === "default"
    //           ? Number(unit?.waterTemp)
    //           : Number(data.temp),
    //         Number(unit.fishCount),
    //         Number(data.adjustmentFactor),
    //         Number(diffInDays),
    //         formattedDate,
    //         data.timeInterval,
    //         13.47
    //       ), 
    //     };
    //   })
    // );
    // if (fishGrowthData?.length) {
    //   setData([...fishGrowthData]);
    // }
  };

  return (
    <Stack>
      <Divider
        sx={{
          my: 4,
        }}
      />
      <form onSubmit={handleSubmit(onSubmit, (errors) => {
        console.error('Form validation errors:', errors);
        toast.error('Please fix the form errors before submitting.');
      })}>
        <Grid container spacing={2} mb={5} alignItems={'center'}>
          <Grid item xl={2} lg={4} md={4} sm={6} xs={12}>
            <Box position={'relative'}>
              <TextField
                label="Fish Weight *"
                type="text"
                {...register('fishWeight', {
                  required: true,
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
            <Box>
              {errors.fishWeight && (
                <Typography
                  variant="body2"
                  color="red"
                  fontSize={13}
                  mt={0.5}
                  position={'absolute'}
                >
                  {errors.fishWeight.type === 'required'
                    ? ValidationMessages.required
                    : ''}
                </Typography>
              )}
            </Box>
          </Grid>

          <Grid item xl={2} lg={4} md={4} sm={6} xs={12}>
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
          <Grid item xl={2} lg={4} md={4} sm={6} xs={12}>
            <FormControl className="form-input" fullWidth focused>
              <InputLabel id="demo-simple-select-label">
                Temperature Selection *
              </InputLabel>
              <Controller
                name="tempSelection"
                control={control}
                defaultValue="default"
                render={({ field }) => (
                  <Select {...field} label="Temperature Selection *">
                    {tempSelectionOptions.map((option, idx) => (
                      <MenuItem value={option.value} key={idx}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
            </FormControl>
          </Grid>
          {watch('tempSelection') !== 'default' && (
            <Grid item xl={2} lg={4} md={4} sm={6} xs={12}>
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
                <Typography
                  variant="body2"
                  color="red"
                  fontSize={13}
                  mt={0.5}
                  position={'absolute'}
                >
                  {errors.temp.type === 'required'
                    ? ValidationMessages.required
                    : errors.temp.type === 'pattern'
                      ? ValidationMessages.OnlyNumbersWithDot
                      : ''}
                </Typography>
              )}
            </Grid>
          )}

          <Grid item xl={2} lg={4} md={4} sm={6} xs={12}>
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
            </Box>
            {errors.numberOfFishs && (
              <Typography
                variant="body2"
                color="red"
                fontSize={13}
                mt={0.5}
                position={'absolute'}
              >
                {errors.numberOfFishs.type === 'required'
                  ? ValidationMessages.required
                  : errors.numberOfFishs.type === 'pattern'
                    ? ValidationMessages.OnlyNumbersWithDot
                    : ''}
              </Typography>
            )}
          </Grid>
          <Grid item xl={2} lg={4} md={4} sm={6} xs={12}>
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
              <Typography
                variant="body2"
                color="red"
                fontSize={13}
                mt={0.5}
                position={'absolute'}
              >
                {errors.adjustmentFactor.type === 'required'
                  ? ValidationMessages.required
                  : errors.adjustmentFactor.type === 'pattern'
                    ? ValidationMessages.OnlyNumbersWithDot
                    : ''}
              </Typography>
            )}
          </Grid>
          <Grid item xl={2} lg={4} md={4} sm={6} xs={12}>
            <Box position={'relative'}>
              <TextField
                label="Daily Mortality Rate (Optional)"
                type="text"
                {...register('mortalityRate', {
                  required: false,
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
                %/day
              </Typography>
            </Box>
            {errors.mortalityRate && (
              <Typography
                variant="body2"
                color="red"
                fontSize={13}
                mt={0.5}
                position={'absolute'}
              >
                {errors.mortalityRate.type === 'pattern'
                  ? ValidationMessages.OnlyNumbersWithDot
                  : ''}
              </Typography>
            )}
          </Grid>
          <Grid item xl={2} lg={4} md={4} sm={6} xs={12}>
            <Box position={'relative'}>
              <TextField
                label="Waste Factor *"
                type="text"
                {...register('wasteFactor', {
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
            {errors.wasteFactor && (
              <Typography
                variant="body2"
                color="red"
                fontSize={13}
                mt={0.5}
                position={'absolute'}
              >
                {errors.wasteFactor.type === 'required'
                  ? ValidationMessages.required
                  : errors.wasteFactor.type === 'pattern'
                    ? ValidationMessages.OnlyNumbersWithDot
                    : ''}
              </Typography>
            )}
          </Grid>
        </Grid>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'end',
          }}
        >
          {canEdit && (
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
                marginLeft: 'auto',
                display: 'block',
                my: 3,
              }}
            >
              Generate
            </Button>
          )}
        </Box>
      </form>
    </Stack>
  );
}

export default FeedingPlan;
