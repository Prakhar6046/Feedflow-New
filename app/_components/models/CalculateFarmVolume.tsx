import {
  CalculateType,
  ProductionUnitsFormTypes,
  UnitsTypes,
} from '@/app/_typeModels/Farm';
import closeIcon from '@/public/static/img/icons/ic-close.svg';
import {
  Box,
  Button,
  Modal,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import Image from 'next/image';
import {
  FieldErrors,
  UseFormClearErrors,
  UseFormRegister,
  UseFormSetValue,
  UseFormTrigger,
  UseFormWatch,
} from 'react-hook-form';

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
  selectedUnit: UnitsTypes | undefined;
  setCalculatedValue: (val: CalculateType) => void;
  calculatedValue: CalculateType | undefined;
  register: UseFormRegister<ProductionUnitsFormTypes>;
  errors: FieldErrors<ProductionUnitsFormTypes>;
  trigger: UseFormTrigger<ProductionUnitsFormTypes>;
  watch: UseFormWatch<ProductionUnitsFormTypes>;
  validationMessage: Record<string, string>;
  clearErrors: UseFormClearErrors<ProductionUnitsFormTypes>;
  setValue: UseFormSetValue<ProductionUnitsFormTypes>;
}

const CalculateVolume2: React.FC<Props> = ({
  setOpen,
  open,
  selectedUnit,
  setCalculatedValue,
  register,
  errors,
  trigger,
  watch,
  validationMessage,
  clearErrors,
  setValue,
}) => {
  const handleCalculate = () => {
    trigger('length');
    trigger('width');
    trigger('depth');
    trigger('area');
    trigger('radius');
    trigger('height');
    const length = watch('length');
    const width = watch('width');
    const depth = watch('depth');
    const area = watch('area');
    const radius = watch('radius');
    const heigth = watch('height');
    if (
      Number(length) ||
      Number(width) ||
      Number(depth) ||
      Number(area) ||
      Number(radius)
    ) {
      let output;
      if (
        selectedUnit?.name === 'Rectangular Tank' &&
        Number(length) &&
        Number(width) &&
        Number(depth)
      ) {
        output = Number(length) * Number(width) * Number(depth);
      } else if (
        selectedUnit?.name === 'Earthen Pond' &&
        Number(area) &&
        Number(depth)
      ) {
        output = Number(area) * Number(depth);
      } else if (
        selectedUnit?.name === 'Raceway' &&
        Number(length) &&
        Number(width) &&
        Number(depth)
      ) {
        output = Number(length) * Number(width) * Number(depth);
      } else if (
        selectedUnit?.name === 'Cage' &&
        Number(length) &&
        Number(width) &&
        Number(heigth)
      ) {
        output = Number(length) * Number(width) * Number(heigth);
      } else if (
        selectedUnit?.name === 'Hapa' &&
        Number(length) &&
        Number(width) &&
        Number(heigth)
      ) {
        output = Number(length) * Number(width) * Number(heigth);
      } else if (
        selectedUnit?.name === 'Circular Tank' &&
        Number(radius) &&
        Number(depth)
      ) {
        output = 3.14159 * Number(radius) * 2 * Number(depth);
      } else if (
        selectedUnit?.name === 'D-end Tank' &&
        Number(radius) &&
        Number(length) &&
        Number(width) &&
        Number(depth)
      ) {
        output =
          (2 * 3.14159 * Number(radius) * 2 +
            (Number(length) - Number(radius)) * Number(Number(width))) *
          Number(depth);
      } else {
      }
      if (selectedUnit?.id) {
        setCalculatedValue({
          output: Number(output),
          id: Number(selectedUnit.id),
        });
      }
      setOpen(false);
      if (selectedUnit?.index) {
        clearErrors(`productionUnits.${selectedUnit?.index}.capacity`);
      }
      setValue('length', '1');
      setValue('width', '1');
      setValue('radius', '1');
      setValue('area', '1');
      setValue('depth', '1');
      setValue('height', '1');
    }
  };
  const handleClose = () => {
    setOpen(false);
    setValue('length', '');
    setValue('width', '');
    setValue('radius', '');
    setValue('area', '');
    setValue('depth', '');
    setValue('height', '');
    clearErrors(['length', 'width', 'depth', 'radius', 'area', 'height']);
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Stack sx={style} borderRadius="14px">
        <Box
          bgcolor="#F5F6F8"
          paddingInline={3}
          paddingBlock={2}
          display="flex"
          justifyContent="space-between"
          gap={2}
          alignItems={'center'}
          sx={{
            borderTopLeftRadius: '14px',
            borderTopRightRadius: '14px',
          }}
        >
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            color="#67737F"
            fontSize={18}
            fontWeight={600}
          >
            Calculate capacity
          </Typography>

          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            sx={{
              opacity: 0.5,
              cursor: 'pointer',
            }}
            onClick={handleClose}
          >
            <Image src={closeIcon} width={25} height={25} alt="Close Icon" />
          </Box>
        </Box>
        <Box
          px={3}
          pt={2}
          display={'flex'}
          alignItems={'center'}
          gap={1}
          justifyContent={'start'}
        >
          <Typography variant="body2" color="black" fontWeight={500}>
            {selectedUnit?.name} Formula
          </Typography>
          <Typography variant="body2" color="#555555">
            = &nbsp;
            {selectedUnit?.formula}
          </Typography>
        </Box>
        {selectedUnit?.name === 'Rectangular Tank' ? (
          <Box padding={3} display={'flex'} alignItems={'start'} gap={1}>
            <Box position={'relative'}>
              <TextField
                label="Length *"
                variant="outlined"
                fullWidth
                type="text"
                className="form-input"
                sx={{
                  width: '100%',
                }}
                focused
                {...register('length', {
                  required: true,
                  pattern: /^\d*\.?\d*$/,
                })}
              />
              <Typography
                variant="body2"
                color="#555555AC"
                sx={{
                  position: 'absolute',
                  right: 6,
                  top: '28px',
                  transform: 'translate(-6px, -50%)',
                  backgroundColor: '#fff',
                  height: 30,
                  display: 'grid',
                  placeItems: 'center',
                  zIndex: 1,
                  pl: 1,
                }}
              >
                m
              </Typography>
              {errors?.length?.type === 'required' && (
                <Typography variant="body2" color="red" fontSize={13} mt={0.5}>
                  {validationMessage.required}
                </Typography>
              )}
              {errors?.length?.type === 'pattern' && (
                <Typography variant="body2" color="red" fontSize={13} mt={0.5}>
                  Please enter valid numbers.
                </Typography>
              )}
            </Box>

            <Box position={'relative'}>
              <TextField
                label="Width *"
                variant="outlined"
                fullWidth
                type="text"
                className="form-input"
                sx={{
                  width: '100%',
                }}
                focused
                {...register('width', {
                  required: true,
                  pattern: /^\d*\.?\d*$/,
                })}
              />
              <Typography
                variant="body2"
                color="#555555AC"
                sx={{
                  position: 'absolute',
                  right: 6,
                  top: '28px',
                  transform: 'translate(-6px, -50%)',
                  backgroundColor: '#fff',
                  height: 30,
                  display: 'grid',
                  placeItems: 'center',
                  zIndex: 1,
                  pl: 1,
                }}
              >
                m
              </Typography>
              {errors?.width?.type === 'required' && (
                <Typography variant="body2" color="red" fontSize={13} mt={0.5}>
                  {validationMessage.required}
                </Typography>
              )}
              {errors?.width?.type === 'pattern' && (
                <Typography variant="body2" color="red" fontSize={13} mt={0.5}>
                  Please enter valid numbers.
                </Typography>
              )}
            </Box>

            <Box position={'relative'}>
              <TextField
                label="Depth *"
                variant="outlined"
                fullWidth
                type="text"
                className="form-input"
                sx={{
                  width: '100%',
                }}
                focused
                {...register('depth', {
                  required: true,
                  pattern: /^\d*\.?\d*$/,
                })}
              />
              <Typography
                variant="body2"
                color="#555555AC"
                sx={{
                  position: 'absolute',
                  right: 6,
                  top: '28px',
                  transform: 'translate(-6px, -50%)',
                  backgroundColor: '#fff',
                  height: 30,
                  display: 'grid',
                  placeItems: 'center',
                  zIndex: 1,
                  pl: 1,
                }}
              >
                m
              </Typography>
              {errors?.depth?.type === 'required' && (
                <Typography variant="body2" color="red" fontSize={13} mt={0.5}>
                  {validationMessage.required}
                </Typography>
              )}
              {errors?.depth?.type === 'pattern' && (
                <Typography variant="body2" color="red" fontSize={13} mt={0.5}>
                  Please enter valid numbers.
                </Typography>
              )}
            </Box>
          </Box>
        ) : selectedUnit?.name === 'Earthen Pond' ? (
          <Box padding={3} display={'flex'} alignItems={'start'} gap={1}>
            <Box position={'relative'}>
              <TextField
                label="Surface area *"
                variant="outlined"
                fullWidth
                type="text"
                className="form-input"
                sx={{
                  width: '100%',
                }}
                focused
                {...register('area', {
                  required: true,
                  pattern: /^\d*\.?\d*$/,
                })}
              />
              <Typography
                variant="body2"
                color="#555555AC"
                sx={{
                  position: 'absolute',
                  right: 6,
                  top: '28px',
                  transform: 'translate(-6px, -50%)',
                  backgroundColor: '#fff',
                  height: 30,
                  display: 'grid',
                  placeItems: 'center',
                  zIndex: 1,
                  pl: 1,
                }}
              >
                m
              </Typography>
              {errors?.area?.type === 'required' && (
                <Typography variant="body2" color="red" fontSize={13} mt={0.5}>
                  {validationMessage.required}
                </Typography>
              )}
              {errors?.area?.type === 'pattern' && (
                <Typography variant="body2" color="red" fontSize={13} mt={0.5}>
                  Please enter valid numbers.
                </Typography>
              )}
            </Box>

            <Box position={'relative'}>
              <TextField
                label="Depth *"
                variant="outlined"
                fullWidth
                type="text"
                className="form-input"
                sx={{
                  width: '100%',
                }}
                focused
                {...register('depth', {
                  required: true,
                  pattern: /^\d*\.?\d*$/,
                })}
              />
              <Typography
                variant="body2"
                color="#555555AC"
                sx={{
                  position: 'absolute',
                  right: 6,
                  top: '28px',
                  transform: 'translate(-6px, -50%)',
                  backgroundColor: '#fff',
                  height: 30,
                  display: 'grid',
                  placeItems: 'center',
                  zIndex: 1,
                  pl: 1,
                }}
              >
                m
              </Typography>
              {errors?.depth?.type === 'required' && (
                <Typography variant="body2" color="red" fontSize={13} mt={0.5}>
                  {validationMessage.required}
                </Typography>
              )}
              {errors?.depth?.type === 'pattern' && (
                <Typography variant="body2" color="red" fontSize={13} mt={0.5}>
                  Please enter valid numbers.
                </Typography>
              )}
            </Box>
          </Box>
        ) : selectedUnit?.name === 'Raceway' ? (
          <Box padding={3} display={'flex'} alignItems={'start'} gap={1}>
            <Box position={'relative'}>
              <TextField
                label="Length *"
                variant="outlined"
                fullWidth
                type="text"
                className="form-input"
                sx={{
                  width: '100%',
                }}
                focused
                {...register('length', {
                  required: true,
                  pattern: /^\d*\.?\d*$/,
                })}
              />
              <Typography
                variant="body2"
                color="#555555AC"
                sx={{
                  position: 'absolute',
                  right: 6,
                  top: '28px',
                  transform: 'translate(-6px, -50%)',
                  backgroundColor: '#fff',
                  height: 30,
                  display: 'grid',
                  placeItems: 'center',
                  zIndex: 1,
                  pl: 1,
                }}
              >
                m
              </Typography>
              {errors?.length?.type === 'required' && (
                <Typography variant="body2" color="red" fontSize={13} mt={0.5}>
                  {validationMessage.required}
                </Typography>
              )}
              {errors?.length?.type === 'pattern' && (
                <Typography variant="body2" color="red" fontSize={13} mt={0.5}>
                  Please enter valid numbers.
                </Typography>
              )}
            </Box>

            <Box position={'relative'}>
              <TextField
                label="Width *"
                variant="outlined"
                fullWidth
                type="text"
                className="form-input"
                sx={{
                  width: '100%',
                }}
                focused
                {...register('width', {
                  required: true,
                  pattern: /^\d*\.?\d*$/,
                })}
              />
              <Typography
                variant="body2"
                color="#555555AC"
                sx={{
                  position: 'absolute',
                  right: 6,
                  top: '28px',
                  transform: 'translate(-6px, -50%)',
                  backgroundColor: '#fff',
                  height: 30,
                  display: 'grid',
                  placeItems: 'center',
                  zIndex: 1,
                  pl: 1,
                }}
              >
                m
              </Typography>
              {errors?.width?.type === 'required' && (
                <Typography variant="body2" color="red" fontSize={13} mt={0.5}>
                  {validationMessage.required}
                </Typography>
              )}
              {errors?.width?.type === 'pattern' && (
                <Typography variant="body2" color="red" fontSize={13} mt={0.5}>
                  Please enter valid numbers.
                </Typography>
              )}
            </Box>

            <Box position={'relative'}>
              <TextField
                label="Depth *"
                variant="outlined"
                fullWidth
                type="text"
                className="form-input"
                sx={{
                  width: '100%',
                }}
                focused
                {...register('depth', {
                  required: true,
                  pattern: /^\d*\.?\d*$/,
                })}
              />
              <Typography
                variant="body2"
                color="#555555AC"
                sx={{
                  position: 'absolute',
                  right: 6,
                  top: '28px',
                  transform: 'translate(-6px, -50%)',
                  backgroundColor: '#fff',
                  height: 30,
                  display: 'grid',
                  placeItems: 'center',
                  zIndex: 1,
                  pl: 1,
                }}
              >
                m
              </Typography>
              {errors?.depth?.type === 'required' && (
                <Typography variant="body2" color="red" fontSize={13} mt={0.5}>
                  {validationMessage.required}
                </Typography>
              )}
              {errors?.depth?.type === 'pattern' && (
                <Typography variant="body2" color="red" fontSize={13} mt={0.5}>
                  Please enter valid numbers.
                </Typography>
              )}
            </Box>
          </Box>
        ) : selectedUnit?.name === 'Cage' ? (
          <Box padding={3} display={'flex'} alignItems={'start'} gap={1}>
            <Box position={'relative'}>
              <TextField
                label="Length *"
                variant="outlined"
                fullWidth
                type="text"
                className="form-input"
                sx={{
                  width: '100%',
                }}
                focused
                {...register('length', {
                  required: true,
                  pattern: /^\d*\.?\d*$/,
                })}
              />
              <Typography
                variant="body2"
                color="#555555AC"
                sx={{
                  position: 'absolute',
                  right: 6,
                  top: '28px',
                  transform: 'translate(-6px, -50%)',
                  backgroundColor: '#fff',
                  height: 30,
                  display: 'grid',
                  placeItems: 'center',
                  zIndex: 1,
                  pl: 1,
                }}
              >
                m
              </Typography>
              {errors?.length?.type === 'required' && (
                <Typography variant="body2" color="red" fontSize={13} mt={0.5}>
                  {validationMessage.required}
                </Typography>
              )}
              {errors?.length?.type === 'pattern' && (
                <Typography variant="body2" color="red" fontSize={13} mt={0.5}>
                  Please enter valid numbers.
                </Typography>
              )}
            </Box>

            <Box position={'relative'}>
              <TextField
                label="Width *"
                variant="outlined"
                fullWidth
                type="text"
                className="form-input"
                sx={{
                  width: '100%',
                }}
                focused
                {...register('width', {
                  required: true,
                  pattern: /^\d*\.?\d*$/,
                })}
              />
              <Typography
                variant="body2"
                color="#555555AC"
                sx={{
                  position: 'absolute',
                  right: 6,
                  top: '28px',
                  transform: 'translate(-6px, -50%)',
                  backgroundColor: '#fff',
                  height: 30,
                  display: 'grid',
                  placeItems: 'center',
                  zIndex: 1,
                  pl: 1,
                }}
              >
                m
              </Typography>
              {errors?.width?.type === 'required' && (
                <Typography variant="body2" color="red" fontSize={13} mt={0.5}>
                  {validationMessage.required}
                </Typography>
              )}
              {errors?.width?.type === 'pattern' && (
                <Typography variant="body2" color="red" fontSize={13} mt={0.5}>
                  Please enter valid numbers.
                </Typography>
              )}
            </Box>

            <Box position={'relative'}>
              <TextField
                label="Height *"
                variant="outlined"
                fullWidth
                type="text"
                className="form-input"
                sx={{
                  width: '100%',
                }}
                focused
                {...register('height', {
                  required: true,
                  pattern: /^\d*\.?\d*$/,
                })}
              />
              <Typography
                variant="body2"
                color="#555555AC"
                sx={{
                  position: 'absolute',
                  right: 6,
                  top: '28px',
                  transform: 'translate(-6px, -50%)',
                  backgroundColor: '#fff',
                  height: 30,
                  display: 'grid',
                  placeItems: 'center',
                  zIndex: 1,
                  pl: 1,
                }}
              >
                m
              </Typography>
              {errors?.height?.type === 'required' && (
                <Typography variant="body2" color="red" fontSize={13} mt={0.5}>
                  {validationMessage.required}
                </Typography>
              )}
              {errors?.height?.type === 'pattern' && (
                <Typography variant="body2" color="red" fontSize={13} mt={0.5}>
                  Please enter valid numbers.
                </Typography>
              )}
            </Box>
          </Box>
        ) : selectedUnit?.name === 'Hapa' ? (
          <Box padding={3} display={'flex'} alignItems={'start'} gap={1}>
            <Box position={'relative'}>
              <TextField
                label="Length *"
                variant="outlined"
                fullWidth
                type="text"
                className="form-input"
                sx={{
                  width: '100%',
                }}
                focused
                {...register('length', {
                  required: true,
                  pattern: /^\d*\.?\d*$/,
                })}
              />
              <Typography
                variant="body2"
                color="#555555AC"
                sx={{
                  position: 'absolute',
                  right: 6,
                  top: '28px',
                  transform: 'translate(-6px, -50%)',
                  backgroundColor: '#fff',
                  height: 30,
                  display: 'grid',
                  placeItems: 'center',
                  zIndex: 1,
                  pl: 1,
                }}
              >
                m
              </Typography>
              {errors?.length?.type === 'required' && (
                <Typography variant="body2" color="red" fontSize={13} mt={0.5}>
                  {validationMessage.required}
                </Typography>
              )}
              {errors?.length?.type === 'pattern' && (
                <Typography variant="body2" color="red" fontSize={13} mt={0.5}>
                  Please enter valid numbers.
                </Typography>
              )}
            </Box>

            <Box position={'relative'}>
              <TextField
                label="Width *"
                variant="outlined"
                fullWidth
                type="text"
                className="form-input"
                sx={{
                  width: '100%',
                }}
                focused
                {...register('width', {
                  required: true,
                  pattern: /^\d*\.?\d*$/,
                })}
              />
              <Typography
                variant="body2"
                color="#555555AC"
                sx={{
                  position: 'absolute',
                  right: 6,
                  top: '28px',
                  transform: 'translate(-6px, -50%)',
                  backgroundColor: '#fff',
                  height: 30,
                  display: 'grid',
                  placeItems: 'center',
                  zIndex: 1,
                  pl: 1,
                }}
              >
                m
              </Typography>
              {errors?.width?.type === 'required' && (
                <Typography variant="body2" color="red" fontSize={13} mt={0.5}>
                  {validationMessage.required}
                </Typography>
              )}
              {errors?.width?.type === 'pattern' && (
                <Typography variant="body2" color="red" fontSize={13} mt={0.5}>
                  Please enter valid numbers.
                </Typography>
              )}
            </Box>

            <Box position={'relative'}>
              <TextField
                label="Height *"
                variant="outlined"
                fullWidth
                type="text"
                className="form-input"
                sx={{
                  width: '100%',
                }}
                focused
                {...register('height', {
                  required: true,
                  pattern: /^\d*\.?\d*$/,
                })}
              />
              <Typography
                variant="body2"
                color="#555555AC"
                sx={{
                  position: 'absolute',
                  right: 6,
                  top: '28px',
                  transform: 'translate(-6px, -50%)',
                  backgroundColor: '#fff',
                  height: 30,
                  display: 'grid',
                  placeItems: 'center',
                  zIndex: 1,
                  pl: 1,
                }}
              >
                m
              </Typography>
              {errors?.height?.type === 'required' && (
                <Typography variant="body2" color="red" fontSize={13} mt={0.5}>
                  {validationMessage.required}
                </Typography>
              )}
              {errors?.height?.type === 'pattern' && (
                <Typography variant="body2" color="red" fontSize={13} mt={0.5}>
                  Please enter valid numbers.
                </Typography>
              )}
            </Box>
          </Box>
        ) : selectedUnit?.name === 'Circular Tank' ? (
          <Box padding={3} display={'flex'} alignItems={'start'} gap={1}>
            <Box position={'relative'}>
              <TextField
                label="Radius *"
                variant="outlined"
                fullWidth
                type="text"
                className="form-input"
                sx={{
                  width: '100%',
                }}
                focused
                {...register('radius', {
                  required: true,
                  pattern: /^\d*\.?\d*$/,
                })}
              />
              <Typography
                variant="body2"
                color="#555555AC"
                sx={{
                  position: 'absolute',
                  right: 6,
                  top: '28px',
                  transform: 'translate(-6px, -50%)',
                  backgroundColor: '#fff',
                  height: 30,
                  display: 'grid',
                  placeItems: 'center',
                  zIndex: 1,
                  pl: 1,
                }}
              >
                m
              </Typography>
              {errors?.radius?.type === 'required' && (
                <Typography variant="body2" color="red" fontSize={13} mt={0.5}>
                  {validationMessage.required}
                </Typography>
              )}
              {errors?.radius?.type === 'pattern' && (
                <Typography variant="body2" color="red" fontSize={13} mt={0.5}>
                  Please enter valid numbers.
                </Typography>
              )}
            </Box>

            <Box position={'relative'}>
              <TextField
                label="Depth *"
                variant="outlined"
                fullWidth
                type="text"
                className="form-input"
                sx={{
                  width: '100%',
                }}
                focused
                {...register('depth', {
                  required: true,
                  pattern: /^\d*\.?\d*$/,
                })}
              />
              <Typography
                variant="body2"
                color="#555555AC"
                sx={{
                  position: 'absolute',
                  right: 6,
                  top: '28px',
                  transform: 'translate(-6px, -50%)',
                  backgroundColor: '#fff',
                  height: 30,
                  display: 'grid',
                  placeItems: 'center',
                  zIndex: 1,
                  pl: 1,
                }}
              >
                m
              </Typography>
              {errors?.depth?.type === 'required' && (
                <Typography variant="body2" color="red" fontSize={13} mt={0.5}>
                  {validationMessage.required}
                </Typography>
              )}
              {errors?.depth?.type === 'pattern' && (
                <Typography variant="body2" color="red" fontSize={13} mt={0.5}>
                  Please enter valid numbers.
                </Typography>
              )}
            </Box>
          </Box>
        ) : (
          <Box padding={3} display={'flex'} alignItems={'start'} gap={1}>
            <Box position={'relative'}>
              <TextField
                label="Radius *"
                variant="outlined"
                fullWidth
                type="text"
                className="form-input"
                sx={{
                  width: '100%',
                }}
                focused
                {...register('radius', {
                  required: true,
                  pattern: /^\d*\.?\d*$/,
                })}
              />
              <Typography
                variant="body2"
                color="#555555AC"
                sx={{
                  position: 'absolute',
                  right: 6,
                  top: '28px',
                  transform: 'translate(-6px, -50%)',
                  backgroundColor: '#fff',
                  height: 30,
                  display: 'grid',
                  placeItems: 'center',
                  zIndex: 1,
                  pl: 1,
                }}
              >
                m
              </Typography>
              {errors?.radius?.type === 'required' && (
                <Typography variant="body2" color="red" fontSize={13} mt={0.5}>
                  {validationMessage.required}
                </Typography>
              )}
              {errors?.radius?.type === 'pattern' && (
                <Typography variant="body2" color="red" fontSize={13} mt={0.5}>
                  Please enter valid numbers.
                </Typography>
              )}
            </Box>
            <Box position={'relative'}>
              <TextField
                label="Length *"
                variant="outlined"
                fullWidth
                type="text"
                className="form-input"
                sx={{
                  width: '100%',
                }}
                focused
                {...register('length', {
                  required: true,
                  pattern: /^\d*\.?\d*$/,
                })}
              />
              <Typography
                variant="body2"
                color="#555555AC"
                sx={{
                  position: 'absolute',
                  right: 6,
                  top: '28px',
                  transform: 'translate(-6px, -50%)',
                  backgroundColor: '#fff',
                  height: 30,
                  display: 'grid',
                  placeItems: 'center',
                  zIndex: 1,
                  pl: 1,
                }}
              >
                m
              </Typography>
              {errors?.length?.type === 'required' && (
                <Typography variant="body2" color="red" fontSize={13} mt={0.5}>
                  {validationMessage.required}
                </Typography>
              )}
              {errors?.length?.type === 'pattern' && (
                <Typography variant="body2" color="red" fontSize={13} mt={0.5}>
                  Please enter valid numbers.
                </Typography>
              )}
            </Box>

            <Box position={'relative'}>
              <TextField
                label="Width *"
                variant="outlined"
                fullWidth
                type="text"
                className="form-input"
                sx={{
                  width: '100%',
                }}
                focused
                {...register('width', {
                  required: true,
                  pattern: /^\d*\.?\d*$/,
                })}
              />
              <Typography
                variant="body2"
                color="#555555AC"
                sx={{
                  position: 'absolute',
                  right: 6,
                  top: '28px',
                  transform: 'translate(-6px, -50%)',
                  backgroundColor: '#fff',
                  height: 30,
                  display: 'grid',
                  placeItems: 'center',
                  zIndex: 1,
                  pl: 1,
                }}
              >
                m
              </Typography>
              {errors?.width?.type === 'required' && (
                <Typography variant="body2" color="red" fontSize={13} mt={0.5}>
                  {validationMessage.required}
                </Typography>
              )}
              {errors?.width?.type === 'pattern' && (
                <Typography variant="body2" color="red" fontSize={13} mt={0.5}>
                  Please enter valid numbers.
                </Typography>
              )}
            </Box>

            <Box position={'relative'}>
              <TextField
                label="Depth *"
                variant="outlined"
                fullWidth
                type="text"
                className="form-input"
                sx={{
                  width: '100%',
                }}
                focused
                {...register('depth', {
                  required: true,
                  pattern: /^\d*\.?\d*$/,
                })}
              />
              <Typography
                variant="body2"
                color="#555555AC"
                sx={{
                  position: 'absolute',
                  right: 6,
                  top: '28px',
                  transform: 'translate(-6px, -50%)',
                  backgroundColor: '#fff',
                  height: 30,
                  display: 'grid',
                  placeItems: 'center',
                  zIndex: 1,
                  pl: 1,
                }}
              >
                m
              </Typography>
              {errors?.depth?.type === 'required' && (
                <Typography variant="body2" color="red" fontSize={13} mt={0.5}>
                  {validationMessage.required}
                </Typography>
              )}
              {errors?.depth?.type === 'pattern' && (
                <Typography variant="body2" color="red" fontSize={13} mt={0.5}>
                  Please enter valid numbers.
                </Typography>
              )}
            </Box>
          </Box>
        )}

        <Box padding={3}>
          <Button
            type="button"
            variant="contained"
            sx={{
              background: '#06A19B',
              fontWeight: 'bold',
              padding: '8px 24px',
              width: 'fit-content',
              textTransform: 'capitalize',
              borderRadius: '12px',
              marginLeft: 'auto',
              display: 'block',
            }}
            onClick={() => {
              handleCalculate();
            }}
          >
            Calculate
          </Button>
        </Box>
      </Stack>
    </Modal>
  );
};

export default CalculateVolume2;
