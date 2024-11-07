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
    stockingDensityKGAfterCal?: String;
  }[];
}
const TransferModal: React.FC<Props> = ({
  setOpen,
  open,
  selectedProduction,
  farms,
}) => {
  const router = useRouter();
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
  const onSubmit: SubmitHandler<InputTypes> = async (data) => {
    const updatedData = data.manager.map((production, i) => {
      if (i !== 0) {
        return {
          ...production,
          stockingDensityKG: production.stockingDensityKGAfterCal,
        };
      } else {
        return production;
      }
    });
    console.log(updatedData);

    const payload = {
      organisationId: selectedProduction.organisationId,
      data: updatedData,
    };
    // const response = await fetch("/api/production/mange", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify(payload),
    // });

    // const res = await response.json();
    // if (res.status) {
    //   toast.success(res.message);
    //   setOpen(false);
    //   router.push("/dashboard/production");
    //   router.refresh();
    // }
  };

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
          const currentBiomass = Number(field.biomass) || 0; // Convert to number
          const currentCount = Number(field.count) || 0; // Convert to number
          if (currentBiomass > updatedBiomass) {
            toast.dismiss();
            toast.error(`Please enter a value lower than ${updatedBiomass}`);
          }
          if (currentCount > updatedCount) {
            toast.dismiss();
            toast.error(`Please enter a value lower than ${updatedCount}`);
          }
          // Update biomass if current value is valid
          if (currentBiomass > 0 && updatedBiomass > currentBiomass) {
            updatedBiomass -= currentBiomass;
          }

          // Update count if current value is valid
          if (currentCount > 0 && updatedCount > currentCount) {
            updatedCount -= currentCount;
          }
        }
        const farm = farms.find((f) => f.id === field.fishFarm);
        if (farm && farm.productionUnits && farm?.productionUnits[0].capacity) {
          setValue(
            `manager.${index}.stockingDensityNM`,
            String(
              Number(field.count) / Number(farm?.productionUnits[0]?.capacity)
            )
          );
          setValue(
            `manager.${index}.stockingDensityKGAfterCal`,
            String(
              Number(field.stockingDensityKG) /
                Number(farm?.productionUnits[0]?.capacity)
            )
          );
        }
      });

      // Set the index 0 values after calculation
      setValue(`manager.0.biomass`, updatedBiomass.toString());
      setValue(`manager.0.count`, updatedCount.toString());
    }
  }, [
    watchedFields.map((field) => field.biomass).join(","), // Watch biomass of all fields
    watchedFields.map((field) => field.count).join(","), // Watch count of all fields
    watchedFields.map((field) => field.stockingDensityKG).join(","),
    setValue,
    selectedProduction,
  ]);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      className="modal-positioning"
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
        <form className="form-height" onSubmit={handleSubmit(onSubmit)}>
          {fields.map((item, idx) => {
            return (
              <Box paddingInline={4} key={item.id}>
                {idx !== 0 && (
                  <Box>
                    <Button
                      id=""
                      className=""
                      type="button"
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
                        borderRadius: "20px",
                        marginLeft: "12px !important",
                        marginBottom: "15px",
                      }}
                    >
                      {getValues(`manager.${idx}.field`)}
                    </Button>
                  </Box>
                )}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                    position: "relative",
                    bottom: "10px",
                  }}
                >
                  <Grid container spacing={2} className="grid-margin">
                    <Grid container spacing={2} className="grid-margin">
                      <Grid item lg={2} md={6} xs={12}>
                        <Box mb={2} width={"100%"}>
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
                      <Grid item lg={2} md={6} xs={12}>
                        <Box mb={2} width={"100%"}>
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
                              value={
                                watch(`manager.${idx}.productionUnit`) || ""
                              }
                            >
                              {(() => {
                                let selectedFarm;
                                if (idx === 0) {
                                  selectedFarm = farms.find(
                                    (farm) =>
                                      farm.id ===
                                      watch(`manager.${idx}.fishFarm`)
                                  )?.productionUnits;
                                } else {
                                  selectedFarm = farms
                                    .find(
                                      (farm) =>
                                        farm.id ===
                                        watch(`manager.${idx}.fishFarm`)
                                    )
                                    ?.productionUnits?.filter(
                                      (unit) =>
                                        unit.name !==
                                        selectedProduction.productionUnit.name
                                    );
                                }

                                return selectedFarm ? (
                                  selectedFarm?.map((unit) => (
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
                      <Grid item lg={2} md={6} xs={12}>
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
                      <Grid item lg={2} md={6} xs={12}>
                        <TextField
                          label="Biomass (kg) *"
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
                      <Grid item lg={2} md={6} xs={12}>
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
                      <Grid item lg={2} md={6} xs={12}>
                        <TextField
                          label="Mean Weight *"
                          type="text"
                          className="form-input"
                          sx={{ width: "100%" }}
                          disabled={idx === 0 ? true : false}
                          {...register(`manager.${idx}.meanWeight`, {
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
                      <Grid item lg={2} md={6} xs={12}>
                        <TextField
                          label="Mean Length *"
                          type="text"
                          className="form-input"
                          sx={{ width: "100%" }}
                          disabled={idx === 0 ? true : false}
                          {...register(`manager.${idx}.meanLength` as const, {
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
                          <Grid item lg={2} md={6} xs={12}>
                            <TextField
                              label={`Stocking Density(kg/${"m\u00B3"}) *`}
                              type="text"
                              className="form-input"
                              sx={{ width: "100%" }}
                              disabled={idx === 0 ? true : false}
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
                          <Grid item lg={2} md={6} xs={12}>
                            <TextField
                              label={`Stocking Density(n/${"m\u00B3"}) *`}
                              type="text"
                              className="form-input"
                              sx={{ width: "100%" }}
                              disabled={idx === 0 ? true : false}
                              {...register(
                                `manager.${idx}.stockingDensityNM` as const,
                                {
                                  required: true,
                                  pattern: validationPattern.numbersWithDot,
                                }
                              )}
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
                          <Grid item lg={2} md={6} xs={12}>
                            <TextField
                              label="Stocking Level *"
                              type="text"
                              className="form-input"
                              disabled={idx === 0 ? true : false}
                              sx={{ width: "100%" }}
                              {...register(
                                `manager.${idx}.stockingLevel` as const,
                                {
                                  required: true,
                                  pattern: validationPattern.numbersWithDot,
                                }
                              )}
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
                              )}
                            {errors &&
                              errors.manager &&
                              errors.manager[idx] &&
                              errors.manager[idx].stockingLevel &&
                              errors.manager[idx].stockingLevel.type ===
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
                    </Grid>
                    {/* {idx !== 0 && (
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
                    )} */}
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
                  </Grid>

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

                    {/* <Box
                      display={"flex"}
                      justifyContent={"center"}
                      alignItems={"center"}
                      width={50}
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="red"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g clip-path="url(#clip0_294_115)">
                          <path
                            d="M19.7531 12.2857C19.7531 16.5393 16.6855 20 12.915 20H2.78433C2.36454 20 2.02455 19.6164 2.02455 19.1428C2.02455 18.6692 2.36454 18.2857 2.78433 18.2857H12.915C15.8477 18.2857 18.2336 15.5943 18.2336 12.2857C18.2336 8.97717 15.8478 6.28578 12.915 6.28578H2.59347L5.34862 9.394C5.6459 9.72933 5.6459 10.2715 5.34862 10.6068C5.20046 10.774 5.00576 10.8586 4.81203 10.8586C4.61734 10.8586 4.42264 10.7751 4.27544 10.6068L0.222956 6.03506C-0.0743187 5.69969 -0.0743187 5.15757 0.222956 4.8222L4.2735 0.251526C4.57077 -0.0838419 5.05132 -0.0838419 5.34859 0.251526C5.64587 0.586893 5.64587 1.12902 5.34859 1.46438L2.59344 4.57257H12.915C16.6855 4.57257 19.753 8.03322 19.753 12.2868L19.7531 12.2857Z"
                            fill="red"
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_294_115">
                            <rect width="20" height="20" fill="white" />
                          </clipPath>
                        </defs>
                      </svg>
                    </Box> */}
                  </Box>
                </Box>
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
                  <MenuItem onClick={() => handleCloseAnchor(field)} key={i}>
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
      </Stack>
    </Modal>
  );
};

export default TransferModal;
