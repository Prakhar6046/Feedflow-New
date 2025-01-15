"use client";

import { SingleUser } from "@/app/_typeModels/User";
import { Box, Divider, Grid, Step, StepLabel, Stepper } from "@mui/material";
import { getCookie, setCookie } from "cookies-next";

import { useEffect, useState } from "react";
import AquaFarmWizard from "./AquaFarmWizard";
import FarmInformation from "./FarmInformation";
import ProductionUnits from "./ProductionUnits";
import AllDone from "./AllDone";
import ProductionParaMeter from "./ProductionParameter";

const steps = [
  {
    label: "Intro",
  },
  {
    label: "Farm",
  },
  { label: "Production Parameters" },
  {
    label: "Production Units",
  },

  {
    label: "Finished",
  },
];
interface Props {
  farmMembers: SingleUser[];
  growthModels: any;
}
export default function NewFarm({ farmMembers, growthModels }: Props) {
  const activeStepIndex = Number(getCookie("activeStep"));
  const [activeStep, setActiveStep] = useState<number>(
    activeStepIndex !== 0 ? activeStepIndex : 0
  );

  useEffect(() => {
    setCookie("activeStep", activeStep);
  }, [activeStep]);
  console.log(growthModels);
  return (
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
            {steps.map((step) => (
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

      <Grid item xl={9} md={8} xs={12} my={2}>
        {activeStep === 0 && <AquaFarmWizard setActiveStep={setActiveStep} />}
        {activeStep === 1 && (
          <FarmInformation
            setActiveStep={setActiveStep}
            farmMembers={farmMembers}
          />
        )}
        {activeStep === 2 && (
          <ProductionParaMeter
            setActiveStep={setActiveStep}
            growthModels={growthModels}
          />
        )}
        {activeStep === 3 && <ProductionUnits setActiveStep={setActiveStep} />}

        {activeStep === 4 && <AllDone setActiveStep={setActiveStep} />}
      </Grid>
    </Grid>
  );
}
