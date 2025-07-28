import * as validationPattern from '@/app/_lib/utils/validationPatterns/index';
import * as validationMessage from '@/app/_lib/utils/validationsMessage/index';
import { Farm } from '@/app/_typeModels/Farm';
import { farmAction } from '@/lib/features/farm/farmSlice';
import { useAppDispatch } from '@/lib/hooks';
import { SelectChangeEvent } from '@mui/material/Select'; // if you're using MUI's Select
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  // Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import Select from '@mui/material/Select';
import { NextPage } from 'next';

import { getLocalItem, setLocalItem } from '@/app/_lib/utils';
import { SingleUser } from '@/app/_typeModels/User';
import { getCookie } from 'cookies-next';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import Loader from '../Loader';
import { AddressInfo } from './MapComponent';
const MapComponent = dynamic(() => import('./MapComponent'), { ssr: false });
interface Props {
  editFarm?: Farm;
  setActiveStep: (val: number) => void;
  farmMembers: SingleUser[];
  farms: Farm[];
}

const FarmInformation: NextPage<Props> = ({
  setActiveStep,
  editFarm,
  farmMembers,
  farms,
}: Props) => {
  const dispatch = useAppDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    control,
    clearErrors,
  } = useForm<Farm>({ mode: 'onChange' });
  const loggedUser = getCookie('logged-user');

  const user = JSON.parse(loggedUser ?? '');

  const [altitude, setAltitude] = useState<string>('');
  const [lat, setLat] = useState<string>('');
  const [lng, setLng] = useState<string>('');
  const [formData, setFormData] = useState<Farm>();
  const [addressInformation, setAddressInformation] =
    useState<AddressInfo | null>();
  const [useAddress, setUseAddress] = useState<boolean>(false);
  const [fishFarmers, setFishFarmers] = useState<Farm[]>();
  const [loading, setLoading] = useState<boolean>(false);
  const selectedManagerIds = watch('mangerId') || [];
  const watchFishFarmer = watch('fishFarmer');
  const isEditFarm = getCookie('isEditFarm');
  const token = getCookie('auth-token');

  const handleChange = (event: SelectChangeEvent<any>) => {
    const {
      target: { value },
    } = event;
    setValue('mangerId', value);
  };
  const getFarmers = async () => {
    const response = await fetch('/api/farm/fish-farmers', {
      method: 'GET',
    });
    return response.json();
  };
  const onSubmit: SubmitHandler<Farm> = (data) => {
    dispatch(farmAction.updateFarm(data));
    setLocalItem('farmData', data);
    setActiveStep(1);
  };
  useEffect(() => {
    if (editFarm && !formData) {
      setValue('name', editFarm?.name);
      setValue(
        'farmAltitude',
        String(Number(editFarm?.farmAltitude).toFixed(2)),
      );
      setValue('addressLine1', editFarm?.farmAddress?.addressLine1 ?? '');
      setValue('addressLine2', editFarm?.farmAddress?.addressLine2 || '');
      setValue('city', editFarm?.farmAddress?.city ?? '');
      setValue('country', editFarm?.farmAddress?.country ?? '');
      setValue('zipCode', editFarm?.farmAddress?.zipCode ?? '');
      setValue('province', editFarm?.farmAddress?.province ?? '');
      setValue('fishFarmer', editFarm?.fishFarmer);
      setValue('lat', String(Number(editFarm?.lat).toFixed(2)));
      setValue('lng', String(Number(editFarm?.lng).toFixed(2)));
      if (editFarm.FarmManger) {
        const managerIds: string[] = [];
        editFarm.FarmManger.map((user: { userId: number }) => {
          if (user.userId) {
            managerIds.push(String(user.userId));
          }
        });
        setValue('mangerId', managerIds);
      }
    }
  }, [editFarm, formData]);

  useEffect(() => {
    if (formData && Object.keys(formData).length) {
      const data = formData;
      setValue('name', data?.name);
      setValue('farmAltitude', data?.farmAltitude);
      setValue('addressLine1', data?.addressLine1);
      setValue('addressLine2', data?.addressLine2 || '');
      setValue('city', data?.city);
      setValue('country', data?.country);
      setValue('zipCode', data?.zipCode);
      setValue('province', data?.province);
      setValue('fishFarmer', data?.fishFarmer);
      setValue('lat', data?.lat);
      setValue('lng', data?.lng);
      setValue('mangerId', data?.mangerId);
    }
  }, [formData, setValue]);
  useEffect(() => {
    if (addressInformation && useAddress) {
      if (addressInformation.address) clearErrors('addressLine1');
      if (addressInformation.address2) clearErrors('addressLine2');
      if (addressInformation.city) clearErrors('city');
      if (addressInformation.country) clearErrors('country');
      if (addressInformation.postcode) clearErrors('zipCode');
      if (addressInformation.state) clearErrors('province');

      setValue('addressLine1', addressInformation.address);
      setValue('addressLine2', addressInformation.address2);
      setValue('city', addressInformation.city);
      setValue('country', addressInformation.country);
      setValue('zipCode', addressInformation.postcode);
      setValue('province', addressInformation.state);

      setUseAddress(false);
    }
  }, [addressInformation, useAddress]);
  useEffect(() => {
    if (altitude || lat || lng) {
      setValue('farmAltitude', String(Number(altitude)?.toFixed(2)));
      setValue('lat', String(Number(lat)?.toFixed(2)));
      setValue('lng', String(Number(lng)?.toFixed(2)));
    }
  }, [altitude, setValue, lat, lng]);

  useEffect(() => {
    setLoading(true);
    const getFeedSupplyer = async () => {
      const res = await getFarmers();
      setFishFarmers(res.data);
      setLoading(false);
    };
    getFeedSupplyer();

    if (typeof window !== 'undefined') {
      const formData = getLocalItem('farmData');
      setFormData(formData);
    }
  }, []);

  if (loading) {
    return <Loader />;
  }
  return (
    <Stack>
      <Typography
        variant="h6"
        fontWeight={700}
        sx={{
          fontSize: {
            md: 24,
            xs: 20,
          },
          marginBottom: 2,
        }}
      >
        Farm Informations
      </Typography>

      <Box>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box mb={2} width={'100%'}>
            <TextField
              label="Farm Name *"
              type="text"
              className="form-input"
              {...register('name', {
                required: true,
                // validate: (value: string) => {
                //   const isUnique = farms?.every((val) => {
                //     if (editFarm && val.id === editFarm.id) {
                //       return true;
                //     }
                //     return val.name.toLowerCase() !== value.toLowerCase();
                //   });

                //   return (
                //     isUnique ||
                //     'Please enter a unique farm name. The farm name you entered is not available.'
                //   );
                // },
                maxLength: {
                  value: 150,
                  message: 'Input can contain a maximum of 150 characters.',
                },
              })}
              focused
              sx={{
                width: '100%',
              }}
            />

            {errors && errors.name && errors.name && (
              <Typography variant="body2" color="red" fontSize={13} mt={0.5}>
                {errors.name.type === 'required'
                  ? validationMessage.required
                  : errors?.name.message}
              </Typography>
            )}
          </Box>
          <Box mb={2} width={'100%'}>
            <Box position={'relative'}>
              <TextField
                label="Farm Altitude *"
                type="text"
                className="form-input"
                // focused={altitude ? true : false}
                {...register('farmAltitude', {
                  required: true,
                  pattern: validationPattern.numbersWithDot,
                  maxLength: 10,
                })}
                focused
                sx={{
                  width: '100%',
                }}
              />
              <Typography
                variant="body1"
                color="#555555AC"
                sx={{
                  position: 'absolute',
                  right: 13,
                  top: '30%',
                  backgroundColor: 'white',
                  paddingInline: '5px',
                }}
              >
                m
              </Typography>
            </Box>
            {errors &&
              errors.farmAltitude &&
              errors.farmAltitude.type === 'required' && (
                <Typography variant="body2" color="red" fontSize={13} mt={0.5}>
                  {validationMessage.required}
                </Typography>
              )}
            {errors &&
              errors.farmAltitude &&
              errors.farmAltitude.type === 'pattern' && (
                <Typography variant="body2" color="red" fontSize={13} mt={0.5}>
                  {validationMessage.onlyNumbers}
                </Typography>
              )}
            {errors &&
              errors.farmAltitude &&
              errors.farmAltitude.type === 'maxLength' && (
                <Typography variant="body2" color="red" fontSize={13} mt={0.5}>
                  {validationMessage.numberMaxLength}
                </Typography>
              )}
          </Box>
          <Box mb={2} width={'100%'}>
            <TextField
              label="Farm Latitude *"
              type="text"
              className="form-input"
              {...register('lat', {
                required: true,
                pattern: validationPattern.negativeNumberWithDot,
                maxLength: 10,
              })}
              focused
              sx={{
                width: '100%',
              }}
            />

            {errors && errors.lat && errors.lat.type === 'required' && (
              <Typography variant="body2" color="red" fontSize={13} mt={0.5}>
                {validationMessage.required}
              </Typography>
            )}
            {errors && errors.lat && errors.lat.type === 'pattern' && (
              <Typography variant="body2" color="red" fontSize={13} mt={0.5}>
                {validationMessage.NegativeNumberWithDot}
              </Typography>
            )}
            {errors && errors.lat && errors.lat.type === 'maxLength' && (
              <Typography variant="body2" color="red" fontSize={13} mt={0.5}>
                {validationMessage.numberMaxLength}
              </Typography>
            )}
          </Box>{' '}
          <Box mb={2} width={'100%'}>
            <TextField
              label="Farm Longitude *"
              type="text"
              className="form-input"
              {...register('lng', {
                required: true,
                pattern: validationPattern.negativeNumberWithDot,
                maxLength: 10,
              })}
              focused
              sx={{
                width: '100%',
              }}
            />

            {errors && errors.lng && errors.lng.type === 'required' && (
              <Typography variant="body2" color="red" fontSize={13} mt={0.5}>
                {validationMessage.required}
              </Typography>
            )}
            {errors && errors.lng && errors.lng.type === 'pattern' && (
              <Typography variant="body2" color="red" fontSize={13} mt={0.5}>
                {validationMessage.NegativeNumberWithDot}
              </Typography>
            )}
            {errors && errors.lng && errors.lng.type === 'pattern' && (
              <Typography variant="body2" color="red" fontSize={13} mt={0.5}>
                {validationMessage.numberMaxLength}
              </Typography>
            )}
          </Box>
          <Box mb={2} width={'100%'}>
            <FormControl fullWidth className="form-input" focused>
              <InputLabel id="feed-supply-select-label1">
                Fish Producer *
              </InputLabel>
              <Select
                labelId="feed-supply-select-label1"
                id="feed-supply-select1"
                {...register('fishFarmer', {
                  required: true,
                  onChange: (e) => setValue('fishFarmer', e.target.value),
                })}
                label="Fish Producer *"
                value={watchFishFarmer || ''}
              >
                {fishFarmers?.map((fish) => {
                  return (
                    <MenuItem value={String(fish.id)} key={fish.id}>
                      {fish.name}
                    </MenuItem>
                  );
                })}
              </Select>
              {errors &&
                errors.fishFarmer &&
                errors.fishFarmer.type === 'required' && (
                  <Typography
                    variant="body2"
                    color="red"
                    fontSize={13}
                    mt={0.5}
                  >
                    {validationMessage.required}
                  </Typography>
                )}
            </FormControl>
          </Box>
          <Box mb={2} width={'100%'}>
            <FormControl fullWidth className="form-input" focused>
              <InputLabel id="feed-supply-select-label1">Manager</InputLabel>
              <Controller
                name="mangerId"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    multiple
                    labelId="demo-multiple-name-label1"
                    id="demo-multiple-name"
                    disabled={isEditFarm === 'true' ? true : false}
                    label="Manager"
                    value={selectedManagerIds}
                    onChange={handleChange}
                    renderValue={(selected) =>
                      selected &&
                      selected.length &&
                      selected
                        .map((id: string) => {
                          const member = farmMembers.find(
                            (mem) => String(mem.id) === id,
                          );
                          return member?.name || '';
                        })
                        .join(', ')
                    } // Displays selected items as comma-separated values
                  >
                    {farmMembers?.filter((mem) => mem.id !== user.id).length ? (
                      farmMembers
                        .filter((mem) => mem.id !== user.id)
                        .map((member) => {
                          return (
                            <MenuItem
                              value={String(member.id)}
                              key={String(member.id)}
                            >
                              <Checkbox
                                checked={selectedManagerIds.includes(
                                  String(member.id),
                                )}
                              />
                              {member.name}
                            </MenuItem>
                          );
                        })
                    ) : (
                      <MenuItem disabled>No member found</MenuItem>
                    )}
                  </Select>
                )}
              />
            </FormControl>

            <Typography variant="body2" color="#555555;" marginBlock={2}>
              Choose your farm manager
            </Typography>
          </Box>
          <Box
            sx={{
              position: 'relative',
              top: '66px',
            }}
            display={'flex'}
            justifyContent={'end'}
            // alignItems={"center"}
            // gap={2}
            // flexWrap={"wrap"}
            width={'100%'}
          >
            <MapComponent
              setAddressInformation={setAddressInformation}
              setAltitude={setAltitude}
              setLat={setLat}
              setLng={setLng}
              clearErrors={clearErrors}
              setUseAddress={setUseAddress}
              isCalAltitude={true}
              token={token ?? ''}
            />
          </Box>
          <Box>
            <Typography
              variant="subtitle1"
              color="black"
              fontWeight={500}
              marginTop={3}
              marginBottom={2}
            >
              Address
            </Typography>

            <Typography variant="body2" color="#555555">
              You can do an address lookup to the right
            </Typography>
          </Box>
          <Grid container spacing={2} mt={0}>
            <Grid item md={6} xs={12}>
              <Box>
                <TextField
                  label="Address Line 1 *"
                  type="text"
                  className="form-input"
                  {...register('addressLine1', {
                    required: addressInformation?.address ? false : true,
                  })}
                  focused
                  sx={{
                    width: '100%',
                  }}
                />
                {errors &&
                  errors.addressLine1 &&
                  errors.addressLine1.type === 'required' &&
                  !addressInformation?.address && (
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
            </Grid>

            <Grid item md={6} xs={12}>
              <TextField
                label="Address Line 2 "
                type="text"
                className="form-input"
                {...register('addressLine2')}
                focused
                sx={{
                  width: '100%',
                }}
              />
            </Grid>

            <Grid item md={6} xs={12}>
              <Box>
                <TextField
                  label="City *"
                  type="text"
                  id="city"
                  className="form-input"
                  {...register('city', {
                    required: true,
                    pattern:
                      validationPattern.alphabetsSpacesAndSpecialCharsPattern,
                  })}
                  focused
                  sx={{
                    width: '100%',
                  }}
                />
                {errors && errors.city && errors.city.type === 'required' && (
                  <Typography
                    variant="body2"
                    color="red"
                    fontSize={13}
                    mt={0.5}
                  >
                    {validationMessage.required}
                  </Typography>
                )}
                {errors && errors.city && errors.city.type === 'pattern' && (
                  <Typography
                    variant="body2"
                    color="red"
                    fontSize={13}
                    mt={0.5}
                  >
                    {validationMessage.alphabetswithSpecialCharacter}
                  </Typography>
                )}
              </Box>
            </Grid>

            <Grid item md={6} xs={12}>
              <Box>
                <TextField
                  label="State/Province *"
                  type="text"
                  className="form-input"
                  {...register('province', {
                    required: true,
                    pattern:
                      validationPattern.alphabetsSpacesAndSpecialCharsPattern,
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
                      {validationMessage.required}
                    </Typography>
                  )}
                {errors &&
                  errors.province &&
                  errors.province.type === 'pattern' && (
                    <Typography
                      variant="body2"
                      color="red"
                      fontSize={13}
                      mt={0.5}
                    >
                      {validationMessage.alphabetswithSpecialCharacter}
                    </Typography>
                  )}
              </Box>
            </Grid>

            <Grid item md={6} xs={12}>
              <Box>
                <TextField
                  label="Zip Code *"
                  type="text"
                  className="form-input"
                  {...register('zipCode', {
                    required: true,
                    pattern: validationPattern.onlyNumbersPattern,
                  })}
                  focused
                  sx={{
                    width: '100%',
                  }}
                />
                {errors &&
                  errors.zipCode &&
                  errors.zipCode.type === 'required' && (
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
                  errors.zipCode &&
                  errors.zipCode.type === 'pattern' && (
                    <Typography
                      variant="body2"
                      color="red"
                      fontSize={13}
                      mt={0.5}
                    >
                      {validationMessage.onlyNumbers}
                    </Typography>
                  )}
              </Box>
            </Grid>

            <Grid item md={6} xs={12}>
              <Box></Box>

              <Box>
                <TextField
                  label="Country *"
                  type="text"
                  className="form-input"
                  {...register('country', {
                    required: true,
                    pattern:
                      validationPattern.alphabetsSpacesAndSpecialCharsPattern,
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
                      {validationMessage.required}
                    </Typography>
                  )}
                {errors &&
                  errors.country &&
                  errors.country.type === 'pattern' && (
                    <Typography
                      variant="body2"
                      color="red"
                      fontSize={13}
                      mt={0.5}
                    >
                      {validationMessage.alphabetswithSpecialCharacter}
                    </Typography>
                  )}
              </Box>
            </Grid>
          </Grid>
          <Box
            display={'flex'}
            justifyContent={'flex-end'}
            alignItems={'center'}
            gap={3}
            mt={1}
          >
            <Button
              type="submit"
              variant="contained"
              sx={{
                background: '#06A19B',
                fontWeight: 600,
                padding: '6px 16px',
                width: 'fit-content',
                textTransform: 'capitalize',
                borderRadius: '8px',
              }}
            >
              Next
            </Button>
          </Box>
        </form>
      </Box>
    </Stack>
  );
};

export default FarmInformation;
