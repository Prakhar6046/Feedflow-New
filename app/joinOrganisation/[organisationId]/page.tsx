'use client';
// import Typography from "@/app/_components/theme/overrides/Typography";
import EyeClosed from '@/public/static/img/icons/ic-eye-closed.svg';
import EyeOpened from '@/public/static/img/icons/ic-eye-open.svg';
import logo from '@/public/static/img/logo.svg';
import { Box, Button, Stack, TextField, Typography } from '@mui/material';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
interface IFormInput {
  password: string;
  confirmPassword: string;
}

const Page = ({ params }: { params: { organisationId: string } }) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setshowConfirmPassword] =
    useState<boolean>(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<IFormInput>();

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    if (data.password && params.organisationId) {
      const payload = {
        userId: params.organisationId,
        password: data.password,
      };
      const response = await fetch('/api/add-new-user/setPassword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      const responseData = await response.json();
      toast.success(responseData.message);

      if (responseData.status) {
        router.push('/auth/login');
      }
    }
  };

  // Watch the password field to validate confirmPassword
  const password = watch('password');

  return (
    <Stack
      display={'flex'}
      justifyContent={'center'}
      alignItems={'center'}
      minHeight={'100vh'}
      sx={{
        background:
          'linear-gradient(349.33deg, rgba(6, 161, 155, 0.4) -27.15%, rgba(2, 59, 57, 0) 103.57%)',
        px: 3,
      }}
    >
      <Box
        sx={{
          padding: {
            lg: 5,
            xs: 3,
          },
          border: '1px solid #06A19B',
          borderRadius: '14px',
          background: '#fff',
          minWidth: {
            sm: 500,
            xs: '100%',
          },
        }}
      >
        <Image src={logo} alt="Logo" width={80} />
        <Typography
          mt={2}
          variant="h5"
          fontWeight={600}
          marginBottom={4}
          textTransform={'capitalize'}
          sx={{
            fontSize: {
              md: '24px',
              xs: '20px',
            },
          }}
        >
          Set Password
        </Typography>

        <Box position="relative" className="login-inputs">
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box position={'relative'} mb={3}>
              <TextField
                label="Password *"
                type={showPassword ? 'text' : 'password'}
                // focused
                className="form-input"
                sx={{
                  width: '100%',
                  // marginBottom: 4,
                }}
                id="password"
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 8,
                    message: 'Password must be at least 8 characters',
                  },
                })}
              />

              <Box
                bgcolor={'white'}
                sx={{
                  position: 'absolute',
                  right: '7px',
                  top: errors?.password ? '35%' : '50%',
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
              {errors.password && (
                <Typography variant="body2" color="red" fontSize={13} mt={0.5}>
                  {errors.password.message}
                </Typography>
              )}
            </Box>
            <Box position={'relative'} mb={5}>
              <TextField
                label="Confirm Password *"
                type={showConfirmPassword ? 'text' : 'password'}
                className="form-input"
                // focused
                sx={{
                  width: '100%',
                  // marginBottom: 3,
                }}
                id="confirmPassword"
                {...register('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: (value) =>
                    value === password || 'Passwords do not match',
                })}
              />

              <Box
                bgcolor={'white'}
                sx={{
                  position: 'absolute',
                  right: '7px',
                  top: errors?.confirmPassword ? '35%' : '50%',
                  transform: 'translate(-7px,-50%)',
                  width: 20,
                  height: 20,
                }}
              >
                <Image
                  onClick={() => setshowConfirmPassword(!showConfirmPassword)}
                  src={showConfirmPassword ? EyeOpened : EyeClosed}
                  width={20}
                  height={20}
                  alt="Eye Icon"
                  style={{ cursor: 'pointer' }}
                />
              </Box>
              {errors.confirmPassword && (
                <Typography variant="body2" color="red" fontSize={13} mt={0.5}>
                  {errors.confirmPassword.message}
                </Typography>
              )}
            </Box>
            {/* <TextField
              label="Confirm Password"
              type="password"
              className="form-input"
              // focused
              sx={{
                width: "100%",
                marginBottom: 3,
              }}
              id="confirmPassword"
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (value) =>
                  value === password || "Passwords do not match",
              })}
            /> */}

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
              Continue
            </Button>
          </form>
        </Box>
      </Box>
    </Stack>
    // Set Password Section End
  );
};

export default Page;
