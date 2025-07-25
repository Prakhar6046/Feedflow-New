import { farmAction } from '@/lib/features/farm/farmSlice';
import { useAppDispatch } from '@/lib/hooks';
import { Box, Button, Stack, Typography } from '@mui/material';
import { NextPage } from 'next';
import { useRouter } from 'next/navigation';

interface Props {
  setActiveStep: (val: number) => void;
  isEdit: boolean | undefined;
}

const AllDone: NextPage<Props> = ({ isEdit }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const handleClick = () => {
    dispatch(farmAction.resetState());
    router.push('/dashboard/farm');
  };
  return (
    <Stack>
      <Typography
        variant="h6"
        gutterBottom
        fontWeight={700}
        sx={{
          fontSize: {
            md: 24,
            xs: 20,
          },
        }}
      >
        All done
      </Typography>

      <Typography
        variant="h5"
        fontWeight={500}
        sx={{
          fontSize: {
            md: 18,
            xs: 16,
          },
        }}
      >
        {` So what's next?`}
      </Typography>

      <Stack my={3}>
        <Box
          display={'flex'}
          alignItems={'start'}
          sx={{
            gap: {
              md: 2,
              xs: 1.5,
            },
          }}
        >
          <Box>
            <Box
              fontWeight={700}
              display={'flex'}
              justifyContent={'center'}
              alignItems={'center'}
              borderRadius={100}
              sx={{
                width: {
                  md: 80,
                  xs: 40,
                },
                height: {
                  md: 80,
                  xs: 40,
                },
                color: '#fff',
                backgroundColor: '#06A19B',
                fontSize: {
                  md: 28,
                  xs: 16,
                },
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1.3em"
                height="1.3em"
                viewBox="0 0 14 14"
              >
                <path
                  fill="#fff"
                  fillRule="evenodd"
                  d="M1.898 10.778A1 1 0 0 1 .483 9.363l3.333-3.332l.007-.007a1.457 1.457 0 0 1 2.039 0l.007.007L7.57 7.732L9.917 5.25l-1.04-1.04a.75.75 0 0 1 .53-1.28h3.652a.75.75 0 0 1 .75.75v3.652a.75.75 0 0 1-1.28.53l-1.197-1.198l-2.704 2.861a1.457 1.457 0 0 1-2.066.027l-.007-.007l-1.713-1.712z"
                  clipRule="evenodd"
                />
              </svg>
            </Box>
          </Box>

          <Box>
            <Typography
              variant="h5"
              fontWeight={600}
              sx={{
                fontSize: {
                  md: 18,
                  xs: 16,
                },
                marginBottom: {
                  md: 0.5,
                  xs: 0,
                },
              }}
            >
              Set up the fish batch
            </Typography>
            <Typography
              variant="body1"
              color="#555555"
              sx={{
                fontSize: {
                  md: 16,
                  xs: 14,
                },
              }}
            >
              {`  You've now successfully ${
                isEdit
                  ? 'edited production unit(s) in'
                  : 'added production unit(s) to'
              } your
          farm. The next step is to assign a`}
              <span
                style={{
                  color: '#06A19B',
                  fontWeight: 500,
                }}
              >
                {' '}
                fish batch{' '}
              </span>{' '}
              to each of the production units on your farm. After assigning a
              batch to your farm, you will assign a{' '}
              <span
                style={{
                  color: '#06A19B',
                  fontWeight: 500,
                }}
              >
                {' '}
                feeding plan{' '}
              </span>{' '}
              that the system will use to do your projections
            </Typography>
          </Box>
        </Box>
      </Stack>
      <Box
        display={'flex'}
        justifyContent={'flex-end'}
        alignItems={'center'}
        flexWrap={'wrap'}
        gap={3}
        mt={1}
      >
        <Button
          type="submit"
          variant="contained"
          sx={{
            background: '#06A19B',
            fontWeight: 600,
            padding: '6px 16px',
            width: 'fit-content',
            textTransform: 'capitalize',
            borderRadius: '8px',
          }}
          onClick={handleClick}
        >
          Go to the dashboard
        </Button>
      </Box>
    </Stack>
  );
};

export default AllDone;
