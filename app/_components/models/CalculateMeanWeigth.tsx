import {
  Box,
  Button,
  IconButton,
  Modal,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import React, { useEffect } from 'react';
import { Close as CloseIcon } from '@mui/icons-material';
import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import * as validationMessage from '@/app/_lib/utils/validationsMessage/index';

interface InputTypes {
  avgOfMeanWeight?: number;

  meanWeight: {
    noOfFish: number | undefined;
    totalWeight: number | undefined;
    meanWeight: number;
  }[];
}
interface Props {
  setOpen: (open: boolean) => void;
  open: boolean;
  setAvgOfMeanWeight: (val: number) => void;
}
const CalculateMeanWeigth = ({ open, setOpen, setAvgOfMeanWeight }: Props) => {
  const {
    register,
    control,
    setValue,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<InputTypes>({
    defaultValues: {
      meanWeight: [
        { meanWeight: 0, noOfFish: undefined, totalWeight: undefined },
      ],
    },
  });
  const watchFields = watch(`meanWeight`);
  const onSubmit: SubmitHandler<InputTypes> = (data) => {
    if (data.avgOfMeanWeight) {
      setAvgOfMeanWeight(data.avgOfMeanWeight);
      setOpen(false);
      reset();
    } else {
      toast.dismiss();
      toast.error('Please fill the number of fish and total weight');
    }
  };
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'meanWeight',
  });
  const handleClose = () => {
    setOpen(false);
    reset();
  };

  const handleKeyPress = (key: string) => {
    if (key === 'Enter') {
      append({ noOfFish: undefined, totalWeight: undefined, meanWeight: 0 });
    }
  };
  useEffect(() => {
    watchFields.map((feild, i) => {
      if (feild.noOfFish && feild.totalWeight) {
        setValue(
          `meanWeight.${i}.meanWeight`,
          Math.round(Number(feild.totalWeight) / Number(feild.noOfFish)),
        );
      }

      const totalWeightArr: Array<number> = [];
      const totalFishsArr: Array<number> = [];

      watchFields.map((feild) => {
        if (feild.totalWeight) {
          totalWeightArr.push(Number(feild.totalWeight));
        }
        if (feild.noOfFish) {
          totalFishsArr.push(Number(feild.noOfFish));
        }
      });

      const totalWeight = totalWeightArr.reduce((acc, val) => {
        return (acc += val);
      }, 0);
      const totalFish = totalFishsArr.reduce((acc, val) => {
        return (acc += val);
      }, 0);
      const avgOfMeanWeight = totalWeight / totalFish;
      setValue('avgOfMeanWeight', avgOfMeanWeight);
    });
  }, [
    watchFields.map((field) => field.noOfFish).join(','),
    watchFields.map((field) => field.totalWeight).join(','),
  ]);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="child-modal-title"
      aria-describedby="child-modal-description"
      onKeyUp={(e) => handleKeyPress(e.key)}
      className="custom-modal-positioning"
    >
      <Stack
        bgcolor={'white'}
        borderRadius={2}
        mx={'auto'}
        height={'fit-content'}
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%,-50%)',
          width: {
            md: 'fit-content',
            sm: '70%',
            xs: '90%',
          },
        }}
      >
        <form className="form-height">
          <Box
            display={'flex'}
            justifyContent={'center'}
            alignItems={'center'}
            width={'100%'}
          >
            <Box>
              <Box display="flex" justifyContent="end" padding={2}>
                <IconButton
                  onClick={handleClose}
                  sx={{
                    color: 'inherit',
                    background: 'transparent',
                    margin: '2',
                    mr: 0,
                  }}
                >
                  <CloseIcon />
                </IconButton>
              </Box>

              {fields?.map((field, idx) => (
                <Stack
                  key={field.id}
                  display={'flex'}
                  direction={'row'}
                  sx={{
                    width: '100%',
                    paddingInline: '20px',
                    marginBottom: 2,
                    gap: 1.5,
                    justifyContent: {
                      lg: 'center',
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
                      label="Number of fish *"
                      type="number"
                      {...register(`meanWeight.${idx}.noOfFish`, {
                        required: true,
                      })}
                      focused
                      className="form-input"
                      sx={{ width: '100%' }}
                    />

                    {errors &&
                      errors.meanWeight &&
                      errors.meanWeight[idx] &&
                      errors.meanWeight[idx].noOfFish?.type === 'required' && (
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
                    position={'relative'}
                    sx={{
                      width: {
                        lg: '100%',
                        md: '48.4%',
                        xs: '100%',
                      },
                    }}
                  >
                    <TextField
                      label="Total weight *"
                      type="number"
                      {...register(`meanWeight.${idx}.totalWeight`, {
                        required: true,
                      })}
                      focused
                      className="form-input"
                      sx={{ width: '100%' }}
                    />
                    <Typography
                      variant="body2"
                      color="#555555AC"
                      sx={{
                        position: 'absolute',
                        right: 6,
                        top: '29px',
                        transform: 'translate(-6px, -50%)',
                        backgroundColor: '#fff',
                        height: 30,
                        display: 'grid',
                        placeItems: 'center',
                        zIndex: 1,
                        pl: 1,
                      }}
                    >
                      g
                    </Typography>
                    {errors &&
                      errors.meanWeight &&
                      errors.meanWeight[idx] &&
                      errors.meanWeight[idx].totalWeight && (
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
                    position={'relative'}
                    sx={{
                      width: {
                        lg: '100%',
                        md: '48.4%',
                        xs: '100%',
                      },
                    }}
                  >
                    <TextField
                      label="Mean weight *"
                      type="number"
                      disabled
                      focused
                      {...register(`meanWeight.${idx}.meanWeight`)}
                      className="form-input"
                      sx={{ width: '100%' }}
                    />
                    <Typography
                      variant="body2"
                      color="#555555AC"
                      sx={{
                        position: 'absolute',
                        right: 6,
                        top: '50%',
                        transform: 'translate(-6px, -50%)',
                        backgroundColor: '#fff',
                        height: 30,
                        display: 'grid',
                        placeItems: 'center',
                        zIndex: 1,
                        pl: 1,
                      }}
                    >
                      g
                    </Typography>
                  </Box>

                  <Box
                    display={'flex'}
                    alignItems={'center'}
                    justifyContent={'end'}
                    position={'relative'}
                    sx={{
                      visibility: idx === 0 ? 'hidden' : '',
                      cursor: 'pointer',
                      width: {
                        xs: 'auto',
                      },
                    }}
                    onClick={() => remove(idx)}
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
                          fill="#ff0000"
                          d="M14.28 2a2 2 0 0 1 1.897 1.368L16.72 5H20a1 1 0 1 1 0 2l-.003.071l-.867 12.143A3 3 0 0 1 16.138 22H7.862a3 3 0 0 1-2.992-2.786L4.003 7.07L4 7a1 1 0 0 1 0-2h3.28l.543-1.632A2 2 0 0 1 9.721 2zm3.717 5H6.003l.862 12.071a1 1 0 0 0 .997.929h8.276a1 1 0 0 0 .997-.929zM10 10a1 1 0 0 1 .993.883L11 11v5a1 1 0 0 1-1.993.117L9 16v-5a1 1 0 0 1 1-1m4 0a1 1 0 0 1 1 1v5a1 1 0 1 1-2 0v-5a1 1 0 0 1 1-1m.28-6H9.72l-.333 1h5.226z"
                        />
                      </g>
                    </svg>
                  </Box>
                </Stack>
              ))}

              <Box
                px={2}
                mt={3}
                display={'flex'}
                alignItems={'center'}
                gap={1.5}
              >
                <Typography variant="body1" fontWeight={600}>
                  Mean Weight :
                </Typography>

                <Typography variant="body1">
                  {watch('avgOfMeanWeight')
                    ? Number(watch('avgOfMeanWeight')).toFixed(2)
                    : 0}
                </Typography>
              </Box>

              <Box
                display="flex"
                justifyContent="flex-end"
                alignItems={'flex-end'}
                gap="10px"
                padding={3}
                // marginX={"40px"}
              >
                <Button
                  type="button"
                  variant="contained"
                  onClick={() =>
                    append({
                      meanWeight: 0,
                      noOfFish: undefined,
                      totalWeight: undefined,
                    })
                  }
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
                  Add Row
                </Button>

                <Button
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
                  onClick={handleSubmit(onSubmit)}
                >
                  Save
                </Button>
              </Box>
            </Box>
          </Box>
        </form>
      </Stack>
    </Modal>
  );
};

export default CalculateMeanWeigth;
