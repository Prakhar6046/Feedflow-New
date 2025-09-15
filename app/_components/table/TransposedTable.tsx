'use client';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Divider,
  Box,
  Select,
  MenuItem,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { getCookie } from 'cookies-next';
import { Species } from '../feedSupply/NewFeedLibarary';
import { useRouter } from 'next/navigation';

interface Props {
  feedSuppliers: any;
  filteredStores: any;
}

export const TransposedTable = ({ feedSuppliers, filteredStores }: Props) => {
  const { control, handleSubmit, reset, setValue } = useForm();
  const [speciesList, setSpeciesList] = useState<Species[]>([]);
  const featuredSpecies = speciesList?.filter((sp) => sp.isFeatured);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const token = getCookie('auth-token');
  const router = useRouter();
  const excludedKeys = [
    'id',
    'createdAt',
    'updatedAt',
    'organaisationId',
    'ProductSupplier',
    'speciesId',
    'species'
  ];

  const fetchData = async () => {
    const res = await fetch('/api/species', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }); 9 + 9 + 6
    setSpeciesList(await res.json());
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (filteredStores?.length) {
      // Prepare flat key-value for default values
      const defaultValues: Record<string, any> = {};
      filteredStores.forEach((item: any, colIndex: number) => {
        Object.entries(item).forEach(([key, value]) => {
          if (!['createdAt', 'updatedAt', 'organaisationId'].includes(key)) {
            defaultValues[`${key}-${colIndex}`] = value;
          }
        });
        defaultValues[`speciesId-${colIndex}`] = item.speciesId || '';
      });
      reset(defaultValues);
    }
  }, [filteredStores, reset]);

  useEffect(() => {
    if (filteredStores) {
      filteredStores?.map((store: any, i: number) => {
        return setValue(`suppliers[${i}].supplierIds`, store.ProductSupplier);
      });
    }
  }, [filteredStores]);
  const watchedValues = useWatch({ control });
  const calculatedValues = useMemo(() => {
    if (!filteredStores || filteredStores.length === 0) return {};

    const C55 = 90,
      C56 = 90,
      C58 = 60;
    const values: Record<string, any> = {};

    filteredStores.forEach((_, i) => {
      const moisture = Number(watchedValues[`moistureGPerKg-${i}`]) || 0;
      const cp = Number(watchedValues[`crudeProteinGPerKg-${i}`]) || 0;
      const cfat = Number(watchedValues[`crudeFatGPerKg-${i}`]) || 0;
      const cfiber = Number(watchedValues[`crudeFiberGPerKg-${i}`]) || 0;
      const cash = Number(watchedValues[`crudeAshGPerKg-${i}`]) || 0;
      const nfe = Number(watchedValues[`nfe-${i}`]) || 0;

      const geCP = Number(watchedValues[`geCoeffCP-${i}`]) || 0;
      const geCF = Number(watchedValues[`geCoeffCF-${i}`]) || 0;
      const geNFE = Number(watchedValues[`geCoeffNFE-${i}`]) || 0;

      const carbohydrates = 1000 - moisture - (cp + cfat + cfiber + cash);
      const calculateGE =
        ((cp * geCP) / 10 + (cfat * geCF) / 10 + (nfe * geNFE) / 10) / 100;
      const calculateDigCP = (cp / 10) * C55;
      const calculateDigCF = (cfat / 10) * C56;
      const calculateDigNFE = (nfe / 10) * C58;
      const deCP = (calculateDigCP * geCP) / 10000;
      const deCF = (calculateDigCF * geCF) / 10000;
      const deNFE = (calculateDigNFE * geNFE) / 10000;
      const de = deCP + deCF + deNFE;

      values[`carbohydratesGPerKg-${i}`] = carbohydrates;
      values[`ge-${i}`] = calculateGE;
      values[`digCP-${i}`] = calculateDigCP;
      values[`digCF-${i}`] = calculateDigCF;
      values[`digNFE-${i}`] = calculateDigNFE;
      values[`deCP-${i}`] = deCP;
      values[`deCF-${i}`] = deCF;
      values[`deNFE-${i}`] = deNFE;
      values[`de-${i}`] = de;
    });

    return values;
  }, [watchedValues, filteredStores]);
  if (!filteredStores || filteredStores.length === 0) return null;

  const keys = Object.keys(filteredStores[0]).filter(
    (key) =>
      !excludedKeys.includes(key) &&
      key !== 'feedIngredients' &&
      key !== 'feedingGuide'
  );

  function transformFeedProductsWithSuppliers(flatData: Record<string, any>) {
    const result: any[] = [];
    const suppliersArray = flatData.suppliers || [];

    Object.keys(flatData).forEach((key) => {
      const match = key.match(/^(.+)-(\d+)$/);
      if (match) {
        const [, field, index] = match;
        const i = parseInt(index, 10);

        if (!result[i]) result[i] = {};
        result[i][field] = flatData[key];
      }
    });

    // Add corresponding supplierIds to each product
    return result.map((product, index) => ({
      ...product,
      supplierIds: suppliersArray[index]?.supplierIds || [],
    }));
  }
  const handleSelect = (id: string, checked: boolean) => {
    setSelectedIds((prev) =>
      checked ? [...prev, id] : prev.filter((item) => item !== id),
    );
  };

  const onSubmit = async (data: any) => {
    setIsSaving(true);
    const payload = transformFeedProductsWithSuppliers(data);
    const updatedPayload = payload.map((feed) => {
      const { ProductSupplier, supplierIds, ...rest } = feed;
      return { ...rest, ProductSupplier: supplierIds };
    });

    try {
      const token = getCookie('auth-token');
      const response = await fetch(`/api/feed-store `, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedPayload),
      });

      if (response.ok) {
        const res = await response.json();
        toast.dismiss();

        toast.success(res.message);
        router.push('/dashboard/feedSupply/libarary');
        router.refresh();
      } else {
        toast.dismiss();
        toast.error('Somethig went wrong!');
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };
  const firstRows = keys.slice(0, 2);
  const remainingRows = keys.slice(2);
  const calculatedFields = [
    'carbohydratesGPerKg',
    'ge',
    'digCP',
    'digCF',
    'digNFE',
    'deCP',
    'deCF',
    'deNFE',
    'de',
  ];
  const handleDelete = async () => {
    if (selectedIds.length === 0) {
      toast.error('Please select at least one feed to delete');
      return;
    }
    setIsDeleting(true);

    try {
      const response = await fetch('/api/feed-store', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body:
          selectedIds.length === 1
            ? JSON.stringify({ id: selectedIds[0] })
            : JSON.stringify({ ids: selectedIds }),
      });

      const res = await response.json();
      if (response.ok) {
        toast.success(res.message);
        setSelectedIds([]);
        router.refresh();
      } else {
        toast.error(res.message || 'Failed to delete feed(s)');
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsDeleting(false);
    }

  };

  function formatLabel(key: string) {
    return key
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-red-600">
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1, gap: 2 }}>
        <Button
          variant="contained"
          onClick={handleDelete}
          disabled={isDeleting}
          sx={{
            color: '#fff',
            background: '#a10606ff',
            fontWeight: 600,
            padding: '6px 16px',
            width: 'fit-content',
            textTransform: 'capitalize',
            borderRadius: '8px',
            border: '1px solid #a10606ff',
          }}
        >
          {isDeleting ? 'Deleting...' : 'Delete'}
        </Button>
        <Button
          type="submit"
          variant="contained"
          disabled={isSaving}
          sx={{
            color: '#fff',
            background: '#06A19B',
            fontWeight: 600,
            padding: '6px 16px',
            width: 'fit-content',
            textTransform: 'capitalize',
            borderRadius: '8px',
            border: '1px solid #06A19B',
          }}
        >
          {isSaving ? 'Saving...' : 'Save'}
        </Button>
      </Box>

      <TableContainer
        component={Paper}
        sx={{ height: 'calc(100vh - 262px)', overflow: 'auto' }}
      >
        <Table>
          <TableHead
            sx={{
              position: 'sticky',
              top: 0,
              backgroundColor: '#FFF',
              zIndex: 12,
            }}
          >
            <TableRow>
              {/* Static Field Column Title */}
              <TableCell
                sx={{
                  fontWeight: 500,
                  background: '#FAFAFA',
                  fontSize: 13,
                  py: 1.2,
                  px: 0,
                }}
              >
                <Typography
                  sx={{
                    fontWeight: 500,
                    background: '#FAFAFA',
                    fontSize: 13,
                    // py: 0.75,
                    px: 2,
                  }}
                >
                  Action
                </Typography>
              </TableCell>

              {/* Dynamic Store Columns */}

              {filteredStores.map((store: any, i: number) => (
                <TableCell
                  key={i}
                  sx={{
                    borderBottom: 0,
                    p: 0,
                    background: '#FAFAFA',
                  }}
                >
                  <Box
                    sx={{
                      p: 2,
                    }}
                  >
                    <Box
                      sx={{
                        border: '1px solid #0000003f',
                        px: 2,
                        borderRadius: 1,
                      }}
                    >
                      <FormControlLabel
                        sx={{ minWidth: '100%' }}
                        control={
                          <Checkbox
                            size="small"
                            checked={selectedIds.includes(store.id)}
                            onChange={(e) =>
                              handleSelect(store.id, e.target.checked)
                            }
                          />
                        }
                        label="Select"
                      />
                    </Box>
                  </Box>

                  <Divider
                    sx={{ borderBottomWidth: 1, transform: 'translateY(1px)' }}
                  />

                  {/* <Controller
                    name={`suppliers[${i}].brandName`}
                    control={control}
                    defaultValue={store.brandName || ""}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        size="small"
                        variant="outlined"
                        fullWidth
                        sx={{ fontSize: 13, px: 2 }}
                      />
                    )}
                  /> */}
                </TableCell>
              ))}
            </TableRow>

            <TableRow>
              {/* Static Field Column Title */}
              <TableCell
                sx={{
                  fontWeight: 500,
                  background: '#FAFAFA',
                  fontSize: 13,
                  py: 1.2,
                  px: 0,
                }}
              >
                <Typography
                  sx={{
                    fontWeight: 500,
                    background: '#FAFAFA',
                    fontSize: 13,
                    // py: 0.75,
                    px: 2,
                  }}
                >
                  Product Supplier
                </Typography>
              </TableCell>

              {/* Dynamic Store Columns */}

              {filteredStores.map((_: any, i: number) => (
                <TableCell
                  key={i}
                  sx={{
                    borderBottom: 0,
                    p: 0,
                    background: '#FAFAFA',
                  }}
                >
                  <Box
                    sx={{
                      px: 2,
                      py: 2,
                    }}
                  >
                    <Controller
                      name={`suppliers[${i}].supplierIds`}
                      control={control}
                      defaultValue={[]}
                      render={({ field }) => (
                        <Select
                          multiple
                          {...field}
                          sx={{
                            fontSize: { md: 14, xs: 12 },
                            fontWeight: 600,
                            px: 2,
                            whiteSpace: 'nowrap',
                            maxWidth: '270px',
                            minWidth: '270px',
                            height: '40px',
                          }}
                          renderValue={(selected) =>
                            feedSuppliers
                              .filter((s: any) => selected.includes(s.id))
                              .map((s: any) => s.name)
                              .join(', ')
                          }
                        >
                          {feedSuppliers.map((supplier: any) => (
                            <MenuItem key={supplier.id} value={supplier.id}>
                              {supplier.name}
                            </MenuItem>
                          ))}
                        </Select>
                      )}
                    />
                  </Box>

                  <Divider
                    sx={{ borderBottomWidth: 1, transform: 'translateY(1px)' }}
                  />

                  {/* <Controller
                    name={`suppliers[${i}].brandName`}
                    control={control}
                    defaultValue={store.brandName || ""}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        size="small"
                        variant="outlined"
                        fullWidth
                        sx={{ fontSize: 13, px: 2 }}
                      />
                    )}
                  /> */}
                </TableCell>
              ))}
            </TableRow>

            {firstRows.map((key) => (
              <TableRow key={key}>
                <TableCell sx={{ background: '#FAFAFA' }}>{formatLabel(key)}</TableCell>
                {filteredStores.map((_: any, colIndex: number) => (
                  <TableCell key={colIndex} sx={{ background: '#FAFAFA' }}>
                    <Controller
                      name={`${key}-${colIndex}`}
                      control={control}
                      render={({ field }) => (
                        <TextField {...field} size="small" fullWidth />
                      )}
                    />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>

          <TableBody>
            <TableRow>
              <TableCell>Species</TableCell>
              {filteredStores.map((store: any, colIndex: number) => (
                <TableCell key={colIndex}>
                  <Controller
                    name={`speciesId-${colIndex}`}
                    control={control}
                    defaultValue={store.speciesId || ''}
                    render={({ field }) => (
                      <Select
                        {...field}
                        fullWidth
                        size="small"
                        displayEmpty
                        sx={{ fontSize: 13 }}
                      >
                        <MenuItem value="">
                          <em>Select Species</em>
                        </MenuItem>
                        {featuredSpecies && featuredSpecies.length > 0 ? (
                          featuredSpecies.map((species) => (
                            <MenuItem key={species.id} value={species.id}>
                              {species.name}
                            </MenuItem>
                          ))
                        ) : (
                          <MenuItem disabled>No species available</MenuItem>
                        )}
                      </Select>
                    )}
                  />
                </TableCell>
              ))}
            </TableRow>
            {remainingRows.map((key) => (
              <TableRow key={key}>
                <TableCell>{formatLabel(key)}</TableCell>
                {filteredStores.map((_: any, colIndex: number) => (
                  <TableCell key={colIndex}>
                    <Controller
                      name={`${key}-${colIndex}`}
                      control={control}
                      render={({ field }) => {
                        const isCalculated = calculatedFields.includes(key);
                        return (
                          <TextField
                            {...field}
                            size="small"
                            fullWidth
                            disabled={isCalculated}
                            value={
                              isCalculated
                                ? calculatedValues[`${key}-${colIndex}`]
                                : field.value
                            }
                          />
                        );
                      }}
                    />
                  </TableCell>
                ))}
              </TableRow>
            ))}
            <TableRow>
              <TableCell>{formatLabel("feedIngredients")}</TableCell>
              {filteredStores.map((_: any, colIndex: number) => (
                <TableCell key={colIndex}>
                  <Controller
                    name={`feedIngredients-${colIndex}`}
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        multiline
                        focused
                        minRows={4}
                        maxRows={8}
                        sx={{
                          "& textarea": {
                            resize: "none",
                          },
                        }}
                        fullWidth
                      />
                    )}
                  />
                </TableCell>
              ))}
            </TableRow>
            <TableRow>
              <TableCell >{formatLabel("feedingGuide")}</TableCell>
              {filteredStores.map((_: any, colIndex: number) => (
                <TableCell key={colIndex} >
                  <Controller
                    name={`feedingGuide-${colIndex}`}
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        multiline
                        focused
                        minRows={4}
                        maxRows={8}
                        sx={{
                          "& textarea": {
                            resize: "none",
                          },
                        }}
                        fullWidth
                      />
                    )}
                  />
                </TableCell>
              ))}
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </form>
  );
};