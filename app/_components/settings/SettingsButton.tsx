'use client'; // Ensure this line is at the very top of the file

import { useEffect, useState } from 'react';
import { Divider, IconButton, Stack, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import SettingFullscreen from './SettingFullscreen';
import SettingLayout from './SettingLayout';
import SettingStretch from './SettingStretch';
import { IconButtonAnimate } from '../animate';
import Iconify from '../iconify';
import MenuPopover from '../menu-popover';
import Scrollbar from '../scrollbar/Scrollbar';
import SettingMode from './SettingMode';

const ITEM_HEIGHT = 64;

export default function SettingsButton() {
  const [open, setOpen] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  return (
    <>
      <IconButtonAnimate
        color={open ? 'primary' : 'default'}
        onClick={handleOpen}
        sx={{
          width: 40,
          height: 40,
          ...(open && {
            bgcolor: (theme) =>
              alpha(
                theme.palette.primary.main,
                theme.palette.action.focusOpacity,
              ),
          }),
        }}
      >
        <Iconify icon={'eva:options-2-fill'} width={20} height={20} />
      </IconButtonAnimate>

      <MenuPopover
        open={open}
        anchorEl={open}
        onClose={handleClose}
        sx={{
          mt: 1.5,
          ml: 0.75,
          width: 320,
          '& .MuiMenuItem-root': {
            px: 1.5,
            height: ITEM_HEIGHT,
            borderRadius: 0.75,
          },
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ py: 2, pr: 1, pl: 2.5 }}
        >
          <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
            Settings
          </Typography>

          <IconButton onClick={handleClose}>
            <Iconify icon={'eva:close-fill'} width={20} height={20} />
          </IconButton>
        </Stack>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Scrollbar sx={{ flexGrow: 1 }}>
          <Stack spacing={3} sx={{ p: 3 }}>
            <Stack spacing={1.5}>
              <Typography variant="subtitle2">Mode</Typography>
              <SettingMode />
            </Stack>

            <Stack spacing={1.5}>
              <Typography variant="subtitle2">Layout</Typography>
              <SettingLayout />
            </Stack>

            <Stack spacing={1.5}>
              <Typography variant="subtitle2">Stretch</Typography>
              <SettingStretch />
            </Stack>

            <SettingFullscreen />
          </Stack>
        </Scrollbar>
      </MenuPopover>
    </>
  );
}
