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
}
function UserPermission({ control }: UserPermissionProps) {
  const loggedUser: any = getCookie("logged-user");
  const user: SingleUser = JSON.parse(loggedUser);
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
          {/* Column Headers */}
          <Grid item md={1}>
            <Typography
              variant="h6"
              fontSize={16}
              textAlign={"center"}
              fontWeight={600}
            >
              View
            </Typography>
          </Grid>

          <Grid item lg={3} xs={10} sx={{ ml: { lg: 0, xs: 3 } }}>
            <Box display={"flex"} flexDirection={"column"} gap={4}>
              <Controller
                name="permissions.viewOrganisation"
                control={control}
                disabled={allDisabled}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <IOSSwitch {...field} checked={Boolean(field.value)} />
                    }
                    label="View Organisation"
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
              Edit
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
              Create
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
                name="permissions.createOrganisation"
                control={control}
                disabled={allDisabled}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <IOSSwitch {...field} checked={Boolean(field.value)} />
                    }
                    label="Create Organisation"
                  />
                )}
              />
            </Box>
          </Grid>
        </Grid>
      </Stack>
    </form>
  );
}

export default UserPermission;
