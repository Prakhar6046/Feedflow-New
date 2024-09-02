"use client";
import {
  Box,
  Button,
  Divider,
  Popover,
  Stack,
  Typography,
} from "@mui/material";
import React from "react";
import settingIcon from "@/public/static/img/icons/ic-setting-inline.svg";
import Image from "next/image";
import closeIcon from "@/public/static/img/icons/ic-close.svg";

const SettingsButton = () => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  return (
    <Box>
      <Button aria-describedby={id} variant="contained" onClick={handleClick}>
        <Image src={settingIcon} alt="Settings Icon" />
      </Button>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          gap={5}
          padding={2}
        >
          <Typography
            variant="subtitle1"
            sx={{
              flexGrow: 1,
            }}
          >
            Setting
          </Typography>

          <Box display="flex" justifyContent="center" alignItems="center">
            <Image
              src={closeIcon}
              alt="Close Icon"
              width={20}
              height={20}
            ></Image>
          </Box>
        </Stack>

        <Divider
          sx={{
            borderColor: "#979797",
          }}
        />

        <Stack spacing={2} padding={2}>
          <Stack spacing={1.5}>
            <Typography variant="subtitle2">Mode</Typography>
          </Stack>
          <Stack spacing={1.5}>
            <Typography variant="subtitle2">Mode</Typography>
          </Stack>
          <Stack spacing={1.5}>
            <Typography variant="subtitle2">Mode</Typography>
          </Stack>
        </Stack>

        {/* <Divider /> */}
      </Popover>
    </Box>
  );
};

export default SettingsButton;
