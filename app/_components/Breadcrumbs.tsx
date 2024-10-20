"use client";

import { Box, Button, Stack, Tooltip } from "@mui/material";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Typography from "@mui/material/Typography";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { selectSort } from "@/lib/features/breadcrum/breadcrumSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { deleteCookie, getCookie, setCookie } from "cookies-next";
import { useDebounce } from "../hooks/useDebounce";
import SearchBar from "./SearchBar";
interface Props {
  heading: string;
  buttonName?: string;
  links?: { name: string; link: string }[];
  hideSearchInput?: boolean;
  isTable?: boolean;
  buttonRoute?: string;
  refetch?: string;
}

export default function BasicBreadcrumbs({
  heading,
  buttonName,
  links,
  hideSearchInput,
  isTable,
  buttonRoute,
  refetch,
}: Props) {
  const role = getCookie("role");
  const pathName = usePathname();
  const router = useRouter();
  const sortvalue = useAppSelector(selectSort);
  const loggedUser: any = getCookie("logged-user");
  const sortCookieData = getCookie(pathName);
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState("");
  const [currentRole, setCurrentRole] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isSort, setIsSort] = useState<Boolean>(false);
  const debouncedSearchQuery = useDebounce(searchQuery);
  const dispatch = useAppDispatch();

  // async function SeachedOrganisation(
  //   query: string,
  //   organisationId: number,
  //   role: string
  // ) {
  //   let res = await fetch(
  //     `/api/organisation/search?name=${query}&organisationId=${organisationId}&role=${role}`
  //   );
  //   let data = await res.json();
  //   return data;
  // }
  // async function SeachedUsers(
  //   query: string,
  //   organisationId: number,
  //   role: string
  // ) {
  //   let res = await fetch(
  //     `/api/users/search?name=${query}&organisationId=${organisationId}&role=${role}`
  //   );
  //   let data = await res.json();
  //   return data;
  // }
  // async function SeachedFarms(query: string) {
  //   let res = await fetch(`/api/farm/search?name=${query}`);
  //   let data = await res.json();
  //   return data;
  // }
  // const getSearchOrganisations = async (user: any) => {
  //   const res = await SeachedOrganisation(
  //     debouncedSearchQuery,
  //     user?.data?.user?.organisationId,
  //     user?.data?.user?.role
  //   );
  //   dispatch(organisationAction.updateOrganisations(res.data));
  // };
  // const getSearchUsers = async (user: any) => {
  //   const res = await SeachedUsers(
  //     debouncedSearchQuery,
  //     user?.data?.user?.organisationId,
  //     user?.data?.user?.role
  //   );
  //   dispatch(userAction.updateUsers(res.data));
  // };
  // const getSearchFarms = async (user: any) => {
  //   const res = await SeachedFarms(debouncedSearchQuery);
  //   dispatch(farmAction.updateFarms(res.data));
  // };
  const handleClear = () => {
    setSearchQuery("");
  };
  const handleClick = () => {
    setCookie("activeStep", 0);
    router.push(String(buttonRoute));
  };

  // const handleRefetch = async () => {
  //   const user = JSON.parse(loggedUser);
  //   setStatus("Updating..");
  //   if (refetch === "organisation") {
  //     getSearchOrganisations(user);
  //   } else if (refetch === "user") {
  //     getSearchUsers(user);
  //   } else if (refetch === "farm") {
  //     getSearchFarms(user);
  //   }
  //   setStatus("Last update less than a minutes ago");
  // };
  const handleRememberSort = () => {
    if (!isSort) {
      setCookie(pathName, JSON.stringify(sortvalue));
      // localStorage.setItem(pathName, JSON.stringify(sortvalue));
    } else {
      deleteCookie(pathName);
      // localStorage.removeItem(pathName);
    }
  };
  useEffect(() => {
    if (sortvalue && sortCookieData) {
      setIsSort(true);
    } else {
      setIsSort(false);
    }
  }, [sortvalue]);

  useEffect(() => {
    if (role) {
      setCurrentRole(role);
    }
  }, [role]);
  // useEffect(() => {
  //   const user = JSON.parse(loggedUser);
  //   if (searchOrganisations) {
  //     getSearchOrganisations(user);
  //   }
  //   if (searchUsers) {
  //     getSearchUsers(user);
  //   }
  //   if (searchFarm) {
  //     getSearchFarms(user);
  //   }
  // }, [debouncedSearchQuery, searchOrganisations, searchUsers, searchFarm]);

  return (
    <>
      {/* Breadcrumb Section Start */}
      <Stack
        marginTop={1}
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexDirection: "row",
          rowGap: 1,
          columnGap: 5,
          flexWrap: "wrap",
        }}
      >
        <Box>
          {/* Main Heading */}
          <Typography
            variant="h2"
            marginBottom={"4px"}
            fontWeight={600}
            sx={{
              fontSize: {
                md: "1.5rem",
                xs: "1.25rem",
              },
            }}
          >
            {heading}
          </Typography>
          {/* Main Heading */}

          {links && (
            <Breadcrumbs
              aria-label="breadcrumb"
              separator="•"
              className="breadcrumb-links"
              sx={{
                mt: 2,
              }}
            >
              {links.map((link, i) => {
                return (
                  <Link key={i} href={link.link} className="nav-links">
                    {link.name}
                  </Link>
                );
              })}
            </Breadcrumbs>
          )}
        </Box>

        {currentRole === "SUPERADMIN" && buttonName ? (
          <Button
            variant="contained"
            onClick={handleClick}
            sx={{
              background: "#06A19B",
              fontWeight: 600,
              padding: "8px 20px",
              width: "fit-content",
              textTransform: "capitalize",
              borderRadius: "8px",
              textWrap: "nowrap",
              display: "flex",
              gap: 1,
              alignItems: "center",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="1.5em"
              height="1.5em"
              viewBox="0 0 24 24"
            >
              <path
                fill="none"
                stroke="#fff"
                strokeLinecap="round"
                strokeWidth="2"
                d="M12 6v12m6-6H6"
              />
            </svg>
            {buttonName}
          </Button>
        ) : (
          buttonName &&
          buttonName !== "Add Organization" && (
            <Button
              variant="contained"
              onClick={handleClick}
              sx={{
                background: "#06A19B",
                fontWeight: 600,
                padding: "8px 20px",
                width: "fit-content",
                textTransform: "capitalize",
                borderRadius: "8px",
                textWrap: "nowrap",
                display: "flex",
                gap: 1,
                alignItems: "center",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1.5em"
                height="1.5em"
                viewBox="0 0 24 24"
              >
                <path
                  fill="none"
                  stroke="#fff"
                  strokeLinecap="round"
                  strokeWidth="2"
                  d="M12 6v12m6-6H6"
                />
              </svg>
              {buttonName}
            </Button>
          )
        )}

        {/* {heading !== "Batches" && heading === "Organization" ? (
          <AddOrganization open={open} setOpen={setOpen} />
        ) : (
          <AddUser
            open={open}
            setOpen={setOpen}
            organisations={organisations ?? []}
          />
        )} */}
      </Stack>
      {/* Breadcrumb Section End */}

      {/* Search Section Start */}
      {pathName !== "/dashboard" && (
        <Stack
          marginBlock={2}
          display="flex"
          gap={1}
          sx={{
            flexDirection: {
              md: "row",
              xs: "column",
            },
            justifyContent: {
              md: "space-between",
              xs: "flex-end",
            },
            alignItems: {
              md: "center",
              xs: "flex-start",
            },
            marginTop: {
              sm: 2,
              xs: 4,
            },
          }}
        >
          <Box
            display="flex"
            justifyContent="flex-start"
            alignItems="center"
            gap={2}
            sx={{
              width: {
                md: "fit-content",
                xs: "100%",
              },
            }}
          >
            {!hideSearchInput && <SearchBar />}

            {searchQuery && (
              <Box
                fontSize={14}
                fontWeight={500}
                display="flex"
                justifyContent="flex-start"
                alignItems="center"
                gap={0.5}
                bgcolor="#06A19B"
                paddingBlock={1.175}
                paddingInline={1.5}
                borderRadius={2}
                color="white"
                width="fit-content"
                onClick={handleClear}
                style={{ cursor: "pointer" }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="1.3em"
                  height="1.3em"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    fillRule="evenodd"
                    d="M10.31 2.25h3.38c.217 0 .406 0 .584.028a2.25 2.25 0 0 1 1.64 1.183c.084.16.143.339.212.544l.111.335l.03.085a1.25 1.25 0 0 0 1.233.825h3a.75.75 0 0 1 0 1.5h-17a.75.75 0 0 1 0-1.5h3.09a1.25 1.25 0 0 0 1.173-.91l.112-.335c.068-.205.127-.384.21-.544a2.25 2.25 0 0 1 1.641-1.183c.178-.028.367-.028.583-.028m-1.302 3a3 3 0 0 0 .175-.428l.1-.3c.091-.273.112-.328.133-.368a.75.75 0 0 1 .547-.395a3 3 0 0 1 .392-.009h3.29c.288 0 .348.002.392.01a.75.75 0 0 1 .547.394c.021.04.042.095.133.369l.1.3l.039.112q.059.164.136.315z"
                    clipRule="evenodd"
                  />
                  <path
                    fill="currentColor"
                    d="M5.915 8.45a.75.75 0 1 0-1.497.1l.464 6.952c.085 1.282.154 2.318.316 3.132c.169.845.455 1.551 1.047 2.104s1.315.793 2.17.904c.822.108 1.86.108 3.146.108h.879c1.285 0 2.324 0 3.146-.108c.854-.111 1.578-.35 2.17-.904c.591-.553.877-1.26 1.046-2.104c.162-.813.23-1.85.316-3.132l.464-6.952a.75.75 0 0 0-1.497-.1l-.46 6.9c-.09 1.347-.154 2.285-.294 2.99c-.137.685-.327 1.047-.6 1.303c-.274.256-.648.422-1.34.512c-.713.093-1.653.095-3.004.095h-.774c-1.35 0-2.29-.002-3.004-.095c-.692-.09-1.066-.256-1.34-.512c-.273-.256-.463-.618-.6-1.302c-.14-.706-.204-1.644-.294-2.992z"
                  />
                  <path
                    fill="currentColor"
                    d="M9.425 10.254a.75.75 0 0 1 .821.671l.5 5a.75.75 0 0 1-1.492.15l-.5-5a.75.75 0 0 1 .671-.821m5.15 0a.75.75 0 0 1 .671.82l-.5 5a.75.75 0 0 1-1.492-.149l.5-5a.75.75 0 0 1 .82-.671"
                  />
                </svg>
                Clear
              </Box>
            )}
          </Box>
          {isTable && (
            <Box
              display="flex"
              justifyContent="flex-end"
              flexDirection="column"
              gap={0.5}
              sx={{
                width: { md: "fit-content", xs: "100%" },
                textAlign: "end",
              }}
            >
              <Box
                display="flex"
                justifyContent="flex-end"
                alignItems="center"
                gap={2}
              >
                <Tooltip
                  title="This will refetch the data in this table without clearing your filters or sorting."
                  placement="top"
                >
                  <Box
                    padding={1}
                    borderRadius={1.8}
                    width="fit-content"
                    boxShadow="0px 0px 10px 0px #0000001A;"
                    border={"1px solid #0000001A"}
                    className="cursor-pointer custom-hover-effect"
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    // onClick={handleRefetch}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="1.1em"
                      height="1.1em"
                      viewBox="-1.5 -2.5 24 24"
                      onClick={() => setStatus("Updating...")}
                    >
                      <path
                        fill="#637382"
                        d="m4.859 5.308l1.594-.488a1 1 0 0 1 .585 1.913l-3.825 1.17a1 1 0 0 1-1.249-.665L.794 3.413a1 1 0 1 1 1.913-.585l.44 1.441C5.555.56 10.332-1.035 14.573.703a9.38 9.38 0 0 1 5.38 5.831a1 1 0 1 1-1.905.608A7.381 7.381 0 0 0 4.86 5.308zm12.327 8.195l-1.775.443a1 1 0 1 1-.484-1.94l3.643-.909a1 1 0 0 1 .61-.08a1 1 0 0 1 .84.75l.968 3.88a1 1 0 0 1-1.94.484l-.33-1.322a9.381 9.381 0 0 1-16.384-1.796l-.26-.634a1 1 0 1 1 1.851-.758l.26.633a7.381 7.381 0 0 0 13.001 1.25z"
                      />
                    </svg>
                  </Box>
                </Tooltip>
                <Tooltip
                  title="This will remember any sorting, filter and which page you were on even if you navigate away form the page."
                  placement="top"
                  style={{ color: "red" }}
                >
                  <Box
                    padding={1}
                    borderRadius={1.8}
                    width="fit-content"
                    boxShadow="0px 0px 10px 0px #0000001A;"
                    border={"1px solid #0000001A"}
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    className="cursor-pointer custom-hover-effect"
                    onClick={() => {
                      handleRememberSort(), setIsSort(!isSort);
                    }}
                  >
                    {isSort ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="1em"
                        height="1em"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill="#637382"
                          d="m19 21l-7-3l-7 3V5c0-1.1.9-2 2-2h7a5.002 5.002 0 0 0 5 7.9zM17.83 9L15 6.17l1.41-1.41l1.41 1.41l3.54-3.54l1.41 1.41z"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="1.1em"
                        height="1.1em"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill="#637382"
                          d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3l7 3V5c0-1.1-.9-2-2-2"
                        />
                      </svg>
                    )}
                  </Box>
                </Tooltip>
              </Box>

              <Typography variant="body1" color="#979797" fontSize={14}>
                {status}
              </Typography>
            </Box>
          )}
        </Stack>
      )}
      {/* Search Section End */}
    </>
  );
}
