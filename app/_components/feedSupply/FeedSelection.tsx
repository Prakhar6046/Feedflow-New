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

interface Props {
  setActiveStep: (val: number) => void;
  editFarm?: any;
}

const FeedSelection: NextPage<Props> = ({ setActiveStep, editFarm }) => {
  const router = useRouter();
  const [feedSupply, setFeedSupply] = useState<any>();
  const getFeedSupplys = async () => {
    const response = await fetch("/api/feed");
    return response.json();
  };
  useEffect(() => {
    const getFeedSupplyer = async () => {
      const res = await getFeedSupplys();
      console.log(res);
    };
    getFeedSupplyer();
  }, []);
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

      <Grid container spacing={2}>
        <Grid item xs="auto">
          <Box
            border={"1px solid #555555AC"}
            borderRadius={3}
            p={2}
            sx={{
              width: "ft-content",
              maxWidth: "370px",
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
                  SAF Tiplapia PreStarter
                </Typography>

                <Typography
                  color="#000"
                  variant="subtitle2"
                  fontWeight={500}
                  fontSize={11}
                >
                  Product code [SAF-TG-4208-1mm-C]
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
                  1
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
                [Complete & Balanced] Feed for [Tilapia] production. <br />
                Suitable for use as [Primary Food Source] in [Intensive
                Production Systems].
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
                          Hatchery
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
                          Fry
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
                          PreStarter
                        </ListItem>
                      </List>
                    </Box>
                  </Box>
                </Box>

                <Box display={"grid"} alignItems={"stretch"}>
                  <Box display={"flex"} flexDirection={"column"} gap={0.5}>
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
                    Moisture (Max)
                  </Typography>
                </Grid>

                <Grid item xs={6} textAlign={"right"}>
                  <Typography
                    variant="subtitle1"
                    fontWeight={600}
                    fontSize={14}
                  >
                    100
                  </Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography
                    variant="subtitle1"
                    fontWeight={500}
                    fontSize={14}
                  >
                    Crude Protein
                  </Typography>
                </Grid>

                <Grid item xs={6} textAlign={"right"}>
                  <Typography
                    variant="subtitle1"
                    fontWeight={600}
                    fontSize={14}
                  >
                    420
                  </Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography
                    variant="subtitle1"
                    fontWeight={500}
                    fontSize={14}
                  >
                    Crude Fat (Min)
                  </Typography>
                </Grid>

                <Grid item xs={6} textAlign={"right"}>
                  <Typography
                    variant="subtitle1"
                    fontWeight={600}
                    fontSize={14}
                  >
                    80
                  </Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography
                    variant="subtitle1"
                    fontWeight={500}
                    fontSize={14}
                  >
                    Crude Fiber (Max)
                  </Typography>
                </Grid>

                <Grid item xs={6} textAlign={"right"}>
                  <Typography
                    variant="subtitle1"
                    fontWeight={600}
                    fontSize={14}
                  >
                    50
                  </Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography
                    variant="subtitle1"
                    fontWeight={500}
                    fontSize={14}
                  >
                    Crude Ash (Max)
                  </Typography>
                </Grid>

                <Grid item xs={6} textAlign={"right"}>
                  <Typography
                    variant="subtitle1"
                    fontWeight={600}
                    fontSize={14}
                  >
                    50
                  </Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography
                    variant="subtitle1"
                    fontWeight={500}
                    fontSize={14}
                  >
                    Calcium (Min)
                  </Typography>
                </Grid>

                <Grid item xs={6} textAlign={"right"}>
                  <Typography
                    variant="subtitle1"
                    fontWeight={600}
                    fontSize={14}
                  >
                    510
                  </Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography
                    variant="subtitle1"
                    fontWeight={500}
                    fontSize={14}
                  >
                    Phosphorous (Min)
                  </Typography>
                </Grid>

                <Grid item xs={6} textAlign={"right"}>
                  <Typography
                    variant="subtitle1"
                    fontWeight={600}
                    fontSize={14}
                  >
                    19
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
                [Yellow Maize, Soyabean Meal, Fish Meal, Wheat Bran, Soyabean
                Oil, Monocalcium Phosphate, Limestone, Vitamins & Minerals]
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
                Feed according to the Feedflow guide or as directed by a fish
                nutritionist
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
              Shelf Life: 12 months
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
              Specialized Aquatic Feeds(Pty) Ltd. Corner Church and Stil St,
              Westcliff, Hermanus 7200, South Africa <br />
              Tel: +27 28 313 8581 / info@safeeds.co.za
            </Typography>
          </Box>
        </Grid>
      </Grid>
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
