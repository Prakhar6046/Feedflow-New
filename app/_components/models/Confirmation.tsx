import {
  Box,
  Button,
  IconButton,
  Modal,
  Stack,
  Typography,
} from "@mui/material";
import React from "react";
import { CloseIcon } from "../theme/overrides/CustomIcons";
interface Props {
  setOpen: (open: boolean) => void;
  open: boolean;
}
const Confirmation = ({ open, setOpen }: Props) => {
  const handleClose = () => {
    setOpen(false);
  };
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="child-modal-title"
      aria-describedby="child-modal-description"
    >
      <Stack
        bgcolor={"white"}
        borderRadius={2}
        width={"50%"}
        mx={"auto"}
        height={"30%"}
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50%)",
        }}
      >
        <Box
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
          height={"fit-content"}
        >
          <Box>
            <Box display="flex" justifyContent="flex-end" padding={2}>
              <IconButton
                onClick={handleClose}
                sx={{
                  color: "inherit",
                  background: "transparent",
                  margin: "2",
                }}
              >
                <CloseIcon />
              </IconButton>
            </Box>
            <Box p={4}>
              <Typography variant="h5" fontWeight={600} textAlign={"center"}>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Debitis, reprehenderit?
              </Typography>

              <Box display={"flex"} gap={2} justifyContent={"end"} mt={5}>
                <Button
                  type="button"
                  onClick={handleClose}
                  variant="contained"
                  sx={{
                    background: "#06A19B",
                    fontWeight: 600,
                    padding: "6px 16px",
                    width: "fit-content",
                    textTransform: "capitalize",
                    borderRadius: "8px",
                    color: "#fff",
                    border: "1px solid #06A19B",
                    boxShadow: "none",
                  }}
                >
                  Cancel
                </Button>

                <Button
                  type="button"
                  // onClick={() => setOpenDialog(true)}
                  variant="contained"
                  sx={{
                    background: "#fff",
                    fontWeight: 600,
                    padding: "6px 16px",
                    width: "fit-content",
                    textTransform: "capitalize",
                    borderRadius: "8px",
                    color: "#D71818",
                    border: "1px solid #D71818",
                    boxShadow: "none",
                  }}
                >
                  Delete
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      </Stack>
    </Modal>
  );
};

export default Confirmation;
