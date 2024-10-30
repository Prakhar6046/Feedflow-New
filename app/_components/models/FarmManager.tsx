import {
  Box,
  Button,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  Modal,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material"; // Use Material-UI's Close icon directly

import Select, { SelectChangeEvent } from "@mui/material/Select";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
};

interface Props {
  setOpen: (open: boolean) => void;
  open: boolean;
}

const TransferModal: React.FC<Props> = ({ setOpen, open }) => {
  const handleClose = () => setOpen(false);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Stack sx={style}>
        {/* Header with close icon */}
        <Box display="flex" justifyContent="flex-end" padding={2}>
          <IconButton
            onClick={handleClose}
            sx={{ color: "inherit", background: "transparent" }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        <Box padding={3}>
          <Grid container spacing={2}>
            <Grid item md={6} xs={12}>
              <FormControl fullWidth className="form-input">
                <InputLabel id="">Fish Farm *</InputLabel>
                <Select
                  labelId="feed-supply-select-label9"
                  className="fish-manager"
                  id="feed-supply-select9"
                  label="Fish Farm*"
                ></Select>
                <Typography
                  variant="body2"
                  color="red"
                  fontSize={13}
                  mt={0.5}
                ></Typography>
              </FormControl>
            </Grid>
            <Grid item md={6} xs={12}>
              <FormControl fullWidth className="form-input">
                <InputLabel id="">Production Unit*</InputLabel>
                <Select
                  labelId="feed-supply-select-label9"
                  id="feed-supply-select9"
                  label="Production Unit*"
                ></Select>
                <Typography
                  variant="body2"
                  color="red"
                  fontSize={13}
                  mt={0.5}
                ></Typography>
              </FormControl>
            </Grid>

            <Grid item md={6} xs={12}>
              <TextField
                label="Biomass (kg) *"
                type="text"
                className="form-input"
                sx={{ width: "100%" }}
              />
              <Typography
                variant="body2"
                color="red"
                fontSize={13}
                mt={0.5}
              ></Typography>
            </Grid>

            <Grid item md={6} xs={12}>
              <TextField
                label="Count *"
                type="text"
                className="form-input"
                sx={{ width: "100%" }}
              />
              <Typography
                variant="body2"
                color="red"
                fontSize={13}
                mt={0.5}
              ></Typography>
            </Grid>

            <Grid item md={6} xs={12}>
              <TextField
                label="Mean Weight*"
                type="text"
                className="form-input"
                sx={{ width: "100%" }}
              />
              <Typography
                variant="body2"
                color="red"
                fontSize={13}
                mt={0.5}
              ></Typography>
            </Grid>

            <Grid item md={6} xs={12}>
              <TextField
                label="Average Length*"
                type="text"
                className="form-input"
                sx={{ width: "100%" }}
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

        <Box padding={3} display={"flex"} alignItems={"center"} gap={"2px"}>
          <Button
            type="button"
            variant="contained"
            sx={{
              background: "#06A19B",
              fontWeight: "bold",
              padding: "8px 20px",
              width: "fit-content",
              textTransform: "capitalize",
              borderRadius: "12px",
              marginLeft: "auto",
            }}
          >
            ADD UNIT
          </Button>
          <Button
            type="button"
            variant="contained"
            sx={{
              background: "#06A19B",
              fontWeight: "bold",
              padding: "8px 20px",
              width: "fit-content",
              textTransform: "capitalize",
              borderRadius: "12px",
              marginLeft: "auto",
            }}
          >
            TRANSFER
          </Button>
          <Button
            type="button"
            variant="contained"
            sx={{
              background: "#06A19B",
              fontWeight: "bold",
              padding: "8px 20px",
              width: "fit-content",
              textTransform: "capitalize",
              borderRadius: "12px",
              marginLeft: "auto",
            }}
          >
            CANCEL
          </Button>
        </Box>
      </Stack>
    </Modal>
  );
};

export default TransferModal;
