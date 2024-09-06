"use client";
import {
  Box,
  Divider,
  FormControlLabel,
  Grid,
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
import { User } from "@/app/_components/UserTable";
import Loader from "@/app/_components/Loader";

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
  const [userData, setUserData] = useState<{ data: User }>();
  const [loading, setLoading] = useState<boolean>(false);
  const getUser = async () => {
    setLoading(true);
    const data = await fetch(`/api/users/${params.userId}`, { method: "GET" });
    if (data) {
      setLoading(false);
    }
    return data.json();
  };
  useEffect(() => {
    const user = async () => {
      setLoading(true);
      const data = await getUser();
      setUserData(data);
    };
    user();
  }, []);

  console.log(userData);

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
                  onChange={(event) => console.log(event.target.files)}
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
                variant="h6"
                color="rgb(99, 115, 129)"
                fontSize={14}
                alignSelf={"flex-start"}
                marginBottom={1}
              >
                Information
              </Typography>

              <form>
                <TextField
                  label="Name"
                  type="text"
                  focused={userData?.data.name ? true : false}
                  value={userData?.data.name}
                  sx={{
                    width: "100%",
                    marginBottom: 2,
                  }}
                />

                <TextField
                  label="Email"
                  type="email"
                  focused={userData?.data.email ? true : false}
                  value={userData?.data.email}
                  sx={{
                    width: "100%",
                    marginBottom: 2,
                  }}
                />

                <TextField
                  label="Organisation"
                  type="text"
                  focused={userData?.data?.Organisation[0]?.name ? true : false}
                  value={
                    userData?.data?.Organisation[0]?.name ?? "Nutrition Hub"
                  }
                  sx={{
                    width: "100%",
                    marginBottom: 2,
                  }}
                />

                <Divider
                  sx={{
                    borderColor: "#979797",
                    my: 1,
                  }}
                />

                <Typography
                  variant="h6"
                  color="rgb(99, 115, 129)"
                  mb={0.3}
                  fontSize={14}
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

                <TextField
                  label="Password"
                  type="text"
                  // focused
                  sx={{
                    width: "100%",
                    marginBottom: 2,
                  }}
                />

                <TextField
                  label="Re-enter Password"
                  type="text"
                  // focused
                  sx={{
                    width: "100%",
                    marginBottom: 2,
                  }}
                />

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
              </form>
            </Grid>
          </Grid>
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
            bgcolor={"rgb(216, 251, 222)"}
            color={"rgb(10, 85, 84)"}
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
                fill="rgb(54, 179, 126)"
                fill-rule="evenodd"
                d="M12 1C5.925 1 1 5.925 1 12s4.925 11 11 11s11-4.925 11-11S18.075 1 12 1m4.768 9.14a1 1 0 1 0-1.536-1.28l-4.3 5.159l-2.225-2.226a1 1 0 0 0-1.414 1.414l3 3a1 1 0 0 0 1.475-.067z"
                clip-rule="evenodd"
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
                  control={<IOSSwitch defaultChecked />}
                  label="View Batch Reports"
                />

                <FormControlLabel
                  className="switch-input"
                  control={<IOSSwitch defaultChecked />}
                  label="View Batch Reports"
                />

                <FormControlLabel
                  className="switch-input"
                  control={<IOSSwitch defaultChecked />}
                  label="View Batch Reports"
                />

                <FormControlLabel
                  className="switch-input"
                  control={<IOSSwitch defaultChecked />}
                  label="View Batch Reports"
                />

                <FormControlLabel
                  className="switch-input"
                  control={<IOSSwitch defaultChecked />}
                  label="View Batch Reports"
                />

                <FormControlLabel
                  className="switch-input"
                  control={<IOSSwitch defaultChecked />}
                  label="View Batch Reports"
                />

                <FormControlLabel
                  className="switch-input"
                  control={<IOSSwitch defaultChecked />}
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
                  control={<IOSSwitch defaultChecked />}
                  label="View Batch Reports"
                />

                <FormControlLabel
                  className="switch-input"
                  control={<IOSSwitch defaultChecked />}
                  label="View Batch Reports"
                />

                <FormControlLabel
                  className="switch-input"
                  control={<IOSSwitch defaultChecked />}
                  label="View Batch Reports"
                />

                <FormControlLabel
                  className="switch-input"
                  control={<IOSSwitch defaultChecked />}
                  label="View Batch Reports"
                />

                <FormControlLabel
                  className="switch-input"
                  control={<IOSSwitch defaultChecked />}
                  label="View Batch Reports"
                />

                <FormControlLabel
                  className="switch-input"
                  control={<IOSSwitch defaultChecked />}
                  label="View Batch Reports"
                />

                <FormControlLabel
                  className="switch-input"
                  control={<IOSSwitch defaultChecked />}
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
                  control={<IOSSwitch defaultChecked />}
                  label="View Batch Reports"
                />

                <FormControlLabel
                  className="switch-input"
                  control={<IOSSwitch defaultChecked />}
                  label="View Batch Reports"
                />

                <FormControlLabel
                  className="switch-input"
                  control={<IOSSwitch defaultChecked />}
                  label="View Batch Reports"
                />

                <FormControlLabel
                  className="switch-input"
                  control={<IOSSwitch defaultChecked />}
                  label="View Batch Reports"
                />

                <FormControlLabel
                  className="switch-input"
                  control={<IOSSwitch defaultChecked />}
                  label="View Batch Reports"
                />

                <FormControlLabel
                  className="switch-input"
                  control={<IOSSwitch defaultChecked />}
                  label="View Batch Reports"
                />

                <FormControlLabel
                  className="switch-input"
                  control={<IOSSwitch defaultChecked />}
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
