'use client';
import { Box, Button, Stack, TextField, Typography } from '@mui/material';
import { useForm, SubmitHandler } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { clientSecureFetch } from '@/app/_lib/clientSecureFetch';

type FormInputs = { name: string };
interface SpeciesFormProps {
  mode?: 'add' | 'edit';
  id?: string;
  initialData?: FormInputs;
}
export default function AddSpecies({ mode = 'add', id, initialData }: SpeciesFormProps) {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormInputs>();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
   useEffect(() => {
    if (mode === 'edit' && initialData) {
      reset(initialData);
    }
  }, [mode, initialData, reset]);

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    setLoading(true);
    try {
      let res;
      if (mode === 'add') {
        res = await clientSecureFetch('/api/species', {
          method: 'POST',
          body: JSON.stringify(data),
        });
      } else {
        res = await clientSecureFetch(`/api/species/${id}`, {
          method: 'PUT',
          body: JSON.stringify(data),
        });
      }

      const result = await res.json();
      if (res.ok) {
        toast.success(mode === 'add' ? 'Species added successfully' : 'Species updated successfully');
        router.push('/dashboard/growthModel/species-production-system?tab=species');
        router.refresh();
      } else {
        toast.error(result.error || 'Something went wrong');
      }
    } catch {
      toast.error('Server error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack sx={{ mt: 4, p: 3, boxShadow: '0px 0px 5px #C5C5C5', borderRadius: '14px' }}>
      <Typography variant="h6" mb={2}>{mode === 'add' ? 'Add Species' : 'Edit Species'}</Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          label="Species Name *"
          fullWidth
          {...register('name', { required: 'Name is required' })}
          sx={{ mb: 2 }}
        />
        {errors.name && <Typography color="red">{errors.name.message}</Typography>}
        <Button type="submit" variant="contained" disabled={loading} sx={{ background: '#06A19B' }}>
           {mode === 'add' ? 'Save' : 'Update'}
        </Button>
      </form>
    </Stack>
  );
}
