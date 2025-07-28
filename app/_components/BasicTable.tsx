'use client';
import { breadcrumsAction } from '@/lib/features/breadcrum/breadcrumSlice';
import { selectRole } from '@/lib/features/user/userSlice';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import {
  Box,
  Button,
  Menu,
  MenuItem,
  Stack,
  Tab,
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
import Image from 'next/image';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { SyntheticEvent, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { getLocalItem } from '../_lib/utils';
import userBlock from '../../public/static/img/user-block.svg';
import userUnBlock from '../../public/static/img/user-unblock.svg';

import {
  organisationTableHead,
  organisationTableHeadMember,
} from '../_lib/utils/tableHeadData';
import { SingleOrganisation } from '../_typeModels/Organization';
import { getCookie } from 'cookies-next';
import { EnhancedTableHeadProps } from './UserTable';
interface Props {
  organisations: SingleOrganisation[];
  userRole: string;
  permissions: boolean;
}

export default function BasicTable({
  organisations,
  userRole,
  permissions,
}: Props) {
  const router = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const loggedUser = getCookie('logged-user');
  const loginUser = loggedUser && JSON.parse(loggedUser);
  const [orderBy, setOrderBy] = useState('organisation');
  const [selectedView, setSelectedView] = useState<string>('all');
  const role = useAppSelector(selectRole);
  const [selectedOrganisation, setSelectedOrganisation] =
    useState<SingleOrganisation | null>(null);
  const [organisationData, setOrganisationData] =
    useState<SingleOrganisation[]>();
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null,
  );
  const [sortDataFromLocal, setSortDataFromLocal] = React.useState<{
    direction: 'asc' | 'desc';
    column: string;
  }>({ direction: 'asc', column: '' });

  const handleClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    organisation: SingleOrganisation,
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedOrganisation(organisation);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedOrganisation(null);
  };
  const handleEdit = () => {
    router.push(`/dashboard/organisation/${selectedOrganisation?.id}`);
  };
  const handleInviteOrganisation = async () => {
    setAnchorEl(null);
    if (selectedOrganisation) {
      const response = await fetch('/api/invite/organisation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          organisationId: selectedOrganisation.id,
          users: selectedOrganisation.contact,
          createdBy: loginUser?.id,
        }),
      });
      if (response.ok) {
        const res = await response.json();
        toast.success(res.message);
        router.refresh();
      }
    }
  };
  const handleRestrictAccess = async () => {
    setAnchorEl(null);

    if (selectedOrganisation) {
      const response = await fetch('/api/users', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: selectedOrganisation.id,
          users: selectedOrganisation.users?.map((user) => user.id),
        }),
      });
      if (response.ok) {
        const res = await response.json();
        toast.success(res.message);
        router.refresh();
      }
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
          {(role === 'SUPERADMIN' || permissions
            ? organisationTableHead
            : organisationTableHeadMember
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
              {idx === headCells.length - 1 || idx === 1 ? (
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
  const handleChange = (_event: SyntheticEvent, newValue: string) => {
    setSelectedView(newValue);

    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set('tab', newValue);
    router.push(`?${newParams.toString()}`);
  };
  const open = Boolean(anchorEl);
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
    if (organisations) {
      const sortedData = [...organisations].sort(
        (
          organisation1: SingleOrganisation,
          organisation2: SingleOrganisation,
        ) => {
          const orderType = order === 'asc' ? 1 : -1;
          if (property === 'name') {
            if (organisation1.name < organisation2.name) return -1 * orderType;
            if (organisation1.name > organisation2.name) return 1 * orderType;
            return 0;
          } else if (
            property === 'contactPerson' &&
            organisation1.contact &&
            organisation2.contact
          ) {
            if (organisation1.contact[0].name < organisation2.contact[0].name)
              return -1 * orderType;
            if (organisation1.contact[0].name > organisation2.contact[0].name)
              return 1 * orderType;
            return 0;
          }
          return 0;
        },
      );

      setOrganisationData(sortedData);
    }
  };

  useEffect(() => {
    if (pathName) {
      setSortDataFromLocal(getLocalItem(pathName));
    }
  }, [pathName]);
  useEffect(() => {
    if (sortDataFromLocal) {
      const data = sortDataFromLocal;
      setOrder(data.direction);
      setOrderBy(data.column);
      // handleRequestSort(null, data.column);
      if (organisations) {
        const sortedData = [...organisations].sort(
          (
            organisation1: SingleOrganisation,
            organisation2: SingleOrganisation,
          ) => {
            const orderType = data.direction === 'asc' ? -1 : 1;
            if (data.column === 'name') {
              if (organisation1.name < organisation2.name)
                return -1 * orderType;
              if (organisation1.name > organisation2.name) return 1 * orderType;
              return 0;
            } else if (
              data.column === 'contactPerson' &&
              organisation1.contact &&
              organisation2.contact
            ) {
              if (organisation1.contact[0].name < organisation2.contact[0].name)
                return -1 * orderType;
              if (organisation1.contact[0].name > organisation2.contact[0].name)
                return 1 * orderType;
              return 0;
            }
            return 0;
          },
        );

        setOrganisationData(sortedData);
      }
    }
  }, [sortDataFromLocal]);

  useEffect(() => {
    if (organisations && !sortDataFromLocal) {
      setOrganisationData(organisations);
    }
  }, [organisations]);

  useEffect(() => {
    router.refresh();
  }, [router]);
  useEffect(() => {
    const tabParam = searchParams.get('tab');

    if (!tabParam) {
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.set('tab', 'all');
      router.replace(`?${newParams.toString()}`);
    } else {
      setSelectedView(tabParam);
    }
  }, []);

  return (
    <>
      <Box sx={{ width: '100%', typography: 'body1', mt: 5 }}>
        <TabContext value={String(selectedView)}>
          <Stack
            display={'flex'}
            rowGap={2}
            columnGap={5}
            mb={2}
            justifyContent={'space-between'}
            sx={{
              flexDirection: {
                md: 'row',
                xs: 'column',
              },
              alignItems: {
                md: 'center',
                xs: 'start',
              },
            }}
          >
            <Box>
              <TabList
                onChange={handleChange}
                aria-label="lab API tabs example"
                className="production-tabs"
              >
                <Tab
                  label="All"
                  value="all"
                  className={selectedView === 'all' ? 'active-tab' : ''}
                />
                <Tab
                  label="Feed Suppliers"
                  value="feedSuppliers"
                  className={
                    selectedView === 'feedSuppliers' ? 'active-tab' : ''
                  }
                />
                <Tab
                  label="Fish Producers"
                  value="fishProducers"
                  className={
                    selectedView === 'fishProducers' ? 'active-tab' : ''
                  }
                />
              </TabList>
            </Box>
          </Stack>
        </TabContext>
      </Box>
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
              {organisationData && organisationData.length > 0 ? (
                organisationData?.map((organisation, i) => {
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
                          paddingLeft: {
                            lg: 10,
                            md: 7,
                            xs: 4,
                          },
                        }}
                        component="th"
                        scope="row"
                      >
                        <Box display={'flex'} alignItems={'center'} gap={1.5}>
                          {organisation?.imageUrl &&
                          organisation?.imageUrl !== 'null' ? (
                            <Image
                              src={String(organisation.imageUrl)}
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

                          {organisation.name}
                        </Box>
                      </TableCell>
                      <TableCell
                        sx={{
                          borderBottomColor: '#F5F6F8',
                          borderBottomWidth: 2,
                          color: '#555555',
                          fontWeight: 500,
                          pl: 0,
                        }}
                      >
                        {organisation?.contact?.find(
                          (contact) =>
                            contact.permission === 'ADMIN' ||
                            contact.permission === 'SUPERADMIN',
                        )?.email ?? ''}
                      </TableCell>
                      <TableCell
                        sx={{
                          borderBottomColor: '#F5F6F8',
                          borderBottomWidth: 2,
                          color: '#555555',
                          fontWeight: 500,
                          pl: 0,
                        }}
                      >
                        {organisation?.contact?.find(
                          (contact) =>
                            contact.permission === 'ADMIN' ||
                            contact.permission === 'SUPERADMIN',
                        )?.phone ?? ''}
                      </TableCell>
                      <TableCell
                        sx={{
                          borderBottomColor: '#F5F6F8',
                          borderBottomWidth: 2,
                          color: '#555555',
                          fontWeight: 500,
                          pl: 0,
                        }}
                      >
                        {organisation?.contact?.find(
                          (contact) =>
                            contact.permission === 'ADMIN' ||
                            contact.permission === 'SUPERADMIN',
                        )?.name ?? ''}
                      </TableCell>
                      <TableCell
                        sx={{
                          borderBottomColor: '#F5F6F8',
                          borderBottomWidth: 2,
                          color: '#555555',
                          fontWeight: 500,
                          pl: 0,
                        }}
                      >
                        {organisation?.users?.find(
                          (user) =>
                            user.role === 'ADMIN' || user.role === 'SUPERADMIN',
                        )?.access
                          ? 'True'
                          : 'False'}
                      </TableCell>
                      {role !== 'MEMBER' && (
                        <TableCell
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
                            onClick={(e) => handleClick(e, organisation)}
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
                            <MenuItem
                              onClick={handleEdit}
                              disabled={
                                userRole === 'SUPERADMIN'
                                  ? false
                                  : permissions
                                    ? false
                                    : true
                              }
                            >
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

                                <Typography variant="subtitle2">
                                  Edit
                                </Typography>
                              </Stack>
                            </MenuItem>
                            <MenuItem
                              onClick={handleRestrictAccess}
                              disabled={
                                selectedOrganisation?.users?.some(
                                  (user) => user.role === 'SUPERADMIN',
                                ) ||
                                selectedOrganisation?.users?.some(
                                  (user) =>
                                    user.role === 'ADMIN' && user.invite,
                                )
                              }
                            >
                              <Stack
                                display="flex"
                                gap={1.2}
                                alignItems="center"
                                direction="row"
                              >
                                <Image
                                  alt="user-block"
                                  src={
                                    selectedOrganisation?.users?.find(
                                      (val) =>
                                        val.role === 'ADMIN' && val.access,
                                    )
                                      ? userUnBlock
                                      : userBlock
                                  }
                                />

                                <Typography variant="subtitle2">
                                  {selectedOrganisation?.users?.find(
                                    (val) => val.role === 'ADMIN' && val.access,
                                  )
                                    ? 'Access Restricted'
                                    : 'Access Unrestrict'}
                                </Typography>
                              </Stack>
                            </MenuItem>
                            {userRole === 'SUPERADMIN' && (
                              <MenuItem
                                onClick={handleInviteOrganisation}
                                disabled={
                                  selectedOrganisation?.users?.some(
                                    (user) => user.role === 'SUPERADMIN',
                                  ) ||
                                  selectedOrganisation?.users?.some(
                                    (user) =>
                                      user.role === 'ADMIN' && user.invite,
                                  )
                                }
                              >
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
                                      d="M19 17v2H7v-2s0-4 6-4s6 4 6 4m-3-9a3 3 0 1 0-3 3a3 3 0 0 0 3-3m3.2 5.06A5.6 5.6 0 0 1 21 17v2h3v-2s0-3.45-4.8-3.94M18 5a2.9 2.9 0 0 0-.89.14a5 5 0 0 1 0 5.72A2.9 2.9 0 0 0 18 11a3 3 0 0 0 0-6M8 10H5V7H3v3H0v2h3v3h2v-3h3Z"
                                    />
                                  </svg>

                                  <Typography variant="subtitle2">
                                    {selectedOrganisation?.users?.find(
                                      (val) =>
                                        val.role === 'ADMIN' && val.invite,
                                    )
                                      ? 'Invited'
                                      : 'Invite'}
                                  </Typography>
                                </Stack>
                              </MenuItem>
                            )}
                          </Menu>
                        </TableCell>
                      )}
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={6} sx={{ textAlign: 'center' }}>
                    No Data Found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </>
  );
}
