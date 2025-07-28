'use client';
import { getLocalItem, setLocalItem } from '@/app/_lib/utils';
import { Farm, ProductionParaMeterType } from '@/app/_typeModels/Farm';
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
import { cellStyle, fishSizes } from '../farm/FeedProfiles';
import { CloseIcon } from '../theme/overrides/CustomIcons';
import { FeedProduct } from '@/app/_typeModels/Feed';
import { FeedSupplier } from '@/app/_typeModels/Organization';

interface Props {
  productionParaMeter?: ProductionParaMeterType[];
  editFarm?: Farm;
  setOpen: (open: boolean) => void;
  open: boolean;
  selectedUnitName: string;
  setSelectedUnitName: (val: string) => void;
  feedStores: FeedProduct[];
  feedSuppliers: FeedSupplier[];
}
interface FormData {
  [key: string]: string;
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

interface ProductionUnitFeedProfileData {
  unitName: string;
  feedProfile: FormData;
}

const ProductionUnitFeedProfile: React.FC<Props> = ({
  setOpen,
  open,
  editFarm,
  selectedUnitName,
  setSelectedUnitName,
  feedStores,
  feedSuppliers,
}) => {
  const isEditFarm = getCookie('isEditFarm');
  const [radioValueMap, setRadioValueMap] = useState<
    Record<string, Record<string, string>>
  >({});
  const [formProductionFeedProfile, setFormProductionFeedProfile] = useState<
    FormData | undefined
  >();

  const { control, handleSubmit, setValue, reset } = useForm<FormData>();

  const onSubmit: SubmitHandler<FormData> = (formData) => {
    const productionUnitsFeedProfilesArray: ProductionUnitFeedProfileData[] =
      getLocalItem('productionUnitsFeedProfiles') || [];
    const { data, ...rest } = formData;

    const updatedData = productionUnitsFeedProfilesArray?.filter(
      (data: ProductionUnitFeedProfileData) =>
        data.unitName !== selectedUnitName,
    );
    const payload: ProductionUnitFeedProfileData = {
      unitName: selectedUnitName,
      feedProfile: {
        ...rest,
      },
    };

    updatedData.push(payload);

    setLocalItem('productionUnitsFeedProfiles', updatedData);
    setOpen(false);
    setSelectedUnitName('');
    reset();
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && selectedUnitName) {
      const formData: FormData | null = getLocalItem('feedProfiles');
      if (formData) {
        setFormProductionFeedProfile(formData);
        Object?.entries(formData).forEach(([key, value]) => {
          setValue(key, String(value));
        });
      }
    }
  }, [selectedUnitName, setValue]);

  useEffect(() => {
    const productionUnitsFeedProfilesArray: ProductionUnitFeedProfileData[] =
      getLocalItem('productionUnitsFeedProfiles') || [];

    const updatedData = productionUnitsFeedProfilesArray?.find(
      (data: ProductionUnitFeedProfileData) =>
        data.unitName === selectedUnitName,
    );
    if (updatedData) {
      Object.entries(updatedData?.feedProfile).forEach(([key, value]) => {
        setValue(key, String(value));
      });
    }
  }, [formProductionFeedProfile, selectedUnitName, setValue]);

  useEffect(() => {
    const formProductionFeedProfileArray: ProductionUnitFeedProfileData[] =
      getLocalItem('productionUnitsFeedProfiles') || [];
    const currentUnit = formProductionFeedProfileArray?.find(
      (val: ProductionUnitFeedProfileData) => val.unitName === selectedUnitName,
    );
    if (
      isEditFarm &&
      editFarm &&
      formProductionFeedProfileArray &&
      !currentUnit
    ) {
      editFarm?.productionUnits?.map((unit) => {
        if (
          unit.name === selectedUnitName &&
          unit.id === unit.FeedProfileProductionUnit?.[0]?.productionUnitId
        ) {
          Object.entries(
            unit?.FeedProfileProductionUnit?.[0]?.profiles || {},
          ).forEach(([key, value]) => {
            setValue(key, String(value));
          });
        }
      });
    } else if (formProductionFeedProfileArray?.length && currentUnit) {
      Object.entries(currentUnit?.feedProfile).forEach(([key, value]) => {
        setValue(key, String(value));
      });
    }
  }, [isEditFarm, editFarm, setValue, selectedUnitName]);

  const renderRadioGroup = (
    rowName: string,
    columnName: string,
    options: string[] = ['opt1', 'opt2', 'opt3'],
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
          {options.map((opt) => {
            const value =
              radioValueMap[columnName]?.[opt] ?? `${columnName}_${opt}`;
            return (
              <FormControlLabel
                key={value}
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

  const groupedData = useMemo(() => {
    return feedSuppliers?.reduce(
      (
        acc: { supplier: FeedSupplier; stores: FeedProduct[] }[],
        supplier: FeedSupplier,
      ) => {
        const storesForSupplier = feedStores?.filter((store: FeedProduct) =>
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
      [] as { supplier: FeedSupplier; stores: FeedProduct[] }[],
    );
  }, [feedSuppliers, feedStores]);

  useEffect(() => {
    if (!groupedData?.length) return;

    const map: Record<string, Record<string, string>> = {};

    groupedData?.forEach((group, index) => {
      const colKey = `col${index + 1}`;
      map[colKey] = {};

      group?.stores?.forEach((store: FeedProduct, storeIndex: number) => {
        const optKey = `opt${storeIndex + 1}`;
        const label = `${store.productName} - ${group.supplier.name}`;
        map[colKey][optKey] = label;
      });
    });

    setRadioValueMap(map);
  }, [groupedData]);

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
      BackdropProps={{
        onClick: (event) => event.stopPropagation(),
      }}
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
                Feed Profile
              </Typography>
              <Paper
                sx={{
                  width: '100%',
                  overflow: 'hidden',
                  borderRadius: '14px',
                  boxShadow: '0px 0px 16px 5px #0000001A',
                }}
              >
                <TableContainer
                  component={Paper}
                  className="feed-profile-table"
                >
                  <Table stickyHeader={true}>
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

                        {groupedData?.map((tableHead, mainIndex) => {
                          return (
                            <TableCell
                              key={mainIndex}
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
                                {tableHead?.supplier?.name}
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
                                  {tableHead?.stores?.map(
                                    (store: FeedProduct, subIndex: number) => {
                                      return (
                                        <ListItem
                                          key={subIndex}
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
                      {fishSizes?.map((size) => {
                        const rowName = `selection_${size}`;

                        return (
                          <TableRow key={size}>
                            <TableCell sx={cellStyle}>{size}</TableCell>
                            {groupedData?.map((group, index) => {
                              const options = group.stores.map(
                                (_: FeedProduct, i: number) => `opt${i + 1}`,
                              );
                              return (
                                <TableCell
                                  sx={cellStyle}
                                  key={group.supplier.id}
                                >
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
            </Stack>
          </Paper>

          <Box
            display={'flex'}
            justifyContent={'flex-end'}
            alignItems={'center'}
            gap={3}
            mt={4}
          >
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
