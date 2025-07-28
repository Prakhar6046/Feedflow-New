'use client';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import { Box, Stack, Tab } from '@mui/material';
import { SyntheticEvent, useState } from 'react';
import FeedingPlanOutput from '../feedPrediction/FeedingPlanOutputs';
import FeedUsageOutput from '../feedPrediction/FeedUsageOutputs';

const FeedingOutputTable = () => {
  const [selectedFeeding, setSelectedFeeding] = useState<string>('feedingPlan');

  const handleChange = (_event: SyntheticEvent, newValue: string) => {
    setSelectedFeeding(newValue);
  };

  return (
    <>
      <TabContext value={String(selectedFeeding)}>
        <Stack
          display={'flex'}
          rowGap={2}
          columnGap={5}
          mb={2}
          justifyContent={'space-between'}
          sx={{
            flexDirection: {
              md: 'row',
              xs: 'column',
            },
            alignItems: {
              md: 'center',
              xs: 'start',
            },
          }}
        >
          <Box>
            <TabList
              onChange={handleChange}
              aria-label="lab API tabs example"
              className=" production-tabs"
            >
              <Tab
                label="Feeding Plan"
                value="feedingPlan"
                className={
                  selectedFeeding === 'feedingPlan' ? 'active-tab' : ''
                }
              />
              <Tab
                label="Feed Requirement/Usage"
                value="feedUsage"
                className={selectedFeeding === 'feedUsage' ? 'active-tab' : ''}
              />
            </TabList>
          </Box>
        </Stack>
      </TabContext>
      {/* <Button
        id="basic-button"
        type="button"
        variant="contained"
        onClick={(e) => createxlsxFile(e)}
        sx={{
          background: "#fff",
          color: "#06A19B",
          fontWeight: 600,
          padding: "6px 16px",
          width: "fit-content",
          textTransform: "capitalize",
          borderRadius: "8px",
          border: "1px solid #06A19B",
          marginBottom: "10px",
          marginTop: "10px",
          boxShadow: "none",
          "&:hover": {
            boxShadow: "none",
          },
        }}
      >
        Create .xlsx File
      </Button> */}
      {/* 
      <Button
        id="basic-button"
        type="button"
        variant="contained"
        onClick={CreateFeedPredictionPDF}
        sx={{
          background: "#fff",
          color: "#06A19B",
          fontWeight: 600,
          padding: "6px 16px",
          width: "fit-content",
          textTransform: "capitalize",
          borderRadius: "8px",
          border: "1px solid #06A19B",
          marginBottom: "10px",
          boxShadow: "none",
          "&:hover": {
            boxShadow: "none",
          },
        }}
      >
        Create PDF
      </Button> */}
      {selectedFeeding === 'feedingPlan' ? (
        <FeedingPlanOutput />
      ) : (
        selectedFeeding === 'feedUsage' && <FeedUsageOutput />
      )}
    </>
  );
};

export default FeedingOutputTable;
