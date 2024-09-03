"use client"
import { Avatar, Box, Divider, IconButton, ListItemIcon, Menu, MenuItem, Tooltip, Typography } from '@mui/material';
import React from 'react';

const SettingsButton = () => {

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <React.Fragment>
      <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
        <IconButton
          onClick={handleClick}
          size="small"
          aria-controls={open ? 'account-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24">
            <g fill="none" fill-rule="evenodd">
              <path d="m12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036q-.016-.004-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.016-.018m.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01z" />
              <path fill="#637382" d="M16 15c1.306 0 2.418.835 2.83 2H20a1 1 0 1 1 0 2h-1.17a3.001 3.001 0 0 1-5.66 0H4a1 1 0 1 1 0-2h9.17A3 3 0 0 1 16 15m0 2a1 1 0 1 0 0 2a1 1 0 0 0 0-2M8 9a3 3 0 0 1 2.762 1.828l.067.172H20a1 1 0 0 1 .117 1.993L20 13h-9.17a3.001 3.001 0 0 1-5.592.172L5.17 13H4a1 1 0 0 1-.117-1.993L4 11h1.17A3 3 0 0 1 8 9m0 2a1 1 0 1 0 0 2a1 1 0 0 0 0-2m8-8c1.306 0 2.418.835 2.83 2H20a1 1 0 1 1 0 2h-1.17a3.001 3.001 0 0 1-5.66 0H4a1 1 0 0 1 0-2h9.17A3 3 0 0 1 16 3m0 2a1 1 0 1 0 0 2a1 1 0 0 0 0-2" />
            </g>
          </svg>
        </IconButton>

      </Box>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        className='settings'
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

        <Box paddingInline={1.5} display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant='subtitle1' fontWeight={500}>Settings</Typography>


          <svg xmlns="http://www.w3.org/2000/svg" width="1.1em" height="1.1em" viewBox="0 0 24 24">
            <g fill="none" fill-rule="evenodd">
              <path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z" />
              <path fill="currentColor" d="m12 13.414l5.657 5.657a1 1 0 0 0 1.414-1.414L13.414 12l5.657-5.657a1 1 0 0 0-1.414-1.414L12 10.586L6.343 4.929A1 1 0 0 0 4.93 6.343L10.586 12l-5.657 5.657a1 1 0 1 0 1.414 1.414z" />
            </g>
          </svg>

        </Box>


        <Divider sx={{
          marginTop: 1,
          marginBottom: 0.5
        }} />

        <Box paddingInline={2} marginTop={2}>

          <Typography variant='subtitle2' fontWeight={500} marginBottom={1}>
            Mode
          </Typography>

          <Box display={"flex"} justifyContent={"space-between"} alignItems={"center"} gap={2}>

            <MenuItem onClick={handleClose} sx={{
              fontSize: 12,
              fontWeight: 500,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              border: "1px solid #979797",
              borderRadius: "14px",
              width: "80px"
            }}>
              <ListItemIcon sx={{
                display: "flex",
                justifyContent: "center",
                marginBottom: 0.7
              }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="2.5em" height="2.5em" viewBox="0 0 28 28">
                  <path fill="currentColor" d="M21.75 3a.75.75 0 0 1 .75.75V5h1.25a.75.75 0 0 1 0 1.5H22.5v1.25a.75.75 0 0 1-1.5 0V6.5h-1.25a.75.75 0 0 1 0-1.5H21V3.75a.75.75 0 0 1 .75-.75M8.5 6.25a.75.75 0 1 0-1.5 0V7.5H5.75a.75.75 0 1 0 0 1.5H7v1.25a.75.75 0 0 0 1.5 0V9h1.25a.75.75 0 0 0 0-1.5H8.5zm12 11.5a.75.75 0 0 0-1.5 0V19h-1.25a.75.75 0 0 0 0 1.5H19v1.25a.75.75 0 0 0 1.5 0V20.5h1.25a.75.75 0 0 0 0-1.5H20.5zm-.866-8.272a2.875 2.875 0 0 0-4.54-.636L2.806 21.088a2.88 2.88 0 1 0 4.068 4.079l12.279-12.254a2.875 2.875 0 0 0 .48-3.435m-3.482.426a1.375 1.375 0 0 1 1.942 1.947l-.842.84l-1.945-1.945zm-1.907 1.902l1.945 1.945L5.815 24.105a1.38 1.38 0 1 1-1.949-1.954z" />
                </svg>
              </ListItemIcon>
              System
            </MenuItem>

            <MenuItem onClick={handleClose} sx={{
              fontSize: 12,
              fontWeight: 500,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              border: "1px solid #979797",
              borderRadius: "14px",
              width: "80px"
            }}>
              <ListItemIcon sx={{
                display: "flex",
                justifyContent: "center",
                marginBottom: 0.7
              }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="2.5em" height="2.5em" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M12 9c1.65 0 3 1.35 3 3s-1.35 3-3 3s-3-1.35-3-3s1.35-3 3-3m0-2c-2.76 0-5 2.24-5 5s2.24 5 5 5s5-2.24 5-5s-2.24-5-5-5M2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1m18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1M11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1m0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1M5.99 4.58a.996.996 0 0 0-1.41 0a.996.996 0 0 0 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41zm12.37 12.37a.996.996 0 0 0-1.41 0a.996.996 0 0 0 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0a.996.996 0 0 0 0-1.41zm1.06-10.96a.996.996 0 0 0 0-1.41a.996.996 0 0 0-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0zM7.05 18.36a.996.996 0 0 0 0-1.41a.996.996 0 0 0-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0z" />
                </svg>
              </ListItemIcon>
              Light
            </MenuItem>

            <MenuItem onClick={handleClose} sx={{
              fontSize: 12,
              fontWeight: 500,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              border: "1px solid #979797",
              borderRadius: "14px",
              width: "80px"
            }}>
              <ListItemIcon sx={{
                display: "flex",
                justifyContent: "center",
                marginBottom: 0.7
              }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="2.5em" height="2.5em" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M12 21q-3.775 0-6.387-2.613T3 12q0-3.45 2.25-5.988T11 3.05q.325-.05.575.088t.4.362t.163.525t-.188.575q-.425.65-.638 1.375T11.1 7.5q0 2.25 1.575 3.825T16.5 12.9q.775 0 1.538-.225t1.362-.625q.275-.175.563-.162t.512.137q.25.125.388.375t.087.6q-.35 3.45-2.937 5.725T12 21" />
                </svg>
              </ListItemIcon>
              Dark
            </MenuItem>

          </Box>


        </Box>

        <Box paddingInline={2} marginTop={2}>

          <Typography variant='subtitle2' fontWeight={500} marginBottom={1}>
            Layout
          </Typography>

          <Box display={"flex"} justifyContent={"space-between"} alignItems={"center"} gap={2}>

            <MenuItem onClick={handleClose} sx={{
              fontSize: 12,
              fontWeight: 500,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              border: "1px solid #979797",
              borderRadius: "14px",
              width: "80px"
            }}>
              <ListItemIcon sx={{
                display: "flex",
                justifyContent: "center",
                paddingBlock: 0.7
              }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="3.5em" height="3.5em" viewBox="0 0 16 16">
                  <path fill="currentColor" d="M0 3a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm5-1v12h9a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1zM4 2H2a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h2z" />
                </svg>
              </ListItemIcon>
            </MenuItem>

            <MenuItem onClick={handleClose} sx={{
              fontSize: 12,
              fontWeight: 500,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              border: "1px solid #979797",
              borderRadius: "14px",
              width: "80px"
            }}>
              <ListItemIcon sx={{
                display: "flex",
                justifyContent: "center",
                paddingBlock: 0.7
              }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="3.5em" height="3.5em" viewBox="0 0 16 16">
                  <path fill="currentColor" d="M0 3a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm5-1v12h9a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1zM4 2H2a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h2z" />
                </svg>
              </ListItemIcon>
            </MenuItem>

            <MenuItem onClick={handleClose} sx={{
              fontSize: 12,
              fontWeight: 500,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              border: "1px solid #979797",
              borderRadius: "14px",
              width: "80px"
            }}>
              <ListItemIcon sx={{
                display: "flex",
                justifyContent: "center",
                paddingBlock: 0.7
              }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="3.5em" height="3.5em" viewBox="0 0 16 16">
                  <path fill="currentColor" d="M0 3a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm5-1v12h9a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1zM4 2H2a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h2z" />
                </svg>
              </ListItemIcon>
            </MenuItem>


          </Box>


        </Box>

        <Box paddingInline={2} marginTop={2}>

          <Typography variant='subtitle2' fontWeight={500} marginBottom={1}>
            Stretch
          </Typography>

          <MenuItem onClick={handleClose} sx={{
            fontSize: 12,
            fontWeight: 500,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            border: "1px solid #979797",
            borderRadius: "14px",
          }}>
            <ListItemIcon sx={{
              display: "flex",
              justifyContent: "center",
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="3em" height="3em" viewBox="0 0 24 24">
                <path fill="currentColor" d="M17 4h3c1.1 0 2 .9 2 2v2h-2V6h-3zM4 8V6h3V4H4c-1.1 0-2 .9-2 2v2zm16 8v2h-3v2h3c1.1 0 2-.9 2-2v-2zM7 18H4v-2H2v2c0 1.1.9 2 2 2h3zm9-8v4H8v-4zm2-2H6v8h12z" />
              </svg>
            </ListItemIcon>
          </MenuItem>

        </Box>

        <Box paddingInline={2} marginTop={2}>

          <MenuItem onClick={handleClose} sx={{
            fontSize: 14,
            fontWeight: 500,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            border: "1px solid #979797",
            borderRadius: "14px",
            letterSpacing: 0.2,
            height: "50px"
          }}>
            <ListItemIcon sx={{
              display: "flex",
              justifyContent: "center",
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="1.7em" height="1.7em" viewBox="0 0 24 24">
                <g fill="none">
                  <path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z" />
                  <path fill="currentColor" d="M4 15a1 1 0 0 1 1 1v3h3a1 1 0 1 1 0 2H5a2 2 0 0 1-2-2v-3a1 1 0 0 1 1-1m16 0a1 1 0 0 1 .993.883L21 16v3a2 2 0 0 1-1.85 1.995L19 21h-3a1 1 0 0 1-.117-1.993L16 19h3v-3a1 1 0 0 1 1-1M19 3a2 2 0 0 1 1.995 1.85L21 5v3a1 1 0 0 1-1.993.117L19 8V5h-3a1 1 0 0 1-.117-1.993L16 3zM8 3a1 1 0 0 1 .117 1.993L8 5H5v3a1 1 0 0 1-1.993.117L3 8V5a2 2 0 0 1 1.85-1.995L5 3z" />
                </g>
              </svg>
            </ListItemIcon>

            Fullscreen
          </MenuItem>

        </Box>

      </Menu>
    </React.Fragment>
  );
};

export default SettingsButton;