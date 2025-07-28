'use client';
import Loader from '@/app/_components/Loader';
import { getDayMonthDifference, Status } from '@/app/_lib/utils';
import { Farm } from '@/app/_typeModels/Farm';
import { FishSupply } from '@/app/_typeModels/fishSupply';
import { SingleOrganisation } from '@/app/_typeModels/Organization';
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

import * as validationPattern from '@/app/_lib/utils/validationPatterns/index';
import * as validationMessage from '@/app/_lib/utils/validationsMessage/index';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { getCookie } from 'cookies-next';
import dayjs, { Dayjs } from 'dayjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
interface Props {
  isEdit?: boolean;
  fishSupplyId?: string;
  farms?: Farm[];
  organisations?: SingleOrganisation[];
}
interface FormInputs {
  organisation: string;
  hatchingDate: Dayjs | null;
  spawningDate: Dayjs | null;
  spawningNumber: string;
  age: string;
  broodstockMale: string;
  broodstockFemale: string;
  fishFarmId: string;
  status: string;
  productionUnits: string;
}
function NewFishSupply({ isEdit, fishSupplyId, farms, organisations }: Props) {
  const router = useRouter();
  const userData = getCookie('logged-user');
  const [loading, setLoading] = useState<boolean>(false);
  const [isApiCallInProgress, setIsApiCallInProgress] = useState(false);
  const [fishSupply, setFishSupply] = useState<FishSupply>();
  const getFishSupply = async () => {
    const response = await fetch(`/api/fish/${fishSupplyId}`, {
      method: 'GET',
    });
    return response.json();
  };
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormInputs>({
    defaultValues: { hatchingDate: null, organisation: '' },
    mode: 'onChange',
  });
  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    // Prevent API call if one is already in progress
    if (isApiCallInProgress) return;
    setIsApiCallInProgress(true);
    try {
      const loggedUserData = JSON.parse(userData || '');

      const {
        hatchingDate,
        spawningDate,
        spawningNumber,
        organisation,
        productionUnits,
        ...restData
      } = data;
      const validHatchingDate = hatchingDate?.isValid()
        ? hatchingDate.format('MM/DD/YYYY')
        : null;

      const validSpawningDate = spawningDate?.isValid()
        ? spawningDate.format('MM/DD/YYYY')
        : null;

      if (!validHatchingDate || !validSpawningDate) {
        toast.error('Invalid date selected. Please choose a valid date.');
        return;
      }
      const payload = {
        hatchingDate: validHatchingDate,
        spawningDate: validSpawningDate,
        organisation: Number(organisation),
        spawningNumber: Number(spawningNumber),
        productionUnits: productionUnits,
        organisationId: loggedUserData.organisationId,
        ...restData,
      };

      const response = await fetch(
        `${isEdit ? `/api/fish/${fishSupplyId}` : '/api/fish'} `,
        {
          method: isEdit ? 'PUT' : 'POST',
          body: JSON.stringify(payload),
        },
      );

      if (response.ok) {
        const res = await response.json();
        router.push('/dashboard/fishSupply');
        toast.dismiss();
        toast.success(res.message);
      } else {
        toast.dismiss();
        toast.error('Somethig went wrong!');
      }
    } catch {
      // console.error("Fish supply error:", error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsApiCallInProgress(false);
    }
  };
  useEffect(() => {
    setLoading(true);

    if (isEdit) {
      const fishSupply = async () => {
        const res = await getFishSupply();
        const fishSupplyData: FishSupply = res.data;
        setFishSupply(fishSupplyData);
        setLoading(false);
      };
      fishSupply();
    } else {
      setLoading(false);
    }

    return () => {
      setLoading(false);
    };
  }, []);

  useEffect(() => {
    if (watch('hatchingDate')) {
      const age = getDayMonthDifference(
        watch('hatchingDate')?.format('MM/DD/YYYY') ?? '',
      );
      setValue('age', age);
    }
  }, [watch('hatchingDate')]);

  useEffect(() => {
    if (fishSupply) {
      setValue('age', fishSupply?.age);
      setValue('broodstockFemale', fishSupply?.broodstockFemale);
      setValue('broodstockMale', fishSupply?.broodstockMale);
      setValue('organisation', String(fishSupply?.organisation));
      setValue('spawningDate', dayjs(fishSupply?.spawningDate));
      setValue('hatchingDate', dayjs(fishSupply?.hatchingDate));
      setValue('spawningNumber', String(fishSupply?.spawningNumber));
      setValue('status', fishSupply?.status);
      setValue('fishFarmId', fishSupply?.fishFarmId);
      setValue('productionUnits', String(fishSupply?.productionUnits));
    }
  }, [fishSupply]);

  useEffect(() => {
    if (userData && !isEdit) {
      const loggedUserData = JSON.parse(userData);
      if (loggedUserData.organisationId) {
        setValue('fishFarmId', loggedUserData.organisationId);
      }
    }
  }, [userData]);
  if (loading) {
    return <Loader />;
  }

  return (
    <Stack
      sx={{
        borderRadius: '14px',
        boxShadow: '0px 0px 16px 5px #0000001A',
        my: 4,
      }}
    >
      <Box
        sx={{
          p: {
            md: 3,
            xs: 2,
          },
          fontSize: 20,
          fontWeight: 600,
          borderColor: '#0000001A',
        }}
      >
        Information
      </Box>

      <Divider />

      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid
          container
          spacing={2}
          sx={{
            p: {
              md: 3,
              xs: 2,
            },
          }}
        >
          <Grid item sm={6} xs={12}>
            <Box width={'100%'}>
              <FormControl fullWidth className="form-input" focused>
                <InputLabel id="demo-simple-select-label">
                  Hatchery *
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  {...register('organisation', {
                    required: true,
                    onChange: (e) => {
                      setValue('organisation', e.target.value);
                    },
                  })}
                  value={watch('organisation') || ''}
                  label="Hatchery *"
                >
                  {organisations?.map((organisation, i) => {
                    return (
                      <MenuItem value={Number(organisation.id)} key={i}>
                        {organisation.name}
                      </MenuItem>
                    );
                  })}
                </Select>
                {errors &&
                  errors.organisation &&
                  errors.organisation.type === 'required' && (
                    <Typography
                      variant="body2"
                      color="red"
                      fontSize={13}
                      mt={0.5}
                    >
                      This field is required.
                    </Typography>
                  )}
              </FormControl>
            </Box>
          </Grid>

          <Grid item sm={6} xs={12}>
            <FormControl className="form-input" fullWidth focused>
              <InputLabel id="demo-simple-select-label">
                Fish Producer *
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Fish Producer *"
                value={watch('fishFarmId') || ''}
                {...register('fishFarmId', {
                  required: true,
                  onChange: (e) => {
                    setValue('fishFarmId', e.target.value);
                  },
                })}
              >
                {farms?.map((farm, i) => {
                  return (
                    <MenuItem value={String(farm.id)} key={i}>
                      {farm.name}
                    </MenuItem>
                  );
                })}
              </Select>
              {errors &&
                errors.fishFarmId &&
                errors.fishFarmId.type === 'required' && (
                  <Typography
                    variant="body2"
                    color="red"
                    fontSize={13}
                    mt={0.5}
                  >
                    This field is required.
                  </Typography>
                )}
            </FormControl>
          </Grid>

          <Grid item sm={6} xs={12}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Controller
                name="spawningDate"
                control={control}
                rules={{ required: 'This field is required.' }}
                render={({ field, fieldState: { error } }) => (
                  <>
                    <DatePicker
                      {...field}
                      label="Spawning Date * "
                      className="form-input"
                      sx={{
                        width: '100%',
                      }}
                      onChange={(date) => {
                        if (date && date.isValid()) {
                          field.onChange(date); // Set a valid Dayjs date
                          setValue('hatchingDate', date);
                        } else {
                          field.onChange(null); // Clear the field if date is invalid
                        }
                      }}
                      slotProps={{
                        textField: { focused: true },
                      }}
                      value={field.value || null}
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

          <Grid item sm={6} xs={12}>
            <Box width={'100%'}>
              <TextField
                label="Spawning Number *"
                {...register('spawningNumber', {
                  required: true,
                  pattern: validationPattern.numbersWithDot,
                  maxLength: 10,
                })}
                focused
                type="number"
                className="form-input"
                sx={{
                  width: '100%',
                }}
              />

              {errors &&
                errors.spawningNumber &&
                errors.spawningNumber.type === 'required' && (
                  <Typography
                    variant="body2"
                    color="red"
                    fontSize={13}
                    mt={0.5}
                  >
                    This field is required.
                  </Typography>
                )}
              {errors &&
                errors.spawningNumber &&
                errors.spawningNumber.type === 'pattern' && (
                  <Typography
                    variant="body2"
                    color="red"
                    fontSize={13}
                    mt={0.5}
                  >
                    {validationMessage.OnlyNumbersWithDot}
                  </Typography>
                )}
              {errors &&
                errors.spawningNumber &&
                errors.spawningNumber.type === 'maxLength' && (
                  <Typography
                    variant="body2"
                    color="red"
                    fontSize={13}
                    mt={0.5}
                  >
                    {validationMessage.numberMaxLength}
                  </Typography>
                )}
            </Box>
          </Grid>

          <Grid item sm={6} xs={12}>
            <Box width={'100%'}>
              <TextField
                label="Broodstock (Male)"
                type="text"
                className="form-input"
                {...register('broodstockMale')}
                focused
                sx={{
                  width: '100%',
                }}
              />
            </Box>
          </Grid>

          <Grid item sm={6} xs={12}>
            <Box width={'100%'}>
              <TextField
                label="Broodstock (Female)"
                type="text"
                className="form-input"
                {...register('broodstockFemale')}
                focused
                sx={{
                  width: '100%',
                }}
              />
            </Box>
          </Grid>

          <Grid item sm={6} xs={12}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Controller
                name="hatchingDate"
                control={control}
                rules={{ required: 'This field is required.' }}
                render={({ field, fieldState: { error } }) => (
                  <>
                    <DatePicker
                      {...field}
                      label="Hatching Date *"
                      className="form-input"
                      sx={{
                        width: '100%',
                      }}
                      slotProps={{
                        textField: { focused: true },
                      }}
                      onChange={(date) => {
                        if (date && date.isValid()) {
                          field.onChange(date); // Explicitly update field when a date is selected
                        } else {
                          field.onChange(null); // Set value to null when date is removed
                        }
                      }}
                      value={field.value || null} // Fallback to null if no value
                    />
                    {error && !field.value && (
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

          <Grid item sm={6} xs={12}>
            <FormControl className="form-input" fullWidth focused>
              <InputLabel id="demo-simple-select-label">Status *</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Status *"
                value={watch('status') || ''}
                {...register('status', {
                  required: true,
                  onChange: (e) => {
                    setValue('status', e.target.value);
                  },
                })}
              >
                {Status.map((status, i) => {
                  return (
                    <MenuItem value={status} key={i}>
                      {status}
                    </MenuItem>
                  );
                })}
              </Select>
              {errors && errors.status && errors.status.type === 'required' && (
                <Typography variant="body2" color="red" fontSize={13} mt={0.5}>
                  This field is required.
                </Typography>
              )}
            </FormControl>
          </Grid>
          {/* <Grid item sm={6} xs={12}>
            <Box width={"100%"}>
              <TextField
                label="Production Unit *"
                multiline
                rows={3}
                className="form-input"
                {...register('productionUnits', {
                  required: true,
                })}
                focused
                sx={{
                  width: '100%',
                }}
              />

              {errors &&
                errors.productionUnits &&
                errors.productionUnits.type === 'required' && (
                  <Typography
                    variant="body2"
                    color="red"
                    fontSize={13}
                    mt={0.5}
                  >
                    This field is required.
                  </Typography>
                )}
            </Box>
          </Grid> */}
        </Grid>

        <Button
          type="submit"
          variant="contained"
          disabled={isApiCallInProgress}
          sx={{
            background: '#06A19B',
            fontWeight: 600,
            padding: '6px 16px',
            width: 'fit-content',
            textTransform: 'capitalize',
            borderRadius: '8px',
            marginLeft: 'auto',
            display: 'block',
            marginTop: 2,
            mb: 5,
            mr: {
              md: 3,
              xs: 2,
            },
          }}
        >
          {isEdit ? 'Save' : 'Add Fish Supply'}
        </Button>
      </form>
    </Stack>
  );
}

export default NewFishSupply;
