import {
  Box,
  Button,
  FormControlLabel,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Checkbox,
} from '@mui/material';
import toast from 'react-hot-toast';
import { useEffect, useMemo, useState } from 'react';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import { FarmGroupUnit, Production } from '@/app/_typeModels/production';
import dayjs from 'dayjs';
import { setLocalItem } from '@/app/_lib/utils';
import { useRouter } from 'next/navigation';
import { Farm, ProductionParaMeterType } from '@/app/_typeModels/Farm';
import { SingleOrganisation } from '@/app/_typeModels/Organization';
// const style = {
//   position: "absolute" as "absolute",
//   top: "50%",
//   left: "50%",
//   transform: "translate(-50%, -50%)",
//   width: 400,
//   bgcolor: "background.paper",
//   boxShadow: 24,
// };

interface Props {
  setOpen: (open: boolean) => void;
  open: boolean;
  selectedView: string | undefined;
  productions: Production[];
  selectedFarm: FarmGroupUnit;
}
interface GroupedData {
  farm: string;
  units: {
    id: number;
    productionUnit: {
      YearBasedPredicationProductionUnit?: ProductionParaMeterType[];
      id: string;
      name: string;
      type: string;
      capacity: string;
      waterflowRate: string;
      createdAt: string;
      updatedAt: string;
      farmId: string;
    };
    fishSupply: {
      batchNumber: string;
      age: string;
    };
    organisation: SingleOrganisation;
    farm: Farm;
    biomass: string;
    fishCount: string;
    batchNumberId: number;
    age: string;
    meanLength: string;
    meanWeight: string;
    stockingDensityKG: string;
    stockingDensityNM: string;
    stockingLevel: string;
    createdBy: string;
    updatedBy: string;
    createdAt: string;
    updatedAt: string;
    isManager?: boolean;
    field?: string;
    fishManageHistory: {
      id: number;
      fishFarmId: string;
      productionUnitId: string;
      biomass: string;
      fishCount: string;
      batchNumberId: number;
      currentDate: string;
      age: string;
      meanLength: string;
      meanWeight: string;
      stockingDensityKG: string;
      stockingDensityNM: string;
      stockingLevel: string;
      createdBy: string;
      updatedBy: string;
      createdAt: string;
      updatedAt: string;
      organisationId: number;
      field: string;
      productionId: number;
    }[];
    waterTemp: string;
    DO: string;
    TSS: string;
    NH4: string;
    NO3: string;
    NO2: string;
    ph: string;
    visibility: string;
    waterManageHistory?: {
      id: number;
      currentDate: string;
      waterTemp: string;
      DO: string;
      TSS: string;
      NH4: string;
      NO3: string;
      NO2: string;
      ph: string;
      visibility: string;
      productionId: number;
    }[];
  }[];
}
const Test: React.FC<Props> = ({
  setOpen,
  open,
  selectedView,
  productions,
  selectedFarm,
}) => {
  const router = useRouter();
  const startDate = dayjs().startOf('month').format();
  const endDate = dayjs().format();
  const [xAxisData, setXAxisData] = useState<(string | null)[]>([]);
  const unitOptions =
    selectedView === 'fish'
      ? [
          { key: 'Fish Count', yDataKey: 'fishCount', title: 'Fish Count' },
          { key: 'Biomass', yDataKey: 'biomass', title: 'Biomass' },
          { key: 'Mean Weight', yDataKey: 'meanWeight', title: 'Mean Weight' },
          { key: 'Mean Length', yDataKey: 'meanLength', title: 'Mean Length' },
          {
            key: 'Stocking density (kg/m³)',
            yDataKey: 'stockingDensityKG',
            title: `Stocking density (kg/${'m\u00B3'})`,
          },
          {
            key: 'Stocking density (n/m³)',
            yDataKey: 'stockingDensityNM',
            title: `Stocking density (n/${'m\u00B3'})`,
          },
        ]
      : [
          {
            key: 'waterTempChart',
            yDataKey: 'waterTemp',
            title: 'Water Temperature',
          },
          {
            key: 'dissolvedOxgChart',
            yDataKey: 'DO',
            title: 'Dissolved Oxygen',
          },
          { key: 'TSS', yDataKey: 'TSS', title: 'TSS' },
          { key: 'ammonia', yDataKey: 'NH4', title: 'Ammonia' },
          { key: 'nitrate', yDataKey: 'NO3', title: 'Nitrate' },
          { key: 'nitrite', yDataKey: 'NO2', title: 'Nitrite' },
          { key: 'ph', yDataKey: 'ph', title: 'PH' },
          { key: 'visibility', yDataKey: 'visibility', title: 'Visibility' },
        ];
  const groupedData: GroupedData = useMemo(() => {
    const filteredFarm = productions?.reduce<GroupedData[]>((result, item) => {
      // Find or create a farm group
      let farmGroup = result.find((group) => group.farm === item.farm.name);
      if (!farmGroup) {
        farmGroup = { farm: item.productionUnit.name, units: [] };
        result.push(farmGroup);
      }

      // Add the current production unit and all related data to the group
      farmGroup.units.push({
        id: item.id,
        productionUnit: item.productionUnit,
        fishSupply: item.fishSupply,
        organisation: item.organisation,
        farm: item.farm,
        biomass: item.biomass,
        fishCount: item.fishCount,
        batchNumberId: Number(item.batchNumberId),
        age: item.age,
        meanLength: item.meanLength,
        meanWeight: item.meanWeight,
        stockingDensityKG: item.stockingDensityKG,
        stockingDensityNM: item.stockingDensityNM,
        stockingLevel: item.stockingLevel,
        createdBy: item.createdBy,
        updatedBy: item.updatedBy,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        isManager: item.isManager,
        field: item.field,
        fishManageHistory: item.FishManageHistory,
        waterTemp: item.waterTemp,
        DO: item.DO,
        TSS: item.TSS,
        NH4: item.NH4,
        NO3: item.NO3,
        NO2: item.NO2,
        ph: item.ph,
        visibility: item.visibility,
        waterManageHistory: item.WaterManageHistory,
      });

      return result;
    }, []);
    return filteredFarm?.[0] ?? null;
  }, [productions]);
  const previewReport = () => {
    if (!selectedUnits?.length) {
      toast.dismiss();
      toast.error('Please select at least one unit to preview.');
      return;
    }
    const data = {
      selectedCharts: selectedUnits,
      xAxisData: xAxisData,
      groupedData: groupedData,
      currentFarm: {
        ...selectedFarm,
        WaterQualityPredictedParameters: [
          {
            YearBasedPredication:
              selectedFarm?.productionUnit?.YearBasedPredicationProductionUnit,
          },
        ],
      },
      startDate: startDate,
      endDate: endDate,
      dateDiff: dayjs(endDate).diff(dayjs(startDate), 'day'),
    };
    if (selectedView === 'water') {
      setLocalItem('waterPreviewData', data);
      router.push(
        `/dashboard/production/water/${selectedFarm?.productionUnit?.id}/chartPreview`,
      );
    } else {
      setLocalItem('fishPreviewData', data);
      router.push(
        `/dashboard/production/fish/${selectedFarm?.productionUnit?.id}/chartPreview`,
      );
    }
  };
  const [selectedUnits, setSelectedUnits] = useState<string[]>([]);
  const handleCheckboxChange = (key: string) => {
    setSelectedUnits((prev) =>
      prev.includes(key)
        ? prev.filter((chartKey) => chartKey !== key)
        : [...prev, key],
    );
  };
  useEffect(() => {
    if (groupedData?.units) {
      let createdAtArray;
      if (selectedView === 'water') {
        createdAtArray = groupedData.units
          ?.flatMap(
            (unit) =>
              unit.waterManageHistory?.map((history) => {
                const datePart = String(history.currentDate).split('T')[0];
                return dayjs(datePart).isValid() ? datePart : null;
              }) || [],
          )
          .filter(Boolean);
      } else {
        createdAtArray = groupedData.units.flatMap(
          (unit) =>
            unit.fishManageHistory?.map((history) => history.createdAt) || [],
        );
      }

      setXAxisData(createdAtArray);
    }
  }, [productions, groupedData]);
  return (
    // <Modal
    //   open={open}
    //   onClose={handleClose}
    //   aria-labelledby="modal-modal-title"
    //   aria-describedby="modal-modal-description"
    // >
    //   <Stack sx={style} borderRadius="14px">
    //     <Box
    //       bgcolor="#F5F6F8"
    //       paddingInline={3}
    //       paddingBlock={2}
    //       display="flex"
    //       justifyContent="space-between"
    //       gap={2}
    //       alignItems={"center"}
    //       sx={{
    //         borderTopLeftRadius: "14px",
    //         borderTopRightRadius: "14px",
    //       }}
    //     >
    //       <Typography
    //         id="modal-modal-title"
    //         variant="h6"
    //         component="h2"
    //         color="#67737F"
    //         fontSize={18}
    //         fontWeight={600}
    //       >
    //         Select Units
    //       </Typography>

    //       <Box
    //         display="flex"
    //         justifyContent="center"
    //         alignItems="center"
    //         sx={{
    //           opacity: 0.5,
    //           cursor: "pointer",
    //         }}
    //         onClick={handleClose}
    //       >
    //         <Image src={closeIcon} width={25} height={25} alt="Close Icon" />
    //       </Box>
    //     </Box>
    //     <Box>
    //       <Grid
    //         container
    //         sx={{
    //           padding: "20px",
    //         }}
    //       >
    //         {}
    //         <Grid item xs={3}>
    //           <FormControl>
    //             <RadioGroup
    //               aria-labelledby="demo-radio-buttons-group-label"
    //               value={"fish"}
    //               name="radio-buttons-group"
    //               //    onChange={(e) => {
    //               //      handleTableView(e.target.value);
    //               //    }}
    //               className="ic-radio"
    //               sx={{
    //                 display: "flex",
    //                 flexDirection: "row",
    //                 alignItems: "center",
    //                 flexWrap: "nowrap",
    //               }}
    //             >
    //               <FormControlLabel
    //                 value="fish"
    //                 control={<Radio />}
    //                 label="F1"
    //                 className="input-btn"
    //               />
    //             </RadioGroup>
    //           </FormControl>
    //         </Grid>
    //         <Grid item xs={3}>
    //           <FormControl>
    //             <RadioGroup
    //               aria-labelledby="demo-radio-buttons-group-label"
    //               value={"fish"}
    //               name="radio-buttons-group"
    //               //    onChange={(e) => {
    //               //      handleTableView(e.target.value);
    //               //    }}
    //               className="ic-radio"
    //               sx={{
    //                 display: "flex",
    //                 flexDirection: "row",
    //                 alignItems: "center",
    //                 flexWrap: "nowrap",
    //               }}
    //             >
    //               <FormControlLabel
    //                 value="fish"
    //                 control={<Radio />}
    //                 label="F2"
    //                 className="input-btn"
    //               />
    //             </RadioGroup>
    //           </FormControl>
    //         </Grid>
    //         <Grid item xs={3}>
    //           <FormControl>
    //             <RadioGroup
    //               aria-labelledby="demo-radio-buttons-group-label"
    //               value={"fish"}
    //               name="radio-buttons-group"
    //               //    onChange={(e) => {
    //               //      handleTableView(e.target.value);
    //               //    }}
    //               className="ic-radio"
    //               sx={{
    //                 display: "flex",
    //                 flexDirection: "row",
    //                 alignItems: "center",
    //                 flexWrap: "nowrap",
    //               }}
    //             >
    //               <FormControlLabel
    //                 value="fish"
    //                 control={<Radio />}
    //                 label="F3"
    //                 className="input-btn"
    //               />
    //             </RadioGroup>
    //           </FormControl>
    //         </Grid>
    //         <Grid item xs={3}>
    //           <FormControl>
    //             <RadioGroup
    //               aria-labelledby="demo-radio-buttons-group-label"
    //               value={"fish"}
    //               name="radio-buttons-group"
    //               //    onChange={(e) => {
    //               //      handleTableView(e.target.value);
    //               //    }}
    //               className="ic-radio"
    //               sx={{
    //                 display: "flex",
    //                 flexDirection: "row",
    //                 alignItems: "center",
    //                 flexWrap: "nowrap",
    //               }}
    //             >
    //               <FormControlLabel
    //                 value="fish"
    //                 control={<Radio />}
    //                 label="F"
    //                 className="input-btn"
    //               />
    //             </RadioGroup>
    //           </FormControl>
    //         </Grid>
    //         <Grid item xs={3}>
    //           <FormControl>
    //             <RadioGroup
    //               aria-labelledby="demo-radio-buttons-group-label"
    //               value={"fish"}
    //               name="radio-buttons-group"
    //               //    onChange={(e) => {
    //               //      handleTableView(e.target.value);
    //               //    }}
    //               className="ic-radio"
    //               sx={{
    //                 display: "flex",
    //                 flexDirection: "row",
    //                 alignItems: "center",
    //                 flexWrap: "nowrap",
    //               }}
    //             >
    //               <FormControlLabel
    //                 value="fish"
    //                 control={<Radio />}
    //                 label="F3"
    //                 className="input-btn"
    //               />
    //             </RadioGroup>
    //           </FormControl>
    //         </Grid>
    //         <Grid item xs={3}>
    //           <FormControl>
    //             <RadioGroup
    //               aria-labelledby="demo-radio-buttons-group-label"
    //               value={"fish"}
    //               name="radio-buttons-group"
    //               //    onChange={(e) => {
    //               //      handleTableView(e.target.value);
    //               //    }}
    //               className="ic-radio"
    //               sx={{
    //                 display: "flex",
    //                 flexDirection: "row",
    //                 alignItems: "center",
    //                 flexWrap: "nowrap",
    //               }}
    //             >
    //               <FormControlLabel
    //                 value="fish"
    //                 control={<Radio />}
    //                 label="Fish"
    //                 className="input-btn"
    //               />
    //             </RadioGroup>
    //           </FormControl>
    //         </Grid>
    //         <Grid item xs={3}>
    //           <FormControl>
    //             <RadioGroup
    //               aria-labelledby="demo-radio-buttons-group-label"
    //               value={"fish"}
    //               name="radio-buttons-group"
    //               //    onChange={(e) => {
    //               //      handleTableView(e.target.value);
    //               //    }}
    //               className="ic-radio"
    //               sx={{
    //                 display: "flex",
    //                 flexDirection: "row",
    //                 alignItems: "center",
    //                 flexWrap: "nowrap",
    //               }}
    //             >
    //               <FormControlLabel
    //                 value="fish"
    //                 control={<Radio />}
    //                 label="Fish"
    //                 className="input-btn"
    //               />
    //             </RadioGroup>
    //           </FormControl>
    //         </Grid>
    //         <Grid item xs={3}>
    //           <FormControl>
    //             <RadioGroup
    //               aria-labelledby="demo-radio-buttons-group-label"
    //               value={"fish"}
    //               name="radio-buttons-group"
    //               //    onChange={(e) => {
    //               //      handleTableView(e.target.value);
    //               //    }}
    //               className="ic-radio"
    //               sx={{
    //                 display: "flex",
    //                 flexDirection: "row",
    //                 alignItems: "center",
    //                 flexWrap: "nowrap",
    //               }}
    //             >
    //               <FormControlLabel
    //                 value="fish"
    //                 control={<Radio />}
    //                 label="Fish"
    //                 className="input-btn"
    //               />
    //             </RadioGroup>
    //           </FormControl>
    //         </Grid>
    //         <Grid item xs={3}>
    //           <FormControl>
    //             <RadioGroup
    //               aria-labelledby="demo-radio-buttons-group-label"
    //               value={"fish"}
    //               name="radio-buttons-group"
    //               //    onChange={(e) => {
    //               //      handleTableView(e.target.value);
    //               //    }}
    //               className="ic-radio"
    //               sx={{
    //                 display: "flex",
    //                 flexDirection: "row",
    //                 alignItems: "center",
    //                 flexWrap: "nowrap",
    //               }}
    //             >
    //               <FormControlLabel
    //                 value="fish"
    //                 control={<Radio />}
    //                 label="F"
    //                 className="input-btn"
    //               />
    //             </RadioGroup>
    //           </FormControl>
    //         </Grid>
    //       </Grid>
    //       <Box
    //         sx={{
    //           display: "flex",
    //           justifyContent: "end",
    //           gap: "10px",
    //           margin: "20px",
    //         }}
    //       >
    //         <Button
    //           sx={{
    //             background: "#06A19B",
    //             fontWeight: "bold",
    //             color: "white",
    //             padding: "8px 20px",
    //             width: "fit-content",
    //             textTransform: "capitalize",
    //             borderRadius: "8px",
    //           }}
    //         >
    //           See all units
    //         </Button>
    //         <Button
    //           sx={{
    //             border: " 2px solid #06A19B",
    //             fontWeight: "bold",
    //             color: "#06A19B",
    //             padding: "8px 20px",
    //             width: "fit-content",
    //             textTransform: "capitalize",
    //             borderRadius: "8px",
    //           }}
    //         >
    //           Preview
    //         </Button>
    //         <Button
    //           sx={{
    //             background: "#06A19B",
    //             fontWeight: "bold",
    //             color: "white",
    //             padding: "8px 20px",
    //             width: "fit-content",
    //             textTransform: "capitalize",
    //             borderRadius: "8px",
    //           }}
    //         >
    //           Cancel
    //         </Button>
    //       </Box>
    //     </Box>
    //   </Stack>
    // </Modal>
    <Dialog
      open={open}
      onClose={() => {
        setOpen(false);
        setSelectedUnits([]);
      }}
    >
      <DialogTitle>Select Units</DialogTitle>
      <DialogContent>
        {unitOptions.map(({ key, title }) => (
          <FormControlLabel
            key={key}
            control={
              <Checkbox
                checked={selectedUnits.includes(key)}
                onChange={() => handleCheckboxChange(key)}
                className="checkbox-border"
                icon={<RadioButtonUncheckedIcon />}
                checkedIcon={<CheckCircleIcon />}
                sx={{
                  '&.Mui-checked': {
                    color: '#06A19B',
                  },
                }}
              />
            }
            label={title}
          />
        ))}
      </DialogContent>
      <DialogActions
        sx={{
          p: 3,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'end',
            gap: '10px',
            margin: '20px',
          }}
        >
          <Button
            sx={{
              background: '#06A19B',
              fontWeight: 'bold',
              color: 'white',
              padding: '8px 20px',
              width: 'fit-content',
              textTransform: 'capitalize',
              borderRadius: '8px',
            }}
            onClick={() => {
              setSelectedUnits(unitOptions.map((unit) => unit.key));
            }}
          >
            Select all units
          </Button>
          <Button
            sx={{
              border: ' 2px solid #06A19B',
              fontWeight: 'bold',
              color: '#06A19B',
              padding: '8px 20px',
              width: 'fit-content',
              textTransform: 'capitalize',
              borderRadius: '8px',
            }}
            onClick={previewReport}
          >
            Preview
          </Button>
          <Button
            onClick={() => {
              setOpen(false);
              setSelectedUnits([]);
            }}
            sx={{
              background: '#06A19B',
              fontWeight: 'bold',
              color: 'white',
              padding: '8px 20px',
              width: 'fit-content',
              textTransform: 'capitalize',
              borderRadius: '8px',
            }}
          >
            Cancel
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default Test;
