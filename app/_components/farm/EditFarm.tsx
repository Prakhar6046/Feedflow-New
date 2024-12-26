"use client";
import AquaFarmWizard from "@/app/_components/farm/AquaFarmWizard";
import FarmInformation from "@/app/_components/farm/FarmInformation";
import ProductionUnits from "@/app/_components/farm/ProductionUnits";
import AllDone from "@/app/_components/feedSupply/AllDone";
import Loader from "@/app/_components/Loader";
import { Farm } from "@/app/_typeModels/Farm";
import { SingleUser } from "@/app/_typeModels/User";
import { Box, Divider, Grid, Step, StepLabel, Stepper } from "@mui/material";
import { getCookie, setCookie } from "cookies-next";
import { useEffect, useState } from "react";
import ProductionParaMeter from "./ProductionParameter";

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
interface Props {
  farmId: String;
  farmMembers: SingleUser[];
}
const EditFarm = ({ farmId, farmMembers }: Props) => {
  const activeStepIndex = Number(getCookie("activeStep"));
  const [activeStep, setActiveStep] = useState<number>(
    activeStepIndex !== 0 ? activeStepIndex : 0
  );
  // const isEditFarm = useAppSelector(selectIsEditFarm);
  const [editFarm, setEditFarm] = useState<Farm>();
  const [loading, setLoading] = useState<boolean>(false);

  const getFarm = async () => {
    const response = await fetch(`/api/farm/${farmId}`);
    const res = await response.json();
    return res;
  };

  // useEffect(() => {
  //   if (isEditFarm) {
  //     setActiveStep(1);
  //   }
  // }, [isEditFarm]);
  useEffect(() => {
    setCookie("activeStep", activeStep);
  }, [activeStep]);
  useEffect(() => {
    setLoading(true);
    const getFarmData = async () => {
      const res = await getFarm();
      setEditFarm(res.data);
      setLoading(false);
    };
    getFarmData();
  }, []);
  if (loading) {
    return <Loader />;
  }

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

      <Grid item xl={9} md={8} xs={12} my={2}>
        {activeStep === 0 && <AquaFarmWizard setActiveStep={setActiveStep} />}
        {activeStep === 1 && (
          <FarmInformation
            setActiveStep={setActiveStep}
            editFarm={editFarm}
            farmMembers={farmMembers}
          />
        )}
        {activeStep === 2 && (
          <ProductionUnits setActiveStep={setActiveStep} editFarm={editFarm} />
        )}
        {activeStep === 3 && (
          <ProductionParaMeter
            setActiveStep={setActiveStep}
            editFarm={editFarm}
          />
        )}
        {activeStep === 4 && <AllDone setActiveStep={setActiveStep} />}
      </Grid>
    </Grid>
  );
};

export default EditFarm;
