import { Box, Button, Stack, Typography } from '@mui/material';
import { NextPage } from 'next';

interface Props {
  setActiveStep: (val: number) => void;
}

const BatchWizard: NextPage<Props> = ({ setActiveStep }) => {
  return (
    <Stack>
      <Typography
        variant="h6"
        fontWeight={700}
        sx={{
          fontSize: {
            md: 24,
            xs: 20,
          },
        }}
      >
        Batch Wizard
      </Typography>

      <Typography variant="body1" color="#555555">
        This wizard will assist you in adding a new fish batch to your account.{' '}
        <br />
        The steps you will be following will proceed as follows:
      </Typography>

      <Stack mt={4}>
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
                  md: 60,
                  xs: 30,
                },
                height: {
                  md: 60,
                  xs: 30,
                },
                color: '#fff',
                backgroundColor: '#06A19B',
                fontSize: {
                  md: 28,
                  xs: 16,
                },
              }}
            >
              1
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
              Create a new batch
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
              In this step you will define the parameters for the
              projection.{' '}
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
            marginBlock: {
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
                  md: 60,
                  xs: 30,
                },
                height: {
                  md: 60,
                  xs: 30,
                },
                color: '#fff',
                backgroundColor: '#06A19B',
                fontSize: {
                  md: 28,
                  xs: 16,
                },
              }}
            >
              2
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
              Define harvesting parameters
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
              In this step you will define the parameters for the projection. In
              other words: when and how the batch would ideally be
              harvested{' '}
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
                  md: 60,
                  xs: 30,
                },
                height: {
                  md: 60,
                  xs: 30,
                },
                color: '#fff',
                backgroundColor: '#06A19B',
                fontSize: {
                  md: 28,
                  xs: 16,
                },
              }}
            >
              3
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
              Choose feeding plan
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
              Here you will select or create a feeding plan you will be
              following during the lifecycle of your newly added batch. You can
              choose from existing feeding plans - either your own saved feeding
              plans or plans composed by a nutritionist. Alternatively you can
              create your own feeding regime from the list of available
              feeds.{' '}
            </Typography>
          </Box>
        </Box>
      </Stack>
      <Box display={'flex'} justifyContent={'flex-end'} alignItems={'center'}>
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
            marginTop: 3,
            border: '1px solid #06A19B',
          }}
          onClick={() => setActiveStep(1)}
        >
          Next
        </Button>
      </Box>
    </Stack>
  );
};

export default BatchWizard;
