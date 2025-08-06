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
} from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { MultiSelect } from 'primereact/multiselect';

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
  [key: string]: string;
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
  const onSubmit: SubmitHandler<FormValues> = (data) => {
    setLocalItem('feedProfiles', data);
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
      defaultValue=""
      render={({ field }) => (
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          gap={2}
        >
          {options.map((opt, index) => {
            const value =
              radioValueMap[columnName]?.[opt] ?? `${columnName}_${opt}`;
            return (
              <FormControlLabel
                key={index}
                value={value}
                className="ic-radio"
                control={
                  <Radio
                    {...field}
                    checked={field.value === value}
                    onChange={() => field.onChange(value)}
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
          store?.ProductSupplier?.includes(String(supplier.id)),
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

  useEffect(() => {
    if (!groupedData?.length) return;

    const map: Record<string, Record<string, string>> = {};

    groupedData?.forEach((group, index) => {
      const colKey = `col${index + 1}`;
      map[colKey] = {};

      group?.stores?.forEach((store: FeedProduct, storeIndex: number) => {
        const optKey = `opt${storeIndex + 1}`;
        const label = `${store.productName} - ${group.supplier.option}`;
        map[colKey][optKey] = label;
      });
    });

    setRadioValueMap(map);
  }, [groupedData]);

  useEffect(() => {
    if (editFarm) {
      const profiles: any = editFarm.FeedProfile?.[0]?.profiles;
      setLocalItem('feedProfileId', editFarm?.FeedProfile?.[0].id);
      Object.entries(profiles).forEach(([key, value]) => {
        setValue(key, String(value));
      });
    }
  }, [editFarm]);
  useEffect(() => {
    if (feedSuppliers?.length) {
      const options = feedSuppliers?.map((supplier) => {
        return { option: supplier.name, id: supplier?.id };
      });
      setSupplierOptions(options);
      setSelectedSupplier(options);
    }
  }, [feedSuppliers]);
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const formData = getLocalItem('feedProfiles');
      if (formData && Object.keys(formData).length)
        Object.entries(formData)?.forEach(([key, value]) => {
          setValue(key, String(value));
        });
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
                                justifyContent: 'space-around',
                                alignItems: 'center',
                                gap: 2,
                              }}
                            >
                              {tableHead?.stores?.map((store: FeedProduct) => {
                                return (
                                  <ListItem
                                    key={store.id}
                                    disablePadding
                                    sx={{
                                      width: 'fit-content',
                                    }}
                                  >
                                    <Typography
                                      variant="body2"
                                      fontWeight={500}
                                      textAlign={'center'}
                                      minWidth={100}
                                    >
                                      {store?.productName}
                                      <br />
                                      (1&gt;5)
                                    </Typography>
                                  </ListItem>
                                );
                              })}
                            </List>
                          </Box>
                        </TableCell>
                      );
                    })}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {fishSizes?.map((size, index) => {
                    const rowName = `selection_${size}`;

                    return (
                      <TableRow key={`row-${index}`}>
                        <TableCell sx={cellStyle}>{size}</TableCell>
                        {groupedData?.map((group, index) => {
                          const options = group.stores.map(
                            (_: FeedProduct, i: number) => `opt${i + 1}`,
                          );
                          return (
                            <TableCell sx={cellStyle} key={group.supplier.id}>
                              {renderRadioGroup(
                                rowName,
                                `col${index + 1}`,
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
      </Stack>
    </>
  );
};

export default FeedProfiles;
