'use client';
import { Box, Button, Stack } from '@mui/material';
import { setCookie } from 'cookies-next';
import { useRouter } from 'next/navigation';

const EmptyFarm = () => {
  const router = useRouter();
  return (
    <Stack
      sx={{
        borderRadius: '14px',
        boxShadow: '0px 0px 16px 5px #0000001A',
        mt: 4,
      }}
    >
      <Box
        sx={{
          px: {
            md: 3,
            xs: 2,
          },
          fontSize: 20,
          fontWeight: 600,
          borderColor: '#0000001A',
          textAlign: 'center',
          pt: {
            md: 3,
            xs: 2,
          },
        }}
      >
        No farm information found.
      </Box>

      <Button
        variant="contained"
        onClick={() => {
          setCookie('activeStep', 0);
          router.push('/dashboard/farm/newFarm');
        }}
        sx={{
          background: '#06A19B',
          fontWeight: 600,
          padding: '6px 16px',
          width: 'fit-content',
          textTransform: 'capitalize',
          borderRadius: '8px',
          marginInline: 'auto',
          marginBlock: 2,
        }}
      >
        Add Farm
      </Button>
    </Stack>
  );
};

export default EmptyFarm;
