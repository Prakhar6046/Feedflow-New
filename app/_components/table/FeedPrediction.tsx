"use client";
import AdHoc, { FishFeedingData } from "@/app/_components/feedPrediction/AdHoc";
import FeedingPlan, {
  FarmsFishGrowth,
} from "@/app/_components/feedPrediction/FeedingPlan";
import FeedingSummary from "@/app/_components/feedPrediction/FeedingSummary";
import {
  CommonFeedPredictionHead,
  exportFeedPredictionToXlsx,
  FeedPredictionHead,
} from "@/app/_lib/utils";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import { Box, Button, Stack, Tab } from "@mui/material";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import Loader from "@/app/_components/Loader";
import ProductionManagerFilter from "@/app/_components/ProductionManagerFilter";
import { Farm } from "@/app/_typeModels/Farm";
import {
  selectAllFarms,
  selectEndDate,
  selectStartDate,
} from "@/lib/features/commonFilters/commonFilters";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { FarmGroup, Production } from "@/app/_typeModels/production";
import { selectCurrentFarmTab } from "@/lib/features/feedPrediction/feedPredictionSlice";
interface Props {
  productions: Production[];
  farms: Farm[];
}
const FeedPredictionTable = ({ farms, productions }: Props) => {
  const dispatch = useAppDispatch();
  const allFarms = useAppSelector(selectAllFarms);
  const startDate = useAppSelector(selectStartDate);
  const endDate = useAppSelector(selectEndDate);
  const currentFarmTab = useAppSelector(selectCurrentFarmTab);
  const [adHocData, setAdHocData] = useState<FishFeedingData[]>([]);
  const [feedPlanData, setFeedPlanData] = useState<FarmsFishGrowth[][]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedFeeding, setSelectedFeeding] = useState<string>("feedingPlan");
  const [productionData, setProductionData] = useState<FarmGroup[]>();
  const CreateFeedPredictionPDF = async () => {
    let data;
    if (selectedFeeding === "adhoc") {
      if (!adHocData.length) {
        return;
      }
      data = adHocData?.map((val) => {
        return {
          date: val.date,
          teamp: val.averageProjectedTemp,
          noOfFish: val.numberOfFish,
          fishSize: val.fishSize,
          growth: val.growth,
          feedType: val.feedType,
          feedSize: val.feedSize,
          estimatedFCR: val.estimatedFCR,
          feedIntake: val.feedIntake,
          feedingRate: val.feedingRate,
        };
      });
    } else if (selectedFeeding === "feedingPlan") {
      if (!feedPlanData?.length && !currentFarmTab) {
        return;
      }
      data = feedPlanData?.flatMap((farm) =>
        farm
          ?.filter((val) => `${val.farm}/${val.unit}` === currentFarmTab)
          .flatMap((growth: any) =>
            growth.fishGrowthData.map((val: any) => ({
              date: val.date,
              teamp: val.averageProjectedTemp,
              noOfFish: val.numberOfFish,
              fishSize: val.fishSize,
              growth: val.growth,
              feedType: val.feedType,
              feedSize: val.feedSize,
              estimatedFCR: val.estimatedFCR,
              feedIntake: val.feedIntake,
              feedingRate: val.feedingRate,
            }))
          )
      );
    }
    setLoading(true);
    const chunkArray = <T,>(arr: any, chunkSize: number): T[][] => {
      const results: T[][] = [];
      for (let i = 0; i < arr.length; i += chunkSize) {
        results.push(arr.slice(i, i + chunkSize));
      }
      return results;
    };
    const pdf = new jsPDF({ orientation: "landscape" });
    const chunks = chunkArray(data, 20);

    for (let i = 0; i < chunks.length; i++) {
      const tempContainer = document.createElement("div");
      document.body.appendChild(tempContainer);
      const chartDiv = document.createElement("div");
      tempContainer.appendChild(chartDiv);
      const root = createRoot(chartDiv);

      const currentChunk = chunks[i];

      root.render(
        <div
          style={{
            maxWidth: "100vw",
            width: "100%",
            height: "100%",
            fontFamily: "Arial, sans-serif",
            margin: "auto",
          }}
        >
          <div
            style={{
              padding: "12px 20px",
              backgroundColor: "rgb(6,161,155)",
              boxShadow: "0 0 3px rgb(6, 161, 155)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <img src="/static/img/logo-bigone.jpg" alt="Logo" width={200} />
            <div>
              <h6
                style={{
                  marginBottom: "4px",
                  fontSize: "16px",
                  color: "white",
                }}
              >
                Feed Prediction Report
              </h6>
            </div>
          </div>
          <div
            style={{
              width: "100%",
              marginBottom: "20px",
              display: "flex",
              alignItems: "start",
            }}
          >
            <div
              style={{
                width: "100%",
                margin: "20px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: "12px",
                  color: "#333",
                  marginTop: "16px",
                }}
              >
                <thead>
                  <tr>
                    {CommonFeedPredictionHead?.map(
                      (head: string, idx: number) => (
                        <th
                          key={idx}
                          style={{
                            border: "1px solid #ccc",
                            padding: "8px 12px",
                            textAlign: "left",
                            borderTopLeftRadius:
                              idx === FeedPredictionHead.length - 1
                                ? "8px"
                                : "0px",
                            background: "#efefef",
                          }}
                        >
                          {head}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody>
                  {currentChunk?.map((row: any, index: number) => (
                    <tr key={index}>
                      <td
                        style={{
                          border: "1px solid #ccc",
                          padding: "8px 12px",
                        }}
                      >
                        {row.date}
                      </td>
                      <td
                        style={{
                          border: "1px solid #ccc",
                          padding: "8px 12px",
                        }}
                      >
                        {row.averageProjectedTemp}
                      </td>
                      <td
                        style={{
                          border: "1px solid #ccc",
                          padding: "8px 12px",
                        }}
                      >
                        {row.numberOfFish}
                      </td>
                      <td
                        style={{
                          border: "1px solid #ccc",
                          padding: "8px 12px",
                        }}
                      >
                        {row.fishSize}
                      </td>
                      <td
                        style={{
                          border: "1px solid #ccc",
                          padding: "8px 12px",
                        }}
                      >
                        {row.growth}
                      </td>
                      <td
                        style={{
                          border: "1px solid #ccc",
                          padding: "8px 12px",
                        }}
                      >
                        {row.feedType}
                      </td>
                      <td
                        style={{
                          border: "1px solid #ccc",
                          padding: "8px 12px",
                        }}
                      >
                        {row.feedSize}
                      </td>
                      <td
                        style={{
                          border: "1px solid #ccc",
                          padding: "8px 12px",
                        }}
                      >
                        {row.estimatedFCR}
                      </td>
                      <td
                        style={{
                          border: "1px solid #ccc",
                          padding: "8px 12px",
                        }}
                      >
                        {row.feedIntake}
                      </td>
                      <td
                        style={{
                          border: "1px solid #ccc",
                          padding: "8px 12px",
                        }}
                      >
                        {row.feedingRate}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      );

      await new Promise((resolve) => setTimeout(resolve, 800));

      const canvas = await html2canvas(chartDiv);
      const imgData = canvas.toDataURL("image/png");
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      if (i > 0) pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

      root.unmount();
      tempContainer.remove();
    }

    pdf.save(`${currentFarmTab}.pdf`);
    setLoading(false);
  };
  const createxlsxFile = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    if (selectedFeeding === "adhoc") {
      if (!adHocData.length) {
        return;
      }
      const data = adHocData?.map((val) => {
        return {
          date: val.date,
          teamp: val.averageProjectedTemp,
          noOfFish: val.numberOfFish,
          fishSize: val.fishSize,
          growth: val.growth,
          feedType: val.feedType,
          feedSize: val.feedSize,
          estimatedFCR: val.estimatedFCR,
          feedIntake: val.feedIntake,
          feedingRate: val.feedingRate,
        };
      });
      exportFeedPredictionToXlsx(
        e,
        CommonFeedPredictionHead,
        data,
        "ad_Hoc_Data"
      );
    } else if (selectedFeeding === "feedingPlan") {
      if (!feedPlanData?.length && !currentFarmTab) {
        return;
      }
      // console.log(feedPlanData);
      const data = feedPlanData?.flatMap((farm) =>
        farm
          ?.filter((val) => `${val.farm}/${val.unit}` === currentFarmTab)
          .flatMap((growth: any) =>
            growth.fishGrowthData.map((val: any) => ({
              date: val.date,
              teamp: val.averageProjectedTemp,
              noOfFish: val.numberOfFish,
              fishSize: val.fishSize,
              growth: val.growth,
              feedType: val.feedType,
              feedSize: val.feedSize,
              estimatedFCR: val.estimatedFCR,
              feedIntake: val.feedIntake,
              feedingRate: val.feedingRate,
            }))
          )
      );
      exportFeedPredictionToXlsx(
        e,
        CommonFeedPredictionHead,
        data,
        `${currentFarmTab}`
      );
    }
  };
  const handleChange = (event: any, newValue: string) => {
    setSelectedFeeding(newValue);
  };
  const groupedData: FarmGroup[] = productions?.reduce((result: any, item) => {
    // Find or create a farm group
    let farmGroup: any = result.find(
      (group: any) => group.farm === item.farm.name
    );
    if (!farmGroup) {
      farmGroup = { farm: item.farm.name, units: [] };
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
      batchNumberId: item.batchNumberId,
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
      WaterManageHistoryAvgrage: item.WaterManageHistoryAvgrage,
    });

    return result;
  }, []);
  useEffect(() => {
    if (groupedData) {
      setProductionData(groupedData);
    }
  }, []);
  useEffect(() => {
    if (loading) {
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.position = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.position = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
    };
  }, [loading]);

  if (loading) {
    return (
      <Box
        sx={{
          position: "absolute",
          width: "100%",
          height: "100%",
        }}
      >
        <Loader />
      </Box>
    );
  }
  return (
    <>
      <TabContext value={String(selectedFeeding)}>
        <Stack
          display={"flex"}
          rowGap={2}
          columnGap={5}
          mb={2}
          justifyContent={"space-between"}
          sx={{
            flexDirection: {
              md: "row",
              xs: "column",
            },
            alignItems: {
              md: "center",
              xs: "start",
            },
          }}
        >
          <Box>
            <TabList
              onChange={handleChange}
              aria-label="lab API tabs example"
              className=" production-tabs"
            >
              <Tab
                label="Feeding Plan"
                value="feedingPlan"
                className={
                  selectedFeeding === "feedingPlan" ? "active-tab" : ""
                }
              />
              {/* <Tab
                label="Feeding Summary"
                value="feedingSummary"
                className={
                  selectedFeeding === "feedingSummary" ? "active-tab" : ""
                }
              /> */}
              <Tab
                label="Adhoc"
                value="adhoc"
                className={selectedFeeding === "adhoc" ? "active-tab" : ""}
              />
            </TabList>
          </Box>
        </Stack>
      </TabContext>
      {selectedFeeding === "feedingPlan" && (
        <ProductionManagerFilter
          farmsList={farms}
          groupedData={groupedData}
          setProductionData={setProductionData}
          reset={false}
        />
      )}
      <Button
        id="basic-button"
        type="button"
        variant="contained"
        onClick={(e) => createxlsxFile(e)}
        sx={{
          background: "#fff",
          color: "#06A19B",
          fontWeight: 600,
          padding: "6px 16px",
          width: "fit-content",
          textTransform: "capitalize",
          borderRadius: "8px",
          border: "1px solid #06A19B",
          marginBottom: "10px",
          marginTop: "10px",
          boxShadow: "none",
          "&:hover": {
            boxShadow: "none",
          },
        }}
      >
        Create .xlsx File
      </Button>
      {/* 
      <Button
        id="basic-button"
        type="button"
        variant="contained"
        onClick={CreateFeedPredictionPDF}
        sx={{
          background: "#fff",
          color: "#06A19B",
          fontWeight: 600,
          padding: "6px 16px",
          width: "fit-content",
          textTransform: "capitalize",
          borderRadius: "8px",
          border: "1px solid #06A19B",
          marginBottom: "10px",
          boxShadow: "none",
          "&:hover": {
            boxShadow: "none",
          },
        }}
      >
        Create PDF
      </Button> */}
      {selectedFeeding === "feedingPlan" ? (
        <FeedingPlan
          productionData={productionData}
          startDate={startDate}
          endDate={endDate}
          data={feedPlanData}
          setData={setFeedPlanData}
        />
      ) : selectedFeeding === "feedingSummary" ? (
        <FeedingSummary />
      ) : (
        <AdHoc data={adHocData} setData={setAdHocData} />
      )}
    </>
  );
};

export default FeedPredictionTable;
