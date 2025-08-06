'use client';
import NewFeed from '@/app/_components/feedSupply/NewFeed';
import { selectIsEditFeed } from '@/lib/features/feed/feedSlice';
import { useAppSelector } from '@/lib/hooks';
import { Grid } from '@mui/material';
import { useEffect, useState } from 'react';
type Iprops = {
  feedSupplyId: string;
};
const EditFeedSupply = ({ feedSupplyId }: Iprops) => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const isEditFeed = useAppSelector(selectIsEditFeed);

  useEffect(() => {
    if (isEditFeed) {
      setActiveStep(1);
    }
  }, [isEditFeed]);
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
      <Grid
        item
        xs={1}
        sx={{
          display: 'flex',
          justifyContent: 'center',
        }}
      ></Grid>
      <Grid item xl={9} md={8} xs={12} my={2}>
        <NewFeed feedSupplyId={feedSupplyId} />
      </Grid>
    </Grid>
  );
};

export default EditFeedSupply;
