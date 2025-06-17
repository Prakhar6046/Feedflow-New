"use client";
import { FeedProduct } from "@/app/_typeModels/Feed";
import { FeedSupplier } from "@/app/_typeModels/Organization";
import { selectRole } from "@/lib/features/user/userSlice";
import { useAppSelector } from "@/lib/hooks";
import {
  Box,
  Button,
  Divider,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { TransposedTable } from "./TransposedTable";
type Iprops = {
  data: FeedProduct[];
  feedSuppliers: FeedSupplier[];
};

export default function FeedStoreTable({ data, feedSuppliers }: Iprops) {
  const router = useRouter();
  const role = useAppSelector(selectRole);
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("organisation");
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
