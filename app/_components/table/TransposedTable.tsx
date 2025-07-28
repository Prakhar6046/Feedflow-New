'use client';
import {
  Box,
  Button,
  Divider,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { useForm, Controller, Control, FieldValues } from 'react-hook-form';
import { useEffect } from 'react';

import toast from 'react-hot-toast';

import { FeedSupplier } from '@/app/_typeModels/Organization';
import { FeedProduct } from '@/app/_typeModels/Feed';

interface Props {
  feedSuppliers: FeedSupplier[];
  filteredStores: FeedProduct[];
}

// Type for the suppliers array in the form
interface Supplier {
  supplierIds: string[];
}

// Type for the flat form data

interface FlatFormData extends Record<string, unknown> {
  suppliers?: Supplier[];
}

export const TransposedTable = ({ feedSuppliers, filteredStores }: Props) => {
  const { control, handleSubmit, reset, setValue } = useForm<any>({
    defaultValues: { suppliers: [] },
  });

  const excludedKeys = [
    'id',
    'createdAt',
    'updatedAt',
    'organaisationId',
    'ProductSupplier',
  ];

  useEffect(() => {
    if (filteredStores?.length) {
      // Prepare flat key-value for default values
      const defaultValues: FlatFormData = {};
      filteredStores.forEach((item, colIndex: number) => {
        Object.entries(item).forEach(([key, value]) => {
          if (!['createdAt', 'updatedAt', 'organaisationId'].includes(key)) {
            defaultValues[`${key}-${colIndex}`] = value as string | number;
          }
        });
      });
      reset(defaultValues);
    }
  }, [filteredStores, reset]);

  useEffect(() => {
    if (filteredStores) {
      filteredStores?.map((store: FeedProduct, i: number) => {
        return setValue(`suppliers[${i}].supplierIds`, store.ProductSupplier);
      });
    }
  }, [filteredStores, setValue]);

  if (!filteredStores || filteredStores.length === 0) return null;

  const keys = Object.keys(filteredStores[0]).filter(
    (key) => !excludedKeys.includes(key),
  );

  function transformFeedProductsWithSuppliers(flatData: FlatFormData) {
    const result: Record<string, unknown>[] = [];
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

  const onSubmit = async (data: FlatFormData) => {
    const payload = transformFeedProductsWithSuppliers(data);
    const updatedPayload = payload.map((feed) => {
      const { ProductSupplier, supplierIds, ...rest } = feed as Record<
        string,
        unknown
      > & { supplierIds?: string[]; ProductSupplier?: string };
      return { ...rest, ProductSupplier: supplierIds };
    });

    try {
      const response = await fetch(`/api/feed-store `, {
        method: 'PUT',

        body: JSON.stringify(updatedPayload),
      });

      if (response.ok) {
        const res = await response.json();
        toast.dismiss();
        toast.success(res.message);
      } else {
        toast.dismiss();
        toast.error('Somethig went wrong!');
      }
    } catch {
      toast.error('Something went wrong. Please try again.');
    }
  };

  const firstRows = keys.slice(0, 2);
  const remainingRows = keys.slice(2);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
        <Button
          type="submit"
          variant="contained"
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
          Save
        </Button>
      </Box>

      <TableContainer
        component={Paper}
        sx={{ height: '550px', overflow: 'auto' }}
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
                  Product Supplier
                </Typography>
              </TableCell>

              {/* Dynamic Store Columns */}
              {filteredStores.map((_: FeedProduct, i: number) => (
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
                      control={control as unknown as Control<FieldValues>}
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
                          renderValue={(selected: string[]) =>
                            feedSuppliers
                              .filter((s) => selected.includes(s.id.toString()))
                              .map((s) => s.name)
                              .join(', ')
                          }
                        >
                          {feedSuppliers.map((supplier) => (
                            <MenuItem
                              key={supplier.id}
                              value={supplier.id.toString()}
                            >
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
                </TableCell>
              ))}
            </TableRow>

            {firstRows.map((key) => (
              <TableRow key={key}>
                <TableCell sx={{ background: '#FAFAFA' }}>{key}</TableCell>
                {filteredStores.map((_: FeedProduct, colIndex: number) => (
                  <TableCell key={colIndex} sx={{ background: '#FAFAFA' }}>
                    <Controller
                      name={`${key}-${colIndex}`}
                      control={control as unknown as Control<FieldValues>}
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
            {remainingRows.map((key) => (
              <TableRow key={key}>
                <TableCell>{key}</TableCell>
                {filteredStores.map((_: FeedProduct, colIndex: number) => (
                  <TableCell key={colIndex}>
                    <Controller
                      name={`${key}-${colIndex}`}
                      control={control as unknown as Control<FieldValues>}
                      render={({ field }) => (
                        <TextField {...field} size="small" fullWidth />
                      )}
                    />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </form>
  );
};
