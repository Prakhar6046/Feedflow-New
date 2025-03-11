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
