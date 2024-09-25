import {
  Box,
  Button,
  Modal,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Image from "next/image";
import closeIcon from "@/public/static/img/icons/ic-close.svg";
import { useForm, SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";

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
  selectedUnit: { name: string; formula: string };
}

const CalculateVolume: React.FC<Props> = ({ setOpen, open, selectedUnit }) => {
  console.log(selectedUnit.name);
  console.log(selectedUnit.formula);

  const handleClose = () => setOpen(false);

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
          alignItems={"center"}
          sx={{
            borderTopLeftRadius: "14px",
            borderTopRightRadius: "14px",
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
            Calculate capacity
          </Typography>

          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            sx={{
              opacity: 0.5,
              cursor: "pointer",
            }}
            onClick={handleClose}
          >
            <Image src={closeIcon} width={25} height={25} alt="Close Icon" />
          </Box>
        </Box>

        <Box padding={3}>
          <TextField
            label="Name"
            variant="outlined"
            fullWidth
            type="text"
            className="form-input"
            sx={{
              marginBottom: 2,
            }}
          />

          <Button
            type="submit"
            variant="contained"
            sx={{
              background: "#06A19B",
              fontWeight: "bold",
              padding: "8px 24px",
              width: "fit-content",
              textTransform: "capitalize",
              borderRadius: "12px",
              marginLeft: "auto",
              display: "block",
              marginTop: 3,
            }}
          >
            Send Invite
          </Button>
        </Box>
      </Stack>
    </Modal>
  );
};

export default CalculateVolume;
