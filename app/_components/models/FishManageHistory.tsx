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
import {
  Controller,
  SubmitHandler,
  useFieldArray,
  useForm,
} from "react-hook-form";
import toast from "react-hot-toast";
import Confirmation from "./Confirmation";
import CalculateMeanWeigth from "./CalculateMeanWeigth";
import CalculateMeanLength from "./CalculateMeanLength";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Dayjs } from "dayjs";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
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
    currentDate?: Dayjs | null;
  }[];
}
const FishManageHistoryModal: React.FC<Props> = ({
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
  const [isMeanWeigthCal, setIsMeanWeigthCal] = useState<boolean>(false);
  const [isMeanLengthCal, setIsMeanLengthCal] = useState<boolean>(false);
  const [avgOfMeanWeight, setAvgOfMeanWeight] = useState<Number>();
  const [avgOfMeanLength, setAvgOfMeanLength] = useState<Number>();
  const [selectedMeanWeightId, setSelectedMeanWeightId] = useState<String>("");
  const [selectedMeanLengthId, setSelectedMeanLengthId] = useState<String>("");
  const [isApiCallInProgress, setIsApiCallInProgress] =
    useState<boolean>(false);

  const {
    register,
    setValue,
    formState: { errors },
    watch,
    trigger,
    clearErrors,
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
          currentDate: "",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "manager",
  });
  const watchedFields = watch("manager");

  const onSubmit: SubmitHandler<InputTypes> = async (data) => {
    // Prevent API call if one is already in progress
    if (isApiCallInProgress) return;
    setIsApiCallInProgress(true);

    try {
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

      const filteredData = addIdToData.filter(
        (field) => field.field !== "Stock"
      );

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
          toast.dismiss();
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
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsApiCallInProgress(false);
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
        productionUnit:
          field === "Harvest" || field === "Mortalities"
            ? selectedProduction.productionUnitId
            : "",
        biomass: "",
        count: "",
        meanWeight: "",
        meanLength: "",
        stockingDensityNM: "",
        stockingLevel: "",
        stockingDensityKG: "",
        field,
        batchNumber:
          field === "Harvest" || field === "Mortalities"
            ? selectedProduction.batchNumberId
            : "",
      });
      setAnchorEl(null);
    } else {
      setAnchorEl(null);
    }
  };

  const handleMeanWeight = (item: any) => {
    setSelectedMeanWeightId(String(item.id));
    setIsMeanWeigthCal(true);
  };
  const handleMeanLength = (item: any) => {
    setSelectedMeanLengthId(String(item.id));
    setIsMeanLengthCal(true);
  };
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Enter" && !open) {
      event.preventDefault();
    }
  };
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open]);
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
            setValue(
              `manager.0.stockingDensityKG`,
              Number(field.stockingDensityKG).toFixed(2)
            );
            setValue(
              `manager.0.stockingDensityNM`,
              Number(field.stockingDensityNM).toFixed(2)
            );
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
            setValue(
              `manager.0.stockingDensityNM`,
              Number(field.stockingDensityNM).toFixed(2)
            );
            setValue(
              `manager.0.stockingDensityKG`,
              Number(field.stockingDensityKG).toFixed(2)
            );

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
            setValue(
              `manager.0.stockingDensityNM`,
              Number(field.stockingDensityNM).toFixed(2)
            );
            setValue(
              `manager.0.stockingDensityKG`,
              Number(field.stockingDensityKG).toFixed(2)
            );
            setValue(`manager.0.batchNumber`, field.batchNumber);
          }
        }
        const farm = farms
          .find((f) => f.id === selectedFarm)
          ?.productionUnits?.find((unit) => unit.id === field.productionUnit);
        if (farm && farm.capacity) {
          setValue(
            `manager.${index}.stockingDensityNM`,
            String(
              Number(Number(field.count) / Number(farm?.capacity)).toFixed(2)
            )
          );
          setValue(
            `manager.${index}.stockingDensityKG`,
            String(
              Number(Number(field.biomass) / Number(farm?.capacity)).toFixed(2)
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
    watchedFields.map((field) => field.count).join(","),
    watchedFields.map((field) => field.meanLength).join(","),
    watchedFields.map((field) => field.meanWeight).join(","),

    watchedFields.map((field) => field.stockingDensityKG).join(","),
    setValue,
    selectedProduction,
  ]);

  useEffect(() => {
    if (avgOfMeanWeight && selectedMeanWeightId) {
      const updatedFields = fields.map((field, idx) => {
        if (field.id === selectedMeanWeightId) {
          return {
            ...field,
            meanWeight: String(Number(avgOfMeanWeight).toFixed(2)),
            batchNumber: watchedFields[idx].batchNumber,
            count: watchedFields[idx].count,
            productionUnit: watchedFields[idx].productionUnit,
            biomass: watchedFields[idx].biomass,
          };
        } else {
          return field;
        }
      });

      setValue("manager", updatedFields);
    }
  }, [avgOfMeanWeight]);
  useEffect(() => {
    if (avgOfMeanLength && selectedMeanLengthId) {
      const updatedFields = fields.map((field, idx) => {
        if (field.id === selectedMeanLengthId) {
          return {
            ...field,
            meanLength: String(Number(avgOfMeanLength).toFixed(2)),
            batchNumber: watchedFields[idx].batchNumber,
            count: watchedFields[idx].count,
            productionUnit: watchedFields[idx].productionUnit,
            biomass: watchedFields[idx].biomass,
          };
        } else {
          return field;
        }
      });

      setValue("manager", updatedFields);
    }
  }, [avgOfMeanLength]);
  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
        className="modal-positioning"
        data-bs-backdrop="static"
        // onBackdropClick={() => reset()}
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
                    <TableContainer>
                      <Table stickyHeader aria-label="sticky table">
                        <TableHead
                          sx={{
                            textAlign: "center",
                          }}
                        >
                          <TableRow></TableRow>
                        </TableHead>

                        <TableBody>
                          <TableCell
                            sx={{
                              color: "#555555",
                              borderBottomColor: "#ececec",
                              borderBottomWidth: 2,
                              fontWeight: 700,
                              paddingLeft: {
                                lg: 10,
                                md: 7,
                                xs: 4,
                              },
                              textWrap: "nowrap",
                            }}
                            component="th"
                            scope="row"
                          ></TableCell>
                          <TableCell
                            className="table-padding"
                            sx={{
                              borderBottomWidth: 2,
                              borderBottomColor: "#ececec",
                              color: "#555555",
                              fontWeight: 500,
                              pl: 0,
                            }}
                          ></TableCell>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Stack>
                </Box>
              </Box>
            );
          })}

          <Confirmation
            open={openConfirmationModal}
            setOpen={setOpenConfirmationModal}
            remove={remove}
            watchedFields={watchedFields}
            selectedProductionFishaFarmId={selectedProduction?.fishFarmId}
            setIsStockDeleted={setIsStockDeleted}
            clearErrors={clearErrors}
          />
          <CalculateMeanWeigth
            open={isMeanWeigthCal}
            setOpen={setIsMeanWeigthCal}
            setAvgOfMeanWeight={setAvgOfMeanWeight}
          />
          <CalculateMeanLength
            open={isMeanLengthCal}
            setOpen={setIsMeanLengthCal}
            setAvgOfMeanLength={setAvgOfMeanLength}
          />
        </Stack>
      </Modal>
    </div>
  );
};

export default FishManageHistoryModal;
