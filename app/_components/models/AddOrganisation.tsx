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

interface FormInputs {
  name: string;
  email: string;
  contactPerson: string;
  contactNumber: string;
}

const AddOrganization: React.FC<Props> = ({ setOpen, open }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormInputs>();

  const handleClose = () => setOpen(false);

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    if (data.email) {
      const response = await fetch("/api/add-organisation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();
      if (responseData.status) {
        handleClose();
        reset();
      }
    }
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
            Invite by email
          </Typography>

          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            sx={{
              opacity: 0.5,
            }}
            onClick={handleClose}
          >
            <Image src={closeIcon} width={25} height={25} alt="Close Icon" />
          </Box>
        </Box>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box paddingInline={3} paddingTop={2} paddingBottom={7}>
            <TextField
              label="Name"
              variant="outlined"
              fullWidth
              {...register("name", { required: true })}
              error={!!errors.name}
              helperText={errors.name ? "Name is required" : ""}
            />
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                  message: "Invalid email address",
                },
              })}
              error={!!errors.email}
              helperText={errors.email ? errors.email.message : ""}
            />
            <TextField
              label="Contact Person"
              variant="outlined"
              fullWidth
              {...register("contactPerson", { required: true })}
              error={!!errors.contactPerson}
              helperText={
                errors.contactPerson ? "Contact Person is required" : ""
              }
            />
            <TextField
              label="Contact Number"
              variant="outlined"
              fullWidth
              {...register("contactNumber", {
                required: "Contact Number is required",
                pattern: {
                  value: /^[0-9]+$/,
                  message: "Invalid contact number",
                },
              })}
              error={!!errors.contactNumber}
              helperText={
                errors.contactNumber ? errors.contactNumber.message : ""
              }
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
        </form>
      </Stack>
    </Modal>
  );
};

export default AddOrganization;
