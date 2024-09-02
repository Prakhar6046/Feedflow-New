import { Divider, Stack } from '@mui/material';
import React from 'react';
import SettingsButton from './SettingsButton';
import AccountPopover from './AccountPopover';

const Header = () => {
    return (
        <Stack direction={"row"} alignItems={"center"} justifyContent={"end"} gap={2}>
            <Divider orientation="vertical" variant="middle" flexItem />
            <SettingsButton />
            <AccountPopover />
        </Stack>
    );
};

export default Header;