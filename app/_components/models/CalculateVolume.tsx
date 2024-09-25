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
import { useState } from "react";

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
  setCalculatedValue: (val: number) => void;
  length: number;
  width: number;
  depth: number;
  radius: number;
  area: number;
  heigth: number;
  calculatedValue: number;
  setLength: (val: number) => void;
  setWidth: (val: number) => void;
  setDepth: (val: number) => void;
  setRadius: (val: number) => void;
  setArea: (val: number) => void;
  setHeigth: (val: number) => void;
}

const CalculateVolume: React.FC<Props> = ({
  setOpen,
  open,
  selectedUnit,
  setCalculatedValue,
  area,
  depth,
  heigth,
  length,
  radius,
  setArea,
  setDepth,
  setHeigth,
  setLength,
  setRadius,
  setWidth,
  width,
  calculatedValue,
}) => {
  const handleClose = () => setOpen(false);
  const handleCalculate = () => {
    let output;
    if (selectedUnit?.name === "Rectangular Tank" && length && width && depth) {
      output = length * width * depth;
      //   console.log(l * w * d);
    } else if (selectedUnit?.name === "Earthen Pond" && area && depth) {
      output = area * depth;
      //   console.log(a * d);
    } else if (selectedUnit?.name === "Raceway" && length && width && depth) {
      output = length * width * depth;
      //   console.log(l * w * d);
    } else if (selectedUnit?.name === "Cage" && length && width && heigth) {
      output = length * width * heigth;
      //   console.log(l * w * h);
    } else if (selectedUnit?.name === "Hapa" && length && width && heigth) {
      output = length * width * heigth;
      // console.log(l * w * h);
    } else if (selectedUnit?.name === "Circular Tank" && radius && depth) {
      output = 3.14159 * radius * 2 * depth;
      //   console.log(3.14159 * r * 2 * d);
    } else if (
      selectedUnit?.name === "D-end Tank" &&
      radius &&
      length &&
      width &&
      depth
    ) {
      output = (2 * 3.14159 * radius * 2 + (length - radius) * width) * depth;
      //   console.log((2 * 3.14159 * r * 2 + (l - r) * w) * d);
    } else {
    }
    setCalculatedValue(Number(output));
    // setOpen(false);
  };
  console.log(calculatedValue);

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
        {selectedUnit?.name}
        {selectedUnit?.formula}
        {selectedUnit?.name === "Rectangular Tank" ? (
          <Box padding={3}>
            <TextField
              label="Length"
              variant="outlined"
              fullWidth
              type="number"
              className="form-input"
              sx={{
                marginBottom: 2,
              }}
              value={length}
              onChange={(e) => setLength(Number(e.target.value))}
            />
            <TextField
              label="Width"
              variant="outlined"
              fullWidth
              type="text"
              className="form-input"
              sx={{
                marginBottom: 2,
              }}
              value={width}
              onChange={(e) => setWidth(Number(e.target.value))}
            />{" "}
            <TextField
              label="Depth"
              variant="outlined"
              fullWidth
              type="text"
              className="form-input"
              sx={{
                marginBottom: 2,
              }}
              value={depth}
              onChange={(e) => setDepth(Number(e.target.value))}
            />
          </Box>
        ) : selectedUnit?.name === "Earthen Pond" ? (
          <Box padding={3}>
            <TextField
              label="Surface area"
              variant="outlined"
              fullWidth
              type="text"
              className="form-input"
              sx={{
                marginBottom: 2,
              }}
              value={area}
              onChange={(e) => setArea(Number(e.target.value))}
            />

            <TextField
              label="Depth"
              variant="outlined"
              fullWidth
              type="text"
              className="form-input"
              sx={{
                marginBottom: 2,
              }}
              value={depth}
              onChange={(e) => setDepth(Number(e.target.value))}
            />
          </Box>
        ) : selectedUnit?.name === "Raceway" ? (
          <Box padding={3}>
            <TextField
              label="Length"
              variant="outlined"
              fullWidth
              type="text"
              className="form-input"
              sx={{
                marginBottom: 2,
              }}
              value={length}
              onChange={(e) => setLength(Number(e.target.value))}
            />
            <TextField
              label="Width"
              variant="outlined"
              fullWidth
              type="text"
              className="form-input"
              sx={{
                marginBottom: 2,
              }}
              value={width}
              onChange={(e) => setWidth(Number(e.target.value))}
            />
            <TextField
              label="Depth"
              variant="outlined"
              fullWidth
              type="text"
              className="form-input"
              sx={{
                marginBottom: 2,
              }}
              value={depth}
              onChange={(e) => setDepth(Number(e.target.value))}
            />
          </Box>
        ) : selectedUnit?.name === "Cage" ? (
          <Box padding={3}>
            <TextField
              label="Length"
              variant="outlined"
              fullWidth
              type="text"
              className="form-input"
              sx={{
                marginBottom: 2,
              }}
              value={length}
              onChange={(e) => setLength(Number(e.target.value))}
            />
            <TextField
              label="Width"
              variant="outlined"
              fullWidth
              type="text"
              className="form-input"
              sx={{
                marginBottom: 2,
              }}
              value={width}
              onChange={(e) => setWidth(Number(e.target.value))}
            />
            <TextField
              label="Height"
              variant="outlined"
              fullWidth
              type="text"
              className="form-input"
              sx={{
                marginBottom: 2,
              }}
              value={heigth}
              onChange={(e) => setHeigth(Number(e.target.value))}
            />
          </Box>
        ) : selectedUnit?.name === "Hapa" ? (
          <Box padding={3}>
            <TextField
              label="Length"
              variant="outlined"
              fullWidth
              type="text"
              className="form-input"
              sx={{
                marginBottom: 2,
              }}
              value={length}
              onChange={(e) => setLength(Number(e.target.value))}
            />
            <TextField
              label="Width"
              variant="outlined"
              fullWidth
              type="text"
              className="form-input"
              sx={{
                marginBottom: 2,
              }}
              value={width}
              onChange={(e) => setWidth(Number(e.target.value))}
            />
            <TextField
              label="Height"
              variant="outlined"
              fullWidth
              type="text"
              className="form-input"
              sx={{
                marginBottom: 2,
              }}
              value={heigth}
              onChange={(e) => setHeigth(Number(e.target.value))}
            />
          </Box>
        ) : selectedUnit?.name === "Circular Tank" ? (
          <Box padding={3}>
            <TextField
              label="Radius"
              variant="outlined"
              fullWidth
              type="text"
              className="form-input"
              sx={{
                marginBottom: 2,
              }}
              value={radius}
              onChange={(e) => setRadius(Number(e.target.value))}
            />

            <TextField
              label="Depth"
              variant="outlined"
              fullWidth
              type="text"
              className="form-input"
              sx={{
                marginBottom: 2,
              }}
              value={depth}
              onChange={(e) => setDepth(Number(e.target.value))}
            />
          </Box>
        ) : (
          <Box padding={3}>
            <TextField
              label="Radius"
              variant="outlined"
              fullWidth
              type="text"
              className="form-input"
              sx={{
                marginBottom: 2,
              }}
              value={radius}
              onChange={(e) => setRadius(Number(e.target.value))}
            />
            <TextField
              label="Length"
              variant="outlined"
              fullWidth
              type="text"
              className="form-input"
              sx={{
                marginBottom: 2,
              }}
              value={length}
              onChange={(e) => setLength(Number(e.target.value))}
            />
            <TextField
              label="Width"
              variant="outlined"
              fullWidth
              type="text"
              className="form-input"
              sx={{
                marginBottom: 2,
              }}
              value={width}
              onChange={(e) => setWidth(Number(e.target.value))}
            />
            <TextField
              label="Depth"
              variant="outlined"
              fullWidth
              type="text"
              className="form-input"
              sx={{
                marginBottom: 2,
              }}
              value={depth}
              onChange={(e) => setDepth(Number(e.target.value))}
            />
          </Box>
        )}
        {calculatedValue}
        <Box padding={3}>
          <Button
            type="button"
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
            onClick={handleCalculate}
          >
            Calculate
          </Button>
        </Box>
      </Stack>
    </Modal>
  );
};

export default CalculateVolume;
