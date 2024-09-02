"use client"
import * as React from "react";
import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import { Box, Button, Modal, Stack, TextField } from "@mui/material";
import closeIcon from "@/public/static/img/icons/ic-close.svg";
import Image from "next/image";


const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  // p: 4,
};

export default function BasicBreadcrumbs() {

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);


  return (
    <>
      {/* Breadcrumb Section Start */}
      <Stack sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: "row",
        gap: 5
      }}>
        <Box>
          {/* Main Heading */}
          <Typography variant="h2" marginBottom={"4px"} fontWeight={"bold"} sx={{
            fontSize: {
              md: '2.65rem'
            }
          }}>
            Organization
          </Typography>
          {/* Main Heading */}

          <Breadcrumbs aria-label="breadcrumb" separator="›">
            <Link underline="hover" fontWeight={500} color="#555555" href="/">
              Dashboard
            </Link>
            <Typography sx={{ color: "#555555" }} fontWeight={500}>Batches</Typography>
          </Breadcrumbs>
        </Box>

        <Button variant="contained" onClick={handleOpen} sx={{
          background: "#06A19B",
          fontWeight: "bold",
          padding: "9px 28px",
          width: "fit-content",
          textTransform: "capitalize",
          borderRadius: "12px"
        }}>
          +Add Organization
        </Button>

        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Stack sx={style} borderRadius="14px">
            <Box bgcolor="#F5F6F8" paddingInline={3} paddingBlock={2} display='flex' justifyContent="space-between" gap={2} alignItems={"center"} sx={{
              borderTopLeftRadius: "14px",
              borderTopRightRadius: "14px",
            }}>
              <Typography id="modal-modal-title" variant="h6" component="h2" color="#67737F" fontSize={18} fontWeight={600}>
                Invite by email
              </Typography>

              <Box display="flex" justifyContent="center" alignItems="center" sx={{
                opacity: 0.5
              }}>
                <Image src={closeIcon} width={25} height={25} alt="Close Icon" />
              </Box>
            </Box>
            <Stack id="modal-modal-description" sx={{ mt: 2 }}>

              <Box paddingInline={3} paddingTop={2} paddingBottom={7}>
                <TextField id="outlined-basic" label="Email" variant="outlined" sx={{
                  width: "100%"
                }} />

                <Button variant="contained" sx={{
                  background: "#06A19B",
                  fontWeight: "bold",
                  padding: "8px 24px",
                  width: "fit-content",
                  textTransform: "capitalize",
                  borderRadius: "12px",
                  marginLeft: "auto",
                  display: "block",
                  marginTop: 3,
                }}>
                  Invite
                </Button>
              </Box>

            </Stack>
          </Stack>
        </Modal>
      </Stack>
      {/* Breadcrumb Section End */}
    </>
  );
}
