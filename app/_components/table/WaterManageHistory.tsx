'use client';
import { getLocalItem } from '@/app/_lib/utils';
import { waterSampleHistoryHead } from '@/app/_lib/utils/tableHeadData';
import { Farm, TableHeadType } from '@/app/_typeModels/Farm';
import {
  Production,
  WaterManageHistoryGroup,
} from '@/app/_typeModels/production';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Grid,
  Paper,
  TableBody,
  TableSortLabel,
  Tooltip,
  Typography,
} from '@mui/material';
import Tab from '@mui/material/Tab';
import Table from '@mui/material/Table';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { getCookie, setCookie } from 'cookies-next';
import dayjs from 'dayjs';
import React, { useEffect, useMemo, useState } from 'react';
import WaterSampleHistoryModal from '../models/WaterSampleHistory';
import WaterHistoryCharts from '../production/waterHistoryCharts/WaterHistoryCharts';
import { breadcrumsAction } from '@/lib/features/breadcrum/breadcrumSlice';
import { useAppDispatch } from '@/lib/hooks';
import { usePathname } from 'next/navigation';
import { EnhancedTableHeadProps } from '../UserTable';

interface Props {
  tableData: TableHeadType[];
  productions: Production[];
  farms: Farm[];
  waterId: string;
}
const WaterManageHistoryTable: React.FC<Props> = ({
  tableData,
  productions,
  farms,
  waterId,
}) => {
  const dispatch = useAppDispatch();
  const pathName = usePathname();
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [orderBy, setOrderBy] = useState('Farm');
  const [tab, setTab] = useState<string>('list');
  const [waterHistoryData, setWaterHistoryData] =
    useState<WaterManageHistoryGroup>();
  const [sortDataFromLocal, setSortDataFromLocal] = React.useState<{
    direction: 'asc' | 'desc';
    column: string;
  }>({ direction: 'asc', column: '' });
  const [isWaterSampleHistory, setIsWaterSampleHistory] =
    useState<boolean>(false);
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
              {idx === 0 ? (
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
  const groupedData: WaterManageHistoryGroup = useMemo(() => {
    const filteredFarm = productions?.reduce(
      (result: WaterManageHistoryGroup[], item) => {
        // Find or create a farm group
        let farmGroup = result.find((group) => group.unit === item.farm.name);
        if (!farmGroup) {
          farmGroup = {
            unit: item.productionUnit.name,
            farm: item.farm.name,
            units: [],
          };
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
          waterManageHistory: item.WaterManageHistory,
          WaterManageHistoryAvgrage: item.WaterManageHistoryAvgrage,
        });

        return result;
      },
      [],
    );

    // Return only the first element of the grouped data or null if empty
    return filteredFarm?.[0] ?? null;
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
    const unitData = groupedData?.units[0]?.WaterManageHistoryAvgrage;
    if (unitData) {
      const sortedData = [...unitData].sort((water1, water2) => {
        const orderType = order === 'asc' ? 1 : -1;
        if (property == 'Date') {
          if (water1.createdAt < water2.createdAt) return -1 * orderType;
          if (water1.createdAt > water2.createdAt) return 1 * orderType;
          return 0;
        } else if (property === 'water temp') {
          if (water1.waterTemp < water2.waterTemp) return -1 * orderType;
          if (water1.waterTemp > water2.waterTemp) return 1 * orderType;
          return 0;
        } else if (property === 'Dissolved oxygen') {
          if (water1.DO < water2.DO) return -1 * orderType;
          if (water1.DO > water2.DO) return 1 * orderType;
          return 0;
        } else if (property === 'tss') {
          if (water1.TSS < water2.TSS) return -1 * orderType;
          if (water1.TSS > water2.TSS) return 1 * orderType;
          return 0;
        } else if (property === 'nh4') {
          if (water1.NH4 < water2.NH4) return -1 * orderType;
          if (water1.NH4 > water2.NH4) return 1 * orderType;
          return 0;
        } else if (property === 'no3') {
          if (water1.NO3 < water2.NO3) return -1 * orderType;
          if (water1.NO3 > water2.NO3) return 1 * orderType;
          return 0;
        } else if (property === 'no2') {
          if (water1.NO2 < water2.NO2) return -1 * orderType;
          if (water1.NO2 > water2.NO2) return 1 * orderType;
          return 0;
        } else if (property === 'ph') {
          if (water1.ph < water2.ph) return -1 * orderType;
          if (water1.ph > water2.ph) return 1 * orderType;
          return 0;
        } else if (property === 'visibility') {
          if (water1.visibility < water2.visibility) return -1 * orderType;
          if (water1.visibility > water2.visibility) return 1 * orderType;
          return 0;
        }

        return 0;
      });
      const finalSortedData = {
        unit: groupedData?.unit,
        farm: groupedData.farm,
        units: [
          {
            ...groupedData?.units[0],
            WaterManageHistoryAvgrage: sortedData,
          },
        ],
      };

      // Update water history data
      setWaterHistoryData(finalSortedData);
    }
  };
  useEffect(() => {
    if (sortDataFromLocal) {
      const data = sortDataFromLocal;
      setOrder(data.direction);
      setOrderBy(data.column);
      const unitData = groupedData?.units[0]?.WaterManageHistoryAvgrage;
      if (unitData) {
        const sortedData = [...unitData].sort((water1, water2) => {
          const orderType = data.direction === 'asc' ? -1 : 1;
          if (data.column == 'Date') {
            if (water1.createdAt < water2.createdAt) return -1 * orderType;
            if (water1.createdAt > water2.createdAt) return 1 * orderType;
            return 0;
          } else if (data.column === 'water temp') {
            if (water1.waterTemp < water2.waterTemp) return -1 * orderType;
            if (water1.waterTemp > water2.waterTemp) return 1 * orderType;
            return 0;
          } else if (data.column === 'Dissolved oxygen') {
            if (water1.DO < water2.DO) return -1 * orderType;
            if (water1.DO > water2.DO) return 1 * orderType;
            return 0;
          } else if (data.column === 'tss') {
            if (water1.TSS < water2.TSS) return -1 * orderType;
            if (water1.TSS > water2.TSS) return 1 * orderType;
            return 0;
          } else if (data.column === 'nh4') {
            if (water1.NH4 < water2.NH4) return -1 * orderType;
            if (water1.NH4 > water2.NH4) return 1 * orderType;
            return 0;
          } else if (data.column === 'no3') {
            if (water1.NO3 < water2.NO3) return -1 * orderType;
            if (water1.NO3 > water2.NO3) return 1 * orderType;
            return 0;
          } else if (data.column === 'no2') {
            if (water1.NO2 < water2.NO2) return -1 * orderType;
            if (water1.NO2 > water2.NO2) return 1 * orderType;
            return 0;
          } else if (data.column === 'ph') {
            if (water1.ph < water2.ph) return -1 * orderType;
            if (water1.ph > water2.ph) return 1 * orderType;
            return 0;
          } else if (data.column === 'visibility') {
            if (water1.visibility < water2.visibility) return -1 * orderType;
            if (water1.visibility > water2.visibility) return 1 * orderType;
            return 0;
          }

          return 0;
        });
        const finalSortedData = {
          unit: groupedData?.unit,
          farm: groupedData?.farm,
          units: [
            {
              ...groupedData?.units[0],
              WaterManageHistoryAvgrage: sortedData,
            },
          ],
        };

        // Update water history data
        setWaterHistoryData(finalSortedData);
      }
    }
  }, [sortDataFromLocal]);
  useEffect(() => {
    if (tab) {
      setCookie('waterTab', tab);
    }
  }, [tab]);
  useEffect(() => {
    if (groupedData && !sortDataFromLocal) {
      setWaterHistoryData(groupedData);
    }
  }, [groupedData]);
  useEffect(() => {
    if (pathName) {
      setSortDataFromLocal(getLocalItem(pathName));
    }
  }, [pathName]);
  useEffect(() => {
    const currentTab = getCookie('waterTab');
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
              <Tab
                label="Graph"
                value="graph"
                className="tab-item"
                disabled={
                  waterHistoryData?.units[0]?.WaterManageHistoryAvgrage
                    ?.length === 0
                }
              />
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
        <TabPanel
          value="list"
          // className={`base-TabPanel-root ${
          //   tab === "list" ? "" : "base-TabPanel-hidden"
          // }`}
          hidden={tab === 'list' ? false : true}
        >
          <Paper
            sx={{
              width: '100%',
              overflow: 'hidden',
              borderRadius: '14px',
              boxShadow: '0px 0px 16px 5px #0000001A',
              textAlign: 'center',
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
                  {waterHistoryData?.unit ? (
                    <TableRow
                      sx={{
                        '&:last-child td, &:last-child th': {
                          border: 0,
                        },
                      }}
                    >
                      <TableCell
                        sx={{
                          color: '#555555',
                          borderBottomColor: '#ececec',
                          borderBottomWidth: 2,
                          fontWeight: 700,
                          paddingLeft: {
                            lg: 10,
                            md: 7,
                            xs: 4,
                          },
                          textWrap: 'nowrap',
                        }}
                        component="th"
                        scope="row"
                      >
                        {waterHistoryData?.units?.map((unit, i) => {
                          const isDisabled =
                            waterHistoryData?.units[0]
                              ?.WaterManageHistoryAvgrage?.length === 0;

                          return (
                            <Typography
                              key={i}
                              variant="h6"
                              sx={{
                                fontWeight: 500,
                                fontSize: 14,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                padding: '8px 12px',
                                margin: '8px 0',
                                textWrap: 'nowrap',
                              }}
                            >
                              {unit.productionUnit.name}
                              <Tooltip title="View history" placement="top">
                                <Box
                                  sx={{
                                    pr: 3,
                                  }}
                                >
                                  <Button
                                    onClick={() =>
                                      setIsWaterSampleHistory(true)
                                    }
                                    className=""
                                    disabled={isDisabled}
                                    type="button"
                                    variant="contained"
                                    style={{
                                      border: '1px solid #06A19B',
                                    }}
                                    sx={{
                                      background: 'transparent',
                                      fontWeight: 'bold',
                                      padding: 0.25,

                                      borderRadius: '4px',
                                      alignItems: 'center',
                                      minWidth: 'fit-content',
                                    }}
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="1em"
                                      height="1em"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        fill="#06A19B"
                                        d="M21 11.11V5a2 2 0 0 0-2-2h-4.18C14.4 1.84 13.3 1 12 1s-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14a2 2 0 0 0 2 2h6.11c1.26 1.24 2.98 2 4.89 2c3.87 0 7-3.13 7-7c0-1.91-.76-3.63-2-4.89M12 3c.55 0 1 .45 1 1s-.45 1-1 1s-1-.45-1-1s.45-1 1-1M5 19V5h2v2h10V5h2v4.68c-.91-.43-1.92-.68-3-.68H7v2h4.1c-.6.57-1.06 1.25-1.42 2H7v2h2.08c-.05.33-.08.66-.08 1c0 1.08.25 2.09.68 3zm11 2c-2.76 0-5-2.24-5-5s2.24-5 5-5s5 2.24 5 5s-2.24 5-5 5m.5-4.75l2.86 1.69l-.75 1.22L15 17v-5h1.5z"
                                      />
                                    </svg>
                                  </Button>
                                </Box>
                              </Tooltip>
                            </Typography>
                          );
                        })}
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
                        {waterHistoryData?.units[0].waterManageHistory &&
                          waterHistoryData?.units[0].waterManageHistory.map(
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
                                      unit?.currentDate
                                        ? '8px 12px 8px 0'
                                        : '19px 12px 19px 0'
                                    }`,
                                    margin: '8px 0',
                                    textWrap: 'nowrap',
                                  }}
                                >
                                  {unit?.currentDate}
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
                        }}
                      >
                        {waterHistoryData &&
                          waterHistoryData.units[0].WaterManageHistoryAvgrage &&
                          waterHistoryData.units[0].WaterManageHistoryAvgrage.map(
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
                                      unit?.waterTemp
                                        ? '8px 12px 8px 0'
                                        : '19px 12px 19px 0'
                                    }`,
                                    margin: '8px 0',
                                    // marginBottom: "10px",
                                    // padding: "21px",
                                    textWrap: 'nowrap',
                                  }}
                                >
                                  {unit.waterTemp ?? ''}
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
                        {waterHistoryData &&
                          waterHistoryData.units[0].WaterManageHistoryAvgrage &&
                          waterHistoryData.units[0].WaterManageHistoryAvgrage.map(
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
                                      unit.DO
                                        ? '8px 12px 8px 0'
                                        : '19px 12px 19px 0'
                                    }`,
                                    margin: '8px 0',
                                    textWrap: 'nowrap',
                                  }}
                                >
                                  {unit.DO ?? ''}
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
                        {waterHistoryData &&
                          waterHistoryData.units[0].WaterManageHistoryAvgrage &&
                          waterHistoryData.units[0].WaterManageHistoryAvgrage.map(
                            (unit, i) => {
                              return (
                                <Typography
                                  key={i}
                                  variant="h6"
                                  sx={{
                                    fontWeight: 500,
                                    fontSize: 14,
                                    padding: `${
                                      unit.TSS
                                        ? '8px 12px 8px 0'
                                        : '19px 12px 19px 0'
                                    }`,
                                    backgroundColor: '#F5F6F8',
                                    margin: '8px 0',

                                    textWrap: 'nowrap',
                                  }}
                                >
                                  {unit.TSS ?? ''}
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
                        {waterHistoryData &&
                          waterHistoryData.units[0].WaterManageHistoryAvgrage &&
                          waterHistoryData.units[0].WaterManageHistoryAvgrage.map(
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
                                      unit?.NH4
                                        ? '8px 12px 8px 0'
                                        : '19px 12px 19px 0'
                                    }`,
                                    margin: '8px 0',
                                    // marginBottom: "10px",
                                    // padding: "21px",
                                    textWrap: 'nowrap',
                                  }}
                                >
                                  {unit?.NH4 ?? ''}
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
                        {waterHistoryData &&
                          waterHistoryData.units[0].WaterManageHistoryAvgrage &&
                          waterHistoryData.units[0].WaterManageHistoryAvgrage.map(
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
                                      unit?.NO3
                                        ? '8px 12px 8px 0'
                                        : '19px 12px 19px 0'
                                    }`,
                                    margin: '8px 0',
                                    // marginBottom: "10px",
                                    textWrap: 'nowrap',
                                  }}
                                >
                                  {unit.NO3 ?? ''}
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
                        {waterHistoryData &&
                          waterHistoryData.units[0].WaterManageHistoryAvgrage &&
                          waterHistoryData.units[0].WaterManageHistoryAvgrage.map(
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
                                      unit?.NO2
                                        ? '8px 12px 8px 0'
                                        : '19px 12px 19px 0'
                                    }`,
                                    margin: '8px 0',
                                    // marginBottom: "10px",
                                    textWrap: 'nowrap',
                                  }}
                                >
                                  {unit.NO2 ?? ''}
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
                        {waterHistoryData &&
                          waterHistoryData.units[0].WaterManageHistoryAvgrage &&
                          waterHistoryData.units[0].WaterManageHistoryAvgrage.map(
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
                                      unit?.ph
                                        ? '8px 12px 8px 0'
                                        : '19px 12px 19px 0'
                                    }`,
                                    margin: '8px 0',
                                    // marginBottom: "10px",
                                    textWrap: 'nowrap',
                                  }}
                                >
                                  {unit.ph ?? ''}
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
                        {waterHistoryData &&
                          waterHistoryData.units[0].WaterManageHistoryAvgrage &&
                          waterHistoryData.units[0].WaterManageHistoryAvgrage.map(
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
                                      unit?.visibility
                                        ? '8px 12px 8px 0'
                                        : '19px 12px 19px 0'
                                    }`,
                                    margin: '8px 0',
                                    // marginBottom: "10px",
                                    textWrap: 'nowrap',
                                  }}
                                >
                                  {unit.visibility ?? ''}
                                </Typography>
                              );
                            },
                          )}
                      </TableCell>
                    </TableRow>
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

            <WaterSampleHistoryModal
              open={isWaterSampleHistory}
              setOpen={setIsWaterSampleHistory}
              tableData={waterSampleHistoryHead}
              productions={productions}
            />
          </Paper>
        </TabPanel>
        <TabPanel
          value="graph"
          // className={`base-TabPanel-root ${
          //   tab === "graph" ? "" : "base-TabPanel-hidden"
          // }`}
          hidden={tab === 'graph' ? false : true}
        >
          <WaterHistoryCharts
            productions={productions}
            groupedData={groupedData}
            farms={farms}
            waterId={waterId}
            startDate={startDate}
            endDate={endDate}
          />
        </TabPanel>
      </TabContext>
    </Box>
  );
};

export default WaterManageHistoryTable;
