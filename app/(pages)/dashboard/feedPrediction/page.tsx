"use client";
import BasicBreadcrumbs from "@/app/_components/Breadcrumbs";
import AdHoc from "@/app/_components/feedPrediction/AdHoc";
import FeedingPlan from "@/app/_components/feedPrediction/FeedingPlan";
import FeedingSummary from "@/app/_components/feedPrediction/FeedingSummary";
import {
  exportFeedPredictionToXlsx,
  FeedPredictionHead,
} from "@/app/_lib/utils";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import { Box, Button, Stack, Tab } from "@mui/material";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { NextPage } from "next";
import { useState } from "react";
import { createRoot } from "react-dom/client";
import Loader from "@/app/_components/Loader";
import ProductionManagerFilter from "@/app/_components/ProductionManagerFilter";
const Page: NextPage = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedFeeding, setSelectedFeeding] = useState<string>("feedingPlan");
  const CreateFeedPredictionPDF = async () => {
    setLoading(true);
    const pdf = new jsPDF({ orientation: "landscape" });
    const tempContainer = document.createElement("div");
    document.body.appendChild(tempContainer);
    const chartDiv = document.createElement("div");
    tempContainer.appendChild(chartDiv);
    const root = createRoot(chartDiv);
    let chartAdded = false;
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
              marginBottom: "20px",
              display: "flex",
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
                  {FeedPredictionHead?.map((head: string, idx: number) => (
                    <th
                      key={idx}
                      style={{
                        border: "1px solid #ccc",
                        padding: "8px 12px",
                        textAlign: "left",
                        borderTopLeftRadius:
                          idx === FeedPredictionHead.length - 1 ? "8px" : "0px",
                        background: "#efefef",
                      }}
                    >
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row, index) => (
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
                      {row.days}
                    </td>
                    <td
                      style={{
                        border: "1px solid #ccc",
                        padding: "8px 12px",
                      }}
                    >
                      {row.waterTemp}
                    </td>
                    <td
                      style={{
                        border: "1px solid #ccc",
                        padding: "8px 12px",
                      }}
                    >
                      {row.fishWeight}
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
                      {row.biomass}
                    </td>
                    <td
                      style={{
                        border: "1px solid #ccc",
                        padding: "8px 12px",
                      }}
                    >
                      {row.stockingDensityNM3}
                    </td>
                    <td
                      style={{
                        border: "1px solid #ccc",
                        padding: "8px 12px",
                      }}
                    >
                      {row.stockingDensityKg}
                    </td>
                    <td
                      style={{
                        border: "1px solid #ccc",
                        padding: "8px 12px",
                      }}
                    >
                      {row.feedPhase}
                    </td>
                    <td
                      style={{
                        border: "1px solid #ccc",
                        padding: "8px 12px",
                      }}
                    >
                      {row.feedProtein}
                    </td>
                    <td
                      style={{
                        border: "1px solid #ccc",
                        padding: "8px 12px",
                      }}
                    >
                      {row.feedDE}
                    </td>
                    <td
                      style={{
                        border: "1px solid #ccc",
                        padding: "8px 12px",
                      }}
                    >
                      {row.feedPrice}
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
                      {row.estimatedFCR}
                    </td>
                    <td
                      style={{
                        border: "1px solid #ccc",
                        padding: "8px 12px",
                      }}
                    >
                      {row.partitionedFCR}
                    </td>
                    <td
                      style={{
                        border: "1px solid #ccc",
                        padding: "8px 12px",
                      }}
                    >
                      {row.feedIntake}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
    // Wait for rendering to complete
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Capture as image
    const canvas = await html2canvas(chartDiv);
    const imgData = canvas.toDataURL("image/png");

    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    if (chartAdded) pdf.addPage();
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

    chartAdded = true;

    root.unmount();
    tempContainer.removeChild(chartDiv);
    document.body.removeChild(tempContainer);
    pdf.save("feed_pdf.pdf");
    setLoading(false);
  };
  const handleChange = (event: any, newValue: string) => {
    setSelectedFeeding(newValue);
  };

  return (
    <>
      <BasicBreadcrumbs
        heading={"Thermal growth coefficient Demo"}
        hideSearchInput={true}
      />
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
              <Tab
                label="Feeding Summary"
                value="feedingSummary"
                className={
                  selectedFeeding === "feedingSummary" ? "active-tab" : ""
                }
              />
              <Tab
                label="Adhoc"
                value="adhoc"
                className={selectedFeeding === "adhoc" ? "active-tab" : ""}
              />
            </TabList>
          </Box>
        </Stack>
      </TabContext>
      {/* <ProductionManagerFilter
        // allFarms={allFarms}
        // allUnits={allUnits}
        // handleYearChange={handleYearChange}
        // selectedAverage={selectedAverage}
        handleResetFilters={handleResetFilters}
        // selectedDropDownUnits={
        //   selectedDropDownUnits ? selectedDropDownUnits : []
        // }
        // selectedDropDownYears={
        //   selectedDropDownYears ? selectedDropDownYears : []
        // }
        // selectedDropDownfarms={
        //   selectedDropDownfarms ? selectedDropDownfarms : []
        // }
        // setSelectedDropDownfarms={setSelectedDropDownfarms}
        // setSelectedDropDownUnits={setSelectedDropDownUnits}
        // setEndMonth={setEndMonth}
        // setStartMonth={setStartMonth}
        // setSelectedAverage={setSelectedAverage}
        // startMonth={Number(startMonth)}
        // endMonth={Number(endMonth)}
        // createXlsxFile={CreateXlsxReport}
        selectedView={"feed prediction"}
        farmsList={farms}
      /> */}
      <Button
        id="basic-button"
        type="button"
        variant="contained"
        onClick={(e) => exportFeedPredictionToXlsx(e, data)}
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
        Create .xlsx File
      </Button>
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
      </Button>
      {selectedFeeding === "feedingPlan" ? (
        <FeedingPlan />
      ) : selectedFeeding === "feedingSummary" ? (
        <FeedingSummary />
      ) : (
        <AdHoc />
      )}
    </>
  );
};

export default Page;
