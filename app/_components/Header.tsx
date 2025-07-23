'use client';
import { Stack } from '@mui/material';
import AccountPopover from './AccountPopover';

const Header = () => {
  return (
    <Stack
      flexGrow={1}
      direction={'row'}
      alignItems={'center'}
      justifyContent={'end'}
      gap={2}
      spacing={{ xs: 0.5, sm: 1.5 }}
    >
      <AccountPopover />
    </Stack>
  );
};

export default Header;
