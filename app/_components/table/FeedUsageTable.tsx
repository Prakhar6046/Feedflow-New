import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  Typography,
  Divider,
} from '@mui/material';
import { FarmsFishGrowth } from '../feedPrediction/FeedingPlanOutputs';

const formatFeed = (kg: number) => {
  const bags = (kg / 20).toFixed(2);
  return `${kg.toFixed(2)} Kg (${bags} Bags)`;
};
type Iprops = {
  flatData: FarmsFishGrowth[];
};
const FeedUsageTable = ({ flatData }: Iprops) => {
  const uniqueFeedTypes = Array.from(
    new Set(
      flatData.flatMap((unit) => unit.fishGrowthData.map((d) => d.feedType)),
    ),
  );

  const unitColumns = flatData.map((unit) => ({
    label: `${unit.farm}-${unit.unit}`,
    fishGrowthData: unit.fishGrowthData,
  }));

  const tableData = uniqueFeedTypes.map((feedType) => {
    const unitValues = unitColumns.map((unit) => {
      const feedItems = unit.fishGrowthData.filter(
        (fd) => fd.feedType === feedType,
      );

      const totalKg = feedItems.reduce((sum: number, item) => {
        const intake = parseFloat(item.feedIntake);
        return sum + (isNaN(intake) ? 0 : intake);
      }, 0);

      return totalKg;
    });

    const totalIntake = unitValues.reduce((a: number, b: number) => a + b, 0);

    return {
      feedType,
      unitValues,
      totalIntake,
    };
  });

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell
              sx={{
                background: '#06a19b',
                color: '#fff',
                fontWeight: 600,
              }}
            >
              Supplier
            </TableCell>
            <TableCell
              sx={{
                background: '#06a19b',
                color: '#fff',
                fontWeight: 600,
              }}
            >
              Feed
            </TableCell>
            {unitColumns.map((unit, idx: number) => (
              <TableCell
                key={idx}
                sx={{
                  background: '#06a19b',
                  color: '#fff',
                  fontWeight: 600,
                }}
              >
                <Typography variant="body2">
                  {unit.label.split('-')[0]}
                </Typography>
                <Divider
                  sx={{
                    borderWidth: 2,
                    borderColor: '#fff',
                    my: 1,
                  }}
                />
                <Typography variant="body2">{unit.label}</Typography>
              </TableCell>
            ))}
            <TableCell
              sx={{
                background: '#06a19b',
                color: '#fff',
                fontWeight: 600,
              }}
            >
              Total
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {tableData.map((row, rowIndex) => (
            <TableRow key={rowIndex}>
              {rowIndex === 0 && (
                <TableCell
                  rowSpan={tableData.length}
                  sx={{
                    fontWeight: 500,
                    whiteSpace: 'nowrap',
                    verticalAlign: 'top',
                  }}
                >
                  SA Feeds
                </TableCell>
              )}
              <TableCell>
                <Typography
                  sx={{
                    fontWeight: 500,
                    fontSize: 14,
                    backgroundColor: '#F5F6F8',
                    borderTopLeftRadius: '8px',
                    borderBottomLeftRadius: '8px',
                    padding: '8px 12px',
                    margin: '8px 0',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {row.feedType}
                </Typography>
              </TableCell>

              {row.unitValues.map((kg, idx: number) => (
                <TableCell key={idx}>
                  <Typography
                    sx={{
                      fontSize: 14,
                      padding: '8px 12px',
                      margin: '8px 0',
                      backgroundColor: '#F5F6F8',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {formatFeed(kg)}
                  </Typography>
                </TableCell>
              ))}

              <TableCell>
                <Typography
                  sx={{
                    fontSize: 14,
                    fontWeight: 600,
                    padding: '8px 12px',
                    margin: '8px 0',
                    backgroundColor: '#06a19b',
                    color: '#fff',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {formatFeed(row.totalIntake)}
                </Typography>
              </TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell />
            <TableCell>
              <Typography
                sx={{
                  fontWeight: 600,
                  fontSize: 14,
                  padding: '8px 12px',
                  backgroundColor: '#06a19b',
                  color: '#fff',
                  whiteSpace: 'nowrap',
                }}
              >
                Total
              </Typography>
            </TableCell>

            {unitColumns.map((unit, idx: number) => {
              const unitTotal = unit.fishGrowthData.reduce(
                (sum: number, item) => {
                  const intake = parseFloat(item.feedIntake);
                  return sum + (isNaN(intake) ? 0 : intake);
                },
                0,
              );

              return (
                <TableCell key={idx}>
                  <Typography
                    sx={{
                      fontSize: 14,
                      fontWeight: 600,
                      padding: '8px 12px',
                      backgroundColor: '#06a19b',
                      color: '#fff',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {formatFeed(unitTotal)}
                  </Typography>
                </TableCell>
              );
            })}

            {/* Grand total of all feed */}
            <TableCell>
              <Typography
                sx={{
                  fontSize: 14,
                  fontWeight: 600,
                  padding: '8px 12px',
                  backgroundColor: '#06a19b',
                  color: '#fff',
                  whiteSpace: 'nowrap',
                }}
              >
                {formatFeed(
                  unitColumns.reduce((sum: number, unit) => {
                    const total = unit.fishGrowthData.reduce(
                      (acc: number, item) => {
                        const intake = parseFloat(item.feedIntake);
                        return acc + (isNaN(intake) ? 0 : intake);
                      },
                      0,
                    );
                    return sum + total;
                  }, 0),
                )}
              </Typography>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default FeedUsageTable;
