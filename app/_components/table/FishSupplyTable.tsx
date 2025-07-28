'use client';
import { FishSupply } from '@/app/_typeModels/fishSupply';
import { breadcrumsAction } from '@/lib/features/breadcrum/breadcrumSlice';
import { useAppDispatch } from '@/lib/hooks';
import {
  Box,
  Button,
  Divider,
  Menu,
  MenuItem,
  Stack,
  TableSortLabel,
  Typography,
} from '@mui/material';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

import { selectRole } from '@/lib/features/user/userSlice';
import { useAppSelector } from '@/lib/hooks';
import { getLocalItem } from '@/app/_lib/utils';
import { EnhancedTableHeadProps } from '../UserTable';
interface Props {
  tableData: {
    id: string;
    numeric: boolean;
    disablePadding: boolean;
    label: string;
  }[];
  fishSupply?: FishSupply[];
  permisions: boolean;
}

export default function FishSupplyTable({
  tableData,
  fishSupply,
  permisions,
}: Props) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null,
  );
  const pathName = usePathname();
  // const sortDataFromLocal = "";
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [orderBy, setOrderBy] = useState('spawningDate');
  const [selectedFishSupply, setSelectedFishSupply] = useState<FishSupply>();
  const role = useAppSelector(selectRole);
  const [sortedFishSupply, setSortedFishSupply] = useState<FishSupply[]>();
  const [sortDataFromLocal, setSortDataFromLocal] = React.useState<{
    direction: 'asc' | 'desc';
    column: string;
  }>({ direction: 'asc', column: '' });

  useEffect(() => {
    if (pathName) {
      setSortDataFromLocal(getLocalItem(pathName));
    }
  }, [pathName]);
  const handleClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    fish: FishSupply,
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedFishSupply(fish);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleEdit = () => {
    if (selectedFishSupply) {
      router.push(`/dashboard/fishSupply/${selectedFishSupply.id}`);
    }
  };
  function EnhancedTableHead(data: EnhancedTableHeadProps) {
    const { order, orderBy, onRequestSort } = data;
    const createSortHandler =
      (property: string) => (event: React.MouseEvent<HTMLButtonElement>) => {
        onRequestSort(event, property);
      };

    return (
      <TableHead>
        <TableRow>
          {tableData.map((headCell, idx) => (
            <TableCell
              key={idx}
              sortDirection={
                idx === tableData.length - 1
                  ? false
                  : orderBy === headCell.id
                    ? order
                    : false
              }
              sx={{
                borderBottom: 0,
                color: '#67737F',
                background: '#F5F6F8',
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
              {idx === tableData.length - 1 ||
              idx === 0 ||
              idx === 1 ||
              idx === 2 ||
              idx === 5 ? (
                headCell.label
              ) : (
                <TableSortLabel
                  active={orderBy === headCell.id}
                  direction={orderBy === headCell.id ? order : 'asc'}
                  onClick={createSortHandler(headCell.id)}
                >
                  {headCell.label}
                </TableSortLabel>
              )}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    );
  }
  const handleRequestSort = (
    _: React.MouseEvent<HTMLButtonElement> | null,
    property: string,
  ) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
    dispatch(
      breadcrumsAction.handleSort({
        direction: isAsc ? 'desc' : 'asc',
        column: property,
      }),
    );
    if (fishSupply) {
      const sortedData = [...fishSupply].sort(
        (fish1: FishSupply, fish2: FishSupply) => {
          const orderType = order === 'asc' ? 1 : -1;
          if (property === 'spawningDate') {
            if (fish1?.spawningDate < fish2.spawningDate) return -1 * orderType;
            if (fish1.spawningDate > fish2.spawningDate) return 1 * orderType;
            return 0;
          } else if (property === 'hatchingDate') {
            if (fish1.hatchingDate < fish2.hatchingDate) return -1 * orderType;
            if (fish1.hatchingDate > fish2.hatchingDate) return 1 * orderType;
            return 0;
          } else if (property === 'name') {
            if (
              fish1.creator?.hatchery[0]?.name <
              fish2.creator?.hatchery[0]?.name
            )
              return -1 * orderType;
            if (
              fish1.creator?.hatchery[0]?.name >
              fish2.creator?.hatchery[0]?.name
            )
              return 1 * orderType;
            return 0;
          } else if (property === 'fishFarm') {
            if (fish1.fishFarm < fish2.fishFarm) return -1 * orderType;
            if (fish1.fishFarm > fish2.fishFarm) return 1 * orderType;
            return 0;
          } else if (property === 'productionUnits') {
            if (fish1.productionUnits < fish2.productionUnits)
              return -1 * orderType;
            if (fish1.productionUnits > fish2.productionUnits)
              return 1 * orderType;
            return 0;
          } else if (property === 'status') {
            if (fish1.status < fish2.status) return -1 * orderType;
            if (fish1.status > fish2.status) return 1 * orderType;
            return 0;
          }
          return 0;
        },
      );
      setSortedFishSupply(sortedData);
    }
  };

  const open = Boolean(anchorEl);
  useEffect(() => {
    if (sortDataFromLocal) {
      const data = sortDataFromLocal;
      setOrder(data.direction);
      setOrderBy(data.column);
      if (fishSupply) {
        const sortedData = [...fishSupply].sort(
          (fish1: FishSupply, fish2: FishSupply) => {
            const orderType = data.direction === 'asc' ? -1 : 1;
            if (data.column === 'spawningDate') {
              if (fish1.spawningDate < fish2.spawningDate)
                return -1 * orderType;
              if (fish1.spawningDate > fish2.spawningDate) return 1 * orderType;
              return 0;
            } else if (data.column === 'hatchingDate') {
              if (fish1.hatchingDate < fish2.hatchingDate)
                return -1 * orderType;
              if (fish1.hatchingDate > fish2.hatchingDate) return 1 * orderType;
              return 0;
            } else if (data.column === 'name') {
              if (
                fish1.creator?.hatchery[0]?.name <
                fish2.creator?.hatchery[0]?.name
              )
                return -1 * orderType;
              if (
                fish1.creator?.hatchery[0]?.name >
                fish2.creator?.hatchery[0]?.name
              )
                return 1 * orderType;
              return 0;
            } else if (data.column === 'fishFarm') {
              if (fish1.fishFarm < fish2.fishFarm) return -1 * orderType;
              if (fish1.fishFarm > fish2.fishFarm) return 1 * orderType;
              return 0;
            } else if (data.column === 'productionUnits') {
              if (fish1.productionUnits < fish2.productionUnits)
                return -1 * orderType;
              if (fish1.productionUnits > fish2.productionUnits)
                return 1 * orderType;
              return 0;
            } else if (data.column === 'status') {
              if (fish1.status < fish2.status) return -1 * orderType;
              if (fish1.status > fish2.status) return 1 * orderType;
              return 0;
            }
            return 0;
          },
        );
        setSortedFishSupply(sortedData);
      }
    }
  }, [sortDataFromLocal]);
  useEffect(() => {
    if (fishSupply && !sortDataFromLocal) {
      setSortedFishSupply(fishSupply);
    }
  }, [fishSupply]);
  useEffect(() => {
    router.refresh();
  }, [router]);

  return (
    <Paper
      sx={{
        width: '100%',
        overflow: 'hidden',
        borderRadius: '14px',
        boxShadow: '0px 0px 16px 5px #0000001A',
        mt: 4,
      }}
    >
      <TableContainer
        sx={{
          maxHeight: '72.5vh',
          overflow: 'auto',
        }}
      >
        <Table stickyHeader aria-label="sticky table">
          <EnhancedTableHead
            order={order}
            orderBy={orderBy}
            onRequestSort={handleRequestSort}
          />
          <TableBody>
            {sortedFishSupply && sortedFishSupply.length > 0 ? (
              sortedFishSupply.map((fish: FishSupply, i: number) => {
                return (
                  <TableRow
                    key={i}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell
                      sx={{
                        borderBottomColor: '#F5F6F8',
                        borderBottomWidth: 2,
                        color: '#555555',
                        fontWeight: 500,
                        maxWidth: 250,
                        wordBreak: 'break-all',
                        pr: 2,
                        textWrap: 'nowrap',
                        paddingLeft: {
                          lg: 10,
                          md: 7,
                          xs: 4,
                        },
                      }}
                      component="th"
                      scope="row"
                    >
                      {fish?.creator?.hatchery[0]?.fishSpecie ?? ''}
                    </TableCell>
                    <TableCell
                      sx={{
                        borderBottomColor: '#F5F6F8',
                        borderBottomWidth: 2,
                        color: '#06A198',
                        fontWeight: 500,
                        textWrap: 'nowrap',
                        p: 0,
                      }}
                    >
                      <Box display={'flex'} alignItems={'center'} gap={1.5}>
                        {fish?.batchNumber ?? ''}
                        {/* {`${fish.hatchingDate}-${
                          fish.creator?.hatchery[0]?.code
                        }-${
                          fish.spawningNumber
                        }-${fish?.creator?.hatchery[0]?.fishSpecie.slice(
                          0,
                          1
                        )}`} */}
                      </Box>
                    </TableCell>
                    <TableCell
                      sx={{
                        borderBottomColor: '#F5F6F8',
                        borderBottomWidth: 2,
                        color: '#555555',
                        fontWeight: 500,
                        textWrap: 'nowrap',
                      }}
                    >
                      <Box
                        display={'flex'}
                        gap={0.5}
                        alignItems={'center'}
                        width={'100%'}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="1.2em"
                          height="1.2em"
                          viewBox="0 0 48 48"
                        >
                          <g
                            fill="none"
                            stroke="black"
                            strokeLinejoin="round"
                            strokeWidth="4"
                          >
                            <path
                              strokeLinecap="round"
                              d="M41.952 15.048v-9h-9"
                            />
                            <path d="M10.414 38c5.467 5.468 14.331 5.468 19.799 0a13.96 13.96 0 0 0 4.1-9.899a13.96 13.96 0 0 0-4.1-9.9c-5.468-5.467-14.332-5.467-19.8 0c-5.467 5.468-5.467 14.332 0 19.8Z" />
                            <path
                              strokeLinecap="round"
                              d="m30 18l9.952-9.952"
                            />
                          </g>
                        </svg>
                        {fish.broodstockMale ? fish.broodstockMale : 'N/A'}
                      </Box>

                      <Box
                        display={'flex'}
                        mt={0.3}
                        gap={0.5}
                        alignItems={'center'}
                        width={'100%'}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="1.2em"
                          height="1.2em"
                          viewBox="0 0 1024 1024"
                        >
                          <path
                            fill="black"
                            d="M512 640a256 256 0 1 0 0-512a256 256 0 0 0 0 512m0 64a320 320 0 1 1 0-640a320 320 0 0 1 0 640"
                          />
                          <path
                            fill="black"
                            d="M512 640q32 0 32 32v256q0 32-32 32t-32-32V672q0-32 32-32"
                          />
                          <path
                            fill="black"
                            d="M352 800h320q32 0 32 32t-32 32H352q-32 0-32-32t32-32"
                          />
                        </svg>
                        {fish.broodstockFemale ? fish.broodstockFemale : 'N/A'}
                      </Box>
                    </TableCell>
                    <TableCell
                      sx={{
                        borderBottomColor: '#F5F6F8',
                        borderBottomWidth: 2,
                        color: '#555555',
                        fontWeight: 500,
                        textWrap: 'nowrap',
                      }}
                    >
                      {fish?.spawningDate}
                    </TableCell>
                    <TableCell
                      sx={{
                        borderBottomColor: '#F5F6F8',
                        borderBottomWidth: 2,
                        color: '#555555',
                        fontWeight: 500,
                        textWrap: 'nowrap',
                      }}
                    >
                      {fish.hatchingDate}
                    </TableCell>
                    <TableCell
                      sx={{
                        borderBottomColor: '#F5F6F8',
                        borderBottomWidth: 2,
                        color: '#555555',
                        fontWeight: 500,
                        textWrap: 'nowrap',
                      }}
                    >
                      {fish.status === 'Harvested' ? 'N/A' : fish.age}
                    </TableCell>{' '}
                    <TableCell
                      sx={{
                        borderBottomColor: '#F5F6F8',
                        borderBottomWidth: 2,
                        color: '#555555',
                        fontWeight: 500,
                        textWrap: 'nowrap',
                      }}
                    >
                      {fish?.creator?.hatchery[0]?.name}
                    </TableCell>{' '}
                    <TableCell
                      sx={{
                        borderBottomColor: '#F5F6F8',
                        borderBottomWidth: 2,
                        color: '#555555',
                        fontWeight: 500,
                        textWrap: 'nowrap',
                      }}
                    >
                      {fish?.farm?.name}
                    </TableCell>{' '}
                    <TableCell
                      sx={{
                        borderBottomColor: '#F5F6F8',
                        borderBottomWidth: 2,
                        color: '#555555',
                        fontWeight: 500,
                        textWrap: 'nowrap',
                      }}
                    >
                      {fish.status}
                    </TableCell>
                    {(role === 'SUPERADMIN' || permisions) && (
                      <TableCell
                        sx={{
                          borderBottomColor: '#F5F6F8',
                          borderBottomWidth: 2,
                          color: '#555555',
                          fontWeight: 500,
                          textWrap: 'nowrap',
                        }}
                        className="cursor-pointer"
                      >
                        <Button
                          id="basic-button"
                          aria-controls={open ? 'basic-menu' : undefined}
                          aria-haspopup="true"
                          aria-expanded={open ? 'true' : undefined}
                          onClick={(e) => handleClick(e, fish)}
                          className="table-edit-option"
                          sx={{
                            background: 'transparent',
                            color: '#555555',
                            boxShadow: 'none',
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
                            'aria-labelledby': 'basic-button',
                          }}
                          sx={{
                            position: 'absolute',
                            left: '-10px',
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

                          <Divider sx={{ borderColor: '#9797971A', my: 0.5 }} />
                        </Menu>
                      </TableCell>
                    )}
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={10} sx={{ textAlign: 'center' }}>
                  No Data Found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
