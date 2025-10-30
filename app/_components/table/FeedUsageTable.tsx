'use client';
import React, { useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Box,
} from '@mui/material';
import { FarmsFishGrowth } from '../feedPrediction/FeedingPlan';

interface FeedUsageTableProps {
  flatData: FarmsFishGrowth[];
  feedLinks?: any[];
  loading?: boolean;
}

interface FeedAggregation {
  supplier: string;
  feedType: string;
  bags: number;
  kg: number;
}

interface UnitFeedData {
  unitId: number;
  unitName: string;
  feedData: FeedAggregation[];
  totalBags: number;
  totalKg: number;
}

interface FarmFeedData {
  farmId: string;
  farmName: string;
  units: UnitFeedData[];
  totalBags: number;
  totalKg: number;
}

const FeedUsageTable: React.FC<FeedUsageTableProps> = ({
  flatData,
  feedLinks = [],
  loading = false,
}) => {
  // Helper function to get supplier name from feedLinks
  const getSupplierName = (feedProductName: string): string => {
    if (!feedLinks || feedLinks.length === 0) return 'N/A';
    const link = feedLinks.find(
      (l: any) => l?.feedStore?.productName === feedProductName,
    );
    return link?.feedSupply?.name || 'N/A';
  };

  // Process data to create hierarchical structure with calculations
  const processedData = useMemo(() => {
    if (!flatData || flatData.length === 0) return { farms: [], overallTotal: { totalBags: 0, totalKg: 0, feeds: [] } };

    // Group by farm
    const farmMap = new Map<string, FarmFeedData>();
    const overallFeedMap = new Map<string, { supplier: string; bags: number; kg: number }>();

    flatData.forEach((item) => {
      const { farm, farmId, unit, unitId, fishGrowthData } = item;

      // Initialize farm if not exists
      if (!farmMap.has(farmId)) {
        farmMap.set(farmId, {
          farmId,
          farmName: farm,
          units: [],
          totalBags: 0,
          totalKg: 0,
        });
      }

      const farmData = farmMap.get(farmId)!;

      // Calculate feed requirements for this unit
      const unitFeedMap = new Map<string, { supplier: string; bags: number; kg: number }>();

      fishGrowthData.forEach((row) => {
        const feedType = row.feedType || 'Unknown';
        const intake = parseFloat(String(row.feedIntake)) || 0;
        const bags = intake / 20;
        const supplier = getSupplierName(feedType);

        if (!unitFeedMap.has(feedType)) {
          unitFeedMap.set(feedType, { supplier, bags: 0, kg: 0 });
        }

        const feedData = unitFeedMap.get(feedType)!;
        feedData.bags += bags;
        feedData.kg += intake;

        // Update overall totals
        if (!overallFeedMap.has(feedType)) {
          overallFeedMap.set(feedType, { supplier, bags: 0, kg: 0 });
        }
        const overallFeed = overallFeedMap.get(feedType)!;
        overallFeed.bags += bags;
        overallFeed.kg += intake;
      });

      // Convert unit feed map to array and calculate totals
      const unitFeeds: FeedAggregation[] = Array.from(unitFeedMap.entries()).map(([feedType, data]) => ({
        supplier: data.supplier,
        feedType,
        bags: data.bags,
        kg: data.kg,
      }));

      const unitTotalBags = unitFeeds.reduce((sum, f) => sum + f.bags, 0);
      const unitTotalKg = unitFeeds.reduce((sum, f) => sum + f.kg, 0);

      farmData.units.push({
        unitId,
        unitName: unit,
        feedData: unitFeeds,
        totalBags: unitTotalBags,
        totalKg: unitTotalKg,
      });

      farmData.totalBags += unitTotalBags;
      farmData.totalKg += unitTotalKg;
    });

    // Convert overall feed map to array
    const overallFeeds: FeedAggregation[] = Array.from(overallFeedMap.entries()).map(([feedType, data]) => ({
      supplier: data.supplier,
      feedType,
      bags: data.bags,
      kg: data.kg,
    }));

    const overallTotalBags = overallFeeds.reduce((sum, f) => sum + f.bags, 0);
    const overallTotalKg = overallFeeds.reduce((sum, f) => sum + f.kg, 0);

    return {
      farms: Array.from(farmMap.values()),
      overallTotal: {
        totalBags: overallTotalBags,
        totalKg: overallTotalKg,
        feeds: overallFeeds,
      },
    };
  }, [flatData, feedLinks]);

  // Calculate row spans for farm names
  const getFarmRowSpan = (farm: FarmFeedData): number => {
    const farmFeedTypes = getFarmFeedTypes(farm);
    let rowCount = 0;
    farm.units.forEach((unit) => {
      rowCount += unit.feedData.length; // Feed rows
      rowCount += 1; // Unit total row
    });
    rowCount += farmFeedTypes.length; // Farm total feed rows (grouped by feed type)
    rowCount += 1; // Farm total row
    return rowCount;
  };

  // Calculate row span for unit names
  const getUnitRowSpan = (unit: UnitFeedData): number => {
    return unit.feedData.length + 1; // Feed rows + unit total row
  };

  // Get unique feed types for farm total section
  const getFarmFeedTypes = (farm: FarmFeedData): FeedAggregation[] => {
    const feedMap = new Map<string, { supplier: string; bags: number; kg: number }>();

    farm.units.forEach((unit) => {
      unit.feedData.forEach((feed) => {
        if (!feedMap.has(feed.feedType)) {
          feedMap.set(feed.feedType, {
            supplier: feed.supplier,
            bags: 0,
            kg: 0,
          });
        }
        const feedData = feedMap.get(feed.feedType)!;
        feedData.bags += feed.bags;
        feedData.kg += feed.kg;
      });
    });

    return Array.from(feedMap.entries()).map(([feedType, data]) => ({
      supplier: data.supplier,
      feedType,
      bags: data.bags,
      kg: data.kg,
    }));
  };

  return (
    <Box sx={{ overflow: 'auto' }}>
      <Table sx={{ minWidth: 800 }}>
        {/* Header with dark teal background - Two row structure */}
        <TableHead>
          <TableRow sx={{ background: '#06a19b' }}>
            <TableCell
              rowSpan={2}
              sx={{
                color: '#fff',
                fontWeight: 700,
                textAlign: 'center',
                padding: '12px',
                border: '1px solid #fff',
              }}
            >
              Farm
            </TableCell>
            <TableCell
              rowSpan={2}
              sx={{
                color: '#fff',
                fontWeight: 700,
                textAlign: 'center',
                padding: '12px',
                border: '1px solid #fff',
              }}
            >
              Unit
            </TableCell>
            <TableCell
              rowSpan={2}
              sx={{
                color: '#fff',
                fontWeight: 700,
                textAlign: 'center',
                padding: '12px',
                border: '1px solid #fff',
              }}
            >
              Supplier
            </TableCell>
            <TableCell
              rowSpan={2}
              sx={{
                color: '#fff',
                fontWeight: 700,
                textAlign: 'center',
                padding: '12px',
                border: '1px solid #fff',
              }}
            >
              Feed type
            </TableCell>
            <TableCell
              colSpan={2}
              sx={{
                color: '#fff',
                fontWeight: 700,
                textAlign: 'center',
                padding: '12px',
                border: '1px solid #fff',
                borderBottom: '2px solid #000',
              }}
            >
              Requirement
            </TableCell>
          </TableRow>
          <TableRow sx={{ background: '#06a19b' }}>
            <TableCell
              sx={{
                color: '#fff',
                fontWeight: 700,
                textAlign: 'center',
                padding: '12px',
                border: '1px solid #fff',
                borderBottom: '2px solid #000',
              }}
            >
              Bags
            </TableCell>
            <TableCell
              sx={{
                color: '#fff',
                fontWeight: 700,
                textAlign: 'center',
                padding: '12px',
                border: '1px solid #fff',
                borderBottom: '2px solid #000',
              }}
            >
              Volume (kg)
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {loading ? (
            // Loading state - show loading message
            <TableRow>
              <TableCell
                colSpan={6}
                sx={{
                  border: '1px solid #fff',
                  background: '#fff',
                  padding: '40px 12px',
                  textAlign: 'center',
                  fontWeight: 500,
                  fontSize: '1.2rem',
                  color: '#666',
                }}
              >
                Loading data...
              </TableCell>
            </TableRow>
          ) : (
            <>              {/* Overall Total Section - Shows aggregated feed requirements across all farms */}
              {processedData.overallTotal.feeds.map((feed, feedIndex) => (
                <TableRow key={`overall-feed-${feedIndex}`}>
                  <TableCell
                    sx={{
                      border: '1px solid #fff',
                      background: '#fff',
                      padding: '12px',
                    }}
                  >
                    {feedIndex === 0 ? 'Total' : ''}
                  </TableCell>
                  <TableCell
                    sx={{
                      border: '1px solid #fff',
                      background: '#fff',
                      padding: '12px',
                    }}
                  />
                  <TableCell
                    sx={{
                      border: '1px solid #fff',
                      background: '#fff',
                      padding: '12px',
                    }}
                  >
                    {feed.supplier}
                  </TableCell>
                  <TableCell
                    sx={{
                      border: '1px solid #fff',
                      background: '#fff',
                      padding: '12px',
                    }}
                  >
                    {feed.feedType}
                  </TableCell>
                  <TableCell
                    sx={{
                      border: '1px solid #fff',
                      background: '#fff',
                      textAlign: 'right',
                      padding: '12px',
                    }}
                  >
                    {Math.round(feed.bags)}
                  </TableCell>
                  <TableCell
                    sx={{
                      border: '1px solid #fff',
                      background: '#fff',
                      textAlign: 'right',
                      padding: '12px',
                    }}
                  >
                    {feed.kg.toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}

              {/* Overall Total Row */}
              {processedData.overallTotal.feeds.length > 0 && (
                <TableRow>
                  <TableCell
                    colSpan={2}
                    sx={{
                      borderLeft: '1px solid #fff',
                      borderRight: '1px solid #fff',
                      borderBottom: '1px solid #fff',
                      borderTop: '2px solid #000',
                      background: '#06A19B',
                      color: '#fff',
                      fontWeight: 700,
                      padding: '12px',
                    }}
                  >
                  </TableCell>
                  <TableCell
                    sx={{
                      borderLeft: '1px solid #fff',
                      borderRight: '1px solid #fff',
                      borderBottom: '1px solid #fff',
                      borderTop: '2px solid #000',
                      background: '#06A19B',
                      color: '#fff',
                      fontWeight: 700,
                      padding: '12px',
                    }}
                  />
                  <TableCell
                    sx={{
                      borderLeft: '1px solid #fff',
                      borderRight: '1px solid #fff',
                      borderBottom: '1px solid #fff',
                      borderTop: '2px solid #000',
                      background: '#06A19B',
                      color: '#fff',
                      fontWeight: 700,
                      padding: '12px',
                    }}
                  >
                    Total
                  </TableCell>
                  <TableCell
                    sx={{
                      borderLeft: '1px solid #fff',
                      borderRight: '1px solid #fff',
                      borderBottom: '1px solid #fff',
                      borderTop: '2px solid #000',
                      background: '#06A19B',
                      color: '#fff',
                      fontWeight: 700,
                      textAlign: 'right',
                      padding: '12px',
                    }}
                  >
                    {Math.round(processedData.overallTotal.totalBags)}
                  </TableCell>
                  <TableCell
                    sx={{
                      borderLeft: '1px solid #fff',
                      borderRight: '1px solid #fff',
                      borderBottom: '1px solid #fff',
                      borderTop: '2px solid #000',
                      background: '#06A19B',
                      color: '#fff',
                      fontWeight: 700,
                      textAlign: 'right',
                      padding: '12px',
                    }}
                  >
                    {processedData.overallTotal.totalKg.toFixed(2)}
                  </TableCell>
                </TableRow>
              )}

              {/* Farm Sections - Iterate through each farm */}
              {processedData.farms.map((farm) => {
                const farmFeedTypes = getFarmFeedTypes(farm);

                return farm.units.map((unit, unitIndex) => {
                  const isFirstUnit = unitIndex === 0;

                  return (
                    <React.Fragment key={`farm-${farm.farmId}-unit-${unit.unitId}`}>
                      {/* Feed rows for this unit */}
                      {unit.feedData.map((feed, feedIndex) => {
                        const isFirstFeed = feedIndex === 0;

                        return (
                          <TableRow key={`farm-${farm.farmId}-unit-${unit.unitId}-feed-${feedIndex}`}>
                            {/* Farm name cell (only on first row of first unit) */}
                            {isFirstUnit && isFirstFeed && (
                              <TableCell
                                rowSpan={getFarmRowSpan(farm)}
                                sx={{
                                  border: '1px solid #fff',
                                  background: '#fff',
                                  fontWeight: 600,
                                  verticalAlign: 'top',
                                  padding: '12px',
                                }}
                              >
                                {farm.farmName}
                              </TableCell>
                            )}

                            {/* Unit name cell (only on first feed row of each unit) */}
                            {isFirstFeed && (
                              <TableCell
                                rowSpan={getUnitRowSpan(unit)}
                                sx={{
                                  border: '1px solid #fff',
                                  background: '#fff',
                                  fontWeight: 600,
                                  verticalAlign: 'top',
                                  padding: '12px',
                                }}
                              >
                                {unit.unitName}
                              </TableCell>
                            )}

                            {/* Feed data */}
                            <TableCell
                              sx={{
                                border: '1px solid #fff',
                                background: '#fff',
                                padding: '12px',
                              }}
                            >
                              {feed.supplier}
                            </TableCell>
                            <TableCell
                              sx={{
                                border: '1px solid #fff',
                                background: '#fff',
                                padding: '12px',
                              }}
                            >
                              {feed.feedType}
                            </TableCell>
                            <TableCell
                              sx={{
                                border: '1px solid #fff',
                                background: '#fff',
                                textAlign: 'right',
                                padding: '12px',
                              }}
                            >
                              {Math.round(feed.bags)}
                            </TableCell>
                            <TableCell
                              sx={{
                                border: '1px solid #fff',
                                background: '#fff',
                                textAlign: 'right',
                                padding: '12px',
                              }}
                            >
                              {feed.kg.toFixed(2)}
                            </TableCell>
                          </TableRow>
                        );
                      })}

                      {/* Unit Total Row */}
                      <TableRow>
                        <TableCell
                          colSpan={2}
                          sx={{
                            border: '1px solid #fff',
                            background: '#06A19B',
                            color: '#fff',
                            fontWeight: 700,
                            textAlign: 'right',
                            padding: '12px',
                          }}
                        >
                          Total
                        </TableCell>
                        <TableCell
                          sx={{
                            border: '1px solid #fff',
                            background: '#06A19B',
                            color: '#fff',
                            fontWeight: 700,
                            textAlign: 'right',
                            padding: '12px',
                          }}
                        >
                          {Math.round(unit.totalBags)}
                        </TableCell>
                        <TableCell
                          sx={{
                            border: '1px solid #fff',
                            background: '#06A19B',
                            color: '#fff',
                            fontWeight: 700,
                            textAlign: 'right',
                            padding: '12px',
                          }}
                        >
                          {unit.totalKg.toFixed(2)}
                        </TableCell>
                      </TableRow>

                      {/* Farm Total Section - Show after last unit */}
                      {unitIndex === farm.units.length - 1 && (
                        <>
                          {farmFeedTypes.map((feed, feedIndex) => (
                            <TableRow key={`farm-${farm.farmId}-total-feed-${feedIndex}`}>
                              <TableCell
                                colSpan={2}
                                sx={{
                                  border: '1px solid #fff',
                                  background: '#fff',
                                  padding: '12px',
                                }}
                              >
                                {feedIndex === 0 ? 'Total' : ''}
                              </TableCell>
                              <TableCell
                                sx={{
                                  border: '1px solid #fff',
                                  background: '#fff',
                                  padding: '12px',
                                }}
                              >
                                {feed.feedType}
                              </TableCell>
                              <TableCell
                                sx={{
                                  border: '1px solid #fff',
                                  background: '#fff',
                                  textAlign: 'right',
                                  padding: '12px',
                                }}
                              >
                                {Math.round(feed.bags)}
                              </TableCell>
                              <TableCell
                                sx={{
                                  border: '1px solid #fff',
                                  background: '#fff',
                                  textAlign: 'right',
                                  padding: '12px',
                                }}
                              >
                                {feed.kg.toFixed(2)}
                              </TableCell>
                            </TableRow>
                          ))}

                          {/* Farm Total Row */}
                          <TableRow>
                            <TableCell
                              colSpan={2}
                              sx={{
                                borderLeft: '1px solid #fff',
                                borderRight: '1px solid #fff',
                                borderBottom: '1px solid #fff',
                                borderTop: '2px solid #000',
                                background: '#06A19B',
                                color: '#fff',
                                fontWeight: 700,
                                padding: '12px',
                              }}
                            />
                            <TableCell
                              sx={{
                                borderLeft: '1px solid #fff',
                                borderRight: '1px solid #fff',
                                borderBottom: '1px solid #fff',
                                borderTop: '2px solid #000',
                                background: '#06A19B',
                                color: '#fff',
                                fontWeight: 700,
                                padding: '12px',
                              }}
                            >
                              Total
                            </TableCell>
                            {/* <TableCell
                          sx={{
                            borderLeft: '1px solid #fff',
                            borderRight: '1px solid #fff',
                            borderBottom: '1px solid #fff',
                            borderTop: '2px solid #000',
                            background: '#06A19B',
                            color: '#fff',
                            fontWeight: 700,
                            padding: '12px',
                          }}
                        /> */}
                            <TableCell
                              sx={{
                                borderLeft: '1px solid #fff',
                                borderRight: '1px solid #fff',
                                borderBottom: '1px solid #fff',
                                borderTop: '2px solid #000',
                                background: '#06A19B',
                                color: '#fff',
                                fontWeight: 700,
                                textAlign: 'right',
                                padding: '12px',
                              }}
                            >
                              {Math.round(farm.totalBags)}
                            </TableCell>
                            <TableCell
                              sx={{
                                borderLeft: '1px solid #fff',
                                borderRight: '1px solid #fff',
                                borderBottom: '1px solid #fff',
                                borderTop: '2px solid #000',
                                background: '#06A19B',
                                color: '#fff',
                                fontWeight: 700,
                                textAlign: 'right',
                                padding: '12px',
                              }}
                            >
                              {farm.totalKg.toFixed(2)}
                            </TableCell>
                          </TableRow>
                        </>
                      )}

                    </React.Fragment>
                  );
                });
              })}
            </>
          )}
        </TableBody>
      </Table>
    </Box>
  );
};

export default FeedUsageTable;
