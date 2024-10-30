"use client";
import { feedAction } from "@/lib/features/feed/feedSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  Box,
  Button,
  Divider,
  Menu,
  MenuItem,
  Modal,
  Stack,
  TableSortLabel,
  TextField,
  Typography,
} from "@mui/material";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

import { selectRole, userAction } from "@/lib/features/user/userSlice";
import {
  feedSupplyTableHead,
  feedSupplyTableHeadMember,
} from "@/app/_lib/utils/tableHeadData";
import { breadcrumsAction } from "@/lib/features/breadcrum/breadcrumSlice";
import { getCookie } from "cookies-next";
import BasicBreadcrumbs from "@/app/_components/Breadcrumbs";
import { FeedSupply } from "@/app/_components/feedSupply/FeedSelection";
import CalculateVolume from "@/app/_components/models/FarmManager";
import TransferModal from "@/app/_components/models/FarmManager";
import HarvestModal from "@/app/_components/models/Harvest";
import MortalityModal from "@/app/_components/models/Mortality";

export default function FarmManager({ feeds }: any) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const pathName = usePathname();
  const sortDataFromLocal = getCookie(pathName);
  //   const loading = useAppSelector(selectFarmLoading);
  const [feedsData, setFeedsData] = useState<any>();
  const [selectedFeed, setSelectedFeed] = useState<any>(null);
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );
  const [openTransferModal, setOpenTransferModal] = useState<boolean>(false);
  const [openHarvestModal, setOpenHarvestModal] = useState<boolean>(false);
  const [openMoralityModal, setOpenMoralityModal] = useState<boolean>(false);
  const role = useAppSelector(selectRole);
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("productName");
  const handleClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    farm: any
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedFeed(farm);
  };
  const handleEdit = () => {
    if (selectedFeed) {
      router.push(`/dashboard/feedSupply/${selectedFeed.id}`);
      dispatch(feedAction.editFeed(selectedFeed));
    }
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);

  useEffect(() => {
    router.refresh();
  }, [router]);
  function EnhancedTableHead(data: any) {
    const { order, orderBy, onRequestSort } = data;
    const createSortHandler =
      (property: string) => (event: React.MouseEvent<HTMLButtonElement>) => {
        onRequestSort(event, property);
      };
  }

  const handleRequestSort = (
    _: React.MouseEvent<HTMLButtonElement> | null,
    property: string
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
    dispatch(
      breadcrumsAction.handleSort({
        direction: isAsc ? "desc" : "asc",
        column: property,
      })
    );
  };

  useEffect(() => {
    if (feeds && !sortDataFromLocal) {
      setFeedsData(feeds);
    }
  }, [feeds]);
  useEffect(() => {
    if (sortDataFromLocal) {
      const data = JSON.parse(sortDataFromLocal);
      setOrder(data.direction);
      setOrderBy(data.column);
      // handleRequestSort(null, data.column);
      if (feeds) {
        const sortedData = [...feeds].sort((feed1: any, feed2: any) => {
          const orderType = data.direction === "asc" ? -1 : 1;
          if (data.column === "productName") {
            if (feed1.productName < feed2.productName) return -1 * orderType;
            if (feed1.productName > feed2.productName) return 1 * orderType;
          } else if (data.column === "productCode") {
            if (feed1.productCode < feed2.productCode) return -1 * orderType;
            if (feed1.productCode > feed2.productCode) return 1 * orderType;
          } else if (data.column === "productionIntensity") {
            if (feed1.productionIntensity < feed2.productionIntensity)
              return -1 * orderType;
            if (feed1.productionIntensity > feed2.productionIntensity)
              return 1 * orderType;
          } else if (data.column === "feedingPhase") {
            if (feed1.feedingPhase < feed2.feedingPhase) return -1 * orderType;
            if (feed1.feedingPhase > feed2.feedingPhase) return 1 * orderType;
          }
          return 0;
        });
        setFeedsData(sortedData);
      }
    }
  }, [sortDataFromLocal]);

  return (
    <>
      <BasicBreadcrumbs
        heading={"Feed Store"}
        isTable={true}
        buttonRoute="/dashboard/Farm Manager/new"
        links={[
          { name: "Dashboard", link: "/dashboard" },
          { name: "Farm", link: "/dashboard/feedStore" },
        ]}
      />
    </>
  );
}
