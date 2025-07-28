import {
  getLocalItem,
  productionMangeFields,
  removeLocalItem,
  setLocalItem,
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
  Modal,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs, { Dayjs } from 'dayjs';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import {
  Controller,
  SubmitHandler,
  useFieldArray,
  useForm,
} from 'react-hook-form';
import toast from 'react-hot-toast';
import CalculateMeanLength from './CalculateMeanLength';
import CalculateMeanWeigth from './CalculateMeanWeigth';
import Confirmation from './Confirmation';
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
  selectedProduction: Production | null;
  farms: Farm[];
  batches: { batchNumber: string; id: number }[];
  productions: Production[];
}
interface Manager {
  id: number;
  fishFarm: string;
  productionUnit: string;
  biomass: string;
  count: string;
  meanWeight: string;
  meanLength: string;
  field?: string;
  stockingDensityNM?: string;
  stockingLevel?: string;
  stockingDensityKG?: string;
  batchNumber: string;
  currentDate?: Dayjs | null;
  totalWeight?: string;
  noOfFish?: string;
}
export interface InputTypes {
  manager: Manager[];
}
const TransferModal: React.FC<Props> = ({
  setOpen,
  open,
  selectedProduction,
  farms,
  batches,
  productions,
}) => {
  const searchParams = useSearchParams();
  const isFish = searchParams.get('isFish');
  const router = useRouter();
  // const filterFarmPermission =
  //   selectedProduction?.organisation?.permissions.farms?.find(
  //     (per) => per?.farmId === selectedProduction?.fishFarmId
  //   );
  const [selectedFarm, setSelectedFarm] = useState<string>('');
  const [isEnteredBiomassGreater, setIsEnteredBiomassGreater] =
    useState<boolean>(false);
  const [isEnteredFishCountGreater, setIsEnteredFishCountGreater] =
    useState<boolean>(false);
  const [openConfirmationModal, setOpenConfirmationModal] =
    useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [isStockDeleted, setIsStockDeleted] = useState<boolean>(false);
  const [isMeanWeigthCal, setIsMeanWeigthCal] = useState<boolean>(false);
  const [isMeanLengthCal, setIsMeanLengthCal] = useState<boolean>(false);
  const [avgOfMeanWeight, setAvgOfMeanWeight] = useState<number>();
  const [avgOfMeanLength, setAvgOfMeanLength] = useState<number>();
  const [formData, setFormData] = useState<Manager[] | null>([]);
  const [selectedMeanWeightId, setSelectedMeanWeightId] = useState<string>('');
  const [selectedMeanLengthId, setSelectedMeanLengthId] = useState<string>('');
  const [isApiCallInProgress, setIsApiCallInProgress] =
    useState<boolean>(false);
  const [currentInput, setCurrentInput] = useState('');
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
    mode: 'onChange',
    defaultValues: {
      manager: [
        {
          id: 0,
          fishFarm: '',
          productionUnit: '',
          biomass: '',
          count: '',
          meanWeight: '',
          meanLength: '',
          stockingDensityNM: '',
          stockingLevel: '',
          stockingDensityKG: '',
          field: '',
          batchNumber: '',
          currentDate: '',
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'manager',
  });
  const watchedFields = watch('manager');
  const onSubmit: SubmitHandler<InputTypes> = async (data) => {
    // Prevent API call if one is already in progress
    if (isApiCallInProgress) return;
    setIsApiCallInProgress(true);

    try {
      const addIdToData = data.manager.map((field) => {
        const fishFarm = productions.find(
          (OldField) =>
            OldField.fishFarmId === field.fishFarm &&
            OldField.productionUnitId === field.productionUnit,
        );

        if (
          field.fishFarm === fishFarm?.fishFarmId &&
          field.productionUnit === fishFarm.productionUnitId
        ) {
          return { ...field, id: fishFarm.id };
        } else {
          return field;
        }
      });

      const filteredData = addIdToData.filter(
        (field) => field.field !== 'Stock',
      );
      const addDataInSample = filteredData.map((data) => {
        const formattedDate = data?.currentDate?.format
          ? data.currentDate.format('MM/DD/YYYY')
          : data?.currentDate;

        if (data.field === 'Sample') {
          return {
            ...data,
            batchNumber: filteredData[0].batchNumber,
            productionUnit: filteredData[0].productionUnit,
            id: filteredData[0].id,
            currentDate: formattedDate,
            stockingDensityKG: filteredData[0].stockingDensityKG,
            stockingDensityNM: filteredData[0].stockingDensityNM,
          };
        } else {
          return {
            ...data,
            currentDate: formattedDate,
          };
        }
      });
      if (!isEnteredBiomassGreater && !isEnteredFishCountGreater) {
        const addStockField = addDataInSample.map((data) => {
          if (!data.field && !selectedProduction?.batchNumberId) {
            return { ...data, field: 'Stock' };
          } else {
            return data;
          }
        });
        const payload = {
          organisationId: selectedProduction?.organisationId,
          data: addStockField,
        };

        const response = await fetch('/api/production/mange', {
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
          removeLocalItem('productionData');
          removeLocalItem('transferformData');
          router.push('/dashboard/production');
          reset();
          router.refresh();
        }
      } else {
        toast.dismiss();
        toast.error(
          'Please enter biomass and fish count value less than selected production',
        );
      }
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsApiCallInProgress(false);
    }
  };

  const handleDelete = (item: Manager) => {
    if (item.field !== 'Stock') {
      const currentIndex = fields.findIndex((field) => field.id === item.id);
      remove(currentIndex);
    } else {
      setOpenConfirmationModal(true);
    }
  };
  const handleClose = () => {
    const firstObject = getValues('manager')[0];
    // Reset the form and keep the first object intact
    reset({
      manager: [firstObject], // Keep only the first object
    });
    setOpen(false);
    const params = new URLSearchParams(searchParams);
    params.delete('isFish');
    removeLocalItem('productionData');
    removeLocalItem('transferformData');
    router.replace(`/dashboard/production`);
    toast.dismiss();
  };
  const openAnchor = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseAnchor = (field: string) => {
    if (field.length) {
      append({
        id: 0,
        fishFarm: selectedProduction?.fishFarmId ?? '',
        productionUnit:
          field === 'Stock' || field === 'Harvest' || field === 'Mortalities'
            ? (selectedProduction?.productionUnitId ?? '')
            : '',
        biomass: '',
        count: '',
        meanWeight: '',
        meanLength: '',
        stockingDensityNM: '',
        stockingLevel: '',
        stockingDensityKG: '',
        field,
        batchNumber:
          field === 'Harvest' || field === 'Mortalities'
            ? (selectedProduction?.batchNumberId ?? '')
            : '',
      });
      setAnchorEl(null);
    } else {
      setAnchorEl(null);
    }
  };

  const handleMeanWeight = (item: Manager) => {
    setSelectedMeanWeightId(String(item.id));
    setIsMeanWeigthCal(true);
  };
  const handleMeanLength = (item: Manager) => {
    setSelectedMeanLengthId(String(item.id));
    setIsMeanLengthCal(true);
  };
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Enter' && !open) {
      event.preventDefault();
      const params = new URLSearchParams(searchParams);
      params.delete('isFish');
      router.replace(`/dashboard/production`);
      removeLocalItem('productionData');
      removeLocalItem('transferformData');
    }
  };
  const handleCheckUnitSelected = (idx: number, inputName: string) => {
    setCurrentInput(inputName);
    if (!watchedFields[idx].productionUnit) {
      toast.dismiss();
      toast.error('Please select production unit first');
    }
  };
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const data = getLocalItem('transferformData');
      setFormData(data);
    }
  }, []);
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open]);

  useEffect(() => {
    watchedFields.map((feild, i) => {
      if (feild.field === 'Sample' && feild.noOfFish && feild.totalWeight) {
        const totalWeightArr: Array<number> = [];
        const totalFishsArr: Array<number> = [];

        watchedFields.map((feild) => {
          if (feild.totalWeight) {
            totalWeightArr.push(Number(feild.totalWeight));
          }
          if (feild.noOfFish) {
            totalFishsArr.push(Number(feild.noOfFish));
          }
        });

        const totalWeight = totalWeightArr.reduce((acc, val) => {
          return (acc += val);
        }, 0);
        const totalFish = totalFishsArr.reduce((acc, val) => {
          return (acc += val);
        }, 0);
        const avgOfMeanWeight = totalWeight / totalFish;
        setValue(
          `manager.${i}.meanWeight`,
          String(Number(avgOfMeanWeight).toFixed(2)),
        );
        // setValue("avgOfMeanWeight", avgOfMeanWeight);
      }
    });
  }, [
    watchedFields.map((field) => field.noOfFish).join(','),
    watchedFields.map((field) => field.totalWeight).join(','),
  ]);

  useEffect(() => {
    if ((isStockDeleted || selectedProduction) && !formData) {
      const data: Manager[] = selectedProduction
        ? [
            {
              id: selectedProduction.id ?? '',
              fishFarm: selectedProduction.fishFarmId ?? '',
              productionUnit: selectedProduction.productionUnitId ?? '',
              biomass: selectedProduction.biomass ?? 0,
              count: selectedProduction.fishCount ?? 0,
              meanWeight: selectedProduction.meanWeight ?? 0,
              meanLength: selectedProduction.meanLength ?? 0,
              stockingDensityNM: selectedProduction.stockingDensityNM ?? 0,
              stockingLevel: selectedProduction.stockingLevel ?? 0,
              stockingDensityKG: selectedProduction.stockingDensityKG ?? 0,
              batchNumber: selectedProduction.batchNumberId ?? '',
              currentDate: selectedProduction.currentDate
                ? dayjs(selectedProduction.currentDate)
                : undefined,
            },
          ]
        : [];
      setValue('manager', data);
    }

    if (formData) {
      setValue('manager', formData);
    }

    setSelectedFarm(
      formData ? formData[0]?.fishFarm : (selectedProduction?.fishFarmId ?? ''),
    ); // Set the selected farm when manager is selected
    return () => {
      setIsStockDeleted(false);
    };
  }, [selectedProduction, isStockDeleted, formData]);
  useEffect(() => {
    if (selectedProduction) {
      const index0Biomass = Number(selectedProduction.biomass) || 0; // Ensure a number
      const index0Count = Number(selectedProduction.fishCount) || 0; // Ensure a number
      const fishFarm = selectedProduction.fishFarmId;

      // Initialize updated values
      let updatedBiomass = index0Biomass;
      let updatedCount = index0Count;

      // Iterate through watched fields, skipping index 0
      watchedFields.forEach((field, index) => {
        if (index === 0) return; // Skip index 0
        if (field.fishFarm === fishFarm) {
          if (
            !selectedProduction.biomass &&
            !selectedProduction.fishCount &&
            !selectedProduction.meanLength &&
            !selectedProduction.meanWeight &&
            field.field === 'Stock'
          ) {
            updatedBiomass = Number(field.biomass);
            updatedCount = Number(field.count);
            setValue(`manager.0.meanLength`, field.meanLength);
            setValue(`manager.0.meanWeight`, field.meanWeight);

            setValue(
              `manager.0.stockingDensityKG`,
              Number(field.stockingDensityKG).toFixed(2),
            );

            setValue(
              `manager.0.stockingDensityNM`,
              Number(field.stockingDensityNM).toFixed(2),
            );

            setValue(`manager.0.batchNumber`, field.batchNumber);
          }

          const currentBiomass = Number(field.biomass) || 0; // Convert to number
          const currentCount = Number(field.count) || 0; // Convert to number
          if (
            field.field !== 'Stock' &&
            currentBiomass > updatedBiomass &&
            currentInput === 'biomass'
          ) {
            toast.dismiss();
            toast.error(`Please enter a value lower than ${updatedBiomass}`);
            setIsEnteredBiomassGreater(true);
          }
          if (
            field.field !== 'Stock' &&
            currentCount > updatedCount &&
            currentInput === 'fishCount'
          ) {
            toast.dismiss();
            toast.error(`Please enter a value lower than ${updatedCount}`);
            setIsEnteredFishCountGreater(true);
          }
          // Update biomass if current value is valid
          if (currentBiomass > 0 && updatedBiomass > currentBiomass) {
            updatedBiomass -= currentBiomass;
            setIsEnteredBiomassGreater(false);
          } else if (field.field === 'Stock') {
            // trigger(`manager.${0}`);

            updatedBiomass = currentBiomass;
            setValue(`manager.0.meanLength`, field.meanLength);
            setValue(`manager.0.meanWeight`, field.meanWeight);
            setValue(
              `manager.0.stockingDensityNM`,
              Number(field.stockingDensityNM).toFixed(2),
            );
            setValue(
              `manager.0.stockingDensityKG`,
              Number(field.stockingDensityKG).toFixed(2),
            );

            setValue(`manager.0.batchNumber`, field.batchNumber);
          }

          // Update count if current value is valid
          if (currentCount > 0 && updatedCount > currentCount) {
            updatedCount -= currentCount;
            setIsEnteredFishCountGreater(false);
          } else if (field.field === 'Stock') {
            updatedCount = currentCount;
            setValue(`manager.0.meanLength`, field.meanLength);
            setValue(`manager.0.meanWeight`, field.meanWeight);
            setValue(
              `manager.0.stockingDensityNM`,
              Number(field.stockingDensityNM).toFixed(2),
            );
            setValue(
              `manager.0.stockingDensityKG`,
              Number(field.stockingDensityKG).toFixed(2),
            );
            setValue(`manager.0.batchNumber`, field.batchNumber);
          }
        }
        const farm = farms
          ?.find((f) => f.id === selectedFarm)
          ?.productionUnits?.find((unit) => unit.id === field.productionUnit);
        if (farm && farm.capacity) {
          const regex = validationPattern.numbersWithDot;
          const SDNMvalue = Number(
            Number(field.count) / Number(farm?.capacity),
          ).toFixed(2);
          if (regex.test(SDNMvalue)) {
            setValue(`manager.${index}.stockingDensityNM`, String(SDNMvalue));
          }
          const SDKG = Number(
            Number(field.biomass) / Number(farm?.capacity),
          ).toFixed(2);
          if (regex.test(SDKG)) {
            setValue(`manager.${index}.stockingDensityKG`, String(SDKG));
          }
        }
      });

      // Set the index 0 values after calculation
      setValue(`manager.0.biomass`, updatedBiomass.toString());
      setValue(`manager.0.count`, updatedCount.toString());
    }

    if (watchedFields[0]?.id) {
      if (isFish && watchedFields[0]?.id) {
        setLocalItem('transferformData', watchedFields);
      } else {
        removeLocalItem('transferformData');
        setFormData(null);
      }
    }
  }, [
    watchedFields.map((field) => field.biomass).join(','),
    watchedFields.map((field) => field.count).join(','),
    watchedFields.map((field) => field.meanLength).join(','),
    watchedFields.map((field) => field.meanWeight).join(','),
    watchedFields.map((field) => field.batchNumber).join(','),
    watchedFields.map((field) => field.productionUnit).join(','),
    watchedFields.map((field) => field.stockingLevel).join(','),
    watchedFields.map((field) => field.stockingDensityKG).join(','),
    watchedFields.map((field) => field.stockingDensityNM).join(','),
    setValue,
    isFish,
    selectedProduction,
  ]);
  useEffect(() => {
    if (avgOfMeanWeight && selectedMeanWeightId) {
      const updatedFields = fields.map((field, idx) => {
        if (field.id === selectedMeanWeightId) {
          return {
            ...field,
            meanWeight: String(Number(avgOfMeanWeight).toFixed(2)),
            batchNumber: watchedFields[idx].batchNumber,
            count: watchedFields[idx].count,
            productionUnit: watchedFields[idx].productionUnit,
            biomass: watchedFields[idx].biomass,
          };
        } else {
          return field;
        }
      });

      setValue('manager', updatedFields);
    }
  }, [avgOfMeanWeight]);
  useEffect(() => {
    if (avgOfMeanLength && selectedMeanLengthId) {
      const updatedFields = fields.map((field, idx) => {
        if (field.id === selectedMeanLengthId) {
          return {
            ...field,
            meanLength: String(Number(avgOfMeanLength).toFixed(2)),
            batchNumber: watchedFields[idx].batchNumber,
            count: watchedFields[idx].count,
            productionUnit: watchedFields[idx].productionUnit,
            biomass: watchedFields[idx].biomass,
          };
        } else {
          return field;
        }
      });

      setValue('manager', updatedFields);
    }
  }, [avgOfMeanLength]);

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
        className="modal-positioning"
        data-bs-backdrop="static"
        sx={{
          px: 5,
        }}
        // onBackdropClick={() => reset()}
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
          <form className="form-height" onSubmit={handleSubmit(onSubmit)}>
            {fields.map((item, idx) => {
              return (
                <Box paddingInline={4} key={item.id}>
                  {idx !== 0 && (
                    <Box>
                      <Typography
                        variant="body1"
                        fontWeight={600}
                        my={2}
                        mx={1.5}
                      >
                        {getValues(`manager.${idx}.field`)}
                      </Typography>
                    </Box>
                  )}

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
                        {item.field !== 'Sample' && (
                          <Grid
                            item
                            xs
                            sx={{
                              width: 'fit-content',
                              minWidth: 130,
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
                                <InputLabel id="">Fish Farm *</InputLabel>
                                <Select
                                  labelId="feed-supply-select-label9"
                                  className="fish-manager"
                                  id="feed-supply-select9"
                                  label="Fish Farm*"
                                  // disabled={
                                  //   item.field === "Harvest" ||
                                  //   item.field === "Mortalities" ||
                                  //   idx === 0
                                  //     ? true
                                  //     : false
                                  // }
                                  slotProps={{
                                    input: {
                                      readOnly:
                                        item.field === 'Stock' ||
                                        item.field === 'Harvest' ||
                                        item.field === 'Mortalities' ||
                                        idx === 0
                                          ? true
                                          : false,
                                    },
                                  }}
                                  {...register(`manager.${idx}.fishFarm`, {
                                    required:
                                      watch(`manager.${idx}.fishFarm`) &&
                                      idx !== 0
                                        ? false
                                        : true,
                                  })}
                                  onChange={(e) => {
                                    const selectedFishFarm = e.target.value;
                                    if (item.field === 'Stock') {
                                      setValue(
                                        `manager.0.fishFarm`,
                                        e.target.value,
                                      );
                                      setSelectedFarm(selectedFishFarm);
                                    } // Set selected farm for this specific entry
                                    setValue(
                                      `manager.${idx}.fishFarm`,
                                      selectedFishFarm,
                                    ); // Set the value for this fishFarm
                                    setValue(
                                      `manager.${idx}.productionUnit`,
                                      '',
                                    ); // Reset production unit for the current entry
                                  }}
                                  value={
                                    getValues(`manager.${idx}.fishFarm`) || ''
                                  } // Ensure only the current entry is updated
                                >
                                  {farms?.map((farm: Farm, i) => (
                                    <MenuItem value={String(farm.id)} key={i}>
                                      {farm.name}
                                    </MenuItem>
                                  ))}
                                </Select>

                                {errors &&
                                  errors?.manager &&
                                  errors?.manager[idx] &&
                                  idx !== 0 &&
                                  errors?.manager[idx].fishFarm &&
                                  errors?.manager[idx].fishFarm.type ===
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
                        {item.field !== 'Sample' && (
                          <Grid
                            xs
                            item
                            sx={{
                              width: 'fit-content',
                              minWidth: 130,
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
                                <InputLabel id="">Production Unit *</InputLabel>
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
                                  slotProps={{
                                    input: {
                                      readOnly:
                                        item.field === 'Stock' ||
                                        item.field === 'Harvest' ||
                                        item.field === 'Mortalities' ||
                                        idx === 0
                                          ? true
                                          : false,
                                    },
                                  }}
                                  {...register(
                                    `manager.${idx}.productionUnit`,
                                    {
                                      required:
                                        watch(
                                          `manager.${idx}.productionUnit`,
                                        ) && idx !== 0
                                          ? false
                                          : true,
                                      onChange: (e) =>
                                        item.field === 'Stock' &&
                                        setValue(
                                          `manager.0.productionUnit`,
                                          e.target.value,
                                        ),
                                    },
                                  )}
                                  inputProps={{
                                    shrink: watch(
                                      `manager.${idx}.productionUnit`,
                                    ),
                                  }}
                                  value={
                                    watch(`manager.${idx}.productionUnit`) || ''
                                  }
                                >
                                  {(() => {
                                    const selectedFarm = farms?.find(
                                      (farm) =>
                                        farm.id ===
                                        watch(`manager.${idx}.fishFarm`),
                                    );

                                    return selectedFarm ? (
                                      selectedFarm?.productionUnits?.map(
                                        (unit) => (
                                          <MenuItem
                                            value={String(unit.id)}
                                            key={unit.id}
                                            disabled={
                                              item.field === 'Transfer' &&
                                              selectedProduction?.productionUnitId ===
                                                unit.id
                                                ? true
                                                : false
                                            }
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
                                  !watch(`manager.${idx}.productionUnit`) &&
                                  idx !== 0 &&
                                  errors?.manager &&
                                  errors?.manager[idx] &&
                                  errors?.manager[idx].productionUnit && (
                                    <Typography
                                      variant="body2"
                                      color="red"
                                      fontSize={13}
                                      mt={0.5}
                                    >
                                      This field is required
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
                        {item.field !== 'Sample' && (
                          <Grid
                            xs
                            item
                            sx={{
                              width: 'fit-content',
                              minWidth: 130,
                            }}
                          >
                            <Box mb={2} width={'100%'}>
                              <FormControl
                                fullWidth
                                className={`form-input ${
                                  idx === 0 && 'selected'
                                }`}
                                focused
                              >
                                <InputLabel id="">Batch No. *</InputLabel>
                                <Select
                                  labelId="feed-supply-select-label9"
                                  className="fish-manager"
                                  id="feed-supply-select9"
                                  label="Batch No. *"
                                  // disabled={
                                  //   item.field === "Harvest" ||
                                  //   item.field === "Mortalities" ||
                                  //   idx === 0
                                  //     ? true
                                  //     : false
                                  // }
                                  slotProps={{
                                    input: {
                                      readOnly:
                                        item.field === 'Harvest' ||
                                        item.field === 'Mortalities' ||
                                        idx === 0
                                          ? true
                                          : false,
                                    },
                                  }}
                                  {...register(`manager.${idx}.batchNumber`, {
                                    required:
                                      watch(`manager.${idx}.batchNumber`) &&
                                      idx !== 0
                                        ? false
                                        : true,
                                    onChange: (e) =>
                                      item.field === 'Stock' &&
                                      setValue(
                                        `manager.0.batchNumber`,
                                        e.target.value,
                                      ),
                                  })}
                                  inputProps={{
                                    shrink: watch(`manager.${idx}.batchNumber`),
                                  }}
                                  value={
                                    watch(`manager.${idx}.batchNumber`) || ''
                                  } // Ensure only the current entry is updated
                                >
                                  {batches?.map(
                                    (
                                      batch: {
                                        batchNumber: string;
                                        id: number;
                                      },
                                      i,
                                    ) => (
                                      <MenuItem
                                        value={String(batch.id)}
                                        key={i}
                                      >
                                        {batch.batchNumber}
                                      </MenuItem>
                                    ),
                                  )}
                                </Select>

                                {errors &&
                                  !watch(`manager.${idx}.batchNumber`) &&
                                  idx !== 0 &&
                                  errors.manager &&
                                  errors.manager[idx] &&
                                  errors.manager[idx].batchNumber && (
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
                        {/* {item.field === "Sample" && ( */}
                        {idx !== 0 && (
                          <Grid
                            xs
                            item
                            sx={{
                              width: 'fit-content',
                              minWidth: 130,
                            }}
                          >
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                              <Controller
                                name={`manager.${idx}.currentDate`}
                                control={control}
                                rules={{ required: 'This field is required.' }}
                                render={({ field, fieldState: { error } }) => (
                                  <>
                                    <DatePicker
                                      {...field}
                                      label="Current Date * "
                                      className="form-input"
                                      sx={{
                                        width: '100%',
                                      }}
                                      onChange={(date) => {
                                        if (date && date.isValid()) {
                                          field.onChange(date); // Set a valid Dayjs date
                                          setValue(
                                            `manager.${idx}.currentDate`,
                                            date,
                                          );
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
                        )}
                        {/* // )} */}

                        {watchedFields[idx].field === 'Sample' && (
                          <Grid
                            item
                            xs
                            sx={{
                              width: 'fit-content',
                              minWidth: 130,
                            }}
                          >
                            <TextField
                              label="Number of fish *"
                              type="number"
                              {...register(`manager.${idx}.noOfFish`, {
                                required: true,
                                maxLength: 10,
                              })}
                              focused
                              className="form-input"
                              sx={{ width: '100%' }}
                            />

                            {errors &&
                              errors.manager &&
                              errors.manager[idx] &&
                              errors.manager[idx].noOfFish && (
                                <Typography
                                  variant="body2"
                                  color="red"
                                  fontSize={13}
                                  mt={0.5}
                                >
                                  {errors.manager[idx].noOfFish?.type ===
                                  'required'
                                    ? validationMessage.required
                                    : errors.manager[idx].noOfFish?.type ===
                                        'maxLength'
                                      ? validationMessage.numberMaxLength
                                      : ''}
                                </Typography>
                              )}
                          </Grid>
                        )}

                        {watchedFields[idx].field === 'Sample' && (
                          <Grid
                            item
                            xs
                            sx={{
                              width: 'fit-content',
                              minWidth: 130,
                            }}
                          >
                            <Box position={'relative'}>
                              <TextField
                                label="Total weight *"
                                type="number"
                                {...register(`manager.${idx}.totalWeight`, {
                                  required: true,
                                })}
                                focused
                                className="form-input"
                                sx={{ width: '100%' }}
                              />
                              <Typography
                                variant="body2"
                                color="#555555AC"
                                sx={{
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
                                g
                              </Typography>
                              {errors &&
                                errors.manager &&
                                errors.manager[idx] &&
                                errors.manager[idx].totalWeight && (
                                  <Typography
                                    variant="body2"
                                    color="red"
                                    fontSize={13}
                                    mt={0.5}
                                  >
                                    {validationMessage.required}
                                  </Typography>
                                )}
                            </Box>
                          </Grid>
                        )}

                        {watchedFields[idx].field !== 'Sample' && (
                          <Grid
                            xs
                            item
                            sx={{
                              width: 'fit-content',
                              minWidth: 130,
                            }}
                          >
                            <Box
                              display={'flex'}
                              gap={2}
                              alignItems={'center'}
                              position={'relative'}
                            >
                              <TextField
                                label="Biomass *"
                                type="text"
                                className={`form-input ${
                                  idx === 0 && 'selected'
                                }`}
                                // disabled={idx === 0 ? true : false}
                                slotProps={{
                                  input: {
                                    readOnly:
                                      (watchedFields[idx].field !== 'Sample' &&
                                        !watchedFields[idx].productionUnit) ||
                                      idx === 0
                                        ? true
                                        : false,
                                  },
                                }}
                                sx={{ width: '100%' }}
                                {...register(`manager.${idx}.biomass`, {
                                  required: true,
                                  pattern: /^\d+(\.\d+)?(e[+-]?\d+)?$/,
                                  maxLength: 10,
                                })}
                                onClick={() =>
                                  handleCheckUnitSelected(idx, 'biomass')
                                }
                                focused
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
                                kg
                              </Typography>
                            </Box>
                            <Typography
                              variant="body2"
                              color="red"
                              fontSize={13}
                              mt={0.5}
                            ></Typography>
                            {errors &&
                              errors.manager &&
                              errors.manager[idx] &&
                              errors.manager[idx].biomass &&
                              errors.manager[idx].biomass.type ===
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
                            {errors &&
                              errors.manager &&
                              errors.manager[idx] &&
                              errors.manager[idx].biomass &&
                              errors.manager[idx].biomass.type ===
                                'pattern' && (
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
                              errors.manager &&
                              errors.manager[idx] &&
                              errors.manager[idx].biomass &&
                              errors.manager[idx].biomass.type ===
                                'maxLength' && (
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
                        )}
                        {watchedFields[idx].field !== 'Sample' && (
                          <Grid
                            xs
                            item
                            sx={{
                              width: 'fit-content',
                              minWidth: 130,
                              position: 'relative',
                            }}
                          >
                            <TextField
                              label="Fish Count *"
                              type="text"
                              className={`form-input ${
                                idx === 0 && 'selected'
                              }`}
                              sx={{ width: '100%' }}
                              // disabled={idx === 0 ? true : false}

                              slotProps={{
                                input: {
                                  readOnly:
                                    (watchedFields[idx].field !== 'Sample' &&
                                      !watchedFields[idx].productionUnit) ||
                                    idx === 0
                                      ? true
                                      : false,
                                },
                              }}
                              {...register(`manager.${idx}.count`, {
                                required: true,
                                pattern: /^\d+(\.\d+)?(e[+-]?\d+)?$/,
                                maxLength: 10,
                              })}
                              onClick={() =>
                                handleCheckUnitSelected(idx, 'fishCount')
                              }
                              focused
                            />
                            <Typography
                              variant="body2"
                              color="#555555AC"
                              sx={{
                                color: `${idx === 0 ? 'black' : 'grey'}`,
                                position: 'absolute',
                                right: 6,
                                top: '29px',
                                transform: 'translate(-6px, 0px)',
                                backgroundColor: '#fff',
                                height: 30,
                                display: 'grid',
                                placeItems: 'center',
                                zIndex: 1,
                                pl: 1,
                              }}
                            >
                              n
                            </Typography>
                            {errors &&
                              errors.manager &&
                              errors.manager[idx] &&
                              errors.manager[idx].count &&
                              errors.manager[idx].count.type === 'required' && (
                                <Typography
                                  variant="body2"
                                  color="red"
                                  fontSize={13}
                                  mt={0.5}
                                >
                                  {validationMessage.required}
                                </Typography>
                              )}
                            {errors &&
                              errors.manager &&
                              errors.manager[idx] &&
                              errors.manager[idx].count &&
                              errors.manager[idx].count.type === 'pattern' && (
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
                              errors.manager &&
                              errors.manager[idx] &&
                              errors.manager[idx].count &&
                              errors.manager[idx].count.type ===
                                'maxLength' && (
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
                        )}
                        <Grid
                          xs
                          item
                          sx={{
                            width: 'fit-content',
                            minWidth: 130,
                            position: 'relative',
                          }}
                        >
                          <Box position={'relative'}>
                            {idx !== 0 &&
                              watchedFields[idx].field !== 'Sample' && (
                                <Box onClick={() => handleMeanWeight(item)}>
                                  <Typography
                                    variant="body2"
                                    color="#555555AC"
                                    sx={{
                                      position: 'absolute',
                                      // right: 6,
                                      right: 0,
                                      top: '53px',
                                      transform: 'translate(-6px, -40px)',
                                      backgroundColor: '#06A19B',
                                      height: 30,
                                      display: 'grid',
                                      placeItems: 'center',
                                      zIndex: 999,
                                      px: 0.75,
                                      borderRadius: 1,
                                      cursor: 'pointer',
                                      // textOverflow: "ellipsis",
                                      // whiteSpace: "nowrap",
                                      // minHeight: "1.4375em",
                                      // overflow: "hidden",
                                    }}
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="1.4em"
                                      height="1.4em"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        fill="#fff"
                                        d="M8 18h1.5v-2h2v-1.5h-2v-2H8v2H6V16h2zm5-.75h5v-1.5h-5zm0-2.5h5v-1.5h-5zm1.1-3.8l1.4-1.4l1.4 1.4l1.05-1.05l-1.4-1.45l1.4-1.4L16.9 6l-1.4 1.4L14.1 6l-1.05 1.05l1.4 1.4l-1.4 1.45zM6.25 9.2h5V7.7h-5zM5 21q-.825 0-1.413-.587T3 19V5q0-.825.588-1.412T5 3h14q.825 0 1.413.588T21 5v14q0 .825-.587 1.413T19 21zm0-2h14V5H5zM5 5v14z"
                                      />
                                    </svg>
                                  </Typography>
                                </Box>
                              )}

                            <TextField
                              label="Mean Weights *"
                              type="text"
                              className={`form-input ${
                                idx === 0 && 'selected'
                              }`}
                              sx={{
                                width: '100%',
                              }}
                              slotProps={{
                                input: { readOnly: idx === 0 ? true : false },
                              }}
                              {...register(`manager.${idx}.meanWeight`, {
                                required:
                                  watch(`manager.${idx}.meanWeight`) &&
                                  idx !== 0
                                    ? false
                                    : true,
                                pattern: validationPattern.numbersWithDot,
                                maxLength: 10,
                              })}
                              focused
                            />
                          </Box>
                          {idx === 0 && (
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
                              g
                            </Typography>
                          )}
                          {errors &&
                            !watch(`manager.${idx}.meanWeight`) &&
                            idx !== 0 &&
                            errors.manager &&
                            errors.manager[idx] &&
                            errors.manager[idx].meanWeight &&
                            errors.manager[idx].meanWeight.type ===
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
                          {errors &&
                            errors.manager &&
                            errors.manager[idx] &&
                            errors.manager[idx].meanWeight &&
                            errors.manager[idx].meanWeight.type ===
                              'pattern' && (
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
                            errors.manager &&
                            errors.manager[idx] &&
                            errors.manager[idx].meanWeight &&
                            errors.manager[idx].meanWeight.type ===
                              'maxLength' && (
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
                            minWidth: 130,
                            position: 'relative',
                          }}
                        >
                          <Box position={'relative'}>
                            {idx !== 0 && (
                              <Box onClick={() => handleMeanLength(item)}>
                                <Typography
                                  variant="body2"
                                  color="#555555AC"
                                  sx={{
                                    position: 'absolute',
                                    // right: 6,
                                    right: 0,
                                    top: '53px',
                                    transform: 'translate(-6px, -40px)',
                                    backgroundColor: '#06A19B',
                                    height: 30,
                                    display: 'grid',
                                    placeItems: 'center',
                                    zIndex: 999,
                                    px: 0.75,
                                    borderRadius: 1,
                                    cursor: 'pointer',
                                  }}
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="1.4em"
                                    height="1.4em"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      fill="#fff"
                                      d="M8 18h1.5v-2h2v-1.5h-2v-2H8v2H6V16h2zm5-.75h5v-1.5h-5zm0-2.5h5v-1.5h-5zm1.1-3.8l1.4-1.4l1.4 1.4l1.05-1.05l-1.4-1.45l1.4-1.4L16.9 6l-1.4 1.4L14.1 6l-1.05 1.05l1.4 1.4l-1.4 1.45zM6.25 9.2h5V7.7h-5zM5 21q-.825 0-1.413-.587T3 19V5q0-.825.588-1.412T5 3h14q.825 0 1.413.588T21 5v14q0 .825-.587 1.413T19 21zm0-2h14V5H5zM5 5v14z"
                                    />
                                  </svg>
                                </Typography>
                              </Box>
                            )}
                            <TextField
                              label="Mean Length *"
                              type="text"
                              className={`form-input ${
                                idx === 0 && 'selected'
                              }`}
                              sx={{
                                width: '100%',
                              }}
                              slotProps={{
                                input: { readOnly: idx === 0 ? true : false },
                              }}
                              {...register(
                                `manager.${idx}.meanLength` as const,
                                {
                                  required:
                                    watch(`manager.${idx}.meanLength`) &&
                                    idx !== 0
                                      ? false
                                      : true,
                                  pattern: validationPattern.numbersWithDot,
                                  maxLength: 10,
                                },
                              )}
                              focused
                            />
                            {idx === 0 && (
                              <Typography
                                variant="body2"
                                color="#555555AC"
                                sx={{
                                  color: `${idx === 0 ? 'black' : 'grey'}`,
                                  position: 'absolute',
                                  right: 3,
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
                                mm
                              </Typography>
                            )}

                            {errors &&
                              !watch(`manager.${idx}.meanLength`) &&
                              idx !== 0 &&
                              errors.manager &&
                              errors.manager[idx] &&
                              errors.manager[idx].meanLength &&
                              errors.manager[idx].meanLength.type ===
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
                            {errors &&
                              errors.manager &&
                              errors.manager[idx] &&
                              errors.manager[idx].meanLength &&
                              errors.manager[idx].meanLength.type ===
                                'pattern' && (
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
                              errors.manager &&
                              errors.manager[idx] &&
                              errors.manager[idx].meanLength &&
                              errors.manager[idx].meanLength.type ===
                                'maxLength' && (
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
                        {item.field !== 'Sample' && (
                          <Grid
                            item
                            xs
                            sx={{
                              width: 'fit-content',
                              minWidth: 130,
                            }}
                          >
                            <Box
                              display={'flex'}
                              gap={2}
                              alignItems={'center'}
                              position={'relative'}
                            >
                              <TextField
                                label={`Stocking Density *`}
                                type="text"
                                className={`form-input ${
                                  idx === 0 && 'selected'
                                }`}
                                // disabled={
                                //   idx === 0 ||
                                //   item.field !== "Harvest" ||
                                //   item.field !== "Mortalities"
                                //     ? true
                                //     : false
                                // }
                                slotProps={{
                                  input: { readOnly: true },
                                }}
                                sx={{
                                  width: '100%',
                                }}
                                focused
                                {...register(
                                  `manager.${idx}.stockingDensityKG` as const,
                                  {
                                    required: watch(
                                      `manager.${idx}.stockingDensityKG`,
                                    )
                                      ? false
                                      : true,
                                    pattern: validationPattern.numbersWithDot,
                                  },
                                )}
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
                                {`(kg/${'m\u00B3'})`}
                              </Typography>
                            </Box>
                            <Typography
                              variant="body2"
                              color="red"
                              fontSize={13}
                              mt={0.5}
                            ></Typography>
                            {errors &&
                              !watch(`manager.${idx}.stockingDensityKG`) &&
                              errors.manager &&
                              errors.manager[idx] &&
                              errors.manager[idx].stockingDensityKG &&
                              errors.manager[idx].stockingDensityKG.type ===
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
                            {errors &&
                              errors.manager &&
                              errors.manager[idx] &&
                              errors.manager[idx].stockingDensityKG &&
                              errors.manager[idx].stockingDensityKG.type ===
                                'pattern' && (
                                <Typography
                                  variant="body2"
                                  color="red"
                                  fontSize={13}
                                  mt={0.5}
                                >
                                  {validationMessage.OnlyNumbersWithDot}
                                </Typography>
                              )}
                          </Grid>
                        )}
                        {item.field !== 'Sample' && (
                          <Grid
                            xs
                            item
                            sx={{
                              width: 'fit-content',
                              minWidth: 130,
                            }}
                          >
                            <Box
                              display={'flex'}
                              gap={2}
                              alignItems={'center'}
                              position={'relative'}
                            >
                              <TextField
                                label={`Stocking Density *`}
                                type="text"
                                className={`form-input ${
                                  idx === 0 && 'selected'
                                }`}
                                slotProps={{
                                  input: { readOnly: true },
                                }}
                                {...register(
                                  `manager.${idx}.stockingDensityNM` as const,
                                  {
                                    required: watch(
                                      `manager.${idx}.stockingDensityNM`,
                                    )
                                      ? false
                                      : true,
                                    pattern: validationPattern.numbersWithDot,
                                  },
                                )}
                                focused
                                sx={{
                                  width: '100%',
                                }}
                              />
                              <Typography
                                variant="body2"
                                color="rgba(0,0,0,0.2)"
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
                                {`(n/${'m\u00B3'})`}
                              </Typography>
                            </Box>
                            <Typography
                              variant="body2"
                              color="red"
                              fontSize={13}
                              mt={0.5}
                            ></Typography>
                            {errors &&
                              !watch(`manager.${idx}.stockingDensityNM`) &&
                              errors.manager &&
                              errors.manager[idx] &&
                              errors.manager[idx].stockingDensityNM &&
                              errors.manager[idx].stockingDensityNM.type ===
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
                            {errors &&
                              errors.manager &&
                              errors.manager[idx] &&
                              errors.manager[idx].stockingDensityNM &&
                              errors.manager[idx].stockingDensityNM.type ===
                                'pattern' && (
                                <Typography
                                  variant="body2"
                                  color="red"
                                  fontSize={13}
                                  mt={0.5}
                                >
                                  {validationMessage.OnlyNumbersWithDot}
                                </Typography>
                              )}
                          </Grid>
                        )}
                        {item.field !== 'Sample' && (
                          <Grid
                            item
                            xs
                            sx={{
                              width: 'fit-content',
                              minWidth: 130,
                            }}
                          >
                            <TextField
                              label="Stocking Level *"
                              type="text"
                              className={`form-input ${
                                idx === 0 && 'selected'
                              }`}
                              slotProps={{
                                input: { readOnly: true },
                              }}
                              focused
                              sx={{ width: '100%' }}
                              {...register(
                                `manager.${idx}.stockingLevel` as const,
                              )}
                            />
                            <Typography
                              variant="body2"
                              color="red"
                              fontSize={13}
                              mt={0.5}
                            ></Typography>
                          </Grid>
                        )}
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
                        onClick={() => handleDelete(item)}
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

                  <Divider
                    orientation="vertical"
                    sx={{
                      height: '100%',
                      borderBottom: '2px solid #E6E7E9 !important',
                      borderRight: 'none !important',
                      width: '100%',
                      marginLeft: '12px',
                      paddingBlock: '10px',
                    }}
                  />
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
                {productionMangeFields?.map((field, i) => {
                  return (
                    <MenuItem
                      onClick={() => handleCloseAnchor(field)}
                      key={i}
                      disabled={
                        selectedProduction?.batchNumberId &&
                        selectedProduction?.biomass &&
                        selectedProduction?.fishCount &&
                        selectedProduction?.meanLength &&
                        selectedProduction?.meanWeight &&
                        field === 'Stock'
                          ? true
                          : watchedFields[1]?.field === 'Stock'
                            ? true
                            : field === 'Stock' &&
                                selectedProduction?.batchNumberId &&
                                selectedProduction?.fishCount
                              ? true
                              : field === 'Harvest' ||
                                  field === 'Mortalities' ||
                                  field === 'Transfer' ||
                                  field === 'Sample'
                                ? watchedFields?.[0]?.count &&
                                  watchedFields?.[0]?.batchNumber
                                  ? false
                                  : true
                                : selectedProduction?.batchNumberId &&
                                    selectedProduction?.biomass &&
                                    selectedProduction?.fishCount &&
                                    selectedProduction?.meanLength &&
                                    selectedProduction?.meanWeight
                                  ? false
                                  : watchedFields.find(
                                        (field) => field.field === 'Stock',
                                      ) && field === 'Stock'
                                    ? true
                                    : false
                      }
                    >
                      {field}
                    </MenuItem>
                  );
                })}
              </Menu>
              <Button
                className=""
                type="submit"
                variant="contained"
                disabled={watchedFields.length > 1 ? false : true}
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
          <Confirmation
            open={openConfirmationModal}
            setOpen={setOpenConfirmationModal}
            remove={remove}
            watchedFields={watchedFields}
            selectedProductionFishaFarmId={selectedProduction?.fishFarmId ?? ''}
            setIsStockDeleted={setIsStockDeleted}
            clearErrors={clearErrors}
          />
          <CalculateMeanWeigth
            open={isMeanWeigthCal}
            setOpen={setIsMeanWeigthCal}
            setAvgOfMeanWeight={setAvgOfMeanWeight}
          />
          <CalculateMeanLength
            open={isMeanLengthCal}
            setOpen={setIsMeanLengthCal}
            setAvgOfMeanLength={setAvgOfMeanLength}
          />
        </Stack>
      </Modal>
    </div>
  );
};

export default TransferModal;
