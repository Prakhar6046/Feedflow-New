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
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
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
import RestockConfirmationModal from './RestockConfirmationModal';
import CreateBatchModal from './CreateBatchModal';
import { getCookie } from 'cookies-next';
import { clientSecureFetch } from '../../_lib/clientSecureFetch';
import { SingleOrganisation } from '@/app/_typeModels/Organization';
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
  selectedProduction: Production;
  farms: Farm[];
  batches: { batchNumber: string; id: number; speciesId?: string | null }[];
  productions: Production[];
  onBatchesUpdate?: (batches: { batchNumber: string; id: number; speciesId?: string | null }[]) => void;
  organisations?: SingleOrganisation[];
}
interface InputTypes {
  manager: {
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
  }[];
}
const TransferModal: React.FC<Props> = ({
  setOpen,
  open,
  selectedProduction,
  farms,
  batches,
  productions,
  onBatchesUpdate,
  organisations,
}) => {
  console.log('selectedProduction in FarmManager:', selectedProduction);
  const searchParams = useSearchParams();
  const isFish = searchParams.get('isFish');
  const router = useRouter();
  // const filterFarmPermission =
  //   selectedProduction?.organisation?.permissions.farms?.find(
  //     (per) => per?.farmId === selectedProduction?.fishFarmId
  //   );
  const pathName = usePathname();
  const [selectedFarm, setSelectedFarm] = useState<any>(null);
  const [isEnteredBiomassGreater, setIsEnteredBiomassGreater] =
    useState<boolean>(false);
  const [isEnteredFishCountGreater, setIsEnteredFishCountGreater] =
    useState<boolean>(false);
  const [openConfirmationModal, setOpenConfirmationModal] =
    useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isStockDeleted, setIsStockDeleted] = useState<boolean>(false);
  const [isMeanWeigthCal, setIsMeanWeigthCal] = useState<boolean>(false);
  const [isMeanLengthCal, setIsMeanLengthCal] = useState<boolean>(false);
  const [avgOfMeanWeight, setAvgOfMeanWeight] = useState<number>();
  const [avgOfMeanLength, setAvgOfMeanLength] = useState<number>();
  const [formData, setFormData] = useState<any>();
  const [selectedMeanWeightId, setSelectedMeanWeightId] = useState<string>('');
  const [selectedMeanLengthId, setSelectedMeanLengthId] = useState<string>('');
  const [isApiCallInProgress, setIsApiCallInProgress] =
    useState<boolean>(false);
  const [currentInput, setCurrentInput] = useState('');
  const [openRestockConfirmation, setOpenRestockConfirmation] = useState<boolean>(false);
  const [openCreateBatchModal, setOpenCreateBatchModal] = useState<boolean>(false);
  const [batchesList, setBatchesList] = useState<{ batchNumber: string; id: number; speciesId?: string | null }[]>(batches);
  const [pendingBatchChange, setPendingBatchChange] = useState<{ idx: number; newBatchId: string } | null>(null);
  const [existingStockData, setExistingStockData] = useState<any>(null); // Store existing stock's fishSupply data for restocking
  const [newlyCreatedBatchId, setNewlyCreatedBatchId] = useState<number | null>(null); // Track newly created batch ID to avoid restock confirmation loop
  
  // Auto-calculation function for Mean Weight and Biomass
  const handleAutoCalculation = (idx: number, fieldName: 'biomass' | 'count' | 'meanWeight', newValue?: string) => {
    // Skip calculation if idx is 0 (first row is read-only)
    if (idx === 0) return;

    // Use getValues to get the latest form values
    const formValues = getValues();
    const currentRow = formValues.manager[idx];
    
    // Use the new value if provided, otherwise use the current form value
    let biomass = currentRow?.biomass || '';
    let fishCount = currentRow?.count || '';
    let meanWeight = currentRow?.meanWeight || '';

    // Update the value that was just changed
    if (fieldName === 'biomass' && newValue !== undefined) {
      biomass = newValue;
    } else if (fieldName === 'count' && newValue !== undefined) {
      fishCount = newValue;
    } else if (fieldName === 'meanWeight' && newValue !== undefined) {
      meanWeight = newValue;
    }

    const biomassNum = parseFloat(biomass) || 0;
    const fishCountNum = parseFloat(fishCount) || 0;
    const meanWeightNum = parseFloat(meanWeight) || 0;

    // Case 1: If biomass and fishCount are entered, calculate meanWeight
    // This happens when user enters biomass or fishCount
    if (fieldName === 'biomass' || fieldName === 'count') {
      if (biomassNum > 0 && fishCountNum > 0) {
        const calculatedMeanWeight = biomassNum / fishCountNum;
        setValue(`manager.${idx}.meanWeight`, calculatedMeanWeight.toFixed(2), {
          shouldValidate: true,
        });
      }
    }

    // Case 2: If meanWeight and fishCount are entered, calculate biomass
    // This happens when user enters meanWeight or fishCount
    if (fieldName === 'meanWeight' || fieldName === 'count') {
      if (meanWeightNum > 0 && fishCountNum > 0) {
        const calculatedBiomass = meanWeightNum * fishCountNum;
        setValue(`manager.${idx}.biomass`, calculatedBiomass.toFixed(2), {
          shouldValidate: true,
        });
      }
    }
  };

  const {
    register,
    setValue,
    formState: { errors },
    watch,
    trigger,
    clearErrors,
    reset,
    getValues,
    handleSubmit,
    control,
    setFocus,
    getFieldState,
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
    
    // Validate Transfer operations before submission
    const transferRows = data.manager.filter((row, index) => index !== 0 && row.field === 'Transfer');
    for (const transferRow of transferRows) {
      const sourceBiomass = parseFloat(selectedProduction?.biomass || '0');
      const sourceFishCount = parseFloat(selectedProduction?.fishCount || '0');
      const transferBiomass = parseFloat(transferRow.biomass || '0');
      const transferFishCount = parseFloat(transferRow.count || '0');
      
      if (transferBiomass > sourceBiomass) {
        toast.error(`Transfer biomass (${transferBiomass} kg) cannot exceed available biomass (${sourceBiomass} kg) in the source production unit.`);
        setIsApiCallInProgress(false);
        return;
      }
      
      if (transferFishCount > sourceFishCount) {
        toast.error(`Transfer fish count (${transferFishCount}) cannot exceed available fish count (${sourceFishCount}) in the source production unit.`);
        setIsApiCallInProgress(false);
        return;
      }
    }
    
    setIsApiCallInProgress(true);

    try {
      // Filter out row 0 (the read-only display row) and only send rows with actual changes
      const dataToProcess = data.manager.filter((_, index) => index !== 0);
      
      const addIdToData = dataToProcess.map((field) => {
        // For Stock, Mortalities, Harvest: use the selected production ID
        if (field.field === 'Stock' || field.field === 'Mortalities' || field.field === 'Harvest') {
          return { ...field, id: selectedProduction?.id };
        }
        
        // For Transfer: find the production ID for the source unit
        if (field.field === 'Transfer') {
          const sourceProduction = productions.find(
            (prod) =>
              prod.fishFarmId === field.fishFarm &&
              prod.productionUnitId === selectedProduction?.productionUnitId,
          );
          return { ...field, id: sourceProduction?.id || selectedProduction?.id };
        }
        
        // For other fields, try to find matching production
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

      // Process the data and format dates
      const addDataInSample = addIdToData.map((data) => {
        const formattedDate = data?.currentDate?.format
          ? data.currentDate.format('MM/DD/YYYY')
          : data?.currentDate;

        if (data.field === 'Sample') {
          // For Sample, use the first non-sample entry's batch and unit info
          const firstNonSample = addIdToData.find((d) => d.field !== 'Sample');
          return {
            ...data,
            batchNumber: firstNonSample?.batchNumber || selectedProduction?.batchNumberId || '',
            productionUnit: firstNonSample?.productionUnit || selectedProduction?.productionUnitId || '',
            id: firstNonSample?.id || selectedProduction?.id,
            currentDate: formattedDate,
            stockingDensityKG: firstNonSample?.stockingDensityKG || '',
            stockingDensityNM: firstNonSample?.stockingDensityNM || '',
          };
        } else {
          return {
            ...data,
            currentDate: formattedDate,
          };
        }
      });
      
      if (!isEnteredBiomassGreater && !isEnteredFishCountGreater) {
        // Check if any Stock entry has a different batch than existing production
        const stockEntries = addDataInSample.filter(d => d.field === 'Stock' || (!d.field && !selectedProduction?.batchNumberId));
        const hasDifferentBatch = stockEntries.some(entry => {
          if (selectedProduction?.batchNumberId && entry.batchNumber) {
            return String(entry.batchNumber) !== String(selectedProduction.batchNumberId);
          }
          return false;
        });

        // If there's a different batch and it doesn't exist in batches list, we should have already handled it
        // But as a safety check, verify all batches exist
        const missingBatches = stockEntries
          .filter(entry => entry.batchNumber)
          .filter(entry => !batchesList.find(b => String(b.id) === String(entry.batchNumber)));
        
        if (missingBatches.length > 0 && hasDifferentBatch) {
          toast.error('Please create the batch first before saving');
          setIsApiCallInProgress(false);
          return;
        }

        // Ensure Stock entries have the field set
        const finalData = addDataInSample.map((data) => {
          if (!data.field && !selectedProduction?.batchNumberId) {
            return { ...data, field: 'Stock' };
          } else {
            return data;
          }
        });
        
        const payload = {
          organisationId: selectedProduction?.organisationId,
          data: finalData,
        };

        const response = await clientSecureFetch('/api/production/mange', {
          method: 'POST',
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
        } else {
          toast.dismiss();
          toast.error(res.error || 'Something went wrong. Please try again.');
        }
      } else {
        toast.dismiss();
        toast.error(
          'Please enter biomass and fish count value less than selected production',
        );
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsApiCallInProgress(false);
    }
  };

  const handleDelete = (item: any) => {
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
    // Clear the newly created batch tracking when modal closes
    setNewlyCreatedBatchId(null);
    router.replace(`/dashboard/production`);
    toast.dismiss();
  };
  const openAnchor = Boolean(anchorEl);
  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseAnchor = (field: string) => {
    if (field.length) {
      append({
        id: 0,
        fishFarm: selectedProduction?.fishFarmId || '',
        productionUnit:
          field === 'Stock' || field === 'Harvest' || field === 'Mortalities'
            ? selectedProduction?.productionUnitId
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
          field === 'Harvest' || field === 'Mortalities' || field === 'Transfer'
            ? selectedProduction?.batchNumberId || ''
            : '',
      });
      setAnchorEl(null);
    } else {
      setAnchorEl(null);
    }
  };

  const handleMeanWeight = (item: any) => {
    setSelectedMeanWeightId(String(item.id));
    setIsMeanWeigthCal(true);
  };
  const handleMeanLength = (item: any) => {
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
  // Update batches list when batches prop changes
  useEffect(() => {
    setBatchesList(batches);
  }, [batches]);

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
      const data: any = [
        {
          id: selectedProduction?.id,
          fishFarm: selectedProduction?.fishFarmId,
          productionUnit: selectedProduction?.productionUnitId,
          biomass: selectedProduction?.biomass,
          count: selectedProduction?.fishCount,
          meanWeight: selectedProduction?.meanWeight,
          meanLength: selectedProduction?.meanLength,
          stockingDensityNM: selectedProduction?.stockingDensityNM,
          stockingLevel: selectedProduction?.stockingLevel,
          stockingDensityKG: selectedProduction?.stockingDensityKG,
          batchNumber: selectedProduction?.batchNumberId,
          currentDate: selectedProduction?.currentDate,
        },
      ];
      setValue('manager', data);
    }

    if (formData) {
      setValue('manager', formData);
    }

    setSelectedFarm(
      formData ? formData[0]?.fishFarm : selectedProduction?.fishFarmId,
    ); // Set the selected farm when manager is selected
    return () => {
      setIsStockDeleted(false);
    };
  }, [selectedProduction, isStockDeleted, formData]);
  useEffect(() => {
    if (selectedProduction) {
      const index0Biomass = Number(selectedProduction?.biomass) || 0; // Ensure a number
      const index0Count = Number(selectedProduction?.fishCount) || 0; // Ensure a number
      const fishFarm = selectedProduction?.fishFarmId;

      // Initialize updated values with the current production values (previous stock)
      let updatedBiomass = index0Biomass;
      let updatedCount = index0Count;

      // Iterate through watched fields, skipping index 0
      watchedFields.forEach((field, index) => {
        if (index === 0) return; // Skip index 0
        if (field.fishFarm === fishFarm && field.productionUnit === selectedProduction?.productionUnitId) {
          const currentBiomass = Number(field.biomass) || 0; // Convert to number
          const currentCount = Number(field.count) || 0; // Convert to number

          if (field.field === 'Stock') {
            // For Stock: Add new stock to previous stock
            updatedBiomass = index0Biomass + currentBiomass;
            updatedCount = index0Count + currentCount;
            
            // Calculate mean weight from total biomass and count
            const totalMeanWeight = updatedCount > 0 
              ? (updatedBiomass / updatedCount).toFixed(2) 
              : '0';
            
            // Calculate stocking density
            const farm = farms
              ?.find((f) => f.id === selectedFarm)
              ?.productionUnits?.find((unit) => unit.id === field.productionUnit);
            
            if (farm && farm.capacity) {
              const capacity = Number(farm.capacity) || 1;
              const updatedStockingDensityKG = (updatedBiomass / capacity).toFixed(2);
              const updatedStockingDensityNM = (updatedCount / capacity).toFixed(2);
              
              setValue(`manager.0.stockingDensityKG`, updatedStockingDensityKG);
              setValue(`manager.0.stockingDensityNM`, updatedStockingDensityNM);
              setValue(`manager.${index}.stockingDensityKG`, updatedStockingDensityKG);
              setValue(`manager.${index}.stockingDensityNM`, updatedStockingDensityNM);
            }
            
            setValue(`manager.0.meanWeight`, totalMeanWeight);
            setValue(`manager.0.meanLength`, field.meanLength || selectedProduction?.meanLength || '');
            setValue(`manager.0.batchNumber`, field.batchNumber || selectedProduction?.batchNumberId || '');
            setIsEnteredBiomassGreater(false);
            setIsEnteredFishCountGreater(false);
          } else if (field.field === 'Mortalities' || field.field === 'Harvest') {
            // For Mortalities/Harvest: Subtract from current stock
            if (currentBiomass > updatedBiomass && currentInput === 'biomass') {
              toast.dismiss();
              toast.error(`Please enter a value lower than ${updatedBiomass}`);
              setIsEnteredBiomassGreater(true);
            } else if (currentBiomass > 0 && updatedBiomass >= currentBiomass) {
              updatedBiomass -= currentBiomass;
              setIsEnteredBiomassGreater(false);
            }
            
            if (currentCount > updatedCount && currentInput === 'fishCount') {
              toast.dismiss();
              toast.error(`Please enter a value lower than ${updatedCount}`);
              setIsEnteredFishCountGreater(true);
            } else if (currentCount > 0 && updatedCount >= currentCount) {
              updatedCount -= currentCount;
              setIsEnteredFishCountGreater(false);
            }
            
            // Calculate mean weight and stocking density after subtraction
            const totalMeanWeight = updatedCount > 0 
              ? (updatedBiomass / updatedCount).toFixed(2) 
              : '0';
            
            const farm = farms
              ?.find((f) => f.id === selectedFarm)
              ?.productionUnits?.find((unit) => unit.id === field.productionUnit);
            
            if (farm && farm.capacity) {
              const capacity = Number(farm.capacity) || 1;
              const updatedStockingDensityKG = (updatedBiomass / capacity).toFixed(2);
              const updatedStockingDensityNM = (updatedCount / capacity).toFixed(2);
              
              setValue(`manager.0.stockingDensityKG`, updatedStockingDensityKG);
              setValue(`manager.0.stockingDensityNM`, updatedStockingDensityNM);
            }
            
            setValue(`manager.0.meanWeight`, totalMeanWeight);
          } else if (field.field === 'Transfer') {
            // For Transfer: Subtract from source (current production)
            if (currentBiomass > updatedBiomass && currentInput === 'biomass') {
              toast.dismiss();
              toast.error(`Please enter a value lower than ${updatedBiomass}`);
              setIsEnteredBiomassGreater(true);
            } else if (currentBiomass > 0 && updatedBiomass >= currentBiomass) {
              updatedBiomass -= currentBiomass;
              setIsEnteredBiomassGreater(false);
            }
            
            if (currentCount > updatedCount && currentInput === 'fishCount') {
              toast.dismiss();
              toast.error(`Please enter a value lower than ${updatedCount}`);
              setIsEnteredFishCountGreater(true);
            } else if (currentCount > 0 && updatedCount >= currentCount) {
              updatedCount -= currentCount;
              setIsEnteredFishCountGreater(false);
            }
            
            // Calculate mean weight and stocking density after transfer
            const totalMeanWeight = updatedCount > 0 
              ? (updatedBiomass / updatedCount).toFixed(2) 
              : '0';
            
            const farm = farms
              ?.find((f) => f.id === selectedFarm)
              ?.productionUnits?.find((unit) => unit.id === selectedProduction?.productionUnitId);
            
            if (farm && farm.capacity) {
              const capacity = Number(farm.capacity) || 1;
              const updatedStockingDensityKG = (updatedBiomass / capacity).toFixed(2);
              const updatedStockingDensityNM = (updatedCount / capacity).toFixed(2);
              
              setValue(`manager.0.stockingDensityKG`, updatedStockingDensityKG);
              setValue(`manager.0.stockingDensityNM`, updatedStockingDensityNM);
            }
            
            setValue(`manager.0.meanWeight`, totalMeanWeight);
          }
        }
        
        // Calculate stocking density for each row based on its production unit
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

      // Set the index 0 values after calculation (this shows the updated total)
      setValue(`manager.0.biomass`, updatedBiomass.toFixed(2));
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
  
  // Auto-calculate Mean Weight and Biomass when values change
  useEffect(() => {
    watchedFields.forEach((field, idx) => {
      // Skip calculation for index 0 (first row is read-only)
      if (idx === 0) return;

      const biomassNum = parseFloat(field.biomass) || 0;
      const fishCountNum = parseFloat(field.count) || 0;
      const meanWeightNum = parseFloat(field.meanWeight) || 0;

      // Case 1: If biomass and fishCount are entered, calculate meanWeight
      // Only calculate if meanWeight is empty or zero
      if (biomassNum > 0 && fishCountNum > 0 && meanWeightNum === 0) {
        const calculatedMeanWeight = biomassNum / fishCountNum;
        setValue(`manager.${idx}.meanWeight`, calculatedMeanWeight.toFixed(2), {
          shouldValidate: true,
        });
      }

      // Case 2: If meanWeight and fishCount are entered, calculate biomass
      // Only calculate if biomass is empty or zero
      if (meanWeightNum > 0 && fishCountNum > 0 && biomassNum === 0) {
        const calculatedBiomass = meanWeightNum * fishCountNum;
        setValue(`manager.${idx}.biomass`, calculatedBiomass.toFixed(2), {
          shouldValidate: true,
        });
      }
    });
  }, [
    watchedFields.map((field) => field.biomass).join(','),
    watchedFields.map((field) => field.count).join(','),
    watchedFields.map((field) => field.meanWeight).join(','),
    setValue,
  ]);

  // Early return if selectedProduction is not available
  if (!selectedProduction) {
    return null;
  }

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
                <Box paddingInline={4} key={item.id || idx}>
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
                                className={`form-input ${idx === 0 && 'selected'
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
                                    (item.field === 'Stock' &&
                                      setValue(
                                        `manager.0.fishFarm`,
                                        e.target.value,
                                      ),
                                      setSelectedFarm(selectedFishFarm)); // Set selected farm for this specific entry
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
                                className={`form-input ${idx === 0 && 'selected'
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
                                className={`form-input ${idx === 0 && 'selected'
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
                                          item.field === 'Transfer' ||
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
                                    onChange: async (e) => {
                                      const newBatchId = e.target.value;
                                      
                                      // Check if this is a Stock field and production already has stock with a different batch
                                      if (item.field === 'Stock' && idx !== 0 && selectedProduction?.batchNumberId) {
                                        const currentBatchId = String(selectedProduction.batchNumberId);
                                        
                                        // If a different batch is selected (and it exists in the list), show confirmation
                                        // BUT: Don't show confirmation if this is the newly created batch (to avoid loop)
                                        if (newBatchId && newBatchId !== currentBatchId && newBatchId !== '') {
                                          // Check if this is the newly created batch - if so, allow it without confirmation
                                          if (newlyCreatedBatchId && String(newlyCreatedBatchId) === String(newBatchId)) {
                                            // This is the newly created batch, just update the form
                                            setValue(`manager.${idx}.batchNumber`, newBatchId);
                                            if (item.field === 'Stock') {
                                              setValue(`manager.0.batchNumber`, newBatchId);
                                            }
                                            return;
                                          }
                                          
                                          const batchExists = batchesList.find(b => String(b.id) === newBatchId);
                                          
                                          if (batchExists) {
                                            // Batch exists but is different from current - show restock confirmation
                                            setPendingBatchChange({ idx, newBatchId });
                                            setOpenRestockConfirmation(true);
                                            // Don't update the form yet - wait for user confirmation
                                            return;
                                          }
                                          // If batch doesn't exist, we'll handle it differently (maybe show create modal directly)
                                        }
                                      }
                                      
                                      // Normal update - same batch or no existing batch
                                      if (item.field === 'Stock') {
                                        setValue(`manager.0.batchNumber`, newBatchId);
                                      }
                                    },
                                  })}
                                  inputProps={{
                                    shrink: watch(`manager.${idx}.batchNumber`),
                                  }}
                                  value={
                                    watch(`manager.${idx}.batchNumber`) || ''
                                  } // Ensure only the current entry is updated
                                >
                                  {(() => {
                                    // Filter batches based on field type
                                    let filteredBatches = batchesList;
                                    
                                    // For Transfer: Only show the batch from the source unit's production
                                    if (item.field === 'Transfer' && idx !== 0 && selectedProduction?.batchNumberId) {
                                      // Only show the batch that exists in the source production unit
                                      const sourceBatch = batchesList.find(b => b.id === Number(selectedProduction.batchNumberId));
                                      if (sourceBatch) {
                                        filteredBatches = [sourceBatch];
                                      } else {
                                        filteredBatches = [];
                                      }
                                    }
                                    // For Stock: Filter by species ID when production already has stock
                                    else if (item.field === 'Stock' && idx !== 0 && selectedProduction?.batchNumberId) {
                                      // Get the species ID from the first stocked batch
                                      const firstBatch = batchesList.find(b => b.id === Number(selectedProduction.batchNumberId));
                                      const firstBatchSpeciesId = firstBatch?.speciesId;
                                      
                                      if (firstBatchSpeciesId) {
                                        // Filter to only show batches with the same species ID
                                        filteredBatches = batchesList.filter(b => b.speciesId === firstBatchSpeciesId);
                                      }
                                    }
                                    
                                    // Show error message if no batches found
                                    if (filteredBatches.length === 0) {
                                      if (item.field === 'Transfer' && idx !== 0 && selectedProduction?.batchNumberId) {
                                        return (
                                          <MenuItem disabled value="">
                                            <Typography variant="body2" color="error">
                                              No batch found in source production unit.
                                            </Typography>
                                          </MenuItem>
                                        );
                                      } else if (item.field === 'Stock' && idx !== 0 && selectedProduction?.batchNumberId) {
                                        return (
                                          <MenuItem disabled value="">
                                            <Typography variant="body2" color="error">
                                              No batches found with matching species. Please create a batch first in Fish Supply.
                                            </Typography>
                                          </MenuItem>
                                        );
                                      }
                                    }
                                    
                                    return filteredBatches.map(
                                      (
                                        batch: {
                                          batchNumber: string;
                                          id: number;
                                          speciesId?: string | null;
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
                                    );
                                  })()}
                                </Select>
                                {(() => {
                                  // Show helper text if no matching batches found
                                  if (item.field === 'Stock' && idx !== 0 && selectedProduction?.batchNumberId) {
                                    const firstBatch = batchesList.find(b => b.id === Number(selectedProduction.batchNumberId));
                                    const firstBatchSpeciesId = firstBatch?.speciesId;
                                    
                                    if (firstBatchSpeciesId) {
                                      const filteredBatches = batchesList.filter(b => b.speciesId === firstBatchSpeciesId);
                                      
                                      if (filteredBatches.length === 0) {
                                        return (
                                          <Box sx={{ mt: 1 }}>
                                            <Typography variant="caption" color="error" sx={{ display: 'block', mb: 1 }}>
                                              No batches found with matching species. Please create a batch first in Fish Supply.
                                            </Typography>
                                            <Button
                                              variant="outlined"
                                              size="small"
                                              onClick={() => {
                                                // Set pending batch change to track which row this is for
                                                setPendingBatchChange({ idx, newBatchId: '' });
                                                setOpenCreateBatchModal(true);
                                              }}
                                              sx={{
                                                textTransform: 'capitalize',
                                                borderColor: '#06A19B',
                                                color: '#06A19B',
                                                '&:hover': {
                                                  borderColor: '#058a85',
                                                  backgroundColor: 'rgba(6, 161, 155, 0.04)',
                                                },
                                              }}
                                            >
                                              Create New Batch
                                            </Button>
                                          </Box>
                                        );
                                      }
                                    }
                                  }
                                  return null;
                                })()}

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
                                      onChange={(date: Dayjs | null) => {
                                        if (date && dayjs.isDayjs(date) && date.isValid()) {
                                          field.onChange(date);
                                          setValue(`manager.${idx}.currentDate`, date);
                                        } else {
                                          field.onChange(null);
                                        }
                                      }}

                                      slotProps={{
                                        textField: { focused: true },
                                      }}
                                      value={field.value ? dayjs(field.value) : null}
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
                                className={`form-input ${idx === 0 && 'selected'
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
                                  validate: (value) => {
                                    // For Transfer operations, validate against source production unit
                                    if (watchedFields[idx].field === 'Transfer' && idx !== 0) {
                                      const sourceBiomass = parseFloat(selectedProduction?.biomass || '0');
                                      const transferBiomass = parseFloat(value || '0');
                                      if (transferBiomass > sourceBiomass) {
                                        return `Cannot exceed available biomass (${sourceBiomass} kg)`;
                                      }
                                    }
                                    return true;
                                  },
                                  onChange: (e) => {
                                    setCurrentInput('biomass');
                                    handleAutoCalculation(idx, 'biomass', e.target.value);
                                  },
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
                            {errors &&
                              errors.manager &&
                              errors.manager[idx] &&
                              errors.manager[idx].biomass &&
                              errors.manager[idx].biomass.type ===
                              'validate' && (
                                <Typography
                                  variant="body2"
                                  color="red"
                                  fontSize={13}
                                  mt={0.5}
                                >
                                  {errors.manager[idx].biomass.message}
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
                              className={`form-input ${idx === 0 && 'selected'
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
                                validate: (value) => {
                                  // For Transfer operations, validate against source production unit
                                  if (watchedFields[idx].field === 'Transfer' && idx !== 0) {
                                    const sourceFishCount = parseFloat(selectedProduction?.fishCount || '0');
                                    const transferFishCount = parseFloat(value || '0');
                                    if (transferFishCount > sourceFishCount) {
                                      return `Cannot exceed available fish count (${sourceFishCount})`;
                                    }
                                  }
                                  return true;
                                },
                                onChange: (e) => {
                                  setCurrentInput('fishCount');
                                  handleAutoCalculation(idx, 'count', e.target.value);
                                },
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
                            {errors &&
                              errors.manager &&
                              errors.manager[idx] &&
                              errors.manager[idx].count &&
                              errors.manager[idx].count.type ===
                              'validate' && (
                                <Typography
                                  variant="body2"
                                  color="red"
                                  fontSize={13}
                                  mt={0.5}
                                >
                                  {errors.manager[idx].count.message}
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
                              className={`form-input ${idx === 0 && 'selected'
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
                                onChange: (e) => {
                                  handleAutoCalculation(idx, 'meanWeight', e.target.value);
                                },
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
                              className={`form-input ${idx === 0 && 'selected'
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
                                  // required:
                                  //   watch(`manager.${idx}.meanLength`) &&
                                  //     idx !== 0
                                  //     ? false
                                  //     : true,
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
                                className={`form-input ${idx === 0 && 'selected'
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
                                className={`form-input ${idx === 0 && 'selected'
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
                              className={`form-input ${idx === 0 && 'selected'
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
                        field === 'Stock'
                          ? false
                          : selectedProduction?.batchNumberId &&
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
                                  ? watchedFields[0].count &&
                                    watchedFields[0].batchNumber
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
                disabled={watchedFields.length <= 1 ? true : false || isApiCallInProgress}
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
            selectedProductionFishaFarmId={selectedProduction?.fishFarmId}
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
          <RestockConfirmationModal
            open={openRestockConfirmation}
            setOpen={(open) => {
              setOpenRestockConfirmation(open);
              if (!open && pendingBatchChange) {
                // If modal is closed without confirming, reset the batch selection
                setValue(`manager.${pendingBatchChange.idx}.batchNumber`, String(selectedProduction?.batchNumberId || ''));
                setPendingBatchChange(null);
              }
            }}
            onConfirm={async () => {
              // Fetch existing stock's fishSupply data for restocking
              // batchNumberId in production is the fishSupply ID
              if (selectedProduction?.batchNumberId) {
                try {
                  const response = await clientSecureFetch(
                    `/api/fish/${selectedProduction.batchNumberId}`,
                    { method: 'GET' }
                  );
                  const data = await response.json();
                  if (data.status && data.data) {
                    const existingFishSupply = data.data;
                    setExistingStockData({
                      id: existingFishSupply.id,
                      batchNumber: existingFishSupply.batchNumber,
                      spawningDate: existingFishSupply.spawningDate,
                      hatchingDate: existingFishSupply.hatchingDate,
                      spawningNumber: existingFishSupply.spawningNumber,
                      broodstockMale: existingFishSupply.broodstockMale || '',
                      broodstockFemale: existingFishSupply.broodstockFemale || '',
                      age: existingFishSupply.age,
                      speciesId: existingFishSupply.speciesId || null, // Include speciesId from existing stock
                    });
                  }
                } catch (error) {
                  console.error('Error fetching existing stock data:', error);
                  // Continue anyway - CreateBatchModal will handle it
                }
              }
              setOpenRestockConfirmation(false);
              setOpenCreateBatchModal(true);
            }}
            existingBatchNumber={
              selectedProduction?.batchNumberId
                ? batchesList.find(b => b.id === Number(selectedProduction.batchNumberId))?.batchNumber
                : undefined
            }
          />
          <CreateBatchModal
            open={openCreateBatchModal}
            setOpen={(open) => {
              setOpenCreateBatchModal(open);
              // Clear existing stock data when modal closes
              if (!open) {
                setExistingStockData(null);
              }
            }}
            onBatchCreated={(batchId, batchNumber) => {
              // Add new batch to the list
              const existingBatch = batchesList.find(b => b.id === Number(selectedProduction?.batchNumberId));
              const newBatch = { 
                id: batchId, 
                batchNumber,
                speciesId: existingBatch?.speciesId || existingStockData?.speciesId || null
              };
              const updatedBatches = [...batchesList, newBatch];
              setBatchesList(updatedBatches);
              
              // Track the newly created batch ID to avoid restock confirmation loop
              setNewlyCreatedBatchId(batchId);
              
              // Update the form with the new batch
              if (pendingBatchChange) {
                setValue(`manager.${pendingBatchChange.idx}.batchNumber`, String(batchId));
                setValue(`manager.0.batchNumber`, String(batchId));
              }
              
              // Notify parent component if callback provided
              if (onBatchesUpdate) {
                onBatchesUpdate(updatedBatches);
              }
              
              setPendingBatchChange(null);
              setExistingStockData(null); // Clear after batch is created
              toast.success(`Batch "${batchNumber}" created and selected`);
            }}
            selectedFarm={farms.find(f => f.id === selectedProduction?.fishFarmId) || null}
            organisationId={selectedProduction?.organisationId || 0}
            existingBatchNumber={
              selectedProduction?.batchNumberId
                ? batchesList.find(b => b.id === Number(selectedProduction.batchNumberId))?.batchNumber
                : undefined
            }
            existingSpeciesId={
              // For restocking: Get speciesId from existing stock data, otherwise from batchesList
              existingStockData?.speciesId ||
              (selectedProduction?.batchNumberId
                ? batchesList.find(b => b.id === Number(selectedProduction.batchNumberId))?.speciesId || null
                : null)
            }
            organisations={organisations}
            batchesToMerge={existingStockData ? [existingStockData] : []}
            isRestocking={!!existingStockData}
          />
        </Stack>
      </Modal>
    </div>
  );
};

export default TransferModal;
