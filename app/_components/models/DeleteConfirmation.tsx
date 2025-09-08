import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Modal,
  Stack,
  Typography,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import React, { useState } from "react";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  onConfirm: () => Promise<void>;
  organisationName?: string;
}

const DeleteConfirmation = ({ open, setOpen, onConfirm, organisationName }: Props) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const handleClose = () => {
    if (!loading) {
      setError("");
      setOpen(false);
    }
  };
  const handleDelete = async () => {
    setLoading(true);
    setError("");
    try {
      await onConfirm();
      setOpen(false);
    } catch (err: any) {
      setError(err?.message || "Failed to delete. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="child-modal-title"
      aria-describedby="child-modal-description"
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
            }}
          >
            {`Are you sure you want to delete "${organisationName}"?`}
          </Typography>

          <Typography
            variant="body1"
            fontWeight={600}
            textAlign={'center'}
            sx={{
              fontSize: {
                md: '16px',
                xs: '14px',
              },
            }}
          >
            This action cannot be undone.
          </Typography>

          {error && (
            <Typography variant="body2" color="error" mb={2}>
              {error}
            </Typography>
          )}
          <Box display={'flex'} gap={2} justifyContent={'end'} mt={5}>
            <Button
              type="button"
              onClick={handleClose}
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
              }}
            >
              Cancel
            </Button>

            <Button
              type="button"
              onClick={handleDelete}
              variant="contained"
              disabled={loading}
              sx={{
                background: '#fff',
                fontWeight: 600,
                padding: '6px 16px',
                width: 'fit-content',
                textTransform: 'capitalize',
                borderRadius: '8px',
                color: '#D71818',
                border: '1px solid #D71818',
                boxShadow: 'none',
              }}
            >
              {loading ? <CircularProgress size={20} /> : "Delete"}
            </Button>
          </Box>
        </Box>
      </Stack>
    </Modal>
  );
};

export default DeleteConfirmation;
