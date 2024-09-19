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

    const [age, setAge] = React.useState('');

    const handleChange = (event: SelectChangeEvent) => {
        setAge(event.target.value as string);
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
                    <Stack>

                        <Typography variant="h6" gutterBottom fontWeight={700} sx={{
                            fontSize: {
                                md: 24,
                                xs: 20
                            }
                        }}>Batch Wizard
                        </Typography>

                        <Typography variant="body1" color="#555555">
                            This wizard will assist you in adding a new fish batch to your account. <br />
                            The steps you will be following will proceed as follows:
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
                                    }}>Create a new batch</Typography>
                                    <Typography variant="body1" color="#555555" sx={{
                                        fontSize: {
                                            md: 16,
                                            xs: 14
                                        }
                                    }}>In this step you will define the parameters for the projection. </Typography>
                                </Box>
                            </Box>

                            <Box display={"flex"} alignItems={"start"} sx={{
                                gap: {
                                    md: 2,
                                    xs: 1.5
                                },
                                marginBlock: {
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
                                    }}>Define harvesting parameters</Typography>
                                    <Typography variant="body1" color="#555555" sx={{
                                        fontSize: {
                                            md: 16,
                                            xs: 14
                                        }
                                    }}>In this step you will define the parameters for the projection. In other words: when and how the batch would ideally be harvested </Typography>
                                </Box>
                            </Box>

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
                                        3
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
                                    }}>Choose feeding plan</Typography>
                                    <Typography variant="body1" color="#555555" sx={{
                                        fontSize: {
                                            md: 16,
                                            xs: 14
                                        }
                                    }}>Here you will select or create a feeding plan you will be following
                                        during the lifecycle of your newly added batch. You can choose from existing feeding plans - either your own saved feeding plans or plans composed by a nutritionist. Alternatively you can create your own feeding regime from the list of available feeds. </Typography>
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
                                Next
                            </Button>
                        </Box>

                    </Stack>

                    <Stack display={"none"}>
                        <Typography variant="h6" fontWeight={700} sx={{
                            fontSize: {
                                md: 24,
                                xs: 20
                            },
                            marginBottom: 3
                        }}>Batch Information
                        </Typography>

                        <Box>
                            <Typography variant="h6" gutterBottom fontWeight={700} sx={{
                                fontSize: {
                                    md: 20,
                                    xs: 18
                                }
                            }}>Batch Action
                            </Typography>

                            <List sx={{
                                py: 0,
                                display: "flex",
                                flexWrap: "wrap",
                                rowGap: 2,
                                columnGap: 3
                            }}>
                                <ListItem sx={{
                                    pl: 0,
                                    py: 0,
                                    width: "fit-content",
                                }}>

                                    <Box bgcolor={"#1BB6B0"} borderRadius={100} sx={{
                                        width: "8px",
                                        height: "8px",
                                        mr: 1
                                    }}></Box>
                                    Merging
                                </ListItem>

                                <ListItem sx={{
                                    pl: 0,
                                    py: 0,
                                    width: "fit-content",
                                }}>

                                    <Box bgcolor={"#1BB6B0"} borderRadius={100} sx={{
                                        width: "8px",
                                        height: "8px",
                                        mr: 1
                                    }}></Box>
                                    Existing batches
                                </ListItem>

                                <ListItem sx={{
                                    pl: 0,
                                    py: 0,
                                    width: "fit-content",
                                }}>

                                    <Box bgcolor={"#1BB6B0"} borderRadius={100} sx={{
                                        width: "8px",
                                        height: "8px",
                                        mr: 1
                                    }}></Box>
                                    Splitting
                                </ListItem>

                                <ListItem sx={{
                                    pl: 0,
                                    py: 0,
                                    width: "fit-content",
                                }}>

                                    <Box bgcolor={"#1BB6B0"} borderRadius={100} sx={{
                                        width: "8px",
                                        height: "8px",
                                        mr: 1
                                    }}></Box>
                                    One or more existing batches
                                </ListItem>

                                <ListItem sx={{
                                    pl: 0,
                                    py: 0,
                                    width: "fit-content",
                                }}>

                                    <Box bgcolor={"#1BB6B0"} borderRadius={100} sx={{
                                        width: "8px",
                                        height: "8px",
                                        mr: 1
                                    }}></Box>
                                    Moving
                                </ListItem>

                                <ListItem sx={{
                                    pl: 0,
                                    py: 0,
                                    width: "fit-content",
                                }}>

                                    <Box bgcolor={"#1BB6B0"} borderRadius={100} sx={{
                                        width: "8px",
                                        height: "8px",
                                        mr: 1
                                    }}></Box>
                                    A batch from another unit or by
                                </ListItem>

                                <ListItem sx={{
                                    pl: 0,
                                    py: 0,
                                    width: "fit-content",
                                }}>

                                    <Box bgcolor={"#1BB6B0"} borderRadius={100} sx={{
                                        width: "8px",
                                        height: "8px",
                                        mr: 1
                                    }}></Box>
                                    Creating
                                </ListItem>
                            </List>

                            <Stack mt={1} mb={7} display={"flex"} direction={"row"} justifyContent={"flex-start"} alignItems={"center"} gap={2} flexWrap={"wrap"}>
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
                                    Merge Batches
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
                                    Merge Batches
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
                                    Move Batch
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
                                    Create a Batch
                                </Button>
                            </Stack>

                            <form>

                                <Grid container spacing={2}>

                                    <Grid item md={6} xs={12}>

                                        <TextField
                                            label="Batch Name"
                                            type="text"
                                            className="form-input"
                                            // focused
                                            sx={{
                                                width: "100%",
                                                marginBottom: 2,
                                            }}
                                        />
                                    </Grid>

                                    <Grid item md={6} sm={4} xs={6}>
                                        <FormControl fullWidth className="form-input">
                                            <InputLabel id="demo-simple-select-label">Age</InputLabel>
                                            <Select
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                value={age}
                                                label="Age"
                                                onChange={handleChange}
                                            >
                                                <MenuItem value={10}>Ten</MenuItem>
                                                <MenuItem value={20}>Twenty</MenuItem>
                                                <MenuItem value={30}>Thirty</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>

                                    <Grid item md={6} sm={4} xs={6}>
                                        <FormControl fullWidth className="form-input">
                                            <InputLabel id="demo-simple-select-label">Age</InputLabel>
                                            <Select
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                value={age}
                                                label="Age"
                                                onChange={handleChange}
                                            >
                                                <MenuItem value={10}>Ten</MenuItem>
                                                <MenuItem value={20}>Twenty</MenuItem>
                                                <MenuItem value={30}>Thirty</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>

                                    <Grid item md={6} sm={4} xs={12}>
                                        <FormControl fullWidth className="form-input">
                                            <InputLabel id="demo-simple-select-label">Age</InputLabel>
                                            <Select
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                value={age}
                                                label="Age"
                                                onChange={handleChange}
                                            >
                                                <MenuItem value={10}>Ten</MenuItem>
                                                <MenuItem value={20}>Twenty</MenuItem>
                                                <MenuItem value={30}>Thirty</MenuItem>
                                            </Select>
                                        </FormControl>
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
                        }}>Harvesting Information
                        </Typography>

                        <Box>
                            <form>

                                <Grid container spacing={2}>
                                    <Grid item md={6} xs={12}>

                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DatePicker className="form-input" sx={{
                                                width: '100%',
                                            }} />
                                        </LocalizationProvider>

                                    </Grid>

                                    <Grid item md={6} sm={4} xs={6}>
                                        <FormControl fullWidth className="form-input">
                                            <InputLabel id="demo-simple-select-label">Age</InputLabel>
                                            <Select
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                value={age}
                                                label="Age"
                                                onChange={handleChange}
                                            >
                                                <MenuItem value={10}>Ten</MenuItem>
                                                <MenuItem value={20}>Twenty</MenuItem>
                                                <MenuItem value={30}>Thirty</MenuItem>
                                            </Select>
                                        </FormControl>
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
                        }}>Feeding Plan
                        </Typography>

                        <Box>
                            <form>

                                <Grid container spacing={2}>

                                    <Grid item md={6} xs={12}>

                                        <TextField
                                            label="Feed Plan Name"
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
                                        <FormControl fullWidth className="form-input">
                                            <InputLabel id="demo-simple-select-label">Age</InputLabel>
                                            <Select
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                value={age}
                                                label="Age"
                                                onChange={handleChange}
                                            >
                                                <MenuItem value={10}>Ten</MenuItem>
                                                <MenuItem value={20}>Twenty</MenuItem>
                                                <MenuItem value={30}>Thirty</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>

                                </Grid>

                                <Box>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        sx={{
                                            background: "#fff",
                                            color: "#06A19B",
                                            border: "1px solid #06A19B",
                                            boxShadow: "none",
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
                                        Add
                                    </Button>
                                </Box>

                                <Box>
                                    <Typography variant="h6" fontWeight={700} sx={{
                                        fontSize: {
                                            md: 24,
                                            xs: 20
                                        },
                                        marginBottom: 1.5
                                    }}>Your feed coverage:
                                    </Typography>


                                    <Grid container>
                                        <Grid item xs>
                                            <FormControl>
                                                <FormLabel
                                                    id="demo-row-radio-buttons-group-label" sx={{
                                                        fontSize: 18,
                                                        fontWeight: 600,
                                                        color: "#000 !important"
                                                    }}>Stocking</FormLabel>
                                                <RadioGroup
                                                    sx={{
                                                        fontSize: 50
                                                    }}
                                                    className="form-input"
                                                    row
                                                    aria-labelledby="demo-row-radio-buttons-group-label"
                                                    name="row-radio-buttons-group"
                                                >
                                                    <FormControlLabel className="form-radio" value="lorem" control={<Radio />} label="lorem" />
                                                    <FormControlLabel className="form-radio" value="lorem1" control={<Radio />} label="lorem1" />
                                                    <FormControlLabel className="form-radio" value="lorem2" control={<Radio />} label="lorem2" />
                                                </RadioGroup>
                                            </FormControl>
                                        </Grid>

                                        <Grid item xs>
                                            <FormControl>
                                                <FormLabel
                                                    id="demo-row-radio-buttons-group-label" sx={{
                                                        fontSize: 18,
                                                        fontWeight: 600,
                                                        color: "#000 !important"
                                                    }}>Harvest</FormLabel>
                                                <RadioGroup
                                                    sx={{
                                                        fontSize: 50
                                                    }}
                                                    className="form-input"
                                                    row
                                                    aria-labelledby="demo-row-radio-buttons-group-label"
                                                    name="row-radio-buttons-group"
                                                >
                                                    <FormControlLabel className="form-radio" value="lorem3" control={<Radio />} label="lorem3" />
                                                    <FormControlLabel className="form-radio" value="lorem4" control={<Radio />} label="lorem4" />
                                                    <FormControlLabel className="form-radio" value="lorem5" control={<Radio />} label="lorem5" />
                                                </RadioGroup>
                                            </FormControl>
                                        </Grid>
                                    </Grid>

                                    <Grid container spacing={2} mt={3}>

                                        <Grid item md={6} xs={12}>

                                            <TextField
                                                label="Feed Price"
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
                                                label="Feed Bag Size"
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

                                </Box>

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
                                        Submit
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
                                    }}>Set up your projections</Typography>
                                    <Typography variant="body1" color="#555555" sx={{
                                        fontSize: {
                                            md: 16,
                                            xs: 14
                                        }
                                    }}>for each of your production units on your dashboard. Projections are the
                                        <span style={{
                                            color: "#06A19B",
                                            fontWeight: 500
                                        }}> parameters </span> the website uses to make predictions or your batches. </Typography>
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

                                        <svg xmlns="http://www.w3.org/2000/svg" width="1.3em" height="1.3em" viewBox="0 0 36 36">
                                            <circle cx="20.75" cy="6" r="4" fill="#fff" className="clr-i-solid clr-i-solid-path-1" />
                                            <path fill="#fff" d="M24.84 26.23a1 1 0 0 0-1.4.29a16.6 16.6 0 0 1-3.51 3.77c-.33.25-1.56 1.2-2.08 1c-.36-.11-.15-.82-.08-1.12l.53-1.57c.22-.64 4.05-12 4.47-13.3c.62-1.9.35-3.77-2.48-3.32c-.77.08-8.58 1.09-8.72 1.1a1 1 0 0 0 .13 2s3-.39 3.33-.42a.88.88 0 0 1 .85.44a2.47 2.47 0 0 1-.07 1.71c-.26 1-4.37 12.58-4.5 13.25a2.78 2.78 0 0 0 1.18 3a5 5 0 0 0 3.08.83a8.5 8.5 0 0 0 3.09-.62c2.49-1 5.09-3.66 6.46-5.75a1 1 0 0 0-.28-1.29" className="clr-i-solid clr-i-solid-path-2" />
                                            <path fill="none" d="M0 0h36v36H0z" />
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
                                    }}>Information</Typography>
                                    <Typography variant="body1" color="#555555" sx={{
                                        fontSize: {
                                            md: 16,
                                            xs: 14
                                        }
                                    }}>When setting up your projection, you'll be asked to add information on
                                        <span style={{
                                            color: "#06A19B",
                                            fontWeight: 500
                                        }}> fish batch </span> that'll be growing in the production unit. Next, we'll need to know which <span style={{
                                            color: "#06A19B",
                                            fontWeight: 500
                                        }}> feed plan </span> you're going to use and lastly either the <span style={{
                                            color: "#06A19B",
                                            fontWeight: 500
                                        }}> harvest date </span> or the  <span style={{
                                            color: "#06A19B",
                                            fontWeight: 500
                                        }}> harvest weights</span>    </Typography>
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
                                Let's Get Started
                            </Button>
                        </Box>
                    </Stack>

                </Grid>
            </Grid>

        </>
    );
}
