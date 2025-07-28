import { NextPage } from 'next';
import Box from '@mui/material/Box';
import { Stack } from '@mui/material';
import loaderImg from '../../public/static/img/loader.png';
import Image from 'next/image';

const Loader: NextPage = () => {
  return (
    <Stack
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
      }}
      className="loading-spinner"
    >
      <Box sx={{ display: 'flex' }}>
        <div className="loader-container">
          <div className="loader-inner">
            <Image src={loaderImg} className="loader" alt="loader" />
          </div>
          <div></div>
          <div></div>
        </div>
      </Box>
    </Stack>
  );
};

export default Loader;
