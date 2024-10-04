import {
  Box,
  Button,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  Stack,
  Typography,
} from "@mui/material";
import { NextPage } from "next";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Loader from "../Loader";
import { useAppDispatch } from "@/lib/hooks";
import { feedAction } from "@/lib/features/feed/feedSlice";

interface Props {
  setActiveStep: (val: number) => void;
  editFarm?: any;
}
export interface FeedSupply {
  id: String;
  feedIngredients: String;
  feedingGuide: String;
  productionIntensity: String;
  unit: String;
  feedingPhase: String;
  lifeStage: String;
  shelfLife: String;
  productCode: String;
  feedSupplierCode: String;
  brandCode: String;
  productNameCode: String;
  productFormatCode: String;
  animalSizeInLength: String;
  animalSizeInWeight: String;
  specie: String;
  nutritionalPurpose: String;
  nutritionalClass: String;
  particleSize: String;
  productFormat: String;
  productName: String;
  brandName: String;
  feedSupplier: String;
  nutritionalGuarantee: {
    calcium: {
      kg: String;
      value: String;
    };
    crudeAsh: {
      kg: String;
      value: String;
    };
    crudeFat: {
      kg: String;
      value: String;
    };
    moisture: {
      kg: String;
      value: String;
    };
    phosphorous: {
      kg: String;
      value: String;
    };
    crudeProtein: {
      kg: String;
      value: String;
    };
    carbohydrates: {
      kg: String;
      value: String;
    };
    metabolizableEnergy: {
      kg: String;
      value: String;
    };
  };
  updatedBy: String;
  createdBy: String;
  createdAt: String;
  updatedAt: String;
}

const FeedSelection: NextPage<Props> = ({ setActiveStep, editFarm }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [feedSupply, setFeedSupply] = useState<FeedSupply[]>();
  const [loading, setLoading] = useState<boolean>(false);
  const getFeedSupplys = async () => {
    const response = await fetch("/api/feed");
    return response.json();
  };
  const handleEditFeedSupply = (feedSupply: FeedSupply) => {
    if (feedSupply) {
      router.push(`/dashboard/feedSupply/${feedSupply.id}`);
      dispatch(feedAction.editFeed(feedSupply));
    }
  };
  useEffect(() => {
    setLoading(true);
    const getFeedSupplyer = async () => {
      const res = await getFeedSupplys();
      setFeedSupply(res.data);
      setLoading(false);
    };
    getFeedSupplyer();
  }, []);

  if (loading) {
    return <Loader />;
  }
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

      {/* <Box
        sx={{
          width: "100%",
          overflowX: "auto",
        }}
      > */}
      <Grid
        container
        spacing={2}
        sx={{
          flexWrap: "nowrap",
          minWidth: 1000,
          overflowX: "auto",
          pb: "16px",
        }}
      >
        {feedSupply?.length ? (
          feedSupply?.map((supply) => {
            return (
              <Grid
                item
                xs="auto"
                key={Number(supply?.id)}
                onClick={() => handleEditFeedSupply(supply)}
              >
                <Box
                  border={"1px solid #555555AC"}
                  borderRadius={3}
                  p={2}
                  sx={{
                    width: "ft-content",
                    maxWidth: "370px",
                    height: "100%",
                  }}
                >
                  <Box
                    display={"flex"}
                    gap={1}
                    alignItems={"flex-start"}
                    justifyContent={"space-between"}
                  >
                    <Box textAlign={"center"}>
                      <Typography
                        color="#06a19b"
                        variant="h6"
                        fontWeight={600}
                        fontSize={20}
                      >
                        {`${supply?.feedSupplierCode} ${supply?.productName}`}
                      </Typography>

                      <Typography
                        color="#000"
                        variant="subtitle2"
                        fontWeight={500}
                        fontSize={11}
                      >
                        {`  Product code ${supply?.productCode}`}
                      </Typography>
                    </Box>

                    <Box
                      bgcolor={"rgba(6, 161, 155, 0.15)"}
                      p={1.5}
                      borderRadius={1.5}
                      display={"flex"}
                      flexDirection={"column"}
                      justifyContent={"center"}
                      alignItems={"center"}
                    >
                      <Typography
                        color="#06a19b"
                        variant="h6"
                        fontWeight={600}
                        fontSize={20}
                        display={"flex"}
                        alignItems={"end"}
                        lineHeight={1}
                        gap={1}
                      >
                        {supply?.particleSize}
                        <Typography
                          color="#06a19b"
                          variant="h6"
                          fontWeight={700}
                          fontSize={12}
                          lineHeight={1}
                        >
                          mm
                        </Typography>
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
                      borderColor: "#06a19bBC",
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
                      textAlign={"center"}
                    >
                      {` ${supply?.nutritionalClass} Feed for ${supply?.specie} production.`}
                      <br />
                      {` Suitable for use as ${supply?.nutritionalPurpose} in ${supply?.productionIntensity}.`}
                    </Typography>

                    <Box
                      display={"flex"}
                      justifyContent={"center"}
                      alignItems={"stretch"}
                      gap={1}
                      mt={1}
                    >
                      <Box display={"grid"} alignItems={"stretch"}>
                        <Box
                          display={"flex"}
                          flexDirection={"column"}
                          justifyContent={"center"}
                          alignItems={"center"}
                          gap={0.5}
                        >
                          <Typography
                            color="#06a19b"
                            variant="h6"
                            fontWeight={500}
                            fontSize={14}
                            textAlign={"center"}
                          >
                            Feeding Phase
                          </Typography>

                          <Box
                            bgcolor={"rgba(6, 161, 155, 0.15)"}
                            p={1.5}
                            borderRadius={1.5}
                            width={160}
                          >
                            <List
                              sx={{
                                p: 0,
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                columnGap: 1,
                                flexWrap: "wrap",
                              }}
                            >
                              <ListItem
                                sx={{
                                  p: 0,
                                  color: "#06a19b",
                                  fontWeight: 600,
                                  fontSize: 16,
                                  width: "fit-content",
                                }}
                              >
                                {supply?.unit}
                              </ListItem>

                              <ListItem
                                sx={{
                                  p: 0,
                                  color: "#06a19b",
                                  fontWeight: 600,
                                  fontSize: 16,
                                  width: "fit-content",
                                }}
                              >
                                <ListItemIcon
                                  sx={{
                                    p: 0,
                                    minWidth: "fit-content",
                                    mr: 1,
                                    fontSize: 6,
                                    color: "#06a19b",
                                  }}
                                >
                                  ⬤
                                </ListItemIcon>
                                {supply?.lifeStage}
                              </ListItem>

                              <ListItem
                                sx={{
                                  p: 0,
                                  color: "#06a19b",
                                  fontWeight: 600,
                                  fontSize: 16,
                                  width: "fit-content",
                                }}
                              >
                                <ListItemIcon
                                  sx={{
                                    p: 0,
                                    minWidth: "fit-content",
                                    mr: 1,
                                    fontSize: 6,
                                    color: "#06a19b",
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

                      <Box display={"grid"} alignItems={"stretch"}>
                        <Box
                          display={"flex"}
                          flexDirection={"column"}
                          gap={0.5}
                        >
                          <Typography
                            color="#06a19b"
                            variant="h6"
                            fontWeight={500}
                            fontSize={14}
                            textAlign={"center"}
                            sx={{
                              textWrap: "nowrap",
                            }}
                          >
                            Fish Size Class
                          </Typography>

                          <Box
                            bgcolor={"rgba(6, 161, 155, 0.15)"}
                            p={1.5}
                            borderRadius={1.5}
                            width={160}
                            height={"100%"}
                            display={"flex"}
                            justifyContent={"center"}
                            alignItems={"center"}
                          >
                            <Typography
                              color="#06a19b"
                              variant="h6"
                              fontWeight={600}
                              fontSize={16}
                              textAlign={"center"}
                            >
                              5 - 30g
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  </Box>

                  <Divider
                    sx={{
                      borderColor: "#06a19bBC",
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
                          {`  Moisture (${supply?.nutritionalGuarantee?.moisture.value})`}
                        </Typography>
                      </Grid>

                      <Grid item xs={6} textAlign={"right"}>
                        <Typography
                          variant="subtitle1"
                          fontWeight={600}
                          fontSize={14}
                        >
                          {supply?.nutritionalGuarantee?.moisture.kg}
                        </Typography>
                      </Grid>

                      <Grid item xs={6}>
                        <Typography
                          variant="subtitle1"
                          fontWeight={500}
                          fontSize={14}
                        >
                          {`Crude Protein (${supply?.nutritionalGuarantee?.crudeProtein.value})`}
                        </Typography>
                      </Grid>

                      <Grid item xs={6} textAlign={"right"}>
                        <Typography
                          variant="subtitle1"
                          fontWeight={600}
                          fontSize={14}
                        >
                          {supply?.nutritionalGuarantee?.crudeProtein.kg}
                        </Typography>
                      </Grid>

                      <Grid item xs={6}>
                        <Typography
                          variant="subtitle1"
                          fontWeight={500}
                          fontSize={14}
                        >
                          {`Crude Fat (${supply?.nutritionalGuarantee?.crudeFat.value})`}
                        </Typography>
                      </Grid>

                      <Grid item xs={6} textAlign={"right"}>
                        <Typography
                          variant="subtitle1"
                          fontWeight={600}
                          fontSize={14}
                        >
                          {supply?.nutritionalGuarantee?.crudeFat.kg}
                        </Typography>
                      </Grid>

                      <Grid item xs={6}>
                        <Typography
                          variant="subtitle1"
                          fontWeight={500}
                          fontSize={14}
                        >
                          {`Crude Fiber (${supply?.nutritionalGuarantee?.metabolizableEnergy.value})`}
                        </Typography>
                      </Grid>

                      <Grid item xs={6} textAlign={"right"}>
                        <Typography
                          variant="subtitle1"
                          fontWeight={600}
                          fontSize={14}
                        >
                          {supply?.nutritionalGuarantee?.metabolizableEnergy.kg}
                        </Typography>
                      </Grid>

                      <Grid item xs={6}>
                        <Typography
                          variant="subtitle1"
                          fontWeight={500}
                          fontSize={14}
                        >
                          {`Crude Ash (${supply?.nutritionalGuarantee?.crudeAsh.value})`}
                        </Typography>
                      </Grid>

                      <Grid item xs={6} textAlign={"right"}>
                        <Typography
                          variant="subtitle1"
                          fontWeight={600}
                          fontSize={14}
                        >
                          {supply?.nutritionalGuarantee?.crudeAsh.kg}
                        </Typography>
                      </Grid>

                      <Grid item xs={6}>
                        <Typography
                          variant="subtitle1"
                          fontWeight={500}
                          fontSize={14}
                        >
                          {`Calcium (${supply?.nutritionalGuarantee?.calcium.value})`}
                        </Typography>
                      </Grid>

                      <Grid item xs={6} textAlign={"right"}>
                        <Typography
                          variant="subtitle1"
                          fontWeight={600}
                          fontSize={14}
                        >
                          {supply?.nutritionalGuarantee?.calcium.kg}
                        </Typography>
                      </Grid>

                      <Grid item xs={6}>
                        <Typography
                          variant="subtitle1"
                          fontWeight={500}
                          fontSize={14}
                        >
                          {`Phosphorous (${supply?.nutritionalGuarantee?.phosphorous.value})`}
                        </Typography>
                      </Grid>

                      <Grid item xs={6} textAlign={"right"}>
                        <Typography
                          variant="subtitle1"
                          fontWeight={600}
                          fontSize={14}
                        >
                          {supply?.nutritionalGuarantee?.phosphorous.kg}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>

                  <Divider
                    sx={{
                      borderColor: "#06a19bBC",
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
                      textAlign={"justify"}
                    >
                      {supply?.feedIngredients}
                    </Typography>
                  </Box>

                  <Divider
                    sx={{
                      borderColor: "#06a19bBC",
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
                      borderColor: "#06a19bBC",
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
                    textAlign={"center"}
                  >
                    Shelf Life: {supply?.shelfLife} months
                  </Typography>

                  <Divider
                    sx={{
                      borderColor: "#06a19bBC",
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
                    Specialized Aquatic Feeds(Pty) Ltd. Corner Church and Stil
                    St, Westcliff, Hermanus 7200, South Africa <br />
                    Tel: +27 28 313 8581 / info@safeeds.co.za
                  </Typography>
                </Box>
              </Grid>
            );
          })
        ) : (
          <>No data found</>
        )}
      </Grid>
      {/* </Box> */}

      <Box>
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
                background: "#fff",
                color: "#06A19B",
                fontWeight: 600,
                padding: "6px 16px",
                width: "fit-content",
                textTransform: "capitalize",
                borderRadius: "8px",
                border: "1px solid #06A19B",
              }}
              onClick={() => setActiveStep(1)}
            >
              Previous
            </Button>

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
              onClick={() => router.push("/dashboard/feedSupply")}
            >
              Save
            </Button>
          </Box>
        </Box>
      </Box>
    </Stack>
  );
};

export default FeedSelection;
