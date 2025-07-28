'use client';
import {
  Box,
  Button,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { getCookie } from 'cookies-next';
import React, { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Farm } from '../_typeModels/Farm';
import Loader from './Loader';
import { useRouter } from 'next/navigation';
type CoefficientModel = 'logarithmic' | 'polynomial' | 'quadratic';
interface InputType {
  name: string;
  specie: string;
  productionSystem: string;
  adcCp: number;
  adcCf: number;
  adcNfe: number;
  geCp: number;
  geCf: number;
  geNfe: number;
  wasteFactor: number;
  temperatureCoefficient: CoefficientModel;
  a: number;
  b: number;
  c: number;
  d?: number;
  e?: number;
  tFCRModel: FeedConversionRatioModel;
  tFCRa: number;
  tFCRb: number;
  tFCRc: number;
}
const TGCFormulas: Record<
  CoefficientModel,
  {
    formula: string;
    defaultValues: Partial<Pick<InputType, 'a' | 'b' | 'c' | 'd' | 'e'>>;
  }
> = {
  logarithmic: {
    formula: 'TGC = a * ln(T - b) + c',
    defaultValues: {
      a: 0.001705,
      b: 11.25,
      c: -0.003206,
    },
  },
  polynomial: {
    formula: 'TGC = a*T^0.125 + b*T^0.25 + c*T^0.5 + d*T + e',
    defaultValues: {
      a: 0.00012,
      b: 0.001,
      c: 0.003,
      d: 0.002,
      e: -0.001,
    },
  },
  quadratic: {
    formula: 'TGC = a*T^2 + b*T + c',
    defaultValues: {
      a: 0.0005,
      b: 0.002,
      c: -0.001,
    },
  },
};

const FeedConversionRatioModels = ['linear'] as const;
type FeedConversionRatioModel = typeof FeedConversionRatioModels[number];

const tFCRFormulas: Record<FeedConversionRatioModel, {
  formula: string;
  defaultValues: Partial<Pick<InputType, 'tFCRa' | 'tFCRb' | 'tFCRc'>>;
}> = {
  linear: {
    formula: 'tFCR = a + b * IBW^c',
    defaultValues: {
      tFCRa: 13,
      tFCRb: 0.00643,
      tFCRc: 1,
    },
  },
};

function GrowthModel({ 
  farms, 
  editMode = false, 
  modelData = null, 
  modelId = null 
}: { 
  farms: Farm[];
  editMode?: boolean;
  modelData?: any;
  modelId?: string | null;
}) {
  const loggedUser: any = getCookie('logged-user');
  const router = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm<InputType>({
    defaultValues: {
      temperatureCoefficient: 'logarithmic',
      tFCRModel: 'linear',
    },
  });

  const [isApiCallInProgress, setIsApiCallInProgress] =
    useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [species, setSpecies] = useState('');
  const [productionSystem, setProductionSystem] = useState('');
  const numericValidation = {
    required: 'This field is required',
    pattern: {
      value: /^[0-9]*\.?[0-9]+$/,
      message: 'Only numeric values are allowed',
    },
  };
  const [selectedFCRModel, setSelectedFCRModel] = useState<FeedConversionRatioModel>('linear');
  const selectedModel = watch('temperatureCoefficient');

  // Pre-fill form data when in edit mode
  useEffect(() => {
    if (editMode && modelData) {
      setValue('name', modelData.name || '');
      setValue('specie', modelData.specie || '');
      setValue('productionSystem', modelData.productionSystem || '');
      setValue('adcCp', modelData.adcCp || 0);
      setValue('adcCf', modelData.adcCf || 0);
      setValue('adcNfe', modelData.adcNfe || 0);
      setValue('geCp', modelData.geCp || 0);
      setValue('geCf', modelData.geCf || 0);
      setValue('geNfe', modelData.geNfe || 0);
      setValue('wasteFactor', modelData.wasteFactor || 0);
      setValue('temperatureCoefficient', modelData.temperatureCoefficient || 'logarithmic');
      setValue('a', modelData.tgcA || 0);
      setValue('b', modelData.tgcB || 0);
      setValue('c', modelData.tgcC || 0);
      setValue('d', modelData.tgcD || 0);
      setValue('e', modelData.tgcE || 0);
      setValue('tFCRModel', modelData.tFCRModel || 'linear');
      setValue('tFCRa', modelData.tFCRa || 0);
      setValue('tFCRb', modelData.tFCRb || 0);
      setValue('tFCRc', modelData.tFCRc || 0);
      
      setSpecies(modelData.specie || '');
      setProductionSystem(modelData.productionSystem || '');
      setSelectedFCRModel(modelData.tFCRModel || 'linear');
    }
  }, [editMode, modelData, setValue]);

  useEffect(() => {
    // Set TGC defaults
    const defaults = TGCFormulas[selectedModel].defaultValues;
    Object.entries(defaults).forEach(([key, val]) =>
      setValue(key as keyof InputType, val!)
    );
    // Set tFCR defaults
    const fcrDefaults = tFCRFormulas[selectedFCRModel].defaultValues;
    Object.entries(fcrDefaults).forEach(([key, val]) =>
      setValue(key as keyof InputType, val as any)
    );
  }, [selectedModel, selectedFCRModel, setValue]);

  const onSubmit: SubmitHandler<InputType> = async (data) => {
    const user = JSON.parse(loggedUser ?? '');
    if (user?.organisationId && data.name) {
      // Prevent API call if one is already in progress
      if (isApiCallInProgress) return;
      setIsApiCallInProgress(true);
      setLoading(true);
      try {
        const url = editMode 
          ? `/api/growth-model` 
          : '/api/growth-model';
        
        const method = editMode ? 'PUT' : 'POST';
        
        const body = editMode 
          ? {
              modelId: modelId,
              model: {
                name: data.name,
                specie: data.specie,
                productionSystem: data.productionSystem,
                adcCp: data.adcCp,
                adcCf: data.adcCf,
                adcNfe: data.adcNfe,
                geCp: data.geCp,
                geCf: data.geCf,
                geNfe: data.geNfe,
                wasteFactor: data.wasteFactor,
                temperatureCoefficient: data.temperatureCoefficient,
                a: data.a,
                b: data.b,
                c: data.c,
                d: data.d,
                e: data.e,
                tFCRModel: data.tFCRModel,
                tFCRa: data.tFCRa,
                tFCRb: data.tFCRb,
                tFCRc: data.tFCRc,
              },
              organisationId: user.organisationId,
            }
          : {
              model: {
                name: data.name,
                specie: data.specie,
                productionSystem: data.productionSystem,
                adcCp: data.adcCp,
                adcCf: data.adcCf,
                adcNfe: data.adcNfe,
                geCp: data.geCp,
                geCf: data.geCf,
                geNfe: data.geNfe,
                wasteFactor: data.wasteFactor,
                temperatureCoefficient: data.temperatureCoefficient,
                a: data.a,
                b: data.b,
                c: data.c,
                d: data.d,
                e: data.e,
                tFCRModel: data.tFCRModel,
                tFCRa: data.tFCRa,
                tFCRb: data.tFCRb,
                tFCRc: data.tFCRc,
              },
              organisationId: user.organisationId,
            };

        const response = await fetch(url, {
          method: method,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        });

        if (response.ok) {
          const result = await response.json();
          toast.dismiss();
          toast.success(result.message || (editMode ? 'Growth model updated successfully' : 'Growth model created successfully'));
          setSpecies('');
          setProductionSystem('');
          reset();
          
          // Navigate to the growth model list after successful save (both create and edit)
          router.push('/dashboard/growthModel');
        } else {
          const error = await response.json();
          toast.error(error.error || 'Something went wrong. Please try again.');
        }
      } catch (error) {
        console.error('Error saving growth model:', error);
        toast.error('Something went wrong. Please try again.');
      } finally {
        setIsApiCallInProgress(false);
        setLoading(false);
      }
    } else {
      toast.error('Please fill in all required fields.');
    }
  };
  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <Grid
          container
          sx={{
            width: '100%',
            overflow: 'hidden',
            borderRadius: '14px',
            boxShadow: '0px 0px 16px 5px #0000001A',
            p: 3,
          }}
        >
          <Stack width={'100%'}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Box>
                <Typography
                  variant="h6"
                  fontWeight={700}
                  sx={{
                    fontSize: {
                      md: 24,
                      xs: 20,
                    },
                    marginBlock: 2,
                  }}
                >
                  Overview
                </Typography>
                <Grid container spacing={2}>
                  <Grid item md={4} xs={12}>
                    <FormControl fullWidth className="form-input" focused>
                      <InputLabel id="feed-supply-select-label5">Name *</InputLabel>
                      <TextField
                        label="Name *"
                        type="text"
                        className="form-input"
                        focused
                        {...register("name", { required: true })}
                        error={!!errors.name}
                        sx={{
                          width: "100%",
                        }}
                      />
                    </FormControl>
                    <Typography variant="body2" color="red" fontSize={13} mt={0.5}>
                      {errors.name ? "This field is required." : ""}
                    </Typography>
                  </Grid>

                  <Grid item md={4} xs={12}>
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
                        value={species}
                        onChange={(e) => {
                          setSpecies(e.target.value);
                          clearErrors('specie');
                        }}
                      >
                        <MenuItem
                          value={' Tilapia (Oreochromis Nilotic x Aureus)'}
                          key={'Tilapia (Oreochromis Nilotic x Aureus)'}
                        >
                          Tilapia (Oreochromis Nilotic x Aureus)
                        </MenuItem>
                        <MenuItem
                          value={'African Catfish'}
                          key={'African Catfish'}
                        >
                          African Catfish
                        </MenuItem>
                        <MenuItem
                          value={'Rainbow Trout'}
                          key={'Rainbow Trout'}
                        >
                          Rainbow Trout
                        </MenuItem>
                      </Select>
                      {errors.specie && (
                        <FormHelperText sx={{ color: '#d32f2f' }}></FormHelperText>
                      )}
                    </FormControl>
                    <Typography variant="body2" color="red" fontSize={13} mt={0.5}>
                      {errors.specie ? 'This field is required.' : ''}
                    </Typography>
                  </Grid>

                  <Grid item md={4} xs={12}>
                    <FormControl fullWidth className="form-input" focused>
                      <InputLabel id="feed-supply-select-label5">
                        Production Systems *
                      </InputLabel>
                      <Select
                        labelId="feed-supply-select-label5"
                        id="feed-supply-select5"
                        label="Production Systems *"
                        {...register('productionSystem', {
                          required: true,
                        })}
                        value={productionSystem}
                        onChange={(e) => {
                          setProductionSystem(e.target.value);
                          clearErrors('productionSystem');
                        }}
                      >
                        <MenuItem value="General" key="General">General</MenuItem>
                        <MenuItem value="Recirculation aquaculture system (RAS)" key="RAS">
                          Recirculation aquaculture system (RAS)
                        </MenuItem>
                        <MenuItem value="Green water / bio floc" key="GreenWater">
                          Green water / bio floc
                        </MenuItem>
                        <MenuItem value="Intensive" key="Intensive">Intensive</MenuItem>
                        <MenuItem value="Semi-intensive" key="SemiIntensive">Semi-intensive</MenuItem>
                        <MenuItem value="Ponds" key="Ponds">Ponds</MenuItem>
                        <MenuItem value="Raceways" key="Raceways">Raceways</MenuItem>
                        <MenuItem value="Cages" key="Cages">Cages</MenuItem>
                      </Select>
                      {errors.productionSystem && (
                        <FormHelperText sx={{ color: '#d32f2f' }} />
                      )}
                    </FormControl>
                    <Typography variant="body2" color="red" fontSize={13} mt={0.5}>
                      {errors.specie ? 'This field is required.' : ''}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>

              <Divider
                sx={{
                  my: 4,
                }}
              />

              <Box>
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
                  General
                </Typography>
                <Grid container spacing={2}>
                  <Grid item md={4} xs={12}>
                    <Box position={'relative'}>
                      <TextField
                        label="ADC CP *"
                        type="number"
                        className="form-input"
                        focused
                        inputProps={{ step: 'any' }}
                        sx={{
                          width: '100%',
                        }}
                        error={!!errors.adcCp}
                        {...register('adcCp', numericValidation)}
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
                        %
                      </Typography>
                      {errors.adcCp && (
                        <FormHelperText error>{errors.adcCp.message}</FormHelperText>
                      )}
                    </Box>
                  </Grid>

                  <Grid item md={4} xs={12}>
                    <Box position={'relative'}>
                      <TextField
                        label="ADC CF *"
                        type="number"
                        className="form-input"
                        focused
                        inputProps={{ step: 'any' }}
                        sx={{
                          width: '100%',
                        }}
                        error={!!errors.adcCf}
                        {...register('adcCf', numericValidation)}
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
                        %
                      </Typography>
                      {errors.adcCf && (
                        <FormHelperText error>{errors.adcCf.message}</FormHelperText>
                      )}
                    </Box>
                  </Grid>

                  <Grid item md={4} xs={12}>
                    <Box position={'relative'}>
                      <TextField
                        label="ADC NFE *"
                        type="number"
                        className="form-input"
                        focused
                        inputProps={{ step: 'any' }}
                        sx={{
                          width: '100%',
                        }}
                        error={!!errors.adcNfe}
                        {...register('adcNfe', numericValidation)}
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
                        %
                      </Typography>
                      {errors.adcNfe && (
                        <FormHelperText error>{errors.adcNfe.message}</FormHelperText>
                      )}
                    </Box>
                  </Grid>

                  <Grid item md={4} xs={12}>
                    <Box position={'relative'}>
                      <TextField
                        label="GE Coeff CP *"
                        type="number"
                        className="form-input"
                        focused
                        inputProps={{ step: 'any' }}
                        sx={{
                          width: '100%',
                        }}
                        error={!!errors.geCp}
                        {...register('geCp', numericValidation)}
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
                        MJ/kg
                      </Typography>
                      {errors.geCp && (
                        <FormHelperText error>{errors.geCp.message}</FormHelperText>
                      )}
                    </Box>
                  </Grid>

                  <Grid item md={4} xs={12}>
                    <Box position={'relative'}>
                      <TextField
                        label="GE Coeff CF *"
                        type="number"
                        className="form-input"
                        focused
                        inputProps={{ step: 'any' }}
                        sx={{
                          width: '100%',
                        }}
                        error={!!errors.geCf}
                        {...register('geCf', numericValidation)}
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
                        MJ/kg
                      </Typography>
                      {errors.geCf && (
                        <FormHelperText error>{errors.geCf.message}</FormHelperText>
                      )}
                    </Box>
                  </Grid>

                  <Grid item md={4} xs={12}>
                    <Box position={'relative'}>
                      <TextField
                        label="GE Coeff NFE *"
                        type="number"
                        error={!!errors.geNfe}
                        {...register('geNfe', numericValidation)}
                        className="form-input"
                        focused
                        inputProps={{ step: 'any' }}
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
                        MJ/kg
                      </Typography>
                      {errors.geNfe && (
                        <FormHelperText error>{errors.geNfe.message}</FormHelperText>
                      )}
                    </Box>
                  </Grid>

                  <Grid item md={4} xs={12}>
                    <Box position={'relative'}>
                      <TextField
                        label="Waste Factor *"
                        type="number"
                        error={!!errors.wasteFactor}
                        {...register('wasteFactor', numericValidation)}
                        className="form-input"
                        focused
                        inputProps={{ step: 'any' }}
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
                        %
                      </Typography>
                      {errors.wasteFactor && (
                        <FormHelperText error>{errors.wasteFactor.message}</FormHelperText>
                      )}
                    </Box>
                  </Grid>
                </Grid>
              </Box>

              <Divider
                sx={{
                  my: 4,
                }}
              />

              <Box>
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
                  Thermal Growth Coefficient - TGC
                </Typography>
                <Grid container spacing={2}>
                  <Grid item md={4} xs={12}>
                    <FormControl fullWidth className="form-input" focused>
                      <InputLabel id="feed-supply-select-label5">
                        Modal *
                      </InputLabel>
                      <Select
                        labelId="feed-supply-select-label5"
                           label="Model *"
                        id="feed-supply-select5"
                        {...register('temperatureCoefficient', { required: true })}
                        value={selectedModel}
                        onChange={(e) => {
                          setValue('temperatureCoefficient', e.target.value as CoefficientModel);
                          clearErrors('temperatureCoefficient');
                        }}
                      >
                        <MenuItem value="logarithmic">Logarithmic</MenuItem>
                        <MenuItem value="polynomial">Polynomial</MenuItem>
                        <MenuItem value="quadratic">Quadratic</MenuItem>
                      </Select>
                      {errors.temperatureCoefficient && (
                        <FormHelperText sx={{ color: '#d32f2f' }}>
                          This field is required.
                        </FormHelperText>
                      )}
                    </FormControl>
                    {/* <Typography variant="body2" color="red" fontSize={13} mt={0.5}>
                      {errors.temperatureCoefficient ? 'This field is required.' : ''}
                    </Typography> */}
                  </Grid>

                  <Grid
                    item
                    md={8}
                    xs={12}
                    sx={{
                      alignSelf: 'center',
                    }}
                  >
                    <Typography variant="body1" fontWeight={600} mb={1}>
                      TGC ={' '}
                      <Typography variant="body1" component={'span'}>
                        {selectedModel === 'logarithmic' && (
                          <>
                            {watch('a') ?? 'a'} × ln(T - {watch('b') ?? 'b'}) + {watch('c') ?? 'c'}
                          </>
                        )}
                        {selectedModel === 'quadratic' && (
                          <>
                            {watch('a') ?? 'a'} × T² + {watch('b') ?? 'b'} × T + {watch('c') ?? 'c'}
                          </>
                        )}
                        {selectedModel === 'polynomial' && (
                          <>
                            {watch('a') ?? 'a'} × T^0.125 + {watch('b') ?? 'b'} × T^0.25 +{' '}
                            {watch('c') ?? 'c'} × T^0.5 + {watch('d') ?? 'd'} × T + {watch('e') ?? 'e'}
                          </>
                        )}
                      </Typography>
                    </Typography>
                  </Grid>


                  {(['a', 'b', 'c'] as const).map((field) => (
                    <Grid item md={4} xs={12} key={field}>
                      <FormControl fullWidth className="form-input" focused>
                        <InputLabel id={`label-${field}`}>{field}</InputLabel>
                        <TextField
                          label={field}
                          type="number"
                          className="form-input"
                          focused
                          inputProps={{ step: 'any' }}
                          {...register(field, { required: true })}
                          error={!!errors[field]}
                        />
                      </FormControl>
                      {errors[field] && (
                        <Typography variant="body2" color="red" fontSize={13} mt={0.5}>
                          This field is required.
                        </Typography>
                      )}
                    </Grid>
                  ))}

                  {selectedModel === 'polynomial' &&
                    (['d', 'e'] as const).map((field) => (
                      <Grid item md={4} xs={12} key={field}>
                        <FormControl fullWidth className="form-input" focused>
                          <InputLabel id={`label-${field}`}>{field}</InputLabel>
                          <TextField
                            label={field}
                            type="number"
                            className="form-input"
                            focused
                            inputProps={{ step: 'any' }}
                            {...register(field, { required: true })}
                            error={!!errors[field]}
                          />
                        </FormControl>
                        {errors[field] && (
                          <Typography variant="body2" color="red" fontSize={13} mt={0.5}>
                            This field is required.
                          </Typography>
                        )}
                      </Grid>
                    ))}

                </Grid>
              </Box>

              <Divider
                sx={{
                  my: 4,
                }}
              />

              <Box>
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
                  Theoretical Feed Conversion Ratio - tFCR
                </Typography>
                <Grid container spacing={2}>
                  <Grid item md={4} xs={12}>
                    <FormControl fullWidth className="form-input" focused>
                      <InputLabel id="feed-supply-select-label5">
                        Modal *
                      </InputLabel>
                      <Select
                        labelId="feed-supply-select-label5"
                        id="feed-supply-select5"
                        label="Model *"
                        value={selectedFCRModel}
                        onChange={e => {
                          setSelectedFCRModel(e.target.value as FeedConversionRatioModel);
                          // clearErrors if you add validation
                        }}
                      >
                        {FeedConversionRatioModels.map(model => (
                          <MenuItem value={model} key={model}>{model.charAt(0).toUpperCase() + model.slice(1)}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item md={8} xs={12} sx={{ alignSelf: 'center' }}>
                    <Typography variant="body1" fontWeight={600} mb={1}>
                      <Typography variant="body1" component={'span'}>
                        {tFCRFormulas[selectedFCRModel].formula.replace('a', String(watch('tFCRa') ?? 'a')).replace('b', String(watch('tFCRb') ?? 'b')).replace('c', String(watch('tFCRc') ?? 'c'))}
                      </Typography>
                    </Typography>
                  </Grid>
                  {(['tFCRa', 'tFCRb', 'tFCRc'] as const).map((field) => (
                    <Grid item md={4} xs={12} key={field}>
                      <FormControl fullWidth className="form-input" focused>
                        <InputLabel id={`label-fcr-${field}`}>{field.replace('tFCR', '')}</InputLabel>
                        <TextField
                          label={field.replace('tFCR', '')}
                          type="number"
                          className="form-input"
                          focused
                          inputProps={{ step: 'any' }}
                          {...register(field, numericValidation)}
                          error={!!errors[field]}
                        />
                      </FormControl>
                      {errors[field] && (
                        <Typography variant="body2" color="red" fontSize={13} mt={0.5}>
                          {errors[field]?.message}
                        </Typography>
                      )}
                    </Grid>
                  ))}
                </Grid>
              </Box>

              <Box
                display={'flex'}
                justifyContent={'end'}
                alignItems={'end'}
                marginBlock={'20px'}
              >
                <Button
                  type="submit"
                  variant="contained"
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
                  Save
                </Button>
              </Box>
            </form>
          </Stack>
        </Grid>
      )}
    </>
  );
}

export default GrowthModel;
