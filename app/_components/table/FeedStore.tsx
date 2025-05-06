"use client";
import {
  farmTableHead,
  farmTableHeadMember,
  feedStoreTableHead,
} from "@/app/_lib/utils/tableHeadData";
import { FeedProduct } from "@/app/_typeModels/Feed";
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
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
type Iprops = {
  data: FeedProduct[];
};
export default function FeedStoreTable({ data }: Iprops) {
  const role = useAppSelector(selectRole);
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("organisation");
  const [filteredStores, setFilteredStores] = React.useState<FeedProduct[]>();
  const { register } = useForm();
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
  useEffect(() => {
    setFilteredStores(data);
  }, [data]);
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
            {filteredStores && filteredStores?.length > 0 ? (
              filteredStores?.map((data, idx) => (
                <TableRow
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  key={idx}
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
                    {data.productName ?? ""}
                    {/* <input
                      id="productName"
                      type="text"
                      {...register("productName")}
                    /> */}
                  </TableCell>
                  <TableCell
                    // align="center"
                    sx={{
                      borderBottomColor: "#F5F6F8",
                      borderBottomWidth: 2,
                      color: "#555555",
                      fontWeight: 500,
                      pl: 0,
                    }}
                  >
                    {data.productFormat ?? ""}
                  </TableCell>
                  <TableCell
                    // align="center"
                    sx={{
                      borderBottomColor: "#F5F6F8",
                      borderBottomWidth: 2,
                      color: "#555555",
                      fontWeight: 500,
                      pl: 0,
                    }}
                  >
                    {data.particleSize ?? ""}
                  </TableCell>
                  <TableCell
                    // align="center"
                    sx={{
                      borderBottomColor: "#F5F6F8",
                      borderBottomWidth: 2,
                      color: "#555555",
                      fontWeight: 500,
                      pl: 0,
                    }}
                  >
                    {data.fishSizeG ?? ""}
                  </TableCell>
                  <TableCell
                    // align="center"
                    sx={{
                      borderBottomColor: "#F5F6F8",
                      borderBottomWidth: 2,
                      color: "#555555",
                      fontWeight: 500,
                      pl: 0,
                    }}
                  >
                    {data.nutritionalPurpose ?? ""}
                  </TableCell>
                  <TableCell
                    // align="center"
                    sx={{
                      borderBottomColor: "#F5F6F8",
                      borderBottomWidth: 2,
                      color: "#555555",
                      fontWeight: 500,
                      pl: 0,
                    }}
                  >
                    {data.suitableSpecies ?? ""}
                  </TableCell>
                  <TableCell
                    // align="center"
                    sx={{
                      borderBottomColor: "#F5F6F8",
                      borderBottomWidth: 2,
                      color: "#555555",
                      fontWeight: 500,
                      pl: 0,
                    }}
                  >
                    {data.suitabilityAnimalSize ?? ""}
                  </TableCell>
                  <TableCell
                    // align="center"
                    sx={{
                      borderBottomColor: "#F5F6F8",
                      borderBottomWidth: 2,
                      color: "#555555",
                      fontWeight: 500,
                      pl: 0,
                    }}
                  >
                    {data.productionIntensity ?? ""}
                  </TableCell>
                  <TableCell
                    // align="center"
                    sx={{
                      borderBottomColor: "#F5F6F8",
                      borderBottomWidth: 2,
                      color: "#555555",
                      fontWeight: 500,
                      pl: 0,
                    }}
                  >
                    {data.suitabilityUnit ?? ""}
                  </TableCell>
                  <TableCell
                    // align="center"
                    sx={{
                      borderBottomColor: "#F5F6F8",
                      borderBottomWidth: 2,
                      color: "#555555",
                      fontWeight: 500,
                      pl: 0,
                    }}
                  >
                    {data.feedingPhase ?? ""}
                  </TableCell>
                  <TableCell
                    // align="center"
                    sx={{
                      borderBottomColor: "#F5F6F8",
                      borderBottomWidth: 2,
                      color: "#555555",
                      fontWeight: 500,
                      pl: 0,
                    }}
                  >
                    {data.lifeStage ?? ""}
                  </TableCell>
                  <TableCell
                    // align="center"
                    sx={{
                      borderBottomColor: "#F5F6F8",
                      borderBottomWidth: 2,
                      color: "#555555",
                      fontWeight: 500,
                      pl: 0,
                    }}
                  >
                    {data.shelfLifeMonths ?? ""}
                  </TableCell>
                  <TableCell
                    // align="center"
                    sx={{
                      borderBottomColor: "#F5F6F8",
                      borderBottomWidth: 2,
                      color: "#555555",
                      fontWeight: 500,
                      pl: 0,
                    }}
                  >
                    {data.feedCost ?? ""}
                  </TableCell>
                  <TableCell
                    // align="center"
                    sx={{
                      borderBottomColor: "#F5F6F8",
                      borderBottomWidth: 2,
                      color: "#555555",
                      fontWeight: 500,
                      pl: 0,
                    }}
                  >
                    {data.feedIngredients ?? ""}
                  </TableCell>
                  <TableCell
                    // align="center"
                    sx={{
                      borderBottomColor: "#F5F6F8",
                      borderBottomWidth: 2,
                      color: "#555555",
                      fontWeight: 500,
                      pl: 0,
                    }}
                  >
                    {data.moistureGPerKg ?? ""}
                  </TableCell>
                  <TableCell
                    // align="center"
                    sx={{
                      borderBottomColor: "#F5F6F8",
                      borderBottomWidth: 2,
                      color: "#555555",
                      fontWeight: 500,
                      pl: 0,
                    }}
                  >
                    {data.crudeProteinGPerKg ?? ""}
                  </TableCell>
                  <TableCell
                    // align="center"
                    sx={{
                      borderBottomColor: "#F5F6F8",
                      borderBottomWidth: 2,
                      color: "#555555",
                      fontWeight: 500,
                      pl: 0,
                    }}
                  >
                    {data.crudeFatGPerKg ?? ""}
                  </TableCell>
                  <TableCell
                    // align="center"
                    sx={{
                      borderBottomColor: "#F5F6F8",
                      borderBottomWidth: 2,
                      color: "#555555",
                      fontWeight: 500,
                      pl: 0,
                    }}
                  >
                    {data.crudeFiberGPerKg ?? ""}
                  </TableCell>
                  <TableCell
                    // align="center"
                    sx={{
                      borderBottomColor: "#F5F6F8",
                      borderBottomWidth: 2,
                      color: "#555555",
                      fontWeight: 500,
                      pl: 0,
                    }}
                  >
                    {data.crudeAshGPerKg ?? ""}
                  </TableCell>
                  <TableCell
                    // align="center"
                    sx={{
                      borderBottomColor: "#F5F6F8",
                      borderBottomWidth: 2,
                      color: "#555555",
                      fontWeight: 500,
                      pl: 0,
                    }}
                  >
                    {data.nfe ?? ""}
                  </TableCell>
                  <TableCell
                    // align="center"
                    sx={{
                      borderBottomColor: "#F5F6F8",
                      borderBottomWidth: 2,
                      color: "#555555",
                      fontWeight: 500,
                      pl: 0,
                    }}
                  >
                    {data.calciumGPerKg ?? ""}
                  </TableCell>
                  <TableCell
                    // align="center"
                    sx={{
                      borderBottomColor: "#F5F6F8",
                      borderBottomWidth: 2,
                      color: "#555555",
                      fontWeight: 500,
                      pl: 0,
                    }}
                  >
                    {data.phosphorusGPerKg ?? ""}
                  </TableCell>
                  <TableCell
                    // align="center"
                    sx={{
                      borderBottomColor: "#F5F6F8",
                      borderBottomWidth: 2,
                      color: "#555555",
                      fontWeight: 500,
                      pl: 0,
                    }}
                  >
                    {data.carbohydratesGPerKg ?? ""}
                  </TableCell>
                  <TableCell
                    // align="center"
                    sx={{
                      borderBottomColor: "#F5F6F8",
                      borderBottomWidth: 2,
                      color: "#555555",
                      fontWeight: 500,
                      pl: 0,
                    }}
                  >
                    {data.metabolizableEnergy ?? ""}
                  </TableCell>
                  <TableCell
                    // align="center"
                    sx={{
                      borderBottomColor: "#F5F6F8",
                      borderBottomWidth: 2,
                      color: "#555555",
                      fontWeight: 500,
                      pl: 0,
                    }}
                  >
                    {data.feedingGuide ?? ""}
                  </TableCell>
                  <TableCell
                    // align="center"
                    sx={{
                      borderBottomColor: "#F5F6F8",
                      borderBottomWidth: 2,
                      color: "#555555",
                      fontWeight: 500,
                      pl: 0,
                    }}
                  >
                    {data.geCoeffCP ?? ""}
                  </TableCell>
                  <TableCell
                    // align="center"
                    sx={{
                      borderBottomColor: "#F5F6F8",
                      borderBottomWidth: 2,
                      color: "#555555",
                      fontWeight: 500,
                      pl: 0,
                    }}
                  >
                    {data.geCoeffCF ?? ""}
                  </TableCell>
                  <TableCell
                    // align="center"
                    sx={{
                      borderBottomColor: "#F5F6F8",
                      borderBottomWidth: 2,
                      color: "#555555",
                      fontWeight: 500,
                      pl: 0,
                    }}
                  >
                    {data.geCoeffNFE ?? ""}
                  </TableCell>
                  <TableCell
                    // align="center"
                    sx={{
                      borderBottomColor: "#F5F6F8",
                      borderBottomWidth: 2,
                      color: "#555555",
                      fontWeight: 500,
                      pl: 0,
                    }}
                  >
                    {data.ge ?? ""}
                  </TableCell>
                  <TableCell
                    // align="center"
                    sx={{
                      borderBottomColor: "#F5F6F8",
                      borderBottomWidth: 2,
                      color: "#555555",
                      fontWeight: 500,
                      pl: 0,
                    }}
                  >
                    {data.digCP ?? ""}
                  </TableCell>
                  <TableCell
                    // align="center"
                    sx={{
                      borderBottomColor: "#F5F6F8",
                      borderBottomWidth: 2,
                      color: "#555555",
                      fontWeight: 500,
                      pl: 0,
                    }}
                  >
                    {data.digCF ?? ""}
                  </TableCell>
                  <TableCell
                    // align="center"
                    sx={{
                      borderBottomColor: "#F5F6F8",
                      borderBottomWidth: 2,
                      color: "#555555",
                      fontWeight: 500,
                      pl: 0,
                    }}
                  >
                    {data.digNFE ?? ""}
                  </TableCell>
                  <TableCell
                    // align="center"
                    sx={{
                      borderBottomColor: "#F5F6F8",
                      borderBottomWidth: 2,
                      color: "#555555",
                      fontWeight: 500,
                      pl: 0,
                    }}
                  >
                    {data.deCP ?? ""}
                  </TableCell>
                  <TableCell
                    // align="center"
                    sx={{
                      borderBottomColor: "#F5F6F8",
                      borderBottomWidth: 2,
                      color: "#555555",
                      fontWeight: 500,
                      pl: 0,
                    }}
                  >
                    {data.deCF ?? ""}
                  </TableCell>
                  <TableCell
                    // align="center"
                    sx={{
                      borderBottomColor: "#F5F6F8",
                      borderBottomWidth: 2,
                      color: "#555555",
                      fontWeight: 500,
                      pl: 0,
                    }}
                  >
                    {data.deNFE ?? ""}
                  </TableCell>
                  <TableCell
                    // align="center"
                    sx={{
                      borderBottomColor: "#F5F6F8",
                      borderBottomWidth: 2,
                      color: "#555555",
                      fontWeight: 500,
                      pl: 0,
                    }}
                  >
                    {data.de ?? ""}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow
                key={"no table"}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                No Data Found
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
