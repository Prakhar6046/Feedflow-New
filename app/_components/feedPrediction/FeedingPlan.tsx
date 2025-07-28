'use clinet';
import { setLocalItem } from '@/app/_lib/utils';
import * as ValidationPatterns from '@/app/_lib/utils/validationPatterns';
import * as ValidationMessages from '@/app/_lib/utils/validationsMessage';
import { FarmGroup } from '@/app/_typeModels/production';
import { selectSelectedFarms } from '@/lib/features/commonFilters/commonFilters';
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
import toast from 'react-hot-toast';
import { FishFeedingData } from './AdHoc';

interface Props {
  productionData: FarmGroup[] | undefined;
  startDate: string;
  endDate: string;
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
}
export interface FarmsFishGrowth {
  farm: string;
  unit: string;
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
export const tempSelectionOptions = [
  { label: 'Use Farm Profile', value: 'default' },
  {
    label: 'Specify',
    value: 'new',
  },
];
function FeedingPlan({ productionData, startDate, endDate }: Props) {
  const router = useRouter();
  const selectedDropDownfarms = useAppSelector(selectSelectedFarms);
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<FormInputs>({
    defaultValues: {
      fishWeight: 2,
      // startDate: dayjs().format("YYYY-MM-DD"),
      timeInterval: 1,
      // period: 30,
      tempSelection: 'default',
      adjustmentFactor: 0.05,
    },
    mode: 'onChange',
  });
  const onSubmit: SubmitHandler<FormInputs> = (data) => {
    // const formattedDate = dayjs(startDate).format('YYYY-MM-DD');
    // const diffInDays = dayjs(endDate).diff(dayjs(startDate), 'day');
    if (!selectedDropDownfarms?.length) {
      toast.dismiss();
      toast.error('Select at least one farm.');
      return;
    }
    if (productionData?.length === 0) {
      console.log('empty data');
      return;
    }

    const payload = {
      productionData: productionData,
      fishWeight: data.fishWeight,
      tempSelection: data.tempSelection,
      adjustmentFactor: data.adjustmentFactor,
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
      <form onSubmit={handleSubmit(onSubmit)}>
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
        </Grid>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'end',
          }}
        >
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
        </Box>
      </form>
    </Stack>
  );
}

export default FeedingPlan;
