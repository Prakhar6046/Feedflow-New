"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import logo from "@/public/static/img/logo-bigone.jpg";
import Image from "next/image";
import { setCookie } from "cookies-next";

export default function Page() {
  const [email, setEmail] = useState("abhishek.choudhary@ensuesoft.com");
  const [password, setPassword] = useState("12345678");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    setCookie("logged-user", data);
    if (data.status) router.push("/dashboard/organisation");
  };

  return (
    <>
      {/* Login Section Start */}
      <Stack>
        <Box padding={1.5} bgcolor={"#06A19B"}></Box>

        <Box paddingBlock={1} bgcolor={"#fff"}>
          <Box
            sx={{
              width: {
                md: 500,
                xs: 300,
              },
              paddingInline: {
                md: 5,
                xs: 2,
              },
            }}
          >
            <Image
              src={logo}
              alt="Logo"
              style={{
                width: "100%",
                height: "auto",
              }}
            />
          </Box>
        </Box>

        <Box
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
          sx={{
            backgroundImage: "url(/static/img/login-bgImg.png)",
            backgroundRepeat: "no-repeat",
            backgroundSize: "100% 100%",
            minHeight: "78.7vh",
            // height: "900px",
            paddingBlock: 7,
          }}
        >
          <Grid
            container
            alignItems={"flex-end"}
            sx={{
              justifyContent: {
                xs: "space-between",
              },
              gap: {
                md: 0,
                xs: 3,
              },
            }}
          >
            <Grid
              item
              md={5}
              xs={10}
              bgcolor={"#0E848E"}
              sx={{
                borderTopRightRadius: 100,
                borderBottomRightRadius: 100,
              }}
            >
              <Box
                color={"#fff"}
                sx={{
                  fontSize: {
                    xl: 30,
                    lg: 24,
                    md: 20,
                  },
                  padding: {
                    lg: 4,
                    xs: 3,
                  },
                }}
              >
                Aquafeed management to optimize production and environmental
                sustainability.
              </Box>
            </Grid>

            <Grid
              item
              lg={1}
              sx={{
                display: {
                  md: "block",
                  xs: "none",
                },
              }}
            ></Grid>

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
                  <form onSubmit={handleSubmit}>
                    <TextField
                      label="Email"
                      type="email"
                      // focused
                      sx={{
                        width: "100%",
                        marginBottom: 4,
                      }}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />

                    <TextField
                      label="Password"
                      type="password"
                      // focused
                      sx={{
                        width: "100%",
                        marginBottom: 3,
                      }}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />

                    <Button
                      variant="contained"
                      sx={{
                        background: "#06A19B",
                        fontWeight: "600",
                        padding: "10px 24px",
                        width: "100%",
                        textTransform: "capitalize",
                        borderRadius: "8px",
                        fontSize: 18,
                      }}
                      type="submit"
                    >
                      Login
                    </Button>
                  </form>
                </Box>

                <Box
                  display={"flex"}
                  justifyContent={"space-between"}
                  gap={2}
                  alignItems={"center"}
                  marginBlock={3}
                >
                  <Box bgcolor={"#979797"} height={"1px"} width={"100%"}></Box>
                  or
                  <Box bgcolor={"#979797"} height={"1px"} width={"100%"}></Box>
                </Box>

                <Box
                  color="#06A19B"
                  fontWeight={500}
                  display={"flex"}
                  justifyContent={"center"}
                  alignItems={"center"}
                  gap={1}
                  border={"1px solid #06A19B"}
                  padding={1}
                  borderRadius={1.8}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="2em"
                    height="2em"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="#06A19B"
                      d="M3.064 7.51A10 10 0 0 1 12 2c2.695 0 4.959.991 6.69 2.605l-2.867 2.868C14.786 6.482 13.468 5.977 12 5.977c-2.605 0-4.81 1.76-5.595 4.123c-.2.6-.314 1.24-.314 1.9s.114 1.3.314 1.9c.786 2.364 2.99 4.123 5.595 4.123c1.345 0 2.49-.355 3.386-.955a4.6 4.6 0 0 0 1.996-3.018H12v-3.868h9.418c.118.654.182 1.336.182 2.045c0 3.046-1.09 5.61-2.982 7.35C16.964 21.105 14.7 22 12 22A9.996 9.996 0 0 1 2 12c0-1.614.386-3.14 1.064-4.49"
                    />
                  </svg>
                  Login with Google
                </Box>
              </Box>
            </Grid>

            <Grid
              item
              lg={1}
              sx={{
                display: {
                  md: "block",
                  xs: "none",
                },
              }}
            ></Grid>
          </Grid>
        </Box>
      </Stack>

      <Stack
        bgcolor={"#272727"}
        sx={{
          paddingInline: {
            lg: 4,
            xs: 3,
          },
          paddingBlock: 2,
          rowGap: 2,
          columnGap: 5,
        }}
        display={"flex"}
        justifyContent={"space-between"}
        direction={"row"}
        alignItems={"center"}
        flexWrap={"wrap"}
      >
        <Box
          display={"flex"}
          sx={{
            rowGap: 2,
            columnGap: 5,
          }}
          alignItems={"center"}
          flexWrap={"wrap"}
        >
          <Box display={"flex"} gap={2} alignItems={"center"}>
            <Typography variant="subtitle1" color="#fff" fontWeight={400}>
              Consulting Animal Nutritionists
            </Typography>

            <Box display={"flex"} alignItems={"center"} gap={1}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="100%"
                height="100%"
                viewBox="0 0 200 200"
                style={{ maxHeight: "40px", maxWidth: "40px" }}
              >
                <g
                  fill="#fff"
                  fill-rule="evenodd"
                  stroke="none"
                  stroke-width="1"
                >
                  <circle
                    cx="100"
                    cy="100"
                    r="80"
                    stroke="#fff"
                    stroke-width="16"
                    fill="transparent"
                  ></circle>
                  <text
                    x="40"
                    y="128"
                    font-family="'__Varela_Round_143227', '__Varela_Round_Fallback_143227', Helvetica, Arial, sans-serif"
                    font-size="96"
                    font-weight="400"
                  >
                    nh
                  </text>
                </g>
              </svg>

              <Typography variant="subtitle1" fontWeight={600} color="#fff">
                nutritionhub
              </Typography>
            </Box>
          </Box>

          <Box display={"flex"} gap={2} alignItems={"center"}>
            <Button
              variant="contained"
              sx={{
                background: "#06A19B",
                fontWeight: 600,
                padding: "4px 16px",
                width: "fit-content",
                textTransform: "capitalize",
                borderRadius: "4px",
              }}
            >
              Contact
            </Button>

            <Typography variant="body1" color="#fff">
              www.nutritionhub.co.za
            </Typography>
          </Box>
        </Box>

        <Typography variant="subtitle2" color="#fff" fontWeight={400}>
          All right reserved - 2024 Nutritionhub
        </Typography>
      </Stack>
      {/* Login Section End */}
    </>
  );
}
