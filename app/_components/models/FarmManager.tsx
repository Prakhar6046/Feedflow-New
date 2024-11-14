import { productionMangeFields } from "@/app/_lib/utils";
import * as validationPattern from "@/app/_lib/utils/validationPatterns/index";
import * as validationMessage from "@/app/_lib/utils/validationsMessage/index";
import { Farm } from "@/app/_typeModels/Farm";
import { Production } from "@/app/_typeModels/production";
import { Close as CloseIcon } from "@mui/icons-material"; // Use Material-UI's Close icon directly
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
  TextField,
  Typography,
} from "@mui/material";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Confirmation from "./Confirmation";
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
  batches: { batchNumber: String; id: Number }[];
  productions: Production[];
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
  batches,
  productions,
}) => {
  const router = useRouter();
  const [selectedFarm, setSelectedFarm] = useState<any>(null);
  const [isEnteredBiomassGreater, setIsEnteredBiomassGreater] =
    useState<Boolean>(false);
  const [isEnteredFishCountGreater, setIsEnteredFishCountGreater] =
    useState<Boolean>(false);
  const [openConfirmationModal, setOpenConfirmationModal] =
    useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isStockDeleted, setIsStockDeleted] = useState<boolean>(false);
  const {
    register,
    setValue,
    formState: { errors },
    watch,
    trigger,
    reset,
    getValues,
    handleSubmit,
    control,
    setFocus,
    getFieldState,
  } = useForm<InputTypes>({
    mode: "onChange",
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

  const onSubmit: SubmitHandler<InputTypes> = async (data) => {
    const addIdToData = data.manager.map((field) => {
      const fishFarm = productions.find(
        (OldField) =>
          OldField.fishFarmId === field.fishFarm &&
          OldField.productionUnitId === field.productionUnit
      );

      if (
        field.fishFarm === fishFarm?.fishFarmId &&
        field.productionUnit === fishFarm.productionUnitId
      ) {
        return { ...field, id: fishFarm.id };
      } else {
        return field;
      }
    });

    const filteredData = addIdToData.filter((field) => field.field !== "Stock");

    if (!isEnteredBiomassGreater && !isEnteredFishCountGreater) {
      const payload = {
        organisationId: selectedProduction.organisationId,
        data: filteredData,
      };

      const response = await fetch("/api/production/mange", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const res = await response.json();
      if (res.status) {
        toast.success(res.message);
        setOpen(false);
        router.push("/dashboard/production");
        reset();
        router.refresh();
      }
    } else {
      toast.dismiss();
      toast.error(
        "Please enter biomass and fish count value less than selected production"
      );
    }
  };

  const handleDelete = (item: any) => {
    if (item.field !== "Stock") {
      const currentIndex = fields.findIndex((field) => field.id === item.id);
      remove(currentIndex);
    } else {
      setOpenConfirmationModal(true);
    }
  };
  const handleClose = () => {
    const firstObject = getValues("manager")[0];
    // Reset the form and keep the first object intact
    reset({
      manager: [firstObject], // Keep only the first object
    });
    setOpen(false);
  };
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
        batchNumber: selectedProduction.batchNumberId,
      });
      setAnchorEl(null);
    } else {
      setAnchorEl(null);
    }
  };

  useEffect(() => {
    if (isStockDeleted || selectedProduction) {
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
          batchNumber: selectedProduction.batchNumberId,
        },
      ];
      setValue("manager", data);
      setSelectedFarm(selectedProduction.fishFarmId); // Set the selected farm when manager is selected
    }

    return () => {
      setIsStockDeleted(false);
    };
  }, [selectedProduction, setValue, isStockDeleted]);

  const watchedFields = watch("manager");

  useEffect(() => {
    if (selectedProduction) {
      const index0Biomass = Number(selectedProduction.biomass) || 0; // Ensure a number
      const index0Count = Number(selectedProduction.fishCount) || 0; // Ensure a number
      const fishFarm = selectedProduction.fishFarmId;

      // Initialize updated values
      let updatedBiomass = index0Biomass;
      let updatedCount = index0Count;

      // Iterate through watched fields, skipping index 0
      watchedFields.forEach((field, index) => {
        if (index === 0) return; // Skip index 0
        if (field.fishFarm === fishFarm) {
          if (
            !selectedProduction.biomass &&
            !selectedProduction.fishCount &&
            !selectedProduction.meanLength &&
            !selectedProduction.meanWeight &&
            field.field === "Stock"
          ) {
            updatedBiomass = Number(field.biomass);
            updatedCount = Number(field.count);
            setValue(`manager.0.meanLength`, field.meanLength);
            setValue(`manager.0.meanWeight`, field.meanWeight);
            setValue(`manager.0.stockingDensityKG`, field.stockingDensityKG);
            setValue(`manager.0.stockingDensityNM`, field.stockingDensityNM);
            setValue(`manager.0.batchNumber`, field.batchNumber);
          }

          const currentBiomass = Number(field.biomass) || 0; // Convert to number
          const currentCount = Number(field.count) || 0; // Convert to number
          if (field.field !== "Stock" && currentBiomass > updatedBiomass) {
            toast.dismiss();
            toast.error(`Please enter a value lower than ${updatedBiomass}`);
            setIsEnteredBiomassGreater(true);
          }
          if (field.field !== "Stock" && currentCount > updatedCount) {
            toast.dismiss();
            toast.error(`Please enter a value lower than ${updatedCount}`);
            setIsEnteredFishCountGreater(true);
          }
          // Update biomass if current value is valid
          if (currentBiomass > 0 && updatedBiomass > currentBiomass) {
            updatedBiomass -= currentBiomass;
            setIsEnteredBiomassGreater(false);
          } else if (field.field === "Stock") {
            // trigger(`manager.${0}`);

            updatedBiomass = currentBiomass;
            setValue(`manager.0.meanLength`, field.meanLength);
            setValue(`manager.0.meanWeight`, field.meanWeight);
            setValue(`manager.0.stockingDensityKG`, field.stockingDensityKG);
            setValue(`manager.0.stockingDensityNM`, field.stockingDensityNM);
            setValue(`manager.0.batchNumber`, field.batchNumber);
          }

          // Update count if current value is valid
          if (currentCount > 0 && updatedCount > currentCount) {
            updatedCount -= currentCount;
            setIsEnteredFishCountGreater(false);
          } else if (field.field === "Stock") {
            updatedCount = currentCount;
            setValue(`manager.0.meanLength`, field.meanLength);
            setValue(`manager.0.meanWeight`, field.meanWeight);
            setValue(`manager.0.stockingDensityKG`, field.stockingDensityKG);
            setValue(`manager.0.stockingDensityNM`, field.stockingDensityNM);
            setValue(`manager.0.batchNumber`, field.batchNumber);
          }
        }
        const farm = farms
          .find((f) => f.id === selectedFarm)
          ?.productionUnits?.find((unit) => unit.id === field.productionUnit);
        if (farm && farm.capacity) {
          setValue(
            `manager.${index}.stockingDensityNM`,
            String(Number(field.count) / Number(farm?.capacity))
          );
          setValue(
            `manager.${index}.stockingDensityKG`,
            String(Number(field.biomass) / Number(farm?.capacity))
          );
        }
      });

      // Set the index 0 values after calculation
      setValue(`manager.0.biomass`, updatedBiomass.toString());
      setValue(`manager.0.count`, updatedCount.toString());
    }
  }, [
    watchedFields.map((field) => field.biomass).join(","), // Watch biomass of all fields
    watchedFields.map((field) => field.count).join(","),
    watchedFields.map((field) => field.meanLength).join(","),
    watchedFields.map((field) => field.meanWeight).join(","),

    watchedFields.map((field) => field.stockingDensityKG).join(","),
    setValue,
    selectedProduction,
  ]);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="parent-modal-title"
      aria-describedby="parent-modal-description"
      className="modal-positioning"
    >
      <Stack sx={style}>
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
        <form className="form-height" onSubmit={handleSubmit(onSubmit)}>
          {fields.map((item, idx) => {
            return (
              <Box paddingInline={4} key={item.id}>
                {idx !== 0 && (
                  <Box>
                    <Typography
                      variant="body1"
                      fontWeight={600}
                      my={2}
                      mx={1.5}
                    >
                      {getValues(`manager.${idx}.field`)}
                    </Typography>
                  </Box>
                )}

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    height: "100%",
                    position: "relative",
                    bottom: "10px",
                    gap: 1.5,
                  }}
                >
                  <Stack
                    sx={{
                      overflowY: {
                        xl: "visible",
                        xs: "auto",
                      },
                      width: "97%",
                    }}
                  >
                    <Grid
                      container
                      spacing={2}
                      className="grid-margin"
                      sx={{
                        flexWrap: "nowrap",
                      }}
                    >
                      <Grid
                        item
                        xs
                        sx={{
                          width: "fit-content",
                          minWidth: 130,
                        }}
                      >
                        <Box width={"100%"}>
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
                                item.field === "Stock" &&
                                  setValue(
                                    `manager.0.fishFarm`,
                                    e.target.value
                                  ),
                                  setSelectedFarm(selectedFishFarm); // Set selected farm for this specific entry
                                setValue(
                                  `manager.${idx}.fishFarm`,
                                  selectedFishFarm
                                ); // Set the value for this fishFarm
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
                              errors?.manager[idx].fishFarm.type ===
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
                        </Box>
                      </Grid>
                      <Grid
                        xs
                        item
                        sx={{
                          width: "fit-content",
                          minWidth: 130,
                        }}
                      >
                        <Box width={"100%"}>
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
                                required:
                                  item.field === "Harvest" ||
                                  item.field === "Mortalities"
                                    ? false
                                    : true,
                                onChange: (e) =>
                                  item.field === "Stock" &&
                                  setValue(
                                    `manager.0.productionUnit`,
                                    e.target.value
                                  ),
                              })}
                              value={
                                watch(`manager.${idx}.productionUnit`) || ""
                              }
                            >
                              {(() => {
                                let selectedFarm = farms?.find(
                                  (farm) =>
                                    farm.id === watch(`manager.${idx}.fishFarm`)
                                );

                                return selectedFarm ? (
                                  selectedFarm?.productionUnits?.map((unit) => (
                                    <MenuItem
                                      value={String(unit.id)}
                                      key={unit.id}
                                    >
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
                        </Box>
                      </Grid>
                      <Grid
                        xs
                        item
                        sx={{
                          width: "fit-content",
                          minWidth: 130,
                        }}
                      >
                        <Box mb={2} width={"100%"}>
                          <FormControl fullWidth className="form-input">
                            <InputLabel id="">Batch No. *</InputLabel>
                            <Select
                              labelId="feed-supply-select-label9"
                              className="fish-manager"
                              id="feed-supply-select9"
                              label="Batch No. *"
                              disabled={
                                item.field === "Harvest" ||
                                item.field === "Mortalities" ||
                                idx === 0
                                  ? true
                                  : false
                              }
                              {...register(`manager.${idx}.batchNumber`, {
                                required: watch(`manager.${idx}.batchNumber`)
                                  ? false
                                  : true,
                                onChange: (e) =>
                                  item.field === "Stock" &&
                                  setValue(
                                    `manager.0.batchNumber`,
                                    e.target.value
                                  ),
                              })}
                              inputProps={{
                                shrink: watch(`manager.${idx}.batchNumber`),
                              }}
                              value={watch(`manager.${idx}.batchNumber`) || ""} // Ensure only the current entry is updated
                            >
                              {batches?.map(
                                (
                                  batch: { batchNumber: String; id: Number },
                                  i
                                ) => (
                                  <MenuItem value={String(batch.id)} key={i}>
                                    {batch.batchNumber}
                                  </MenuItem>
                                )
                              )}
                            </Select>

                            <Typography
                              variant="body2"
                              color="red"
                              fontSize={13}
                              mt={0.5}
                            ></Typography>
                            {errors &&
                              !watch(`manager.${idx}.batchNumber`) &&
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
                          </FormControl>
                        </Box>
                      </Grid>
                      <Grid
                        xs
                        item
                        sx={{
                          width: "fit-content",
                          minWidth: 130,
                        }}
                      >
                        <Box
                          display={"flex"}
                          gap={2}
                          alignItems={"center"}
                          position={"relative"}
                        >
                          <TextField
                            label="Biomass *"
                            type="text"
                            className="form-input"
                            disabled={idx === 0 ? true : false}
                            sx={{ width: "100%" }}
                            {...register(`manager.${idx}.biomass`, {
                              required: true,
                              pattern: validationPattern.numbersWithDot,
                            })}
                          />

                          <Typography
                            variant="body2"
                            color="#555555AC"
                            sx={{
                              position: "absolute",
                              right: 6,
                              top: "50%",
                              transform: "translate(-6px, -50%)",
                              backgroundColor: "#fff",
                              height: 30,
                              display: "grid",
                              placeItems: "center",
                              zIndex: 1,
                              pl: 1,
                            }}
                          >
                            kg
                          </Typography>
                        </Box>
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
                        {errors &&
                          errors.manager &&
                          errors.manager[idx] &&
                          errors.manager[idx].biomass &&
                          errors.manager[idx].biomass.type === "pattern" && (
                            <Typography
                              variant="body2"
                              color="red"
                              fontSize={13}
                              mt={0.5}
                            >
                              {validationMessage.OnlyNumbersWithDot}
                            </Typography>
                          )}
                      </Grid>
                      <Grid
                        xs
                        item
                        sx={{
                          width: "fit-content",
                          minWidth: 130,
                        }}
                      >
                        <TextField
                          label="Fish Count *"
                          type="text"
                          className="form-input"
                          sx={{ width: "100%" }}
                          disabled={idx === 0 ? true : false}
                          {...register(`manager.${idx}.count`, {
                            required: true,
                            pattern: validationPattern.numbersWithDot,
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
                        {errors &&
                          errors.manager &&
                          errors.manager[idx] &&
                          errors.manager[idx].count &&
                          errors.manager[idx].count.type === "pattern" && (
                            <Typography
                              variant="body2"
                              color="red"
                              fontSize={13}
                              mt={0.5}
                            >
                              {validationMessage.OnlyNumbersWithDot}
                            </Typography>
                          )}
                      </Grid>
                      <Grid
                        xs
                        item
                        sx={{
                          width: "fit-content",
                          minWidth: 130,
                        }}
                      >
                        <TextField
                          label="Mean Weight *"
                          type="text"
                          className="form-input"
                          sx={{
                            width: "100%",
                            "& .MuiInputLabel-root": {
                              transition: "all 0.2s ease",
                            },
                            "&:focus-within .MuiInputLabel-root": {
                              transform: "translate(10px, -9px)", // Moves the label up when focused
                              fontSize: "0.75rem",
                              color: "primary.main",
                              backgroundColor: "#fff",
                            },
                          }}
                          disabled={idx === 0 ? true : false}
                          {...register(`manager.${idx}.meanWeight`, {
                            required: watch(`manager.${idx}.meanWeight`)
                              ? false
                              : true,
                            pattern: validationPattern.numbersWithDot,
                          })}
                          InputLabelProps={{
                            shrink: !!watch(`manager.${idx}.meanWeight`),
                          }}
                        />
                        <Typography
                          variant="body2"
                          color="red"
                          fontSize={13}
                          mt={0.5}
                        ></Typography>
                        {errors &&
                          !watch(`manager.${idx}.meanWeight`) &&
                          errors.manager &&
                          errors.manager[idx] &&
                          errors.manager[idx].meanWeight &&
                          errors.manager[idx].meanWeight.type ===
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
                          errors.manager &&
                          errors.manager[idx] &&
                          errors.manager[idx].meanWeight &&
                          errors.manager[idx].meanWeight.type === "pattern" && (
                            <Typography
                              variant="body2"
                              color="red"
                              fontSize={13}
                              mt={0.5}
                            >
                              {validationMessage.OnlyNumbersWithDot}
                            </Typography>
                          )}
                      </Grid>
                      <Grid
                        xs
                        item
                        sx={{
                          width: "fit-content",
                          minWidth: 130,
                        }}
                      >
                        <TextField
                          label="Mean Length *"
                          type="text"
                          className="form-input"
                          sx={{
                            width: "100%",
                            "& .MuiInputLabel-root": {
                              transition: "all 0.2s ease",
                            },
                            "&:focus-within .MuiInputLabel-root": {
                              transform: "translate(10px, -9px)", // Moves the label up when focused
                              fontSize: "0.75rem",
                              color: "primary.main",
                              backgroundColor: "#fff",
                            },
                          }}
                          disabled={idx === 0 ? true : false}
                          {...register(`manager.${idx}.meanLength` as const, {
                            required: watch(`manager.${idx}.meanLength`)
                              ? false
                              : true,
                            pattern: validationPattern.numbersWithDot,
                          })}
                          InputLabelProps={{
                            shrink: !!watch(`manager.${idx}.meanLength`),
                          }}
                        />
                        <Typography
                          variant="body2"
                          color="red"
                          fontSize={13}
                          mt={0.5}
                        ></Typography>
                        {errors &&
                          !watch(`manager.${idx}.meanLength`) &&
                          errors.manager &&
                          errors.manager[idx] &&
                          errors.manager[idx].meanLength &&
                          errors.manager[idx].meanLength.type ===
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
                          errors.manager &&
                          errors.manager[idx] &&
                          errors.manager[idx].meanLength &&
                          errors.manager[idx].meanLength.type === "pattern" && (
                            <Typography
                              variant="body2"
                              color="red"
                              fontSize={13}
                              mt={0.5}
                            >
                              {validationMessage.OnlyNumbersWithDot}
                            </Typography>
                          )}
                      </Grid>{" "}
                      {item.field !== "Harvest" &&
                        item.field !== "Mortalities" && (
                          <Grid
                            item
                            xs
                            sx={{
                              width: "fit-content",
                              minWidth: 130,
                            }}
                          >
                            <Box
                              display={"flex"}
                              gap={2}
                              alignItems={"center"}
                              position={"relative"}
                            >
                              <TextField
                                label={`Stocking Density *`}
                                type="text"
                                className="form-input"
                                disabled={idx === 0 ? true : false}
                                InputLabelProps={{
                                  shrink: !!watch(
                                    `manager.${idx}.stockingDensityKG`
                                  ),
                                }}
                                sx={{
                                  width: "100%",
                                  "& .MuiInputLabel-root": {
                                    transition: "all 0.2s ease",
                                  },
                                  "&:focus-within .MuiInputLabel-root": {
                                    transform: "translate(10px, -9px)", // Moves the label up when focused
                                    fontSize: "0.75rem",
                                    color: "primary.main",
                                    backgroundColor: "#fff",
                                  },
                                }}
                                {...register(
                                  `manager.${idx}.stockingDensityKG` as const,
                                  {
                                    required: true,
                                    pattern: validationPattern.numbersWithDot,
                                  }
                                )}
                              />

                              <Typography
                                variant="body2"
                                color="#555555AC"
                                sx={{
                                  position: "absolute",
                                  right: 6,
                                  top: "50%",
                                  transform: "translate(-6px, -50%)",
                                  backgroundColor: "#fff",
                                  height: 30,
                                  display: "grid",
                                  placeItems: "center",
                                  zIndex: 1,
                                  pl: 1,
                                }}
                              >
                                {`(kg/${"m\u00B3"})`}
                              </Typography>
                            </Box>

                            <Typography
                              variant="body2"
                              color="red"
                              fontSize={13}
                              mt={0.5}
                            ></Typography>
                            {errors &&
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
                              )}
                            {errors &&
                              errors.manager &&
                              errors.manager[idx] &&
                              errors.manager[idx].stockingDensityKG &&
                              errors.manager[idx].stockingDensityKG.type ===
                                "pattern" && (
                                <Typography
                                  variant="body2"
                                  color="red"
                                  fontSize={13}
                                  mt={0.5}
                                >
                                  {validationMessage.OnlyNumbersWithDot}
                                </Typography>
                              )}
                          </Grid>
                        )}
                      {item.field !== "Harvest" &&
                        item.field !== "Mortalities" && (
                          <Grid
                            xs
                            item
                            sx={{
                              width: "fit-content",
                              minWidth: 130,
                            }}
                          >
                            <Box
                              display={"flex"}
                              gap={2}
                              alignItems={"center"}
                              position={"relative"}
                            >
                              <TextField
                                label={`Stocking Density *`}
                                type="text"
                                className="form-input"
                                disabled={idx === 0 ? true : false}
                                {...register(
                                  `manager.${idx}.stockingDensityNM` as const,
                                  {
                                    required: true,
                                    pattern: validationPattern.numbersWithDot,
                                  }
                                )}
                                InputLabelProps={{
                                  shrink: !!watch(
                                    `manager.${idx}.stockingDensityNM`
                                  ),
                                }}
                                sx={{
                                  width: "100%",
                                  "& .MuiInputLabel-root": {
                                    transition: "all 0.2s ease",
                                  },
                                  "&:focus-within .MuiInputLabel-root": {
                                    transform: "translate(10px, -9px)", // Moves the label up when focused
                                    fontSize: "0.75rem",
                                    color: "primary.main",
                                    backgroundColor: "#fff",
                                  },
                                }}
                              />

                              <Typography
                                variant="body2"
                                color="#555555AC"
                                sx={{
                                  position: "absolute",
                                  right: 6,
                                  top: "50%",
                                  transform: "translate(-6px, -50%)",
                                  backgroundColor: "#fff",
                                  height: 30,
                                  display: "grid",
                                  placeItems: "center",
                                  zIndex: 1,
                                  pl: 1,
                                }}
                              >
                                {`(n/${"m\u00B3"})`}
                              </Typography>
                            </Box>

                            <Typography
                              variant="body2"
                              color="red"
                              fontSize={13}
                              mt={0.5}
                            ></Typography>
                            {errors &&
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
                              )}
                            {errors &&
                              errors.manager &&
                              errors.manager[idx] &&
                              errors.manager[idx].stockingDensityNM &&
                              errors.manager[idx].stockingDensityNM.type ===
                                "pattern" && (
                                <Typography
                                  variant="body2"
                                  color="red"
                                  fontSize={13}
                                  mt={0.5}
                                >
                                  {validationMessage.OnlyNumbersWithDot}
                                </Typography>
                              )}
                          </Grid>
                        )}
                      {item.field !== "Harvest" &&
                        item.field !== "Mortalities" && (
                          <Grid
                            item
                            xs
                            sx={{
                              width: "fit-content",
                              minWidth: 130,
                            }}
                          >
                            <TextField
                              label="Stocking Level *"
                              type="text"
                              className="form-input"
                              disabled
                              sx={{ width: "100%" }}
                              {...register(
                                `manager.${idx}.stockingLevel` as const
                                // {
                                //   required: true,
                                //   pattern: validationPattern.numbersWithDot,
                                // }
                              )}
                            />
                            <Typography
                              variant="body2"
                              color="red"
                              fontSize={13}
                              mt={0.5}
                            ></Typography>
                          </Grid>
                        )}
                    </Grid>
                  </Stack>

                  <Box
                    display={"flex"}
                    alignItems={"center"}
                    justifyContent={"center"}
                    position={"relative"}
                    top="90%"
                  >
                    <Box
                      display={"flex"}
                      justifyContent={"center"}
                      alignItems={"center"}
                      width={50}
                      sx={{
                        visibility: idx === 0 ? "hidden" : "",
                        cursor: "pointer",
                        width: {
                          // lg: 150,
                          xs: "auto",
                        },
                      }}
                      onClick={() => handleDelete(item)}
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

                <Divider
                  orientation="vertical"
                  sx={{
                    height: "100%",
                    borderBottom: "2px solid #E6E7E9 !important",
                    borderRight: "none !important",
                    width: "100%",
                    marginLeft: "12px",
                    paddingBlock: "10px",
                  }}
                />
              </Box>
            );
          })}

          <Box
            display="flex"
            justifyContent="flex-end"
            alignItems={"flex-end"}
            gap="10px"
            padding={3}
            margin={"40px"}
          >
            <Button
              className=""
              type="button"
              variant="contained"
              onClick={handleClick}
              sx={{
                background: "#06A19B",
                fontWeight: "bold",
                padding: "8px 20px",
                width: {
                  xs: "50%",
                  lg: "fit-content",
                },
                textTransform: "capitalize",
                borderRadius: "12px",

                marginBlock: "10px",
              }}
            >
              Add Row
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
                  <MenuItem
                    onClick={() => handleCloseAnchor(field)}
                    key={i}
                    disabled={
                      field === "Harvest" || field === "Mortalities"
                        ? watchedFields[0].batchNumber
                          ? false
                          : true
                        : selectedProduction?.batchNumberId &&
                          selectedProduction?.biomass &&
                          selectedProduction?.fishCount &&
                          selectedProduction?.meanLength &&
                          selectedProduction?.meanWeight
                        ? false
                        : watchedFields.find(
                            (field) => field.field === "Stock"
                          ) && field === "Stock"
                        ? true
                        : false
                    }
                  >
                    {field}
                  </MenuItem>
                );
              })}
            </Menu>
            <Button
              className=""
              type="submit"
              variant="contained"
              sx={{
                background: "#06A19B",
                fontWeight: "bold",
                padding: "8px 20px",
                width: {
                  xs: "50%",
                  lg: "fit-content",
                },
                textTransform: "capitalize",
                borderRadius: "12px",

                marginBlock: "10px",
              }}
            >
              Save
            </Button>
          </Box>
        </form>
        <Confirmation
          open={openConfirmationModal}
          setOpen={setOpenConfirmationModal}
          remove={remove}
          watchedFields={watchedFields}
          selectedProductionFishaFarmId={selectedProduction?.fishFarmId}
          setIsStockDeleted={setIsStockDeleted}
        />
      </Stack>
    </Modal>
  );
};

export default TransferModal;
