'use client';
import FarmInformation from '@/app/_components/farm/FarmInformation';
import ProductionUnits from '@/app/_components/farm/ProductionUnits';
import Loader from '@/app/_components/Loader';
import { Farm } from '@/app/_typeModels/Farm';
import { SingleUser } from '@/app/_typeModels/User';
import { Box, Divider, Grid, Step, StepLabel, Stepper } from '@mui/material';
import { getCookie, setCookie } from 'cookies-next';
import { useEffect, useState } from 'react';
import FeedProfiles from './FeedProfiles';
import ProductionParaMeter from './ProductionParameter';
import { FeedProduct } from '@/app/_typeModels/Feed';
import { FeedSupplier } from '@/app/_typeModels/Organization';
import { secureFetch } from '@/app/_lib/auth';
import { getFarm } from '@/app/_lib/action';

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
  EditFarmData: Farm;
  fishfarmers: Farm[];
  farmId: string;
  farmMembers: SingleUser[];
  growthModels: any;
  farms: Farm[];
  isEdit?: boolean;
  feedstores: FeedProduct[];
  feedSuppliers: FeedSupplier[];
}
const EditFarm = ({
  EditFarmData,
  fishfarmers,
  farmId,
  farmMembers,
  growthModels,
  farms,
  isEdit,
  feedstores,
  feedSuppliers,
}: Props) => {
  console.log('farms', farms);
  const token = getCookie('auth-token');
  console.log('token', token);
  const activeStepIndex = Number(getCookie('activeStep'));
  // const [activeStep, setActiveStep] = useState<number>(
  //   activeStepIndex !== 0 ? activeStepIndex : 0,
  // );
  const [editFarm, setEditFarm] = useState<Farm | null>(null);

  console.log('editFarm', EditFarmData);

const [activeStep, setActiveStep] = useState(0);

useEffect(() => {
  const cookieStep = getCookie('activeStep');
  setActiveStep(cookieStep ? Number(cookieStep) : 0);
}, []);
  useEffect(() => {
    if (EditFarmData) setEditFarm(EditFarmData);
  }, [EditFarmData]);

  if (!editFarm) return <Loader />;

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
                // sx={{
                //   fontSize: '30px',
                //   cursor: index <= activeStep ? 'pointer' : 'not-allowed',
                //   opacity: index <= activeStep ? 1 : 0.5,
                // }}
                // // Only allow clicking on current or previous steps
                // onClick={() => {
                //   if (index <= activeStep) setActiveStep(index);
                // }}
                // disabled={index > activeStep}
                completed={activeStep > index}
              >
                <StepLabel
                  className="stepper"
                  onClick={() => setActiveStep(index)}
                  sx={{
                    cursor: 'pointer',
                    fontWeight: activeStep === index ? 'bold' : 'normal',
                  }}
                >
                  {step.label}
                </StepLabel>
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
            fishfarmers={fishfarmers}
            setActiveStep={setActiveStep}
            editFarm={editFarm}
            farmMembers={farmMembers}
            farms={farms}
          />
        )}

        {activeStep === 1 && (
          <ProductionParaMeter
            setActiveStep={setActiveStep}
            productionParaMeter={editFarm?.WaterQualityPredictedParameters}
            editFarm={editFarm}
            growthModels={growthModels}
          />
        )}
        {activeStep === 2 && (
          <FeedProfiles
            setActiveStep={setActiveStep}
            editFarm={editFarm}
            feedStores={feedstores}
            feedSuppliers={feedSuppliers}
          />
        )}
        {activeStep === 3 && (
          <ProductionUnits
            setActiveStep={setActiveStep}
            editFarm={editFarm}
            isEdit={isEdit}
            productionParaMeter={editFarm?.WaterQualityPredictedParameters}
            growthModels={growthModels}
            feedStores={feedstores}
            feedSuppliers={feedSuppliers}
          />
        )}
      </Grid>
    </Grid>
  );
};

export default EditFarm;
