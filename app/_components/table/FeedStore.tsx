'use client';
import { FeedProduct } from '@/app/_typeModels/Feed';
import { FeedSupplier } from '@/app/_typeModels/Organization';
import { selectRole } from '@/lib/features/user/userSlice';
import { useAppSelector } from '@/lib/hooks';
import {
  Box,
  FormControl,
  InputLabel,
  Stack,
  Typography,
} from '@mui/material';
import { MultiSelect } from 'primereact/multiselect';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { TransposedTable } from './TransposedTable';
type Iprops = {
  data: FeedProduct[];
  feedSuppliers: FeedSupplier[];
};

export default function FeedStoreTable({ data, feedSuppliers }: Iprops) {
  const router = useRouter();
  const role = useAppSelector(selectRole);
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('organisation');
  const [isApiCallInProgress, setIsApiCallInProgress] = React.useState(false);
  const [filteredStores, setFilteredStores] = React.useState<FeedProduct[]>();
  const [selectedSupplierIds, setSelectedSupplierIds] = useState<
    FeedSupplier[]
  >([]);
  const [supplierOptions, setSupplierOptions] = useState<
    {
      id: number;
      option: string;
    }[]
  >([]);
  const [selectedSupplier, setSelectedSupplier] = useState<
    {
      id: number;
      option: string;
    }[]
  >([]);

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
    if (selectedSupplier?.length && data?.length) {
      const selectedIds = selectedSupplier.map((s) => s.id);
      const filtered = data?.filter((store) =>
        store?.ProductSupplier?.some((supplierId) =>
          selectedIds.includes(Number(supplierId)),
        ),
      );
      // Sort by supplier, then by minFishSizeG
      const sorted = filtered.sort((a, b) => {
        // First sort by supplier (use first supplier ID)
        const aSupplierId = Number(a?.ProductSupplier?.[0] || 0);
        const bSupplierId = Number(b?.ProductSupplier?.[0] || 0);
        if (aSupplierId !== bSupplierId) {
          return aSupplierId - bSupplierId;
        }
        // Then sort by minFishSizeG within same supplier
        return (a?.minFishSizeG || 0) - (b?.minFishSizeG || 0);
      });
      setFilteredStores(sorted);
    } else if (selectedSupplier?.length === 0) {
      setFilteredStores([]);
    } else {
      setFilteredStores(data);
    }
  }, [selectedSupplier, data]);

  useEffect(() => {
    router.refresh();
  }, [router]);

  return (
    <>
      <Stack spacing={2} sx={{ mb: 3 }}>
        <Box>
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
            Feed Library
          </Typography>
          <Box>
            <FormControl
              className="form-input selected"
              focused
              style={{
                width: 600,
              }}
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
                className="custom-select"
              />
            </FormControl>
          </Box>
        </Box>
      </Stack>
      <TransposedTable
        feedSuppliers={feedSuppliers}
        filteredStores={filteredStores}
        selectedSupplierCount={selectedSupplier?.length || 0}
      />
    </>
  );
}
