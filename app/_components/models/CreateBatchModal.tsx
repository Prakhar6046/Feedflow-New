'use client';
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Close as CloseIcon } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs, { Dayjs } from 'dayjs';
import toast from 'react-hot-toast';
import { clientSecureFetch } from '../../_lib/clientSecureFetch';
import { Farm } from '@/app/_typeModels/Farm';
import { getCookie } from 'cookies-next';
import { SingleOrganisation } from '@/app/_typeModels/Organization';
import { getDayMonthDifference } from '@/app/_lib/utils';

interface BatchToMerge {
  id: number;
  batchNumber: string;
  spawningDate: string;
  hatchingDate: string;
  spawningNumber?: number;
  broodstockMale?: string;
  broodstockFemale?: string;
  age?: string;
  speciesId?: string | null; // Species ID from existing stock batch
}

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  onBatchCreated: (batchId: number, batchNumber: string) => void;
  selectedFarm: Farm | null;
  organisationId: number;
  existingBatchNumber?: string;
  existingSpeciesId?: string | null;
  organisations?: SingleOrganisation[];
  batchesToMerge?: BatchToMerge[]; // Batches being merged for restocking
  isRestocking?: boolean; // Flag to indicate if this is a restocking operation
}

interface FormInputs {
  batchNumber: string;
  organisation: string;
  hatchingDate: Dayjs | null;
  spawningDate: Dayjs | null;
  spawningNumber: string;
  speciesId: string;
  broodstockMale: string;
  broodstockFemale: string;
  useAutoGenerate: boolean;
}

const CreateBatchModal: React.FC<Props> = ({
  open,
  setOpen,
  onBatchCreated,
  selectedFarm,
  organisationId,
  existingBatchNumber,
  existingSpeciesId,
  organisations,
  batchesToMerge = [],
  isRestocking = false,
}) => {
  const [speciesList, setSpeciesList] = useState<any[]>([]);
  const featuredSpecies = speciesList?.filter((sp) => sp.isFeatured);
  const [isLoading, setIsLoading] = useState(false);
  const [useAutoGenerate, setUseAutoGenerate] = useState(false);
  const [hatcheryInfo, setHatcheryInfo] = useState<any>(null);
  const [calculatedAge, setCalculatedAge] = useState<string>('');

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<FormInputs>({
    defaultValues: {
      batchNumber: '',
      organisation: String(organisationId),
      hatchingDate: dayjs(),
      spawningDate: dayjs(),
      spawningNumber: '1', // Default to '1'
      speciesId: '',
      broodstockMale: '',
      broodstockFemale: '',
      useAutoGenerate: false,
    },
  });

  const watchedHatchingDate = watch('hatchingDate');
  const watchedSpawningDate = watch('spawningDate');
  const watchedSpawningNumber = watch('spawningNumber');
  const watchedSpeciesId = watch('speciesId');

  // Fetch species list
  useEffect(() => {
    const fetchSpecies = async () => {
      try {
        const response = await clientSecureFetch('/api/species', {
          method: 'GET',
        });
        const data = await response.json();
        setSpeciesList(data || []);
      } catch (error) {
        console.error('Error fetching species:', error);
      }
    };
    fetchSpecies();
  }, []);
const generateBatchNumber = () => {
  if (isRestocking && selectedFarm) {
    const mergerDate = dayjs();
    const farmCode = selectedFarm.name?.charAt(0).toUpperCase() || 'F';
    const year = mergerDate.format('YY');
    const month = mergerDate.format('MM');
    const generated = `${farmCode}-${year}/${month}`;
    setValue('batchNumber', generated);
    return;
  }

  if (watchedHatchingDate && watchedSpawningNumber && hatcheryInfo) {
    const hatchingDateStr = watchedHatchingDate.format('MM/DD/YYYY');
    const hatcheryCode = hatcheryInfo.code || 'HATCH';
    const spawningNum = watchedSpawningNumber || '1';

    // species code
    let speciesCode = 'F';
    const selectedSpecies = featuredSpecies?.find(
      (s) => s.id === watchedSpeciesId,
    );
    if (selectedSpecies?.name) {
      speciesCode = selectedSpecies.name.charAt(0).toUpperCase();
    }

    const generated = `${hatchingDateStr}-${hatcheryCode}-${spawningNum}-${speciesCode}`;
    setValue('batchNumber', generated);
  }
};

  // Fetch hatchery info for auto-generation
  useEffect(() => {
    const fetchHatchery = async () => {
      if (!organisationId) return;
      try {
        const response = await clientSecureFetch(
          `/api/organisation/hatchery?organisationId=${organisationId}`,
          {
            method: 'GET',
          },
        );
        const data = await response.json();
        if (data.status && data.data && data.data.length > 0) {
          // Find hatchery for this organisation
          const orgHatchery = data.data.find(
            (org: any) => org.id === organisationId,
          );
          if (
            orgHatchery &&
            orgHatchery.hatchery &&
            orgHatchery.hatchery.length > 0
          ) {
            setHatcheryInfo(orgHatchery.hatchery[0]);
          }
        }
      } catch (error) {
        console.error('Error fetching hatchery:', error);
      }
    };
    fetchHatchery();
  }, [organisationId]);

  // Calculate average dates when batches are being merged
  useEffect(() => {
    if (isRestocking && batchesToMerge && batchesToMerge.length > 0) {
      // Calculate average spawning date
      const spawningDates = batchesToMerge
        .map((batch) => dayjs(batch.spawningDate))
        .filter((date) => date.isValid());
      
      if (spawningDates.length > 0) {
        const totalDays = spawningDates.reduce((sum, date) => sum + date.valueOf(), 0);
        const avgSpawningDate = dayjs(totalDays / spawningDates.length);
        setValue('spawningDate', avgSpawningDate);
      }

      // Calculate average hatching date
      const hatchingDates = batchesToMerge
        .map((batch) => dayjs(batch.hatchingDate))
        .filter((date) => date.isValid());
      
      if (hatchingDates.length > 0) {
        const totalDays = hatchingDates.reduce((sum, date) => sum + date.valueOf(), 0);
        const avgHatchingDate = dayjs(totalDays / hatchingDates.length);
        setValue('hatchingDate', avgHatchingDate);
        
        // Calculate age from average hatching date (NOT spawning date)
        // Age = Today's date - Hatching date
        const ageStr = getDayMonthDifference(avgHatchingDate.format('MM/DD/YYYY'));
        setCalculatedAge(ageStr);
      }

      // Calculate average spawning number
      const spawningNumbers = batchesToMerge
        .map((batch) => batch.spawningNumber)
        .filter((num) => num !== undefined && num !== null && !isNaN(Number(num)));
      
      if (spawningNumbers.length > 0) {
        const avgSpawningNumber = Math.round(
          spawningNumbers.reduce((sum, num) => sum + Number(num), 0) / spawningNumbers.length
        );
        setValue('spawningNumber', String(avgSpawningNumber));
      }

      // Calculate average broodstock male
      const broodstockMales = batchesToMerge
        .map((batch) => batch.broodstockMale)
        .filter((val) => val !== undefined && val !== null && val !== '');
      
      if (broodstockMales.length > 0) {
        // If all are numbers, calculate average; otherwise use first non-empty value
        const numericValues = broodstockMales
          .map((val) => parseFloat(String(val)))
          .filter((num) => !isNaN(num));
        
        if (numericValues.length > 0) {
          const avgMale = Math.round(
            numericValues.reduce((sum, num) => sum + num, 0) / numericValues.length
          );
          setValue('broodstockMale', String(avgMale));
        } else {
          setValue('broodstockMale', String(broodstockMales[0]));
        }
      }

      // Calculate average broodstock female
      const broodstockFemales = batchesToMerge
        .map((batch) => batch.broodstockFemale)
        .filter((val) => val !== undefined && val !== null && val !== '');
      
      if (broodstockFemales.length > 0) {
        // If all are numbers, calculate average; otherwise use first non-empty value
        const numericValues = broodstockFemales
          .map((val) => parseFloat(String(val)))
          .filter((num) => !isNaN(num));
        
        if (numericValues.length > 0) {
          const avgFemale = Math.round(
            numericValues.reduce((sum, num) => sum + num, 0) / numericValues.length
          );
          setValue('broodstockFemale', String(avgFemale));
        } else {
          setValue('broodstockFemale', String(broodstockFemales[0]));
        }
      }
    }
  }, [isRestocking, batchesToMerge, setValue]);

  // Auto-generate batch number when fields change
  useEffect(() => {
    if (!useAutoGenerate) {
      // If auto-generate is disabled, clear the batch number
      setValue('batchNumber', '');
      return;
    }

    // For restocking: Generate batch number with farm code and merger date
    if (isRestocking && selectedFarm) {
      // Use merger date format "F-25/01" (Farm code - Year/Month)
      // Example: F-25/01 for Fizantekraal farm in January 2025
      const mergerDate = dayjs(); // Current date (merger date)
      const farmCode = selectedFarm.name?.charAt(0).toUpperCase() || 'F';
      const year = mergerDate.format('YY');
      const month = mergerDate.format('MM');
      const generatedBatch = `${farmCode}-${year}/${month}`;
      setValue('batchNumber', generatedBatch);
      return;
    }

    // For regular batch creation (non-restocking)
    // Generate batch number: hatchingDate-hatcheryCode-spawningNumber-speciesCode
    // Use current hatching date or default to today
    const hatchingDate = watchedHatchingDate && watchedHatchingDate.isValid() 
      ? watchedHatchingDate 
      : dayjs();
    const hatchingDateStr = hatchingDate.format('MM/DD/YYYY');
    
    const hatcheryName = watch('organisation') || '';
    // Use hatchery name (first 3 chars) or hatchery code from info
    // Check if hatcheryName is not just the organisationId number
    let hatcheryCode = 'HATCH';
    if (hatcheryInfo?.code) {
      hatcheryCode = hatcheryInfo.code;
    } else if (hatcheryName && hatcheryName !== String(organisationId) && hatcheryName.trim() !== '') {
      hatcheryCode = hatcheryName.slice(0, 3).toUpperCase();
    }
    
    const spawningNum = watchedSpawningNumber || '1';

    // Get species code from selected species
    let speciesCode = 'F';
    if (watchedSpeciesId) {
      const selectedSpecies = featuredSpecies.find(
        (s) => s.id === watchedSpeciesId,
      );
      if (selectedSpecies && selectedSpecies.name) {
        speciesCode = selectedSpecies.name.charAt(0).toUpperCase();
      }
    } else if (hatcheryInfo?.fishSpecie) {
      speciesCode = hatcheryInfo.fishSpecie.charAt(0).toUpperCase();
    }

    const generatedBatch = `${hatchingDateStr}-${hatcheryCode}-${spawningNum}-${speciesCode}`;
    setValue('batchNumber', generatedBatch);
  }, [
    useAutoGenerate,
    watchedHatchingDate,
    watchedSpawningNumber,
    watchedSpeciesId,
    hatcheryInfo,
    featuredSpecies,
    setValue,
    isRestocking,
    selectedFarm,
    watch,
    organisationId,
  ]);

  // Set species when modal opens or existingSpeciesId changes
  // For restocking: Get speciesId from batchesToMerge if available, otherwise use existingSpeciesId prop
  useEffect(() => {
    if (open) {
      // For restocking: Try to get speciesId from batchesToMerge first
      if (isRestocking && batchesToMerge && batchesToMerge.length > 0) {
        const speciesFromBatch = batchesToMerge[0]?.speciesId;
        if (speciesFromBatch) {
          setValue('speciesId', speciesFromBatch);
          return;
        }
      }
      // Otherwise use existingSpeciesId prop
      if (existingSpeciesId) {
        setValue('speciesId', existingSpeciesId);
      } else {
        setValue('speciesId', '');
      }
    }
  }, [open, existingSpeciesId, isRestocking, batchesToMerge, setValue]);

  // Generate batch number immediately when modal opens for restocking (if auto-generate is enabled)
  useEffect(() => {
    if (open && isRestocking && selectedFarm && useAutoGenerate) {
      // Use merger date format "F-25/01" (Farm code - Year/Month)
      // Example: F-25/01 for Fizantekraal farm in January 2025
      const mergerDate = dayjs(); // Current date (merger date)
      const farmCode = selectedFarm.name?.charAt(0).toUpperCase() || 'F';
      const year = mergerDate.format('YY');
      const month = mergerDate.format('MM');
      const generatedBatch = `${farmCode}-${year}/${month}`;
      setValue('batchNumber', generatedBatch);
    }
  }, [open, isRestocking, selectedFarm, useAutoGenerate, setValue]);

  // Initialize default values when modal opens (for non-restocking)
  useEffect(() => {
    if (open && !isRestocking) {
      // Set default spawning number if empty
      const currentSpawningNumber = watch('spawningNumber');
      if (!currentSpawningNumber || currentSpawningNumber.trim() === '') {
        setValue('spawningNumber', '1');
      }
    }
  }, [open, isRestocking, setValue, watch]);

  // Auto-calculate age when hatching date changes (for non-restocking)
  // Age = Today's date - Hatching date
  useEffect(() => {
    if (!isRestocking && watchedHatchingDate && watchedHatchingDate.isValid()) {
      const ageStr = getDayMonthDifference(watchedHatchingDate.format('MM/DD/YYYY'));
      setCalculatedAge(ageStr);
    }
  }, [watchedHatchingDate, isRestocking]);

  const handleClose = () => {
    setOpen(false);
    reset();
    setUseAutoGenerate(false);
    setHatcheryInfo(null);
  };

  const onSubmit = async (data: FormInputs) => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      if (!selectedFarm) {
        toast.error('Please select a farm first');
        setIsLoading(false);
        return;
      }

      if (!data.speciesId) {
        toast.error('Please select a species');
        setIsLoading(false);
        return;
      }

      const loggedUser = getCookie('logged-user');
      const userData = loggedUser ? JSON.parse(loggedUser) : null;

      // For restocking: Calculate averages from existing stock data + new batch data
      let finalHatchingDate = data.hatchingDate?.format('MM/DD/YYYY') || dayjs().format('MM/DD/YYYY');
      let finalSpawningDate = data.spawningDate?.format('MM/DD/YYYY') || dayjs().format('MM/DD/YYYY');
      let finalSpawningNumber = Number(data.spawningNumber) || 1;
      let finalBroodstockMale = data.broodstockMale || '';
      let finalBroodstockFemale = data.broodstockFemale || '';
      let finalAge = calculatedAge;

      if (isRestocking && batchesToMerge && batchesToMerge.length > 0) {
        // Combine existing stock data with new batch data
        const allBatches = [
          ...batchesToMerge,
          {
            id: 0, // Temporary ID for new batch
            batchNumber: '',
            spawningDate: data.spawningDate?.format('MM/DD/YYYY') || '',
            hatchingDate: data.hatchingDate?.format('MM/DD/YYYY') || '',
            spawningNumber: Number(data.spawningNumber) || 1,
            broodstockMale: data.broodstockMale || '',
            broodstockFemale: data.broodstockFemale || '',
          },
        ];

        // Calculate average spawning date
        const spawningDates = allBatches
          .map((batch) => dayjs(batch.spawningDate))
          .filter((date) => date.isValid());
        
        if (spawningDates.length > 0) {
          const totalDays = spawningDates.reduce((sum, date) => sum + date.valueOf(), 0);
          const avgSpawningDate = dayjs(totalDays / spawningDates.length);
          finalSpawningDate = avgSpawningDate.format('MM/DD/YYYY');
        }

        // Calculate average hatching date
        const hatchingDates = allBatches
          .map((batch) => dayjs(batch.hatchingDate))
          .filter((date) => date.isValid());
        
        if (hatchingDates.length > 0) {
          const totalDays = hatchingDates.reduce((sum, date) => sum + date.valueOf(), 0);
          const avgHatchingDate = dayjs(totalDays / hatchingDates.length);
          finalHatchingDate = avgHatchingDate.format('MM/DD/YYYY');
          
          // Calculate age from average hatching date (NOT spawning date)
          // Age = Today's date - Hatching date
          finalAge = getDayMonthDifference(finalHatchingDate);
        }

        // Calculate average spawning number
        const spawningNumbers = allBatches
          .map((batch) => batch.spawningNumber)
          .filter((num) => num !== undefined && num !== null && !isNaN(Number(num)));
        
        if (spawningNumbers.length > 0) {
          finalSpawningNumber = Math.round(
            spawningNumbers.reduce((sum, num) => sum + Number(num), 0) / spawningNumbers.length
          );
        }

        // Calculate average broodstock male
        const broodstockMales = allBatches
          .map((batch) => batch.broodstockMale)
          .filter((val) => val !== undefined && val !== null && val !== '');
        
        if (broodstockMales.length > 0) {
          const numericValues = broodstockMales
            .map((val) => parseFloat(String(val)))
            .filter((num) => !isNaN(num));
          
          if (numericValues.length > 0) {
            finalBroodstockMale = String(Math.round(
              numericValues.reduce((sum, num) => sum + num, 0) / numericValues.length
            ));
          } else {
            finalBroodstockMale = String(broodstockMales[0]);
          }
        }

        // Calculate average broodstock female
        const broodstockFemales = allBatches
          .map((batch) => batch.broodstockFemale)
          .filter((val) => val !== undefined && val !== null && val !== '');
        
        if (broodstockFemales.length > 0) {
          const numericValues = broodstockFemales
            .map((val) => parseFloat(String(val)))
            .filter((num) => !isNaN(num));
          
          if (numericValues.length > 0) {
            finalBroodstockFemale = String(Math.round(
              numericValues.reduce((sum, num) => sum + num, 0) / numericValues.length
            ));
          } else {
            finalBroodstockFemale = String(broodstockFemales[0]);
          }
        }
      } else {
        // For non-restocking: Calculate age from hatching date (NOT spawning date)
        // Age = Today's date - Hatching date
        if (!finalAge && data.hatchingDate) {
          finalAge = getDayMonthDifference(data.hatchingDate.format('MM/DD/YYYY'));
        }
      }

      const payload = {
        batchNumber:
          data.batchNumber || (useAutoGenerate ? data.batchNumber : ''),
        organisation: data.organisation, // Keep as string (hatchery name)
        hatchingDate: finalHatchingDate,
        spawningDate: finalSpawningDate,
        spawningNumber: finalSpawningNumber,
        speciesId: data.speciesId,
        broodstockMale: finalBroodstockMale,
        broodstockFemale: finalBroodstockFemale,
        organisationId: userData?.organisationId || organisationId,
        fishFarmId: selectedFarm.id,
        status: 'Stocked',
        age: finalAge || '0',
        productionUnits: '',
        isRestocked: isRestocking || false,
      };

      const response = await clientSecureFetch('/api/fish/createBatch', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      const res = await response.json();

      if (res.status && res.data) {
        toast.success('Batch created successfully');
        onBatchCreated(res.data.id, res.data.batchNumber);
        handleClose();
      } else {
        toast.error(res.message || 'Failed to create batch');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error creating batch:', error);
      toast.error('Something went wrong. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="create-batch-modal-title"
      aria-describedby="create-batch-modal-description"
    >
      <Stack
        bgcolor={'white'}
        borderRadius={2}
        mx={'auto'}
        height={'fit-content'}
        maxHeight={'90vh'}
        overflow={'auto'}
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%,-50%)',
          width: {
            md: '600px',
            sm: '70%',
            xs: '90%',
          },
        }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          padding={2}
          borderBottom="1px solid #e0e0e0"
        >
          <Typography variant="h6" fontWeight={600}>
            Create New Batch
          </Typography>
          <IconButton
            onClick={handleClose}
            sx={{
              color: 'inherit',
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        <Box sx={{ p: 3 }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={useAutoGenerate}
                      onChange={(e) => {
                        const newValue = e.target.checked;
                        setUseAutoGenerate(newValue);
                        setValue('useAutoGenerate', newValue);
                        if (!newValue) {
                          setValue('batchNumber', '');
                        }
                        // Trigger batch number generation when toggle is turned on
                        // The useEffect will handle the generation
                      }}
                    />
                  }
                  label="Auto-generate batch number"
                />
                {isRestocking && useAutoGenerate && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, ml: 4 }}>
                    Format: {selectedFarm?.name?.charAt(0).toUpperCase() || 'F'}-{dayjs().format('YY')}/{dayjs().format('MM')} (Farm code - Year/Month)
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Batch Number *"
                  fullWidth
                  {...register('batchNumber', {
                    required: !useAutoGenerate,
                  })}
                  disabled={useAutoGenerate}
                  value={watch('batchNumber') || ''}
                  helperText={
                    isRestocking && useAutoGenerate
                      ? `Batch number will be auto-generated: ${selectedFarm?.name?.charAt(0).toUpperCase() || 'F'}-${dayjs().format('YY')}/${dayjs().format('MM')} (Farm code - Year/Month)`
                      : isRestocking && !useAutoGenerate
                      ? 'Enter custom batch number for restocking'
                      : useAutoGenerate
                      ? 'Batch number will be auto-generated based on hatching date, hatchery code, spawning number, and species'
                      : 'Enter custom batch number'
                  }
                  error={!!errors.batchNumber}
                />
                {errors.batchNumber && (
                  <Typography variant="caption" color="error">
                    Batch number is required
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12} md={6}>
                <Box width={'100%'}>
                  <TextField
                    label="Hatchery *"
                    type="text"
                    className="form-input"
                    fullWidth
                    focused
                    {...register('organisation', {
                      required: true,
                      validate: (value) => value.trim() !== '' || 'Spaces only are not allowed',
                    })}
                    value={watch('organisation') || ''}
                  />
                  {errors.organisation && (
                    <Typography variant="body2" color="red" fontSize={13} mt={0.5}>
                      {errors.organisation.type === 'required'
                        ? 'This field is required.'
                        : errors.organisation.message || 'This field is required.'}
                    </Typography>
                  )}
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <Controller
                    name="hatchingDate"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <DatePicker
                        {...field}
                        label="Hatching Date *"
                        className="form-input"
                        sx={{ width: '100%' }}
                        value={field.value ? dayjs(field.value) : null}
                        onChange={(date) => field.onChange(date)}
                      />
                    )}
                  />
                </LocalizationProvider>
              </Grid>

              <Grid item xs={12} md={6}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <Controller
                    name="spawningDate"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <DatePicker
                        {...field}
                        label="Spawning Date *"
                        className="form-input"
                        sx={{ width: '100%' }}
                        value={field.value ? dayjs(field.value) : null}
                        onChange={(date) => field.onChange(date)}
                      />
                    )}
                  />
                </LocalizationProvider>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="Spawning Number *"
                  type="number"
                  fullWidth
                  {...register('spawningNumber', {
                    required: true,
                  })}
                  error={!!errors.spawningNumber}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl className="form-input" fullWidth focused>
                  <InputLabel id="species-select-label">
                    Species *
                  </InputLabel>
                  <Controller
                    name="speciesId"
                    control={control}
                    
                    rules={{ required: true }}
                    render={({ field }) => (
                      <Select
                        labelId="species-select-label"
                        id="species-select"
                        label="Species *"
                        value={field.value || ''}
                        onChange={field.onChange}
                        disabled
                      >
                        {featuredSpecies && featuredSpecies.length > 0 ? (
                          featuredSpecies.map((sp) => (
                            <MenuItem key={sp.id} value={sp.id}>
                              {sp.name}
                            </MenuItem>
                          ))
                        ) : (
                          <MenuItem disabled>No species available</MenuItem>
                        )}
                      </Select>
                    )}
                  />
                  {isRestocking && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      fontSize={12}
                      mt={0.5}
                    >
                      Auto-populated from existing stock batch
                    </Typography>
                  )}
                  {errors &&
                    errors.speciesId &&
                    errors.speciesId.type === 'required' && (
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

              <Grid item xs={12} md={6}>
                <TextField
                  label="Broodstock (Male)"
                  fullWidth
                  {...register('broodstockMale')}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="Broodstock (Female)"
                  fullWidth
                  {...register('broodstockFemale')}
                />
              </Grid>
            </Grid>

            <Box display={'flex'} gap={2} justifyContent={'flex-end'} mt={4}>
              <Button
                type="button"
                onClick={handleClose}
                variant="outlined"
                sx={{
                  fontWeight: 600,
                  padding: '8px 24px',
                  textTransform: 'capitalize',
                  borderRadius: '8px',
                  borderColor: '#06A19B',
                  color: '#06A19B',
                }}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                variant="contained"
                disabled={isLoading}
                sx={{
                  background: '#06A19B',
                  fontWeight: 600,
                  padding: '8px 24px',
                  textTransform: 'capitalize',
                  borderRadius: '8px',
                  color: '#fff',
                  '&:hover': {
                    background: '#058a85',
                  },
                }}
              >
                {isLoading ? 'Creating...' : 'Create Batch'}
              </Button>
            </Box>
          </form>
        </Box>
      </Stack>
    </Modal>
  );
};

export default CreateBatchModal;
