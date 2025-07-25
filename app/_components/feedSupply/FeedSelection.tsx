'use client';
import { FeedProduct } from '@/app/_typeModels/Feed';
import { FeedSupplier } from '@/app/_typeModels/Organization';
import {
  Box,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  Stack,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';

export interface FeedSupply {
  id: string;
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
  nutritionalGuarantee: {
    calcium: {
      kg: string;
      value: string;
    };
    crudeAsh: {
      kg: string;
      value: string;
    };
    crudeFat: {
      kg: string;
      value: string;
    };
    moisture: {
      kg: string;
      value: string;
    };
    phosphorous: {
      kg: string;
      value: string;
    };
    crudeProtein: {
      kg: string;
      value: string;
    };
    carbohydrates: {
      kg: string;
      value: string;
    };
    metabolizableEnergy: {
      kg: string;
      value: string;
    };
    crudeFiber: { kg: string; value: string };
  };
  updatedBy: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}
type Iprops = {
  data: FeedProduct[];
  feedSuppliers: FeedSupplier[];
};
const FeedSelection = ({ data, feedSuppliers }: Iprops) => {
  const [feedStores, setFeedStores] = useState<FeedProduct[]>();

  useEffect(() => {
    setFeedStores(data);
  }, [data]);

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
          marginBottom: 3,
        }}
      >
        Feed Selection
      </Typography>

      <Box
        sx={{
          width: '100%',
          overflowX: 'auto',
        }}
      >
        <Grid
          container
          spacing={2}
          sx={{
            flexWrap: 'nowrap',
            minWidth: 1000,
            pb: '16px',
          }}
        >
          {feedStores?.length ? (
            feedStores?.map((supply) => {
              const supplierName = feedSuppliers?.find(
                (supplier: FeedSupplier) =>
                  supply?.ProductSupplier?.includes(String(supplier?.id)),
              )?.name;
              return (
                <Grid item xs="auto" key={Number(supply?.id)}>
                  <Box
                    position={'relative'}
                    border={'1px solid #555555AC'}
                    borderRadius={3}
                    p={2}
                    sx={{
                      width: 'ft-content',
                      maxWidth: '370px',
                      height: '100%',
                    }}
                  >
                    {/* <Box
                    display={"flex"}
                    justifyContent={"end"}
                    mb={2}
                    onClick={() => handleEditFeedSupply(supply)}
                  >
                    <Button
                      type="button"
                      variant="contained"
                      sx={{
                        background: "#06A19B",
                        fontWeight: 600,
                        width: "fit-content",
                        minWidth: "30px !important",
                        padding: "6px 10px !important",
                        textTransform: "capitalize",
                        borderRadius: "4px",
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="1.2em"
                        height="1.2em"
                        viewBox="0 0 24 24"
                      >
                        <g
                          fill="none"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                        >
                          <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z" />
                        </g>
                      </svg>
                    </Button>
                  </Box> */}

                    <Box>
                      <Box
                        display={'flex'}
                        gap={1}
                        alignItems={'flex-start'}
                        justifyContent={'space-between'}
                      >
                        <Box textAlign={'center'}>
                          <Typography
                            color="#06a19b"
                            variant="h6"
                            fontWeight={600}
                            fontSize={20}
                          >
                            {`${supplierName} ${supply?.productName}`}
                          </Typography>

                          <Typography
                            color="#000"
                            variant="subtitle2"
                            fontWeight={500}
                            fontSize={11}
                          >
                            {`  Product code `}
                          </Typography>
                        </Box>

                        <Box
                          bgcolor={'rgba(6, 161, 155, 0.15)'}
                          p={1.5}
                          borderRadius={1.5}
                          display={'flex'}
                          flexDirection={'column'}
                          justifyContent={'center'}
                          alignItems={'center'}
                        >
                          <Typography
                            color="#06a19b"
                            variant="h6"
                            fontWeight={600}
                            fontSize={20}
                            display={'flex'}
                            alignItems={'end'}
                            lineHeight={1}
                            gap={1}
                          >
                            {supply?.particleSize}
                            {/* <Typography
                              color="#06a19b"
                              variant="h6"
                              fontWeight={700}
                              fontSize={12}
                              lineHeight={1}
                            >
                              mm
                            </Typography> */}
                          </Typography>

                          <Typography
                            color="#06a19b"
                            variant="h6"
                            fontWeight={600}
                            fontSize={12}
                          >
                            Crumble
                          </Typography>
                        </Box>
                      </Box>

                      <Divider
                        sx={{
                          borderColor: '#06a19bBC',
                          borderWidth: 1,
                          my: 1.5,
                          borderRadius: 50,
                        }}
                      />

                      <Box>
                        <Typography
                          color="#000"
                          variant="h6"
                          fontWeight={500}
                          fontSize={14}
                          textAlign={'center'}
                        >
                          {` ${supply?.nutritionalClass} Feed for ${supply?.suitableSpecies} production.`}
                          <br />
                          {` Suitable for use as ${supply?.nutritionalPurpose} in ${supply?.productionIntensity}.`}
                        </Typography>

                        <Box
                          display={'flex'}
                          justifyContent={'center'}
                          alignItems={'stretch'}
                          gap={1}
                          mt={1}
                        >
                          <Box display={'grid'} alignItems={'stretch'}>
                            <Box
                              display={'flex'}
                              flexDirection={'column'}
                              justifyContent={'center'}
                              alignItems={'center'}
                              gap={0.5}
                            >
                              <Typography
                                color="#06a19b"
                                variant="h6"
                                fontWeight={500}
                                fontSize={14}
                                textAlign={'center'}
                              >
                                Feeding Phase
                              </Typography>

                              <Box
                                bgcolor={'rgba(6, 161, 155, 0.15)'}
                                p={1.5}
                                borderRadius={1.5}
                                width={160}
                              >
                                <List
                                  sx={{
                                    p: 0,
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    columnGap: 1,
                                    flexWrap: 'wrap',
                                  }}
                                >
                                  <ListItem
                                    sx={{
                                      p: 0,
                                      color: '#06a19b',
                                      fontWeight: 600,
                                      fontSize: 16,
                                      width: 'fit-content',
                                    }}
                                  >
                                    {supply?.suitabilityUnit}
                                  </ListItem>

                                  <ListItem
                                    sx={{
                                      p: 0,
                                      color: '#06a19b',
                                      fontWeight: 600,
                                      fontSize: 16,
                                      width: 'fit-content',
                                    }}
                                  >
                                    <ListItemIcon
                                      sx={{
                                        p: 0,
                                        minWidth: 'fit-content',
                                        mr: 1,
                                        fontSize: 6,
                                        color: '#06a19b',
                                      }}
                                    >
                                      ⬤
                                    </ListItemIcon>
                                    {supply?.lifeStage}
                                  </ListItem>

                                  <ListItem
                                    sx={{
                                      p: 0,
                                      color: '#06a19b',
                                      fontWeight: 600,
                                      fontSize: 16,
                                      width: 'fit-content',
                                    }}
                                  >
                                    <ListItemIcon
                                      sx={{
                                        p: 0,
                                        minWidth: 'fit-content',
                                        mr: 1,
                                        fontSize: 6,
                                        color: '#06a19b',
                                      }}
                                    >
                                      ⬤
                                    </ListItemIcon>
                                    {supply?.feedingPhase}
                                  </ListItem>
                                </List>
                              </Box>
                            </Box>
                          </Box>

                          <Box display={'grid'} alignItems={'stretch'}>
                            <Box
                              display={'flex'}
                              flexDirection={'column'}
                              gap={0.5}
                            >
                              <Typography
                                color="#06a19b"
                                variant="h6"
                                fontWeight={500}
                                fontSize={14}
                                textAlign={'center'}
                                sx={{
                                  textWrap: 'nowrap',
                                }}
                              >
                                Fish Size Class
                              </Typography>

                              <Box
                                bgcolor={'rgba(6, 161, 155, 0.15)'}
                                p={1.5}
                                borderRadius={1.5}
                                width={160}
                                height={'100%'}
                                display={'flex'}
                                justifyContent={'center'}
                                alignItems={'center'}
                              >
                                <Typography
                                  color="#06a19b"
                                  variant="h6"
                                  fontWeight={600}
                                  fontSize={16}
                                  textAlign={'center'}
                                >
                                  {/* 5 - 30g */}
                                  {`${supply?.fishSizeG} g`}
                                </Typography>
                              </Box>
                            </Box>
                          </Box>
                        </Box>
                      </Box>

                      <Divider
                        sx={{
                          borderColor: '#06a19bBC',
                          borderWidth: 1,
                          my: 1.5,
                          borderRadius: 50,
                        }}
                      />

                      <Box>
                        <Typography
                          variant="h6"
                          fontWeight={600}
                          fontSize={18}
                          color="#000"
                        >
                          Nutritional Guarantees
                        </Typography>

                        <Grid container mt={0.5}>
                          <Grid item xs={6}>
                            <Typography
                              variant="subtitle1"
                              fontWeight={500}
                              fontSize={14}
                            >
                              {/* {`  Moisture (${getNutritionalValue(
                                supply?.nutritionalGuarantee?.moisture.value
                              )})`} */}
                              Moisture
                            </Typography>
                          </Grid>

                          <Grid item xs={6} textAlign={'right'}>
                            <Typography
                              variant="subtitle1"
                              fontWeight={600}
                              fontSize={14}
                            >
                              {/* {supply?.nutritionalGuarantee?.moisture.kg} */}
                              {supply?.moistureGPerKg}
                            </Typography>
                          </Grid>

                          <Grid item xs={6}>
                            <Typography
                              variant="subtitle1"
                              fontWeight={500}
                              fontSize={14}
                            >
                              {/* {`Crude Protein (${getNutritionalValue(
                                supply?.nutritionalGuarantee?.crudeProtein.value
                              )})`} */}
                              Crude Protien
                            </Typography>
                          </Grid>

                          <Grid item xs={6} textAlign={'right'}>
                            <Typography
                              variant="subtitle1"
                              fontWeight={600}
                              fontSize={14}
                            >
                              {supply?.crudeProteinGPerKg}
                            </Typography>
                          </Grid>

                          <Grid item xs={6}>
                            <Typography
                              variant="subtitle1"
                              fontWeight={500}
                              fontSize={14}
                            >
                              {/* {`Crude Fat (${getNutritionalValue(
                                supply?.nutritionalGuarantee?.crudeFat.value
                              )})`} */}
                              {`Crude Fat`}
                            </Typography>
                          </Grid>

                          <Grid item xs={6} textAlign={'right'}>
                            <Typography
                              variant="subtitle1"
                              fontWeight={600}
                              fontSize={14}
                            >
                              {supply?.crudeFatGPerKg}
                            </Typography>
                          </Grid>

                          <Grid item xs={6}>
                            <Typography
                              variant="subtitle1"
                              fontWeight={500}
                              fontSize={14}
                            >
                              {/* {`Crude Fiber (${getNutritionalValue(
                                supply?.nutritionalGuarantee?.crudeFiber.value
                              )})`} */}
                              {`Crude Fiber `}
                            </Typography>
                          </Grid>

                          <Grid item xs={6} textAlign={'right'}>
                            <Typography
                              variant="subtitle1"
                              fontWeight={600}
                              fontSize={14}
                            >
                              {supply?.crudeFiberGPerKg}
                            </Typography>
                          </Grid>

                          <Grid item xs={6}>
                            <Typography
                              variant="subtitle1"
                              fontWeight={500}
                              fontSize={14}
                            >
                              {/* {`Crude Ash (${getNutritionalValue(
                                supply?.nutritionalGuarantee?.crudeAsh.value
                              )})`} */}
                              {`Crude Ash`}
                            </Typography>
                          </Grid>

                          <Grid item xs={6} textAlign={'right'}>
                            <Typography
                              variant="subtitle1"
                              fontWeight={600}
                              fontSize={14}
                            >
                              {supply?.crudeAshGPerKg}
                            </Typography>
                          </Grid>

                          <Grid item xs={6}>
                            <Typography
                              variant="subtitle1"
                              fontWeight={500}
                              fontSize={14}
                            >
                              {/* {`Calcium (${getNutritionalValue(
                                supply?.nutritionalGuarantee?.calcium.value
                              )})`} */}
                              {`Calcium `}
                            </Typography>
                          </Grid>

                          <Grid item xs={6} textAlign={'right'}>
                            <Typography
                              variant="subtitle1"
                              fontWeight={600}
                              fontSize={14}
                            >
                              {supply?.calciumGPerKg}
                            </Typography>
                          </Grid>

                          <Grid item xs={6}>
                            <Typography
                              variant="subtitle1"
                              fontWeight={500}
                              fontSize={14}
                            >
                              {/* {`Phosphorous (${getNutritionalValue(
                                supply?.nutritionalGuarantee?.phosphorous.value
                              )})`} */}
                              {`Phosphorous`}
                            </Typography>
                          </Grid>

                          <Grid item xs={6} textAlign={'right'}>
                            <Typography
                              variant="subtitle1"
                              fontWeight={600}
                              fontSize={14}
                            >
                              {supply?.phosphorusGPerKg}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Box>

                      <Divider
                        sx={{
                          borderColor: '#06a19bBC',
                          borderWidth: 1,
                          my: 1.5,
                          borderRadius: 50,
                        }}
                      />

                      <Box>
                        <Typography
                          variant="h6"
                          fontWeight={600}
                          fontSize={18}
                          color="#000"
                        >
                          Feed Ingredients
                        </Typography>

                        <Typography
                          variant="h6"
                          fontWeight={500}
                          fontSize={14}
                          color="#000"
                          mt={0.5}
                          textAlign={'justify'}
                        >
                          {supply?.feedIngredients}
                        </Typography>
                      </Box>

                      <Divider
                        sx={{
                          borderColor: '#06a19bBC',
                          borderWidth: 1,
                          my: 1.5,
                          borderRadius: 50,
                        }}
                      />

                      <Box>
                        <Typography
                          variant="h6"
                          fontWeight={600}
                          fontSize={18}
                          color="#000"
                        >
                          Feeding Guide
                        </Typography>

                        <Typography
                          variant="h6"
                          fontWeight={500}
                          fontSize={14}
                          color="#000"
                          mt={0.5}
                        >
                          {supply?.feedingGuide}
                        </Typography>
                      </Box>

                      <Divider
                        sx={{
                          borderColor: '#06a19bBC',
                          borderWidth: 1,
                          my: 1.5,
                          borderRadius: 50,
                        }}
                      />

                      <Typography
                        variant="h6"
                        fontWeight={600}
                        fontSize={18}
                        color="#06a19b"
                        textAlign={'center'}
                      >
                        Shelf Life: {supply?.shelfLifeMonths} months
                      </Typography>

                      <Divider
                        sx={{
                          borderColor: '#06a19bBC',
                          borderWidth: 1,
                          my: 1.5,
                          borderRadius: 50,
                        }}
                      />

                      <Typography
                        variant="h6"
                        fontWeight={500}
                        fontSize={14}
                        color="#000"
                      >
                        Specialized Aquatic Feeds(Pty) Ltd. Corner Church and
                        Stil St, Westcliff, Hermanus 7200, South Africa <br />
                        Tel: +27 28 313 8581 / info@safeeds.co.za
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              );
            })
          ) : (
            <>No data found</>
          )}
        </Grid>
      </Box>

      {/* <Box>
        <Box
          display={"flex"}
          alignItems={"center"}
          mt={3}
          gap={2}
          flexWrap={"wrap"}
          justifyContent={"end"}
          width={"100%"}
        >
          <Box
            display={"flex"}
            justifyContent={"flex-end"}
            alignItems={"center"}
            gap={3}
          >
            <Button
              type="button"
              variant="contained"
              sx={{
                background: "#06A19B",
                fontWeight: 600,
                padding: "6px 16px",
                width: "fit-content",
                textTransform: "capitalize",
                borderRadius: "8px",
              }}
            >
              Next
            </Button>
          </Box>
        </Box>
      </Box> */}
    </Stack>
  );
};

export default FeedSelection;
