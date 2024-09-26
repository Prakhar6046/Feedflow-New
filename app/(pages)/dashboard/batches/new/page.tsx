"use client";
import BasicBreadcrumbs from "@/app/_components/Breadcrumbs";
import {
  Box,
  Divider,
  Grid,
  SelectChangeEvent,
  Step,
  StepLabel,
  Stepper,
} from "@mui/material";

import React, { useState } from "react";

import BatchWizard from "@/app/_components/batch/BatchWizard";
import BatchReport from "@/app/_components/batch/BatchReport";
import HarvestingInfo from "@/app/_components/batch/HarvestingInfo";
import AllDone from "@/app/_components/batch/AllDone";
import FeedingPlan from "@/app/_components/batch/FeedingPlan";

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
        heading={"Batches"}
        hideSearchInput={true}
        links={[
          { name: "Dashboard", link: "/dashboard" },
          { name: "Batches", link: "/dashboard/batches" },
          { name: "New", link: "/dashboard/batches/new" },
        ]}
      />

      <Grid
        container
        sx={{
          width: "100%",
          overflow: "hidden",
          borderRadius: "14px",
          boxShadow: "0px 0px 16px 5px #0000001A",
          p: 3,
        }}
      >
        <Grid item xl={2} md={3} xs={12}>
          <Box
            className="stepper-container"
            sx={{
              my: {
                md: 3,
                xs: 0,
              },
            }}
          >
            <Stepper activeStep={activeStep} orientation="vertical">
              {steps.map((step, index) => (
                <Step
                  key={step.label}
                  sx={{
                    fontSize: "30px",
                  }}
                >
                  <StepLabel className="stepper">{step.label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>
        </Grid>

        <Grid
          item
          xs={1}
          sx={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Divider
            orientation="vertical"
            flexItem
            sx={{
              height: "100%",
              borderColor: "#E6E7E9",
            }}
          />
        </Grid>

        <Grid
          item
          xl={9}
          md={8}
          xs={12}
          my={2}
          // sx={{
          //     mt: {
          //         md: 0,
          //         xs: 5,
          //     },
          // }}
        >
          {activeStep === 0 && <BatchWizard setActiveStep={setActiveStep} />}
          {activeStep === 1 && <BatchReport setActiveStep={setActiveStep} />}
          {activeStep === 2 && <HarvestingInfo setActiveStep={setActiveStep} />}
          {activeStep === 3 && <FeedingPlan setActiveStep={setActiveStep} />}
          {(activeStep === 4 || activeStep === 5) && (
            <AllDone setActiveStep={setActiveStep} activeStep={activeStep} />
          )}

          {/* <FeedingPlan /> */}
          {/* <AllDone /> */}
        </Grid>
      </Grid>
    </>
  );
}
