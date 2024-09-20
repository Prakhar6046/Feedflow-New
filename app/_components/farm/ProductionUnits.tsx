import { Box, Button, Grid, Stack, TextField, Typography } from "@mui/material";
import { NextPage } from "next";

interface Props {
  setActiveStep: (val: number) => void;
}

const ProductionUnits: NextPage<Props> = ({ setActiveStep }) => {
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
          marginBottom: 3,
        }}
      >
        Production Units
      </Typography>

      <Box>
        <Typography
          variant="h6"
          gutterBottom
          fontWeight={700}
          sx={{
            fontSize: {
              md: 18,
              xs: 16,
            },
          }}
        >
          New Production Unit
        </Typography>

        <Stack
          mb={5}
          display={"flex"}
          direction={"row"}
          justifyContent={"flex-start"}
          alignItems={"center"}
          gap={2}
          flexWrap={"wrap"}
        >
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
              boxShadow: "none",
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
              boxShadow: "none",
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

          <Stack
            mt={2}
            mb={5}
            display={"flex"}
            direction={"row"}
            justifyContent={"flex-start"}
            alignItems={"center"}
            gap={2}
            flexWrap={"wrap"}
          >
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
                boxShadow: "none",
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
                boxShadow: "none",
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
          <Box
            display={"flex"}
            justifyContent={"flex-end"}
            alignItems={"center"}
            gap={3}
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
                marginTop: 5,
                border: "1px solid #06A19B",
              }}
              onClick={() => setActiveStep(1)}
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
                marginTop: 5,
              }}
              onClick={() => setActiveStep(3)}
            >
              Add a Production Unit
            </Button>
          </Box>
        </form>
      </Box>
    </Stack>
  );
};

export default ProductionUnits;
