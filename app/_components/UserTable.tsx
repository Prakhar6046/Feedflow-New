"use client";
import React, { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
// import { getUsers } from "../_lib/action";
import Loader from "./Loader";
import { useAppSelector } from "@/lib/hooks";
import { selectUsers } from "@/lib/features/user/userSlice";
import {
  Box,
  Button,
  Divider,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from "@mui/material";
import { readableDate } from "../_lib/utils";
import Image from "next/image";
import toast from "react-hot-toast";
export interface User {
  id: Number;
  name: String;
  email: String;
  image: String;
  imageUrl: String;
  password: String;
  status: String;
  role: String;
  createdAt: String;
  organisationId: Number;
  organisation: {
    name: String;
    imageUrl: String;
  };
}
interface Props {
  users: User[];
}

interface Data {
  name: string;
  code: string;
  population: number;
  size: number;
  density: number;
}

export default function UserTable() {
  const router = useRouter();
  const searchUsers = useAppSelector(selectUsers);
  const loggedUser = getCookie("logged-user");
  const [users, setUsers] = useState<User[]>();
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );
  const getUsers = async (payload: any) => {
    try {
      const data = await fetch(
        `/api/users?role=${payload.role}&organisationId=${payload.organisationId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return await data.json();
    } catch (error) {
      return error;
    }
  };

  const handleEdit = (user: any) => {
    router.push(`/dashboard/user/${selectedUser?.id}`);
  };
  const handleClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    user: User
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };
  const handleClose = () => {
    setAnchorEl(null);
    setSelectedUser(null);
  };
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  const handleInviteUser = async () => {
    if (selectedUser) {
      const response = await fetch("/api/invite/user", {
        method: "POST",
        body: JSON.stringify({
          name: selectedUser.name,
          email: selectedUser.email,
          userId: selectedUser.id,
        }),
      });
      if (response.ok) {
        const res = await response.json();
        toast.success(res.message);
        // resetField("confirmPassword");
        // resetField("password");
      }
    }
    setAnchorEl(null);
  };
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

  useEffect(() => {
    if (searchUsers) {
      setUsers(searchUsers);
    }
  }, [searchUsers]);

  if (loading) {
    return <Loader />;
  }

  return (
    <Paper
      sx={{
        width: "100%",
        overflow: "hidden",
        borderRadius: "14px",
        boxShadow: "0px 0px 16px 5px #0000001A",
        mt: 4,
      }}
    >
      <TableContainer
        sx={{
          maxHeight: "72.5vh",
        }}
      >
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  borderBottom: 0,
                  color: "#67737F",
                  background: "#F5F6F8",
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
                  background: "#F5F6F8",
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
                  background: "#F5F6F8",
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
                  background: "#F5F6F8",
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
                  background: "#F5F6F8",
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
                  background: "#F5F6F8",
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
                        {user?.imageUrl ? (
                          <Image
                            src={String(user.imageUrl)}
                            width={40}
                            height={40}
                            style={{
                              borderRadius: "8px",
                            }}
                            alt="img not found"
                          />
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
                        )}

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
                      <Box
                        display={"flex"}
                        justifyContent={"flex-start"}
                        alignItems={"center"}
                        gap={"12px"}
                      >
                        {user?.organisation.imageUrl ? (
                          <Image
                            src={String(user.organisation.imageUrl)}
                            width={80}
                            height={40}
                            style={{
                              borderRadius: "8px",
                              objectFit: "contain",
                            }}
                            alt="img not found"
                          />
                        ) : (
                          <Box
                            display={"flex"}
                            justifyContent={"center"}
                            alignItems={"center"}
                            bgcolor={"rgba(145, 158, 171, 0.24)"}
                            sx={{
                              width: 80,
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
                        )}
                        {user?.organisation?.name ?? "No Organisation"}
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
                        aria-controls={open ? "basic-menu" : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? "true" : undefined}
                        onClick={(e) => handleClick(e, user)}
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
                          "aria-labelledby": "basic-button",
                        }}
                      >
                        <MenuItem onClick={handleEdit}>
                          <Stack
                            display="flex"
                            gap={1.2}
                            alignItems="center"
                            direction="row"
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

                        <Divider
                          sx={{
                            borderColor: "#9797971A",
                            my: 0.5,
                          }}
                        />
                        <MenuItem onClick={handleInviteUser}>
                          <Stack
                            display="flex"
                            gap={1.2}
                            alignItems="center"
                            direction="row"
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

                            <Typography variant="subtitle2">Invite</Typography>
                          </Stack>
                        </MenuItem>

                        <Divider
                          sx={{
                            borderColor: "#9797971A",
                            my: 0.5,
                          }}
                        />
                        <MenuItem onClick={handleEdit}>
                          <Stack
                            display="flex"
                            gap={1.2}
                            alignItems="center"
                            direction="row"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="1em"
                              height="1em"
                              viewBox="0 0 24 24"
                            >
                              <g fill="none">
                                <path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"></path>
                                <path
                                  fill="#ff0000"
                                  d="M14.28 2a2 2 0 0 1 1.897 1.368L16.72 5H20a1 1 0 1 1 0 2l-.003.071l-.867 12.143A3 3 0 0 1 16.138 22H7.862a3 3 0 0 1-2.992-2.786L4.003 7.07L4 7a1 1 0 0 1 0-2h3.28l.543-1.632A2 2 0 0 1 9.721 2zm3.717 5H6.003l.862 12.071a1 1 0 0 0 .997.929h8.276a1 1 0 0 0 .997-.929zM10 10a1 1 0 0 1 .993.883L11 11v5a1 1 0 0 1-1.993.117L9 16v-5a1 1 0 0 1 1-1m4 0a1 1 0 0 1 1 1v5a1 1 0 1 1-2 0v-5a1 1 0 0 1 1-1m.28-6H9.72l-.333 1h5.226z"
                                ></path>
                              </g>
                            </svg>

                            <Typography variant="subtitle2" color="#ff0000">
                              Delete
                            </Typography>
                          </Stack>
                        </MenuItem>
                      </Menu>
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
    </Paper>
  );
}
// <TableContainer
//   component={Paper}
//   sx={{
//     borderRadius: "14px",
//     boxShadow: "0px 0px 16px 5px #0000001A",
//     mt: 4,
//   }}
// >
//   <Table sx={{ minWidth: 650 }} aria-label="simple table">
//     <TableHead>
//       <TableRow
//         sx={{
//           background: "#F5F6F8",
//         }}
//       >
//         <TableCell
//           sx={{
//             borderBottom: 0,
//             color: "#67737F",
//             fontSize: {
//               md: 16,
//               xs: 14,
//             },
//             fontWeight: 600,
//             paddingLeft: {
//               lg: 10,
//               md: 7,
//               xs: 4,
//             },
//           }}
//         >
//           Organizations
//         </TableCell>
//         <TableCell
//           sx={{
//             borderBottom: 0,
//             color: "#67737F",
//             fontSize: {
//               md: 16,
//               xs: 14,
//             },
//             fontWeight: 600,
//           }}
//         >
//           Contact Number
//         </TableCell>
//         <TableCell
//           sx={{
//             borderBottom: 0,
//             color: "#67737F",
//             fontSize: {
//               md: 16,
//               xs: 14,
//             },
//             fontWeight: 600,
//           }}
//         >
//           Contact Person
//         </TableCell>
//         {/* <TableCell
//           sx={{
//             borderBottom: 0,
//             color: "#67737F",
//             fontSize: {
//               md: 16,
//               xs: 14,
//             },
//             fontWeight: 600,
//           }}
//         >
//           Product
//         </TableCell> */}
//         <TableCell
//           sx={{
//             borderBottom: 0,
//             color: "#67737F",
//             fontSize: {
//               md: 16,
//               xs: 14,
//             },
//             fontWeight: 600,
//           }}
//         ></TableCell>
//       </TableRow>
//     </TableHead>
//     <TableBody>
//       {organisationData && organisationData.length > 0 ? (
//         organisationData?.map((organisation, i) => (
//           <TableRow
//             key={i}
//             sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
//           >
//             <TableCell
//               sx={{
//                 borderBottomColor: "#F5F6F8",
//                 borderBottomWidth: 2,
//                 color: "#555555",
//                 fontWeight: 500,
//                 paddingLeft: {
//                   lg: 10,
//                   md: 7,
//                   xs: 4,
//                 },
//               }}
//               component="th"
//               scope="row"
//             >
//               <Box display={"flex"} alignItems={"center"} gap={1.5}>
//                 <Box
//                   display={"flex"}
//                   justifyContent={"center"}
//                   alignItems={"center"}
//                   bgcolor={"rgba(145, 158, 171, 0.24)"}
//                   sx={{
//                     width: 80,
//                     height: 40,
//                     borderRadius: "8px",
//                   }}
//                 >
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     width="1.7em"
//                     height="1.7em"
//                     viewBox="0 0 24 24"
//                   >
//                     <g fill="none">
//                       <path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z" />
//                       <path
//                         fill="#637381"
//                         d="M16 14a5 5 0 0 1 4.995 4.783L21 19v1a2 2 0 0 1-1.85 1.995L19 22H5a2 2 0 0 1-1.995-1.85L3 20v-1a5 5 0 0 1 4.783-4.995L8 14zM12 2a5 5 0 1 1 0 10a5 5 0 0 1 0-10"
//                       />
//                     </g>
//                   </svg>
//                 </Box>

//                 {organisation.name}
//               </Box>
//             </TableCell>
//             <TableCell
//               sx={{
//                 borderBottomColor: "#F5F6F8",
//                 borderBottomWidth: 2,
//                 color: "#555555",
//                 fontWeight: 500,
//               }}
//             >
//               {organisation.contactNumber}
//             </TableCell>
//             <TableCell
//               sx={{
//                 borderBottomColor: "#F5F6F8",
//                 borderBottomWidth: 2,
//                 color: "#555555",
//                 fontWeight: 500,
//               }}
//             >
//               {organisation.contactPerson}
//             </TableCell>
//             {/* <TableCell
//             sx={{
//               borderBottomColor: "#F5F6F8",
//               borderBottomWidth: 2,
//               color: "#555555",
//               fontWeight: 500,
//             }}
//           >
//             {row.carbs}
//           </TableCell> */}
//             <TableCell
//               align="center"
//               sx={{
//                 borderBottomColor: "#F5F6F8",
//                 borderBottomWidth: 2,
//                 color: "#555555",
//                 fontWeight: 500,
//               }}
//             >
//               <Button
//                 id="basic-button"
//                 aria-controls={open ? "basic-menu" : undefined}
//                 aria-haspopup="true"
//                 aria-expanded={open ? "true" : undefined}
//                 onClick={(e) => handleClick(e)}
//                 className="table-edit-option"
//                 sx={{
//                   background: "transparent",
//                   color: "#555555",
//                   boxShadow: "none",
//                 }}
//               >
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   width="1em"
//                   height="1em"
//                   viewBox="0 0 16 16"
//                 >
//                   <path
//                     fill="currentColor"
//                     d="M9.5 13a1.5 1.5 0 1 1-3 0a1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0a1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0a1.5 1.5 0 0 1 3 0"
//                   />
//                 </svg>
//               </Button>
//               <Menu
//                 id="basic-menu"
//                 className="table-edit-menu"
//                 anchorEl={anchorEl}
//                 open={open}
//                 onClose={handleClose}
//                 MenuListProps={{
//                   "aria-labelledby": "basic-button",
//                 }}
//               >
//                 <MenuItem>
//                   <Stack
//                     display="flex"
//                     gap={1.2}
//                     alignItems="center"
//                     direction="row"
//                   >
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       width="1em"
//                       height="1em"
//                       viewBox="0 0 24 24"
//                     >
//                       <path
//                         fill="currentColor"
//                         d="M3 21v-4.25L16.2 3.575q.3-.275.663-.425t.762-.15t.775.15t.65.45L20.425 5q.3.275.438.65T21 6.4q0 .4-.137.763t-.438.662L7.25 21zM17.6 7.8L19 6.4L17.6 5l-1.4 1.4z"
//                       />
//                     </svg>

//                     <Typography variant="subtitle2">Edit</Typography>
//                   </Stack>
//                 </MenuItem>
//               </Menu>
//             </TableCell>
//           </TableRow>
//         ))
//       ) : (
//         <TableRow
//           key={"nodata"}
//           sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
//         >
//           No Data Found
//         </TableRow>
//       )}
//     </TableBody>
//   </Table>
// </TableContainer>
