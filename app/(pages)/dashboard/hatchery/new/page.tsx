"use client";
import BasicBreadcrumbs from "@/app/_components/Breadcrumbs";
import {
  Box,
  Button,
  Divider,
  FormControl,
  Grid,
  Grid2,
  InputLabel,
  Select,
  SelectChangeEvent,
  Stack,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
} from "@mui/material";

import React, { useState } from "react";

import BatchWizard from "@/app/_components/batch/BatchWizard";
import BatchReport from "@/app/_components/batch/BatchReport";
import HarvestingInfo from "@/app/_components/batch/HarvestingInfo";
import AllDone from "@/app/_components/batch/AllDone";
import FeedingPlan from "@/app/_components/batch/FeedingPlan";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const steps = [
  {
    label: "Intro",
  },
  {
    label: "Batch action",
  },
  {
    label: "Harvesting Information",
  },
  {
    label: "Feeding plan",
  },
  {
    label: "All done",
  },
];

export default function Page() {
  const [activeStep, setActiveStep] = useState<number>(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const [age, setAge] = React.useState("");

  const handleChange = (event: SelectChangeEvent) => {
    setAge(event.target.value as string);
  };

  return (
    <>
      <BasicBreadcrumbs
        heading={"Hatchery"}
        hideSearchInput={true}
        links={[
          { name: "Dashboard", link: "/dashboard" },
          { name: "Hatchery", link: "/dashboard/hatchery" },
          { name: "New", link: "/dashboard/hatchery/new" },
        ]}
      />

      <Stack
        sx={{
          borderRadius: "14px",
          boxShadow: "0px 0px 16px 5px #0000001A",
          my: 4,
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

        <form>
          <Grid container spacing={2} sx={{
            p: {
              md: 3,
              xs: 2,
            },
          }}>

            <Grid item sm={6} xs={12}>

              <Box width={"100%"}>
                <TextField
                  label="Hatchery Name *"
                  type="text"
                  className="form-input"
                  // {...register("organisationName", {
                  //   required: true,
                  // })}
                  // focused={userData?.data.name ? true : false}
                  // value={userData?.data.name}
                  sx={{
                    width: "100%",
                  }}
                />

                {/* {errors &&
                errors.organisationName &&
                errors.organisationName.type === "required" && (
                  <Typography
                    variant="body2"
                    color="red"
                    fontSize={13}
                    mt={0.5}
                  >
                    This field is required.
                  </Typography>
                )} */}
              </Box>

            </Grid>

            <Grid item sm={6} xs={12}>

              <Box width={"100%"}>
                <TextField
                  label="Hatchery Code *"
                  type="text"
                  className="form-input"
                  // {...register("organisationName", {
                  //   required: true,
                  // })}
                  // focused={userData?.data.name ? true : false}
                  // value={userData?.data.name}
                  sx={{
                    width: "100%",
                  }}
                />

                {/* {errors &&
                errors.organisationName &&
                errors.organisationName.type === "required" && (
                  <Typography
                    variant="body2"
                    color="red"
                    fontSize={13}
                    mt={0.5}
                  >
                    This field is required.
                  </Typography>
                )} */}
              </Box>

            </Grid>

            <Grid item sm={6} xs={12}>

              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Hatching Date *"
                  className="form-input"
                  sx={{
                    width: "100%",
                  }}
                />
              </LocalizationProvider>
            </Grid>

            <Grid item sm={6} xs={12}>

              <FormControl className="form-input" fullWidth>
                <InputLabel id="demo-simple-select-label">
                  Specie *
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Specie *"
                // {...register("organisationType")}
                // value={selectedOrganisationType || ""}
                // onChange={(e) => handleChange(e, item)}
                // sx={{
                //   px: {
                //     xl: 10,
                //     md: 5,
                //     xs: 3,
                //   },
                // }}
                >
                  {/* {OrganisationType.map((organisation, i) => {
                    return (
                      <MenuItem value={organisation} key={i}>
                        {organisation}
                      </MenuItem>
                    );
                  })} */}
                </Select>
              </FormControl>

            </Grid>

            <Grid item sm={6} xs={12}>

              <Box width={"100%"}>
                <TextField
                  label="Specie Code *"
                  type="text"
                  className="form-input"
                  // {...register("organisationName", {
                  //   required: true,
                  // })}
                  // focused={userData?.data.name ? true : false}
                  // value={userData?.data.name}
                  sx={{
                    width: "100%",
                  }}
                />

                {/* {errors &&
  errors.organisationName &&
  errors.organisationName.type === "required" && (
    <Typography
      variant="body2"
      color="red"
      fontSize={13}
      mt={0.5}
    >
      This field is required.
    </Typography>
  )} */}
              </Box>

            </Grid>

            <Grid item sm={6} xs={12}>

              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Spawning Date *"
                  className="form-input"
                  sx={{
                    width: "100%",
                  }}
                />
              </LocalizationProvider>
            </Grid>

            <Grid item sm={6} xs={12}>

              <Box width={"100%"}>
                <TextField
                  label="Spawning Number *"
                  type="number"
                  className="form-input"
                  // {...register("organisationName", {
                  //   required: true,
                  // })}
                  // focused={userData?.data.name ? true : false}
                  // value={userData?.data.name}
                  sx={{
                    width: "100%",
                  }}
                />

                {/* {errors &&
errors.organisationName &&
errors.organisationName.type === "required" && (
<Typography
variant="body2"
color="red"
fontSize={13}
mt={0.5}
>
This field is required.
</Typography>
)} */}
              </Box>

            </Grid>

            <Grid item sm={6} xs={12}>

              <Box width={"100%"}>
                <TextField
                  label="Age *"
                  type="number"
                  className="form-input"
                  // {...register("organisationName", {
                  //   required: true,
                  // })}
                  // focused={userData?.data.name ? true : false}
                  // value={userData?.data.name}
                  sx={{
                    width: "100%",
                  }}
                />

                {/* {errors &&
errors.organisationName &&
errors.organisationName.type === "required" && (
<Typography
variant="body2"
color="red"
fontSize={13}
mt={0.5}
>
This field is required.
</Typography>
)} */}
              </Box>

            </Grid>

            <Grid item sm={6} xs={12}>

              <Box width={"100%"}>
                <TextField
                  label="Broodstock (Male) *"
                  type="text"
                  className="form-input"
                  // {...register("organisationName", {
                  //   required: true,
                  // })}
                  // focused={userData?.data.name ? true : false}
                  // value={userData?.data.name}
                  sx={{
                    width: "100%",
                  }}
                />

                {/* {errors &&
errors.organisationName &&
errors.organisationName.type === "required" && (
<Typography
variant="body2"
color="red"
fontSize={13}
mt={0.5}
>
This field is required.
</Typography>
)} */}
              </Box>

            </Grid>

            <Grid item sm={6} xs={12}>

              <Box width={"100%"}>
                <TextField
                  label="Broodstock (Female) *"
                  type="text"
                  className="form-input"
                  // {...register("organisationName", {
                  //   required: true,
                  // })}
                  // focused={userData?.data.name ? true : false}
                  // value={userData?.data.name}
                  sx={{
                    width: "100%",
                  }}
                />

                {/* {errors &&
errors.organisationName &&
errors.organisationName.type === "required" && (
<Typography
variant="body2"
color="red"
fontSize={13}
mt={0.5}
>
This field is required.
</Typography>
)} */}
              </Box>

            </Grid>

            <Grid item sm={6} xs={12}>

              <FormControl className="form-input" fullWidth>
                <InputLabel id="demo-simple-select-label">
                  Hatchery *
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Hatchery *"
                // {...register("organisationType")}
                // value={selectedOrganisationType || ""}
                // onChange={(e) => handleChange(e, item)}
                // sx={{
                //   px: {
                //     xl: 10,
                //     md: 5,
                //     xs: 3,
                //   },
                // }}
                >
                  {/* {OrganisationType.map((organisation, i) => {
      return (
        <MenuItem value={organisation} key={i}>
          {organisation}
        </MenuItem>
      );
    })} */}
                </Select>
              </FormControl>

            </Grid>

            <Grid item sm={6} xs={12}>

              <FormControl className="form-input" fullWidth>
                <InputLabel id="demo-simple-select-label">
                  Fish Farm *
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Fish Farm *"
                // {...register("organisationType")}
                // value={selectedOrganisationType || ""}
                // onChange={(e) => handleChange(e, item)}
                // sx={{
                //   px: {
                //     xl: 10,
                //     md: 5,
                //     xs: 3,
                //   },
                // }}
                >
                  {/* {OrganisationType.map((organisation, i) => {
return (
<MenuItem value={organisation} key={i}>
{organisation}
</MenuItem>
);
})} */}
                </Select>
              </FormControl>

            </Grid>

            <Grid item sm={6} xs={12}>

              <Box width={"100%"}>
                <TextField
                  label="Production Unit (Current) *"
                  type="text"
                  className="form-input"
                  // {...register("organisationName", {
                  //   required: true,
                  // })}
                  // focused={userData?.data.name ? true : false}
                  // value={userData?.data.name}
                  sx={{
                    width: "100%",
                  }}
                />

                {/* {errors &&
errors.organisationName &&
errors.organisationName.type === "required" && (
<Typography
variant="body2"
color="red"
fontSize={13}
mt={0.5}
>
This field is required.
</Typography>
)} */}
              </Box>

            </Grid>

            <Grid item sm={6} xs={12}>

              <FormControl className="form-input" fullWidth>
                <InputLabel id="demo-simple-select-label">
                  Status *
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Status *"
                // {...register("organisationType")}
                // value={selectedOrganisationType || ""}
                // onChange={(e) => handleChange(e, item)}
                // sx={{
                //   px: {
                //     xl: 10,
                //     md: 5,
                //     xs: 3,
                //   },
                // }}
                >
                  {/* {OrganisationType.map((organisation, i) => {
return (
<MenuItem value={organisation} key={i}>
{organisation}
</MenuItem>
);
})} */}
                </Select>
              </FormControl>

            </Grid>

          </Grid>

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
              mb: 5,
              mr: {
                md: 3,
                xs: 2
              }
            }}
          >
            Add Batch
          </Button>
        </form>
      </Stack>

    </>
  );
}
