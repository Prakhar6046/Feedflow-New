'use client';
import { Box, Button, Stack, Tooltip } from '@mui/material';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Typography from '@mui/material/Typography';

import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { selectSort } from '@/lib/features/breadcrum/breadcrumSlice';
import { useAppSelector } from '@/lib/hooks';
import { getCookie, setCookie } from 'cookies-next';
import SearchBar from './SearchBar';
import { getLocalItem, removeLocalItem, setLocalItem } from '../_lib/utils';
interface Props {
  heading: string;
  buttonName?: string;
  links?: { name: string; link: string }[];
  hideSearchInput?: boolean;
  isTable?: boolean;
  buttonRoute?: string;
  permissions?: boolean;
  extraButton?: { buttonName: string; route: string };
}

export default function BasicBreadcrumbs({
  heading,
  buttonName,
  links,
  hideSearchInput,
  isTable,
  buttonRoute,
  permissions,
  extraButton,
}: Props) {
  const role = getCookie('role');
  const pathName = usePathname();

  const search = useSearchParams();
  const router = useRouter();
  const [updatedPathName, setUpdatedPathName] = useState<string>();
  const sortvalue = useAppSelector(selectSort);

  const [currentRole, setCurrentRole] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSort, setIsSort] = useState<boolean>(false);
  const [sortDataFromLocal, setSortDataFromLocal] = useState<{
    direction: 'asc' | 'desc';
    column: string;
  }>({ direction: 'asc', column: '' });
  const handleClear = () => {
    setSearchQuery('');
  };
  const handleClick = () => {
    if (pathName === '/dashboard/feedSupply') {
      if (currentRole === 'SUPERADMIN') {
        setCookie('activeStep', 0);
      } else if (currentRole === 'Feed Supplier') {
        setCookie('activeStep', 1);
      }
    } else {
      setCookie('activeStep', 0);
    }
    removeLocalItem('farmData');
    removeLocalItem('farmProductionUnits');
    removeLocalItem('productionParametes');
    removeLocalItem('productionParamtertsUnitsArray');
    removeLocalItem('feedProfiles');
    removeLocalItem('feedProfileId');
    removeLocalItem('productionUnitsFeedProfiles');
    router.push(String(buttonRoute));
  };

  const handleRememberSort = () => {
    if (!isSort) {
      setLocalItem(pathName, sortvalue);
    } else {
      removeLocalItem(pathName);
    }
  };

  useEffect(() => {
    if (sortvalue && sortDataFromLocal) {
      setIsSort(true);
    } else {
      setIsSort(false);
    }
  }, [sortvalue, sortDataFromLocal]);

  useEffect(() => {
    if (role) {
      setCurrentRole(role);
    }
  }, [role]);
  useEffect(() => {
    if (pathName) {
      setUpdatedPathName(pathName);
      setSortDataFromLocal(getLocalItem(pathName));
    }
    if (pathName === '/dashboard/farm') {
      setCookie('isEditFarm', false);
    }
  }, [pathName]);

  useEffect(() => {
    if (search.get('tab') && pathName) {
      const tab = search.get('tab');
      setUpdatedPathName(`${pathName}?tab=${tab}`);
    }
  }, [search.get('tab')]);

  return (
    <>
      {/* Breadcrumb Section Start */}
      <Stack
        marginTop={1}
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexDirection: 'row',
          rowGap: 1,
          columnGap: 5,
          flexWrap: 'wrap',
        }}
      >
        <Box>
          {/* Main Heading */}
          <Typography
            variant="h2"
            marginBottom={'4px'}
            fontWeight={600}
            sx={{
              fontSize: {
                md: '1.5rem',
                xs: '1.25rem',
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
              {links.map((link) => {
                return (
                  <Link
                    key={link.name}
                    href={link.link}
                    className={`nav-links ${
                      link.link === `${updatedPathName}` ? 'active-link' : ''
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </Breadcrumbs>
          )}
        </Box>

        {currentRole === 'SUPERADMIN' ? (
          <Box sx={{ display: 'flex', gap: 2 }}>
            {buttonName && (
              <Button
                variant="contained"
                onClick={handleClick}
                sx={{
                  background: '#06A19B',
                  fontWeight: 600,
                  padding: '8px 20px',
                  width: 'fit-content',
                  textTransform: 'capitalize',
                  borderRadius: '8px',
                  textWrap: 'nowrap',
                  display: 'flex',
                  gap: 1,
                  alignItems: 'center',
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
            )}

            {extraButton && Object.keys(extraButton).length && (
              <Button
                variant="contained"
                onClick={() => router.push(extraButton?.route)}
                sx={{
                  background: '#06A19B',
                  fontWeight: 600,
                  padding: '8px 20px',
                  width: 'fit-content',
                  textTransform: 'capitalize',
                  borderRadius: '8px',
                  textWrap: 'nowrap',
                  display: 'flex',
                  gap: 1,
                  alignItems: 'center',
                }}
              >
                {extraButton?.buttonName}
              </Button>
            )}
          </Box>
        ) : pathName === '/dashboard/organisation' ? (
          permissions &&
          buttonName &&
          buttonName !== 'Add Organization' && (
            <Button
              variant="contained"
              onClick={handleClick}
              sx={{
                background: '#06A19B',
                fontWeight: 600,
                padding: '8px 20px',
                width: 'fit-content',
                textTransform: 'capitalize',
                borderRadius: '8px',
                textWrap: 'nowrap',
                display: 'flex',
                gap: 1,
                alignItems: 'center',
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
        ) : (
          permissions &&
          buttonName &&
          buttonName !== 'Add Organization' && (
            <Button
              variant="contained"
              onClick={handleClick}
              sx={{
                background: '#06A19B',
                fontWeight: 600,
                padding: '8px 20px',
                width: 'fit-content',
                textTransform: 'capitalize',
                borderRadius: '8px',
                textWrap: 'nowrap',
                display: 'flex',
                gap: 1,
                alignItems: 'center',
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
      </Stack>
      {/* Breadcrumb Section End */}

      {/* Search Section Start */}
      {pathName !== '/dashboard' && (
        <Stack
          marginBlock={2}
          display="flex"
          gap={1}
          sx={{
            flexDirection: {
              md: 'row',
              xs: 'column',
            },
            justifyContent: {
              md: 'space-between',
              xs: 'flex-end',
            },
            alignItems: {
              md: 'center',
              xs: 'flex-start',
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
                md: 'fit-content',
                xs: '100%',
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
                style={{ cursor: 'pointer' }}
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
                width: { md: 'fit-content', xs: '100%' },
                textAlign: 'end',
              }}
            >
              <Box
                display="flex"
                justifyContent="flex-end"
                alignItems="center"
                gap={2}
              >
                <Tooltip
                  title="This will remember any sorting, filter and which page you were on even if you navigate away from the page."
                  placement="top"
                  style={{ color: 'red' }}
                >
                  <Box
                    padding={1}
                    borderRadius={1.8}
                    width="fit-content"
                    boxShadow="0px 0px 10px 0px #0000001A;"
                    border={'1px solid #0000001A'}
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    className="cursor-pointer custom-hover-effect"
                    onClick={() => {
                      handleRememberSort();
                      setIsSort(!isSort);
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
                {/* {status} */}
              </Typography>
            </Box>
          )}
        </Stack>
      )}
      {/* Search Section End */}
    </>
  );
}
