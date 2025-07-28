'use client';
import { userAction } from '@/lib/features/user/userSlice';
import { useAppDispatch } from '@/lib/hooks';
import EyeClosed from '@/public/static/img/icons/ic-eye-closed.svg';
import EyeOpened from '@/public/static/img/icons/ic-eye-open.svg';
import logo from '@/public/static/img/logo-bigone.jpg';
import { Box, Button, Stack, TextField, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';

import { setCookie } from 'cookies-next';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { getCookie } from 'cookies-next';

export default function Page() {
  const currentYear = new Date().getFullYear();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState<string>(
    'abhishek.choudhary@ensuesoft.com',
  );
  const [password, setPassword] = useState<string>('12345678');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (loading) return;

    setLoading(true);

    try {
      const token = getCookie('auth-token');
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();

      if (response.ok && data.data.user) {
        const { organisation, ...userWithoutPassword } = data.data.user;
        delete userWithoutPassword.password;

        setCookie(
          'logged-user',
          JSON.stringify({
            ...userWithoutPassword,
            organisationType: organisation?.organisationType,
          }),
          { maxAge: 60 * 60 * 24 * 1 }, // 1 day in seconds
        );

        dispatch(userAction.handleRole(data.data.user.role));
        setCookie('role', data.data.user.role, { maxAge: 60 * 60 * 24 * 1 });

        if (data.status) {
          router.push('/dashboard/organisation');
        }
      } else if (data?.error) {
        toast.dismiss();
        toast.error(data?.error);
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.dismiss();
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{ duration: 5000 }}
      />
      <Stack
        sx={{
          backgroundImage: 'url(/static/img/high-backend.png)',
          backgroundRepeat: 'no-repeat',
          backgroundSize: '100% 100%',
          minHeight: '100vh',
          backgroundBlendMode: 'luminosity',
        }}
        display={'flex'}
        justifyContent={'space-between'}
        alignItems={'stretch'}
      >
        {/* Login Section Start */}
        <Stack>
          <Box padding={1.5} bgcolor={'#06A19B'}></Box>

          <Box paddingBlock={1} bgcolor={'#fff'}>
            <Box
              sx={{
                width: {
                  md: 500,
                  xs: 300,
                },
                paddingInline: {
                  md: 5,
                  xs: 2,
                },
              }}
            >
              <Link href="/">
                <Image
                  src={logo}
                  alt="Logo"
                  style={{
                    width: '100%',
                    height: 'auto',
                  }}
                />
              </Link>
            </Box>
          </Box>
        </Stack>

        <Stack
          sx={{
            paddingBlock: {
              lg: 7,
              xs: 4,
            },
          }}
        >
          <Box display={'flex'} justifyContent={'center'} alignItems={'center'}>
            <Grid
              container
              alignItems={'flex-end'}
              sx={{
                justifyContent: {
                  xs: 'space-between',
                },
                gap: {
                  md: 0,
                  xs: 3,
                },
              }}
            >
              <Grid
                item
                md={5}
                xs={10}
                bgcolor={'#0E848E'}
                sx={{
                  borderTopRightRadius: 100,
                  borderBottomRightRadius: 100,
                }}
              >
                <Box
                  color={'#fff'}
                  sx={{
                    fontSize: {
                      xl: 30,
                      lg: 24,
                      md: 20,
                    },
                    padding: {
                      lg: 4,
                      xs: 3,
                    },
                  }}
                >
                  Aquafeed management to optimize production and environmental
                  sustainability.
                </Box>
              </Grid>

              <Grid
                item
                lg={1}
                sx={{
                  display: {
                    md: 'block',
                    xs: 'none',
                  },
                }}
              ></Grid>

              <Grid
                item
                md={4}
                xs={10}
                borderRadius={1.8}
                bgcolor={'#fff'}
                sx={{
                  padding: '0 !important',
                  marginX: {
                    md: 0,
                    xs: 'auto',
                  },
                }}
              >
                <Box
                  sx={{
                    padding: {
                      lg: 5,
                      xs: 3,
                    },
                  }}
                >
                  <Typography
                    variant="h6"
                    color="#06A19B"
                    fontWeight={600}
                    marginBottom={1}
                    textTransform={'capitalize'}
                  >
                    Welcome!{' '}
                  </Typography>
                  <Typography
                    variant="h5"
                    fontWeight={600}
                    marginBottom={4}
                    textTransform={'capitalize'}
                  >
                    Login to your account{' '}
                  </Typography>

                  <Box position="relative" className="login-inputs">
                    <form onSubmit={handleSubmit}>
                      <TextField
                        label="Email"
                        type="email"
                        className="form-input"
                        // focused
                        sx={{
                          width: '100%',
                          marginBottom: 4,
                        }}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />

                      <Box position={'relative'}>
                        <TextField
                          label="Password"
                          type={showPassword ? 'text' : 'password'}
                          className="form-input"
                          sx={{
                            width: '100%',
                            marginBottom: 3,
                          }}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />

                        <Box
                          bgcolor={'white'}
                          sx={{
                            position: 'absolute',
                            right: '7px',
                            top: '35%',
                            transform: 'translate(-7px,-50%)',
                            width: 20,
                            height: 20,
                          }}
                        >
                          <Image
                            onClick={() => setShowPassword(!showPassword)}
                            src={showPassword ? EyeOpened : EyeClosed}
                            width={20}
                            height={20}
                            alt="Eye Icon"
                            style={{ cursor: 'pointer' }}
                          />
                        </Box>
                      </Box>

                      <Button
                        variant="contained"
                        sx={{
                          background: '#06A19B',
                          fontWeight: '600',
                          padding: '10px 24px',
                          width: '100%',
                          textTransform: 'capitalize',
                          borderRadius: '8px',
                          fontSize: 18,
                        }}
                        type="submit"
                      >
                        Login
                      </Button>
                    </form>
                  </Box>

                  {/* <Box
                    display={"flex"}
                    justifyContent={"space-between"}
                    gap={2}
                    alignItems={"center"}
                    marginBlock={3}
                  >
                    <Box
                      bgcolor={"#979797"}
                      height={"1px"}
                      width={"100%"}
                    ></Box>
                    or
                    <Box
                      bgcolor={"#979797"}
                      height={"1px"}
                      width={"100%"}
                    ></Box>
                  </Box> */}

                  {/* <Box
                    color="#06A19B"
                    fontWeight={500}
                    display={"flex"}
                    justifyContent={"center"}
                    alignItems={"center"}
                    gap={1}
                    border={"1px solid #06A19B"}
                    padding={1}
                    borderRadius={1.8}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="2em"
                      height="2em"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="#06A19B"
                        d="M3.064 7.51A10 10 0 0 1 12 2c2.695 0 4.959.991 6.69 2.605l-2.867 2.868C14.786 6.482 13.468 5.977 12 5.977c-2.605 0-4.81 1.76-5.595 4.123c-.2.6-.314 1.24-.314 1.9s.114 1.3.314 1.9c.786 2.364 2.99 4.123 5.595 4.123c1.345 0 2.49-.355 3.386-.955a4.6 4.6 0 0 0 1.996-3.018H12v-3.868h9.418c.118.654.182 1.336.182 2.045c0 3.046-1.09 5.61-2.982 7.35C16.964 21.105 14.7 22 12 22A9.996 9.996 0 0 1 2 12c0-1.614.386-3.14 1.064-4.49"
                      />
                    </svg>
                    Login with Google
                  </Box> */}
                </Box>
              </Grid>

              <Grid
                item
                lg={1}
                sx={{
                  display: {
                    md: 'block',
                    xs: 'none',
                  },
                }}
              ></Grid>
            </Grid>
          </Box>
        </Stack>

        <Stack
          bgcolor={'#272727'}
          sx={{
            paddingInline: {
              lg: 4,
              xs: 3,
            },
            paddingBlock: 2,
            rowGap: 2,
            columnGap: 5,
          }}
          display={'flex'}
          justifyContent={'space-between'}
          direction={'row'}
          alignItems={'center'}
          flexWrap={'wrap'}
        >
          <Box
            display={'flex'}
            sx={{
              rowGap: 1,
              columnGap: 5,
            }}
            alignItems={'center'}
            flexWrap={'wrap'}
          >
            <Box
              display={'flex'}
              alignItems={'center'}
              flexWrap={'wrap'}
              sx={{
                gap: {
                  md: 2,
                  xs: 1,
                },
              }}
            >
              <Typography variant="subtitle1" color="#fff" fontWeight={400}>
                Consulting Animal Nutritionists
              </Typography>

              <Box display={'flex'} alignItems={'center'} gap={1}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="100%"
                  height="100%"
                  viewBox="0 0 200 200"
                  style={{ maxHeight: '40px', maxWidth: '40px' }}
                >
                  <g
                    fill="#fff"
                    fillRule="evenodd"
                    stroke="none"
                    strokeWidth="1"
                  >
                    <circle
                      cx="100"
                      cy="100"
                      r="80"
                      stroke="#fff"
                      strokeWidth="16"
                      fill="transparent"
                    ></circle>
                    <text
                      x="40"
                      y="128"
                      fontFamily="'__Varela_Round_143227', '__Varela_Round_Fallback_143227', Helvetica, Arial, sans-serif"
                      fontSize="96"
                      fontWeight="400"
                    >
                      nh
                    </text>
                  </g>
                </svg>

                <Typography variant="subtitle1" fontWeight={600} color="#fff">
                  nutritionhub
                </Typography>
              </Box>
            </Box>

            <Box display={'flex'} gap={2} alignItems={'center'}>
              <Button
                variant="contained"
                sx={{
                  background: '#06A19B',
                  fontWeight: 600,
                  padding: '4px 16px',
                  width: 'fit-content',
                  textTransform: 'capitalize',
                  borderRadius: '4px',
                }}
              >
                Contact Us
              </Button>

              <Typography variant="body1" color="#fff">
                www.nutritionhub.co.za
              </Typography>
            </Box>
          </Box>

          <Typography variant="subtitle2" color="#fff" fontWeight={400}>
            All right reserved - {currentYear} Nutritionhub
          </Typography>
        </Stack>
        {/* Login Section End */}
      </Stack>
    </>
  );
}
