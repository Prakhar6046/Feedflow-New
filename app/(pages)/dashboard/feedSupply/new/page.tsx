"use client";
import BasicBreadcrumbs from "@/app/_components/Breadcrumbs";
import {
  Box,
  Button,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
  SelectChangeEvent,
  Stack,
  Step,
  StepLabel,
  Stepper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";

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
  protein: number
) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
  createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
  createData("Eclair", 262, 16.0, 24, 6.0),
  createData("Cupcake", 305, 3.7, 67, 4.3),
  createData("Gingerbread", 356, 16.0, 49, 3.9),
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
                      <InputLabel id="feed-supply-select-label1">
                        Feed Supplier
                      </InputLabel>
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
                      <InputLabel id="feed-supply-select-label2">
                        Product Format
                      </InputLabel>
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
                    <Box
                      display={"flex"}
                      gap={2}
                      alignItems={"center"}
                      position={"relative"}
                    >
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

                      <Typography
                        variant="body2"
                        color="#555555AC"
                        sx={{
                          position: "absolute",
                          right: 6,
                          top: "50%",
                          transform: "translate(-6px, -50%)",
                          backgroundColor: "#fff",
                          height: 30,
                          display: "grid",
                          placeItems: "center",
                          zIndex: 1,
                          pl: 1,
                        }}
                      >
                        mm
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item md={6} xs={12}>
                    <FormControl fullWidth className="form-input">
                      <InputLabel id="feed-supply-select-label3">
                        Nutritional Class
                      </InputLabel>
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
                      <InputLabel id="feed-supply-select-label4">
                        Nutritional Purpose
                      </InputLabel>
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
                    <Typography variant="subtitle1" fontWeight={500}>
                      Suitability
                    </Typography>
                  </Grid>

                  <Grid item md={6} xs={12}>
                    <FormControl fullWidth className="form-input">
                      <InputLabel id="feed-supply-select-label5">
                        Specie
                      </InputLabel>
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
                    <Box
                      display={"flex"}
                      gap={2}
                      alignItems={"center"}
                      position={"relative"}
                    >
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

                      <Typography
                        variant="body2"
                        color="#555555AC"
                        sx={{
                          position: "absolute",
                          right: 6,
                          top: "50%",
                          transform: "translate(-6px, -50%)",
                          backgroundColor: "#fff",
                          height: 30,
                          display: "grid",
                          placeItems: "center",
                          zIndex: 1,
                          pl: 1,
                        }}
                      >
                        mm
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item md={6} xs={12}>
                    <Box
                      display={"flex"}
                      gap={2}
                      alignItems={"center"}
                      position={"relative"}
                    >
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

                      <Typography
                        variant="body2"
                        color="#555555AC"
                        sx={{
                          position: "absolute",
                          right: 6,
                          top: "50%",
                          transform: "translate(-6px, -50%)",
                          backgroundColor: "#fff",
                          height: 30,
                          display: "grid",
                          placeItems: "center",
                          zIndex: 1,
                          pl: 1,
                        }}
                      >
                        g
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item md={6} xs={12}>
                    <FormControl fullWidth className="form-input">
                      <InputLabel id="feed-supply-select-label6">
                        Production Intensity
                      </InputLabel>
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
                      <InputLabel id="feed-supply-select-label7">
                        Unit
                      </InputLabel>
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
                      <InputLabel id="feed-supply-select-label8">
                        Feeding Phase
                      </InputLabel>
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
                      <InputLabel id="feed-supply-select-label9">
                        Life Stage
                      </InputLabel>
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
                    <Box
                      display={"flex"}
                      gap={2}
                      alignItems={"center"}
                      position={"relative"}
                    >
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

                      <Typography
                        variant="body2"
                        color="#555555AC"
                        sx={{
                          position: "absolute",
                          right: 6,
                          top: "50%",
                          transform: "translate(-6px, -50%)",
                          backgroundColor: "#fff",
                          height: 30,
                          display: "grid",
                          placeItems: "center",
                          zIndex: 1,
                          pl: 1,
                        }}
                      >
                        months
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>

                {/* <Box
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
                                        Next
                                    </Button>
                                </Box> */}

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
                      marginTop: 5,
                    }}
                  >
                    Nutritional Guarantee
                  </Typography>

                  {/* <TableContainer component={Paper}
                                    // sx={{
                                    //     boxShadow: 'none'
                                    // }}
                                    >
                                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                            <TableBody>
                                                <TableRow
                                                // sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                >
                                                    <TableCell component="th" scope="row" align="center">
                                                        <Typography variant="subtitle1" fontWeight={600}>1. </Typography>
                                                    </TableCell>
                                                    <TableCell>

                                                        <Box display={"flex"} gap={2} alignItems={"center"} position={"relative"}>
                                                            <TextField
                                                                label="Moisture"
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
                                                                g/kg
                                                            </Typography>
                                                        </Box>

                                                    </TableCell>
                                                    <TableCell>

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

                                                    </TableCell>
                                                    <TableCell>

                                                        <FormControl fullWidth className="form-input">
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

                                                    </TableCell>
                                                    <TableCell>

                                                        <Box
                                                            fontSize={14}
                                                            fontWeight={500}
                                                            display="flex"
                                                            justifyContent="flex-start"
                                                            alignItems="center"
                                                            gap={0.5}
                                                            bgcolor="#06A19B"
                                                            paddingBlock={1.175}
                                                            paddingInline={1.5}
                                                            borderRadius={2}
                                                            color="white"
                                                            width="fit-content"
                                                            // onClick={handleClear}
                                                            style={{ cursor: "pointer" }}
                                                        >
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                width="1.3em"
                                                                height="1.3em"
                                                                viewBox="0 0 24 24"
                                                            >
                                                                <path
                                                                    fill="currentColor"
                                                                    fillRule="evenodd"
                                                                    d="M10.31 2.25h3.38c.217 0 .406 0 .584.028a2.25 2.25 0 0 1 1.64 1.183c.084.16.143.339.212.544l.111.335l.03.085a1.25 1.25 0 0 0 1.233.825h3a.75.75 0 0 1 0 1.5h-17a.75.75 0 0 1 0-1.5h3.09a1.25 1.25 0 0 0 1.173-.91l.112-.335c.068-.205.127-.384.21-.544a2.25 2.25 0 0 1 1.641-1.183c.178-.028.367-.028.583-.028m-1.302 3a3 3 0 0 0 .175-.428l.1-.3c.091-.273.112-.328.133-.368a.75.75 0 0 1 .547-.395a3 3 0 0 1 .392-.009h3.29c.288 0 .348.002.392.01a.75.75 0 0 1 .547.394c.021.04.042.095.133.369l.1.3l.039.112q.059.164.136.315z"
                                                                    clipRule="evenodd"
                                                                />
                                                                <path
                                                                    fill="currentColor"
                                                                    d="M5.915 8.45a.75.75 0 1 0-1.497.1l.464 6.952c.085 1.282.154 2.318.316 3.132c.169.845.455 1.551 1.047 2.104s1.315.793 2.17.904c.822.108 1.86.108 3.146.108h.879c1.285 0 2.324 0 3.146-.108c.854-.111 1.578-.35 2.17-.904c.591-.553.877-1.26 1.046-2.104c.162-.813.23-1.85.316-3.132l.464-6.952a.75.75 0 0 0-1.497-.1l-.46 6.9c-.09 1.347-.154 2.285-.294 2.99c-.137.685-.327 1.047-.6 1.303c-.274.256-.648.422-1.34.512c-.713.093-1.653.095-3.004.095h-.774c-1.35 0-2.29-.002-3.004-.095c-.692-.09-1.066-.256-1.34-.512c-.273-.256-.463-.618-.6-1.302c-.14-.706-.204-1.644-.294-2.992z"
                                                                />
                                                                <path
                                                                    fill="currentColor"
                                                                    d="M9.425 10.254a.75.75 0 0 1 .821.671l.5 5a.75.75 0 0 1-1.492.15l-.5-5a.75.75 0 0 1 .671-.821m5.15 0a.75.75 0 0 1 .671.82l-.5 5a.75.75 0 0 1-1.492-.149l.5-5a.75.75 0 0 1 .82-.671"
                                                                />
                                                            </svg>
                                                            Clear
                                                        </Box>

                                                    </TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </TableContainer> */}

                  <Box
                    sx={{
                      borderRadius: 3,
                      boxShadow: "0px 0px 16px 5px #0000001A",
                      padding: 3,
                    }}
                  >
                    <Grid container spacing={2}>
                      {/* <Grid item xs={6} sx={{
                                                display: "flex",
                                                gap: 2,
                                                alignItems: "center",
                                            }}>

                                                <Typography variant="subtitle1" fontWeight={600}>1. </Typography>

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
                                                            minWidth: 140
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
                                                    display="flex"
                                                    justifyContent="flex-start"
                                                    alignItems="center"
                                                    gap={0.5}
                                                    bgcolor="#06A19B"
                                                    paddingBlock={1.175}
                                                    paddingInline={1.5}
                                                    borderRadius={2}
                                                    color="white"
                                                    width="fit-content"
                                                    // onClick={handleClear}
                                                    style={{ cursor: "pointer" }}
                                                    // sx={{
                                                    //     visibility: "hidden"
                                                    // }}
                                                >
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="1.3em"
                                                        height="1.3em"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            fill="currentColor"
                                                            fillRule="evenodd"
                                                            d="M10.31 2.25h3.38c.217 0 .406 0 .584.028a2.25 2.25 0 0 1 1.64 1.183c.084.16.143.339.212.544l.111.335l.03.085a1.25 1.25 0 0 0 1.233.825h3a.75.75 0 0 1 0 1.5h-17a.75.75 0 0 1 0-1.5h3.09a1.25 1.25 0 0 0 1.173-.91l.112-.335c.068-.205.127-.384.21-.544a2.25 2.25 0 0 1 1.641-1.183c.178-.028.367-.028.583-.028m-1.302 3a3 3 0 0 0 .175-.428l.1-.3c.091-.273.112-.328.133-.368a.75.75 0 0 1 .547-.395a3 3 0 0 1 .392-.009h3.29c.288 0 .348.002.392.01a.75.75 0 0 1 .547.394c.021.04.042.095.133.369l.1.3l.039.112q.059.164.136.315z"
                                                            clipRule="evenodd"
                                                        />
                                                        <path
                                                            fill="currentColor"
                                                            d="M5.915 8.45a.75.75 0 1 0-1.497.1l.464 6.952c.085 1.282.154 2.318.316 3.132c.169.845.455 1.551 1.047 2.104s1.315.793 2.17.904c.822.108 1.86.108 3.146.108h.879c1.285 0 2.324 0 3.146-.108c.854-.111 1.578-.35 2.17-.904c.591-.553.877-1.26 1.046-2.104c.162-.813.23-1.85.316-3.132l.464-6.952a.75.75 0 0 0-1.497-.1l-.46 6.9c-.09 1.347-.154 2.285-.294 2.99c-.137.685-.327 1.047-.6 1.303c-.274.256-.648.422-1.34.512c-.713.093-1.653.095-3.004.095h-.774c-1.35 0-2.29-.002-3.004-.095c-.692-.09-1.066-.256-1.34-.512c-.273-.256-.463-.618-.6-1.302c-.14-.706-.204-1.644-.294-2.992z"
                                                        />
                                                        <path
                                                            fill="currentColor"
                                                            d="M9.425 10.254a.75.75 0 0 1 .821.671l.5 5a.75.75 0 0 1-1.492.15l-.5-5a.75.75 0 0 1 .671-.821m5.15 0a.75.75 0 0 1 .671.82l-.5 5a.75.75 0 0 1-1.492-.149l.5-5a.75.75 0 0 1 .82-.671"
                                                        />
                                                    </svg>
                                                    Clear
                                                </Box>

                                            </Grid> */}

                      <Grid
                        item
                        xs={6}
                        sx={{
                          display: "flex",
                          gap: 2,
                          alignItems: "center",
                        }}
                      >
                        <Typography variant="subtitle1" fontWeight={600}>
                          1.{" "}
                        </Typography>

                        <Box
                          display={"flex"}
                          gap={2}
                          alignItems={"center"}
                          position={"relative"}
                        >
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
                              minWidth: 170,
                            }}
                          />

                          <Typography
                            variant="body2"
                            color="#555555AC"
                            sx={{
                              position: "absolute",
                              right: 6,
                              top: "50%",
                              transform: "translate(-6px, -50%)",
                              backgroundColor: "#fff",
                              height: 30,
                              display: "grid",
                              placeItems: "center",
                              zIndex: 1,
                              pl: 1,
                            }}
                          >
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

                        <FormControl
                          fullWidth
                          className="form-input"
                          sx={{
                            minWidth: 110,
                          }}
                        >
                          <InputLabel id="feed-supply-select-label10">
                            Min
                          </InputLabel>
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
                            visibility: "hidden",
                          }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="1.5em"
                            height="1.5em"
                            viewBox="0 0 24 24"
                          >
                            <path
                              fill="red"
                              d="M12 20c-4.41 0-8-3.59-8-8s3.59-8 8-8s8 3.59 8 8s-3.59 8-8 8m0-18C6.47 2 2 6.47 2 12s4.47 10 10 10s10-4.47 10-10S17.53 2 12 2m2.59 6L12 10.59L9.41 8L8 9.41L10.59 12L8 14.59L9.41 16L12 13.41L14.59 16L16 14.59L13.41 12L16 9.41z"
                            />
                          </svg>
                        </Box>
                      </Grid>

                      <Grid
                        item
                        xs={6}
                        sx={{
                          display: "flex",
                          gap: 2,
                          alignItems: "center",
                        }}
                      >
                        <Typography variant="subtitle1" fontWeight={600}>
                          1.{" "}
                        </Typography>

                        <Box
                          display={"flex"}
                          gap={2}
                          alignItems={"center"}
                          position={"relative"}
                        >
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
                              minWidth: 170,
                            }}
                          />

                          <Typography
                            variant="body2"
                            color="#555555AC"
                            sx={{
                              position: "absolute",
                              right: 6,
                              top: "50%",
                              transform: "translate(-6px, -50%)",
                              backgroundColor: "#fff",
                              height: 30,
                              display: "grid",
                              placeItems: "center",
                              zIndex: 1,
                              pl: 1,
                            }}
                          >
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

                        <FormControl
                          fullWidth
                          className="form-input"
                          sx={{
                            minWidth: 110,
                          }}
                        >
                          <InputLabel id="feed-supply-select-label10">
                            Min
                          </InputLabel>
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
                            visibility: "hidden",
                          }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="1.5em"
                            height="1.5em"
                            viewBox="0 0 24 24"
                          >
                            <path
                              fill="red"
                              d="M12 20c-4.41 0-8-3.59-8-8s3.59-8 8-8s8 3.59 8 8s-3.59 8-8 8m0-18C6.47 2 2 6.47 2 12s4.47 10 10 10s10-4.47 10-10S17.53 2 12 2m2.59 6L12 10.59L9.41 8L8 9.41L10.59 12L8 14.59L9.41 16L12 13.41L14.59 16L16 14.59L13.41 12L16 9.41z"
                            />
                          </svg>
                        </Box>
                      </Grid>

                      <Grid
                        item
                        xs={6}
                        sx={{
                          display: "flex",
                          gap: 2,
                          alignItems: "center",
                        }}
                      >
                        <Typography variant="subtitle1" fontWeight={600}>
                          2.{" "}
                        </Typography>

                        <Box
                          display={"flex"}
                          gap={2}
                          alignItems={"center"}
                          position={"relative"}
                        >
                          <TextField
                            label="Crude protein"
                            type="number"
                            className="form-input"
                            // {...register("organisationName", {
                            //     required: true,
                            // })}
                            // focused={userData?.data.name ? true : false}
                            // value={userData?.data.name}
                            sx={{
                              width: "100%",
                              minWidth: 275,
                            }}
                          />

                          <Typography
                            variant="body2"
                            color="#555555AC"
                            sx={{
                              position: "absolute",
                              right: 6,
                              top: "50%",
                              transform: "translate(-6px, -50%)",
                              backgroundColor: "#fff",
                              height: 30,
                              display: "grid",
                              placeItems: "center",
                              zIndex: 1,
                              pl: 1,
                            }}
                          >
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

                        <FormControl fullWidth className="form-input">
                          <InputLabel id="feed-supply-select-label10">
                            Min
                          </InputLabel>
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
                          display="flex"
                          justifyContent="flex-start"
                          alignItems="center"
                          gap={0.5}
                          bgcolor="#06A19B"
                          paddingBlock={1.175}
                          paddingInline={1.5}
                          borderRadius={2}
                          color="white"
                          width="fit-content"
                          // onClick={handleClear}
                          style={{ cursor: "pointer" }}
                          // sx={{
                          //     visibility: "hidden"
                          // }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="1.3em"
                            height="1.3em"
                            viewBox="0 0 24 24"
                          >
                            <path
                              fill="currentColor"
                              fillRule="evenodd"
                              d="M10.31 2.25h3.38c.217 0 .406 0 .584.028a2.25 2.25 0 0 1 1.64 1.183c.084.16.143.339.212.544l.111.335l.03.085a1.25 1.25 0 0 0 1.233.825h3a.75.75 0 0 1 0 1.5h-17a.75.75 0 0 1 0-1.5h3.09a1.25 1.25 0 0 0 1.173-.91l.112-.335c.068-.205.127-.384.21-.544a2.25 2.25 0 0 1 1.641-1.183c.178-.028.367-.028.583-.028m-1.302 3a3 3 0 0 0 .175-.428l.1-.3c.091-.273.112-.328.133-.368a.75.75 0 0 1 .547-.395a3 3 0 0 1 .392-.009h3.29c.288 0 .348.002.392.01a.75.75 0 0 1 .547.394c.021.04.042.095.133.369l.1.3l.039.112q.059.164.136.315z"
                              clipRule="evenodd"
                            />
                            <path
                              fill="currentColor"
                              d="M5.915 8.45a.75.75 0 1 0-1.497.1l.464 6.952c.085 1.282.154 2.318.316 3.132c.169.845.455 1.551 1.047 2.104s1.315.793 2.17.904c.822.108 1.86.108 3.146.108h.879c1.285 0 2.324 0 3.146-.108c.854-.111 1.578-.35 2.17-.904c.591-.553.877-1.26 1.046-2.104c.162-.813.23-1.85.316-3.132l.464-6.952a.75.75 0 0 0-1.497-.1l-.46 6.9c-.09 1.347-.154 2.285-.294 2.99c-.137.685-.327 1.047-.6 1.303c-.274.256-.648.422-1.34.512c-.713.093-1.653.095-3.004.095h-.774c-1.35 0-2.29-.002-3.004-.095c-.692-.09-1.066-.256-1.34-.512c-.273-.256-.463-.618-.6-1.302c-.14-.706-.204-1.644-.294-2.992z"
                            />
                            <path
                              fill="currentColor"
                              d="M9.425 10.254a.75.75 0 0 1 .821.671l.5 5a.75.75 0 0 1-1.492.15l-.5-5a.75.75 0 0 1 .671-.821m5.15 0a.75.75 0 0 1 .671.82l-.5 5a.75.75 0 0 1-1.492-.149l.5-5a.75.75 0 0 1 .82-.671"
                            />
                          </svg>
                          Clear
                        </Box>
                      </Grid>

                      {/* <Grid item xs={12}
                                            // sx={{
                                            //     display: "flex",
                                            //     gap: 2,
                                            //     alignItems: "center",
                                            // }}
                                            >

                                                <Grid container alignItems={"center"} justifyContent={"space-between"}>


                                                    <Grid item xs={1} display={"grid"} sx={{
                                                        placeItems: "center",
                                                    }}>
                                                        <Typography variant="subtitle1" fontWeight={600}>1. </Typography>
                                                    </Grid>

                                                    <Grid item xs={4} display={"flex"} gap={2} alignItems={"center"} position={"relative"}>
                                                        <TextField
                                                            label="Crude protein"
                                                            type="number"
                                                            className="form-input"
                                                            // {...register("organisationName", {
                                                            //     required: true,
                                                            // })}
                                                            // focused={userData?.data.name ? true : false}
                                                            // value={userData?.data.name}
                                                            sx={{
                                                                width: "100%",
                                                                // minWidth: 275
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
                                                    </Grid>

                                                    <Grid xs={1} item display={"grid"} sx={{
                                                        placeItems: "center",
                                                    }}>


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

                                                    </Grid>

                                                    <Grid item xs={4}>

                                                        <FormControl fullWidth className="form-input">
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

                                                    </Grid>

                                                    <Grid item xs={1} display={"grid"} sx={{
                                                        placeItems: "center",
                                                    }}>


                                                        <Box
                                                            fontSize={14}
                                                            fontWeight={500}
                                                            display="flex"
                                                            justifyContent="center"
                                                            alignItems="center"
                                                            gap={0.5}
                                                            bgcolor="#06A19B"
                                                            paddingBlock={1.175}
                                                            paddingInline={1.5}
                                                            borderRadius={2}
                                                            color="white"
                                                            width="fit-content"
                                                            // onClick={handleClear}
                                                            style={{ cursor: "pointer" }}
                                                        // sx={{
                                                        //     visibility: "hidden"
                                                        // }}
                                                        >
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                width="1.3em"
                                                                height="1.3em"
                                                                viewBox="0 0 24 24"
                                                            >
                                                                <path
                                                                    fill="currentColor"
                                                                    fillRule="evenodd"
                                                                    d="M10.31 2.25h3.38c.217 0 .406 0 .584.028a2.25 2.25 0 0 1 1.64 1.183c.084.16.143.339.212.544l.111.335l.03.085a1.25 1.25 0 0 0 1.233.825h3a.75.75 0 0 1 0 1.5h-17a.75.75 0 0 1 0-1.5h3.09a1.25 1.25 0 0 0 1.173-.91l.112-.335c.068-.205.127-.384.21-.544a2.25 2.25 0 0 1 1.641-1.183c.178-.028.367-.028.583-.028m-1.302 3a3 3 0 0 0 .175-.428l.1-.3c.091-.273.112-.328.133-.368a.75.75 0 0 1 .547-.395a3 3 0 0 1 .392-.009h3.29c.288 0 .348.002.392.01a.75.75 0 0 1 .547.394c.021.04.042.095.133.369l.1.3l.039.112q.059.164.136.315z"
                                                                    clipRule="evenodd"
                                                                />
                                                                <path
                                                                    fill="currentColor"
                                                                    d="M5.915 8.45a.75.75 0 1 0-1.497.1l.464 6.952c.085 1.282.154 2.318.316 3.132c.169.845.455 1.551 1.047 2.104s1.315.793 2.17.904c.822.108 1.86.108 3.146.108h.879c1.285 0 2.324 0 3.146-.108c.854-.111 1.578-.35 2.17-.904c.591-.553.877-1.26 1.046-2.104c.162-.813.23-1.85.316-3.132l.464-6.952a.75.75 0 0 0-1.497-.1l-.46 6.9c-.09 1.347-.154 2.285-.294 2.99c-.137.685-.327 1.047-.6 1.303c-.274.256-.648.422-1.34.512c-.713.093-1.653.095-3.004.095h-.774c-1.35 0-2.29-.002-3.004-.095c-.692-.09-1.066-.256-1.34-.512c-.273-.256-.463-.618-.6-1.302c-.14-.706-.204-1.644-.294-2.992z"
                                                                />
                                                                <path
                                                                    fill="currentColor"
                                                                    d="M9.425 10.254a.75.75 0 0 1 .821.671l.5 5a.75.75 0 0 1-1.492.15l-.5-5a.75.75 0 0 1 .671-.821m5.15 0a.75.75 0 0 1 .671.82l-.5 5a.75.75 0 0 1-1.492-.149l.5-5a.75.75 0 0 1 .82-.671"
                                                                />
                                                            </svg>
                                                            Clear
                                                        </Box>

                                                    </Grid>


                                                </Grid>


                                            </Grid> */}
                    </Grid>
                  </Box>
                </Stack>
              </form>
            </Box>
          </Stack>
          {/* Feed Specification */}
        </Grid>
      </Grid>
    </>
  );
}
