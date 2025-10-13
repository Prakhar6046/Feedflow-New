'use client';
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from '@mui/material';
import { FarmsFishGrowth } from '../feedPrediction/FeedingPlan'; // Assuming this is correct

interface FeedUsageTableProps {
  flatData: FarmsFishGrowth[];
  feedLinks?: any[]; 
}

// Helper to format kg to bags (assuming 20kg per bag)
const formatFeed = (kg: number) => {
  const bags = (kg / 20).toFixed(2);
  // Only show the bags if kg > 0 to avoid "(0.00 Bags)"
  return `${kg.toFixed(2)} Kg${kg > 0 ? ` (${bags} Bags)` : ''}`;
};

// Helper to get supplier name for a feed. 
// NOTE: Since the supplier is assumed to be unit-specific, this helper is
// a placeholder and assumes feedLinks can find the supplier by product name.
// For true separation, the supplier name should be included in fishGrowthData.
const getSupplierName = (
  feedType: string,
  feedLinks: any[],
): string => {
  const link = feedLinks?.find(
    (l: any) => l?.feedStore?.productName === feedType,
  );
  return link?.feedSupply?.name || 'N/A';
};

const FeedUsageTable: React.FC<FeedUsageTableProps> = ({
  flatData,
  feedLinks = [],
}) => {
  // 1. Prepare grouped data for row rendering
  const tableRows: {
    farm: string;
    unit: string;
    unitTotal: number;
    feedDetails: {
      feedType: string;
      supplier: string;
      totalKg: number;
    }[];
  }[] = [];

  flatData.forEach((unitData) => {
    // Group feed data within this unit by FeedType and Supplier
    const feedGroupMap = new Map<string, { feedType: string; supplier: string; totalKg: number }>();
    let unitTotalKg = 0;

    unitData.fishGrowthData.forEach((d) => {
      const feedType = d.feedType;
      // CRITICAL: We look up the supplier here. If supplier is truly unit-specific
      // for the same feedType, you must update getSupplierName to take unit/farm IDs
      // and use a more complex lookup, or embed the supplier in `d`.
      const supplier = getSupplierName(feedType, feedLinks); 
      
      const key = `${feedType}::${supplier}`;
      const intake = parseFloat(d.feedIntake);
      const kg = isNaN(intake) ? 0 : intake;
      unitTotalKg += kg;

      if (!feedGroupMap.has(key)) {
        feedGroupMap.set(key, { feedType, supplier, totalKg: 0 });
      }
      feedGroupMap.get(key)!.totalKg += kg;
    });

    tableRows.push({
      farm: unitData.farm,
      unit: unitData.unit,
      unitTotal: unitTotalKg,
      feedDetails: Array.from(feedGroupMap.values()),
    });
  });

  // 2. Calculate Grand Totals
  const grandTotalAll = tableRows.reduce((sum, row) => sum + row.unitTotal, 0);

  return (
    <TableContainer component={Paper}>
      <Table stickyHeader aria-label="feed usage by unit and type">
        <TableHead>
          <TableRow sx={{ background: '#06a19b' }}>
            <TableCell sx={{ color: '#fff', fontWeight: 700 }}>Farm</TableCell>
            <TableCell sx={{ color: '#fff', fontWeight: 700 }}>Unit</TableCell>
            <TableCell sx={{ color: '#fff', fontWeight: 700 }}>Feed Supplier</TableCell>
            <TableCell sx={{ color: '#fff', fontWeight: 700 }}>Feed Type</TableCell>
            <TableCell sx={{ color: '#fff', fontWeight: 700, textAlign: 'right' }}>
              Usage (Kg / Bags)
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {tableRows.map((unitRow, unitIdx) => {
            const rowCount = unitRow.feedDetails.length;
            
            return unitRow.feedDetails.map((feedDetail, detailIdx) => (
              <TableRow 
                key={`${unitIdx}-${detailIdx}`} 
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                {/* Farm Cell: only appears on the first row of the unit's group */}
                {detailIdx === 0 && (
                  <TableCell rowSpan={rowCount} sx={{ fontWeight: 600, borderRight: '1px solid #ccc' }}>
                    {unitRow.farm}
                  </TableCell>
                )}
                
                {/* Unit Cell: only appears on the first row of the unit's group */}
                {detailIdx === 0 && (
                  <TableCell rowSpan={rowCount} sx={{ fontWeight: 600, borderRight: '1px solid #ccc' }}>
                    {unitRow.unit}
                    <Typography variant="caption" display="block" color="text.secondary">
                      Unit Total: {formatFeed(unitRow.unitTotal)}
                    </Typography>
                  </TableCell>
                )}

                {/* Feed Detail Cells (Supplier and Type) */}
                <TableCell sx={{ whiteSpace: 'nowrap' }}>
                  {feedDetail.supplier}
                </TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>
                  {feedDetail.feedType}
                </TableCell>
                
                {/* Usage Cell (Kg/Bags) */}
                <TableCell align="right" sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}>
                  {formatFeed(feedDetail.totalKg)}
                </TableCell>
              </TableRow>
            ));
          })}

          {/* Grand Total Row */}
          <TableRow sx={{ background: '#e0f7fa' }}>
            <TableCell colSpan={4} sx={{ fontWeight: 700, background: '#06a19b', color: '#fff' }}>
              GRAND TOTAL ALL UNITS
            </TableCell>
            <TableCell align="right" sx={{ fontWeight: 700, background: '#06a19b', color: '#fff' }}>
              {formatFeed(grandTotalAll)}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default FeedUsageTable;