"use client";
import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { Divider, Stack, Typography } from "@mui/material";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { useAppDispatch } from "@/lib/hooks";
import { sidebarAction } from "@/lib/features/sidebar/sidebarSlice";
import Logo from "@/public/static/img/logo.svg";
import { farmAction } from "@/lib/features/farm/farmSlice";
import SampleIcon from "@/public/static/img/ic-sample.svg";

function ClosedSidebar() {
  const router = useRouter();
  const pathName = usePathname();
  const [activePage, setActivePage] = useState<String>("");

  const dispatch = useAppDispatch();
  useEffect(() => {
    if (pathName) {
      setActivePage(pathName);
    }
  }, [pathName]);

  return (
    <Stack
      className="sidebar"
      sx={{
        position: "fixed",
        top: "0",
        left: "0",
        height: "100vh !important",
      }}
    >
      <Box
        position={"relative"}
        paddingTop={3}
        paddingInline={1}
        height={"100%"}
        sx={{
          width: 96,
          transition: "width 1s !important",
          background:
            "linear-gradient(349.33deg, rgba(6, 161, 155, 0.4) -27.15%, rgba(2, 59, 57, 0) 103.57%)",
        }}
        role="presentation"
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            mb: 2,
          }}
          className="cursor-pointer"
          onClick={() => router.push("/dashboard")}
        >
          <Image src={Logo} alt="Logo" width={50} height={40} />
        </Box>
        <List>
          <Link href={"/dashboard"} className="nav-links">
            <ListItem
              sx={{
                paddingX: 0,
                mb: 1,
              }}
            >
              <ListItemButton
                className={activePage === "/dashboard" ? "active" : ""}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <ListItemIcon
                  sx={{
                    display: "grid",
                    placeItems: "center",
                    marginRight: 0,
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="1.1em"
                    height="1.1em"
                    viewBox="0 0 24 24"
                  >
                    <g
                      fill="none"
                      stroke="#0E848E"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    >
                      <path d="M21 12c.552 0 1.005-.449.95-.998a10 10 0 0 0-8.953-8.951c-.55-.055-.998.398-.998.95v8a1 1 0 0 0 1 1z" />
                      <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
                    </g>
                  </svg>
                </ListItemIcon>
                <ListItemText
                  className="closed-nav-links"
                  sx={{
                    mt: 0.5,
                  }}
                >
                  Dashboard
                </ListItemText>
              </ListItemButton>
            </ListItem>
          </Link>

          <Divider
            sx={{
              my: 1.5,
              width: 35,
              marginInline: "auto",
              borderWidth: 1,
              borderRadius: 50,
              borderColor: "rgba(6, 161, 155, 0.25)",
            }}
          />

          <Link href={"/dashboard/fishSupply"} className="nav-links">
            <ListItem
              sx={{
                paddingX: 0,
                mb: 1,
              }}
            >
              <ListItemButton
                className={
                  activePage.startsWith("/dashboard/fishSupply") ? "active" : ""
                }
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <ListItemIcon
                  sx={{
                    display: "grid",
                    placeItems: "center",
                    marginRight: 0,
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="1.5em"
                    height="1.5em"
                    viewBox="0 0 21 21"
                  >
                    <g
                      fill="none"
                      fillRule="evenodd"
                      stroke="#0E848E"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m10.5 15.429l3.548 1.837a1 1 0 0 0 .907.006l2.992-1.496a1 1 0 0 0 .553-.894v-2.764a1 1 0 0 0-.553-.894L14.5 9.5l-3.46 1.792a1 1 0 0 0-.54.888z" />
                      <path d="m3.04 15.708l3.008 1.558a1 1 0 0 0 .907.006L10.5 15.5v-3.382a1 1 0 0 0-.553-.894L6.5 9.5l-3.46 1.792a1 1 0 0 0-.54.888v2.64a1 1 0 0 0 .54.888M6.5 9.429l3.548 1.837a1 1 0 0 0 .907.006L14.5 9.5V6.118a1 1 0 0 0-.553-.894l-2.992-1.496a1 1 0 0 0-.907.006L7.04 5.292a1 1 0 0 0-.54.888z" />
                      <path d="m6.846 5.673l3.207 1.603a1 1 0 0 0 .894 0L14.12 5.69h0m-3.274 5.983l3.207 1.603a1 1 0 0 0 .894 0l3.172-1.586h0m-15.273-.017l3.207 1.603a1 1 0 0 0 .894 0l3.172-1.586h0M10.5 7.5v4m4 2V17m-8-3.5V17" />
                    </g>
                  </svg>
                </ListItemIcon>
                <ListItemText
                  className="closed-nav-links"
                  sx={{
                    mt: 0.5,
                    textAlign: "center",
                  }}
                >
                  Fish Supply
                </ListItemText>
              </ListItemButton>
            </ListItem>
          </Link>

          <Link
            href={"/dashboard/farm"}
            className="nav-links"
            onClick={() => dispatch(farmAction.resetState())}
          >
            <ListItem
              sx={{
                paddingX: 0,
                mb: 1,
              }}
            >
              <ListItemButton
                className={
                  activePage.startsWith("/dashboard/farm") ? "active" : ""
                }
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <ListItemIcon
                  sx={{
                    display: "grid",
                    placeItems: "center",
                    marginRight: 0,
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="1.2em"
                    height="1.2em"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="#0E848E"
                      d="M20 21h-3v-2h3zm0-4h-3v-2h3zm0-4h-3v-2h3zm4-5.2C23.6 4.5 20.8 2 17.5 2c-1.7 0-3.4.7-4.6 1.9c-.7.7-1.2 1.4-1.5 2.3L15.6 9H22v13h2zM13.3 7c.6-1.8 2.3-3 4.2-3s3.6 1.2 4.2 3zM7.5 6L0 11v11h15V11zM13 20h-3v-6H5v6H2v-8l5.5-3.5L13 12z"
                    />
                  </svg>
                </ListItemIcon>
                <ListItemText
                  className="closed-nav-links"
                  sx={{
                    mt: 0.5,
                  }}
                >
                  Farm
                </ListItemText>
              </ListItemButton>
            </ListItem>
          </Link>

          <Link href={"/dashboard/feedSupply"} className="nav-links">
            <ListItem
              sx={{
                paddingX: 0,
                mb: 1,
              }}
            >
              <ListItemButton
                className={
                  activePage.startsWith("/dashboard/feedSupply") ? "active" : ""
                }
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <ListItemIcon
                  sx={{
                    display: "grid",
                    placeItems: "center",
                    marginRight: 0,
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="1.5em"
                    height="1.5em"
                    viewBox="0 0 256 256"
                  >
                    <path
                      fill="#0E848E"
                      d="M230.33 141.06a24.43 24.43 0 0 0-21.24-4.23l-41.84 9.62A28 28 0 0 0 140 112H89.94a31.82 31.82 0 0 0-22.63 9.37L44.69 144H16a16 16 0 0 0-16 16v40a16 16 0 0 0 16 16h104a8 8 0 0 0 1.94-.24l64-16a7 7 0 0 0 1.19-.4L226 182.82l.44-.2a24.6 24.6 0 0 0 3.93-41.56ZM16 160h24v40H16Zm203.43 8.21l-38 16.18L119 200H56v-44.69l22.63-22.62A15.86 15.86 0 0 1 89.94 128H140a12 12 0 0 1 0 24h-28a8 8 0 0 0 0 16h32a8.3 8.3 0 0 0 1.79-.2l67-15.41l.31-.08a8.6 8.6 0 0 1 6.3 15.9ZM164 96a36 36 0 0 0 5.9-.48a36 36 0 1 0 28.22-47A36 36 0 1 0 164 96m60-12a20 20 0 1 1-20-20a20 20 0 0 1 20 20m-60-44a20 20 0 0 1 19.25 14.61a36 36 0 0 0-15 24.93A20.4 20.4 0 0 1 164 80a20 20 0 0 1 0-40"
                    />
                  </svg>
                </ListItemIcon>
                <ListItemText
                  className="closed-nav-links"
                  sx={{
                    mt: 0.5,
                    textAlign: "center",
                  }}
                >
                  Feed Supply
                </ListItemText>
              </ListItemButton>
            </ListItem>
          </Link>
          <Divider
            sx={{
              my: 1.5,
              width: 35,
              marginInline: "auto",
              borderWidth: 1,
              borderRadius: 50,
              borderColor: "rgba(6, 161, 155, 0.25)",
            }}
          />

          <Link href={"/dashboard/farmManager"} className="nav-links">
            <ListItem
              sx={{
                paddingX: 0,
                mb: 1,
              }}
            >
              <ListItemButton
                className={
                  activePage.startsWith("/dashboard/farmManager")
                    ? "active"
                    : ""
                }
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <ListItemIcon
                  sx={{
                    display: "grid",
                    placeItems: "center",
                    marginRight: 0,
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="1.6em"
                    height="1.2em"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="#0E848E"
                      d="M20 21h-3v-2h3zm0-4h-3v-2h3zm0-4h-3v-2h3zm4-5.2C23.6 4.5 20.8 2 17.5 2c-1.7 0-3.4.7-4.6 1.9c-.7.7-1.2 1.4-1.5 2.3L15.6 9H22v13h2zM13.3 7c.6-1.8 2.3-3 4.2-3s3.6 1.2 4.2 3zM7.5 6L0 11v11h15V11zM13 20h-3v-6H5v6H2v-8l5.5-3.5L13 12z"
                    />
                  </svg>
                </ListItemIcon>
                <ListItemText
                  className="closed-nav-links"
                  sx={{
                    mt: 0.5,
                    textAlign: "center",
                  }}
                >
                  Farm Manager
                </ListItemText>
              </ListItemButton>
            </ListItem>
          </Link>

          <Link
            href={"/dashboard/feedStore"}
            className="nav-links"
            onClick={() => dispatch(farmAction.resetState())}
          >
            <ListItem
              sx={{
                paddingX: 0,
                mb: 1,
              }}
            >
              <ListItemButton
                className={
                  activePage.startsWith("/dashboard/feedStore") ? "active" : ""
                }
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <ListItemIcon
                  sx={{
                    display: "grid",
                    placeItems: "center",
                    marginRight: 0,
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="1.4em"
                    height="1.4em"
                    viewBox="0 0 256 256"
                  >
                    <path
                      fill="#0E848E"
                      d="M240 208h-8V72a8 8 0 0 0-8-8h-40V40a8 8 0 0 0-8-8H80a8 8 0 0 0-8 8v56H32a8 8 0 0 0-8 8v104h-8a8 8 0 0 0 0 16h224a8 8 0 0 0 0-16M40 112h40a8 8 0 0 0 8-8V48h80v24a8 8 0 0 0 8 8h40v128h-64v-40a8 8 0 0 0-8-8h-32a8 8 0 0 0-8 8v40H40Zm96 96h-16v-32h16ZM112 72a8 8 0 0 1 8-8h16a8 8 0 0 1 0 16h-16a8 8 0 0 1-8-8m0 32a8 8 0 0 1 8-8h16a8 8 0 0 1 0 16h-16a8 8 0 0 1-8-8m56 0a8 8 0 0 1 8-8h16a8 8 0 0 1 0 16h-16a8 8 0 0 1-8-8m-80 32a8 8 0 0 1-8 8H64a8 8 0 0 1 0-16h16a8 8 0 0 1 8 8m0 32a8 8 0 0 1-8 8H64a8 8 0 0 1 0-16h16a8 8 0 0 1 8 8m24-32a8 8 0 0 1 8-8h16a8 8 0 0 1 0 16h-16a8 8 0 0 1-8-8m56 0a8 8 0 0 1 8-8h16a8 8 0 0 1 0 16h-16a8 8 0 0 1-8-8m0 32a8 8 0 0 1 8-8h16a8 8 0 0 1 0 16h-16a8 8 0 0 1-8-8"
                    />
                  </svg>
                </ListItemIcon>
                <ListItemText
                  className="closed-nav-links"
                  sx={{
                    mt: 0.5,
                    textAlign: "center",
                  }}
                >
                  Feed Store
                </ListItemText>
              </ListItemButton>
            </ListItem>
          </Link>

          <Link href={"/dashboard/sample"} className="nav-links">
            <ListItem
              sx={{
                paddingX: 0,
                mb: 1,
              }}
            >
              <ListItemButton
                className={
                  activePage.startsWith("/dashboard/sample") ? "active" : ""
                }
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <ListItemIcon
                  sx={{
                    display: "grid",
                    placeItems: "center",
                    marginRight: 0,
                  }}
                >
                  <Image
                    src={SampleIcon}
                    width={24}
                    height={24}
                    unoptimized={true}
                    alt="Sample Icon"
                  />
                </ListItemIcon>
                <ListItemText
                  className="closed-nav-links"
                  sx={{
                    mt: 0.5,
                    textAlign: "center",
                  }}
                >
                  Sample
                </ListItemText>
              </ListItemButton>
            </ListItem>
          </Link>

          <Link href={"/dashboard/feedPrediction"} className="nav-links">
            <ListItem
              sx={{
                paddingX: 0,
                mb: 1,
              }}
            >
              <ListItemButton
                className={
                  activePage.startsWith("/dashboard/feedPrediction")
                    ? "active"
                    : ""
                }
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <ListItemIcon
                  sx={{
                    display: "grid",
                    placeItems: "center",
                    marginRight: 0,
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="1.4em"
                    height="1.4em"
                    viewBox="0 0 24 24"
                  >
                    <g
                      fill="none"
                      stroke="#0E848E"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                    >
                      <path d="M3.5 4v12.5a4 4 0 0 0 4 4H20" />
                      <path d="m7 14l3.293-3.293a1 1 0 0 1 1.414 0l1.336 1.336a1 1 0 0 0 1.414 0L19 7.5l.648-.649M15 6.5h3.8c.331 0 .631.134.848.351M20 11.5V7.7c0-.331-.134-.631-.352-.849" />
                    </g>
                  </svg>
                </ListItemIcon>
                <ListItemText
                  className="closed-nav-links"
                  sx={{
                    mt: 0.5,
                    textAlign: "center",
                  }}
                >
                  Feed Prediction
                </ListItemText>
              </ListItemButton>
            </ListItem>
          </Link>

          <Divider
            sx={{
              my: 1.5,
              width: 35,
              marginInline: "auto",
              borderWidth: 1,
              borderRadius: 50,
              borderColor: "rgba(6, 161, 155, 0.25)",
            }}
          />

          <Link href={"/dashboard/organisation"} className="nav-links">
            <ListItem
              sx={{
                paddingX: 0,
                mb: 1,
              }}
            >
              <ListItemButton
                className={
                  activePage.startsWith("/dashboard/organisation")
                    ? "active"
                    : ""
                }
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <ListItemIcon
                  sx={{
                    display: "grid",
                    placeItems: "center",
                    marginRight: 0,
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="1.3em"
                    height="1.3em"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fill="#0E848E"
                      d="M8 1a2.5 2.5 0 0 0-.5 4.95V7H5.367C4.612 7 4 7.612 4 8.367v1.683a2.5 2.5 0 1 0 1 0V8.367C5 8.164 5.164 8 5.367 8h5.267c.202 0 .366.164.366.367v1.683a2.5 2.5 0 1 0 1 0V8.367C12 7.612 11.388 7 10.634 7H8.499V5.95A2.5 2.5 0 0 0 8 1M6.5 3.5a1.5 1.5 0 1 1 3 0a1.5 1.5 0 0 1-3 0m-3.5 9a1.5 1.5 0 1 1 3 0a1.5 1.5 0 0 1-3 0m8.5-1.5a1.5 1.5 0 1 1 0 3a1.5 1.5 0 0 1 0-3"
                    />
                  </svg>
                </ListItemIcon>
                <ListItemText
                  className="closed-nav-links"
                  sx={{
                    mt: 0.5,
                  }}
                >
                  Organisations
                </ListItemText>
              </ListItemButton>
            </ListItem>
          </Link>

          <Link href={"/dashboard/user"} className="nav-links">
            <ListItem
              sx={{
                paddingX: 0,
              }}
            >
              <ListItemButton
                className={
                  activePage.startsWith("/dashboard/user") ? "active" : ""
                }
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <ListItemIcon
                  sx={{
                    display: "grid",
                    placeItems: "center",
                    marginRight: 0,
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="1.2em"
                    height="1.2em"
                    viewBox="0 0 256 256"
                  >
                    <path
                      fill="#0E848E"
                      d="M117.25 157.92a60 60 0 1 0-66.5 0a95.83 95.83 0 0 0-47.22 37.71a8 8 0 1 0 13.4 8.74a80 80 0 0 1 134.14 0a8 8 0 0 0 13.4-8.74a95.83 95.83 0 0 0-47.22-37.71M40 108a44 44 0 1 1 44 44a44.05 44.05 0 0 1-44-44m210.14 98.7a8 8 0 0 1-11.07-2.33A79.83 79.83 0 0 0 172 168a8 8 0 0 1 0-16a44 44 0 1 0-16.34-84.87a8 8 0 1 1-5.94-14.85a60 60 0 0 1 55.53 105.64a95.83 95.83 0 0 1 47.22 37.71a8 8 0 0 1-2.33 11.07"
                    />
                  </svg>
                </ListItemIcon>
                <ListItemText
                  className="closed-nav-links"
                  sx={{
                    mt: 0.5,
                  }}
                >
                  Users
                </ListItemText>
              </ListItemButton>
            </ListItem>
          </Link>
        </List>
        <Box
          position={"absolute"}
          top={35}
          right={-7}
          sx={{
            cursor: "pointer",
          }}
          onClick={() => dispatch(sidebarAction.handleSwitchSidebar(true))}
        >
          <Image
            src={"/static/img/icons/ic-expand-sidebar.svg"}
            width={17}
            height={17}
            alt="Sidebar Expand Icon"
          />
        </Box>
      </Box>
    </Stack>
  );
}
export default ClosedSidebar;
