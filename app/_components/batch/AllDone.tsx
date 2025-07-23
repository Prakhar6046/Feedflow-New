import { Box, Button, Stack, Typography } from '@mui/material';
import { NextPage } from 'next';
import { useRouter } from 'next/navigation';

interface Props {
  setActiveStep: (val: number) => void;
  activeStep: number;
}
const AllDone: NextPage<Props> = ({ setActiveStep, activeStep }) => {
  const router = useRouter();
  const handleClick = () => {
    if (activeStep === 5) {
      router.push('/dashboard/batches');
    } else {
      setActiveStep(5);
    }
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
        {`So what's next?`}
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
              Set up your projections
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
              for each of your production units on your dashboard. Projections
              are the
              <span
                style={{
                  color: '#06A19B',
                  fontWeight: 500,
                }}
              >
                {' '}
                parameters{' '}
              </span>{' '}
              the website uses to make predictions or your batches.{' '}
            </Typography>
          </Box>
        </Box>

        <Box
          display={'flex'}
          alignItems={'start'}
          sx={{
            gap: {
              md: 2,
              xs: 1.5,
            },
            marginTop: {
              md: 5,
              xs: 2.5,
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
                viewBox="0 0 36 36"
              >
                <circle
                  cx="20.75"
                  cy="6"
                  r="4"
                  fill="#fff"
                  className="clr-i-solid clr-i-solid-path-1"
                />
                <path
                  fill="#fff"
                  d="M24.84 26.23a1 1 0 0 0-1.4.29a16.6 16.6 0 0 1-3.51 3.77c-.33.25-1.56 1.2-2.08 1c-.36-.11-.15-.82-.08-1.12l.53-1.57c.22-.64 4.05-12 4.47-13.3c.62-1.9.35-3.77-2.48-3.32c-.77.08-8.58 1.09-8.72 1.1a1 1 0 0 0 .13 2s3-.39 3.33-.42a.88.88 0 0 1 .85.44a2.47 2.47 0 0 1-.07 1.71c-.26 1-4.37 12.58-4.5 13.25a2.78 2.78 0 0 0 1.18 3a5 5 0 0 0 3.08.83a8.5 8.5 0 0 0 3.09-.62c2.49-1 5.09-3.66 6.46-5.75a1 1 0 0 0-.28-1.29"
                  className="clr-i-solid clr-i-solid-path-2"
                />
                <path fill="none" d="M0 0h36v36H0z" />
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
              Information
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
              {` When setting up your projection, you'll be asked to add
              information on`}
              <span
                style={{
                  color: '#06A19B',
                  fontWeight: 500,
                }}
              >
                {' '}
                fish batch{' '}
              </span>{' '}
              {` that'll be growing in the production unit. Next, we'll need to
              know which`}
              <span
                style={{
                  color: '#06A19B',
                  fontWeight: 500,
                }}
              >
                {' '}
                feed plan{' '}
              </span>{' '}
              {`you're going to use and lastly either the`}
              <span
                style={{
                  color: '#06A19B',
                  fontWeight: 500,
                }}
              >
                {' '}
                harvest date{' '}
              </span>{' '}
              or the{' '}
              <span
                style={{
                  color: '#06A19B',
                  fontWeight: 500,
                }}
              >
                {' '}
                harvest weights
              </span>{' '}
            </Typography>
          </Box>
        </Box>
      </Stack>
      <Box
        display={'flex'}
        justifyContent={'flex-end'}
        alignItems={'center'}
        gap={3}
        mt={3}
      >
        {activeStep !== 5 && (
          <Button
            type="submit"
            variant="contained"
            sx={{
              background: '#fff',
              color: '#06A19B',
              fontWeight: 600,
              padding: '6px 16px',
              width: 'fit-content',
              textTransform: 'capitalize',
              borderRadius: '8px',
              border: '1px solid #06A19B',
            }}
            onClick={() => setActiveStep(3)}
          >
            Previous
          </Button>
        )}

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
          {activeStep === 5 ? 'Go To Batches' : "Let's Get Started"}
        </Button>
      </Box>
    </Stack>
  );
};
export default AllDone;
