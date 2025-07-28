import { nutritionalGuarantee } from '@/app/_lib/utils';
import * as validationPattern from '@/app/_lib/utils/validationPatterns/index';
import * as validationMessage from '@/app/_lib/utils/validationsMessage/index';
import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import {
  FieldErrors,
  UseFormRegister,
  UseFormWatch,
  UseFormSetValue,
  UseFormTrigger,
  UseFormClearErrors,
} from 'react-hook-form';
import { FormInputs } from './NewFeed';

interface Iprops {
  register: UseFormRegister<FormInputs>;
  errors: FieldErrors<FormInputs>;
  watch: UseFormWatch<FormInputs>;
  setValue: UseFormSetValue<FormInputs>;
  trigger: UseFormTrigger<FormInputs>;
  clearErrors: UseFormClearErrors<FormInputs>;
}
const NutritionalGuarantee = ({
  register,
  errors,
  watch,
  setValue,
  trigger,
  clearErrors,
}: Iprops) => {
  return (
    <Stack>
      <Typography
        variant="h6"
        fontWeight={700}
        sx={{
          fontSize: {
            md: 20,
            xs: 18,
          },
          marginBottom: 3,
          marginTop: 5,
        }}
      >
        Nutritional Guarantee
      </Typography>

      <Box
        sx={{
          borderRadius: 3,
          boxShadow: '0px 0px 16px 5px #0000001A',
          padding: 3,
        }}
      >
        <Grid container rowSpacing={2} columnSpacing={2}>
          <Grid
            item
            xl={6}
            xs={12}
            sx={{
              display: 'flex',
              gap: 1.5,
              minWidth: '200px',
              overflowX: 'auto',
              pb: 1.5,
            }}
          >
            {' '}
            <Typography
              variant="subtitle1"
              fontWeight={600}
              sx={{
                minWidth: '14px',
                position: 'relative',
                top: '10px',
              }}
            >
              1.{' '}
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Box
                  // display={"flex"}
                  // gap={2}
                  // alignItems={"center"}
                  position={'relative'}
                >
                  <TextField
                    label="Moisture *"
                    type="text"
                    className="form-input"
                    {...register('nutritionalGuarantee.moisture.kg', {
                      required: true,
                      pattern: validationPattern.numbersWithDot,
                      maxLength: 10,
                    })}
                    focused
                    sx={{
                      width: '100%',
                    }}
                  />
                  {errors &&
                    errors?.nutritionalGuarantee?.moisture?.kg &&
                    errors.nutritionalGuarantee.moisture.kg.type ===
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
                  {errors &&
                    errors?.nutritionalGuarantee?.moisture?.kg &&
                    errors?.nutritionalGuarantee?.moisture?.kg.type ===
                      'pattern' && (
                      <Typography
                        variant="body2"
                        color="red"
                        fontSize={13}
                        mt={0.5}
                      >
                        {validationMessage.OnlyNumbersWithDot}
                      </Typography>
                    )}
                  {errors &&
                    errors?.nutritionalGuarantee?.moisture?.kg &&
                    errors?.nutritionalGuarantee?.moisture?.kg.type ===
                      'maxLength' && (
                      <Typography
                        variant="body2"
                        color="red"
                        fontSize={13}
                        mt={0.5}
                      >
                        {validationMessage.numberMaxLength}
                      </Typography>
                    )}
                  <Typography
                    variant="body1"
                    color="#555555AC"
                    sx={{
                      position: 'absolute',
                      right: 6,
                      top: errors?.nutritionalGuarantee?.crudeProtein?.kg
                        ? '30px'
                        : '30px',
                      transform: 'translate(-6px, -50%)',
                      backgroundColor: '#fff',
                      height: 30,
                      display: 'grid',
                      placeItems: 'center',
                      zIndex: 1,
                      pl: 1,
                    }}
                  >
                    g/kg
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Box width={'100%'}>
                  <FormControl
                    fullWidth
                    className="form-input"
                    sx={{
                      minWidth: 110,
                    }}
                    focused
                  >
                    <InputLabel id="feed-supply-select-label10">
                      Min *
                    </InputLabel>
                    <Select
                      labelId="feed-supply-select-label10"
                      id="feed-supply-select10"
                      {...register('nutritionalGuarantee.moisture.value', {
                        required: true,
                      })}
                      label="Min *"
                      value={watch('nutritionalGuarantee.moisture.value') || ''}
                      onChange={(e) => {
                        setValue(
                          'nutritionalGuarantee.moisture.value',
                          e.target.value,
                        );
                        trigger('nutritionalGuarantee.moisture.value');
                      }}
                    >
                      {nutritionalGuarantee.map((guarantee, i) => {
                        return (
                          <MenuItem value={guarantee} key={i}>
                            {guarantee}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                  {errors &&
                    errors?.nutritionalGuarantee?.moisture?.value &&
                    errors?.nutritionalGuarantee?.moisture?.value.type ===
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
              </Grid>
            </Grid>
            {!watch('nutritionalGuarantee.moisture.value') &&
              !watch('nutritionalGuarantee.moisture.kg') && (
                <Box
                  fontSize={14}
                  fontWeight={500}
                  width="fit-content"
                  onClick={() => {
                    setValue('nutritionalGuarantee.moisture.value', '');
                    setValue('nutritionalGuarantee.moisture.kg', '');
                  }}
                  style={{ cursor: 'pointer' }}
                  sx={{
                    visibility: 'hidden',
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="1.5em"
                    height="1.5em"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="red"
                      d="M12 20c-4.41 0-8-3.59-8-8s3.59-8 8-8s8 3.59 8 8s-3.59 8-8 8m0-18C6.47 2 2 6.47 2 12s4.47 10 10 10s10-4.47 10-10S17.53 2 12 2m2.59 6L12 10.59L9.41 8L8 9.41L10.59 12L8 14.59L9.41 16L12 13.41L14.59 16L16 14.59L13.41 12L16 9.41z"
                    />
                  </svg>
                </Box>
              )}
            {(watch('nutritionalGuarantee.moisture.value') ||
              watch('nutritionalGuarantee.moisture.kg')) && (
              <Box
                fontSize={14}
                fontWeight={500}
                width="fit-content"
                // onClick={() => {
                //   {
                //     (setValue('nutritionalGuarantee.moisture.value', ''),
                //       setValue('nutritionalGuarantee.moisture.kg', ''));
                //     clearErrors([
                //       'nutritionalGuarantee.moisture.value',
                //       'nutritionalGuarantee.moisture.kg',
                //     ]);
                //   }
                // }}
                onClick={() => {
                  setValue('nutritionalGuarantee.moisture.value', '');
                  setValue('nutritionalGuarantee.moisture.kg', '');
                  clearErrors([
                    'nutritionalGuarantee.moisture.value',
                    'nutritionalGuarantee.moisture.kg',
                  ]);
                }}
                style={{ cursor: 'pointer' }}
                sx={{
                  position: 'relative',
                  top: '10px',
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="1.5em"
                  height="1.5em"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="red"
                    d="M12 20c-4.41 0-8-3.59-8-8s3.59-8 8-8s8 3.59 8 8s-3.59 8-8 8m0-18C6.47 2 2 6.47 2 12s4.47 10 10 10s10-4.47 10-10S17.53 2 12 2m2.59 6L12 10.59L9.41 8L8 9.41L10.59 12L8 14.59L9.41 16L12 13.41L14.59 16L16 14.59L13.41 12L16 9.41z"
                  />
                </svg>
              </Box>
            )}
          </Grid>

          <Grid
            item
            xl={6}
            xs={12}
            sx={{
              display: 'flex',
              gap: 1.5,

              minWidth: '200px',
              overflowX: 'auto',
              pb: 1.5,
            }}
          >
            <Typography
              variant="subtitle1"
              fontWeight={600}
              sx={{
                minWidth: '14px',
                position: 'relative',
                top: '10px',
              }}
            >
              2.{' '}
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Box
                  // display={"flex"}
                  // gap={2}
                  // alignItems={"center"}
                  position={'relative'}
                >
                  <TextField
                    label="Crude Protein *"
                    type="text"
                    className="form-input"
                    {...register('nutritionalGuarantee.crudeProtein.kg', {
                      required: true,
                      pattern: validationPattern.numbersWithDot,
                      maxLength: 10,
                    })}
                    focused
                    sx={{
                      width: '100%',
                      // minWidth: 190,
                    }}
                  />
                  {errors &&
                    errors?.nutritionalGuarantee?.crudeProtein?.kg &&
                    errors.nutritionalGuarantee.crudeProtein.kg.type ===
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
                  {errors &&
                    errors?.nutritionalGuarantee?.crudeProtein?.kg &&
                    errors.nutritionalGuarantee.crudeProtein.kg.type ===
                      'pattern' && (
                      <Typography
                        variant="body2"
                        color="red"
                        fontSize={13}
                        mt={0.5}
                      >
                        {validationMessage.OnlyNumbersWithDot}
                      </Typography>
                    )}
                  {errors &&
                    errors?.nutritionalGuarantee?.crudeProtein?.kg &&
                    errors.nutritionalGuarantee.crudeProtein.kg.type ===
                      'maxLength' && (
                      <Typography
                        variant="body2"
                        color="red"
                        fontSize={13}
                        mt={0.5}
                      >
                        {validationMessage.numberMaxLength}
                      </Typography>
                    )}
                  <Typography
                    variant="body2"
                    color="#555555AC"
                    sx={{
                      position: 'absolute',
                      right: 6,
                      top: errors?.nutritionalGuarantee?.crudeProtein?.kg
                        ? '30px'
                        : '30px',
                      transform: 'translate(-6px, -50%)',
                      backgroundColor: '#fff',
                      height: 30,
                      display: 'grid',
                      placeItems: 'center',
                      zIndex: 1,
                      pl: 1,
                    }}
                  >
                    g/kg
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Box width={'100%'}>
                  <FormControl
                    fullWidth
                    className="form-input"
                    sx={{
                      minWidth: 110,
                    }}
                    focused
                  >
                    <InputLabel id="feed-supply-select-label10">
                      Min *
                    </InputLabel>
                    <Select
                      labelId="feed-supply-select-label10"
                      id="feed-supply-select10"
                      label="Min *"
                      {...register('nutritionalGuarantee.crudeProtein.value', {
                        required: true,
                      })}
                      value={
                        watch('nutritionalGuarantee.crudeProtein.value') || ''
                      }
                      onChange={(e) => {
                        setValue(
                          'nutritionalGuarantee.crudeProtein.value',
                          e.target.value,
                        );
                        trigger('nutritionalGuarantee.crudeProtein.value');
                      }}
                    >
                      {nutritionalGuarantee.map((guarantee, i) => {
                        return (
                          <MenuItem value={guarantee} key={i}>
                            {guarantee}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                  {errors &&
                    errors?.nutritionalGuarantee?.crudeProtein?.value &&
                    errors.nutritionalGuarantee.crudeProtein.value.type ===
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
              </Grid>
            </Grid>
            {/* <Box
                sx={{
                  visibility: "hidden",
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="1.5em"
                  height="1.5em"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="red"
                    d="M12 20c-4.41 0-8-3.59-8-8s3.59-8 8-8s8 3.59 8 8s-3.59 8-8 8m0-18C6.47 2 2 6.47 2 12s4.47 10 10 10s10-4.47 10-10S17.53 2 12 2m2.59 6L12 10.59L9.41 8L8 9.41L10.59 12L8 14.59L9.41 16L12 13.41L14.59 16L16 14.59L13.41 12L16 9.41z"
                  />
                </svg>
              </Box> */}

            {!watch('nutritionalGuarantee.crudeProtein.value') &&
              !watch('nutritionalGuarantee.crudeProtein.kg') && (
                <Box
                  fontSize={14}
                  fontWeight={500}
                  width="fit-content"
                  onClick={() => {
                    setValue('nutritionalGuarantee.crudeProtein.value', '');
                    setValue('nutritionalGuarantee.crudeProtein.kg', '');
                  }}
                  style={{ cursor: 'pointer' }}
                  sx={{
                    visibility: 'hidden',
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="1.5em"
                    height="1.5em"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="red"
                      d="M12 20c-4.41 0-8-3.59-8-8s3.59-8 8-8s8 3.59 8 8s-3.59 8-8 8m0-18C6.47 2 2 6.47 2 12s4.47 10 10 10s10-4.47 10-10S17.53 2 12 2m2.59 6L12 10.59L9.41 8L8 9.41L10.59 12L8 14.59L9.41 16L12 13.41L14.59 16L16 14.59L13.41 12L16 9.41z"
                    />
                  </svg>
                </Box>
              )}
            {(watch('nutritionalGuarantee.crudeProtein.value') ||
              watch('nutritionalGuarantee.crudeProtein.kg')) && (
              <Box
                fontSize={14}
                fontWeight={500}
                width="fit-content"
                onClick={() => {
                  setValue('nutritionalGuarantee.crudeProtein.value', '');
                  setValue('nutritionalGuarantee.crudeProtein.kg', '');
                  clearErrors([
                    'nutritionalGuarantee.crudeProtein.value',
                    'nutritionalGuarantee.crudeProtein.kg',
                  ]);
                }}
                style={{ cursor: 'pointer' }}
                sx={{
                  position: 'relative',
                  top: '10px',
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="1.5em"
                  height="1.5em"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="red"
                    d="M12 20c-4.41 0-8-3.59-8-8s3.59-8 8-8s8 3.59 8 8s-3.59 8-8 8m0-18C6.47 2 2 6.47 2 12s4.47 10 10 10s10-4.47 10-10S17.53 2 12 2m2.59 6L12 10.59L9.41 8L8 9.41L10.59 12L8 14.59L9.41 16L12 13.41L14.59 16L16 14.59L13.41 12L16 9.41z"
                  />
                </svg>
              </Box>
            )}
          </Grid>

          <Grid
            item
            xl={6}
            xs={12}
            sx={{
              display: 'flex',
              gap: 1.5,

              minWidth: '200px',
              overflowX: 'auto',
              pb: 1.5,
            }}
          >
            <Typography
              variant="subtitle1"
              fontWeight={600}
              sx={{
                minWidth: '14px',
                position: 'relative',
                top: '10px',
              }}
            >
              3.{' '}
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Box
                  // display={"flex"}
                  // gap={2}
                  // alignItems={"center"}
                  position={'relative'}
                >
                  <TextField
                    label="Crude Fat *"
                    type="text"
                    className="form-input"
                    {...register('nutritionalGuarantee.crudeFat.kg', {
                      required: true,
                      pattern: validationPattern.numbersWithDot,
                      maxLength: 10,
                    })}
                    focused
                    sx={{
                      width: '100%',
                      // minWidth: 190,
                    }}
                  />
                  {errors &&
                    errors?.nutritionalGuarantee?.crudeFat?.kg &&
                    errors?.nutritionalGuarantee?.crudeFat?.kg.type ===
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
                  {errors &&
                    errors?.nutritionalGuarantee?.crudeFat?.kg &&
                    errors?.nutritionalGuarantee?.crudeFat?.kg.type ===
                      'pattern' && (
                      <Typography
                        variant="body2"
                        color="red"
                        fontSize={13}
                        mt={0.5}
                      >
                        {validationMessage.OnlyNumbersWithDot}
                      </Typography>
                    )}
                  {errors &&
                    errors?.nutritionalGuarantee?.crudeFat?.kg &&
                    errors?.nutritionalGuarantee?.crudeFat?.kg.type ===
                      'maxLength' && (
                      <Typography
                        variant="body2"
                        color="red"
                        fontSize={13}
                        mt={0.5}
                      >
                        {validationMessage.numberMaxLength}
                      </Typography>
                    )}
                  <Typography
                    variant="body2"
                    color="#555555AC"
                    sx={{
                      position: 'absolute',
                      right: 6,
                      top: errors?.nutritionalGuarantee?.crudeFat?.kg
                        ? '30px'
                        : '20px',
                      transform: 'translate(-6px, -50%)',
                      backgroundColor: '#fff',
                      height: 30,
                      display: 'grid',
                      placeItems: 'center',
                      zIndex: 1,
                      pl: 1,
                    }}
                  >
                    g/kg
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Box width={'100%'}>
                  <FormControl
                    fullWidth
                    className="form-input"
                    sx={{
                      minWidth: 110,
                    }}
                    focused
                  >
                    <InputLabel id="feed-supply-select-label10">
                      Min *
                    </InputLabel>
                    <Select
                      labelId="feed-supply-select-label10"
                      id="feed-supply-select10"
                      label="Min *"
                      {...register('nutritionalGuarantee.crudeFat.value', {
                        required: true,
                      })}
                      value={watch('nutritionalGuarantee.crudeFat.value') || ''}
                      onChange={(e) => {
                        setValue(
                          'nutritionalGuarantee.crudeFat.value',
                          e.target.value,
                        );
                        trigger('nutritionalGuarantee.crudeFat.value');
                      }}
                    >
                      {nutritionalGuarantee.map((guarantee, i) => {
                        return (
                          <MenuItem value={guarantee} key={i}>
                            {guarantee}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                  {errors &&
                    errors?.nutritionalGuarantee?.crudeFat?.value &&
                    errors?.nutritionalGuarantee?.crudeFat?.value.type ===
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
              </Grid>
            </Grid>
            {/* <Box
                sx={{
                  visibility: "hidden",
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="1.5em"
                  height="1.5em"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="red"
                    d="M12 20c-4.41 0-8-3.59-8-8s3.59-8 8-8s8 3.59 8 8s-3.59 8-8 8m0-18C6.47 2 2 6.47 2 12s4.47 10 10 10s10-4.47 10-10S17.53 2 12 2m2.59 6L12 10.59L9.41 8L8 9.41L10.59 12L8 14.59L9.41 16L12 13.41L14.59 16L16 14.59L13.41 12L16 9.41z"
                  />
                </svg>
              </Box> */}

            {!watch('nutritionalGuarantee.crudeFat.value') &&
              !watch('nutritionalGuarantee.crudeFat.kg') && (
                <Box
                  fontSize={14}
                  fontWeight={500}
                  width="fit-content"
                  onClick={() => {
                    setValue('nutritionalGuarantee.crudeFat.value', '');
                    setValue('nutritionalGuarantee.crudeFat.kg', '');
                  }}
                  style={{ cursor: 'pointer' }}
                  sx={{
                    visibility: 'hidden',
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="1.5em"
                    height="1.5em"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="red"
                      d="M12 20c-4.41 0-8-3.59-8-8s3.59-8 8-8s8 3.59 8 8s-3.59 8-8 8m0-18C6.47 2 2 6.47 2 12s4.47 10 10 10s10-4.47 10-10S17.53 2 12 2m2.59 6L12 10.59L9.41 8L8 9.41L10.59 12L8 14.59L9.41 16L12 13.41L14.59 16L16 14.59L13.41 12L16 9.41z"
                    />
                  </svg>
                </Box>
              )}

            {(watch('nutritionalGuarantee.crudeFat.value') ||
              watch('nutritionalGuarantee.crudeFat.kg')) && (
              <Box
                fontSize={14}
                fontWeight={500}
                width="fit-content"
                onClick={() => {
                  setValue('nutritionalGuarantee.crudeFat.value', '');
                  setValue('nutritionalGuarantee.crudeFat.kg', '');
                  clearErrors([
                    'nutritionalGuarantee.crudeFat.value',
                    'nutritionalGuarantee.crudeFat.kg',
                  ]);
                }}
                style={{ cursor: 'pointer' }}
                sx={{
                  position: 'relative',
                  top: '10px',
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="1.5em"
                  height="1.5em"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="red"
                    d="M12 20c-4.41 0-8-3.59-8-8s3.59-8 8-8s8 3.59 8 8s-3.59 8-8 8m0-18C6.47 2 2 6.47 2 12s4.47 10 10 10s10-4.47 10-10S17.53 2 12 2m2.59 6L12 10.59L9.41 8L8 9.41L10.59 12L8 14.59L9.41 16L12 13.41L14.59 16L16 14.59L13.41 12L16 9.41z"
                  />
                </svg>
              </Box>
            )}
          </Grid>

          <Grid
            item
            xl={6}
            xs={12}
            sx={{
              display: 'flex',
              gap: 1.5,

              minWidth: '200px',
              overflowX: 'auto',
              pb: 1.5,
            }}
          >
            <Typography
              variant="subtitle1"
              fontWeight={600}
              sx={{
                minWidth: '14px',
                position: 'relative',
                top: '10px',
              }}
            >
              4.{' '}
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Box
                  // display={"flex"}
                  // gap={2}
                  // alignItems={"center"}
                  position={'relative'}
                >
                  <TextField
                    label="Crude Ash *"
                    type="text"
                    className="form-input"
                    {...register('nutritionalGuarantee.crudeAsh.kg', {
                      required: true,
                      pattern: validationPattern.numbersWithDot,
                      maxLength: 10,
                    })}
                    focused
                    sx={{
                      width: '100%',
                      // minWidth: 190,
                    }}
                  />
                  {errors &&
                    errors?.nutritionalGuarantee?.crudeAsh?.kg &&
                    errors?.nutritionalGuarantee?.crudeAsh.kg.type ===
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
                  {errors &&
                    errors?.nutritionalGuarantee?.crudeAsh?.kg &&
                    errors?.nutritionalGuarantee?.crudeAsh.kg.type ===
                      'pattern' && (
                      <Typography
                        variant="body2"
                        color="red"
                        fontSize={13}
                        mt={0.5}
                      >
                        {validationMessage.OnlyNumbersWithDot}
                      </Typography>
                    )}
                  {errors &&
                    errors?.nutritionalGuarantee?.crudeAsh?.kg &&
                    errors?.nutritionalGuarantee?.crudeAsh.kg.type ===
                      'maxLength' && (
                      <Typography
                        variant="body2"
                        color="red"
                        fontSize={13}
                        mt={0.5}
                      >
                        {validationMessage.numberMaxLength}
                      </Typography>
                    )}
                  <Typography
                    variant="body2"
                    color="#555555AC"
                    sx={{
                      position: 'absolute',
                      right: 6,
                      top: errors?.nutritionalGuarantee?.crudeAsh?.kg
                        ? '30px'
                        : '30px',
                      transform: 'translate(-6px, -50%)',
                      backgroundColor: '#fff',
                      height: 30,
                      display: 'grid',
                      placeItems: 'center',
                      zIndex: 1,
                      pl: 1,
                    }}
                  >
                    g/kg
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box width={'100%'}>
                  <FormControl
                    fullWidth
                    className="form-input"
                    sx={{
                      minWidth: 110,
                    }}
                    focused
                  >
                    <InputLabel id="feed-supply-select-label10">
                      Min *
                    </InputLabel>
                    <Select
                      labelId="feed-supply-select-label10"
                      id="feed-supply-select10"
                      {...register('nutritionalGuarantee.crudeAsh.value', {
                        required: true,
                      })}
                      label="Min *"
                      value={watch('nutritionalGuarantee.crudeAsh.value') || ''}
                      onChange={(e) => {
                        setValue(
                          'nutritionalGuarantee.crudeAsh.value',
                          e.target.value,
                        );
                        trigger('nutritionalGuarantee.crudeAsh.value');
                      }}
                      // onChange={handleChange}
                    >
                      {nutritionalGuarantee.map((guarantee, i) => {
                        return (
                          <MenuItem value={guarantee} key={i}>
                            {guarantee}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                  {errors &&
                    errors?.nutritionalGuarantee?.crudeAsh?.value &&
                    errors?.nutritionalGuarantee?.crudeAsh.value.type ===
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
              </Grid>
            </Grid>
            {/* <Box
                sx={{
                  visibility: "hidden",
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="1.5em"
                  height="1.5em"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="red"
                    d="M12 20c-4.41 0-8-3.59-8-8s3.59-8 8-8s8 3.59 8 8s-3.59 8-8 8m0-18C6.47 2 2 6.47 2 12s4.47 10 10 10s10-4.47 10-10S17.53 2 12 2m2.59 6L12 10.59L9.41 8L8 9.41L10.59 12L8 14.59L9.41 16L12 13.41L14.59 16L16 14.59L13.41 12L16 9.41z"
                  />
                </svg>
              </Box> */}

            {!watch('nutritionalGuarantee.crudeAsh.value') &&
              !watch('nutritionalGuarantee.crudeAsh.kg') && (
                <Box
                  fontSize={14}
                  fontWeight={500}
                  width="fit-content"
                  onClick={() => {
                    setValue('nutritionalGuarantee.crudeAsh.value', '');
                    setValue('nutritionalGuarantee.crudeAsh.kg', '');
                  }}
                  style={{ cursor: 'pointer' }}
                  sx={{
                    visibility: 'hidden',
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="1.5em"
                    height="1.5em"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="red"
                      d="M12 20c-4.41 0-8-3.59-8-8s3.59-8 8-8s8 3.59 8 8s-3.59 8-8 8m0-18C6.47 2 2 6.47 2 12s4.47 10 10 10s10-4.47 10-10S17.53 2 12 2m2.59 6L12 10.59L9.41 8L8 9.41L10.59 12L8 14.59L9.41 16L12 13.41L14.59 16L16 14.59L13.41 12L16 9.41z"
                    />
                  </svg>
                </Box>
              )}

            {(watch('nutritionalGuarantee.crudeAsh.value') ||
              watch('nutritionalGuarantee.crudeAsh.kg')) && (
              <Box
                fontSize={14}
                fontWeight={500}
                width="fit-content"
                onClick={() => {
                  setValue('nutritionalGuarantee.crudeAsh.value', '');
                  setValue('nutritionalGuarantee.crudeAsh.kg', '');
                  clearErrors([
                    'nutritionalGuarantee.crudeAsh.value',
                    'nutritionalGuarantee.crudeAsh.kg',
                  ]);
                }}
                style={{ cursor: 'pointer' }}
                sx={{
                  position: 'relative',
                  top: '10px',
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="1.5em"
                  height="1.5em"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="red"
                    d="M12 20c-4.41 0-8-3.59-8-8s3.59-8 8-8s8 3.59 8 8s-3.59 8-8 8m0-18C6.47 2 2 6.47 2 12s4.47 10 10 10s10-4.47 10-10S17.53 2 12 2m2.59 6L12 10.59L9.41 8L8 9.41L10.59 12L8 14.59L9.41 16L12 13.41L14.59 16L16 14.59L13.41 12L16 9.41z"
                  />
                </svg>
              </Box>
            )}
          </Grid>

          <Grid
            item
            xl={6}
            xs={12}
            sx={{
              display: 'flex',
              gap: 1.5,
              minWidth: '200px',
              overflowX: 'auto',
              pb: 1.5,
            }}
          >
            <Typography
              variant="subtitle1"
              fontWeight={600}
              sx={{
                minWidth: '14px',
                position: 'relative',
                top: '10px',
              }}
            >
              5.{' '}
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Box
                  // display={"flex"}
                  // gap={2}
                  // alignItems={"center"}
                  position={'relative'}
                >
                  <TextField
                    label=" Crude Fiber *"
                    type="text"
                    className="form-input"
                    {...register('nutritionalGuarantee.crudeFiber.kg', {
                      required: true,
                      pattern: validationPattern.numbersWithDot,
                      maxLength: 10,
                    })}
                    focused
                    sx={{
                      width: '100%',
                      // minWidth: 190,
                    }}
                  />
                  {errors &&
                    errors?.nutritionalGuarantee?.crudeFiber?.kg &&
                    errors?.nutritionalGuarantee?.crudeFiber.kg.type ===
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
                  {errors &&
                    errors?.nutritionalGuarantee?.crudeFiber?.kg &&
                    errors?.nutritionalGuarantee?.crudeFiber.kg.type ===
                      'pattern' && (
                      <Typography
                        variant="body2"
                        color="red"
                        fontSize={13}
                        mt={0.5}
                      >
                        {validationMessage.OnlyNumbersWithDot}
                      </Typography>
                    )}
                  {errors &&
                    errors?.nutritionalGuarantee?.crudeFiber?.kg &&
                    errors?.nutritionalGuarantee?.crudeFiber.kg.type ===
                      'maxLength' && (
                      <Typography
                        variant="body2"
                        color="red"
                        fontSize={13}
                        mt={0.5}
                      >
                        {validationMessage.numberMaxLength}
                      </Typography>
                    )}
                  <Typography
                    variant="body2"
                    color="#555555AC"
                    sx={{
                      position: 'absolute',
                      right: 6,
                      top: errors?.nutritionalGuarantee?.crudeFiber?.kg
                        ? '30px'
                        : '30px',
                      transform: 'translate(-6px, -50%)',
                      backgroundColor: '#fff',
                      height: 30,
                      display: 'grid',
                      placeItems: 'center',
                      zIndex: 1,
                      pl: 1,
                    }}
                  >
                    g/kg
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box width={'100%'}>
                  <FormControl
                    fullWidth
                    className="form-input"
                    sx={{
                      minWidth: 110,
                    }}
                    focused
                  >
                    <InputLabel id="feed-supply-select-label10">
                      Min *
                    </InputLabel>
                    <Select
                      labelId="feed-supply-select-label10"
                      id="feed-supply-select10"
                      {...register('nutritionalGuarantee.crudeFiber.value', {
                        required: true,
                      })}
                      label="Min *"
                      value={
                        watch('nutritionalGuarantee.crudeFiber.value') || ''
                      }
                      onChange={(e) => {
                        setValue(
                          'nutritionalGuarantee.crudeFiber.value',
                          e.target.value,
                        );
                        trigger('nutritionalGuarantee.crudeFiber.value');
                      }}
                      // onChange={handleChange}
                    >
                      {nutritionalGuarantee.map((guarantee, i) => {
                        return (
                          <MenuItem value={guarantee} key={i}>
                            {guarantee}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                  {errors &&
                    errors?.nutritionalGuarantee?.crudeFiber?.value &&
                    errors?.nutritionalGuarantee?.crudeFiber.value.type ===
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
              </Grid>
            </Grid>
            {/* <Box
                sx={{
                  visibility: "hidden",
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="1.5em"
                  height="1.5em"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="red"
                    d="M12 20c-4.41 0-8-3.59-8-8s3.59-8 8-8s8 3.59 8 8s-3.59 8-8 8m0-18C6.47 2 2 6.47 2 12s4.47 10 10 10s10-4.47 10-10S17.53 2 12 2m2.59 6L12 10.59L9.41 8L8 9.41L10.59 12L8 14.59L9.41 16L12 13.41L14.59 16L16 14.59L13.41 12L16 9.41z"
                  />
                </svg>
              </Box> */}

            {!watch('nutritionalGuarantee.crudeFiber.value') &&
              !watch('nutritionalGuarantee.crudeFiber.kg') && (
                <Box
                  fontSize={14}
                  fontWeight={500}
                  width="fit-content"
                  onClick={() => {
                    setValue('nutritionalGuarantee.crudeFiber.value', '');
                    setValue('nutritionalGuarantee.crudeFiber.kg', '');
                  }}
                  style={{ cursor: 'pointer' }}
                  sx={{
                    visibility: 'hidden',
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="1.5em"
                    height="1.5em"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="red"
                      d="M12 20c-4.41 0-8-3.59-8-8s3.59-8 8-8s8 3.59 8 8s-3.59 8-8 8m0-18C6.47 2 2 6.47 2 12s4.47 10 10 10s10-4.47 10-10S17.53 2 12 2m2.59 6L12 10.59L9.41 8L8 9.41L10.59 12L8 14.59L9.41 16L12 13.41L14.59 16L16 14.59L13.41 12L16 9.41z"
                    />
                  </svg>
                </Box>
              )}
            {(watch('nutritionalGuarantee.crudeFiber.value') ||
              watch('nutritionalGuarantee.crudeFiber.kg')) && (
              <Box
                fontSize={14}
                fontWeight={500}
                width="fit-content"
                onClick={() => {
                  setValue('nutritionalGuarantee.crudeFiber.value', '');
                  setValue('nutritionalGuarantee.crudeFiber.kg', '');
                  clearErrors([
                    'nutritionalGuarantee.crudeFiber.value',
                    'nutritionalGuarantee.crudeFiber.kg',
                  ]);
                }}
                style={{ cursor: 'pointer' }}
                sx={{
                  position: 'relative',
                  top: '10px',
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="1.5em"
                  height="1.5em"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="red"
                    d="M12 20c-4.41 0-8-3.59-8-8s3.59-8 8-8s8 3.59 8 8s-3.59 8-8 8m0-18C6.47 2 2 6.47 2 12s4.47 10 10 10s10-4.47 10-10S17.53 2 12 2m2.59 6L12 10.59L9.41 8L8 9.41L10.59 12L8 14.59L9.41 16L12 13.41L14.59 16L16 14.59L13.41 12L16 9.41z"
                  />
                </svg>
              </Box>
            )}
          </Grid>

          <Grid
            item
            xl={6}
            xs={12}
            sx={{
              display: 'flex',
              gap: 1.5,
              minWidth: '200px',
              overflowX: 'auto',
              pb: 1.5,
            }}
          >
            <Typography
              variant="subtitle1"
              fontWeight={600}
              sx={{
                minWidth: '14px',
                position: 'relative',
                top: '10px',
              }}
            >
              6.{' '}
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Box
                  // display={"flex"}
                  // gap={2}
                  // alignItems={"center"}
                  position={'relative'}
                >
                  <TextField
                    label="Calcium *"
                    type="text"
                    className="form-input"
                    {...register('nutritionalGuarantee.calcium.kg', {
                      required: true,
                      pattern: validationPattern.numbersWithDot,
                      maxLength: 10,
                    })}
                    focused
                    sx={{
                      width: '100%',
                      // minWidth: 190,
                    }}
                  />
                  {errors &&
                    errors?.nutritionalGuarantee?.calcium?.kg &&
                    errors?.nutritionalGuarantee?.calcium.kg.type ===
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
                  {errors &&
                    errors?.nutritionalGuarantee?.calcium?.kg &&
                    errors?.nutritionalGuarantee?.calcium.kg.type ===
                      'pattern' && (
                      <Typography
                        variant="body2"
                        color="red"
                        fontSize={13}
                        mt={0.5}
                      >
                        {validationMessage.OnlyNumbersWithDot}
                      </Typography>
                    )}
                  {errors &&
                    errors?.nutritionalGuarantee?.calcium?.kg &&
                    errors?.nutritionalGuarantee?.calcium.kg.type ===
                      'maxLength' && (
                      <Typography
                        variant="body2"
                        color="red"
                        fontSize={13}
                        mt={0.5}
                      >
                        {validationMessage.numberMaxLength}
                      </Typography>
                    )}
                  <Typography
                    variant="body2"
                    color="#555555AC"
                    sx={{
                      position: 'absolute',
                      right: 6,
                      top: errors?.nutritionalGuarantee?.calcium?.kg
                        ? '30px'
                        : '30px',
                      transform: 'translate(-6px, -50%)',
                      backgroundColor: '#fff',
                      height: 30,
                      display: 'grid',
                      placeItems: 'center',
                      zIndex: 1,
                      pl: 1,
                    }}
                  >
                    g/kg
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box width={'100%'}>
                  <FormControl
                    fullWidth
                    className="form-input"
                    sx={{
                      minWidth: 110,
                    }}
                    focused
                  >
                    <InputLabel id="feed-supply-select-label10">
                      Min *
                    </InputLabel>
                    <Select
                      labelId="feed-supply-select-label10"
                      id="feed-supply-select10"
                      label="Min *"
                      {...register('nutritionalGuarantee.calcium.value', {
                        required: true,
                      })}
                      value={watch('nutritionalGuarantee.calcium.value') || ''}
                      onChange={(e) => {
                        setValue(
                          'nutritionalGuarantee.calcium.value',
                          e.target.value,
                        );
                        trigger('nutritionalGuarantee.calcium.value');
                      }}
                    >
                      {nutritionalGuarantee.map((guarantee, i) => {
                        return (
                          <MenuItem value={guarantee} key={i}>
                            {guarantee}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                  {errors &&
                    errors?.nutritionalGuarantee?.calcium?.value &&
                    errors?.nutritionalGuarantee?.calcium.value.type ===
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
              </Grid>
            </Grid>
            {/* <Box
                sx={{
                  visibility: "hidden",
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="1.5em"
                  height="1.5em"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="red"
                    d="M12 20c-4.41 0-8-3.59-8-8s3.59-8 8-8s8 3.59 8 8s-3.59 8-8 8m0-18C6.47 2 2 6.47 2 12s4.47 10 10 10s10-4.47 10-10S17.53 2 12 2m2.59 6L12 10.59L9.41 8L8 9.41L10.59 12L8 14.59L9.41 16L12 13.41L14.59 16L16 14.59L13.41 12L16 9.41z"
                  />
                </svg>
              </Box> */}

            {!watch('nutritionalGuarantee.calcium.value') &&
              !watch('nutritionalGuarantee.calcium.kg') && (
                <Box
                  fontSize={14}
                  fontWeight={500}
                  width="fit-content"
                  onClick={() => {
                    setValue('nutritionalGuarantee.calcium.value', '');
                    setValue('nutritionalGuarantee.calcium.kg', '');
                  }}
                  style={{ cursor: 'pointer' }}
                  sx={{
                    visibility: 'hidden',
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="1.5em"
                    height="1.5em"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="red"
                      d="M12 20c-4.41 0-8-3.59-8-8s3.59-8 8-8s8 3.59 8 8s-3.59 8-8 8m0-18C6.47 2 2 6.47 2 12s4.47 10 10 10s10-4.47 10-10S17.53 2 12 2m2.59 6L12 10.59L9.41 8L8 9.41L10.59 12L8 14.59L9.41 16L12 13.41L14.59 16L16 14.59L13.41 12L16 9.41z"
                    />
                  </svg>
                </Box>
              )}
            {(watch('nutritionalGuarantee.calcium.value') ||
              watch('nutritionalGuarantee.calcium.kg')) && (
              <Box
                fontSize={14}
                fontWeight={500}
                width="fit-content"
                onClick={() => {
                  setValue('nutritionalGuarantee.calcium.value', '');
                  setValue('nutritionalGuarantee.calcium.kg', '');
                  clearErrors([
                    'nutritionalGuarantee.calcium.value',
                    'nutritionalGuarantee.calcium.kg',
                  ]);
                }}
                style={{ cursor: 'pointer' }}
                sx={{
                  position: 'relative',
                  top: '10px',
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="1.5em"
                  height="1.5em"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="red"
                    d="M12 20c-4.41 0-8-3.59-8-8s3.59-8 8-8s8 3.59 8 8s-3.59 8-8 8m0-18C6.47 2 2 6.47 2 12s4.47 10 10 10s10-4.47 10-10S17.53 2 12 2m2.59 6L12 10.59L9.41 8L8 9.41L10.59 12L8 14.59L9.41 16L12 13.41L14.59 16L16 14.59L13.41 12L16 9.41z"
                  />
                </svg>
              </Box>
            )}
          </Grid>

          <Grid
            item
            xl={6}
            xs={12}
            sx={{
              display: 'flex',
              gap: 1.5,
              minWidth: '200px',
              overflowX: 'auto',
              pb: 1.5,
            }}
          >
            <Typography
              variant="subtitle1"
              fontWeight={600}
              sx={{
                minWidth: '14px',
                position: 'relative',
                top: '10px',
              }}
            >
              7.{' '}
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Box
                  // display={"flex"}
                  // gap={2}
                  // alignItems={"center"}
                  position={'relative'}
                >
                  <TextField
                    label="Phosphorous *"
                    type="text"
                    className="form-input"
                    {...register('nutritionalGuarantee.phosphorous.kg', {
                      required: true,
                      pattern: validationPattern.numbersWithDot,
                      maxLength: 10,
                    })}
                    focused
                    sx={{
                      width: '100%',
                      // minWidth: 190,
                    }}
                  />
                  {errors &&
                    errors?.nutritionalGuarantee?.phosphorous?.kg &&
                    errors?.nutritionalGuarantee?.phosphorous.kg.type ===
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
                  {errors &&
                    errors?.nutritionalGuarantee?.phosphorous?.kg &&
                    errors?.nutritionalGuarantee?.phosphorous.kg.type ===
                      'pattern' && (
                      <Typography
                        variant="body2"
                        color="red"
                        fontSize={13}
                        mt={0.5}
                      >
                        {validationMessage.OnlyNumbersWithDot}
                      </Typography>
                    )}
                  {errors &&
                    errors?.nutritionalGuarantee?.phosphorous?.kg &&
                    errors?.nutritionalGuarantee?.phosphorous.kg.type ===
                      'maxLength' && (
                      <Typography
                        variant="body2"
                        color="red"
                        fontSize={13}
                        mt={0.5}
                      >
                        {validationMessage.numberMaxLength}
                      </Typography>
                    )}
                  <Typography
                    variant="body2"
                    color="#555555AC"
                    sx={{
                      position: 'absolute',
                      right: 6,
                      top: errors?.nutritionalGuarantee?.phosphorous?.kg
                        ? '30px'
                        : '30px',
                      transform: 'translate(-6px, -50%)',
                      backgroundColor: '#fff',
                      height: 30,
                      display: 'grid',
                      placeItems: 'center',
                      zIndex: 1,
                      pl: 1,
                    }}
                  >
                    g/kg
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Box width={'100%'}>
                  <FormControl
                    fullWidth
                    className="form-input"
                    sx={{
                      minWidth: 110,
                    }}
                    focused
                  >
                    <InputLabel id="feed-supply-select-label10">
                      Min *
                    </InputLabel>
                    <Select
                      labelId="feed-supply-select-label10"
                      id="feed-supply-select10"
                      label="Min *"
                      {...register('nutritionalGuarantee.phosphorous.value', {
                        required: true,
                      })}
                      value={
                        watch('nutritionalGuarantee.phosphorous.value') || ''
                      }
                      onChange={(e) => {
                        setValue(
                          'nutritionalGuarantee.phosphorous.value',
                          e.target.value,
                        );
                        trigger('nutritionalGuarantee.phosphorous.value');
                      }}
                    >
                      {nutritionalGuarantee.map((guarantee, i) => {
                        return (
                          <MenuItem value={guarantee} key={i}>
                            {guarantee}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                  {errors &&
                    errors?.nutritionalGuarantee?.phosphorous?.value &&
                    errors?.nutritionalGuarantee?.phosphorous.value.type ===
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
              </Grid>
            </Grid>

            {/* <Box
                sx={{
                  visibility: "hidden",
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="1.5em"
                  height="1.5em"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="red"
                    d="M12 20c-4.41 0-8-3.59-8-8s3.59-8 8-8s8 3.59 8 8s-3.59 8-8 8m0-18C6.47 2 2 6.47 2 12s4.47 10 10 10s10-4.47 10-10S17.53 2 12 2m2.59 6L12 10.59L9.41 8L8 9.41L10.59 12L8 14.59L9.41 16L12 13.41L14.59 16L16 14.59L13.41 12L16 9.41z"
                  />
                </svg>
              </Box> */}
            {!watch('nutritionalGuarantee.phosphorous.value') &&
              !watch('nutritionalGuarantee.phosphorous.kg') && (
                <Box
                  fontSize={14}
                  fontWeight={500}
                  width="fit-content"
                  onClick={() => {
                    setValue('nutritionalGuarantee.phosphorous.value', '');
                    setValue('nutritionalGuarantee.phosphorous.kg', '');
                  }}
                  style={{ cursor: 'pointer' }}
                  sx={{
                    visibility: 'hidden',
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="1.5em"
                    height="1.5em"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="red"
                      d="M12 20c-4.41 0-8-3.59-8-8s3.59-8 8-8s8 3.59 8 8s-3.59 8-8 8m0-18C6.47 2 2 6.47 2 12s4.47 10 10 10s10-4.47 10-10S17.53 2 12 2m2.59 6L12 10.59L9.41 8L8 9.41L10.59 12L8 14.59L9.41 16L12 13.41L14.59 16L16 14.59L13.41 12L16 9.41z"
                    />
                  </svg>
                </Box>
              )}
            {(watch('nutritionalGuarantee.phosphorous.value') ||
              watch('nutritionalGuarantee.phosphorous.kg')) && (
              <Box
                fontSize={14}
                fontWeight={500}
                width="fit-content"
                onClick={() => {
                  setValue('nutritionalGuarantee.phosphorous.value', '');
                  setValue('nutritionalGuarantee.phosphorous.kg', '');
                  clearErrors([
                    'nutritionalGuarantee.phosphorous.value',
                    'nutritionalGuarantee.phosphorous.kg',
                  ]);
                }}
                style={{ cursor: 'pointer' }}
                sx={{
                  position: 'relative',
                  top: '10px',
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="1.5em"
                  height="1.5em"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="red"
                    d="M12 20c-4.41 0-8-3.59-8-8s3.59-8 8-8s8 3.59 8 8s-3.59 8-8 8m0-18C6.47 2 2 6.47 2 12s4.47 10 10 10s10-4.47 10-10S17.53 2 12 2m2.59 6L12 10.59L9.41 8L8 9.41L10.59 12L8 14.59L9.41 16L12 13.41L14.59 16L16 14.59L13.41 12L16 9.41z"
                  />
                </svg>
              </Box>
            )}
          </Grid>

          <Grid
            item
            xl={6}
            xs={12}
            sx={{
              display: 'flex',
              gap: 1.5,
              minWidth: '200px',
              overflowX: 'auto',
              pb: 1.5,
            }}
          >
            <Typography
              variant="subtitle1"
              fontWeight={600}
              sx={{
                minWidth: '14px',
                position: 'relative',
                top: '10px',
              }}
            >
              8.{' '}
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Box
                  // display={"flex"}
                  // gap={2}
                  // alignItems={"center"}
                  position={'relative'}
                >
                  <TextField
                    label="Carbohydrates *"
                    type="text"
                    InputProps={{ readOnly: true }}
                    className="form-input"
                    {...register('nutritionalGuarantee.carbohydrates.kg', {
                      required: true,
                      pattern: validationPattern.numbersWithDot,
                      maxLength: 10,
                    })}
                    focused
                    sx={{
                      width: '100%',
                      minWidth: 110,
                    }}
                  />

                  <Typography
                    variant="body2"
                    color="#555555AC"
                    sx={{
                      position: 'absolute',
                      right: 6,
                      top: errors?.nutritionalGuarantee?.carbohydrates?.kg
                        ? '30px'
                        : '30px',
                      transform: 'translate(-6px, -50%)',
                      backgroundColor: '#fff',
                      height: 30,
                      display: 'grid',
                      placeItems: 'center',
                      zIndex: 1,
                      pl: 1,
                    }}
                  >
                    g/kg
                  </Typography>
                  {errors &&
                    errors?.nutritionalGuarantee?.carbohydrates?.kg &&
                    errors?.nutritionalGuarantee?.carbohydrates.kg.type ===
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
                  {errors &&
                    errors?.nutritionalGuarantee?.carbohydrates?.kg &&
                    errors?.nutritionalGuarantee?.carbohydrates.kg.type ===
                      'pattern' && (
                      <Typography
                        variant="body2"
                        color="red"
                        fontSize={13}
                        mt={0.5}
                      >
                        {validationMessage.OnlyNumbersWithDot}
                      </Typography>
                    )}
                  {errors &&
                    errors?.nutritionalGuarantee?.carbohydrates?.kg &&
                    errors?.nutritionalGuarantee?.carbohydrates.kg.type ===
                      'maxLength' && (
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
              </Grid>

              <Grid item xs={12} md={6}>
                <Box width={'100%'}>
                  <FormControl
                    fullWidth
                    className="form-input"
                    sx={{
                      minWidth: 110,
                    }}
                    focused
                  >
                    <InputLabel id="feed-supply-select-label10">
                      Min *
                    </InputLabel>
                    <Select
                      labelId="feed-supply-select-label10"
                      id="feed-supply-select10"
                      label="Min *"
                      {...register('nutritionalGuarantee.carbohydrates.value', {
                        required: true,
                      })}
                      value={
                        watch('nutritionalGuarantee.carbohydrates.value') || ''
                      }
                      onChange={(e) => {
                        setValue(
                          'nutritionalGuarantee.carbohydrates.value',
                          e.target.value,
                        );
                        trigger('nutritionalGuarantee.carbohydrates.value');
                      }}
                    >
                      {nutritionalGuarantee.map((guarantee, i) => {
                        return (
                          <MenuItem value={guarantee} key={i}>
                            {guarantee}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>

                  {errors &&
                    errors?.nutritionalGuarantee?.carbohydrates?.value &&
                    errors?.nutritionalGuarantee?.carbohydrates.value.type ===
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
              </Grid>
            </Grid>

            {!watch('nutritionalGuarantee.carbohydrates.value') &&
              !watch('nutritionalGuarantee.carbohydrates.kg') && (
                <Box
                  fontSize={14}
                  fontWeight={500}
                  width="fit-content"
                  onClick={() => {
                    setValue('nutritionalGuarantee.carbohydrates.value', '');
                    // setValue("nutritionalGuarantee.carbohydrates.kg", "");
                  }}
                  style={{ cursor: 'pointer' }}
                  sx={{
                    visibility: 'hidden',
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="1.5em"
                    height="1.5em"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="red"
                      d="M12 20c-4.41 0-8-3.59-8-8s3.59-8 8-8s8 3.59 8 8s-3.59 8-8 8m0-18C6.47 2 2 6.47 2 12s4.47 10 10 10s10-4.47 10-10S17.53 2 12 2m2.59 6L12 10.59L9.41 8L8 9.41L10.59 12L8 14.59L9.41 16L12 13.41L14.59 16L16 14.59L13.41 12L16 9.41z"
                    />
                  </svg>
                </Box>
              )}
            {(watch('nutritionalGuarantee.carbohydrates.value') ||
              watch('nutritionalGuarantee.carbohydrates.kg')) && (
              <Box
                fontSize={14}
                fontWeight={500}
                width="fit-content"
                onClick={() => {
                  setValue('nutritionalGuarantee.carbohydrates.value', '');
                  // setValue("nutritionalGuarantee.carbohydrates.kg", "");
                  clearErrors([
                    'nutritionalGuarantee.carbohydrates.value',
                    'nutritionalGuarantee.carbohydrates.kg',
                  ]);
                }}
                style={{ cursor: 'pointer' }}
                sx={{
                  position: 'relative',
                  top: '10px',
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="1.5em"
                  height="1.5em"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="red"
                    d="M12 20c-4.41 0-8-3.59-8-8s3.59-8 8-8s8 3.59 8 8s-3.59 8-8 8m0-18C6.47 2 2 6.47 2 12s4.47 10 10 10s10-4.47 10-10S17.53 2 12 2m2.59 6L12 10.59L9.41 8L8 9.41L10.59 12L8 14.59L9.41 16L12 13.41L14.59 16L16 14.59L13.41 12L16 9.41z"
                  />
                </svg>
              </Box>
            )}
          </Grid>

          <Grid
            item
            xl={6}
            xs={12}
            sx={{
              display: 'flex',
              gap: 1.5,
              minWidth: '200px',
              overflowX: 'auto',
              alignItems: 'self-start',
              pb: 1.5,
            }}
          >
            <Typography
              variant="subtitle1"
              fontWeight={600}
              sx={{
                minWidth: '14px',
                position: 'relative',
                top: '10px',
              }}
            >
              9.{' '}
            </Typography>

            <Box
              width={'100%'}
              // display={"flex"}
              // gap={2}
              // alignItems={"center"}
              position={'relative'}
            >
              <TextField
                label="Metabolizable Energy *"
                type="text"
                className="form-input"
                {...register('nutritionalGuarantee.metabolizableEnergy.kg', {
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
                variant="body2"
                color="#555555AC"
                sx={{
                  position: 'absolute',
                  right: 6,
                  top: errors?.nutritionalGuarantee?.metabolizableEnergy?.kg
                    ? '30px'
                    : '30px',
                  transform: 'translate(-6px, -50%)',
                  backgroundColor: '#fff',
                  height: 30,
                  display: 'grid',
                  placeItems: 'center',
                  zIndex: 1,
                  pl: 1,
                }}
              >
                MJ/kg
              </Typography>
              {errors &&
                errors?.nutritionalGuarantee?.metabolizableEnergy?.kg &&
                errors?.nutritionalGuarantee?.metabolizableEnergy.kg.type ===
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
              {errors &&
                errors?.nutritionalGuarantee?.metabolizableEnergy?.kg &&
                errors?.nutritionalGuarantee?.metabolizableEnergy.kg.type ===
                  'pattern' && (
                  <Typography
                    variant="body2"
                    color="red"
                    fontSize={13}
                    mt={0.5}
                  >
                    {validationMessage.OnlyNumbersWithDot}
                  </Typography>
                )}
              {errors &&
                errors?.nutritionalGuarantee?.metabolizableEnergy?.kg &&
                errors?.nutritionalGuarantee?.metabolizableEnergy.kg.type ===
                  'maxLength' && (
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

            <Button
              type="button"
              variant="contained"
              sx={{
                background: '#06a19b',
                color: '#fff',
                fontWeight: 600,
                padding: '6px',
                width: 'fit-content',
                textTransform: 'capitalize',
                borderRadius: '8px',
                border: '1px solid #06A19B',
                minWidth: 90,
              }}
              // onClick={() => handleCalculate(item, index)}
            >
              Calculate
            </Button>
            <Box width={'100%'}>
              <FormControl
                fullWidth
                className="form-input"
                sx={{
                  minWidth: 110,
                }}
                focused
              >
                <InputLabel id="feed-supply-select-label10">Min *</InputLabel>
                <Select
                  labelId="feed-supply-select-label10"
                  id="feed-supply-select10"
                  label="Min *"
                  {...register(
                    'nutritionalGuarantee.metabolizableEnergy.value',
                    {
                      required: true,
                    },
                  )}
                  value={
                    watch('nutritionalGuarantee.metabolizableEnergy.value') ||
                    ''
                  }
                  onChange={(e) => {
                    setValue(
                      'nutritionalGuarantee.metabolizableEnergy.value',
                      e.target.value,
                    );
                    trigger('nutritionalGuarantee.metabolizableEnergy.value');
                  }}
                >
                  {nutritionalGuarantee.map((guarantee, i) => {
                    return (
                      <MenuItem value={guarantee} key={i}>
                        {guarantee}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
              {errors &&
                errors?.nutritionalGuarantee?.metabolizableEnergy?.value &&
                errors?.nutritionalGuarantee?.metabolizableEnergy.value.type ===
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

            {/* <Box
                sx={{
                  visibility: "hidden",
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="1.5em"
                  height="1.5em"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="red"
                    d="M12 20c-4.41 0-8-3.59-8-8s3.59-8 8-8s8 3.59 8 8s-3.59 8-8 8m0-18C6.47 2 2 6.47 2 12s4.47 10 10 10s10-4.47 10-10S17.53 2 12 2m2.59 6L12 10.59L9.41 8L8 9.41L10.59 12L8 14.59L9.41 16L12 13.41L14.59 16L16 14.59L13.41 12L16 9.41z"
                  />
                </svg>
              </Box> */}

            {!watch('nutritionalGuarantee.metabolizableEnergy.value') &&
              !watch('nutritionalGuarantee.metabolizableEnergy.kg') && (
                <Box
                  fontSize={14}
                  fontWeight={500}
                  width="fit-content"
                  onClick={() => {
                    setValue(
                      'nutritionalGuarantee.metabolizableEnergy.value',
                      '',
                    );
                    setValue('nutritionalGuarantee.metabolizableEnergy.kg', '');
                  }}
                  style={{ cursor: 'pointer' }}
                  sx={{
                    visibility: 'hidden',
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="1.5em"
                    height="1.5em"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="red"
                      d="M12 20c-4.41 0-8-3.59-8-8s3.59-8 8-8s8 3.59 8 8s-3.59 8-8 8m0-18C6.47 2 2 6.47 2 12s4.47 10 10 10s10-4.47 10-10S17.53 2 12 2m2.59 6L12 10.59L9.41 8L8 9.41L10.59 12L8 14.59L9.41 16L12 13.41L14.59 16L16 14.59L13.41 12L16 9.41z"
                    />
                  </svg>
                </Box>
              )}

            {(watch('nutritionalGuarantee.metabolizableEnergy.value') ||
              watch('nutritionalGuarantee.metabolizableEnergy.kg')) && (
              <Box
                fontSize={14}
                fontWeight={500}
                width="fit-content"
                onClick={() => {
                  setValue(
                    'nutritionalGuarantee.metabolizableEnergy.value',
                    '',
                  );
                  setValue('nutritionalGuarantee.metabolizableEnergy.kg', '');
                  clearErrors([
                    'nutritionalGuarantee.metabolizableEnergy.value',
                    'nutritionalGuarantee.metabolizableEnergy.kg',
                  ]);
                }}
                style={{ cursor: 'pointer' }}
                sx={{
                  position: 'relative',
                  top: '10px',
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="1.5em"
                  height="1.5em"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="red"
                    d="M12 20c-4.41 0-8-3.59-8-8s3.59-8 8-8s8 3.59 8 8s-3.59 8-8 8m0-18C6.47 2 2 6.47 2 12s4.47 10 10 10s10-4.47 10-10S17.53 2 12 2m2.59 6L12 10.59L9.41 8L8 9.41L10.59 12L8 14.59L9.41 16L12 13.41L14.59 16L16 14.59L13.41 12L16 9.41z"
                  />
                </svg>
              </Box>
            )}
          </Grid>
        </Grid>
      </Box>
    </Stack>
  );
};
export default NutritionalGuarantee;
