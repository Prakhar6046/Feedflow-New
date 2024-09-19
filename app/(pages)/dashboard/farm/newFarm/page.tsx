"use client";
import BasicTable from "@/app/_components/BasicTable";
import BasicBreadcrumbs from "@/app/_components/Breadcrumbs";
import Loader from "@/app/_components/Loader";
import { getOrganisations } from "@/app/_lib/action";
import { Box, Button, Divider, FormControl, FormControlLabel, FormLabel, Grid, InputLabel, List, ListItem, Menu, MenuItem, Paper, Radio, RadioGroup, Select, SelectChangeEvent, Stack, Step, StepContent, StepLabel, Stepper, TextField, Typography } from "@mui/material";
import { getCookie } from "cookies-next";
import { cookies } from "next/headers";
import React, { Suspense } from "react";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

const steps = [
    {
        label: 'Intro',
    },
    {
        label: 'Farm',
    },
    {
        label: 'Production Units',
    },
    {
        label: 'Finished',
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

    const [age, setAge] = React.useState('');

    const handleChange = (event: SelectChangeEvent) => {
        setAge(event.target.value as string);
    };

    return (
        <>
            <BasicBreadcrumbs
                heading={"Farm"}
                buttonName={"New Batch"}

                links={[
                    { name: "Dashboard", link: "/dashboard" },
                    { name: "Farm", link: "/dashboard/batches" },
                    { name: "New", link: "/dashboard/batches" },
                ]}
            />

            <Grid
                container
                sx={{
                    width: "100%",
                    overflow: "hidden",
                    borderRadius: "14px",
                    boxShadow: "0px 0px 16px 5px #0000001A",
                    mt: 4,
                    p: 3,
                }}
            >
                <Grid
                    item
                    xl={2}
                    md={4}
                    xs={12}
                >

                    <Box className="stepper-container" sx={{
                        my: {
                            md: 10,
                            xs: 0
                        }
                    }}>
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

                </Grid>

                <Grid
                    item
                    xs={1}
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                    }}
                >
                    <Divider orientation="vertical" flexItem sx={{
                        height: '100%',
                        borderColor: "#E6E7E9"
                    }} />
                </Grid>

                <Grid
                    item
                    md={6}
                    xs={12}
                    my={5}
                // sx={{
                //     mt: {
                //         md: 0,
                //         xs: 5,
                //     },
                // }}
                >
                    <Stack display={"none"}>

                        <Typography variant="h6" gutterBottom fontWeight={700} sx={{
                            fontSize: {
                                md: 24,
                                xs: 20
                            }
                        }}>
                            Aqua Farm Wizard
                        </Typography>

                        <Typography variant="body1" color="#555555">
                            This wizard will assist you in adding a new farm to your account. <br /> The steps you will be following will proceed as follows:
                        </Typography>

                        <Stack my={5}>

                            <Box display={"flex"} alignItems={"start"} sx={{
                                gap: {
                                    md: 2,
                                    xs: 1.5
                                }
                            }}>
                                <Box>
                                    <Box fontWeight={700} display={"flex"} justifyContent={"center"}
                                        alignItems={"center"} borderRadius={100} sx={{
                                            width: {
                                                md: 60,
                                                xs: 30
                                            },
                                            height: {
                                                md: 60,
                                                xs: 30
                                            },
                                            color: "#fff",
                                            backgroundColor: "#06A19B",
                                            fontSize: {
                                                md: 28,
                                                xs: 16
                                            },
                                        }}>
                                        1
                                    </Box>
                                </Box>

                                <Box>
                                    <Typography variant="h5" fontWeight={600} sx={{
                                        fontSize: {
                                            md: 18,
                                            xs: 16
                                        },
                                        marginBottom: {
                                            md: 0.5,
                                            xs: 0
                                        }
                                    }}>Give your new farm a name</Typography>
                                    <Typography variant="body1" color="#555555" sx={{
                                        fontSize: {
                                            md: 16,
                                            xs: 14
                                        }
                                    }}> This is to help you identify and distinguish this one from your other farms. </Typography>
                                </Box>
                            </Box>

                            <Box display={"flex"} alignItems={"start"} sx={{
                                gap: {
                                    md: 2,
                                    xs: 1.5
                                },
                                marginTop: {
                                    md: 8,
                                    xs: 4
                                }
                            }}>
                                <Box>
                                    <Box fontWeight={700} display={"flex"} justifyContent={"center"}
                                        alignItems={"center"} borderRadius={100} sx={{
                                            width: {
                                                md: 60,
                                                xs: 30
                                            },
                                            height: {
                                                md: 60,
                                                xs: 30
                                            },
                                            color: "#fff",
                                            backgroundColor: "#06A19B",
                                            fontSize: {
                                                md: 28,
                                                xs: 16
                                            },
                                        }}>
                                        2
                                    </Box>
                                </Box>

                                <Box>
                                    <Typography variant="h5" fontWeight={600} sx={{
                                        fontSize: {
                                            md: 18,
                                            xs: 16
                                        },
                                        marginBottom: {
                                            md: 0.5,
                                            xs: 0
                                        }
                                    }}>Add production unit(s)</Typography>
                                    <Typography variant="body1" color="#555555" sx={{
                                        fontSize: {
                                            md: 16,
                                            xs: 14
                                        }
                                    }}>to your new farm. A production unit or pond is the physical unit in which your fish batches grow. These production units can be self-standing or part of a bigger pond. </Typography>
                                </Box>
                            </Box>

                        </Stack>

                        <Box>
                            <Button
                                type="submit"
                                variant="contained"
                                sx={{
                                    background: "#06A19B",
                                    fontWeight: 600,
                                    padding: "6px 16px",
                                    width: "fit-content",
                                    textTransform: "capitalize",
                                    borderRadius: "8px",
                                    marginLeft: "auto",
                                    display: "block",
                                    marginTop: 2,
                                }}
                            >
                                Get Started
                            </Button>
                        </Box>

                    </Stack>

                    <Stack>
                        <Typography variant="h6" fontWeight={700} sx={{
                            fontSize: {
                                md: 24,
                                xs: 20
                            },
                            marginBottom: 3
                        }}>
                            Farm Information
                        </Typography>

                        <Box>
                            <form>
                                <TextField
                                    label="Farm Name"
                                    type="text"
                                    className="form-input"
                                    // focused
                                    sx={{
                                        width: "100%",
                                        marginBottom: 2,
                                    }}
                                />

                                <Box display={"flex"} justifyContent={"end"} alignItems={"center"} gap={2} flexWrap={"wrap"} mb={3}>

                                    <Button
                                        type="submit"
                                        variant="contained"
                                        sx={{
                                            background: "#06A19B",
                                            fontWeight: 600,
                                            padding: "6px 16px",
                                            width: "fit-content",
                                            textTransform: "capitalize",
                                            borderRadius: "8px",
                                            marginTop: 2,
                                            boxShadow: "none",
                                            border: "1px solid #06A19B",
                                        }}
                                    >
                                        Use Address
                                    </Button>

                                    <Button
                                        type="submit"
                                        variant="contained"
                                        sx={{
                                            background: "#fff",
                                            fontWeight: 600,
                                            padding: "6px 16px",
                                            width: "fit-content",
                                            textTransform: "capitalize",
                                            borderRadius: "8px",
                                            marginTop: 2,
                                            color: "#06A19B",
                                            border: "1px solid #06A19B",
                                            boxShadow: "none"
                                        }}
                                    >
                                        Use Coordinates
                                    </Button>

                                </Box>

                                <Box>
                                    <Typography variant="h6" gutterBottom fontWeight={700} sx={{
                                        fontSize: 18
                                    }}>
                                        Address
                                    </Typography>

                                    <Typography variant="body2" color="#555555">
                                        You can do an address lookup to the right
                                    </Typography>
                                </Box>


                                <Grid container spacing={2} mt={0}>

                                    <Grid item md={6} xs={12}>
                                        <TextField
                                            label="Address Line 1"
                                            type="text"
                                            className="form-input"
                                            // focused
                                            sx={{
                                                width: "100%",
                                                marginBottom: 2,
                                            }}
                                        />
                                    </Grid>

                                    <Grid item md={6} xs={12}>
                                        <TextField
                                            label="Address Line 2"
                                            type="text"
                                            className="form-input"
                                            // focused
                                            sx={{
                                                width: "100%",
                                                marginBottom: 2,
                                            }}
                                        />
                                    </Grid>

                                    <Grid item md={6} xs={12}>
                                        <TextField
                                            label="City"
                                            type="text"
                                            className="form-input"
                                            // focused
                                            sx={{
                                                width: "100%",
                                                marginBottom: 2,
                                            }}
                                        />
                                    </Grid>

                                    <Grid item md={6} xs={12}>
                                        <TextField
                                            label="State/Province"
                                            type="text"
                                            className="form-input"
                                            // focused
                                            sx={{
                                                width: "100%",
                                                marginBottom: 2,
                                            }}
                                        />
                                    </Grid>

                                    <Grid item md={6} xs={12}>
                                        <TextField
                                            label="Zip Code"
                                            type="text"
                                            className="form-input"
                                            // focused
                                            sx={{
                                                width: "100%",
                                                marginBottom: 2,
                                            }}
                                        />
                                    </Grid>

                                    <Grid item md={6} xs={12}>
                                        <TextField
                                            label="Country"
                                            type="text"
                                            className="form-input"
                                            // focused
                                            sx={{
                                                width: "100%",
                                                marginBottom: 2,
                                            }}
                                        />
                                    </Grid>

                                </Grid>

                                <Box>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        sx={{
                                            background: "#06A19B",
                                            fontWeight: 600,
                                            padding: "6px 16px",
                                            width: "fit-content",
                                            textTransform: "capitalize",
                                            borderRadius: "8px",
                                            marginLeft: "auto",
                                            display: "block",
                                            marginTop: 5,
                                        }}
                                    >
                                        Next
                                    </Button>
                                </Box>

                            </form>

                        </Box>

                    </Stack>

                    <Stack display={"none"}>
                        <Typography variant="h6" fontWeight={700} sx={{
                            fontSize: {
                                md: 24,
                                xs: 20
                            },
                            marginBottom: 3
                        }}>
                            Production Units
                        </Typography>

                        <Box>
                            <Typography variant="h6" gutterBottom fontWeight={700} sx={{
                                fontSize: {
                                    md: 18,
                                    xs: 16
                                }
                            }}>
                                New Production Unit
                            </Typography>

                            <Stack mb={5} display={"flex"} direction={"row"} justifyContent={"flex-start"} alignItems={"center"} gap={2} flexWrap={"wrap"}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    sx={{
                                        background: "#06A19B",
                                        fontWeight: 600,
                                        padding: "6px 16px",
                                        width: "fit-content",
                                        textTransform: "capitalize",
                                        borderRadius: "8px",
                                        marginTop: 2,
                                        boxShadow: "none"
                                    }}
                                >
                                    Change
                                </Button>

                                <Button
                                    type="submit"
                                    variant="contained"
                                    sx={{
                                        background: "#fff",
                                        fontWeight: 600,
                                        padding: "6px 16px",
                                        width: "fit-content",
                                        textTransform: "capitalize",
                                        borderRadius: "8px",
                                        marginTop: 2,
                                        color: "#06A19B",
                                        border: "1px solid #06A19B",
                                        boxShadow: "none"
                                    }}
                                >
                                    Remove
                                </Button>

                                <Button
                                    type="submit"
                                    variant="contained"
                                    sx={{
                                        background: "#06A19B",
                                        fontWeight: 600,
                                        padding: "6px 16px",
                                        width: "fit-content",
                                        textTransform: "capitalize",
                                        borderRadius: "8px",
                                        marginTop: 2,
                                        boxShadow: "none"
                                    }}
                                >
                                    Hide
                                </Button>
                            </Stack>

                            <form>

                                <Grid container spacing={2}>

                                    <Grid item md={6} xs={12}>

                                        <TextField
                                            label="Production Unit Name"
                                            type="text"
                                            className="form-input"
                                            // focused
                                            sx={{
                                                width: "100%",
                                                marginBottom: 2,
                                            }}
                                        />
                                    </Grid>

                                    <Grid item md={6} xs={12}>

                                        <TextField
                                            label="Production Unit Shape"
                                            type="text"
                                            className="form-input"
                                            // focused
                                            sx={{
                                                width: "100%",
                                                marginBottom: 2,
                                            }}
                                        />
                                    </Grid>

                                </Grid>

                                <Stack mt={2} mb={5} display={"flex"} direction={"row"} justifyContent={"flex-start"} alignItems={"center"} gap={2} flexWrap={"wrap"}>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        sx={{
                                            background: "#06A19B",
                                            fontWeight: 600,
                                            padding: "6px 16px",
                                            width: "fit-content",
                                            textTransform: "capitalize",
                                            borderRadius: "8px",
                                            marginTop: 2,
                                            boxShadow: "none"
                                        }}
                                    >
                                        Change
                                    </Button>

                                    <Button
                                        type="submit"
                                        variant="contained"
                                        sx={{
                                            background: "#fff",
                                            fontWeight: 600,
                                            padding: "6px 16px",
                                            width: "fit-content",
                                            textTransform: "capitalize",
                                            borderRadius: "8px",
                                            marginTop: 2,
                                            color: "#06A19B",
                                            border: "1px solid #06A19B",
                                            boxShadow: "none"
                                        }}
                                    >
                                        Remove
                                    </Button>

                                    <Button
                                        type="submit"
                                        variant="contained"
                                        sx={{
                                            background: "#06A19B",
                                            fontWeight: 600,
                                            padding: "6px 16px",
                                            width: "fit-content",
                                            textTransform: "capitalize",
                                            borderRadius: "8px",
                                            marginTop: 2,
                                            boxShadow: "none"
                                        }}
                                    >
                                        Hide
                                    </Button>
                                </Stack>

                                <Grid container spacing={2}>

                                    <Grid item md={6} xs={12}>

                                        <TextField
                                            label="Length"
                                            type="text"
                                            className="form-input"
                                            // focused
                                            sx={{
                                                width: "100%",
                                                marginBottom: 2,
                                            }}
                                        />
                                    </Grid>

                                    <Grid item md={6} xs={12}>

                                        <TextField
                                            label="Width"
                                            type="text"
                                            className="form-input"
                                            // focused
                                            sx={{
                                                width: "100%",
                                                marginBottom: 2,
                                            }}
                                        />
                                    </Grid>

                                </Grid>

                                <Box>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        sx={{
                                            background: "#06A19B",
                                            fontWeight: 600,
                                            padding: "6px 16px",
                                            width: "fit-content",
                                            textTransform: "capitalize",
                                            borderRadius: "8px",
                                            marginLeft: "auto",
                                            display: "block",
                                            marginTop: 5,
                                        }}
                                    >
                                        Add a Production Unit
                                    </Button>
                                </Box>

                            </form>

                        </Box>

                    </Stack>

                    <Stack display={"none"}>

                        <Typography variant="h6" gutterBottom fontWeight={700} sx={{
                            fontSize: {
                                md: 24,
                                xs: 20
                            }
                        }}>All done
                        </Typography>

                        <Typography variant="h5" fontWeight={500} sx={{
                            fontSize: {
                                md: 18,
                                xs: 16
                            }
                        }}>
                            So what's next?
                        </Typography>

                        <Stack my={5}>
                            <Box display={"flex"} alignItems={"start"} sx={{
                                gap: {
                                    md: 2,
                                    xs: 1.5
                                }
                            }}>
                                <Box>
                                    <Box fontWeight={700} display={"flex"} justifyContent={"center"}
                                        alignItems={"center"} borderRadius={100} sx={{
                                            width: {
                                                md: 80,
                                                xs: 40
                                            },
                                            height: {
                                                md: 80,
                                                xs: 40
                                            },
                                            color: "#fff",
                                            backgroundColor: "#06A19B",
                                            fontSize: {
                                                md: 28,
                                                xs: 16
                                            },
                                        }}>

                                        <svg xmlns="http://www.w3.org/2000/svg" width="1.3em" height="1.3em" viewBox="0 0 14 14">
                                            <path fill="#fff" fill-rule="evenodd" d="M1.898 10.778A1 1 0 0 1 .483 9.363l3.333-3.332l.007-.007a1.457 1.457 0 0 1 2.039 0l.007.007L7.57 7.732L9.917 5.25l-1.04-1.04a.75.75 0 0 1 .53-1.28h3.652a.75.75 0 0 1 .75.75v3.652a.75.75 0 0 1-1.28.53l-1.197-1.198l-2.704 2.861a1.457 1.457 0 0 1-2.066.027l-.007-.007l-1.713-1.712z" clip-rule="evenodd" />
                                        </svg>

                                    </Box>
                                </Box>

                                <Box>
                                    <Typography variant="h5" fontWeight={600} sx={{
                                        fontSize: {
                                            md: 18,
                                            xs: 16
                                        },
                                        marginBottom: {
                                            md: 0.5,
                                            xs: 0
                                        }
                                    }}>
                                        Set up the fish batch
                                    </Typography>
                                    <Typography variant="body1" color="#555555" sx={{
                                        fontSize: {
                                            md: 16,
                                            xs: 14
                                        }
                                    }}>You've now successfully added production unit(s) to your farm. The next step is to assign a <span style={{
                                        color: "#06A19B",
                                        fontWeight: 500
                                    }}> fish batch </span> to each of the production units on your farm. After assigning a batch to your farm, you will assign a <span style={{
                                        color: "#06A19B",
                                        fontWeight: 500
                                    }}> feeding plan </span> that the system will use to do your projections
                                    </Typography>
                                </Box>
                            </Box>
                        </Stack>
                        <Box>
                            <Button
                                type="submit"
                                variant="contained"
                                sx={{
                                    background: "#06A19B",
                                    fontWeight: 600,
                                    padding: "6px 16px",
                                    width: "fit-content",
                                    textTransform: "capitalize",
                                    borderRadius: "8px",
                                    marginLeft: "auto",
                                    display: "block",
                                    marginTop: 2,
                                }}
                            >
                                Go to the dashboard
                            </Button>
                        </Box>
                    </Stack>
                </Grid>
            </Grid>

        </>
    );
}
