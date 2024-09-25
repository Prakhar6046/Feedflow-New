import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { NextPage } from "next";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import React, { useState } from "react";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import CalculateVolume from "../models/CalculateVolume";

interface Props {
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
interface FormTypes {
  productionUnits: {
    name: string;
    type: string;
    capacity: string;
    waterflowRate: string;
  }[];
}
const ProductionUnits: NextPage<Props> = ({ setActiveStep }) => {
  const [selectedUnit, setSelectedUnit] = React.useState<{
    name: string;
    formula: string;
  }>();
  const [length, setLength] = useState<number>();
  const [width, setWidth] = useState<number>();
  const [depth, setDepth] = useState<number>();
  const [radius, setRadius] = useState<number>();
  const [area, setArea] = useState<number>();
  const [heigth, setHeigth] = useState<number>();
  const [open, setopen] = useState<boolean>(false);
  const [calculatedValue, setCalculatedValue] = useState<number>();
  const { register, handleSubmit, control, setValue, trigger } =
    useForm<FormTypes>({
      defaultValues: {
        productionUnits: [
          { name: "", type: "", capacity: "", waterflowRate: "" },
        ],
      },
    });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "productionUnits",
  });
  const handleChange = (event: SelectChangeEvent, item: any) => {
    const updatedFields = fields.map((field) => {
      if (field.id === item.id) {
        // Update only the type field and retain other values
        return { ...field, type: event.target.value };
      }
      return field;
    });

    // Update the form state
    setValue("productionUnits", updatedFields);

    // Trigger form validation and re-rendering
    // trigger("productionUnits");
  };
  const handleCalculate = (item: any) => {
    if (item.type) {
      setopen(true);
      setRadius(0);
      setArea(0);
      setDepth(0);
      setHeigth(0);
      setLength(0);
      setWidth(0);
      const getFormula = unitsTypes.find((unit) => unit.name === item.type);
      setSelectedUnit(getFormula);
      setCalculatedValue(0);
    }
  };
  const onSubmit: SubmitHandler<FormTypes> = (data) => {
    console.log(data);
    setActiveStep(3);
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
                      }}
                    >
                      <TableCell
                        sx={{
                          border: 0,
                          pl: 0,
                          pr: 1,
                        }}
                      >
                        <TextField
                          label="Production Unit Name"
                          type="text"
                          className="form-input"
                          // focused
                          {...register(
                            `productionUnits.${index}.name` as const
                          )}
                          sx={{
                            width: "100%",
                            minWidth: 150,
                          }}
                        />
                      </TableCell>
                      <TableCell
                        sx={{
                          border: 0,
                          pl: 0,
                          pr: 1,
                        }}
                      >
                        <FormControl className="form-input" fullWidth>
                          <InputLabel id="demo-simple-select-label">
                            Production Unit Type
                          </InputLabel>
                          <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={fields[index]?.type || ""}
                            {...register(
                              `productionUnits.${index}.type` as const
                            )}
                            label="Production Unit Type"
                            onChange={(e) => handleChange(e, item)}
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
                          </Select>
                        </FormControl>
                      </TableCell>
                      <TableCell
                        sx={{
                          border: 0,
                          pl: 0,
                          pr: 1,
                        }}
                      >
                        <Box display={"flex"} gap={2} alignItems={"center"}>
                          <TextField
                            label="Capacity"
                            type="text"
                            className="form-input"
                            // focused
                            {...register(
                              `productionUnits.${index}.capacity` as const
                            )}
                            sx={{
                              width: "100%",
                              minWidth: 150,
                            }}
                          />

                          <Typography variant="body1" color="#555555">
                            L
                          </Typography>

                          <Button
                            type="submit"
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
                            onClick={() => handleCalculate(item)}
                          >
                            Calculate
                          </Button>
                        </Box>
                      </TableCell>
                      <TableCell
                        sx={{
                          border: 0,
                          pl: 0,
                          pr: 1,
                        }}
                      >
                        <Box display={"flex"} gap={2} alignItems={"center"}>
                          <TextField
                            label="Waterflow Rate"
                            type="text"
                            className="form-input"
                            // focused
                            {...register(
                              `productionUnits.${index}.waterflowRate` as const
                            )}
                            sx={{
                              width: "100%",
                              minWidth: 150,
                            }}
                          />

                          <Typography variant="body1" color="#555555">
                            L/H
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell
                        sx={{
                          border: 0,
                          pl: 0,
                          pr: 1,
                        }}
                        onClick={() => remove(index)}
                      >
                        <Box
                          sx={{
                            cursor: "pointer",
                            width: "fit-content",
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
              onClick={() =>
                append({ name: "", capacity: "", type: "", waterflowRate: "" })
              }
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
                onClick={() => setActiveStep(1)}
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
