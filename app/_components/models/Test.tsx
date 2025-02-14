import {
  Box,
  Button,
  Modal,
  Stack,
  TextField,
  Grid,
  Typography,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
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
}

interface FormInputs {
  name: string;
  email: string;
  contactPerson: string;
  contactNumber: string;
  organisationCode: string;
}

const Test: React.FC<Props> = ({ setOpen, open }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormInputs>();

  const handleClose = () => setOpen(false);

  // const onSubmit: SubmitHandler<FormInputs> = async (data) => {
  //   if (data.email) {
  //     const response = await fetch("/api/add-organisation", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(data),
  //     });

  //     const responseData = await response.json();
  //     toast.success(responseData.message);

  //     if (responseData.status) {
  //       handleClose();
  //       reset();
  //     }
  //   }
  // };

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
            Select Units
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
        <Box>
          <Grid
            container
            sx={{
              padding: "20px",
            }}
          >
            <Grid item xs={3}>
              <FormControl>
                <RadioGroup
                  aria-labelledby="demo-radio-buttons-group-label"
                  value={"fish"}
                  name="radio-buttons-group"
                  //    onChange={(e) => {
                  //      handleTableView(e.target.value);
                  //    }}
                  className="ic-radio"
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    flexWrap: "nowrap",
                  }}
                >
                  <FormControlLabel
                    value="fish"
                    control={<Radio />}
                    label="F1"
                    className="input-btn"
                  />
                </RadioGroup>
              </FormControl>
            </Grid>
            <Grid item xs={3}>
              <FormControl>
                <RadioGroup
                  aria-labelledby="demo-radio-buttons-group-label"
                  value={"fish"}
                  name="radio-buttons-group"
                  //    onChange={(e) => {
                  //      handleTableView(e.target.value);
                  //    }}
                  className="ic-radio"
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    flexWrap: "nowrap",
                  }}
                >
                  <FormControlLabel
                    value="fish"
                    control={<Radio />}
                    label="F2"
                    className="input-btn"
                  />
                </RadioGroup>
              </FormControl>
            </Grid>
            <Grid item xs={3}>
              <FormControl>
                <RadioGroup
                  aria-labelledby="demo-radio-buttons-group-label"
                  value={"fish"}
                  name="radio-buttons-group"
                  //    onChange={(e) => {
                  //      handleTableView(e.target.value);
                  //    }}
                  className="ic-radio"
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    flexWrap: "nowrap",
                  }}
                >
                  <FormControlLabel
                    value="fish"
                    control={<Radio />}
                    label="F3"
                    className="input-btn"
                  />
                </RadioGroup>
              </FormControl>
            </Grid>
            <Grid item xs={3}>
              <FormControl>
                <RadioGroup
                  aria-labelledby="demo-radio-buttons-group-label"
                  value={"fish"}
                  name="radio-buttons-group"
                  //    onChange={(e) => {
                  //      handleTableView(e.target.value);
                  //    }}
                  className="ic-radio"
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    flexWrap: "nowrap",
                  }}
                >
                  <FormControlLabel
                    value="fish"
                    control={<Radio />}
                    label="F"
                    className="input-btn"
                  />
                </RadioGroup>
              </FormControl>
            </Grid>
            <Grid item xs={3}>
              <FormControl>
                <RadioGroup
                  aria-labelledby="demo-radio-buttons-group-label"
                  value={"fish"}
                  name="radio-buttons-group"
                  //    onChange={(e) => {
                  //      handleTableView(e.target.value);
                  //    }}
                  className="ic-radio"
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    flexWrap: "nowrap",
                  }}
                >
                  <FormControlLabel
                    value="fish"
                    control={<Radio />}
                    label="F3"
                    className="input-btn"
                  />
                </RadioGroup>
              </FormControl>
            </Grid>
            <Grid item xs={3}>
              <FormControl>
                <RadioGroup
                  aria-labelledby="demo-radio-buttons-group-label"
                  value={"fish"}
                  name="radio-buttons-group"
                  //    onChange={(e) => {
                  //      handleTableView(e.target.value);
                  //    }}
                  className="ic-radio"
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    flexWrap: "nowrap",
                  }}
                >
                  <FormControlLabel
                    value="fish"
                    control={<Radio />}
                    label="Fish"
                    className="input-btn"
                  />
                </RadioGroup>
              </FormControl>
            </Grid>
            <Grid item xs={3}>
              <FormControl>
                <RadioGroup
                  aria-labelledby="demo-radio-buttons-group-label"
                  value={"fish"}
                  name="radio-buttons-group"
                  //    onChange={(e) => {
                  //      handleTableView(e.target.value);
                  //    }}
                  className="ic-radio"
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    flexWrap: "nowrap",
                  }}
                >
                  <FormControlLabel
                    value="fish"
                    control={<Radio />}
                    label="Fish"
                    className="input-btn"
                  />
                </RadioGroup>
              </FormControl>
            </Grid>
            <Grid item xs={3}>
              <FormControl>
                <RadioGroup
                  aria-labelledby="demo-radio-buttons-group-label"
                  value={"fish"}
                  name="radio-buttons-group"
                  //    onChange={(e) => {
                  //      handleTableView(e.target.value);
                  //    }}
                  className="ic-radio"
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    flexWrap: "nowrap",
                  }}
                >
                  <FormControlLabel
                    value="fish"
                    control={<Radio />}
                    label="Fish"
                    className="input-btn"
                  />
                </RadioGroup>
              </FormControl>
            </Grid>
            <Grid item xs={3}>
              <FormControl>
                <RadioGroup
                  aria-labelledby="demo-radio-buttons-group-label"
                  value={"fish"}
                  name="radio-buttons-group"
                  //    onChange={(e) => {
                  //      handleTableView(e.target.value);
                  //    }}
                  className="ic-radio"
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    flexWrap: "nowrap",
                  }}
                >
                  <FormControlLabel
                    value="fish"
                    control={<Radio />}
                    label="F"
                    className="input-btn"
                  />
                </RadioGroup>
              </FormControl>
            </Grid>
          </Grid>
          <Box sx={{ display: "flex", justifyContent:"end", gap:"10px", margin:"20px" }}>
            <Button
              sx={{
                background: "#06A19B",
                fontWeight: "bold",
                color: "white",
                padding: "8px 20px",
                width: "fit-content",
                textTransform: "capitalize",
                borderRadius: "8px",
              }}
            >
              See all units
            </Button>
            <Button
              sx={{
                border: " 2px solid #06A19B",
                fontWeight: "bold",
                color: "#06A19B",
                padding: "8px 20px",
                width: "fit-content",
                textTransform: "capitalize",
                borderRadius: "8px",
              }}
            >
              Preview
            </Button>
            <Button
              sx={{
                background: "#06A19B",
                fontWeight: "bold",
                color: "white",
                padding: "8px 20px",
                width: "fit-content",
                textTransform: "capitalize",
                borderRadius: "8px",
              }}
            >
              Cancel
            </Button>
           
          </Box>
        </Box>
      </Stack>
    </Modal>
  );
};

export default Test;
