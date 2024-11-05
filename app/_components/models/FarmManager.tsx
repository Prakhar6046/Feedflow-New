import {
  Box,
  Button,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  Modal,
  Stack,
  TableCell,
  TextField,
  Typography,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material"; // Use Material-UI's Close icon directly
import * as validationPattern from "@/app/_lib/utils/validationPatterns/index";
import * as validationMessage from "@/app/_lib/utils/validationsMessage/index";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { Production } from "@/app/_typeModels/production";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import React, { forwardRef, useContext, useEffect, useState } from "react";
import { Farm } from "@/app/_typeModels/Farm";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { productionMangeFields } from "@/app/_lib/utils";
const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
};

interface Props {
  setOpen: (open: boolean) => void;
  open: boolean;
  selectedProduction: Production;
  farms: Farm[];
}
interface InputTypes {
  manager: {
    id: Number;
    fishFarm: String;
    productionUnit: String;
    biomass: String;
    count: String;
    meanWeight: String;
    meanLength: String;
    field?: String;
    stockingDensityNM?: String;
    stockingLevel?: String;
    stockingDensityKG?: String;
    batchNumber: String;
  }[];
}
const TransferModal: React.FC<Props> = ({
  setOpen,
  open,
  selectedProduction,
  farms,
}) => {
  const [selectedFarm, setSelectedFarm] = useState<any>(null);
  const {
    register,
    setValue,
    formState: { errors },
    watch,
    getValues,
    handleSubmit,
    control,
    setFocus,
    getFieldState,
  } = useForm<InputTypes>({
    defaultValues: {
      manager: [
        {
          id: 0,
          fishFarm: "",
          productionUnit: "",
          biomass: "",
          count: "",
          meanWeight: "",
          meanLength: "",
          stockingDensityNM: "",
          stockingLevel: "",
          stockingDensityKG: "",
          field: "",
          batchNumber: "",
        },
      ],
    },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "manager",
  });
  const onSubmit: SubmitHandler<InputTypes> = (data) => {
    console.log(data.manager);
  };
  console.log(errors);

  const handleClose = () => setOpen(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const openAnchor = Boolean(anchorEl);
  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseAnchor = (field: string) => {
    if (field.length) {
      append({
        id: 0,
        fishFarm: selectedProduction.fishFarmId,
        productionUnit: selectedProduction.productionUnitId,
        biomass: "",
        count: "",
        meanWeight: "",
        meanLength: "",
        stockingDensityNM: "",
        stockingLevel: "",
        stockingDensityKG: "",
        field,
        batchNumber: selectedProduction.batchNumber,
      });
      setAnchorEl(null);
    } else {
      setAnchorEl(null);
    }
  };
  useEffect(() => {
    if (selectedProduction) {
      const data = [
        {
          id: selectedProduction.id,
          fishFarm: selectedProduction.fishFarmId,
          productionUnit: selectedProduction.productionUnitId,
          biomass: selectedProduction.biomass,
          count: selectedProduction.fishCount,
          meanWeight: selectedProduction.meanWeight,
          meanLength: selectedProduction.meanLength,
          stockingDensityNM: selectedProduction.stockingDensityNM,
          stockingLevel: selectedProduction.stockingLevel,
          stockingDensityKG: selectedProduction.stockingDensityKG,
          batchNumber: selectedProduction.batchNumber,
        },
      ];
      setValue("manager", data);
      setSelectedFarm(selectedProduction.fishFarmId); // Set the selected farm when manager is selected
    }
  }, [selectedProduction, setValue]);
  useEffect(() => {
    if (fields) {
      console.log(fields);
    }
  }, [fields]);
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Stack sx={style}>
        {/* Header with close icon */}
        <Box display="flex" justifyContent="flex-end" padding={2}>
          <IconButton
            onClick={handleClose}
            sx={{
              color: "inherit",
              background: "transparent",
              margin: "2",
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
        <form onSubmit={handleSubmit(onSubmit)}>
          {fields.map((item, idx) => {
            return (
              <Box
                padding={3}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 3,
                }}
                key={item.id}
              >
                <Grid container spacing={2}>
                  <Grid item xs>
                    <FormControl fullWidth className="form-input">
                      <InputLabel id="">Fish Farm *</InputLabel>
                      <Select
                        labelId="feed-supply-select-label9"
                        className="fish-manager"
                        id="feed-supply-select9"
                        label="Fish Farm*"
                        disabled={
                          item.field === "Harvest" ||
                          item.field === "Mortalities" ||
                          idx === 0
                            ? true
                            : false
                        }
                        {...register(`manager.${idx}.fishFarm`, {
                          required: watch(`manager.${idx}.fishFarm`)
                            ? false
                            : true,
                        })}
                        onChange={(e) => {
                          const selectedFishFarm = e.target.value;
                          setSelectedFarm(selectedFishFarm); // Set selected farm for this specific entry
                          setValue(`manager.${idx}.fishFarm`, selectedFishFarm); // Set the value for this fishFarm
                          setValue(`manager.${idx}.productionUnit`, ""); // Reset production unit for the current entry
                        }}
                        value={getValues(`manager.${idx}.fishFarm`) || ""} // Ensure only the current entry is updated
                      >
                        {farms?.map((farm: Farm, i) => (
                          <MenuItem value={String(farm.id)} key={i}>
                            {farm.name}
                          </MenuItem>
                        ))}
                      </Select>

                      {errors &&
                        errors?.manager &&
                        errors?.manager[idx] &&
                        errors?.manager[idx].fishFarm &&
                        errors?.manager[idx].fishFarm.type === "required" && (
                          <Typography
                            variant="body2"
                            color="red"
                            fontSize={13}
                            mt={0.5}
                          >
                            {validationMessage.required}
                          </Typography>
                        )}
                      <Typography
                        variant="body2"
                        color="red"
                        fontSize={13}
                        mt={0.5}
                      ></Typography>
                    </FormControl>
                  </Grid>
                  <Grid item xs>
                    <FormControl fullWidth className="form-input">
                      <InputLabel id="">Production Unit *</InputLabel>
                      <Select
                        labelId="production-unit-select-label"
                        id="production-unit-select"
                        label="Production Unit*"
                        disabled={
                          item.field === "Harvest" ||
                          item.field === "Mortalities" ||
                          idx === 0
                            ? true
                            : false
                        }
                        {...register(`manager.${idx}.productionUnit`, {
                          required: watch(`manager.${idx}.productionUnit`)
                            ? false
                            : true,
                        })}
                        value={watch(`manager.${idx}.productionUnit`) || ""}
                      >
                        {(() => {
                          const selectedFarm = farms.find(
                            (farm) =>
                              farm.id === watch(`manager.${idx}.fishFarm`)
                          );

                          return selectedFarm ? (
                            selectedFarm?.productionUnits?.map((unit) => (
                              <MenuItem value={String(unit.id)} key={unit.id}>
                                {unit.name}
                              </MenuItem>
                            ))
                          ) : (
                            <MenuItem value="" disabled>
                              No units available
                            </MenuItem>
                          );
                        })()}
                      </Select>
                      {errors &&
                        errors?.manager &&
                        errors?.manager[idx] &&
                        errors?.manager[idx].productionUnit &&
                        errors?.manager[idx].productionUnit.type ===
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
                      <Typography
                        variant="body2"
                        color="red"
                        fontSize={13}
                        mt={0.5}
                      ></Typography>
                    </FormControl>
                  </Grid>
                  <Grid item xs>
                    <TextField
                      label="Batch Number *"
                      type="text"
                      className="form-input"
                      sx={{ width: "100%" }}
                      disabled={
                        item.field === "Harvest" ||
                        item.field === "Mortalities" ||
                        idx === 0
                          ? true
                          : false
                      }
                      {...register(`manager.${idx}.batchNumber`, {
                        required: true,
                      })}
                    />
                    <Typography
                      variant="body2"
                      color="red"
                      fontSize={13}
                      mt={0.5}
                    ></Typography>
                    {errors &&
                      errors.manager &&
                      errors.manager[idx] &&
                      errors.manager[idx].batchNumber && (
                        <Typography
                          variant="body2"
                          color="red"
                          fontSize={13}
                          mt={0.5}
                        >
                          This field is required
                        </Typography>
                      )}
                  </Grid>
                  <Grid item xs>
                    <TextField
                      label="Biomass (kg) *"
                      type="text"
                      className="form-input"
                      disabled={idx === 0 ? true : false}
                      sx={{ width: "100%" }}
                      {...register(`manager.${idx}.biomass`, {
                        required: true,
                        pattern: validationPattern.negativeNumberWithDot,
                      })}
                    />
                    <Typography
                      variant="body2"
                      color="red"
                      fontSize={13}
                      mt={0.5}
                    ></Typography>
                    {errors &&
                      errors.manager &&
                      errors.manager[idx] &&
                      errors.manager[idx].biomass &&
                      errors.manager[idx].biomass.type === "required" && (
                        <Typography
                          variant="body2"
                          color="red"
                          fontSize={13}
                          mt={0.5}
                        >
                          {validationMessage.required}
                        </Typography>
                      )}
                  </Grid>
                  <Grid item xs>
                    <TextField
                      label="Fish Count *"
                      type="text"
                      className="form-input"
                      sx={{ width: "100%" }}
                      disabled={idx === 0 ? true : false}
                      {...register(`manager.${idx}.count`, {
                        required: true,
                        pattern: validationPattern.negativeNumberWithDot,
                      })}
                    />
                    <Typography
                      variant="body2"
                      color="red"
                      fontSize={13}
                      mt={0.5}
                    ></Typography>
                    {errors &&
                      errors.manager &&
                      errors.manager[idx] &&
                      errors.manager[idx].count &&
                      errors.manager[idx].count.type === "required" && (
                        <Typography
                          variant="body2"
                          color="red"
                          fontSize={13}
                          mt={0.5}
                        >
                          {validationMessage.required}
                        </Typography>
                      )}
                  </Grid>
                  <Grid item xs>
                    <TextField
                      label="Mean Weight *"
                      type="text"
                      className="form-input"
                      sx={{ width: "100%" }}
                      disabled={idx === 0 ? true : false}
                      {...register(`manager.${idx}.meanWeight`, {
                        required: true,
                        pattern: validationPattern.negativeNumberWithDot,
                      })}
                    />
                    <Typography
                      variant="body2"
                      color="red"
                      fontSize={13}
                      mt={0.5}
                    ></Typography>
                    {errors &&
                      errors.manager &&
                      errors.manager[idx] &&
                      errors.manager[idx].meanWeight &&
                      errors.manager[idx].meanWeight.type === "required" && (
                        <Typography
                          variant="body2"
                          color="red"
                          fontSize={13}
                          mt={0.5}
                        >
                          {validationMessage.required}
                        </Typography>
                      )}
                  </Grid>
                  <Grid item xs>
                    <TextField
                      label="Mean Length *"
                      type="text"
                      className="form-input"
                      sx={{ width: "100%" }}
                      disabled={idx === 0 ? true : false}
                      {...register(`manager.${idx}.meanLength` as const, {
                        required: true,
                      })}
                    />
                    <Typography
                      variant="body2"
                      color="red"
                      fontSize={13}
                      mt={0.5}
                    ></Typography>
                    {errors &&
                      errors.manager &&
                      errors.manager[idx] &&
                      errors.manager[idx].meanLength &&
                      errors.manager[idx].meanLength.type === "required" && (
                        <Typography
                          variant="body2"
                          color="red"
                          fontSize={13}
                          mt={0.5}
                        >
                          {validationMessage.required}
                        </Typography>
                      )}
                  </Grid>{" "}
                  {item.field !== "Harvest" && item.field !== "Mortalities" && (
                    <Grid item xs>
                      <TextField
                        label={`Stocking Density(kg/${"m\u00B3"}) *`}
                        type="text"
                        className="form-input"
                        sx={{ width: "100%" }}
                        disabled
                        {...register(
                          `manager.${idx}.stockingDensityKG` as const
                          // {
                          //   required: true,
                          // }
                        )}
                      />
                      <Typography
                        variant="body2"
                        color="red"
                        fontSize={13}
                        mt={0.5}
                      ></Typography>
                      {/* {errors &&
                        errors.manager &&
                        errors.manager[idx] &&
                        errors.manager[idx].stockingDensityKG &&
                        errors.manager[idx].stockingDensityKG.type ===
                          "required" && (
                          <Typography
                            variant="body2"
                            color="red"
                            fontSize={13}
                            mt={0.5}
                          >
                            {validationMessage.required}
                          </Typography>
                        )} */}
                    </Grid>
                  )}
                  {item.field !== "Harvest" && item.field !== "Mortalities" && (
                    <Grid item xs>
                      <TextField
                        label={`Stocking Density(n/${"m\u00B3"}) *`}
                        type="text"
                        className="form-input"
                        sx={{ width: "100%" }}
                        disabled
                        {...register(
                          `manager.${idx}.stockingDensityNM` as const
                          // {
                          //   required: true,
                          // }
                        )}
                      />
                      <Typography
                        variant="body2"
                        color="red"
                        fontSize={13}
                        mt={0.5}
                      ></Typography>
                      {/* {errors &&
                        errors.manager &&
                        errors.manager[idx] &&
                        errors.manager[idx].stockingDensityNM &&
                        errors.manager[idx].stockingDensityNM.type ===
                          "required" && (
                          <Typography
                            variant="body2"
                            color="red"
                            fontSize={13}
                            mt={0.5}
                          >
                            {validationMessage.required}
                          </Typography>
                        )} */}
                    </Grid>
                  )}
                  {item.field !== "Harvest" && item.field !== "Mortalities" && (
                    <Grid item xs>
                      <TextField
                        label="Stocking Level *"
                        type="text"
                        className="form-input"
                        sx={{ width: "100%" }}
                        disabled
                        {...register(
                          `manager.${idx}.stockingLevel` as const
                          //   {
                          //   required: true,
                          // }
                        )}
                      />
                      <Typography
                        variant="body2"
                        color="red"
                        fontSize={13}
                        mt={0.5}
                      ></Typography>
                      {/* {errors &&
                        errors.manager &&
                        errors.manager[idx] &&
                        errors.manager[idx].stockingLevel &&
                        errors.manager[idx].stockingLevel.type ===
                          "required" && (
                          <Typography
                            variant="body2"
                            color="red"
                            fontSize={13}
                            mt={0.5}
                          >
                            {validationMessage.required}
                          </Typography>
                        )} */}
                    </Grid>
                  )}
                  {idx !== 0 && (
                    <Grid item xs>
                      <TextField
                        label=""
                        type="text"
                        className="form-input"
                        sx={{ width: "100%" }}
                        InputProps={{ readOnly: true }}
                        {...register(`manager.${idx}.field` as const, {
                          required: true,
                        })}
                      />
                    </Grid>
                  )}
                </Grid>

                <Box>
                  <Box
                    display={"flex"}
                    justifyContent={"center"}
                    alignItems={"center"}
                    width={150}
                    sx={{
                      visibility: idx === 0 ? "hidden" : "",
                      cursor: "pointer",
                      width: {
                        // lg: 150,
                        xs: "auto",
                      },
                    }}
                    onClick={() => remove(idx)}
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
                </Box>
              </Box>
            );
          })}

          <div>
            <Button
              id="basic-button"
              aria-controls={open ? "basic-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              onClick={handleClick}
            >
              Add row
            </Button>
            <Button id="basic-button" type="submit">
              Save
            </Button>
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={openAnchor}
              onClose={handleCloseAnchor}
              MenuListProps={{
                "aria-labelledby": "basic-button",
              }}
            >
              {productionMangeFields.map((field, i) => {
                return (
                  <MenuItem onClick={() => handleCloseAnchor(field)} key={i}>
                    {field}
                  </MenuItem>
                );
              })}
            </Menu>
          </div>
        </form>
      </Stack>
    </Modal>
  );
};

export default TransferModal;
