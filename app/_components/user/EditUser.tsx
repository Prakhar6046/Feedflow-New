'use client';
import Loader from '@/app/_components/Loader';
import { deleteImage, handleUpload } from '@/app/_lib/utils';
import * as validationPattern from '@/app/_lib/utils/validationPatterns/index';
import * as validationMessage from '@/app/_lib/utils/validationsMessage/index';
import { SingleUser, UserFormInputs } from '@/app/_typeModels/User';
import EyeClosed from '@/public/static/img/icons/ic-eye-closed.svg';
import EyeOpened from '@/public/static/img/icons/ic-eye-open.svg';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Box, Grid, Stack, TextField, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import UserPermission from './UserPermission';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

type Iprops = {
  userId: string;
};
function EditUser({ userId }: Iprops) {
  const router = useRouter();
  const [isApiCallInProgress, setIsApiCallInProgress] =
    useState<boolean>(false);
  const [userData, setUserData] = useState<{ data: SingleUser }>();
  const [loading, setLoading] = useState<boolean>(false);
  const [profilePic, setProfilePic] = useState<string>();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setshowConfirmPassword] =
    useState<boolean>(false);

  const {
    register,
    setValue,
    handleSubmit,
    getValues,
    resetField,
    watch,
    control,
    formState: { errors },
  } = useForm<UserFormInputs>({ mode: 'onTouched' });
  const onSubmit: SubmitHandler<UserFormInputs> = async (data) => {
    // Prevent API call if one is already in progress
    if (isApiCallInProgress) return;
    setIsApiCallInProgress(true);
    try {
      const payload = {
        name: data.name,
        email: data.email,
        organisationId: userData?.data?.organisationId,
        imageUrl: profilePic,
        permissions: data.permissions,
        password: '',
      };

      if (data.password) {
        payload.password = data.password;
      }

      const res = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const updatedUser = await res.json();
        toast.success(updatedUser.message);
        router.push('/dashboard/user');
        resetField('confirmPassword');
        resetField('password');
      }
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsApiCallInProgress(false);
    }
  };

  useEffect(() => {
    if (userId) {
      const user = async () => {
        setLoading(true);
        const data = await fetch(`/api/users/${userId}`, {
          method: 'GET',
        });
        const res = await data.json();
        setLoading(false);
        setUserData(res);
      };
      user();
    }
  }, [userId]);

  useEffect(() => {
    if (userData) {
      setValue('name', String(userData?.data?.name));
      setValue('image', String(userData?.data?.imageUrl));
      setValue('email', String(userData?.data?.email));
      setValue('organisation', String(userData?.data?.organisation?.name));
      setValue(
        'organisationType',
        String(userData?.data?.organisation?.organisationType),
      );
      setValue('organisationId', userData?.data?.organisationId);
      setValue('permissions', userData?.data?.permissions);

      setProfilePic(userData?.data?.imageUrl);

      // Prepare the data for useFieldArray, including the farm name
      const farmPermissions = (userData?.data?.organisation?.Farm || []).map(
        (farm) => {
          const found = userData?.data?.permissions?.farms?.find(
            (p) => String(p.farmId) === String(farm.id),
          );
          return {
            farmId: farm.id,
            name: farm.name,
            stock: found?.stock ?? false,
            transfer: found?.transfer ?? false,
            harvest: found?.harvest ?? false,
            mortalities: found?.mortalities ?? false,
            sample: found?.sample ?? false,
            createReport: found?.createReport ?? false,
            feedingPlans: found?.feedingPlans ?? false,
          };
        },
      );

      setValue('permissions.farms', farmPermissions);

      // Set non-farm permissions individually
      if (userData?.data?.permissions) {
        Object.keys(userData?.data?.permissions).forEach((key) => {
          if (key !== 'farms') {
            // Only set value if the key is a valid field in the form schema
            setValue(
              `permissions.${key}` as any,
              (userData?.data?.permissions as Record<string, any>)[key],
            );
          }
        });
      }
    }
  }, [userData]);

  if (loading) {
    return <Loader />;
  }
  return (
    <Stack pb={5}>
      {/* Profile Section Start */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack
          sx={{
            borderRadius: '14px',
            boxShadow: '0px 0px 5px #C5C5C5',
            mt: 4,
            padding: 3,
          }}
        >
          <Grid container>
            <Grid
              item
              xl={3}
              md={5}
              xs={12}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                gap: {
                  // sm: 5,
                  // xs: 3,
                },
                alignItems: 'center',
              }}
            >
              <Typography
                variant="h6"
                color="rgb(99, 115, 129)"
                fontSize={14}
                alignSelf={'flex-start'}
              >
                Profile Picture
              </Typography>
              <Button
                component="label"
                style={{
                  backgroundImage: `url(${profilePic})`,
                  backgroundSize: '100% 100%',
                }}
                role={undefined}
                variant="contained"
                tabIndex={-1}
                startIcon={profilePic ? null : <CloudUploadIcon />}
                className="upload-file-input1"
                sx={{
                  textTransform: 'unset',
                  fontSize: 12,
                  width: 140,
                  height: 140,
                  borderRadius: 100,
                  border: '7px solid white',
                  outline: '1px dashed rgba(145, 158, 171, 0.32)',
                  backgroundColor: 'rgb(244, 246, 248)',
                  boxShadow: 'none',
                  color: 'rgb(99, 115, 129)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  position: 'relative',
                }}
              >
                {profilePic ? '' : 'Upload photo'}
                <VisuallyHiddenInput
                  type="file"
                  {...register('image', {
                    onChange: (e) =>
                      handleUpload(e.target.files, profilePic, setProfilePic),
                  })}
                  accept=".jpg,.jpeg,.png,.svg"
                />
              </Button>
              {profilePic && (
                <Box
                  display={'flex'}
                  gap="10px"
                  alignItems={'center'}
                  my={'10px'}
                >
                  <Button
                    component="label"
                    variant="contained"
                    sx={{
                      background: '#06A19B',
                      color: '#fff',
                      fontWeight: 600,
                      padding: '4px 10px',
                      textTransform: 'capitalize',
                      borderRadius: '10px',
                      border: '1px solid #06A19B',
                      // position: "absolute",
                      // bottom: "1%",
                      display: 'flex',
                      alignItems: 'center',
                      gap: '2px',
                    }}
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
                    Edit
                    <VisuallyHiddenInput
                      type="file"
                      {...register('image', {
                        onChange: (e) =>
                          handleUpload(
                            e.target.files,
                            profilePic,
                            setProfilePic,
                          ),
                      })}
                      accept=".jpg,.jpeg,.png,.svg"
                    />
                  </Button>

                  {/* delete button */}
                  <Button
                    type="button"
                    variant="contained"
                    onClick={() =>
                      deleteImage(
                        {
                          id: userData?.data?.id,
                          type: 'user',
                          image: userData?.data?.image,
                        },
                        setProfilePic,
                      )
                    }
                    sx={{
                      background: '#D71818',
                      fontWeight: 600,
                      padding: '4px',
                      width: 'fit-content',
                      textTransform: 'capitalize',
                      borderRadius: '10px',
                      color: '#fff',
                      border: '1px solid #D71818',
                      boxShadow: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '2px',
                    }}
                  >
                    {' '}
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M13.2084 2.43761H10.6302V1.38915C10.6302 0.622847 10.0073 0 9.24384 0H4.44777C3.68147 0 3.06145 0.622847 3.06145 1.38915V2.43761H0.483183C0.217046 2.43761 0 2.65466 0 2.92079C0 3.18692 0.217055 3.40397 0.483183 3.40397H1.40142L1.99595 11.6275C2.09221 12.9591 3.21145 14 4.54692 14H9.14947C10.4829 14 11.604 12.9591 11.7004 11.6275L12.295 3.40397H13.2132C13.4793 3.40397 13.6964 3.18692 13.6964 2.92079C13.6964 2.6556 13.4745 2.43761 13.2084 2.43761ZM4.02796 1.39198C4.02796 1.15982 4.2167 0.969192 4.44791 0.969192H9.24109C9.47324 0.969192 9.66104 1.15794 9.66104 1.39198V2.44044H4.0281L4.02796 1.39198ZM10.7321 11.5577C10.6717 12.3862 9.9762 13.0336 9.14479 13.0336H4.54513C3.71654 13.0336 3.0182 12.3862 2.9578 11.5577L2.36798 3.40395H11.3182L10.7321 11.5577Z"
                        fill="white"
                      />
                      <path
                        d="M5.56912 5.37891C5.30298 5.37891 5.08594 5.59596 5.08594 5.86209V10.5543C5.08594 10.8204 5.30299 11.0375 5.56912 11.0375C5.83525 11.0375 6.0523 10.8204 6.0523 10.5543V5.86209C6.0523 5.59689 5.83525 5.37891 5.56912 5.37891Z"
                        fill="white"
                      />
                      <path
                        d="M8.1199 5.37891C7.85376 5.37891 7.63672 5.59596 7.63672 5.86209V10.5543C7.63672 10.8204 7.85377 11.0375 8.1199 11.0375C8.38603 11.0375 8.60308 10.8204 8.60308 10.5543V5.86209C8.60308 5.59689 8.38792 5.37891 8.1199 5.37891Z"
                        fill="white"
                      />
                    </svg>
                    Delete
                  </Button>
                </Box>
              )}
              <Box
                display={'flex'}
                justifyContent={'center'}
                alignItems={'center'}
                flexDirection={'row'}
                sx={{
                  width: {
                    md: '90%',
                    xs: '100%',
                  },
                }}
              >
                <Typography
                  variant="body1"
                  fontSize={12}
                  textAlign={'center'}
                  margin="0 auto"
                  color="#979797"
                >
                  Allowed *.jpeg, *.jpg, *.png, *.svg <br />
                  max size of 2M byte
                </Typography>
              </Box>
            </Grid>

            <Grid
              item
              md={9}
              sx={{
                mt: {
                  md: 0,
                  xs: 3,
                },
              }}
            >
              <Typography
                variant="subtitle1"
                fontWeight={500}
                color="black"
                fontSize={16}
                alignSelf={'flex-start'}
                marginBottom={1}
              >
                Information
              </Typography>
              <Box mb={3} width={'100%'}>
                <TextField
                  label="Name *"
                  type="text"
                  className="form-input"
                  {...register('name', {
                    required: true,
                  })}
                  focused
                  sx={{
                    width: '100%',
                  }}
                />
                {errors && errors.name && errors.name.type === 'required' && (
                  <Typography
                    variant="body2"
                    color="red"
                    fontSize={13}
                    mt={0.5}
                  >
                    This field is required.
                  </Typography>
                )}
              </Box>
              <Box mb={2} width={'100%'}>
                <TextField
                  label={'Email *'}
                  type="email"
                  className="form-input"
                  autoFocus
                  focused
                  InputProps={{
                    readOnly: true,
                  }}
                  {...register('email', {
                    required: true,
                  })}
                  sx={{
                    width: '100%',
                    backgroundColor: '#f0f0f0',
                    '& .MuiInputBase-input.Mui-disabled': {
                      backgroundColor: '#f0f0f0',
                    },
                  }}
                />
                {errors && errors.email && errors.email.type === 'required' && (
                  <Typography
                    variant="body2"
                    color="red"
                    fontSize={13}
                    mt={0.5}
                  >
                    This field is required.
                  </Typography>
                )}
              </Box>
              <TextField
                label="Organisation Name"
                type="text"
                className="form-input"
                InputProps={{
                  readOnly: true,
                }}
                focused
                {...register('organisation')}
                sx={{
                  width: '100%',
                  marginBottom: 2,
                  backgroundColor: '#f0f0f0',
                  '& .MuiInputBase-input.Mui-disabled': {
                    backgroundColor: '#f0f0f0',
                  },
                }}
              />
              <TextField
                label="Organisation Type"
                type="text"
                className="form-input"
                InputProps={{
                  readOnly: true,
                }}
                focused
                {...register('organisationType')}
                sx={{
                  width: '100%',
                  marginBottom: 2,
                  backgroundColor: '#f0f0f0',
                  '& .MuiInputBase-input.Mui-disabled': {
                    backgroundColor: '#f0f0f0',
                  },
                }}
              />
              {/* )} */}
              {/* <Divider
                sx={{
                  borderColor: "#979797",
                  my: 1,
                }}
              /> */}
              <Typography
                variant="subtitle1"
                color="black"
                fontWeight={500}
                mb={0.3}
                fontSize={16}
                marginTop={2}
              >
                Set or Change Password
              </Typography>
              <Typography
                variant="h6"
                color="rgb(99, 115, 129)"
                fontSize={12}
                fontWeight={300}
                marginBottom={2}
              >
                If you signed in with a provider like Google, you can set a
                password here. If you already have a password set, you can
                change it here.
              </Typography>
              <Box position={'relative'} mb={2}>
                <TextField
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  className="form-input"
                  {...register('password', {
                    pattern: validationPattern.passwordPattern,
                  })}
                  focused
                  sx={{
                    width: '100%',
                  }}
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
                    className="cursor-pointer"
                  />
                </Box>
                {errors &&
                  errors.password &&
                  errors.password.type === 'pattern' && (
                    <Typography
                      variant="body2"
                      color="red"
                      fontSize={13}
                      mt={0.5}
                    >
                      {validationMessage.passwordPatternMessage}
                    </Typography>
                  )}
              </Box>
              <Box position={'relative'}>
                <TextField
                  label="Re-enter Password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  className="form-input"
                  {...register('confirmPassword', {
                    required: watch('password') ? true : false,
                    validate: (value) =>
                      value === getValues().password ||
                      'Confirm Password do not match!',
                  })}
                  focused
                  sx={{
                    width: '100%',
                  }}
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
                {errors &&
                  watch('password') &&
                  errors.confirmPassword?.type == 'required' && (
                    <Typography
                      variant="body2"
                      color="red"
                      fontSize={13}
                      mt={0.5}
                    >
                      Please Re-enter Password.
                    </Typography>
                  )}
                {errors && errors.confirmPassword?.type == 'validate' && (
                  <Typography
                    variant="body2"
                    color="red"
                    fontSize={13}
                    mt={0.5}
                  >
                    {validationMessage.confirmPasswordMessage}
                  </Typography>
                )}
              </Box>
            </Grid>
          </Grid>
        </Stack>
        <UserPermission
          control={control}
          oraginsationType={
            userData?.data?.organisation?.organisationType ?? ''
          }
          userData={userData?.data?.permissions}
        />
        <Button
          type="submit"
          variant="contained"
          disabled={isApiCallInProgress}
          sx={{
            background: '#06A19B',
            fontWeight: 600,
            padding: '6px 16px',
            width: 'fit-content',
            textTransform: 'capitalize',
            borderRadius: '8px',
            marginLeft: 'auto',
            display: 'block',
            marginTop: 5,
          }}
        >
          Save Changes
        </Button>
      </form>
    </Stack>
  );
}

export default EditUser;
