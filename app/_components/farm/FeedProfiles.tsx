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
} from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { MultiSelect } from 'primereact/multiselect';
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
  1, 2, 3, 4, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85,
  90, 95, 100, 120, 140, 160, 180,
];

interface Props {
  setActiveStep: (val: number) => void;
  editFarm?: Farm;
  feedStores: FeedProduct[];
  feedSuppliers: FeedSupplier[];
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
  // Dynamic fish sizes based on maxFishSizeG
  const newfishSizes = useMemo(() => {
    if (!feedStores.length) return [];
    const maxGlobalFishSize = Math.max(
      ...feedStores.map((store) => store.maxFishSizeG || 0),
    );
    return fishSizes.filter((size) => size <= maxGlobalFishSize);
  }, [feedStores]);

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    // Parse selected feed profiles into structured payload
    const payload: {
      supplierId: number;
      storeId: String;
      minFishSize: number;
      maxFishSize: number;
    }[] = [];

    groupedData.forEach((group, groupIndex) => {
      const colKey = `col${groupIndex + 1}`;

      group.stores.forEach((store) => {
        const valueKey = `${colKey}_${store.id}`;

        // Find all fish sizes where this store was selected
        const selectedSizes: number[] = [];
        newfishSizes.forEach((size) => {
          const rowName = `selection_${size}`;
          newfishSizes.forEach((size) => {
            const rowName = `selection_${size}`;
            if (data[rowName]?.includes(valueKey)) {
              selectedSizes.push(size);
            }
          });
        });

        if (selectedSizes.length) {
          payload.push({
            supplierId: group.supplier.id,
            storeId: store.id,
            minFishSize: Math.min(...selectedSizes),
            maxFishSize: Math.max(...selectedSizes),
          });
        }
      });
    });
    // Save structured payload
    setLocalItem('feedProfiles', payload);

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

            return (
              <FormControlLabel
                key={index}
                value={value}
                className="ic-radio"
                control={
                  <Radio
                    checked={isChecked}
                    onChange={() => {
                      let updated = [...(field.value || [])];
                      if (isChecked) {
                        // unselect
                        updated = updated.filter((v) => v !== value);
                      } else {
                        // add new selection
                        updated.push(value);
                      }
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

  // New function to handle auto-selection
  const handleAutoSelect = (store, supplierId, storeIndex) => {
    const columnIndex = groupedData.findIndex(
      (group) => group.supplier.id === supplierId,
    );
    const colKey = `col${columnIndex + 1}`;
    const valueToSet = `${colKey}_${store.id}`;

    // Check if any size in the store's range is already selected
    const isAnySizeSelected = newfishSizes.some((size) => {
      const rowName = `selection_${size}`;
      const prev = watch(rowName) || [];
      return prev.includes(valueToSet);
    });

    if (isAnySizeSelected) {
      // If any size is selected, unselect the entire range
      newfishSizes.forEach((size) => {
        const rowName = `selection_${size}`;
        const prev = watch(rowName) || [];
        const updated = prev.filter((v) => v !== valueToSet);
        setValue(rowName, updated, { shouldDirty: true, shouldValidate: true });
      });
    } else {
      // If no size is selected, select the entire range
      newfishSizes.forEach((size) => {
        const rowName = `selection_${size}`;
        if (size >= store.minFishSizeG && size <= store.maxFishSizeG) {
          const prev = watch(rowName) || [];
          // Ensure we don't add duplicates
          const updated = prev.includes(valueToSet) ? prev : [...prev, valueToSet];
          setValue(rowName, updated, { shouldDirty: true, shouldValidate: true });
        }
      });
    }
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
      const formData = getLocalItem('feedProfiles');
      if (formData && Object.keys(formData).length) {
        Object.entries(formData).forEach(([key, value]) => {
          if (Array.isArray(value)) {
            // already an array → set directly
            setValue(key, value, { shouldValidate: true });
          } else if (value) {
            // single string → wrap in array
            setValue(key, [String(value)], { shouldValidate: true });
          }
        });
      }
    }
  }, []);

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
                  onChange={(e) => setSelectedSupplier(e.value)}
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
                        }} sx={cellStyle}>{size}</TableCell>
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
                setLocalItem('feedProfiles', allFeedprofiles);
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
