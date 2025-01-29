"use client";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import {
  Box,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import { useEffect, useState } from "react";

import Loader from "@/app/_components/Loader";
import { SubmitHandler, useForm } from "react-hook-form";

import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { SingleOrganisation } from "../_typeModels/Organization";
import { AddUserFormInputs, SingleUser } from "../_typeModels/User";

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
  const [error, setError] = useState<string | null>(null);
  const [isApiCallInProgress, setIsApiCallInProgress] =
    useState<boolean>(false);

  const {
    register,
    handleSubmit,
    clearErrors,
    reset,
    formState: { errors },
  } = useForm<AddUserFormInputs>();
  const onSubmit: SubmitHandler<AddUserFormInputs> = async (data) => {
    // Prevent API call if one is already in progress
    if (isApiCallInProgress) return;
    setIsApiCallInProgress(true);

    try {
      if (data.email && data.name && data.organisationId) {
        const response = await fetch("/api/add-new-user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...data, image: profilePic }),
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
          toast.dismiss();
          toast.error(responseData.message);
        }
        if (response.ok) {
          toast.dismiss();
          toast.success(responseData.message);
          router.push("/dashboard/user");
          reset();
        }
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsApiCallInProgress(false);
    }
  };
  const handleChange = (event: SelectChangeEvent) => {
    clearErrors("organisationId");
    setSelectedOrganisation(event.target.value as string);
  };

  const handleUpload = async (imagePath: FileList) => {
    const file = imagePath[0];
    const allowedTypes = ["image/jpeg", "image/png", "image/svg+xml"];
    if (!allowedTypes.includes(file?.type)) {
      toast.dismiss();
      toast.error(
        "Invalid file type. Please upload an image in .jpg, .jpeg, .png or.svg format."
      );
      return;
    }
    // Validate file size
    const maxSizeInMB = 2;
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
      toast.dismiss();
      toast.error(
        `File size exceeds ${maxSizeInMB}MB. Please upload a smaller file.`
      );
      return;
    }

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
      toast.dismiss();
      toast.success("Profile photo successfully uploaded");
    }
  };
  useEffect(() => {
    if (loggedUser) {
      const user = JSON.parse(loggedUser);
      setCurrentUserId(user.id);
    }
  }, [loggedUser]);

  useEffect(() => {
    router.refresh();
  }, []);
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
                    // sm: 5,
                    // xs: 3,
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
                  startIcon={!profilePic && <CloudUploadIcon />}
                  className="upload-file-input1"
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
                    position: "relative",
                  }}
                >
                  {!profilePic && "Upload photo"}
                  <VisuallyHiddenInput
                    type="file"
                    {...register("image", {
                      onChange: (e) => handleUpload(e.target.files),
                    })}
                    accept=".jpg,.jpeg,.png,.svg"
                  />
                </Button>
                {profilePic && (
                  <Box
                    display={"flex"}
                    gap="10px"
                    alignItems={"center"}
                    mt={"8px"}
                  >
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
                        // position: "absolute",
                        // bottom: "1%",
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
                        accept=".jpg,.jpeg,.png,.svg"
                      />
                    </Button>
                  </Box>
                )}
                <Typography
                  variant="body1"
                  fontSize={12}
                  textAlign={"center"}
                  margin="0 auto"
                  color="#979797"
                >
                  Allowed *.jpeg, *.jpg, *.png,*.svg <br />
                  max size of 2M byte
                </Typography>
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
                    focused
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
                    focused
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
                <Box mb={2} width={"100%"}>
                  <FormControl fullWidth className="form-input" focused>
                    <InputLabel
                      id="demo-simple-select-label"
                      className="user-info"
                    >
                      Organisation *
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={selectedOrganisation}
                      label="Organisation *"
                      sx={{
                        width: "100%",
                      }}
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
                  disabled={isApiCallInProgress}
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
