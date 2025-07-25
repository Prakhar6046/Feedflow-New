'use client';
import FarmInformation from '@/app/_components/farm/FarmInformation';
import ProductionUnits from '@/app/_components/farm/ProductionUnits';
import Loader from '@/app/_components/Loader';
import { Farm, GrowthModel } from '@/app/_typeModels/Farm';
import { FeedProduct } from '@/app/_typeModels/Feed';
import { FeedSupplier } from '@/app/_typeModels/Organization';
import { SingleUser } from '@/app/_typeModels/User';
import { Box, Divider, Grid, Step, StepLabel, Stepper } from '@mui/material';
import { getCookie, setCookie } from 'cookies-next';
import { useEffect, useState } from 'react';
import FeedProfiles from './FeedProfiles';
import ProductionParaMeter from './ProductionParameter';

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
  farmId: string;
  farmMembers: SingleUser[];
  growthModels: GrowthModel[];
  farms: Farm[];
  isEdit?: boolean;
  feedstores: FeedProduct[];
  feedSuppliers: FeedSupplier[];
}
const EditFarm = ({
  farmId,
  farmMembers,
  growthModels,
  farms,
  isEdit,
  feedstores,
  feedSuppliers,
}: Props) => {
  const token = getCookie('auth-token');
  const activeStepIndex = Number(getCookie('activeStep'));
  const [activeStep, setActiveStep] = useState<number>(
    activeStepIndex !== 0 ? activeStepIndex : 0,
  );
  const [editFarm, setEditFarm] = useState<Farm>();
  const [loading, setLoading] = useState<boolean>(false);

  const getFarm = async () => {
    const response = await fetch(`/api/farm/${farmId}`, {
      method: 'GET',
    });
    const res = await response.json();
    return res;
  };

  useEffect(() => {
    setCookie('activeStep', activeStep);
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
  console.log('edit farm data', editFarm);

  if (loading) {
    return <Loader />;
  }

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
                completed={true}
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
            token={token ?? ''}
          />
        )}
      </Grid>
    </Grid>
  );
};

export default EditFarm;
