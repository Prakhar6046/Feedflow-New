import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  List,
  ListItem,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { NextPage } from 'next';
import { useState } from 'react';

interface Props {
  setActiveStep: (val: number) => void;
}

const BatchReport: NextPage<Props> = ({ setActiveStep }) => {
  const [age, setAge] = useState('');

  const handleChange = (event: SelectChangeEvent) => {
    setAge(event.target.value as string);
  };
  return (
    <Stack>
      <Typography
        variant="h6"
        fontWeight={700}
        sx={{
          fontSize: {
            md: 24,
            xs: 20,
          },
          marginBottom: {
            md: 3,
            xs: 2,
          },
        }}
      >
        Batch Information
      </Typography>

      <Box>
        <Typography
          variant="h6"
          gutterBottom
          fontWeight={700}
          sx={{
            fontSize: {
              md: 20,
              xs: 18,
            },
          }}
        >
          Batch Action
        </Typography>

        <List
          sx={{
            py: 0,
            display: 'flex',
            flexWrap: 'wrap',
            rowGap: 1,
            columnGap: 3,
          }}
        >
          <ListItem
            sx={{
              pl: 0,
              py: 0,
              width: 'fit-content',
            }}
          >
            <Box
              bgcolor={'#1BB6B0'}
              borderRadius={100}
              sx={{
                width: '8px',
                height: '8px',
                mr: 1,
              }}
            ></Box>
            Merging
          </ListItem>

          <ListItem
            sx={{
              pl: 0,
              py: 0,
              width: 'fit-content',
            }}
          >
            <Box
              bgcolor={'#1BB6B0'}
              borderRadius={100}
              sx={{
                width: '8px',
                height: '8px',
                mr: 1,
              }}
            ></Box>
            Existing batches
          </ListItem>

          <ListItem
            sx={{
              pl: 0,
              py: 0,
              width: 'fit-content',
            }}
          >
            <Box
              bgcolor={'#1BB6B0'}
              borderRadius={100}
              sx={{
                width: '8px',
                height: '8px',
                mr: 1,
              }}
            ></Box>
            Splitting
          </ListItem>

          <ListItem
            sx={{
              pl: 0,
              py: 0,
              width: 'fit-content',
            }}
          >
            <Box
              bgcolor={'#1BB6B0'}
              borderRadius={100}
              sx={{
                width: '8px',
                height: '8px',
                mr: 1,
              }}
            ></Box>
            One or more existing batches
          </ListItem>

          <ListItem
            sx={{
              pl: 0,
              py: 0,
              width: 'fit-content',
            }}
          >
            <Box
              bgcolor={'#1BB6B0'}
              borderRadius={100}
              sx={{
                width: '8px',
                height: '8px',
                mr: 1,
              }}
            ></Box>
            Moving
          </ListItem>

          <ListItem
            sx={{
              pl: 0,
              py: 0,
              width: 'fit-content',
            }}
          >
            <Box
              bgcolor={'#1BB6B0'}
              borderRadius={100}
              sx={{
                width: '8px',
                height: '8px',
                mr: 1,
              }}
            ></Box>
            A batch from another unit or by
          </ListItem>

          <ListItem
            sx={{
              pl: 0,
              py: 0,
              width: 'fit-content',
            }}
          >
            <Box
              bgcolor={'#1BB6B0'}
              borderRadius={100}
              sx={{
                width: '8px',
                height: '8px',
                mr: 1,
              }}
            ></Box>
            Creating
          </ListItem>
        </List>

        <Stack
          mt={1}
          display={'flex'}
          direction={'row'}
          justifyContent={'flex-start'}
          alignItems={'center'}
          gap={2}
          flexWrap={'wrap'}
          sx={{
            mb: {
              md: 5,
              xs: 3,
            },
          }}
        >
          <Button
            type="submit"
            variant="contained"
            sx={{
              background: '#06A19B',
              fontWeight: 600,
              padding: '6px 16px',
              width: 'fit-content',
              textTransform: 'capitalize',
              borderRadius: '8px',
              marginTop: 2,
              boxShadow: 'none',
            }}
          >
            Merge Batches
          </Button>

          <Button
            type="submit"
            variant="contained"
            sx={{
              background: '#fff',
              fontWeight: 600,
              padding: '6px 16px',
              width: 'fit-content',
              textTransform: 'capitalize',
              borderRadius: '8px',
              marginTop: 2,
              color: '#06A19B',
              border: '1px solid #06A19B',
              boxShadow: 'none',
            }}
          >
            Merge Batches
          </Button>

          <Button
            type="submit"
            variant="contained"
            sx={{
              background: '#06A19B',
              fontWeight: 600,
              padding: '6px 16px',
              width: 'fit-content',
              textTransform: 'capitalize',
              borderRadius: '8px',
              marginTop: 2,
              boxShadow: 'none',
            }}
          >
            Move Batch
          </Button>

          <Button
            type="submit"
            variant="contained"
            sx={{
              background: '#fff',
              fontWeight: 600,
              padding: '6px 16px',
              width: 'fit-content',
              textTransform: 'capitalize',
              borderRadius: '8px',
              marginTop: 2,
              color: '#06A19B',
              border: '1px solid #06A19B',
              boxShadow: 'none',
            }}
          >
            Create a Batch
          </Button>
        </Stack>

        <form>
          <Grid container spacing={2}>
            <Grid item md={6} xs={12}>
              <TextField
                label="Batch Name"
                type="text"
                className="form-input"
                // focused
                sx={{
                  width: '100%',
                  marginBottom: 2,
                }}
              />
            </Grid>

            <Grid item md={6} sm={4} xs={6}>
              <FormControl fullWidth className="form-input">
                <InputLabel id="demo-simple-select-label">Age</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={age}
                  label="Age"
                  onChange={handleChange}
                >
                  <MenuItem value={10}>Ten</MenuItem>
                  <MenuItem value={20}>Twenty</MenuItem>
                  <MenuItem value={30}>Thirty</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item md={6} sm={4} xs={6}>
              <FormControl fullWidth className="form-input">
                <InputLabel id="demo-simple-select-label">Age</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={age}
                  label="Age"
                  onChange={handleChange}
                >
                  <MenuItem value={10}>Ten</MenuItem>
                  <MenuItem value={20}>Twenty</MenuItem>
                  <MenuItem value={30}>Thirty</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item md={6} sm={4} xs={12}>
              <FormControl fullWidth className="form-input">
                <InputLabel id="demo-simple-select-label">Age</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={age}
                  label="Age"
                  onChange={handleChange}
                >
                  <MenuItem value={10}>Ten</MenuItem>
                  <MenuItem value={20}>Twenty</MenuItem>
                  <MenuItem value={30}>Thirty</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

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
              sx={{
                background: '#fff',
                color: '#06A19B',
                fontWeight: 600,
                padding: '6px 16px',
                width: 'fit-content',
                textTransform: 'capitalize',
                borderRadius: '8px',
                border: '1px solid #06A19B',
              }}
              onClick={() => setActiveStep(0)}
            >
              Previous
            </Button>
            <Button
              type="submit"
              variant="contained"
              sx={{
                background: '#06A19B',
                fontWeight: 600,
                padding: '6px 16px',
                width: 'fit-content',
                textTransform: 'capitalize',
                borderRadius: '8px',
              }}
              onClick={() => setActiveStep(2)}
            >
              Next
            </Button>
          </Box>
        </form>
      </Box>
    </Stack>
  );
};

export default BatchReport;
