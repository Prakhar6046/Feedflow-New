"use client";
import {
  Box,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  Switch,
  SwitchProps,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useEffect, useState } from "react";

import Loader from "@/app/_components/Loader";
import { SubmitHandler, useForm } from "react-hook-form";

import toast from "react-hot-toast";
import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { AddUserFormInputs, SingleUser } from "../_typeModels/User";
import { SingleOrganisation } from "../_typeModels/Organization";

interface Props {
  organisations?: SingleOrganisation[];
}
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

export default function AddNewUser({ organisations }: Props) {
  const router = useRouter();
  const loggedUser: any = getCookie("logged-user");
  const [userData, setUserData] = useState<{ data: SingleUser }>();
  const [selectedOrganisation, setSelectedOrganisation] = useState<any>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [currentUserId, setCurrentUserId] = useState<Number>();
  const [profilePic, setProfilePic] = useState<String>();
  const [imagePath, setImagePath] = useState<FileList>();

  const {
    register,
    setValue,
    handleSubmit,
    getValues,
    reset,
    formState: { errors },
  } = useForm<AddUserFormInputs>();
  const onSubmit: SubmitHandler<AddUserFormInputs> = async (data) => {
    if (data.email && data.name && data.organisationId) {
      const response = await fetch("/api/add-new-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const responseData = await response.json();
      if (responseData.status) {
        if (imagePath) {
          const formData = new FormData();
          formData.append("image", imagePath[0]);
          const oldImageName = profilePic?.split("/").pop()?.split(".")[0];
          formData.append("oldImageName", oldImageName || "");
          formData.append("userId", responseData.data.id);
          const response = await fetch(`/api/profile-pic/upload`, {
            method: "POST",
            body: formData,
          });
          const updatedUser = await response.json();
          setProfilePic(updatedUser.data.imageUrl);
        }
      } else {
        toast.error(responseData.message);
      }
      if (response.ok) {
        toast.success(responseData.message);
        router.push("/dashboard/user");
        reset();
      }
    }
  };
  const handleChange = (event: SelectChangeEvent) => {
    setSelectedOrganisation(event.target.value as string);
  };
  const handleUpload = async (imagePath: FileList) => {
    setImagePath(imagePath);
  };

  useEffect(() => {
    if (loggedUser) {
      const user = JSON.parse(loggedUser);
      setCurrentUserId(user.data.user.id);
    }
  }, [loggedUser]);

  if (loading) {
    return <Loader />;
  }
  return (
    <>
      <Stack pb={5}>
        {/* Profile Section Start */}
        <Stack
          sx={{
            borderRadius: "14px",
            boxShadow: "0px 0px 5px #C5C5C5",
            mt: 4,
            padding: 3,
          }}
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container>
              <Grid
                item
                md={3}
                xs={12}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-start",
                  gap: {
                    sm: 5,
                    xs: 3,
                  },
                  alignItems: "center",
                }}
              >
                <Typography
                  variant="h6"
                  color="rgb(99, 115, 129)"
                  fontSize={14}
                  alignSelf={"flex-start"}
                >
                  Profile Picture
                </Typography>
                <Button
                  component="label"
                  style={{
                    backgroundImage: `url(${profilePic})`,
                    backgroundSize: "100% 100%",
                  }}
                  role={undefined}
                  variant="contained"
                  tabIndex={-1}
                  startIcon={<CloudUploadIcon />}
                  className="upload-file-input"
                  sx={{
                    textTransform: "unset",
                    fontSize: 12,
                    width: 140,
                    height: 140,
                    borderRadius: 100,
                    border: "7px solid white",
                    outline: "1px dashed rgba(145, 158, 171, 0.32)",
                    backgroundColor: "rgb(244, 246, 248)",
                    boxShadow: "none",
                    color: "rgb(99, 115, 129)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  Upload photo
                  <VisuallyHiddenInput
                    type="file"
                    {...register("image", {
                      onChange: (e) => handleUpload(e.target.files),
                    })}
                    multiple
                  />
                </Button>
              </Grid>

              <Grid
                item
                md={9}
                sx={{
                  mt: {
                    md: 0,
                    xs: 3,
                  },
                }}
              >
                <Typography
                  variant="subtitle1"
                  fontWeight={500}
                  color="black"
                  fontSize={16}
                  alignSelf={"flex-start"}
                  marginBottom={1}
                >
                  Information
                </Typography>

                <Box mb={2} width={"100%"}>
                  <TextField
                    label="Name *"
                    type="text"
                    className="form-input"
                    {...register("name", {
                      required: true,
                    })}
                    sx={{
                      width: "100%",
                    }}
                  />
                  {errors && errors.name && errors.name.type === "required" && (
                    <Typography
                      variant="body2"
                      color="red"
                      fontSize={13}
                      mt={0.5}
                    >
                      This field is required.
                    </Typography>
                  )}
                </Box>

                <Box width={"100%"} mb={2}>
                  <TextField
                    label={"Email *"}
                    type="email"
                    className="form-input"
                    {...register("email", {
                      required: true,
                    })}
                    sx={{
                      width: "100%",
                    }}
                  />
                  {errors &&
                    errors.email &&
                    errors.email.type === "required" && (
                      <Typography
                        variant="body2"
                        color="red"
                        fontSize={13}
                        mt={0.5}
                      >
                        This field is required.
                      </Typography>
                    )}
                </Box>

                <Box width={"100%"}>
                  <FormControl fullWidth className="form-input">
                    <InputLabel id="demo-simple-select-label">
                      Organisation *
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={selectedOrganisation}
                      label="Organisation *"
                      {...register("organisationId", {
                        required: true,
                      })}
                      onChange={handleChange}
                    >
                      {organisations?.map((organisation, i) => {
                        return (
                          <MenuItem value={Number(organisation.id)} key={i}>
                            {organisation.name}
                          </MenuItem>
                        );
                      })}
                    </Select>
                    {errors &&
                      errors.organisationId &&
                      errors.organisationId.type === "required" && (
                        <Typography
                          variant="body2"
                          color="red"
                          fontSize={13}
                          mt={0.5}
                        >
                          This field is required.
                        </Typography>
                      )}
                  </FormControl>
                </Box>

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
                  Create New User
                </Button>
              </Grid>
            </Grid>
          </form>
        </Stack>
      </Stack>
    </>
  );
}
