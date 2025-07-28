import {
  feedingPhase,
  lifeStage,
  nutritionalClass,
  nutritionalGuarantee,
  nutritionalPurpose,
  ProductFormatCode,
  productionIntensity,
  species,
  units,
} from '@/app/_lib/utils';
import * as validationPattern from '@/app/_lib/utils/validationPatterns/index';
import * as validationMessage from '@/app/_lib/utils/validationsMessage/index';
import { feedAction, selectIsEditFeed } from '@/lib/features/feed/feedSlice';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
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
import { getCookie } from 'cookies-next';
import { NextPage } from 'next';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import Loader from '../Loader';
import NutritionalGuarantee from './NutritionalGuarantee';
import { FeedSupplier } from '@/app/_typeModels/Organization';
// import { DatePicker } from "@mui/x-date-pickers/DatePicker";

interface Props {
  feedSupplyId?: string;
}
interface nutritionalGuarantee {
  moisture: { kg: string; value: string };
  crudeProtein: { kg: string; value: string };
  crudeFat: { kg: string; value: string };
  crudeAsh: { kg: string; value: string };
  calcium: { kg: string; value: string };
  phosphorous: { kg: string; value: string };
  carbohydrates: { kg: string; value: string };
  metabolizableEnergy: { kg: string; value: string };
  crudeFiber: { kg: string; value: string };
}
export interface FormInputs {
  feedIngredients: string;
  feedingGuide: string;
  productionIntensity: string;
  unit: string;
  feedingPhase: string;
  lifeStage: string;
  shelfLife: string;
  productCode: string;
  feedSupplierCode: string;
  brandCode: string;
  productNameCode: string;
  productFormatCode: string;
  animalSizeInLength: string;
  animalSizeInWeight: string;
  specie: string;
  nutritionalPurpose: string;
  nutritionalClass: string;
  particleSize: string;
  productFormat: string;
  productName: string;
  brandName: string;
  feedSupplier: string;
  nutritionalGuarantee: nutritionalGuarantee;
}
const NewFeed: NextPage<Props> = ({ feedSupplyId }) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const loggedUser = getCookie('logged-user');
  const [loading, setLoading] = useState<boolean>(false);
  const [feedSuppliers, setFeedSuppliers] = useState<FeedSupplier[]>();
  const isEditFeed = useAppSelector(selectIsEditFeed);
  const [editFeedSpecification, setEditFeedSpecification] = useState<any>();
  const [isApiCallInProgress, setIsApiCallInProgress] =
    useState<boolean>(false);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    clearErrors,
    getValues,
    trigger,
    formState: { errors },
  } = useForm<FormInputs>({ mode: 'onChange' });
  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    // Prevent API call if one is already in progress
    if (isApiCallInProgress) return;

    setIsApiCallInProgress(true);

    try {
      const loggedUserData = JSON.parse(loggedUser || '');
      if (data) {
        const response = await fetch(
          isEditFeed ? '/api/feedSupply/edit-feed' : '/api/feedSupply/new-feed',
          {
            method: isEditFeed ? 'PUT' : 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: isEditFeed
              ? JSON.stringify({
                  ...data,
                  createdBy: editFeedSpecification?.createdBy,
                  updatedBy: String(loggedUserData.id),
                  id: editFeedSpecification?.id,
                })
              : JSON.stringify({
                  ...data,
                  createdBy: String(loggedUserData.id),
                  organisationId: loggedUserData.organisationId,
                }),
          },
        );
        const res = await response.json();
        if (res.status) {
          toast.success(res.message);
          if (isEditFeed) {
            dispatch(feedAction.resetState());
            reset();
            router.push('/dashboard/feedSupply');
          }
          reset();
        }
      }
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsApiCallInProgress(false);
    }
  };
  const getFeedSuppliers = async () => {
    const response = await fetch(`/api/organisation/feedSuppliers`, {
      method: 'GET',
    });
    const res = response.json();
    return res;
  };
  const getFeed = async () => {
    const data = await fetch(`/api/feedSupply/${feedSupplyId}`, {
      method: 'GET',
    });
    if (data) {
    }
    return data.json();
  };

  useEffect(() => {
    if (
      watch('nutritionalGuarantee.moisture.kg') &&
      watch('nutritionalGuarantee.crudeProtein.kg') &&
      watch('nutritionalGuarantee.crudeFat.kg') &&
      watch('nutritionalGuarantee.crudeAsh.kg') &&
      watch('nutritionalGuarantee.crudeFiber.kg')
    ) {
      clearErrors('nutritionalGuarantee.carbohydrates.kg');
      const nutritionalGuarantee = getValues().nutritionalGuarantee;
      const value =
        100 -
        Number(nutritionalGuarantee?.moisture?.kg) +
        Number(nutritionalGuarantee?.crudeProtein?.kg) +
        Number(nutritionalGuarantee?.crudeFiber?.kg) +
        Number(nutritionalGuarantee?.crudeFat?.kg) +
        Number(nutritionalGuarantee?.crudeAsh?.kg);

      setValue('nutritionalGuarantee.carbohydrates.kg', String(value));
    }
  }, [
    watch('nutritionalGuarantee.moisture.kg'),
    watch('nutritionalGuarantee.crudeProtein.kg'),
    watch('nutritionalGuarantee.crudeFat.kg'),
    watch('nutritionalGuarantee.crudeAsh.kg'),
    watch('nutritionalGuarantee.crudeFiber.kg'),
  ]);
  useEffect(() => {
    setLoading(true);
    const feedSupplierGetter = async () => {
      const res = await getFeedSuppliers();
      setFeedSuppliers(res.data);
    };
    feedSupplierGetter();
    const feedSupply = async () => {
      const res = await getFeed();
      setEditFeedSpecification(res.data);
      setLoading(false);
    };
    feedSupply();
  }, []);
  useEffect(() => {
    if (editFeedSpecification) {
      setValue('feedIngredients', editFeedSpecification?.feedIngredients);
      setValue('feedingGuide', editFeedSpecification?.feedingGuide);
      setValue(
        'productionIntensity',
        editFeedSpecification?.productionIntensity,
      );
      setValue('unit', editFeedSpecification?.unit);
      setValue('feedingPhase', editFeedSpecification?.feedingPhase);
      setValue('lifeStage', editFeedSpecification?.lifeStage);
      setValue('shelfLife', editFeedSpecification?.shelfLife);
      setValue('productCode', editFeedSpecification?.productCode);
      setValue('feedSupplierCode', editFeedSpecification?.feedSupplierCode);
      setValue('brandCode', editFeedSpecification?.brandCode);
      setValue('productNameCode', editFeedSpecification?.productNameCode);
      setValue('productFormatCode', editFeedSpecification?.productFormatCode);
      setValue('animalSizeInLength', editFeedSpecification?.animalSizeInLength);
      setValue('animalSizeInWeight', editFeedSpecification?.animalSizeInWeight);
      setValue('specie', editFeedSpecification?.specie);
      setValue('nutritionalPurpose', editFeedSpecification?.nutritionalPurpose);
      setValue('nutritionalClass', editFeedSpecification?.nutritionalClass);
      setValue('particleSize', editFeedSpecification?.particleSize);
      setValue('productFormat', editFeedSpecification?.productFormat);
      setValue('productName', editFeedSpecification?.productName);
      setValue('brandName', editFeedSpecification?.brandName);
      setValue('feedSupplier', editFeedSpecification?.feedSupplier);
      setValue(
        'nutritionalGuarantee',
        editFeedSpecification?.nutritionalGuarantee,
      );
    }
  }, [editFeedSpecification]);

  if (loading) {
    return <Loader />;
  }
  return (
    <>
      <Stack>
        <Typography
          variant="h6"
          fontWeight={700}
          sx={{
            fontSize: {
              md: 24,
              xs: 20,
            },
            marginBottom: 3,
          }}
        >
          Feed Specification
        </Typography>

        <Box>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2}>
              <Grid item md={6} xs={12}>
                <FormControl fullWidth className="form-input" focused>
                  <InputLabel id="feed-supply-select-label1">
                    Feed Supplier *
                  </InputLabel>
                  <Select
                    labelId="feed-supply-select-label1"
                    id="feed-supply-select1"
                    {...register('feedSupplier', {
                      required: true,
                    })}
                    label="Feed Supplier *"
                    value={watch('feedSupplier') || ''}
                    onChange={(e) => {
                      setValue('feedSupplier', e.target.value);
                      trigger('feedSupplier');
                    }}
                  >
                    {feedSuppliers?.map((supplier) => {
                      return (
                        <MenuItem value={String(supplier.id)} key={supplier.id}>
                          {supplier.name}
                        </MenuItem>
                      );
                    })}
                  </Select>
                  {errors &&
                    errors.feedSupplier &&
                    errors.feedSupplier.type === 'required' && (
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
              </Grid>

              <Grid item md={6} xs={12}>
                <TextField
                  label="Feed Supplier Code *"
                  type="text"
                  className="form-input"
                  {...register('feedSupplierCode', {
                    required: true,
                    pattern:
                      validationPattern.alphabetsNumbersAndSpacesPattern2,
                  })}
                  focused
                  sx={{
                    width: '100%',
                  }}
                />
                {errors &&
                  errors.feedSupplierCode &&
                  errors.feedSupplierCode.type === 'required' && (
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
                  errors.feedSupplierCode &&
                  errors.feedSupplierCode.type === 'pattern' && (
                    <Typography
                      variant="body2"
                      color="red"
                      fontSize={13}
                      mt={0.5}
                    >
                      {validationMessage.OnlyAlphabetsandNumberMessage2}
                    </Typography>
                  )}
              </Grid>

              <Grid item md={6} xs={12}>
                <TextField
                  label="Brand Name *"
                  type="text"
                  className="form-input"
                  {...register('brandName', {
                    required: true,
                    pattern: validationPattern.alphabetsAndSpacesPattern,
                  })}
                  focused
                  sx={{
                    width: '100%',
                  }}
                />
                {errors &&
                  errors.brandName &&
                  errors.brandName.type === 'required' && (
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
                  errors.brandName &&
                  errors.brandName.type === 'pattern' && (
                    <Typography
                      variant="body2"
                      color="red"
                      fontSize={13}
                      mt={0.5}
                    >
                      {validationMessage.OnlyAlphabatsMessage}
                    </Typography>
                  )}
              </Grid>

              <Grid item md={6} xs={12}>
                <TextField
                  label="Brand Code *"
                  type="text"
                  className="form-input"
                  {...register('brandCode', {
                    required: true,
                    pattern:
                      validationPattern.alphabetsNumbersAndSpacesPattern2,
                  })}
                  focused
                  sx={{
                    width: '100%',
                  }}
                />
                {errors &&
                  errors.brandCode &&
                  errors.brandCode.type === 'required' && (
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
                  errors.brandCode &&
                  errors.brandCode.type === 'pattern' && (
                    <Typography
                      variant="body2"
                      color="red"
                      fontSize={13}
                      mt={0.5}
                    >
                      {validationMessage.OnlyAlphabetsandNumberMessage2}
                    </Typography>
                  )}
              </Grid>

              <Grid item md={6} xs={12}>
                <TextField
                  label="Product Name *"
                  type="text"
                  className="form-input"
                  {...register('productName', {
                    required: true,
                    pattern: validationPattern.alphabetsAndSpacesPattern,
                  })}
                  focused
                  sx={{
                    width: '100%',
                  }}
                />
                {errors &&
                  errors.productName &&
                  errors.productName.type === 'required' && (
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
                  errors.productName &&
                  errors.productName.type === 'pattern' && (
                    <Typography
                      variant="body2"
                      color="red"
                      fontSize={13}
                      mt={0.5}
                    >
                      {validationMessage.OnlyAlphabatsMessage}
                    </Typography>
                  )}
              </Grid>

              <Grid item md={6} xs={12}>
                <TextField
                  label="Product Code *"
                  type="text"
                  className="form-input"
                  {...register('productCode', {
                    required: true,
                    pattern:
                      validationPattern.alphabetsNumbersAndSpacesPattern2,
                  })}
                  focused
                  sx={{
                    width: '100%',
                  }}
                />
                {errors &&
                  errors.productCode &&
                  errors.productCode.type === 'required' && (
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
                  errors.productCode &&
                  errors.productCode.type === 'pattern' && (
                    <Typography
                      variant="body2"
                      color="red"
                      fontSize={13}
                      mt={0.5}
                    >
                      {validationMessage.OnlyAlphabetsandNumberMessage2}
                    </Typography>
                  )}
              </Grid>

              <Grid item md={6} xs={12}>
                <TextField
                  label="Product Name Code *"
                  type="text"
                  className="form-input"
                  {...register('productNameCode', {
                    required: true,
                    pattern:
                      validationPattern.alphabetsNumbersAndSpacesPattern2,
                  })}
                  focused
                  sx={{
                    width: '100%',
                  }}
                />
                {errors &&
                  errors.productNameCode &&
                  errors.productNameCode.type === 'required' && (
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
                  errors.productNameCode &&
                  errors.productNameCode.type === 'pattern' && (
                    <Typography
                      variant="body2"
                      color="red"
                      fontSize={13}
                      mt={0.5}
                    >
                      {validationMessage.OnlyAlphabetsandNumberMessage2}
                    </Typography>
                  )}
              </Grid>

              <Grid item md={6} xs={12}>
                <FormControl fullWidth className="form-input" focused>
                  <InputLabel id="feed-supply-select-label2">
                    Product Format *
                  </InputLabel>
                  <Select
                    labelId="feed-supply-select-label2"
                    id="feed-supply-select2"
                    label="Product Format *"
                    {...register('productFormat', {
                      required: true,
                    })}
                    value={watch('productFormat') || ''}
                    onChange={(e) => {
                      setValue('productFormat', e.target.value);
                      trigger('productFormat');
                    }}
                  >
                    {ProductFormatCode.map((format, i) => {
                      return (
                        <MenuItem value={format} key={i}>
                          {format}
                        </MenuItem>
                      );
                    })}
                  </Select>
                  {errors &&
                    errors.productFormat &&
                    errors.productFormat.type === 'required' && (
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
              </Grid>

              <Grid item md={6} xs={12}>
                <TextField
                  label="Product Format Code *"
                  type="text"
                  className="form-input"
                  {...register('productFormatCode', {
                    required: true,
                    pattern:
                      validationPattern.alphabetsNumbersAndSpacesPattern2,
                  })}
                  focused
                  sx={{
                    width: '100%',
                  }}
                />
                {errors &&
                  errors.productFormatCode &&
                  errors.productFormatCode.type === 'required' && (
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
                  errors.productFormatCode &&
                  errors.productFormatCode.type === 'pattern' && (
                    <Typography
                      variant="body2"
                      color="red"
                      fontSize={13}
                      mt={0.5}
                    >
                      {validationMessage.OnlyAlphabetsandNumberMessage2}
                    </Typography>
                  )}
              </Grid>

              <Grid item md={6} xs={12}>
                <Box
                  display={'flex'}
                  gap={2}
                  alignItems={'center'}
                  position={'relative'}
                >
                  <TextField
                    label="Particle Size *"
                    type="text"
                    className="form-input"
                    {...register('particleSize', {
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
                    mm
                  </Typography>
                </Box>
                {errors &&
                  errors.particleSize &&
                  errors.particleSize.type === 'required' && (
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
                  errors.particleSize &&
                  errors.particleSize.type === 'pattern' && (
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
                  errors.particleSize &&
                  errors.particleSize.type === 'maxLength' && (
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

              <Grid item md={6} xs={12}>
                <FormControl fullWidth className="form-input" focused>
                  <InputLabel id="feed-supply-select-label3">
                    Nutritional Class *
                  </InputLabel>
                  <Select
                    labelId="feed-supply-select-label3"
                    id="feed-supply-select3"
                    label="Nutritional Class *"
                    {...register('nutritionalClass', {
                      required: true,
                    })}
                    value={watch('nutritionalClass') || ''}
                    onChange={(e) => {
                      setValue('nutritionalClass', e.target.value);
                      trigger('nutritionalClass');
                    }}
                  >
                    {nutritionalClass.map((nutritional, i) => {
                      return (
                        <MenuItem value={nutritional} key={i}>
                          {nutritional}
                        </MenuItem>
                      );
                    })}
                  </Select>
                  {errors &&
                    errors.nutritionalClass &&
                    errors.nutritionalClass.type === 'required' && (
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
              </Grid>

              <Grid item md={6} xs={12}>
                <FormControl fullWidth className="form-input" focused>
                  <InputLabel id="feed-supply-select-label4">
                    Nutritional Purpose *
                  </InputLabel>
                  <Select
                    labelId="feed-supply-select-label4"
                    id="feed-supply-select4"
                    label="Nutritional Purpose *"
                    {...register('nutritionalPurpose', {
                      required: true,
                    })}
                    value={watch('nutritionalPurpose') || ''}
                    onChange={(e) => {
                      setValue('nutritionalPurpose', e.target.value);
                      trigger('nutritionalPurpose');
                    }}
                  >
                    {nutritionalPurpose.map((intensity, i) => {
                      return (
                        <MenuItem value={intensity} key={i}>
                          {intensity}
                        </MenuItem>
                      );
                    })}
                  </Select>
                  {errors &&
                    errors.nutritionalPurpose &&
                    errors.nutritionalPurpose.type === 'required' && (
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
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle1" fontWeight={500}>
                  Suitability
                </Typography>
              </Grid>

              <Grid item md={6} xs={12}>
                <FormControl fullWidth className="form-input" focused>
                  <InputLabel id="feed-supply-select-label5">
                    Species *
                  </InputLabel>
                  <Select
                    labelId="feed-supply-select-label5"
                    id="feed-supply-select5"
                    label="Species *"
                    {...register('specie', {
                      required: true,
                    })}
                    value={watch('specie') || ''}
                    onChange={(e) => {
                      setValue('specie', e.target.value);
                      trigger('specie');
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
                    errors.specie &&
                    errors.specie.type === 'required' && (
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
              </Grid>

              <Grid item md={6} xs={12}>
                <Box
                  display={'flex'}
                  gap={2}
                  alignItems={'center'}
                  position={'relative'}
                >
                  <TextField
                    label="Animal Size (Length) *"
                    type="text"
                    className="form-input"
                    {...register('animalSizeInLength', {
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
                    mm
                  </Typography>
                </Box>
                {errors &&
                  errors.animalSizeInLength &&
                  errors.animalSizeInLength.type === 'required' && (
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
                  errors.animalSizeInLength &&
                  errors.animalSizeInLength.type === 'pattern' && (
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
                  errors.animalSizeInLength &&
                  errors.animalSizeInLength.type === 'maxLength' && (
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

              <Grid item md={6} xs={12}>
                <Box
                  display={'flex'}
                  gap={2}
                  alignItems={'center'}
                  position={'relative'}
                >
                  <TextField
                    label="Animal Size (Weight) *"
                    type="text"
                    className="form-input"
                    {...register('animalSizeInWeight', {
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
                {errors &&
                  errors.animalSizeInWeight &&
                  errors.animalSizeInWeight.type === 'required' && (
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
                  errors.animalSizeInWeight &&
                  errors.animalSizeInWeight.type === 'pattern' && (
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
                  errors.animalSizeInWeight &&
                  errors.animalSizeInWeight.type === 'maxLength' && (
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

              <Grid item md={6} xs={12}>
                <FormControl fullWidth className="form-input" focused>
                  <InputLabel id="feed-supply-select-label6">
                    Production Intensity *
                  </InputLabel>
                  <Select
                    labelId="feed-supply-select-label6"
                    id="feed-supply-select6"
                    {...register('productionIntensity', {
                      required: true,
                    })}
                    label="Production Intensity *"
                    value={watch('productionIntensity') || ''}
                    onChange={(e) => {
                      setValue('productionIntensity', e.target.value);
                      trigger('productionIntensity');
                    }}
                  >
                    {productionIntensity.map((intensity, i) => {
                      return (
                        <MenuItem value={intensity} key={i}>
                          {intensity}
                        </MenuItem>
                      );
                    })}
                  </Select>
                  {errors &&
                    errors.productionIntensity &&
                    errors.productionIntensity.type === 'required' && (
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
              </Grid>

              <Grid item md={6} xs={12}>
                <FormControl fullWidth className="form-input" focused>
                  <InputLabel id="feed-supply-select-label7">Unit *</InputLabel>
                  <Select
                    labelId="feed-supply-select-label7"
                    id="feed-supply-select7"
                    {...register('unit', {
                      required: true,
                    })}
                    label="Unit *"
                    value={watch('unit') !== 'None' ? watch('unit') : ''}
                    onChange={(e) => {
                      setValue('unit', e.target.value);
                      trigger('unit');
                    }}
                  >
                    {units.map((unit, i) => {
                      return (
                        <MenuItem value={unit} key={i}>
                          {unit}
                        </MenuItem>
                      );
                    })}
                  </Select>
                  {errors && errors.unit && errors.unit.type === 'required' && (
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
              </Grid>

              <Grid item md={6} xs={12}>
                <FormControl fullWidth className="form-input" focused>
                  <InputLabel id="feed-supply-select-label8">
                    Feeding Phase *
                  </InputLabel>
                  <Select
                    labelId="feed-supply-select-label8"
                    id="feed-supply-select8"
                    {...register('feedingPhase', {
                      required: true,
                    })}
                    label="Feeding Phase *"
                    value={
                      watch('feedingPhase') !== 'None'
                        ? watch('feedingPhase')
                        : ''
                    }
                    onChange={(e) => {
                      setValue('feedingPhase', e.target.value);
                      trigger('feedingPhase');
                    }}
                  >
                    {feedingPhase.map((intensity, i) => {
                      return (
                        <MenuItem value={intensity} key={i}>
                          {intensity}
                        </MenuItem>
                      );
                    })}
                  </Select>
                  {errors &&
                    errors.feedingPhase &&
                    errors.feedingPhase.type === 'required' && (
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
              </Grid>

              <Grid item md={6} xs={12}>
                <FormControl fullWidth className="form-input" focused>
                  <InputLabel id="feed-supply-select-label9">
                    Life Stage *
                  </InputLabel>
                  <Select
                    labelId="feed-supply-select-label9"
                    id="feed-supply-select9"
                    label="Life Stage *"
                    {...register('lifeStage', {
                      required: true,
                    })}
                    value={
                      watch('lifeStage') !== 'None' ? watch('lifeStage') : ''
                    }
                    onChange={(e) => {
                      setValue('lifeStage', e.target.value);
                      trigger('lifeStage');
                    }}
                  >
                    {lifeStage.map((stage, i) => {
                      return (
                        <MenuItem value={stage} key={i}>
                          {stage}
                        </MenuItem>
                      );
                    })}
                  </Select>
                  {errors &&
                    errors.lifeStage &&
                    errors.lifeStage.type === 'required' && (
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
              </Grid>

              <Grid item md={6} xs={12}>
                <Box
                  display={'flex'}
                  gap={2}
                  alignItems={'center'}
                  position={'relative'}
                >
                  <TextField
                    label="Shelf Live (from date of manufacturing) *"
                    type="number"
                    className="form-input custom-field"
                    {...register('shelfLife', {
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
                    months
                  </Typography>
                </Box>
                {errors &&
                  errors.shelfLife &&
                  errors.shelfLife.type === 'required' && (
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
                  errors.shelfLife &&
                  errors.shelfLife.type === 'pattern' && (
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
                  errors.shelfLife &&
                  errors.shelfLife.type === 'maxLength' && (
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

              <Grid item lg={6} xs={12}>
                <Typography variant="subtitle1" fontWeight={500}>
                  Feed Ingredients *
                </Typography>
                <TextField
                  type="text"
                  multiline
                  rows={5}
                  className="form-input"
                  {...register('feedIngredients', {
                    required: true,
                    pattern:
                      validationPattern.alphabetsSpacesAndSpecialCharsPattern,
                  })}
                  sx={{
                    width: '100%',
                    marginBlock: '20px',
                  }}
                />
                {errors &&
                  errors.feedIngredients &&
                  errors.feedIngredients.type === 'required' && (
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
                  errors.feedIngredients &&
                  errors.feedIngredients.type === 'pattern' && (
                    <Typography
                      variant="body2"
                      color="red"
                      fontSize={13}
                      mt={0.5}
                    >
                      {validationMessage.alphabetswithSpecialCharacter}
                    </Typography>
                  )}
              </Grid>

              <Grid item lg={6} xs={12}>
                <Typography variant="subtitle1" fontWeight={500}>
                  Feeding Guide *
                </Typography>
                <TextField
                  type="text"
                  multiline
                  rows={5}
                  className="form-input"
                  sx={{
                    width: '100%',
                    marginBlock: '20px',
                  }}
                  {...register('feedingGuide', {
                    required: true,
                    pattern: validationPattern.alphabetsAndSpacesPattern,
                  })}
                />
                {errors &&
                  errors.feedingGuide &&
                  errors.feedingGuide.type === 'required' && (
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
                  errors.feedingGuide &&
                  errors.feedingGuide.type === 'pattern' && (
                    <Typography
                      variant="body2"
                      color="red"
                      fontSize={13}
                      mt={0.5}
                    >
                      {validationMessage.OnlyAlphabatsMessage}
                    </Typography>
                  )}
              </Grid>
            </Grid>

            <NutritionalGuarantee
              register={register}
              errors={errors}
              watch={watch}
              setValue={setValue}
              clearErrors={clearErrors}
              trigger={trigger}
            />

            <Box>
              <Box
                display={'flex'}
                justifyContent={'flex-end'}
                alignItems={'center'}
                gap={3}
                mt={3}
              >
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isApiCallInProgress}
                  sx={{
                    color: '#fff',
                    background: '#06A19B',
                    fontWeight: 600,
                    padding: '6px 16px',
                    width: 'fit-content',
                    textTransform: 'capitalize',
                    borderRadius: '8px',
                    border: '1px solid #06A19B',
                  }}
                >
                  {isEditFeed ? 'Edit feed' : 'Add feed'}
                </Button>
              </Box>
            </Box>
          </form>
        </Box>
      </Stack>
    </>
  );
};

export default NewFeed;
