"use client"
import BasicBreadcrumbs from "@/app/_components/Breadcrumbs";
import { Box, Button, Divider, FormControl, FormControlLabel, FormLabel, Grid, InputLabel, List, ListItem, ListItemButton, ListItemIcon, ListItemText, MenuItem, Paper, Radio, RadioGroup, Select, SelectChangeEvent, Stack, Step, StepLabel, Stepper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";

import { useState } from "react";

const steps = [
    {
        label: "Intro",
    },
    {
        label: "New Feed",
    },
    {
        label: "Feed Selection",
    },
    {
        label: "Feed Store",
    },
    {
        label: "Finished",
    },
];

function createData(
    name: string,
    calories: number,
    fat: number,
    carbs: number,
    protein: number,
) {
    return { name, calories, fat, carbs, protein };
}

const rows = [
    createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
    createData('Eclair', 262, 16.0, 24, 6.0),
    createData('Cupcake', 305, 3.7, 67, 4.3),
    createData('Gingerbread', 356, 16.0, 49, 3.9),
];

export default function Page() {
    const [activeStep, setActiveStep] = useState<number>(0);

    const [age, setAge] = useState("");

    const handleChange = (event: SelectChangeEvent) => {
        setAge(event.target.value as string);
    };

    return (
        <>
            <BasicBreadcrumbs
                heading={"Feed"}
                buttonName={"Add Feed"}
                searchOrganisations={true}
                searchUsers={false}
                searchFarm={true}
                isTable={true}
                // buttonRoute="/dashboard/farm/newFarm"
                links={[
                    { name: "Dashboard", link: "/dashboard" },
                    { name: "Feed Supply", link: "/dashboard" },
                ]}
            />
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

                <Grid
                    item
                    xl={9}
                    md={8}
                    xs={12}
                    my={2}
                // sx={{
                //     mt: {
                //         md: 0,
                //         xs: 5,
                //     },
                // }}
                >

                    {/* Intro */}
                    {/* <Stack>
                        <Typography
                            variant="h6"
                            fontWeight={700}
                            sx={{
                                fontSize: {
                                    md: 24,
                                    xs: 20,
                                },
                            }}
                        >
                            Lorem, ipsum.
                        </Typography>

                        <Typography variant="body1" color="#555555">
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Suscipit necessitatibus fugiat, eveniet modi velit sit?
                            <br />
                            The steps you will be following will proceed as follows:
                        </Typography>

                        <Stack mt={4}>
                            <Box
                                display={"flex"}
                                alignItems={"start"}
                                sx={{
                                    gap: {
                                        md: 2,
                                        xs: 1.5,
                                    },
                                }}
                            >
                                <Box>
                                    <Box
                                        fontWeight={700}
                                        display={"flex"}
                                        justifyContent={"center"}
                                        alignItems={"center"}
                                        borderRadius={100}
                                        sx={{
                                            width: {
                                                md: 60,
                                                xs: 30,
                                            },
                                            height: {
                                                md: 60,
                                                xs: 30,
                                            },
                                            color: "#fff",
                                            backgroundColor: "#06A19B",
                                            fontSize: {
                                                md: 28,
                                                xs: 16,
                                            },
                                        }}
                                    >
                                        1
                                    </Box>
                                </Box>

                                <Box>
                                    <Typography
                                        variant="h5"
                                        fontWeight={600}
                                        sx={{
                                            fontSize: {
                                                md: 18,
                                                xs: 16,
                                            },
                                            marginBottom: {
                                                md: 0.5,
                                                xs: 0,
                                            },
                                        }}
                                    >
                                        Lorem, ipsum dolor
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        color="#555555"
                                        sx={{
                                            fontSize: {
                                                md: 16,
                                                xs: 14,
                                            },
                                        }}
                                    >
                                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorem, repellat?
                                    </Typography>
                                </Box>
                            </Box>

                            <Box
                                display={"flex"}
                                alignItems={"start"}
                                sx={{
                                    gap: {
                                        md: 2,
                                        xs: 1.5,
                                    },
                                    marginBlock: {
                                        md: 5,
                                        xs: 2.5,
                                    },
                                }}
                            >
                                <Box>
                                    <Box
                                        fontWeight={700}
                                        display={"flex"}
                                        justifyContent={"center"}
                                        alignItems={"center"}
                                        borderRadius={100}
                                        sx={{
                                            width: {
                                                md: 60,
                                                xs: 30,
                                            },
                                            height: {
                                                md: 60,
                                                xs: 30,
                                            },
                                            color: "#fff",
                                            backgroundColor: "#06A19B",
                                            fontSize: {
                                                md: 28,
                                                xs: 16,
                                            },
                                        }}
                                    >
                                        2
                                    </Box>
                                </Box>

                                <Box>
                                    <Typography
                                        variant="h5"
                                        fontWeight={600}
                                        sx={{
                                            fontSize: {
                                                md: 18,
                                                xs: 16,
                                            },
                                            marginBottom: {
                                                md: 0.5,
                                                xs: 0,
                                            },
                                        }}
                                    >
                                        Lorem, ipsum
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        color="#555555"
                                        sx={{
                                            fontSize: {
                                                md: 16,
                                                xs: 14,
                                            },
                                        }}
                                    >
                                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequatur voluptatem numquam, nesciunt possimus maxime quibusdam eaque repudiandae nobis porro voluptatibus.
                                    </Typography>
                                </Box>
                            </Box>

                            <Box
                                display={"flex"}
                                alignItems={"start"}
                                sx={{
                                    gap: {
                                        md: 2,
                                        xs: 1.5,
                                    },
                                }}
                            >
                                <Box>
                                    <Box
                                        fontWeight={700}
                                        display={"flex"}
                                        justifyContent={"center"}
                                        alignItems={"center"}
                                        borderRadius={100}
                                        sx={{
                                            width: {
                                                md: 60,
                                                xs: 30,
                                            },
                                            height: {
                                                md: 60,
                                                xs: 30,
                                            },
                                            color: "#fff",
                                            backgroundColor: "#06A19B",
                                            fontSize: {
                                                md: 28,
                                                xs: 16,
                                            },
                                        }}
                                    >
                                        3
                                    </Box>
                                </Box>

                                <Box>
                                    <Typography
                                        variant="h5"
                                        fontWeight={600}
                                        sx={{
                                            fontSize: {
                                                md: 18,
                                                xs: 16,
                                            },
                                            marginBottom: {
                                                md: 0.5,
                                                xs: 0,
                                            },
                                        }}
                                    >
                                        Lorem, ipsum dolor
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        color="#555555"
                                        sx={{
                                            fontSize: {
                                                md: 16,
                                                xs: 14,
                                            },
                                        }}
                                    >
                                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo nesciunt tenetur architecto fugiat velit ut esse magnam quae facilis sint distinctio commodi provident a, eos repellendus! At incidunt ducimus dolorum quisquam, magni odit earum itaque molestias vel culpa perferendis repellendus iste facere ad, praesentium sint a. Deserunt veritatis officiis culpa?
                                    </Typography>
                                </Box>
                            </Box>
                        </Stack>
                        <Box display={"flex"} justifyContent={"flex-end"} alignItems={"center"}>
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
                                    marginTop: 3,
                                    border: "1px solid #06A19B",
                                }}
                            //   onClick={() => setActiveStep(1)}
                            >
                                Next
                            </Button>
                        </Box>
                    </Stack> */}
                    {/* Intro */}

                    {/* Feed Specification */}
                    <Stack>
                        <Typography
                            variant="h6"
                            fontWeight={700}
                            sx={{
                                fontSize: {
                                    md: 24,
                                    xs: 20,
                                },
                                marginBottom: 3,
                            }}
                        >
                            Feed Specification
                        </Typography>

                        <Box>
                            <form>
                                <Grid container spacing={2}>

                                    <Grid item md={6} xs={12}>
                                        <FormControl fullWidth className="form-input">
                                            <InputLabel id="feed-supply-select-label1">Feed Supplier</InputLabel>
                                            <Select
                                                labelId="feed-supply-select-label1"
                                                id="feed-supply-select1"
                                                value={age}
                                                label="Feed Supplier"
                                                onChange={handleChange}
                                            >
                                                <MenuItem value={10}>Ten</MenuItem>
                                                <MenuItem value={20}>Twenty</MenuItem>
                                                <MenuItem value={30}>Thirty</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>

                                    <Grid item md={6} xs={12}>

                                        <TextField
                                            label="Feed Supplier Code"
                                            type="text"
                                            className="form-input"
                                            // {...register("organisationName", {
                                            //     required: true,
                                            // })}
                                            // focused={userData?.data.name ? true : false}
                                            // value={userData?.data.name}
                                            sx={{
                                                width: "100%",
                                            }}
                                        />

                                    </Grid>

                                    <Grid item md={6} xs={12}>

                                        <TextField
                                            label="Brand Name"
                                            type="text"
                                            className="form-input"
                                            // {...register("organisationName", {
                                            //     required: true,
                                            // })}
                                            // focused={userData?.data.name ? true : false}
                                            // value={userData?.data.name}
                                            sx={{
                                                width: "100%",
                                            }}
                                        />

                                    </Grid>

                                    <Grid item md={6} xs={12}>

                                        <TextField
                                            label="Brand Code"
                                            type="text"
                                            className="form-input"
                                            // {...register("organisationName", {
                                            //     required: true,
                                            // })}
                                            // focused={userData?.data.name ? true : false}
                                            // value={userData?.data.name}
                                            sx={{
                                                width: "100%",
                                            }}
                                        />

                                    </Grid>

                                    <Grid item md={6} xs={12}>

                                        <TextField
                                            label="Product Name"
                                            type="text"
                                            className="form-input"
                                            // {...register("organisationName", {
                                            //     required: true,
                                            // })}
                                            // focused={userData?.data.name ? true : false}
                                            // value={userData?.data.name}
                                            sx={{
                                                width: "100%",
                                            }}
                                        />

                                    </Grid>

                                    <Grid item md={6} xs={12}>

                                        <TextField
                                            label="Product Code"
                                            type="text"
                                            className="form-input"
                                            // {...register("organisationName", {
                                            //     required: true,
                                            // })}
                                            // focused={userData?.data.name ? true : false}
                                            // value={userData?.data.name}
                                            sx={{
                                                width: "100%",
                                            }}
                                        />

                                    </Grid>

                                    <Grid item md={6} xs={12}>

                                        <TextField
                                            label="Product Name Code"
                                            type="text"
                                            className="form-input"
                                            // {...register("organisationName", {
                                            //     required: true,
                                            // })}
                                            // focused={userData?.data.name ? true : false}
                                            // value={userData?.data.name}
                                            sx={{
                                                width: "100%",
                                            }}
                                        />

                                    </Grid>

                                    <Grid item md={6} xs={12}>
                                        <FormControl fullWidth className="form-input">
                                            <InputLabel id="feed-supply-select-label2">Product Format</InputLabel>
                                            <Select
                                                labelId="feed-supply-select-label2"
                                                id="feed-supply-select2"
                                                value={age}
                                                label="Product Format"
                                                onChange={handleChange}
                                            >
                                                <MenuItem value={10}>Ten</MenuItem>
                                                <MenuItem value={20}>Twenty</MenuItem>
                                                <MenuItem value={30}>Thirty</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>

                                    <Grid item md={6} xs={12}>

                                        <TextField
                                            label="Product Format Code"
                                            type="text"
                                            className="form-input"
                                            // {...register("organisationName", {
                                            //     required: true,
                                            // })}
                                            // focused={userData?.data.name ? true : false}
                                            // value={userData?.data.name}
                                            sx={{
                                                width: "100%",
                                            }}
                                        />

                                    </Grid>

                                    <Grid item md={6} xs={12}>

                                        <Box display={"flex"} gap={2} alignItems={"center"} position={"relative"}>

                                            <TextField
                                                label="Particle Size"
                                                type="text"
                                                className="form-input"
                                                // {...register("organisationName", {
                                                //     required: true,
                                                // })}
                                                // focused={userData?.data.name ? true : false}
                                                // value={userData?.data.name}
                                                sx={{
                                                    width: "100%",
                                                }}
                                            />

                                            <Typography variant="body2" color="#555555AC" sx={{
                                                position: "absolute",
                                                right: 6,
                                                top: "50%",
                                                transform: "translate(-6px, -50%)",
                                                backgroundColor: "#fff",
                                                height: 30,
                                                display: "grid",
                                                placeItems: "center",
                                                zIndex: 1,
                                                pl: 1
                                            }}>
                                                mm
                                            </Typography>

                                        </Box>


                                    </Grid>

                                    <Grid item md={6} xs={12}>
                                        <FormControl fullWidth className="form-input">
                                            <InputLabel id="feed-supply-select-label3">Nutritional Class</InputLabel>
                                            <Select
                                                labelId="feed-supply-select-label3"
                                                id="feed-supply-select3"
                                                value={age}
                                                label="Nutritional Class"
                                                onChange={handleChange}
                                            >
                                                <MenuItem value={10}>Ten</MenuItem>
                                                <MenuItem value={20}>Twenty</MenuItem>
                                                <MenuItem value={30}>Thirty</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>

                                    <Grid item md={6} xs={12}>
                                        <FormControl fullWidth className="form-input">
                                            <InputLabel id="feed-supply-select-label4">Nutritional Purpose</InputLabel>
                                            <Select
                                                labelId="feed-supply-select-label4"
                                                id="feed-supply-select4"
                                                value={age}
                                                label="Nutritional Purpose"
                                                onChange={handleChange}
                                            >
                                                <MenuItem value={10}>Ten</MenuItem>
                                                <MenuItem value={20}>Twenty</MenuItem>
                                                <MenuItem value={30}>Thirty</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Typography variant="subtitle1" fontWeight={500}>Suitability</Typography>
                                    </Grid>

                                    <Grid item md={6} xs={12}>
                                        <FormControl fullWidth className="form-input">
                                            <InputLabel id="feed-supply-select-label5">Specie</InputLabel>
                                            <Select
                                                labelId="feed-supply-select-label5"
                                                id="feed-supply-select5"
                                                value={age}
                                                label="Specie"
                                                onChange={handleChange}
                                            >
                                                <MenuItem value={10}>Ten</MenuItem>
                                                <MenuItem value={20}>Twenty</MenuItem>
                                                <MenuItem value={30}>Thirty</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>

                                    <Grid item md={6} xs={12}>

                                        <Box display={"flex"} gap={2} alignItems={"center"} position={"relative"}>

                                            <TextField
                                                label="Animal Size (Length)"
                                                type="text"
                                                className="form-input"
                                                // {...register("organisationName", {
                                                //     required: true,
                                                // })}
                                                // focused={userData?.data.name ? true : false}
                                                // value={userData?.data.name}
                                                sx={{
                                                    width: "100%",
                                                }}
                                            />

                                            <Typography variant="body2" color="#555555AC" sx={{
                                                position: "absolute",
                                                right: 6,
                                                top: "50%",
                                                transform: "translate(-6px, -50%)",
                                                backgroundColor: "#fff",
                                                height: 30,
                                                display: "grid",
                                                placeItems: "center",
                                                zIndex: 1,
                                                pl: 1
                                            }}>
                                                mm
                                            </Typography>

                                        </Box>


                                    </Grid>

                                    <Grid item md={6} xs={12}>

                                        <Box display={"flex"} gap={2} alignItems={"center"} position={"relative"}>

                                            <TextField
                                                label="Animal Size (Weight)"
                                                type="text"
                                                className="form-input"
                                                // {...register("organisationName", {
                                                //     required: true,
                                                // })}
                                                // focused={userData?.data.name ? true : false}
                                                // value={userData?.data.name}
                                                sx={{
                                                    width: "100%",
                                                }}
                                            />

                                            <Typography variant="body2" color="#555555AC" sx={{
                                                position: "absolute",
                                                right: 6,
                                                top: "50%",
                                                transform: "translate(-6px, -50%)",
                                                backgroundColor: "#fff",
                                                height: 30,
                                                display: "grid",
                                                placeItems: "center",
                                                zIndex: 1,
                                                pl: 1
                                            }}>
                                                g
                                            </Typography>

                                        </Box>


                                    </Grid>

                                    <Grid item md={6} xs={12}>
                                        <FormControl fullWidth className="form-input">
                                            <InputLabel id="feed-supply-select-label6">Production Intensity</InputLabel>
                                            <Select
                                                labelId="feed-supply-select-label6"
                                                id="feed-supply-select6"
                                                value={age}
                                                label="Production Intensity"
                                                onChange={handleChange}
                                            >
                                                <MenuItem value={10}>Ten</MenuItem>
                                                <MenuItem value={20}>Twenty</MenuItem>
                                                <MenuItem value={30}>Thirty</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>

                                    <Grid item md={6} xs={12}>
                                        <FormControl fullWidth className="form-input">
                                            <InputLabel id="feed-supply-select-label7">Unit</InputLabel>
                                            <Select
                                                labelId="feed-supply-select-label7"
                                                id="feed-supply-select7"
                                                value={age}
                                                label="Unit"
                                                onChange={handleChange}
                                            >
                                                <MenuItem value={10}>Ten</MenuItem>
                                                <MenuItem value={20}>Twenty</MenuItem>
                                                <MenuItem value={30}>Thirty</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>

                                    <Grid item md={6} xs={12}>
                                        <FormControl fullWidth className="form-input">
                                            <InputLabel id="feed-supply-select-label8">Feeding Phase</InputLabel>
                                            <Select
                                                labelId="feed-supply-select-label8"
                                                id="feed-supply-select8"
                                                value={age}
                                                label="Feeding Phase"
                                                onChange={handleChange}
                                            >
                                                <MenuItem value={10}>Ten</MenuItem>
                                                <MenuItem value={20}>Twenty</MenuItem>
                                                <MenuItem value={30}>Thirty</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>

                                    <Grid item md={6} xs={12}>
                                        <FormControl fullWidth className="form-input">
                                            <InputLabel id="feed-supply-select-label9">Life Stage</InputLabel>
                                            <Select
                                                labelId="feed-supply-select-label9"
                                                id="feed-supply-select9"
                                                value={age}
                                                label="Life Stage"
                                                onChange={handleChange}
                                            >
                                                <MenuItem value={10}>Ten</MenuItem>
                                                <MenuItem value={20}>Twenty</MenuItem>
                                                <MenuItem value={30}>Thirty</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>

                                    <Grid item md={6} xs={12}>

                                        <Box display={"flex"} gap={2} alignItems={"center"} position={"relative"}>

                                            <TextField
                                                label="Shelf Live (from date of manufacturing)"
                                                type="text"
                                                className="form-input"
                                                // {...register("organisationName", {
                                                //     required: true,
                                                // })}
                                                // focused={userData?.data.name ? true : false}
                                                // value={userData?.data.name}
                                                sx={{
                                                    width: "100%",
                                                }}
                                            />

                                            <Typography variant="body2" color="#555555AC" sx={{
                                                position: "absolute",
                                                right: 6,
                                                top: "50%",
                                                transform: "translate(-6px, -50%)",
                                                backgroundColor: "#fff",
                                                height: 30,
                                                display: "grid",
                                                placeItems: "center",
                                                zIndex: 1,
                                                pl: 1
                                            }}>
                                                months
                                            </Typography>

                                        </Box>


                                    </Grid>

                                    <Grid item lg={6} xs={12}>

                                        <TextField
                                            label="Feed Ingredients"
                                            type="text"
                                            multiline
                                            rows={5}
                                            className="form-input"
                                            sx={{
                                                width: "100%"
                                            }}
                                        />

                                    </Grid>

                                    <Grid item lg={6} xs={12}>

                                        <TextField
                                            label="Feeding Guide"
                                            type="text"
                                            multiline
                                            rows={5}
                                            className="form-input"
                                            sx={{
                                                width: "100%"
                                            }}
                                        />

                                    </Grid>

                                </Grid>

                                <Stack>
                                    <Typography
                                        variant="h6"
                                        fontWeight={700}
                                        sx={{
                                            fontSize: {
                                                md: 20,
                                                xs: 18,
                                            },
                                            marginBottom: 3,
                                            marginTop: 5
                                        }}
                                    >
                                        Nutritional Guarantee
                                    </Typography>

                                    <Box sx={{
                                        borderRadius: 3,
                                        boxShadow: "0px 0px 16px 5px #0000001A",
                                        px: 2,
                                        py: 4
                                    }}>

                                        <Grid container rowSpacing={2} columnSpacing={2}>
                                            <Grid item xl={6} xs={12} sx={{
                                                display: "flex",
                                                gap: 1.5,
                                                alignItems: "center",
                                                minWidth: "200px",
                                                overflowX: "auto",
                                                pb: 1.5
                                            }}>

                                                <Typography variant="subtitle1" fontWeight={600} sx={{
                                                    minWidth: "14px"
                                                }}>1. </Typography>

                                                <Box display={"flex"} gap={2} alignItems={"center"} position={"relative"}>
                                                    <TextField
                                                        label="Moisture"
                                                        type="number"
                                                        className="form-input"
                                                        // {...register("organisationName", {
                                                        //     required: true,
                                                        // })}
                                                        // focused={userData?.data.name ? true : false}
                                                        // value={userData?.data.name}
                                                        sx={{
                                                            width: "100%",
                                                            minWidth: 190
                                                        }}
                                                    />

                                                    <Typography variant="body2" color="#555555AC" sx={{
                                                        position: "absolute",
                                                        right: 6,
                                                        top: "50%",
                                                        transform: "translate(-6px, -50%)",
                                                        backgroundColor: "#fff",
                                                        height: 30,
                                                        display: "grid",
                                                        placeItems: "center",
                                                        zIndex: 1,
                                                        pl: 1
                                                    }}>
                                                        g/kg
                                                    </Typography>
                                                </Box>

                                                <Button
                                                    type="button"
                                                    variant="contained"
                                                    sx={{
                                                        background: "#06a19b",
                                                        color: "#fff",
                                                        fontWeight: 600,
                                                        padding: "6px 16px",
                                                        width: "fit-content",
                                                        textTransform: "capitalize",
                                                        borderRadius: "8px",
                                                        border: "1px solid #06A19B",
                                                        minWidth: 90,
                                                    }}
                                                // onClick={() => handleCalculate(item, index)}
                                                >
                                                    Calculate
                                                </Button>

                                                <FormControl fullWidth className="form-input" sx={{
                                                    minWidth: 110
                                                }}>
                                                    <InputLabel id="feed-supply-select-label10">Min</InputLabel>
                                                    <Select
                                                        labelId="feed-supply-select-label10"
                                                        id="feed-supply-select10"
                                                        value={age}
                                                        label="Min"
                                                        onChange={handleChange}
                                                    >
                                                        <MenuItem value={10}>Ten</MenuItem>
                                                        <MenuItem value={20}>Twenty</MenuItem>
                                                        <MenuItem value={30}>Thirty</MenuItem>
                                                    </Select>
                                                </FormControl>

                                                <Box
                                                    fontSize={14}
                                                    fontWeight={500}
                                                    width="fit-content"
                                                    // onClick={handleClear}
                                                    style={{ cursor: "pointer" }}
                                                    sx={{
                                                        // visibility: "hidden"
                                                    }}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24">
                                                        <path fill="red" d="M12 20c-4.41 0-8-3.59-8-8s3.59-8 8-8s8 3.59 8 8s-3.59 8-8 8m0-18C6.47 2 2 6.47 2 12s4.47 10 10 10s10-4.47 10-10S17.53 2 12 2m2.59 6L12 10.59L9.41 8L8 9.41L10.59 12L8 14.59L9.41 16L12 13.41L14.59 16L16 14.59L13.41 12L16 9.41z" />
                                                    </svg>
                                                </Box>

                                            </Grid>

                                            <Grid item xl={6} xs={12} sx={{
                                                display: "flex",
                                                gap: 1.5,
                                                alignItems: "center",
                                                minWidth: "200px",
                                                overflowX: "auto",
                                                pb: 1.5
                                            }}>

                                                <Typography variant="subtitle1" fontWeight={600}>2. </Typography>

                                                <Box display={"flex"} gap={2} alignItems={"center"} position={"relative"}>
                                                    <TextField
                                                        label="Crude Protein"
                                                        type="number"
                                                        className="form-input"
                                                        // {...register("organisationName", {
                                                        //     required: true,
                                                        // })}
                                                        // focused={userData?.data.name ? true : false}
                                                        // value={userData?.data.name}
                                                        sx={{
                                                            width: "100%",
                                                            minWidth: 190
                                                        }}
                                                    />

                                                    <Typography variant="body2" color="#555555AC" sx={{
                                                        position: "absolute",
                                                        right: 6,
                                                        top: "50%",
                                                        transform: "translate(-6px, -50%)",
                                                        backgroundColor: "#fff",
                                                        height: 30,
                                                        display: "grid",
                                                        placeItems: "center",
                                                        zIndex: 1,
                                                        pl: 1
                                                    }}>
                                                        g/kg
                                                    </Typography>
                                                </Box>

                                                <Button
                                                    type="button"
                                                    variant="contained"
                                                    sx={{
                                                        background: "#06a19b",
                                                        color: "#fff",
                                                        fontWeight: 600,
                                                        padding: "6px 16px",
                                                        width: "fit-content",
                                                        textTransform: "capitalize",
                                                        borderRadius: "8px",
                                                        border: "1px solid #06A19B",
                                                        minWidth: 90,
                                                    }}
                                                // onClick={() => handleCalculate(item, index)}
                                                >
                                                    Calculate
                                                </Button>

                                                <FormControl fullWidth className="form-input" sx={{
                                                    minWidth: 110
                                                }}>
                                                    <InputLabel id="feed-supply-select-label10">Min</InputLabel>
                                                    <Select
                                                        labelId="feed-supply-select-label10"
                                                        id="feed-supply-select10"
                                                        value={age}
                                                        label="Min"
                                                        onChange={handleChange}
                                                    >
                                                        <MenuItem value={10}>Ten</MenuItem>
                                                        <MenuItem value={20}>Twenty</MenuItem>
                                                        <MenuItem value={30}>Thirty</MenuItem>
                                                    </Select>
                                                </FormControl>

                                                <Box
                                                    fontSize={14}
                                                    fontWeight={500}
                                                    width="fit-content"
                                                    // onClick={handleClear}
                                                    style={{ cursor: "pointer" }}
                                                    sx={{
                                                        visibility: "hidden"
                                                    }}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24">
                                                        <path fill="red" d="M12 20c-4.41 0-8-3.59-8-8s3.59-8 8-8s8 3.59 8 8s-3.59 8-8 8m0-18C6.47 2 2 6.47 2 12s4.47 10 10 10s10-4.47 10-10S17.53 2 12 2m2.59 6L12 10.59L9.41 8L8 9.41L10.59 12L8 14.59L9.41 16L12 13.41L14.59 16L16 14.59L13.41 12L16 9.41z" />
                                                    </svg>
                                                </Box>

                                            </Grid>

                                            <Grid item xl={6} xs={12} sx={{
                                                display: "flex",
                                                gap: 1.5,
                                                alignItems: "center",
                                                minWidth: "200px",
                                                overflowX: "auto",
                                                pb: 1.5
                                            }}>

                                                <Typography variant="subtitle1" fontWeight={600}>3. </Typography>

                                                <Box display={"flex"} gap={2} alignItems={"center"} position={"relative"}>
                                                    <TextField
                                                        label="Crude Fat"
                                                        type="number"
                                                        className="form-input"
                                                        // {...register("organisationName", {
                                                        //     required: true,
                                                        // })}
                                                        // focused={userData?.data.name ? true : false}
                                                        // value={userData?.data.name}
                                                        sx={{
                                                            width: "100%",
                                                            minWidth: 190
                                                        }}
                                                    />

                                                    <Typography variant="body2" color="#555555AC" sx={{
                                                        position: "absolute",
                                                        right: 6,
                                                        top: "50%",
                                                        transform: "translate(-6px, -50%)",
                                                        backgroundColor: "#fff",
                                                        height: 30,
                                                        display: "grid",
                                                        placeItems: "center",
                                                        zIndex: 1,
                                                        pl: 1
                                                    }}>
                                                        g/kg
                                                    </Typography>
                                                </Box>

                                                <Button
                                                    type="button"
                                                    variant="contained"
                                                    sx={{
                                                        background: "#06a19b",
                                                        color: "#fff",
                                                        fontWeight: 600,
                                                        padding: "6px 16px",
                                                        width: "fit-content",
                                                        textTransform: "capitalize",
                                                        borderRadius: "8px",
                                                        border: "1px solid #06A19B",
                                                        minWidth: 90,
                                                    }}
                                                // onClick={() => handleCalculate(item, index)}
                                                >
                                                    Calculate
                                                </Button>

                                                <FormControl fullWidth className="form-input" sx={{
                                                    minWidth: 110
                                                }}>
                                                    <InputLabel id="feed-supply-select-label10">Min</InputLabel>
                                                    <Select
                                                        labelId="feed-supply-select-label10"
                                                        id="feed-supply-select10"
                                                        value={age}
                                                        label="Min"
                                                        onChange={handleChange}
                                                    >
                                                        <MenuItem value={10}>Ten</MenuItem>
                                                        <MenuItem value={20}>Twenty</MenuItem>
                                                        <MenuItem value={30}>Thirty</MenuItem>
                                                    </Select>
                                                </FormControl>

                                                <Box
                                                    fontSize={14}
                                                    fontWeight={500}
                                                    width="fit-content"
                                                    // onClick={handleClear}
                                                    style={{ cursor: "pointer" }}
                                                    sx={{
                                                        visibility: "hidden"
                                                    }}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24">
                                                        <path fill="red" d="M12 20c-4.41 0-8-3.59-8-8s3.59-8 8-8s8 3.59 8 8s-3.59 8-8 8m0-18C6.47 2 2 6.47 2 12s4.47 10 10 10s10-4.47 10-10S17.53 2 12 2m2.59 6L12 10.59L9.41 8L8 9.41L10.59 12L8 14.59L9.41 16L12 13.41L14.59 16L16 14.59L13.41 12L16 9.41z" />
                                                    </svg>
                                                </Box>

                                            </Grid>

                                            <Grid item xl={6} xs={12} sx={{
                                                display: "flex",
                                                gap: 1.5,
                                                alignItems: "center",
                                                minWidth: "200px",
                                                overflowX: "auto",
                                                pb: 1.5
                                            }}>

                                                <Typography variant="subtitle1" fontWeight={600}>4. </Typography>

                                                <Box display={"flex"} gap={2} alignItems={"center"} position={"relative"}>
                                                    <TextField
                                                        label="Crude Ash"
                                                        type="number"
                                                        className="form-input"
                                                        // {...register("organisationName", {
                                                        //     required: true,
                                                        // })}
                                                        // focused={userData?.data.name ? true : false}
                                                        // value={userData?.data.name}
                                                        sx={{
                                                            width: "100%",
                                                            minWidth: 190
                                                        }}
                                                    />

                                                    <Typography variant="body2" color="#555555AC" sx={{
                                                        position: "absolute",
                                                        right: 6,
                                                        top: "50%",
                                                        transform: "translate(-6px, -50%)",
                                                        backgroundColor: "#fff",
                                                        height: 30,
                                                        display: "grid",
                                                        placeItems: "center",
                                                        zIndex: 1,
                                                        pl: 1
                                                    }}>
                                                        g/kg
                                                    </Typography>
                                                </Box>

                                                <Button
                                                    type="button"
                                                    variant="contained"
                                                    sx={{
                                                        background: "#06a19b",
                                                        color: "#fff",
                                                        fontWeight: 600,
                                                        padding: "6px 16px",
                                                        width: "fit-content",
                                                        textTransform: "capitalize",
                                                        borderRadius: "8px",
                                                        border: "1px solid #06A19B",
                                                        minWidth: 90,
                                                    }}
                                                // onClick={() => handleCalculate(item, index)}
                                                >
                                                    Calculate
                                                </Button>

                                                <FormControl fullWidth className="form-input" sx={{
                                                    minWidth: 110
                                                }}>
                                                    <InputLabel id="feed-supply-select-label10">Min</InputLabel>
                                                    <Select
                                                        labelId="feed-supply-select-label10"
                                                        id="feed-supply-select10"
                                                        value={age}
                                                        label="Min"
                                                        onChange={handleChange}
                                                    >
                                                        <MenuItem value={10}>Ten</MenuItem>
                                                        <MenuItem value={20}>Twenty</MenuItem>
                                                        <MenuItem value={30}>Thirty</MenuItem>
                                                    </Select>
                                                </FormControl>

                                                <Box
                                                    fontSize={14}
                                                    fontWeight={500}
                                                    width="fit-content"
                                                    // onClick={handleClear}
                                                    style={{ cursor: "pointer" }}
                                                    sx={{
                                                        visibility: "hidden"
                                                    }}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24">
                                                        <path fill="red" d="M12 20c-4.41 0-8-3.59-8-8s3.59-8 8-8s8 3.59 8 8s-3.59 8-8 8m0-18C6.47 2 2 6.47 2 12s4.47 10 10 10s10-4.47 10-10S17.53 2 12 2m2.59 6L12 10.59L9.41 8L8 9.41L10.59 12L8 14.59L9.41 16L12 13.41L14.59 16L16 14.59L13.41 12L16 9.41z" />
                                                    </svg>
                                                </Box>

                                            </Grid>

                                            <Grid item xl={6} xs={12} sx={{
                                                display: "flex",
                                                gap: 1.5,
                                                alignItems: "center",
                                                minWidth: "200px",
                                                overflowX: "auto",
                                                pb: 1.5
                                            }}>

                                                <Typography variant="subtitle1" fontWeight={600}>5. </Typography>

                                                <Box display={"flex"} gap={2} alignItems={"center"} position={"relative"}>
                                                    <TextField
                                                        label="Calcium"
                                                        type="number"
                                                        className="form-input"
                                                        // {...register("organisationName", {
                                                        //     required: true,
                                                        // })}
                                                        // focused={userData?.data.name ? true : false}
                                                        // value={userData?.data.name}
                                                        sx={{
                                                            width: "100%",
                                                            minWidth: 190
                                                        }}
                                                    />

                                                    <Typography variant="body2" color="#555555AC" sx={{
                                                        position: "absolute",
                                                        right: 6,
                                                        top: "50%",
                                                        transform: "translate(-6px, -50%)",
                                                        backgroundColor: "#fff",
                                                        height: 30,
                                                        display: "grid",
                                                        placeItems: "center",
                                                        zIndex: 1,
                                                        pl: 1
                                                    }}>
                                                        g/kg
                                                    </Typography>
                                                </Box>

                                                <Button
                                                    type="button"
                                                    variant="contained"
                                                    sx={{
                                                        background: "#06a19b",
                                                        color: "#fff",
                                                        fontWeight: 600,
                                                        padding: "6px 16px",
                                                        width: "fit-content",
                                                        textTransform: "capitalize",
                                                        borderRadius: "8px",
                                                        border: "1px solid #06A19B",
                                                        minWidth: 90,
                                                    }}
                                                // onClick={() => handleCalculate(item, index)}
                                                >
                                                    Calculate
                                                </Button>

                                                <FormControl fullWidth className="form-input" sx={{
                                                    minWidth: 110
                                                }}>
                                                    <InputLabel id="feed-supply-select-label10">Min</InputLabel>
                                                    <Select
                                                        labelId="feed-supply-select-label10"
                                                        id="feed-supply-select10"
                                                        value={age}
                                                        label="Min"
                                                        onChange={handleChange}
                                                    >
                                                        <MenuItem value={10}>Ten</MenuItem>
                                                        <MenuItem value={20}>Twenty</MenuItem>
                                                        <MenuItem value={30}>Thirty</MenuItem>
                                                    </Select>
                                                </FormControl>

                                                <Box
                                                    fontSize={14}
                                                    fontWeight={500}
                                                    width="fit-content"
                                                    // onClick={handleClear}
                                                    style={{ cursor: "pointer" }}
                                                    sx={{
                                                        visibility: "hidden"
                                                    }}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24">
                                                        <path fill="red" d="M12 20c-4.41 0-8-3.59-8-8s3.59-8 8-8s8 3.59 8 8s-3.59 8-8 8m0-18C6.47 2 2 6.47 2 12s4.47 10 10 10s10-4.47 10-10S17.53 2 12 2m2.59 6L12 10.59L9.41 8L8 9.41L10.59 12L8 14.59L9.41 16L12 13.41L14.59 16L16 14.59L13.41 12L16 9.41z" />
                                                    </svg>
                                                </Box>

                                            </Grid>

                                            <Grid item xl={6} xs={12} sx={{
                                                display: "flex",
                                                gap: 1.5,
                                                alignItems: "center",
                                                minWidth: "200px",
                                                overflowX: "auto",
                                                pb: 1.5
                                            }}>

                                                <Typography variant="subtitle1" fontWeight={600}>6. </Typography>

                                                <Box display={"flex"} gap={2} alignItems={"center"} position={"relative"}>
                                                    <TextField
                                                        label="Phosphorous"
                                                        type="number"
                                                        className="form-input"
                                                        // {...register("organisationName", {
                                                        //     required: true,
                                                        // })}
                                                        // focused={userData?.data.name ? true : false}
                                                        // value={userData?.data.name}
                                                        sx={{
                                                            width: "100%",
                                                            minWidth: 190
                                                        }}
                                                    />

                                                    <Typography variant="body2" color="#555555AC" sx={{
                                                        position: "absolute",
                                                        right: 6,
                                                        top: "50%",
                                                        transform: "translate(-6px, -50%)",
                                                        backgroundColor: "#fff",
                                                        height: 30,
                                                        display: "grid",
                                                        placeItems: "center",
                                                        zIndex: 1,
                                                        pl: 1
                                                    }}>
                                                        g/kg
                                                    </Typography>
                                                </Box>

                                                <Button
                                                    type="button"
                                                    variant="contained"
                                                    sx={{
                                                        background: "#06a19b",
                                                        color: "#fff",
                                                        fontWeight: 600,
                                                        padding: "6px 16px",
                                                        width: "fit-content",
                                                        textTransform: "capitalize",
                                                        borderRadius: "8px",
                                                        border: "1px solid #06A19B",
                                                        minWidth: 90,
                                                    }}
                                                // onClick={() => handleCalculate(item, index)}
                                                >
                                                    Calculate
                                                </Button>

                                                <FormControl fullWidth className="form-input" sx={{
                                                    minWidth: 110
                                                }}>
                                                    <InputLabel id="feed-supply-select-label10">Min</InputLabel>
                                                    <Select
                                                        labelId="feed-supply-select-label10"
                                                        id="feed-supply-select10"
                                                        value={age}
                                                        label="Min"
                                                        onChange={handleChange}
                                                    >
                                                        <MenuItem value={10}>Ten</MenuItem>
                                                        <MenuItem value={20}>Twenty</MenuItem>
                                                        <MenuItem value={30}>Thirty</MenuItem>
                                                    </Select>
                                                </FormControl>

                                                <Box
                                                    fontSize={14}
                                                    fontWeight={500}
                                                    width="fit-content"
                                                    // onClick={handleClear}
                                                    style={{ cursor: "pointer" }}
                                                    sx={{
                                                        visibility: "hidden"
                                                    }}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24">
                                                        <path fill="red" d="M12 20c-4.41 0-8-3.59-8-8s3.59-8 8-8s8 3.59 8 8s-3.59 8-8 8m0-18C6.47 2 2 6.47 2 12s4.47 10 10 10s10-4.47 10-10S17.53 2 12 2m2.59 6L12 10.59L9.41 8L8 9.41L10.59 12L8 14.59L9.41 16L12 13.41L14.59 16L16 14.59L13.41 12L16 9.41z" />
                                                    </svg>
                                                </Box>

                                            </Grid>

                                            <Grid item xl={6} xs={12} sx={{
                                                display: "flex",
                                                gap: 1.5,
                                                alignItems: "center",
                                                minWidth: "200px",
                                                overflowX: "auto",
                                                pb: 1.5
                                            }}>

                                                <Typography variant="subtitle1" fontWeight={600}>7. </Typography>

                                                <Box display={"flex"} gap={2} alignItems={"center"} position={"relative"}>
                                                    <TextField
                                                        label="Carbohydrates"
                                                        type="number"
                                                        className="form-input"
                                                        // {...register("organisationName", {
                                                        //     required: true,
                                                        // })}
                                                        // focused={userData?.data.name ? true : false}
                                                        // value={userData?.data.name}
                                                        sx={{
                                                            width: "100%",
                                                            minWidth: 190
                                                        }}
                                                    />

                                                    <Typography variant="body2" color="#555555AC" sx={{
                                                        position: "absolute",
                                                        right: 6,
                                                        top: "50%",
                                                        transform: "translate(-6px, -50%)",
                                                        backgroundColor: "#fff",
                                                        height: 30,
                                                        display: "grid",
                                                        placeItems: "center",
                                                        zIndex: 1,
                                                        pl: 1
                                                    }}>
                                                        g/kg
                                                    </Typography>
                                                </Box>

                                                <Button
                                                    type="button"
                                                    variant="contained"
                                                    sx={{
                                                        background: "#06a19b",
                                                        color: "#fff",
                                                        fontWeight: 600,
                                                        padding: "6px 16px",
                                                        width: "fit-content",
                                                        textTransform: "capitalize",
                                                        borderRadius: "8px",
                                                        border: "1px solid #06A19B",
                                                        minWidth: 90,
                                                    }}
                                                // onClick={() => handleCalculate(item, index)}
                                                >
                                                    Calculate
                                                </Button>

                                                <FormControl fullWidth className="form-input" sx={{
                                                    minWidth: 110
                                                }}>
                                                    <InputLabel id="feed-supply-select-label10">Min</InputLabel>
                                                    <Select
                                                        labelId="feed-supply-select-label10"
                                                        id="feed-supply-select10"
                                                        value={age}
                                                        label="Min"
                                                        onChange={handleChange}
                                                    >
                                                        <MenuItem value={10}>Ten</MenuItem>
                                                        <MenuItem value={20}>Twenty</MenuItem>
                                                        <MenuItem value={30}>Thirty</MenuItem>
                                                    </Select>
                                                </FormControl>

                                                <Box
                                                    fontSize={14}
                                                    fontWeight={500}
                                                    width="fit-content"
                                                    // onClick={handleClear}
                                                    style={{ cursor: "pointer" }}
                                                    sx={{
                                                        visibility: "hidden"
                                                    }}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24">
                                                        <path fill="red" d="M12 20c-4.41 0-8-3.59-8-8s3.59-8 8-8s8 3.59 8 8s-3.59 8-8 8m0-18C6.47 2 2 6.47 2 12s4.47 10 10 10s10-4.47 10-10S17.53 2 12 2m2.59 6L12 10.59L9.41 8L8 9.41L10.59 12L8 14.59L9.41 16L12 13.41L14.59 16L16 14.59L13.41 12L16 9.41z" />
                                                    </svg>
                                                </Box>

                                            </Grid>

                                            <Grid item xl={6} xs={12} sx={{
                                                display: "flex",
                                                gap: 1.5,
                                                alignItems: "center",
                                                minWidth: "200px",
                                                overflowX: "auto",
                                                pb: 1.5
                                            }}>

                                                <Typography variant="subtitle1" fontWeight={600}>8. </Typography>

                                                <Box display={"flex"} gap={2} alignItems={"center"} position={"relative"}>
                                                    <TextField
                                                        label="Metabolizable Energy"
                                                        type="number"
                                                        className="form-input"
                                                        // {...register("organisationName", {
                                                        //     required: true,
                                                        // })}
                                                        // focused={userData?.data.name ? true : false}
                                                        // value={userData?.data.name}
                                                        sx={{
                                                            width: "100%",
                                                            minWidth: 190
                                                        }}
                                                    />

                                                    <Typography variant="body2" color="#555555AC" sx={{
                                                        position: "absolute",
                                                        right: 6,
                                                        top: "50%",
                                                        transform: "translate(-6px, -50%)",
                                                        backgroundColor: "#fff",
                                                        height: 30,
                                                        display: "grid",
                                                        placeItems: "center",
                                                        zIndex: 1,
                                                        pl: 1
                                                    }}>
                                                        MJ/kg
                                                    </Typography>
                                                </Box>

                                                <Button
                                                    type="button"
                                                    variant="contained"
                                                    sx={{
                                                        background: "#06a19b",
                                                        color: "#fff",
                                                        fontWeight: 600,
                                                        padding: "6px 16px",
                                                        width: "fit-content",
                                                        textTransform: "capitalize",
                                                        borderRadius: "8px",
                                                        border: "1px solid #06A19B",
                                                        minWidth: 90,
                                                    }}
                                                // onClick={() => handleCalculate(item, index)}
                                                >
                                                    Calculate
                                                </Button>

                                                <FormControl fullWidth className="form-input" sx={{
                                                    minWidth: 110
                                                }}>
                                                    <InputLabel id="feed-supply-select-label10">Min</InputLabel>
                                                    <Select
                                                        labelId="feed-supply-select-label10"
                                                        id="feed-supply-select10"
                                                        value={age}
                                                        label="Min"
                                                        onChange={handleChange}
                                                    >
                                                        <MenuItem value={10}>Ten</MenuItem>
                                                        <MenuItem value={20}>Twenty</MenuItem>
                                                        <MenuItem value={30}>Thirty</MenuItem>
                                                    </Select>
                                                </FormControl>

                                                <Box
                                                    fontSize={14}
                                                    fontWeight={500}
                                                    width="fit-content"
                                                    // onClick={handleClear}
                                                    style={{ cursor: "pointer" }}
                                                    sx={{
                                                        visibility: "hidden"
                                                    }}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24">
                                                        <path fill="red" d="M12 20c-4.41 0-8-3.59-8-8s3.59-8 8-8s8 3.59 8 8s-3.59 8-8 8m0-18C6.47 2 2 6.47 2 12s4.47 10 10 10s10-4.47 10-10S17.53 2 12 2m2.59 6L12 10.59L9.41 8L8 9.41L10.59 12L8 14.59L9.41 16L12 13.41L14.59 16L16 14.59L13.41 12L16 9.41z" />
                                                    </svg>
                                                </Box>

                                            </Grid>

                                        </Grid>

                                    </Box>

                                </Stack>

                                <Box
                                    display={"flex"}
                                    justifyContent={"flex-end"}
                                    alignItems={"center"}
                                    gap={3}
                                    mt={3}
                                >
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        sx={{
                                            background: "#fff",
                                            color: "#06A19B",
                                            fontWeight: 600,
                                            padding: "6px 16px",
                                            width: "fit-content",
                                            textTransform: "capitalize",
                                            borderRadius: "8px",
                                            border: "1px solid #06A19B",
                                        }}
                                    //   onClick={() => setActiveStep(1)}
                                    >
                                        Previous
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
                                        }}
                                    //   onClick={() => setActiveStep(3)}
                                    >
                                        Add feed
                                    </Button>
                                </Box>

                            </form>
                        </Box>
                    </Stack>
                    {/* Feed Specification */}

                    {/* Feed Selection */}
                    {/* <Stack>
                        <Typography
                            variant="h6"
                            fontWeight={700}
                            sx={{
                                fontSize: {
                                    md: 24,
                                    xs: 20,
                                },
                                marginBottom: 3,
                            }}
                        >
                            Feed Selection
                        </Typography>

                        <Grid container spacing={2}>

                            <Grid item xs="auto">

                                <Box border={"1px solid #555555AC"} borderRadius={3} p={2}
                                    sx={{
                                        width: "ft-content",
                                        maxWidth: "370px",
                                    }}
                                >

                                    <Box display={"flex"} gap={1} alignItems={"flex-start"} justifyContent={"space-between"}>
                                        <Box textAlign={"center"}>
                                            <Typography
                                                color="#06a19b"
                                                variant="h6"
                                                fontWeight={600}
                                                fontSize={20}
                                            >
                                                SAF Tiplapia PreStarter
                                            </Typography>

                                            <Typography
                                                color="#000"
                                                variant="subtitle2"
                                                fontWeight={500}
                                                fontSize={11}
                                            >
                                                Product code [SAF-TG-4208-1mm-C]
                                            </Typography>
                                        </Box>

                                        <Box bgcolor={"rgba(6, 161, 155, 0.15)"} p={1.5} borderRadius={1.5} display={"flex"} flexDirection={"column"} justifyContent={"center"} alignItems={"center"}>

                                            <Typography
                                                color="#06a19b"
                                                variant="h6"
                                                fontWeight={600}
                                                fontSize={20}
                                                display={"flex"}
                                                alignItems={"end"}
                                                lineHeight={1}
                                                gap={1}
                                            >
                                                1

                                                <Typography
                                                    color="#06a19b"
                                                    variant="h6"
                                                    fontWeight={700}
                                                    fontSize={12}
                                                    lineHeight={1}

                                                >
                                                    mm
                                                </Typography>

                                            </Typography>

                                            <Typography
                                                color="#06a19b"
                                                variant="h6"
                                                fontWeight={600}
                                                fontSize={12}
                                            >
                                                Crumble
                                            </Typography>

                                        </Box>
                                    </Box>

                                    <Divider
                                        sx={{
                                            borderColor: "#06a19bBC",
                                            borderWidth: 1,
                                            my: 1.5,
                                            borderRadius: 50
                                        }}
                                    />

                                    <Box>

                                        <Typography
                                            color="#000"
                                            variant="h6"
                                            fontWeight={500}
                                            fontSize={14}
                                            textAlign={"center"}
                                        >
                                            [Complete & Balanced] Feed for [Tilapia] production. <br />
                                            Suitable for use as [Primary Food Source] in [Intensive Production Systems].
                                        </Typography>

                                        <Box display={"flex"} justifyContent={"center"} alignItems={"stretch"} gap={1} mt={1}>

                                            <Box display={"grid"} alignItems={"stretch"}>

                                                <Box display={"flex"} flexDirection={"column"} justifyContent={"center"} alignItems={"center"} gap={0.5}>

                                                    <Typography
                                                        color="#06a19b"
                                                        variant="h6"
                                                        fontWeight={500}
                                                        fontSize={14}
                                                        textAlign={"center"}
                                                    >
                                                        Feeding Phase
                                                    </Typography>

                                                    <Box bgcolor={"rgba(6, 161, 155, 0.15)"} p={1.5} borderRadius={1.5} width={160}>
                                                        <List sx={{
                                                            p: 0,
                                                            display: "flex",
                                                            justifyContent: "center",
                                                            alignItems: "center",
                                                            columnGap: 1,
                                                            flexWrap: "wrap"
                                                        }}>
                                                            <ListItem sx={{
                                                                p: 0,
                                                                color: "#06a19b",
                                                                fontWeight: 600,
                                                                fontSize: 16,
                                                                width: "fit-content"
                                                            }}>
                                                                Hatchery
                                                            </ListItem>

                                                            <ListItem sx={{
                                                                p: 0,
                                                                color: "#06a19b",
                                                                fontWeight: 600,
                                                                fontSize: 16,
                                                                width: "fit-content"
                                                            }}>

                                                                <ListItemIcon sx={{
                                                                    p: 0,
                                                                    minWidth: "fit-content",
                                                                    mr: 1,
                                                                    fontSize: 6,
                                                                    color: "#06a19b"
                                                                }}>
                                                                    ⬤
                                                                </ListItemIcon>


                                                                Fry
                                                            </ListItem>

                                                            <ListItem sx={{
                                                                p: 0,
                                                                color: "#06a19b",
                                                                fontWeight: 600,
                                                                fontSize: 16,
                                                                width: "fit-content"
                                                            }}>

                                                                <ListItemIcon sx={{
                                                                    p: 0,
                                                                    minWidth: "fit-content",
                                                                    mr: 1,
                                                                    fontSize: 6,
                                                                    color: "#06a19b"
                                                                }}>
                                                                    ⬤
                                                                </ListItemIcon>


                                                                PreStarter
                                                            </ListItem>
                                                        </List>
                                                    </Box>

                                                </Box>

                                            </Box>

                                            <Box display={"grid"} alignItems={"stretch"}>

                                                <Box display={"flex"} flexDirection={"column"} gap={0.5}>

                                                    <Typography
                                                        color="#06a19b"
                                                        variant="h6"
                                                        fontWeight={500}
                                                        fontSize={14}
                                                        textAlign={"center"}
                                                        sx={{
                                                            textWrap: "nowrap"
                                                        }}
                                                    >
                                                        Fish Size Class
                                                    </Typography>

                                                    <Box bgcolor={"rgba(6, 161, 155, 0.15)"} p={1.5} borderRadius={1.5} width={160} height={"100%"}
                                                        display={"flex"} justifyContent={"center"} alignItems={"center"}
                                                    >
                                                        <Typography
                                                            color="#06a19b"
                                                            variant="h6"
                                                            fontWeight={600}
                                                            fontSize={16}
                                                            textAlign={"center"}
                                                        >
                                                            5 - 30g
                                                        </Typography>
                                                    </Box>

                                                </Box>

                                            </Box>

                                        </Box>



                                    </Box>

                                    <Divider
                                        sx={{
                                            borderColor: "#06a19bBC",
                                            borderWidth: 1,
                                            my: 1.5,
                                            borderRadius: 50
                                        }}
                                    />

                                    <Box>
                                        <Typography
                                            variant="h6"
                                            fontWeight={600}
                                            fontSize={18}
                                            color="#000"
                                        >
                                            Nutritional Guarantees
                                        </Typography>

                                        <Grid container mt={0.5}>
                                            <Grid item xs={6}>
                                                <Typography
                                                    variant="subtitle1"
                                                    fontWeight={500}
                                                    fontSize={14}
                                                >
                                                    Moisture (Max)
                                                </Typography>
                                            </Grid>

                                            <Grid item xs={6} textAlign={"right"}>
                                                <Typography
                                                    variant="subtitle1"
                                                    fontWeight={600}
                                                    fontSize={14}
                                                >
                                                    100
                                                </Typography>
                                            </Grid>

                                            <Grid item xs={6}>
                                                <Typography
                                                    variant="subtitle1"
                                                    fontWeight={500}
                                                    fontSize={14}
                                                >
                                                    Crude Protein
                                                </Typography>
                                            </Grid>

                                            <Grid item xs={6} textAlign={"right"}>
                                                <Typography
                                                    variant="subtitle1"
                                                    fontWeight={600}
                                                    fontSize={14}
                                                >
                                                    420
                                                </Typography>
                                            </Grid>

                                            <Grid item xs={6}>
                                                <Typography
                                                    variant="subtitle1"
                                                    fontWeight={500}
                                                    fontSize={14}
                                                >
                                                    Crude Fat (Min)
                                                </Typography>
                                            </Grid>

                                            <Grid item xs={6} textAlign={"right"}>
                                                <Typography
                                                    variant="subtitle1"
                                                    fontWeight={600}
                                                    fontSize={14}
                                                >
                                                    80
                                                </Typography>
                                            </Grid>

                                            <Grid item xs={6}>
                                                <Typography
                                                    variant="subtitle1"
                                                    fontWeight={500}
                                                    fontSize={14}
                                                >
                                                    Crude Fiber (Max)
                                                </Typography>
                                            </Grid>

                                            <Grid item xs={6} textAlign={"right"}>
                                                <Typography
                                                    variant="subtitle1"
                                                    fontWeight={600}
                                                    fontSize={14}
                                                >
                                                    50
                                                </Typography>
                                            </Grid>

                                            <Grid item xs={6}>
                                                <Typography
                                                    variant="subtitle1"
                                                    fontWeight={500}
                                                    fontSize={14}
                                                >
                                                    Crude Ash (Max)
                                                </Typography>
                                            </Grid>

                                            <Grid item xs={6} textAlign={"right"}>
                                                <Typography
                                                    variant="subtitle1"
                                                    fontWeight={600}
                                                    fontSize={14}
                                                >
                                                    50
                                                </Typography>
                                            </Grid>

                                            <Grid item xs={6}>
                                                <Typography
                                                    variant="subtitle1"
                                                    fontWeight={500}
                                                    fontSize={14}
                                                >
                                                    Calcium (Min)
                                                </Typography>
                                            </Grid>

                                            <Grid item xs={6} textAlign={"right"}>
                                                <Typography
                                                    variant="subtitle1"
                                                    fontWeight={600}
                                                    fontSize={14}
                                                >
                                                    510
                                                </Typography>
                                            </Grid>

                                            <Grid item xs={6}>
                                                <Typography
                                                    variant="subtitle1"
                                                    fontWeight={500}
                                                    fontSize={14}
                                                >
                                                    Phosphorous (Min)
                                                </Typography>
                                            </Grid>

                                            <Grid item xs={6} textAlign={"right"}>
                                                <Typography
                                                    variant="subtitle1"
                                                    fontWeight={600}
                                                    fontSize={14}
                                                >
                                                    19
                                                </Typography>
                                            </Grid>

                                        </Grid>

                                    </Box>

                                    <Divider
                                        sx={{
                                            borderColor: "#06a19bBC",
                                            borderWidth: 1,
                                            my: 1.5,
                                            borderRadius: 50
                                        }}
                                    />

                                    <Box>
                                        <Typography
                                            variant="h6"
                                            fontWeight={600}
                                            fontSize={18}
                                            color="#000"
                                        >
                                            Feed Ingredients
                                        </Typography>

                                        <Typography
                                            variant="h6"
                                            fontWeight={500}
                                            fontSize={14}
                                            color="#000"
                                            mt={0.5}
                                            textAlign={"justify"}
                                        >
                                            [Yellow Maize, Soyabean Meal, Fish Meal, Wheat Bran, Soyabean Oil, Monocalcium Phosphate, Limestone, Vitamins & Minerals]
                                        </Typography>



                                    </Box>

                                    <Divider
                                        sx={{
                                            borderColor: "#06a19bBC",
                                            borderWidth: 1,
                                            my: 1.5,
                                            borderRadius: 50
                                        }}
                                    />

                                    <Box>
                                        <Typography
                                            variant="h6"
                                            fontWeight={600}
                                            fontSize={18}
                                            color="#000"
                                        >
                                            Feeding Guide
                                        </Typography>

                                        <Typography
                                            variant="h6"
                                            fontWeight={500}
                                            fontSize={14}
                                            color="#000"
                                            mt={0.5}
                                        >
                                            Feed according to the Feedflow guide or as directed by a fish nutritionist
                                        </Typography>

                                    </Box>

                                    <Divider
                                        sx={{
                                            borderColor: "#06a19bBC",
                                            borderWidth: 1,
                                            my: 1.5,
                                            borderRadius: 50
                                        }}
                                    />

                                    <Typography
                                        variant="h6"
                                        fontWeight={600}
                                        fontSize={18}
                                        color="#06a19b"
                                        textAlign={"center"}
                                    >
                                        Shelf Life: 12 months
                                    </Typography>


                                    <Divider
                                        sx={{
                                            borderColor: "#06a19bBC",
                                            borderWidth: 1,
                                            my: 1.5,
                                            borderRadius: 50
                                        }}
                                    />

                                    <Typography
                                        variant="h6"
                                        fontWeight={500}
                                        fontSize={14}
                                        color="#000"
                                    >
                                        Specialized Aquatic Feeds(Pty) Ltd. Corner Church and Stil St, Westcliff, Hermanus 7200, South Africa <br />
                                        Tel: +27 28 313 8581 / info@safeeds.co.za
                                    </Typography>

                                </Box>

                            </Grid>

                        </Grid>
                    </Stack> */}
                    {/* Feed Selection */}

                </Grid>
            </Grid>
        </>
    );
}
