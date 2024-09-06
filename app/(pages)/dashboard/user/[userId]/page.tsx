"use client";

import { Box, Grid, Stack, Typography } from "@mui/material";
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

export default function Page() {

  return (
    <>
      {/* Profile Section Start */}
      <Stack sx={{
        borderRadius: "14px",
        boxShadow: "0px 0px 5px #C5C5C5",
        mt: 4,
        padding: 3
      }}>

        <Grid
          container
        // sx={{
        //   justifyContent: {
        //     xs: "space-between",
        //   },
        //   gap: {
        //     md: 0,
        //     xs: 3,
        //   },
        // }}
        >
          <Grid
            item
            xs={4}
          // md={5}
          // xs={10}
          // bgcolor={"#0E848E"}
          // sx={{
          //   borderTopRightRadius: 100,
          //   borderBottomRightRadius: 100,
          // }}
          >

            <Typography variant="h6" color="rgb(99, 115, 129)" fontSize={14}>Profile Picture</Typography>

            <Button
              component="label"
              role={undefined}
              variant="contained"
              tabIndex={-1}
              startIcon={<CloudUploadIcon />}
              className="upload-file-input"
              sx={{
                textTransform: "unset",
                fontSize: 12,
                width: 140,
                height: 140,
                borderRadius: 100,
                border: "5px solid white",
                outline: "1px dashed rgba(145, 158, 171, 0.32)",
                backgroundColor: "rgb(244, 246, 248)",
                boxShadow: "none",
                color: "rgb(99, 115, 129)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              Upload photo
              <VisuallyHiddenInput
                type="file"
                onChange={(event) => console.log(event.target.files)}
                multiple
              />
            </Button>

          </Grid>

          <Grid
            item
            md={4}
            xs={10}
            borderRadius={1.8}
            bgcolor={"#fff"}
            sx={{
              padding: "0 !important",
              marginX: {
                md: 0,
                xs: "auto",
              },
            }}
          >
            <Box
              sx={{
                padding: {
                  lg: 5,
                  xs: 3,
                },
              }}
            >
              <Typography
                variant="h6"
                color="#06A19B"
                fontWeight={600}
                marginBottom={1}
                textTransform={"capitalize"}
              >
                Welcome!{" "}
              </Typography>
              <Typography
                variant="h5"
                fontWeight={600}
                marginBottom={4}
                textTransform={"capitalize"}
              >
                Login to your account{" "}
              </Typography>

              <Box position="relative" className="login-inputs">
                ;Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consectetur nihil provident esse reiciendis pariatur dolore accusamus fuga mollitia nemo minima?
              </Box>
            </Box>
          </Grid>
        </Grid>

      </Stack>
      {/* Profile Section End */}
    </>
  );
};
