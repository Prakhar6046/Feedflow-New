"use client";
import {
  Box,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  Select,
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
import EyeClosed from "@/public/static/img/icons/ic-eye-closed.svg";
import toast from "react-hot-toast";
import { getCookie } from "cookies-next";
import { SingleUser, UserEditFormInputs } from "@/app/_typeModels/User";
import BasicBreadcrumbs from "@/app/_components/Breadcrumbs";
import { useRouter } from "next/navigation";
import Image from "next/image";
import EyeOpened from "@/public/static/img/icons/ic-eye-open.svg";
import * as validationPattern from "@/app/_lib/utils/validationPatterns/index";
import * as validationMessage from "@/app/_lib/utils/validationsMessage/index";

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

const IOSSwitch = styled((props: SwitchProps) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 42,
  height: 26,
  padding: 0,
  "& .MuiSwitch-switchBase": {
    padding: 0,
    margin: 2,
    transitionDuration: "300ms",
    "&.Mui-checked": {
      transform: "translateX(16px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        backgroundColor: "#65C466",
        opacity: 1,
        border: 0,
        ...theme.applyStyles("dark", {
          backgroundColor: "#2ECA45",
        }),
      },
      "&.Mui-disabled + .MuiSwitch-track": {
        opacity: 0.5,
      },
    },
    "&.Mui-focusVisible .MuiSwitch-thumb": {
      color: "#33cf4d",
      border: "6px solid #fff",
    },
    "&.Mui-disabled .MuiSwitch-thumb": {
      color: theme.palette.grey[100],
      ...theme.applyStyles("dark", {
        color: theme.palette.grey[600],
      }),
    },
    "&.Mui-disabled + .MuiSwitch-track": {
      opacity: 0.7,
      ...theme.applyStyles("dark", {
        opacity: 0.3,
      }),
    },
  },
  "& .MuiSwitch-thumb": {
    boxSizing: "border-box",
    width: 22,
    height: 22,
  },
  "& .MuiSwitch-track": {
    borderRadius: 26 / 2,
    backgroundColor: "#E9E9EA",
    opacity: 1,
    transition: theme.transitions.create(["background-color"], {
      duration: 500,
    }),
    ...theme.applyStyles("dark", {
      backgroundColor: "#39393D",
    }),
  },
}));

export default function Page({ params }: { params: { userId: string } }) {
  const router = useRouter();
  const loggedUser: any = getCookie("logged-user");
  const [userData, setUserData] = useState<{ data: SingleUser }>();
  const [loading, setLoading] = useState<boolean>(false);
  const [currentUserId, setCurrentUserId] = useState<Number>();
  const [profilePic, setProfilePic] = useState<String>();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setshowConfirmPassword] =
    useState<boolean>(false);
  const getUser = async () => {
    setLoading(true);
    const data = await fetch(`/api/users/${params.userId}`, { method: "GET" });
    if (data) {
      setLoading(false);
    }
    return data.json();
  };
  const {
    register,
    setValue,
    handleSubmit,
    getValues,
    resetField,
    watch,
    formState: { errors },
  } = useForm<UserEditFormInputs>();
  const onSubmit: SubmitHandler<UserEditFormInputs> = async (data) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("organisationId", String(userData?.data.organisationId));
    if (data.password) {
      formData.append("password", data.password);
    }
    const res = await fetch(`/api/users/${params.userId}`, {
      method: "PUT",
      body: formData,
    });

    if (res.ok) {
      const updatedUser = await res.json();
      toast.success(updatedUser.message);
      router.push("/dashboard/user");
      resetField("confirmPassword");
      resetField("password");
    }
  };

  const handleUpload = async (imagePath: FileList) => {
    const formData = new FormData();
    formData.append("image", imagePath[0]);
    formData.append("userId", params.userId);
    // const old: any = profilePic?.split("/");

    // formData.append("oldImageName", old ? old[old?.length - 1] : "");
    const oldImageName = profilePic?.split("/").pop()?.split(".")[0];

    formData.append("oldImageName", oldImageName || "");
    const response = await fetch(`/api/profile-pic/upload`, {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      const updatedUser = await response.json();
      setProfilePic(updatedUser.data.imageUrl);

      // toast.success(updatedUser.message);
      // resetField("confirmPassword");
      // resetField("password");
    }
  };
  useEffect(() => {
    const user = async () => {
      setLoading(true);
      const data = await getUser();
      setUserData(data);
    };
    user();
  }, []);
  useEffect(() => {
    if (loggedUser) {
      const user = JSON.parse(loggedUser);
      setCurrentUserId(user.data.user.id);
    }
  }, [loggedUser]);

  useEffect(() => {
    if (userData) {
      setValue("name", String(userData?.data?.name));
      setValue("image", String(userData?.data?.imageUrl));
      setValue("email", String(userData?.data?.email));
      setValue("organisation", String(userData?.data?.organisation.name));
      setValue(
        "organisationType",
        String(userData?.data?.organisation.organisationType)
      );
      setValue("organisationId", userData?.data?.organisationId);

      setProfilePic(userData.data.imageUrl);
    }
  }, [userData]);

  if (loading) {
    return <Loader />;
  }
  return (
    <>
      <BasicBreadcrumbs
        heading={"Edit User"}
        isTable={false}
        hideSearchInput={true}
        links={[
          { name: "Dashboard", link: "/dashboard" },
          { name: "Users", link: "/dashboard/user" },
          {
            name: "Edit User",
            link: `/dashboard/user/${params.userId}`,
          },
        ]}
      />
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
                  startIcon={profilePic ? null : <CloudUploadIcon />}
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
                  {profilePic ? "" : "Upload photo"}
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

                <Box mb={3} width={"100%"}>
                  <TextField
                    label="Name *"
                    type="text"
                    className="form-input"
                    {...register("name", {
                      required: true,
                    })}
                    focused={userData?.data.name ? true : false}
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

                <Box mb={2} width={"100%"}>
                  <TextField
                    label={"Email *"}
                    type="email"
                    className="form-input"
                    autoFocus
                    focused={true}
                    InputProps={{
                      readOnly:
                        Number(params.userId) === currentUserId ? true : false,
                    }}
                    {...register("email", {
                      required: true,
                    })}
                    sx={{
                      width: "100%",
                      backgroundColor:
                        Number(params.userId) === currentUserId
                          ? "#f0f0f0"
                          : "",
                      "& .MuiInputBase-input.Mui-disabled": {
                        backgroundColor:
                          Number(params.userId) === currentUserId
                            ? "#f0f0f0"
                            : "",
                      },
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

                <TextField
                  label="Organisation"
                  type="text"
                  className="form-input"
                  InputProps={{
                    readOnly:
                      Number(params.userId) === currentUserId ? true : false,
                  }}
                  focused={true}
                  {...register("organisation")}
                  sx={{
                    width: "100%",
                    marginBottom: 2,
                    backgroundColor:
                      Number(params.userId) === currentUserId ? "#f0f0f0" : "",
                    "& .MuiInputBase-input.Mui-disabled": {
                      backgroundColor:
                        Number(params.userId) === currentUserId
                          ? "#f0f0f0"
                          : "",
                    },
                  }}
                />
                {Number(params.userId) === currentUserId && (
                  <TextField
                    label="Organisation Type"
                    type="text"
                    className="form-input"
                    InputProps={{
                      readOnly:
                        Number(params.userId) === currentUserId ? true : false,
                    }}
                    focused={true}
                    {...register("organisationType")}
                    sx={{
                      width: "100%",
                      marginBottom: 2,
                      backgroundColor: "#f0f0f0",
                      "& .MuiInputBase-input.Mui-disabled": {
                        backgroundColor: "#f0f0f0",
                      },
                    }}
                  />
                )}
                <Divider
                  sx={{
                    borderColor: "#979797",
                    my: 1,
                  }}
                />

                <Typography
                  variant="subtitle1"
                  color="black"
                  fontWeight={500}
                  mb={0.3}
                  fontSize={16}
                  marginTop={2}
                >
                  Set or Change Password
                </Typography>

                <Typography
                  variant="h6"
                  color="rgb(99, 115, 129)"
                  fontSize={12}
                  fontWeight={300}
                  marginBottom={2}
                >
                  If you signed in with a provider like Google, you can set a
                  password here. If you already have a password set, you can
                  change it here.
                </Typography>

                <Box position={"relative"} mb={2}>
                  <TextField
                    label="Password*"
                    type={showPassword ? "text" : "password"}
                    className="form-input"
                    {...register("password", {
                      pattern: validationPattern.passwordPattern,
                    })}
                    focused
                    sx={{
                      width: "100%",

                      // marginBottom: 2,
                    }}
                  />

                  <Box
                    bgcolor={"white"}
                    sx={{
                      position: "absolute",
                      right: "7px",
                      top: errors?.password ? "35%" : "50%",
                      transform: "translate(-7px,-50%)",
                      width: 20,
                      height: 20,
                    }}
                  >
                    <Image
                      onClick={() => setShowPassword(!showPassword)}
                      src={showPassword ? EyeOpened : EyeClosed}
                      width={20}
                      height={20}
                      alt="Eye Icon"
                      style={{ cursor: "pointer" }}
                      className="cursor-pointer"
                    />
                  </Box>
                  {errors &&
                    errors.password &&
                    errors.password.type === "pattern" && (
                      <Typography
                        variant="body2"
                        color="red"
                        fontSize={13}
                        mt={0.5}
                      >
                        {validationMessage.passwordPatternMessage}
                      </Typography>
                    )}
                </Box>
                <Box position={"relative"}>
                  <TextField
                    label="Re-enter Password"
                    type={showConfirmPassword ? "text" : "password"}
                    className="form-input"
                    {...register("confirmPassword", {
                      required: watch("password") ? true : false,
                      validate: (value) =>
                        value === getValues().password ||
                        "Confirm Password do not match!",
                    })}
                    focused
                    sx={{
                      width: "100%",
                    }}
                  />

                  <Box
                    bgcolor={"white"}
                    sx={{
                      position: "absolute",
                      right: "7px",
                      top: errors?.confirmPassword ? "35%" : "50%",
                      transform: "translate(-7px,-50%)",
                      width: 20,
                      height: 20,
                    }}
                  >
                    <Image
                      onClick={() =>
                        setshowConfirmPassword(!showConfirmPassword)
                      }
                      src={showConfirmPassword ? EyeOpened : EyeClosed}
                      width={20}
                      height={20}
                      alt="Eye Icon"
                      style={{ cursor: "pointer" }}
                    />
                  </Box>
                  {errors && errors.confirmPassword?.type == "required" && (
                    <Typography
                      variant="body2"
                      color="red"
                      fontSize={13}
                      mt={0.5}
                    >
                      Please Re-enter Password.
                    </Typography>
                  )}
                  {errors && errors.confirmPassword?.type == "validate" && (
                    <Typography
                      variant="body2"
                      color="red"
                      fontSize={13}
                      mt={0.5}
                    >
                      {validationMessage.confirmPasswordMessage}
                    </Typography>
                  )}
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
                  Save Changes
                </Button>
              </Grid>
            </Grid>
          </form>
        </Stack>
        {/* Profile Section End */}

        {/* User Permission Section Start */}
        <Stack
          sx={{
            borderRadius: "14px",
            boxShadow: "0px 0px 5px #C5C5C5",
            mt: 2.5,
            padding: 3,
          }}
        >
          <Typography
            variant="h6"
            color="rgb(0,0,0)"
            fontSize={18}
            fontWeight={600}
          >
            User Permissions
          </Typography>

          <Box
            my={3}
            bgcolor={"#06a19b"}
            color={"#fff"}
            sx={{
              p: "14px 16px",
              borderRadius: "8px",
              fontSize: "0.875rem",
              display: "flex",
              alignItems: "center",
              gap: 1.5,
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="1.5em"
              height="1.5em"
              viewBox="0 0 24 24"
            >
              <path
                fill="#fff"
                fillRule="evenodd"
                d="M12 1C5.925 1 1 5.925 1 12s4.925 11 11 11s11-4.925 11-11S18.075 1 12 1m4.768 9.14a1 1 0 1 0-1.536-1.28l-4.3 5.159l-2.225-2.226a1 1 0 0 0-1.414 1.414l3 3a1 1 0 0 0 1.475-.067z"
                clipRule="evenodd"
              />
            </svg>
            {`Admins have full access to the system. If you want to change the
            permissions for this user, set the role to 'Member'`}
          </Box>

          <Grid container>
            <Grid item md={1}>
              <Typography
                variant="h6"
                color="rgb(0,0,0)"
                fontSize={16}
                textAlign={"center"}
                fontWeight={600}
              >
                View
              </Typography>
            </Grid>

            <Grid
              item
              lg={3}
              xs={10}
              sx={{
                ml: {
                  lg: 0,
                  xs: 3,
                },
              }}
            >
              <Box display={"flex"} flexDirection={"column"} gap={4}>
                <FormControlLabel
                  className="switch-input"
                  control={<IOSSwitch defaultChecked disabled />}
                  label="View Batch Reports"
                />

                <FormControlLabel
                  className="switch-input"
                  control={<IOSSwitch defaultChecked disabled />}
                  label="View Batch Reports"
                />

                <FormControlLabel
                  className="switch-input"
                  control={<IOSSwitch defaultChecked disabled />}
                  label="View Batch Reports"
                />

                <FormControlLabel
                  className="switch-input"
                  control={<IOSSwitch defaultChecked disabled />}
                  label="View Batch Reports"
                />

                <FormControlLabel
                  className="switch-input"
                  control={<IOSSwitch defaultChecked disabled />}
                  label="View Batch Reports"
                />

                <FormControlLabel
                  className="switch-input"
                  control={<IOSSwitch defaultChecked disabled />}
                  label="View Batch Reports"
                />

                <FormControlLabel
                  className="switch-input"
                  control={<IOSSwitch defaultChecked disabled />}
                  label="View Batch Reports"
                />
              </Box>
            </Grid>

            <Grid
              item
              md={1}
              sx={{
                mt: {
                  lg: 0,
                  xs: 5,
                },
              }}
            >
              <Typography
                variant="h6"
                color="rgb(0,0,0)"
                fontSize={16}
                textAlign={"center"}
                fontWeight={600}
              >
                Edit
              </Typography>
            </Grid>

            <Grid
              item
              lg={3}
              xs={10}
              sx={{
                ml: {
                  lg: 0,
                  xs: 3,
                },
                mt: {
                  lg: 0,
                  xs: 5,
                },
              }}
            >
              <Box display={"flex"} flexDirection={"column"} gap={4}>
                <FormControlLabel
                  className="switch-input"
                  control={<IOSSwitch defaultChecked disabled />}
                  label="View Batch Reports"
                />

                <FormControlLabel
                  className="switch-input"
                  control={<IOSSwitch defaultChecked disabled />}
                  label="View Batch Reports"
                />

                <FormControlLabel
                  className="switch-input"
                  control={<IOSSwitch defaultChecked disabled />}
                  label="View Batch Reports"
                />

                <FormControlLabel
                  className="switch-input"
                  control={<IOSSwitch defaultChecked disabled />}
                  label="View Batch Reports"
                />

                <FormControlLabel
                  className="switch-input"
                  control={<IOSSwitch defaultChecked disabled />}
                  label="View Batch Reports"
                />

                <FormControlLabel
                  className="switch-input"
                  control={<IOSSwitch defaultChecked disabled />}
                  label="View Batch Reports"
                />

                <FormControlLabel
                  className="switch-input"
                  control={<IOSSwitch defaultChecked disabled />}
                  label="View Batch Reports"
                />
              </Box>
            </Grid>

            <Grid
              item
              md={1}
              sx={{
                mt: {
                  lg: 0,
                  xs: 5,
                },
              }}
            >
              <Typography
                variant="h6"
                color="rgb(0,0,0)"
                fontSize={16}
                textAlign={"center"}
                fontWeight={600}
              >
                {" "}
                Create
              </Typography>
            </Grid>

            <Grid
              item
              lg={3}
              xs={10}
              sx={{
                ml: {
                  lg: 0,
                  xs: 3,
                },
                mt: {
                  lg: 0,
                  xs: 5,
                },
              }}
            >
              <Box display={"flex"} flexDirection={"column"} gap={4}>
                <FormControlLabel
                  className="switch-input"
                  control={<IOSSwitch defaultChecked disabled />}
                  label="View Batch Reports"
                />

                <FormControlLabel
                  className="switch-input"
                  control={<IOSSwitch defaultChecked disabled />}
                  label="View Batch Reports"
                />

                <FormControlLabel
                  className="switch-input"
                  control={<IOSSwitch defaultChecked disabled />}
                  label="View Batch Reports"
                />

                <FormControlLabel
                  className="switch-input"
                  control={<IOSSwitch defaultChecked disabled />}
                  label="View Batch Reports"
                />

                <FormControlLabel
                  className="switch-input"
                  control={<IOSSwitch defaultChecked disabled />}
                  label="View Batch Reports"
                />

                <FormControlLabel
                  className="switch-input"
                  control={<IOSSwitch defaultChecked disabled />}
                  label="View Batch Reports"
                />

                <FormControlLabel
                  className="switch-input"
                  control={<IOSSwitch defaultChecked disabled />}
                  label="View Batch Reports"
                />
              </Box>
            </Grid>
          </Grid>
        </Stack>
        {/* User Permission Section End */}
      </Stack>
    </>
  );
}
