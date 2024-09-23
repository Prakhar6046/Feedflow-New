import { Box, Button, Grid, Stack, TextField, Typography } from "@mui/material";
import { NextPage } from "next";
import { useState } from "react";

interface Props {
  setActiveStep: (val: number) => void;
}

const FarmInformation: NextPage<Props> = ({ setActiveStep }) => {
  const [selectedSwtich, setSelectedSwtich] = useState<string>("address");
  return (
    <Stack>
      <Typography
        variant="h6"
        fontWeight={700}
        sx={{
          fontSize: {
            md: 24,
            xs: 20,
          },
          marginBottom: 2,
        }}
      >
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

          <Box
            display={"flex"}
            justifyContent={"end"}
            alignItems={"center"}
            gap={2}
            flexWrap={"wrap"}
            mt={1}
            mb={2}
          >
            <Button
              type="button"
              onClick={() => setSelectedSwtich("address")}
              variant="contained"
              sx={{
                background: "#06A19B",
                fontWeight: 600,
                padding: "6px 16px",
                width: "fit-content",
                textTransform: "capitalize",
                borderRadius: "8px",
                boxShadow: "none",
                border: "1px solid #06A19B",
              }}
            >
              Use Address
            </Button>

            <Button
              type="button"
              onClick={() => setSelectedSwtich("coordinates")}
              variant="contained"
              sx={{
                background: "#fff",
                fontWeight: 600,
                padding: "6px 16px",
                width: "fit-content",
                textTransform: "capitalize",
                borderRadius: "8px",
                color: "#06A19B",
                border: "1px solid #06A19B",
                boxShadow: "none",
              }}
            >
              Use Coordinates
            </Button>
          </Box>

          {selectedSwtich === "address" ? (
            <>
              <Box>
                <Typography
                  variant="h6"
                  gutterBottom
                  fontWeight={700}
                  sx={{
                    fontSize: 18,
                  }}
                >
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
            </>
          ) : (
            <>Coordinates</>
          )}

          <Box
            display={"flex"}
            justifyContent={"flex-end"}
            alignItems={"center"}
            gap={3}
            mt={1}
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
              onClick={() => setActiveStep(0)}
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
              onClick={() => setActiveStep(2)}
            >
              Next
            </Button>
          </Box>
        </form>
      </Box>
    </Stack>
  );
};

export default FarmInformation;
