"use client";
// import UploadFileOutlinedIcon from '@mui/icons-material/UploadFileOutlined';
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import * as validationPattern from "@/app/_lib/utils/validationPatterns/index";
import * as validationMessage from "@/app/_lib/utils/validationsMessage/index";
import Select, { SelectChangeEvent } from "@mui/material/Select";

import {
  Box,
  Button,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  Menu,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import {
  selectOrganisationLoading,
  selectOrganisations,
} from "@/lib/features/organisation/organisationSlice";
import { useAppSelector } from "@/lib/hooks";
import { styled } from "@mui/material/styles";
import Link from "next/link";
import { NextPage } from "next";
import { useEffect, useState } from "react";

import Loader from "@/app/_components/Loader";
import {
  FieldErrors,
  SubmitHandler,
  useFieldArray,
  useForm,
} from "react-hook-form";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { AddOrganizationFormInputs } from "../_typeModels/Organization";
import MapComponent from "./farm/MapComponent";
import HatcheryForm from "./hatchery/HatcheryForm";
const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

export const OrganisationType = [
  "Fish Farmer",
  "Hatchery",
  "Feed Supplier",
  "Testing Facility",
  "Unspecified",
];
export const RoleType = ["Admin", "Member"];
const AddNewOrganisation = () => {
  const [profilePic, setProfilePic] = useState<String>();
  const router = useRouter();
  const [isHatcherySelected, setIsHatcherySelected] = useState<boolean>(false);
  const [isApiCallInProgress, setIsApiCallInProgress] =
    useState<boolean>(false);
  const [addressInformation, setAddressInformation] = useState<any>();
  const [useAddress, setUseAddress] = useState<boolean>(false);
  const [searchedAddress, setSearchedAddress] = useState<any>();
  const [altitude, setAltitude] = useState<String>("");
  const {
    register,
    setValue,
    handleSubmit,
    control,
    getValues,
    watch,
    reset,
    trigger,
    formState: { errors },
  } = useForm<AddOrganizationFormInputs>({
    defaultValues: {
      contacts: [{ name: "", role: "", email: "", phone: "" }],
    },
    mode: "onChange",
  });

  const onSubmit: SubmitHandler<AddOrganizationFormInputs> = async (data) => {
    // Prevent API call if one is already in progress
    if (isApiCallInProgress) return;
    setIsApiCallInProgress(true);
    try {
      if (data) {
        const response = await fetch("/api/add-organisation", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...data, imageUrl: profilePic }),
        });
        const responseData = await response.json();
        toast.success(responseData.message);
        if (responseData.status) {
          router.push("/dashboard/organisation");
          reset();
        }
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsApiCallInProgress(false);
    }
  };

  const { fields, append, remove } = useFieldArray({
    control,
    name: "contacts",
  });
  const AddContactField = () => {
    const conatcts = watch("contacts");
    if (conatcts) {
      const lastContact = conatcts[conatcts.length - 1];

      if (
        lastContact &&
        lastContact.name &&
        lastContact.role &&
        lastContact.email &&
        lastContact.phone
      ) {
        append({ name: "", role: "", email: "", phone: "" });
      } else {
        toast.dismiss();
        toast.error("Please fill previous contact details.");
      }
    }
  };
  const handleUpload = async (imagePath: FileList) => {
    const formData = new FormData();
    formData.append("image", imagePath[0]);
    const oldImageName = profilePic?.split("/").pop()?.split(".")[0];

    formData.append("oldImageName", oldImageName || "");

    const response = await fetch(`/api/profile-pic/upload/new`, {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      const profileData = await response.json();
      setProfilePic(profileData.data.url);
    }
  };
  useEffect(() => {
    if (watch("organisationType") === "Hatchery") {
      setIsHatcherySelected(true);
    } else {
      setIsHatcherySelected(false);
    }
  }, [watch("organisationType")]);
  useEffect(() => {
    if (addressInformation && useAddress && altitude) {
      setValue("address", addressInformation.address);
      setValue("city", addressInformation.city);
      setValue("postCode", addressInformation.postcode);
      setValue("province", addressInformation.state);
      setValue("country", addressInformation.country);

      setUseAddress(false);
    }
  }, [addressInformation, useAddress]);

  return (
    <Stack
      sx={{
        borderRadius: "14px",
        boxShadow: "0px 0px 16px 5px #0000001A",
        mt: 4,
      }}
    >
      <Box
        sx={{
          p: {
            md: 3,
            xs: 2,
          },
          fontSize: 20,
          fontWeight: 600,
          borderColor: "#0000001A",
        }}
      >
        Information
      </Box>

      <Divider />

      <Grid
        container
        sx={{
          p: {
            md: 3,
            xs: 2,
          },
        }}
      >
        <Grid
          item
          xl={3}
          md={5}
          xs={12}
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            gap: 3,
            alignItems: {
              md: "flex-start",
              xs: "center",
            },
          }}
        >
          <Button
            component="label"
            role={undefined}
            variant="contained"
            tabIndex={-1}
            style={{
              backgroundImage: `url(${profilePic})`,
              backgroundSize: "contain",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              marginInline: "0 !important",
            }}
            startIcon={!profilePic && <CloudUploadIcon />}
            className="upload-file-input custom-margin"
            sx={{
              textTransform: "unset",
              fontSize: 12,
              width: {
                md: "90%",
                xs: "100%",
              },
              height: 200,
              borderRadius: 3,
              border: "7px solid white",
              outline: "1px dashed rgba(145, 158, 171, 0.32)",
              backgroundColor: "rgb(244, 246, 248)",
              boxShadow: "none",
              color: "rgb(99, 115, 129)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              position: "relative",
            }}
          >
            <Box>{!profilePic && "Drag file here or Upload from Device"}</Box>
            <VisuallyHiddenInput
              type="file"
              {...register("image", {
                onChange: (e) => handleUpload(e.target.files),
              })}
              multiple
            />
            <Button
              component="label"
              variant="contained"
              sx={{
                background: "#06A19B",
                color: "#fff",
                fontWeight: 600,
                padding: "4px",
                textTransform: "capitalize",
                borderRadius: "10px",
                border: "1px solid #06A19B",
                position: "absolute",
                bottom: "1%",
                display: "flex",
                alignItems: "center",
                gap: "2px",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1em"
                height="1em"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="M3 21v-4.25L16.2 3.575q.3-.275.663-.425t.762-.15t.775.15t.65.45L20.425 5q.3.275.438.65T21 6.4q0 .4-.137.763t-.438.662L7.25 21zM17.6 7.8L19 6.4L17.6 5l-1.4 1.4z"
                />
              </svg>
              Edit
              <VisuallyHiddenInput
                type="file"
                {...register("image", {
                  onChange: (e) => handleUpload(e.target.files),
                })}
                multiple
              />
            </Button>
          </Button>

          <Box
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
            flexDirection={"row"}
            sx={{
              width: {
                md: "90%",
                xs: "100%",
              },
            }}
          >
            <Typography
              variant="body1"
              fontSize={12}
              textAlign={"center"}
              margin="0 auto"
              color="#979797"
            >
              Allowed *.jpeg, *.jpg, *.png, *.gif <br />
              max size of 3.15M byte
            </Typography>
          </Box>
        </Grid>

        <Grid
          item
          xl={9}
          md={7}
          xs={12}
          sx={{
            mt: {
              md: 0,
              xs: 5,
            },
          }}
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box mb={2}>
              <TextField
                label="Organisation Name *"
                type="text"
                className="form-input"
                focused
                {...register("organisationName", {
                  required: true,
                  pattern: validationPattern.alphabetsNumbersAndSpacesPattern,
                })}
                // focused={userData?.data.name ? true : false}
                // value={userData?.data.name}
                sx={{
                  width: "100%",
                }}
              />
              {errors &&
                errors.organisationName &&
                errors.organisationName.type === "required" && (
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
                errors.organisationName &&
                errors.organisationName.type === "pattern" && (
                  <Typography
                    variant="body2"
                    color="red"
                    fontSize={13}
                    mt={0.5}
                  >
                    {validationMessage.OnlyAlphabetsandNumberMessage}
                  </Typography>
                )}
            </Box>
            <Stack
              display={"flex"}
              justifyContent={"flex-start"}
              direction={"row"}
              sx={{
                width: "100%",
                marginBottom: 2,
                gap: 1.5,
              }}
            >
              <Box width={"100%"}>
                <TextField
                  label="Organisation Code *"
                  type="text"
                  className="form-input"
                  {...register("organisationCode", {
                    required: true,
                    // pattern: validationPattern.alphabetsNumbersAndSpacesPattern,
                  })}
                  // disabled
                  sx={{
                    width: "100%",
                  }}
                  focused
                  // focused={true}
                  // value={userData?.data.email ?? "Demo@gmail.com"}
                />
                {errors &&
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
              </Box>
            </Stack>
            <FormControl className="form-input" focused fullWidth>
              <InputLabel id="demo-simple-select-label">
                Organisation Type *
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Production Unit Type"
                {...register("organisationType", {
                  required: watch("organisationType") ? false : true,
                  onChange: (e) => setValue("organisationType", e.target.value),
                })}
              >
                {OrganisationType.map((organisation, i) => {
                  return (
                    <MenuItem value={organisation} key={i}>
                      {organisation}
                    </MenuItem>
                  );
                })}
              </Select>

              {errors && errors.organisationType && (
                <Typography variant="body2" color="red" fontSize={13} mt={0.5}>
                  {validationMessage.required}
                </Typography>
              )}
            </FormControl>
            {isHatcherySelected && (
              <HatcheryForm
                altitude={altitude}
                register={register}
                setValue={setValue}
                watch={watch}
                trigger={trigger}
                errors={errors}
              />
            )}
            <Typography
              variant="subtitle1"
              color="black"
              fontWeight={500}
              fontSize={16}
              marginTop={3}
              marginBottom={2}
            >
              Address
            </Typography>
            <Stack
              display={"flex"}
              justifyContent={"flex-start"}
              direction={"row"}
              sx={{
                width: "100%",
                marginBottom: 2,
                gap: 1.5,
              }}
            >
              <Box width={"100%"}>
                <TextField
                  label="Address *"
                  type="text"
                  className="form-input"
                  {...register("address", {
                    required: true,
                    pattern: validationPattern.addressPattern,
                  })}
                  focused
                  sx={{
                    width: "100%",
                  }}
                />
                {errors &&
                  errors.address &&
                  errors.address.type === "required" && (
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
                  errors.address &&
                  errors.address.type === "pattern" && (
                    <Typography
                      variant="body2"
                      color="red"
                      fontSize={13}
                      mt={0.5}
                    >
                      {validationMessage.AddressMessage}
                    </Typography>
                  )}
              </Box>

              <Box width={"100%"}>
                <TextField
                  label="City *"
                  type="text"
                  className="form-input"
                  {...register("city", {
                    required: true,
                    pattern:
                      validationPattern.alphabetsSpacesAndSpecialCharsPattern,
                  })}
                  focused
                  sx={{
                    width: "100%",
                  }}
                />
                {errors && errors.city && errors.city.type === "required" && (
                  <Typography
                    variant="body2"
                    color="red"
                    fontSize={13}
                    mt={0.5}
                  >
                    {validationMessage.required}
                  </Typography>
                )}
                {errors && errors.city && errors.city.type === "pattern" && (
                  <Typography
                    variant="body2"
                    color="red"
                    fontSize={13}
                    mt={0.5}
                  >
                    {validationMessage.alphabetswithSpecialCharacter}
                  </Typography>
                )}
              </Box>
            </Stack>
            <Stack
              display={"flex"}
              justifyContent={"flex-start"}
              direction={"row"}
              sx={{
                width: "100%",
                marginBottom: 2,
                gap: 1.5,
              }}
            >
              <Box width={"100%"}>
                <TextField
                  label="Province *"
                  type="text"
                  className="form-input"
                  {...register("province", {
                    required: true,
                    pattern:
                      validationPattern.alphabetsSpacesAndSpecialCharsPattern,
                  })}
                  focused
                  sx={{
                    width: "100%",
                  }}
                />
                {errors &&
                  errors.province &&
                  errors.province.type === "required" && (
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
                  errors.province &&
                  errors.province.type === "pattern" && (
                    <Typography
                      variant="body2"
                      color="red"
                      fontSize={13}
                      mt={0.5}
                    >
                      {validationMessage.alphabetswithSpecialCharacter}
                    </Typography>
                  )}
              </Box>

              <Box width={"100%"}>
                <TextField
                  label="Post Code *"
                  type="text"
                  className="form-input"
                  {...register("postCode", {
                    required: true,
                    pattern: validationPattern.onlyNumbersPattern,
                  })}
                  focused
                  sx={{
                    width: "100%",
                  }}
                />
                {errors &&
                  errors.postCode &&
                  errors.postCode.type === "required" && (
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
                  errors.postCode &&
                  errors.postCode.type === "pattern" && (
                    <Typography
                      variant="body2"
                      color="red"
                      fontSize={13}
                      mt={0.5}
                    >
                      {validationMessage.onlyNumbers}
                    </Typography>
                  )}
              </Box>
            </Stack>
            <Stack
              display={"flex"}
              justifyContent={"flex-start"}
              direction={"row"}
              sx={{
                width: "100%",
                marginBottom: 2,
                gap: 1.5,
              }}
            >
              <Box width={"50%"}>
                <TextField
                  label="Country *"
                  type="text"
                  className="form-input"
                  {...register("country", {
                    required: true,
                    pattern: validationPattern.alphabetsAndSpacesPattern,
                  })}
                  focused
                  sx={{
                    width: "100%",
                  }}
                />
                {errors &&
                  errors.country &&
                  errors.country.type === "required" && (
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
                  errors.country &&
                  errors.country.type === "pattern" && (
                    <Typography
                      variant="body2"
                      color="red"
                      fontSize={13}
                      mt={0.5}
                    >
                      {validationMessage.alphabetswithSpecialCharacter}
                    </Typography>
                  )}
              </Box>
            </Stack>
            <Box display={"flex"} justifyContent={"end"} width={"100%"}>
              <MapComponent
                setAddressInformation={setAddressInformation}
                setSearchedAddress={setSearchedAddress}
                setUseAddress={setUseAddress}
                isCalAltitude={true}
                setAltitude={setAltitude}
              />
            </Box>
            <Typography
              variant="subtitle1"
              color="black"
              fontWeight={500}
              marginTop={3}
              marginBottom={2}
            >
              Contacts
            </Typography>
            {fields.map((item, index) => (
              <Stack
                key={item.id}
                display={"flex"}
                direction={"row"}
                sx={{
                  width: "100%",
                  marginBottom: 2,
                  gap: 1.5,
                  flexWrap: {
                    lg: "nowrap",
                    xs: "wrap",
                  },
                  justifyContent: {
                    md: "center",
                  },
                }}
              >
                <Box
                  sx={{
                    width: {
                      lg: "100%",
                      md: "48.4%",
                      xs: "100%",
                    },
                  }}
                >
                  <TextField
                    label="Name *"
                    type="text"
                    className="form-input"
                    {...register(`contacts.${index}.name` as const, {
                      required: true,
                      pattern: validationPattern.alphabetsAndSpacesPattern,
                    })}
                    focused
                    sx={{
                      width: "100%",
                    }}
                  />

                  {errors &&
                    errors?.contacts &&
                    errors?.contacts[index] &&
                    errors?.contacts[index]?.name &&
                    errors?.contacts[index]?.name.type === "required" && (
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
                    errors?.contacts &&
                    errors?.contacts[index] &&
                    errors?.contacts[index]?.name &&
                    errors?.contacts[index]?.name.type === "pattern" && (
                      <Typography
                        variant="body2"
                        color="red"
                        fontSize={13}
                        mt={0.5}
                      >
                        {validationMessage.OnlyAlphabatsMessage}
                      </Typography>
                    )}
                </Box>

                <Box
                  sx={{
                    width: {
                      lg: "100%",
                      md: "48.4%",
                      xs: "100%",
                    },
                  }}
                >
                  <FormControl className="form-input" focused fullWidth>
                    <InputLabel id="demo-simple-select-label">
                      Role *
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      label="Role *"
                      {...register(`contacts.${index}.role` as const, {
                        required: watch(`contacts.${index}.role`)
                          ? false
                          : true,
                        onChange: (e) =>
                          setValue(`contacts.${index}.role`, e.target.value),
                        // pattern: validationPattern.alphabetsAndSpacesPattern,
                      })}
                    >
                      {RoleType.map((role, i) => {
                        return (
                          <MenuItem value={role} key={i}>
                            {role}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                  {errors &&
                    errors?.contacts &&
                    errors?.contacts[index] &&
                    errors?.contacts[index]?.role &&
                    errors?.contacts[index]?.role.type === "required" && (
                      <Typography
                        variant="body2"
                        color="red"
                        fontSize={13}
                        mt={0.5}
                      >
                        {validationMessage.required}
                      </Typography>
                    )}
                </Box>

                <Box
                  sx={{
                    width: {
                      lg: "100%",
                      md: "48.4%",
                      xs: "100%",
                    },
                  }}
                >
                  <TextField
                    label="Email *"
                    type="text"
                    className="form-input"
                    {...register(`contacts.${index}.email` as const, {
                      required: true,
                      pattern: validationPattern.emailPattern,
                    })}
                    focused
                    sx={{
                      width: "100%",
                    }}
                  />
                  {errors &&
                    errors?.contacts &&
                    errors?.contacts[index] &&
                    errors?.contacts[index]?.email &&
                    errors?.contacts[index]?.email.type === "required" && (
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
                    errors?.contacts &&
                    errors?.contacts[index] &&
                    errors?.contacts[index]?.email &&
                    errors?.contacts[index]?.email.type === "pattern" && (
                      <Typography
                        variant="body2"
                        color="red"
                        fontSize={13}
                        mt={0.5}
                      >
                        {validationMessage.emailPatternMessage}
                      </Typography>
                    )}
                </Box>

                <Box
                  sx={{
                    width: {
                      lg: "100%",
                      md: "48.4%",
                      xs: "100%",
                    },
                  }}
                >
                  <TextField
                    label="Phone *"
                    type="text"
                    className="form-input"
                    {...register(`contacts.${index}.phone` as const, {
                      required: true,
                      pattern: validationPattern.phonePattern,
                    })}
                    focused
                    sx={{
                      width: "100%",
                    }}
                  />
                  {errors &&
                    errors?.contacts &&
                    errors?.contacts[index] &&
                    errors?.contacts[index]?.phone &&
                    errors?.contacts[index]?.phone.type === "required" && (
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
                    errors?.contacts &&
                    errors?.contacts[index] &&
                    errors?.contacts[index]?.phone &&
                    errors?.contacts[index]?.phone.type === "pattern" && (
                      <Typography
                        variant="body2"
                        color="red"
                        fontSize={13}
                        mt={0.5}
                      >
                        {validationMessage.phonePatternMessage}
                      </Typography>
                    )}
                </Box>
                {index !== 0 && (
                  <Box
                    display={"flex"}
                    justifyContent={"center"}
                    alignItems={"center"}
                    width={150}
                    sx={{
                      cursor: "pointer",
                      width: {
                        lg: 150,
                        xs: "auto",
                      },
                    }}
                    onClick={() => remove(index)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="1.4em"
                      height="1.4em"
                      viewBox="0 0 24 24"
                    >
                      <g fill="none">
                        <path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z" />
                        <path
                          fill="#ff0000"
                          d="M14.28 2a2 2 0 0 1 1.897 1.368L16.72 5H20a1 1 0 1 1 0 2l-.003.071l-.867 12.143A3 3 0 0 1 16.138 22H7.862a3 3 0 0 1-2.992-2.786L4.003 7.07L4 7a1 1 0 0 1 0-2h3.28l.543-1.632A2 2 0 0 1 9.721 2zm3.717 5H6.003l.862 12.071a1 1 0 0 0 .997.929h8.276a1 1 0 0 0 .997-.929zM10 10a1 1 0 0 1 .993.883L11 11v5a1 1 0 0 1-1.993.117L9 16v-5a1 1 0 0 1 1-1m4 0a1 1 0 0 1 1 1v5a1 1 0 1 1-2 0v-5a1 1 0 0 1 1-1m.28-6H9.72l-.333 1h5.226z"
                        />
                      </g>
                    </svg>
                  </Box>
                )}
              </Stack>
            ))}

            <Divider
              sx={{
                borderColor: "#979797",
                my: 1,
              }}
            />
            <Stack
              p={1.5}
              direction={"row"}
              borderRadius={3}
              mt={2}
              color={"#06a19b"}
              fontSize={14}
              fontWeight={500}
              display={"flex"}
              alignItems={"center"}
              justifyContent={"center"}
              gap={0.5}
              border={"2px dashed #06a19b"}
              className="add-contact-btn"
              onClick={() => AddContactField()}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1.4em"
                height="1.4em"
                viewBox="0 0 24 24"
              >
                <path
                  fill="#06a19b"
                  d="M12 4c4.411 0 8 3.589 8 8s-3.589 8-8 8s-8-3.589-8-8s3.589-8 8-8m0-2C6.477 2 2 6.477 2 12s4.477 10 10 10s10-4.477 10-10S17.523 2 12 2m5 9h-4V7h-2v4H7v2h4v4h2v-4h4z"
                />
              </svg>
              Add Contact
            </Stack>
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
                marginLeft: "auto",
                display: "block",
                marginTop: 2,
              }}
            >
              Save New Organisation
            </Button>
          </form>
        </Grid>
      </Grid>
    </Stack>
  );
};

export default AddNewOrganisation;
