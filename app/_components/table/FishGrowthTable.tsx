import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
} from '@mui/material';
import React, { useState } from 'react';
import { FishFeedingData } from '../feedPrediction/AdHoc';

interface Props {
  data: FishFeedingData[];
  showBiomass?: boolean; // Optional prop to show biomass column (for Feeding Plan)
}

function FishGrowthTable({ data, showBiomass = false }: Props) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedData = data.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

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
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {(() => {
                const headers = [
                  'Date',
                  'Temp(c)',
                  'Number of Fish',
                ];
                // Add Biomass column only for Feeding Plan
                if (showBiomass) {
                  headers.push('Biomass(kg)');
                }
                headers.push(
                  'Fish Size(g)',
                  'Growth(g)',
                  'Feed Type',
                  'Feed Size',
                  'Est. FCR',
                  'Feed Intake (g)',
                  'Feeding Rate',
                  'Mortality rate %/day',
                );
                return headers;
              })().map((head, idx) => (
                <TableCell
                  key={idx}
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
                  {head}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.map((row, index) => (
              <TableRow key={index}>
                <TableCell
                  sx={{
                    borderBottomColor: '#F5F6F8',
                    borderBottomWidth: 2,
                    color: '#555555',
                    fontWeight: 500,
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
                {showBiomass && (
                  <TableCell
                    sx={{
                      borderBottomColor: '#F5F6F8',
                      borderBottomWidth: 2,
                      color: '#555555',
                      fontWeight: 500,
                    }}
                  >
                    {row.biomass || '-'}
                  </TableCell>
                )}
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
                <TableCell
                  sx={{
                    borderBottomColor: '#F5F6F8',
                    borderBottomWidth: 2,
                    color: '#555555',
                    fontWeight: 500,
                  }}
                >
                  {row.mortalityRate}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination Controls */}
      <TablePagination
        component="div"
        count={data.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 20, 50]}
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          background: 'transparent',
          '& .MuiTablePagination-toolbar': {
            background: 'rgba(255, 255, 255, 0.75)',
            backdropFilter: 'blur(8px)',
            borderTop: '1px solid rgba(0,0,0,0.05)',
            borderRadius: '0 0 14px 14px',
            px: 3,
            py: 1.5,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          },
          '& .MuiTablePagination-selectLabel': {
            color: '#06A19B',
            fontWeight: 700,
            fontSize: '0.9rem',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          },
          '& .MuiTablePagination-displayedRows': {
            color: '#222',
            fontWeight: 600,
            fontSize: '0.85rem',
          },
          '& .MuiSelect-root': {
            border: '1px solid #06A19B',
            backgroundColor: 'rgba(6,161,155,0.1)',
            paddingLeft: '0px!important',
            paddingRight: '24px!important',
          },
          '& .MuiTablePagination-select': {
            borderRadius: '20px',
            px: 2,
            py: 0.5,
            fontWeight: 600,
            fontSize: '0.85rem',
          },
          '& .MuiTablePagination-actions': {
            display: 'flex',
            gap: '8px',
            ml: 2,
            '& button': {
              color: '#fff',
              backgroundColor: '#06A19B',
              borderRadius: '50%',
              width: 36,
              height: 36,
              boxShadow: '0px 2px 6px rgba(6,161,155,0.4)',
              transition: '0.3s ease',
              '&:hover': {
                backgroundColor: '#048c87',
                transform: 'scale(1.1)',
              },
              '&:disabled': {
                backgroundColor: '#ccc',
                color: '#777',
                boxShadow: 'none',
              },
            },
          },
        }}
      />
    </Paper>
  );
}

export default FishGrowthTable;
