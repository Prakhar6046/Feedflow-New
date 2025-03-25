import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import { Box, Button, FormControl, Grid, InputLabel, Select, Stack, Tab, TextField, Typography } from "@mui/material";
import { NextPage } from "next";

interface Props { }

const Page: NextPage<Props> = ({ }) => {
  return (
    // <div>Feed Store Coming Soon...</div>
    <>
      <form>
        <Grid container spacing={3} mt={2} mb={5} alignItems={"center"}>
          <Grid item lg={3} md={4} sm={6} xs={12}>
            <h4>Add Start Date Input Here</h4>
          </Grid>
          <Grid item lg={3} md={4} sm={6} xs={12}>
            <Box position={"relative"}>
              <TextField
                label="Period *"
                type="text"
                className="form-input"
                focused
                sx={{
                  width: "100%",
                }}
              />
              <Typography
                variant="body1"
                color="#555555AC"
                sx={{
                  position: "absolute",
                  right: 13,
                  top: "30%",
                  backgroundColor: "white",
                  paddingInline: "5px",
                }}
              >
                days
              </Typography>
            </Box>
          </Grid>
          <Grid item lg={3} md={4} sm={6} xs={12}>
            <FormControl className="form-input" fullWidth focused>
              <InputLabel id="demo-simple-select-label">
                Time Interval *
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Time Interval *"
              >
                {/* {OrganisationType.map((organisation, i) => {
                return (
                  <MenuItem value={organisation} key={i}>
                    {organisation}
                  </MenuItem>
                );
              })} */}
              </Select>
            </FormControl>
          </Grid>
          <Grid item lg={3} md={4} sm={6} xs={12}>
            <Box position={"relative"}>
              <TextField
                label="Expected Waste Factory *"
                type="text"
                className="form-input"
                focused
                sx={{
                  width: "100%",
                }}
              />
              <Typography
                variant="body1"
                color="#555555AC"
                sx={{
                  position: "absolute",
                  right: 13,
                  top: "30%",
                  backgroundColor: "white",
                  paddingInline: "5px",
                }}
              >
                %
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </form>

      <TabContext>
        {/* value={value} */}
        <Stack
          display={"flex"}
          rowGap={2}
          columnGap={5}
          mb={2}
          justifyContent={"space-between"}
          sx={{
            flexDirection: {
              md: "row",
              xs: "column",
            },
            alignItems: {
              md: "center",
              xs: "start",
            },
          }}
        >
          <Box>
            <TabList
              // onChange={handleChange}
              aria-label="lab API tabs example"
              className="production-tabs"
            >
              <Tab label="Feeding Plan" value="feeding-plan" className="active-tab" />
              <Tab label="Feeding Summary" value="feeding-summary" />
              <Tab label="Adhoc" value="adhoc-prediction" />
            </TabList>
          </Box>
        </Stack>
      </TabContext>

      <h4>Add Farm & Unit Input with Reset Filter Button + Add one Generate Button Here</h4>

      <Grid container columnSpacing={10} rowSpacing={5}>
        <Grid item xs={6}>
          <Box>
            <Typography
              variant="h6"
              fontWeight={700}
              sx={{
                fontSize: {
                  md: 24,
                  xs: 20,
                },
                my: 1.5,
                pb: 1
              }}
              borderBottom={"1px solid black"}
            >
              Overall Summary
            </Typography>

            <Stack>
              <Box display={"flex"} alignItems={"center"} gap={1} mb={0.75}>
                <Typography
                  variant="body1"
                  color="#000"
                  fontWeight={600}
                  sx={{
                    fontSize: {
                      xs: 16,
                    },
                  }}
                >
                  Total Biomass Growth -
                </Typography>

                <Typography variant="body2" color="#555555AC" sx={{
                  fontSize: {
                    md: 16,
                    xs: 14,
                  },
                }}>
                  __ Kg
                </Typography>
              </Box>

              <Box display={"flex"} alignItems={"center"} gap={1} mb={0.75}>
                <Typography
                  variant="body1"
                  color="#000"
                  fontWeight={600}
                  sx={{
                    fontSize: {
                      xs: 16,
                    },
                  }}
                >
                  Final Farm/Unit Biomass -
                </Typography>

                <Typography variant="body2" color="#555555AC" sx={{
                  fontSize: {
                    md: 16,
                    xs: 14,
                  },
                }}>
                  __
                </Typography>
              </Box>

              <Box display={"flex"} alignItems={"center"} gap={1} mb={0.75}>
                <Typography
                  variant="body1"
                  color="#000"
                  fontWeight={600}
                  sx={{
                    fontSize: {
                      xs: 16,
                    },
                  }}
                >
                  Total Feed Usage -
                </Typography>

                <Typography variant="body2" color="#555555AC" sx={{
                  fontSize: {
                    md: 16,
                    xs: 14,
                  },
                }}>
                  __ Kg
                </Typography>
              </Box>

              <Box display={"flex"} alignItems={"center"} gap={1} mb={0.75}>
                <Typography
                  variant="body1"
                  color="#000"
                  fontWeight={600}
                  sx={{
                    fontSize: {
                      xs: 16,
                    },
                  }}
                >
                  Total Feed Cost -
                </Typography>

                <Typography variant="body2" color="#555555AC" sx={{
                  fontSize: {
                    md: 16,
                    xs: 14,
                  },
                }}>
                  __
                </Typography>
              </Box>
            </Stack>

          </Box>
        </Grid>

        <Grid item xs={6}>
          <Box>
            <Typography
              variant="h6"
              fontWeight={700}
              sx={{
                fontSize: {
                  md: 24,
                  xs: 20,
                },
                my: 1.5,
                pb: 1
              }}
              borderBottom={"1px solid black"}
            >
              Feed Usage(All Farms/Units)
            </Typography>

            <Stack>
              <Box display={"flex"} alignItems={"center"} gap={1} mb={0.75}>
                <Typography
                  variant="body1"
                  color="#000"
                  fontWeight={600}
                  sx={{
                    fontSize: {
                      xs: 16,
                    },
                  }}
                >
                  SAF Start #0 -
                </Typography>

                <Typography variant="body2" color="#555555AC" sx={{
                  fontSize: {
                    md: 16,
                    xs: 14,
                  },
                }}>
                  __ Kg
                </Typography>
              </Box>

              <Box display={"flex"} alignItems={"center"} gap={1} mb={0.75}>
                <Typography
                  variant="body1"
                  color="#000"
                  fontWeight={600}
                  sx={{
                    fontSize: {
                      xs: 16,
                    },
                  }}
                >
                  SAF Starter #1 -
                </Typography>

                <Typography variant="body2" color="#555555AC" sx={{
                  fontSize: {
                    md: 16,
                    xs: 14,
                  },
                }}>
                  __ Kg
                </Typography>
              </Box>

              <Box display={"flex"} alignItems={"center"} gap={1} mb={0.75}>
                <Typography
                  variant="body1"
                  color="#000"
                  fontWeight={600}
                  sx={{
                    fontSize: {
                      xs: 16,
                    },
                  }}
                >
                  Grower 2mm -
                </Typography>

                <Typography variant="body2" color="#555555AC" sx={{
                  fontSize: {
                    md: 16,
                    xs: 14,
                  },
                }}>
                  __
                </Typography>
              </Box>
            </Stack>

          </Box>
        </Grid>

        <Grid item xs={12}>

          <TabContext>
            {/* value={value} */}

            <Box mb={2}>
              <TabList
                // onChange={handleChange}
                aria-label="lab API tabs example"
                className="production-tabs"
              >
                <Tab label="Farm 1" value="farm1" className="active-tab" />
                <Tab label="Farm 2" value="farm2" />
              </TabList>
            </Box>
          </TabContext>

          <Box>
            <Typography
              variant="h6"
              fontWeight={700}
              sx={{
                fontSize: {
                  md: 24,
                  xs: 20,
                },
                my: 1.5,
                pb: 1
              }}
              borderBottom={"1px solid black"}
            >
              Feed Usage(Farm 1)
            </Typography>

            <Stack>
              <Box display={"flex"} alignItems={"center"} gap={1} mb={0.75}>
                <Typography
                  variant="body1"
                  color="#000"
                  fontWeight={600}
                  sx={{
                    fontSize: {
                      xs: 16,
                    },
                  }}
                >
                  SAF Start #0 -
                </Typography>

                <Typography variant="body2" color="#555555AC" sx={{
                  fontSize: {
                    md: 16,
                    xs: 14,
                  },
                }}>
                  __ Kg
                </Typography>
              </Box>

              <Box display={"flex"} alignItems={"center"} gap={1} mb={0.75}>
                <Typography
                  variant="body1"
                  color="#000"
                  fontWeight={600}
                  sx={{
                    fontSize: {
                      xs: 16,
                    },
                  }}
                >
                  SAF Starter #1 -
                </Typography>

                <Typography variant="body2" color="#555555AC" sx={{
                  fontSize: {
                    md: 16,
                    xs: 14,
                  },
                }}>
                  __ Kg
                </Typography>
              </Box>

              <Box display={"flex"} alignItems={"center"} gap={1} mb={0.75}>
                <Typography
                  variant="body1"
                  color="#000"
                  fontWeight={600}
                  sx={{
                    fontSize: {
                      xs: 16,
                    },
                  }}
                >
                  Grower 2mm -
                </Typography>

                <Typography variant="body2" color="#555555AC" sx={{
                  fontSize: {
                    md: 16,
                    xs: 14,
                  },
                }}>
                  __
                </Typography>
              </Box>
            </Stack>

          </Box>
        </Grid>

      </Grid>

      <h4>Add Table Here</h4>


      {/* ADHOC */}

      <Stack mt={5}>
        <Typography
          variant="h6"
          color="#637381"
          fontSize={16}
          mb={3.5}
        >
          Please fill the form to make new projection.
        </Typography>

        <form>
          <Grid container spacing={3} alignItems={"center"}>
            <Grid item lg={3} md={4} sm={6} xs={12}>
              <FormControl className="form-input" fullWidth focused>
                <InputLabel id="demo-simple-select-label">
                  Fish Type *
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Fish Type *"
                >
                  {/* {OrganisationType.map((organisation, i) => {
                return (
                  <MenuItem value={organisation} key={i}>
                    {organisation}
                  </MenuItem>
                );
              })} */}
                </Select>
              </FormControl>
            </Grid>

            <Grid item lg={3} md={4} sm={6} xs={12}>
              <TextField
                label="Farm *"
                type="text"
                className="form-input"
                focused
                sx={{
                  width: "100%",
                }}
              />
            </Grid>

            <Grid item lg={3} md={4} sm={6} xs={12}>
              <TextField
                label="Pond *"
                type="text"
                className="form-input"
                focused
                sx={{
                  width: "100%",
                }}
              />
            </Grid>

            <Grid item lg={3} md={4} sm={6} xs={12}>
              <h4>Add Start Date Input Here</h4>
            </Grid>

            <Grid item lg={3} md={4} sm={6} xs={12}>
              <TextField
                label="Growth Period *"
                type="text"
                className="form-input"
                focused
                sx={{
                  width: "100%",
                }}
              />
            </Grid>

            <Grid item lg={3} md={4} sm={6} xs={12}>
              <Box position={"relative"}>
                <TextField
                  label="Temperature *"
                  type="text"
                  className="form-input"
                  focused
                  sx={{
                    width: "100%",
                  }}
                />
                <Typography
                  variant="body1"
                  color="#555555AC"
                  sx={{
                    position: "absolute",
                    right: 13,
                    top: "30%",
                    backgroundColor: "white",
                    paddingInline: "5px",
                  }}
                >
                  °C
                </Typography>
              </Box>
            </Grid>

            <Grid item lg={3} md={4} sm={6} xs={12}>
              <Box position={"relative"}>
                <TextField
                  label="Fish Weight *"
                  type="text"
                  className="form-input"
                  focused
                  sx={{
                    width: "100%",
                  }}
                />
                <Typography
                  variant="body1"
                  color="#555555AC"
                  sx={{
                    position: "absolute",
                    right: 13,
                    top: "30%",
                    backgroundColor: "white",
                    paddingInline: "5px",
                  }}
                >
                  g
                </Typography>
              </Box>
            </Grid>

            <Grid item lg={3} md={4} sm={6} xs={12}>
              <TextField
                label="Fish Amount *"
                type="text"
                className="form-input"
                focused
                sx={{
                  width: "100%",
                }}
              />
            </Grid>
          </Grid>

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
              marginTop: 3,
            }}
          >
            Save Changes
          </Button>
        </form>
      </Stack>

    </>
  );
};

export default Page;
