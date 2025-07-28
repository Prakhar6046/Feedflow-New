import * as validationPattern from '@/app/_lib/utils/validationPatterns/index';
import * as validationMessage from '@/app/_lib/utils/validationsMessage/index';
import { Close as CloseIcon } from '@mui/icons-material'; // Use Material-UI's Close icon directly
import {
  Box,
  Button,
  Divider,
  Grid,
  IconButton,
  Modal,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Dayjs } from 'dayjs';
import React, { useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
const style = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
};

interface Props {
  setOpen: (open: boolean) => void;
  open: boolean;
}
interface InputTypes {
  date: Dayjs | null;
  do: string;
  ammonia: string;
  TSs: string;
}
const SamplingEnvironmentCal: React.FC<Props> = ({ setOpen, open }) => {
  const [isApiCallInProgress, setIsApiCallInProgress] =
    useState<boolean>(false);

  const {
    register,
    formState: { errors },

    reset,
    handleSubmit,
    control,
  } = useForm<InputTypes>({
    mode: 'onChange',
  });

  const onSubmit: SubmitHandler<InputTypes> = async () => {
    // Prevent API call if one is already in progress
    if (isApiCallInProgress) return;
    setIsApiCallInProgress(true);

    try {
      // const token = getCookie("auth-token");
      // const response = await fetch("/api/production/mange", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //     Authorization: `Bearer ${token}`,
      //   },
      //   body: JSON.stringify(payload),
      // });
      // const res = await response.json();
      // if (res.status) {
      //   toast.dismiss();
      //   toast.success(res.message);
      //   setOpen(false);
      //   router.push("/dashboard/production");
      //   reset();
      //   router.refresh();
      // } else {
      //   toast.dismiss();
      //   toast.error(
      //     "Please enter biomass and fish count value less than selected production"
      //   );
      // }
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsApiCallInProgress(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="parent-modal-title"
      aria-describedby="parent-modal-description"
      className="modal-positioning"
      onBackdropClick={() => reset()}
    >
      <Stack sx={style}>
        <Box display="flex" justifyContent="flex-end" padding={2}>
          <IconButton
            onClick={handleClose}
            sx={{
              color: 'inherit',
              background: 'transparent',
              margin: '2',
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
        <form className="form-height" onSubmit={handleSubmit(onSubmit)}>
          <Box paddingInline={4}>
            <Stack
            // sx={{
            //   overflowY: {
            //     xl: "visible",
            //     xs: "auto",
            //   },
            //   width: "97%",
            // }}
            >
              <Grid
                container
                spacing={2}
                // className="grid-margin"
                // sx={{
                //   flexWrap: "nowrap",
                // }}
              >
                <Grid item md={3} xs={6}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Controller
                      name="date"
                      control={control}
                      rules={{ required: 'This field is required.' }}
                      render={({ field, fieldState: { error } }) => (
                        <>
                          <DatePicker
                            {...field}
                            label="Date * "
                            className="form-input"
                            sx={{
                              width: '100%',
                            }}
                            onChange={(date) => {
                              field.onChange(date);
                            }}
                            value={field.value || null}
                          />
                          {error && (
                            <Typography
                              variant="body2"
                              color="red"
                              fontSize={13}
                              mt={0.5}
                            >
                              {error.message}
                            </Typography>
                          )}
                        </>
                      )}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid xs={6} md={3} item>
                  <Box
                    display={'flex'}
                    gap={2}
                    alignItems={'center'}
                    position={'relative'}
                  >
                    <TextField
                      label="Do *"
                      type="text"
                      className="form-input"
                      sx={{ width: '100%' }}
                      {...register(`do`, {
                        required: true,
                        pattern: validationPattern.numbersWithDot,
                        maxLength: 10,
                      })}
                    />

                    {/* <Typography
                            variant="body2"
                            color="#555555AC"
                            sx={{
                              position: "absolute",
                              right: 6,
                              top: "50%",
                              transform: "translate(-6px, -50%)",
                              backgroundColor: "#fff",
                              height: 30,
                              display: "grid",
                              placeItems: "center",
                              zIndex: 1,
                              pl: 1,
                            }}
                          >
                            kg
                          </Typography> */}
                  </Box>
                  <Typography
                    variant="body2"
                    color="red"
                    fontSize={13}
                    mt={0.5}
                  ></Typography>
                  {errors && errors.do && errors.do.type === 'required' && (
                    <Typography
                      variant="body2"
                      color="red"
                      fontSize={13}
                      mt={0.5}
                    >
                      {validationMessage.required}
                    </Typography>
                  )}
                  {errors && errors.do && errors.do.type === 'pattern' && (
                    <Typography
                      variant="body2"
                      color="red"
                      fontSize={13}
                      mt={0.5}
                    >
                      {validationMessage.OnlyNumbersWithDot}
                    </Typography>
                  )}
                  {errors && errors.do && errors.do.type === 'maxLength' && (
                    <Typography
                      variant="body2"
                      color="red"
                      fontSize={13}
                      mt={0.5}
                    >
                      {validationMessage.numberMaxLength}
                    </Typography>
                  )}
                </Grid>
                <Grid xs={6} md={3} item>
                  <Box
                    display={'flex'}
                    gap={2}
                    alignItems={'center'}
                    position={'relative'}
                  >
                    <TextField
                      label="Ammonia *"
                      type="text"
                      className="form-input"
                      sx={{ width: '100%' }}
                      {...register(`ammonia`, {
                        required: true,
                        pattern: validationPattern.numbersWithDot,
                        maxLength: 10,
                      })}
                    />

                    {/* <Typography
                            variant="body2"
                            color="#555555AC"
                            sx={{
                              position: "absolute",
                              right: 6,
                              top: "50%",
                              transform: "translate(-6px, -50%)",
                              backgroundColor: "#fff",
                              height: 30,
                              display: "grid",
                              placeItems: "center",
                              zIndex: 1,
                              pl: 1,
                            }}
                          >
                            kg
                          </Typography> */}
                  </Box>
                  <Typography
                    variant="body2"
                    color="red"
                    fontSize={13}
                    mt={0.5}
                  ></Typography>
                  {errors &&
                    errors.ammonia &&
                    errors.ammonia.type === 'required' && (
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
                    errors.ammonia &&
                    errors.ammonia.type === 'pattern' && (
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
                    errors.ammonia &&
                    errors.ammonia.type === 'maxLength' && (
                      <Typography
                        variant="body2"
                        color="red"
                        fontSize={13}
                        mt={0.5}
                      >
                        {validationMessage.numberMaxLength}
                      </Typography>
                    )}
                </Grid>
                <Grid xs={6} md={3} item>
                  <Box
                    display={'flex'}
                    gap={2}
                    alignItems={'center'}
                    position={'relative'}
                  >
                    <TextField
                      label="TSS *"
                      type="text"
                      className="form-input"
                      sx={{ width: '100%' }}
                      {...register(`TSs`, {
                        required: true,
                        pattern: validationPattern.numbersWithDot,
                        maxLength: 10,
                      })}
                    />

                    {/* <Typography
                            variant="body2"
                            color="#555555AC"
                            sx={{
                              position: "absolute",
                              right: 6,
                              top: "50%",
                              transform: "translate(-6px, -50%)",
                              backgroundColor: "#fff",
                              height: 30,
                              display: "grid",
                              placeItems: "center",
                              zIndex: 1,
                              pl: 1,
                            }}
                          >
                            kg
                          </Typography> */}
                  </Box>
                  <Typography
                    variant="body2"
                    color="red"
                    fontSize={13}
                    mt={0.5}
                  ></Typography>
                  {errors && errors.TSs && errors.TSs.type === 'required' && (
                    <Typography
                      variant="body2"
                      color="red"
                      fontSize={13}
                      mt={0.5}
                    >
                      {validationMessage.required}
                    </Typography>
                  )}
                  {errors && errors.TSs && errors.TSs.type === 'pattern' && (
                    <Typography
                      variant="body2"
                      color="red"
                      fontSize={13}
                      mt={0.5}
                    >
                      {validationMessage.OnlyNumbersWithDot}
                    </Typography>
                  )}
                  {errors && errors.TSs && errors.TSs.type === 'maxLength' && (
                    <Typography
                      variant="body2"
                      color="red"
                      fontSize={13}
                      mt={0.5}
                    >
                      {validationMessage.numberMaxLength}
                    </Typography>
                  )}
                </Grid>
              </Grid>
            </Stack>

            <Divider
              orientation="vertical"
              sx={{
                height: '100%',
                borderBottom: '2px solid #E6E7E9 !important',
                borderRight: 'none !important',
                width: '100%',
                marginLeft: '12px',
                paddingBlock: '10px',
              }}
            />
          </Box>
          <Box
            display="flex"
            justifyContent="flex-end"
            alignItems={'flex-end'}
            gap="10px"
            padding={3}
            margin={'40px'}
          >
            <Button
              className=""
              type="submit"
              variant="contained"
              sx={{
                background: '#06A19B',
                fontWeight: 'bold',
                padding: '8px 20px',
                width: {
                  xs: '50%',
                  lg: 'fit-content',
                },
                textTransform: 'capitalize',
                borderRadius: '12px',

                marginBlock: '10px',
              }}
            >
              Save
            </Button>
          </Box>
        </form>
      </Stack>
    </Modal>
  );
};

export default SamplingEnvironmentCal;
