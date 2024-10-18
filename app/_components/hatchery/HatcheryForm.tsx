import { Box, TextField } from "@mui/material";
import React, { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
interface FormInputs {
  hatcheryName: String;
  hatcheryCode: String;
  fishSpecie: String;
  hatcheryAltitude: String;
}
interface Props {
  altitude: String;
}
function HatcheryForm({ altitude }: Props) {
  const { register, handleSubmit, setValue, watch } = useForm<FormInputs>();
  const onSubmit: SubmitHandler<FormInputs> = (data) => {
    console.log(data);
  };
  useEffect(() => {
    if (altitude) {
      setValue("hatcheryAltitude", altitude);
    }
  }, [altitude]);
  console.log(altitude);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box width={"100%"}>
        <TextField
          label="Hatchery Name *"
          type="text"
          className="form-input"
          {...register("hatcheryName", {
            required: true,
            // pattern: validationPattern.alphabetsNumbersAndSpacesPattern,
          })}
          // disabled
          sx={{
            width: "100%",
            mt: 2,
          }}
          focused
          // focused={true}
          // value={userData?.data.email ?? "Demo@gmail.com"}
        />
        {/* {errors &&
                  errors.organisationCode &&
                  errors.organisationCode.type === "required" && (
                    <Typography
                      variant="body2"
                      color="red"
                      fontSize={13}
                      mt={0.5}
                    >
                      {validationMessage.required}
                    </Typography>
                  )}
                {errors &&
                  errors.organisationCode &&
                  errors.organisationCode.type === "pattern" && (
                    <Typography
                      variant="body2"
                      color="red"
                      fontSize={13}
                      mt={0.5}
                    >
                      {validationMessage.OnlyAlphabetsandNumberMessage}
                    </Typography>
                  )} */}
        <TextField
          label="Hatchery Code *"
          type="text"
          className="form-input"
          {...register("hatcheryCode", {
            required: true,
            // pattern: validationPattern.alphabetsNumbersAndSpacesPattern,
          })}
          // disabled
          sx={{
            width: "100%",
            mt: 2,
          }}
          focused
          // focused={true}
          // value={userData?.data.email ?? "Demo@gmail.com"}
        />
        {/* {errors &&
                  errors.organisationCode &&
                  errors.organisationCode.type === "required" && (
                    <Typography
                      variant="body2"
                      color="red"
                      fontSize={13}
                      mt={0.5}
                    >
                      {validationMessage.required}
                    </Typography>
                  )}
                {errors &&
                  errors.organisationCode &&
                  errors.organisationCode.type === "pattern" && (
                    <Typography
                      variant="body2"
                      color="red"
                      fontSize={13}
                      mt={0.5}
                    >
                      {validationMessage.OnlyAlphabetsandNumberMessage}
                    </Typography>
                  )} */}
        <TextField
          label="Hatchery Altitude *"
          type="text"
          className="form-input"
          {...register("hatcheryAltitude", {
            required: true,
            // pattern: validationPattern.alphabetsNumbersAndSpacesPattern,
          })}
          // disabled
          sx={{
            width: "100%",
            mt: 2,
          }}
          focused
          // focused={watch("hatcheryAltitude") ? true : false}
          // value={userData?.data.email ?? "Demo@gmail.com"}
        />
        {/* {errors &&
                  errors.organisationCode &&
                  errors.organisationCode.type === "required" && (
                    <Typography
                      variant="body2"
                      color="red"
                      fontSize={13}
                      mt={0.5}
                    >
                      {validationMessage.required}
                    </Typography>
                  )}
                {errors &&
                  errors.organisationCode &&
                  errors.organisationCode.type === "pattern" && (
                    <Typography
                      variant="body2"
                      color="red"
                      fontSize={13}
                      mt={0.5}
                    >
                      {validationMessage.OnlyAlphabetsandNumberMessage}
                    </Typography>
                  )} */}
        <TextField
          label="Fish Specie *"
          type="text"
          className="form-input"
          {...register("fishSpecie", {
            required: true,
            // pattern: validationPattern.alphabetsNumbersAndSpacesPattern,
          })}
          // disabled
          sx={{
            width: "100%",
            mt: 2,
          }}
          focused
          // focused={true}
          // value={userData?.data.email ?? "Demo@gmail.com"}
        />
        {/* {errors &&
                  errors.organisationCode &&
                  errors.organisationCode.type === "required" && (
                    <Typography
                      variant="body2"
                      color="red"
                      fontSize={13}
                      mt={0.5}
                    >
                      {validationMessage.required}
                    </Typography>
                  )}
                {errors &&
                  errors.organisationCode &&
                  errors.organisationCode.type === "pattern" && (
                    <Typography
                      variant="body2"
                      color="red"
                      fontSize={13}
                      mt={0.5}
                    >
                      {validationMessage.OnlyAlphabetsandNumberMessage}
                    </Typography>
                  )} */}
      </Box>
    </form>
  );
}

export default HatcheryForm;
