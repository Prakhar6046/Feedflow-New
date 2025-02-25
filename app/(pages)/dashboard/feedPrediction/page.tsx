// "use client";
// import { NextPage } from "next";
// import { useEffect, useState } from "react";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
// } from "@mui/material";
// import BasicBreadcrumbs from "@/app/_components/Breadcrumbs";
// interface Props {}
// // const data = [
// //   {
// //     date: "1-Feb-13",
// //     days: 0,
// //     waterTemp: 27,
// //     fishWeight: 10.0,
// //     numberOfFish: 4000,
// //     biomass: 40.0,
// //     stockingDensityNM3: 8.3,
// //     stockingDensityKg: 0.08,
// //     feedPhase: "Tilapia Starter (2mm)",
// //     feedProtein: 36,
// //     feedDE: 13.22,
// //     feedPrice: 1550,
// //     growth: 0.0,
// //     estimatedFCR: 1.21,
// //     partitionedFCR: 0.0,
// //     feedIntake: 0,
// //   },
// // ];
// const Page: NextPage<Props> = ({}) => {
//   const [data, setData] = useState([]);
//   const [fishWeight, setFishWeight] = useState(10);
//   const [numberOfFish, setNumberOfFish] = useState(4000);
//   const [volume, setVolume] = useState(480);
//   const [waterTemp, setWaterTemp] = useState(27);
//   function calculateFBW(fWeigt, noFish, Vol, WTemp) {
//     const IBW = fWeigt;
//     const oneMinusB = 0.333333;
//     const b = 1 - oneMinusB; // b = 0.666667
//     const TGC = 0.13;
//     const t = 15;
//     const T = 27;

//     // Compute IBW^(1-b)
//     const part1 = Math.pow(IBW, oneMinusB);

//     // Compute sum(T * t)
//     const sumTt = T * t;

//     // Compute (TGC / 100 * sum(T * t))^(1/(1-b))
//     const part2 = Math.pow((TGC / 100) * sumTt, 1 / oneMinusB);

//     // Final FBW calculation
//     const FBW = part1 + part2;
//     // console.log(FBW);
//     // biomass
//     const biomass = (IBW * noFish) / 1000;

//     // Stocking density
//     const stockingDensityNM3 = noFish / Vol;

//     const stockingDensityKg = biomass / Vol;
//     const output = {
//       date: "1-Feb-13",
//       days: 0,
//       waterTemp: WTemp,
//       fishWeight: fWeigt,
//       numberOfFish: noFish,
//       biomass,
//       stockingDensityNM3,
//       stockingDensityKg,
//       feedPhase: "Tilapia Starter (2mm)",
//       feedProtein: 36,
//       feedDE: 13.22,
//       feedPrice: 1550,
//       growth: 0.0,
//       estimatedFCR: 1.21,
//       partitionedFCR: 0.0,
//       feedIntake: 0,
//     };

//     setData((prev) => {
//       return [...prev, output];
//     });
//     return FBW;
//   }

//   useEffect(() => {
//     if (numberOfFish && volume && waterTemp && fishWeight) {
//       calculateFBW(fishWeight, numberOfFish, volume, waterTemp);
//     }
//   }, []);
//   return (
//     <>
//       <BasicBreadcrumbs heading={"Feed Prediction"} />
//       <div>
//         <label htmlFor="fishweight">Fish Weight</label>
//         <input
//           type="text"
//           id="fishweight"
//           value={fishWeight}
//           onChange={(e) => setFishWeight(e.target.value)}
//           className="border p-2 rounded w-full"
//         />

//         <label htmlFor="numberOfFish">Number Of Fish</label>
//         <input
//           type="number"
//           id="numberOfFish"
//           value={numberOfFish}
//           onChange={(e) => setNumberOfFish(e.target.value)}
//           className="border p-2 rounded w-full"
//         />

//         <label htmlFor="volume">Volume</label>
//         <input
//           type="number"
//           id="volume"
//           value={volume}
//           onChange={(e) => setVolume(e.target.value)}
//           className="border p-2 rounded w-full"
//         />

//         <label htmlFor="watertemp">Water Temp</label>
//         <input
//           type="number"
//           id="watertemp"
//           value={waterTemp}
//           onChange={(e) => setWaterTemp(e.target.value)}
//           className="border p-2 rounded w-full"
//         />
//       </div>

//       <TableContainer component={Paper}>
//         <Table>
//           <TableHead>
//             <TableRow>
//               <TableCell>Date</TableCell>
//               <TableCell>Days</TableCell>
//               <TableCell>Water Temp</TableCell>
//               <TableCell>Fish Weight (g)</TableCell>
//               <TableCell>Number of Fish</TableCell>
//               <TableCell>Biomass (kg)</TableCell>
//               <TableCell>Stocking Density</TableCell>
//               <TableCell>Stocking Density Kg/m3</TableCell>
//               <TableCell>Feed Phase</TableCell>
//               <TableCell>Feed Protein (%)</TableCell>
//               <TableCell>Feed DE (MJ/kg)</TableCell>
//               <TableCell>Feed Price ($)</TableCell>
//               <TableCell>Growth (g)</TableCell>
//               <TableCell>Est. FCR</TableCell>
//               <TableCell>Partitioned FCR</TableCell>
//               <TableCell>Feed Intake (g)</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {data?.map((row, index) => (
//               <TableRow key={index}>
//                 <TableCell>{row.date}</TableCell>
//                 <TableCell>{row.days}</TableCell>
//                 <TableCell>{row.waterTemp}</TableCell>
//                 <TableCell>{row.fishWeight}</TableCell>
//                 <TableCell>{row.numberOfFish}</TableCell>
//                 <TableCell>{row.biomass}</TableCell>
//                 <TableCell>{row.stockingDensityNM3}</TableCell>
//                 <TableCell>{row.stockingDensityKg}</TableCell>
//                 <TableCell>{row.feedPhase}</TableCell>
//                 <TableCell>{row.feedProtein}</TableCell>
//                 <TableCell>{row.feedDE}</TableCell>
//                 <TableCell>{row.feedPrice}</TableCell>
//                 <TableCell>{row.growth}</TableCell>
//                 <TableCell>{row.estimatedFCR}</TableCell>
//                 <TableCell>{row.partitionedFCR}</TableCell>
//                 <TableCell>{row.feedIntake}</TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>
//     </>
//   );
// };

// export default Page;
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
} from "@mui/material";
import BasicBreadcrumbs from "@/app/_components/Breadcrumbs";

const Page: NextPage = () => {
  const [data, setData] = useState<any[]>([]);
  const [fishWeight, setFishWeight] = useState(10);
  const [numberOfFish, setNumberOfFish] = useState(4000);
  const [volume, setVolume] = useState(480);
  const [waterTemp, setWaterTemp] = useState(27);

  // function calculateFBW() {
  //   const IBW = fishWeight;
  //   const oneMinusB = 0.333333;
  //   const b = 1 - oneMinusB; // b = 0.666667
  //   const TGC = 0.13;
  //   const T = waterTemp;
  //   let prevWeight = IBW;
  //   let prevNumberOfFish = numberOfFish; // Start with initial fish weight
  //   let newData = [];
  //   function calculateNoOfFish(noOfFish, days) {
  //     return Math.round(noOfFish * (1 - (Math.pow(0.05 / 100 + 1, days) - 1)));
  //   }
  //   for (let day = 0; day <= 30; day += 15) {
  //     // Compute IBW^(1-b)
  //     const part1 = Math.pow(prevWeight, oneMinusB);
  //     // Compute sum(T * t)
  //     const sumTt = T * day;
  //     // Compute (TGC / 100 * sum(T * t))^(1/(1-b))
  //     const part2 = Math.pow((TGC / 100) * sumTt, 1 / oneMinusB);
  //     // Final FBW calculation
  //     const FBW = part1 + part2;
  //     prevNumberOfFish = calculateNoOfFish(prevNumberOfFish, day);
  //     // Biomass calculation
  //     const biomass = (prevWeight * numberOfFish) / 1000;

  //     // Stocking density calculations
  //     const stockingDensityNM3 = numberOfFish / volume;
  //     const stockingDensityKg = biomass / volume;

  //     // New day's data
  //     const newRow = {
  //       date: `Day ${day}`,
  //       days: day,
  //       waterTemp: T,
  //       fishWeight: prevWeight.toFixed(2),
  //       numberOfFish: prevNumberOfFish,
  //       biomass: biomass.toFixed(2),
  //       stockingDensityNM3: stockingDensityNM3.toFixed(2),
  //       stockingDensityKg: stockingDensityKg.toFixed(2),
  //       feedPhase: "Tilapia Starter (2mm)",
  //       feedProtein: 36,
  //       feedDE: 13.22,
  //       feedPrice: 1550,
  //       growth: (FBW - prevWeight).toFixed(2),
  //       estimatedFCR: 1.21,
  //       partitionedFCR: 0.0,
  //       feedIntake: 0,
  //     };

  //     // Store new data
  //     newData.push(newRow);
  //     prevWeight = FBW; // Update weight for next day
  //   }

  //   setData(newData);
  // }
  function calculateFBW() {
    const IBW = fishWeight;
    const oneMinusB = 0.333333;
    const b = oneMinusB; // b = 0.666667
    const TGC = 0.13;
    const T = waterTemp;
    let prevWeight = IBW;
    let prevNumberOfFish = numberOfFish; // Initial number of fish
    let newData = [];

    function calculateNoOfFish(noOfFish, days) {
      return Math.round(noOfFish * (1 - (Math.pow(0.05 / 100 + 1, days) - 1)));
    }

    for (let day = 0; day <= 30; day += 15) {
      // Compute IBW^(1-b)
      const part1 = Math.pow(prevWeight, oneMinusB);
      // Compute sum(T * t)
      const sumTt = T * day;
      // Compute (TGC / 100 * sum(T * t))^(1/(1-b))
      const part2 = Math.pow((TGC / 100) * sumTt, 1 / oneMinusB);
      // Final FBW calculation
      const FBW = part1 + part2;

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
        numberOfFish: prevNumberOfFish, // Updated dynamically
        biomass: biomass.toFixed(2), // ✅ Now updates correctly
        stockingDensityNM3: stockingDensityNM3.toFixed(2), // ✅ Updated correctly
        stockingDensityKg: stockingDensityKg.toFixed(2), // ✅ Updated correctly
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
    </>
  );
};

export default Page;
