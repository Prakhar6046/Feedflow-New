"use client";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
} from "@mui/material";
import BasicTable from "./_components/BasicTable";
import BasicBreadcrumbs from "./_components/Breadcrumbs";
import Header from "./_components/Header";

// async function getPosts() {
//   const posts = await prisma.post.findMany({
//     where: { published: true },
//     include: {
//       author: {
//         select: { name: true },
//       },
//     },
//   });
//   return posts;
// }

export default function Home() {
  return (
    <>
      {/* <Sidebar /> */}
      {/* {posts?.map((post) => {
        return (
          <div key={post.id}>
            {post.title}
            <DeletePostButton postId={post.id} />
          </div>
        );
      })} */}
      <Stack display={"flex"} direction={"row"} height={"100vh"}>
        <Box
          position={"relative"}
          paddingBlock={4}
          paddingInline={3}
          height={"100%"}
          sx={{
            width: 128,
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
            }}
          >
            <img src="/static/img/logo.svg" alt="Logo" width={78} height={63} />
          </Box>
          <List
            sx={{
              marginTop: 5,
            }}
          >
            <ListItem>
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
                  }}
                >
                  <img src="/static/img/icons/ic-cube-box.svg" alt="Box Icon" />
                </ListItemIcon>
                <ListItemText>Lorem</ListItemText>
              </ListItemButton>
            </ListItem>
            <ListItem>
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
                  }}
                >
                  <img src="/static/img/icons/ic-cube-box.svg" alt="Box Icon" />
                </ListItemIcon>
                <ListItemText>Lorem</ListItemText>
              </ListItemButton>
            </ListItem>
            <ListItem>
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
                  }}
                >
                  <img
                    src="/static/img/icons/ic-multiple-cubes.svg"
                    alt="Box Icon"
                  />
                </ListItemIcon>
                <ListItemText
                  sx={{
                    borderBottom: "2px solid #06A19B",
                  }}
                >
                  Batches
                </ListItemText>
              </ListItemButton>
            </ListItem>
            <ListItem>
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
                  }}
                >
                  <img src="/static/img/icons/ic-cube-box.svg" alt="Box Icon" />
                </ListItemIcon>
                <ListItemText>Lorem</ListItemText>
              </ListItemButton>
            </ListItem>
            <ListItem>
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
                  }}
                >
                  <img src="/static/img/icons/ic-cube-box.svg" alt="Box Icon" />
                </ListItemIcon>
                <ListItemText>Lorem</ListItemText>
              </ListItemButton>
            </ListItem>
          </List>
          <Box position={"absolute"} top={90} right={-15}>
            <img
              src="/static/img/icons/ic-expand-sidebar.svg"
              alt="Sidebar Expand Icon"
            />
          </Box>
        </Box>

        <Box width={"100%"} paddingTop={4} paddingInline={5}>
          <Header />
          <BasicBreadcrumbs />
          <BasicTable />
        </Box>
      </Stack>
    </>
  );
}
