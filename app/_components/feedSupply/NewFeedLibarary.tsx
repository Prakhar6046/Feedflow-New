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
import { useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
// import { DatePicker } from "@mui/x-date-pickers/DatePicker";
const fields = [
  { name: 'ProductSupplier', label: 'Product Supplier *', type: 'select' },
  { name: 'brandName', label: 'Brand Name *', type: 'text' },
  { name: 'productName', label: 'Product Name *', type: 'text' },
  { name: 'productFormat', label: 'Product Format *', type: 'text' },
  { name: 'particleSize', label: 'Particle Size *', type: 'string' },
  { name: 'fishSizeG', label: 'Fish Size (g) *', type: 'number' },
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

interface Props {
  feedSuppliers: FeedSupplier[];
}

interface FeedFormFields {
  [key: string]: string | number | null | undefined;
}

const NewFeedLibarary: NextPage<Props> = ({ feedSuppliers }) => {
  const router = useRouter();
  const loggedUser = getCookie('logged-user') ?? '';
  const [isApiCallInProgress, setIsApiCallInProgress] =
    useState<boolean>(false);
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<FeedFormFields>({ mode: 'onChange' });

  const createPayload = (formData: FeedFormFields) => {
    const payload: FeedFormFields = {};

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
      const loggedUserData = JSON.parse(loggedUser ?? '');

      if (payload) {
        const response = await fetch('/api/feed-store', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
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
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsApiCallInProgress(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={2}>
        {fields?.map((field) => (
          <Grid item xs={12} sm={6} key={field.name}>
            {field?.type === 'select' ? (
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
                          ?.filter((s: FeedSupplier) =>
                            selected.includes(String(s.id)),
                          )
                          ?.map((s: FeedSupplier) => s.name)
                          ?.join(', ')
                      }
                    >
                      {feedSuppliers?.map((supplier: FeedSupplier) => (
                        <MenuItem key={supplier.id} value={supplier.id}>
                          {supplier.name}
                        </MenuItem>
                      ))}
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
