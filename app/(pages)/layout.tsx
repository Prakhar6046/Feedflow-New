'use client';
import Header from '@/app/_components/Header';
import Sidebar from '@/app/_components/Sidebar';
import { selectSwitchSidebar } from '@/lib/features/sidebar/sidebarSlice';
import { useAppSelector } from '@/lib/hooks';
import { Box, Stack } from '@mui/material';
import { Toaster } from 'react-hot-toast';
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const switchSidebar = useAppSelector(selectSwitchSidebar);
  return (
    <Stack display={'flex'} direction={'row'} height={'100vh'}>
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{ duration: 5000 }}
      />
      <Sidebar />
      {switchSidebar ? (
        <Box width={'100%'} paddingTop={2} paddingRight={5} paddingLeft={39}>
          <Header />
          {children}
        </Box>
      ) : (
        <Box width={'100%'} paddingTop={2} paddingRight={5} paddingLeft={17}>
          <Header />
          {children}
        </Box>
      )}
    </Stack>
  );
}
