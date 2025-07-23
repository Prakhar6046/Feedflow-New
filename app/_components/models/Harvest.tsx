import {
  Box,
  Button,
  Grid,
  IconButton,
  Modal,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

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

const HarvestModal: React.FC<Props> = ({ setOpen, open }) => {
  const handleClose = () => setOpen(false);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      className="harvest-modal"
    >
      <Stack sx={style} borderRadius="14px">
        {/* Header with close icon */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          padding={2}
        >
          <IconButton
            onClick={handleClose}
            sx={{ color: 'inherit', marginLeft: 'auto' }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        <Box padding={3}>
          <Grid container spacing={1}>
            <Grid item lg={2} md={6} xs={12}>
              <TextField
                label="Fish Farm *"
                type="text"
                className="form-input"
                sx={{ width: '100%' }}
              />
              <Typography
                variant="body2"
                color="red"
                fontSize={13}
                mt={0.5}
              ></Typography>
            </Grid>
            <Grid item lg={3} md={6} xs={12}>
              <TextField
                label="Biomass (kg) *"
                type="text"
                className="form-input"
                sx={{ width: '100%' }}
              />
              <Typography
                variant="body2"
                color="red"
                fontSize={13}
                mt={0.5}
              ></Typography>
            </Grid>
            <Grid item lg={2} md={6} xs={12}>
              <TextField
                label="Count *"
                type="text"
                className="form-input"
                sx={{ width: '100%' }}
              />
              <Typography
                variant="body2"
                color="red"
                fontSize={13}
                mt={0.5}
              ></Typography>
            </Grid>
            <Grid item lg={2} md={6} xs={12}>
              <TextField
                label="Mean Weight*"
                type="text"
                className="form-input"
                sx={{ width: '100%' }}
              />
              <Typography
                variant="body2"
                color="red"
                fontSize={13}
                mt={0.5}
              ></Typography>
            </Grid>
            <Grid item lg={2} md={6} xs={12}>
              <TextField
                label="Mean Length*"
                type="text"
                className="form-input"
                sx={{ width: '100%' }}
              />
              <Typography
                variant="body2"
                color="red"
                fontSize={13}
                mt={0.5}
              ></Typography>
            </Grid>
          </Grid>
        </Box>

        <Box
          padding={3}
          display={'flex'}
          alignItems={'center'}
          textAlign={'center'}
          justifyContent={'center'}
          gap="40px"
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
            }}
          >
            HARVEST
          </Button>
          <Button
            type="button"
            variant="contained"
            onClick={handleClose}
            sx={{
              background: '#06A19B',
              fontWeight: 'bold',
              padding: '8px 20px',
              width: 'fit-content',
              textTransform: 'capitalize',
              borderRadius: '12px',
            }}
          >
            CANCEL
          </Button>
        </Box>
      </Stack>
    </Modal>
  );
};

export default HarvestModal;
