"use client";
import { Farm } from "@/app/_typeModels/Farm";
import { breadcrumsAction } from "@/lib/features/breadcrum/breadcrumSlice";
import { farmAction, selectFarmLoading } from "@/lib/features/farm/farmSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  Button,
  Menu,
  MenuItem,
  Stack,
  TableSortLabel,
  Typography,
} from "@mui/material";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { getCookie, setCookie } from "cookies-next";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Loader from "../Loader";
import { selectRole } from "@/lib/features/user/userSlice";
import {
  farmTableHead,
  farmTableHeadMember,
} from "@/app/_lib/utils/tableHeadData";

interface Props {
  farms: Farm[];
}
export default function FarmTable({ farms }: Props) {
  const router = useRouter();
  const pathName = usePathname();
  const dispatch = useAppDispatch();
  const sortDataFromLocal = getCookie(pathName);
  // const farms = useAppSelector(selectFarms);
  const role = useAppSelector(selectRole);
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("organisation");
  const [farmsData, setFarmsData] = useState<any>();
  const loading = useAppSelector(selectFarmLoading);
  // const [farmsData, setFarmsData] = useState<any>();
  const [selectedFarm, setSelectedFarm] = useState<any>(null);
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );

  const handleClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    farm: any
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedFarm(farm);
  };
  const handleEdit = () => {
    if (selectedFarm) {
      dispatch(farmAction.handleIsFarm());
      // dispatch(farmAction.editFarm(selectedFarm));
      router.push(`/dashboard/farm/${selectedFarm.id}`);
      setCookie("activeStep", 1);
    }
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  useEffect(() => {
    router.refresh();
  }, [router]);
  const open = Boolean(anchorEl);

  useEffect(() => {
    if (sortDataFromLocal) {
      const data = JSON.parse(sortDataFromLocal);
      setOrder(data.direction);
      setOrderBy(data.column);
    }
  }, [sortDataFromLocal]);

  function EnhancedTableHead(data: any) {
    const { order, orderBy, onRequestSort } = data;
    const createSortHandler =
      (property: string) => (event: React.MouseEvent<HTMLButtonElement>) => {
        onRequestSort(event, property);
      };

    return (
      <TableHead>
        <TableRow>
          {(role !== "MEMBER" ? farmTableHead : farmTableHeadMember).map(
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
    if (farms) {
      const sortedData = [...farms].sort((farm1: any, farm2: any) => {
        const orderType = order === "asc" ? 1 : -1;
        if (property !== "productUnits") {
          if (farm1.name < farm2.name) return -1 * orderType;
          if (farm1.name > farm2.name) return 1 * orderType;
          return 0;
        } else {
          if (farm1.productUnits.length < farm2.productUnits.length)
            return -1 * orderType;
          if (farm1.productUnits.length > farm2.productUnits.length)
            return 1 * orderType;
          return 0;
        }
        // return 0;
      });

      setFarmsData(sortedData);
    }
  };
  useEffect(() => {
    if (sortDataFromLocal) {
      const data = JSON.parse(sortDataFromLocal);
      setOrder(data.direction);
      setOrderBy(data.column);
      // handleRequestSort(null, data.column);
      if (farms) {
        const sortedData = [...farms].sort((farm1: any, farm2: any) => {
          const orderType = data.direction === "asc" ? -1 : 1;
          if (data.column !== "productUnits") {
            if (farm1.name < farm2.name) return -1 * orderType;
            if (farm1.name > farm2.name) return 1 * orderType;
            return 0;
          } else {
            if (farm1.productUnits.length < farm2.productUnits.length)
              return -1 * orderType;
            if (farm1.productUnits.length > farm2.productUnits.length)
              return 1 * orderType;
            return 0;
          }
          // return 0;
        });

        setFarmsData(sortedData);
      }
    }
  }, [sortDataFromLocal]);
  useEffect(() => {
    if (farms && !sortDataFromLocal) {
      setFarmsData(farms);
    }
  }, [farms]);
  if (loading) {
    return <Loader />;
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
          <EnhancedTableHead
            order={order}
            orderBy={orderBy}
            onRequestSort={handleRequestSort}
          />
          <TableBody>
            {farmsData && farmsData.length > 0 ? (
              farmsData.map((farm: any, i: number) => {
                return (
                  <TableRow
                    key={i}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell
                      // align="center"
                      sx={{
                        borderBottomColor: "#F5F6F8",
                        borderBottomWidth: 2,
                        color: "#555555",
                        fontWeight: 500,
                        paddingLeft: {
                          lg: 10,
                          md: 7,
                          xs: 4,
                        },
                      }}
                      component="th"
                      scope="row"
                    >
                      {farm.name ?? ""}
                    </TableCell>

                    <TableCell
                      sx={{
                        borderBottomColor: "#F5F6F8",
                        borderBottomWidth: 2,
                        color: "#555555",
                        fontWeight: 500,
                        justifyContent: "start",
                        display: "flex",
                        alignItems: "center",
                        paddingRight: "auto",
                      }}
                      className="cursor-pointer"
                    >
                      {farm?.productionUnits.length ?? ""}
                    </TableCell>

                    {role !== "MEMBER" && (
                      <TableCell
                        // align="center"
                        sx={{
                          borderBottomColor: "#F5F6F8",
                          borderBottomWidth: 2,
                          color: "#555555",
                          fontWeight: 500,
                        }}
                        className="cursor-pointer"
                        // onClick={() => handleEdit(user)}
                      >
                        <Button
                          id="basic-button"
                          aria-controls={open ? "basic-menu" : undefined}
                          aria-haspopup="true"
                          aria-expanded={open ? "true" : undefined}
                          onClick={(e) => handleClick(e, farm)}
                          className="table-edit-option"
                          sx={{
                            background: "transparent",
                            color: "#555555",
                            boxShadow: "none",
                          }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="1em"
                            height="1em"
                            viewBox="0 0 16 16"
                          >
                            <path
                              fill="currentColor"
                              d="M9.5 13a1.5 1.5 0 1 1-3 0a1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0a1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0a1.5 1.5 0 0 1 3 0"
                            />
                          </svg>
                        </Button>
                        <Menu
                          id="basic-menu"
                          className="table-edit-menu"
                          anchorEl={anchorEl}
                          open={open}
                          onClose={handleClose}
                          MenuListProps={{
                            "aria-labelledby": "basic-button",
                          }}
                        >
                          <MenuItem onClick={handleEdit}>
                            <Stack
                              display="flex"
                              gap={1.2}
                              alignItems="center"
                              direction="row"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="1em"
                                height="1em"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  fill="currentColor"
                                  d="M3 21v-4.25L16.2 3.575q.3-.275.663-.425t.762-.15t.775.15t.65.45L20.425 5q.3.275.438.65T21 6.4q0 .4-.137.763t-.438.662L7.25 21zM17.6 7.8L19 6.4L17.6 5l-1.4 1.4z"
                                />
                              </svg>

                              <Typography variant="subtitle2">Edit</Typography>
                            </Stack>
                          </MenuItem>
                        </Menu>
                      </TableCell>
                    )}
                  </TableRow>
                );
              })
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
