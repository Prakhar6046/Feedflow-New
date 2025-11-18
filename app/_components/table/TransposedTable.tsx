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
import { clientSecureFetch } from '@/app/_lib/clientSecureFetch';

interface Props {
  feedSuppliers: any;
  filteredStores: any;
  selectedSupplierCount?: number;
}

export const TransposedTable = ({ feedSuppliers, filteredStores, selectedSupplierCount = 0 }: Props) => {
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
    try {
      const res = await clientSecureFetch('/api/species', {
        method: 'GET',
      });
      if (res.ok) {
        const data = await res.json();
        setSpeciesList(data || []);
      } else {
        console.error('Failed to fetch species:', res.status);
        setSpeciesList([]);
      }
    } catch (error) {
      console.error('Error fetching species:', error);
      setSpeciesList([]);
    }
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
            // Ensure values are never undefined - use empty string for strings, 0 for numbers
            const defaultValue = value ?? (typeof value === 'number' ? 0 : '');
            defaultValues[`${key}-${colIndex}`] = defaultValue;
          }
        });
        defaultValues[`speciesId-${colIndex}`] = item.speciesId || '';
        defaultValues[`isDefault-${colIndex}`] = item.isDefault || false;
        defaultValues[`feedIngredients-${colIndex}`] = item.feedIngredients || '';
        defaultValues[`feedingGuide-${colIndex}`] = item.feedingGuide || '';
      });
      reset(defaultValues);
    } else {
      // Reset form when no data
      reset({});
    }
  }, [filteredStores, reset]);

  useEffect(() => {
    if (filteredStores && filteredStores.length > 0) {
      filteredStores.forEach((store: any, i: number) => {
        setValue(`suppliers[${i}].supplierIds`, store.ProductSupplier || [], {
          shouldValidate: false,
          shouldDirty: false,
        });
      });
    }
  }, [filteredStores, setValue]);
  // Watch all form values for overlap checks and calculations
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

  // Check if we should show empty state message
  if (!filteredStores || filteredStores.length === 0) {
    return (
      <Box
        sx={{
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          p: 10,
          backgroundColor: '#FAFAFA',
          borderRadius: 2,
          border: '1px solid #e0e0e0',
        }}
      >
        <Typography sx={{ textAlign: 'center' }} variant="h6" color="text.secondary" gutterBottom>
          {selectedSupplierCount === 0
            ? 'Please select at least one feed supplier to view feeds'
            : 'No Feed Data Available'}
        </Typography>
        <Typography sx={{ textAlign: 'center' }} variant="body1" color="text.secondary">
          {selectedSupplierCount === 0
            ? 'Select feed suppliers from the dropdown above to filter and view available feeds.'
            : 'Please add feed products to view and manage them here.'}
        </Typography>
      </Box>
    );
  }

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
  // useEffect(() => {
  //   if (!filteredStores || filteredStores.length === 0) {
  //     router.push('/dashboard/feedSupply/libarary/new');
  //   }
  // }, [filteredStores, router]);
  // Helper function to check if a feed would cause overlap when set as default
  const wouldCauseOverlap = (colIndex: number, wantsToBeDefault: boolean, allFeeds: any[], watchedValues: any) => {
    if (!wantsToBeDefault) return false;

    // Get current feed data
    const currentFeed = allFeeds[colIndex];
    const minFishSize = Number(watchedValues[`minFishSizeG-${colIndex}`]) || currentFeed?.minFishSizeG;
    const maxFishSize = Number(watchedValues[`maxFishSizeG-${colIndex}`]) || currentFeed?.maxFishSizeG;

    // Get current feed's suppliers (from form or original data)
    const currentSupplierIds = watchedValues[`suppliers[${colIndex}].supplierIds`] || currentFeed?.ProductSupplier || [];
    const currentSupplierIdsNormalized = currentSupplierIds.map((id: any) => String(id));

    // Check against all other feeds
    for (let i = 0; i < allFeeds.length; i++) {
      if (i === colIndex) continue;

      const otherFeedIsDefault = watchedValues[`isDefault-${i}`] || allFeeds[i]?.isDefault;
      if (!otherFeedIsDefault) continue;

      // Get other feed's suppliers
      const otherSupplierIds = watchedValues[`suppliers[${i}].supplierIds`] || allFeeds[i]?.ProductSupplier || [];
      const otherSupplierIdsNormalized = otherSupplierIds.map((id: any) => String(id));

      // Check if feeds share any common supplier
      const hasCommonSupplier = currentSupplierIdsNormalized.some((id: string) =>
        otherSupplierIdsNormalized.includes(id)
      );

      // Only check for overlap if feeds share a common supplier
      if (!hasCommonSupplier) continue;

      const otherMin = Number(watchedValues[`minFishSizeG-${i}`]) || allFeeds[i]?.minFishSizeG;
      const otherMax = Number(watchedValues[`maxFishSizeG-${i}`]) || allFeeds[i]?.maxFishSizeG;

      // Check if ranges overlap (excluding touching edges)
      // Ranges overlap if there's actual intersection, not just touching at edges
      // Standard overlap: maxFishSize > otherMin AND minFishSize < otherMax
      // With tolerance: maxFishSize - EPSILON > otherMin + EPSILON AND minFishSize + EPSILON < otherMax - EPSILON
      const EPSILON = 0.001;
      const rangesOverlap =
        maxFishSize - EPSILON > otherMin + EPSILON &&
        minFishSize + EPSILON < otherMax - EPSILON;

      if (rangesOverlap) {
        const otherProductName = watchedValues[`productName-${i}`] || allFeeds[i]?.productName || 'Unknown';
        const supplierName = feedSuppliers?.find((s: any) =>
          currentSupplierIdsNormalized.includes(String(s.id))
        )?.name || 'Unknown Supplier';
        return {
          error: true,
          message: `Cannot set as default for ${supplierName}. Overlaps with "${otherProductName}" (${otherMin}-${otherMax}g) within the same supplier. Only one default feed can exist per supplier for any given fish size range.`
        };
      }
    }

    return { error: false };
  };

  const validateDefaultFeeds = (payload: any[]) => {
    // Group feeds by supplier
    const supplierGroups: Record<string, any[]> = {};

    payload.forEach((feed) => {
      const suppliers = feed.ProductSupplier || [];
      suppliers.forEach((supplierId: string) => {
        if (!supplierGroups[supplierId]) {
          supplierGroups[supplierId] = [];
        }
        supplierGroups[supplierId].push(feed);
      });
    });

    // Validate each supplier group
    for (const [supplierId, feeds] of Object.entries(supplierGroups)) {
      const defaultFeeds = feeds.filter((f: any) => f.isDefault);

      if (defaultFeeds.length === 0) continue;

      // Sort by minFishSizeG
      defaultFeeds.sort((a, b) => a.minFishSizeG - b.minFishSizeG);

      const EPSILON = 0.001; 

      for (let i = 0; i < defaultFeeds.length; i++) {
        for (let j = i + 1; j < defaultFeeds.length; j++) {
          const feed1 = defaultFeeds[i];
          const feed2 = defaultFeeds[j];

          const rangesOverlap =
            feed1.maxFishSizeG - EPSILON > feed2.minFishSizeG + EPSILON &&
            feed1.minFishSizeG + EPSILON < feed2.maxFishSizeG - EPSILON;

          if (rangesOverlap) {
            throw new Error(
              `Cannot set multiple default feeds for overlapping fish size ranges. ` +
              `"${feed1.productName}" (${feed1.minFishSizeG}-${feed1.maxFishSizeG}g) and ` +
              `"${feed2.productName}" (${feed2.minFishSizeG}-${feed2.maxFishSizeG}g) overlap. ` +
              `Please ensure only one default feed exists for any given fish size range.`
            );
          }
        }
      }


      // Check for gaps in fish size coverage within this supplier
      if (defaultFeeds.length > 1) {
        // Sort by minFishSizeG to check sequential gaps
        for (let i = 0; i < defaultFeeds.length - 1; i++) {
          const current = defaultFeeds[i];
          const next = defaultFeeds[i + 1];
          const EPSILON = 0.001;

          // Check if there's a gap (current.max < next.min - EPSILON)
          if (current.maxFishSizeG + EPSILON < next.minFishSizeG) {
            const gapStart = current.maxFishSizeG;
            const gapEnd = next.minFishSizeG;
            const supplierName = feedSuppliers?.find((s: any) =>
              String(s.id) === supplierId
            )?.name || 'Unknown Supplier';

            throw new Error(
              `Gap detected in default feeds for ${supplierName}. ` +
              `Fish size range between ${gapStart.toFixed(2)}g and ${gapEnd.toFixed(2)}g ` +
              `is not covered between "${current.productName}" ` +
              `(${current.minFishSizeG}-${current.maxFishSizeG}g) and ` +
              `"${next.productName}" (${next.minFishSizeG}-${next.maxFishSizeG}g). ` +
              `Please ensure continuous coverage (even for decimal values).`
            );
          }

        }
      }
    }
  };

  const onSubmit = async (data: any) => {
    setIsSaving(true);
    const payload = transformFeedProductsWithSuppliers(data);
    const updatedPayload = payload.map((feed, index) => {
      const { ProductSupplier, supplierIds, minFishSizeG, maxFishSizeG, isDefault, ...rest } = feed;
      
      // Override with freshly calculated values from calculatedValues memo
      const calculatedOverrides = {
        carbohydratesGPerKg: calculatedValues[`carbohydratesGPerKg-${index}`],
        ge: calculatedValues[`ge-${index}`],
        digCP: calculatedValues[`digCP-${index}`],
        digCF: calculatedValues[`digCF-${index}`],
        digNFE: calculatedValues[`digNFE-${index}`],
        deCP: calculatedValues[`deCP-${index}`],
        deCF: calculatedValues[`deCF-${index}`],
        deNFE: calculatedValues[`deNFE-${index}`],
        de: calculatedValues[`de-${index}`],
      };
    
      return {
        ...rest,
        ...calculatedOverrides, // Apply calculated values
        ProductSupplier: supplierIds,
        minFishSizeG: Number(minFishSizeG),
        maxFishSizeG: Number(maxFishSizeG),
        isDefault: Boolean(isDefault)
      };
    });

    // Validate default feeds for overlaps
    try {
      validateDefaultFeeds(updatedPayload);
    } catch (validationError: any) {
      setIsSaving(false);
      toast.error(validationError.message);
      return;
    }

    try {
      const token = getCookie('auth-token');
      const response = await clientSecureFetch(`/api/feed-store `, {
        method: 'PUT',
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
      const response = await clientSecureFetch('/api/feed-store', {
        method: 'DELETE',
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
                {filteredStores.map((store: any, colIndex: number) => (
                  <TableCell key={colIndex} sx={{ background: '#FAFAFA' }}>
                    <Controller
                      name={`${key}-${colIndex}`}
                      control={control}
                      defaultValue={store[key] ?? ''}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          size="small"
                          fullWidth
                          value={field.value ?? ''}
                        />
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
            <TableRow>
              <TableCell>Ad-hoc</TableCell>
              {filteredStores.map((_: any, colIndex: number) => (
                <TableCell key={colIndex}>
                  <Controller
                    name={`isDefault-${colIndex}`}
                    control={control}
                    defaultValue={filteredStores[colIndex]?.isDefault || false}
                    render={({ field }) => (
                      <Button
                        variant={field.value ? "contained" : "outlined"}
                        onClick={() => {
                          const wantsToBeDefault = !field.value;
                          const overlapCheck = wouldCauseOverlap(colIndex, wantsToBeDefault, filteredStores, watchedValues);

                          if (overlapCheck && overlapCheck.error) {
                            toast.error(overlapCheck.message);
                            return;
                          }

                          field.onChange(wantsToBeDefault);
                        }}
                        sx={{
                          minWidth: 300,
                          background: field.value ? '#06A19B' : 'transparent',
                          color: field.value ? '#fff' : '#06A19B',
                          border: '1px solid #0000003f',
                          px: 2,
                          borderRadius: 1,
                        }}
                      >
                        Default
                      </Button>
                    )}
                  />
                </TableCell>
              ))}
            </TableRow>
            {remainingRows.map((key) => (
              <TableRow key={key}>
                <TableCell>{formatLabel(key)}</TableCell>
                {filteredStores.map((store: any, colIndex: number) => (
                  <TableCell key={colIndex}>
                    <Controller
                      name={`${key}-${colIndex}`}
                      control={control}
                      defaultValue={store[key] ?? ''}
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
                                ? (calculatedValues[`${key}-${colIndex}`] ?? '')
                                : (field.value ?? '')
                            }
                          />
                        );
                      }}
                    />
                  </TableCell>
                ))}
              </TableRow>
            ))}
            {/* <TableRow>
              <TableCell>Ad-hoc</TableCell>
              {filteredStores.map((_: any, colIndex: number) => (
                <TableCell key={colIndex}>
                  <Controller
                    name={`isDefault-${colIndex}`}
                    control={control}
                    defaultValue={filteredStores[colIndex]?.isDefault || false}
                    render={({ field }) => (
                      <Button
                        variant={field.value ? "contained" : "outlined"}
                        onClick={() => field.onChange(!field.value)}

                        sx={{
                          minWidth: 300,
                          background: field.value ? '#06A19B' : 'transparent',
                          color: field.value ? '#fff' : '#06A19B',
                          border: '1px solid #0000003f',
                          px: 2,
                          borderRadius: 1,
                        }}
                      >
                        Default
                      </Button>
                    )}
                  />
                </TableCell>
              ))}
            </TableRow> */}
            <TableRow>
              <TableCell>{formatLabel("feedIngredients")}</TableCell>
              {filteredStores.map((store: any, colIndex: number) => (
                <TableCell key={colIndex}>
                  <Controller
                    name={`feedIngredients-${colIndex}`}
                    control={control}
                    defaultValue={store.feedIngredients || ''}
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
                        value={field.value ?? ''}
                      />
                    )}
                  />
                </TableCell>
              ))}
            </TableRow>
            <TableRow>
              <TableCell >{formatLabel("feedingGuide")}</TableCell>
              {filteredStores.map((store: any, colIndex: number) => (
                <TableCell key={colIndex} >
                  <Controller
                    name={`feedingGuide-${colIndex}`}
                    control={control}
                    defaultValue={store.feedingGuide || ''}
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
                        value={field.value ?? ''}
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