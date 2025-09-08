'use client';
import * as validationMessage from '@/app/_lib/utils/validationsMessage/index';
import { FeedSupplier } from '@/app/_typeModels/Organization';
import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { getCookie } from 'cookies-next';
import { NextPage } from 'next';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { productionSystem } from '../GrowthModel';
// import { DatePicker } from "@mui/x-date-pickers/DatePicker";
const fields = [
  { name: 'ProductSupplier', label: 'Product Supplier *', type: 'select' },
  { name: 'brandName', label: 'Brand Name *', type: 'text' },
  { name: 'productName', label: 'Product Name *', type: 'text' },
  { name: 'productFormat', label: 'Product Format *', type: 'text' },
  { name: 'particleSize', label: 'Particle Size *', type: 'string' },
  { name: 'speciesId', label: 'Species *', type: 'species-select' },
  { name: 'minFishSizeG', label: 'Min Fish Size (g) *', type: 'number' },
  { name: 'maxFishSizeG', label: 'Max Fish Size (g) *', type: 'number' },
  { name: 'nutritionalClass', label: 'Nutritional Class *', type: 'text' },
  { name: 'nutritionalPurpose', label: 'Nutritional Purpose *', type: 'text' },
  { name: 'suitableSpecies', label: 'Suitable Species *', type: 'text' },
  {
    name: 'suitabilityAnimalSize',
    label: 'Suitability: Animal Size *',
    type: 'text',
  },
  {
    name: 'productionIntensity',
    label: 'Production Intensity *',
    type: 'text',
  },
  { name: 'suitabilityUnit', label: 'Suitability Unit *', type: 'text' },
  { name: 'feedingPhase', label: 'Feeding Phase *', type: 'text' },
  { name: 'lifeStage', label: 'Life Stage *', type: 'text' },
  { name: 'shelfLifeMonths', label: 'Shelf Life (months) *', type: 'number' },
  { name: 'feedCost', label: 'Feed Cost *', type: 'number' },
  { name: 'feedIngredients', label: 'Feed Ingredients *', type: 'text' },
  { name: 'moistureGPerKg', label: 'Moisture (g/kg) *', type: 'number' },
  {
    name: 'crudeProteinGPerKg',
    label: 'Crude Protein (g/kg) *',
    type: 'number',
  },
  { name: 'crudeFatGPerKg', label: 'Crude Fat (g/kg) *', type: 'number' },
  { name: 'crudeFiberGPerKg', label: 'Crude Fiber (g/kg) *', type: 'number' },
  { name: 'crudeAshGPerKg', label: 'Crude Ash (g/kg) *', type: 'number' },
  { name: 'nfe', label: 'NFE *', type: 'number' },
  { name: 'calciumGPerKg', label: 'Calcium (g/kg) *', type: 'number' },
  { name: 'phosphorusGPerKg', label: 'Phosphorus (g/kg) *', type: 'number' },
  {
    name: 'carbohydratesGPerKg',
    label: 'Carbohydrates (g/kg) *',
    type: 'number',
  },
  {
    name: 'metabolizableEnergy',
    label: 'Metabolizable Energy *',
    type: 'number',
  },
  { name: 'feedingGuide', label: 'Feeding Guide *', type: 'text' },
  { name: 'geCoeffCP', label: 'GE Coeff CP *', type: 'number' },
  { name: 'geCoeffCF', label: 'GE Coeff CF *', type: 'number' },
  { name: 'geCoeffNFE', label: 'GE Coeff NFE *', type: 'number' },
  { name: 'ge', label: 'GE *', type: 'number' },
  { name: 'digCP', label: 'Dig CP *', type: 'number' },
  { name: 'digCF', label: 'Dig CF *', type: 'number' },
  { name: 'digNFE', label: 'Dig NFE *', type: 'number' },
  { name: 'deCP', label: 'DE CP *', type: 'number' },
  { name: 'deCF', label: 'DE CF *', type: 'number' },
  { name: 'deNFE', label: 'DE NFE *', type: 'number' },
  { name: 'de', label: 'DE *', type: 'number' },
];
export interface Species {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  isFeatured: boolean;
  defaultProductionSystemId: string | null;
  defaultProductionSystem?: productionSystem;
};
interface Props {
  feedSuppliers: FeedSupplier[];
  speciesList: Species[];
}

type FeedFormFields = {
  [key: string]: string | number;
};
const NewFeedLibarary: NextPage<Props> = ({ feedSuppliers, speciesList }) => {
  
  const featuredSpecies = speciesList?.filter((sp) => sp.isFeatured);
  const router = useRouter();
  const loggedUser: any = getCookie('logged-user');
  const [isApiCallInProgress, setIsApiCallInProgress] =
    useState<boolean>(false);
  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FeedFormFields>({
    mode: 'onChange',
    defaultValues: {
      geCoeffCP: 23.6,
      geCoeffCF: 39.5,
      geCoeffNFE: 17.2,
      ge: 16.75,
      digCP:3600,
      digCF: 450,
      digNFE: 2108,
      deCP: 8.50,
      deCF: 1.78,
      deNFE: 3.63,
      de: 0,
    },
  });

  const moistureGPerKg = watch("moistureGPerKg") || 120;
  const crudeProtein = watch("crudeProteinGPerKg") || 400;
  const crudeFatGPerKg = watch("crudeFatGPerKg") || 50;
  const crudeFiber = watch("crudeFiberGPerKg") || 40;
  const crudeAsh = watch("crudeAshGPerKg") || 80;
  const nfe = watch("nfe") || 310;
  const phosphorus = watch("phosphorusGPerKg") || 7;
  const calcium = watch("calciumGPerKg") ||30;
  const carbohydratesGPerKg = watch("carbohydratesGPerKg") || 0;
  const geCoeffCP = watch("geCoeffCP") || 0;
  const geCoeffCF = watch("geCoeffCF") || 0;
  const geCoeffNFE = watch("geCoeffNFE") || 0;
  const C55 = 90;
  const C56 = 90;
  const C58 = 60;
  const carbohydrates =
    (1000 - Number(moistureGPerKg)) -
    (Number(crudeProtein) + Number(crudeFatGPerKg) + Number(crudeFiber) + Number(crudeAsh));
  const calculateGE = (Number(crudeProtein) * Number(geCoeffCP) / 10 + Number(crudeFatGPerKg) * Number(geCoeffCF) / 10 + Number(nfe) * Number(geCoeffNFE) / 10) / 100;
  const calculateDigCP = (Number(crudeProtein) / 10) * C55;
  const calculateDigCF = (Number(crudeFatGPerKg) / 10) * C56;
  const digNFE = (Number(nfe) / 10) * C58;
  const deCP = (calculateDigCP * Number(geCoeffCP)) / 10000;
  const deCF = (calculateDigCF * Number(geCoeffCF)) / 10000;
  const deNFE = (digNFE * Number(geCoeffNFE)) / 10000;
  const de = deCP + deCF + deNFE;
  useEffect(() => {
    setValue("carbohydratesGPerKg", carbohydrates);
  }, [crudeFiber, crudeAsh, nfe, phosphorus, calcium, carbohydrates, setValue]);

  useEffect(() => {
    setValue("ge", calculateGE);
  }, [crudeAsh, nfe, carbohydrates, geCoeffCP, geCoeffCF, geCoeffNFE, setValue]);
  useEffect(() => {
    setValue("digCP", calculateDigCP);
  }, [crudeProtein, setValue]);
  useEffect(() => {
    setValue("digCF", calculateDigCF);
  }, [crudeFatGPerKg, setValue]);
  useEffect(() => {
    setValue("digNFE", digNFE);
  }, [nfe, setValue]);
  useEffect(() => {
    setValue("deCP", deCP);
  }, [calculateDigCP, geCoeffCP, setValue]);
  useEffect(() => {
    setValue("deCF", deCF);
  }, [calculateDigCF, geCoeffCF, setValue]);
  useEffect(() => {
    setValue("deNFE", deNFE);
  }, [digNFE, geCoeffNFE, setValue]);
  useEffect(() => {
    setValue("de", de);
  }, [deCP, deCF, deNFE, setValue]);


  const createPayload = (formData: Record<string, any>) => {
    const payload: Record<string, any> = {};

    fields.forEach((field) => {
      const value = formData[field.name];
      if (field.type === 'number') {
        payload[field.name] =
          value !== '' && value !== null ? Number(value) : null;
      } else {
        payload[field.name] = value ?? '';
      }
    });

    return payload;
  };

  const onSubmit: SubmitHandler<FeedFormFields> = async (data) => {
    const payload = createPayload(data);
    // Prevent API call if one is already in progress
    if (isApiCallInProgress) return;

    setIsApiCallInProgress(true);

    try {
      const loggedUserData = JSON.parse(loggedUser);
      const token = getCookie('auth-token');

      if (payload) {
        const response = await fetch('/api/feed-store', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...payload,
            organaisationId: loggedUserData.organisationId,
          }),
        });
        const res = await response.json();
        if (res.status) {
          toast.success(res.message);
          router.push('/dashboard/feedSupply/libarary');
          reset();
        }
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsApiCallInProgress(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={2}>
        {fields?.map((field, i) => (
          <Grid item xs={12} sm={6} key={field.name}>
            {field.name === "digCP" ? (
              <TextField
                label={field.label}
                type="number"
                className="form-input"
                fullWidth
                value={calculateDigCP}
                disabled
              />
            ) :
              field.name === "digCF" ? (
                <TextField
                  label={field.label}
                  type="number"
                  className="form-input"
                  fullWidth
                  value={calculateDigCF}
                  disabled
                  style={{ cursor: 'no-drop' }}
                />
              ) :
                field.name === "digNFE" ? (
                  <TextField
                    label={field.label}
                    type="number"
                    className="form-input"
                    fullWidth
                    value={digNFE}
                    disabled
                  />
                ) :
                  field.name === "deCP" ? (
                    <TextField
                      label={field.label}
                      type="number"
                      className="form-input"
                      fullWidth
                      value={deCP}
                      disabled
                    />
                  ) :
                    field.name === "deCF" ? (
                      <TextField
                        label={field.label}
                        type="number"
                        className="form-input"
                        fullWidth
                        value={deCF}
                        disabled
                      />
                    ) :
                      field.name === "deNFE" ? (
                        <TextField
                          label={field.label}
                          type="number"
                          className="form-input"
                          fullWidth
                          value={deNFE}
                          disabled
                        />
                      ) :
                        field.name === "de" ? (
                          <TextField
                            label={field.label}
                            type="number"
                            className="form-input"
                            fullWidth
                            value={de}
                            disabled
                          />
                        ) :
                          field.name === "ge" ? (
                            <TextField
                              label={field.label}
                              type="number"
                              className="form-input"
                              fullWidth
                              value={calculateGE}
                              disabled
                            />
                          ) :
                            field.name === "carbohydratesGPerKg" ? (
                              <TextField
                                label={field.label}
                                type="number"
                                className="form-input"
                                fullWidth
                                value={carbohydrates}
                                disabled
                              />
                            ) :
                              field?.type === 'select' ? (
                                <FormControl fullWidth className="form-input" focused>
                                  <InputLabel id="feed-supply-select-label1">
                                    {field.label}
                                  </InputLabel>
                                  <Controller
                                    name={field.name}
                                    control={control}
                                    defaultValue={[] as never}
                                    render={({ field }) => (
                                      <Select
                                        multiple
                                        {...field}
                                        fullWidth
                                        label={field.name}
                                        renderValue={(selected: any) =>
                                          feedSuppliers
                                            ?.filter((s: any) => selected.includes(s.id))
                                            ?.map((s: any) => s.name)
                                            ?.join(', ')
                                        }
                                      >
                                        {feedSuppliers?.map((supplier: any) => (
                                          <MenuItem key={supplier.id} value={supplier.id}>
                                            {supplier.name}
                                          </MenuItem>
                                        ))}
                                      </Select>
                                    )}
                                  />
                                </FormControl>
                              ) : field.type === 'species-select' ? (
                                <FormControl fullWidth className="form-input" focused>
                                  <InputLabel>{field.label}</InputLabel>
                                  <Controller
                                    name={field.name}
                                    control={control}
                                    defaultValue=""
                                    rules={{ required: true }}
                                    render={({ field }) => (
                                      <Select {...field} label={field.name} fullWidth>
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
                                    )}
                                  />
                                </FormControl>
                              ) : (
                                <TextField
                                  label={field.label}
                                  type={field.type}
                                  className="form-input"
                                  focused
                                  fullWidth
                                  {...register(field.name, {
                                    required: true,
                                  })}
                                  error={!!errors[field.name]}
                                />
                              )}

            {errors[field.name]?.type === 'required' && (
              <Typography fontSize={13} color="red">
                {validationMessage.required}
              </Typography>
            )}
          </Grid>
        ))}

        <Grid item xs={12}>
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
              Add feed
            </Button>
          </Box>
        </Grid>
      </Grid>
    </form>
  );
};

export default NewFeedLibarary;
