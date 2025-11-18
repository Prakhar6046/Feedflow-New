import {
  Box,
  Button,
  IconButton,
  Modal,
  Stack,
  Typography,
} from '@mui/material';
import React from 'react';
import { Close as CloseIcon } from '@mui/icons-material';

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  onConfirm: () => void;
  existingBatchNumber?: string;
}

const RestockConfirmationModal: React.FC<Props> = ({
  open,
  setOpen,
  onConfirm,
  existingBatchNumber,
}) => {
  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirm = () => {
    onConfirm();
    setOpen(false);
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="restock-confirmation-modal-title"
      aria-describedby="restock-confirmation-modal-description"
    >
      <Stack
        bgcolor={'white'}
        borderRadius={2}
        mx={'auto'}
        height={'fit-content'}
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%,-50%)',
          width: {
            md: 'fit-content',
            sm: '70%',
            xs: '90%',
          },
        }}
      >
        <Box
          display={'flex'}
          justifyContent={'center'}
          alignItems={'center'}
          height={'fit-content'}
        >
          <Box>
            <Box display="flex" justifyContent="flex-end" padding={2}>
              <IconButton
                onClick={handleClose}
                sx={{
                  color: 'inherit',
                  background: 'transparent',
                  margin: '2',
                }}
              >
                <CloseIcon />
              </IconButton>
            </Box>
            <Box
              sx={{
                p: {
                  sm: 4,
                  xs: 2,
                },
              }}
            >
              <Typography
                variant="h6"
                fontWeight={600}
                textAlign={'center'}
                sx={{
                  fontSize: {
                    md: '20px',
                    sm: '18px',
                    xs: '16px',
                  },
                  mb: 2,
                }}
              >
                Restock with Different Batch?
              </Typography>

              <Typography
                variant="body1"
                fontWeight={400}
                textAlign={'center'}
                sx={{
                  fontSize: {
                    md: '16px',
                    xs: '14px',
                  },
                  mb: 1,
                }}
              >
                One batch fish supply already stock in this production unit.
              </Typography>
              
              {existingBatchNumber && (
                <Typography
                  variant="body2"
                  fontWeight={600}
                  textAlign={'center'}
                  sx={{
                    fontSize: {
                      md: '14px',
                      xs: '12px',
                    },
                    color: '#06A19B',
                    mb: 2,
                  }}
                >
                  Existing Batch: {existingBatchNumber}
                </Typography>
              )}

              <Typography
                variant="body1"
                fontWeight={400}
                textAlign={'center'}
                sx={{
                  fontSize: {
                    md: '16px',
                    xs: '14px',
                  },
                }}
              >
                Do you want to restock with other batch?
              </Typography>

              <Box display={'flex'} gap={2} justifyContent={'center'} mt={5}>
                <Button
                  type="button"
                  onClick={handleClose}
                  variant="contained"
                  sx={{
                    background: '#fff',
                    fontWeight: 600,
                    padding: '6px 16px',
                    width: 'fit-content',
                    textTransform: 'capitalize',
                    borderRadius: '8px',
                    color: '#06A19B',
                    border: '1px solid #06A19B',
                    boxShadow: 'none',
                    '&:hover': {
                      background: '#f5f5f5',
                    },
                  }}
                >
                  Cancel
                </Button>

                <Button
                  type="button"
                  onClick={handleConfirm}
                  variant="contained"
                  sx={{
                    background: '#06A19B',
                    fontWeight: 600,
                    padding: '6px 16px',
                    width: 'fit-content',
                    textTransform: 'capitalize',
                    borderRadius: '8px',
                    color: '#fff',
                    border: '1px solid #06A19B',
                    boxShadow: 'none',
                    '&:hover': {
                      background: '#058a85',
                    },
                  }}
                >
                  Yes
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      </Stack>
    </Modal>
  );
};

export default RestockConfirmationModal;

