'use client';

import {
  Box,
  Button,
  Divider,
  Grid,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import HatcheryForm from '../hatchery/HatcheryForm';
import { useRouter } from 'next/navigation';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import {
  AddOrganizationFormInputs,
  OrganizationData,
} from '@/app/_typeModels/Organization';
import { VisuallyHiddenInput } from './EditOrganisation';
import EmptyFarm from './EmptyFarm';
import { getCookie, setCookie } from 'cookies-next';
import { SingleUser } from '@/app/_typeModels/User';
import {
  FieldErrors,
  UseFormRegister,
  UseFormSetValue,
  UseFormTrigger,
  UseFormWatch,
} from 'react-hook-form';
interface Props {
  organisationData?: OrganizationData;
  profilePic: string;
  setProfilePic: (val: string) => void;
  isHatcherySelected: boolean;
  handleUpload: (
    file: FileList,
    profilePic: string,
    setProfilePic: (val: string) => void,
  ) => void;
  altitude: string;
  register: UseFormRegister<AddOrganizationFormInputs>; // Replace `any` with your form type like `MyFormInputs`
  setValue: UseFormSetValue<AddOrganizationFormInputs>; // Same here
  trigger: UseFormTrigger<AddOrganizationFormInputs>;
  watch: UseFormWatch<AddOrganizationFormInputs>;
  errors?: FieldErrors<AddOrganizationFormInputs>;
}
const FarmsInformation = ({
  organisationData,
  profilePic,
  handleUpload,
  isHatcherySelected,
  setProfilePic,
  register,
  altitude,
  setValue,
  trigger,
  watch,
  errors,
}: Props) => {
  const router = useRouter();
  const loggedUser = getCookie('logged-user');
  const user: SingleUser = JSON.parse(loggedUser ?? '');
  return organisationData?.Farm.length ? (
    organisationData?.Farm?.map((farm) => {
      return (
        <Stack
          key={farm.id}
          sx={{
            borderRadius: '14px',
            boxShadow: '0px 0px 16px 5px #0000001A',
            mt: 4,
          }}
        >
          <Box
            sx={{
              p: {
                md: 3,
                xs: 2,
              },
              fontSize: 20,
              fontWeight: 600,
              borderColor: '#0000001A',
            }}
          >
            Farm Information
          </Box>

          <Divider />

          <Grid
            container
            sx={{
              p: {
                md: 3,
                xs: 2,
              },
            }}
            columnSpacing={5}
          >
            <Grid
              item
              xl={3}
              md={5}
              xs={12}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                gap: 3,
                alignItems: {
                  xs: 'center',
                },
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
                role={undefined}
                variant="contained"
                tabIndex={-1}
                style={{
                  backgroundImage: `url(${profilePic})`,
                  backgroundSize: '100% 100%',
                }}
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
                <Box>{profilePic ? '' : 'Upload photo'}</Box>
                <VisuallyHiddenInput
                  type="file"
                  {...register('image', {
                    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                      if (e.target.files)
                        handleUpload(e.target.files, profilePic, setProfilePic);
                    },
                  })}
                  accept=".jpg,.jpeg,.png,.svg"
                />
              </Button>

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
              xl={9}
              md={7}
              xs={12}
              sx={{
                mt: {
                  md: 0,
                  xs: 5,
                },
              }}
            >
              <Box width={'100%'} mb={2}>
                <TextField
                  label="Farm Name"
                  type="text"
                  className="form-input"
                  InputProps={{ readOnly: true }}
                  focused
                  value={farm?.name}
                  sx={{
                    width: '100%',
                  }}
                />
              </Box>
              <Stack
                display={'flex'}
                justifyContent={'flex-start'}
                direction={'row'}
                sx={{
                  width: '100%',
                  marginBottom: 2,
                  gap: 1.5,
                }}
              >
                <Box width={'100%'}>
                  <TextField
                    label="Farm Altitude"
                    type="text"
                    InputProps={{ readOnly: true }}
                    className="form-input"
                    value={farm?.farmAltitude}
                    // disabled
                    sx={{
                      width: '100%',
                    }}
                    focused
                  />
                </Box>
              </Stack>
              <Stack
                display={'flex'}
                justifyContent={'flex-start'}
                direction={'row'}
                sx={{
                  width: '100%',
                  marginBottom: 2,
                  gap: 1.5,
                }}
              >
                <Box width={'100%'}>
                  <TextField
                    label="Farm Latitude"
                    type="text"
                    InputProps={{ readOnly: true }}
                    className="form-input"
                    value={farm?.lat}
                    // disabled
                    sx={{
                      width: '100%',
                    }}
                    focused
                  />
                </Box>
              </Stack>
              <Stack
                display={'flex'}
                justifyContent={'flex-start'}
                direction={'row'}
                sx={{
                  width: '100%',
                  marginBottom: 2,
                  gap: 1.5,
                }}
              >
                <Box width={'100%'}>
                  <TextField
                    label="Farm Longitude"
                    type="text"
                    InputProps={{ readOnly: true }}
                    className="form-input"
                    value={farm?.lng}
                    // disabled
                    sx={{
                      width: '100%',
                    }}
                    focused
                  />
                </Box>
              </Stack>
              {isHatcherySelected && (
                <HatcheryForm
                  altitude={altitude}
                  register={register}
                  setValue={setValue}
                  watch={watch}
                  trigger={trigger}
                  errors={errors}
                />
              )}
              <Typography
                variant="subtitle1"
                fontWeight={500}
                color="black"
                fontSize={16}
                marginTop={3}
                marginBottom={2}
              >
                Address
              </Typography>

              <Stack
                display={'flex'}
                justifyContent={'flex-start'}
                direction={'row'}
                sx={{
                  width: '100%',
                  marginBottom: 2,
                  gap: 1.5,
                }}
              >
                <Box width={'100%'}>
                  <TextField
                    label="Address"
                    type="text"
                    className="form-input"
                    InputProps={{ readOnly: true }}
                    value={farm?.farmAddress?.addressLine1}
                    focused
                    sx={{
                      width: '100%',
                    }}
                  />
                </Box>

                <Box width={'100%'}>
                  <TextField
                    label="City"
                    type="text"
                    className="form-input"
                    InputProps={{ readOnly: true }}
                    value={farm?.farmAddress?.city}
                    focused
                    sx={{
                      width: '100%',
                    }}
                  />
                </Box>
              </Stack>

              <Stack
                display={'flex'}
                justifyContent={'flex-start'}
                direction={'row'}
                sx={{
                  width: '100%',
                  marginBottom: 2,
                  gap: 1.5,
                }}
              >
                <Box width={'100%'}>
                  <TextField
                    label="Province"
                    type="text"
                    className="form-input"
                    InputProps={{ readOnly: true }}
                    value={farm?.farmAddress?.province}
                    focused
                    sx={{
                      width: '100%',
                    }}
                  />
                </Box>

                <Box width={'100%'}>
                  <TextField
                    label="Post Code"
                    type="text"
                    className="form-input"
                    InputProps={{ readOnly: true }}
                    value={farm?.farmAddress?.zipCode}
                    focused
                    sx={{
                      width: '100%',
                    }}
                  />
                </Box>
              </Stack>
              <Stack
                display={'flex'}
                justifyContent={'flex-start'}
                direction={'row'}
                sx={{
                  width: '100%',
                  marginBottom: 2,
                  gap: 1.5,
                }}
              >
                <Box width={'50%'}>
                  <TextField
                    label="Country"
                    type="text"
                    InputProps={{ readOnly: true }}
                    className="form-input"
                    value={farm?.farmAddress?.country}
                    focused
                    sx={{
                      width: '100%',
                    }}
                  />
                </Box>
              </Stack>
              <Stack
                sx={{
                  display: 'flex',
                  justifyContent: 'end',
                  gap: 2,
                  flexDirection: 'row',
                }}
              >
                {user?.permissions?.editOrganisation && (
                  <Button
                    variant="contained"
                    onClick={() => {
                      setCookie('activeStep', 0);
                      router.push(`/dashboard/farm/${farm?.id}`);
                    }}
                    sx={{
                      background: '#fff',
                      border: '1px solid #06A19B',
                      fontWeight: 600,
                      padding: '6px 16px',
                      width: 'fit-content',
                      textTransform: 'capitalize',
                      borderRadius: '8px',
                      marginTop: 2,
                      color: '#06A19B',
                    }}
                  >
                    Edit Farm
                  </Button>
                )}
              </Stack>
            </Grid>
          </Grid>
        </Stack>
      );
    })
  ) : (
    <EmptyFarm />
  );
};

export default FarmsInformation;
