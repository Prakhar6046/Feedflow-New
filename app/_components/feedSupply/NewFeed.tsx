import { useAppDispatch } from "@/lib/hooks";
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { NextPage } from "next";
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";

interface Props {
  setActiveStep: (val: number) => void;
  editFarm?: any;
}
interface FormInputs {
  feedIngredients: String;
  feedingGuide: String;
  productionIntensity: String;
  unit: String;
  feedingPhase: String;
  lifeStage: String;
  shelfLife: String;
  productCode: String;
  feedSupplierCode: String;
  brandCode: String;
  productNameCode: String;
  productFormatCode: String;
  animalSizeInLength: String;
  animalSizeInWeight: String;
  specie: String;
  nutritionalPurpose: String;
  nutritionalClass: String;
  particleSize: String;
  productFormat: String;
  productName: String;
  brandName: String;
  feedSupplier: String;
}
const NewFeed: NextPage<Props> = ({ setActiveStep, editFarm }) => {
  const dispatch = useAppDispatch();
  const [age, setAge] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInputs>();
  const onSubmit: SubmitHandler<FormInputs> = (data) => {
    console.log(data);
  };
  const handleChange = (event: SelectChangeEvent) => {
    setAge(event.target.value as string);
  };
  return (
    <>
      <Stack>
        <Typography
          variant="h6"
          fontWeight={700}
          sx={{
            fontSize: {
              md: 24,
              xs: 20,
            },
            marginBottom: 3,
          }}
        >
          Feed Specification
        </Typography>

        <Box>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2}>
              <Grid item md={6} xs={12}>
                <FormControl fullWidth className="form-input">
                  <InputLabel id="feed-supply-select-label1">
                    Feed Supplier
                  </InputLabel>
                  <Select
                    labelId="feed-supply-select-label1"
                    id="feed-supply-select1"
                    {...register("feedSupplier", { required: true })}
                    label="Feed Supplier"
                  >
                    <MenuItem value={10}>Ten</MenuItem>
                    <MenuItem value={20}>Twenty</MenuItem>
                    <MenuItem value={30}>Thirty</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item md={6} xs={12}>
                <TextField
                  label="Feed Supplier Code"
                  type="text"
                  className="form-input"
                  // {...register("organisationName", {
                  //     required: true,
                  // })}
                  // focused={userData?.data.name ? true : false}
                  // value={userData?.data.name}
                  sx={{
                    width: "100%",
                  }}
                />
              </Grid>

              <Grid item md={6} xs={12}>
                <TextField
                  label="Brand Name"
                  type="text"
                  className="form-input"
                  // {...register("organisationName", {
                  //     required: true,
                  // })}
                  // focused={userData?.data.name ? true : false}
                  // value={userData?.data.name}
                  sx={{
                    width: "100%",
                  }}
                />
              </Grid>

              <Grid item md={6} xs={12}>
                <TextField
                  label="Brand Code"
                  type="text"
                  className="form-input"
                  // {...register("organisationName", {
                  //     required: true,
                  // })}
                  // focused={userData?.data.name ? true : false}
                  // value={userData?.data.name}
                  sx={{
                    width: "100%",
                  }}
                />
              </Grid>

              <Grid item md={6} xs={12}>
                <TextField
                  label="Product Name"
                  type="text"
                  className="form-input"
                  // {...register("organisationName", {
                  //     required: true,
                  // })}
                  // focused={userData?.data.name ? true : false}
                  // value={userData?.data.name}
                  sx={{
                    width: "100%",
                  }}
                />
              </Grid>

              <Grid item md={6} xs={12}>
                <TextField
                  label="Product Code"
                  type="text"
                  className="form-input"
                  // {...register("organisationName", {
                  //     required: true,
                  // })}
                  // focused={userData?.data.name ? true : false}
                  // value={userData?.data.name}
                  sx={{
                    width: "100%",
                  }}
                />
              </Grid>

              <Grid item md={6} xs={12}>
                <TextField
                  label="Product Name Code"
                  type="text"
                  className="form-input"
                  // {...register("organisationName", {
                  //     required: true,
                  // })}
                  // focused={userData?.data.name ? true : false}
                  // value={userData?.data.name}
                  sx={{
                    width: "100%",
                  }}
                />
              </Grid>

              <Grid item md={6} xs={12}>
                <FormControl fullWidth className="form-input">
                  <InputLabel id="feed-supply-select-label2">
                    Product Format
                  </InputLabel>
                  <Select
                    labelId="feed-supply-select-label2"
                    id="feed-supply-select2"
                    value={age}
                    label="Product Format"
                    onChange={handleChange}
                  >
                    <MenuItem value={10}>Ten</MenuItem>
                    <MenuItem value={20}>Twenty</MenuItem>
                    <MenuItem value={30}>Thirty</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item md={6} xs={12}>
                <TextField
                  label="Product Format Code"
                  type="text"
                  className="form-input"
                  // {...register("organisationName", {
                  //     required: true,
                  // })}
                  // focused={userData?.data.name ? true : false}
                  // value={userData?.data.name}
                  sx={{
                    width: "100%",
                  }}
                />
              </Grid>

              <Grid item md={6} xs={12}>
                <Box
                  display={"flex"}
                  gap={2}
                  alignItems={"center"}
                  position={"relative"}
                >
                  <TextField
                    label="Particle Size"
                    type="text"
                    className="form-input"
                    // {...register("organisationName", {
                    //     required: true,
                    // })}
                    // focused={userData?.data.name ? true : false}
                    // value={userData?.data.name}
                    sx={{
                      width: "100%",
                    }}
                  />

                  <Typography
                    variant="body2"
                    color="#555555AC"
                    sx={{
                      position: "absolute",
                      right: 6,
                      top: "50%",
                      transform: "translate(-6px, -50%)",
                      backgroundColor: "#fff",
                      height: 30,
                      display: "grid",
                      placeItems: "center",
                      zIndex: 1,
                      pl: 1,
                    }}
                  >
                    mm
                  </Typography>
                </Box>
              </Grid>

              <Grid item md={6} xs={12}>
                <FormControl fullWidth className="form-input">
                  <InputLabel id="feed-supply-select-label3">
                    Nutritional Class
                  </InputLabel>
                  <Select
                    labelId="feed-supply-select-label3"
                    id="feed-supply-select3"
                    value={age}
                    label="Nutritional Class"
                    onChange={handleChange}
                  >
                    <MenuItem value={10}>Ten</MenuItem>
                    <MenuItem value={20}>Twenty</MenuItem>
                    <MenuItem value={30}>Thirty</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item md={6} xs={12}>
                <FormControl fullWidth className="form-input">
                  <InputLabel id="feed-supply-select-label4">
                    Nutritional Purpose
                  </InputLabel>
                  <Select
                    labelId="feed-supply-select-label4"
                    id="feed-supply-select4"
                    value={age}
                    label="Nutritional Purpose"
                    onChange={handleChange}
                  >
                    <MenuItem value={10}>Ten</MenuItem>
                    <MenuItem value={20}>Twenty</MenuItem>
                    <MenuItem value={30}>Thirty</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle1" fontWeight={500}>
                  Suitability
                </Typography>
              </Grid>

              <Grid item md={6} xs={12}>
                <FormControl fullWidth className="form-input">
                  <InputLabel id="feed-supply-select-label5">Specie</InputLabel>
                  <Select
                    labelId="feed-supply-select-label5"
                    id="feed-supply-select5"
                    value={age}
                    label="Specie"
                    onChange={handleChange}
                  >
                    <MenuItem value={10}>Ten</MenuItem>
                    <MenuItem value={20}>Twenty</MenuItem>
                    <MenuItem value={30}>Thirty</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item md={6} xs={12}>
                <Box
                  display={"flex"}
                  gap={2}
                  alignItems={"center"}
                  position={"relative"}
                >
                  <TextField
                    label="Animal Size (Length)"
                    type="text"
                    className="form-input"
                    // {...register("organisationName", {
                    //     required: true,
                    // })}
                    // focused={userData?.data.name ? true : false}
                    // value={userData?.data.name}
                    sx={{
                      width: "100%",
                    }}
                  />

                  <Typography
                    variant="body2"
                    color="#555555AC"
                    sx={{
                      position: "absolute",
                      right: 6,
                      top: "50%",
                      transform: "translate(-6px, -50%)",
                      backgroundColor: "#fff",
                      height: 30,
                      display: "grid",
                      placeItems: "center",
                      zIndex: 1,
                      pl: 1,
                    }}
                  >
                    mm
                  </Typography>
                </Box>
              </Grid>

              <Grid item md={6} xs={12}>
                <Box
                  display={"flex"}
                  gap={2}
                  alignItems={"center"}
                  position={"relative"}
                >
                  <TextField
                    label="Animal Size (Weight)"
                    type="text"
                    className="form-input"
                    // {...register("organisationName", {
                    //     required: true,
                    // })}
                    // focused={userData?.data.name ? true : false}
                    // value={userData?.data.name}
                    sx={{
                      width: "100%",
                    }}
                  />

                  <Typography
                    variant="body2"
                    color="#555555AC"
                    sx={{
                      position: "absolute",
                      right: 6,
                      top: "50%",
                      transform: "translate(-6px, -50%)",
                      backgroundColor: "#fff",
                      height: 30,
                      display: "grid",
                      placeItems: "center",
                      zIndex: 1,
                      pl: 1,
                    }}
                  >
                    g
                  </Typography>
                </Box>
              </Grid>

              <Grid item md={6} xs={12}>
                <FormControl fullWidth className="form-input">
                  <InputLabel id="feed-supply-select-label6">
                    Production Intensity
                  </InputLabel>
                  <Select
                    labelId="feed-supply-select-label6"
                    id="feed-supply-select6"
                    value={age}
                    label="Production Intensity"
                    onChange={handleChange}
                  >
                    <MenuItem value={10}>Ten</MenuItem>
                    <MenuItem value={20}>Twenty</MenuItem>
                    <MenuItem value={30}>Thirty</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item md={6} xs={12}>
                <FormControl fullWidth className="form-input">
                  <InputLabel id="feed-supply-select-label7">Unit</InputLabel>
                  <Select
                    labelId="feed-supply-select-label7"
                    id="feed-supply-select7"
                    value={age}
                    label="Unit"
                    onChange={handleChange}
                  >
                    <MenuItem value={10}>Ten</MenuItem>
                    <MenuItem value={20}>Twenty</MenuItem>
                    <MenuItem value={30}>Thirty</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item md={6} xs={12}>
                <FormControl fullWidth className="form-input">
                  <InputLabel id="feed-supply-select-label8">
                    Feeding Phase
                  </InputLabel>
                  <Select
                    labelId="feed-supply-select-label8"
                    id="feed-supply-select8"
                    value={age}
                    label="Feeding Phase"
                    onChange={handleChange}
                  >
                    <MenuItem value={10}>Ten</MenuItem>
                    <MenuItem value={20}>Twenty</MenuItem>
                    <MenuItem value={30}>Thirty</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item md={6} xs={12}>
                <FormControl fullWidth className="form-input">
                  <InputLabel id="feed-supply-select-label9">
                    Life Stage
                  </InputLabel>
                  <Select
                    labelId="feed-supply-select-label9"
                    id="feed-supply-select9"
                    value={age}
                    label="Life Stage"
                    onChange={handleChange}
                  >
                    <MenuItem value={10}>Ten</MenuItem>
                    <MenuItem value={20}>Twenty</MenuItem>
                    <MenuItem value={30}>Thirty</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item md={6} xs={12}>
                <Box
                  display={"flex"}
                  gap={2}
                  alignItems={"center"}
                  position={"relative"}
                >
                  <TextField
                    label="Shelf Live (from date of manufacturing)"
                    type="text"
                    className="form-input"
                    // {...register("organisationName", {
                    //     required: true,
                    // })}
                    // focused={userData?.data.name ? true : false}
                    // value={userData?.data.name}
                    sx={{
                      width: "100%",
                    }}
                  />

                  <Typography
                    variant="body2"
                    color="#555555AC"
                    sx={{
                      position: "absolute",
                      right: 6,
                      top: "50%",
                      transform: "translate(-6px, -50%)",
                      backgroundColor: "#fff",
                      height: 30,
                      display: "grid",
                      placeItems: "center",
                      zIndex: 1,
                      pl: 1,
                    }}
                  >
                    months
                  </Typography>
                </Box>
              </Grid>

              <Grid item lg={6} xs={12}>
                <TextField
                  label="Feed Ingredients"
                  type="text"
                  multiline
                  rows={5}
                  className="form-input"
                  sx={{
                    width: "100%",
                  }}
                />
              </Grid>

              <Grid item lg={6} xs={12}>
                <TextField
                  label="Feeding Guide"
                  type="text"
                  multiline
                  rows={5}
                  className="form-input"
                  sx={{
                    width: "100%",
                  }}
                />
              </Grid>
            </Grid>

            <Stack>
              <Typography
                variant="h6"
                fontWeight={700}
                sx={{
                  fontSize: {
                    md: 20,
                    xs: 18,
                  },
                  marginBottom: 3,
                  marginTop: 5,
                }}
              >
                Nutritional Guarantee
              </Typography>

              <Box
                sx={{
                  borderRadius: 3,
                  boxShadow: "0px 0px 16px 5px #0000001A",
                  padding: 3,
                }}
              >
                <Grid container rowSpacing={2} columnSpacing={2}>
                  <Grid
                    item
                    xl={6}
                    xs={12}
                    sx={{
                      display: "flex",
                      gap: 1.5,
                      alignItems: "center",
                      minWidth: "200px",
                      overflowX: "auto",
                      pb: 1.5,
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      fontWeight={600}
                      sx={{
                        minWidth: "14px",
                      }}
                    >
                      1.{" "}
                    </Typography>

                    <Box
                      display={"flex"}
                      gap={2}
                      alignItems={"center"}
                      position={"relative"}
                    >
                      <TextField
                        label="Moisture"
                        type="number"
                        className="form-input"
                        // {...register("organisationName", {
                        //     required: true,
                        // })}
                        // focused={userData?.data.name ? true : false}
                        // value={userData?.data.name}
                        sx={{
                          width: "100%",
                          minWidth: 190,
                        }}
                      />

                      <Typography
                        variant="body2"
                        color="#555555AC"
                        sx={{
                          position: "absolute",
                          right: 6,
                          top: "50%",
                          transform: "translate(-6px, -50%)",
                          backgroundColor: "#fff",
                          height: 30,
                          display: "grid",
                          placeItems: "center",
                          zIndex: 1,
                          pl: 1,
                        }}
                      >
                        g/kg
                      </Typography>
                    </Box>

                    <Button
                      type="button"
                      variant="contained"
                      sx={{
                        background: "#06a19b",
                        color: "#fff",
                        fontWeight: 600,
                        padding: "6px 16px",
                        width: "fit-content",
                        textTransform: "capitalize",
                        borderRadius: "8px",
                        border: "1px solid #06A19B",
                        minWidth: 90,
                      }}
                      // onClick={() => handleCalculate(item, index)}
                    >
                      Calculate
                    </Button>

                    <FormControl
                      fullWidth
                      className="form-input"
                      sx={{
                        minWidth: 110,
                      }}
                    >
                      <InputLabel id="feed-supply-select-label10">
                        Min
                      </InputLabel>
                      <Select
                        labelId="feed-supply-select-label10"
                        id="feed-supply-select10"
                        value={age}
                        label="Min"
                        onChange={handleChange}
                      >
                        <MenuItem value={10}>Ten</MenuItem>
                        <MenuItem value={20}>Twenty</MenuItem>
                        <MenuItem value={30}>Thirty</MenuItem>
                      </Select>
                    </FormControl>

                    <Box
                      fontSize={14}
                      fontWeight={500}
                      width="fit-content"
                      // onClick={handleClear}
                      style={{ cursor: "pointer" }}
                      sx={
                        {
                          // visibility: "hidden"
                        }
                      }
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="1.5em"
                        height="1.5em"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill="red"
                          d="M12 20c-4.41 0-8-3.59-8-8s3.59-8 8-8s8 3.59 8 8s-3.59 8-8 8m0-18C6.47 2 2 6.47 2 12s4.47 10 10 10s10-4.47 10-10S17.53 2 12 2m2.59 6L12 10.59L9.41 8L8 9.41L10.59 12L8 14.59L9.41 16L12 13.41L14.59 16L16 14.59L13.41 12L16 9.41z"
                        />
                      </svg>
                    </Box>
                  </Grid>

                  <Grid
                    item
                    xl={6}
                    xs={12}
                    sx={{
                      display: "flex",
                      gap: 1.5,
                      alignItems: "center",
                      minWidth: "200px",
                      overflowX: "auto",
                      pb: 1.5,
                    }}
                  >
                    <Typography variant="subtitle1" fontWeight={600}>
                      2.{" "}
                    </Typography>

                    <Box
                      display={"flex"}
                      gap={2}
                      alignItems={"center"}
                      position={"relative"}
                    >
                      <TextField
                        label="Crude Protein"
                        type="number"
                        className="form-input"
                        // {...register("organisationName", {
                        //     required: true,
                        // })}
                        // focused={userData?.data.name ? true : false}
                        // value={userData?.data.name}
                        sx={{
                          width: "100%",
                          minWidth: 190,
                        }}
                      />

                      <Typography
                        variant="body2"
                        color="#555555AC"
                        sx={{
                          position: "absolute",
                          right: 6,
                          top: "50%",
                          transform: "translate(-6px, -50%)",
                          backgroundColor: "#fff",
                          height: 30,
                          display: "grid",
                          placeItems: "center",
                          zIndex: 1,
                          pl: 1,
                        }}
                      >
                        g/kg
                      </Typography>
                    </Box>

                    <Button
                      type="button"
                      variant="contained"
                      sx={{
                        background: "#06a19b",
                        color: "#fff",
                        fontWeight: 600,
                        padding: "6px 16px",
                        width: "fit-content",
                        textTransform: "capitalize",
                        borderRadius: "8px",
                        border: "1px solid #06A19B",
                        minWidth: 90,
                      }}
                      // onClick={() => handleCalculate(item, index)}
                    >
                      Calculate
                    </Button>

                    <FormControl
                      fullWidth
                      className="form-input"
                      sx={{
                        minWidth: 110,
                      }}
                    >
                      <InputLabel id="feed-supply-select-label10">
                        Min
                      </InputLabel>
                      <Select
                        labelId="feed-supply-select-label10"
                        id="feed-supply-select10"
                        value={age}
                        label="Min"
                        onChange={handleChange}
                      >
                        <MenuItem value={10}>Ten</MenuItem>
                        <MenuItem value={20}>Twenty</MenuItem>
                        <MenuItem value={30}>Thirty</MenuItem>
                      </Select>
                    </FormControl>

                    <Box
                      fontSize={14}
                      fontWeight={500}
                      width="fit-content"
                      // onClick={handleClear}
                      style={{ cursor: "pointer" }}
                      sx={{
                        visibility: "hidden",
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="1.5em"
                        height="1.5em"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill="red"
                          d="M12 20c-4.41 0-8-3.59-8-8s3.59-8 8-8s8 3.59 8 8s-3.59 8-8 8m0-18C6.47 2 2 6.47 2 12s4.47 10 10 10s10-4.47 10-10S17.53 2 12 2m2.59 6L12 10.59L9.41 8L8 9.41L10.59 12L8 14.59L9.41 16L12 13.41L14.59 16L16 14.59L13.41 12L16 9.41z"
                        />
                      </svg>
                    </Box>
                  </Grid>

                  <Grid
                    item
                    xl={6}
                    xs={12}
                    sx={{
                      display: "flex",
                      gap: 1.5,
                      alignItems: "center",
                      minWidth: "200px",
                      overflowX: "auto",
                      pb: 1.5,
                    }}
                  >
                    <Typography variant="subtitle1" fontWeight={600}>
                      3.{" "}
                    </Typography>

                    <Box
                      display={"flex"}
                      gap={2}
                      alignItems={"center"}
                      position={"relative"}
                    >
                      <TextField
                        label="Crude Fat"
                        type="number"
                        className="form-input"
                        // {...register("organisationName", {
                        //     required: true,
                        // })}
                        // focused={userData?.data.name ? true : false}
                        // value={userData?.data.name}
                        sx={{
                          width: "100%",
                          minWidth: 190,
                        }}
                      />

                      <Typography
                        variant="body2"
                        color="#555555AC"
                        sx={{
                          position: "absolute",
                          right: 6,
                          top: "50%",
                          transform: "translate(-6px, -50%)",
                          backgroundColor: "#fff",
                          height: 30,
                          display: "grid",
                          placeItems: "center",
                          zIndex: 1,
                          pl: 1,
                        }}
                      >
                        g/kg
                      </Typography>
                    </Box>

                    <Button
                      type="button"
                      variant="contained"
                      sx={{
                        background: "#06a19b",
                        color: "#fff",
                        fontWeight: 600,
                        padding: "6px 16px",
                        width: "fit-content",
                        textTransform: "capitalize",
                        borderRadius: "8px",
                        border: "1px solid #06A19B",
                        minWidth: 90,
                      }}
                      // onClick={() => handleCalculate(item, index)}
                    >
                      Calculate
                    </Button>

                    <FormControl
                      fullWidth
                      className="form-input"
                      sx={{
                        minWidth: 110,
                      }}
                    >
                      <InputLabel id="feed-supply-select-label10">
                        Min
                      </InputLabel>
                      <Select
                        labelId="feed-supply-select-label10"
                        id="feed-supply-select10"
                        value={age}
                        label="Min"
                        onChange={handleChange}
                      >
                        <MenuItem value={10}>Ten</MenuItem>
                        <MenuItem value={20}>Twenty</MenuItem>
                        <MenuItem value={30}>Thirty</MenuItem>
                      </Select>
                    </FormControl>

                    <Box
                      fontSize={14}
                      fontWeight={500}
                      width="fit-content"
                      // onClick={handleClear}
                      style={{ cursor: "pointer" }}
                      sx={{
                        visibility: "hidden",
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="1.5em"
                        height="1.5em"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill="red"
                          d="M12 20c-4.41 0-8-3.59-8-8s3.59-8 8-8s8 3.59 8 8s-3.59 8-8 8m0-18C6.47 2 2 6.47 2 12s4.47 10 10 10s10-4.47 10-10S17.53 2 12 2m2.59 6L12 10.59L9.41 8L8 9.41L10.59 12L8 14.59L9.41 16L12 13.41L14.59 16L16 14.59L13.41 12L16 9.41z"
                        />
                      </svg>
                    </Box>
                  </Grid>

                  <Grid
                    item
                    xl={6}
                    xs={12}
                    sx={{
                      display: "flex",
                      gap: 1.5,
                      alignItems: "center",
                      minWidth: "200px",
                      overflowX: "auto",
                      pb: 1.5,
                    }}
                  >
                    <Typography variant="subtitle1" fontWeight={600}>
                      4.{" "}
                    </Typography>

                    <Box
                      display={"flex"}
                      gap={2}
                      alignItems={"center"}
                      position={"relative"}
                    >
                      <TextField
                        label="Crude Ash"
                        type="number"
                        className="form-input"
                        // {...register("organisationName", {
                        //     required: true,
                        // })}
                        // focused={userData?.data.name ? true : false}
                        // value={userData?.data.name}
                        sx={{
                          width: "100%",
                          minWidth: 190,
                        }}
                      />

                      <Typography
                        variant="body2"
                        color="#555555AC"
                        sx={{
                          position: "absolute",
                          right: 6,
                          top: "50%",
                          transform: "translate(-6px, -50%)",
                          backgroundColor: "#fff",
                          height: 30,
                          display: "grid",
                          placeItems: "center",
                          zIndex: 1,
                          pl: 1,
                        }}
                      >
                        g/kg
                      </Typography>
                    </Box>

                    <Button
                      type="button"
                      variant="contained"
                      sx={{
                        background: "#06a19b",
                        color: "#fff",
                        fontWeight: 600,
                        padding: "6px 16px",
                        width: "fit-content",
                        textTransform: "capitalize",
                        borderRadius: "8px",
                        border: "1px solid #06A19B",
                        minWidth: 90,
                      }}
                      // onClick={() => handleCalculate(item, index)}
                    >
                      Calculate
                    </Button>

                    <FormControl
                      fullWidth
                      className="form-input"
                      sx={{
                        minWidth: 110,
                      }}
                    >
                      <InputLabel id="feed-supply-select-label10">
                        Min
                      </InputLabel>
                      <Select
                        labelId="feed-supply-select-label10"
                        id="feed-supply-select10"
                        value={age}
                        label="Min"
                        onChange={handleChange}
                      >
                        <MenuItem value={10}>Ten</MenuItem>
                        <MenuItem value={20}>Twenty</MenuItem>
                        <MenuItem value={30}>Thirty</MenuItem>
                      </Select>
                    </FormControl>

                    <Box
                      fontSize={14}
                      fontWeight={500}
                      width="fit-content"
                      // onClick={handleClear}
                      style={{ cursor: "pointer" }}
                      sx={{
                        visibility: "hidden",
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="1.5em"
                        height="1.5em"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill="red"
                          d="M12 20c-4.41 0-8-3.59-8-8s3.59-8 8-8s8 3.59 8 8s-3.59 8-8 8m0-18C6.47 2 2 6.47 2 12s4.47 10 10 10s10-4.47 10-10S17.53 2 12 2m2.59 6L12 10.59L9.41 8L8 9.41L10.59 12L8 14.59L9.41 16L12 13.41L14.59 16L16 14.59L13.41 12L16 9.41z"
                        />
                      </svg>
                    </Box>
                  </Grid>

                  <Grid
                    item
                    xl={6}
                    xs={12}
                    sx={{
                      display: "flex",
                      gap: 1.5,
                      alignItems: "center",
                      minWidth: "200px",
                      overflowX: "auto",
                      pb: 1.5,
                    }}
                  >
                    <Typography variant="subtitle1" fontWeight={600}>
                      5.{" "}
                    </Typography>

                    <Box
                      display={"flex"}
                      gap={2}
                      alignItems={"center"}
                      position={"relative"}
                    >
                      <TextField
                        label="Calcium"
                        type="number"
                        className="form-input"
                        // {...register("organisationName", {
                        //     required: true,
                        // })}
                        // focused={userData?.data.name ? true : false}
                        // value={userData?.data.name}
                        sx={{
                          width: "100%",
                          minWidth: 190,
                        }}
                      />

                      <Typography
                        variant="body2"
                        color="#555555AC"
                        sx={{
                          position: "absolute",
                          right: 6,
                          top: "50%",
                          transform: "translate(-6px, -50%)",
                          backgroundColor: "#fff",
                          height: 30,
                          display: "grid",
                          placeItems: "center",
                          zIndex: 1,
                          pl: 1,
                        }}
                      >
                        g/kg
                      </Typography>
                    </Box>

                    <Button
                      type="button"
                      variant="contained"
                      sx={{
                        background: "#06a19b",
                        color: "#fff",
                        fontWeight: 600,
                        padding: "6px 16px",
                        width: "fit-content",
                        textTransform: "capitalize",
                        borderRadius: "8px",
                        border: "1px solid #06A19B",
                        minWidth: 90,
                      }}
                      // onClick={() => handleCalculate(item, index)}
                    >
                      Calculate
                    </Button>

                    <FormControl
                      fullWidth
                      className="form-input"
                      sx={{
                        minWidth: 110,
                      }}
                    >
                      <InputLabel id="feed-supply-select-label10">
                        Min
                      </InputLabel>
                      <Select
                        labelId="feed-supply-select-label10"
                        id="feed-supply-select10"
                        value={age}
                        label="Min"
                        onChange={handleChange}
                      >
                        <MenuItem value={10}>Ten</MenuItem>
                        <MenuItem value={20}>Twenty</MenuItem>
                        <MenuItem value={30}>Thirty</MenuItem>
                      </Select>
                    </FormControl>

                    <Box
                      fontSize={14}
                      fontWeight={500}
                      width="fit-content"
                      // onClick={handleClear}
                      style={{ cursor: "pointer" }}
                      sx={{
                        visibility: "hidden",
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="1.5em"
                        height="1.5em"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill="red"
                          d="M12 20c-4.41 0-8-3.59-8-8s3.59-8 8-8s8 3.59 8 8s-3.59 8-8 8m0-18C6.47 2 2 6.47 2 12s4.47 10 10 10s10-4.47 10-10S17.53 2 12 2m2.59 6L12 10.59L9.41 8L8 9.41L10.59 12L8 14.59L9.41 16L12 13.41L14.59 16L16 14.59L13.41 12L16 9.41z"
                        />
                      </svg>
                    </Box>
                  </Grid>

                  <Grid
                    item
                    xl={6}
                    xs={12}
                    sx={{
                      display: "flex",
                      gap: 1.5,
                      alignItems: "center",
                      minWidth: "200px",
                      overflowX: "auto",
                      pb: 1.5,
                    }}
                  >
                    <Typography variant="subtitle1" fontWeight={600}>
                      6.{" "}
                    </Typography>

                    <Box
                      display={"flex"}
                      gap={2}
                      alignItems={"center"}
                      position={"relative"}
                    >
                      <TextField
                        label="Phosphorous"
                        type="number"
                        className="form-input"
                        // {...register("organisationName", {
                        //     required: true,
                        // })}
                        // focused={userData?.data.name ? true : false}
                        // value={userData?.data.name}
                        sx={{
                          width: "100%",
                          minWidth: 190,
                        }}
                      />

                      <Typography
                        variant="body2"
                        color="#555555AC"
                        sx={{
                          position: "absolute",
                          right: 6,
                          top: "50%",
                          transform: "translate(-6px, -50%)",
                          backgroundColor: "#fff",
                          height: 30,
                          display: "grid",
                          placeItems: "center",
                          zIndex: 1,
                          pl: 1,
                        }}
                      >
                        g/kg
                      </Typography>
                    </Box>

                    <Button
                      type="button"
                      variant="contained"
                      sx={{
                        background: "#06a19b",
                        color: "#fff",
                        fontWeight: 600,
                        padding: "6px 16px",
                        width: "fit-content",
                        textTransform: "capitalize",
                        borderRadius: "8px",
                        border: "1px solid #06A19B",
                        minWidth: 90,
                      }}
                      // onClick={() => handleCalculate(item, index)}
                    >
                      Calculate
                    </Button>

                    <FormControl
                      fullWidth
                      className="form-input"
                      sx={{
                        minWidth: 110,
                      }}
                    >
                      <InputLabel id="feed-supply-select-label10">
                        Min
                      </InputLabel>
                      <Select
                        labelId="feed-supply-select-label10"
                        id="feed-supply-select10"
                        value={age}
                        label="Min"
                        onChange={handleChange}
                      >
                        <MenuItem value={10}>Ten</MenuItem>
                        <MenuItem value={20}>Twenty</MenuItem>
                        <MenuItem value={30}>Thirty</MenuItem>
                      </Select>
                    </FormControl>

                    <Box
                      fontSize={14}
                      fontWeight={500}
                      width="fit-content"
                      // onClick={handleClear}
                      style={{ cursor: "pointer" }}
                      sx={{
                        visibility: "hidden",
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="1.5em"
                        height="1.5em"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill="red"
                          d="M12 20c-4.41 0-8-3.59-8-8s3.59-8 8-8s8 3.59 8 8s-3.59 8-8 8m0-18C6.47 2 2 6.47 2 12s4.47 10 10 10s10-4.47 10-10S17.53 2 12 2m2.59 6L12 10.59L9.41 8L8 9.41L10.59 12L8 14.59L9.41 16L12 13.41L14.59 16L16 14.59L13.41 12L16 9.41z"
                        />
                      </svg>
                    </Box>
                  </Grid>

                  <Grid
                    item
                    xl={6}
                    xs={12}
                    sx={{
                      display: "flex",
                      gap: 1.5,
                      alignItems: "center",
                      minWidth: "200px",
                      overflowX: "auto",
                      pb: 1.5,
                    }}
                  >
                    <Typography variant="subtitle1" fontWeight={600}>
                      7.{" "}
                    </Typography>

                    <Box
                      display={"flex"}
                      gap={2}
                      alignItems={"center"}
                      position={"relative"}
                    >
                      <TextField
                        label="Carbohydrates"
                        type="number"
                        className="form-input"
                        // {...register("organisationName", {
                        //     required: true,
                        // })}
                        // focused={userData?.data.name ? true : false}
                        // value={userData?.data.name}
                        sx={{
                          width: "100%",
                          minWidth: 190,
                        }}
                      />

                      <Typography
                        variant="body2"
                        color="#555555AC"
                        sx={{
                          position: "absolute",
                          right: 6,
                          top: "50%",
                          transform: "translate(-6px, -50%)",
                          backgroundColor: "#fff",
                          height: 30,
                          display: "grid",
                          placeItems: "center",
                          zIndex: 1,
                          pl: 1,
                        }}
                      >
                        g/kg
                      </Typography>
                    </Box>

                    <Button
                      type="button"
                      variant="contained"
                      sx={{
                        background: "#06a19b",
                        color: "#fff",
                        fontWeight: 600,
                        padding: "6px 16px",
                        width: "fit-content",
                        textTransform: "capitalize",
                        borderRadius: "8px",
                        border: "1px solid #06A19B",
                        minWidth: 90,
                      }}
                      // onClick={() => handleCalculate(item, index)}
                    >
                      Calculate
                    </Button>

                    <FormControl
                      fullWidth
                      className="form-input"
                      sx={{
                        minWidth: 110,
                      }}
                    >
                      <InputLabel id="feed-supply-select-label10">
                        Min
                      </InputLabel>
                      <Select
                        labelId="feed-supply-select-label10"
                        id="feed-supply-select10"
                        value={age}
                        label="Min"
                        onChange={handleChange}
                      >
                        <MenuItem value={10}>Ten</MenuItem>
                        <MenuItem value={20}>Twenty</MenuItem>
                        <MenuItem value={30}>Thirty</MenuItem>
                      </Select>
                    </FormControl>

                    <Box
                      fontSize={14}
                      fontWeight={500}
                      width="fit-content"
                      // onClick={handleClear}
                      style={{ cursor: "pointer" }}
                      sx={{
                        visibility: "hidden",
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="1.5em"
                        height="1.5em"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill="red"
                          d="M12 20c-4.41 0-8-3.59-8-8s3.59-8 8-8s8 3.59 8 8s-3.59 8-8 8m0-18C6.47 2 2 6.47 2 12s4.47 10 10 10s10-4.47 10-10S17.53 2 12 2m2.59 6L12 10.59L9.41 8L8 9.41L10.59 12L8 14.59L9.41 16L12 13.41L14.59 16L16 14.59L13.41 12L16 9.41z"
                        />
                      </svg>
                    </Box>
                  </Grid>

                  <Grid
                    item
                    xl={6}
                    xs={12}
                    sx={{
                      display: "flex",
                      gap: 1.5,
                      alignItems: "center",
                      minWidth: "200px",
                      overflowX: "auto",
                      pb: 1.5,
                    }}
                  >
                    <Typography variant="subtitle1" fontWeight={600}>
                      8.{" "}
                    </Typography>

                    <Box
                      display={"flex"}
                      gap={2}
                      alignItems={"center"}
                      position={"relative"}
                    >
                      <TextField
                        label="Metabolizable Energy"
                        type="number"
                        className="form-input"
                        // {...register("organisationName", {
                        //     required: true,
                        // })}
                        // focused={userData?.data.name ? true : false}
                        // value={userData?.data.name}
                        sx={{
                          width: "100%",
                          minWidth: 190,
                        }}
                      />

                      <Typography
                        variant="body2"
                        color="#555555AC"
                        sx={{
                          position: "absolute",
                          right: 6,
                          top: "50%",
                          transform: "translate(-6px, -50%)",
                          backgroundColor: "#fff",
                          height: 30,
                          display: "grid",
                          placeItems: "center",
                          zIndex: 1,
                          pl: 1,
                        }}
                      >
                        g/kg
                      </Typography>
                    </Box>

                    <Button
                      type="button"
                      variant="contained"
                      sx={{
                        background: "#06a19b",
                        color: "#fff",
                        fontWeight: 600,
                        padding: "6px 16px",
                        width: "fit-content",
                        textTransform: "capitalize",
                        borderRadius: "8px",
                        border: "1px solid #06A19B",
                        minWidth: 90,
                      }}
                      // onClick={() => handleCalculate(item, index)}
                    >
                      Calculate
                    </Button>

                    <FormControl
                      fullWidth
                      className="form-input"
                      sx={{
                        minWidth: 110,
                      }}
                    >
                      <InputLabel id="feed-supply-select-label10">
                        Min
                      </InputLabel>
                      <Select
                        labelId="feed-supply-select-label10"
                        id="feed-supply-select10"
                        value={age}
                        label="Min"
                        onChange={handleChange}
                      >
                        <MenuItem value={10}>Ten</MenuItem>
                        <MenuItem value={20}>Twenty</MenuItem>
                        <MenuItem value={30}>Thirty</MenuItem>
                      </Select>
                    </FormControl>

                    <Box
                      fontSize={14}
                      fontWeight={500}
                      width="fit-content"
                      // onClick={handleClear}
                      style={{ cursor: "pointer" }}
                      sx={{
                        visibility: "hidden",
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="1.5em"
                        height="1.5em"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill="red"
                          d="M12 20c-4.41 0-8-3.59-8-8s3.59-8 8-8s8 3.59 8 8s-3.59 8-8 8m0-18C6.47 2 2 6.47 2 12s4.47 10 10 10s10-4.47 10-10S17.53 2 12 2m2.59 6L12 10.59L9.41 8L8 9.41L10.59 12L8 14.59L9.41 16L12 13.41L14.59 16L16 14.59L13.41 12L16 9.41z"
                        />
                      </svg>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Stack>

            <Box>
              <Box
                display={"flex"}
                justifyContent={"flex-end"}
                alignItems={"center"}
                gap={3}
                mt={3}
              >
                <Button
                  type="button"
                  variant="contained"
                  sx={{
                    background: "#fff",
                    color: "#06A19B",
                    fontWeight: 600,
                    padding: "6px 16px",
                    width: "fit-content",
                    textTransform: "capitalize",
                    borderRadius: "8px",
                    border: "1px solid #06A19B",
                  }}
                  onClick={() => setActiveStep(0)}
                >
                  Previous
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    background: "#06A19B",
                    fontWeight: 600,
                    padding: "6px 16px",
                    width: "fit-content",
                    textTransform: "capitalize",
                    borderRadius: "8px",
                  }}
                  onClick={() => setActiveStep(2)}
                >
                  Next
                </Button>
              </Box>
            </Box>
          </form>
        </Box>
      </Stack>
    </>
  );
};

export default NewFeed;
