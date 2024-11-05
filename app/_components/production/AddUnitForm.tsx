"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import * as validationPattern from "@/app/_lib/utils/validationPatterns/index";
import * as validationMessage from "@/app/_lib/utils/validationsMessage/index";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { Dayjs } from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useRouter } from "next/navigation";
import { FishSupply } from "@/app/_typeModels/fishSupply";
import { Farm } from "@/app/_typeModels/Farm";
import toast from "react-hot-toast";
import { getCookie } from "cookies-next";
import { getDayMonthDifference } from "@/app/_lib/utils";
interface FormInputs {
  fishFarm: String;
  productionUnit: String;
  batchNumber: String;
  biomass: String;
  age: Dayjs | null;
  fishCount: String;
  meanLength: String;
  meanWeight: String;
  stockingDensityKG: String;
  stockingDensityNM: String;
  stockingLevel: String;
}
interface Props {
  farms: Farm[];
}
function AddUnitForm({ farms }: Props) {
  let mCubed = "m\u00B3";
  const [selectedFarm, setSelectedFarm] = useState<any>(null);
  const loggedUser: any = getCookie("logged-user");
  const user = JSON.parse(loggedUser);
  const router = useRouter();
  const {
    register,
    setValue,
    watch,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormInputs>();

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    const { fishFarm, productionUnit, age, ...restData } = data;
    const payload = {
      organisationId: user.organisationId,
      fishFarmId: fishFarm,
      productionUnitId: productionUnit,
      age: getDayMonthDifference(data.age),
      ...restData,
    };

    const response = await fetch(`/api/production`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const responseData = await response.json();
    toast.success(responseData.message);

    if (responseData.status) {
      router.push("/dashboard/production");
    }
  };
  // Get selected farm's production units
  const productionUnits =
    farms.find((farm) => farm.id === selectedFarm)?.productionUnits || [];
  useEffect(() => {
    router.refresh();
  }, [router]);

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
                onChange={(e) => {
                  setSelectedFarm(e.target.value); // Set selected farm
                  setValue("fishFarm", e.target.value);
                  setValue("productionUnit", ""); // Reset production unit when fish farm changes
                }}
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
                Production Unit *
              </InputLabel>
              <Select
                labelId="feed-supply-select-label2"
                id="feed-supply-select2"
                {...register("productionUnit", {
                  required: watch("productionUnit") ? false : true,
                  onChange: (e) => setValue("productionUnit", e.target.value),
                })}
                label="Production Unit *"
                value={watch("productionUnit") || ""}
              >
                {productionUnits.length > 0 ? (
                  productionUnits.map((unit) => (
                    <MenuItem value={String(unit.id)} key={unit.id}>
                      {unit.name}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem value="" disabled>
                    No units available
                  </MenuItem>
                )}
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
              label="Batch Number *"
              type="text"
              className="form-input"
              // focused={altitude ? true : false}
              {...register("batchNumber", {
                required: true,
                // pattern: validationPattern.negativeNumberWithDot,
              })}
              sx={{
                width: "100%",
              }}
            />

            {errors &&
              errors.batchNumber &&
              errors.batchNumber.type === "required" && (
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
              label="Fish Count *"
              type="text"
              className="form-input"
              // focused={altitude ? true : false}
              {...register("fishCount", {
                required: true,
                pattern: validationPattern.negativeNumberWithDot,
              })}
              sx={{
                width: "100%",
              }}
            />

            {errors &&
              errors.fishCount &&
              errors.fishCount.type === "required" && (
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
          <Grid item mb={2} width={"100%"}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Controller
                name="age"
                control={control}
                rules={{ required: "This field is required." }}
                render={({ field, fieldState: { error } }) => (
                  <>
                    <DatePicker
                      {...field}
                      label="Age *"
                      className="form-input"
                      sx={{
                        width: "100%",
                      }}
                      onChange={(date) => {
                        field.onChange(date);
                      }}
                      value={field.value || null}
                    />
                    {error && (
                      <Typography
                        variant="body2"
                        color="red"
                        fontSize={13}
                        mt={0.5}
                      >
                        {error.message}
                      </Typography>
                    )}
                  </>
                )}
              />
            </LocalizationProvider>
          </Grid>
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
                label="Mean Length *"
                type="text"
                className="form-input"
                // focused={altitude ? true : false}
                {...register("meanLength", {
                  required: true,
                  pattern: validationPattern.negativeNumberWithDot,
                })}
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

              {errors &&
                errors.meanLength &&
                errors.meanLength.type === "required" && (
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
                label={`% Stocking Density(n/${mCubed})  *`}
                type="text"
                className="form-input"
                // focused={altitude ? true : false}
                {...register("stockingDensityNM", {
                  required: true,
                  pattern: validationPattern.negativeNumberWithDot,
                })}
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
                {`n/${mCubed}`}
              </Typography>
              {errors &&
                errors.stockingDensityNM &&
                errors.stockingDensityNM.type === "required" && (
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
                label={`% Stocking Density(kg/${mCubed}) *`}
                type="text"
                className="form-input"
                // focused={altitude ? true : false}
                {...register("stockingDensityKG", {
                  required: true,
                  pattern: validationPattern.negativeNumberWithDot,
                })}
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
                {`kg/${mCubed}`}
              </Typography>
              {errors &&
                errors.stockingDensityKG &&
                errors.stockingDensityKG.type === "required" && (
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
                {...register("stockingLevel", {
                  required: true,
                  pattern: validationPattern.negativeNumberWithDot,
                })}
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
                %
              </Typography>
              {errors &&
                errors.stockingLevel &&
                errors.stockingLevel.type === "required" && (
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
          {/* <Button
            type="submit"
            variant="contained"
            sx={{
              background: "#06A19B",
              fontWeight: 600,
              padding: "6px 16px",
              width: "fit-content",
              textTransform: "capitalize",
              borderRadius: "8px",
              textAlign: "end",
            }}
          >
            Add
          </Button> */}
          <Box display={"flex"} justifyContent="flex-end" mt={2}>
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
                textAlign: "end",
              }}
            >
              Add
            </Button>
          </Box>
        </form>
      </Box>
    </>
  );
}

export default AddUnitForm;
