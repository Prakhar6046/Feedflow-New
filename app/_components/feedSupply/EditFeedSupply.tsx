'use client';
import NewFeed from '@/app/_components/feedSupply/NewFeed';
import { Grid } from '@mui/material';
type Iprops = {
  feedSupplyId: string;
};
const EditFeedSupply = ({ feedSupplyId }: Iprops) => {
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
