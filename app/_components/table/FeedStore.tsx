'use client';
import { FeedProduct } from '@/app/_typeModels/Feed';
import { FeedSupplier } from '@/app/_typeModels/Organization';

import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { TransposedTable } from './TransposedTable';
type Iprops = {
  data: FeedProduct[];
  feedSuppliers: FeedSupplier[];
};

export default function FeedStoreTable({ data, feedSuppliers }: Iprops) {
  const router = useRouter();
  const [filteredStores, setFilteredStores] = React.useState<FeedProduct[]>([]);

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
