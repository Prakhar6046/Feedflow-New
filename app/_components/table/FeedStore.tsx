'use client';
import { FeedProduct } from '@/app/_typeModels/Feed';
import { FeedSupplier } from '@/app/_typeModels/Organization';
import { selectRole } from '@/lib/features/user/userSlice';
import { useAppSelector } from '@/lib/hooks';

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

  useEffect(() => {
    setFilteredStores(data);
  }, [data]);

  useEffect(() => {
    router.refresh();
  }, [router]);

  return (
    <>
      <TransposedTable
        feedSuppliers={feedSuppliers}
        filteredStores={filteredStores}
      />
    </>
  );
}
