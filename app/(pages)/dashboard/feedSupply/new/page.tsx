"use client";
import BasicBreadcrumbs from "@/app/_components/Breadcrumbs";
import FeedSelection from "@/app/_components/feedSupply/FeedSelection";
import FeedStore from "@/app/_components/feedSupply/FeedStore";
import NewFeed from "@/app/_components/feedSupply/NewFeed";
import { Box, Divider, Grid, Step, StepLabel, Stepper } from "@mui/material";
import { getCookie, setCookie } from "cookies-next";

import { useEffect, useState } from "react";

export default function Page() {
  const activeStepIndex = Number(getCookie("activeStep"));
  const loggedUser: any = getCookie("logged-user");
  const [steps, setSteps] = useState<{ label: String; id: number }[]>();
  const [currentUserOrganisationType, setCurrentUserOrganisationType] =
    useState<string>();
  const [activeStep, setActiveStep] = useState<number>(
    activeStepIndex !== 0 ? activeStepIndex : 0
  );

  useEffect(() => {
    setCookie("activeStep", activeStep);
  }, [activeStep]);
  useEffect(() => {
    if (loggedUser) {
      const userOrganisationType = JSON.parse(loggedUser);
      if (
        userOrganisationType?.data?.user?.organisation.organisationType ===
        "Fish Farmer"
      ) {
        const stepsForFishFarmers = [
          {
            label: "Feed Selection",
            id: 1,
          },
          {
            label: "Feed Store",
            id: 2,
          },
        ];
        setSteps(stepsForFishFarmers);
      } else if (
        userOrganisationType?.data?.user?.organisation.organisationType ===
        "Feed Supplier"
      ) {
        const stepsForFeedSupplyers = [
          {
            label: "Feed Selection",
            id: 3,
          },

          {
            label: "New Feed",
            id: 4,
          },
        ];
        setSteps(stepsForFeedSupplyers);
      }
    }
  }, [loggedUser]);

  return (
    <>
      <BasicBreadcrumbs
        heading={"Feed Supply"}
        isTable={false}
        hideSearchInput={true}
        links={[
          { name: "Dashboard", link: "/dashboard" },
          { name: "Feed Supply", link: "/dashboard/feedSupply" },
          { name: "New", link: "/dashboard/feedSupply/new" },
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
              {steps?.map((step, index) => (
                <Step
                  key={step.id}
                  sx={{
                    fontSize: "30px",
                  }}
                  onClick={() => setActiveStep(index)}
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
          {activeStep === 0 && <FeedSelection setActiveStep={setActiveStep} />}
          {steps && steps[1].label === "Feed Store" && activeStep === 1 && (
            <FeedStore />
          )}
          {steps && steps[1].label === "New Feed" && activeStep === 1 && (
            <NewFeed setActiveStep={setActiveStep} />
          )}
        </Grid>
      </Grid>
    </>
  );
}
