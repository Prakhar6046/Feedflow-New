"use client"; // Ensure this line is at the very top of the file

import { Divider, Stack } from "@mui/material";
import React from "react";
import SettingsButton from "./settings/SettingsButton";
import AccountPopover from "./AccountPopover";

const Header = () => {
  return (
    <Stack
      flexGrow={1}
      direction={"row"}
      alignItems={"center"}
      justifyContent={"end"}
      gap={2}
      spacing={{ xs: 0.5, sm: 1.5 }}
    >
      <Divider orientation="vertical" variant="middle" flexItem />
      <SettingsButton />
      <AccountPopover />
    </Stack>
  );
};

export default Header;
