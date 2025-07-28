'use client';
import {
  FishManageHistoryGroup,
  Production,
} from '@/app/_typeModels/production';
import {
  Box,
  FormControl,
  FormLabel,
  Grid,
  Paper,
  TableBody,
  TableSortLabel,
  Typography,
} from '@mui/material';
import Table from '@mui/material/Table';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Tab from '@mui/material/Tab';
import React, { useEffect, useMemo, useState } from 'react';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useAppDispatch } from '@/lib/hooks';
import { usePathname } from 'next/navigation';
import dayjs from 'dayjs';
import { getLocalItem } from '@/app/_lib/utils';
import { getCookie, setCookie } from 'cookies-next';
import { breadcrumsAction } from '@/lib/features/breadcrum/breadcrumSlice';
import FishHistoryCharts from '../production/fishHistoryCharts/FishHistoryCharts';
import { TableHeadType } from '@/app/_typeModels/Farm';
import { EnhancedTableHeadProps } from '../UserTable';

// const TextField = React.forwardRef((props, ref) => (
//   <MuiTextField {...props} ref={ref} size="small" />
// ));

interface Props {
  tableData: TableHeadType[];
  productions: Production[];
  fishId: string;
}
const FishManageHistoryTable: React.FC<Props> = ({
  tableData,
  productions,
  fishId,
}) => {
  const dispatch = useAppDispatch();
  const pathName = usePathname();
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [orderBy, setOrderBy] = useState('Farm');
  const [tab, setTab] = useState<string>('list');
  const [fishHistoryData, setFishHistoryData] =
    useState<FishManageHistoryGroup>();
  const [sortDataFromLocal, setSortDataFromLocal] = React.useState<{
    direction: 'asc' | 'desc';
    column: string;
  }>({ direction: 'asc', column: '' });

  const [startDate, setStartDate] = useState<string>(
    dayjs().subtract(2, 'weeks').format(),
  );
  const [endDate, setEndDate] = useState<string>(dayjs().format());
  function EnhancedTableHead(data: EnhancedTableHeadProps) {
    const { order, orderBy, onRequestSort } = data;
    const createSortHandler =
      (property: string) => (event: React.MouseEvent<HTMLButtonElement>) => {
        onRequestSort(event, property);
      };

    return (
      <TableHead className="prod-action">
        <TableRow>
          {tableData.map((headCell, idx: number, headCells) => (
            <TableCell
              key={headCell.id}
              sortDirection={
                idx === headCells.length - 1
                  ? false
                  : orderBy === headCell.id
                    ? order
                    : false
              }
              // align="center"
              sx={{
                borderBottom: 0,
                color: '#67737F',
                background: '#F5F6F8',

                fontSize: {
                  md: 16,
                  xs: 14,
                },
                fontWeight: 600,
                paddingLeft: {
                  lg: idx === 0 ? 10 : 0,
                  md: idx === 0 ? 7 : 0,
                  xs: idx === 0 ? 4 : 0,
                },
              }}
            >
              {idx === 0 || idx === 1 || idx === 3 || idx === 4 ? (
                headCell.label
              ) : (
                <TableSortLabel
                  active={orderBy === headCell.id}
                  direction={orderBy === headCell.id ? order : 'asc'}
                  onClick={createSortHandler(headCell.id)}
                >
                  {headCell.label}
                </TableSortLabel>
              )}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    );
  }
  const groupedData: FishManageHistoryGroup = useMemo(() => {
    const filteredFarm = productions?.reduce<FishManageHistoryGroup[]>(
      (result, item) => {
        // Find or create a farm group
        let farmGroup = result.find((group) => group.farm === item.farm.name);
        if (!farmGroup) {
          farmGroup = { farm: item.productionUnit.name, units: [] };
          result.push(farmGroup);
        }

        // Add the current production unit and all related data to the group
        farmGroup.units.push({
          id: item.id,
          productionUnit: item.productionUnit,
          fishSupply: item.fishSupply,
          organisation: item.organisation,
          farm: item.farm,
          biomass: item.biomass,
          fishCount: item.fishCount,
          batchNumberId: Number(item.batchNumberId),
          age: item.age,
          meanLength: item.meanLength,
          meanWeight: item.meanWeight,
          stockingDensityKG: item.stockingDensityKG,
          stockingDensityNM: item.stockingDensityNM,
          stockingLevel: item.stockingLevel,
          createdBy: item.createdBy,
          updatedBy: item.updatedBy,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
          isManager: item.isManager ?? false,
          field: item.field,
          fishManageHistory: item.FishManageHistory,
          currentDate: item?.currentDate,
        });

        return result;
      },
      [],
    );
    return filteredFarm[0] ?? null;
  }, [productions]);

  const handleRequestSort = (
    _: React.MouseEvent<HTMLButtonElement> | null,
    property: string,
  ) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
    dispatch(
      breadcrumsAction.handleSort({
        direction: isAsc ? 'desc' : 'asc',
        column: property,
      }),
    );
    const unitData = groupedData?.units[0]?.fishManageHistory;
    if (unitData) {
      const sortedData = [...unitData].sort((fish1, fish2) => {
        const orderType = order === 'asc' ? 1 : -1;
        if (property === 'date') {
          if (fish1.currentDate < fish2.currentDate) return -1 * orderType;
          if (fish1.currentDate > fish2.currentDate) return 1 * orderType;
          return 0;
        } else if (property === 'status') {
          if (fish1.field < fish2.field) return -1 * orderType;
          if (fish1.field > fish2.field) return 1 * orderType;
          return 0;
        } else if (property === 'Mean weight') {
          if (fish1.meanWeight < fish2.meanWeight) return -1 * orderType;
          if (fish1.meanWeight > fish2.meanWeight) return 1 * orderType;
          return 0;
        } else if (property === 'Fish') {
          if (fish1.fishCount < fish2.fishCount) return -1 * orderType;
          if (fish1.fishCount > fish2.fishCount) return 1 * orderType;
          return 0;
        } else if (property === 'Biomass') {
          if (fish1.biomass < fish2.biomass) return -1 * orderType;
          if (fish1.biomass > fish2.biomass) return 1 * orderType;
          return 0;
        } else if (property === 'Mean length') {
          if (fish1.meanLength < fish2.meanLength) return -1 * orderType;
          if (fish1.meanLength > fish2.meanLength) return 1 * orderType;
          return 0;
        } else if (property === 'Stocking Density') {
          if (fish1.stockingDensityKG < fish2.stockingDensityKG)
            return -1 * orderType;
          if (fish1.stockingDensityKG > fish2.stockingDensityKG)
            return 1 * orderType;
          return 0;
        } else if (property === 'Stocking density') {
          if (fish1.stockingDensityNM < fish2.stockingDensityNM)
            return -1 * orderType;
          if (fish1.stockingDensityNM > fish2.stockingDensityNM)
            return 1 * orderType;
          return 0;
        }

        return 0;
      });
      const finalSortedData = {
        farm: groupedData?.farm,
        units: [
          {
            ...groupedData?.units[0],
            fishManageHistory: sortedData,
          },
        ],
      };

      // Update fish history data
      setFishHistoryData(finalSortedData);
    }
  };
  useEffect(() => {
    if (sortDataFromLocal) {
      const data = sortDataFromLocal;
      setOrder(data.direction);
      setOrderBy(data.column);
      const unitData = groupedData?.units[0]?.fishManageHistory;
      if (unitData) {
        const sortedData = [...unitData].sort((fish1, fish2) => {
          const orderType = data.direction === 'asc' ? -1 : 1;
          if (data.column === 'date') {
            if (fish1.currentDate < fish2.currentDate) return -1 * orderType;
            if (fish1.currentDate > fish2.currentDate) return 1 * orderType;
            return 0;
          } else if (data.column === 'status') {
            if (fish1.field < fish2.field) return -1 * orderType;
            if (fish1.field > fish2.field) return 1 * orderType;
            return 0;
          } else if (data.column === 'Mean weight') {
            if (fish1.meanWeight < fish2.meanWeight) return -1 * orderType;
            if (fish1.meanWeight > fish2.meanWeight) return 1 * orderType;
            return 0;
          } else if (data.column === 'Fish') {
            if (fish1.fishCount < fish2.fishCount) return -1 * orderType;
            if (fish1.fishCount > fish2.fishCount) return 1 * orderType;
            return 0;
          } else if (data.column === 'Biomass') {
            if (fish1.biomass < fish2.biomass) return -1 * orderType;
            if (fish1.biomass > fish2.biomass) return 1 * orderType;
            return 0;
          } else if (data.column === 'Mean length') {
            if (fish1.meanLength < fish2.meanLength) return -1 * orderType;
            if (fish1.meanLength > fish2.meanLength) return 1 * orderType;
            return 0;
          } else if (data.column === 'Stocking Density') {
            if (fish1.stockingDensityKG < fish2.stockingDensityKG)
              return -1 * orderType;
            if (fish1.stockingDensityKG > fish2.stockingDensityKG)
              return 1 * orderType;
            return 0;
          } else if (data.column === 'Stocking density') {
            if (fish1.stockingDensityNM < fish2.stockingDensityNM)
              return -1 * orderType;
            if (fish1.stockingDensityNM > fish2.stockingDensityNM)
              return 1 * orderType;
            return 0;
          }

          return 0;
        });
        const finalSortedData = {
          farm: groupedData?.farm,
          units: [
            {
              ...groupedData?.units[0],
              fishManageHistory: sortedData,
            },
          ],
        };

        // Update fish history data
        setFishHistoryData(finalSortedData);
      }
    }
  }, [sortDataFromLocal]);
  useEffect(() => {
    if (tab) {
      setCookie('fishTab', tab);
    }
  }, [tab]);
  useEffect(() => {
    if (groupedData && !sortDataFromLocal) {
      setFishHistoryData(groupedData);
    }
  }, [groupedData]);
  useEffect(() => {
    if (pathName) {
      setSortDataFromLocal(getLocalItem(pathName));
    }
  }, [pathName]);
  useEffect(() => {
    const currentTab = getCookie('fishTab');
    if (currentTab) {
      setTab(currentTab);
    } else {
      setTab('list');
    }
  }, []);

  return (
    <Box
      sx={{
        width: '100%',
        borderRadius: '14px',
        boxShadow: '0px 0px 16px 5px #0000001A',
        my: 4,
        px: 5,
        pt: 2.5,
        pb: 5,
      }}
    >
      <TabContext value={tab}>
        <Grid
          container
          columnSpacing={3}
          rowSpacing={1}
          alignItems={'center'}
          flexWrap={'wrap'}
          justifyContent={'space-between'}
          mb={4}
        >
          {' '}
          <Grid item xs={'auto'}>
            <TabList
              className="tab-list"
              style={{
                borderRadius: '25px',
                border: '1px solid #A6A6A6',
                width: '186px',
              }}
              onChange={(_, val: string) => {
                setTab(val);
              }}
            >
              <Tab label="List" value="list" className="tab-item" />
              <Tab label="Graph" value="graph" className="tab-item" />
            </TabList>
          </Grid>
          {/*hISTORY-CHART*/}
          {tab === 'graph' && (
            <>
              <Grid item xl={4} lg={7} md={9} xs={12} className="form-grid">
                <FormControl>
                  <FormLabel>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DemoContainer
                        sx={{
                          display: 'flex',
                          flexDirection: 'row',
                          gap: 3,
                          alignItems: 'center',
                          margin: '0',
                        }}
                        components={['DatePicker']}
                      >
                        <DatePicker
                          label="Start Date"
                          className="date-picker"
                          value={dayjs(startDate)}
                          onChange={(value) => {
                            const isoDate = value?.toISOString();
                            if (isoDate) setStartDate(isoDate);
                          }}
                          maxDate={dayjs(endDate)}
                        />
                        <DatePicker
                          label="End Date"
                          value={dayjs(endDate)}
                          onChange={(value) => {
                            const isoDate = value?.toISOString();
                            if (isoDate) setEndDate(isoDate);
                          }}
                          sx={{
                            marginTop: '0',

                            borderRadius: '6px',
                          }}
                          className="date-picker"
                          maxDate={dayjs()}
                        />
                      </DemoContainer>
                    </LocalizationProvider>
                  </FormLabel>
                </FormControl>
              </Grid>
            </>
          )}
        </Grid>
        <TabPanel value="list" hidden={tab === 'list' ? false : true}>
          <Paper
            sx={{
              width: '100%',
              overflow: 'hidden',
              borderRadius: '14px',
              boxShadow: '0px 0px 16px 5px #0000001A',
              textAlign: 'center',
              margin: 4,
            }}
          >
            <TableContainer>
              <Table stickyHeader aria-label="sticky table">
                <TableHead
                  sx={{
                    textAlign: 'center',
                  }}
                >
                  <TableRow></TableRow>
                </TableHead>
                <EnhancedTableHead
                  order={order}
                  orderBy={orderBy}
                  onRequestSort={handleRequestSort}
                />
                <TableBody>
                  {fishHistoryData ? (
                    fishHistoryData.units && (
                      <TableRow
                        sx={{
                          '&:last-child td, &:last-child th': { border: 0 },
                        }}
                      >
                        <TableCell
                          sx={{
                            color: '#555555',
                            maxWidth: 250,
                            borderBottomColor: '#ececec',
                            borderBottomWidth: 2,
                            fontWeight: 700,
                            textWrap: 'nowrap',
                            paddingLeft: {
                              lg: 10,
                              md: 7,
                              xs: 4,
                            },
                            pr: 2,
                          }}
                          component="th"
                          scope="row"
                        >
                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: 500,
                              fontSize: 14,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              gap: 1,
                              backgroundColor: '#F5F6F8',
                              borderTopLeftRadius: '8px',
                              borderBottomLeftRadius: '8px',
                              padding: '8px 12px',
                              margin: '8px 0',
                              textWrap: 'nowrap',
                            }}
                          >
                            {fishHistoryData.farm}
                            <Box
                              sx={{
                                pr: 3,
                              }}
                            ></Box>
                          </Typography>
                        </TableCell>{' '}
                        <TableCell
                          className="table-padding"
                          sx={{
                            borderBottomWidth: 2,
                            borderBottomColor: '#ececec',
                            color: '#555555',
                            fontWeight: 500,
                            pl: 0,
                          }}
                        >
                          {fishHistoryData &&
                            fishHistoryData.units[0].fishManageHistory &&
                            fishHistoryData.units[0].fishManageHistory.map(
                              (unit, i) => {
                                return (
                                  <Typography
                                    key={i}
                                    variant="h6"
                                    sx={{
                                      fontWeight: 500,
                                      fontSize: 14,
                                      backgroundColor: '#F5F6F8',
                                      padding: `${
                                        unit?.currentDate || unit.updatedAt
                                          ? '8px 12px 8px 0'
                                          : '19px 12px 19px 0'
                                      }`,
                                      margin: '8px 0',
                                      // marginBottom: "10px",
                                      // padding: "21px",
                                      textWrap: 'nowrap',
                                    }}
                                  >
                                    {(unit?.currentDate ?? unit.currentDate)
                                      ? unit.currentDate
                                      : new Date(
                                          String(unit?.updatedAt),
                                        ).toLocaleDateString()}
                                  </Typography>
                                );
                              },
                            )}
                        </TableCell>{' '}
                        <TableCell
                          className="table-padding"
                          sx={{
                            borderBottomWidth: 2,
                            borderBottomColor: '#ececec',
                            color: '#555555',
                            fontWeight: 500,
                            pl: 0,
                            textWrap: 'nowrap',
                          }}
                        >
                          {fishHistoryData &&
                            fishHistoryData.units[0].fishManageHistory &&
                            fishHistoryData.units[0].fishManageHistory.map(
                              (unit, i) => {
                                return (
                                  <Typography
                                    key={i}
                                    variant="h6"
                                    sx={{
                                      fontWeight: 500,
                                      fontSize: 14,
                                      backgroundColor: '#F5F6F8',
                                      padding: `${
                                        unit?.field
                                          ? '8px 12px 8px 0'
                                          : '19px 12px 19px 0'
                                      }`,
                                      margin: '8px 0',
                                      // marginBottom: "10px",
                                      // padding: "21px",
                                      textWrap: 'nowrap',
                                    }}
                                  >
                                    {unit.field ? unit.field : 'Stock'}
                                  </Typography>
                                );
                              },
                            )}
                        </TableCell>
                        <TableCell
                          className="table-padding"
                          sx={{
                            borderBottomWidth: 2,
                            borderBottomColor: '#ececec',
                            color: '#555555',
                            fontWeight: 500,
                            pl: 0,
                          }}
                        >
                          {fishHistoryData &&
                            fishHistoryData.units[0].fishManageHistory &&
                            fishHistoryData.units[0].fishManageHistory.map(
                              (unit, i) => {
                                return (
                                  <Typography
                                    key={i}
                                    variant="h6"
                                    sx={{
                                      fontWeight: 500,
                                      fontSize: 14,
                                      backgroundColor: '#F5F6F8',
                                      padding: `${
                                        fishHistoryData.units[0].fishSupply
                                          ?.batchNumber
                                          ? '8px 12px 8px 0'
                                          : '19px 12px 19px 0'
                                      }`,
                                      margin: '8px 0',
                                      textWrap: 'nowrap',
                                    }}
                                  >
                                    {fishHistoryData.units[0].fishSupply
                                      ?.batchNumber ?? ''}
                                  </Typography>
                                );
                              },
                            )}
                        </TableCell>
                        <TableCell
                          className="table-padding"
                          sx={{
                            borderBottomWidth: 2,
                            borderBottomColor: '#ececec',
                            color: '#555555',
                            fontWeight: 500,
                            pl: 0,
                            p: 0,
                          }}
                        >
                          {fishHistoryData &&
                            fishHistoryData.units[0].fishManageHistory &&
                            fishHistoryData.units[0].fishManageHistory.map(
                              (unit, i) => {
                                return (
                                  <Typography
                                    key={i}
                                    variant="h6"
                                    sx={{
                                      fontWeight: 500,
                                      fontSize: 14,
                                      padding: `${
                                        fishHistoryData.units[0].fishSupply?.age
                                          ? '8px 12px 8px 0'
                                          : '19px 12px 19px 0'
                                      }`,
                                      backgroundColor: '#F5F6F8',
                                      margin: '8px 0',

                                      textWrap: 'nowrap',
                                    }}
                                  >
                                    {fishHistoryData.units[0].fishSupply?.age ??
                                      ''}
                                  </Typography>
                                );
                              },
                            )}
                        </TableCell>
                        <TableCell
                          className="table-padding"
                          sx={{
                            borderBottomWidth: 2,
                            borderBottomColor: '#ececec',
                            color: '#555555',
                            fontWeight: 500,
                            pl: 0,
                          }}
                        >
                          {fishHistoryData &&
                            fishHistoryData.units[0].fishManageHistory &&
                            fishHistoryData.units[0].fishManageHistory.map(
                              (unit, i) => {
                                return (
                                  <Typography
                                    key={i}
                                    variant="h6"
                                    sx={{
                                      fontWeight: 500,
                                      fontSize: 14,
                                      backgroundColor: '#F5F6F8',
                                      padding: `${
                                        unit?.fishCount
                                          ? '8px 12px 8px 0'
                                          : '19px 12px 19px 0'
                                      }`,
                                      margin: '8px 0',
                                      // marginBottom: "10px",
                                      // padding: "21px",
                                      textWrap: 'nowrap',
                                    }}
                                  >
                                    {unit?.fishCount ?? ''}
                                  </Typography>
                                );
                              },
                            )}
                        </TableCell>
                        <TableCell
                          className="table-padding"
                          // align="center"
                          sx={{
                            borderBottomColor: '#ececec',
                            borderBottomWidth: 2,
                            color: '#555555',
                            fontWeight: 500,
                            pl: 0,
                          }}
                        >
                          {fishHistoryData &&
                            fishHistoryData.units[0].fishManageHistory &&
                            fishHistoryData.units[0].fishManageHistory.map(
                              (unit, i) => {
                                return (
                                  <Typography
                                    key={i}
                                    variant="h6"
                                    sx={{
                                      fontWeight: 500,
                                      fontSize: 14,
                                      backgroundColor: '#F5F6F8',
                                      padding: `${
                                        unit?.biomass
                                          ? '8px 12px 8px 0'
                                          : '19px 12px 19px 0'
                                      }`,
                                      margin: '8px 0',
                                      // marginBottom: "10px",
                                      textWrap: 'nowrap',
                                    }}
                                  >
                                    {unit.biomass ? `${unit.biomass} kg` : ''}
                                  </Typography>
                                );
                              },
                            )}
                        </TableCell>
                        <TableCell
                          className="table-padding"
                          // align="center"
                          sx={{
                            borderBottomColor: '#ececec',
                            borderBottomWidth: 2,
                            color: '#555555',
                            fontWeight: 500,
                            pl: 0,
                          }}
                        >
                          {fishHistoryData &&
                            fishHistoryData.units[0].fishManageHistory &&
                            fishHistoryData.units[0].fishManageHistory.map(
                              (unit, i) => {
                                return (
                                  <Typography
                                    key={i}
                                    variant="h6"
                                    sx={{
                                      fontWeight: 500,
                                      fontSize: 14,
                                      backgroundColor: '#F5F6F8',
                                      padding: `${
                                        unit?.meanWeight
                                          ? '8px 12px 8px 0'
                                          : '19px 12px 19px 0'
                                      }`,
                                      margin: '8px 0',
                                      // marginBottom: "10px",
                                      textWrap: 'nowrap',
                                    }}
                                  >
                                    {unit.meanWeight
                                      ? `${unit.meanWeight} g`
                                      : ''}
                                  </Typography>
                                );
                              },
                            )}
                        </TableCell>
                        <TableCell
                          className="table-padding"
                          // align="center"
                          sx={{
                            borderBottomColor: '#ececec',
                            borderBottomWidth: 2,
                            color: '#555555',
                            fontWeight: 500,
                            pl: 0,
                          }}
                        >
                          {fishHistoryData &&
                            fishHistoryData.units[0].fishManageHistory &&
                            fishHistoryData.units[0].fishManageHistory.map(
                              (unit, i) => {
                                return (
                                  <Typography
                                    key={i}
                                    variant="h6"
                                    sx={{
                                      fontWeight: 500,
                                      fontSize: 14,
                                      backgroundColor: '#F5F6F8',
                                      padding: `${
                                        unit?.meanLength
                                          ? '8px 12px 8px 0'
                                          : '19px 12px 19px 0'
                                      }`,
                                      margin: '8px 0',
                                      // marginBottom: "10px",
                                      textWrap: 'nowrap',
                                    }}
                                  >
                                    {unit.meanLength
                                      ? `${unit.meanLength} mm`
                                      : ''}
                                  </Typography>
                                );
                              },
                            )}
                        </TableCell>
                        <TableCell
                          className="table-padding"
                          // align="center"
                          sx={{
                            borderBottomColor: '#ececec',
                            borderBottomWidth: 2,
                            color: '#555555',
                            fontWeight: 500,
                            pl: 0,
                          }}
                        >
                          {fishHistoryData &&
                            fishHistoryData.units[0].fishManageHistory &&
                            fishHistoryData.units[0].fishManageHistory.map(
                              (unit, i) => {
                                return (
                                  <Typography
                                    key={i}
                                    variant="h6"
                                    sx={{
                                      fontWeight: 500,
                                      fontSize: 14,
                                      backgroundColor: '#F5F6F8',
                                      padding: '8px 12px 8px 0',
                                      margin: '8px 0',
                                      // marginBottom: "10px",
                                      textWrap: 'nowrap',
                                    }}
                                  >
                                    {Number(unit.stockingDensityKG).toFixed(
                                      2,
                                    ) ?? ''}
                                  </Typography>
                                );
                              },
                            )}
                        </TableCell>
                        <TableCell
                          className="table-padding"
                          // align="center"
                          sx={{
                            borderBottomColor: '#ececec',
                            borderBottomWidth: 2,
                            color: '#555555',
                            fontWeight: 500,
                            pl: 0,
                          }}
                        >
                          {fishHistoryData &&
                            fishHistoryData.units[0].fishManageHistory &&
                            fishHistoryData.units[0].fishManageHistory.map(
                              (unit, i) => {
                                return (
                                  <Typography
                                    key={i}
                                    variant="h6"
                                    sx={{
                                      fontWeight: 500,
                                      fontSize: 14,
                                      backgroundColor: '#F5F6F8',
                                      padding: '8px 12px 8px 0',
                                      margin: '8px 0',
                                      // marginBottom: "10px",
                                      textWrap: 'nowrap',
                                    }}
                                  >
                                    {Number(unit.stockingDensityNM).toFixed(
                                      2,
                                    ) ?? ''}
                                  </Typography>
                                );
                              },
                            )}

                          {/* {farm.meanWeight ? `${farm.meanWeight}g` : ""} */}
                        </TableCell>{' '}
                        <TableCell
                          className="table-padding"
                          sx={{
                            borderBottomColor: '#ececec',
                            borderBottomWidth: 2,
                            color: '#555555',
                            fontWeight: 500,
                            pl: 0,
                          }}
                        >
                          {fishHistoryData &&
                            fishHistoryData.units[0].fishManageHistory &&
                            fishHistoryData.units[0].fishManageHistory.map(
                              (unit, i) => {
                                return (
                                  <Typography
                                    key={i}
                                    variant="h6"
                                    sx={{
                                      fontWeight: 500,
                                      fontSize: 14,
                                      backgroundColor: '#F5F6F8',
                                      padding: '8px 12px 8px 0',
                                      margin: '8px 0',
                                      // marginBottom: "10px",
                                      textWrap: 'nowrap',
                                    }}
                                  >
                                    {Number(unit.stockingLevel) ?? ''}
                                  </Typography>
                                );
                              },
                            )}
                        </TableCell>
                      </TableRow>
                    )
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} sx={{ textAlign: 'center' }}>
                        No Data Found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </TabPanel>
        <TabPanel value="graph" hidden={tab === 'graph' ? false : true}>
          <FishHistoryCharts
            productions={productions}
            groupedData={groupedData}
            startDate={startDate}
            endDate={endDate}
            fishId={fishId}
          />
        </TabPanel>
      </TabContext>
    </Box>
  );
};

export default FishManageHistoryTable;
