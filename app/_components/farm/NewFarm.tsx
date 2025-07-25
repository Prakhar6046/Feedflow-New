'use client';
import { Farm, GrowthModel } from '@/app/_typeModels/Farm';
import { SingleUser } from '@/app/_typeModels/User';
import { Box, Divider, Grid, Step, StepLabel, Stepper } from '@mui/material';
import { getCookie, setCookie } from 'cookies-next';
import { useEffect, useState } from 'react';
import FarmInformation from './FarmInformation';
import FeedProfiles from './FeedProfiles';
import ProductionParaMeter from './ProductionParameter';
import ProductionUnits from './ProductionUnits';
import { FeedProduct } from '@/app/_typeModels/Feed';
import { FeedSupplier } from '@/app/_typeModels/Organization';

const steps = [
  {
    label: 'Farm',
  },
  { label: 'Production Parameters' },
  {
    label: 'Feed profiles',
  },
  {
    label: 'Production Units',
  },
];
interface Props {
  farmMembers: SingleUser[];
  growthModels: GrowthModel[];
  farms: Farm[];
  feedstores: FeedProduct[];
  feedSuppliers: FeedSupplier[];
}
export default function NewFarm({
  farmMembers,
  growthModels,
  farms,
  feedstores,
  feedSuppliers,
}: Props) {
  const activeStepIndex = Number(getCookie('activeStep'));
  const token = getCookie('auth-token');
  const [activeStep, setActiveStep] = useState<number>(
    activeStepIndex !== 0 ? activeStepIndex : 0,
  );

  useEffect(() => {
    setCookie('activeStep', activeStep);
  }, [activeStep]);
  return (
    <Grid
      container
      sx={{
        width: '100%',
        overflow: 'hidden',
        borderRadius: '14px',
        boxShadow: '0px 0px 16px 5px #0000001A',
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
                  fontSize: '30px',
                  cursor: 'pointer',
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
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Divider
          orientation="vertical"
          flexItem
          sx={{
            height: '100%',
            borderColor: '#E6E7E9',
          }}
        />
      </Grid>

      <Grid item xl={9} md={8} xs={12} my={2}>
        {activeStep === 0 && (
          <FarmInformation
            setActiveStep={setActiveStep}
            farmMembers={farmMembers}
            farms={farms}
          />
        )}
        {activeStep === 1 && (
          <ProductionParaMeter
            setActiveStep={setActiveStep}
            growthModels={growthModels}
          />
        )}

        {activeStep === 2 && (
          <FeedProfiles
            setActiveStep={setActiveStep}
            feedStores={feedstores}
            feedSuppliers={feedSuppliers}
          />
        )}
        {activeStep === 3 && (
          <ProductionUnits
            setActiveStep={setActiveStep}
            growthModels={growthModels}
            feedStores={feedstores}
            feedSuppliers={feedSuppliers}
            token={token ?? ''}
          />
        )}
      </Grid>
    </Grid>
  );
}
