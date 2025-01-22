"use client";
import {
  Box,
  Button,
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
interface InputType {
  name: String;
  specie: String;
  temperatureCoefficient: String;
  growthEquationLength: String;
  growthEquationBodyWeight: String;
  conditionFactor1: String;
  conditionFactor2: String;
}
function GrowthModel() {
  const loggedUser: any = getCookie("logged-user");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<InputType>();
  const [isApiCallInProgress, setIsApiCallInProgress] =
    useState<boolean>(false);
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
      <Stack>
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
              {/* div-1 */}
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
                    helperText={errors.name ? "Name is required" : ""}
                    sx={{
                      width: "100%",
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12}>
                <FormControl fullWidth className="form-input" focused>
                  <InputLabel id="feed-supply-select-label5">
                    Specie *
                  </InputLabel>
                  <Select
                    labelId="feed-supply-select-label5"
                    id="feed-supply-select5"
                    label="Species *"
                    {...register("specie", { required: true })}
                  >
                    <MenuItem value={" Tilapia (Oreochromis Nilotic x Aureus)"}>
                      Tilapia (Oreochromis Nilotic x Aureus)
                    </MenuItem>
                  </Select>
                  {errors.specie && (
                    <FormHelperText sx={{ color: "#d32f2f" }}>
                      {errors.specie ? "Specie is required" : ""}
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>

              {/* grid-2 */}
              <Grid item md={6} xs={12}>
                <TextField
                  label="Temperature Coefficient *"
                  type="text"
                  className="form-input"
                  focused
                  {...register("temperatureCoefficient", { required: true })}
                  error={!!errors.temperatureCoefficient}
                  helperText={
                    errors.temperatureCoefficient
                      ? "Temperature coefficient is required"
                      : ""
                  }
                  sx={{
                    width: "100%",
                  }}
                />

                <Typography
                  variant="body2"
                  color="red"
                  fontSize={13}
                  mt={0.5}
                ></Typography>

                <Typography
                  variant="body2"
                  color="red"
                  fontSize={13}
                  mt={0.5}
                ></Typography>
              </Grid>

              {/* grid-3 */}
              <Grid item md={6} xs={12}>
                <TextField
                  label="Growth equation - Length *"
                  type="text"
                  className="form-input"
                  {...register("growthEquationLength", { required: true })}
                  error={!!errors.growthEquationLength}
                  helperText={
                    errors.growthEquationLength
                      ? "Growth equation Length is required"
                      : ""
                  }
                  focused
                  sx={{
                    width: "100%",
                  }}
                />
              </Grid>

              {/* grid-4 */}
              <Grid item md={6} xs={12}>
                <TextField
                  label="Growth equation (bodyweight) *"
                  type="text"
                  className="form-input"
                  {...register("growthEquationBodyWeight", { required: true })}
                  error={!!errors.growthEquationBodyWeight}
                  helperText={
                    errors.growthEquationBodyWeight
                      ? "Growth equation body weight is required"
                      : ""
                  }
                  focused
                  sx={{
                    width: "100%",
                  }}
                />
              </Grid>

              {/* grid-5 */}
              <Grid item md={6} xs={12}>
                <TextField
                  label="Condition Factor *"
                  type="text"
                  className="form-input"
                  {...register("conditionFactor1", { required: true })}
                  error={!!errors.conditionFactor1}
                  helperText={
                    errors.conditionFactor1
                      ? "Condition factor is required"
                      : ""
                  }
                  focused
                  sx={{
                    width: "100%",
                  }}
                />
              </Grid>

              {/* grid-6 */}
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
