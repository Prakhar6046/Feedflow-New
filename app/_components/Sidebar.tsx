"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { Stack, Typography } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
function Sidebar() {
  const router = useRouter();
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
          <img src="/static/img/logo.svg" alt="Logo" width={50} height={40} />
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
                  sx={{
                    mt: 0.5,
                  }}
                >
                  Dashboard
                </ListItemText>
              </ListItemButton>
            </ListItem>
          </Link>

          <Link href={"/dashboard/organisation"} className="nav-links">
            <ListItem
              sx={{
                paddingX: 0,
                mb: 1,
              }}
            >
              <ListItemButton
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
                  // sx={{
                  //   borderBottom: "2px solid #06A19B",
                  //   paddingBottom: 0.5,
                  // }}
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
                  sx={{
                    mt: 0.5,
                  }}
                >
                  Users
                </ListItemText>
              </ListItemButton>
            </ListItem>
          </Link>

          {/* <ListItem
      sx={{
        paddingX: 0,
      }}
    >
      <ListItemButton
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
            marginRight: 0
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1.5em"
            height="1.5em"
            viewBox="0 0 24 24"
          >
            <g
              fill="none"
              stroke="#0E848E"
              stroke-linecap="round"
              stroke-linejoin="round"
              strokeWidth="2"
            >
              <path d="m20.35 8.923l-.366-.204l-.113-.064a2 2 0 0 1-.67-.66c-.018-.027-.034-.056-.066-.112a2 2 0 0 1-.3-1.157l.006-.425c.012-.68.018-1.022-.078-1.328a2 2 0 0 0-.417-.736c-.214-.24-.511-.412-1.106-.754l-.494-.285c-.592-.341-.889-.512-1.204-.577a2 2 0 0 0-.843.007c-.313.07-.606.246-1.191.596l-.003.002l-.354.211c-.056.034-.085.05-.113.066c-.278.155-.588.24-.907.25c-.032.002-.065.002-.13.002l-.13-.001a2 2 0 0 1-.91-.252c-.028-.015-.055-.032-.111-.066l-.357-.214c-.589-.354-.884-.53-1.199-.601a2 2 0 0 0-.846-.006c-.316.066-.612.238-1.205.582l-.003.001l-.488.283l-.005.004c-.588.34-.883.512-1.095.751a2 2 0 0 0-.415.734c-.095.307-.09.649-.078 1.333l.007.424c0 .065.003.097.002.128a2 2 0 0 1-.301 1.027c-.033.056-.048.084-.065.11a2 2 0 0 1-.675.664l-.112.063l-.361.2c-.602.333-.903.5-1.121.738a2 2 0 0 0-.43.73c-.1.307-.1.65-.099 1.338l.002.563c.001.683.003 1.024.104 1.329a2 2 0 0 0 .427.726c.218.236.516.402 1.113.734l.358.199c.061.034.092.05.121.068a2 2 0 0 1 .74.781l.067.12a2 2 0 0 1 .23 1.038l-.007.407c-.012.686-.017 1.03.079 1.337c.085.272.227.523.417.736c.214.24.512.411 1.106.754l.494.285c.593.341.889.512 1.204.577a2 2 0 0 0 .843-.007c.314-.07.607-.246 1.194-.598l.354-.212l.113-.066c.278-.154.588-.24.907-.25l.13-.001h.13c.318.01.63.097.91.252l.092.055l.376.226c.59.354.884.53 1.199.6a2 2 0 0 0 .846.008c.315-.066.613-.239 1.206-.583l.495-.287c.588-.342.883-.513 1.095-.752c.19-.213.33-.463.415-.734c.095-.305.09-.644.078-1.318l-.008-.44v-.127a2 2 0 0 1 .3-1.028l.065-.11a2 2 0 0 1 .675-.664l.11-.061l.002-.001l.361-.2c.602-.334.903-.5 1.122-.738c.194-.21.34-.46.429-.73c.1-.305.1-.647.098-1.327l-.002-.574c-.001-.683-.002-1.025-.103-1.33a2 2 0 0 0-.428-.725c-.217-.236-.515-.402-1.111-.733z" />
              <path d="M8 12a4 4 0 1 0 8 0a4 4 0 0 0-8 0" />
            </g>
          </svg>
        </ListItemIcon>
        <ListItemText>Settings</ListItemText>
      </ListItemButton>
    </ListItem>

    <ListItem
      sx={{
        paddingX: 0,
      }}
    >
      <ListItemButton
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
            marginRight: 0
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1.7em"
            height="1.7em"
            viewBox="0 0 256 256"
          >
            <path
              fill="#0E848E"
              d="m223.68 66.15l-88-48.15a15.88 15.88 0 0 0-15.36 0l-88 48.17a16 16 0 0 0-8.32 14v95.64a16 16 0 0 0 8.32 14l88 48.17a15.88 15.88 0 0 0 15.36 0l88-48.17a16 16 0 0 0 8.32-14V80.18a16 16 0 0 0-8.32-14.03M128 32l80.34 44L128 120L47.66 76ZM40 90l80 43.78v85.79l-80-43.75Zm96 129.57v-85.75L216 90v85.78Z"
            />
          </svg>
        </ListItemIcon>
        <ListItemText>lorem</ListItemText>
      </ListItemButton>
    </ListItem>

    <ListItem
      sx={{
        paddingX: 0,
      }}
    >
      <ListItemButton
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
            marginRight: 0
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1.7em"
            height="1.7em"
            viewBox="0 0 256 256"
          >
            <path
              fill="#0E848E"
              d="m223.68 66.15l-88-48.15a15.88 15.88 0 0 0-15.36 0l-88 48.17a16 16 0 0 0-8.32 14v95.64a16 16 0 0 0 8.32 14l88 48.17a15.88 15.88 0 0 0 15.36 0l88-48.17a16 16 0 0 0 8.32-14V80.18a16 16 0 0 0-8.32-14.03M128 32l80.34 44L128 120L47.66 76ZM40 90l80 43.78v85.79l-80-43.75Zm96 129.57v-85.75L216 90v85.78Z"
            />
          </svg>
        </ListItemIcon>
        <ListItemText>lorem</ListItemText>
      </ListItemButton>
    </ListItem>

    <ListItem
      sx={{
        paddingX: 0,
      }}
    >
      <ListItemButton
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
            marginRight: 0
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1.7em"
            height="1.7em"
            viewBox="0 0 256 256"
          >
            <path
              fill="#0E848E"
              d="m223.68 66.15l-88-48.15a15.88 15.88 0 0 0-15.36 0l-88 48.17a16 16 0 0 0-8.32 14v95.64a16 16 0 0 0 8.32 14l88 48.17a15.88 15.88 0 0 0 15.36 0l88-48.17a16 16 0 0 0 8.32-14V80.18a16 16 0 0 0-8.32-14.03M128 32l80.34 44L128 120L47.66 76ZM40 90l80 43.78v85.79l-80-43.75Zm96 129.57v-85.75L216 90v85.78Z"
            />
          </svg>
        </ListItemIcon>
        <ListItemText>lorem</ListItemText>
      </ListItemButton>
    </ListItem> */}
        </List>
        <Box
          position={"absolute"}
          top={35}
          right={-7}
          sx={{
            cursor: "pointer",
          }}
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

    // <Stack
    //   className="sidebar"
    //   sx={{
    //     position: "fixed",
    //     top: "0",
    //     left: "0",
    //     height: "100vh !important",
    //   }}
    // >
    //   <Box
    //     position={"relative"}
    //     paddingBlock={3}
    //     paddingInline={2.5}
    //     height={"100%"}
    //     sx={{
    //       width: 280,
    //       background:
    //         "linear-gradient(349.33deg, rgba(6, 161, 155, 0.4) -27.15%, rgba(2, 59, 57, 0) 103.57%)",
    //     }}
    //     role="presentation"
    //   >
    //     <Box
    //       sx={{
    //         display: "flex",
    //         justifyContent: "flex-start",
    //         alignItems: "center",
    //       }}
    //       className="cursor-pointer"
    //       onClick={() => router.push("/dashboard")}
    //     >
    //       <img src="/static/img/logo.svg" alt="Logo" width={50} height={40} />
    //     </Box>

    //     <Box display={"flex"} alignItems={"center"} gap={1.5} paddingInline={1.4} paddingBlock={1} my={3} bgcolor={"rgba(145, 158, 171, 0.12)"} borderRadius={3}>
    //       <Box
    //         display={"flex"}
    //         justifyContent={"center"}
    //         alignItems={"center"}
    //         bgcolor={"rgba(145, 158, 171, 0.24)"}
    //         sx={{
    //           width: 40,
    //           height: 40,
    //           borderRadius: "8px",
    //         }}
    //       >
    //         <svg
    //           xmlns="http://www.w3.org/2000/svg"
    //           width="1.5em"
    //           height="1.5em"
    //           viewBox="0 0 24 24"
    //         >
    //           <g fill="none">
    //             <path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z" />
    //             <path
    //               fill="#637381"
    //               d="M16 14a5 5 0 0 1 4.995 4.783L21 19v1a2 2 0 0 1-1.85 1.995L19 22H5a2 2 0 0 1-1.995-1.85L3 20v-1a5 5 0 0 1 4.783-4.995L8 14zM12 2a5 5 0 1 1 0 10a5 5 0 0 1 0-10"
    //             />
    //           </g>
    //         </svg>
    //       </Box>

    //       <Box>
    //         <Typography variant="subtitle2" fontWeight={600}>
    //           Lorem Ipsum
    //         </Typography>
    //         <Typography variant="body2" fontSize={12} fontWeight={400} sx={{
    //             whiteSpace: "nowrap",
    //             width: "165px",
    //             overflow: "hidden",
    //             textOverflow: "ellipsis"
    //         }}>
    //           lorem.ipsum123@gmail.com
    //         </Typography>
    //       </Box>
    //     </Box>

    //     <List>

    //       <Typography variant="body1" fontSize={12} fontWeight={600} pl={2} textTransform={"uppercase"} letterSpacing={0.5} mb={1}>My Feedflow</Typography>

    //       <Link href={"/dashboard"} className="nav-links">
    //         <ListItem
    //           sx={{
    //             paddingX: 0,
    //           }}
    //         >
    //           <ListItemButton
    //             sx={{
    //               display: "flex",
    //               flexDirection: "row",
    //               justifyContent: "center",
    //               alignItems: "center",
    //               gap: 1.7
    //             }}
    //           >
    //             <ListItemIcon
    //               sx={{
    //                 display: "grid",
    //                 placeItems: "center",
    //                 marginRight: 0,
    //                 minWidth: "fit-content",
    //               }}
    //             >
    //               <svg
    //                 xmlns="http://www.w3.org/2000/svg"
    //                 width="1.1em"
    //                 height="1.1em"
    //                 viewBox="0 0 24 24"
    //               >
    //                 <g
    //                   fill="none"
    //                   stroke="#0E848E"
    //                   stroke-linecap="round"
    //                   stroke-linejoin="round"
    //                   strokeWidth="2"
    //                 >
    //                   <path d="M21 12c.552 0 1.005-.449.95-.998a10 10 0 0 0-8.953-8.951c-.55-.055-.998.398-.998.95v8a1 1 0 0 0 1 1z" />
    //                   <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
    //                 </g>
    //               </svg>
    //             </ListItemIcon>
    //             <ListItemText>
    //               Dashboard
    //             </ListItemText>
    //           </ListItemButton>
    //         </ListItem>
    //       </Link>

    //       <Typography variant="body1" fontSize={12} fontWeight={600} pl={2} mt={3
    //       } textTransform={"uppercase"} letterSpacing={0.5} mb={1}>Management</Typography>

    //       <Link href={"/dashboard/organisation"} className="nav-links">
    //         <ListItem
    //           sx={{
    //             paddingX: 0,
    //             mb: 0.5
    //           }}
    //         >
    //           <ListItemButton
    //             sx={{
    //               display: "flex",
    //               flexDirection: "row",
    //               justifyContent: "center",
    //               alignItems: "center",
    //               gap: 1.7
    //             }}
    //           >
    //             <ListItemIcon
    //               sx={{
    //                 display: "grid",
    //                 placeItems: "center",
    //                 marginRight: 0,
    //                 minWidth: "fit-content"
    //               }}
    //             >
    //               <svg
    //                 xmlns="http://www.w3.org/2000/svg"
    //                 width="1.3em"
    //                 height="1.3em"
    //                 viewBox="0 0 16 16"
    //               >
    //                 <path
    //                   fill="#0E848E"
    //                   d="M8 1a2.5 2.5 0 0 0-.5 4.95V7H5.367C4.612 7 4 7.612 4 8.367v1.683a2.5 2.5 0 1 0 1 0V8.367C5 8.164 5.164 8 5.367 8h5.267c.202 0 .366.164.366.367v1.683a2.5 2.5 0 1 0 1 0V8.367C12 7.612 11.388 7 10.634 7H8.499V5.95A2.5 2.5 0 0 0 8 1M6.5 3.5a1.5 1.5 0 1 1 3 0a1.5 1.5 0 0 1-3 0m-3.5 9a1.5 1.5 0 1 1 3 0a1.5 1.5 0 0 1-3 0m8.5-1.5a1.5 1.5 0 1 1 0 3a1.5 1.5 0 0 1 0-3"
    //                 />
    //               </svg>
    //             </ListItemIcon>
    //             <ListItemText
    //               // sx={{
    //               //   borderBottom: "2px solid #06A19B",
    //               //   paddingBottom: 0.5,
    //               // }}
    //               sx={{
    //                 mt: 0.5,
    //               }}
    //             >
    //               Organisations
    //             </ListItemText>
    //           </ListItemButton>
    //         </ListItem>
    //       </Link>

    //       <Link href={"/dashboard/user"} className="nav-links">
    //         <ListItem
    //           sx={{
    //             paddingX: 0,
    //           }}
    //         >
    //           <ListItemButton
    //             sx={{
    //               display: "flex",
    //               flexDirection: "row",
    //               justifyContent: "center",
    //               alignItems: "center",
    //               gap: 1.7
    //             }}
    //           >
    //             <ListItemIcon
    //               sx={{
    //                 display: "grid",
    //                 placeItems: "center",
    //                 marginRight: 0,
    //                 minWidth: "fit-content"
    //               }}
    //             >
    //               <svg
    //                 xmlns="http://www.w3.org/2000/svg"
    //                 width="1.2em"
    //                 height="1.2em"
    //                 viewBox="0 0 256 256"
    //               >
    //                 <path
    //                   fill="#0E848E"
    //                   d="M117.25 157.92a60 60 0 1 0-66.5 0a95.83 95.83 0 0 0-47.22 37.71a8 8 0 1 0 13.4 8.74a80 80 0 0 1 134.14 0a8 8 0 0 0 13.4-8.74a95.83 95.83 0 0 0-47.22-37.71M40 108a44 44 0 1 1 44 44a44.05 44.05 0 0 1-44-44m210.14 98.7a8 8 0 0 1-11.07-2.33A79.83 79.83 0 0 0 172 168a8 8 0 0 1 0-16a44 44 0 1 0-16.34-84.87a8 8 0 1 1-5.94-14.85a60 60 0 0 1 55.53 105.64a95.83 95.83 0 0 1 47.22 37.71a8 8 0 0 1-2.33 11.07"
    //                 />
    //               </svg>
    //             </ListItemIcon>
    //             <ListItemText
    //               sx={{
    //                 mt: 0.5,
    //               }}
    //             >
    //               Users
    //             </ListItemText>
    //           </ListItemButton>
    //         </ListItem>
    //       </Link>

    //     </List>
    //     <Box
    //       position={"absolute"}
    //       top={35}
    //       right={-7}
    //       sx={{
    //         cursor: "pointer",
    //       }}
    //     >
    //       <Image
    //         src={"/static/img/icons/ic-expand-sidebar.svg"}
    //         width={17}
    //         height={17}
    //         alt="Sidebar Expand Icon"
    //       />
    //     </Box>
    //   </Box>
    // </Stack>
  );
}
export default Sidebar;
