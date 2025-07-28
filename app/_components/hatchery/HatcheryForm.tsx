import { species } from '@/app/_lib/utils';
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import React, { useEffect } from 'react';
import * as validationPattern from '@/app/_lib/utils/validationPatterns/index';
import * as validationMessage from '@/app/_lib/utils/validationsMessage/index';
import {
  UseFormRegister,
  UseFormSetValue,
  UseFormTrigger,
  UseFormWatch,
  FieldErrors,
} from 'react-hook-form';
import { AddOrganizationFormInputs } from '@/app/_typeModels/Organization';

interface Props {
  altitude: string;
  register: UseFormRegister<AddOrganizationFormInputs>;
  setValue: UseFormSetValue<AddOrganizationFormInputs>;
  trigger: UseFormTrigger<AddOrganizationFormInputs>;
  watch: UseFormWatch<AddOrganizationFormInputs>;
  errors?: FieldErrors<AddOrganizationFormInputs>;
}
function HatcheryForm({
  altitude,
  register,
  setValue,
  trigger,
  watch,
  errors,
}: Props) {
  useEffect(() => {
    if (altitude) {
      setValue('hatcheryAltitude', String(Number(altitude).toFixed(2)));
    }
  }, [altitude]);

  return (
    <Box width={'100%'}>
      <TextField
        label="Hatchery Name *"
        type="text"
        className="form-input"
        {...register('hatcheryName', {
          required: true,
          pattern: validationPattern.alphabetsAndSpacesPattern,
        })}
        // disabled
        sx={{
          width: '100%',
          mt: 2,
        }}
        focused
        // focused={true}
        // value={userData?.data.email ?? "Demo@gmail.com"}
      />
      {errors &&
        errors.hatcheryName &&
        errors.hatcheryName.type === 'required' && (
          <Typography variant="body2" color="red" fontSize={13} mt={0.5}>
            {validationMessage.required}
          </Typography>
        )}
      {errors &&
        errors.hatcheryName &&
        errors.hatcheryName.type === 'pattern' && (
          <Typography variant="body2" color="red" fontSize={13} mt={0.5}>
            {validationMessage.OnlyAlphabatsMessage}
          </Typography>
        )}
      <TextField
        label="Hatchery Code *"
        type="text"
        className="form-input"
        {...register('hatcheryCode', {
          required: true,
          pattern: validationPattern.alphabetsNumbersAndSpacesPattern,
        })}
        // disabled
        sx={{
          width: '100%',
          mt: 2,
        }}
        focused
        // focused={true}
        // value={userData?.data.email ?? "Demo@gmail.com"}
      />
      {errors &&
        errors.hatcheryCode &&
        errors.hatcheryCode.type === 'required' && (
          <Typography variant="body2" color="red" fontSize={13} mt={0.5}>
            {validationMessage.required}
          </Typography>
        )}
      {errors &&
        errors.hatcheryCode &&
        errors.hatcheryCode.type === 'pattern' && (
          <Typography variant="body2" color="red" fontSize={13} mt={0.5}>
            {validationMessage.OnlyAlphabetsandNumberMessage}
          </Typography>
        )}
      <Box position={'relative'}>
        <TextField
          label="Hatchery Altitude *"
          type="text"
          className="form-input"
          {...register('hatcheryAltitude', {
            required: true,
            pattern: validationPattern.numbersWithDot,
            maxLength: 10,
          })}
          // disabled
          sx={{
            width: '100%',
            mt: 2,
          }}
          focused
          // focused={watch("hatcheryAltitude") ? true : false}
          // value={userData?.data.email ?? "Demo@gmail.com"}
        />
        <Typography
          variant="body2"
          color="#555555AC"
          sx={{
            position: 'absolute',
            right: 6,
            top: errors?.hatcheryAltitude ? '35%' : '50%',
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
        {errors &&
          errors.hatcheryAltitude &&
          errors.hatcheryAltitude.type === 'required' && (
            <Typography variant="body2" color="red" fontSize={13} mt={0.5}>
              {validationMessage.required}
            </Typography>
          )}
        {errors &&
          errors.hatcheryAltitude &&
          errors.hatcheryAltitude.type === 'pattern' && (
            <Typography variant="body2" color="red" fontSize={13} mt={0.5}>
              {validationMessage.OnlyNumbersWithDot}
            </Typography>
          )}
        {errors &&
          errors.hatcheryAltitude &&
          errors.hatcheryAltitude.type === 'maxLength' && (
            <Typography variant="body2" color="red" fontSize={13} mt={0.5}>
              {validationMessage.numberMaxLength}
            </Typography>
          )}
      </Box>
      <FormControl
        fullWidth
        focused
        className="form-input"
        sx={{
          mt: 2,
        }}
      >
        <InputLabel id="feed-supply-select-label5">Species *</InputLabel>
        <Select
          labelId="feed-supply-select-label5"
          id="feed-supply-select5"
          label="Species *"
          sx={{
            width: '100%',
          }}
          {...register('fishSpecie', {
            required: true,
          })}
          value={watch('fishSpecie') || ''}
          onChange={(e) => {
            setValue('fishSpecie', e.target.value);
            trigger('fishSpecie');
          }}
        >
          {species.map((specie, i) => {
            return (
              <MenuItem value={specie} key={i}>
                {specie}
              </MenuItem>
            );
          })}
        </Select>
        {errors &&
          errors.fishSpecie &&
          errors.fishSpecie.type === 'required' && (
            <Typography variant="body2" color="red" fontSize={13} mt={0.5}>
              {validationMessage.required}
            </Typography>
          )}
      </FormControl>
    </Box>
  );
}

export default HatcheryForm;
