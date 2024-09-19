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

function ClosedSidebar() {
  const router = useRouter();
  const pathName = usePathname();
  const [activePage, setActivePage] = useState<String>("");

  const dispatch = useAppDispatch();
  useEffect(() => {
    if (pathName) {
      const pathArr = pathName.split("/");
      setActivePage(pathArr[pathArr.length - 1]);
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
        paddingBlock={3}
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
                className={activePage === "dashboard" ? "active" : ""}
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
                      stroke-linecap="round"
                      stroke-linejoin="round"
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

          <Link href={"/dashboard/batches"} className="nav-links">
            <ListItem
              sx={{
                paddingX: 0,
                mb: 1,
              }}
            >
              <ListItemButton
                className={
                  activePage === "batches" || activePage === "new"
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
                    width="1.5em"
                    height="1.5em"
                    viewBox="0 0 21 21"
                  >
                    <g
                      fill="none"
                      fill-rule="evenodd"
                      stroke="#0E848E"
                      stroke-linecap="round"
                      stroke-linejoin="round"
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
                  }}
                >
                  Batches
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
                className={activePage === "organisation" ? "active" : ""}
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
                className={activePage === "user" ? "active" : ""}
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
