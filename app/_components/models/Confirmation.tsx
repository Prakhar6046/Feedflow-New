import {
  Box,
  Button,
  IconButton,
  Modal,
  Stack,
  Typography,
} from "@mui/material";
import React from "react";
import { Close as CloseIcon } from "@mui/icons-material"; // Use Material-UI's Close icon directly

// import { CloseIcon } from "../theme/overrides/CustomIcons";
interface InputTypes {
  id: Number;
  fishFarm: String;
  productionUnit: String;
  biomass: String;
  count: String;
  meanWeight: String;
  meanLength: String;
  field?: String;
  stockingDensityNM?: String;
  stockingLevel?: String;
  stockingDensityKG?: String;
  batchNumber: String;
}
interface Props {
  setOpen: (open: boolean) => void;
  open: boolean;
  remove: any;
  watchedFields: InputTypes[];
  selectedProductionFishaFarmId: String;
  setIsStockDeleted: (val: boolean) => void;
}
const Confirmation = ({
  open,
  setOpen,
  remove,
  watchedFields,
  selectedProductionFishaFarmId,
  setIsStockDeleted,
}: Props) => {
  const handleClose = () => {
    setOpen(false);
  };
  const handleDelete = () => {
    watchedFields.map((field, i) => {
      if (i !== 0 && field.fishFarm === selectedProductionFishaFarmId) {
        remove(field.fishFarm);
      }
    });
    setOpen(false);
    setIsStockDeleted(true);
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
        mx={"auto"}
        height={"fit-content"}
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50%)",
          width: {
            md: "fit-content",
            sm: "70%",
            xs: "90%",
          },
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
                textAlign={"center"}
                sx={{
                  fontSize: {
                    md: "20px",
                    sm: "18px",
                    xs: "16px",
                  },
                }}
              >
                Are you sure you want to delete the stock?
              </Typography>

              <Typography
                variant="body1"
                fontWeight={600}
                textAlign={"center"}
                sx={{
                  fontSize: {
                    md: "16px",
                    xs: "14px",
                  },
                }}
              >
                The related field with stock will also be deleted.
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
                  onClick={handleDelete}
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
