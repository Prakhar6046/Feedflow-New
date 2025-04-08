import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import React from "react";
import { FishFeedingData } from "../feedPrediction/AdHoc";
interface Props {
  data: FishFeedingData[];
}
function FishGrowthTable({ data }: Props) {
  return (
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
            <TableCell>Feeding Rate</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.map((row, index) => (
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
              <TableCell>{row.feedingRate}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default FishGrowthTable;
