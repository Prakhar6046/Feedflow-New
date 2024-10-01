import { Box, Button, Stack, Typography } from "@mui/material";
import { NextPage } from "next";

interface Props {
  setActiveStep: (val: number) => void;
}

const FeedSupplyIntro: NextPage<Props> = ({ setActiveStep }) => {
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
      ></Typography>

      <Typography variant="body1" color="#555555"></Typography>

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
            ></Typography>
            <Typography
              variant="body1"
              color="#555555"
              sx={{
                fontSize: {
                  md: 16,
                  xs: 14,
                },
              }}
            ></Typography>
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
            ></Typography>
            <Typography
              variant="body1"
              color="#555555"
              sx={{
                fontSize: {
                  md: 16,
                  xs: 14,
                },
              }}
            ></Typography>
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
        >
          Get Started
        </Button>
      </Box>
    </Stack>
  );
};

export default FeedSupplyIntro;
