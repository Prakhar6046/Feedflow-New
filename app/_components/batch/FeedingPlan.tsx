import { NextPage } from 'next';
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';

interface Props {
  setActiveStep: (val: number) => void;
}

const FeedingPlan: NextPage<Props> = ({ setActiveStep }) => {
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
          marginBottom: 2,
        }}
      >
        Feeding Plan
      </Typography>

      <Box>
        <form>
          <Grid container spacing={2}>
            <Grid item md={6} xs={12}>
              <TextField
                label="Feed Plan Name"
                type="text"
                className="form-input"
                sx={{
                  width: '100%',
                  marginBottom: 2,
                }}
              />
            </Grid>

            <Grid item md={6} xs={12}>
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

          <Box>
            <Button
              type="submit"
              variant="contained"
              sx={{
                background: '#fff',
                color: '#06A19B',
                border: '1px solid #06A19B',
                boxShadow: 'none',
                fontWeight: 600,
                padding: '6px 16px',
                width: 'fit-content',
                textTransform: 'capitalize',
                borderRadius: '8px',
                marginLeft: 'auto',
                display: 'block',
                marginTop: 1,
              }}
            >
              Add
            </Button>
          </Box>

          <Box>
            <Typography
              variant="h6"
              fontWeight={700}
              sx={{
                fontSize: {
                  md: 24,
                  xs: 20,
                },
                marginBlock: 1.5,
              }}
            >
              Your feed coverage:
            </Typography>

            <Grid container>
              <Grid item xs>
                <FormControl>
                  <FormLabel
                    id="demo-row-radio-buttons-group-label"
                    sx={{
                      fontSize: 18,
                      fontWeight: 600,
                      color: '#000 !important',
                    }}
                  >
                    Stocking
                  </FormLabel>
                  <RadioGroup
                    sx={{
                      fontSize: 50,
                    }}
                    className="form-input"
                    row
                    aria-labelledby="demo-row-radio-buttons-group-label"
                    name="row-radio-buttons-group"
                  >
                    <FormControlLabel
                      className="form-radio"
                      value="lorem"
                      control={<Radio />}
                      label="lorem"
                    />
                    <FormControlLabel
                      className="form-radio"
                      value="lorem1"
                      control={<Radio />}
                      label="lorem1"
                    />
                    <FormControlLabel
                      className="form-radio"
                      value="lorem2"
                      control={<Radio />}
                      label="lorem2"
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>

              <Grid item xs>
                <FormControl>
                  <FormLabel
                    id="demo-row-radio-buttons-group-label"
                    sx={{
                      fontSize: 18,
                      fontWeight: 600,
                      color: '#000 !important',
                    }}
                  >
                    Harvest
                  </FormLabel>
                  <RadioGroup
                    sx={{
                      fontSize: 50,
                    }}
                    className="form-input"
                    row
                    aria-labelledby="demo-row-radio-buttons-group-label"
                    name="row-radio-buttons-group"
                  >
                    <FormControlLabel
                      className="form-radio"
                      value="lorem3"
                      control={<Radio />}
                      label="lorem3"
                    />
                    <FormControlLabel
                      className="form-radio"
                      value="lorem4"
                      control={<Radio />}
                      label="lorem4"
                    />
                    <FormControlLabel
                      className="form-radio"
                      value="lorem5"
                      control={<Radio />}
                      label="lorem5"
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>
            </Grid>

            <Grid container spacing={2} mt={1}>
              <Grid item md={6} xs={12}>
                <TextField
                  label="Feed Price"
                  type="text"
                  className="form-input"
                  sx={{
                    width: '100%',
                    marginBottom: 2,
                  }}
                />
              </Grid>

              <Grid item md={6} xs={12}>
                <TextField
                  label="Feed Bag Size"
                  type="text"
                  className="form-input"
                  sx={{
                    width: '100%',
                    marginBottom: 2,
                  }}
                />
              </Grid>
            </Grid>
          </Box>

          <Box
            display={'flex'}
            justifyContent={'flex-end'}
            alignItems={'center'}
            gap={3}
            mt={1}
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
              onClick={() => setActiveStep(2)}
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
              onClick={() => setActiveStep(4)}
            >
              Submit
            </Button>
          </Box>
        </form>
      </Box>
    </Stack>
  );
};

export default FeedingPlan;
