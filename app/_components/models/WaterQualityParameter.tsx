import {
  getLocalItem,
  removeLocalItem,
  setLocalItem,
  waterQualityFields,
} from '@/app/_lib/utils';
import * as validationPattern from '@/app/_lib/utils/validationPatterns/index';
import * as validationMessage from '@/app/_lib/utils/validationsMessage/index';
import { Farm } from '@/app/_typeModels/Farm';
import { Production } from '@/app/_typeModels/production';
import { Close as CloseIcon } from '@mui/icons-material'; // Use Material-UI's Close icon directly
import {
  Box,
  Button,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  Menu,
  Modal,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Dayjs } from 'dayjs';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import {
  Controller,
  SubmitHandler,
  useFieldArray,
  useForm,
} from 'react-hook-form';
import toast from 'react-hot-toast';
const style = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
};

interface Props {
  setOpen: (open: boolean) => void;
  open: boolean;
  selectedProduction: Production | null | undefined;
  farms: Farm[];
}

type WaterEntry = {
  id: number;
  fishFarm: string;
  productionUnit: string;
  waterTemp?: string;
  DO?: string;
  TSS?: string;
  NH4?: string;
  NO3?: string;
  NO2?: string;
  ph?: string;
  visibility?: string;
  showDate?: boolean;
  date?: Dayjs | null;
};

type InputTypes = {
  water: WaterEntry[];
};
const WaterQualityParameter: React.FC<Props> = ({
  setOpen,
  open,
  selectedProduction,
  farms,
}) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const isWater = searchParams.get('isWater');
  const [selectedFarm, setSelectedFarm] = useState<string | null | undefined>(
    null,
  );
  const [anchorEl, setAnchorEl] = useState(null);
  const [isApiCallInProgress, setIsApiCallInProgress] =
    useState<boolean>(false);
  const [formData, setFormData] = useState<WaterEntry[]>();

  const {
    register,
    setValue,
    formState: { errors },
    watch,
    clearErrors,
    reset,
    getValues,
    handleSubmit,
    control,
  } = useForm<InputTypes>({
    defaultValues: {
      water: [
        {
          id: 0,
          fishFarm: '',
          productionUnit: '',
          DO: '',
          NH4: '',
          NO2: '',
          NO3: '',
          ph: '',
          TSS: '',
          visibility: '',
          waterTemp: '',
          date: '',
          showDate: false,
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'water',
  });
  const watchedFields: InputTypes['water'] = watch('water');

  const onSubmit: SubmitHandler<InputTypes> = async (data) => {
    // Prevent API call if one is already in progress
    if (isApiCallInProgress) return;
    setIsApiCallInProgress(true);

    try {
      if (data.water[1]) {
        const updatedData = data.water.map((data) => {
          if (data.date) {
            return {
              ...data,
              date: data.date.format('YYYY-MM-DDTHH:mm:ssZ[Z]'),
            };
          } else {
            return data;
          }
        });

        const payload = {
          waterAvg: updatedData[0],
          listData: updatedData.filter((_, idx) => idx !== 0),
        };

        const response = await fetch('/api/production/mange/waterQuality', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        const res = await response.json();
        if (res.status) {
          toast.dismiss();
          toast.success(res.message);
          setOpen(false);
          router.push('/dashboard/production');
          removeLocalItem('productionData');
          removeLocalItem('formData');
          reset();
          router.refresh();
        }
      }
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsApiCallInProgress(false);
    }
  };

  const handleClose = () => {
    const firstObject = getValues('water')[0];
    // Reset the form and keep the first object intact
    reset({
      water: [firstObject], // Keep only the first object
    });
    setOpen(false);
    const params = new URLSearchParams(searchParams);
    params.delete('isWater');
    removeLocalItem('productionData');
    removeLocalItem('formData');
    router.replace(`/dashboard/production`);
  };
  const openAnchor = Boolean(anchorEl);
  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseAnchor = (field: string) => {
    if (field.length) {
      append({
        id: selectedProduction?.id ?? 0,
        fishFarm: selectedProduction?.fishFarmId ?? '',
        productionUnit: selectedProduction?.productionUnitId ?? '',
        DO: '',
        NH4: '',
        NO2: '',
        NO3: '',
        ph: '',
        TSS: '',
        visibility: '',
        waterTemp: '',
        date: null,
        showDate: true,
      });
      setAnchorEl(null);
    } else {
      setAnchorEl(null);
    }
  };

  useEffect(() => {
    if (selectedProduction && !formData) {
      const data = [
        {
          id: selectedProduction.id,
          fishFarm: selectedProduction.fishFarmId,
          productionUnit: selectedProduction.productionUnitId,
        },
      ];
      setValue('water', data);
    }
    if (formData) {
      setValue('water', formData);
    }
    setSelectedFarm(
      formData
        ? (formData?.[0]?.fishFarm ?? '')
        : selectedProduction?.fishFarmId,
    ); // Set the selected farm when manager is selected
  }, [selectedProduction, formData]);

  useEffect(() => {
    if (selectedProduction && selectedFarm) {
      const index0WaterTemp = 0;
      const index0DO = 0;
      const index0TSS = 0;
      const index0NH4 = 0;
      const index0NO3 = 0;
      const index0NO2 = 0;
      const index0Ph = 0;
      const index0visibility = 0;

      // Initialize updated values
      let updatedWaterTemp = index0WaterTemp;
      let updatedDo = index0DO;
      let updatedTSS = index0TSS;
      let updatedNH4 = index0NH4;
      let updatedNO3 = index0NO3;
      let updatedNO2 = index0NO2;
      let updatedPH = index0Ph;
      let updatedVisibility = index0visibility;

      // Iterate through watched fields, skipping index 0
      watchedFields.forEach((field, index) => {
        if (index === 0) return; // Skip index 0
        updatedWaterTemp += Number(field.waterTemp);
        updatedDo += Number(field.DO);
        updatedTSS += Number(field.TSS);
        updatedNH4 += Number(field.NH4);
        updatedNO3 += Number(field.NO3);
        updatedNO2 += Number(field.NO2);
        updatedPH += Number(field.ph);
        updatedVisibility += Number(field.visibility);
      });

      const totalFields = (field: keyof WaterEntry) => {
        const length = watchedFields.filter((data) => data[field]).length - 1;
        if (length) {
          return length;
        } else {
          return 1;
        }
      };

      const totalWaterTempAvg = updatedWaterTemp / totalFields('waterTemp');

      const totalDo = updatedDo / totalFields('DO');
      const totalTSS = updatedTSS / totalFields('TSS');
      const totalNH4 = updatedNH4 / totalFields('NH4');
      const totalNO3 = updatedNO3 / totalFields('NO3');
      const totalNO2 = updatedNO2 / totalFields('NO2');
      const totalPH = updatedPH / totalFields('ph');
      const totalVisibility = updatedVisibility / totalFields('visibility');
      // Set the index 0 values after calculation
      setValue(
        `water.0.waterTemp`,
        totalWaterTempAvg ? totalWaterTempAvg.toFixed(2).toString() : '',
      );
      setValue(`water.0.DO`, totalDo ? totalDo.toFixed(2).toString() : '');
      setValue(`water.0.TSS`, totalTSS ? totalTSS.toFixed(2).toString() : '');
      setValue(`water.0.NH4`, totalNH4 ? totalNH4.toFixed(2).toString() : '');
      setValue(`water.0.NO3`, totalNO3 ? totalNO3.toFixed(2).toString() : '');
      setValue(`water.0.NO2`, totalNO2 ? totalNO2.toFixed(2).toString() : '');
      setValue(`water.0.ph`, totalPH ? totalPH.toFixed(2).toString() : '');
      setValue(
        `water.0.visibility`,
        totalVisibility ? totalVisibility.toFixed(2).toString() : '',
      );

      // Clear validation errors for index 0 fields
      clearErrors([
        'water.0.waterTemp',
        'water.0.DO',
        'water.0.TSS',
        'water.0.NH4',
        'water.0.NO3',
        'water.0.NO2',
        'water.0.ph',
        'water.0.visibility',
      ]);
    }
    if (watchedFields[0]?.id) {
      if (isWater && watchedFields[0]?.id) {
        setLocalItem('formData', watchedFields);
      } else {
        removeLocalItem('formData');
      }
    }
  }, [
    watchedFields.map((field) => field.waterTemp).join(','),
    watchedFields.map((field) => field.DO).join(','),
    watchedFields.map((field) => field.TSS).join(','),
    watchedFields.map((field) => field.NH4).join(','),
    watchedFields.map((field) => field.NO3).join(','),
    watchedFields.map((field) => field.NO2).join(','),
    watchedFields.map((field) => field.ph).join(','),
    watchedFields.map((field) => field.visibility).join(','),
    setValue,
    clearErrors,
    isWater,
    selectedFarm,
    selectedProduction,
  ]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const data = getLocalItem('formData');
      setFormData(data);
    }
  }, []);
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="parent-modal-title"
      aria-describedby="parent-modal-description"
      className="modal-positioning"
      onBackdropClick={() => reset()}
    >
      <Stack sx={style}>
        <Box display="flex" justifyContent="flex-end" padding={2}>
          <IconButton
            onClick={handleClose}
            sx={{
              color: 'inherit',
              background: 'transparent',
              margin: '2',
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 'bold',
            marginLeft: '50px',
            marginBottom: '10px',
          }}
        >
          Water Average
        </Typography>

        <form className="form-height" onSubmit={handleSubmit(onSubmit)}>
          {fields.map((item, idx) => {
            return (
              <Box paddingInline={4} key={item.id}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    height: '100%',
                    position: 'relative',
                    bottom: '10px',
                    gap: 1.5,
                  }}
                >
                  <Stack
                    sx={{
                      overflowY: {
                        // xl: "visible",
                        xs: 'auto',
                      },
                      width: '97%',
                      pb: 2,
                    }}
                  >
                    <Grid
                      container
                      spacing={2}
                      className="grid-margin"
                      sx={{
                        flexWrap: 'nowrap',
                      }}
                    >
                      {!item.showDate && (
                        <Grid
                          item
                          xs
                          sx={{
                            width: 'fit-content',
                            minWidth: 135,
                          }}
                        >
                          <Box width={'100%'}>
                            <FormControl
                              fullWidth
                              className={`form-input ${
                                idx === 0 && 'selected'
                              }`}
                              focused
                            >
                              <InputLabel sx={{ fontWeight: 'medium' }} id="">
                                Fish Farm *
                              </InputLabel>
                              <Select
                                labelId="feed-supply-select-label9"
                                className="fish-manager"
                                id="feed-supply-select9"
                                label="Fish Farm*"
                                readOnly={idx === 0 ? true : false}
                                {...register(`water.${idx}.fishFarm`, {
                                  required: watch(`water.${idx}.fishFarm`)
                                    ? false
                                    : true,
                                })}
                                onChange={(e) => {
                                  const selectedFishFarm = e.target.value;

                                  setSelectedFarm(selectedFishFarm); // Set selected farm for this specific entry
                                  setValue(
                                    `water.${idx}.fishFarm`,
                                    selectedFishFarm,
                                  ); // Set the value for this fishFarm
                                  setValue(`water.${idx}.productionUnit`, ''); // Reset production unit for the current entry
                                }}
                                value={getValues(`water.${idx}.fishFarm`) || ''} // Ensure only the current entry is updated
                              >
                                {farms?.map((farm: Farm, i) => (
                                  <MenuItem value={String(farm.id)} key={i}>
                                    {farm.name}
                                  </MenuItem>
                                ))}
                              </Select>

                              {errors &&
                                errors?.water &&
                                errors?.water[idx] &&
                                errors?.water[idx].fishFarm &&
                                errors?.water[idx].fishFarm.type ===
                                  'required' && (
                                  <Typography
                                    variant="body2"
                                    color="red"
                                    fontSize={13}
                                    mt={0.5}
                                  >
                                    {validationMessage.required}
                                  </Typography>
                                )}
                              <Typography
                                variant="body2"
                                color="red"
                                fontSize={13}
                                mt={0.5}
                              ></Typography>
                            </FormControl>
                          </Box>
                        </Grid>
                      )}
                      {!item.showDate && (
                        <Grid
                          xs
                          item
                          sx={{
                            width: 'fit-content',
                            minWidth: 135,
                          }}
                        >
                          <Box width={'100%'}>
                            <FormControl
                              focused
                              fullWidth
                              className="form-input selected"
                            >
                              <InputLabel sx={{ fontWeight: 'medium' }} id="">
                                Production Unit *
                              </InputLabel>
                              <Select
                                labelId="production-unit-select-label"
                                id="production-unit-select"
                                label="Production Unit*"
                                sx={{
                                  width: '100%',
                                  zIndex: 999,
                                  '& .MuiInputLabel-root': {
                                    transition: 'all 0.2s ease',
                                    maxWidth: '60%',
                                    overflow: 'hidden',
                                    whiteSpace: 'nowrap',
                                    textOverflow: 'ellipsis',
                                    height: 'auto',
                                  },
                                  '&:focus-within .MuiInputLabel-root': {
                                    transform: 'translate(10px, -9px)',
                                    fontSize: '0.75rem',
                                    color: 'primary.main',
                                    backgroundColor: '#fff',
                                    maxWidth: '100%',
                                    overflow: 'visible',
                                    textOverflow: 'unset',
                                  },
                                }}
                                // disabled={
                                //   item.field === "Harvest" ||
                                //   item.field === "Mortalities" ||
                                //   idx === 0
                                //     ? true
                                //     : false
                                // }
                                {...register(`water.${idx}.productionUnit`, {
                                  required: watch(`water.${idx}.productionUnit`)
                                    ? false
                                    : true,
                                  // onChange: (e) =>
                                  //   item.field === "Stock" &&
                                  //   setValue(
                                  //     `water.0.productionUnit`,
                                  //     e.target.value
                                  //   ),
                                })}
                                readOnly={idx === 0 ? true : false}
                                inputProps={{
                                  shrink: watch(`water.${idx}.productionUnit`),
                                }}
                                value={
                                  watch(`water.${idx}.productionUnit`) || ''
                                }
                              >
                                {(() => {
                                  const selectedFarm = farms?.find(
                                    (farm) =>
                                      farm.id ===
                                      watch(`water.${idx}.fishFarm`),
                                  );

                                  return selectedFarm ? (
                                    selectedFarm?.productionUnits?.map(
                                      (unit) => (
                                        <MenuItem
                                          value={String(unit.id)}
                                          key={unit.id}
                                        >
                                          {unit.name}
                                        </MenuItem>
                                      ),
                                    )
                                  ) : (
                                    <MenuItem value="" disabled>
                                      No units available
                                    </MenuItem>
                                  );
                                })()}
                              </Select>
                              {errors &&
                                !watch(`water.${idx}.productionUnit`) &&
                                errors?.water &&
                                errors?.water[idx] &&
                                errors?.water[idx].productionUnit && (
                                  <Typography
                                    variant="body2"
                                    color="red"
                                    fontSize={13}
                                    mt={0.5}
                                  >
                                    This field is required
                                  </Typography>
                                )}
                            </FormControl>
                          </Box>
                        </Grid>
                      )}
                      {item.showDate && (
                        <Grid
                          xs
                          item
                          sx={{
                            width: 'fit-content',
                            minWidth: 270,
                          }}
                        >
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <Box className="tablecell">
                              <DemoContainer components={['DateTimePicker']}>
                                <Controller
                                  name={`water.${idx}.date`}
                                  control={control}
                                  render={({ field }) => (
                                    <Box>
                                      <DateTimePicker
                                        {...field}
                                        label="Current Date * "
                                        className="form-input custom-date-time"
                                        sx={{
                                          width: '100%',
                                        }}
                                        onChange={(date) => {
                                          if (date && date.isValid()) {
                                            field.onChange(date); // Set a valid Dayjs date
                                            setValue(`water.${idx}.date`, date);
                                          } else {
                                            field.onChange(null); // Clear the field if date is invalid
                                          }
                                        }}
                                        slotProps={{
                                          textField: { focused: true },
                                        }}
                                        value={field.value || null}
                                      />
                                    </Box>
                                  )}
                                />
                              </DemoContainer>
                            </Box>
                          </LocalizationProvider>
                        </Grid>
                      )}

                      <Grid
                        xs
                        item
                        sx={{
                          width: 'fit-content',
                          minWidth: 135,
                        }}
                      >
                        <Box
                          display={'flex'}
                          gap={2}
                          alignItems={'center'}
                          position={'relative'}
                        >
                          <TextField
                            label="Water Temperature *"
                            type="text"
                            className={`form-input ${idx === 0 && 'selected'}`}
                            // disabled={idx === 0 ? true : false}

                            sx={{ width: '100%' }}
                            {...register(`water.${idx}.waterTemp`, {
                              pattern: validationPattern.numbersWithDot,
                              maxLength: 10,
                            })}
                            focused
                          />

                          <Typography
                            variant="body2"
                            color="#555555AC"
                            sx={{
                              color: `${idx === 0 ? 'black' : 'grey'}`,
                              fontWeight: 'medium',
                              position: 'absolute',
                              right: 6,
                              top: '50%',
                              transform: 'translate(-6px, -50%)',
                              backgroundColor: '#fff',
                              height: 30,
                              display: 'grid',
                              placeItems: 'center',
                              zIndex: 1,
                              pl: 1,
                            }}
                          >
                            °C
                          </Typography>
                        </Box>

                        {errors &&
                          errors.water &&
                          errors.water[idx] &&
                          errors.water[idx].waterTemp &&
                          errors.water[idx].waterTemp.type === 'pattern' && (
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
                          errors.water &&
                          errors.water[idx] &&
                          errors.water[idx].waterTemp &&
                          errors.water[idx].waterTemp.type === 'maxLength' && (
                            <Typography
                              variant="body2"
                              color="red"
                              fontSize={13}
                              mt={0.5}
                            >
                              {validationMessage.numberMaxLength}
                            </Typography>
                          )}
                      </Grid>
                      <Grid
                        xs
                        item
                        sx={{
                          width: 'fit-content',
                          minWidth: 135,
                        }}
                      >
                        <Box
                          display={'flex'}
                          gap={2}
                          alignItems={'center'}
                          position={'relative'}
                        >
                          <TextField
                            focused
                            label="Dissolved Oxygen(DO) *"
                            type="text"
                            className={`form-input ${idx === 0 && 'selected'}`}
                            // disabled={idx === 0 ? true : false}
                            {...register(`water.${idx}.DO`, {
                              pattern: validationPattern.numbersWithDot,
                              maxLength: 10,
                            })}
                            sx={{ width: '100%' }}
                          />

                          <Typography
                            variant="body2"
                            color="#555555AC"
                            sx={{
                              position: 'absolute',
                              color: `${idx === 0 ? 'black' : 'grey'}`,
                              right: 6,
                              top: '50%',
                              transform: 'translate(-6px, -50%)',
                              backgroundColor: '#fff',
                              height: 30,
                              display: 'grid',
                              placeItems: 'center',
                              zIndex: 1,
                              pl: 1,
                            }}
                          >
                            mg/L
                          </Typography>
                        </Box>

                        {errors &&
                          errors.water &&
                          errors.water[idx] &&
                          errors.water[idx].DO &&
                          errors.water[idx].DO.type === 'pattern' && (
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
                          errors.water &&
                          errors.water[idx] &&
                          errors.water[idx].DO &&
                          errors.water[idx].DO.type === 'maxLength' && (
                            <Typography
                              variant="body2"
                              color="red"
                              fontSize={13}
                              mt={0.5}
                            >
                              {validationMessage.numberMaxLength}
                            </Typography>
                          )}
                      </Grid>
                      <Grid
                        xs
                        item
                        sx={{
                          width: 'fit-content',
                          minWidth: 135,
                        }}
                      >
                        <Box
                          display={'flex'}
                          gap={2}
                          alignItems={'center'}
                          position={'relative'}
                        >
                          <TextField
                            focused
                            label="Total Suspended Solids (TSS) *"
                            type="text"
                            className={`form-input ${idx === 0 && 'selected'}`}
                            // disabled={idx === 0 ? true : false}
                            sx={{ width: '100%' }}
                            {...register(`water.${idx}.TSS`, {
                              pattern: validationPattern.numbersWithDot,
                              maxLength: 10,
                            })}
                          />

                          <Typography
                            variant="body2"
                            color="#555555AC"
                            sx={{
                              color: `${idx === 0 ? 'black' : 'grey'}`,
                              position: 'absolute',
                              right: 6,
                              top: '50%',
                              transform: 'translate(-6px, -50%)',
                              backgroundColor: '#fff',
                              height: 30,
                              display: 'grid',
                              placeItems: 'center',
                              zIndex: 1,
                              pl: 1,
                            }}
                          >
                            mg/L
                          </Typography>
                        </Box>

                        {errors &&
                          errors.water &&
                          errors.water[idx] &&
                          errors.water[idx].TSS &&
                          errors.water[idx].TSS.type === 'pattern' && (
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
                          errors.water &&
                          errors.water[idx] &&
                          errors.water[idx].TSS &&
                          errors.water[idx].TSS.type === 'maxLength' && (
                            <Typography
                              variant="body2"
                              color="red"
                              fontSize={13}
                              mt={0.5}
                            >
                              {validationMessage.numberMaxLength}
                            </Typography>
                          )}
                      </Grid>

                      <Grid
                        xs
                        item
                        sx={{
                          width: 'fit-content',
                          minWidth: 135,
                        }}
                      >
                        <Box
                          display={'flex'}
                          gap={2}
                          alignItems={'center'}
                          position={'relative'}
                        >
                          <TextField
                            focused
                            label="Ammonia (NH₄) *"
                            type="text"
                            className={`form-input ${idx === 0 && 'selected'}`}
                            // disabled={idx === 0 ? true : false}
                            sx={{ width: '100%' }}
                            {...register(`water.${idx}.NH4`, {
                              pattern: validationPattern.numbersWithDot,
                              maxLength: 10,
                            })}
                          />

                          <Typography
                            variant="body2"
                            color="#555555AC"
                            sx={{
                              color: `${idx === 0 ? 'black' : 'grey'}`,
                              position: 'absolute',
                              right: 6,
                              top: '50%',
                              transform: 'translate(-6px, -50%)',
                              backgroundColor: '#fff',
                              height: 30,
                              display: 'grid',
                              placeItems: 'center',
                              zIndex: 1,
                              pl: 1,
                            }}
                          >
                            mg/L
                          </Typography>
                        </Box>
                        {errors &&
                          errors.water &&
                          errors.water[idx] &&
                          errors.water[idx].NH4 &&
                          errors.water[idx].NH4.type === 'pattern' && (
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
                          errors.water &&
                          errors.water[idx] &&
                          errors.water[idx].NH4 &&
                          errors.water[idx].NH4.type === 'maxLength' && (
                            <Typography
                              variant="body2"
                              color="red"
                              fontSize={13}
                              mt={0.5}
                            >
                              {validationMessage.numberMaxLength}
                            </Typography>
                          )}
                      </Grid>
                      <Grid
                        xs
                        item
                        sx={{
                          width: 'fit-content',
                          minWidth: 135,
                        }}
                      >
                        <Box
                          display={'flex'}
                          gap={2}
                          alignItems={'center'}
                          position={'relative'}
                        >
                          <TextField
                            focused
                            label="Nitrate (NO₃⁻) *"
                            type="text"
                            className={`form-input ${idx === 0 && 'selected'}`}
                            // disabled={idx === 0 ? true : false}
                            sx={{ width: '100%' }}
                            {...register(`water.${idx}.NO3`, {
                              pattern: validationPattern.numbersWithDot,
                              maxLength: 10,
                            })}
                          />

                          <Typography
                            variant="body2"
                            color="#555555AC"
                            sx={{
                              color: `${idx === 0 ? 'black' : 'grey'}`,
                              position: 'absolute',
                              right: 6,
                              top: '50%',
                              transform: 'translate(-6px, -50%)',
                              backgroundColor: '#fff',
                              height: 30,
                              display: 'grid',
                              placeItems: 'center',
                              zIndex: 1,
                              pl: 1,
                            }}
                          >
                            mg/L
                          </Typography>
                        </Box>

                        {errors &&
                          errors.water &&
                          errors.water[idx] &&
                          errors.water[idx].NO3 &&
                          errors.water[idx].NO3.type === 'pattern' && (
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
                          errors.water &&
                          errors.water[idx] &&
                          errors.water[idx].NO3 &&
                          errors.water[idx].NO3.type === 'maxLength' && (
                            <Typography
                              variant="body2"
                              color="red"
                              fontSize={13}
                              mt={0.5}
                            >
                              {validationMessage.numberMaxLength}
                            </Typography>
                          )}
                      </Grid>
                      <Grid
                        xs
                        item
                        sx={{
                          width: 'fit-content',
                          minWidth: 135,
                        }}
                      >
                        <Box
                          display={'flex'}
                          gap={2}
                          alignItems={'center'}
                          position={'relative'}
                        >
                          <TextField
                            focused
                            label="Nitrite (NO₂⁻) *"
                            type="text"
                            className={`form-input ${idx === 0 && 'selected'}`}
                            // disabled={idx === 0 ? true : false}
                            sx={{ width: '100%' }}
                            {...register(`water.${idx}.NO2`, {
                              pattern: validationPattern.numbersWithDot,
                              maxLength: 10,
                            })}
                          />

                          <Typography
                            variant="body2"
                            color="#555555AC"
                            sx={{
                              color: `${idx === 0 ? 'black' : 'grey'}`,
                              position: 'absolute',
                              right: 6,
                              top: '50%',
                              transform: 'translate(-6px, -50%)',
                              backgroundColor: '#fff',
                              height: 30,
                              display: 'grid',
                              placeItems: 'center',
                              zIndex: 1,
                              pl: 1,
                            }}
                          >
                            mg/L
                          </Typography>
                        </Box>

                        {errors &&
                          errors.water &&
                          errors.water[idx] &&
                          errors.water[idx].NO2 &&
                          errors.water[idx].NO2.type === 'pattern' && (
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
                          errors.water &&
                          errors.water[idx] &&
                          errors.water[idx].NO2 &&
                          errors.water[idx].NO2.type === 'maxLength' && (
                            <Typography
                              variant="body2"
                              color="red"
                              fontSize={13}
                              mt={0.5}
                            >
                              {validationMessage.numberMaxLength}
                            </Typography>
                          )}
                      </Grid>
                      <Grid
                        xs
                        item
                        sx={{
                          width: 'fit-content',
                          minWidth: 135,
                        }}
                      >
                        <Box
                          display={'flex'}
                          gap={2}
                          alignItems={'center'}
                          position={'relative'}
                        >
                          <TextField
                            focused
                            label="pH *"
                            type="text"
                            className={`form-input ${idx === 0 && 'selected'}`}
                            // disabled={idx === 0 ? true : false}
                            sx={{ width: '100%' }}
                            {...register(`water.${idx}.ph`, {
                              pattern: validationPattern.numbersWithDot,
                              maxLength: 10,
                            })}
                          />
                        </Box>

                        {errors &&
                          errors.water &&
                          errors.water[idx] &&
                          errors.water[idx].ph &&
                          errors.water[idx].ph.type === 'pattern' && (
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
                          errors.water &&
                          errors.water[idx] &&
                          errors.water[idx].ph &&
                          errors.water[idx].ph.type === 'maxLength' && (
                            <Typography
                              variant="body2"
                              color="red"
                              fontSize={13}
                              mt={0.5}
                            >
                              {validationMessage.numberMaxLength}
                            </Typography>
                          )}
                      </Grid>
                      <Grid
                        xs
                        item
                        sx={{
                          width: 'fit-content',
                          minWidth: 135,
                        }}
                      >
                        <Box
                          display={'flex'}
                          gap={2}
                          alignItems={'center'}
                          position={'relative'}
                        >
                          <TextField
                            focused
                            label="Visibility *"
                            type="text"
                            className={`form-input ${idx === 0 && 'selected'}`}
                            // disabled={idx === 0 ? true : false}
                            sx={{ width: '100%' }}
                            {...register(`water.${idx}.visibility`, {
                              pattern: validationPattern.numbersWithDot,
                              maxLength: 10,
                            })}
                          />

                          <Typography
                            variant="body2"
                            color="#555555AC"
                            sx={{
                              color: `${idx === 0 ? 'black' : 'grey'}`,
                              position: 'absolute',
                              right: 6,
                              top: '50%',
                              transform: 'translate(-6px, -50%)',
                              backgroundColor: '#fff',
                              height: 30,
                              display: 'grid',
                              placeItems: 'center',
                              zIndex: 1,
                              pl: 1,
                            }}
                          >
                            cm
                          </Typography>
                        </Box>

                        {errors &&
                          errors.water &&
                          errors.water[idx] &&
                          errors.water[idx].visibility &&
                          errors.water[idx].visibility.type === 'pattern' && (
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
                          errors.water &&
                          errors.water[idx] &&
                          errors.water[idx].visibility &&
                          errors.water[idx].visibility.type === 'maxLength' && (
                            <Typography
                              variant="body2"
                              color="red"
                              fontSize={13}
                              mt={0.5}
                            >
                              {validationMessage.numberMaxLength}
                            </Typography>
                          )}
                      </Grid>
                    </Grid>
                  </Stack>

                  <Box
                    display={'flex'}
                    alignItems={'center'}
                    justifyContent={'center'}
                    position={'relative'}
                    top="90%"
                  >
                    <Box
                      display={'flex'}
                      justifyContent={'center'}
                      alignItems={'center'}
                      width={50}
                      sx={{
                        visibility: idx === 0 ? 'hidden' : '',
                        cursor: 'pointer',
                        width: {
                          // lg: 150,
                          xs: 'auto',
                        },
                      }}
                      onClick={() => remove(idx)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="1.4em"
                        height="1.4em"
                        viewBox="0 0 24 24"
                      >
                        <g fill="none">
                          <path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z" />
                          <path
                            fill="#ff0000"
                            d="M14.28 2a2 2 0 0 1 1.897 1.368L16.72 5H20a1 1 0 1 1 0 2l-.003.071l-.867 12.143A3 3 0 0 1 16.138 22H7.862a3 3 0 0 1-2.992-2.786L4.003 7.07L4 7a1 1 0 0 1 0-2h3.28l.543-1.632A2 2 0 0 1 9.721 2zm3.717 5H6.003l.862 12.071a1 1 0 0 0 .997.929h8.276a1 1 0 0 0 .997-.929zM10 10a1 1 0 0 1 .993.883L11 11v5a1 1 0 0 1-1.993.117L9 16v-5a1 1 0 0 1 1-1m4 0a1 1 0 0 1 1 1v5a1 1 0 1 1-2 0v-5a1 1 0 0 1 1-1m.28-6H9.72l-.333 1h5.226z"
                          />
                        </g>
                      </svg>
                    </Box>
                  </Box>
                </Box>

                {idx === 0 && fields.length > 1 && (
                  <>
                    <Divider
                      orientation="vertical"
                      sx={{
                        height: '100%',
                        borderBottom: '2px solid #E6E7E9 !important',
                        borderRight: 'none !important',
                        width: '100%',
                        marginLeft: '12px',
                        paddingBlock: '10px',
                        marginBottom: '20px',
                      }}
                    />
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 'bold',
                        marginLeft: '20px',
                        marginBottom: '10px',
                      }}
                    >
                      Sampling
                    </Typography>
                  </>
                )}
              </Box>
            );
          })}

          <Box
            display="flex"
            justifyContent="flex-end"
            alignItems={'flex-end'}
            gap="10px"
            padding={3}
            margin={'40px'}
          >
            <Button
              className=""
              type="button"
              variant="contained"
              onClick={handleClick}
              sx={{
                background: '#06A19B',
                fontWeight: 'bold',
                padding: '8px 20px',
                width: {
                  xs: '50%',
                  lg: 'fit-content',
                },
                textTransform: 'capitalize',
                borderRadius: '12px',

                marginBlock: '10px',
              }}
            >
              Add Row
            </Button>
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={openAnchor}
              onClose={handleCloseAnchor}
              MenuListProps={{
                'aria-labelledby': 'basic-button',
              }}
            >
              {waterQualityFields.map((field, i) => {
                return (
                  <MenuItem onClick={() => handleCloseAnchor(field)} key={i}>
                    {field}
                  </MenuItem>
                );
              })}
            </Menu>
            <Button
              className=""
              type="submit"
              variant="contained"
              disabled={
                watchedFields.length > 1 &&
                watchedFields[1].waterTemp &&
                watchedFields[1].DO &&
                watchedFields[1].TSS &&
                watchedFields[1].NH4 &&
                watchedFields[1].NO3 &&
                watchedFields[1].NO2 &&
                watchedFields[1].ph &&
                watchedFields[1].visibility &&
                watchedFields[1].date
                  ? false
                  : true
              }
              sx={{
                background: '#06A19B',
                fontWeight: 'bold',
                padding: '8px 20px',
                width: {
                  xs: '50%',
                  lg: 'fit-content',
                },
                textTransform: 'capitalize',
                borderRadius: '12px',

                marginBlock: '10px',
              }}
            >
              Save
            </Button>
          </Box>
        </form>
      </Stack>
    </Modal>
  );
};

export default WaterQualityParameter;
