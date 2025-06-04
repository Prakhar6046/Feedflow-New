"use client";
import {
  Box,
  Button,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { getCookie } from "cookies-next";
import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Farm } from "../_typeModels/Farm";

interface InputType {
  name: String;
  specie: String;
  temperatureCoefficient: String;
  growthEquationLength: String;
  growthEquationBodyWeight: String;
  conditionFactor1: String;
  conditionFactor2: String;
  // farm: String;
  // farm: String;
  // modelId: number;
}
function GrowthModel({ farms }: { farms: Farm[] }) {
  const loggedUser: any = getCookie("logged-user");
  const {
    register,
    handleSubmit,
    reset,
    clearErrors,
    formState: { errors },
  } = useForm<InputType>();

  const [isApiCallInProgress, setIsApiCallInProgress] =
    useState<boolean>(false);
  const [species, setSpecies] = useState("");
  const onSubmit: SubmitHandler<InputType> = async (data) => {
    const user = JSON.parse(loggedUser);
    if (user?.organisationId && data.name) {
      // Prevent API call if one is already in progress
      if (isApiCallInProgress) return;
      setIsApiCallInProgress(true);
      try {
        const response = await fetch("/api/growth-model", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: data,
            organisationId: user.organisationId,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          toast.dismiss();
          toast.success(data.message);
          setSpecies("");
          reset();
        }
      } catch (error) {
        toast.error("Something went wrong. Please try again.");
      } finally {
        setIsApiCallInProgress(false);
      }
    }
  };
  return (
    <Grid
      container
      sx={{
        width: "100%",
        overflow: "hidden",
        borderRadius: "14px",
        boxShadow: "0px 0px 16px 5px #0000001A",
        p: 3,
      }}
    >
      {/* Old Code */}
      {/* <Stack width={"100%"}>
        <Typography
          variant="h6"
          fontWeight={700}
          sx={{
            fontSize: {
              md: 24,
              xs: 20,
            },
            marginBlock: 2,
          }}
        >
          Growth Model
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box>
            <Grid container spacing={2}>
              <Grid item md={6} xs={12}>
                <FormControl fullWidth className="form-input" focused>
                  <InputLabel id="feed-supply-select-label5">
                    Model Name *
                  </InputLabel>
                  <TextField
                    label="Model Name *"
                    type="text"
                    className="form-input"
                    focused
                    {...register("name", { required: true })}
                    error={!!errors.name}
                    sx={{
                      width: "100%",
                    }}
                  />
                </FormControl>
                <Typography variant="body2" color="red" fontSize={13} mt={0.5}>
                  {errors.name ? "This field is required." : ""}
                </Typography>
              </Grid>

              <Grid item md={6} xs={12}>
                <FormControl fullWidth className="form-input" focused>
                  <InputLabel id="feed-supply-select-label5">
                    Species *
                  </InputLabel>
                  <Select
                    labelId="feed-supply-select-label5"
                    id="feed-supply-select5"
                    label="Species *"
                    {...register("specie", {
                      required: true,
                    })}
                    value={species}
                    onChange={(e) => {
                      setSpecies(e.target.value);
                      clearErrors("specie");
                    }}
                  >
                    <MenuItem
                      value={" Tilapia (Oreochromis Nilotic x Aureus)"}
                      key={"Tilapia (Oreochromis Nilotic x Aureus)"}
                    >
                      Tilapia (Oreochromis Nilotic x Aureus)
                    </MenuItem>
                  </Select>
                  {errors.specie && (
                    <FormHelperText sx={{ color: "#d32f2f" }}></FormHelperText>
                  )}
                </FormControl>
                <Typography variant="body2" color="red" fontSize={13} mt={0.5}>
                  {errors.specie ? "This field is required." : ""}
                </Typography>
              </Grid>

              <Grid item md={6} xs={12}>
                <FormControl fullWidth className="form-input" focused>
                  <InputLabel id="feed-supply-select-label5">
                    Temperature Coefficient *
                  </InputLabel>
                  <TextField
                    label="Temperature Coefficient *"
                    type="text"
                    className="form-input"
                    focused
                    {...register("temperatureCoefficient", { required: true })}
                    error={!!errors.temperatureCoefficient}
                    sx={{
                      width: "100%",
                    }}
                  />
                </FormControl>
                <Typography variant="body2" color="red" fontSize={13} mt={0.5}>
                  {errors.temperatureCoefficient
                    ? "This field is required."
                    : ""}
                </Typography>
              </Grid>

              <Grid item md={6} xs={12}>
                <TextField
                  label="Growth equation - Length *"
                  type="text"
                  className="form-input"
                  {...register("growthEquationLength", { required: true })}
                  error={!!errors.growthEquationLength}
                  focused
                  sx={{
                    width: "100%",
                  }}
                />
                <Typography variant="body2" color="red" fontSize={13} mt={0.5}>
                  {errors.growthEquationLength ? "This field is required." : ""}
                </Typography>
              </Grid>

              <Grid item md={6} xs={12}>
                <TextField
                  label="Growth equation (bodyweight) *"
                  type="text"
                  className="form-input"
                  {...register("growthEquationBodyWeight", { required: true })}
                  error={!!errors.growthEquationBodyWeight}
                  focused
                  sx={{
                    width: "100%",
                  }}
                />
                <Typography variant="body2" color="red" fontSize={13} mt={0.5}>
                  {errors.growthEquationBodyWeight
                    ? "This field is required."
                    : ""}
                </Typography>
              </Grid>

              <Grid item md={6} xs={12}>
                <TextField
                  label="Condition Factor *"
                  type="text"
                  className="form-input"
                  {...register("conditionFactor1", { required: true })}
                  error={!!errors.conditionFactor1}
                  focused
                  sx={{
                    width: "100%",
                  }}
                />
                <Typography variant="body2" color="red" fontSize={13} mt={0.5}>
                  {errors.conditionFactor1 ? "This field is required." : ""}
                </Typography>
              </Grid>

              <Grid item md={6} xs={12}>
                <TextField
                  label="Condition Factor"
                  type="text"
                  className="form-input"
                  {...register("conditionFactor2")}
                  focused
                  sx={{
                    width: "100%",
                  }}
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <FormControl fullWidth className="form-input" focused>
                  <InputLabel id="farm-select-label5">Farm *</InputLabel>
                  <Select
                    labelId="farm-select-label5"
                    id="farm-select5"
                    label="Farm *"
                    {...register("farm", {
                      required: true,
                    })}
                    onChange={(e) => {
                      clearErrors("farm");
                    }}
                  >
                    {farms?.map((farm: any) => (
                      <MenuItem key={farm?.id} value={farm.id || null}>
                        {farm.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.farm && (
                    <FormHelperText sx={{ color: "#d32f2f" }}></FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Typography variant="body2" color="red" fontSize={13} mt={0.5}>
                {errors.specie ? "This field is required" : ""}
              </Typography>
            </Grid>
          </Box>
          <Box
            display={"flex"}
            justifyContent={"end"}
            alignItems={"end"}
            marginBlock={"20px"}
          >
            <Button
              type="submit"
              variant="contained"
              sx={{
                color: "#fff",
                background: "#06A19B",
                fontWeight: 600,
                padding: "6px 16px",
                width: "fit-content",
                textTransform: "capitalize",
                borderRadius: "8px",
                border: "1px solid #06A19B",
              }}
            >
              Save
            </Button>
          </Box>
        </form>
      </Stack> */}
      <Stack width={"100%"}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box>
            <Typography
              variant="h6"
              fontWeight={700}
              sx={{
                fontSize: {
                  md: 24,
                  xs: 20,
                },
                marginBlock: 2,
              }}
            >
              Overview
            </Typography>
            <Grid container spacing={2}>
              <Grid item md={4} xs={12}>
                <FormControl fullWidth className="form-input" focused>
                  <InputLabel id="feed-supply-select-label5">
                    Name *
                  </InputLabel>
                  <TextField
                    label="Name *"
                    type="text"
                    className="form-input"
                    focused
                  // {...register("name", { required: true })}
                  // error={!!errors.name}
                  // sx={{
                  //   width: "100%",
                  // }}
                  />
                </FormControl>
                {/* <Typography variant="body2" color="red" fontSize={13} mt={0.5}>
                  {errors.name ? "This field is required." : ""}
                </Typography> */}
              </Grid>

              <Grid item md={4} xs={12}>
                <FormControl fullWidth className="form-input" focused>
                  <InputLabel id="feed-supply-select-label5">
                    Species *
                  </InputLabel>
                  <Select
                    labelId="feed-supply-select-label5"
                    id="feed-supply-select5"
                    label="Species *"
                    {...register("specie", {
                      required: true,
                    })}
                    value={species}
                    onChange={(e) => {
                      setSpecies(e.target.value);
                      clearErrors("specie");
                    }}
                  >
                    <MenuItem
                      value={" Tilapia (Oreochromis Nilotic x Aureus)"}
                      key={"Tilapia (Oreochromis Nilotic x Aureus)"}
                    >
                      Tilapia (Oreochromis Nilotic x Aureus)
                    </MenuItem>
                  </Select>
                  {errors.specie && (
                    <FormHelperText sx={{ color: "#d32f2f" }}></FormHelperText>
                  )}
                </FormControl>
                <Typography variant="body2" color="red" fontSize={13} mt={0.5}>
                  {errors.specie ? "This field is required." : ""}
                </Typography>
              </Grid>

              <Grid item md={4} xs={12}>
                <FormControl fullWidth className="form-input" focused>
                  <InputLabel id="feed-supply-select-label5">
                    Production Systems *
                  </InputLabel>
                  <Select
                    labelId="feed-supply-select-label5"
                    id="feed-supply-select5"
                    label="Production Systems *"
                    {...register("specie", {
                      required: true,
                    })}
                    value={species}
                    onChange={(e) => {
                      setSpecies(e.target.value);
                      clearErrors("specie");
                    }}
                  >
                    <MenuItem
                      value={" Tilapia (Oreochromis Nilotic x Aureus)"}
                      key={"Tilapia (Oreochromis Nilotic x Aureus)"}
                    >
                      Tilapia (Oreochromis Nilotic x Aureus)
                    </MenuItem>
                  </Select>
                  {errors.specie && (
                    <FormHelperText sx={{ color: "#d32f2f" }}></FormHelperText>
                  )}
                </FormControl>
                <Typography variant="body2" color="red" fontSize={13} mt={0.5}>
                  {errors.specie ? "This field is required." : ""}
                </Typography>
              </Grid>
            </Grid>
          </Box>

          <Divider
            sx={{
              my: 4,
            }}
          />

          <Box>
            <Typography
              variant="h6"
              fontWeight={700}
              sx={{
                fontSize: {
                  md: 24,
                  xs: 20,
                },
                marginBottom: 2,
              }}
            >
              Gener
            </Typography>
            <Grid container spacing={2}>
              <Grid item md={4} xs={12}>
                <Box position={"relative"}>
                  <TextField
                    label="ADC CP *"
                    type="text"
                    // {...register("fishWeight")}
                    className="form-input"
                    focused
                    sx={{
                      width: "100%",
                    }}
                  />
                  <Typography
                    variant="body1"
                    color="#555555AC"
                    sx={{
                      position: "absolute",
                      right: 13,
                      top: "30%",
                      backgroundColor: "white",
                      paddingInline: "5px",
                    }}
                  >
                    %
                  </Typography>
                </Box>
              </Grid>

              <Grid item md={4} xs={12}>
                <Box position={"relative"}>
                  <TextField
                    label="ADC CF *"
                    type="text"
                    // {...register("fishWeight")}
                    className="form-input"
                    focused
                    sx={{
                      width: "100%",
                    }}
                  />
                  <Typography
                    variant="body1"
                    color="#555555AC"
                    sx={{
                      position: "absolute",
                      right: 13,
                      top: "30%",
                      backgroundColor: "white",
                      paddingInline: "5px",
                    }}
                  >
                    %
                  </Typography>
                </Box>
              </Grid>

              <Grid item md={4} xs={12}>
                <Box position={"relative"}>
                  <TextField
                    label="ADC NFE *"
                    type="text"
                    // {...register("fishWeight")}
                    className="form-input"
                    focused
                    sx={{
                      width: "100%",
                    }}
                  />
                  <Typography
                    variant="body1"
                    color="#555555AC"
                    sx={{
                      position: "absolute",
                      right: 13,
                      top: "30%",
                      backgroundColor: "white",
                      paddingInline: "5px",
                    }}
                  >
                    %
                  </Typography>
                </Box>
              </Grid>

              <Grid item md={4} xs={12}>
                <Box position={"relative"}>
                  <TextField
                    label="GE Coeff CP *"
                    type="text"
                    // {...register("fishWeight")}
                    className="form-input"
                    focused
                    sx={{
                      width: "100%",
                    }}
                  />
                  <Typography
                    variant="body1"
                    color="#555555AC"
                    sx={{
                      position: "absolute",
                      right: 13,
                      top: "30%",
                      backgroundColor: "white",
                      paddingInline: "5px",
                    }}
                  >
                    MJ/kg
                  </Typography>
                </Box>
              </Grid>

              <Grid item md={4} xs={12}>
                <Box position={"relative"}>
                  <TextField
                    label="GE Coeff CF *"
                    type="text"
                    // {...register("fishWeight")}
                    className="form-input"
                    focused
                    sx={{
                      width: "100%",
                    }}
                  />
                  <Typography
                    variant="body1"
                    color="#555555AC"
                    sx={{
                      position: "absolute",
                      right: 13,
                      top: "30%",
                      backgroundColor: "white",
                      paddingInline: "5px",
                    }}
                  >
                    MJ/kg
                  </Typography>
                </Box>
              </Grid>

              <Grid item md={4} xs={12}>
                <Box position={"relative"}>
                  <TextField
                    label="GE Coeff NFE *"
                    type="text"
                    // {...register("fishWeight")}
                    className="form-input"
                    focused
                    sx={{
                      width: "100%",
                    }}
                  />
                  <Typography
                    variant="body1"
                    color="#555555AC"
                    sx={{
                      position: "absolute",
                      right: 13,
                      top: "30%",
                      backgroundColor: "white",
                      paddingInline: "5px",
                    }}
                  >
                    MJ/kg
                  </Typography>
                </Box>
              </Grid>

              <Grid item md={4} xs={12}>
                <Box position={"relative"}>
                  <TextField
                    label="Waste Factor *"
                    type="text"
                    // {...register("fishWeight")}
                    className="form-input"
                    focused
                    sx={{
                      width: "100%",
                    }}
                  />
                  <Typography
                    variant="body1"
                    color="#555555AC"
                    sx={{
                      position: "absolute",
                      right: 13,
                      top: "30%",
                      backgroundColor: "white",
                      paddingInline: "5px",
                    }}
                  >
                    %
                  </Typography>
                </Box>
              </Grid>

            </Grid>
          </Box>

          <Divider
            sx={{
              my: 4,
            }}
          />

          <Box>
            <Typography
              variant="h6"
              fontWeight={700}
              sx={{
                fontSize: {
                  md: 24,
                  xs: 20,
                },
                marginBottom: 2,
              }}
            >
              Thermal Growth Coefficient - TGC
            </Typography>
            <Grid container spacing={2}>
              <Grid item md={4} xs={12}>
                <FormControl fullWidth className="form-input" focused>
                  <InputLabel id="feed-supply-select-label5">
                    Modal *
                  </InputLabel>
                  <Select
                    labelId="feed-supply-select-label5"
                    id="feed-supply-select5"
                    label="Species *"
                    {...register("specie", {
                      required: true,
                    })}
                    value={species}
                    onChange={(e) => {
                      setSpecies(e.target.value);
                      clearErrors("specie");
                    }}
                  >
                    <MenuItem
                      value={" Tilapia (Oreochromis Nilotic x Aureus)"}
                      key={"Tilapia (Oreochromis Nilotic x Aureus)"}
                    >
                      Tilapia (Oreochromis Nilotic x Aureus)
                    </MenuItem>
                  </Select>
                  {errors.specie && (
                    <FormHelperText sx={{ color: "#d32f2f" }}></FormHelperText>
                  )}
                </FormControl>
                <Typography variant="body2" color="red" fontSize={13} mt={0.5}>
                  {errors.specie ? "This field is required." : ""}
                </Typography>
              </Grid>

              <Grid item md={8} xs={12} sx={{
                alignSelf: "center",
              }}>
                <Typography variant="body1" fontWeight={600} mb={1}>
                  TGC = <Typography variant="body1" component={"span"}>-0.00356658 + 0.00012*LN(T-11.25)</Typography>
                </Typography>
              </Grid>

              <Grid item md={4} xs={12}>
                <FormControl fullWidth className="form-input" focused>
                  <InputLabel id="feed-supply-select-label5">
                    a
                  </InputLabel>
                  <TextField
                    label="a"
                    type="text"
                    className="form-input"
                    focused
                  // {...register("name", { required: true })}
                  // error={!!errors.name}
                  // sx={{
                  //   width: "100%",
                  // }}
                  />
                </FormControl>
                {/* <Typography variant="body2" color="red" fontSize={13} mt={0.5}>
                  {errors.name ? "This field is required." : ""}
                </Typography> */}
              </Grid>

              <Grid item md={4} xs={12}>
                <FormControl fullWidth className="form-input" focused>
                  <InputLabel id="feed-supply-select-label5">
                    b
                  </InputLabel>
                  <TextField
                    label="b"
                    type="text"
                    className="form-input"
                    focused
                  // {...register("name", { required: true })}
                  // error={!!errors.name}
                  // sx={{
                  //   width: "100%",
                  // }}
                  />
                </FormControl>
                {/* <Typography variant="body2" color="red" fontSize={13} mt={0.5}>
                  {errors.name ? "This field is required." : ""}
                </Typography> */}
              </Grid>

              <Grid item md={4} xs={12}>
                <FormControl fullWidth className="form-input" focused>
                  <InputLabel id="feed-supply-select-label5">
                    c
                  </InputLabel>
                  <TextField
                    label="c"
                    type="text"
                    className="form-input"
                    focused
                  // {...register("name", { required: true })}
                  // error={!!errors.name}
                  // sx={{
                  //   width: "100%",
                  // }}
                  />
                </FormControl>
                {/* <Typography variant="body2" color="red" fontSize={13} mt={0.5}>
                  {errors.name ? "This field is required." : ""}
                </Typography> */}
              </Grid>

            </Grid>
          </Box>

          <Divider
            sx={{
              my: 4,
            }}
          />

          <Box>
            <Typography
              variant="h6"
              fontWeight={700}
              sx={{
                fontSize: {
                  md: 24,
                  xs: 20,
                },
                marginBottom: 2,
              }}
            >
              Theoretical Feed Conversion Ratio - tFCR
            </Typography>
            <Grid container spacing={2}>
              <Grid item md={4} xs={12}>
                <FormControl fullWidth className="form-input" focused>
                  <InputLabel id="feed-supply-select-label5">
                    Modal *
                  </InputLabel>
                  <Select
                    labelId="feed-supply-select-label5"
                    id="feed-supply-select5"
                    label="Species *"
                    {...register("specie", {
                      required: true,
                    })}
                    value={species}
                    onChange={(e) => {
                      setSpecies(e.target.value);
                      clearErrors("specie");
                    }}
                  >
                    <MenuItem
                      value={" Tilapia (Oreochromis Nilotic x Aureus)"}
                      key={"Tilapia (Oreochromis Nilotic x Aureus)"}
                    >
                      Tilapia (Oreochromis Nilotic x Aureus)
                    </MenuItem>
                  </Select>
                  {errors.specie && (
                    <FormHelperText sx={{ color: "#d32f2f" }}></FormHelperText>
                  )}
                </FormControl>
                <Typography variant="body2" color="red" fontSize={13} mt={0.5}>
                  {errors.specie ? "This field is required." : ""}
                </Typography>
              </Grid>

              <Grid item md={8} xs={12} sx={{
                alignSelf: "center",
              }}>
                <Typography variant="body1" fontWeight={600} mb={1}>
                  tFCR = <Typography variant="body1" component={"span"}>-0.00356658 + 0.00012*LN(T-11.25) <sup>1</sup></Typography>
                </Typography>
              </Grid>

              <Grid item md={4} xs={12}>
                <FormControl fullWidth className="form-input" focused>
                  <InputLabel id="feed-supply-select-label5">
                    a
                  </InputLabel>
                  <TextField
                    label="a"
                    type="text"
                    className="form-input"
                    focused
                  // {...register("name", { required: true })}
                  // error={!!errors.name}
                  // sx={{
                  //   width: "100%",
                  // }}
                  />
                </FormControl>
                {/* <Typography variant="body2" color="red" fontSize={13} mt={0.5}>
                  {errors.name ? "This field is required." : ""}
                </Typography> */}
              </Grid>

              <Grid item md={4} xs={12}>
                <FormControl fullWidth className="form-input" focused>
                  <InputLabel id="feed-supply-select-label5">
                    b
                  </InputLabel>
                  <TextField
                    label="b"
                    type="text"
                    className="form-input"
                    focused
                  // {...register("name", { required: true })}
                  // error={!!errors.name}
                  // sx={{
                  //   width: "100%",
                  // }}
                  />
                </FormControl>
                {/* <Typography variant="body2" color="red" fontSize={13} mt={0.5}>
                  {errors.name ? "This field is required." : ""}
                </Typography> */}
              </Grid>

              <Grid item md={4} xs={12}>
                <FormControl fullWidth className="form-input" focused>
                  <InputLabel id="feed-supply-select-label5">
                    c
                  </InputLabel>
                  <TextField
                    label="c"
                    type="text"
                    className="form-input"
                    focused
                  // {...register("name", { required: true })}
                  // error={!!errors.name}
                  // sx={{
                  //   width: "100%",
                  // }}
                  />
                </FormControl>
                {/* <Typography variant="body2" color="red" fontSize={13} mt={0.5}>
                  {errors.name ? "This field is required." : ""}
                </Typography> */}
              </Grid>

            </Grid>
          </Box>




          <Box
            display={"flex"}
            justifyContent={"end"}
            alignItems={"end"}
            marginBlock={"20px"}
          >
            <Button
              type="submit"
              variant="contained"
              sx={{
                color: "#fff",
                background: "#06A19B",
                fontWeight: 600,
                padding: "6px 16px",
                width: "fit-content",
                textTransform: "capitalize",
                borderRadius: "8px",
                border: "1px solid #06A19B",
              }}
            >
              Save
            </Button>
          </Box>
        </form>
      </Stack>
    </Grid>
  );
}

export default GrowthModel;
