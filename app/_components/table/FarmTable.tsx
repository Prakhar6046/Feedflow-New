'use client';
import { Farm } from '@/app/_typeModels/Farm';
import { breadcrumsAction } from '@/lib/features/breadcrum/breadcrumSlice';
import { selectFarmLoading } from '@/lib/features/farm/farmSlice';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import {
  Box,
  Button,
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
import { setCookie } from 'cookies-next';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import Loader from '../Loader';
import { selectRole } from '@/lib/features/user/userSlice';
import {
  farmTableHead,
  farmTableHeadMember,
} from '@/app/_lib/utils/tableHeadData';
import { getLocalItem, removeLocalItem } from '@/app/_lib/utils';
import Image from 'next/image';
import { EnhancedTableHeadProps } from '../UserTable';

interface Props {
  farms: Farm[];
  permisions: boolean;
}
export default function FarmTable({ farms, permisions }: Props) {
  const router = useRouter();
  const pathName = usePathname();
  const dispatch = useAppDispatch();
  const role = useAppSelector(selectRole);
  const [order, setOrder] = React.useState<'asc' | 'desc'>('asc');
  const [orderBy, setOrderBy] = React.useState('organisation');
  const [farmsData, setFarmsData] = useState<Farm[]>();
  const loading = useAppSelector(selectFarmLoading);
  const [selectedFarm, setSelectedFarm] = useState<Farm | null>(null);
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null,
  );
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
    farm: Farm,
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedFarm(farm);
  };
  const handleEdit = () => {
    if (selectedFarm) {
      removeLocalItem('farmData');
      removeLocalItem('farmProductionUnits');
      removeLocalItem('productionParametes');
      removeLocalItem('productionParamtertsUnitsArray');
      removeLocalItem('feedProfiles');
      removeLocalItem('feedProfileId');
      removeLocalItem('productionUnitsFeedProfiles');
      router.push(`/dashboard/farm/${selectedFarm.id}`);
      setCookie('isEditFarm', true);
      setCookie('activeStep', 0);
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
      const data = sortDataFromLocal;
      setOrder(data.direction);
      setOrderBy(data.column);
    }
  }, [sortDataFromLocal]);

  function EnhancedTableHead(data: EnhancedTableHeadProps) {
    const { order, orderBy, onRequestSort } = data;
    const createSortHandler =
      (property: string) => (event: React.MouseEvent<HTMLButtonElement>) => {
        onRequestSort(event, property);
      };

    return (
      <TableHead>
        <TableRow>
          {(role == 'SUPERADMIN' || permisions
            ? farmTableHead
            : farmTableHeadMember
          ).map((headCell, idx, headCells) => (
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
              {idx === headCells.length - 1 ? (
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
    if (farms) {
      const sortedData = [...farms].sort((farm1, farm2) => {
        const orderType = order === 'asc' ? 1 : -1;
        if (property !== 'productUnits') {
          if (farm1.name < farm2.name) return -1 * orderType;
          if (farm1.name > farm2.name) return 1 * orderType;
          return 0;
        } else {
          if (farm1.productionUnits.length < farm2.productionUnits.length)
            return -1 * orderType;
          if (farm1.productionUnits.length > farm2.productionUnits.length)
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
      const data = sortDataFromLocal;
      setOrder(data.direction);
      setOrderBy(data.column);
      // handleRequestSort(null, data.column);
      if (farms) {
        const sortedData = [...farms].sort((farm1, farm2) => {
          const orderType = data.direction === 'asc' ? -1 : 1;
          if (data.column !== 'productUnits') {
            if (farm1.name < farm2.name) return -1 * orderType;
            if (farm1.name > farm2.name) return 1 * orderType;
            return 0;
          } else {
            if (farm1.productionUnits.length < farm2.productionUnits.length)
              return -1 * orderType;
            if (farm1.productionUnits.length > farm2.productionUnits.length)
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
              farmsData.map((farm, i: number) => {
                return (
                  <TableRow
                    key={i}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell
                      // align="center"
                      sx={{
                        borderBottomColor: '#F5F6F8',
                        borderBottomWidth: 2,
                        color: '#555555',
                        maxWidth: 250,
                        pr: 2,
                        fontWeight: 500,
                        wordBreak: 'break-all',
                        paddingLeft: {
                          lg: 10,
                          md: 7,
                          xs: 4,
                        },
                      }}
                      component="th"
                      scope="row"
                    >
                      {farm.name ?? ''}
                    </TableCell>
                    <TableCell
                      sx={{
                        borderBottomColor: '#F5F6F8',
                        borderBottomWidth: 2,
                        color: '#555555',
                        fontWeight: 500,
                        paddingLeft: {
                          // lg: 10,
                          // md: 7,
                          xs: 0,
                        },
                      }}
                      component="th"
                      scope="row"
                    >
                      <Box display={'flex'} alignItems={'center'} gap={1.5}>
                        {farm.organisation?.imageUrl &&
                        farm.organisation?.imageUrl !== 'null' ? (
                          <Image
                            src={String(farm.organisation.imageUrl)}
                            width={40}
                            height={40}
                            style={{
                              borderRadius: '8px',
                              objectFit: 'contain',
                            }}
                            alt="img not found"
                          />
                        ) : (
                          <Box
                            display={'flex'}
                            justifyContent={'center'}
                            alignItems={'center'}
                            bgcolor={'rgba(145, 158, 171, 0.24)'}
                            sx={{
                              width: 40,
                              height: 40,
                              borderRadius: '8px',
                            }}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="1.7em"
                              height="1.7em"
                              viewBox="0 0 24 24"
                            >
                              <g fill="none">
                                <path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z" />
                                <path
                                  fill="#637381"
                                  d="M16 14a5 5 0 0 1 4.995 4.783L21 19v1a2 2 0 0 1-1.85 1.995L19 22H5a2 2 0 0 1-1.995-1.85L3 20v-1a5 5 0 0 1 4.783-4.995L8 14zM12 2a5 5 0 1 1 0 10a5 5 0 0 1 0-10"
                                />
                              </g>
                            </svg>
                          </Box>
                        )}

                        {farm?.organisation?.name}
                      </Box>
                    </TableCell>
                    <TableCell
                      sx={{
                        borderBottomColor: '#F5F6F8',
                        borderBottomWidth: 2,
                        color: '#555555',
                        fontWeight: 500,
                        p: 0,
                      }}
                      className="cursor-pointer"
                    >
                      {farm?.productionUnits?.length ?? ''}
                    </TableCell>

                    {(role === 'SUPERADMIN' || permisions) && (
                      <TableCell
                        // align="center"
                        sx={{
                          borderBottomColor: '#F5F6F8',
                          borderBottomWidth: 2,
                          color: '#555555',
                          fontWeight: 500,
                        }}
                        className="cursor-pointer"
                        // onClick={() => handleEdit(user)}
                      >
                        <Button
                          id="basic-button"
                          aria-controls={open ? 'basic-menu' : undefined}
                          aria-haspopup="true"
                          aria-expanded={open ? 'true' : undefined}
                          onClick={(e) => handleClick(e, farm)}
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
                          className="table-edit-farm-menu"
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
                        </Menu>
                      </TableCell>
                    )}
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={4} sx={{ textAlign: 'center' }}>
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
