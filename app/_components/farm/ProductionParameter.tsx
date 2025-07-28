import { getLocalItem, setLocalItem, Years } from '@/app/_lib/utils';
import { waterQualityPredictedHead } from '@/app/_lib/utils/tableHeadData';
import * as validationPattern from '@/app/_lib/utils/validationPatterns/index';
import * as validationMessage from '@/app/_lib/utils/validationsMessage/index';
import {
  Farm,
  GrowthModel,
  ProductionParaMeterType,
} from '@/app/_typeModels/Farm';
import { Box, Button, Grid, Typography } from '@mui/material';
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
type WaterQualityKey =
  | 'Water Temperature °C'
  | 'Dissolved Oxygen (DO) mg/L'
  | 'Total Suspended solids (TSS)'
  | 'Ammonia (NH₄) mg/L'
  | 'Nitrate (NO₃) mg/L'
  | 'Nitrite (NO₂) mg/L'
  | 'pH'
  | 'Visibility cm';

export interface predictedValuesData {
  predictedValues: Record<WaterQualityKey, string | number>;
  idealRange: Record<WaterQualityKey, string | number>;
}
interface Props {
  setActiveStep: (val: number) => void;
  productionParaMeter?: ProductionParaMeterType[];
  editFarm?: Farm;
  growthModels: GrowthModel[];
}
interface FormData {
  predictedValues: Record<string, Record<number, string>>;
  idealRange: Record<string, { Min: string; Max: string }>;
  applyToAll: Record<string, boolean>;
  specie: string;
}
export default function ProductionParaMeter({
  setActiveStep,
  productionParaMeter,
  editFarm,
}: Props) {
  const isEditFarm = getCookie('isEditFarm');

  const [formProductionParameters, setFormProductionParameters] =
    useState<any>();

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      predictedValues: {},
    },
  });
  const allWatchObject = {
    predictedValues: watch('predictedValues'),
    idealRange: watch('idealRange'),
  };
  const onSubmit: SubmitHandler<FormData> = (data) => {
    let payload;
    if (
      isEditFarm === 'true' &&
      productionParaMeter &&
      productionParaMeter[0]?.YearBasedPredication
    ) {
      payload = {
        predictedValues: {
          'Water Temperature °C': data.predictedValues['Water Temperature °C'],
          'Dissolved Oxygen (DO) mg/L':
            data.predictedValues['Dissolved Oxygen (DO) mg/L'],
          'Total Suspended solids (TSS)':
            data.predictedValues['Total Suspended solids (TSS)'],
          'Ammonia (NH₄) mg/L': data.predictedValues['Ammonia (NH₄) mg/L'],
          'Nitrate (NO₃) mg/L': data.predictedValues['Nitrate (NO₃) mg/L'],
          'Nitrite (NO₂) mg/L': data.predictedValues['Nitrite (NO₂) mg/L'],
          pH: data.predictedValues['pH'],
          'Visibility cm': data.predictedValues['Visibility cm'],
        },

        yearBasedPredicationId:
          editFarm?.WaterQualityPredictedParameters[0]?.YearBasedPredication[0]
            .id,
        idealRange: {
          'Water Temperature °C': data.idealRange['Water Temperature °C'],
          'Dissolved Oxygen (DO) mg/L':
            data.idealRange['Dissolved Oxygen (DO) mg/L'],
          'Total Suspended solids (TSS)':
            data.idealRange['Total Suspended solids (TSS)'],
          'Ammonia (NH₄) mg/L': data.idealRange['Ammonia (NH₄) mg/L'],
          'Nitrate (NO₃) mg/L': data.idealRange['Nitrate (NO₃) mg/L'],
          'Nitrite (NO₂) mg/L': data.idealRange['Nitrite (NO₂) mg/L'],
          ph: data.idealRange['pH'],
          visibility: data.idealRange['Visibility cm'],
        },
      };
    } else {
      payload = {
        predictedValues: {
          'Water Temperature °C': data.predictedValues['Water Temperature °C'],
          'Dissolved Oxygen (DO) mg/L':
            data.predictedValues['Dissolved Oxygen (DO) mg/L'],
          'Total Suspended solids (TSS)':
            data.predictedValues['Total Suspended solids (TSS)'],
          'Ammonia (NH₄) mg/L': data.predictedValues['Ammonia (NH₄) mg/L'],
          'Nitrate (NO₃) mg/L': data.predictedValues['Nitrate (NO₃) mg/L'],
          'Nitrite (NO₂) mg/L': data.predictedValues['Nitrite (NO₂) mg/L'],
          pH: data.predictedValues['pH'],
          'Visibility cm': data.predictedValues['Visibility cm'],
        },
        yearBasedPredicationId:
          editFarm?.WaterQualityPredictedParameters[0]?.id,

        idealRange: {
          'Water Temperature °C': data.idealRange['Water Temperature °C'],
          'Dissolved Oxygen (DO) mg/L':
            data.idealRange['Dissolved Oxygen (DO) mg/L'],
          'Total Suspended solids (TSS)':
            data.idealRange['Total Suspended solids (TSS)'],
          'Ammonia (NH₄) mg/L': data.idealRange['Ammonia (NH₄) mg/L'],
          'Nitrate (NO₃) mg/L': data.idealRange['Nitrate (NO₃) mg/L'],
          'Nitrite (NO₂) mg/L': data.idealRange['Nitrite (NO₂) mg/L'],
          ph: data.idealRange['pH'],
          'Visibility cm': data.idealRange['Visibility cm'],
        },
      };
    }

    setLocalItem('productionParametes', payload);
    setActiveStep(2);
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const formData = getLocalItem('productionParametes');
      setFormProductionParameters(formData);
    }
  }, []);

  useEffect(() => {
    if (
      isEditFarm &&
      productionParaMeter &&
      productionParaMeter[0]?.YearBasedPredication
    ) {
      const prediction = productionParaMeter[0].YearBasedPredication[0];

      // Creating the idealRange object for Min and Max
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
        'Water Temperature °C': { ...prediction.waterTemp },
        'Dissolved Oxygen (DO) mg/L': { ...prediction.DO },
        'Total Suspended solids (TSS)': { ...prediction.TSS },
        'Ammonia (NH₄) mg/L': { ...prediction.NH4 },
        'Nitrate (NO₃) mg/L': { ...prediction.NO3 },
        'Nitrite (NO₂) mg/L': { ...prediction.NO2 },
        pH: { ...prediction.ph },
        'Visibility cm': { ...prediction.visibility },
      };

      setValue('predictedValues', predictedValues);
    }
  }, [productionParaMeter, isEditFarm, setValue]);

  useEffect(() => {
    if (formProductionParameters) {
      setValue('predictedValues', formProductionParameters.predictedValues);
      setValue('idealRange', formProductionParameters.idealRange);
    }
  }, [formProductionParameters]);

  return (
    <Box>
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
                Water Quality Parameters (Predicted)
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
                        {Years.map((year, index) => (
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
                                    maxWidth: '100px',
                                    padding: '4px 2px',
                                    border: 'none',
                                    textAlign: 'center',
                                    fontSize: '14px',
                                    fontWeight: '500',
                                    color: '#555555',
                                    position: 'sticky',
                                  }}
                                  onInput={(e) => {
                                    const value = e.currentTarget.value;
                                    const regex = /^-?\d*\.?\d*$/;
                                    if (!regex.test(value)) {
                                      e.currentTarget.value = field.value || '';
                                    } else {
                                      field.onChange(value);
                                    }
                                  }}
                                />
                              )}
                            />
                            {errors?.predictedValues?.[head]?.[year as any] && (
                              <Typography
                                variant="body2"
                                color="error"
                                fontSize={13}
                                mt={0.5}
                                style={{
                                  width: '100px',
                                  textWrap: 'wrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                }}
                              >
                                {errors?.predictedValues?.[head as string]?.[
                                  year as any
                                ]?.type === 'pattern'
                                  ? validationMessage.NegativeNumberWithDot
                                  : errors?.predictedValues?.[head as string]?.[
                                        year as any
                                      ]?.type === 'maxLength'
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
                    {waterQualityPredictedHead.map((head: string, i) => (
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
                                      e.currentTarget.value = field.value || '';
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
                                  width: '100px',
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
            type="button"
            variant="contained"
            onClick={() => {
              setActiveStep(0);
              setLocalItem('productionParametes', allWatchObject);
            }}
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
            Previous
          </Button>
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
            Next
          </Button>
        </Box>
      </form>
    </Box>
  );
}
