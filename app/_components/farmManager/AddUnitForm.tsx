"use client";
import React, { useEffect } from "react";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import * as validationPattern from "@/app/_lib/utils/validationPatterns/index";
import * as validationMessage from "@/app/_lib/utils/validationsMessage/index";
import { SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { FishSupply } from "@/app/_typeModels/fishSupply";
import { Farm } from "@/app/_typeModels/Farm";
import toast from "react-hot-toast";
import { getCookie } from "cookies-next";
interface FormInputs {
  fishFarm: String;
  productionUnit: String;
  currentBatch: String;
  biomass: String;
  count: String;
  meanWeight: String;
  stocked: String;
}
interface Props {
  farms: Farm[];
}
function AddUnitForm({ farms }: Props) {
  const loggedUser: any = getCookie("logged-user");
  const user = JSON.parse(loggedUser);
  const router = useRouter();
  const {
    register,
    setValue,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInputs>();

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    const { fishFarm, productionUnit, ...restData } = data;
    const payload = {
      organisationId: user.data.user.organisationId,
      fishFarmId: fishFarm,
      productionUnitId: productionUnit,
      ...restData,
    };

    const response = await fetch(`/api/farmManager`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const responseData = await response.json();
    toast.success(responseData.message);

    if (responseData.status) {
      router.push("/dashboard/farmManager");
    }
  };
  useEffect(() => {
    router.refresh();
  }, [router]);
  console.log(errors);

  return (
    <>
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
        Add a new unit
      </Typography>

      <Box>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box mb={2} width={"100%"}>
            <FormControl fullWidth className="form-input">
              <InputLabel id="feed-supply-select-label1">
                Fish Farmer *
              </InputLabel>
              <Select
                labelId="feed-supply-select-label1"
                id="feed-supply-select1"
                {...register("fishFarm", {
                  required: watch("fishFarm") ? false : true,
                  onChange: (e) => setValue("fishFarm", e.target.value),
                })}
                label="Fish Farmer *"
                value={watch("fishFarm") || ""}
              >
                {farms?.map((farm: Farm) => {
                  return (
                    <MenuItem value={String(farm.id)} key={Number(farm.id)}>
                      {farm.name}
                    </MenuItem>
                  );
                })}
              </Select>
              {errors &&
                errors.fishFarm &&
                errors.fishFarm.type === "required" && (
                  <Typography
                    variant="body2"
                    color="red"
                    fontSize={13}
                    mt={0.5}
                  >
                    {validationMessage.required}
                  </Typography>
                )}
            </FormControl>
          </Box>
          <Box mb={2} width={"100%"}>
            <FormControl fullWidth className="form-input">
              <InputLabel id="feed-supply-select-label2">
                Unit Name *
              </InputLabel>
              <Select
                labelId="feed-supply-select-label2"
                id="feed-supply-select2"
                {...register("productionUnit", {
                  required: watch("productionUnit") ? false : true,
                  onChange: (e) => setValue("productionUnit", e.target.value),
                })}
                label="Unit Name *"
                value={watch("productionUnit") || ""}
              >
                {farms?.map((farm: Farm) => {
                  return (
                    <MenuItem value={String(farm.id)} key={Number(farm.id)}>
                      {farm.productionUnits &&
                        farm.productionUnits[0] &&
                        farm?.productionUnits[0]?.name}
                    </MenuItem>
                  );
                })}
              </Select>
              {errors &&
                errors.productionUnit &&
                errors.productionUnit.type === "required" && (
                  <Typography
                    variant="body2"
                    color="red"
                    fontSize={13}
                    mt={0.5}
                  >
                    {validationMessage.required}
                  </Typography>
                )}
              {/* {errors &&
              errors.farmAltitude &&
              errors.farmAltitude.type === "pattern" && (
                <Typography variant="body2" color="red" fontSize={13} mt={0.5}>
                  {validationMessage.onlyNumbers}
                </Typography>
              )} */}
            </FormControl>
          </Box>
          <Box mb={2} width={"100%"}>
            <TextField
              label="Current Batch *"
              type="text"
              className="form-input"
              // focused={altitude ? true : false}
              {...register("currentBatch", {
                required: true,
                // pattern: validationPattern.negativeNumberWithDot,
              })}
              sx={{
                width: "100%",
              }}
            />

            {errors &&
              errors.currentBatch &&
              errors.currentBatch.type === "required" && (
                <Typography variant="body2" color="red" fontSize={13} mt={0.5}>
                  {validationMessage.required}
                </Typography>
              )}
            {/* {errors && errors.lat && errors.lat.type === "pattern" && (
              <Typography variant="body2" color="red" fontSize={13} mt={0.5}>
                {validationMessage.NegativeNumberWithDot}
              </Typography>
            )}  */}
          </Box>{" "}
          <Box mb={2} width={"100%"}>
            <Box position={"relative"}>
              <TextField
                label="Biomass *"
                type="text"
                className="form-input"
                // focused={altitude ? true : false}
                {...register("biomass", {
                  required: true,
                  pattern: validationPattern.negativeNumberWithDot,
                })}
                sx={{
                  width: "100%",
                }}
              />

              <Typography
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
                kg
              </Typography>

              {errors &&
                errors.biomass &&
                errors.biomass.type === "required" && (
                  <Typography
                    variant="body2"
                    color="red"
                    fontSize={13}
                    mt={0.5}
                  >
                    {validationMessage.required}
                  </Typography>
                )}

              {/* <Box mb={2} width={"100%"}>
              <FormControl fullWidth className="form-input">
                <InputLabel id="feed-supply-select-label1">
                  Fish Farmer *
                </InputLabel>
                <Select
                  labelId="feed-supply-select-label1"
                  id="feed-supply-select1"
                  {...register("fishFarmer", {
                    required: watch("fishFarmer") ? false : true,
                    onChange: (e) => setValue("fishFarmer", e.target.value),
                  })}
                  label="Feed Farmer *"
                  value={watch("fishFarmer") || ""}
                >
                  {fishFarmers?.map((fish: any) => {
                    return (
                      <MenuItem value={String(fish.id)} key={fish.id}>
                        {fish.name}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Box> */}
            </Box>
          </Box>
          <Box mb={2} width={"100%"}>
            <TextField
              label="Count *"
              type="text"
              className="form-input"
              // focused={altitude ? true : false}
              {...register("count", {
                required: true,
                pattern: validationPattern.negativeNumberWithDot,
              })}
              sx={{
                width: "100%",
              }}
            />

            {errors && errors.count && errors.count.type === "required" && (
              <Typography variant="body2" color="red" fontSize={13} mt={0.5}>
                {validationMessage.required}
              </Typography>
            )}
            {/* {errors && errors.lng && errors.lng.type === "pattern" && (
              <Typography variant="body2" color="red" fontSize={13} mt={0.5}>
                {validationMessage.NegativeNumberWithDot}
              </Typography>
            )}  */}
          </Box>
          <Box mb={2} width={"100%"}>
            <Box position={"relative"}>
              <TextField
                label="Mean Weight *"
                type="text"
                className="form-input"
                // focused={altitude ? true : false}
                {...register("meanWeight", {
                  required: true,
                  pattern: validationPattern.negativeNumberWithDot,
                })}
                sx={{
                  width: "100%",
                }}
              />
              <Typography
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
                gm
              </Typography>

              {errors &&
                errors.meanWeight &&
                errors.meanWeight.type === "required" && (
                  <Typography
                    variant="body2"
                    color="red"
                    fontSize={13}
                    mt={0.5}
                  >
                    {validationMessage.required}
                  </Typography>
                )}
              {/* {errors && errors.lng && errors.lng.type === "pattern" && (
              <Typography variant="body2" color="red" fontSize={13} mt={0.5}>
                {validationMessage.NegativeNumberWithDot}
              </Typography>
            )}  */}
            </Box>
          </Box>
          <Box mb={2} width={"100%"}>
            <Box position={"relative"}>
              <TextField
                label="% Stocked *"
                type="text"
                className="form-input"
                // focused={altitude ? true : false}
                {...register("stocked", {
                  required: true,
                  pattern: validationPattern.negativeNumberWithDot,
                })}
                sx={{
                  width: "100%",
                }}
              />
              <Typography
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
                %
              </Typography>
              {errors &&
                errors.stocked &&
                errors.stocked.type === "required" && (
                  <Typography
                    variant="body2"
                    color="red"
                    fontSize={13}
                    mt={0.5}
                  >
                    {validationMessage.required}
                  </Typography>
                )}
              {/* {errors && errors.lng && errors.lng.type === "pattern" && (
              <Typography variant="body2" color="red" fontSize={13} mt={0.5}>
                {validationMessage.NegativeNumberWithDot}
              </Typography>
            )}  */}
            </Box>
          </Box>
          {/* <Box mb={2} width={"100%"}>
              <FormControl fullWidth className="form-input">
                <InputLabel id="feed-supply-select-label1">
                  Fish Farmer *
                </InputLabel>
                <Select
                  labelId="feed-supply-select-label1"
                  id="feed-supply-select1"
                  {...register("fishFarmer", {
                    required: watch("fishFarmer") ? false : true,
                    onChange: (e) => setValue("fishFarmer", e.target.value),
                  })}
                  label="Feed Farmer *"
                  value={watch("fishFarmer") || ""}
                >
                  {fishFarmers?.map((fish: any) => {
                    return (
                      <MenuItem value={String(fish.id)} key={fish.id}>
                        {fish.name}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Box> */}
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
              marginleft: "auto",
            }}
          >
            Add
          </Button>
        </form>
      </Box>
    </>
  );
}

export default AddUnitForm;
