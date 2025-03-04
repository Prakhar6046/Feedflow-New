"use client";
import { Production } from "@/app/_typeModels/production";
import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
interface Props {
  productions: Production[];
}
function CreateReport({ productions }: Props) {
  return (
    <Stack
      sx={{
        width: "100%",
        // overflow: "hidden",
        borderRadius: "14px",
        boxShadow: "0px 0px 16px 5px #0000001A",
        p: 3,
      }}
    >
      <Grid container>
        <Grid item xl={3} lg={4} md={5} xs={6}>
          <Box
            mb={3}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              columnGap: 3,
              rowGap: 1,
              flexWrap: "wrap",
              pb: 0.5,
              borderBottom: "1px solid #E0E0E0",
            }}
          >
            <Typography
              variant="h6"
              fontWeight={600}
              sx={{
                fontSize: {
                  xs: 18,
                },
              }}
            >
              Select Farms
            </Typography>

            <FormControlLabel
              value="selectAllFarms"
              control={<Checkbox />}
              label="Select All"
              labelPlacement="end"
              className="custom-checkbox"
            />
          </Box>

          <Grid container spacing={3}>
            {productions.map((production) => {
              return (
                <Grid item xs={12} key={String(production.id)}>
                  <FormControlLabel
                    value="farm1"
                    control={<Checkbox />}
                    label={production?.farm?.name}
                    labelPlacement="end"
                    className="custom-checkbox"
                  />
                </Grid>
              );
            })}
          </Grid>
        </Grid>
        <Grid
          item
          xs={1}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Divider orientation="vertical" variant="middle" />
        </Grid>
        <Grid item xl={8} lg={7} md={6} xs={5}>

          <Box
            mb={3}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              columnGap: 3,
              rowGap: 1,
              flexWrap: "wrap",
              borderBottom: "1px solid #E0E0E0",
              pb: 0.5,
            }}
          >
            <Typography
              variant="h6"
              fontWeight={600}
              sx={{
                fontSize: {
                  xs: 18,
                },
              }}
            >
              Select Units
            </Typography>

            <FormControlLabel
              value="selectAllFarms"
              control={<Checkbox />}
              label="Select All"
              labelPlacement="end"
              className="custom-checkbox"
            />
          </Box>

          <Stack sx={{
            maxHeight: "600px",
            overflowY: "auto",
          }}>
            <Grid container rowSpacing={2} columnSpacing={4}>
              <Grid item xs={12}>
                <Box mt={1.5}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    columnGap: 3,
                    rowGap: 1,
                    flexWrap: "wrap",
                    borderBottom: "1px solid #E0E0E0",
                    pb: 0.5,
                  }}
                >
                  <Typography
                    variant="h6"
                    fontWeight={600}
                    sx={{
                      fontSize: {
                        xs: 16,
                      },
                    }}
                  >
                    Farm 1
                  </Typography>

                  <FormControlLabel
                    value="selectAllFarms"
                    control={<Checkbox />}
                    label="Select All"
                    labelPlacement="end"
                    className="custom-checkbox"
                  />
                </Box>
              </Grid>
              <Grid item xs={"auto"}>
                <FormControlLabel
                  value="farm1"
                  control={<Checkbox />}
                  label="Farm 1"
                  labelPlacement="end"
                  className="custom-checkbox"
                />
              </Grid>
              <Grid item xs={"auto"}>
                <FormControlLabel
                  value="farm1"
                  control={<Checkbox />}
                  label="Farm 1"
                  labelPlacement="end"
                  className="custom-checkbox"
                />
              </Grid>
              <Grid item xs={"auto"}>
                <FormControlLabel
                  value="farm1"
                  control={<Checkbox />}
                  label="Farm 1"
                  labelPlacement="end"
                  className="custom-checkbox"
                />
              </Grid>
              <Grid item xs={"auto"}>
                <FormControlLabel
                  value="farm1"
                  control={<Checkbox />}
                  label="Farm 1"
                  labelPlacement="end"
                  className="custom-checkbox"
                />
              </Grid>
              <Grid item xs={"auto"}>
                <FormControlLabel
                  value="farm1"
                  control={<Checkbox />}
                  label="Farm 1"
                  labelPlacement="end"
                  className="custom-checkbox"
                />
              </Grid>
              <Grid item xs={"auto"}>
                <FormControlLabel
                  value="farm1"
                  control={<Checkbox />}
                  label="Farm 1"
                  labelPlacement="end"
                  className="custom-checkbox"
                />
              </Grid>
              <Grid item xs={"auto"}>
                <FormControlLabel
                  value="farm1"
                  control={<Checkbox />}
                  label="Farm 1"
                  labelPlacement="end"
                  className="custom-checkbox"
                />
              </Grid>
              <Grid item xs={"auto"}>
                <FormControlLabel
                  value="farm1"
                  control={<Checkbox />}
                  label="Farm 1"
                  labelPlacement="end"
                  className="custom-checkbox"
                />
              </Grid>
            </Grid>

            <Grid container rowSpacing={2} columnSpacing={4}>
              <Grid item xs={12}>
                <Box mt={3}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    columnGap: 3,
                    rowGap: 1,
                    flexWrap: "wrap",
                    borderBottom: "1px solid #E0E0E0",
                    pb: 0.5,
                  }}
                >
                  <Typography
                    variant="h6"
                    fontWeight={600}
                    sx={{
                      fontSize: {
                        xs: 16,
                      },
                    }}
                  >
                    Farm 2
                  </Typography>

                  <FormControlLabel
                    value="selectAllFarms"
                    control={<Checkbox />}
                    label="Select All"
                    labelPlacement="end"
                    className="custom-checkbox"
                  />
                </Box>
              </Grid>
              <Grid item xs={"auto"}>
                <FormControlLabel
                  value="farm1"
                  control={<Checkbox />}
                  label="Farm 1"
                  labelPlacement="end"
                  className="custom-checkbox"
                />
              </Grid>
              <Grid item xs={"auto"}>
                <FormControlLabel
                  value="farm1"
                  control={<Checkbox />}
                  label="Farm 1"
                  labelPlacement="end"
                  className="custom-checkbox"
                />
              </Grid>
            </Grid>

            <Grid container rowSpacing={2} columnSpacing={4}>
              <Grid item xs={12}>
                <Box mt={3}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    columnGap: 3,
                    rowGap: 1,
                    flexWrap: "wrap",
                    borderBottom: "1px solid #E0E0E0",
                    pb: 0.5,
                  }}
                >
                  <Typography
                    variant="h6"
                    fontWeight={600}
                    sx={{
                      fontSize: {
                        xs: 16,
                      },
                    }}
                  >
                    Farm 3
                  </Typography>

                  <FormControlLabel
                    value="selectAllFarms"
                    control={<Checkbox />}
                    label="Select All"
                    labelPlacement="end"
                    className="custom-checkbox"
                  />
                </Box>
              </Grid>
              <Grid item xs={"auto"}>
                <FormControlLabel
                  value="farm1"
                  control={<Checkbox />}
                  label="Farm 1"
                  labelPlacement="end"
                  className="custom-checkbox"
                />
              </Grid>
              <Grid item xs={"auto"}>
                <FormControlLabel
                  value="farm1"
                  control={<Checkbox />}
                  label="Farm 1"
                  labelPlacement="end"
                  className="custom-checkbox"
                />
              </Grid>
              <Grid item xs={"auto"}>
                <FormControlLabel
                  value="farm1"
                  control={<Checkbox />}
                  label="Farm 1"
                  labelPlacement="end"
                  className="custom-checkbox"
                />
              </Grid>
              <Grid item xs={"auto"}>
                <FormControlLabel
                  value="farm1"
                  control={<Checkbox />}
                  label="Farm 1"
                  labelPlacement="end"
                  className="custom-checkbox"
                />
              </Grid>
              <Grid item xs={"auto"}>
                <FormControlLabel
                  value="farm1"
                  control={<Checkbox />}
                  label="Farm 1"
                  labelPlacement="end"
                  className="custom-checkbox"
                />
              </Grid>
            </Grid>

            <Grid container rowSpacing={2} columnSpacing={4}>
              <Grid item xs={12}>
                <Box mt={3}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    columnGap: 3,
                    rowGap: 1,
                    flexWrap: "wrap",
                    borderBottom: "1px solid #E0E0E0",
                    pb: 0.5,
                  }}
                >
                  <Typography
                    variant="h6"
                    fontWeight={600}
                    sx={{
                      fontSize: {
                        xs: 16,
                      },
                    }}
                  >
                    Farm 4
                  </Typography>

                  <FormControlLabel
                    value="selectAllFarms"
                    control={<Checkbox />}
                    label="Select All"
                    labelPlacement="end"
                    className="custom-checkbox"
                  />
                </Box>
              </Grid>
              <Grid item xs={"auto"}>
                <FormControlLabel
                  value="farm1"
                  control={<Checkbox />}
                  label="Farm 1"
                  labelPlacement="end"
                  className="custom-checkbox"
                />
              </Grid>
              <Grid item xs={"auto"}>
                <FormControlLabel
                  value="farm1"
                  control={<Checkbox />}
                  label="Farm 1"
                  labelPlacement="end"
                  className="custom-checkbox"
                />
              </Grid>
              <Grid item xs={"auto"}>
                <FormControlLabel
                  value="farm1"
                  control={<Checkbox />}
                  label="Farm 1"
                  labelPlacement="end"
                  className="custom-checkbox"
                />
              </Grid>
              <Grid item xs={"auto"}>
                <FormControlLabel
                  value="farm1"
                  control={<Checkbox />}
                  label="Farm 1"
                  labelPlacement="end"
                  className="custom-checkbox"
                />
              </Grid>
              <Grid item xs={"auto"}>
                <FormControlLabel
                  value="farm1"
                  control={<Checkbox />}
                  label="Farm 1"
                  labelPlacement="end"
                  className="custom-checkbox"
                />
              </Grid>
            </Grid>

            <Grid container rowSpacing={2} columnSpacing={4}>
              <Grid item xs={12}>
                <Box mt={3}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    columnGap: 3,
                    rowGap: 1,
                    flexWrap: "wrap",
                    borderBottom: "1px solid #E0E0E0",
                    pb: 0.5,
                  }}
                >
                  <Typography
                    variant="h6"
                    fontWeight={600}
                    sx={{
                      fontSize: {
                        xs: 16,
                      },
                    }}
                  >
                    Farm 5
                  </Typography>

                  <FormControlLabel
                    value="selectAllFarms"
                    control={<Checkbox />}
                    label="Select All"
                    labelPlacement="end"
                    className="custom-checkbox"
                  />
                </Box>
              </Grid>
              <Grid item xs={"auto"}>
                <FormControlLabel
                  value="farm1"
                  control={<Checkbox />}
                  label="Farm 1"
                  labelPlacement="end"
                  className="custom-checkbox"
                />
              </Grid>
            </Grid>

            <Grid container rowSpacing={2} columnSpacing={4}>
              <Grid item xs={12}>
                <Box mt={3}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    columnGap: 3,
                    rowGap: 1,
                    flexWrap: "wrap",
                    borderBottom: "1px solid #E0E0E0",
                    pb: 0.5,
                  }}
                >
                  <Typography
                    variant="h6"
                    fontWeight={600}
                    sx={{
                      fontSize: {
                        xs: 16,
                      },
                    }}
                  >
                    Farm 6
                  </Typography>

                  <FormControlLabel
                    value="selectAllFarms"
                    control={<Checkbox />}
                    label="Select All"
                    labelPlacement="end"
                    className="custom-checkbox"
                  />
                </Box>
              </Grid>
              <Grid item xs={"auto"}>
                <FormControlLabel
                  value="farm1"
                  control={<Checkbox />}
                  label="Farm 1"
                  labelPlacement="end"
                  className="custom-checkbox"
                />
              </Grid>
              <Grid item xs={"auto"}>
                <FormControlLabel
                  value="farm1"
                  control={<Checkbox />}
                  label="Farm 1"
                  labelPlacement="end"
                  className="custom-checkbox"
                />
              </Grid>
              <Grid item xs={"auto"}>
                <FormControlLabel
                  value="farm1"
                  control={<Checkbox />}
                  label="Farm 1"
                  labelPlacement="end"
                  className="custom-checkbox"
                />
              </Grid>
              <Grid item xs={"auto"}>
                <FormControlLabel
                  value="farm1"
                  control={<Checkbox />}
                  label="Farm 1"
                  labelPlacement="end"
                  className="custom-checkbox"
                />
              </Grid>
              <Grid item xs={"auto"}>
                <FormControlLabel
                  value="farm1"
                  control={<Checkbox />}
                  label="Farm 1"
                  labelPlacement="end"
                  className="custom-checkbox"
                />
              </Grid>
            </Grid>

            <Grid container rowSpacing={2} columnSpacing={4}>
              <Grid item xs={12}>
                <Box mt={3}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    columnGap: 3,
                    rowGap: 1,
                    flexWrap: "wrap",
                    borderBottom: "1px solid #E0E0E0",
                    pb: 0.5,
                  }}
                >
                  <Typography
                    variant="h6"
                    fontWeight={600}
                    sx={{
                      fontSize: {
                        xs: 16,
                      },
                    }}
                  >
                    Farm 7
                  </Typography>

                  <FormControlLabel
                    value="selectAllFarms"
                    control={<Checkbox />}
                    label="Select All"
                    labelPlacement="end"
                    className="custom-checkbox"
                  />
                </Box>
              </Grid>
              <Grid item xs={"auto"}>
                <FormControlLabel
                  value="farm1"
                  control={<Checkbox />}
                  label="Farm 1"
                  labelPlacement="end"
                  className="custom-checkbox"
                />
              </Grid>
              <Grid item xs={"auto"}>
                <FormControlLabel
                  value="farm1"
                  control={<Checkbox />}
                  label="Farm 1"
                  labelPlacement="end"
                  className="custom-checkbox"
                />
              </Grid>
              <Grid item xs={"auto"}>
                <FormControlLabel
                  value="farm1"
                  control={<Checkbox />}
                  label="Farm 1"
                  labelPlacement="end"
                  className="custom-checkbox"
                />
              </Grid>
              <Grid item xs={"auto"}>
                <FormControlLabel
                  value="farm1"
                  control={<Checkbox />}
                  label="Farm 1"
                  labelPlacement="end"
                  className="custom-checkbox"
                />
              </Grid>
              <Grid item xs={"auto"}>
                <FormControlLabel
                  value="farm1"
                  control={<Checkbox />}
                  label="Farm 1"
                  labelPlacement="end"
                  className="custom-checkbox"
                />
              </Grid>
            </Grid>
          </Stack>

        </Grid>
      </Grid>

      <Box
        display={"flex"}
        justifyContent={"flex-end"}
        alignItems={"center"}
        gap={3}
        mt={3}
      >
        <Button
          type="button"
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
        >
          Preview
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
        >
          Save
        </Button>
      </Box>
    </Stack>
  );
}

export default CreateReport;
