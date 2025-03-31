"use client";
import { FeedPredictionHead } from "@/app/_lib/utils";
import {
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import Loader from "../Loader";

function AdHoc() {
  const [numberOfFish, setNumberOfFish] = useState<number>(7500);
  const [fishWeight, setFishWeight] = useState<number>(2);
  const [moralityRate, setMoralityRate] = useState<number>(0.05);
  const [data, setData] = useState<any[]>([]);
  const [volume, setVolume] = useState<number>(480);
  const [waterTemp, setWaterTemp] = useState<number>(24);
  const [loading, setLoading] = useState(false);
  const [timeInterval, setTimeInterval] = useState<number>(1);
  const [startDate, setStartDate] = useState();
  const [wasteFator, setWasteFator] = useState<number>(3);
  const [DE, setDE] = useState<number>(13.47);

  function calculateFBW() {
    const IBW = fishWeight;
    const T = waterTemp;
    let prevWeight = IBW;
    let prevNumberOfFish = numberOfFish;
    let newData = [];

    function calculateNoOfFish(noOfFish: number, days: number) {
      return (
        noOfFish * (1 - (Math.pow(moralityRate / 100 + timeInterval, days) - 1))
      );
    }

    function calculateFCRDE(fishWeight: number, de: number): number {
      return (0.00643 * fishWeight + 13) / (de / 1.03);
    }

    function calculateFeedingRate(fishSize: number, de: number): number {
      const power1 = Math.pow(fishSize, 0.33333);
      const logPart = -0.003206 + 0.001705 * Math.log(waterTemp - 11.25);
      const power2 = Math.pow(power1 + logPart * waterTemp, 3);
      const fraction = power2 / fishSize - 1;
      const part2 = (0.00643 * fishSize + 13) / (de / 1.03);

      return fraction * part2 * 100;
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
    function calculateFeedIntake(feedingRate: number, fishSize: number) {
      return (feedingRate * fishSize) / 100;
    }
    function calculateGrowth(fcr: number, feedIntake: number, day: number) {
      return fcr * feedIntake * day;
    }
    console.log(calculateGrowth(0.99, 0.143, 1));

    // function calculateTGC(IBW: number, T: number) {
    //   return -0.003 * IBW + 0.001705 * Math.log(T - 11.25) * T;
    // }
    // function calculateFCR(IBW: number, DE: number) {
    //   return (0.00643 * IBW + 13) / (DE / 1.03);
    // }
    // function calculateFormula(IBW: number, TGC: number, FCR: number) {
    //   return (Math.pow(Math.cbrt(IBW) + TGC, 3) / IBW - 1) * FCR * 100;
    // }
    for (let day = 1; day <= 10; day += 1) {
      const FBW = calculateFW(prevWeight, 0.35, 0.16, [T], [7]);
      prevNumberOfFish =
        day !== 1 ? calculateNoOfFish(prevNumberOfFish, 1) : prevNumberOfFish;

      // 🔹 **Fixed: Use updated `prevNumberOfFish` for biomass calculation**
      const biomass = (prevWeight * prevNumberOfFish) / 1000;
      const estfcr = Math.floor(calculateFCRDE(prevWeight, DE) * 100) / 100;
      const feedIntake = calculateFeedIntake(
        calculateFeedingRate(prevWeight, DE),
        prevWeight
      );
      const growth = calculateGrowth(estfcr, feedIntake, 1);
      const fishSize = prevWeight.toFixed(3) + growth;
      console.log(fishSize);

      // New day's data
      const newRow = {
        date: `Day ${day}`,
        days: day,
        averageProjectedTemp: T,
        numberOfFish: Math.round(prevNumberOfFish),
        moralityRate,
        fishSize: prevWeight.toFixed(3),
        growth,
        feedType:
          prevWeight >= 50
            ? "Tilapia Starter #3"
            : prevWeight >= 25
            ? "Tilapia Starter #2"
            : "Tilapia Starter #1",
        feedSize: prevWeight >= 50 ? "#3" : prevWeight >= 25 ? "#2" : "#1",
        feedProtein: 400,
        feedDE: 13.47,
        feedPrice: 32,
        estimatedFCR: estfcr,
        feedIntake,
        partitionedFCR: 0.0,
        feedingRate: calculateFeedingRate(prevWeight, DE).toFixed(2),
        feedCost: 49409,
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
  if (loading) {
    return <Loader />;
  }
  return (
    <Stack>
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
              <TableCell>Temp(c)</TableCell>
              <TableCell>Number of Fish</TableCell>
              <TableCell>Fish Size(g)</TableCell>
              <TableCell>Growth(g)</TableCell>
              <TableCell>Feed Type</TableCell>
              <TableCell>Feed Size</TableCell>
              <TableCell>Est. FCR</TableCell>
              <TableCell>Feed Intake (g)</TableCell>
              {/* <TableCell>Partitioned FCR</TableCell> */}
              <TableCell>Feeding Rate</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{row.date}</TableCell>
                <TableCell>{row.averageProjectedTemp}</TableCell>
                <TableCell>{row.numberOfFish}</TableCell>
                <TableCell>{row.fishSize}</TableCell>
                <TableCell>{row.growth}</TableCell>
                <TableCell>{row.feedType}</TableCell>
                <TableCell>{row.feedSize}</TableCell>
                <TableCell>{row.estimatedFCR}</TableCell>
                <TableCell>{row.feedIntake}</TableCell>
                {/* <TableCell>{row.partitionedFCR}</TableCell> */}
                <TableCell>{row.feedingRate}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {/* <div className="mb-5">
<FishGrowthChart
  xAxisData={data?.map((value) => value.date) || []}
  yData={data?.map((value) => value.fishWeight) || []}
/>
</div> */}
    </Stack>
  );
}

export default AdHoc;
