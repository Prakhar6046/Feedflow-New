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
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Checkbox,
  IconButton,
  Card,
} from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { MultiSelect } from 'primereact/multiselect';
import { DoneAll, Delete } from '@mui/icons-material';

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
  [key: string]: string | string[];
}
export interface GroupedSupplierStores {
  supplier: SupplierOptions;
  stores: FeedProduct[];
}

const FeedProfiles = ({ setActiveStep, editFarm, feedStores, feedSuppliers }: Props) => {
  const { control, handleSubmit, watch, setValue } = useForm<FormValues>();
  const [supplierOptions, setSupplierOptions] = useState<SupplierOptions[]>([]);
  const [profiles, setProfiles] = useState<any[]>([]); // holds multiple feed profiles

  // Dynamic fish sizes based on maxFishSizeG
  const newfishSizes = useMemo(() => {
    if (!feedStores.length) return [];
    const maxGlobalFishSize = Math.max(
      ...feedStores.map((store) => store.maxFishSizeG || 0),
    );
    return fishSizes.filter((size) => size <= maxGlobalFishSize);
  }, [feedStores]);

  /** Add a new empty feed profile */
  const addProfile = () => {
    setProfiles((prev) => [
      ...prev,
      {
        id: Date.now(),
        suppliers: supplierOptions,
        selectedSupplier: supplierOptions,
        data: {},
      },
    ]);
  };

  /** Delete feed profile */
  const deleteProfile = (id: number) => {
    setProfiles((prev) => prev.filter((p) => p.id !== id));
  };

  /** Handle Submit */
  const onSubmit: SubmitHandler<FormValues> = (data) => {
    const payload: any[] = [];

    profiles.forEach((profile, profileIndex) => {
      const groupedData: GroupedSupplierStores[] = profile.selectedSupplier.reduce(
        (acc: GroupedSupplierStores[], supplier: SupplierOptions) => {
          const storesForSupplier = feedStores?.filter((store) =>
            store?.ProductSupplier?.some(
              (prodSupplierId: string) => Number(prodSupplierId) === supplier.id,
            ),
          );
          if (storesForSupplier?.length) {
            acc.push({ supplier, stores: storesForSupplier });
          }
          return acc;
        },
        [],
      );

      groupedData.forEach((group, groupIndex) => {
        group.stores.forEach((store) => {
          const selectedSizes: number[] = [];
          newfishSizes.forEach((size) => {
            const rowName = `profile_${profileIndex}_size_${size}`;
            const selectedVals: string[] = data[rowName] ? (data[rowName] as string[]) : [];
            if (selectedVals.includes(`${group.supplier.id}_${store.id}`)) {
              selectedSizes.push(size);
            }
          });
          if (selectedSizes.length) {
            payload.push({
              profileIndex,
              supplierId: group.supplier.id,
              storeId: store.id,
              minFishSize: Math.min(...selectedSizes),
              maxFishSize: Math.max(...selectedSizes),
            });
          }
        });
      });
    });

    console.log('Structured Payload:', payload);
    setLocalItem('feedProfiles', payload);

    if (editFarm?.FeedProfile?.length) {
      setLocalItem('feedProfileIds', editFarm?.FeedProfile?.map((fp) => fp.id));
    }

    setActiveStep(3);
  };

  useEffect(() => {
    if (feedSuppliers?.length) {
      const options = feedSuppliers?.map((supplier) => ({
        option: supplier.name,
        id: Number(supplier.id),
      }));
      setSupplierOptions(options);

      // load saved profiles if editing
      if (editFarm?.FeedProfile?.length) {
        const existingProfiles = editFarm.FeedProfile.map((fp, idx) => ({
          id: fp.id,
          suppliers: options,
          selectedSupplier: options.filter((o) =>
            fp.profiles.some((p) => p.supplierId === o.id),
          ),
          data: fp.profiles,
        }));
        setProfiles(existingProfiles);
      } else {
        setProfiles([{ id: Date.now(), suppliers: options, selectedSupplier: options, data: {} }]);
      }
    }
  }, [feedSuppliers]);

  return (
    <Stack>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box mb={3} display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" fontWeight={700}>Feed Profiles</Typography>
          <Button variant="outlined" onClick={addProfile}>+ Add Feed Profile</Button>
        </Box>

        {profiles.map((profile, profileIndex) => {
          const groupedData: GroupedSupplierStores[] = profile.selectedSupplier.reduce(
            (acc: GroupedSupplierStores[], supplier: SupplierOptions) => {
              const storesForSupplier = feedStores?.filter((store) =>
                store?.ProductSupplier?.some(
                  (prodSupplierId: string) => Number(prodSupplierId) === supplier.id,
                ),
              );
              if (storesForSupplier?.length) acc.push({ supplier, stores: storesForSupplier });
              return acc;
            },
            [],
          );

          return (
            <Card key={profile.id} sx={{ p: 2, mb: 3 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography fontWeight={600}>Profile {profileIndex + 1}</Typography>
                <IconButton color="error" onClick={() => deleteProfile(profile.id)}>
                  <Delete />
                </IconButton>
              </Box>

              <MultiSelect
                value={profile.selectedSupplier}
                onChange={(e) =>
                  setProfiles((prev) =>
                    prev.map((p) =>
                      p.id === profile.id ? { ...p, selectedSupplier: e.value } : p,
                    ),
                  )
                }
                selectAllLabel="Select All"
                options={supplierOptions}
                optionLabel="option"
                display="chip"
                placeholder="Select Suppliers"
                className="w-100 max-w-100 custom-select"
              />

              <Paper sx={{ mt: 2 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={cellStyle}>Fish Size (g)</TableCell>
                      {groupedData.map((g) => (
                        <TableCell key={g.supplier.id} sx={cellStyle}>
                          {g.supplier.option}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {newfishSizes.map((size) => {
                      const rowName = `profile_${profileIndex}_size_${size}`;
                      return (
                        <TableRow key={size}>
                          <TableCell sx={cellStyle}>{size}</TableCell>
                          {groupedData.map((group) => (
                            <TableCell key={group.supplier.id} sx={cellStyle}>
                              <Controller
                                name={rowName}
                                control={control}
                                defaultValue={[]}
                                render={({ field }) => (
                                  <Box display="flex" flexWrap="wrap" gap={1}>
                                    {group.stores.map((store) => {
                                      const val = `${group.supplier.id}_${store.id}`;
                                      return (
                                        <FormControlLabel
                                          key={store.id}
                                          control={
                                            <Checkbox
                                              checked={field.value.includes(val)}
                                              onChange={(e) => {
                                                const newVal = e.target.checked
                                                  ? [...field.value, val]
                                                  : field.value.filter((v: string) => v !== val);
                                                field.onChange(newVal);
                                              }}
                                            />
                                          }
                                          label={`${store.productName} (${store.minFishSizeG}-${store.maxFishSizeG})`}
                                        />
                                      );
                                    })}
                                  </Box>
                                )}
                              />
                            </TableCell>
                          ))}
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </Paper>
            </Card>
          );
        })}

        <Box display="flex" justifyContent="flex-end" mt={4} gap={2}>
          <Button variant="outlined" onClick={() => setActiveStep(1)}>Previous</Button>
          <Button type="submit" variant="contained" color="primary">Next</Button>
        </Box>
      </form>
    </Stack>
  );
};

export default FeedProfiles;
