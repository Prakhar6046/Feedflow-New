"use client";
import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { Stack, Typography } from "@mui/material";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  selectSwitchSidebar,
  sidebarAction,
} from "@/lib/features/sidebar/sidebarSlice";
import { getCookie } from "cookies-next";
import { LoggedUser } from "../AccountPopover";
import Logo from "@/public/static/img/logo.svg";
const ExpandedSidebar = () => {
  const router = useRouter();
  const loggedUser: any = getCookie("logged-user");
  const [loggedUserData, setLoggedUserData] = useState<LoggedUser>();
  const [activePage, setActivePage] = useState<String>("");
  const dispatch = useAppDispatch();
  const pathName = usePathname();
  useEffect(() => {
    if (pathName) {
      const pathArr = pathName.split("/");
      setActivePage(pathArr[pathArr.length - 1]);
    }
  }, [pathName]);
  useEffect(() => {
    if (loggedUser) {
      setLoggedUserData(JSON.parse(loggedUser));
    }
  }, [loggedUser]);

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
        paddingInline={2.5}
        height={"100%"}
        sx={{
          width: 280,
          transition: "width 1s !important",
          background:
            "linear-gradient(349.33deg, rgba(6, 161, 155, 0.4) -27.15%, rgba(2, 59, 57, 0) 103.57%)",
        }}
        role="presentation"
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
          }}
          className="cursor-pointer"
          onClick={() => router.push("/dashboard")}
        >
          <Image src={Logo} alt="Logo" width={50} height={40} />
        </Box>

        <Box
          display={"flex"}
          alignItems={"center"}
          gap={1.5}
          paddingInline={1.4}
          paddingBlock={1}
          my={3}
          bgcolor={"rgba(145, 158, 171, 0.12)"}
          borderRadius={3}
        >
          {loggedUserData ? (
            <Box
              display={"flex"}
              justifyContent={"center"}
              alignItems={"center"}
              // bgcolor={"rgba(145, 158, 171, 0.24)"}
              sx={{
                width: 40,
                height: 40,
                borderRadius: "8px",
              }}
              style={{
                backgroundImage: `url(${loggedUserData?.data?.user.imageUrl})`,
                backgroundSize: "contain",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                margin: "0 !important",
              }}
            ></Box>
          ) : (
            <Box
              display={"flex"}
              justifyContent={"center"}
              alignItems={"center"}
              bgcolor={"rgba(145, 158, 171, 0.24)"}
              sx={{
                width: 40,
                height: 40,
                borderRadius: "8px",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1.5em"
                height="1.5em"
                viewBox="0 0 24 24"
              >
                <g fill="none">
                  <path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z" />
                  <path
                    fill="#637381"
                    d="M16 14a5 5 0 0 1 4.995 4.783L21 19v1a2 2 0 0 1-1.85 1.995L19 22H5a2 2 0 0 1-1.995-1.85L3 20v-1a5 5 0 0 1 4.783-4.995L8 14zM12 2a5 5 0 1 1 0 10a5 5 0 0 1 0-10"
                  />
                </g>
              </svg>
            </Box>
          )}

          <Box>
            <Typography variant="subtitle2" fontWeight={600}>
              {loggedUserData ? loggedUserData?.data?.user.name : "Demo"}
            </Typography>
            <Typography
              variant="body2"
              fontSize={12}
              fontWeight={400}
              sx={{
                whiteSpace: "nowrap",
                width: "165px",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {loggedUserData ? loggedUserData?.data?.user.email : "Demo"}
            </Typography>
          </Box>
        </Box>

        <List>
          <Typography
            variant="body1"
            fontSize={12}
            fontWeight={600}
            pl={2}
            textTransform={"uppercase"}
            letterSpacing={0.5}
            mb={1}
          >
            My Feedflow
          </Typography>

          <Link href={"/dashboard"} className="nav-links">
            <ListItem
              sx={{
                paddingX: 0,
              }}
            >
              <ListItemButton
                className={activePage === "dashboard" ? "active" : ""}
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 1.7,
                }}
              >
                <ListItemIcon
                  sx={{
                    display: "grid",
                    placeItems: "center",
                    marginRight: 0,
                    minWidth: "fit-content",
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
                <ListItemText className="expand-nav-links">
                  Dashboard
                </ListItemText>
              </ListItemButton>
            </ListItem>
          </Link>

          <Typography
            variant="body1"
            fontSize={12}
            fontWeight={600}
            pl={2}
            mt={3}
            textTransform={"uppercase"}
            letterSpacing={0.5}
            mb={1}
          >
            DATA
          </Typography>

          <Link href={"/dashboard/batches"} className="nav-links">
            <ListItem
              sx={{
                paddingX: 0,
                mb: 0.5,
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
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 1.7,
                }}
              >
                <ListItemIcon
                  sx={{
                    display: "grid",
                    placeItems: "center",
                    marginRight: 0,
                    minWidth: "fit-content",
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
                  className="expand-nav-links"
                  sx={{
                    mt: 0.5,
                  }}
                >
                  Batches
                </ListItemText>
              </ListItemButton>
            </ListItem>
          </Link>

          <Typography
            variant="body1"
            fontSize={12}
            fontWeight={600}
            pl={2}
            mt={3}
            textTransform={"uppercase"}
            letterSpacing={0.5}
            mb={1}
          >
            Management
          </Typography>

          <Link href={"/dashboard/organisation"} className="nav-links">
            <ListItem
              sx={{
                paddingX: 0,
                mb: 0.5,
              }}
            >
              <ListItemButton
                className={activePage === "organisation" ? "active" : ""}
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 1.7,
                }}
              >
                <ListItemIcon
                  sx={{
                    display: "grid",
                    placeItems: "center",
                    marginRight: 0,
                    minWidth: "fit-content",
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
                  className="expand-nav-links"
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
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 1.7,
                }}
              >
                <ListItemIcon
                  sx={{
                    display: "grid",
                    placeItems: "center",
                    marginRight: 0,
                    minWidth: "fit-content",
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
                  className="expand-nav-links"
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
            transform: "rotate(180deg) translateY(5px)",
          }}
          onClick={() => dispatch(sidebarAction.handleSwitchSidebar(false))}
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
};

export default ExpandedSidebar;
