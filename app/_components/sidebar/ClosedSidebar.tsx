'use client';
import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { Divider, Stack } from '@mui/material';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAppDispatch } from '@/lib/hooks';
import { sidebarAction } from '@/lib/features/sidebar/sidebarSlice';
import Logo from '@/public/static/img/logo.svg';
import { getCookie, setCookie } from 'cookies-next';
import { LoggedUser } from '../AccountPopover';

function ClosedSidebar() {
  const router = useRouter();
  const loggedUser = getCookie('logged-user');
  const pathName = usePathname();
  const [activePage, setActivePage] = useState<string>('');
  const [loggedUserData, setLoggedUserData] = useState<LoggedUser>();

  const dispatch = useAppDispatch();
  useEffect(() => {
    if (pathName) {
      setActivePage(pathName);
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
        position: 'fixed',
        top: '0',
        left: '0',
        height: '100% !important',
        overflowY: 'auto',
        overflowX: 'hidden',
        background:
          'linear-gradient(349.33deg, rgba(6, 161, 155, 0.4) -27.15%, rgba(2, 59, 57, 0) 103.57%)',
      }}
    >
      <Box
        position={'relative'}
        paddingTop={3}
        paddingInline={1}
        sx={{
          width: 96,
          height: {
            xl: '100%',
          },

          transition: 'width 1s !important',
        }}
        className="sidebar-scroller"
        role="presentation"
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            mb: 2,
          }}
          className="cursor-pointer"
          onClick={() => router.push('/dashboard')}
        >
          <Image src={Logo} alt="Logo" width={50} height={40} />
        </Box>
        <List>
          <Link href={'/dashboard'} className="nav-links">
            <ListItem
              sx={{
                paddingX: 0,
                mb: 1,
              }}
            >
              <ListItemButton
                className={activePage === '/dashboard' ? 'active' : ''}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <ListItemIcon
                  sx={{
                    display: 'grid',
                    placeItems: 'center',
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
              marginInline: 'auto',
              borderWidth: 1,
              borderRadius: 50,
              borderColor: 'rgba(6, 161, 155, 0.25)',
            }}
          />

          <Link href={'/dashboard/fishSupply'} className="nav-links">
            <ListItem
              sx={{
                paddingX: 0,
                mb: 1,
              }}
            >
              <ListItemButton
                className={
                  activePage.startsWith('/dashboard/fishSupply') ? 'active' : ''
                }
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <ListItemIcon
                  sx={{
                    display: 'grid',
                    placeItems: 'center',
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
                    textAlign: 'center',
                  }}
                >
                  Fish Supply
                </ListItemText>
              </ListItemButton>
            </ListItem>
          </Link>

          <Link
            href={'/dashboard/farm'}
            className="nav-links"
            onClick={() => setCookie('isEditFarm', false)}
          >
            <ListItem
              sx={{
                paddingX: 0,
                mb: 1,
              }}
            >
              <ListItemButton
                className={
                  activePage.startsWith('/dashboard/farm') ? 'active' : ''
                }
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <ListItemIcon
                  sx={{
                    display: 'grid',
                    placeItems: 'center',
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

          <Link href={'/dashboard/feedSupply'} className="nav-links">
            <ListItem
              sx={{
                paddingX: 0,
                mb: 1,
              }}
            >
              <ListItemButton
                className={
                  activePage.startsWith('/dashboard/feedSupply') ? 'active' : ''
                }
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <ListItemIcon
                  sx={{
                    display: 'grid',
                    placeItems: 'center',
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
                    textAlign: 'center',
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
              marginInline: 'auto',
              borderWidth: 1,
              borderRadius: 50,
              borderColor: 'rgba(6, 161, 155, 0.25)',
            }}
          />

          <Link href={'/dashboard/production'} className="nav-links">
            <ListItem
              sx={{
                paddingX: 0,
                mb: 1,
              }}
            >
              <ListItemButton
                className={
                  activePage.startsWith('/dashboard/production') ? 'active' : ''
                }
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <ListItemIcon
                  sx={{
                    display: 'grid',
                    placeItems: 'center',
                    marginRight: 0,
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 20 20"
                    fill="#0E848E"
                  >
                    <path
                      d="M11.7039 12.542L11.9039 12.4277C12.3396 12.18 12.7348 11.9562 13.0967 11.7372C12.9705 11.1753 12.9943 10.392 13.5277 9.40624C13.5896 9.28957 13.711 9.22052 13.8419 9.22052C13.8491 9.22052 13.8562 9.22052 13.8634 9.22052C14.0015 9.22767 14.1229 9.31576 14.1753 9.44433C14.2919 9.73719 14.5181 10.1729 14.7824 10.5039C15.5396 9.74671 15.9205 8.83481 15.9372 7.32767C15.2943 7.33719 14.0443 7.15148 13.1277 5.77529C13.0515 5.661 13.0491 5.51338 13.1181 5.39433C13.1872 5.27529 13.3181 5.20862 13.4562 5.22052C13.8681 5.25862 15.0515 5.25148 15.5681 4.78957C15.9967 4.40862 15.98 3.43957 15.9372 3.09909C15.9181 2.94909 15.9943 2.80386 16.13 2.73481C16.1824 2.70862 16.2372 2.69671 16.2919 2.69671C16.3824 2.69671 16.4705 2.73005 16.5372 2.79433C16.5896 2.84433 17.8181 4.03719 17.5515 6.38005C18.0586 7.12052 20.4991 11.0539 18.4396 15.2491C18.7491 15.3967 19.1634 15.5348 19.5919 15.6181C19.7205 15.642 19.8229 15.7348 19.8634 15.8586C19.9039 15.9824 19.8729 16.1181 19.7848 16.211C18.9515 17.1062 17.8848 17.1848 17.2062 17.1205C16.8753 17.5158 16.4943 17.9086 16.061 18.2967C16.061 18.2967 16.061 18.2967 16.0586 18.2991C16.0539 18.3039 16.0515 18.3062 16.0467 18.311C12.4467 21.5348 9.08481 18.761 9.05147 18.7324C8.98719 18.6777 8.94433 18.6015 8.93004 18.5181C8.9229 18.4777 8.311 14.4658 11.7086 12.5372L11.7039 12.542ZM9.61338 18.2729C10.1539 18.6753 12.6324 20.2634 15.4134 17.9134C14.6419 14.3062 12.4872 13.4086 11.9348 13.2372C9.39671 14.7705 9.54433 17.6158 9.61576 18.2729H9.61338ZM16.4205 16.9324C16.3086 16.842 16.2562 16.6896 16.3039 16.5443C16.3658 16.3562 16.5658 16.2539 16.7539 16.3158C16.7658 16.3205 17.8134 16.6491 18.7372 16.1372C18.0515 15.9205 17.2134 15.511 17.2134 14.8229C17.2134 14.6253 17.3729 14.4658 17.5705 14.4658C17.73 14.4658 17.8634 14.5705 17.9086 14.7158C19.7919 10.5991 17.0396 6.88243 16.8943 6.68957C16.8372 6.61338 16.811 6.51814 16.8253 6.42528C16.9562 5.4729 16.8062 4.74433 16.6062 4.23243C16.5277 4.63005 16.3658 5.04195 16.0443 5.32529C15.5491 5.76576 14.78 5.90386 14.1943 5.93957C15.1181 6.79433 16.1681 6.59909 16.2181 6.58957C16.3205 6.56814 16.43 6.59433 16.5134 6.65862C16.5967 6.72529 16.6467 6.8229 16.6491 6.93005C16.6991 8.88481 16.2467 10.0396 15.3539 10.9539C15.4277 10.9729 15.5015 10.9729 15.5729 10.9491C15.761 10.8872 15.961 10.9896 16.0253 11.1753C16.0872 11.3634 15.9848 11.5634 15.7991 11.6277C14.9372 11.9134 14.2562 11.092 13.8681 10.43C13.5134 11.5848 14.0705 12.2039 14.1015 12.2372C14.2372 12.3777 14.2348 12.6015 14.0943 12.7396C13.9539 12.8777 13.7277 12.8753 13.5896 12.7348C13.5753 12.7205 13.4729 12.611 13.3586 12.4158C13.1539 12.5372 12.9396 12.661 12.7158 12.7896C13.6753 13.2634 15.28 14.4658 16.0158 17.3586C16.1586 17.2181 16.2919 17.0753 16.4205 16.9348V16.9324Z"
                      fill="#0E848E"
                    />
                    <path
                      d="M13.2568 16.303C13.8283 16.303 14.2949 16.772 14.2949 17.3458C14.2949 17.9196 13.8307 18.3887 13.2568 18.3887C12.683 18.3887 12.2188 17.9196 12.2188 17.3458C12.2188 16.772 12.683 16.303 13.2568 16.303ZM13.2568 17.6768C13.4354 17.6768 13.5807 17.5291 13.5807 17.3482C13.5807 17.1672 13.4354 17.0196 13.2568 17.0196C13.0783 17.0196 12.933 17.1672 12.933 17.3482C12.933 17.5291 13.0783 17.6768 13.2568 17.6768Z"
                      fill="#0E848E"
                    />
                    <path
                      d="M6.74317 3.69727C6.17174 3.69727 5.70508 3.22822 5.70508 2.65441C5.70508 2.0806 6.16936 1.61155 6.74317 1.61155C7.31698 1.61155 7.78127 2.0806 7.78127 2.65441C7.78127 3.22822 7.31698 3.69727 6.74317 3.69727ZM6.74317 2.32346C6.5646 2.32346 6.41936 2.47108 6.41936 2.65203C6.41936 2.83298 6.5646 2.9806 6.74317 2.9806C6.92174 2.9806 7.06698 2.83298 7.06698 2.65203C7.06698 2.47108 6.92174 2.32346 6.74317 2.32346Z"
                      fill="#0E848E
                      "
                    />
                    <path
                      d="M2.43625 2.85645C2.56483 2.85645 2.68387 2.86359 2.79578 2.8755C3.12911 2.48026 3.50768 2.0874 3.94102 1.69693C3.94578 1.69216 3.95054 1.6874 3.9553 1.68502C5.27673 0.501688 6.56483 0.127878 7.66959 0.127878C9.57435 0.127878 10.9315 1.24454 10.9529 1.26359C11.0172 1.31835 11.0601 1.39454 11.0744 1.47788C11.0815 1.51835 11.6934 5.53026 8.29578 7.45883L8.09578 7.57312C7.66006 7.82074 7.26483 8.04455 6.90292 8.26121C7.02911 8.82312 7.0053 9.60645 6.47197 10.5922C6.4053 10.7136 6.27435 10.7874 6.13626 10.7779C5.99816 10.7707 5.87673 10.6826 5.82435 10.5541C5.70768 10.2612 5.48149 9.8255 5.21721 9.49455C4.46006 10.2517 4.07911 11.1636 4.06245 12.6707C4.71721 12.6588 5.9553 12.8469 6.87197 14.2231C6.94816 14.3374 6.95054 14.485 6.88149 14.6041C6.81007 14.7231 6.67911 14.7898 6.5434 14.7779C6.13149 14.7398 4.95054 14.7445 4.43149 15.2088C4.00292 15.5898 4.01959 16.5588 4.06245 16.8993C4.08149 17.0493 4.0053 17.1945 3.86959 17.2636C3.73387 17.3326 3.57197 17.3088 3.46245 17.2041C3.41006 17.1541 2.18149 15.9612 2.45054 13.6184C1.9434 12.8779 -0.499459 8.94454 1.56245 4.74931C1.25292 4.60169 0.838636 4.46359 0.410064 4.38026C0.281493 4.35645 0.179112 4.26359 0.138636 4.13978C0.0981595 4.01597 0.129112 3.88026 0.217207 3.78502C0.912445 3.03502 1.77435 2.85645 2.43625 2.85645ZM2.78626 5.1755C2.78626 5.37312 2.62673 5.53264 2.42911 5.53264C2.26959 5.53264 2.13626 5.42788 2.09102 5.28264C0.207684 9.39931 2.96006 13.116 3.1053 13.3088C3.16245 13.385 3.18864 13.4803 3.17435 13.5731C3.0434 14.5255 3.1934 15.2541 3.3934 15.766C3.47197 15.3684 3.63626 14.9564 3.9553 14.6731C4.45054 14.2326 5.21959 14.0945 5.8053 14.0588C4.88149 13.2041 3.83149 13.3993 3.78149 13.4088C3.67911 13.4303 3.56959 13.4041 3.48625 13.3398C3.40292 13.2731 3.35292 13.1755 3.35054 13.0684C3.30054 11.1136 3.75292 9.95883 4.64578 9.04455C4.57197 9.0255 4.49816 9.0255 4.42673 9.04931C4.23864 9.11121 4.03864 9.00883 3.97435 8.82312C3.91006 8.6374 4.01483 8.43502 4.20054 8.37074C5.06245 8.08502 5.7434 8.90645 6.13149 9.56835C6.48626 8.41359 5.93149 7.79454 5.89816 7.76121C5.76245 7.62074 5.76483 7.39693 5.9053 7.25883C5.97435 7.18978 6.06483 7.15645 6.1553 7.15645C6.24578 7.15645 6.34102 7.19216 6.41006 7.26359C6.42435 7.27788 6.52673 7.3874 6.64102 7.58264C6.84578 7.46121 7.06006 7.3374 7.28387 7.20883C6.32435 6.73502 4.71959 5.53264 3.98387 2.63978C3.84102 2.78026 3.70768 2.92312 3.57911 3.06359C3.69102 3.15407 3.74102 3.30645 3.69578 3.45169C3.63626 3.63978 3.43387 3.74216 3.24578 3.68264C3.1934 3.66597 2.16959 3.34931 1.26006 3.86121C1.94578 4.07788 2.78626 4.4874 2.78626 5.17788V5.1755ZM10.3863 1.7255C9.84578 1.32312 7.36721 -0.264977 4.58864 2.08502C5.36006 5.69216 7.51483 6.58978 8.06721 6.76121C10.6053 5.22788 10.4577 2.38264 10.3863 1.7255Z"
                      fill="#0E848E"
                    />
                  </svg>
                </ListItemIcon>
                <ListItemText
                  className="closed-nav-links"
                  sx={{
                    mt: 0.5,
                    textAlign: 'center',
                  }}
                >
                  Production
                </ListItemText>
              </ListItemButton>
            </ListItem>
          </Link>

          {/* <Link
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
          </Link> */}

          <Link href={'/dashboard/feedPrediction'} className="nav-links">
            <ListItem
              sx={{
                paddingX: 0,
                mb: 1,
              }}
            >
              <ListItemButton
                className={
                  activePage.startsWith('/dashboard/feedPrediction')
                    ? 'active'
                    : ''
                }
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <ListItemIcon
                  sx={{
                    display: 'grid',
                    placeItems: 'center',
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
                    textAlign: 'center',
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
              marginInline: 'auto',
              borderWidth: 1,
              borderRadius: 50,
              borderColor: 'rgba(6, 161, 155, 0.25)',
            }}
          />

          <Link href={'/dashboard/organisation'} className="nav-links">
            <ListItem
              sx={{
                paddingX: 0,
                mb: 1,
              }}
            >
              <ListItemButton
                className={
                  activePage.startsWith('/dashboard/organisation')
                    ? 'active'
                    : ''
                }
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <ListItemIcon
                  sx={{
                    display: 'grid',
                    placeItems: 'center',
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

          <Link href={'/dashboard/user'} className="nav-links">
            <ListItem
              sx={{
                paddingX: 0,
              }}
            >
              <ListItemButton
                className={
                  activePage.startsWith('/dashboard/user') ? 'active' : ''
                }
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <ListItemIcon
                  sx={{
                    display: 'grid',
                    placeItems: 'center',
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
          {loggedUserData?.role === 'SUPERADMIN' && (
            <Link href={'/dashboard/growthModel'} className="nav-links">
              <ListItem
                sx={{
                  paddingX: 0,
                  mb: 1,
                }}
              >
                <ListItemButton
                  className={
                    activePage.startsWith('/dashboard/growthModel')
                      ? 'active'
                      : ''
                  }
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <ListItemIcon
                    sx={{
                      display: 'grid',
                      placeItems: 'center',
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
                      textAlign: 'center',
                    }}
                  >
                    Growth Models
                  </ListItemText>
                </ListItemButton>
              </ListItem>
            </Link>
          )}
        </List>
        <Box
          position={'absolute'}
          top={35}
          right={0}
          className="sidebar-icon"
          sx={{
            cursor: 'pointer',
          }}
          onClick={() => dispatch(sidebarAction.handleSwitchSidebar(true))}
        >
          <Image
            src={'/static/img/icons/ic-expand-sidebar.svg'}
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
