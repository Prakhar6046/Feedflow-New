'use client';
import React from 'react';

import ClosedSidebar from './sidebar/ClosedSidebar';
import ExpandedSidebar from './sidebar/ExpandedSidebar';
import { Stack } from '@mui/material';
import { useAppSelector } from '@/lib/hooks';
import { selectSwitchSidebar } from '@/lib/features/sidebar/sidebarSlice';
function Sidebar() {
  const switchSidebar = useAppSelector(selectSwitchSidebar);
  return (
    <Stack
      sx={{
        transition: switchSidebar ? 'all 1s !important' : '',
      }}
    >
      {switchSidebar ? <ExpandedSidebar /> : <ClosedSidebar />}
    </Stack>
  );
}
export default Sidebar;
