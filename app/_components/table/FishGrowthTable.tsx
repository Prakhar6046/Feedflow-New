import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import React from 'react';
import { FishFeedingData } from '../feedPrediction/AdHoc';
interface Props {
  data: FishFeedingData[];
}
function FishGrowthTable({ data }: Props) {
  return (
    <Paper
      sx={{
        width: '99%',
        overflow: 'hidden',
        ml: 'auto',
        borderRadius: '14px',
        boxShadow: '0px 0px 16px 5px #0000001A',
      }}
    >
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  borderBottom: 0,
                  color: '#67737F',
                  background: '#F5F6F8',
                  fontSize: {
                    md: 16,
                    xs: 14,
                  },
                  fontWeight: 600,
                }}
              >
                Date
              </TableCell>
              <TableCell
                sx={{
                  borderBottom: 0,
                  color: '#67737F',
                  background: '#F5F6F8',
                  fontSize: {
                    md: 16,
                    xs: 14,
                  },
                  fontWeight: 600,
                }}
              >
                Temp(c)
              </TableCell>
              <TableCell
                sx={{
                  borderBottom: 0,
                  color: '#67737F',
                  background: '#F5F6F8',
                  fontSize: {
                    md: 16,
                    xs: 14,
                  },
                  fontWeight: 600,
                }}
              >
                Number of Fish
              </TableCell>
              <TableCell
                sx={{
                  borderBottom: 0,
                  color: '#67737F',
                  background: '#F5F6F8',
                  fontSize: {
                    md: 16,
                    xs: 14,
                  },
                  fontWeight: 600,
                }}
              >
                Fish Size(g)
              </TableCell>
              <TableCell
                sx={{
                  borderBottom: 0,
                  color: '#67737F',
                  background: '#F5F6F8',
                  fontSize: {
                    md: 16,
                    xs: 14,
                  },
                  fontWeight: 600,
                }}
              >
                Growth(g)
              </TableCell>
              <TableCell
                sx={{
                  borderBottom: 0,
                  color: '#67737F',
                  background: '#F5F6F8',
                  fontSize: {
                    md: 16,
                    xs: 14,
                  },
                  fontWeight: 600,
                }}
              >
                Feed Type
              </TableCell>
              <TableCell
                sx={{
                  borderBottom: 0,
                  color: '#67737F',
                  background: '#F5F6F8',
                  fontSize: {
                    md: 16,
                    xs: 14,
                  },
                  fontWeight: 600,
                }}
              >
                Feed Size
              </TableCell>
              <TableCell
                sx={{
                  borderBottom: 0,
                  color: '#67737F',
                  background: '#F5F6F8',
                  fontSize: {
                    md: 16,
                    xs: 14,
                  },
                  fontWeight: 600,
                }}
              >
                Est. FCR
              </TableCell>
              <TableCell
                sx={{
                  borderBottom: 0,
                  color: '#67737F',
                  background: '#F5F6F8',
                  fontSize: {
                    md: 16,
                    xs: 14,
                  },
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                }}
              >
                Feed Intake (g)
              </TableCell>
              <TableCell
                sx={{
                  borderBottom: 0,
                  color: '#67737F',
                  background: '#F5F6F8',
                  fontSize: {
                    md: 16,
                    xs: 14,
                  },
                  fontWeight: 600,
                }}
              >
                Feeding Rate
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.map((row, index) => (
              <TableRow key={index}>
                <TableCell
                  sx={{
                    borderBottomColor: '#F5F6F8',
                    borderBottomWidth: 2,
                    color: '#555555',
                    fontWeight: 500,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {row.date}
                </TableCell>
                <TableCell
                  sx={{
                    borderBottomColor: '#F5F6F8',
                    borderBottomWidth: 2,
                    color: '#555555',
                    fontWeight: 500,
                  }}
                >
                  {row.averageProjectedTemp}
                </TableCell>
                <TableCell
                  sx={{
                    borderBottomColor: '#F5F6F8',
                    borderBottomWidth: 2,
                    color: '#555555',
                    fontWeight: 500,
                  }}
                >
                  {row.numberOfFish}
                </TableCell>
                <TableCell
                  sx={{
                    borderBottomColor: '#F5F6F8',
                    borderBottomWidth: 2,
                    color: '#555555',
                    fontWeight: 500,
                  }}
                >
                  {row.fishSize}
                </TableCell>
                <TableCell
                  sx={{
                    borderBottomColor: '#F5F6F8',
                    borderBottomWidth: 2,
                    color: '#555555',
                    fontWeight: 500,
                  }}
                >
                  {row.growth}
                </TableCell>
                <TableCell
                  sx={{
                    borderBottomColor: '#F5F6F8',
                    borderBottomWidth: 2,
                    color: '#555555',
                    fontWeight: 500,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {row.feedType}
                </TableCell>
                <TableCell
                  sx={{
                    borderBottomColor: '#F5F6F8',
                    borderBottomWidth: 2,
                    color: '#555555',
                    fontWeight: 500,
                  }}
                >
                  {row.feedSize}
                </TableCell>
                <TableCell
                  sx={{
                    borderBottomColor: '#F5F6F8',
                    borderBottomWidth: 2,
                    color: '#555555',
                    fontWeight: 500,
                  }}
                >
                  {row.estimatedFCR}
                </TableCell>
                <TableCell
                  sx={{
                    borderBottomColor: '#F5F6F8',
                    borderBottomWidth: 2,
                    color: '#555555',
                    fontWeight: 500,
                  }}
                >
                  {row.feedIntake}
                </TableCell>
                <TableCell
                  sx={{
                    borderBottomColor: '#F5F6F8',
                    borderBottomWidth: 2,
                    color: '#555555',
                    fontWeight: 500,
                  }}
                >
                  {row.feedingRate}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

export default FishGrowthTable;
