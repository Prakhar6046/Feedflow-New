'use client';
import TransferModal from '@/app/_components/models/FarmManager';
import {
  getLocalItem,
  ProductionSortTables,
  setLocalItem,
} from '@/app/_lib/utils';
import {
  farmManagerFishHead,
  farmManagerFishHeadMember,
  farmManagerWaterHead,
  farmManagerWaterHeadMember,
  feedingHead,
  feedingHeadMember,
} from '@/app/_lib/utils/tableHeadData';
import { Farm } from '@/app/_typeModels/Farm';
import {
  FarmGroup,
  FarmGroupUnit,
  Production,
} from '@/app/_typeModels/production';
import { breadcrumsAction } from '@/lib/features/breadcrum/breadcrumSlice';
import { selectRole } from '@/lib/features/user/userSlice';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import {
  Box,
  Button,
  Divider,
  Menu,
  MenuItem,
  Stack,
  Tab,
  TableSortLabel,
  Tooltip,
  Typography,
} from '@mui/material';

import { useBreakpoint } from '@/app/hooks/useBreakPoint';
import { selectSelectedAverage } from '@/lib/features/commonFilters/commonFilters';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { getCookie, setCookie } from 'cookies-next';
import html2canvas from 'html2canvas';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import Loader from '../Loader';
import AddFeedFed from '../models/AddFeedFed';
import Test from '../models/Test';
import WaterQualityParameter from '../models/WaterQualityParameter';
import ProductionManagerFilter from '../ProductionManagerFilter';
import { EnhancedTableHeadProps } from '../UserTable';

interface Props {
  productions: Production[];
  farms: Farm[];
  batches: { batchNumber: string; id: number }[];
}

export default function ProductionTable({
  productions,
  farms,
  batches,
}: Props) {
  const captureRef = useRef(null);
  const router = useRouter();
  const breakpoint = useBreakpoint();
  const dispatch = useAppDispatch();
  const pathName = usePathname();
  const role = useAppSelector(selectRole);
  const searchParams = useSearchParams();
  const isFish = searchParams.get('isFish');
  const isWater = searchParams.get('isWater');
  const [production, setProduction] = useState<Production>({} as Production);
  const loggedUser = getCookie('logged-user');
  const [selectedView, setSelectedView] = useState<string>();
  const [selectedFarm, setSelectedFarm] = useState<any>();
  const [isFeedFedModalOpen, setIsFeedFedModalOpen] = useState<boolean>(false);
  const [isReportDownload, setIsReportDownload] = useState<boolean>(false);
  const [selectedProduction, setSelectedProduction] = useState<
    Production | null | FarmGroupUnit
  >(production ?? null);
  const [tableHead, setTableHead] = useState<
    {
      id: string;
      numeric: boolean;
      disablePadding: boolean;
      label: string;
      smallLabel: string;
    }[]
  >();
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null,
  );

  const [test, setTest] = useState<boolean>(false);

  const [openTransferModal, setOpenTransferModal] = useState<boolean>(
    isFish ? true : false,
  );
  const [openWaterQualityModal, setOpenWaterQualityModal] = useState<boolean>(
    isWater ? true : false,
  );

  const [productionData, setProductionData] = useState<FarmGroup[]>();
  const [order, setOrder] = React.useState<'asc' | 'desc'>('asc');
  const [orderBy, setOrderBy] = React.useState('Farm');
  const [sortDataFromLocal, setSortDataFromLocal] = React.useState<{
    direction: 'asc' | 'desc';
    column: string;
  }>({ direction: 'asc', column: '' });
  const selectedAverage = useAppSelector(selectSelectedAverage);

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleFishManageHistory = (unit: FarmGroupUnit) => {
    if (selectedView == 'fish') {
      router.push(`/dashboard/production/fish/${unit.productionUnit.id}`);
    } else {
      router.push(`/dashboard/production/water/${unit.productionUnit.id}`);
    }
  };
  const captureScreenshot = async () => {
    setIsReportDownload(true);
    const tempContainer = document.createElement('div');
    document.body.appendChild(tempContainer);
    const chartDiv = document.createElement('div');
    tempContainer.appendChild(chartDiv);
    const root = createRoot(chartDiv);
    root.render(
      <Paper
        ref={captureRef}
        style={{
          maxWidth: '100vw',
          width: '100%',
          height: '100%',
          fontFamily: 'Arial, sans-serif',
          margin: 'auto',
        }}
      >
        <div
          style={{
            padding: '12px 20px',
            backgroundColor: 'rgb(6,161,155)',
            boxShadow: '0 0 3px rgb(6, 161, 155)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <img src="/static/img/logo-bigone.jpg" alt="Logo" width={200} />
          <div>
            <h6
              style={{
                marginBottom: '4px',
                fontSize: '16px',
                color: 'white',
              }}
            >
              Production Report
            </h6>
          </div>
        </div>
        <TableContainer
          sx={{
            overflow: 'auto',
          }}
        >
          <Table
            stickyHeader
            aria-label="sticky table"
            sx={{ background: '#FFF' }}
          >
            <TableHead
              sx={{
                textAlign: 'center',
                textWrap: 'nowrap',
              }}
            >
              <TableRow></TableRow>
            </TableHead>
            {/* <EnhancedTableHead
            // sx={{
            //   backgroundColor: 'red',
            // }}
            /> */}
            <TableBody>
              {productionData && productionData?.length > 0 ? (
                productionData?.map((farm: FarmGroup, i: number) => {
                  return (
                    <TableRow
                      key={farm.units[i].id.toString()}
                      sx={{
                        '&:last-child td, &:last-child th': { border: 0 },
                      }}
                    >
                      <TableCell
                        sx={{
                          color: '#555555',
                          paddingRight: '20px',
                          maxWidth: 250,
                          borderBottomColor: '#F5F6F8',
                          borderBottomWidth: 2,
                          fontWeight: 700,
                          textWrap: 'nowrap',
                          paddingLeft: {
                            lg: 10,
                            md: 3,
                            xs: 3,
                          },
                          pr: 2,
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          {farm.farm ?? ''}
                        </Box>
                      </TableCell>

                      <TableCell
                        className="table-padding"
                        sx={{
                          borderBottomWidth: 2,
                          borderBottomColor: '#F5F6F8',
                          color: '#555555',
                          fontWeight: 500,
                          pl: 0,
                          textWrap: 'nowrap',
                        }}
                      >
                        {farm.units.map((unit, i) => {
                          return (
                            <>
                              <Typography
                                key={i}
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
                                {unit.productionUnit.name}
                              </Typography>
                            </>
                          );
                        })}
                      </TableCell>
                      <TableCell
                        className="table-padding"
                        sx={{
                          borderBottomWidth: 2,
                          borderBottomColor: '#ececec',
                          color: '#555555',
                          fontWeight: 500,
                          pl: 0,
                          textWrap: 'wrap',
                        }}
                      >
                        {farm.units?.map((unit, i) => {
                          const value =
                            selectedView === 'water'
                              ? selectedAverage === 'Monthly average'
                                ? String(
                                    unit.monthlyAveragesWater?.waterTemp,
                                  ) || ''
                                : selectedAverage === 'Yearly average'
                                  ? String(
                                      unit.yearlyAveragesWater?.waterTemp,
                                    ) || ''
                                  : selectedAverage === 'All-time average'
                                    ? String(
                                        unit.allTimeAveragesWater?.waterTemp,
                                      ) || ''
                                    : selectedAverage === 'Individual average'
                                      ? String(
                                          unit.individualAveragesWater
                                            ?.waterTemp,
                                        ) || ''
                                      : (unit.waterTemp ?? '')
                              : unit?.fishSupply?.batchNumber.length;

                          // Calculate padding based on whether a value exists
                          const paddingValue = value
                            ? '8px 12px 8px 0'
                            : '19px 12px 19px 0';
                          return (
                            <Typography
                              key={i}
                              variant="h6"
                              sx={{
                                fontWeight: 500,
                                fontSize: 14,
                                backgroundColor: '#F5F6F8',
                                padding: paddingValue,
                                margin: '8px 0',
                                textWrap: 'nowrap',
                              }}
                            >
                              {value}
                            </Typography>
                          );
                        })}
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
                          textWrap: 'wrap',
                        }}
                      >
                        {farm.units.map((unit, i) => {
                          const value =
                            selectedView === 'water'
                              ? selectedAverage === 'Monthly average'
                                ? String(unit.monthlyAveragesWater?.DO) || ''
                                : selectedAverage === 'Yearly average'
                                  ? String(unit.yearlyAveragesWater?.DO) || ''
                                  : selectedAverage === 'All-time average'
                                    ? String(unit.allTimeAveragesWater?.DO) ||
                                      ''
                                    : selectedAverage === 'Individual average'
                                      ? String(
                                          unit.individualAveragesWater?.DO,
                                        ) || ''
                                      : (unit.DO ?? '')
                              : unit?.fishSupply?.age;

                          // Calculate padding based on whether a value exists
                          const paddingValue = value
                            ? '8px 12px 8px 0'
                            : '19px 12px 19px 0';
                          return (
                            <Typography
                              key={i}
                              variant="h6"
                              sx={{
                                fontWeight: 500,
                                fontSize: 14,
                                padding: paddingValue,
                                backgroundColor: '#F5F6F8',
                                margin: '8px 0',
                                textWrap: 'nowrap',
                              }}
                            >
                              {value}
                            </Typography>
                          );
                        })}
                      </TableCell>
                      <TableCell
                        className="table-padding"
                        sx={{
                          borderBottomWidth: 2,
                          borderBottomColor: '#ececec',
                          color: '#555555',
                          fontWeight: 500,
                          pl: 0,
                          textWrap: 'wrap',
                        }}
                      >
                        {farm.units.map((unit, i) => {
                          // Determine the value to display
                          const value =
                            selectedView === 'water'
                              ? selectedAverage === 'Monthly average'
                                ? String(unit.monthlyAveragesWater?.TSS) || ''
                                : selectedAverage === 'Yearly average'
                                  ? String(unit.yearlyAveragesWater?.TSS) || ''
                                  : selectedAverage === 'All-time average'
                                    ? String(unit.allTimeAveragesWater?.TSS) ||
                                      ''
                                    : selectedAverage === 'Individual average'
                                      ? String(
                                          unit.individualAveragesWater?.TSS,
                                        ) || ''
                                      : (unit.TSS ?? '')
                              : selectedAverage === 'Monthly average'
                                ? String(unit.monthlyAverages?.fishCount) || ''
                                : selectedAverage === 'Yearly average'
                                  ? String(unit.yearlyAverages?.fishCount) || ''
                                  : selectedAverage === 'All-time average'
                                    ? String(unit.allTimeAverages?.fishCount) ||
                                      ''
                                    : selectedAverage === 'Individual average'
                                      ? String(
                                          unit.individualAverages?.fishCount,
                                        ) || ''
                                      : (unit?.fishCount ?? '');

                          // Calculate padding based on whether a value exists
                          const paddingValue = value
                            ? '8px 12px 8px 0'
                            : '19px 12px 19px 0';

                          return (
                            <Typography
                              key={i}
                              variant="h6"
                              sx={{
                                fontWeight: 500,
                                fontSize: 14,
                                backgroundColor: '#F5F6F8',
                                padding: paddingValue,
                                margin: '8px 0',
                                textWrap: 'nowrap',
                              }}
                            >
                              {value}
                            </Typography>
                          );
                        })}
                      </TableCell>
                      <TableCell
                        className="table-padding"
                        sx={{
                          borderBottomColor: '#ececec',
                          borderBottomWidth: 2,
                          color: '#555555',
                          fontWeight: 500,
                          pl: 0,
                          textWrap: 'nowrap',
                        }}
                      >
                        {farm.units.map((unit, i) => {
                          // Determine the value to display
                          const value =
                            selectedView === 'water'
                              ? selectedAverage === 'Monthly average'
                                ? String(unit.monthlyAveragesWater?.NH4) || ''
                                : selectedAverage === 'Yearly average'
                                  ? String(unit.yearlyAveragesWater?.NH4) || ''
                                  : selectedAverage === 'All-time average'
                                    ? String(unit.allTimeAveragesWater?.NH4) ||
                                      ''
                                    : selectedAverage === 'Individual average'
                                      ? String(
                                          unit.individualAveragesWater?.NH4,
                                        ) || ''
                                      : (unit.NH4 ?? '')
                              : selectedAverage === 'Monthly average'
                                ? String(unit.monthlyAverages?.biomass) || ''
                                : selectedAverage === 'Yearly average'
                                  ? String(unit.yearlyAverages?.biomass) || ''
                                  : selectedAverage === 'All-time average'
                                    ? String(unit.allTimeAverages?.biomass) ||
                                      ''
                                    : selectedAverage === 'Individual average'
                                      ? String(
                                          unit.individualAverages?.biomass,
                                        ) || ''
                                      : (unit.biomass ?? '');

                          // Calculate padding based on whether a value exists
                          const paddingValue = value
                            ? '8px 12px 8px 0'
                            : '19px 12px 19px 0';

                          return (
                            <Typography
                              key={i}
                              variant="h6"
                              sx={{
                                fontWeight: 500,
                                fontSize: 14,
                                backgroundColor: '#F5F6F8',
                                padding: paddingValue,
                                margin: '8px 0',
                                textWrap: 'nowrap',
                              }}
                            >
                              {value}
                            </Typography>
                          );
                        })}
                      </TableCell>
                      <TableCell
                        className="table-padding"
                        sx={{
                          borderBottomColor: '#ececec',
                          borderBottomWidth: 2,
                          color: '#555555',
                          fontWeight: 500,
                          pl: 0,
                          textWrap: 'nowrap',
                        }}
                      >
                        {farm.units.map((unit, i) => {
                          // Determine the value to display
                          const value =
                            selectedView === 'water'
                              ? selectedAverage === 'Monthly average'
                                ? String(unit.monthlyAveragesWater?.NO3) || ''
                                : selectedAverage === 'Yearly average'
                                  ? String(unit.yearlyAveragesWater?.NO3) || ''
                                  : selectedAverage === 'All-time average'
                                    ? String(unit.allTimeAveragesWater?.NO3) ||
                                      ''
                                    : selectedAverage === 'Individual average'
                                      ? String(
                                          unit.individualAveragesWater?.NO3,
                                        ) || ''
                                      : (unit.NO3 ?? '')
                              : selectedAverage === 'Monthly average'
                                ? String(unit.monthlyAverages?.meanWeight) || ''
                                : selectedAverage === 'Yearly average'
                                  ? String(unit.yearlyAverages?.meanWeight) ||
                                    ''
                                  : selectedAverage === 'All-time average'
                                    ? String(
                                        unit.allTimeAverages?.meanWeight,
                                      ) || ''
                                    : selectedAverage === 'Individual average'
                                      ? String(
                                          unit.individualAverages?.meanWeight,
                                        ) || ''
                                      : (unit.meanWeight ?? '');

                          // Calculate padding based on whether a value exists
                          const paddingValue = value
                            ? '8px 12px 8px 0'
                            : '19px 12px 19px 0';

                          return (
                            <Typography
                              key={i}
                              variant="h6"
                              sx={{
                                fontWeight: 500,
                                fontSize: 14,
                                backgroundColor: '#F5F6F8',
                                padding: paddingValue,
                                margin: '8px 0',
                                textWrap: 'nowrap',
                              }}
                            >
                              {value}
                            </Typography>
                          );
                        })}
                      </TableCell>
                      <TableCell
                        className="table-padding"
                        sx={{
                          borderBottomColor: '#ececec',
                          borderBottomWidth: 2,
                          color: '#555555',
                          fontWeight: 500,

                          pl: 0,
                          textWrap: 'nowrap',
                        }}
                      >
                        {farm.units.map((unit, i) => {
                          // Determine the value to display
                          const value =
                            selectedView === 'water'
                              ? selectedAverage === 'Monthly average'
                                ? String(unit.monthlyAveragesWater?.NO2) || ''
                                : selectedAverage === 'Yearly average'
                                  ? String(unit.yearlyAveragesWater?.NO2) || ''
                                  : selectedAverage === 'All-time average'
                                    ? String(unit.allTimeAveragesWater?.NO2) ||
                                      ''
                                    : selectedAverage === 'Individual average'
                                      ? String(
                                          unit.individualAveragesWater?.NO2,
                                        ) || ''
                                      : (unit.NO2 ?? '')
                              : selectedAverage === 'Monthly average'
                                ? String(unit.monthlyAverages?.meanLength) || ''
                                : selectedAverage === 'Yearly average'
                                  ? String(unit.yearlyAverages?.meanLength) ||
                                    ''
                                  : selectedAverage === 'All-time average'
                                    ? String(
                                        unit.allTimeAverages?.meanLength,
                                      ) || ''
                                    : selectedAverage === 'Individual average'
                                      ? String(
                                          unit.individualAverages?.meanLength,
                                        ) || ''
                                      : (unit.meanLength ?? '');

                          // Calculate padding based on whether a value exists
                          const paddingValue = value
                            ? '8px 12px 8px 0'
                            : '19px 12px 19px 0';

                          return (
                            <Typography
                              key={i}
                              variant="h6"
                              sx={{
                                fontWeight: 500,
                                fontSize: 14,
                                backgroundColor: '#F5F6F8',
                                padding: paddingValue,
                                margin: '8px 0',
                                textWrap: 'nowrap',
                              }}
                            >
                              {value}
                            </Typography>
                          );
                        })}
                      </TableCell>
                      <TableCell
                        className="table-padding"
                        sx={{
                          borderBottomColor: '#ececec',
                          borderBottomWidth: 2,
                          color: '#555555',
                          fontWeight: 500,
                          pl: 0,
                          textWrap: 'nowrap',
                        }}
                      >
                        {farm.units.map((unit, i) => {
                          // Determine the value to display
                          const value =
                            selectedView === 'water'
                              ? selectedAverage === 'Monthly average'
                                ? String(unit.monthlyAveragesWater?.ph) || ''
                                : selectedAverage === 'Yearly average'
                                  ? String(unit.yearlyAveragesWater?.ph) || ''
                                  : selectedAverage === 'All-time average'
                                    ? String(unit.allTimeAveragesWater?.ph) ||
                                      ''
                                    : selectedAverage === 'Individual average'
                                      ? String(
                                          unit.individualAveragesWater?.ph,
                                        ) || ''
                                      : (unit.ph ?? '')
                              : selectedAverage === 'Monthly average'
                                ? Number(
                                    unit.monthlyAverages?.stockingDensityKG ||
                                      0,
                                  ).toFixed(2)
                                : selectedAverage === 'Yearly average'
                                  ? Number(
                                      unit.yearlyAverages?.stockingDensityKG ||
                                        0,
                                    ).toFixed(2)
                                  : selectedAverage === 'All-time average'
                                    ? Number(
                                        unit.allTimeAverages
                                          ?.stockingDensityKG || 0,
                                      ).toFixed(2)
                                    : selectedAverage === 'Individual average'
                                      ? Number(
                                          unit.individualAverages
                                            ?.stockingDensityKG || 0,
                                        ).toFixed(2)
                                      : Number(
                                          unit.stockingDensityKG || 0,
                                        ).toFixed(2);

                          // Calculate padding based on whether a value exists
                          const paddingValue = value
                            ? '8px 12px 8px 0'
                            : '19px 12px 19px 0';

                          return (
                            <Typography
                              key={i}
                              variant="h6"
                              sx={{
                                fontWeight: 500,
                                fontSize: 14,
                                backgroundColor: '#F5F6F8',
                                padding: paddingValue,
                                margin: '8px 0',
                                textWrap: 'nowrap',
                              }}
                            >
                              {value}
                            </Typography>
                          );
                        })}
                      </TableCell>
                      <TableCell
                        className="table-padding"
                        sx={{
                          borderBottomColor: '#ececec',
                          borderBottomWidth: 2,
                          color: '#555555',
                          fontWeight: 500,
                          pl: 0,
                          textWrap: 'nowrap',
                        }}
                      >
                        {farm.units.map((unit, i) => {
                          // Determine the value to display
                          const value =
                            selectedView === 'water'
                              ? selectedAverage === 'Monthly average'
                                ? String(
                                    unit.monthlyAveragesWater?.visibility,
                                  ) || ''
                                : selectedAverage === 'Yearly average'
                                  ? String(
                                      unit.yearlyAveragesWater?.visibility,
                                    ) || ''
                                  : selectedAverage === 'All-time average'
                                    ? String(
                                        unit.allTimeAveragesWater?.visibility,
                                      ) || ''
                                    : selectedAverage === 'Individual average'
                                      ? String(
                                          unit.individualAveragesWater
                                            ?.visibility,
                                        ) || ''
                                      : (unit.visibility ?? '')
                              : selectedAverage === 'Monthly average'
                                ? Number(
                                    unit.monthlyAverages?.stockingDensityNM ||
                                      0,
                                  ).toFixed(2)
                                : selectedAverage === 'Yearly average'
                                  ? Number(
                                      unit.yearlyAverages?.stockingDensityNM ||
                                        0,
                                    ).toFixed(2)
                                  : selectedAverage === 'All-time average'
                                    ? Number(
                                        unit.allTimeAverages
                                          ?.stockingDensityNM || 0,
                                      ).toFixed(2)
                                    : selectedAverage === 'Individual average'
                                      ? Number(
                                          unit.individualAverages
                                            ?.stockingDensityNM || 0,
                                        ).toFixed(2)
                                      : Number(
                                          unit.stockingDensityNM || 0,
                                        ).toFixed(2);

                          // Calculate padding based on whether a value exists
                          const paddingValue = value
                            ? '8px 12px 8px 0'
                            : '19px 12px 19px 0';

                          return (
                            <Typography
                              key={i}
                              variant="h6"
                              sx={{
                                fontWeight: 500,
                                fontSize: 14,
                                backgroundColor: '#F5F6F8',
                                padding: paddingValue,
                                margin: '8px 0',
                                textWrap: 'nowrap',
                              }}
                            >
                              {value}
                            </Typography>
                          );
                        })}
                      </TableCell>

                      {selectedView !== 'water' && (
                        <TableCell
                          className="table-padding"
                          sx={{
                            borderBottomColor: '#ececec',
                            borderBottomWidth: 2,
                            color: '#555555',
                            fontWeight: 500,
                            pl: 0,
                            textWrap: 'nowrap',
                          }}
                        >
                          {farm.units.map((unit, i) => {
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
                          })}
                        </TableCell>
                      )}
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={13} sx={{ textAlign: 'center' }}>
                    No Data Found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>,
    );
    await new Promise((resolve) => setTimeout(resolve, 800));
    const canvas = await html2canvas(chartDiv);
    const imgData = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = imgData;
    link.download = `${
      selectedView === 'fish' ? 'Fish' : 'Water'
    } Report ${new Date()
      .toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
      .replace(/[\s,\/]+/g, '_')}.png`;
    link.click();
    root.unmount();
    tempContainer.removeChild(chartDiv);
    document.body.removeChild(tempContainer);
    setIsReportDownload(false);
  };
  const handleClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    unit: FarmGroupUnit,
    isManage: boolean,
  ) => {
    const selectedProd = productions.find((pro) => pro.id === unit.id);
    const currentParams = new URLSearchParams(searchParams);
    setAnchorEl(event.currentTarget);
    if (currentParams.size) {
      currentParams.delete('isFish');
      currentParams.delete('isWater');
    }
    if (isManage) {
      currentParams.set('isFish', 'true');
      const newPath = `${window.location.pathname}?${currentParams.toString()}`;
      router.replace(newPath);
      setOpenTransferModal(true);
    } else {
      currentParams.set('isWater', 'true');
      const newPath = `${window.location.pathname}?${currentParams.toString()}`;
      router.replace(newPath);
      setOpenWaterQualityModal(true);
    }
    setLocalItem('productionData', selectedProd);
    setProduction(selectedProd ?? ({} as Production));
  };

  const open = Boolean(anchorEl);

  function EnhancedTableHead(data: EnhancedTableHeadProps) {
    const { order, orderBy, onRequestSort } = data;
    const createSortHandler =
      (property: string) => (event: React.MouseEvent<HTMLButtonElement>) => {
        onRequestSort(event, property);
      };

    return (
      <TableHead
        className="prod-action"
        sx={{
          textWrap: 'nowrap',
        }}
      >
        <TableRow>
          {tableHead?.map((headCell, idx: number, headCells) => (
            <Tooltip key={headCell.id} title={headCell.label}>
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
                    md: idx === 0 ? 3 : 0,
                    xs: idx === 0 ? 3 : 0,
                  },
                }}
              >
                {idx === headCells.length - 1 ||
                (selectedView === 'fish' && idx === 2) ||
                (selectedView === 'fish' && idx === 3) ? (
                  breakpoint === 'lg' ? (
                    headCell.smallLabel
                  ) : (
                    headCell.label
                  )
                ) : (
                  <TableSortLabel
                    active={orderBy === headCell.id}
                    direction={orderBy === headCell.id ? order : 'asc'}
                    onClick={createSortHandler(headCell.id)}
                  >
                    {breakpoint === 'lg' ? headCell.smallLabel : headCell.label}
                  </TableSortLabel>
                )}
              </TableCell>
            </Tooltip>
          ))}
        </TableRow>
      </TableHead>
    );
  }
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
    if (groupedData && selectedView) {
      const sortedData = ProductionSortTables(
        groupedData,
        order,
        property,
        selectedView,
        false,
      );
      setProductionData(sortedData);
    }
  };

  const groupedData: FarmGroup[] = productions?.reduce(
    (result: FarmGroup[], item) => {
      // Find or create a farm group
      let farmGroup = result.find((group) => group.farm === item.farm.name);
      if (!farmGroup) {
        farmGroup = { farm: item.farm.name, units: [] };
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
        waterTemp: item.waterTemp,
        DO: item.DO,
        TSS: item.TSS,
        NH4: item.NH4,
        NO3: item.NO3,
        NO2: item.NO2,
        ph: item.ph,
        visibility: item.visibility,
        WaterManageHistoryAvgrage: item.WaterManageHistoryAvgrage,
      });

      return result;
    },
    [],
  );

  const handleChange = (newValue: string) => {
    setSelectedView(newValue);
    setCookie('productionCurrentView', newValue);
    router.refresh();
  };

  useEffect(() => {
    if (pathName) {
      setSortDataFromLocal(getLocalItem(pathName));
    }
  }, [pathName]);
  useEffect(() => {
    const selectView = getCookie('productionCurrentView');
    if (selectView) {
      setSelectedView(selectView);
    } else {
      setCookie('productionCurrentView', 'fish');
    }
  }, [getCookie('productionCurrentView')]);

  useEffect(() => {
    if (sortDataFromLocal) {
      const data = sortDataFromLocal;
      setOrder(data.direction);
      setOrderBy(data.column);
      if (groupedData) {
        const sortedData = ProductionSortTables(
          groupedData,
          data.direction,
          data.column,
          selectedView,
          true,
        );
        setProductionData(sortedData);
      }
    }
  }, [sortDataFromLocal]);

  useEffect(() => {
    const user = JSON.parse(loggedUser ?? '');
    if (selectedView === 'fish') {
      if (user.role !== 'MEMBER') {
        setTableHead(farmManagerFishHead);
      } else {
        setTableHead(farmManagerFishHeadMember);
      }
    } else if (selectedView === 'water') {
      if (user.role !== 'MEMBER') {
        setTableHead(farmManagerWaterHead);
      } else {
        setTableHead(farmManagerWaterHeadMember);
      }
    } else {
      if (user.role !== 'MEMBER') {
        setTableHead(feedingHead);
      } else {
        setTableHead(feedingHeadMember);
      }
    }
  }, [selectedView]);
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedData = getLocalItem('productionData');
      console.log('sort', storedData);

      if (storedData) {
        setProduction(storedData);
      }
    }
    if (groupedData && !sortDataFromLocal) {
      setProductionData(groupedData);
    }
  }, []);
  useEffect(() => {
    router.refresh();
  }, [router]);

  useEffect(() => {
    if (isReportDownload) {
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
    };
  }, [isReportDownload]);
  if (isReportDownload) {
    return (
      <Box
        sx={{
          position: 'absolute',
          width: '100%',
          height: '100%',
        }}
      >
        <Loader />
      </Box>
    );
  }

  return (
    <>
      <Box sx={{ width: '100%', typography: 'body1', mt: 5 }}>
        <TabContext value={selectedView ? selectedView : 'fish'}>
          <Stack
            display={'flex'}
            rowGap={2}
            columnGap={5}
            mb={2}
            justifyContent={'space-between'}
            sx={{
              flexDirection: {
                md: 'row',
                xs: 'column',
              },
              alignItems: {
                md: 'center',
                xs: 'start',
              },
            }}
          >
            <Box>
              <TabList
                onChange={(_, value) => handleChange(value)}
                aria-label="lab API tabs example"
                className="production-tabs"
              >
                <Tab
                  label="Fish"
                  value="fish"
                  className={selectedView === 'fish' ? 'active-tab' : ''}
                />
                <Tab
                  label="Water"
                  value="water"
                  className={selectedView === 'water' ? 'active-tab' : ''}
                />
                <Tab
                  label="Feeding"
                  value="feeding"
                  className={selectedView === 'feeding' ? 'active-tab' : ''}
                />
              </TabList>
            </Box>

            <Box
              display={'flex'}
              gap={1.5}
              alignItems={'center'}
              sx={{
                alignSelf: {
                  md: 'center',
                  xs: 'end',
                },
              }}
            >
              <Button
                id="basic-button"
                type="button"
                variant="contained"
                sx={{
                  background: '#06A19B',
                  fontWeight: 600,
                  padding: '6px 16px',
                  width: 'fit-content',
                  textTransform: 'capitalize',
                  borderRadius: '8px',
                  color: 'white',
                  boxShadow: 'none',
                  '&:hover': {
                    boxShadow: 'none',
                  },
                }}
                onClick={() =>
                  router.push('/dashboard/production/createReport')
                }
              >
                Create All Report
              </Button>

              <Tooltip title="Take Screenshot" placement="top">
                <Button
                  id="basic-button"
                  type="button"
                  variant="contained"
                  sx={{
                    background: '#fff',
                    color: '#06A19B',
                    fontWeight: 600,
                    padding: '6px',
                    width: 'fit-content',
                    minWidth: 'fit-content',
                    textTransform: 'capitalize',
                    borderRadius: '8px',
                    border: '1px solid #06A19B',
                    boxShadow: 'none',
                    '&:hover': {
                      boxShadow: 'none',
                    },
                  }}
                  onClick={captureScreenshot}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="1.7em"
                    height="1.7em"
                    viewBox="0 0 48 48"
                  >
                    <path
                      fill="currentColor"
                      d="M6 12.5A6.5 6.5 0 0 1 12.5 6h5.343a1.5 1.5 0 0 1 0 3H12.5A3.5 3.5 0 0 0 9 12.5v5.343a1.5 1.5 0 0 1-3 0zm22.657-5a1.5 1.5 0 0 1 1.5-1.5H35.5a6.5 6.5 0 0 1 6.5 6.5v5.343a1.5 1.5 0 0 1-3 0V12.5A3.5 3.5 0 0 0 35.5 9h-5.343a1.5 1.5 0 0 1-1.5-1.5M7.5 28.657a1.5 1.5 0 0 1 1.5 1.5V35.5a3.5 3.5 0 0 0 3.5 3.5h5.343a1.5 1.5 0 0 1 0 3H12.5A6.5 6.5 0 0 1 6 35.5v-5.343a1.5 1.5 0 0 1 1.5-1.5m33 0a1.5 1.5 0 0 1 1.5 1.5V35.5a6.5 6.5 0 0 1-6.5 6.5h-5.343a1.5 1.5 0 0 1 0-3H35.5a3.5 3.5 0 0 0 3.5-3.5v-5.343a1.5 1.5 0 0 1 1.5-1.5M27 24.5a3 3 0 1 0-6 0a3 3 0 0 0 6 0m.865-8.887a2.25 2.25 0 0 0-1.94-1.11h-3.803a2.25 2.25 0 0 0-1.917 1.073L19.33 17h-2.08A3.25 3.25 0 0 0 14 20.25v9.5A3.25 3.25 0 0 0 17.25 33h13.5A3.25 3.25 0 0 0 34 29.75v-9.5A3.25 3.25 0 0 0 30.75 17h-2.07zM19.5 24.5a4.5 4.5 0 1 1 9 0a4.5 4.5 0 0 1-9 0"
                    />
                  </svg>
                </Button>
              </Tooltip>
            </Box>
          </Stack>
          <ProductionManagerFilter
            selectedView={selectedView}
            farmsList={farms}
            groupedData={groupedData}
            setProductionData={setProductionData}
            reset={true}
          />
        </TabContext>
      </Box>

      <Paper
        sx={{
          width: '100%',
          overflow: 'auto',
          borderRadius: '14px',
          boxShadow: '0px 0px 16px 5px #0000001A',
          textAlign: 'center',
          mt: 4,
        }}
      >
        <TableContainer
          sx={{
            overflow: 'auto',
          }}
        >
          <Table stickyHeader aria-label="sticky table">
            <TableHead
              sx={{
                textAlign: 'center',
                textWrap: 'nowrap',
              }}
            >
              <TableRow></TableRow>
            </TableHead>
            <EnhancedTableHead
              order={order}
              orderBy={orderBy}
              // sx={{
              //   backgroundColor: 'red',
              // }}
              onRequestSort={handleRequestSort}
            />
            <TableBody>
              {productionData && productionData?.length > 0 ? (
                productionData?.map((farm: FarmGroup, i: number) => {
                  return (
                    <TableRow
                      key={i}
                      sx={{
                        '&:last-child td, &:last-child th': { border: 0 },
                      }}
                    >
                      <TableCell
                        sx={{
                          color: '#555555',
                          paddingRight: '20px',
                          maxWidth: 250,
                          borderBottomColor: '#F5F6F8',
                          borderBottomWidth: 2,
                          fontWeight: 700,
                          textWrap: 'nowrap',
                          paddingLeft: {
                            lg: 10,
                            md: 3,
                            xs: 3,
                          },
                          pr: 2,
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          {farm.farm ?? ''}
                        </Box>
                      </TableCell>
                      <TableCell
                        className="table-padding"
                        sx={{
                          borderBottomWidth: 2,
                          borderBottomColor: '#F5F6F8',
                          color: '#555555',
                          fontWeight: 500,
                          pl: 0,
                          textWrap: 'nowrap',
                        }}
                      >
                        {farm.units.map((unit, i) => {
                          return (
                            <>
                              <Typography
                                key={i}
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
                                {unit.productionUnit.name}
                              </Typography>
                            </>
                          );
                        })}
                      </TableCell>
                      <TableCell
                        className="table-padding"
                        sx={{
                          borderBottomWidth: 2,
                          borderBottomColor: '#ececec',
                          color: '#555555',
                          fontWeight: 500,
                          pl: 0,
                          textWrap: 'wrap',
                        }}
                      >
                        {farm.units?.map((unit, i) => {
                          const value =
                            selectedView === 'water'
                              ? selectedAverage === 'Monthly average'
                                ? String(
                                    unit.monthlyAveragesWater?.waterTemp,
                                  ) || ''
                                : selectedAverage === 'Yearly average'
                                  ? String(
                                      unit.yearlyAveragesWater?.waterTemp,
                                    ) || ''
                                  : selectedAverage === 'All-time average'
                                    ? String(
                                        unit.allTimeAveragesWater?.waterTemp,
                                      ) || ''
                                    : selectedAverage === 'Individual average'
                                      ? String(
                                          unit.individualAveragesWater
                                            ?.waterTemp,
                                        ) || ''
                                      : (unit.waterTemp ?? '')
                              : unit?.fishSupply?.batchNumber;

                          // Calculate padding based on whether a value exists
                          const paddingValue = value
                            ? '8px 12px 8px 0'
                            : '19px 12px 19px 0';
                          return (
                            <Typography
                              key={i}
                              variant="h6"
                              sx={{
                                fontWeight: 500,
                                fontSize: 14,
                                backgroundColor: '#F5F6F8',
                                padding: paddingValue,
                                margin: '8px 0',
                                textWrap: 'nowrap',
                              }}
                            >
                              {value}
                            </Typography>
                          );
                        })}
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
                          textWrap: 'wrap',
                        }}
                      >
                        {farm.units.map((unit, i) => {
                          const value =
                            selectedView === 'water'
                              ? selectedAverage === 'Monthly average'
                                ? String(unit.monthlyAveragesWater?.DO) || ''
                                : selectedAverage === 'Yearly average'
                                  ? String(unit.yearlyAveragesWater?.DO) || ''
                                  : selectedAverage === 'All-time average'
                                    ? String(unit.allTimeAveragesWater?.DO) ||
                                      ''
                                    : selectedAverage === 'Individual average'
                                      ? String(
                                          unit.individualAveragesWater?.DO,
                                        ) || ''
                                      : (unit.DO ?? '')
                              : unit?.fishSupply?.age;

                          // Calculate padding based on whether a value exists
                          const paddingValue = value
                            ? '8px 12px 8px 0'
                            : '19px 12px 19px 0';
                          return (
                            <Typography
                              key={i}
                              variant="h6"
                              sx={{
                                fontWeight: 500,
                                fontSize: 14,
                                padding: paddingValue,
                                backgroundColor: '#F5F6F8',
                                margin: '8px 0',
                                textWrap: 'nowrap',
                              }}
                            >
                              {value}
                            </Typography>
                          );
                        })}
                      </TableCell>
                      <TableCell
                        className="table-padding"
                        sx={{
                          borderBottomWidth: 2,
                          borderBottomColor: '#ececec',
                          color: '#555555',
                          fontWeight: 500,
                          pl: 0,
                          textWrap: 'wrap',
                        }}
                      >
                        {farm.units.map((unit, i) => {
                          // Determine the value to display
                          const value =
                            selectedView === 'water'
                              ? selectedAverage === 'Monthly average'
                                ? String(unit.monthlyAveragesWater?.TSS) || ''
                                : selectedAverage === 'Yearly average'
                                  ? String(unit.yearlyAveragesWater?.TSS) || ''
                                  : selectedAverage === 'All-time average'
                                    ? String(unit.allTimeAveragesWater?.TSS) ||
                                      ''
                                    : selectedAverage === 'Individual average'
                                      ? String(
                                          unit.individualAveragesWater?.TSS,
                                        ) || ''
                                      : (unit.TSS ?? '')
                              : selectedAverage === 'Monthly average'
                                ? String(unit.monthlyAverages?.fishCount) || ''
                                : selectedAverage === 'Yearly average'
                                  ? String(unit.yearlyAverages?.fishCount) || ''
                                  : selectedAverage === 'All-time average'
                                    ? String(unit.allTimeAverages?.fishCount) ||
                                      ''
                                    : selectedAverage === 'Individual average'
                                      ? String(
                                          unit.individualAverages?.fishCount,
                                        ) || ''
                                      : (unit?.fishCount ?? '');

                          // Calculate padding based on whether a value exists
                          const paddingValue = value
                            ? '8px 12px 8px 0'
                            : '19px 12px 19px 0';

                          return (
                            <Typography
                              key={i}
                              variant="h6"
                              sx={{
                                fontWeight: 500,
                                fontSize: 14,
                                backgroundColor: '#F5F6F8',
                                padding: paddingValue,
                                margin: '8px 0',
                                textWrap: 'nowrap',
                              }}
                            >
                              {value}
                            </Typography>
                          );
                        })}
                      </TableCell>
                      <TableCell
                        className="table-padding"
                        sx={{
                          borderBottomColor: '#ececec',
                          borderBottomWidth: 2,
                          color: '#555555',
                          fontWeight: 500,
                          pl: 0,
                          textWrap: 'nowrap',
                        }}
                      >
                        {farm.units.map((unit, i) => {
                          // Determine the value to display
                          const value =
                            selectedView === 'water'
                              ? selectedAverage === 'Monthly average'
                                ? String(unit.monthlyAveragesWater?.NH4) || ''
                                : selectedAverage === 'Yearly average'
                                  ? String(unit.yearlyAveragesWater?.NH4) || ''
                                  : selectedAverage === 'All-time average'
                                    ? String(unit.allTimeAveragesWater?.NH4) ||
                                      ''
                                    : selectedAverage === 'Individual average'
                                      ? String(
                                          unit.individualAveragesWater?.NH4,
                                        ) || ''
                                      : (unit.NH4 ?? '')
                              : selectedAverage === 'Monthly average'
                                ? String(unit.monthlyAverages?.biomass) || ''
                                : selectedAverage === 'Yearly average'
                                  ? String(unit.yearlyAverages?.biomass) || ''
                                  : selectedAverage === 'All-time average'
                                    ? String(unit.allTimeAverages?.biomass) ||
                                      ''
                                    : selectedAverage === 'Individual average'
                                      ? String(
                                          unit.individualAverages?.biomass,
                                        ) || ''
                                      : (unit.biomass ?? '');

                          // Calculate padding based on whether a value exists
                          const paddingValue = value
                            ? '8px 12px 8px 0'
                            : '19px 12px 19px 0';

                          return (
                            <Typography
                              key={i}
                              variant="h6"
                              sx={{
                                fontWeight: 500,
                                fontSize: 14,
                                backgroundColor: '#F5F6F8',
                                padding: paddingValue,
                                margin: '8px 0',
                                textWrap: 'nowrap',
                              }}
                            >
                              {value}
                            </Typography>
                          );
                        })}
                      </TableCell>
                      <TableCell
                        className="table-padding"
                        sx={{
                          borderBottomColor: '#ececec',
                          borderBottomWidth: 2,
                          color: '#555555',
                          fontWeight: 500,
                          pl: 0,
                          textWrap: 'nowrap',
                        }}
                      >
                        {farm.units.map((unit, i) => {
                          // Determine the value to display
                          const value =
                            selectedView === 'water'
                              ? selectedAverage === 'Monthly average'
                                ? String(unit.monthlyAveragesWater?.NO3) || ''
                                : selectedAverage === 'Yearly average'
                                  ? String(unit.yearlyAveragesWater?.NO3) || ''
                                  : selectedAverage === 'All-time average'
                                    ? String(unit.allTimeAveragesWater?.NO3) ||
                                      ''
                                    : selectedAverage === 'Individual average'
                                      ? String(
                                          unit.individualAveragesWater?.NO3,
                                        ) || ''
                                      : (unit.NO3 ?? '')
                              : selectedAverage === 'Monthly average'
                                ? String(unit.monthlyAverages?.meanWeight) || ''
                                : selectedAverage === 'Yearly average'
                                  ? String(unit.yearlyAverages?.meanWeight) ||
                                    ''
                                  : selectedAverage === 'All-time average'
                                    ? String(
                                        unit.allTimeAverages?.meanWeight,
                                      ) || ''
                                    : selectedAverage === 'Individual average'
                                      ? String(
                                          unit.individualAverages?.meanWeight,
                                        ) || ''
                                      : (unit.meanWeight ?? '');

                          // Calculate padding based on whether a value exists
                          const paddingValue = value
                            ? '8px 12px 8px 0'
                            : '19px 12px 19px 0';

                          return (
                            <Typography
                              key={i}
                              variant="h6"
                              sx={{
                                fontWeight: 500,
                                fontSize: 14,
                                backgroundColor: '#F5F6F8',
                                padding: paddingValue,
                                margin: '8px 0',
                                textWrap: 'nowrap',
                              }}
                            >
                              {value}
                            </Typography>
                          );
                        })}
                      </TableCell>
                      <TableCell
                        className="table-padding"
                        sx={{
                          borderBottomColor: '#ececec',
                          borderBottomWidth: 2,
                          color: '#555555',
                          fontWeight: 500,
                          pl: 0,
                          textWrap: 'nowrap',
                        }}
                      >
                        {farm.units.map((unit, i) => {
                          // Determine the value to display
                          const value =
                            selectedView === 'water'
                              ? selectedAverage === 'Monthly average'
                                ? String(unit.monthlyAveragesWater?.NO2) || ''
                                : selectedAverage === 'Yearly average'
                                  ? String(unit.yearlyAveragesWater?.NO2) || ''
                                  : selectedAverage === 'All-time average'
                                    ? String(unit.allTimeAveragesWater?.NO2) ||
                                      ''
                                    : selectedAverage === 'Individual average'
                                      ? String(
                                          unit.individualAveragesWater?.NO2,
                                        ) || ''
                                      : (unit.NO2 ?? '')
                              : selectedAverage === 'Monthly average'
                                ? String(unit.monthlyAverages?.meanLength) || ''
                                : selectedAverage === 'Yearly average'
                                  ? String(unit.yearlyAverages?.meanLength) ||
                                    ''
                                  : selectedAverage === 'All-time average'
                                    ? String(
                                        unit.allTimeAverages?.meanLength,
                                      ) || ''
                                    : selectedAverage === 'Individual average'
                                      ? String(
                                          unit.individualAverages?.meanLength,
                                        ) || ''
                                      : (unit.meanLength ?? '');

                          // Calculate padding based on whether a value exists
                          const paddingValue = value
                            ? '8px 12px 8px 0'
                            : '19px 12px 19px 0';

                          return (
                            <Typography
                              key={i}
                              variant="h6"
                              sx={{
                                fontWeight: 500,
                                fontSize: 14,
                                backgroundColor: '#F5F6F8',
                                padding: paddingValue,
                                margin: '8px 0',
                                textWrap: 'nowrap',
                              }}
                            >
                              {value}
                            </Typography>
                          );
                        })}
                      </TableCell>
                      <TableCell
                        className="table-padding"
                        sx={{
                          borderBottomColor: '#ececec',
                          borderBottomWidth: 2,
                          color: '#555555',
                          fontWeight: 500,
                          pl: 0,
                          textWrap: 'nowrap',
                        }}
                      >
                        {farm.units.map((unit, i) => {
                          // Determine the value to display
                          const value =
                            selectedView === 'water'
                              ? selectedAverage === 'Monthly average'
                                ? String(unit.monthlyAveragesWater?.ph) || ''
                                : selectedAverage === 'Yearly average'
                                  ? String(unit.yearlyAveragesWater?.ph) || ''
                                  : selectedAverage === 'All-time average'
                                    ? String(unit.allTimeAveragesWater?.ph) ||
                                      ''
                                    : selectedAverage === 'Individual average'
                                      ? String(
                                          unit.individualAveragesWater?.ph,
                                        ) || ''
                                      : (unit.ph ?? '')
                              : selectedAverage === 'Monthly average'
                                ? Number(
                                    unit.monthlyAverages?.stockingDensityKG ||
                                      0,
                                  ).toFixed(2)
                                : selectedAverage === 'Yearly average'
                                  ? Number(
                                      unit.yearlyAverages?.stockingDensityKG ||
                                        0,
                                    ).toFixed(2)
                                  : selectedAverage === 'All-time average'
                                    ? Number(
                                        unit.allTimeAverages
                                          ?.stockingDensityKG || 0,
                                      ).toFixed(2)
                                    : selectedAverage === 'Individual average'
                                      ? Number(
                                          unit.individualAverages
                                            ?.stockingDensityKG || 0,
                                        ).toFixed(2)
                                      : Number(
                                          unit.stockingDensityKG || 0,
                                        ).toFixed(2);

                          // Calculate padding based on whether a value exists
                          const paddingValue = value
                            ? '8px 12px 8px 0'
                            : '19px 12px 19px 0';

                          return (
                            <Typography
                              key={i}
                              variant="h6"
                              sx={{
                                fontWeight: 500,
                                fontSize: 14,
                                backgroundColor: '#F5F6F8',
                                padding: paddingValue,
                                margin: '8px 0',
                                textWrap: 'nowrap',
                              }}
                            >
                              {value}
                            </Typography>
                          );
                        })}
                      </TableCell>
                      <TableCell
                        className="table-padding"
                        sx={{
                          borderBottomColor: '#ececec',
                          borderBottomWidth: 2,
                          color: '#555555',
                          fontWeight: 500,
                          pl: 0,
                          textWrap: 'nowrap',
                        }}
                      >
                        {farm.units.map((unit, i) => {
                          // Determine the value to display
                          const value =
                            selectedView === 'water'
                              ? selectedAverage === 'Monthly average'
                                ? String(
                                    unit.monthlyAveragesWater?.visibility,
                                  ) || ''
                                : selectedAverage === 'Yearly average'
                                  ? String(
                                      unit.yearlyAveragesWater?.visibility,
                                    ) || ''
                                  : selectedAverage === 'All-time average'
                                    ? String(
                                        unit.allTimeAveragesWater?.visibility,
                                      ) || ''
                                    : selectedAverage === 'Individual average'
                                      ? String(
                                          unit.individualAveragesWater
                                            ?.visibility,
                                        ) || ''
                                      : (unit.visibility ?? '')
                              : selectedAverage === 'Monthly average'
                                ? Number(
                                    unit.monthlyAverages?.stockingDensityNM ||
                                      0,
                                  ).toFixed(2)
                                : selectedAverage === 'Yearly average'
                                  ? Number(
                                      unit.yearlyAverages?.stockingDensityNM ||
                                        0,
                                    ).toFixed(2)
                                  : selectedAverage === 'All-time average'
                                    ? Number(
                                        unit.allTimeAverages
                                          ?.stockingDensityNM || 0,
                                      ).toFixed(2)
                                    : selectedAverage === 'Individual average'
                                      ? Number(
                                          unit.individualAverages
                                            ?.stockingDensityNM || 0,
                                        ).toFixed(2)
                                      : Number(
                                          unit.stockingDensityNM || 0,
                                        ).toFixed(2);

                          // Calculate padding based on whether a value exists
                          const paddingValue = value
                            ? '8px 12px 8px 0'
                            : '19px 12px 19px 0';

                          return (
                            <Typography
                              key={i}
                              variant="h6"
                              sx={{
                                fontWeight: 500,
                                fontSize: 14,
                                backgroundColor: '#F5F6F8',
                                padding: paddingValue,
                                margin: '8px 0',
                                textWrap: 'nowrap',
                              }}
                            >
                              {value}
                            </Typography>
                          );
                        })}
                      </TableCell>
                      {selectedView !== 'water' && (
                        <TableCell
                          className="table-padding"
                          sx={{
                            borderBottomColor: '#ececec',
                            borderBottomWidth: 2,
                            color: '#555555',
                            fontWeight: 500,
                            pl: 0,
                            textWrap: 'nowrap',
                          }}
                        >
                          {farm.units.map((unit, i) => {
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
                          })}
                        </TableCell>
                      )}
                      {selectedView !== 'water' && selectedView === 'fish' && (
                        <TableCell
                          className="table-padding"
                          sx={{
                            borderBottomColor: '#ececec',
                            borderBottomWidth: 2,
                            color: '#555555',
                            fontWeight: 500,
                            pl: 0,
                            textWrap: 'nowrap',
                          }}
                        >
                          {farm.units.map((unit, i) => {
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
                          })}
                        </TableCell>
                      )}
                      {selectedView === 'feeding' && (
                        <TableCell
                          className="table-padding"
                          sx={{
                            borderBottomColor: '#ececec',
                            borderBottomWidth: 2,
                            color: '#555555',
                            fontWeight: 500,
                            pl: 0,
                            textWrap: 'nowrap',
                          }}
                        >
                          {farm.units.map((unit, i) => {
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
                                  textWrap: 'nowrap',
                                }}
                              >
                                FEEd FED
                              </Typography>
                            );
                          })}
                        </TableCell>
                      )}
                      {selectedView === 'feeding' && (
                        <TableCell
                          className="table-padding"
                          sx={{
                            borderBottomColor: '#ececec',
                            borderBottomWidth: 2,
                            color: '#555555',
                            fontWeight: 500,
                            pl: 0,
                            textWrap: 'nowrap',
                          }}
                        >
                          {farm.units.map((unit, i) => {
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
                                FCR
                              </Typography>
                            );
                          })}
                        </TableCell>
                      )}
                      {role !== 'MEMBER' && (
                        <TableCell
                          sx={{
                            borderBottomColor: '#ececec',
                            borderBottomWidth: 2,
                            color: '#555555',
                            fontWeight: 500,
                            pl: 0,
                            textWrap: 'nowrap',
                          }}
                          className="cursor-pointer table-padding"
                        >
                          {farm.units.map((unit) => {
                            return (
                              <Box
                                key={String(unit.id)}
                                sx={{
                                  fontWeight: 500,
                                  fontSize: 14,
                                  backgroundColor: '#F5F6F8',
                                  padding: '4.5px ',
                                  margin: '8px 0',
                                  textWrap: 'nowrap',
                                }}
                              >
                                <Button
                                  id="basic-button"
                                  aria-controls={
                                    open ? 'basic-menu' : undefined
                                  }
                                  aria-haspopup="true"
                                  aria-expanded={open ? 'true' : undefined}
                                  onClick={(e) => {
                                    (setSelectedFarm(unit),
                                      setAnchorEl(e.currentTarget));
                                  }}
                                  className="table-edit-option"
                                  sx={{
                                    background: 'transparent',
                                    color: '#555555',
                                    boxShadow: 'none',
                                  }}
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="1em"
                                    height="1em"
                                    viewBox="0 0 16 16"
                                  >
                                    <path
                                      fill="currentColor"
                                      d="M9.5 13a1.5 1.5 0 1 1-3 0a1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0a1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0a1.5 1.5 0 0 1 3 0"
                                    />
                                  </svg>
                                </Button>
                                <Menu
                                  id="basic-menu"
                                  className="table-edit-menu"
                                  anchorEl={anchorEl}
                                  open={open}
                                  onClose={handleClose}
                                  MenuListProps={{
                                    'aria-labelledby': 'basic-button',
                                  }}
                                  sx={{
                                    position: 'absolute',
                                    left: '-10px',
                                  }}
                                >
                                  {selectedView !== 'feeding' ? (
                                    <Stack>
                                      <MenuItem
                                        onClick={(e: any) => {
                                          handleClick(
                                            e,
                                            selectedFarm,
                                            selectedView === 'fish'
                                              ? true
                                              : false,
                                          );
                                          setAnchorEl(null);
                                        }}
                                      >
                                        <Stack
                                          display="flex"
                                          gap={1.2}
                                          alignItems="center"
                                          direction="row"
                                        >
                                          {selectedView === 'water' ? (
                                            <svg
                                              xmlns="http://www.w3.org/2000/svg"
                                              width="1.25em"
                                              height="1.25em"
                                              viewBox="0 0 24 24"
                                            >
                                              <g
                                                fill="none"
                                                stroke="currentColor"
                                                stroke-width="2"
                                              >
                                                <path
                                                  stroke-linecap="round"
                                                  d="M12 18a2 2 0 0 1-1.932-1.482"
                                                />
                                                <path d="M10.424 4.679c.631-1.073.947-1.61 1.398-1.69a1 1 0 0 1 .356 0c.451.08.767.617 1.398 1.69l1.668 2.836a27.2 27.2 0 0 1 2.707 6.315c1.027 3.593-1.67 7.17-5.408 7.17h-1.086c-3.737 0-6.435-3.577-5.408-7.17a27.2 27.2 0 0 1 2.707-6.315z" />
                                              </g>
                                            </svg>
                                          ) : (
                                            <svg
                                              xmlns="http://www.w3.org/2000/svg"
                                              width="1.25em"
                                              height="1.25em"
                                              viewBox="0 0 24 24"
                                            >
                                              <path
                                                fill="none"
                                                stroke="currentColor"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="1.5"
                                                d="M6.008 12h-.01M11 16.042c.463.153.908.329 1.31.61m0 0A3.95 3.95 0 0 1 14 19.885a.117.117 0 0 1-.118.116c-2.917-.013-4.224-.507-4.773-1.322L8 16.857c-2.492-.503-4.782-2.094-6-4.774c3-6.597 12.5-6.597 15.5 0m-5.19 4.57c2.17-.66 4.105-2.184 5.19-4.57m-5.19-4.569A3.95 3.95 0 0 0 14 4.282c0-.826-4.308.342-4.89 1.206L8 7.31m9.5 4.773c.333-.66 2.1-2.969 4.5-2.969c-.833.825-2.2 3.959-1 5.938c-1.2 0-3-2.309-3.5-2.969"
                                                color="currentColor"
                                              />
                                            </svg>
                                          )}

                                          <Typography variant="subtitle2">
                                            Manage
                                          </Typography>
                                        </Stack>
                                      </MenuItem>

                                      <Divider
                                        sx={{
                                          borderColor: '#9797971A',
                                          my: 0.5,
                                        }}
                                      />
                                    </Stack>
                                  ) : (
                                    <Stack>
                                      <MenuItem
                                        onClick={() => {
                                          setAnchorEl(null);
                                          setSelectedProduction(selectedFarm);
                                          setIsFeedFedModalOpen(true);
                                        }}
                                      >
                                        <Stack
                                          display="flex"
                                          gap={1.2}
                                          alignItems="center"
                                          direction="row"
                                        >
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="1.1em"
                                            height="1.1em"
                                            viewBox="0 0 24 24"
                                          >
                                            <path
                                              fill="currentColor"
                                              d="M8 3a1 1 0 0 1 .117 1.993L8 5H6a1 1 0 0 0-.993.883L5 6v2a1 1 0 0 1-1.993.117L3 8V6a3 3 0 0 1 2.824-2.995L6 3zM4 15a1 1 0 0 1 .993.883L5 16v2a1 1 0 0 0 .883.993L6 19h2a1 1 0 0 1 .117 1.993L8 21H6a3 3 0 0 1-2.995-2.824L3 18v-2a1 1 0 0 1 1-1M18 3a3 3 0 0 1 2.995 2.824L21 6v2a1 1 0 0 1-1.993.117L19 8V6a1 1 0 0 0-.883-.993L18 5h-2a1 1 0 0 1-.117-1.993L16 3zm2 12a1 1 0 0 1 .993.883L21 16v2a3 3 0 0 1-2.824 2.995L18 21h-2a1 1 0 0 1-.117-1.993L16 19h2a1 1 0 0 0 .993-.883L19 18v-2a1 1 0 0 1 1-1m-8-7a4 4 0 1 1-3.995 4.2L8 12l.005-.2A4 4 0 0 1 12 8"
                                            />
                                          </svg>

                                          <Typography variant="subtitle2">
                                            Capture Feeding
                                          </Typography>
                                        </Stack>
                                      </MenuItem>
                                      <Divider
                                        sx={{
                                          borderColor: '#9797971A',
                                          my: 0.5,
                                        }}
                                      />
                                    </Stack>
                                  )}

                                  <MenuItem
                                    onClick={() => {
                                      handleFishManageHistory(selectedFarm);
                                      setAnchorEl(null);
                                    }}
                                  >
                                    <Stack
                                      display="flex"
                                      gap={1.2}
                                      alignItems="center"
                                      direction="row"
                                    >
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="1.05em"
                                        height="1.05em"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          fill="currentColor"
                                          d="M21 11.11V5a2 2 0 0 0-2-2h-4.18C14.4 1.84 13.3 1 12 1s-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14a2 2 0 0 0 2 2h6.11c1.26 1.24 2.98 2 4.89 2c3.87 0 7-3.13 7-7c0-1.91-.76-3.63-2-4.89M12 3c.55 0 1 .45 1 1s-.45 1-1 1s-1-.45-1-1s.45-1 1-1M5 19V5h2v2h10V5h2v4.68c-.91-.43-1.92-.68-3-.68H7v2h4.1c-.6.57-1.06 1.25-1.42 2H7v2h2.08c-.05.33-.08.66-.08 1c0 1.08.25 2.09.68 3zm11 2c-2.76 0-5-2.24-5-5s2.24-5 5-5s5 2.24 5 5s-2.24 5-5 5m.5-4.75l2.86 1.69l-.75 1.22L15 17v-5h1.5z"
                                        />
                                      </svg>

                                      <Typography variant="subtitle2" ml={0.35}>
                                        History
                                      </Typography>
                                    </Stack>
                                  </MenuItem>

                                  <Divider
                                    sx={{
                                      borderColor: '#9797971A',
                                      my: 0.5,
                                    }}
                                  />
                                  <MenuItem
                                    onClick={() => {
                                      (setAnchorEl(null), setTest(true));
                                    }}
                                    sx={{
                                      width: 190,
                                    }}
                                  >
                                    <Stack
                                      display="flex"
                                      gap={1.2}
                                      alignItems="center"
                                      direction="row"
                                    >
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="1.1em"
                                        height="1.1em"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          fill="currentColor"
                                          d="M13 19c0 .34.04.67.09 1H4a2 2 0 0 1-2-2V6c0-1.11.89-2 2-2h6l2 2h8a2 2 0 0 1 2 2v5.81c-.61-.35-1.28-.59-2-.72V8H4v10h9.09c-.05.33-.09.66-.09 1m7-1v-3h-2v3h-3v2h3v3h2v-3h3v-2z"
                                        />
                                      </svg>

                                      <Typography variant="subtitle2" ml={0.35}>
                                        Create Report
                                      </Typography>
                                    </Stack>
                                  </MenuItem>
                                </Menu>
                              </Box>
                            );
                          })}
                        </TableCell>
                      )}
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={13} sx={{ textAlign: 'center' }}>
                    No Data Found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <TransferModal
        open={openTransferModal}
        setOpen={setOpenTransferModal}
        selectedProduction={production}
        farms={farms}
        batches={batches}
        productions={productions}
      />
      <Test
        open={test}
        setOpen={setTest}
        selectedView={selectedView}
        productions={productions}
        selectedFarm={selectedFarm}
      />

      <WaterQualityParameter
        open={openWaterQualityModal}
        setOpen={setOpenWaterQualityModal}
        selectedProduction={production}
        farms={farms}
      />
      <AddFeedFed
        open={isFeedFedModalOpen}
        setOpen={setIsFeedFedModalOpen}
        selectedProduction={selectedProduction}
      />
    </>
  );
}
