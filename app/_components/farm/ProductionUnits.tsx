import * as validationPattern from "@/app/_lib/utils/validationPatterns/index";
import * as validationMessage from "@/app/_lib/utils/validationsMessage/index";
import {
  CalculateType,
  ProductionUnitsFormTypes,
  UnitsTypes,
} from "@/app/_typeModels/Farm";
import {
  farmAction,
  selectFarm,
  selectIsEditFarm,
} from "@/lib/features/farm/farmSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import { NextPage } from "next";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  Controller,
  SubmitHandler,
  useFieldArray,
  useForm,
} from "react-hook-form";
import toast from "react-hot-toast";
import { v4 as uuidv4 } from "uuid";
import CalculateVolume from "../models/CalculateVolume";
import { deleteCookie, getCookie } from "cookies-next";
import { px } from "framer-motion";
import { getLocalItem, removeLocalItem, setLocalItem } from "@/app/_lib/utils";
interface Props {
  editFarm?: any;
  setActiveStep: (val: number) => void;
}

const unitsTypes = [
  { name: "Rectangular Tank", formula: "L×W×D" },
  { name: "Earthen Pond", formula: "A×D" },
  { name: "Raceway", formula: "L×W×D" },
  { name: "Cage", formula: "L×W×H" },
  { name: "Hapa", formula: "L×W×H" },
  { name: "Circular Tank", formula: "π×r2×D" },
  { name: "D-end Tank", formula: "(2π×r2+(L−r)×W)×D" },
];

const ProductionUnits: NextPage<Props> = ({ setActiveStep, editFarm }) => {
  uuidv4();
  const router = useRouter();

  const userData: any = getCookie("logged-user");
  const dispatch = useAppDispatch();
  const farm = useAppSelector(selectFarm);
  const isEditFarm = useAppSelector(selectIsEditFarm);
  const [selectedUnit, setSelectedUnit] = React.useState<UnitsTypes>();
  const [length, setLength] = useState<string>();
  const [width, setWidth] = useState<string>();
  const [depth, setDepth] = useState<string>();
  const [radius, setRadius] = useState<string>();
  const [area, setArea] = useState<string>();
  const [heigth, setHeigth] = useState<string>();
  const [open, setopen] = useState<boolean>(false);
  const [calculatedValue, setCalculatedValue] = useState<CalculateType>();
  const [isApiCallInProgress, setIsApiCallInProgress] =
    useState<boolean>(false);
  const [formProductionUnitsData, setFormProductionUnitsData] = useState<any>();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProductionUnitsFormTypes>({
    mode: "onChange",
    defaultValues: {
      productionUnits: [
        {
          name: "",
          type: "",
          capacity: "",
          waterflowRate: "",
          id: uuidv4(),
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "productionUnits",
  });
  const productionUnits = watch("productionUnits");
  const AddProdunctionUnit = () => {
    const productionUnits = watch("productionUnits");
    if (productionUnits) {
      const lastProductionUnit = productionUnits[productionUnits.length - 1];
      if (
        lastProductionUnit &&
        lastProductionUnit.name &&
        lastProductionUnit.type &&
        lastProductionUnit.capacity &&
        lastProductionUnit.waterflowRate
      ) {
        append({
          name: "",
          capacity: "",
          type: "",
          waterflowRate: "",
          id: uuidv4(),
        });
      } else {
        toast.dismiss();
        toast.error("Please fill previous field.");
      }
    }
  };

  const handleCalculate = (item: any, index: any) => {
    if (item) {
      setopen(true);
      setRadius("");
      setArea("");
      setDepth("");
      setHeigth("");
      setLength("");
      setWidth("");
      const getFormula = unitsTypes.find(
        (unit) => unit.name === watch(`productionUnits.${index}.type`)
      );
      setSelectedUnit({
        name: getFormula?.name,
        formula: getFormula?.formula,
        id: productionUnits[index].id,
      });
      setCalculatedValue({ output: 0, id: null });
    }
  };

  const onSubmit: SubmitHandler<ProductionUnitsFormTypes> = async (data) => {
    // Prevent API call if one is already in progress
    if (isApiCallInProgress) return;
    setIsApiCallInProgress(true);

    try {
      const loggedUserData = JSON.parse(userData);

      let payload;
      if (isEditFarm && editFarm?.farmAddress?.id) {
        payload = {
          farmAddress: {
            addressLine1: farm.addressLine1,
            addressLine2: farm.addressLine2,
            city: farm.city,
            province: farm.province,
            zipCode: farm.zipCode,
            country: farm.country,
            id: editFarm.farmAddress?.id,
          },
          productionUnits: data.productionUnits,
          name: farm.name,
          farmAltitude: farm.farmAltitude,
          fishFarmer: farm.fishFarmer,
          lat: farm.lat,
          lng: farm.lng,
          id: editFarm?.id,
          organsationId: loggedUserData.organisationId,
          productions: editFarm.production,
          mangerId: farm.mangerId ? farm.mangerId : null,
          userId: loggedUserData.id,
        };
      } else {
        payload = {
          farmAddress: {
            addressLine1: farm.addressLine1,
            addressLine2: farm.addressLine2,
            city: farm.city,
            province: farm.province,
            zipCode: farm.zipCode,
            country: farm.country,
          },
          productionUnits: data.productionUnits,
          name: farm.name,
          farmAltitude: farm.farmAltitude,
          lat: farm.lat,
          lng: farm.lng,
          fishFarmer: farm.fishFarmer,
          organsationId: loggedUserData.organisationId,
          mangerId: farm.mangerId ? farm.mangerId : null,
          userId: loggedUserData.id,
        };
      }
      if (Object.keys(payload).length && payload.name) {
        const response = await fetch(
          `${isEditFarm ? "/api/farm/edit-farm" : "/api/farm/add-farm"}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          }
        );
        const responseData = await response.json();
        toast.success(responseData.message);

        if (responseData.status) {
          router.push("/dashboard/farm");
          removeLocalItem("farmData");
          removeLocalItem("farmProductionUnits");
        }
      } else {
        toast.error("Please fill out the all feilds");
      }
      dispatch(farmAction.resetState());
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsApiCallInProgress(false);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const formData = getLocalItem("farmProductionUnits");
      setFormProductionUnitsData(formData);
    }
  }, []);
  useEffect(() => {
    if (calculatedValue?.id && calculatedValue.output) {
      const updatedFields = productionUnits.map((field) => {
        if (field.id === calculatedValue.id) {
          return { ...field, capacity: String(calculatedValue.output) };
        } else {
          return field;
        }
      });
      setValue("productionUnits", updatedFields);
    }
  }, [calculatedValue]);

  useEffect(() => {
    if (editFarm && !formProductionUnitsData) {
      setValue("productionUnits", editFarm?.productionUnits);
    } else if (formProductionUnitsData) {
      setValue("productionUnits", formProductionUnitsData);
    }
  }, [formProductionUnitsData]);

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
        Production Units
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box>
          {fields.map((item, index) => {
            return (
              <TableContainer
                key={item.id}
                component={Paper}
                sx={{
                  boxShadow: "none !important",
                }}
              >
                <Table sx={{ minWidth: "100%" }} aria-label="simple table">
                  <TableBody>
                    {/* {rows.map((row, i) => ( */}
                    <TableRow
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                        display: "flex",
                        gap: "32px",
                      }}
                    >
                      <TableCell
                        sx={{
                          border: 0,
                          pl: 0,
                          pr: 1,
                        }}
                      >
                        <Controller
                          name={`productionUnits.${index}.name`} // Dynamic field name
                          control={control}
                          defaultValue="" // Set default value if necessary
                          render={({ field }) => (
                            <TextField
                              {...field} // Spread field props
                              label="Production Unit Name *"
                              type="text"
                              focused
                              className="form-input"
                              sx={{
                                width: "100%",
                                minWidth: 150,
                              }}
                            />
                          )}
                          rules={{
                            required: true,
                          }} // Add validation
                        />
                        {errors &&
                          errors.productionUnits &&
                          errors.productionUnits[index]?.name && (
                            <Typography
                              variant="body2"
                              color="red"
                              fontSize={13}
                              mt={0.5}
                            >
                              {validationMessage.required}
                            </Typography>
                          )}
                        {/* <TextField
                          label="Production Unit Name"
                          type="text"
                          className="form-input"
                          {...register(
                            `productionUnits.${index}.name` as const
                          )}
                          sx={{
                            width: "100%",
                            minWidth: 150,
                          }}
                        /> */}
                      </TableCell>

                      <TableCell
                        sx={{
                          border: 0,
                          pl: 0,
                          pr: 1,
                        }}
                      >
                        <FormControl
                          className="form-input prod-unit"
                          fullWidth
                          focused
                        >
                          <InputLabel id="demo-simple-select-label">
                            Production Unit Type *
                          </InputLabel>
                          <Controller
                            name={`productionUnits.${index}.type`} // Dynamic name for production unit type
                            control={control}
                            defaultValue={fields[index]?.type || ""} // Default value, fall back to empty string
                            render={({ field }) => (
                              <Select
                                labelId={`demo-simple-select-label-${index}`}
                                id={`demo-simple-select-${index}`}
                                label="Production Unit Type *"
                                {...field} // Spread the field props for value and onChange
                                sx={{
                                  minWidth: "200px",
                                }}
                                // sx={{
                                //   px: {
                                //     xl: 10,
                                //     md: 5,
                                //     xs: 3,
                                //   },
                                // }}
                              >
                                {unitsTypes.map((unit, i) => (
                                  <MenuItem value={unit.name} key={i}>
                                    {unit.name}
                                  </MenuItem>
                                ))}
                              </Select>
                            )}
                            rules={{
                              required: true,
                            }} // Validation rule
                          />
                          {errors &&
                            errors.productionUnits &&
                            errors.productionUnits[index]?.type && (
                              <Typography
                                variant="body2"
                                color="red"
                                fontSize={13}
                                mt={0.5}
                              >
                                {validationMessage.required}
                              </Typography>
                            )}
                          {/* <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={fields[index]?.type || ""}
                            {...register(
                              `productionUnits.${index}.type` as const,
                              { onChange: (e) => handleChange(e, item) }
                            )}
                            label="Production Unit Type"
                            sx={{
                              px: {
                                xl: 10,
                                md: 5,
                                xs: 3,
                              },
                            }}
                          >
                            {unitsTypes.map((unit, i) => {
                              return (
                                <MenuItem value={unit.name} key={i}>
                                  {unit.name}
                                </MenuItem>
                              );
                            })}
                          </Select> */}
                        </FormControl>
                      </TableCell>

                      <TableCell
                        sx={{
                          border: 0,
                          pl: 0,
                          pr: 0,
                        }}
                      >
                        <Box display={"flex"} gap={2} alignItems={"center"}>
                          <Box position={"relative"}>
                            <Controller
                              name={`productionUnits.${index}.capacity`} // Dynamic field name
                              control={control}
                              defaultValue="" // Set default value if necessary
                              render={({ field }) => (
                                <TextField
                                  {...field} // Spread field props
                                  label="Capacity *"
                                  type="text"
                                  focused
                                  className="form-input capacity-input"
                                  sx={{
                                    width: "100%",
                                    minWidth: 150,
                                  }}
                                />
                              )}
                              rules={{
                                required: true,
                                pattern: validationPattern.numbersWithDot,
                              }} // Add validation
                            />
                            {/* <TextField
                              label="Capacity *"
                              type="text"
                              className="form-input capacity-input"
                              {...register(
                                `productionUnits.${index}.capacity` as const,
                                {
                                  required: true,
                                  pattern: validationPattern.numbersWithDot,
                                }
                              )}
                            /> */}

                            <Typography
                              variant="body1"
                              color="#555555AC"
                              sx={{
                                position: "absolute",
                                right: 13,
                                top: "30%",
                                backgroundColor: "white",
                                paddingInline: "5px",
                              }}
                            >
                              L
                            </Typography>
                          </Box>

                          <Button
                            type="button"
                            variant="contained"
                            sx={{
                              background: "#06a19b",
                              color: "#fff",
                              fontWeight: 600,
                              padding: "6px 16px",
                              width: "fit-content",
                              textTransform: "capitalize",
                              borderRadius: "8px",
                              border: "1px solid #06A19B",
                              minWidth: 90,
                            }}
                            disabled={
                              productionUnits[index].type ? false : true
                            }
                            onClick={() => handleCalculate(item, index)}
                          >
                            Calculate
                          </Button>
                        </Box>
                        {errors &&
                          errors.productionUnits &&
                          errors.productionUnits[index]?.capacity &&
                          errors.productionUnits[index]?.capacity.type ===
                            "required" && (
                            <Typography
                              variant="body2"
                              color="red"
                              fontSize={13}
                              mt={0.5}
                            >
                              {validationMessage.required}
                            </Typography>
                          )}
                        {errors &&
                          errors.productionUnits &&
                          errors.productionUnits[index]?.capacity &&
                          errors.productionUnits[index]?.capacity.type ===
                            "pattern" && (
                            <Typography
                              variant="body2"
                              color="red"
                              fontSize={13}
                              mt={0.5}
                              width="50%"
                              maxWidth={"230px"}
                            >
                              {validationMessage.OnlyNumbersWithDot}
                            </Typography>
                          )}
                      </TableCell>
                      <TableCell
                        sx={{
                          border: 0,
                          pl: 0,
                          pr: 1,
                        }}
                      >
                        <Box display={"flex"} gap={2} alignItems={"center"}>
                          <Box position={"relative"}>
                            <Controller
                              name={`productionUnits.${index}.waterflowRate`} // Dynamic field name
                              control={control}
                              defaultValue="" // Set default value if necessary
                              render={({ field }) => (
                                <TextField
                                  {...field} // Spread field props
                                  label="Waterflow Rate *"
                                  type="text"
                                  focused
                                  className="form-input"
                                />
                              )}
                              rules={{
                                required: true,
                                pattern: validationPattern.onlyNumbersPattern,
                              }} // Add validation
                            />
                            {/* <TextField
                              label="Waterflow Rate *"
                              type="text"
                              className="form-input"
                              {...register(
                                `productionUnits.${index}.waterflowRate` as const,
                                {
                                  required: true,
                                  pattern: validationPattern.onlyNumbersPattern,
                                }
                              )}
                              focused
                            /> */}
                            <Typography
                              variant="body1"
                              color="#555555AC"
                              sx={{
                                position: "absolute",
                                right: 13,
                                top: "30%",
                                backgroundColor: "white",
                                paddingInline: "5px",
                              }}
                            >
                              L/H
                            </Typography>
                          </Box>
                        </Box>

                        {errors &&
                          errors.productionUnits &&
                          errors.productionUnits[index]?.waterflowRate?.type ===
                            "required" && (
                            <Typography
                              variant="body2"
                              color="red"
                              fontSize={13}
                              mt={0.5}
                            >
                              {validationMessage.required}
                            </Typography>
                          )}
                        {errors &&
                          errors.productionUnits &&
                          errors.productionUnits[index]?.waterflowRate?.type ===
                            "pattern" && (
                            <Typography
                              variant="body2"
                              color="red"
                              fontSize={13}
                              mt={0.5}
                            >
                              {validationMessage.onlyNumbers}
                            </Typography>
                          )}
                      </TableCell>
                      {index === 0 && (
                        <TableCell
                          sx={{
                            border: 0,
                            pl: 0,
                            pr: 1,
                            position: "relative",
                            visibility: "hidden",
                          }}
                        >
                          <Box
                            sx={{
                              cursor: "pointer",
                              width: "fit-content",
                              px: 1,
                              mt: "16px",
                              // transform: "translateY(-10px)"
                            }}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="1.4em"
                              height="1.4em"
                              viewBox="0 0 24 24"
                            >
                              <g fill="none">
                                <path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z" />
                                <path
                                  fill="#ff0000"
                                  d="M14.28 2a2 2 0 0 1 1.897 1.368L16.72 5H20a1 1 0 1 1 0 2l-.003.071l-.867 12.143A3 3 0 0 1 16.138 22H7.862a3 3 0 0 1-2.992-2.786L4.003 7.07L4 7a1 1 0 0 1 0-2h3.28l.543-1.632A2 2 0 0 1 9.721 2zm3.717 5H6.003l.862 12.071a1 1 0 0 0 .997.929h8.276a1 1 0 0 0 .997-.929zM10 10a1 1 0 0 1 .993.883L11 11v5a1 1 0 0 1-1.993.117L9 16v-5a1 1 0 0 1 1-1m4 0a1 1 0 0 1 1 1v5a1 1 0 1 1-2 0v-5a1 1 0 0 1 1-1m.28-6H9.72l-.333 1h5.226z"
                                />
                              </g>
                            </svg>
                          </Box>
                        </TableCell>
                      )}
                      {index !== 0 && (
                        <TableCell
                          sx={{
                            border: 0,
                            pl: 0,
                            pr: 1,
                            position: "relative",
                          }}
                          onClick={() => remove(index)}
                        >
                          <Box
                            sx={{
                              cursor: "pointer",
                              width: "fit-content",
                              px: 1,
                              mt: "16px",
                            }}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="1.4em"
                              height="1.4em"
                              viewBox="0 0 24 24"
                            >
                              <g fill="none">
                                <path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z" />
                                <path
                                  fill="#ff0000"
                                  d="M14.28 2a2 2 0 0 1 1.897 1.368L16.72 5H20a1 1 0 1 1 0 2l-.003.071l-.867 12.143A3 3 0 0 1 16.138 22H7.862a3 3 0 0 1-2.992-2.786L4.003 7.07L4 7a1 1 0 0 1 0-2h3.28l.543-1.632A2 2 0 0 1 9.721 2zm3.717 5H6.003l.862 12.071a1 1 0 0 0 .997.929h8.276a1 1 0 0 0 .997-.929zM10 10a1 1 0 0 1 .993.883L11 11v5a1 1 0 0 1-1.993.117L9 16v-5a1 1 0 0 1 1-1m4 0a1 1 0 0 1 1 1v5a1 1 0 1 1-2 0v-5a1 1 0 0 1 1-1m.28-6H9.72l-.333 1h5.226z"
                                />
                              </g>
                            </svg>
                          </Box>
                        </TableCell>
                      )}
                    </TableRow>
                    {/* ))} */}
                  </TableBody>
                </Table>
              </TableContainer>
            );
          })}

          <Box
            display={"flex"}
            alignItems={"center"}
            mt={1}
            gap={2}
            flexWrap={"wrap"}
            justifyContent={"space-between"}
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
              onClick={() => AddProdunctionUnit()}
            >
              Add A Production Unit
            </Button>

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
                // onClick={() => setCookie("activeStep", 1)}
                onClick={() => {
                  setActiveStep(1),
                    setLocalItem(
                      "farmProductionUnits",
                      watch("productionUnits")
                    );
                }}
              >
                Previous
              </Button>

              <Button
                type="submit"
                variant="contained"
                disabled={isApiCallInProgress}
                sx={{
                  background: "#06A19B",
                  fontWeight: 600,
                  padding: "6px 16px",
                  width: "fit-content",
                  textTransform: "capitalize",
                  borderRadius: "8px",
                }}
              >
                Save
              </Button>
            </Box>
          </Box>
        </Box>
      </form>
      <CalculateVolume
        open={open}
        setOpen={setopen}
        selectedUnit={selectedUnit}
        setCalculatedValue={setCalculatedValue}
        area={area}
        setArea={setArea}
        depth={depth}
        setDepth={setDepth}
        heigth={heigth}
        setHeigth={setHeigth}
        length={length}
        setLength={setLength}
        radius={radius}
        setRadius={setRadius}
        width={width}
        setWidth={setWidth}
        calculatedValue={calculatedValue}
      />
    </Stack>
  );
};

export default ProductionUnits;
