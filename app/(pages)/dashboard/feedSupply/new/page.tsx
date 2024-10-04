"use client";
import BasicBreadcrumbs from "@/app/_components/Breadcrumbs";
import FeedSelection from "@/app/_components/feedSupply/FeedSelection";
import FeedSupplyIntro from "@/app/_components/feedSupply/FeedSupplyIntro";
import NewFeed from "@/app/_components/feedSupply/NewFeed";
import { Box, Divider, Grid, Step, StepLabel, Stepper } from "@mui/material";
import { getCookie, setCookie } from "cookies-next";

import { useEffect, useState } from "react";

const steps = [
  {
    label: "Intro",
  },
  {
    label: "New Feed",
  },
  {
    label: "Feed Selection",
  },
  {
    label: "Feed Store",
  },
  {
    label: "Finished",
  },
];

export default function Page() {
  const activeStepIndex = Number(getCookie("activeStep"));
  const [activeStep, setActiveStep] = useState<number>(
    activeStepIndex !== 0 ? activeStepIndex : 0
  );

  useEffect(() => {
    setCookie("activeStep", activeStep);
  }, [activeStep]);
  return (
    <>
      <BasicBreadcrumbs
        heading={"Feed Supply"}
        searchOrganisations={false}
        searchUsers={false}
        searchFarm={false}
        isTable={false}
        hideSearchInput={true}
        links={[
          { name: "Dashboard", link: "/dashboard" },
          { name: "Feed Supply", link: "/dashboard" },
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
          {activeStep === 0 && (
            <FeedSupplyIntro setActiveStep={setActiveStep} />
          )}
          {activeStep === 1 && <NewFeed setActiveStep={setActiveStep} />}
          {activeStep === 2 && <FeedSelection setActiveStep={setActiveStep} />}
        </Grid>
      </Grid>
    </>
  );
}
