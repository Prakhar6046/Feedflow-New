'use client';
import { sidebarAction } from '@/lib/features/sidebar/sidebarSlice';
import { userAction } from '@/lib/features/user/userSlice';
import { useAppDispatch } from '@/lib/hooks';
import {
  Avatar,
  Badge,
  Box,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { deleteCookie, getCookie } from 'cookies-next';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
export interface LoggedUser {
  id: number;
  name: string;
  email: string;
  password: string;
  status: string;
  role: string;
  createdAt: string;
  imageUrl: string;
  updatedBy: string;
  createdBy: string;
  organisationId: number;
  updatedAt: string;

  organisationType: string;
}

const AccountPopover = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [loggedUserData, setLoggedUserData] = useState<LoggedUser>();
  const [userData, setUserData] = useState<LoggedUser>();
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleLogout = async () => {
    toast.dismiss();
    const data = await fetch('/api/auth/logout', {
      method: 'GET',
    });
    const response = await data.json();
    if (response.status) {
      router.push('/auth/login');
      deleteCookie('logged-user');
      dispatch(sidebarAction.handleSwitchSidebar(false));
    }

    setAnchorEl(null);
  };
  const handleChangePage = (route: string) => {
    handleClose();
    router.push(route);
  };
  const loggedUser = getCookie('logged-user');
  useEffect(() => {
    if (loggedUser) {
      const user = JSON.parse(loggedUser);

      dispatch(userAction.handleRole(user?.role));
      setLoggedUserData(JSON.parse(loggedUser));
    }
  }, [loggedUser]);
  useEffect(() => {
    if (!loggedUserData) return;
    const getUser = async () => {
      try {
        const response = await fetch(`/api/users/${loggedUserData.id}`, {
          method: 'GET',
        });
        const data = await response.json();
        setUserData(data.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    getUser();
  }, [loggedUserData, router]);

  return (
    <React.Fragment>
      <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
        <Tooltip title="Account settings">
          <IconButton
            onClick={handleClick}
            size="small"
            aria-controls={open ? 'account-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
          >
            {userData?.imageUrl?.startsWith('http') ? (
              <Box
                borderRadius={100}
                width={40}
                height={40}
                style={{
                  backgroundImage: `url(${userData?.imageUrl})`,
                  backgroundSize: 'contain',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                  margin: '0 !important',
                }}
              ></Box>
            ) : (
              <Avatar
                sx={{
                  width: 40,
                  height: 40,
                }}
              />
            )}
          </IconButton>
        </Tooltip>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        className="profile-dropdown"
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1.5,
              '& .MuiAvatar-root': {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              '&::before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box paddingInline={1.5}>
          <Stack
            display={'flex'}
            justifyContent={'space-between'}
            alignItems={'center'}
            direction={'row'}
            gap={3}
          >
            <Typography variant="subtitle2" fontWeight={600}>
              {userData ? userData?.name : 'Demo'}
            </Typography>
            <Badge
              badgeContent={userData ? userData?.role : ''}
              color="primary"
              className="profile-badge"
            ></Badge>
          </Stack>
          <Typography variant="body2" fontSize={13} fontWeight={400} mt={0.3}>
            {userData ? userData?.email : 'Demo'}
          </Typography>
          {userData?.role !== 'SUPERADMIN' && (
            <Typography
              variant="body2"
              fontSize={12}
              color="#06a19b"
              fontWeight={600}
              mt={0.5}
            >
              {userData ? userData?.organisationType : ''}
            </Typography>
          )}
        </Box>

        <Divider
          sx={{
            marginTop: 1,
            marginBottom: 0.5,
          }}
        />

        <MenuItem
          onClick={() => handleChangePage('/dashboard')}
          sx={{
            fontSize: 14,
            fontWeight: 500,
          }}
        >
          <ListItemIcon>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="1.1em"
              height="1.1em"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="M9 2.458v2.124A8.003 8.003 0 0 0 12 20a8 8 0 0 0 7.419-5h2.123c-1.274 4.057-5.064 7-9.542 7c-5.523 0-10-4.477-10-10c0-4.478 2.943-8.268 7-9.542M12 2c5.523 0 10 4.477 10 10q0 .507-.05 1H11V2.05Q11.493 2 12 2m1 2.062V11h6.938A8.004 8.004 0 0 0 13 4.062"
              />
            </svg>
          </ListItemIcon>
          Dashboard
        </MenuItem>
        <MenuItem
          onClick={() =>
            handleChangePage(`/dashboard/user/${loggedUserData?.id}`)
          }
          sx={{
            fontSize: 14,
            fontWeight: 500,
          }}
        >
          <ListItemIcon>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="1.3em"
              height="1.3em"
              viewBox="0 0 24 24"
            >
              <g fill="none" stroke="currentColor" strokeWidth="1.5">
                <path
                  strokeLinejoin="round"
                  d="M4 18a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z"
                />
                <circle cx="12" cy="7" r="3" />
              </g>
            </svg>
          </ListItemIcon>
          Profile
        </MenuItem>
        <MenuItem
          onClick={handleLogout}
          sx={{
            fontSize: 14,
            fontWeight: 500,
          }}
        >
          <ListItemIcon>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="1.1em"
              height="1.1em"
              viewBox="0 0 1024 1024"
            >
              <path
                fill="currentColor"
                d="M868 732h-70.3c-4.8 0-9.3 2.1-12.3 5.8c-7 8.5-14.5 16.7-22.4 24.5a353.8 353.8 0 0 1-112.7 75.9A352.8 352.8 0 0 1 512.4 866c-47.9 0-94.3-9.4-137.9-27.8a353.8 353.8 0 0 1-112.7-75.9a353.3 353.3 0 0 1-76-112.5C167.3 606.2 158 559.9 158 512s9.4-94.2 27.8-137.8c17.8-42.1 43.4-80 76-112.5s70.5-58.1 112.7-75.9c43.6-18.4 90-27.8 137.9-27.8s94.3 9.3 137.9 27.8c42.2 17.8 80.1 43.4 112.7 75.9c7.9 7.9 15.3 16.1 22.4 24.5c3 3.7 7.6 5.8 12.3 5.8H868c6.3 0 10.2-7 6.7-12.3C798 160.5 663.8 81.6 511.3 82C271.7 82.6 79.6 277.1 82 516.4C84.4 751.9 276.2 942 512.4 942c152.1 0 285.7-78.8 362.3-197.7c3.4-5.3-.4-12.3-6.7-12.3m88.9-226.3L815 393.7c-5.3-4.2-13-.4-13 6.3v76H488c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h314v76c0 6.7 7.8 10.5 13 6.3l141.9-112a8 8 0 0 0 0-12.6"
              />
            </svg>
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
};

export default AccountPopover;
