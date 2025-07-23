import { Box, Button } from '@mui/material';
interface Iprops {
  setActiveStep: (val: number) => void;
  steps: { label: string; id: number }[];
}
function FeedStore({ setActiveStep, steps }: Iprops) {
  return (
    <div>
      Feed Store
      {steps.length === 3 && (
        <Box>
          <Box
            display={'flex'}
            alignItems={'flex-end'}
            mt={3}
            gap={2}
            flexWrap={'wrap'}
            justifyContent={'flex-end'}
            width={'100%'}
          >
            {' '}
          </Box>
          <Box
            display={'flex'}
            justifyContent={'flex-end'}
            alignItems={'flex-end'}
            gap={3}
            mt="14rem"
          >
            <Button
              type="button"
              variant="contained"
              sx={{
                background: '#06A19B',
                fontWeight: 600,
                padding: '6px 16px',
                width: 'fit-content',
                textTransform: 'capitalize',
                borderRadius: '8px',
              }}
              onClick={() => setActiveStep(2)}
            >
              Next
            </Button>
          </Box>
        </Box>
      )}
    </div>
  );
}

export default FeedStore;
