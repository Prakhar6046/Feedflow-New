import { getLocalItem, setLocalItem, Years } from '@/app/_lib/utils';
import { waterQualityPredictedHead } from '@/app/_lib/utils/tableHeadData';
import * as validationPattern from '@/app/_lib/utils/validationPatterns/index';
import * as validationMessage from '@/app/_lib/utils/validationsMessage/index';
import { Farm, ProductionParaMeterType } from '@/app/_typeModels/Farm';
import {
  Box,
  Button,
  Grid,
  IconButton,
  Modal,
  Stack,
  Typography,
} from '@mui/material';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { getCookie } from 'cookies-next';
import { useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { CloseIcon } from '../theme/overrides/CustomIcons';

interface Props {
  productionParaMeter?: ProductionParaMeterType[];
  editFarm?: Farm;
  setOpen: (open: boolean) => void;
  open: boolean;
  selectedUnitName: string;
  setSelectedUnitName: (val: string) => void;
}
interface FormData {
  predictedValues: Record<string, Record<number, string>>;
  idealRange: Record<string, { Min: string; Max: string }>;
  applyToAll: Record<string, boolean>;
  modelId: number;
}
const style = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  padding: '5px 25px',
};

const ProductionUnitParametersPredicated: React.FC<Props> = ({
  setOpen,
  open,
  editFarm,
  selectedUnitName,
  setSelectedUnitName,
}) => {
  const isEditFarm = getCookie('isEditFarm');

  const [formProductionParameters, setFormProductionParameters] =
    useState<any>();

  const {
    control,
    handleSubmit,

    setValue,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      predictedValues: {},
    },
  });

  const onSubmit: SubmitHandler<FormData> = (data) => {
    const productionParamtertsUnitsArray = getLocalItem(
      'productionParamtertsUnitsArray',
    );

    const updatedData = productionParamtertsUnitsArray?.filter(
      (data: any) => data.unitName !== selectedUnitName,
    );

    const payload = {
      unitName: selectedUnitName,
      predictedValues: {
        waterTemp: data?.predictedValues['Water Temperature °C'],
        DO: data?.predictedValues['Dissolved Oxygen (DO) mg/L'],
        TSS: data?.predictedValues['Total Suspended solids (TSS)'],
        NH4: data?.predictedValues['Ammonia (NH₄) mg/L'],
        NO3: data?.predictedValues['Nitrate (NO₃) mg/L'],
        NO2: data?.predictedValues['Nitrite (NO₂) mg/L'],
        ph: data?.predictedValues['pH'],
        visibility: data?.predictedValues['Visibility cm'],
      },
      idealRange: {
        waterTemp: data?.idealRange['Water Temperature °C'],
        DO: data?.idealRange['Dissolved Oxygen (DO) mg/L'],
        TSS: data?.idealRange['Total Suspended solids (TSS)'],
        NH4: data?.idealRange['Ammonia (NH₄) mg/L'],
        NO3: data?.idealRange['Nitrate (NO₃) mg/L'],
        NO2: data?.idealRange['Nitrite (NO₂) mg/L'],
        ph: data?.idealRange['pH'],
        visibility: data?.idealRange['Visibility cm'],
      },
    };

    updatedData.push(payload);
    setLocalItem('productionParamtertsUnitsArray', updatedData);
    setOpen(false);
    setSelectedUnitName('');
    reset();
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && selectedUnitName) {
      const formData = getLocalItem('productionParametes');
      if (formData) {
        setFormProductionParameters(formData);
        setValue('predictedValues', formProductionParameters?.predictedValues);
        setValue('idealRange', formProductionParameters?.idealRange);
      }
    }
  }, [selectedUnitName]);
  useEffect(() => {
    const productionParamtertsUnitsArray = getLocalItem(
      'productionParamtertsUnitsArray',
    );

    const updatedData = productionParamtertsUnitsArray?.find(
      (data: any) => data.unitName === selectedUnitName,
    );
    if (updatedData) {
      const predictedValues = {
        'Water Temperature °C': updatedData?.predictedValues?.waterTemp,
        'Dissolved Oxygen (DO) mg/L': updatedData?.predictedValues?.DO,
        'Total Suspended solids (TSS)': updatedData?.predictedValues?.TSS,
        'Ammonia (NH₄) mg/L': updatedData?.predictedValues?.NH4,
        'Nitrate (NO₃) mg/L': updatedData?.predictedValues?.NO3,
        'Nitrite (NO₂) mg/L': updatedData?.predictedValues?.NO2,
        pH: updatedData?.predictedValues?.ph,
        'Visibility cm': updatedData?.predictedValues?.visibility,
      };
      const idealRange = {
        'Water Temperature °C': updatedData?.predictedValues?.waterTemp,
        'Dissolved Oxygen (DO) mg/L': updatedData?.predictedValues?.DO,
        'Total Suspended solids (TSS)': updatedData?.predictedValues?.TSS,
        'Ammonia (NH₄) mg/L': updatedData?.predictedValues?.NH4,
        'Nitrate (NO₃) mg/L': updatedData?.predictedValues?.NO3,
        'Nitrite (NO₂) mg/L': updatedData?.predictedValues?.NO2,
        pH: updatedData?.predictedValues?.ph,
        'Visibility cm': updatedData?.predictedValues?.visibility,
      };
      setValue('predictedValues', predictedValues);
      setValue('idealRange', idealRange);
    }

    // else {
    //   setValue("predictedValues", formProductionParameters?.predictedValues);
    //   setValue("idealRange", formProductionParameters?.idealRange);
    // }
  }, [formProductionParameters, selectedUnitName, setValue]);

  useEffect(() => {
    const productionParamtertsUnitsArray = getLocalItem(
      'productionParamtertsUnitsArray',
    );
    const currentUnit = productionParamtertsUnitsArray?.find(
      (val: any) => val.unitName === selectedUnitName,
    );
    if (
      isEditFarm &&
      editFarm &&
      productionParamtertsUnitsArray &&
      !currentUnit
    ) {
      editFarm?.productionUnits.map((unit: any) => {
        if (
          unit.name === selectedUnitName &&
          unit.id ===
            unit.YearBasedPredicationProductionUnit[0]?.productionUnitId
        ) {
          // Creating the idealRange object for Min and Max
          const prediction = unit.YearBasedPredicationProductionUnit[0];
          const idealRange = {
            'Water Temperature °C': {
              Min: prediction?.idealRange?.waterTemp?.Min || '',
              Max: prediction?.idealRange?.waterTemp?.Max || '',
            },
            'Dissolved Oxygen (DO) mg/L': {
              Min: prediction?.idealRange?.DO?.Min || '',
              Max: prediction?.idealRange?.DO?.Max || '',
            },
            'Total Suspended solids (TSS)': {
              Min: prediction?.idealRange?.TSS?.Min || '',
              Max: prediction?.idealRange?.TSS?.Max || '',
            },
            'Ammonia (NH₄) mg/L': {
              Min: prediction?.idealRange?.NH4?.Min || '',
              Max: prediction?.idealRange?.NH4?.Max || '',
            },
            'Nitrate (NO₃) mg/L': {
              Min: prediction?.idealRange?.NO3?.Min || '',
              Max: prediction?.idealRange?.NO3?.Max || '',
            },
            'Nitrite (NO₂) mg/L': {
              Min: prediction?.idealRange?.NO2?.Min || '',
              Max: prediction?.idealRange?.NO2?.Max || '',
            },
            pH: {
              Min: prediction?.idealRange?.ph?.Min || '',
              Max: prediction?.idealRange?.ph?.Max || '',
            },
            'Visibility cm': {
              Min: prediction?.idealRange?.visibility?.Min || '',
              Max: prediction?.idealRange?.visibility?.Max || '',
            },
          };
          // Set the values in the form
          setValue('idealRange', idealRange);

          const predictedValues = {
            'Water Temperature °C': { ...prediction?.waterTemp },
            'Dissolved Oxygen (DO) mg/L': { ...prediction?.DO },
            'Total Suspended solids (TSS)': { ...prediction?.TSS },
            'Ammonia (NH₄) mg/L': { ...prediction?.NH4 },
            'Nitrate (NO₃) mg/L': { ...prediction?.NO3 },
            'Nitrite (NO₂) mg/L': { ...prediction?.NO2 },
            pH: { ...prediction?.ph },
            'Visibility cm': { ...prediction?.visibility },
          };
          setValue('predictedValues', predictedValues);
        }
      });
    } else if (productionParamtertsUnitsArray?.length && currentUnit) {
      const idealRange = {
        'Water Temperature °C': {
          Min: currentUnit?.idealRange?.waterTemp?.Min || '',
          Max: currentUnit?.idealRange?.waterTemp?.Max || '',
        },
        'Dissolved Oxygen (DO) mg/L': {
          Min: currentUnit?.idealRange?.DO?.Min || '',
          Max: currentUnit?.idealRange?.DO?.Max || '',
        },
        'Total Suspended solids (TSS)': {
          Min: currentUnit?.idealRange?.TSS?.Min || '',
          Max: currentUnit?.idealRange?.TSS?.Max || '',
        },
        'Ammonia (NH₄) mg/L': {
          Min: currentUnit?.idealRange?.NH4?.Min || '',
          Max: currentUnit?.idealRange?.NH4?.Max || '',
        },
        'Nitrate (NO₃) mg/L': {
          Min: currentUnit?.idealRange?.NO3?.Min || '',
          Max: currentUnit?.idealRange?.NO3?.Max || '',
        },
        'Nitrite (NO₂) mg/L': {
          Min: currentUnit?.idealRange?.NO2?.Min || '',
          Max: currentUnit?.idealRange?.NO2?.Max || '',
        },
        pH: {
          Min: currentUnit?.idealRange?.ph?.Min || '',
          Max: currentUnit?.idealRange?.ph?.Max || '',
        },
        'Visibility cm': {
          Min: currentUnit?.idealRange?.visibility?.Min || '',
          Max: currentUnit?.idealRange?.visibility?.Max || '',
        },
      };
      // Set the values in the form
      setValue('idealRange', idealRange);
      const predictedValues = {
        'Water Temperature °C': { ...currentUnit?.predictedValues?.waterTemp },
        'Dissolved Oxygen (DO) mg/L': { ...currentUnit?.predictedValues?.DO },
        'Total Suspended solids (TSS)': {
          ...currentUnit?.predictedValues?.TSS,
        },
        'Ammonia (NH₄) mg/L': { ...currentUnit?.predictedValues?.NH4 },
        'Nitrate (NO₃) mg/L': { ...currentUnit?.predictedValues?.NO3 },
        'Nitrite (NO₂) mg/L': { ...currentUnit?.predictedValues?.NO2 },
        pH: { ...currentUnit?.predictedValues?.ph },
        'Visibility cm': { ...currentUnit?.predictedValues?.visibility },
      };
      setValue('predictedValues', predictedValues);
    }
  }, [isEditFarm, editFarm, setValue, selectedUnitName]);

  const handleClose = () => {
    setOpen(false);
    reset();
    setSelectedUnitName('');
  };
  return (
    <Modal
      open={open}
      // onClose={handleClose}
      aria-labelledby="parent-modal-title"
      aria-describedby="parent-modal-description"
      className="modal-positioning"
      BackdropProps={{
        onClick: (event) => event.stopPropagation(), // Prevents closing on backdrop click
      }}
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
        <form onSubmit={handleSubmit(onSubmit)}>
          <Paper
            sx={{
              width: '100%',
              overflow: 'hidden',
              borderRadius: '14px',
              boxShadow: '0px 0px 16px 5px #0000001A',
            }}
          >
            <Grid container spacing={2}>
              <Grid item lg={9} xs={7}>
                <Typography
                  variant="h6"
                  fontWeight={700}
                  sx={{
                    fontSize: {
                      xl: 18,

                      xs: 12,
                    },
                    margin: 2,
                    textWrap: {
                      lg: 'nowrap',
                      xs: 'wrap',
                    },
                  }}
                >
                  Water Quality Paramete (Predicted)
                </Typography>
                <TableContainer>
                  <Table aria-label="sticky table">
                    <TableHead>
                      <TableRow
                        sx={{
                          backgroundColor: '#06a19b',
                          textAlign: 'center',
                          margin: '0',
                          padding: '0',
                        }}
                      >
                        <TableCell align="center"></TableCell>

                        {Years.map((year, i) => {
                          return (
                            <TableCell
                              align="center"
                              sx={{ color: 'white' }}
                              key={i}
                            >
                              {year}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {waterQualityPredictedHead.map((head, i) => (
                        <TableRow
                          key={i}
                          sx={{
                            '&:last-child td, &:last-child th': { border: 0 },
                            backgroundColor: '#F5F6F8',
                            fontWeight: '700',
                            padding: '0px',
                            margin: '0px',
                          }}
                        >
                          <TableCell
                            component="td"
                            scope="row"
                            sx={{
                              margin: '0px',
                              padding: '8px',
                              textWrap: 'nowrap',
                            }}
                          >
                            {head}
                          </TableCell>
                          {Years.map((year: any, index) => (
                            <TableCell
                              key={index}
                              className=" table-border"
                              sx={{
                                borderBottomWidth: 2,
                                borderBottomColor: '#ececec',
                                margin: '0',
                                padding: '5px 1px',
                                textWrap: 'nowrap',
                                textAlign: 'center',
                              }}
                            >
                              <Controller
                                name={`predictedValues.${head}.${year}`}
                                rules={{
                                  pattern:
                                    validationPattern.negativeNumberWithDot,
                                  maxLength: 10,
                                }}
                                control={control}
                                render={({ field }) => (
                                  <input
                                    className="number-items"
                                    {...field}
                                    type="text"
                                    placeholder="0"
                                    style={{
                                      maxWidth: '80px',
                                      padding: '4px 2px',
                                      border: 'none',
                                      textAlign: 'center',
                                      fontSize: '14px',
                                      fontWeight: '500',
                                      color: '#555555',
                                    }}
                                    onInput={(e) => {
                                      const value = e.currentTarget.value;
                                      const regex = /^-?\d*\.?\d*$/;
                                      if (!regex.test(value)) {
                                        e.currentTarget.value =
                                          field.value || '';
                                      } else {
                                        field.onChange(value);
                                      }
                                    }}
                                  />
                                )}
                              />
                              {errors?.predictedValues?.[head]?.[year] && (
                                <Typography
                                  variant="body2"
                                  color="error"
                                  fontSize={13}
                                  mt={0.5}
                                >
                                  {errors?.predictedValues?.[head]?.[year]
                                    .type === 'pattern'
                                    ? validationMessage.NegativeNumberWithDot
                                    : errors?.predictedValues?.[head]?.[year]
                                          .type === 'maxLength'
                                      ? validationMessage.numberMaxLength
                                      : ''}
                                </Typography>
                              )}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
              {/* grid-2 */}
              <Grid item lg={3} xs={3}>
                <Typography
                  variant="h6"
                  fontWeight={700}
                  sx={{
                    fontSize: {
                      xl: 18,

                      xs: 12,
                    },
                    margin: 2,
                    textWrap: {
                      lg: 'nowrap',
                      xs: 'wrap',
                    },
                  }}
                >
                  Ideal Range
                </Typography>
                <TableContainer>
                  <Table aria-label="sticky table">
                    <TableHead>
                      <TableRow
                        sx={{
                          backgroundColor: '#06a19b',
                          textAlign: 'center',
                        }}
                      >
                        <TableCell
                          align="center"
                          sx={{
                            color: 'white',
                            borderRight: '1px solid #F5F6F8',
                          }}
                        >
                          Min
                        </TableCell>

                        <TableCell align="center" sx={{ color: 'white' }}>
                          Max
                        </TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {waterQualityPredictedHead.map((head: any, i) => (
                        <TableRow
                          key={i}
                          sx={{
                            '&:last-child td, &:last-child th': { border: 0 },
                            backgroundColor: '#F5F6F8',
                            fontWeight: '700',
                          }}
                        >
                          {(['Min', 'Max'] as const).map((val, index) => (
                            <TableCell
                              key={index}
                              className="table-border"
                              sx={{
                                borderBottomWidth: 2,
                                borderBottomColor: '#ececec',
                                padding: '5px 1px',
                                textWrap: 'nowrap',
                                textAlign: 'center',
                              }}
                            >
                              <Controller
                                name={`idealRange.${head}.${val}`}
                                control={control}
                                rules={{
                                  pattern:
                                    validationPattern.negativeNumberWithDot,
                                  maxLength: 10,
                                  // validate: (value) => {
                                  //   const min = watch(`idealRange.${head}.Min`);
                                  //   if (
                                  //     val === "Max" &&
                                  //     Number(value) < Number(min)
                                  //   ) {
                                  //     return "Max value cannot be less than Min value";
                                  //   }
                                  //   return true;
                                  // },
                                }}
                                render={({ field }) => (
                                  <input
                                    className="number-items"
                                    type="text"
                                    {...field}
                                    placeholder="0"
                                    style={{
                                      maxWidth: '90px',
                                      padding: '4px 2px',
                                      textWrap: 'nowrap',
                                      border: 'none',
                                      textAlign: 'center',
                                      fontSize: '14px',
                                      fontWeight: '500',
                                      color: '#555555',
                                    }}
                                    onInput={(e) => {
                                      const value = e.currentTarget.value;
                                      const regex = /^-?\d*\.?\d*$/;
                                      if (!regex.test(value)) {
                                        e.currentTarget.value =
                                          field.value || '';
                                      } else {
                                        field.onChange(value);
                                      }
                                    }}
                                  />
                                )}
                              />
                              {errors?.idealRange?.[head]?.[val] && (
                                <Typography
                                  variant="body2"
                                  color="error"
                                  fontSize={13}
                                  mt={0.5}
                                  style={{
                                    width: '175px',
                                    textWrap: 'wrap',
                                  }}
                                >
                                  {errors?.idealRange?.[head]?.[val].type ===
                                  'pattern'
                                    ? validationMessage.NegativeNumberWithDot
                                    : errors?.idealRange?.[head]?.[val].type ===
                                        'maxLength'
                                      ? validationMessage.numberMaxLength
                                      : errors?.idealRange?.[head]?.[val]
                                          ?.message}
                                </Typography>
                              )}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid>
          </Paper>

          <Box
            display={'flex'}
            justifyContent={'flex-end'}
            alignItems={'center'}
            gap={3}
            mt={1}
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

export default ProductionUnitParametersPredicated;
