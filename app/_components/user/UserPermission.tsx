import { SingleUser, UserEditFormInputs } from "@/app/_typeModels/User";
import {
  Box,
  FormControlLabel,
  Grid,
  Stack,
  styled,
  Switch,
  SwitchProps,
  Typography,
} from "@mui/material";
import { getCookie } from "cookies-next";
import { useEffect, useState } from "react";
import { Control, Controller, FieldValues } from "react-hook-form";
// Custom iOS styled switch
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
        ...theme.applyStyles?.("dark", {
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
      ...theme.applyStyles?.("dark", {
        color: theme.palette.grey[600],
      }),
    },
    "&.Mui-disabled + .MuiSwitch-track": {
      opacity: 0.7,
      ...theme.applyStyles?.("dark", {
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
    borderRadius: 13,
    backgroundColor: "#E9E9EA",
    opacity: 1,
    transition: theme.transitions.create(["background-color"], {
      duration: 500,
    }),
    ...theme.applyStyles?.("dark", {
      backgroundColor: "#39393D",
    }),
  },
}));

interface UserPermissionProps {
  control: Control<any>;
  oraginsationType: string | any;
}
function UserPermission({ control, oraginsationType }: UserPermissionProps) {
  const loggedUser: any = getCookie("logged-user");
  const user: SingleUser = loggedUser ? JSON.parse(loggedUser) : {};
  const [allDisabled, setAllDisabled] = useState<boolean>(false);

  useEffect(() => {
    if (Object.keys(user).length) {
      const isSuperAdmin = user?.role === "SUPERADMIN";
      if (isSuperAdmin) {
        setAllDisabled(false);
      } else {
        setAllDisabled(true);
      }
    }
  }, [user]);
  return (
    <form>
      {oraginsationType === "Feed Supplier" ? (
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
            fontSize={20}
            fontWeight={600}
          >
            Admin Rights
          </Typography>

          <Grid container>
            {/* Column Headers */}
            <Grid item md={1}>
              <Typography
                variant="h6"
                fontSize={16}
                textAlign={"center"}
                fontWeight={600}
              >
                Create Users
              </Typography>
            </Grid>

            <Grid item lg={3} xs={10} sx={{ ml: { lg: 0, xs: 3 } }}>
              <Box display={"flex"} flexDirection={"column"} gap={4}>
                <Controller
                  name="permissions.createUsers"
                  control={control}
                  disabled={allDisabled}
                  render={({ field }) => (
                    <FormControlLabel
                      control={
                        <IOSSwitch {...field} checked={Boolean(field.value)} />
                      }
                      label="Create Users"
                    />
                  )}
                />
              </Box>
            </Grid>

            <Grid item md={1} sx={{ mt: { lg: 0, xs: 5 } }}>
              <Typography
                variant="h6"
                fontSize={16}
                textAlign={"center"}
                fontWeight={600}
              >
                Edit Users
              </Typography>
            </Grid>

            <Grid
              item
              lg={3}
              xs={10}
              sx={{
                ml: { lg: 0, xs: 3 },
                mt: { lg: 0, xs: 5 },
              }}
            >
              <Box display={"flex"} flexDirection={"column"} gap={4}>
                <Controller
                  name="permissions.editUsers"
                  control={control}
                  disabled={allDisabled}
                  render={({ field }) => (
                    <FormControlLabel
                      control={
                        <IOSSwitch {...field} checked={Boolean(field.value)} />
                      }
                      label="Edit Users"
                    />
                  )}
                />
              </Box>
            </Grid>

            <Grid item md={1} sx={{ mt: { lg: 0, xs: 5 } }}>
              <Typography
                variant="h6"
                fontSize={16}
                textAlign={"center"}
                fontWeight={600}
              >
                Edit Admin Rights
              </Typography>
            </Grid>

            <Grid
              item
              lg={3}
              xs={10}
              sx={{
                ml: { lg: 0, xs: 3 },
                mt: { lg: 0, xs: 5 },
              }}
            >
              <Box display={"flex"} flexDirection={"column"} gap={4}>
                <Controller
                  name="permissions.editAdminRights"
                  control={control}
                  disabled={allDisabled}
                  render={({ field }) => (
                    <FormControlLabel
                      control={
                        <IOSSwitch {...field} checked={Boolean(field.value)} />
                      }
                      label="Edit Admin Rights"
                    />
                  )}
                />
              </Box>
            </Grid>
          </Grid>

          <Typography
            variant="h6"
            color="rgb(0,0,0)"
            fontSize={18}
            fontWeight={600}
          >
            Organisation Rights
          </Typography>

          <Grid container>
            {/* Column Headers */}
            <Grid item md={1}>
              <Typography
                variant="h6"
                fontSize={16}
                textAlign={"center"}
                fontWeight={600}
              >
                Edit Organisation
              </Typography>
            </Grid>

            <Grid item lg={3} xs={10} sx={{ ml: { lg: 0, xs: 3 } }}>
              <Box display={"flex"} flexDirection={"column"} gap={4}>
                <Controller
                  name="permissions.editOrganisation"
                  control={control}
                  disabled={allDisabled}
                  render={({ field }) => (
                    <FormControlLabel
                      control={
                        <IOSSwitch {...field} checked={Boolean(field.value)} />
                      }
                      label="Edit Organisation"
                    />
                  )}
                />
              </Box>
            </Grid>

            <Grid item md={1} sx={{ mt: { lg: 0, xs: 5 } }}>
              <Typography
                variant="h6"
                fontSize={16}
                textAlign={"center"}
                fontWeight={600}
              >
                Add Feed Supply
              </Typography>
            </Grid>

            <Grid
              item
              lg={3}
              xs={10}
              sx={{
                ml: { lg: 0, xs: 3 },
                mt: { lg: 0, xs: 5 },
              }}
            >
              <Box display={"flex"} flexDirection={"column"} gap={4}>
                <Controller
                  name="permissions.addFeedSupply"
                  control={control}
                  disabled={allDisabled}
                  render={({ field }) => (
                    <FormControlLabel
                      control={
                        <IOSSwitch {...field} checked={Boolean(field.value)} />
                      }
                      label="Add Feed Supply"
                    />
                  )}
                />
              </Box>
            </Grid>

            <Grid item md={1} sx={{ mt: { lg: 0, xs: 5 } }}>
              <Typography
                variant="h6"
                fontSize={16}
                textAlign={"center"}
                fontWeight={600}
              >
                Edit Feed Supply
              </Typography>
            </Grid>

            <Grid
              item
              lg={3}
              xs={10}
              sx={{
                ml: { lg: 0, xs: 3 },
                mt: { lg: 0, xs: 5 },
              }}
            >
              <Box display={"flex"} flexDirection={"column"} gap={4}>
                <Controller
                  name="permissions.editFeedSupply"
                  control={control}
                  disabled={allDisabled}
                  render={({ field }) => (
                    <FormControlLabel
                      control={
                        <IOSSwitch {...field} checked={Boolean(field.value)} />
                      }
                      label="Edit Feed Supply"
                    />
                  )}
                />
              </Box>
            </Grid>
            <Grid item md={1} sx={{ mt: { lg: 0, xs: 5 } }}>
              <Typography
                variant="h6"
                fontSize={16}
                textAlign={"center"}
                fontWeight={600}
              >
                Add Fish Producers
              </Typography>
            </Grid>

            <Grid
              item
              lg={3}
              xs={10}
              sx={{
                ml: { lg: 0, xs: 3 },
                mt: { lg: 0, xs: 5 },
              }}
            >
              <Box display={"flex"} flexDirection={"column"} gap={4}>
                <Controller
                  name="permissions.addFishProducers"
                  control={control}
                  disabled={allDisabled}
                  render={({ field }) => (
                    <FormControlLabel
                      control={
                        <IOSSwitch {...field} checked={Boolean(field.value)} />
                      }
                      label="Add Fish Producers"
                    />
                  )}
                />
              </Box>
            </Grid>
            <Grid item md={1} sx={{ mt: { lg: 0, xs: 5 } }}>
              <Typography
                variant="h6"
                fontSize={16}
                textAlign={"center"}
                fontWeight={600}
              >
                Edit Fish Producers
              </Typography>
            </Grid>

            <Grid
              item
              lg={3}
              xs={10}
              sx={{
                ml: { lg: 0, xs: 3 },
                mt: { lg: 0, xs: 5 },
              }}
            >
              <Box display={"flex"} flexDirection={"column"} gap={4}>
                <Controller
                  name="permissions.editFishProducers"
                  control={control}
                  disabled={allDisabled}
                  render={({ field }) => (
                    <FormControlLabel
                      control={
                        <IOSSwitch {...field} checked={Boolean(field.value)} />
                      }
                      label="Edit Fish Producers"
                    />
                  )}
                />
              </Box>
            </Grid>
          </Grid>
        </Stack>
      ) : oraginsationType === "Fish Producer" ? (
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
            fontSize={20}
            fontWeight={600}
            mb={2}
          >
            Admin Rights
          </Typography>

          <Grid container rowSpacing={2.5}>
            {/* Column Headers */}
            <Grid item lg={4} xs={6} sx={{
              display: "flex",
              gap: 6
            }}>
              <Typography
                variant="h6"
                fontSize={16}
                fontWeight={600}
              >
                Create Users
              </Typography>

              <Box>
                <Controller
                  name="permissions.createUsers"
                  control={control}
                  disabled={allDisabled}
                  render={({ field }) => (
                    <FormControlLabel
                      control={
                        <IOSSwitch {...field} checked={Boolean(field.value)} sx={{
                          marginRight: 2
                        }} />
                      }
                      label="Create Users"
                    />
                  )}
                />
              </Box>
            </Grid>

            <Grid item lg={4} xs={6} sx={{
              display: "flex",
              gap: 6
            }} >
              <Typography
                variant="h6"
                fontSize={16}
                textAlign={"center"}
                fontWeight={600}
              >
                Edit Users
              </Typography>

              <Box>
                <Controller
                  name="permissions.editUsers"
                  control={control}
                  disabled={allDisabled}
                  render={({ field }) => (
                    <FormControlLabel
                      control={
                        <IOSSwitch {...field} checked={Boolean(field.value)} sx={{
                          marginRight: 2
                        }} />
                      }
                      label="Edit Users"
                    />
                  )}
                />
              </Box>
            </Grid>

            <Grid item lg={4} xs={6} sx={{
              display: "flex",
              gap: 6
            }}>
              <Typography
                variant="h6"
                fontSize={16}
                textAlign={"center"}
                fontWeight={600}
                whiteSpace={"nowrap"}
              >
                Edit Admin Rights
              </Typography>

              <Box>
                <Controller
                  name="permissions.editAdminRights"
                  control={control}
                  disabled={allDisabled}
                  render={({ field }) => (
                    <FormControlLabel
                      sx={{
                        alignItems: "start",
                      }}
                      control={
                        <IOSSwitch {...field} checked={Boolean(field.value)} sx={{
                          marginRight: 2,
                        }} />
                      }
                      label="Edit Admin Rights"
                    />
                  )}
                />
              </Box>
            </Grid>
          </Grid>

          <Typography
            variant="h6"
            color="rgb(0,0,0)"
            fontSize={18}
            fontWeight={600}
            mt={5}
            mb={2}
          >
            Organisation Rights
          </Typography>

          <Grid container rowSpacing={2.5}>
            {/* Column Headers */}
            <Grid item lg={4} xs={6} sx={{
              display: "flex",
              gap: 6
            }} >
              <Typography
                variant="h6"
                fontSize={16}
                textAlign={"center"}
                fontWeight={600}
              >
                Edit Organisation
              </Typography>

              <Box>
                <Controller
                  name="permissions.editOrganisation"
                  control={control}
                  disabled={allDisabled}
                  render={({ field }) => (
                    <FormControlLabel
                      control={
                        <IOSSwitch {...field} checked={Boolean(field.value)} sx={{
                          marginRight: 2
                        }} />
                      }
                      label="Edit Organisation"
                    />
                  )}
                />
              </Box>
            </Grid>

            <Grid item lg={4} xs={6} sx={{
              display: "flex",
              gap: 6
            }} >
              <Typography
                variant="h6"
                fontSize={16}
                textAlign={"center"}
                fontWeight={600}
              >
                Create Fish Supply
              </Typography>

              <Box>
                <Controller
                  name="permissions.createFishSupply"
                  control={control}
                  disabled={allDisabled}
                  render={({ field }) => (
                    <FormControlLabel
                      sx={{
                        alignItems: "start",
                      }}
                      control={
                        <IOSSwitch {...field} checked={Boolean(field.value)} sx={{
                          marginRight: 2
                        }} />
                      }
                      label="Create Fish Supply"
                    />
                  )}
                />
              </Box>
            </Grid>

            <Grid item lg={4} xs={6} sx={{
              display: "flex",
              gap: 6
            }} >
              <Typography
                variant="h6"
                fontSize={16}
                textAlign={"center"}
                fontWeight={600}
                whiteSpace={"nowrap"}
              >
                Edit Fish Supply
              </Typography>

              <Box>
                <Controller
                  name="permissions.editFishSupply"
                  control={control}
                  disabled={allDisabled}
                  render={({ field }) => (
                    <FormControlLabel
                      sx={{
                        alignItems: "start",
                      }}
                      control={
                        <IOSSwitch {...field} checked={Boolean(field.value)} sx={{
                          marginRight: 2
                        }} />
                      }
                      label="Edit Fish Supply"
                    />
                  )}
                />
              </Box>
            </Grid>

            <Grid item lg={4} xs={6} sx={{
              display: "flex",
              gap: 10
            }} >
              <Typography
                variant="h6"
                fontSize={16}
                fontWeight={600}
              >
                Create Farms
              </Typography>

              <Box>
                <Controller
                  name="permissions.createFarms"
                  control={control}
                  disabled={allDisabled}
                  render={({ field }) => (
                    <FormControlLabel
                      control={
                        <IOSSwitch {...field} checked={Boolean(field.value)} sx={{
                          marginRight: 2
                        }} />
                      }
                      label="Create Farms"
                    />
                  )}
                />
              </Box>
            </Grid>

            <Grid item lg={4} xs={6} sx={{
              display: "flex",
              gap: 14.5
            }} >
              <Typography
                variant="h6"
                fontSize={16}
                fontWeight={600}
              >
                Edit Farms
              </Typography>

              <Box>
                <Controller
                  name="permissions.editFarms"
                  control={control}
                  disabled={allDisabled}
                  render={({ field }) => (
                    <FormControlLabel
                      control={
                        <IOSSwitch {...field} checked={Boolean(field.value)} sx={{
                          marginRight: 2
                        }} />
                      }
                      label="Edit Farms"
                    />
                  )}
                />
              </Box>
            </Grid>

            <Grid item lg={4} xs={6} sx={{
              display: "flex",
              gap: 6
            }} >
              <Typography
                variant="h6"
                fontSize={16}
                fontWeight={600}
              >
                Transfer Fish Between Farms
              </Typography>

              <Box display={"flex"}>
                <Controller
                  name="permissions.transferFishBetweenFarms"
                  control={control}
                  disabled={allDisabled}
                  render={({ field }) => (
                    <FormControlLabel
                      control={
                        <IOSSwitch {...field} checked={Boolean(field.value)} sx={{
                          marginRight: 2
                        }} />
                      }
                      label="Transfer Fish Between Farms"
                    />
                  )}
                />
              </Box>
            </Grid>
          </Grid>
        </Stack>
      ) : null}
    </form>
  );
}

export default UserPermission;
