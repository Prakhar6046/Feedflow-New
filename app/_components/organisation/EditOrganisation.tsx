'use client';
import * as validationPattern from '@/app/_lib/utils/validationPatterns/index';
import * as validationMessage from '@/app/_lib/utils/validationsMessage/index';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Select from '@mui/material/Select';

import {
  OrganisationType,
  PermissionType,
} from '@/app/_components/AddNewOrganisation';
import MapComponent, { AddressInfo } from '@/app/_components/farm/MapComponent';
import HatcheryForm from '@/app/_components/hatchery/HatcheryForm';
import Loader from '@/app/_components/Loader';
import { deleteImage, handleUpload } from '@/app/_lib/utils';
import {
  AddOrganizationFormInputs,
  OrganizationData,
  SingleOrganisation,
} from '@/app/_typeModels/Organization';
import sendEmailIcon from '@/public/static/img/ic-send-email.svg';
import sentEmailIcon from '@/public/static/img/ic-sent-email.svg';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import {
  Box,
  Button,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Stack,
  Tab,
  TextField,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  Controller,
  SubmitHandler,
  useFieldArray,
  useForm,
} from 'react-hook-form';
import toast from 'react-hot-toast';

import { SingleUser } from '@/app/_typeModels/User';
import { getCookie } from 'cookies-next';
import Image from 'next/image';
import FarmsInformation from './FarmsInformation';
export const VisuallyHiddenInput = styled('input')({
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
  organisationId: string;
  organisations: SingleOrganisation[];
  userRole: string;
  loggedUser: SingleUser;
};
const EditOrganisation = ({ organisationId, loggedUser }: Iprops) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [organisationData, setOrganisationData] = useState<OrganizationData>();
  const token = getCookie('auth-token');
  const [isHatcherySelected, setIsHatcherySelected] = useState<boolean>(false);
  const [altitude, setAltitude] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [profilePic, setProfilePic] = useState<string>();
  const [addressInformation, setAddressInformation] =
    useState<AddressInfo | null>();
  const [isApiCallInProgress, setIsApiCallInProgress] =
    useState<boolean>(false);
  const [useAddress, setUseAddress] = useState<boolean>(false);
  const [selectedView, setSelectedView] = useState<string>(
    'organisationInformation',
  );
  const [inviteSent, setInviteSent] = useState<{ [key: number]: boolean }>({});

  const handleInviteUser = (invite: boolean, index: number) => {
    if (!invite) {
      setInviteSent((prev) => {
        const newInviteState = !prev[index];
        setValue(`contacts.${index}.newInvite`, newInviteState);
        return {
          ...prev,
          [index]: newInviteState,
        };
      });
    }
  };

  const handleChange = (newValue: string) => {
    setSelectedView(newValue);
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set('tab', newValue);
    router.push(`?${newParams.toString()}`);
  };
  const getOrganisation = async () => {
    setLoading(true);
    const data = await fetch(`/api/organisation/${organisationId}`, {
      method: 'GET',
    });
    if (data) {
      setLoading(false);
    }
    return data.json();
  };

  const {
    register,
    setValue,
    handleSubmit,
    control,
    watch,
    trigger,
    formState: { errors },
  } = useForm<AddOrganizationFormInputs>({
    mode: 'onChange',
    defaultValues: {
      contacts: [
        {
          name: '',
          role: '',
          email: '',
          phone: '',
          permission: '',
          invite: false,
        },
      ],
    },
  });
  const selectedOrganisationType = watch('organisationType');
  const onSubmit: SubmitHandler<AddOrganizationFormInputs> = async (data) => {
    // Prevent API call if one is already in progress
    if (isApiCallInProgress) return;
    setIsApiCallInProgress(true);

    try {
      let hatchery;
      const address = {
        address: data.address,
        city: data.city,
        province: data.province,
        postCode: data.postCode,
        country: data.country,
      };
      if (isHatcherySelected) {
        hatchery = {
          name: data.hatcheryName,
          altitude: data.hatcheryAltitude,
          code: data.hatcheryCode,
          fishSpecie: data.fishSpecie,
        };
      }

      const formData = new FormData();
      formData.append('name', String(data.organisationName));
      formData.append('invitedBy', String(loggedUser?.organisationId));
      formData.append('organisationCode', String(data.organisationCode));
      formData.append('organisationType', String(data.organisationType));
      formData.append('address', JSON.stringify(address));
      formData.append('contacts', JSON.stringify(data.contacts));
      formData.append('imageUrl', String(profilePic));
      formData.append('invitedBy', String(loggedUser?.organisationId));

      if (isHatcherySelected && organisationData) {
        formData.append(
          'hatcheryId',
          JSON.stringify(organisationData?.hatchery[0]?.id ?? ''),
        );
        formData.append('hatchery', JSON.stringify(hatchery));
      }

      const res = await fetch(`/api/organisation/${organisationId}`, {
        method: 'PUT',

        body: formData,
      });

      if (res.ok) {
        const updatedOrganisation = await res.json();

        toast.success(updatedOrganisation.message);
        router.push('/dashboard/organisation');
      } else {
        const data = await res.json();
        toast.error(data.error);
      }
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsApiCallInProgress(false);
    }
  };
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'contacts',
  });
  const AddContactField = () => {
    const conatcts = watch('contacts');
    if (conatcts) {
      const lastContact = conatcts[conatcts.length - 1];
      if (
        lastContact &&
        lastContact.name &&
        lastContact.role &&
        lastContact.email &&
        lastContact.phone
      ) {
        append({
          name: '',
          role: '',
          email: '',
          phone: '',
          permission: '',
          invite: false,
          newInvite: false,
        });
      } else {
        toast.dismiss();
        toast.error('Please fill previous contact details.');
      }
    }
  };

  useEffect(() => {
    if (watch('organisationType') === 'Hatchery') {
      setIsHatcherySelected(true);
    } else {
      setIsHatcherySelected(false);
    }
  }, [watch('organisationType')]);
  useEffect(() => {
    if (addressInformation && useAddress && altitude) {
      setValue('address', addressInformation.address);
      setValue('city', addressInformation.city);
      setValue('postCode', addressInformation.postcode);
      setValue('province', addressInformation.state);
      setValue('country', addressInformation.country);

      setUseAddress(false);
    }
  }, [addressInformation, useAddress]);
  useEffect(() => {
    if (organisationId) {
      const organisation = async () => {
        const data = await getOrganisation();

        setOrganisationData(data.data);
      };
      organisation();
    }
  }, [organisationId]);

  useEffect(() => {
    if (organisationData) {
      setValue('organisationName', organisationData.name);
      setValue('organisationCode', organisationData.organisationCode);
      setValue('address', String(organisationData?.address?.name));
      setValue('city', String(organisationData.address?.city));
      setValue('country', String(organisationData.address?.country));
      setValue('province', String(organisationData.address?.province));
      setValue('postCode', String(organisationData.address?.postCode));
      setValue('country', organisationData?.address?.country);
      setValue('contacts', organisationData?.contact);
      setValue('organisationType', organisationData?.organisationType);
    }
  }, [organisationData]);

  if (loading) {
    return <Loader />;
  }
  return (
    <>
      <Box sx={{ width: '100%', typography: 'body1', mt: 5 }}>
        <TabContext value={String(selectedView)}>
          <Stack
            display={'flex'}
            rowGap={2}
            columnGap={5}
            mb={2}
            justifyContent={'space-between'}
            sx={{
              flexDirection: {
                md: 'row',
                xs: 'column',
              },
              alignItems: {
                md: 'center',
                xs: 'start',
              },
            }}
          >
            <Box>
              <TabList
                onChange={(_, value) => handleChange(value)}
                aria-label="lab API tabs example"
                className="production-tabs"
              >
                <Tab
                  label="Organisation Information"
                  value="organisationInformation"
                  className={
                    selectedView === 'organisationInformation'
                      ? 'active-tab'
                      : ''
                  }
                />
                <Tab
                  label="Farm Information"
                  value="farmInformation"
                  className={
                    selectedView === 'farmInformation' ? 'active-tab' : ''
                  }
                />
              </TabList>
            </Box>
          </Stack>
        </TabContext>
      </Box>
      {selectedView === 'organisationInformation' ? (
        <Stack
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
            Orgainsation Information
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
                  mt={'2px'}
                >
                  <Button
                    component="label"
                    variant="contained"
                    sx={{
                      background: '#06A19B',
                      color: '#fff',
                      fontWeight: 600,
                      padding: '4px',
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
                          id: organisationData?.id,
                          type: 'organisation',
                          image: organisationData?.image,
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
              <form onSubmit={handleSubmit(onSubmit)}>
                <Box width={'100%'} mb={2}>
                  <TextField
                    label="Organisation Name *"
                    type="text"
                    className="form-input"
                    focused
                    {...register('organisationName', {
                      required: true,
                      // validate: (value: String) => {
                      //   const isUnique = organisations?.every((val) => {
                      //     if (val.id === Number(organisationId)) {
                      //       return true;
                      //     }
                      //     return val.name.toLowerCase() !== value.toLowerCase();
                      //   });

                      //   return (
                      //     isUnique ||
                      //     "Please enter a unique name. The name you entered is not available."
                      //   );
                      // },
                    })}
                    // focused={userData?.data.name ? true : false}
                    // value={userData?.data.name}
                    sx={{
                      width: '100%',
                    }}
                  />

                  {errors &&
                    errors.organisationName &&
                    errors.organisationName.type === 'required' && (
                      <Typography
                        variant="body2"
                        color="red"
                        fontSize={13}
                        mt={0.5}
                      >
                        This field is required.
                      </Typography>
                    )}
                  {errors?.organisationName?.type === 'validate' && (
                    <Typography
                      variant="body2"
                      color="red"
                      fontSize={13}
                      mt={0.5}
                    >
                      {errors?.organisationName?.message}
                    </Typography>
                  )}
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
                      label="Organisation Code *"
                      type="text"
                      InputProps={{ readOnly: true }}
                      className="form-input"
                      {...register('organisationCode', {
                        required: true,
                      })}
                      // disabled
                      sx={{
                        width: '100%',
                      }}
                      focused
                    />
                    {errors &&
                      errors.organisationCode &&
                      errors.organisationCode.type === 'required' && (
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
                </Stack>
                <FormControl className="form-input" fullWidth focused>
                  <InputLabel id="demo-simple-select-label">
                    Organisation Type *
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="   Organisation Type *"
                    {...register('organisationType')}
                    disabled
                    value={selectedOrganisationType || ''}
                    // onChange={(e) => handleChange(e, item)}
                  >
                    {OrganisationType.map((organisation, i) => {
                      return (
                        <MenuItem value={organisation} key={i}>
                          {organisation}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
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
                      label="Address *"
                      type="text"
                      className="form-input"
                      {...register('address', {
                        required: true,
                      })}
                      focused
                      sx={{
                        width: '100%',
                      }}
                    />
                    {errors &&
                      errors.address &&
                      errors.address.type === 'required' && (
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

                  <Box width={'100%'}>
                    <TextField
                      label="City *"
                      type="text"
                      className="form-input"
                      {...register('city', {
                        required: true,
                      })}
                      focused
                      sx={{
                        width: '100%',
                      }}
                    />
                    {errors &&
                      errors.city &&
                      errors.city.type === 'required' && (
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
                      label="Province *"
                      type="text"
                      className="form-input"
                      {...register('province', {
                        required: true,
                      })}
                      focused
                      sx={{
                        width: '100%',
                      }}
                    />

                    {errors &&
                      errors.province &&
                      errors.province.type === 'required' && (
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

                  <Box width={'100%'}>
                    <TextField
                      label="Post Code *"
                      type="text"
                      className="form-input"
                      {...register('postCode', {
                        required: true,
                        pattern: validationPattern.onlyNumbersPattern,
                        maxLength: 10,
                      })}
                      focused
                      sx={{
                        width: '100%',
                      }}
                    />
                    {errors &&
                      errors.postCode &&
                      errors.postCode.type === 'required' && (
                        <Typography
                          variant="body2"
                          color="red"
                          fontSize={13}
                          mt={0.5}
                        >
                          This field is required.
                        </Typography>
                      )}

                    {errors &&
                      errors.postCode &&
                      errors.postCode.type === 'pattern' && (
                        <Typography
                          variant="body2"
                          color="red"
                          fontSize={13}
                          mt={0.5}
                        >
                          {validationMessage.onlyNumbers}
                        </Typography>
                      )}
                    {errors &&
                      errors.postCode &&
                      errors.postCode.type === 'maxLength' && (
                        <Typography
                          variant="body2"
                          color="red"
                          fontSize={13}
                          mt={0.5}
                        >
                          {validationMessage.numberMaxLength}
                        </Typography>
                      )}
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
                      label="Country *"
                      type="text"
                      className="form-input"
                      {...register('country', {
                        required: true,
                      })}
                      focused
                      sx={{
                        width: '100%',
                      }}
                    />
                    {errors &&
                      errors.country &&
                      errors.country.type === 'required' && (
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
                </Stack>
                <Box display={'flex'} justifyContent={'end'} width={'100%'}>
                  <MapComponent
                    setAddressInformation={setAddressInformation}
                    setUseAddress={setUseAddress}
                    isCalAltitude={true}
                    setAltitude={setAltitude}
                    token={token ?? ''}
                  />
                </Box>

                <Typography
                  variant="subtitle1"
                  fontWeight={500}
                  color="black"
                  fontSize={16}
                  marginTop={3}
                  marginBottom={2}
                >
                  Feedflow Managers
                </Typography>

                {fields.map((item, index) => (
                  <Stack
                    key={item.id}
                    display={'flex'}
                    direction={'row'}
                    sx={{
                      width: '100%',
                      marginBottom: 2,
                      gap: 1.5,
                      justifyContent: {
                        md: 'center',
                      },
                      flexWrap: {
                        lg: 'nowrap',
                        xs: 'wrap',
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: {
                          lg: '100%',
                          md: '48.4%',
                          xs: '100%',
                        },
                      }}
                    >
                      <TextField
                        label="Name *"
                        type="text"
                        className="form-input"
                        {...register(`contacts.${index}.name` as const, {
                          required: true,
                        })}
                        focused
                        sx={{
                          width: '100%',
                        }}
                      />
                      {errors &&
                        errors?.contacts &&
                        errors?.contacts[index] &&
                        errors?.contacts[index]?.name &&
                        errors?.contacts[index]?.name.type === 'required' && (
                          <Typography
                            variant="body2"
                            color="red"
                            fontSize={13}
                            mt={0.5}
                          >
                            {validationMessage.required}
                          </Typography>
                        )}
                    </Box>
                    <Box
                      sx={{
                        width: {
                          lg: '100%',
                          md: '48.4%',
                          xs: '100%',
                        },
                      }}
                    >
                      <FormControl className="form-input" fullWidth focused>
                        <InputLabel id="demo-simple-select-label">
                          Permission *
                        </InputLabel>
                        <Controller
                          name={`contacts.${index}.permission`}
                          control={control}
                          rules={{
                            required: true,
                            // validate: (value) => {
                            //   if (value === "Admin") {
                            //     watch("contacts").forEach((_, idx) => {
                            //       clearErrors(`contacts.${idx}.role`);
                            //     });
                            //     return true;
                            //   }
                            //   const hasAdmin = watch("contacts").some(
                            //     (contact) => contact.role === "Admin"
                            //   );

                            //   if (!hasAdmin) {
                            //     return "Please add an admin first, then add a member.";
                            //   }
                            //   return true;
                            // },
                          }}
                          render={({ field }) => (
                            <Select
                              labelId="demo-simple-select-label"
                              id="demo-simple-select"
                              label="Permission *"
                              {...field}
                            >
                              {PermissionType.map((permission, i) => (
                                <MenuItem value={permission.value} key={i}>
                                  {permission.label}
                                </MenuItem>
                              ))}
                            </Select>
                          )}
                        />
                      </FormControl>
                      {errors &&
                        errors?.contacts &&
                        errors?.contacts[index] &&
                        errors?.contacts[index]?.permission &&
                        errors?.contacts[index]?.permission.type ===
                          'required' && (
                          <Typography
                            variant="body2"
                            color="red"
                            fontSize={13}
                            mt={0.5}
                          >
                            {validationMessage.required}
                          </Typography>
                        )}
                    </Box>
                    <Box
                      sx={{
                        width: {
                          lg: '100%',
                          md: '48.4%',
                          xs: '100%',
                        },
                      }}
                    >
                      <TextField
                        label="Role *"
                        type="text"
                        className="form-input"
                        {...register(`contacts.${index}.role` as const, {
                          required: true,
                          pattern: validationPattern.addressPattern,
                        })}
                        focused
                        sx={{
                          width: '100%',
                        }}
                      />
                      {errors &&
                        errors?.contacts &&
                        errors?.contacts[index] &&
                        errors?.contacts[index]?.role &&
                        errors?.contacts[index]?.role.type === 'required' && (
                          <Typography
                            variant="body2"
                            color="red"
                            fontSize={13}
                            mt={0.5}
                          >
                            {validationMessage.required}
                          </Typography>
                        )}
                    </Box>

                    <Box
                      sx={{
                        width: {
                          lg: '100%',
                          md: '48.4%',
                          xs: '100%',
                        },
                      }}
                    >
                      <TextField
                        label="Email *"
                        type="email"
                        className="form-input"
                        {...register(`contacts.${index}.email` as const, {
                          required: true,
                          pattern: validationPattern.emailPattern,
                          validate: (value) => {
                            const isUnique = fields.every(
                              (f, i) =>
                                i === index ||
                                String(f.email).toLowerCase() !==
                                  String(value).toLowerCase(),
                            );
                            if (!isUnique) {
                              return 'Please enter a unique email.This email is already used in contacts information';
                            }

                            return true;
                          },
                        })}
                        focused
                        sx={{
                          width: '100%',
                        }}
                      />
                      {errors &&
                        errors?.contacts &&
                        errors?.contacts[index] &&
                        errors?.contacts[index]?.email &&
                        errors?.contacts[index]?.email.type === 'required' && (
                          <Typography
                            variant="body2"
                            color="red"
                            fontSize={13}
                            mt={0.5}
                          >
                            {validationMessage.required}
                          </Typography>
                        )}
                      {errors &&
                        errors?.contacts &&
                        errors?.contacts[index] &&
                        errors?.contacts[index]?.email &&
                        errors?.contacts[index]?.email.type === 'pattern' && (
                          <Typography
                            variant="body2"
                            color="red"
                            fontSize={13}
                            mt={0.5}
                          >
                            {validationMessage.emailPatternMessage}
                          </Typography>
                        )}
                      {errors &&
                        errors?.contacts &&
                        errors?.contacts[index] &&
                        errors?.contacts[index]?.email &&
                        errors?.contacts[index]?.email.type === 'validate' && (
                          <Typography
                            variant="body2"
                            color="red"
                            fontSize={13}
                            mt={0.5}
                          >
                            {errors?.contacts[index]?.email.message}
                          </Typography>
                        )}
                    </Box>

                    <Box
                      sx={{
                        width: {
                          lg: '100%',
                          md: '48.4%',
                          xs: '100%',
                        },
                      }}
                    >
                      <TextField
                        label="Phone *"
                        type="text"
                        className="form-input"
                        {...register(`contacts.${index}.phone` as const, {
                          required: true,
                          pattern: validationPattern.phonePattern,
                        })}
                        focused
                        sx={{
                          width: '100%',
                        }}
                      />
                      {errors &&
                        errors?.contacts &&
                        errors?.contacts[index] &&
                        errors?.contacts[index]?.phone &&
                        errors?.contacts[index]?.phone.type === 'required' && (
                          <Typography
                            variant="body2"
                            color="red"
                            fontSize={13}
                            mt={0.5}
                          >
                            {validationMessage.required}
                          </Typography>
                        )}
                      {errors &&
                        errors?.contacts &&
                        errors?.contacts[index] &&
                        errors?.contacts[index]?.phone &&
                        errors?.contacts[index]?.phone.type === 'pattern' && (
                          <Typography
                            variant="body2"
                            color="red"
                            fontSize={13}
                            mt={0.5}
                          >
                            {validationMessage.phonePatternMessage}
                          </Typography>
                        )}
                    </Box>

                    <Box
                      display={'flex'}
                      justifyContent={'center'}
                      alignItems={'center'}
                      onClick={() =>
                        handleInviteUser(Boolean(item.invite), index)
                      }
                    >
                      <Image
                        title={item.invite ? 'Invited' : 'Invite'}
                        src={
                          item.invite
                            ? sentEmailIcon
                            : inviteSent[index]
                              ? sentEmailIcon
                              : sendEmailIcon
                        }
                        alt="Send Email Icon"
                        style={{
                          cursor: item.invite ? 'not-allowed' : 'pointer',
                        }}
                      />
                    </Box>
                    <Box
                      display={'flex'}
                      justifyContent={'center'}
                      alignItems={'center'}
                      width={150}
                      sx={{
                        cursor: `  ${
                          item.role !== 'Admin' ? 'pointer' : 'not-allowed'
                        }`,
                        width: {
                          lg: 150,
                          xs: 'auto',
                        },
                      }}
                      onClick={() =>
                        item.permission !== 'ADMIN' && remove(index)
                      }
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="1.4em"
                        height="1.4em"
                        viewBox="0 0 24 24"
                      >
                        <g fill="none">
                          <path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z" />
                          <path
                            fill={`${
                              item.permission !== 'ADMIN'
                                ? '#ff0000'
                                : '#808080'
                            }`}
                            d="M14.28 2a2 2 0 0 1 1.897 1.368L16.72 5H20a1 1 0 1 1 0 2l-.003.071l-.867 12.143A3 3 0 0 1 16.138 22H7.862a3 3 0 0 1-2.992-2.786L4.003 7.07L4 7a1 1 0 0 1 0-2h3.28l.543-1.632A2 2 0 0 1 9.721 2zm3.717 5H6.003l.862 12.071a1 1 0 0 0 .997.929h8.276a1 1 0 0 0 .997-.929zM10 10a1 1 0 0 1 .993.883L11 11v5a1 1 0 0 1-1.993.117L9 16v-5a1 1 0 0 1 1-1m4 0a1 1 0 0 1 1 1v5a1 1 0 1 1-2 0v-5a1 1 0 0 1 1-1m.28-6H9.72l-.333 1h5.226z"
                          />
                        </g>
                      </svg>
                    </Box>
                  </Stack>
                ))}

                <Divider
                  sx={{
                    borderColor: '#979797',
                    my: 1,
                  }}
                />

                <Stack
                  p={1.5}
                  direction={'row'}
                  borderRadius={3}
                  mt={2}
                  color={'#06a19b'}
                  fontSize={14}
                  fontWeight={500}
                  display={'flex'}
                  alignItems={'center'}
                  justifyContent={'center'}
                  gap={0.5}
                  border={'2px dashed #06a19b'}
                  className="add-contact-btn"
                  onClick={() => AddContactField()}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="1.4em"
                    height="1.4em"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="#06a19b"
                      d="M12 4c4.411 0 8 3.589 8 8s-3.589 8-8 8s-8-3.589-8-8s3.589-8 8-8m0-2C6.477 2 2 6.477 2 12s4.477 10 10 10s10-4.477 10-10S17.523 2 12 2m5 9h-4V7h-2v4H7v2h4v4h2v-4h4z"
                    />
                  </svg>
                  Add Contact
                </Stack>

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
                    marginTop: 2,
                  }}
                >
                  Save Changes
                </Button>
              </form>
            </Grid>
          </Grid>
        </Stack>
      ) : (
        <FarmsInformation
          organisationData={organisationData}
          profilePic={profilePic ?? ''}
          altitude={altitude}
          handleUpload={handleUpload}
          isHatcherySelected={isHatcherySelected}
          register={register}
          setProfilePic={setProfilePic}
          setValue={setValue}
          trigger={trigger}
          watch={watch}
          errors={errors}
        />
      )}
    </>
  );
};

export default EditOrganisation;
