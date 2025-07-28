'use client';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { getCookie } from 'cookies-next';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
// import { getUsers } from "../_lib/action";
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
import Image from 'next/image';
import toast from 'react-hot-toast';
import { getLocalItem, readableDate } from '../_lib/utils';
import { SingleUser } from '../_typeModels/User';
import {
  usersTableHead,
  usersTableHeadMember,
} from '../_lib/utils/tableHeadData';
import { breadcrumsAction } from '@/lib/features/breadcrum/breadcrumSlice';
import { useAppDispatch } from '@/lib/hooks';
import { useAppSelector } from '@/lib/hooks';
import { selectRole } from '@/lib/features/user/userSlice';

interface Props {
  users: SingleUser[];
  permissions: boolean;
}

type Order = 'asc' | 'desc';

interface HeadCell {
  id: string;
  label: string;
}

export interface EnhancedTableHeadProps {
  order: Order;
  orderBy: string;
  onRequestSort: (
    event: React.MouseEvent<HTMLButtonElement> | null,
    property: string,
  ) => void;
  role?: string;
  permissions?: boolean;
  usersTableHead?: HeadCell[];
  usersTableHeadMember?: HeadCell[];
}

export default function UserTable({ users, permissions }: Props) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathName = usePathname();
  const loggedUser = getCookie('logged-user');
  const loginUser: SingleUser = loggedUser && JSON.parse(loggedUser);
  const role = useAppSelector(selectRole);
  const [selectedUser, setSelectedUser] = useState<SingleUser | null>(null);
  const [sortedUser, setSortedUsers] = useState<SingleUser[] | null>(null);
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null,
  );
  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState('name');
  const [sortDataFromLocal, setSortDataFromLocal] = React.useState<{
    direction: Order;
    column: string;
  }>({ direction: 'asc', column: '' });
  const handleEdit = () => {
    router.push(`/dashboard/user/${selectedUser?.id}`);
  };
  const handleClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    user: SingleUser,
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };
  const handleClose = () => {
    setAnchorEl(null);
    setSelectedUser(null);
  };
  const open = Boolean(anchorEl);
  const handleInviteUser = async () => {
    setAnchorEl(null);
    if (selectedUser) {
      const response = await fetch('/api/invite/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: selectedUser.name,
          email: selectedUser.email,
          userId: selectedUser.id,
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
  const handleDeleteUser = async () => {
    setAnchorEl(null);
    if (selectedUser) {
      const response = await fetch('/api/users', {
        method: 'DELETE',

        body: String(selectedUser.id),
      });
      const res = await response.json();
      if (res.status) {
        toast.success(res.message);
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
            ? usersTableHead
            : usersTableHeadMember
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
    if (users) {
      const sortedData = [...users].sort(
        (user1: SingleUser, user2: SingleUser) => {
          const orderType = order === 'asc' ? 1 : -1;
          if (property === 'name') {
            if (user1.name < user2.name) return -1 * orderType;
            if (user1.name > user2.name) return 1 * orderType;
            return 0;
          } else if (property === 'status') {
            if (user1.status < user2.status) return -1 * orderType;
            if (user1.status > user2.status) return 1 * orderType;
            return 0;
          } else if (property === 'role') {
            if (user1.role < user2.role) return -1 * orderType;
            if (user1.role > user2.role) return 1 * orderType;
            return 0;
          } else if (property === 'organisation') {
            if (user1.organisation?.name < user2.organisation?.name)
              return -1 * orderType;
            if (user1.organisation?.name > user2.organisation?.name)
              return 1 * orderType;
            return 0;
          } else if (property === 'createdAt') {
            if (user1.createdAt < user2.createdAt) return -1 * orderType;
            if (user1.createdAt > user2.createdAt) return 1 * orderType;
            return 0;
          }
          return 0;
        },
      );
      setSortedUsers(sortedData);
      // setUsers(sortedData);
    }
  };
  useEffect(() => {
    if (sortDataFromLocal) {
      const data = sortDataFromLocal;
      setOrder(data.direction);
      setOrderBy(data.column);

      // handleRequestSort(null, data.column);
      if (users) {
        const sortedData = [...users].sort(
          (user1: SingleUser, user2: SingleUser) => {
            const orderType = data.direction === 'asc' ? -1 : 1;
            if (data.column === 'name') {
              if (user1.name < user2.name) return -1 * orderType;
              if (user1.name > user2.name) return 1 * orderType;
              return 0;
            } else if (data.column === 'status') {
              if (user1.status < user2.status) return -1 * orderType;
              if (user1.status > user2.status) return 1 * orderType;
              return 0;
            } else if (data.column === 'role') {
              if (user1.role < user2.role) return -1 * orderType;
              if (user1.role > user2.role) return 1 * orderType;
              return 0;
            } else if (data.column === 'organisation') {
              if (user1.organisation?.name < user2.organisation?.name)
                return -1 * orderType;
              if (user1.organisation?.name > user2.organisation?.name)
                return 1 * orderType;
              return 0;
            } else if (data.column === 'createdAt') {
              if (user1.createdAt < user2.createdAt) return -1 * orderType;
              if (user1.createdAt > user2.createdAt) return 1 * orderType;
              return 0;
            }
            return 0;
          },
        );
        setSortedUsers(sortedData);
        // setUsers(sortedData);
      }
    }
  }, [sortDataFromLocal]);

  useEffect(() => {
    if (users && !sortDataFromLocal) {
      setSortedUsers(users);
    }
  }, [users]);

  useEffect(() => {
    if (pathName) {
      setSortDataFromLocal(getLocalItem(pathName));
    }
  }, [pathName]);

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
        }}
      >
        <Table stickyHeader aria-label="sticky table">
          <EnhancedTableHead
            order={order}
            orderBy={orderBy}
            onRequestSort={handleRequestSort}
          />
          <TableBody>
            {sortedUser && sortedUser.length > 0 ? (
              sortedUser.map((user, i) => {
                return (
                  <TableRow
                    key={i}
                    sx={{
                      '&:last-child td, &:last-child th': { border: 0 },
                    }}
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
                        {user?.imageUrl && user?.imageUrl !== 'null' ? (
                          <Image
                            src={String(user.imageUrl)}
                            width={40}
                            height={40}
                            style={{
                              borderRadius: '8px',
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

                        {user?.name ?? ''}
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
                      {user?.status ?? ''}
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
                      {user?.role ?? ''}
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
                      <Box
                        display={'flex'}
                        justifyContent={'flex-start'}
                        alignItems={'center'}
                        gap={'12px'}
                      >
                        {user?.organisation?.imageUrl &&
                        user?.organisation?.imageUrl !== 'null' ? (
                          <Image
                            src={String(user.organisation.imageUrl)}
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
                        {user?.organisation?.name ?? 'No Organisation'}
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
                      {readableDate(user?.createdAt) ?? ''}
                    </TableCell>
                    {(loginUser?.role === 'SUPERADMIN' || permissions) && (
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
                          onClick={(e) => handleClick(e, user)}
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

                          <Divider
                            sx={{
                              borderColor: '#9797971A',
                              my: 0.5,
                            }}
                          />
                          <MenuItem
                            onClick={handleInviteUser}
                            disabled={selectedUser?.invite}
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
                              {selectedUser?.invite ? (
                                <Typography variant="subtitle2">
                                  Invited
                                </Typography>
                              ) : (
                                <Typography variant="subtitle2">
                                  Invite
                                </Typography>
                              )}
                            </Stack>
                          </MenuItem>

                          <Divider
                            sx={{
                              borderColor: '#9797971A',
                              my: 0.5,
                            }}
                          />
                          <MenuItem
                            disabled={
                              loginUser?.role === 'ADMIN' ? true : false
                            }
                            onClick={handleDeleteUser}
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
                                <g fill="none">
                                  <path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"></path>
                                  <path
                                    fill="#ff0000"
                                    d="M14.28 2a2 2 0 0 1 1.897 1.368L16.72 5H20a1 1 0 1 1 0 2l-.003.071l-.867 12.143A3 3 0 0 1 16.138 22H7.862a3 3 0 0 1-2.992-2.786L4.003 7.07L4 7a1 1 0 0 1 0-2h3.28l.543-1.632A2 2 0 0 1 9.721 2zm3.717 5H6.003l.862 12.071a1 1 0 0 0 .997.929h8.276a1 1 0 0 0 .997-.929zM10 10a1 1 0 0 1 .993.883L11 11v5a1 1 0 0 1-1.993.117L9 16v-5a1 1 0 0 1 1-1m4 0a1 1 0 0 1 1 1v5a1 1 0 1 1-2 0v-5a1 1 0 0 1 1-1m.28-6H9.72l-.333 1h5.226z"
                                  ></path>
                                </g>
                              </svg>

                              <Typography variant="subtitle2" color="#ff0000">
                                Delete
                              </Typography>
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
                <TableCell colSpan={6} sx={{ textAlign: 'center' }}>
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
