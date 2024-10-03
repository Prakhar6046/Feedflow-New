import { Farm } from "@/app/_typeModels/Farm";
import { farmAction } from "@/lib/features/farm/farmSlice";
import { useAppDispatch } from "@/lib/hooks";
import { Box, Button, Grid, Stack, TextField, Typography } from "@mui/material";
import { NextPage } from "next";
import { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import MapComponent from "./MapComponent";
interface Props {
  setActiveStep: (val: number) => void;
  editFarm?: any;
}

const FarmInformation: NextPage<Props> = ({ setActiveStep, editFarm }) => {
  const dispatch = useAppDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<Farm>();
  const [selectedSwtich, setSelectedSwtich] = useState<string>("address");
  const [addressInformation, setAddressInformation] = useState<any>();
  const [searchedAddress, setSearchedAddress] = useState<any>();
  const onSubmit: SubmitHandler<Farm> = (data) => {
    dispatch(farmAction.updateFarm(data));
    setActiveStep(2);
  };
  useEffect(() => {
    if (editFarm) {
      setValue("name", editFarm?.name);
      setValue("farmAltitude", editFarm?.farmAltitude);
      setValue("addressLine1", editFarm?.farmAddress?.addressLine1);
      setValue("addressLine2", editFarm?.farmAddress?.addressLine2 || "");
      setValue("city", editFarm?.farmAddress?.city);
      setValue("country", editFarm?.farmAddress?.country);
      setValue("zipCode", editFarm?.farmAddress?.zipCode);
      setValue("province", editFarm?.farmAddress?.province);
    }
  }, [editFarm]);
  useEffect(() => {
    if (addressInformation) {
      setValue("addressLine1", searchedAddress);
      setValue("city", addressInformation.city);
      setValue("country", addressInformation.country);
      setValue("zipCode", addressInformation.postcode);
      setValue("province", addressInformation.state);
    }
  }, [addressInformation]);
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
        Farm Information
      </Typography>

      <Box>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box mb={2} width={"100%"}>
            <TextField
              label="Farm Name"
              type="text"
              className="form-input"
              // focused
              {...register("name", {
                required: true,
              })}
              sx={{
                width: "100%",
              }}
            />
            {errors && errors.name && errors.name.type === "required" && (
              <Typography variant="body2" color="red" fontSize={13} mt={0.5}>
                This field is required.
              </Typography>
            )}
          </Box>

          <Box mb={2} width={"100%"}>
            <TextField
              label="Farm Altitude"
              type="text"
              className="form-input"
              // focused
              {...register("farmAltitude", {
                required: true,
              })}
              sx={{
                width: "100%",
              }}
            />
            {/* console.log(); */}

            {errors &&
              errors.farmAltitude &&
              errors.farmAltitude.type === "required" && (
                <Typography variant="body2" color="red" fontSize={13} mt={0.5}>
                  This field is required.
                </Typography>
              )}
          </Box>
          <Box
            display={"flex"}
            justifyContent={"end"}
            alignItems={"center"}
            gap={2}
            flexWrap={"wrap"}
            mt={1}
            mb={2}
          >
            {/* <MapComponent
              setAddressInformation={setAddressInformation}
              setSearchedAddress={setSearchedAddress}
            /> */}
          </Box>

          {selectedSwtich === "address" ? (
            <>
              <Box>
                <Typography
                  variant="h6"
                  gutterBottom
                  fontWeight={700}
                  sx={{
                    fontSize: 18,
                  }}
                >
                  Address
                </Typography>

                <Typography variant="body2" color="#555555">
                  You can do an address lookup to the right
                </Typography>
              </Box>

              <Grid container spacing={2} mt={0}>
                <Grid item md={6} xs={12}>
                  <Box>
                    <TextField
                      label="Address Line 1"
                      type="text"
                      className="form-input"
                      // focused
                      {...register("addressLine1", {
                        required: true,
                      })}
                      sx={{
                        width: "100%",
                      }}
                    />
                    {errors &&
                      errors.addressLine1 &&
                      errors.addressLine1.type === "required" && (
                        <Typography
                          variant="body2"
                          color="red"
                          fontSize={13}
                          mt={0.5}
                        >
                          This field is required.
                        </Typography>
                      )}
                  </Box>
                </Grid>

                <Grid item md={6} xs={12}>
                  <TextField
                    label="Address Line 2"
                    type="text"
                    className="form-input"
                    // focused
                    {...register("addressLine2")}
                    sx={{
                      width: "100%",
                    }}
                  />
                </Grid>

                <Grid item md={6} xs={12}>
                  <Box>
                    <TextField
                      label="City"
                      type="text"
                      className="form-input"
                      // focused
                      {...register("city", {
                        required: true,
                      })}
                      sx={{
                        width: "100%",
                      }}
                    />
                    {errors &&
                      errors.city &&
                      errors.city.type === "required" && (
                        <Typography
                          variant="body2"
                          color="red"
                          fontSize={13}
                          mt={0.5}
                        >
                          This field is required.
                        </Typography>
                      )}
                  </Box>
                </Grid>

                <Grid item md={6} xs={12}>
                  <Box>
                    <TextField
                      label="State/Province"
                      type="text"
                      className="form-input"
                      // focused
                      {...register("province", {
                        required: true,
                      })}
                      sx={{
                        width: "100%",
                      }}
                    />
                    {errors &&
                      errors.province &&
                      errors.province.type === "required" && (
                        <Typography
                          variant="body2"
                          color="red"
                          fontSize={13}
                          mt={0.5}
                        >
                          This field is required.
                        </Typography>
                      )}
                  </Box>
                </Grid>

                <Grid item md={6} xs={12}>
                  <Box>
                    <TextField
                      label="Zip Code"
                      type="text"
                      className="form-input"
                      // focused
                      {...register("zipCode", {
                        required: true,
                      })}
                      sx={{
                        width: "100%",
                      }}
                    />
                    {errors &&
                      errors.zipCode &&
                      errors.zipCode.type === "required" && (
                        <Typography
                          variant="body2"
                          color="red"
                          fontSize={13}
                          mt={0.5}
                        >
                          This field is required.
                        </Typography>
                      )}
                  </Box>
                </Grid>

                <Grid item md={6} xs={12}>
                  <Box></Box>

                  <Box>
                    <TextField
                      label="Country"
                      type="text"
                      className="form-input"
                      // focused
                      {...register("country", {
                        required: true,
                      })}
                      sx={{
                        width: "100%",
                      }}
                    />
                    {errors &&
                      errors.country &&
                      errors.country.type === "required" && (
                        <Typography
                          variant="body2"
                          color="red"
                          fontSize={13}
                          mt={0.5}
                        >
                          This field is required.
                        </Typography>
                      )}
                  </Box>
                </Grid>
              </Grid>
            </>
          ) : (
            <>Coordinates</>
          )}

          <Box
            display={"flex"}
            justifyContent={"flex-end"}
            alignItems={"center"}
            gap={3}
            mt={1}
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
              onClick={() => setActiveStep(0)}
            >
              Previous
            </Button>
            <Button
              type="submit"
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
        </form>
      </Box>
    </Stack>
  );
};

export default FarmInformation;
