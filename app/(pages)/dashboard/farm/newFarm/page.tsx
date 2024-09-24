"use client";
import BasicBreadcrumbs from "@/app/_components/Breadcrumbs";
import AllDone from "@/app/_components/farm/AllDone";
import AquaFarmWizard from "@/app/_components/farm/AquaFarmWizard";
import FarmInformation from "@/app/_components/farm/FarmInformation";
import ProductionUnits from "@/app/_components/farm/ProductionUnits";
import { Box, Divider, Grid, Step, StepLabel, Stepper } from "@mui/material";

import { useState } from "react";

const steps = [
  {
    label: "Intro",
  },
  {
    label: "Farm",
  },
  {
    label: "Production Units",
  },
  {
    label: "Finished",
  },
];

export default function Page() {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [age, setAge] = useState("");
  return (
    <>
      <BasicBreadcrumbs
        heading={"New Farm"}
        hideSearchInput={true}
        links={[
          { name: "Dashboard", link: "/dashboard" },
          { name: "Farm", link: "/dashboard/farm" },
          { name: "New", link: "/dashboard/newFarm" },
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
          {activeStep === 0 && <AquaFarmWizard setActiveStep={setActiveStep} />}
          {activeStep === 1 && (
            <FarmInformation setActiveStep={setActiveStep} />
          )}
          {activeStep === 2 && (
            <ProductionUnits setActiveStep={setActiveStep} />
          )}
          {activeStep === 3 && <AllDone setActiveStep={setActiveStep} />}
        </Grid>
      </Grid>
    </>
  );
}
