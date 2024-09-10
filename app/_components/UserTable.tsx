"use client";
import React, { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Box, Button, Menu, MenuItem, Popover, Stack, Typography } from "@mui/material";
import { readableDate } from "../_lib/utils";
import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { getUsers } from "../_lib/action";
import Loader from "./Loader";
export interface User {
  id: Number;
  name: String;
  email: String;
  password: String;
  status: String;
  role: String;
  createdAt: String;
  organisation: {
    name: String;
  };
}
interface Props {
  users: User[];
}

export default function UserTable() {
  const router = useRouter();
  const loggedUser = getCookie("logged-user");
  const [users, setUsers] = useState<User[]>();
  const [loading, setLoading] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleEdit = (user: any) => {
    router.push(`/dashboard/user/${user.id}`);
  };
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  useEffect(() => {
    setLoading(true);
    if (loggedUser) {
      const data = async () => {
        const loggedData = JSON.parse(loggedUser);
        const res = await getUsers({
          role: loggedData.data.user.role,
          organisationId: loggedData.data.user.organisationId,
        });
        setUsers(res.data);
        setLoading(false);
      };
      data();
    }
  }, [loggedUser]);

  if (loading) {
    return <Loader />;
  }
  return (
    <TableContainer
      component={Paper}
      sx={{
        borderRadius: "14px",
        boxShadow: "0px 0px 16px 5px #0000001A",
      }}
    >
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow
            sx={{
              background: "#F5F6F8",
            }}
          >
            <TableCell
              sx={{
                borderBottom: 0,
                color: "#67737F",
                fontSize: {
                  md: 16,
                  xs: 14,
                },
                fontWeight: 600,
                paddingLeft: {
                  lg: 10,
                  md: 7,
                  xs: 4,
                },
              }}
            >
              Name
            </TableCell>
            <TableCell
              sx={{
                borderBottom: 0,
                color: "#67737F",
                fontSize: {
                  md: 16,
                  xs: 14,
                },
                fontWeight: 600,
              }}
            >
              Status
            </TableCell>
            <TableCell
              sx={{
                borderBottom: 0,
                color: "#67737F",
                fontSize: {
                  md: 16,
                  xs: 14,
                },
                fontWeight: 600,
              }}
            >
              Role
            </TableCell>
            <TableCell
              sx={{
                borderBottom: 0,
                color: "#67737F",
                fontSize: {
                  md: 16,
                  xs: 14,
                },
                fontWeight: 600,
              }}
            >
              Organisation
            </TableCell>
            <TableCell
              sx={{
                borderBottom: 0,
                color: "#67737F",
                fontSize: {
                  md: 16,
                  xs: 14,
                },
                fontWeight: 600,
              }}
            >
              Joined
            </TableCell>
            <TableCell
              sx={{
                borderBottom: 0,
                color: "#67737F",
                fontSize: {
                  md: 16,
                  xs: 14,
                },
                fontWeight: 600,
              }}
            ></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users && users.length > 0 ? (
            users.map((user, i) => {
              return (
                <TableRow
                  key={i}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell
                    sx={{
                      borderBottomColor: "#F5F6F8",
                      borderBottomWidth: 2,
                      color: "#555555",
                      fontWeight: 500,
                      paddingLeft: {
                        lg: 10,
                        md: 7,
                        xs: 4,
                      },
                    }}
                    component="th"
                    scope="row"
                  >
                    <Box display={"flex"} alignItems={"center"} gap={1.5}>
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
                          width="1.7em"
                          height="1.7em"
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

                      {user?.name ?? ""}
                    </Box>
                  </TableCell>
                  <TableCell
                    sx={{
                      borderBottomColor: "#F5F6F8",
                      borderBottomWidth: 2,
                      color: "#555555",
                      fontWeight: 500,
                    }}
                  >
                    {user?.status ?? ""}
                  </TableCell>
                  <TableCell
                    sx={{
                      borderBottomColor: "#F5F6F8",
                      borderBottomWidth: 2,
                      color: "#555555",
                      fontWeight: 500,
                    }}
                  >
                    {user?.role ?? ""}
                  </TableCell>
                  <TableCell
                    sx={{
                      borderBottomColor: "#F5F6F8",
                      borderBottomWidth: 2,
                      color: "#555555",
                      fontWeight: 500,
                    }}
                  >
                    {user?.organisation?.name ?? "No Organisation"}
                  </TableCell>
                  <TableCell
                    sx={{
                      borderBottomColor: "#F5F6F8",
                      borderBottomWidth: 2,
                      color: "#555555",
                      fontWeight: 500,
                    }}
                  >
                    {readableDate(user?.createdAt) ?? ""}
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      borderBottomColor: "#F5F6F8",
                      borderBottomWidth: 2,
                      color: "#555555",
                      fontWeight: 500,
                    }}
                    className="cursor-pointer"
                  // onClick={() => handleEdit(user)}
                  >

                    <Button
                      id="basic-button"
                      aria-controls={open ? 'basic-menu' : undefined}
                      aria-haspopup="true"
                      aria-expanded={open ? 'true' : undefined}
                      onClick={handleClick}
                      className="table-edit-option"
                      sx={{
                        background: "transparent",
                        color: "#555555",
                        boxShadow: "none",
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="1em"
                        height="1em"
                        viewBox="0 0 16 16"
                      >
                        <path
                          fill="currentColor"
                          d="M9.5 13a1.5 1.5 0 1 1-3 0a1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0a1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0a1.5 1.5 0 0 1 3 0"
                        />
                      </svg>
                    </Button>
                    <Menu
                      id="basic-menu"
                      className="table-edit-menu"
                      anchorEl={anchorEl}
                      open={open}
                      onClose={handleClose}
                      MenuListProps={{
                        'aria-labelledby': 'basic-button',
                      }}
                    >
                      <MenuItem>

                        {/* onClick={handleClose} */}

                        <Stack
                          display="flex"
                          gap={1.2}
                          alignItems="center"
                          direction="row"
                          // className="edit-popover-content"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="1em"
                            height="1em"
                            viewBox="0 0 24 24"
                          >
                            <path
                              fill="currentColor"
                              d="M3 21v-4.25L16.2 3.575q.3-.275.663-.425t.762-.15t.775.15t.65.45L20.425 5q.3.275.438.65T21 6.4q0 .4-.137.763t-.438.662L7.25 21zM17.6 7.8L19 6.4L17.6 5l-1.4 1.4z"
                            />
                          </svg>

                          <Typography variant="subtitle2">Edit</Typography>
                        </Stack>

                      </MenuItem>
                      
                    </Menu>

                    {/* <Button
                      aria-describedby={id}
                      variant="contained"
                      onClick={handleClick}
                      className="edit-option"
                      sx={{
                        background: "transparent",
                        color: "#555555",
                        boxShadow: "none",
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="1em"
                        height="1em"
                        viewBox="0 0 16 16"
                      >
                        <path
                          fill="currentColor"
                          d="M9.5 13a1.5 1.5 0 1 1-3 0a1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0a1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0a1.5 1.5 0 0 1 3 0"
                        />
                      </svg>
                    </Button>
                    <Popover
                      id={id}
                      open={open}
                      anchorEl={anchorEl}
                      onClose={handleClose}
                      anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "left",
                      }}
                      className="edit-popover"
                    >
                      <Stack
                        display="flex"
                        gap={1.2}
                        alignItems="center"
                        direction="row"
                        className="edit-popover-content"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="1em"
                          height="1em"
                          viewBox="0 0 24 24"
                        >
                          <path
                            fill="currentColor"
                            d="M3 21v-4.25L16.2 3.575q.3-.275.663-.425t.762-.15t.775.15t.65.45L20.425 5q.3.275.438.65T21 6.4q0 .4-.137.763t-.438.662L7.25 21zM17.6 7.8L19 6.4L17.6 5l-1.4 1.4z"
                          />
                        </svg>

                        <Typography variant="subtitle2">Edit</Typography>
                      </Stack>
                    </Popover> */}
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow
              key={"no table"}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              No Data Found
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
