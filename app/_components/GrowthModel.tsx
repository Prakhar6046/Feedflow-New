"use client";
import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { getCookie } from "cookies-next";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
interface InputType {
  niloticusAureus: {
    specie: String;
    temperatureCoefficient: String;
    growthEquationLength: String;
    growthEquationBodyWeight: String;
    conditionFactor1: String;
    conditionFactor2: String;
  };
  niloticusThaiStrain: {
    specie: String;
    temperatureCoefficient: String;
    growthEquationLength: String;
    growthEquationBodyWeight: String;
    conditionFactor1: String;
    conditionFactor2: String;
  };
}
function GrowthModel() {
  const loggedUser: any = getCookie("logged-user");
  const { register, handleSubmit, reset } = useForm<InputType>();
  const onSubmit: SubmitHandler<InputType> = async (data) => {
    const user = JSON.parse(loggedUser);
    if (
      user?.organisationId &&
      Object.keys(data.niloticusAureus)?.length &&
      Object.keys(data.niloticusThaiStrain)?.length
    ) {
      const response = await fetch("/api/growth-model", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...data, organisationId: user.organisationId }),
      });

      if (response.ok) {
        const data = await response.json();
        toast.success(data.message);
        reset();
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
            <Typography variant="subtitle1" fontWeight={500} marginBottom={3}>
              Niloticus x Aureus-UNESP
            </Typography>
            <Grid container spacing={2}>
              {/* div-1 */}
              <Grid item md={6} xs={12}>
                <FormControl fullWidth className="form-input" focused>
                  <InputLabel id="feed-supply-select-label5">
                    Specie *
                  </InputLabel>
                  <Select
                    labelId="feed-supply-select-label5"
                    id="feed-supply-select5"
                    label="Species *"
                    {...register("niloticusAureus.specie")}
                  >
                    <MenuItem value={" Tilapia (Oreochromis Nilotic x Aureus)"}>
                      Tilapia (Oreochromis Nilotic x Aureus)
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* grid-2 */}
              <Grid item md={6} xs={12}>
                <TextField
                  label="Temperature Coefficient *"
                  type="text"
                  className="form-input"
                  focused
                  {...register("niloticusAureus.temperatureCoefficient")}
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
                  {...register("niloticusAureus.growthEquationLength")}
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
                  {...register("niloticusAureus.growthEquationBodyWeight")}
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
                  {...register("niloticusAureus.conditionFactor1")}
                  focused
                  sx={{
                    width: "100%",
                  }}
                />
              </Grid>

              {/* grid-6 */}
              <Grid item md={6} xs={12}>
                <TextField
                  label="Condition Factor *"
                  type="text"
                  className="form-input"
                  {...register("niloticusAureus.conditionFactor2")}
                  focused
                  sx={{
                    width: "100%",
                  }}
                />
              </Grid>
            </Grid>
          </Box>

          <Typography variant="subtitle1" fontWeight={500} marginBlock={3}>
            Niloticus - Thai Strain
          </Typography>

          <Box>
            <Grid container spacing={2}>
              <Grid item md={6} xs={12}>
                <FormControl fullWidth className="form-input" focused>
                  <InputLabel id="feed-supply-select-label5">
                    Specie *
                  </InputLabel>
                  <Select
                    labelId="feed-supply-select-label5"
                    id="feed-supply-select5"
                    label="Species *"
                    {...register("niloticusThaiStrain.specie")}
                  >
                    <MenuItem value={" Tilapia (Oreochromis Nilotic x Aureus)"}>
                      Tilapia (Oreochromis Nilotic x Aureus)
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* grid-2 */}
              <Grid item md={6} xs={12}>
                <TextField
                  label="Temperature Coefficient *"
                  type="text"
                  className="form-input"
                  focused
                  {...register("niloticusThaiStrain.temperatureCoefficient")}
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
                  {...register("niloticusThaiStrain.growthEquationLength")}
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
                  focused
                  {...register("niloticusThaiStrain.growthEquationBodyWeight")}
                  sx={{
                    width: "100%",
                  }}
                />
              </Grid>

              {/* grid-5*/}
              <Grid item md={6} xs={12}>
                <TextField
                  label="Condition Factor *"
                  type="text"
                  className="form-input"
                  focused
                  {...register("niloticusThaiStrain.conditionFactor1")}
                  sx={{
                    width: "100%",
                  }}
                />
              </Grid>

              {/* grid-6 */}
              <Grid item md={6} xs={12}>
                <TextField
                  label="Condition Factor *"
                  type="text"
                  className="form-input"
                  focused
                  {...register("niloticusThaiStrain.conditionFactor2")}
                  sx={{
                    width: "100%",
                  }}
                />
              </Grid>
            </Grid>

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
