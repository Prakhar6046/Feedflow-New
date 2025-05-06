"use client";
import {
  farmTableHead,
  farmTableHeadMember,
  feedStoreTableHead,
} from "@/app/_lib/utils/tableHeadData";
import { selectRole } from "@/lib/features/user/userSlice";
import { useAppSelector } from "@/lib/hooks";
import { TableSortLabel } from "@mui/material";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import React from "react";

export default function FeedStoreTable() {
  const role = useAppSelector(selectRole);
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("organisation");

  function EnhancedTableHead(data: any) {
    const { order, orderBy, onRequestSort } = data;
    const createSortHandler =
      (property: string) => (event: React.MouseEvent<HTMLButtonElement>) => {
        onRequestSort(event, property);
      };

    return (
      <TableHead>
        <TableRow>
          {(role !== "MEMBER" ? feedStoreTableHead : feedStoreTableHead).map(
            (headCell, idx, headCells) => (
              <TableCell
                key={headCell.id}
                sortDirection={
                  idx === headCells.length - 1
                    ? false
                    : orderBy === headCell.id
                    ? order
                    : false
                }
                sx={{
                  borderBottom: 0,
                  color: "#67737F",
                  background: "#F5F6F8",
                  fontSize: {
                    md: 16,
                    xs: 14,
                  },
                  fontWeight: 600,
                  paddingLeft: {
                    lg: idx === 0 ? 10 : 0,
                    md: idx === 0 ? 7 : 0,
                    xs: idx === 0 ? 4 : 0,
                  },
                }}
              >
                {idx === headCells.length - 1 ? (
                  headCell.label
                ) : (
                  <TableSortLabel
                    active={orderBy === headCell.id}
                    direction={orderBy === headCell.id ? order : "asc"}
                    onClick={createSortHandler(headCell.id)}
                  >
                    {headCell.label}
                  </TableSortLabel>
                )}
              </TableCell>
            )
          )}
        </TableRow>
      </TableHead>
    );
  }

  return (
    <Paper
      sx={{
        width: "100%",
        overflow: "hidden",
        borderRadius: "14px",
        boxShadow: "0px 0px 16px 5px #0000001A",
        mt: 4,
      }}
    >
      <TableContainer
        sx={{
          maxHeight: "72.5vh",
        }}
      >
        <Table stickyHeader aria-label="sticky table">
          <EnhancedTableHead order={order} orderBy={orderBy} />
          <TableBody>
            <TableRow
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell
                // align="center"
                sx={{
                  borderBottomColor: "#F5F6F8",
                  borderBottomWidth: 2,
                  color: "#555555",
                  maxWidth: 250,
                  fontWeight: 500,
                  wordBreak: "break-all",
                  paddingLeft: {
                    lg: 10,
                    md: 7,
                    xs: 4,
                  },
                }}
                component="th"
                scope="row"
              >
                {"test"}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
