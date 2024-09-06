"use client";
import * as React from "react";
import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import { Box, Button, Stack, TextField } from "@mui/material";
import { alpha, styled } from "@mui/material/styles";
import AddOrganization from "./models/AddOrganisation";
import AddUser from "./models/AddUser";
import { usePathname } from "next/navigation";
import Link from "next/link";
interface Props {
  heading: string;
  buttonName?: string;
  links?: { name: string; link: string }[];
}
export default function BasicBreadcrumbs({
  heading,
  buttonName,
  links,
}: Props) {
  const [open, setOpen] = React.useState(false);
  const pathName = usePathname();

  // const [age, setAge] = React.useState('');

  // const handleChange = (event: SelectChangeEvent) => {
  //   setAge(event.target.value);
  // };
  const CssTextField = styled(TextField)({
    "& label.Mui-focused": {
      color: "#06a19b",
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: "#979797",
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "#979797",
      },
      "&:hover fieldset": {
        borderColor: "#979797",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#979797",
      },
    },
  });
  return (
    <>
      {/* Breadcrumb Section Start */}
      <Stack
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexDirection: "row",
          rowGap: 1,
          columnGap: 5,
          flexWrap: "wrap",
        }}
      >
        <Box>
          {/* Main Heading */}
          <Typography
            variant="h2"
            marginBottom={"4px"}
            fontWeight={"bold"}
            sx={{
              fontSize: {
                md: "2.65rem",
                xs: "1.85rem",
              },
            }}
          >
            {heading}
          </Typography>
          {/* Main Heading */}

          {links && (
            <Breadcrumbs aria-label="breadcrumb" separator="›">
              {links.map((link, i) => {
                return (
                  <Link key={i} href={link.link} className="nav-links">
                    {link.name}
                  </Link>
                );
              })}
            </Breadcrumbs>
          )}
        </Box>

        {buttonName && (
          <Button
            variant="contained"
            onClick={() => setOpen(true)}
            sx={{
              background: "#06A19B",
              fontWeight: "bold",
              padding: "9px 28px",
              width: "fit-content",
              textTransform: "capitalize",
              borderRadius: "12px",
              textWrap: "nowrap",
            }}
          >
            {buttonName}
          </Button>
        )}

        {heading === "Organization" ? (
          <AddOrganization open={open} setOpen={setOpen} />
        ) : (
          <AddUser open={open} setOpen={setOpen} />
        )}
      </Stack>
      {/* Breadcrumb Section End */}

      {/* Search Section Start */}
      {pathName !== "/dashboard" && (
        <Stack
          marginBlock={2}
          display="flex"
          gap={1}
          sx={{
            flexDirection: {
              md: "row",
              xs: "column",
            },
            justifyContent: {
              md: "space-between",
              xs: "flex-end",
            },
            alignItems: {
              md: "center",
              xs: "flex-start",
            },
            marginTop: {
              sm: 2,
              xs: 4,
            },
          }}
        >
          <Box
            display="flex"
            justifyContent="flex-start"
            alignItems="center"
            gap={2}
            sx={{
              width: {
                md: "fit-content",
                xs: "100%",
              },
            }}
          >
            <Box
              position="relative"
              className="search-filter"
              sx={{
                width: {
                  md: "fit-content",
                  xs: "100%",
                },
              }}
            >
              <TextField
                label="Search"
                focused
                sx={{
                  width: {
                    md: "fit-content",
                    xs: "100%",
                  },
                }}
              />
              <CssTextField label="Custom CSS" id="custom-css-outlined-input" />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1.5em"
                height="1.5em"
                viewBox="0 0 24 24"
                className="search-icon"
              >
                <path
                  fill="#06a19b"
                  d="M5 10a5 5 0 1 1 10 0a5 5 0 0 1-10 0m5-7a7 7 0 1 0 4.192 12.606l5.1 5.101a1 1 0 0 0 1.415-1.414l-5.1-5.1A7 7 0 0 0 10 3"
                />
              </svg>
            </Box>

            {/* <Stack className="select-input">
              <FormControl sx={{ m: 1, minWidth: 80 }}>
                <InputLabel id="demo-simple-select-autowidth-label">Age</InputLabel>
                <Select
                  labelId="demo-simple-select-autowidth-label"
                  id="demo-simple-select-autowidth"
                  value={age}
                  onChange={handleChange}
                  autoWidth
                  label="Status"
                >
                  <MenuItem value="All">
                    All
                  </MenuItem>
                  <MenuItem value="Active">
                    Active
                  </MenuItem>
                  <MenuItem value="Suspended">
                    Suspended
                  </MenuItem>
                </Select>
              </FormControl>
            </Stack> */}

            <Box
              fontSize={14}
              fontWeight={500}
              display="flex"
              justifyContent="flex-start"
              alignItems="center"
              gap={0.5}
              bgcolor="#06A19B"
              paddingBlock={1}
              paddingInline={1.5}
              borderRadius={1.8}
              color="white"
              width="fit-content"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1.3em"
                height="1.3em"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  fill-rule="evenodd"
                  d="M10.31 2.25h3.38c.217 0 .406 0 .584.028a2.25 2.25 0 0 1 1.64 1.183c.084.16.143.339.212.544l.111.335l.03.085a1.25 1.25 0 0 0 1.233.825h3a.75.75 0 0 1 0 1.5h-17a.75.75 0 0 1 0-1.5h3.09a1.25 1.25 0 0 0 1.173-.91l.112-.335c.068-.205.127-.384.21-.544a2.25 2.25 0 0 1 1.641-1.183c.178-.028.367-.028.583-.028m-1.302 3a3 3 0 0 0 .175-.428l.1-.3c.091-.273.112-.328.133-.368a.75.75 0 0 1 .547-.395a3 3 0 0 1 .392-.009h3.29c.288 0 .348.002.392.01a.75.75 0 0 1 .547.394c.021.04.042.095.133.369l.1.3l.039.112q.059.164.136.315z"
                  clip-rule="evenodd"
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
          </Box>

          <Box
            display="flex"
            justifyContent="flex-end"
            flexDirection="column"
            gap={0.5}
            sx={{
              width: { md: "fit-content", xs: "100%" },
              textAlign: "end",
            }}
          >
            <Box
              display="flex"
              justifyContent="flex-end"
              alignItems="center"
              gap={2}
            >
              <Box
                padding={1}
                bgcolor={"white"}
                borderRadius={1.8}
                width="fit-content"
                boxShadow="0px 0px 10px 0px #0000001A;
"
                display="flex"
                justifyContent="center"
                alignItems="center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="1.1em"
                  height="1.1em"
                  viewBox="-1.5 -2.5 24 24"
                >
                  <path
                    fill="#637382"
                    d="m4.859 5.308l1.594-.488a1 1 0 0 1 .585 1.913l-3.825 1.17a1 1 0 0 1-1.249-.665L.794 3.413a1 1 0 1 1 1.913-.585l.44 1.441C5.555.56 10.332-1.035 14.573.703a9.38 9.38 0 0 1 5.38 5.831a1 1 0 1 1-1.905.608A7.381 7.381 0 0 0 4.86 5.308zm12.327 8.195l-1.775.443a1 1 0 1 1-.484-1.94l3.643-.909a1 1 0 0 1 .61-.08a1 1 0 0 1 .84.75l.968 3.88a1 1 0 0 1-1.94.484l-.33-1.322a9.381 9.381 0 0 1-16.384-1.796l-.26-.634a1 1 0 1 1 1.851-.758l.26.633a7.381 7.381 0 0 0 13.001 1.25z"
                  />
                </svg>
              </Box>

              <Box
                padding={1}
                bgcolor={"white"}
                borderRadius={1.8}
                width="fit-content"
                boxShadow="0px 0px 10px 0px #0000001A;
"
                display="flex"
                justifyContent="center"
                alignItems="center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="1.1em"
                  height="1.1em"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="#637382"
                    d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3l7 3V5c0-1.1-.9-2-2-2"
                  />
                </svg>
              </Box>
            </Box>

            <Typography variant="body1" color="#979797" fontSize={14}>
              Last update less than a minutes ago
            </Typography>
          </Box>
        </Stack>
      )}
      {/* Search Section End */}
    </>
  );
}
