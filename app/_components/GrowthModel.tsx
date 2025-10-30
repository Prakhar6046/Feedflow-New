'use client';
import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
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
import { Species } from './feedSupply/NewFeedLibarary';
import { OrganisationModelResponse } from '../_typeModels/growthModel';
import { SingleUser } from '../_typeModels/User';
import { clientSecureFetch } from '../_lib/clientSecureFetch';
export interface productionSystem {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  isFeatured: boolean;
};
type CoefficientModel = 'logarithmic' | 'polynomial' | 'quadratic';
interface InputType {
  name: string;
  specie: string;
  productionSystem: string;
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
export type FeedConversionRatioModel = (typeof FeedConversionRatioModels)[number];

const tFCRFormulas: Record<
  FeedConversionRatioModel,
  {
    formula: string;
    defaultValues: Partial<Pick<InputType, 'tFCRa' | 'tFCRb' | 'tFCRc'>>;
  }
> = {
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
  modelId = null,
}: {
  farms: Farm[];
  editMode?: boolean;
  modelData?: OrganisationModelResponse;
  modelId?: string | null;
}) {
  const loggedUser: any = getCookie('logged-user');
  const router = useRouter();
  const [speciesList, setSpeciesList] = useState<Species[]>([]);
  const featuredSpecies = speciesList?.filter((sp) => sp.isFeatured);
  const [productionSystemList, setProductionSystemList] = useState<productionSystem[]>([]);
  const [allFarms, setAllFarms] = useState<Farm[]>([]);
  const [filteredFarms, setFilteredFarms] = useState<Farm[]>([]);
  const [selectedFarms, setSelectedFarms] = useState<string[]>([]);
  const [availableFarms, setAvailableFarms] = useState<Farm[]>([]);
  const [selectedFarmsForModel, setSelectedFarmsForModel] = useState<string[]>([]);
  const [farmSelectionError, setFarmSelectionError] = useState<string>('');

  const summaryData = allFarms.flatMap((farm) =>
    (farm.FishManageHistory || []).map((history) => {

      const speciesId = history.fishSupplyData?.speciesId || null;

      const productionUnit = (farm.productionUnits || []).find(
        (pu) => pu.id === history.productionUnitId
      );

      return {
        productionUnitId: history.productionUnitId,
        productionSystemId: productionUnit?.productionSystemId || null,
        speciesIds: speciesId ? [speciesId] : [],
      };
    })
  );


  const featuredProductionSystemList = productionSystemList?.filter((sp) => sp.isFeatured);
  // state to hold models
  const [growthModels, setGrowthModels] = useState<OrganisationModelResponse[]>([]);

  useEffect(() => {
    const fetchFarms = async () => {
      try {
        const res = await clientSecureFetch("/api/farm/farms", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch farms");
        const data = await res.json();

        setAllFarms(data.data || []);
      } catch (error) {
        console.error("Error fetching farms:", error);
      }
    };

    fetchFarms();
  }, []);
  // useEffect(() => {
  //   if (species && productionSystem) {
  //     const matches = allFarms.filter((farm) =>
  //       farm.productionUnits?.some(
  //         (pu) =>
  //           String(pu.specieId) === String(species) &&
  //           String(pu.productionSystemId) === String(productionSystem)
  //       )
  //     );
  //     setFilteredFarms(matches);
  //   } else {
  //     setFilteredFarms([]);
  //   }
  // }, [species, productionSystem, allFarms]);
  useEffect(() => {
    const fetchGrowthModels = async () => {
      let organisationId = 0;

      if (loggedUser) {
        try {
          const user: SingleUser = JSON.parse(loggedUser);
          organisationId = user.organisationId;
        } catch (error) {
          console.error("Error parsing user data:", error);
        }
      }

      try {
        const apiUrl = `/api/growth-model?organisationId=${organisationId}`;
        const response = await clientSecureFetch(apiUrl, { cache: "no-store" });

        if (response.ok) {
          const data = await response.json();
          setGrowthModels(data.data || []);
        }
      } catch (error) {
        console.error("Error fetching growth models:", error);
      }
    };

    fetchGrowthModels();
  }, [loggedUser]);


  const [setDefault, setSetDefault] = useState(false);
  const [useExistingModel, setUseExistingModel] = useState(false);
  const [showExistingModelCheckbox, setShowExistingModelCheckbox] = useState(false);

  const token = getCookie('auth-token');
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
  const [checkboxLabel, setCheckboxLabel] = useState("Set as default production system for selected species");
  const numericValidation = {
    required: 'This field is required',
    pattern: {
      value: /^[0-9]*\.?[0-9]+$/,
      message: 'Only numeric values are allowed',
    },
  };
  const [selectedFCRModel, setSelectedFCRModel] =
    useState<FeedConversionRatioModel>('linear');
  const selectedModel = watch('temperatureCoefficient');
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [speciesRes, productionRes] = await Promise.all([
          clientSecureFetch('/api/species', {
            method: 'GET',
          }),
          clientSecureFetch('/api/production-system', {
            method: 'GET',
          }),
        ]);


        if (!speciesRes.ok) throw new Error('Failed to fetch species');
        if (!productionRes.ok) throw new Error('Failed to fetch production system');

        const speciesData = await speciesRes.json();
        const productionData = await productionRes.json();

        setSpeciesList(speciesData);
        setProductionSystemList(productionData);

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [token]);

  // Pre-fill form data when in edit mode
  useEffect(() => {
    if (editMode && modelData) {
      setValue('name', modelData.models.name || '');
      setValue('specie', modelData.models.specieId || '');
      setValue('productionSystem', modelData.models.productionSystemId || '');
      setValue(
        'temperatureCoefficient',
        modelData.models.temperatureCoefficient || 'logarithmic',
      );
      setValue('a', modelData.models.tgcA || 0);
      setValue('b', modelData.models.tgcB || 0);
      setValue('c', modelData.models.tgcC || 0);
      setValue('d', modelData.models.tgcD || 0);
      setValue('e', modelData.models.tgcE || 0);
      setValue('tFCRModel', modelData.models.tFCRModel || 'linear');
      setValue('tFCRa', modelData.models.tFCRa || 0);
      setValue('tFCRb', modelData.models.tFCRb || 0);
      setValue('tFCRc', modelData.models.tFCRc || 0);

      setSpecies(modelData.models.specieId || '');
      setProductionSystem(modelData.models.productionSystemId || '');
      setSelectedFCRModel(modelData.models.tFCRModel || 'linear');
      if (modelData.isDefault) {
        setSetDefault(true);
        setCheckboxLabel("This is the default production system for this species");
      }
      if (modelData.useExistingModel) {
        setUseExistingModel(true);
      }
    }
  }, [editMode, modelData, setValue]);
  useEffect(() => {
    if (species && productionSystem && growthModels.length > 0) {
      const duplicate = growthModels.find(
        (gm) =>
          String(gm.models.specieId) === String(species) &&
          String(gm.models.productionSystemId) === String(productionSystem) &&
          // In edit mode, exclude the current model being edited
          (editMode ? String(gm.id) !== String(modelId) : true)
      );
      setShowExistingModelCheckbox(!!duplicate);
      // Reset farm selection when duplicate status changes
      if (!duplicate && !editMode) {
        setSelectedFarmsForModel([]);
      }
    } else {
      setShowExistingModelCheckbox(false);
    }
  }, [species, productionSystem, growthModels, editMode, modelId]);

  useEffect(() => {
    // Set TGC defaults
    const defaults = TGCFormulas[selectedModel].defaultValues;
    Object.entries(defaults).forEach(([key, val]) =>
      setValue(key as keyof InputType, val!),
    );
    // Set tFCR defaults
    const fcrDefaults = tFCRFormulas[selectedFCRModel].defaultValues;
    Object.entries(fcrDefaults).forEach(([key, val]) =>
      setValue(key as keyof InputType, val as any),
    );
  }, [selectedModel, selectedFCRModel, setValue]);

  const onSubmit: SubmitHandler<InputType> = async (data) => {
    const user = JSON.parse(loggedUser ?? '');
    // Reset farm selection error
    setFarmSelectionError('');
    
    // Check if farm selection is required (when duplicate exists)
    if (showExistingModelCheckbox && selectedFarmsForModel.length === 0) {
      setFarmSelectionError('Please select at least one farm');
      toast.error('Please select at least one farm');
      return;
    }
    
    if (user?.organisationId && data.name) {
      // Prevent API call if one is already in progress
      if (isApiCallInProgress) return;
      setIsApiCallInProgress(true);
      setLoading(true);
      try {
        const url = editMode ? `/api/growth-model` : '/api/growth-model';

        const method = editMode ? 'PUT' : 'POST';

        const body = editMode
          ? {
            modelId: modelId,
            isDefault: setDefault,
            useExistingModel: useExistingModel,
            selectedFarms: selectedFarmsForModel,
            model: {
              name: data.name,
              specie: data.specie,
              productionSystem: data.productionSystem,
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
            isDefault: setDefault,
            useExistingModel: useExistingModel,
            selectedFarms: selectedFarmsForModel,
            organisationId: user.organisationId,
          };
        const response = await clientSecureFetch(url, {
          method: method,
          body: JSON.stringify(body),
        });
        const result = await response.json();
        if (response.ok) {

          toast.dismiss();
          toast.success(
            result.message ||
            (editMode
              ? 'Growth model updated successfully'
              : 'Growth model created successfully'),
          );
          setSpecies('');
          setProductionSystem('');
          setSetDefault(false);
          reset();
          // if (setDefault && data.specie && data.productionSystem) {
          //   await fetch(`/api/growth-model/${data.specie}`, {
          //     method: 'PUT',
          //     headers: {
          //       'Content-Type': 'application/json',
          //       'Authorization': `Bearer ${token}`,
          //     },
          //     body: JSON.stringify({ defaultProductionSystemId: data.productionSystem }),
          //   }).then(async (res) => {
          //     const resData = await res.json();
          //     // if (res.ok) {
          //     //   toast.success('Species default production system updated successfully.');
          //     // } else {
          //     //   toast.error(resData.message || 'Failed to update species default production system.');
          //     // }
          //   });
          // }

          // Navigate to the growth model list after successful save (both create and edit)
          router.push('/dashboard/growthModel');
        } else {
          toast.error(result.error || result.message || 'Something went wrong. Please try again.');
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

  useEffect(() => {
    if (editMode && modelData?.selectedFarms) {
      const farmIds = modelData.selectedFarms.map(f => f.farm.id);
      setSelectedFarmsForModel(farmIds);
    }
  }, [editMode, modelData]);


  useEffect(() => {
    if (species && allFarms.length > 0) {
      const filtered = allFarms.filter((farm) =>
        (farm.FishManageHistory || []).some(
          (history) => history.fishSupplyData?.speciesId === species
        )
      );
      setAvailableFarms(filtered);


      if (!editMode) {
        setSelectedFarmsForModel([]);
      }
    } else {
      setAvailableFarms([]);
      if (!editMode) setSelectedFarmsForModel([]);
    }
  }, [species, allFarms, editMode]);


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
                      <InputLabel id="feed-supply-select-label5">
                        Name *
                      </InputLabel>
                      <TextField
                        label="Name *"
                        type="text"
                        className="form-input"
                        focused
                        {...register('name', {
                          required: 'This field is required.',
                          validate: (value) => {
                            const trimmedValue = value?.trim();
                            if (!trimmedValue || trimmedValue.length === 0) {
                              return 'Name cannot be empty or contain only whitespace.';
                            }
                            return true;
                          },
                        })}
                        error={!!errors.name}
                        sx={{
                          width: '100%',
                        }}
                      />
                    </FormControl>
                    
                    <Typography
                      variant="body2"
                      color="red"
                      fontSize={13}
                      mt={0.5}
                    >
                      {errors.name?.message || ''}
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
                          setValue('specie', e.target.value);
                          clearErrors('specie');
                        }}
                      >
                        {featuredSpecies && featuredSpecies.length > 0 ? (
                          featuredSpecies.map((sp) => (
                            <MenuItem key={sp.id} value={sp.id}>
                              {sp.name}
                            </MenuItem>
                          ))
                        ) : (
                          <MenuItem disabled>No species available</MenuItem>
                        )}
                      </Select>
                      {errors.specie && (
                        <FormHelperText
                          sx={{ color: '#d32f2f' }}
                        ></FormHelperText>
                      )}
                    </FormControl>
                    <Typography
                      variant="body2"
                      color="red"
                      fontSize={13}
                      mt={0.5}
                    >
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
                          setValue('productionSystem', e.target.value);
                          clearErrors('productionSystem');
                        }}

                      >
                        {featuredProductionSystemList && featuredProductionSystemList.length > 0 ? (
                          featuredProductionSystemList.map((sp) => (
                            <MenuItem key={sp.id} value={sp.id}>
                              {sp.name}
                            </MenuItem>
                          ))
                        ) : (
                          <MenuItem disabled>No species available</MenuItem>
                        )}
                      </Select>
                      {errors.productionSystem && (
                        <FormHelperText sx={{ color: '#d32f2f' }} />
                      )}
                    </FormControl>
                    <Typography
                      variant="body2"
                      color="red"
                      fontSize={13}
                      mt={0.5}
                    >
                      {errors.specie ? 'This field is required.' : ''}
                    </Typography>
                  </Grid>
                  {showExistingModelCheckbox && availableFarms.length > 0 && (
                    <Grid item md={4} xs={12}>
                      <FormControl fullWidth className="form-input" focused error={!!farmSelectionError}>
                        <InputLabel id="farm-multi-select-label">Select Farms *</InputLabel>
                        <Select
                          labelId="farm-multi-select-label"
                          label="Select Farms *"
                          multiple
                          value={selectedFarmsForModel}
                          onChange={(e) => {
                            const value = typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value;
                            setSelectedFarmsForModel(value as string[]);
                            // Clear error when user selects a farm
                            if (value.length > 0) {
                              setFarmSelectionError('');
                            }
                          }}
                          renderValue={(selected) =>
                            selected
                              .map((id) => availableFarms.find((f) => f.id === id))
                              .filter(Boolean)
                              .map(f => f!.name)
                              .join(', ')
                          }
                        >
                          {availableFarms.map((farm) => (
                            <MenuItem key={farm.id} value={farm.id}>
                              <Checkbox checked={selectedFarmsForModel.includes(farm.id)} />
                              <Typography>{farm.name}</Typography>
                            </MenuItem>
                          ))}
                        </Select>
                        {(selectedFarmsForModel.length === 0 || farmSelectionError) && (
                          <FormHelperText sx={{ color: '#d32f2f' }}>
                            {farmSelectionError || 'Please select at least one farm'}
                          </FormHelperText>
                        )}
                      </FormControl>
                      <Typography
                        variant="body2"
                        color="red"
                        fontSize={13}
                        mt={0.5}
                      >
                        {farmSelectionError ? 'This field is required.' : ''}
                      </Typography>
                    </Grid>
                  )}

                </Grid>
              </Box>
              <Box sx={{ mt: 2 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      className="checkbox-style"
                      checked={setDefault}
                      onChange={(e) => setSetDefault(e.target.checked)}
                      disabled={!species || !productionSystem}
                    />
                  }
                  label={checkboxLabel || ""}
                />
                <FormHelperText>
                  Only available after selecting both a species and a production system.
                </FormHelperText>
                {showExistingModelCheckbox && (
                  <Box sx={{ mt: 2 }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={useExistingModel}
                          onChange={(e) => setUseExistingModel(e.target.checked)}
                        />
                      }
                      label={
                        editMode
                          ? "Another model already exists for this species and production system. Tick if you want to use this model for addoc prediction."
                          : "There is already a model for this species and production system. Tick if you want to use this model for addoc prediction."
                      }
                    />
                  </Box>
                )}

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
                        {...register('temperatureCoefficient', {
                          required: true,
                        })}
                        value={selectedModel}
                        onChange={(e) => {
                          setValue(
                            'temperatureCoefficient',
                            e.target.value as CoefficientModel,
                          );
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
                            {watch('a') ?? 'a'} × ln(T - {watch('b') ?? 'b'}) +{' '}
                            {watch('c') ?? 'c'}
                          </>
                        )}
                        {selectedModel === 'quadratic' && (
                          <>
                            {watch('a') ?? 'a'} × T² + {watch('b') ?? 'b'} × T +{' '}
                            {watch('c') ?? 'c'}
                          </>
                        )}
                        {selectedModel === 'polynomial' && (
                          <>
                            {watch('a') ?? 'a'} × T^0.125 + {watch('b') ?? 'b'}{' '}
                            × T^0.25 + {watch('c') ?? 'c'} × T^0.5 +{' '}
                            {watch('d') ?? 'd'} × T + {watch('e') ?? 'e'}
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
                        <Typography
                          variant="body2"
                          color="red"
                          fontSize={13}
                          mt={0.5}
                        >
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
                          <Typography
                            variant="body2"
                            color="red"
                            fontSize={13}
                            mt={0.5}
                          >
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
                        onChange={(e) => {
                          setSelectedFCRModel(
                            e.target.value as FeedConversionRatioModel,
                          );
                          // clearErrors if you add validation
                        }}
                      >
                        {FeedConversionRatioModels.map((model) => (
                          <MenuItem value={model} key={model}>
                            {model.charAt(0).toUpperCase() + model.slice(1)}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item md={8} xs={12} sx={{ alignSelf: 'center' }}>
                    <Typography variant="body1" fontWeight={600} mb={1}>
                      <Typography variant="body1" component={'span'}>
                        {tFCRFormulas[selectedFCRModel].formula
                          .replace('a', String(watch('tFCRa') ?? 'a'))
                          .replace('b', String(watch('tFCRb') ?? 'b'))
                          .replace('c', String(watch('tFCRc') ?? 'c'))}
                      </Typography>
                    </Typography>
                  </Grid>
                  {(['tFCRa', 'tFCRb', 'tFCRc'] as const).map((field) => (
                    <Grid item md={4} xs={12} key={field}>
                      <FormControl fullWidth className="form-input" focused>
                        <InputLabel id={`label-fcr-${field}`}>
                          {field.replace('tFCR', '')}
                        </InputLabel>
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
                        <Typography
                          variant="body2"
                          color="red"
                          fontSize={13}
                          mt={0.5}
                        >
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
