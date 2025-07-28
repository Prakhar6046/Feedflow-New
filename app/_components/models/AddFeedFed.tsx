import { FarmGroupUnit, Production } from '@/app/_typeModels/production';
import closeIcon from '@/public/static/img/icons/ic-close.svg';
import { Box, Button, Grid, Modal, Stack, TextField } from '@mui/material';
import Image from 'next/image';
import { useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

const style = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 750,
  bgcolor: 'background.paper',
  boxShadow: 24,
};

interface Props {
  setOpen: (open: boolean) => void;
  open: boolean;
  selectedProduction: Production | FarmGroupUnit | null;
}

interface FormInputs {
  name: string;
  unit: string;
  feedFed: number;
}

const AddFeedFed: React.FC<Props> = ({ setOpen, open, selectedProduction }) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormInputs>();

  const handleClose = () => setOpen(false);

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    console.log(data);
  };

  useEffect(() => {
    if (selectedProduction) {
      setValue('name', selectedProduction?.farm?.name);
      setValue('unit', selectedProduction?.productionUnit?.name);
    }
  }, [selectedProduction]);
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Stack sx={style} borderRadius="14px">
        <Box
          display="flex"
          justifyContent="end"
          alignItems="center"
          sx={{
            opacity: 0.5,
            p: 3,
            pb: 0,
            cursor: 'pointer',
          }}
          onClick={handleClose}
        >
          <Image src={closeIcon} width={25} height={25} alt="Close Icon" />
        </Box>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container padding={3} spacing={2}>
            <Grid item xs={4}>
              <TextField
                label="Farm *"
                variant="outlined"
                className="form-input"
                fullWidth
                {...register('name', { required: true })}
                InputProps={{ readOnly: true }}
                error={!!errors.name}
                helperText={errors.name ? 'Name is required' : ''}
                sx={{
                  marginBottom: 2,
                }}
              />
            </Grid>

            <Grid item xs={4}>
              <TextField
                label="Unit *"
                variant="outlined"
                fullWidth
                className="form-input"
                sx={{
                  marginBottom: 2,
                }}
                InputProps={{ readOnly: true }}
                {...register('unit')}
                value={selectedProduction?.productionUnit?.name ?? ''}
                // error={!!errors.email}
                // helperText={errors.email ? errors.email.message : ""}
              />
            </Grid>

            <Grid item xs={4}>
              <TextField
                label="Feed Fed *"
                variant="outlined"
                fullWidth
                className="form-input"
                sx={{
                  marginBottom: 2,
                }}
                {...register('feedFed')}
                // error={!!errors.email}
                // helperText={errors.email ? errors.email.message : ""}
              />
            </Grid>
          </Grid>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
            }}
          >
            <Button
              type="submit"
              variant="contained"
              sx={{
                background: '#06A19B',
                fontWeight: 'bold',
                padding: '8px 24px',
                width: 'fit-content',
                textTransform: 'capitalize',
                borderRadius: '12px',
                margin: 3,
                mt: 0,
              }}
            >
              Save
            </Button>
          </Box>
        </form>
      </Stack>
    </Modal>
  );
};

export default AddFeedFed;
