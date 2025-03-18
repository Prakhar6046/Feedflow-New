"use client";
import { NextPage } from "next";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@mui/material";
import BasicBreadcrumbs from "@/app/_components/Breadcrumbs";
import FishGrowthChart from "@/app/_components/charts/FishGrowthChart";
import { exportFeedPredictionToXlsx } from "@/app/_lib/utils";
import jsPDF from "jspdf";
import { createRoot } from "react-dom/client";
import html2canvas from "html2canvas";
import { FeedPredictionHead } from "@/app/_lib/utils";
const Page: NextPage = () => {
  const [data, setData] = useState<any[]>([]);
  const [fishWeight, setFishWeight] = useState(0.2);
  const [numberOfFish, setNumberOfFish] = useState(4000);
  const [volume, setVolume] = useState(480);
  const [waterTemp, setWaterTemp] = useState(27);

  function calculateFBW() {
    const IBW = fishWeight;
    const T = waterTemp;
    let prevWeight = IBW;
    let prevNumberOfFish = numberOfFish; // Initial number of fish
    let newData = [];

    function calculateNoOfFish(noOfFish: number, days: number) {
      return Math.round(noOfFish * (1 - (Math.pow(0.05 / 100 + 1, days) - 1)));
    }

    function calculateFW(
      IBW: number,
      b: number,
      TGC: number,
      tValues: number[],
      dValues: number[]
    ) {
      if (tValues.length !== dValues.length) {
        throw new Error("tValues and dValues must have the same length");
      }

      // Compute summation of t * d
      let sum_td = tValues.reduce(
        (sum, t, index) => sum + t * dValues[index],
        0
      );

      // Apply the formula
      return Math.pow(Math.pow(IBW, b) + (TGC / 100) * sum_td, 1 / b);
    }

    for (let day = 0; day <= 150; day += 7) {
      const FBW = calculateFW(prevWeight, 0.35, 0.16, [T], [7]);

      // Update number of fish dynamically
      prevNumberOfFish = calculateNoOfFish(prevNumberOfFish, day);

      // 🔹 **Fixed: Use updated `prevNumberOfFish` for biomass calculation**
      const biomass = (prevWeight * prevNumberOfFish) / 1000;

      // 🔹 **Fixed: Use `prevNumberOfFish` in stocking density calculations**
      const stockingDensityNM3 = prevNumberOfFish / volume;
      const stockingDensityKg = biomass / volume;

      // New day's data
      const newRow = {
        date: `Day ${day}`,
        days: day,
        waterTemp: T,
        fishWeight: prevWeight.toFixed(2),
        numberOfFish: prevNumberOfFish,
        biomass: biomass.toFixed(2),
        stockingDensityNM3: stockingDensityNM3.toFixed(2),
        stockingDensityKg: stockingDensityKg.toFixed(2),
        feedPhase: "Tilapia Starter (2mm)",
        feedProtein: 36,
        feedDE: 13.22,
        feedPrice: 1550,
        growth: (FBW - prevWeight).toFixed(2),
        estimatedFCR: 1.21,
        partitionedFCR: 0.0,
        feedIntake: 0,
      };

      // Store new data
      newData.push(newRow);
      prevWeight = FBW; // Update weight for next day
    }
    setData(newData);
  }
  const CreateFeedPredictionPDF = async () => {
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
  };
  useEffect(() => {
    if (numberOfFish && volume && waterTemp && fishWeight) {
      calculateFBW();
    }
  }, [fishWeight, numberOfFish, volume, waterTemp]);

  return (
    <>
      <BasicBreadcrumbs
        heading={"Thermal growth coefficient Demo"}
        hideSearchInput={true}
      />
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
      <div className="p-4">
        <label htmlFor="fishweight">Fish Weight (g)</label>
        <input
          type="number"
          id="fishweight"
          value={fishWeight}
          onChange={(e) => setFishWeight(Number(e.target.value))}
          className="border p-2 rounded w-full"
        />

        <label htmlFor="numberOfFish">Number Of Fish</label>
        <input
          type="number"
          id="numberOfFish"
          value={numberOfFish}
          onChange={(e) => setNumberOfFish(Number(e.target.value))}
          className="border p-2 rounded w-full"
        />

        <label htmlFor="volume">Volume</label>
        <input
          type="number"
          id="volume"
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          className="border p-2 rounded w-full"
        />

        <label htmlFor="watertemp">Water Temp (°C)</label>
        <input
          type="number"
          id="watertemp"
          value={waterTemp}
          onChange={(e) => setWaterTemp(Number(e.target.value))}
          className="border p-2 rounded w-full"
        />
      </div>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Days</TableCell>
              <TableCell>Water Temp</TableCell>
              <TableCell>Fish Weight (g)</TableCell>
              <TableCell>Number of Fish</TableCell>
              <TableCell>Biomass (kg)</TableCell>
              <TableCell>Stocking Density</TableCell>
              <TableCell>Stocking Density Kg/m3</TableCell>
              <TableCell>Feed Phase</TableCell>
              <TableCell>Feed Protein (%)</TableCell>
              <TableCell>Feed DE (MJ/kg)</TableCell>
              <TableCell>Feed Price ($)</TableCell>
              <TableCell>Growth (g)</TableCell>
              <TableCell>Est. FCR</TableCell>
              <TableCell>Partitioned FCR</TableCell>
              <TableCell>Feed Intake (g)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{row.date}</TableCell>
                <TableCell>{row.days}</TableCell>
                <TableCell>{row.waterTemp}</TableCell>
                <TableCell>{row.fishWeight}</TableCell>
                <TableCell>{row.numberOfFish}</TableCell>
                <TableCell>{row.biomass}</TableCell>
                <TableCell>{row.stockingDensityNM3}</TableCell>
                <TableCell>{row.stockingDensityKg}</TableCell>
                <TableCell>{row.feedPhase}</TableCell>
                <TableCell>{row.feedProtein}</TableCell>
                <TableCell>{row.feedDE}</TableCell>
                <TableCell>{row.feedPrice}</TableCell>
                <TableCell>{row.growth}</TableCell>
                <TableCell>{row.estimatedFCR}</TableCell>
                <TableCell>{row.partitionedFCR}</TableCell>
                <TableCell>{row.feedIntake}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <div className="mb-5">
        <FishGrowthChart
          xAxisData={data?.map((value) => value.date) || []}
          yData={data?.map((value) => value.fishWeight) || []}
        />
      </div>
    </>
  );
};

export default Page;
