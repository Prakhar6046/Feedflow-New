"use client";
import BasicTable from "@/app/_components/BasicTable";
import BasicBreadcrumbs from "@/app/_components/Breadcrumbs";
import Loader from "@/app/_components/Loader";
import { getOrganisations } from "@/app/_lib/action";
import { Box, Button, Paper, Stack, Step, StepContent, StepLabel, Stepper, Typography } from "@mui/material";
import { getCookie } from "cookies-next";
import { cookies } from "next/headers";
import React, { Suspense } from "react";
// import Timeline from '@mui/lab/Timeline';
// import TimelineItem from '@mui/lab/TimelineItem';
// import TimelineSeparator from '@mui/lab/TimelineSeparator';
// import TimelineConnector from '@mui/lab/TimelineConnector';
// import TimelineContent from '@mui/lab/TimelineContent';
// import TimelineDot from '@mui/lab/TimelineDot';

const steps = [
    {
        label: 'Batch action',
    },
    {
        label: 'Harvesting Information',
    },
    {
        label: 'Feeding plan',
    },
    {
        label: 'All done',
    },
];

export default function Page() {

    const [activeStep, setActiveStep] = React.useState(0);

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleReset = () => {
        setActiveStep(0);
    };

    return (
        <>
            <BasicBreadcrumbs
                heading={"Batches"}
                buttonName={"New Batch"}

                links={[
                    { name: "Dashboard", link: "/dashboard" },
                    { name: "Batches", link: "/dashboard/batches" },
                ]}
            />

            <Stack sx={{
                width: "100%",
                overflow: "hidden",
                borderRadius: "14px",
                boxShadow: "0px 0px 16px 5px #0000001A",
                mt: 4,
                p: 3,
            }}>

                {/* <Timeline>
                    <TimelineItem >
                        <TimelineSeparator >
                            <TimelineDot sx={{
                                background: "red"
                            }} />
                            <TimelineConnector />
                        </TimelineSeparator>
                        <TimelineContent>Eat</TimelineContent>
                    </TimelineItem>
                    <TimelineItem>
                        <TimelineSeparator>
                            <TimelineDot />
                            <TimelineConnector />
                        </TimelineSeparator>
                        <TimelineContent>Code</TimelineContent>
                    </TimelineItem>
                    <TimelineItem>
                        <TimelineSeparator>
                            <TimelineDot />
                        </TimelineSeparator>
                        <TimelineContent>Sleep</TimelineContent>
                    </TimelineItem>
                </Timeline> */}

                <Box className="stepper-container">
                    <Stepper activeStep={activeStep} orientation="vertical">
                        {steps.map((step, index) => (
                            <Step key={step.label} sx={{
                                fontSize: "30px"
                            }}>
                                <StepLabel className="stepper">
                                    {step.label}
                                </StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                    {/* {activeStep === steps.length && (
                        <Paper square elevation={0} sx={{ p: 3 }}>
                            <Typography>All steps completed - you&apos;re finished</Typography>
                            <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
                                Reset
                            </Button>
                        </Paper>
                    )} */}
                </Box>

            </Stack>

        </>
    );
}
