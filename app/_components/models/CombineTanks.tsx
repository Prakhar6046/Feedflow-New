import { Box, Button, Modal, Stack, Typography } from '@mui/material';

const style = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
};

interface Props {
  setOpen: (open: boolean) => void;
  open: boolean;
}

const CombineTanks: React.FC<Props> = ({ setOpen, open }) => {
  const handleClose = () => setOpen(false);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Stack sx={style}>
        <Box padding={2} textAlign={'center'}>
          <Typography
            variant="h2"
            component="h2"
            sx={{
              fontWeight: 'bold',
              fontSize: '20px',
              color: '#06A19B',
              my: 2,
              textAlign: 'center',
              borderBlockEnd: '1px solid #06A19B',
              marginInline: '50px',
            }}
          >
            Combine Tanks / Units
          </Typography>
          <Typography
            component="p"
            sx={{
              fontWeight: 'semibold',
              fontSize: '16px',
              color: '#fffff',
              my: 2,
            }}
          >
            Unit 2 on Dummy1 farm is already stocked, do you wish to combine the
            units?
          </Typography>
          <Box
            padding={2}
            display={'flex'}
            alignItems={'center'}
            justifyContent={'space-between'}
          >
            <Button
              type="button"
              variant="contained"
              sx={{
                background: '#06A19B',
                fontWeight: 'bold',
                padding: '8px 20px',
                width: 'fit-content',
                textTransform: 'capitalize',
                borderRadius: '12px',
                display: 'block',
              }}
            >
              COMBINE
            </Button>
            <Button
              type="button"
              variant="contained"
              sx={{
                background: '#06A19B',
                fontWeight: 'bold',
                padding: '8px 20px',
                width: 'fit-content',
                textTransform: 'capitalize',
                borderRadius: '12px',
                display: 'block',
              }}
            >
              CANCEL
            </Button>
          </Box>
        </Box>
      </Stack>
    </Modal>
  );
};

export default CombineTanks;
