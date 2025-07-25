import closeIcon from '@/public/static/img/icons/ic-close.svg';
import {
  Box,
  Button,
  Modal,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Image from 'next/image';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

import { SingleOrganisation } from '@/app/_typeModels/Organization';
import toast from 'react-hot-toast';
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
  organisations: SingleOrganisation[];
}

interface FormInputs {
  name: string;
  email: string;
  organisationId: number;
}

const AddUser: React.FC<Props> = ({ setOpen, open, organisations }) => {
  const [selectedOrganisation, setSelectedOrganisation] = useState<string>('');
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormInputs>();

  const handleClose = () => setOpen(false);

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    if (data.email && data.name && data.organisationId) {
      const payload = {
        name: data.name,
        email: data.email,
        organisationId: data.organisationId,
      };
      const response = await fetch('/api/add-new-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      const responseData = await response.json();
      toast.success(responseData.message);
      if (responseData.status) {
        handleClose();
        reset();
      }
    }
  };

  const handleChange = (event: SelectChangeEvent) => {
    setSelectedOrganisation(event.target.value as string);
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Stack sx={style} borderRadius="14px">
        <Box
          bgcolor="#F5F6F8"
          paddingInline={3}
          paddingBlock={2}
          display="flex"
          justifyContent="space-between"
          gap={2}
          alignItems={'center'}
          sx={{
            borderTopLeftRadius: '14px',
            borderTopRightRadius: '14px',
          }}
        >
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            color="#67737F"
            fontSize={18}
            fontWeight={600}
          >
            Add a new user
          </Typography>

          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            sx={{
              opacity: 0.5,
              cursor: 'pointer',
            }}
            onClick={handleClose}
          >
            <Image src={closeIcon} width={25} height={25} alt="Close Icon" />
          </Box>
        </Box>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box padding={3}>
            <TextField
              label="Name *"
              variant="outlined"
              className="form-input"
              fullWidth
              {...register('name', { required: true })}
              error={!!errors.name}
              helperText={errors.name ? 'Name is required' : ''}
              sx={{
                marginBottom: 2,
              }}
            />
            <TextField
              label="Email *"
              variant="outlined"
              fullWidth
              className="form-input"
              sx={{
                marginBottom: 2,
              }}
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                  message: 'Invalid email address',
                },
              })}
              error={!!errors.email}
              helperText={errors.email ? errors.email.message : ''}
            />
            <Box sx={{ minWidth: 120 }}>
              <FormControl fullWidth className="form-input">
                <InputLabel id="demo-simple-select-label">
                  Organisation *
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={selectedOrganisation}
                  label="Organisation"
                  {...register('organisationId')}
                  onChange={handleChange}
                >
                  {organisations?.map((organisation, i) => {
                    return (
                      <MenuItem value={Number(organisation.id)} key={i}>
                        {organisation.name}
                      </MenuItem>
                    );
                  })}
                  {/* <MenuItem value={20}>Twenty</MenuItem>
                  <MenuItem value={30}>Thirty</MenuItem> */}
                </Select>
              </FormControl>
            </Box>

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
                marginLeft: 'auto',
                display: 'block',
                marginTop: 3,
              }}
            >
              Create New User
            </Button>
          </Box>
        </form>
      </Stack>
    </Modal>
  );
};

export default AddUser;
