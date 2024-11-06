import {
  Box,
  Button,
  IconButton,
  Modal,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import Image from "next/image";
import closeIcon from "@/public/static/img/icons/ic-close.svg";
import { useForm, SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { CalculateType, UnitsTypes } from "@/app/_typeModels/Farm";

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
  selectedUnit: UnitsTypes | undefined;
  setCalculatedValue: (val: CalculateType) => void;
  length: string | undefined;
  width: string | undefined;
  depth: string | undefined;
  radius: string | undefined;
  area: string | undefined;
  heigth: string | undefined;
  calculatedValue: CalculateType | undefined;
  setLength: (val: string) => void;
  setWidth: (val: string) => void;
  setDepth: (val: string) => void;
  setRadius: (val: string) => void;
  setArea: (val: string) => void;
  setHeigth: (val: string) => void;
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
  const handleClose = () => {
    setOpen(false);
    setWidthError(false);
    setLengthError(false);
    setDepthError(false);
    setAreaError(false);
    setHeigthError(false);
    setRadiusError(false);
  };
  const [lengthError, setLengthError] = useState(false);
  const [widthError, setWidthError] = useState(false);
  const [depthError, setDepthError] = useState(false);
  const [areaError, setAreaError] = useState(false);
  const [heigthError, setHeigthError] = useState(false);
  const [radiusError, setRadiusError] = useState(false);
  const handleCalculate = () => {
    let output;
    if (
      selectedUnit?.name === "Rectangular Tank" &&
      Number(length) &&
      Number(width) &&
      Number(depth)
    ) {
      output = Number(length) * Number(width) * Number(depth);
    } else if (
      selectedUnit?.name === "Earthen Pond" &&
      Number(area) &&
      Number(depth)
    ) {
      output = Number(area) * Number(depth);
    } else if (
      selectedUnit?.name === "Raceway" &&
      Number(length) &&
      Number(width) &&
      Number(depth)
    ) {
      output = Number(length) * Number(width) * Number(depth);
    } else if (
      selectedUnit?.name === "Cage" &&
      Number(length) &&
      Number(width) &&
      Number(heigth)
    ) {
      output = Number(length) * Number(width) * Number(heigth);
    } else if (
      selectedUnit?.name === "Hapa" &&
      Number(length) &&
      Number(width) &&
      Number(heigth)
    ) {
      output = Number(length) * Number(width) * Number(heigth);
    } else if (
      selectedUnit?.name === "Circular Tank" &&
      Number(radius) &&
      Number(depth)
    ) {
      output = 3.14159 * Number(radius) * 2 * Number(depth);
    } else if (
      selectedUnit?.name === "D-end Tank" &&
      Number(radius) &&
      Number(length) &&
      Number(width) &&
      Number(depth)
    ) {
      output =
        (2 * 3.14159 * Number(radius) * 2 +
          (Number(length) - Number(radius)) * Number(Number(width))) *
        Number(depth);
    } else {
    }
    if (selectedUnit?.id) {
      setCalculatedValue({ output: Number(output), id: selectedUnit.id });
    }
    setOpen(false);
  };
  const handleBlur = (field: any, setError: any) => {
    setError(field === "");
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
        <Box
          px={3}
          pt={2}
          display={"flex"}
          alignItems={"center"}
          gap={1}
          justifyContent={"start"}
        >
          <Typography variant="body2" color="black" fontWeight={500}>
            {selectedUnit?.name} Formula
          </Typography>
          <Typography variant="body2" color="#555555">
            = &nbsp;
            {selectedUnit?.formula}
          </Typography>
        </Box>
        {selectedUnit?.name === "Rectangular Tank" ? (
          <Box padding={3} display={"flex"} alignItems={"center"} gap={1}>
            <Box position={"relative"}>
              <TextField
                label="Length *"
                variant="outlined"
                fullWidth
                type="text"
                className="form-input"
                sx={{
                  marginBottom: 2,
                  width: "100%",
                }}
                value={length}
                onChange={(e) => {
                  const value = e.target.value;
                  // Allow only numbers with decimals
                  const regex = /^\d*\.?\d*$/;
                  if (regex.test(value)) {
                    setLength(value); // Keep it as string to handle the decimal point
                  }
                }}
                onBlur={() => handleBlur(length, setLengthError)}
                error={lengthError}
                helperText={lengthError ? "This field is required" : ""}
              />
              <Typography
                variant="body2"
                color="#555555AC"
                sx={{
                  position: "absolute",
                  right: 6,
                  top: "37%",
                  transform: "translate(-6px, -50%)",
                  backgroundColor: "#fff",
                  height: 30,
                  display: "grid",
                  placeItems: "center",
                  zIndex: 1,
                  pl: 1,
                }}
              >
                m
              </Typography>
            </Box>

            <Box position={"relative"}>
              <TextField
                label="Width *"
                variant="outlined"
                fullWidth
                type="text"
                className="form-input"
                sx={{
                  marginBottom: 2,
                }}
                value={width}
                onChange={(e) => {
                  const value = e.target.value;
                  // Allow only numbers with decimals
                  const regex = /^\d*\.?\d*$/;
                  if (regex.test(value)) {
                    setWidth(value); // Keep it as string to handle the decimal point
                  }
                }}
                onBlur={() => handleBlur(width, setWidthError)}
                error={widthError}
                helperText={widthError ? "This field is required" : ""}
              />
              <Typography
                variant="body2"
                color="#555555AC"
                sx={{
                  position: "absolute",
                  right: 6,
                  top: "37%",
                  transform: "translate(-6px, -50%)",
                  backgroundColor: "#fff",
                  height: 30,
                  display: "grid",
                  placeItems: "center",
                  zIndex: 1,
                  pl: 1,
                }}
              >
                m
              </Typography>
            </Box>

            <Box position={"relative"}>
              <TextField
                label="Depth *"
                variant="outlined"
                fullWidth
                type="text"
                className="form-input"
                sx={{
                  marginBottom: 2,
                }}
                value={depth}
                onChange={(e) => {
                  const value = e.target.value;
                  // Allow only numbers with decimals
                  const regex = /^\d*\.?\d*$/;
                  if (regex.test(value)) {
                    setDepth(value); // Keep it as string to handle the decimal point
                  }
                }}
                onBlur={() => handleBlur(depth, setDepthError)}
                error={depthError}
                helperText={depthError ? "This field is required" : ""}
              />
              <Typography
                variant="body2"
                color="#555555AC"
                sx={{
                  position: "absolute",
                  right: 6,
                  top: "37%",
                  transform: "translate(-6px, -50%)",
                  backgroundColor: "#fff",
                  height: 30,
                  display: "grid",
                  placeItems: "center",
                  zIndex: 1,
                  pl: 1,
                }}
              >
                m
              </Typography>
            </Box>
          </Box>
        ) : selectedUnit?.name === "Earthen Pond" ? (
          <Box padding={3} display={"flex"} alignItems={"center"} gap={1}>
            <Box position={"relative"}>
              <TextField
                label="Surface area *"
                variant="outlined"
                fullWidth
                type="text"
                className="form-input"
                sx={{
                  marginBottom: 2,
                }}
                value={area}
                onChange={(e) => {
                  const value = e.target.value;
                  // Allow only numbers with decimals
                  const regex = /^\d*\.?\d*$/;
                  if (regex.test(value)) {
                    setArea(value); // Keep it as string to handle the decimal point
                  }
                }}
                onBlur={() => handleBlur(area, setAreaError)}
                error={areaError}
                helperText={areaError ? "This field is required" : ""}
              />
              <Typography
                variant="body2"
                color="#555555AC"
                sx={{
                  position: "absolute",
                  right: 6,
                  top: "37%",
                  transform: "translate(-6px, -50%)",
                  backgroundColor: "#fff",
                  height: 30,
                  display: "grid",
                  placeItems: "center",
                  zIndex: 1,
                  pl: 1,
                }}
              >
                m
              </Typography>
            </Box>

            <Box position={"relative"}>
              <TextField
                label="Depth *"
                variant="outlined"
                fullWidth
                type="text"
                className="form-input"
                sx={{
                  marginBottom: 2,
                }}
                value={depth}
                onChange={(e) => {
                  const value = e.target.value;
                  // Allow only numbers with decimals
                  const regex = /^\d*\.?\d*$/;
                  if (regex.test(value)) {
                    setDepth(value); // Keep it as string to handle the decimal point
                  }
                }}
                onBlur={() => handleBlur(depth, setDepthError)}
                error={depthError}
                helperText={depthError ? "This field is required" : ""}
              />
              <Typography
                variant="body2"
                color="#555555AC"
                sx={{
                  position: "absolute",
                  right: 6,
                  top: "37%",
                  transform: "translate(-6px, -50%)",
                  backgroundColor: "#fff",
                  height: 30,
                  display: "grid",
                  placeItems: "center",
                  zIndex: 1,
                  pl: 1,
                }}
              >
                m
              </Typography>
            </Box>
          </Box>
        ) : selectedUnit?.name === "Raceway" ? (
          <Box padding={3} display={"flex"} alignItems={"center"} gap={1}>
            <Box position={"relative"}>
              <TextField
                label="Length *"
                variant="outlined"
                fullWidth
                type="text"
                className="form-input"
                sx={{
                  marginBottom: 2,
                }}
                value={length}
                onChange={(e) => {
                  const value = e.target.value;
                  // Allow only numbers with decimals
                  const regex = /^\d*\.?\d*$/;
                  if (regex.test(value)) {
                    setLength(value); // Keep it as string to handle the decimal point
                  }
                }}
                onBlur={() => handleBlur(length, setLengthError)}
                error={lengthError}
                helperText={lengthError ? "This field is required" : ""}
              />
              <Typography
                variant="body2"
                color="#555555AC"
                sx={{
                  position: "absolute",
                  right: 6,
                  top: "37%",
                  transform: "translate(-6px, -50%)",
                  backgroundColor: "#fff",
                  height: 30,
                  display: "grid",
                  placeItems: "center",
                  zIndex: 1,
                  pl: 1,
                }}
              >
                m
              </Typography>
            </Box>

            <Box position={"relative"}>
              <TextField
                label="Width *"
                variant="outlined"
                fullWidth
                type="text"
                className="form-input"
                sx={{
                  marginBottom: 2,
                }}
                value={width}
                onChange={(e) => {
                  const value = e.target.value;
                  // Allow only numbers with decimals
                  const regex = /^\d*\.?\d*$/;
                  if (regex.test(value)) {
                    setWidth(value); // Keep it as string to handle the decimal point
                  }
                }}
                onBlur={() => handleBlur(width, setWidthError)}
                error={widthError}
                helperText={widthError ? "This field is required" : ""}
              />
              <Typography
                variant="body2"
                color="#555555AC"
                sx={{
                  position: "absolute",
                  right: 6,
                  top: "37%",
                  transform: "translate(-6px, -50%)",
                  backgroundColor: "#fff",
                  height: 30,
                  display: "grid",
                  placeItems: "center",
                  zIndex: 1,
                  pl: 1,
                }}
              >
                m
              </Typography>
            </Box>

            <Box position={"relative"}>
              <TextField
                label="Depth *"
                variant="outlined"
                fullWidth
                type="text"
                className="form-input"
                sx={{
                  marginBottom: 2,
                }}
                value={depth}
                onChange={(e) => {
                  const value = e.target.value;
                  // Allow only numbers with decimals
                  const regex = /^\d*\.?\d*$/;
                  if (regex.test(value)) {
                    setDepth(value); // Keep it as string to handle the decimal point
                  }
                }}
                onBlur={() => handleBlur(depth, setDepthError)}
                error={depthError}
                helperText={depthError ? "This field is required" : ""}
              />
              <Typography
                variant="body2"
                color="#555555AC"
                sx={{
                  position: "absolute",
                  right: 6,
                  top: "37%",
                  transform: "translate(-6px, -50%)",
                  backgroundColor: "#fff",
                  height: 30,
                  display: "grid",
                  placeItems: "center",
                  zIndex: 1,
                  pl: 1,
                }}
              >
                m
              </Typography>
            </Box>
          </Box>
        ) : selectedUnit?.name === "Cage" ? (
          <Box padding={3} display={"flex"} alignItems={"center"} gap={1}>
            <Box position={"relative"}>
              <TextField
                label="Length *"
                variant="outlined"
                fullWidth
                type="text"
                className="form-input"
                sx={{
                  marginBottom: 2,
                }}
                value={length}
                onChange={(e) => {
                  const value = e.target.value;
                  // Allow only numbers with decimals
                  const regex = /^\d*\.?\d*$/;
                  if (regex.test(value)) {
                    setLength(value); // Keep it as string to handle the decimal point
                  }
                }}
                onBlur={() => handleBlur(length, setLengthError)}
                error={lengthError}
                helperText={lengthError ? "This field is required" : ""}
              />
              <Typography
                variant="body2"
                color="#555555AC"
                sx={{
                  position: "absolute",
                  right: 6,
                  top: "37%",
                  transform: "translate(-6px, -50%)",
                  backgroundColor: "#fff",
                  height: 30,
                  display: "grid",
                  placeItems: "center",
                  zIndex: 1,
                  pl: 1,
                }}
              >
                m
              </Typography>
            </Box>

            <Box position={"relative"}>
              <TextField
                label="Width *"
                variant="outlined"
                fullWidth
                type="text"
                className="form-input"
                sx={{
                  marginBottom: 2,
                }}
                value={width}
                onChange={(e) => {
                  const value = e.target.value;
                  // Allow only numbers with decimals
                  const regex = /^\d*\.?\d*$/;
                  if (regex.test(value)) {
                    setWidth(value); // Keep it as string to handle the decimal point
                  }
                }}
                onBlur={() => handleBlur(width, setWidthError)}
                error={widthError}
                helperText={widthError ? "This field is required" : ""}
              />

              <Typography
                variant="body2"
                color="#555555AC"
                sx={{
                  position: "absolute",
                  right: 6,
                  top: "37%",
                  transform: "translate(-6px, -50%)",
                  backgroundColor: "#fff",
                  height: 30,
                  display: "grid",
                  placeItems: "center",
                  zIndex: 1,
                  pl: 1,
                }}
              >
                m
              </Typography>
            </Box>

            <Box position={"relative"}>
              <TextField
                label="Height *"
                variant="outlined"
                fullWidth
                type="text"
                className="form-input"
                sx={{
                  marginBottom: 2,
                }}
                value={heigth}
                onChange={(e) => {
                  const value = e.target.value;
                  // Allow only numbers with decimals
                  const regex = /^\d*\.?\d*$/;
                  if (regex.test(value)) {
                    setHeigth(value); // Keep it as string to handle the decimal point
                  }
                }}
                onBlur={() => handleBlur(heigth, setHeigthError)}
                error={heigthError}
                helperText={heigthError ? "This field is required" : ""}
              />
              <Typography
                variant="body2"
                color="#555555AC"
                sx={{
                  position: "absolute",
                  right: 6,
                  top: "35%",
                  transform: "translate(-6px, -50%)",
                  backgroundColor: "#fff",
                  height: 30,
                  display: "grid",
                  placeItems: "center",
                  zIndex: 1,
                  pl: 1,
                }}
              >
                m
              </Typography>
            </Box>
          </Box>
        ) : selectedUnit?.name === "Hapa" ? (
          <Box padding={3} display={"flex"} alignItems={"center"} gap={1}>
            <Box position={"relative"}>
              <TextField
                label="Length *"
                variant="outlined"
                fullWidth
                type="text"
                className="form-input"
                sx={{
                  marginBottom: 2,
                }}
                value={length}
                onChange={(e) => {
                  const value = e.target.value;
                  // Allow only numbers with decimals
                  const regex = /^\d*\.?\d*$/;
                  if (regex.test(value)) {
                    setLength(value); // Keep it as string to handle the decimal point
                  }
                }}
                onBlur={() => handleBlur(length, setLengthError)}
                error={lengthError}
                helperText={lengthError ? "This field is required" : ""}
              />
              <Typography
                variant="body2"
                color="#555555AC"
                sx={{
                  position: "absolute",
                  right: 6,
                  top: "37%",
                  transform: "translate(-6px, -50%)",
                  backgroundColor: "#fff",
                  height: 30,
                  display: "grid",
                  placeItems: "center",
                  zIndex: 1,
                  pl: 1,
                }}
              >
                m
              </Typography>
            </Box>

            <Box position={"relative"}>
              <TextField
                label="Width *"
                variant="outlined"
                fullWidth
                type="text"
                className="form-input"
                sx={{
                  marginBottom: 2,
                }}
                value={width}
                onChange={(e) => {
                  const value = e.target.value;
                  // Allow only numbers with decimals
                  const regex = /^\d*\.?\d*$/;
                  if (regex.test(value)) {
                    setWidth(value); // Keep it as string to handle the decimal point
                  }
                }}
                onBlur={() => handleBlur(width, setWidthError)}
                error={widthError}
                helperText={widthError ? "This field is required" : ""}
              />
              <Typography
                variant="body2"
                color="#555555AC"
                sx={{
                  position: "absolute",
                  right: 6,
                  top: "37%",
                  transform: "translate(-6px, -50%)",
                  backgroundColor: "#fff",
                  height: 30,
                  display: "grid",
                  placeItems: "center",
                  zIndex: 1,
                  pl: 1,
                }}
              >
                m
              </Typography>
            </Box>

            <Box position={"relative"}>
              <TextField
                label="Height *"
                variant="outlined"
                fullWidth
                type="text"
                className="form-input"
                sx={{
                  marginBottom: 2,
                }}
                value={heigth}
                onChange={(e) => {
                  const value = e.target.value;
                  // Allow only numbers with decimals
                  const regex = /^\d*\.?\d*$/;
                  if (regex.test(value)) {
                    setHeigth(value); // Keep it as string to handle the decimal point
                  }
                }}
                onBlur={() => handleBlur(heigth, setHeigthError)}
                error={heigthError}
                helperText={heigthError ? "This field is required" : ""}
              />
              <Typography
                variant="body2"
                color="#555555AC"
                sx={{
                  position: "absolute",
                  right: 6,
                  top: "37%",
                  transform: "translate(-6px, -50%)",
                  backgroundColor: "#fff",
                  height: 30,
                  display: "grid",
                  placeItems: "center",
                  zIndex: 1,
                  pl: 1,
                }}
              >
                m
              </Typography>
            </Box>
          </Box>
        ) : selectedUnit?.name === "Circular Tank" ? (
          <Box padding={3} display={"flex"} alignItems={"center"} gap={1}>
            <Box position={"relative"}>
              <TextField
                label="Radius *"
                variant="outlined"
                fullWidth
                type="text"
                className="form-input"
                sx={{
                  marginBottom: 2,
                }}
                value={radius}
                onChange={(e) => {
                  const value = e.target.value;
                  // Allow only numbers with decimals
                  const regex = /^\d*\.?\d*$/;
                  if (regex.test(value)) {
                    setRadius(value); // Keep it as string to handle the decimal point
                  }
                }}
                onBlur={() => handleBlur(radius, setRadiusError)}
                error={radiusError}
                helperText={radiusError ? "This field is required" : ""}
              />
              <Typography
                variant="body2"
                color="#555555AC"
                sx={{
                  position: "absolute",
                  right: 6,
                  top: "37%",
                  transform: "translate(-6px, -50%)",
                  backgroundColor: "#fff",
                  height: 30,
                  display: "grid",
                  placeItems: "center",
                  zIndex: 1,
                  pl: 1,
                }}
              >
                m
              </Typography>
            </Box>

            <Box position={"relative"}>
              <TextField
                label="Depth *"
                variant="outlined"
                fullWidth
                type="text"
                className="form-input"
                sx={{
                  marginBottom: 2,
                }}
                value={depth}
                onChange={(e) => {
                  const value = e.target.value;
                  // Allow only numbers with decimals
                  const regex = /^\d*\.?\d*$/;
                  if (regex.test(value)) {
                    setDepth(value); // Keep it as string to handle the decimal point
                  }
                }}
                onBlur={() => handleBlur(depth, setDepthError)}
                error={depthError}
                helperText={depthError ? "This field is required" : ""}
              />
              <Typography
                variant="body2"
                color="#555555AC"
                sx={{
                  position: "absolute",
                  right: 6,
                  top: "37%",
                  transform: "translate(-6px, -50%)",
                  backgroundColor: "#fff",
                  height: 30,
                  display: "grid",
                  placeItems: "center",
                  zIndex: 1,
                  pl: 1,
                }}
              >
                m
              </Typography>
            </Box>
          </Box>
        ) : (
          <Box padding={3} display={"flex"} alignItems={"center"} gap={1}>
            <Box position={"relative"}>
              <TextField
                label="Radius *"
                variant="outlined"
                fullWidth
                type="text"
                className="form-input"
                sx={{
                  marginBottom: 2,
                }}
                value={radius}
                onChange={(e) => {
                  const value = e.target.value;
                  // Allow only numbers with decimals
                  const regex = /^\d*\.?\d*$/;
                  if (regex.test(value)) {
                    setRadius(value); // Keep it as string to handle the decimal point
                  }
                }}
                onBlur={() => handleBlur(radius, setRadiusError)}
                error={radiusError}
                helperText={radiusError ? "This field is required" : ""}
              />
              <Typography
                variant="body2"
                color="#555555AC"
                sx={{
                  position: "absolute",
                  right: 6,
                  top: "37%",
                  transform: "translate(-6px, -50%)",
                  backgroundColor: "#fff",
                  height: 30,
                  display: "grid",
                  placeItems: "center",
                  zIndex: 1,
                  pl: 1,
                }}
              >
                m
              </Typography>
            </Box>
            <Box position={"relative"}>
              <TextField
                label="Length *"
                variant="outlined"
                fullWidth
                type="text"
                className="form-input"
                sx={{
                  marginBottom: 2,
                }}
                value={length}
                onChange={(e) => {
                  const value = e.target.value;
                  // Allow only numbers with decimals
                  const regex = /^\d*\.?\d*$/;
                  if (regex.test(value)) {
                    setLength(value); // Keep it as string to handle the decimal point
                  }
                }}
                onBlur={() => handleBlur(length, setLengthError)}
                error={lengthError}
                helperText={lengthError ? "This field is required" : ""}
              />
              <Typography
                variant="body2"
                color="#555555AC"
                sx={{
                  position: "absolute",
                  right: 6,
                  top: "37%",
                  transform: "translate(-6px, -50%)",
                  backgroundColor: "#fff",
                  height: 30,
                  display: "grid",
                  placeItems: "center",
                  zIndex: 1,
                  pl: 1,
                }}
              >
                m
              </Typography>
            </Box>

            <Box position={"relative"}>
              <TextField
                label="Width *"
                variant="outlined"
                fullWidth
                type="text"
                className="form-input"
                sx={{
                  marginBottom: 2,
                }}
                value={width}
                onChange={(e) => {
                  const value = e.target.value;
                  // Allow only numbers with decimals
                  const regex = /^\d*\.?\d*$/;
                  if (regex.test(value)) {
                    setWidth(value); // Keep it as string to handle the decimal point
                  }
                }}
                onBlur={() => handleBlur(width, setWidthError)}
                error={widthError}
                helperText={widthError ? "This field is required" : ""}
              />
              <Typography
                variant="body2"
                color="#555555AC"
                sx={{
                  position: "absolute",
                  right: 6,
                  top: "37%",
                  transform: "translate(-6px, -50%)",
                  backgroundColor: "#fff",
                  height: 30,
                  display: "grid",
                  placeItems: "center",
                  zIndex: 1,
                  pl: 1,
                }}
              >
                m
              </Typography>
            </Box>

            <Box position={"relative"}>
              <TextField
                label="Depth *"
                variant="outlined"
                fullWidth
                type="text"
                className="form-input"
                sx={{
                  marginBottom: 2,
                }}
                value={depth}
                onChange={(e) => {
                  const value = e.target.value;
                  // Allow only numbers with decimals
                  const regex = /^\d*\.?\d*$/;
                  if (regex.test(value)) {
                    setDepth(value); // Keep it as string to handle the decimal point
                  }
                }}
                onBlur={() => handleBlur(depth, setDepthError)}
                error={depthError}
                helperText={depthError ? "This field is required" : ""}
              />
              <Typography
                variant="body2"
                color="#555555AC"
                sx={{
                  position: "absolute",
                  right: 6,
                  top: "37%",
                  transform: "translate(-6px, -50%)",
                  backgroundColor: "#fff",
                  height: 30,
                  display: "grid",
                  placeItems: "center",
                  zIndex: 1,
                  pl: 1,
                }}
              >
                m
              </Typography>
            </Box>
          </Box>
        )}
        {/* <Stack px={3} display={"flex"} justifyContent={"space-between"} direction={"row"} alignItems={"center"} gap={1}>
          <Box display={"flex"} alignItems={"center"} gap={1} justifyContent={"end"}>

            <Typography variant="body1" color="black" fontWeight={500}>
              Output
            </Typography>
            <Typography variant="body1" color="#555555">
              = &nbsp;
              {calculatedValue}
            </Typography>
          </Box>

          <Tooltip title="copy">
            <IconButton>
              <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                <path fill="#0E848E" d="M19 19H8q-.825 0-1.412-.587T6 17V3q0-.825.588-1.412T8 1h7l6 6v10q0 .825-.587 1.413T19 19M14 8V3H8v14h11V8zM4 23q-.825 0-1.412-.587T2 21V7h2v14h11v2zM8 3v5zv14z" />
              </svg>
            </IconButton>
          </Tooltip>

        </Stack> */}

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
