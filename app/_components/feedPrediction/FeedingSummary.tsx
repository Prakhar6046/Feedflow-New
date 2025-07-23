'use clinet';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import { Box, Grid, Stack, Tab, Typography } from '@mui/material';
import React from 'react';

function FeedingSummary() {
  return (
    <Stack>
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
                pb: 1,
              }}
              borderBottom={'1px solid black'}
            >
              Overall Summary
            </Typography>

            <Stack>
              <Box display={'flex'} alignItems={'center'} gap={1} mb={0.75}>
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

                <Typography
                  variant="body2"
                  color="#555555AC"
                  sx={{
                    fontSize: {
                      md: 16,
                      xs: 14,
                    },
                  }}
                >
                  __ Kg
                </Typography>
              </Box>

              <Box display={'flex'} alignItems={'center'} gap={1} mb={0.75}>
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

                <Typography
                  variant="body2"
                  color="#555555AC"
                  sx={{
                    fontSize: {
                      md: 16,
                      xs: 14,
                    },
                  }}
                >
                  __
                </Typography>
              </Box>

              <Box display={'flex'} alignItems={'center'} gap={1} mb={0.75}>
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

                <Typography
                  variant="body2"
                  color="#555555AC"
                  sx={{
                    fontSize: {
                      md: 16,
                      xs: 14,
                    },
                  }}
                >
                  __ Kg
                </Typography>
              </Box>

              <Box display={'flex'} alignItems={'center'} gap={1} mb={0.75}>
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

                <Typography
                  variant="body2"
                  color="#555555AC"
                  sx={{
                    fontSize: {
                      md: 16,
                      xs: 14,
                    },
                  }}
                >
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
                pb: 1,
              }}
              borderBottom={'1px solid black'}
            >
              Feed Usage(All Farms/Units)
            </Typography>

            <Stack>
              <Box display={'flex'} alignItems={'center'} gap={1} mb={0.75}>
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

                <Typography
                  variant="body2"
                  color="#555555AC"
                  sx={{
                    fontSize: {
                      md: 16,
                      xs: 14,
                    },
                  }}
                >
                  __ Kg
                </Typography>
              </Box>

              <Box display={'flex'} alignItems={'center'} gap={1} mb={0.75}>
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

                <Typography
                  variant="body2"
                  color="#555555AC"
                  sx={{
                    fontSize: {
                      md: 16,
                      xs: 14,
                    },
                  }}
                >
                  __ Kg
                </Typography>
              </Box>

              <Box display={'flex'} alignItems={'center'} gap={1} mb={0.75}>
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

                <Typography
                  variant="body2"
                  color="#555555AC"
                  sx={{
                    fontSize: {
                      md: 16,
                      xs: 14,
                    },
                  }}
                >
                  __
                </Typography>
              </Box>
            </Stack>
          </Box>
        </Grid>

        <Grid item xs={12}>
          <TabContext value={'farm1'}>
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
                pb: 1,
              }}
              borderBottom={'1px solid black'}
            >
              Feed Usage(Farm 1)
            </Typography>

            <Stack>
              <Box display={'flex'} alignItems={'center'} gap={1} mb={0.75}>
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

                <Typography
                  variant="body2"
                  color="#555555AC"
                  sx={{
                    fontSize: {
                      md: 16,
                      xs: 14,
                    },
                  }}
                >
                  __ Kg
                </Typography>
              </Box>

              <Box display={'flex'} alignItems={'center'} gap={1} mb={0.75}>
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

                <Typography
                  variant="body2"
                  color="#555555AC"
                  sx={{
                    fontSize: {
                      md: 16,
                      xs: 14,
                    },
                  }}
                >
                  __ Kg
                </Typography>
              </Box>

              <Box display={'flex'} alignItems={'center'} gap={1} mb={0.75}>
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

                <Typography
                  variant="body2"
                  color="#555555AC"
                  sx={{
                    fontSize: {
                      md: 16,
                      xs: 14,
                    },
                  }}
                >
                  __
                </Typography>
              </Box>
            </Stack>
          </Box>
        </Grid>
      </Grid>
    </Stack>
  );
}

export default FeedingSummary;
