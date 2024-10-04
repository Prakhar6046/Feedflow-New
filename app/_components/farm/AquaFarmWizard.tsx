import { Box, Button, Stack, Typography } from "@mui/material";
import { setCookie } from "cookies-next";
import { NextPage } from "next";

interface Props {
  setActiveStep: (val: number) => void;
}

const AquaFarmWizard: NextPage<Props> = ({ setActiveStep }: Props) => {
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
        }}
      >
        Aqua Farm Wizard
      </Typography>

      <Typography variant="body1" color="#555555">
        This wizard will assist you in adding a new farm to your account. <br />{" "}
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
              Give your new farm a name
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
               This is to help you identify and distinguish this one from your
              other farms.{" "}
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
              Add production unit(s)
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
              to your new farm. A production unit or pond is the physical unit
              in which your fish batches grow. These production units can be
              self-standing or part of a bigger pond.{" "}
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
          onClick={() => setActiveStep(1)}
          // onClick={() => setCookie("activeStep", 1)}
        >
          Get Started
        </Button>
      </Box>
    </Stack>
  );
};

export default AquaFarmWizard;
