'use client';
import { getLocalItem, setLocalItem } from '@/app/_lib/utils';
import { Farm } from '@/app/_typeModels/Farm';
import { FeedProduct } from '@/app/_typeModels/Feed';
import { FeedSupplier } from '@/app/_typeModels/Organization';
import {
  Box,
  Button,
  FormControlLabel,
  List,
  ListItem,
  Paper,
  Radio,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  FormControl,
  InputLabel,
  IconButton,
  Alert,
} from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { MultiSelect } from 'primereact/multiselect';
import toast from 'react-hot-toast';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import { Checklist, DoneAll } from '@mui/icons-material';

export const cellStyle = {
  borderBottomColor: '#F5F6F8',
  borderBottomWidth: 2,
  color: '#555555',
  fontWeight: 500,
  whiteSpace: 'nowrap',
  textAlign: 'center',
};


export const fishSizes = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 20, 25, 30, 35, 40, 45, 50, 
  75, 100, 125, 150, 175, 200, 250, 300, 350, 400, 450, 500, 550, 600, 650, 700, 750, 1001
];

const MAX_FISH_SIZE_CAP = 1000; 

interface Props {
  setActiveStep: (val: number) => void;
  editFarm?: Farm;
  feedStores: FeedProduct[];
  feedSuppliers: FeedSupplier[];
  isViewOnly?: boolean;
}
export interface SupplierOptions {
  id: number;
  option: string;
}
interface FormValues {
  [key: string]: string[];
}
export interface GroupedSupplierStores {
  supplier: SupplierOptions;
  stores: FeedProduct[];
}

const FeedProfiles = ({
  setActiveStep,
  editFarm,
  feedStores,
  feedSuppliers,
  isViewOnly = false,
}: Props) => {

  const { control, handleSubmit, watch, setValue } = useForm<FormValues>();
  const allFeedprofiles = watch();
  const [radioValueMap, setRadioValueMap] = useState<
    Record<string, Record<string, string>>
  >({});
  const [supplierOptions, setSupplierOptions] = useState<SupplierOptions[]>([]);
  const [selectedSupplier, setSelectedSupplier] = useState<SupplierOptions[]>(
    [],
  );
  const [gapError, setGapError] = useState<string>('');
  // Use the fixed fish sizes list - no dynamic extension
  const newfishSizes = useMemo(() => {
    return fishSizes;
  }, []);

  // Validate that there are no gaps in feed profile selections
  const validateFeedProfileGaps = (data: FormValues): { isValid: boolean; missingSizes: number[] } => {
    // Get all selected fish sizes across all rows
    const selectedSizes: number[] = [];
    newfishSizes.forEach((size) => {
      const rowName = `selection_${size}`;
      const rowData = data[rowName];
      // Check if this row has any feed selected
      if (rowData && Array.isArray(rowData) && rowData.length > 0) {
        // Check if there's at least one valid selection (starts with 'col')
        const hasValidSelection = rowData.some((val) => /^col\d+_/.test(val));
        if (hasValidSelection) {
          selectedSizes.push(size);
        }
      }
    });

    if (selectedSizes.length === 0) {
      return { isValid: true, missingSizes: [] }; // No selections is valid (user might not have selected anything yet)
    }

    // Sort selected sizes
    selectedSizes.sort((a, b) => a - b);
    const minSelected = selectedSizes[0];
    const maxSelected = selectedSizes[selectedSizes.length - 1];

    // Find gaps between min and max selected sizes in the fishSizes array
    const missingSizes: number[] = [];
    for (let i = 0; i < newfishSizes.length; i++) {
      const size = newfishSizes[i];
      // Check if this size is between min and max selected, but not itself selected
      if (size >= minSelected && size <= maxSelected && !selectedSizes.includes(size)) {
        missingSizes.push(size);
      }
    }

    return {
      isValid: missingSizes.length === 0,
      missingSizes: missingSizes,
    };
  };

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    // Prevent submission in view-only mode
  
    // Clear previous error
    setGapError('');

    // Validate for gaps in feed profile selections
    const validation = validateFeedProfileGaps(data);
    if (!validation.isValid && validation.missingSizes.length > 0) {
      // Format the missing sizes for display
      const missingSizesText = validation.missingSizes
        .map((size) => (size === 1001 ? '>1000' : size))
        .join(', ');
      setGapError(
        `Please select feed profiles for fish size(s): ${missingSizesText} to fill the gap.`
      );
      return;
    }

    // Build structured payload strictly from current form selections
    const payload: {
      supplierId: number;
      storeId: string;
      minFishSize: number;
      maxFishSize: number;
    }[] = [];

    groupedData.forEach((group, groupIndex) => {
      const colKey = `col${groupIndex + 1}`;
      group.stores.forEach((store) => {
        const valueKey = `${colKey}_${store.id}`;
        const selectedSizes: number[] = [];
        newfishSizes.forEach((size) => {
          const rowName = `selection_${size}`;
          if (data[rowName]?.includes(valueKey)) selectedSizes.push(size);
        });

        if (selectedSizes.length) {
          payload.push({
            supplierId: group.supplier.id,
            storeId: String(store.id),
            minFishSize: Math.min(...selectedSizes),
            maxFishSize: Math.max(...selectedSizes),
          });
        }
      });
    });

    // Persist structured payload and keep a raw form snapshot for navigation
    setLocalItem('feedProfiles', payload);
    setLocalItem('feedProfilesForm', data);

    if (editFarm?.FeedProfile?.[0]?.id) {
      setLocalItem('feedProfileId', editFarm?.FeedProfile?.[0].id);
    }

    setActiveStep(3);
  };


  const renderRadioGroup = (
    rowName: string,
    columnName: string,
    options: string[],
  ) => (
    <Controller
      name={rowName}
      control={control}
      defaultValue={[]}
      render={({ field }) => (
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          gap={2}
          paddingLeft={"16px"}
          paddingRight={"4px"}
        >
          {options.map((opt, index) => {
            const value = radioValueMap[columnName]?.[opt] ?? `${columnName}_${opt}`;
            const isChecked = field.value?.includes(value);
            const columnIndex = Number(columnName.replace('col', '')) - 1;
            // Extract storeId from value `${colKey}_${storeId}`
            const storeId = String(value.split('_')[1] || '');
            const store = getStoreByIdInColumn(columnIndex, storeId);

            return (
              <FormControlLabel
                key={index}
                value={value}
                className="ic-radio"
                control={
                  <Radio
                    checked={isChecked}
                    onChange={() => {
                      if (isViewOnly) return;
                      // If we know the store in this column, apply range-aware toggle
                      if (store) {
                        const clickedSize = Number(field.name.replace('selection_', ''));
                        // If clicking within declared store range: expand/shrink manually
                        toggleManualAtRow(columnIndex, store, clickedSize);
                        return;
                      }
                      // Fallback: single-row toggle with exclusivity
                      const rowName = field.name;
                      const prev: string[] = watch(rowName) || [];
                      if (isChecked) {
                        const updated = prev.filter((v) => v !== value);
                        setValue(rowName, updated, { shouldDirty: true, shouldValidate: true });
                      } else {
                        const withoutAnyColumn = prev.filter((v) => !/^col\d+_/.test(v));
                        const updated = [...withoutAnyColumn, value];
                        setValue(rowName, updated, { shouldDirty: true, shouldValidate: true });
                      }
                    }}
                    onClick={(e) => {
                      if (isViewOnly) {
                        e.preventDefault();
                        e.stopPropagation();
                        return;
                      }
                      if (!store) return;
                      const clickedSize = Number(field.name.replace('selection_', ''));
                      const existing = getSelectedSizesForStore(columnIndex, store.id);
                      const valueToSet = `${`col${columnIndex + 1}`}_${store.id}`;
                      // If exactly this single cell is selected, unselect it
                      if (existing.length === 1 && existing[0] === clickedSize && isChecked) {
                        const prev: string[] = watch(field.name) || [];
                        const updated = prev.filter((v) => v !== valueToSet && v !== value);
                        setValue(field.name, updated, { shouldDirty: true, shouldValidate: true });
                        e.preventDefault();
                        e.stopPropagation();
                        return;
                      }
                      // Otherwise use range behavior; prevent default to avoid double-processing
                      toggleManualAtRow(columnIndex, store, clickedSize);
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    disabled={isViewOnly}
                    sx={{
                      cursor: isViewOnly ? 'not-allowed' : 'pointer',
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

  const groupedData: GroupedSupplierStores[] = useMemo(() => {
    return selectedSupplier?.reduce(
      (acc: GroupedSupplierStores[], supplier: SupplierOptions) => {
        const storesForSupplier = feedStores?.filter((store) =>
          store?.ProductSupplier?.some(
            (prodSupplierId: string) => Number(prodSupplierId) === supplier.id,
          ),
        );
        if (storesForSupplier?.length) {
          acc.push({
            supplier,
            stores: storesForSupplier,
          });
        }
        return acc;
      },
      [],
    );
  }, [selectedSupplier, feedStores]);

  // Helpers for range-aware selection within a column (supplier)
  const getColumnKeyBySupplierId = (supplierId: number) => {
    const columnIndex = groupedData.findIndex(
      (group) => group.supplier.id === supplierId,
    );
    return { columnIndex, colKey: `col${columnIndex + 1}` };
  };

  const getStoreByIdInColumn = (columnIndex: number, storeId: string | number) => {
    const group = groupedData[columnIndex];
    if (!group) return undefined;
    return group.stores.find((s) => String(s.id) === String(storeId));
  };

  // Ensure one selection per column per row and handle range toggling
  const toggleStoreRangeInColumn = (columnIndex: number, store: FeedProduct) => {
    const colKey = `col${columnIndex + 1}`;
    const valueToSet = `${colKey}_${store.id}`;

    // Determine if any size in the store range is already selected
    const anySelectedInRange = newfishSizes.some((size) => {
      if (size < store.minFishSizeG || size > store.maxFishSizeG) return false;
      const rowName = `selection_${size}`;
      const prev = watch(rowName) || [];
      return prev.includes(valueToSet);
    });

    if (anySelectedInRange) {
      // Unselect entire range for this store
      newfishSizes.forEach((size) => {
        if (size < store.minFishSizeG || size > store.maxFishSizeG) return;
        const rowName = `selection_${size}`;
        const prev = watch(rowName) || [];
        const updated = prev.filter((v: string) => v !== valueToSet);
        setValue(rowName, updated, { shouldDirty: true, shouldValidate: true });
      });
      return;
    }

    // Select entire range for this store and remove conflicts across ALL columns for rows in range
    newfishSizes.forEach((size) => {
      const rowName = `selection_${size}`;
      const prev: string[] = watch(rowName) || [];

      if (size >= store.minFishSizeG && size <= store.maxFishSizeG) {
        // Remove any selection from ANY column in this row (enforce single pick per fish size)
        const withoutAnyColumn = prev.filter((v) => !/^col\d+_/.test(v));
        const updated = withoutAnyColumn.includes(valueToSet)
          ? withoutAnyColumn
          : [...withoutAnyColumn, valueToSet];
        setValue(rowName, updated, { shouldDirty: true, shouldValidate: true });
      } else {
        // Outside the new range, keep as-is
      }
    });
  };

  const getSelectedSizesForStore = (columnIndex: number, storeId: string | number) => {
    const colKey = `col${columnIndex + 1}`;
    const value = `${colKey}_${storeId}`;
    const sizes: number[] = [];
    newfishSizes.forEach((size) => {
      const rowName = `selection_${size}`;
      const prev: string[] = watch(rowName) || [];
      if (prev.includes(value)) sizes.push(size);
    });
    return sizes;
  };

  // Manual click: expand/shrink selection range for a store anchored to clicked size
  const toggleManualAtRow = (columnIndex: number, store: FeedProduct, clickedSize: number) => {
    const colKey = `col${columnIndex + 1}`;
    const valueToSet = `${colKey}_${store.id}`;

    // Is clicked row already selected for this store?
    const rowName = `selection_${clickedSize}`;
    const rowPrev: string[] = watch(rowName) || [];
    const isSelectedHere = rowPrev.includes(valueToSet);

    if (isSelectedHere) {
      // If clicked size is at the edge of the contiguous range, shrink only that edge
      const existing = getSelectedSizesForStore(columnIndex, store.id).sort((a, b) => a - b);
      if (existing.length) {
        const idx = existing.indexOf(clickedSize);
        let newMin = existing[0];
        let newMax = existing[existing.length - 1];

        if (idx === 0 && existing.length > 1) {
          // clicked at min edge → bump min up by one step
          newMin = existing[1];
        } else if (idx === existing.length - 1 && existing.length > 1) {
          // clicked at max edge → drop max down by one step
          newMax = existing[existing.length - 2];
        } else {
          // clicked inside the range (middle) → clear full range (simple rule)
          newfishSizes.forEach((size) => {
            const rn = `selection_${size}`;
            const prev: string[] = watch(rn) || [];
            const updated = prev.filter((v) => v !== valueToSet);
            setValue(rn, updated, { shouldDirty: true, shouldValidate: true });
          });
          return;
        }

        // Clear all, then re-apply the shrunken contiguous range
        newfishSizes.forEach((size) => {
          const rn = `selection_${size}`;
          const prev: string[] = watch(rn) || [];
          const updated = prev.filter((v) => v !== valueToSet);
          setValue(rn, updated, { shouldDirty: true, shouldValidate: true });
        });

        if (newMin <= newMax) {
          newfishSizes.forEach((size) => {
            if (size < newMin || size > newMax) return;
            const rn = `selection_${size}`;
            const prev: string[] = watch(rn) || [];
            const withoutAnyColumn = prev.filter((v) => !/^col\d+_/.test(v));
            const updated = withoutAnyColumn.includes(valueToSet)
              ? withoutAnyColumn
              : [...withoutAnyColumn, valueToSet];
            setValue(rn, updated, { shouldDirty: true, shouldValidate: true });
          });
        }
        return;
      }

      // No existing tracked sizes somehow → just remove this row
      const updated = rowPrev.filter((v) => v !== valueToSet);
      setValue(rowName, updated, { shouldDirty: true, shouldValidate: true });
      return;
    }

    // Expand to include clicked size, keeping the selection contiguous
    const existing = getSelectedSizesForStore(columnIndex, store.id);
    const minExisting = existing.length ? Math.min(...existing) : clickedSize;
    const maxExisting = existing.length ? Math.max(...existing) : clickedSize;
    const newMin = Math.min(minExisting, clickedSize);
    const newMax = Math.max(maxExisting, clickedSize);

    newfishSizes.forEach((size) => {
      const rn = `selection_${size}`;
      const prev: string[] = watch(rn) || [];
      if (size >= newMin && size <= newMax) {
        // enforce single pick per row across all suppliers
        const withoutAnyColumn = prev.filter((v) => !/^col\d+_/.test(v));
        const updated = withoutAnyColumn.includes(valueToSet)
          ? withoutAnyColumn
          : [...withoutAnyColumn, valueToSet];
        setValue(rn, updated, { shouldDirty: true, shouldValidate: true });
      }
    });
  };

  const handleAutoSelect = (store, supplierId, storeIndex) => {
    const { columnIndex } = getColumnKeyBySupplierId(supplierId);
    if (columnIndex < 0) return;
    toggleStoreRangeInColumn(columnIndex, store);
  };

  useEffect(() => {
    if (!groupedData?.length) return;

    const map: Record<string, Record<string, string>> = {};

    groupedData?.forEach((group, index) => {
      const colKey = `col${index + 1}`;
      map[colKey] = {};

      group?.stores?.forEach((store: FeedProduct, storeIndex: number) => {
        const optKey = `opt${storeIndex + 1}`;
        const label = `${store.productName} - ${group.supplier.option}`;

        // Use a unique value for each radio option, based on product ID
        map[colKey][optKey] = `${colKey}_${store.id}`;
      });
    });

    setRadioValueMap(map);
  }, [groupedData]);

  useEffect(() => {
    if (!editFarm || !groupedData?.length) return;

    const rawProfiles = editFarm?.FeedProfile?.[0]?.profiles;
    const profiles = Array.isArray(rawProfiles) ? rawProfiles : [];

    profiles.forEach((profile) => {
      const groupIndex = groupedData.findIndex(
        (group) => group.supplier.id === profile.supplierId
      );
      if (groupIndex === -1) return;

      const colKey = `col${groupIndex + 1}`;
      const valueToSet = `${colKey}_${profile.storeId}`;

      for (let size = profile.minFishSize; size <= profile.maxFishSize; size++) {
        const prev = watch(`selection_${size}`) || [];
        setValue(`selection_${size}`, [...prev, valueToSet], { shouldValidate: true });
      }
    });

    if (editFarm?.FeedProfile?.[0]?.id) {
      setLocalItem('feedProfileId', editFarm?.FeedProfile?.[0].id);
    }
  }, [editFarm, groupedData, setValue]);


  useEffect(() => {
    if (feedSuppliers?.length) {
      const options = feedSuppliers?.map((supplier) => ({
        option: supplier.name,
        id: Number(supplier.id),
      }));
      setSupplierOptions(options);
      setSelectedSupplier(options);
    }
  }, [feedSuppliers]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Load raw form snapshot, not the structured payload
      const formData = getLocalItem('feedProfilesForm');
      if (formData && Object.keys(formData).length) {
        Object.entries(formData).forEach(([key, value]) => {
          if (Array.isArray(value)) {
            setValue(key, value, { shouldValidate: true });
          } else if (value) {
            setValue(key, [String(value)], { shouldValidate: true });
          }
        });
      }
    }
  }, []);

  // Re-apply snapshot whenever table suppliers/stores are ready, so returning to this step shows prior picks
  useEffect(() => {
    if (!groupedData?.length) return;
    const formData = getLocalItem('feedProfilesForm');
    if (formData && Object.keys(formData).length) {
      Object.entries(formData).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          setValue(key, value, { shouldValidate: true });
        } else if (value) {
          setValue(key, [String(value)], { shouldValidate: true });
        }
      });
    }
  }, [groupedData]);

  return (
    <>
      <Stack>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{ mb: 3 }}>
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
              Feed Profile
            </Typography>
            <Box>
              <FormControl
                sx={{ width: 600 }}
                className="form-input selected"
                focused
              >
                <InputLabel id="feed-supplier-select" className="custom-input">
                  Feed Suppliers
                </InputLabel>
                <MultiSelect
                  value={selectedSupplier}
                  onChange={(e) => {
                    if (!isViewOnly) {
                      setSelectedSupplier(e.value);
                    }
                  }}
                  selectAllLabel="Select All"
                  options={supplierOptions}
                  optionLabel="option"
                  display="chip"
                  placeholder="Select Feed Suppliers"
                  dropdownIcon={
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="10"
                      height="10"
                      viewBox="0 0 15 15"
                    >
                      <path fill="currentColor" d="M7.5 12L0 4h15z" />
                    </svg>
                  }
                  maxSelectedLabels={3}
                  className="w-100 max-w-100 custom-select"
                  disabled={isViewOnly}
                />
              </FormControl>
            </Box>
          </Box>
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
                        fontSize: {
                          md: 16,
                          xs: 14,
                        },
                        fontWeight: 600,
                        verticalAlign: 'baseline',
                        position: "sticky",
                        left: 0,
                        zIndex: 1000
                      }}
                    >
                      Fish Size <br />
                      (g)
                    </TableCell>
                    {groupedData?.map((tableHead) => {
                      return (
                        <TableCell
                          key={tableHead.supplier.id}
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
                              fontSize: {
                                md: 16,
                                xs: 14,
                              },
                              fontWeight: 600,
                              background: '#06a19b',
                              color: '#fff',
                              p: 1,
                              borderRadius: '8px',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {tableHead?.supplier?.option}
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
                              {tableHead?.stores?.map(
                                (store: FeedProduct, storeIndex: number) => {
                                  const colIndex = groupedData.findIndex(
                                    (g) => g.supplier.id === tableHead.supplier.id
                                  );
                                  const colKey = `col${colIndex + 1}`;
                                  const valueToSet = `${colKey}_${store.id}`;

                                  const isSelectedForStore = newfishSizes.some((size) => {
                                    const rowName = `selection_${size}`;
                                    const selected: string[] = watch(rowName) || [];
                                    return selected.includes(valueToSet);
                                  });
                                  return (
                                    <ListItem
                                      key={store.id}
                                      disablePadding
                                      sx={{
                                        width: 'fit-content',
                                        flexDirection: "column"
                                      }}
                                    >
                                      <Typography
                                        variant="body2"
                                        fontWeight={500}
                                        textAlign={'center'}
                                        minWidth={100}
                                        minHeight={65}
                                      >
                                        {store?.productName}
                                        <br />
                                        ({store.minFishSizeG}-{store.maxFishSizeG})
                                      </Typography>
                                      
                                      <IconButton
                                        size="small"
                                        onClick={() =>
                                          handleAutoSelect(
                                            store,
                                            tableHead.supplier.id,
                                            storeIndex,
                                          )
                                        }
                                        disabled={isViewOnly}
                                        sx={
                                          isSelectedForStore
                                            ? {
                                              background: '#06A19B !important',
                                              color: '#fff !important',
                                              fontWeight: 600,
                                              padding: '8px',
                                              width: 'fit-content',
                                              textTransform: 'capitalize',
                                              borderRadius: '50px',
                                              transform: 'scale(0.75)',
                                              border: '1px solid #06A19B',

                                              '&:hover': {
                                                background: '#06A19B',
                                                color: '#fff',
                                              },
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
                                              '&:hover': {
                                                background: '#06A19B',
                                                color: '#fff',
                                              },
                                            }
                                        }
                                      >
                                        <DoneAll fontSize="small" />
                                        {/* <Checklist fontSize="small" /> */}
                                        {/* <AutoFixHighIcon fontSize="small" /> */}
                                      </IconButton>
                                    </ListItem>
                                  );
                                },
                              )}
                            </List>
                          </Box>
                        </TableCell>
                      );
                    })}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {newfishSizes?.map((size, index) => {
                    const rowName = `selection_${size}`;

                    return (
                      <TableRow key={`row-${index}`}>
                        <TableCell style={{
                          position: "sticky",
                          left: 0,
                          zIndex: 100,
                          background: "#fff",
                        }} sx={cellStyle}>
                          {size === 1001 ? '>1000' : size}
                        </TableCell>
                        {groupedData?.map((group, groupIndex) => {
                          const options = group.stores.map(
                            (_: FeedProduct, i: number) => `opt${i + 1}`,
                          );
                          return (
                            <TableCell
                              sx={cellStyle}
                              className='farm-radio-btn'
                              key={group.supplier.id}
                            >
                              {renderRadioGroup(
                                rowName,
                                `col${groupIndex + 1}`,
                                options,
                              )}
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
          {gapError && (
            <Box mt={2}>
              <Alert severity="error" onClose={() => setGapError('')}>
                {gapError}
              </Alert>
            </Box>
          )}
          <Box
            display={'flex'}
            justifyContent={'flex-end'}
            alignItems={'center'}
            gap={3}
            mt={4}
          >
            <Button
              type="button"
              variant="contained"
              onClick={() => {
                setActiveStep(1);
                // Save only the raw form state so user can return
                setLocalItem('feedProfilesForm', allFeedprofiles);
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
      </Stack >
    </>
  );
};

export default FeedProfiles;
