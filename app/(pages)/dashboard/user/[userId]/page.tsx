"use client";

import { Box, Divider, Grid, Stack, TextField, Typography } from "@mui/material";
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
        >
          <Grid
            item
            md={3}
            xs={12}
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
              gap: {
                sm: 5,
                xs: 3
              },
              alignItems: "center"
            }}
          >

            <Typography variant="h6" color="rgb(99, 115, 129)" fontSize={14} alignSelf={"flex-start"}>Profile Picture</Typography>

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
                border: "7px solid white",
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
            md={9}
            sx={{
              mt: {
                md: 0,
                xs: 3
              }
            }}
          >
            <Typography variant="h6" color="rgb(99, 115, 129)" fontSize={14} alignSelf={"flex-start"} marginBottom={1}>Information</Typography>

            <form>

              <TextField
                label="Name"
                type="text"
                // focused
                sx={{
                  width: "100%",
                  marginBottom: 2,
                }}
              />

              <TextField
                label="Email"
                type="email"
                // focused
                sx={{
                  width: "100%",
                  marginBottom: 2,
                }}
              />

              <TextField
                label="Lorem"
                type="text"
                // focused
                sx={{
                  width: "100%",
                  marginBottom: 2,
                }}
              />

              <Divider sx={{
                borderColor: "#979797",
                my: 1
              }} />

              <Typography variant="h6" color="rgb(99, 115, 129)" mb={0.3} fontSize={14} marginTop={2}>Set or Change Password</Typography>

              <Typography variant="h6" color="rgb(99, 115, 129)" fontSize={12} fontWeight={300} marginBottom={2}>If you signed in with a provider like Google, you can set a password here. If you already have a password set, you can change it here.</Typography>

              <TextField
                label="Password"
                type="text"
                // focused
                sx={{
                  width: "100%",
                  marginBottom: 2,
                }}
              />

              <TextField
                label="Re-enter Password"
                type="text"
                // focused
                sx={{
                  width: "100%",
                  marginBottom: 2,
                }}
              />

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
              >
                Save Changes
              </Button>

            </form>
          </Grid>
        </Grid>

      </Stack>
      {/* Profile Section End */}

      {/* User Permission Section Start */}
      <Stack sx={{
        borderRadius: "14px",
        boxShadow: "0px 0px 5px #C5C5C5",
        mt: 2.5,
        padding: 3
      }}>

        <Grid
          container
        >
          <Grid
            item
            md={3}
            xs={12}
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
              gap: {
                sm: 5,
                xs: 3
              },
              alignItems: "center"
            }}
          >

            <Typography variant="h6" color="rgb(99, 115, 129)" fontSize={14} alignSelf={"flex-start"}>Profile Picture</Typography>

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
                border: "7px solid white",
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
            md={9}
            sx={{
              mt: {
                md: 0,
                xs: 3
              }
            }}
          >
            <Typography variant="h6" color="rgb(99, 115, 129)" fontSize={14} alignSelf={"flex-start"} marginBottom={1}>Information</Typography>

            <form>

              <TextField
                label="Name"
                type="text"
                // focused
                sx={{
                  width: "100%",
                  marginBottom: 2,
                }}
              />

              <TextField
                label="Email"
                type="email"
                // focused
                sx={{
                  width: "100%",
                  marginBottom: 2,
                }}
              />

              <TextField
                label="Lorem"
                type="text"
                // focused
                sx={{
                  width: "100%",
                  marginBottom: 2,
                }}
              />

              <Divider sx={{
                borderColor: "#979797",
                my: 1
              }} />

              <Typography variant="h6" color="rgb(99, 115, 129)" mb={0.3} fontSize={14} marginTop={2}>Set or Change Password</Typography>

              <Typography variant="h6" color="rgb(99, 115, 129)" fontSize={12} fontWeight={300} marginBottom={2}>If you signed in with a provider like Google, you can set a password here. If you already have a password set, you can change it here.</Typography>

              <TextField
                label="Password"
                type="text"
                // focused
                sx={{
                  width: "100%",
                  marginBottom: 2,
                }}
              />

              <TextField
                label="Re-enter Password"
                type="text"
                // focused
                sx={{
                  width: "100%",
                  marginBottom: 2,
                }}
              />

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
              >
                Save Changes
              </Button>

            </form>
          </Grid>
        </Grid>

      </Stack>
      {/* User Permission Section End */}

    </>
  );
};
