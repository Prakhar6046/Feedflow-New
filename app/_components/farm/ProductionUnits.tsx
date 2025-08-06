import { getLocalItem, removeLocalItem, setLocalItem } from '@/app/_lib/utils';
import * as validationPattern from '@/app/_lib/utils/validationPatterns/index';
import * as validationMessage from '@/app/_lib/utils/validationsMessage/index';
import {
  CalculateType,
  Farm,
  GrowthModel,
  ProductionParaMeterType,
  ProductionUnitsFormTypes,
  UnitsTypes,
} from '@/app/_typeModels/Farm';
import { FeedProduct } from '@/app/_typeModels/Feed';
import { FeedSupplier } from '@/app/_typeModels/Organization';
import { farmAction } from '@/lib/features/farm/farmSlice';
import { useAppDispatch } from '@/lib/hooks';
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import { deleteCookie, getCookie } from 'cookies-next';
import { NextPage } from 'next';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import {
  Controller,
  SubmitHandler,
  useFieldArray,
  useForm,
} from 'react-hook-form';
import toast from 'react-hot-toast';
import { v4 as uuidv4 } from 'uuid';
import CalculateVolume from '../models/CalculateFarmVolume';
import ProductionUnitFeedProfile from '../models/ProductionUnitFeedProfile';
import ProductionUnitParametersPredicated from '../models/ProductionUnitParametersPredicated';
interface Props {
  productionParaMeter?: ProductionParaMeterType[];
  growthModels?: GrowthModel[];
  editFarm?: Farm;
  setActiveStep: (val: number) => void;
  isEdit?: boolean;
  token: string;
  feedStores: FeedProduct[];
  feedSuppliers: FeedSupplier[];
}

const unitsTypes = [
  { name: 'Rectangular Tank', formula: 'L×W×D' },
  { name: 'Earthen Pond', formula: 'A×D' },
  { name: 'Raceway', formula: 'L×W×D' },
  { name: 'Cage', formula: 'L×W×H' },
  { name: 'Hapa', formula: 'L×W×H' },
  { name: 'Circular Tank', formula: 'π×r2×D' },
  { name: 'D-end Tank', formula: '(2π×r2+(L−r)×W)×D' },
];
const ProductionUnits: NextPage<Props> = ({
  setActiveStep,
  editFarm,
  productionParaMeter,
  feedStores,
  feedSuppliers,
}) => {
  uuidv4();

  const dispatch = useAppDispatch();
  const isEditFarm = getCookie('isEditFarm');
  const userData = getCookie('logged-user');

  const router = useRouter();
  const [selectedUnit, setSelectedUnit] = React.useState<UnitsTypes>();
  const [open, setopen] = useState<boolean>(false);
  const [openUnitParametersModal, setOpenUnitParametersModal] =
    useState<boolean>(false);
  const [openUnitFeedProfileModal, setOpenUnitFeedProfileModal] =
    useState<boolean>(false);
  const [selectedUnitName, setSelectedUnitName] = useState<string>('');
  const [calculatedValue, setCalculatedValue] = useState<CalculateType>();
  const [formProductionUnitsData, setFormProductionUnitsData] = useState<any>();
  const [isApiCallInProgress, setIsApiCallInProgress] =
    useState<boolean>(false);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    trigger,
    clearErrors,
    formState: { errors },
  } = useForm<ProductionUnitsFormTypes>({
    mode: 'onChange',
    defaultValues: {
      productionUnits: [
        {
          name: '',
          type: '',
          capacity: '',
          waterflowRate: '',
          id: Number(uuidv4()),
        },
      ],
      area: '1',
      depth: '1',
      width: '1',
      length: '1',
      height: '1',
      radius: '1',
    },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'productionUnits',
  });
  const productionUnits = watch('productionUnits');
  const AddProdunctionUnit = () => {
    const productionUnits = watch('productionUnits');
    if (productionUnits) {
      const lastProductionUnit = productionUnits[productionUnits.length - 1];
      if (
        lastProductionUnit &&
        lastProductionUnit.name &&
        lastProductionUnit.type &&
        lastProductionUnit.capacity &&
        lastProductionUnit.waterflowRate
      ) {
        append({
          name: '',
          capacity: '',
          type: '',
          waterflowRate: '',
          id: Number(uuidv4()),
        });
      } else {
        toast.dismiss();
        toast.error('Please fill previous field.');
      }
    }
  };

  const handleCalculate = (item: any, index: number) => {
    if (item) {
      setopen(true);
      setValue('length', '');
      setValue('width', '');
      setValue('radius', '');
      setValue('area', '');
      setValue('depth', '');
      setValue('height', '');
      clearErrors(['length', 'width', 'depth', 'radius', 'area', 'height']);
      const getFormula = unitsTypes.find(
        (unit) => unit.name === watch(`productionUnits.${index}.type`),
      );
      setSelectedUnit({
        name: getFormula?.name,
        formula: getFormula?.formula,
        id: productionUnits[index].id.toString(),
        index: index,
      });
      setCalculatedValue({ output: 0, id: 0 });
    }
  };

  const onSubmit: SubmitHandler<ProductionUnitsFormTypes> = async (data) => {
    const farmData = getLocalItem('farmData');
    const farmPredictionValues = getLocalItem('productionParametes');
    const productionParamtertsUnitsArrayLocal = getLocalItem(
      'productionParamtertsUnitsArray',
    );
    const productionUnitsFeedProfilesLocal = getLocalItem(
      'productionUnitsFeedProfiles',
    );
    const feedProfile = getLocalItem('feedProfiles');

    if (farmData && farmPredictionValues && data) {
      // Prevent API call if one is already in progress
      if (isApiCallInProgress) return;
      setIsApiCallInProgress(true);
      try {
        const loggedUserData = JSON.parse(userData ?? '');
        let payload;
        let updatedProductionUnitsFeedProfile;
        let updatedProductionUnits;
        const filteredProductionUnits =
          productionParamtertsUnitsArrayLocal.filter(
            (unit: {
              unitName: string;
              predictedValues: any;
              idealRange: any;
            }) =>
              data.productionUnits.some(
                (param) => param.name === unit.unitName,
              ),
          );

        if (filteredProductionUnits) {
          updatedProductionUnits = filteredProductionUnits.map(
            (filteredUnit: any) => {
              const matchedUnit = editFarm?.productionUnits?.find(
                (unit) => unit.name === filteredUnit.unitName,
              );

              if (matchedUnit) {
                return {
                  ...filteredUnit,
                  id: matchedUnit.YearBasedPredicationProductionUnit[0]?.id,
                };
              }
              return filteredUnit;
            },
          );
        }

        const filteredProductionUnitsFeedProfile =
          productionUnitsFeedProfilesLocal?.filter(
            (unit: { unitName: string; feedProfile: any }) =>
              data.productionUnits.some(
                (param) => param.name === unit.unitName,
              ),
          );

        if (filteredProductionUnitsFeedProfile && editFarm) {
          updatedProductionUnitsFeedProfile =
            filteredProductionUnitsFeedProfile?.map((filteredUnit: any) => {
              const matchedUnit = editFarm?.productionUnits?.find(
                (unit) => unit.name === filteredUnit.unitName,
              );

              if (matchedUnit) {
                return {
                  ...filteredUnit,
                  id: matchedUnit?.FeedProfileProductionUnit?.[0]?.id,
                };
              }
              return filteredUnit;
            });
        }
        const unitFeedProfiles: any = [];
        productionUnits?.map((unit) =>
          unitFeedProfiles.push({ unitName: unit.name, feedProfile }),
        );

        if (
          isEditFarm === 'true' &&
          editFarm?.farmAddress?.id &&
          editFarm?.WaterQualityPredictedParameters[0]?.id
        ) {
          payload = {
            productionParameter: {
              ...farmPredictionValues,
              predictedValues: {
                waterTemp:
                  farmPredictionValues.predictedValues['Water Temperature °C'],
                DO: farmPredictionValues.predictedValues[
                  'Dissolved Oxygen (DO) mg/L'
                ],
                TSS: farmPredictionValues.predictedValues[
                  'Total Suspended solids (TSS)'
                ],
                NH4: farmPredictionValues.predictedValues['Ammonia (NH₄) mg/L'],
                NO3: farmPredictionValues.predictedValues['Nitrate (NO₃) mg/L'],
                NO2: farmPredictionValues.predictedValues['Nitrite (NO₂) mg/L'],
                ph: farmPredictionValues.predictedValues['pH'],
                visibility:
                  farmPredictionValues.predictedValues['Visibility cm'],
              },
              idealRange: {
                waterTemp:
                  farmPredictionValues.idealRange['Water Temperature °C'],
                DO: farmPredictionValues.idealRange[
                  'Dissolved Oxygen (DO) mg/L'
                ],
                TSS: farmPredictionValues.idealRange[
                  'Total Suspended solids (TSS)'
                ],
                NH4: farmPredictionValues.idealRange['Ammonia (NH₄) mg/L'],
                NO3: farmPredictionValues.idealRange['Nitrate (NO₃) mg/L'],
                NO2: farmPredictionValues.idealRange['Nitrite (NO₂) mg/L'],
                ph: farmPredictionValues.idealRange['pH'],
                visibility: farmPredictionValues.idealRange['Visibility cm'],
              },
            },
            productionParamtertsUnitsArray: updatedProductionUnits ?? [],
            FeedProfileUnits: updatedProductionUnitsFeedProfile ?? [],

            farmAddress: {
              addressLine1: farmData.addressLine1,
              addressLine2: farmData.addressLine2,
              city: farmData.city,
              province: farmData.province,
              zipCode: farmData.zipCode,
              country: farmData.country,
              id: editFarm.farmAddress?.id,
            },
            productionUnits: data.productionUnits,
            name: farmData.name,
            farmAltitude: farmData.farmAltitude,
            fishFarmer: farmData.fishFarmer,
            lat: farmData.lat,
            lng: farmData.lng,
            id: editFarm?.id,
            organsationId: loggedUserData.organisationId,
            productions: editFarm.production,
            mangerId: farmData.mangerId ? farmData.mangerId : null,
            userId: loggedUserData.id,
            feedProfile,
            feedProfileId: Number(getLocalItem('feedProfileId')),
          };
        } else {
          payload = {
            productionParamtertsUnitsArray: updatedProductionUnits,
            FeedProfileUnits:
              filteredProductionUnitsFeedProfile ?? unitFeedProfiles,

            productionParameter: {
              ...farmPredictionValues,
              predictedValues: {
                waterTemp:
                  farmPredictionValues.predictedValues['Water Temperature °C'],
                DO: farmPredictionValues.predictedValues[
                  'Dissolved Oxygen (DO) mg/L'
                ],
                TSS: farmPredictionValues.predictedValues[
                  'Total Suspended solids (TSS)'
                ],
                NH4: farmPredictionValues.predictedValues['Ammonia (NH₄) mg/L'],
                NO3: farmPredictionValues.predictedValues['Nitrate (NO₃) mg/L'],
                NO2: farmPredictionValues.predictedValues['Nitrite (NO₂) mg/L'],
                ph: farmPredictionValues.predictedValues['pH'],
                visibility:
                  farmPredictionValues.predictedValues['Visibility cm'],
              },
              idealRange: {
                waterTemp:
                  farmPredictionValues.idealRange['Water Temperature °C'],
                DO: farmPredictionValues.idealRange[
                  'Dissolved Oxygen (DO) mg/L'
                ],
                TSS: farmPredictionValues.idealRange[
                  'Total Suspended solids (TSS)'
                ],
                NH4: farmPredictionValues.idealRange['Ammonia (NH₄) mg/L'],
                NO3: farmPredictionValues.idealRange['Nitrate (NO₃) mg/L'],
                NO2: farmPredictionValues.idealRange['Nitrite (NO₂) mg/L'],
                ph: farmPredictionValues.idealRange['pH'],
                visibility: farmPredictionValues.idealRange['Visibility cm'],
              },
            },
            farmAddress: {
              addressLine1: farmData.addressLine1,
              addressLine2: farmData.addressLine2,
              city: farmData.city,
              province: farmData.province,
              zipCode: farmData.zipCode,
              country: farmData.country,
            },
            productionUnits: data.productionUnits,
            name: farmData.name,
            farmAltitude: farmData.farmAltitude,
            lat: farmData.lat,
            lng: farmData.lng,
            fishFarmer: farmData.fishFarmer,
            organsationId: loggedUserData.organisationId,
            mangerId: farmData.mangerId ? farmData.mangerId : null,
            userId: loggedUserData.id,
            feedProfile,
          };
        }

        if (Object.keys(payload).length && payload.name) {
          const response = await fetch(
            `${
              isEditFarm === 'true'
                ? '/api/farm/edit-farm'
                : '/api/farm/add-farm'
            }`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(payload),
            },
          );

          const responseData = await response.json();
          if (responseData.status) {
            toast.success(responseData.message);
            deleteCookie('isEditFarm');
            removeLocalItem('farmData');
            removeLocalItem('farmProductionUnits');
            removeLocalItem('productionParametes');
            removeLocalItem('productionParamtertsUnitsArray');
            removeLocalItem('feedProfiles');
            removeLocalItem('feedProfileId');
            removeLocalItem('productionUnitsFeedProfiles');
            router.push('/dashboard/farm');
          } else {
            toast.error(responseData.message);
          }
        } else {
          toast.error('Please fill out the all feilds');
        }
      } catch {
        toast.error('Something went wrong. Please try again.');
      } finally {
        setIsApiCallInProgress(false);
      }
    }
  };

  const handleRemoveUnit = (
    item: {
      name: string;
      capacity: string;
      type: string;
      waterflowRate: string;
      id: string;
    },
    index: number,
  ) => {
    if (fields?.length === 1 && index === 0) {
      setValue('productionUnits', [
        {
          name: '',
          capacity: '',
          type: '',
          waterflowRate: '',
          id: Number(uuidv4()),
        },
      ]);
    } else {
      remove(index);
    }
  };
  useEffect(() => {
    router.refresh();
    if (typeof window !== 'undefined') {
      const productionUnit = getLocalItem('farmProductionUnits');
      const productionParamtertsUnitsArrayLocal = getLocalItem(
        'productionParamtertsUnitsArray',
      );
      const productionUnitsFeedProfilesLocal = getLocalItem(
        'productionUnitsFeedProfiles',
      );
      const farmData = getLocalItem('farmData');

      setFormProductionUnitsData({
        farmData: farmData,
        productionUnitData: productionUnit,
      });
      if (!productionParamtertsUnitsArrayLocal?.length) {
        setLocalItem('productionParamtertsUnitsArray', []);
      }

      if (!productionUnitsFeedProfilesLocal?.length) {
        setLocalItem('productionUnitsFeedProfiles', []);
      }
    }
  }, []);

  useEffect(() => {
    if (calculatedValue?.id && calculatedValue.output) {
      const updatedFields = productionUnits.map((field) => {
        if (field.id === calculatedValue.id) {
          return { ...field, capacity: String(calculatedValue.output) };
        } else {
          return field;
        }
      });
      setValue('productionUnits', updatedFields);
    }
  }, [calculatedValue]);

  useEffect(() => {
    if (
      editFarm &&
      !formProductionUnitsData &&
      !formProductionUnitsData?.productionUnitData
    ) {
      setValue('productionUnits', editFarm?.productionUnits ?? []);
    } else if (formProductionUnitsData) {
      if (
        formProductionUnitsData?.productionUnitData &&
        formProductionUnitsData?.productionUnitData[0] &&
        formProductionUnitsData?.productionUnitData[0]?.name
      ) {
        setValue(
          'productionUnits',
          formProductionUnitsData?.productionUnitData,
        );
      }

      dispatch(farmAction.updateFarm(formProductionUnitsData?.farmData));
    }
    setValue('area', '1');
    setValue('depth', '1');
    setValue('height', '1');
    setValue('length', '1');
    setValue('radius', '1');
    setValue('width', '1');
  }, [formProductionUnitsData]);

  return (
    <Stack>
      <Typography
        variant="h6"
        fontWeight={700}
        sx={{
          fontSize: {
            md: 24,
            xs: 20,
          },
          marginBottom: 2,
        }}
      >
        Production Units
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box>
          {fields.map((item, index) => {
            return (
              <TableContainer
                key={item.id}
                component={Paper}
                sx={{
                  boxShadow: 'none !important',
                }}
              >
                <Table sx={{ minWidth: '100%' }} aria-label="simple table">
                  <TableBody>
                    {/* {rows.map((row, i) => ( */}
                    <TableRow
                      sx={{
                        '&:last-child td, &:last-child th': { border: 0 },
                        display: 'flex',
                        gap: '32px',
                      }}
                    >
                      <TableCell
                        sx={{
                          border: 0,
                          pl: 0,
                          pr: 1,
                        }}
                      >
                        <Controller
                          name={`productionUnits.${index}.name`} // Dynamic field name
                          control={control}
                          defaultValue="" // Set default value if necessary
                          render={({ field }) => (
                            <TextField
                              {...field} // Spread field props
                              label="Production Unit Name *"
                              type="text"
                              focused
                              className="form-input"
                              sx={{
                                width: '100%',
                                minWidth: 150,
                              }}
                            />
                          )}
                          rules={{
                            required: 'This field is required.',
                            validate: (value) => {
                              if (!value.trim()) {
                                return 'Production Unit Name is required.';
                              }
                              const isUnique = productionUnits?.every(
                                (f, i) =>
                                  i === index ||
                                  f.name.toLowerCase() !== value.toLowerCase(),
                              );
                              return (
                                isUnique ||
                                'Please enter a unique name. This name is already used in production unit data.'
                              );
                            },
                          }} // Add validation
                        />
                        {errors?.productionUnits?.[index]?.name && (
                          <Typography
                            variant="body2"
                            color="red"
                            fontSize={13}
                            mt={0.5}
                            maxWidth={210}
                          >
                            {errors.productionUnits[index].name.message}
                          </Typography>
                        )}
                      </TableCell>

                      <TableCell
                        sx={{
                          border: 0,
                          pl: 0,
                          pr: 1,
                        }}
                      >
                        <FormControl
                          className="form-input prod-unit"
                          fullWidth
                          focused
                        >
                          <InputLabel id="demo-simple-select-label">
                            Production Unit Type *
                          </InputLabel>
                          <Controller
                            name={`productionUnits.${index}.type`} // Dynamic name for production unit type
                            control={control}
                            defaultValue={fields[index]?.type || ''} // Default value, fall back to empty string
                            render={({ field }) => (
                              <Select
                                labelId={`demo-simple-select-label-${index}`}
                                id={`demo-simple-select-${index}`}
                                label="Production Unit Type *"
                                {...field} // Spread the field props for value and onChange
                                sx={{
                                  minWidth: '200px',
                                  width: '100%',
                                }}
                              >
                                {unitsTypes.map((unit, i) => (
                                  <MenuItem value={unit.name} key={i}>
                                    {unit.name}
                                  </MenuItem>
                                ))}
                              </Select>
                            )}
                            rules={{
                              required: true,
                            }} // Validation rule
                          />
                          {errors &&
                            errors.productionUnits &&
                            errors.productionUnits[index]?.type && (
                              <Typography
                                variant="body2"
                                color="red"
                                fontSize={13}
                                mt={0.5}
                              >
                                {validationMessage.required}
                              </Typography>
                            )}
                        </FormControl>
                      </TableCell>

                      <TableCell
                        sx={{
                          border: 0,
                          pl: 0,
                          pr: 0,
                        }}
                      >
                        <Box display={'flex'} gap={2} alignItems={'center'}>
                          <Box position={'relative'}>
                            <Controller
                              name={`productionUnits.${index}.capacity`} // Dynamic field name
                              control={control}
                              defaultValue="" // Set default value if necessary
                              render={({ field }) => (
                                <TextField
                                  {...field} // Spread field props
                                  label="Capacity *"
                                  type="text"
                                  focused
                                  className="form-input capacity-input"
                                  sx={{
                                    width: '100%',
                                    minWidth: 150,
                                  }}
                                />
                              )}
                              rules={{
                                required: true,
                                pattern: validationPattern.numbersWithDot,
                                maxLength: 10,
                              }} // Add validation
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
                              L
                            </Typography>
                          </Box>

                          <Button
                            type="button"
                            variant="contained"
                            sx={{
                              background: '#06a19b',
                              color: '#fff',
                              fontWeight: 600,
                              padding: '6px 16px',
                              width: 'fit-content',
                              textTransform: 'capitalize',
                              borderRadius: '8px',
                              border: '1px solid #06A19B',
                              minWidth: 90,
                            }}
                            disabled={
                              productionUnits[index].type ? false : true
                            }
                            onClick={() => handleCalculate(item, index)}
                          >
                            Calculate
                          </Button>
                        </Box>
                        {errors &&
                          errors.productionUnits &&
                          errors?.productionUnits[index]?.capacity && (
                            <Typography
                              variant="body2"
                              color="red"
                              fontSize={13}
                              mt={0.5}
                            >
                              {errors.productionUnits[index]?.capacity.type ===
                              'required'
                                ? validationMessage.required
                                : errors.productionUnits[index]?.capacity
                                      .type === 'pattern'
                                  ? validationMessage.OnlyNumbersWithDot
                                  : errors.productionUnits[index]?.capacity
                                        .type === 'maxLength'
                                    ? validationMessage.numberMaxLength
                                    : ''}
                            </Typography>
                          )}
                      </TableCell>
                      <TableCell
                        sx={{
                          border: 0,
                          pl: 0,
                          pr: 1,
                        }}
                      >
                        <Box display={'flex'} gap={2} alignItems={'center'}>
                          <Box position={'relative'}>
                            <Controller
                              name={`productionUnits.${index}.waterflowRate`} // Dynamic field name
                              control={control}
                              defaultValue="" // Set default value if necessary
                              render={({ field }) => (
                                <TextField
                                  {...field} // Spread field props
                                  label="Waterflow Rate *"
                                  type="text"
                                  focused
                                  className="form-input"
                                  sx={{
                                    width: '100%',
                                    minWidth: 150,
                                  }}
                                />
                              )}
                              rules={{
                                required: true,
                                pattern: validationPattern.onlyNumbersPattern,
                                maxLength: 10,
                              }} // Add validation
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
                              L/H
                            </Typography>
                          </Box>
                        </Box>
                        {errors?.productionUnits?.[index]?.waterflowRate && (
                          <Typography
                            variant="body2"
                            color="red"
                            fontSize={13}
                            mt={0.5}
                          >
                            {errors?.productionUnits?.[index]?.waterflowRate
                              .type === 'required'
                              ? validationMessage.required
                              : errors?.productionUnits?.[index]?.waterflowRate
                                    .type === 'pattern'
                                ? validationMessage.onlyNumbers
                                : errors?.productionUnits?.[index]
                                      ?.waterflowRate.type === 'maxLength'
                                  ? validationMessage.numberMaxLength
                                  : ''}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell
                        title="Water Quality Parameters"
                        sx={{
                          border: 0,
                          pl: 0,
                          pr: 1,
                          position: 'relative',
                        }}
                        onClick={() => {
                          if (productionUnits[index]?.name) {
                            toast.dismiss();
                            setOpenUnitParametersModal(true);
                            setSelectedUnitName(productionUnits[index].name);
                          } else {
                            toast.dismiss();
                            toast.error('Please enter unit name first');
                          }
                        }}
                      >
                        <Box
                          sx={{
                            cursor: 'pointer',
                            width: 'fit-content',
                            px: 1,
                            mt: '16px',
                          }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                          >
                            <path
                              fill={`${
                                productionUnits[index]?.name
                                  ? '#06A19B'
                                  : '#808080'
                              }`}
                              fill-rule="evenodd"
                              d="M18.955 1.25c-.433 0-.83 0-1.152.043c-.356.048-.731.16-1.04.47s-.422.684-.47 1.04c-.043.323-.043.72-.043 1.152v13.09c0 .433 0 .83.043 1.152c.048.356.16.731.47 1.04s.684.422 1.04.47c.323.043.72.043 1.152.043h.09c.433 0 .83 0 1.152-.043c.356-.048.731-.16 1.04-.47s.422-.684.47-1.04c.043-.323.043-.72.043-1.152V3.955c0-.433 0-.83-.043-1.152c-.048-.356-.16-.731-.47-1.04s-.684-.422-1.04-.47c-.323-.043-.72-.043-1.152-.043zm-1.13 1.572l-.002.001l-.001.003l-.005.01a.7.7 0 0 0-.037.167c-.028.21-.03.504-.03.997v13c0 .493.002.787.03.997a.7.7 0 0 0 .042.177l.001.003l.003.001l.003.002l.007.003c.022.009.07.024.167.037c.21.028.504.03.997.03s.787-.002.997-.03a.7.7 0 0 0 .177-.042l.003-.001l.001-.003l.005-.01a.7.7 0 0 0 .037-.167c.028-.21.03-.504.03-.997V4c0-.493-.002-.787-.03-.997a.7.7 0 0 0-.042-.177l-.001-.003l-.003-.001l-.01-.005a.7.7 0 0 0-.167-.037c-.21-.028-.504-.03-.997-.03s-.787.002-.997.03a.7.7 0 0 0-.177.042M11.955 4.25h.09c.433 0 .83 0 1.152.043c.356.048.731.16 1.04.47s.422.684.47 1.04c.043.323.043.72.043 1.152v10.09c0 .433 0 .83-.043 1.152c-.048.356-.16.731-.47 1.04s-.684.422-1.04.47c-.323.043-.72.043-1.152.043h-.09c-.432 0-.83 0-1.152-.043c-.356-.048-.731-.16-1.04-.47s-.422-.684-.47-1.04c-.043-.323-.043-.72-.043-1.152V6.955c0-.433 0-.83.043-1.152c.048-.356.16-.731.47-1.04s.684-.422 1.04-.47c.323-.043.72-.043 1.152-.043m-1.132 1.573l.003-.001l-.003 12.355l-.001-.003l-.005-.01a.7.7 0 0 1-.037-.167c-.028-.21-.03-.504-.03-.997V7c0-.493.002-.787.03-.997a.7.7 0 0 1 .042-.177zm0 12.354l.003-12.355l.003-.002l.007-.003a.7.7 0 0 1 .167-.037c.21-.028.504-.03.997-.03s.787.002.997.03a.7.7 0 0 1 .177.042l.003.001l.001.003l.005.01c.009.022.024.07.037.167c.028.21.03.504.03.997v10c0 .493-.002.787-.03.997a.7.7 0 0 1-.042.177l-.001.003l-.003.001l-.01.005a.7.7 0 0 1-.167.037c-.21.028-.504.03-.997.03s-.787-.002-.997-.03a.7.7 0 0 1-.177-.042zM4.955 8.25c-.433 0-.83 0-1.152.043c-.356.048-.731.16-1.04.47s-.422.684-.47 1.04c-.043.323-.043.72-.043 1.152v6.09c0 .433 0 .83.043 1.152c.048.356.16.731.47 1.04s.684.422 1.04.47c.323.043.72.043 1.152.043h.09c.433 0 .83 0 1.152-.043c.356-.048.731-.16 1.04-.47s.422-.684.47-1.04c.043-.323.043-.72.043-1.152v-6.09c0-.433 0-.83-.043-1.152c-.048-.356-.16-.731-.47-1.04s-.684-.422-1.04-.47c-.323-.043-.72-.043-1.152-.043zm-1.13 1.572l-.002.001l-.001.003l-.005.01a.7.7 0 0 0-.037.167c-.028.21-.03.504-.03.997v6c0 .493.002.787.03.997a.7.7 0 0 0 .042.177v.002l.004.002l.01.005c.022.009.07.024.167.037c.21.028.504.03.997.03s.787-.002.997-.03a.7.7 0 0 0 .177-.042l.003-.001l.001-.003l.002-.004l.003-.006a.7.7 0 0 0 .037-.167c.028-.21.03-.504.03-.997v-6c0-.493-.002-.787-.03-.997a.7.7 0 0 0-.042-.177l-.001-.003l-.003-.001l-.01-.005a.7.7 0 0 0-.167-.037c-.21-.028-.504-.03-.997-.03s-.787.002-.997.03a.7.7 0 0 0-.177.042"
                              clip-rule="evenodd"
                            />
                            <path
                              fill={`${
                                productionUnits[index]?.name
                                  ? '#06A19B'
                                  : '#808080'
                              }`}
                              d="M3 21.25a.75.75 0 0 0 0 1.5h18a.75.75 0 0 0 0-1.5z"
                            />
                          </svg>
                        </Box>
                      </TableCell>
                      <TableCell
                        title="Feed Profile"
                        sx={{
                          border: 0,
                          pl: 0,
                          pr: 1,
                          position: 'relative',
                        }}
                        onClick={() => {
                          if (productionUnits[index]?.name) {
                            toast.dismiss();
                            setOpenUnitFeedProfileModal(true);
                            setSelectedUnitName(productionUnits[index].name);
                          } else {
                            toast.dismiss();
                            toast.error('Please enter unit name first');
                          }
                        }}
                      >
                        <Box
                          sx={{
                            cursor: 'pointer',
                            width: 'fit-content',
                            px: 1,
                            mt: '16px',
                          }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="1.7em"
                            height="1.5em"
                            viewBox="0 0 256 256"
                          >
                            <path
                              fill={`${
                                productionUnits[index]?.name
                                  ? '#06A19B'
                                  : '#808080'
                              }`}
                              d="M230.33 141.06a24.43 24.43 0 0 0-21.24-4.23l-41.84 9.62A28 28 0 0 0 140 112H89.94a31.82 31.82 0 0 0-22.63 9.37L44.69 144H16a16 16 0 0 0-16 16v40a16 16 0 0 0 16 16h104a8 8 0 0 0 1.94-.24l64-16a7 7 0 0 0 1.19-.4L226 182.82l.44-.2a24.6 24.6 0 0 0 3.93-41.56ZM16 160h24v40H16Zm203.43 8.21l-38 16.18L119 200H56v-44.69l22.63-22.62A15.86 15.86 0 0 1 89.94 128H140a12 12 0 0 1 0 24h-28a8 8 0 0 0 0 16h32a8.3 8.3 0 0 0 1.79-.2l67-15.41l.31-.08a8.6 8.6 0 0 1 6.3 15.9ZM164 96a36 36 0 0 0 5.9-.48a36 36 0 1 0 28.22-47A36 36 0 1 0 164 96m60-12a20 20 0 1 1-20-20a20 20 0 0 1 20 20m-60-44a20 20 0 0 1 19.25 14.61a36 36 0 0 0-15 24.93A20.4 20.4 0 0 1 164 80a20 20 0 0 1 0-40"
                            />
                          </svg>
                        </Box>
                      </TableCell>
                      <TableCell
                        title="Delete Unit"
                        sx={{
                          border: 0,
                          pl: 0,
                          pr: 1,
                          position: 'relative',
                        }}
                        onClick={() => handleRemoveUnit(item, index)}
                      >
                        <Box
                          sx={{
                            cursor: 'pointer',
                            width: 'fit-content',
                            px: 1,
                            mt: '16px',
                          }}
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
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            );
          })}

          <Box
            display={'flex'}
            alignItems={'center'}
            mt={1}
            gap={2}
            flexWrap={'wrap'}
            justifyContent={'space-between'}
          >
            <Button
              type="button"
              variant="contained"
              sx={{
                background: '#06A19B',
                fontWeight: 600,
                padding: '6px 16px',
                width: 'fit-content',
                textTransform: 'capitalize',
                borderRadius: '8px',
              }}
              onClick={() => AddProdunctionUnit()}
            >
              Add A Production Unit
            </Button>

            <Box
              display={'flex'}
              justifyContent={'flex-end'}
              alignItems={'center'}
              gap={3}
            >
              <Button
                type="button"
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
                onClick={() => {
                  setActiveStep(2);
                  setLocalItem('farmProductionUnits', watch('productionUnits'));
                }}
              >
                Previous
              </Button>

              <Button
                type="submit"
                variant="contained"
                disabled={isApiCallInProgress ? true : false}
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
          </Box>
        </Box>
      </form>
      <ProductionUnitParametersPredicated
        editFarm={editFarm}
        productionParaMeter={productionParaMeter}
        open={openUnitParametersModal}
        setOpen={setOpenUnitParametersModal}
        selectedUnitName={selectedUnitName}
        setSelectedUnitName={setSelectedUnitName}
      />
      <ProductionUnitFeedProfile
        editFarm={editFarm}
        productionParaMeter={productionParaMeter}
        open={openUnitFeedProfileModal}
        setOpen={setOpenUnitFeedProfileModal}
        selectedUnitName={selectedUnitName}
        setSelectedUnitName={setSelectedUnitName}
        feedStores={feedStores}
        feedSuppliers={feedSuppliers}
      />
      <CalculateVolume
        open={open}
        setOpen={setopen}
        selectedUnit={selectedUnit}
        setCalculatedValue={setCalculatedValue}
        register={register}
        watch={watch}
        errors={errors}
        trigger={trigger}
        calculatedValue={calculatedValue}
        setValue={setValue}
        clearErrors={clearErrors}
        validationMessage={validationMessage}
      />
    </Stack>
  );
};

export default ProductionUnits;
