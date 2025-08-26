'use client';
import { getLocalItem, setLocalItem } from '@/app/_lib/utils';
import { Farm, ProductionParaMeterType, productionUnits } from '@/app/_typeModels/Farm';
import {
  Box,
  Button,
  FormControlLabel,
  IconButton,
  List,
  ListItem,
  Modal,
  Radio,
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
import { useEffect, useMemo, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { cellStyle, fishSizes, GroupedSupplierStores, SupplierOptions } from '../farm/FeedProfiles';
import { CloseIcon } from '../theme/overrides/CustomIcons';
import { FeedProduct } from '@/app/_typeModels/Feed';
import { FeedSupplier } from '@/app/_typeModels/Organization';
import { DoneAll } from '@mui/icons-material';

interface Props {
  productionParaMeter?: ProductionParaMeterType[];
  editFarm?: Farm;
  setOpen: (open: boolean) => void;
  open: boolean;
  selectedUnitName: string;
  setSelectedUnitName: (val: string) => void;
  feedStores: FeedProduct[];
  feedSuppliers: FeedSupplier[];
  productionUnits: productionUnits[];
}

interface FormData {
  [key: string]: string[];
}
interface FeedProfileItem {
  supplierId: number;
  storeId: string;
  minFishSize: number;
  maxFishSize: number;
}
interface ProductionUnitFeedProfileData {
  unitName: string;
  feedProfile: FeedProfileItem[];
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

const ProductionUnitFeedProfile: React.FC<Props> = ({
  setOpen,
  open,
  selectedUnitName,
  setSelectedUnitName,
  feedStores,
  feedSuppliers,
  productionUnits,
}) => {

  const isEditFarm = getCookie('isEditFarm');
  const [radioValueMap, setRadioValueMap] = useState<Record<string, Record<string, string>>>({});
  const [supplierOptions, setSupplierOptions] = useState<SupplierOptions[]>([]);
  const [selectedSupplier, setSelectedSupplier] = useState<SupplierOptions[]>([]);

  const { control, handleSubmit, setValue, watch, reset } = useForm<FormData>();

  const groupedData: GroupedSupplierStores[] = useMemo(() => {
    return selectedSupplier?.reduce(
      (acc: GroupedSupplierStores[], supplier: SupplierOptions) => {
        const storesForSupplier = feedStores?.filter((store) =>
          store?.ProductSupplier?.some((prodSupplierId: string) => Number(prodSupplierId) === supplier.id)
        );
        if (storesForSupplier?.length) {
          acc.push({ supplier, stores: storesForSupplier });
        }
        return acc;
      }, []
    );
  }, [selectedSupplier, feedStores]);

  useEffect(() => {
    if (feedSuppliers?.length) {
      const options = feedSuppliers.map((supplier) => ({
        option: supplier.name,
        id: supplier.id,
      }));
      setSupplierOptions(options);
      setSelectedSupplier(options);
    }
  }, [feedSuppliers]);

  useEffect(() => {
    if (!groupedData?.length) return;

    const map: Record<string, Record<string, string>> = {};
    groupedData.forEach((group, index) => {
      const colKey = `col${index + 1}`;
      map[colKey] = {};
      group.stores.forEach((store, storeIndex) => {
        const optKey = `opt${storeIndex + 1}`;
        map[colKey][optKey] = `${colKey}_${store.id}`;
      });
    });
    setRadioValueMap(map);
  }, [groupedData]);

  // Set default selection: production unit or main feed profile
 // Set default selection: production unit or main feed profile
useEffect(() => {
  if (!selectedUnitName || !groupedData?.length) {
    return;
  }
  const units = productionUnits || [];
const currentUnit = units.find((p) => p.name === selectedUnitName);
  // Add conditional check here to handle 'add' scenario
  if (!currentUnit) {
    console.log('currentUnit not found. Likely in "add" mode, falling back to main feed profile.');
  }

  const productionUnitsFeedProfiles: ProductionUnitFeedProfileData[] =
    getLocalItem('productionUnitsFeedProfiles') || [];

  const currentUnitProfile = productionUnitsFeedProfiles.find(
    (p) => p.unitName === selectedUnitName
  );

  let defaultProfileData: FormData = {};

  // Check if a specific profile exists for the current unit
  if (currentUnitProfile && currentUnitProfile.feedProfile) {
    // Priority 1: Use data from localStorage for the specific unit
    currentUnitProfile.feedProfile.forEach((item) => {
      const { supplierId, storeId, minFishSize, maxFishSize } = item;
      const colIndex = groupedData.findIndex((group) => group.supplier.id === supplierId);
      if (colIndex !== -1) {
        const colKey = `col${colIndex + 1}`;
        for (let size = minFishSize; size <= maxFishSize; size++) {
          const rowName = `selection_${size}`;
          if (!defaultProfileData[rowName]) {
            defaultProfileData[rowName] = [];
          }
          const valueToSet = `${colKey}_${storeId}`;
          if (!defaultProfileData[rowName].includes(valueToSet)) {
            defaultProfileData[rowName].push(valueToSet);
          }
        }
      }
    });
  }
  else if (currentUnit && currentUnit.FeedProfileProductionUnit && currentUnit.FeedProfileProductionUnit.length > 0) {
    // Priority 2: Use data from the 'productionUnits' prop (Edit Mode)
    const feedProfiles = currentUnit.FeedProfileProductionUnit[0]?.profiles;
    if (feedProfiles) {
      feedProfiles.forEach((item: FeedProfileItem) => {
        const { supplierId, storeId, minFishSize, maxFishSize } = item;
        const colIndex = groupedData.findIndex((group) => group.supplier.id === supplierId);
        if (colIndex !== -1) {
          const colKey = `col${colIndex + 1}`;
          for (let size = minFishSize; size <= maxFishSize; size++) {
            const rowName = `selection_${size}`;
            if (!defaultProfileData[rowName]) {
              defaultProfileData[rowName] = [];
            }
            const valueToSet = `${colKey}_${storeId}`;
            if (!defaultProfileData[rowName].includes(valueToSet)) {
              defaultProfileData[rowName].push(valueToSet);
            }
          }
        }
      });
    }
  } else {
    // Priority 3: Fallback to the main feed profile (Add Mode or no specific profile found)
    const mainFeedProfile: any[] = getLocalItem('feedProfiles') || [];
    mainFeedProfile.forEach((item) => {
      const { supplierId, storeId, minFishSize, maxFishSize } = item;
      const colIndex = groupedData.findIndex((group) => group.supplier.id === supplierId);
      if (colIndex !== -1) {
        const colKey = `col${colIndex + 1}`;
        for (let size = minFishSize; size <= maxFishSize; size++) {
          const rowName = `selection_${size}`;
          if (!defaultProfileData[rowName]) {
            defaultProfileData[rowName] = [];
          }
          const valueToSet = `${colKey}_${storeId}`;
          if (!defaultProfileData[rowName].includes(valueToSet)) {
            defaultProfileData[rowName].push(valueToSet);
          }
        }
      }
    });
  }

  // Reset the form with the new default values
  reset(defaultProfileData);

}, [selectedUnitName, groupedData, reset, productionUnits]);

  const handleAutoSelect = (store, supplierId) => {
    const colIndex = groupedData.findIndex((g) => g.supplier.id === supplierId);
    const colKey = `col${colIndex + 1}`;
    const valueToSet = `${colKey}_${store.id}`;

    fishSizes.forEach((size) => {
      const rowName = `selection_${size}`;
      if (size >= store.minFishSizeG && size <= store.maxFishSizeG) {
        const prev: string[] = watch(rowName) || [];
        const updated = prev.includes(valueToSet) ? prev.filter(v => v !== valueToSet) : [...prev, valueToSet];
        setValue(rowName, updated, { shouldValidate: true });
      }
    });
  };

  const renderRadioGroup = (rowName: string, columnName: string, options: string[]) => (
    <Controller
      name={rowName}
      control={control}
      defaultValue={[]}
      render={({ field }) => (
        <Box display="flex" justifyContent="space-between" alignItems="center" gap={2} paddingLeft={"16px"} paddingRight={"4px"}>
          {options.map((opt) => {
            const value = radioValueMap[columnName]?.[opt] ?? `${columnName}_${opt}`;
            const isChecked = field.value?.includes(value);
            return (
              <FormControlLabel
                key={value}
                value={value}
                className="ic-radio"
                control={
                  <Radio
                    checked={isChecked}
                    onChange={() => {
                      let updated = [...(field.value || [])];
                      if (isChecked) updated = updated.filter((v) => v !== value);
                      else updated.push(value);
                      field.onChange(updated);
                    }}
                  />
                }
                label=""
              />
            );
          })}
        </Box>
      )}
    />
  );

  const onSubmit: SubmitHandler<FormData> = (data) => {
    const result: {
      supplierId: number;
      storeId: string;
      minFishSize: number;
      maxFishSize: number;
    }[] = [];

    // Iterate over each fish size row to create the profile data
    Object.entries(data).forEach(([rowName, selectedValues]) => {
      const size = Number(rowName.replace('selection_', ''));

      selectedValues.forEach((val) => {
        const [colKey, storeId] = val.split('_');
        const colIndex = parseInt(colKey.replace('col', '')) - 1;
        const supplierId = groupedData[colIndex].supplier.id;

        const existing = result.find(r => r.storeId === storeId && r.supplierId === supplierId);
        if (existing) {
          existing.minFishSize = Math.min(existing.minFishSize, size);
          existing.maxFishSize = Math.max(existing.maxFishSize, size);
        } else {
          result.push({
            supplierId,
            storeId,
            minFishSize: size,
            maxFishSize: size
          });
        }
      });
    });

    // Load existing production units profiles
    const productionUnitsFeedProfiles: ProductionUnitFeedProfileData[] = getLocalItem('productionUnitsFeedProfiles') || [];

    // Find the index of the current unit's profile
    const unitIndex = productionUnitsFeedProfiles.findIndex(
      (p) => p.unitName === selectedUnitName
    );

    // Create the new profile object for the current unit
    const newProfile = {
      unitName: selectedUnitName,
      feedProfile: result,
    };

    if (unitIndex !== -1) {
      // If the unit already has a profile, update it
      productionUnitsFeedProfiles[unitIndex] = newProfile;
    } else {
      // Otherwise, add a new profile for the unit
      productionUnitsFeedProfiles.push(newProfile);
    }

    setLocalItem('productionUnitsFeedProfiles', productionUnitsFeedProfiles);

    setOpen(false);
    setSelectedUnitName('');
    reset();
  };


  const handleClose = () => {
    setOpen(false);
    reset();
    setSelectedUnitName('');
  };

  return (
    <Modal
      open={open}
      aria-labelledby="parent-modal-title"
      aria-describedby="parent-modal-description"
      className="modal-positioning"
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
            <TableContainer component={Paper} className="feed-profile-table">
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={{
                        borderBottom: 0,
                        color: '#67737F',
                        background: '#F5F6F8',
                        textAlign: 'center',
                        pr: '4px',
                        fontSize: { md: 16, xs: 14 },
                        fontWeight: 600,
                        verticalAlign: 'baseline',
                        position: "sticky",
                        left: 0,
                        zIndex: 1000
                      }}
                    >
                      Fish Size <br />(g)
                    </TableCell>
                    {groupedData?.map((group, colIndex) => (
                      <TableCell
                        key={group.supplier.id}
                        sx={{
                          borderBottom: 0,
                          color: '#67737F',
                          background: '#F5F6F8',
                          textAlign: 'center',
                          pr: '4px',
                        }}
                      >
                        <Typography
                          variant="body1"
                          sx={{
                            fontSize: { md: 16, xs: 14 },
                            fontWeight: 600,
                            background: '#06a19b',
                            color: '#fff',
                            p: 1,
                            borderRadius: '8px',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {group.supplier.option}
                        </Typography>
                        <Box>
                          <List
                            sx={{
                              display: 'flex',
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                              alignItems: 'start',
                              gap: 2,
                            }}
                          >
                            {group.stores.map((store) => {
                              const isSelectedForStore = fishSizes.some(size => {
                                const rowName = `selection_${size}`;
                                const selected: string[] = watch(rowName) || [];
                                const colKey = `col${colIndex + 1}`;
                                return selected.includes(`${colKey}_${store.id}`);
                              });
                              return (
                                <ListItem
                                  key={store.id}
                                  disablePadding
                                  sx={{ width: 'fit-content', flexDirection: "column" }}
                                >
                                  <Typography
                                    variant="body2"
                                    fontWeight={500}
                                    textAlign={'center'}
                                    minWidth={100}
                                    minHeight={65}
                                  >
                                    {store.productName} ({store.minFishSizeG}-{store.maxFishSizeG})
                                  </Typography>
                                  <IconButton
                                    size="small"
                                    onClick={() => handleAutoSelect(store, group.supplier.id)}
                                    sx={
                                      isSelectedForStore
                                        ? {
                                          background: '#06A19B',
                                          color: '#fff',
                                          fontWeight: 600,
                                          padding: '8px',
                                          width: 'fit-content',
                                          textTransform: 'capitalize',
                                          borderRadius: '50px',
                                          transform: 'scale(0.75)',
                                          border: '1px solid #06A19B',
                                          '&:hover': { background: '#06A19B', color: '#fff' },
                                        }
                                        : {
                                          background: '#fff',
                                          color: '#888',
                                          fontWeight: 600,
                                          padding: '8px',
                                          width: 'fit-content',
                                          textTransform: 'capitalize',
                                          borderRadius: '50px',
                                          border: '1px solid #d5d5d5',
                                          transform: 'scale(0.75)',
                                          '&:hover': { background: '#06A19B', color: '#fff' },
                                        }
                                    }
                                  >
                                    <DoneAll fontSize="small" />
                                  </IconButton>
                                </ListItem>
                              );
                            })}
                          </List>
                        </Box>
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {fishSizes.map((size) => {
                    const rowName = `selection_${size}`;
                    return (
                      <TableRow key={size}>
                        <TableCell style={{
                          position: "sticky",
                          left: 0,
                          zIndex: 100,
                          background: "#fff",
                        }} sx={cellStyle}>{size}</TableCell>
                        {groupedData.map((group, colIndex) => {
                          const options = group.stores.map((_, i) => `opt${i + 1}`);
                          return (
                            <TableCell sx={cellStyle} key={group.supplier.id} className='farm-radio-btn'>
                              {renderRadioGroup(rowName, `col${colIndex + 1}`, options)}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
          <Box display={'flex'} justifyContent={'flex-end'} alignItems={'center'} gap={3} mt={4}>
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

export default ProductionUnitFeedProfile;
