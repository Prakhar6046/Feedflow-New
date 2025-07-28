import { convertDate } from '@/app/_lib/utils';
import { TableHeadType } from '@/app/_typeModels/Farm';
import {
  Production,
  WaterManageHistoryGroup,
} from '@/app/_typeModels/production';
import { Close as CloseIcon } from '@mui/icons-material'; // Use Material-UI's Close icon directly
import {
  Box,
  IconButton,
  Modal,
  Paper,
  Stack,
  TableBody,
  Typography,
} from '@mui/material';
import Table from '@mui/material/Table';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import React from 'react';
const style = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '95%',
  bgcolor: 'background.paper',
  boxShadow: 24,
};
interface Props {
  setOpen: (open: boolean) => void;
  open: boolean;
  tableData: TableHeadType[];
  productions: Production[];
}
const WaterSampleHistoryModal: React.FC<Props> = ({
  setOpen,
  open,
  tableData,
  productions,
}) => {
  const handleClose = () => {
    setOpen(false);
  };

  function EnhancedTableHead() {
    return (
      <TableHead className="prod-action">
        <TableRow>
          {tableData.map((headCell, idx: number) => (
            <TableCell
              key={headCell.id}
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
              {headCell.label}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    );
  }

  const groupedData: WaterManageHistoryGroup[] = productions?.reduce<
    WaterManageHistoryGroup[]
  >((result, item) => {
    // Find or create a farm group
    let farmGroup = result.find((group) => group.farm === item.farm.name);
    if (!farmGroup) {
      farmGroup = {
        farm: item.farm?.name,
        unit: item.productionUnit.name,
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
      WaterSampleHistory: item.WaterManageHistory,
    });

    return result;
  }, []);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="child-modal-title-1"
      aria-describedby="child-modal-description-1"
      className="modal-positioning"
      sx={{
        px: 5,
        overflowY: 'auto',
      }}
    >
      <Stack sx={style}>
        <Stack>
          <Box display="flex" justifyContent="flex-end" padding={2}>
            <IconButton
              onClick={handleClose}
              sx={{
                color: 'inherit',
                background: 'transparent',
                margin: '2',
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </Stack>

        <Paper
          sx={{
            width: '95%',
            overflow: 'hidden',
            borderRadius: '14px',
            boxShadow: '0px 0px 16px 5px #0000001A',
            textAlign: 'center',
            mt: 4,
            mx: 'auto',
            overflowY: {
              xl: 'visible',
              xs: 'auto',
            },
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
              <EnhancedTableHead />
              <TableBody>
                {groupedData && groupedData?.length > 0 ? (
                  groupedData?.map(
                    (farm: WaterManageHistoryGroup, i: number) => {
                      return (
                        <TableRow
                          key={i}
                          sx={{
                            '&:last-child td, &:last-child th': { border: 0 },
                          }}
                        >
                          <TableCell
                            // className="table-padding"
                            sx={{
                              borderBottomWidth: 2,
                              borderBottomColor: '#ececec',
                              color: '#555555',
                              fontWeight: 500,
                              paddingLeft: {
                                lg: 10,
                                md: 7,
                                xs: 4,
                              },
                              pr: 0,
                            }}
                          >
                            {farm &&
                              farm.units[0].WaterSampleHistory &&
                              farm.units[0].WaterSampleHistory.map((un, i) => {
                                return (
                                  <Typography
                                    key={i}
                                    variant="h6"
                                    sx={{
                                      fontWeight: 500,
                                      fontSize: 14,
                                      // backgroundColor: "#F5F6F8",
                                      padding: `${
                                        farm.units[0].createdAt
                                          ? '8px 12px 8px 0'
                                          : '19px 12px 19px 0'
                                      }`,
                                      margin: '8px 0',
                                      // marginBottom: "10px",
                                      // padding: "21px",
                                      textWrap: 'nowrap',
                                    }}
                                  >
                                    {convertDate(String(un.currentDate))}
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
                            }}
                          >
                            {farm &&
                              farm.units[0].WaterSampleHistory &&
                              farm.units[0].WaterSampleHistory.map(
                                (unit, i) => {
                                  return (
                                    <Typography
                                      key={i}
                                      variant="h6"
                                      sx={{
                                        fontWeight: 500,
                                        fontSize: 14,
                                        // backgroundColor: "#F5F6F8",
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
                            {farm &&
                              farm.units[0].WaterSampleHistory &&
                              farm.units[0].WaterSampleHistory.map(
                                (unit, i) => {
                                  return (
                                    <Typography
                                      key={i}
                                      variant="h6"
                                      sx={{
                                        fontWeight: 500,
                                        fontSize: 14,
                                        // backgroundColor: "#F5F6F8",
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
                            {farm &&
                              farm.units[0].WaterSampleHistory &&
                              farm.units[0].WaterSampleHistory.map(
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
                                        // backgroundColor: "#F5F6F8",
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
                            {farm &&
                              farm.units[0].WaterSampleHistory &&
                              farm.units[0].WaterSampleHistory.map(
                                (unit, i) => {
                                  return (
                                    <Typography
                                      key={i}
                                      variant="h6"
                                      sx={{
                                        fontWeight: 500,
                                        fontSize: 14,
                                        // backgroundColor: "#F5F6F8",
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
                            {farm &&
                              farm.units[0].WaterSampleHistory &&
                              farm.units[0].WaterSampleHistory.map(
                                (unit, i) => {
                                  return (
                                    <Typography
                                      key={i}
                                      variant="h6"
                                      sx={{
                                        fontWeight: 500,
                                        fontSize: 14,
                                        // backgroundColor: "#F5F6F8",
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
                            {farm &&
                              farm.units[0].WaterSampleHistory &&
                              farm.units[0].WaterSampleHistory.map(
                                (unit, i) => {
                                  return (
                                    <Typography
                                      key={i}
                                      variant="h6"
                                      sx={{
                                        fontWeight: 500,
                                        fontSize: 14,
                                        // backgroundColor: "#F5F6F8",
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
                            {farm &&
                              farm.units[0].WaterSampleHistory &&
                              farm.units[0].WaterSampleHistory.map(
                                (unit, i) => {
                                  return (
                                    <Typography
                                      key={i}
                                      variant="h6"
                                      sx={{
                                        fontWeight: 500,
                                        fontSize: 14,
                                        // backgroundColor: "#F5F6F8",
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
                            {farm &&
                              farm.units[0].WaterSampleHistory &&
                              farm.units[0].WaterSampleHistory.map(
                                (unit, i) => {
                                  return (
                                    <Typography
                                      key={i}
                                      variant="h6"
                                      sx={{
                                        fontWeight: 500,
                                        fontSize: 14,
                                        // backgroundColor: "#F5F6F8",
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
                      );
                    },
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
      </Stack>
    </Modal>
  );
};

export default WaterSampleHistoryModal;
