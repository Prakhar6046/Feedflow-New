// import { formattedDate } from '@/app/_lib/utils';
// import {
//   Production,
//   WaterManageHistoryGroup,
// } from '@/app/_typeModels/production';
// import { Close as CloseIcon } from '@mui/icons-material'; // Use Material-UI's Close icon directly
// import {
//   Box,
//   Button,
//   IconButton,
//   Modal,
//   Paper,
//   Stack,
//   TableBody,
//   TableSortLabel,
//   Tooltip,
//   Typography,
// } from '@mui/material';
// import Table from '@mui/material/Table';
// import TableCell from '@mui/material/TableCell';
// import TableContainer from '@mui/material/TableContainer';
// import TableHead from '@mui/material/TableHead';
// import TableRow from '@mui/material/TableRow';
// import React, { useState } from 'react';
// import WaterSampleHistoryModal from './WaterSampleHistory';
// import { waterSampleHistoryHead } from '@/app/_lib/utils/tableHeadData';
// const style = {
//   position: 'absolute' as const,
//   top: '50%',
//   left: '50%',
//   transform: 'translate(-50%, -50%)',
//   width: '95%',
//   bgcolor: 'background.paper',
//   boxShadow: 24,
// };
// interface Props {
//   setOpen: (open: boolean) => void;
//   open: boolean;
//   tableData: any;
//   productions: Production[];
// }
// const WaterManageHistoryModal: React.FC<Props> = ({
//   setOpen,
//   open,
//   tableData,
//   productions,
// }) => {
//   const handleClose = () => {
//     setOpen(false);
//   };

//   const [order, setOrder] = useState('asc');
//   const [orderBy, setOrderBy] = useState('Farm');
//   const [isWaterSampleHistory, setIsWaterSampleHistory] =
//     useState<boolean>(false);
//   const [xAxisData, setXAxisData] = useState();

//   // const [ammonia, setSuspendedSolids] = useState();
//   function EnhancedTableHead(data: any) {
//     const { order, orderBy, onRequestSort } = data;
//     const createSortHandler =
//       (property: string) => (event: React.MouseEvent<HTMLButtonElement>) => {
//         onRequestSort(event, property);
//       };

//     return (
//       <TableHead className="prod-action">
//         <TableRow>
//           {tableData.map((headCell: any, idx: number, headCells: any) => (
//             <TableCell
//               key={headCell.id}
//               sortDirection={
//                 idx === headCells.length - 1
//                   ? false
//                   : orderBy === headCell.id
//                     ? order
//                     : false
//               }
//               // align="center"
//               sx={{
//                 borderBottom: 0,
//                 color: '#67737F',
//                 background: '#F5F6F8',

//                 fontSize: {
//                   md: 16,
//                   xs: 14,
//                 },
//                 fontWeight: 600,
//                 paddingLeft: {
//                   lg: idx === 0 ? 10 : 0,
//                   md: idx === 0 ? 7 : 0,
//                   xs: idx === 0 ? 4 : 0,
//                 },
//               }}
//             >
//               {idx === headCells.length - 1 ? (
//                 headCell.label
//               ) : (
//                 <TableSortLabel
//                   active={orderBy === headCell.id}
//                   direction={orderBy === headCell.id ? order : 'asc'}
//                   onClick={createSortHandler(headCell.id)}
//                 >
//                   {headCell.label}
//                 </TableSortLabel>
//               )}
//             </TableCell>
//           ))}
//         </TableRow>
//       </TableHead>
//     );
//   }

//   const groupedData: any = productions?.reduce((result: any, item) => {
//     // Find or create a farm group
//     let farmGroup: any = result.find(
//       (group: any) => group.farm === item.farm.name,
//     );
//     if (!farmGroup) {
//       farmGroup = { unit: item.productionUnit.name, units: [] };
//       result.push(farmGroup);
//     }

//     // Add the current production unit and all related data to the group
//     farmGroup.units.push({
//       id: item.id,
//       productionUnit: item.productionUnit,
//       fishSupply: item.fishSupply,
//       organisation: item.organisation,
//       farm: item.farm,
//       biomass: item.biomass,
//       fishCount: item.fishCount,
//       batchNumberId: item.batchNumberId,
//       age: item.age,
//       meanLength: item.meanLength,
//       meanWeight: item.meanWeight,
//       stockingDensityKG: item.stockingDensityKG,
//       stockingDensityNM: item.stockingDensityNM,
//       stockingLevel: item.stockingLevel,
//       createdBy: item.createdBy,
//       updatedBy: item.updatedBy,
//       createdAt: item.createdAt,
//       updatedAt: item.updatedAt,
//       isManager: item.isManager,
//       field: item.field,
//       fishManageHistory: item.FishManageHistory,
//       waterManageHistory: item.WaterManageHistory,
//       WaterManageHistoryAvgrage: item.WaterManageHistoryAvgrage,
//     });

//     return result;
//   }, []);

//   return (
//     <Modal
//       open={open}
//       onClose={handleClose}
//       aria-labelledby="parent-modal-titles"
//       aria-describedby="parent-modal-descriptions"
//       className="modal-positioning"
//       data-bs-backdrop="static"
//       sx={{
//         px: 5,
//         overflowY: 'auto',
//       }}
//     >
//       <Stack sx={style}>
//         <Stack>
//           <Box display="flex" justifyContent="flex-end" padding={2}>
//             <IconButton
//               onClick={handleClose}
//               sx={{
//                 color: 'inherit',
//                 background: 'transparent',
//                 margin: '2',
//               }}
//             >
//               <CloseIcon />
//             </IconButton>
//           </Box>
//         </Stack>

//         <Paper
//           sx={{
//             width: '95%',
//             overflow: 'hidden',
//             borderRadius: '14px',
//             boxShadow: '0px 0px 16px 5px #0000001A',
//             textAlign: 'center',
//             mt: 4,
//             mx: 'auto',
//             overflowY: {
//               xl: 'visible',
//               xs: 'auto',
//             },
//           }}
//         >
//           <TableContainer>
//             <Table stickyHeader aria-label="sticky table">
//               <TableHead
//                 sx={{
//                   textAlign: 'center',
//                 }}
//               >
//                 <TableRow></TableRow>
//               </TableHead>
//               <EnhancedTableHead
//                 order={order}
//                 orderBy={orderBy}
//                 // onRequestSort={handleRequestSort}
//               />
//               <TableBody>
//                 {groupedData && groupedData?.length > 0 ? (
//                   groupedData?.map(
//                     (farm: WaterManageHistoryGroup, i: number) => {
//                       return (
//                         <TableRow
//                           key={i}
//                           sx={{
//                             '&:last-child td, &:last-child th': { border: 0 },
//                           }}
//                         >
//                           <TableCell
//                             sx={{
//                               color: '#555555',
//                               borderBottomColor: '#ececec',
//                               borderBottomWidth: 2,
//                               fontWeight: 700,
//                               paddingLeft: {
//                                 lg: 10,
//                                 md: 7,
//                                 xs: 4,
//                               },
//                               textWrap: 'nowrap',
//                             }}
//                             component="th"
//                             scope="row"
//                           >
//                             {farm.units.map((unit, i) => {
//                               return (
//                                 <Typography
//                                   key={i}
//                                   variant="h6"
//                                   sx={{
//                                     fontWeight: 500,
//                                     fontSize: 14,
//                                     display: 'flex',
//                                     alignItems: 'center',
//                                     gap: 1,
//                                     padding: '8px 12px',
//                                     margin: '8px 0',
//                                     textWrap: 'nowrap',
//                                   }}
//                                 >
//                                   {unit.productionUnit.name}
//                                   <Tooltip title="View history" placement="top">
//                                     <Box
//                                       sx={{
//                                         pr: 3,
//                                       }}
//                                     >
//                                       <Button
//                                         onClick={() =>
//                                           setIsWaterSampleHistory(true)
//                                         }
//                                         className=""
//                                         type="button"
//                                         variant="contained"
//                                         style={{
//                                           border: '1px solid #06A19B',
//                                         }}
//                                         sx={{
//                                           background: 'transparent',
//                                           fontWeight: 'bold',
//                                           padding: 0.25,

//                                           borderRadius: '4px',
//                                           alignItems: 'center',
//                                           minWidth: 'fit-content',
//                                         }}
//                                       >
//                                         <svg
//                                           xmlns="http://www.w3.org/2000/svg"
//                                           width="1em"
//                                           height="1em"
//                                           viewBox="0 0 24 24"
//                                         >
//                                           <path
//                                             fill="#06A19B"
//                                             d="M21 11.11V5a2 2 0 0 0-2-2h-4.18C14.4 1.84 13.3 1 12 1s-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14a2 2 0 0 0 2 2h6.11c1.26 1.24 2.98 2 4.89 2c3.87 0 7-3.13 7-7c0-1.91-.76-3.63-2-4.89M12 3c.55 0 1 .45 1 1s-.45 1-1 1s-1-.45-1-1s.45-1 1-1M5 19V5h2v2h10V5h2v4.68c-.91-.43-1.92-.68-3-.68H7v2h4.1c-.6.57-1.06 1.25-1.42 2H7v2h2.08c-.05.33-.08.66-.08 1c0 1.08.25 2.09.68 3zm11 2c-2.76 0-5-2.24-5-5s2.24-5 5-5s5 2.24 5 5s-2.24 5-5 5m.5-4.75l2.86 1.69l-.75 1.22L15 17v-5h1.5z"
//                                           />
//                                         </svg>
//                                       </Button>
//                                     </Box>
//                                   </Tooltip>
//                                 </Typography>
//                               );
//                             })}
//                           </TableCell>{' '}
//                           <TableCell
//                             className="table-padding"
//                             sx={{
//                               borderBottomWidth: 2,
//                               borderBottomColor: '#ececec',
//                               color: '#555555',
//                               fontWeight: 500,
//                               pl: 0,
//                             }}
//                           >
//                             {farm &&
//                               farm.units[0].WaterManageHistoryAvgrage &&
//                               farm.units[0].WaterManageHistoryAvgrage.map(
//                                 (unit, i) => {
//                                   return (
//                                     <Typography
//                                       key={i}
//                                       variant="h6"
//                                       sx={{
//                                         fontWeight: 500,
//                                         fontSize: 14,
//                                         backgroundColor: '#F5F6F8',
//                                         padding: `${
//                                           unit.createdAt
//                                             ? '8px 12px 8px 0'
//                                             : '19px 12px 19px 0'
//                                         }`,
//                                         margin: '8px 0',
//                                         textWrap: 'nowrap',
//                                       }}
//                                     >
//                                       {formattedDate(String(unit.createdAt))}
//                                     </Typography>
//                                   );
//                                 },
//                               )}
//                           </TableCell>{' '}
//                           <TableCell
//                             className="table-padding"
//                             sx={{
//                               borderBottomWidth: 2,
//                               borderBottomColor: '#ececec',
//                               color: '#555555',
//                               fontWeight: 500,
//                               pl: 0,
//                             }}
//                           >
//                             {farm &&
//                               farm.units[0].WaterManageHistoryAvgrage &&
//                               farm.units[0].WaterManageHistoryAvgrage.map(
//                                 (unit, i) => {
//                                   return (
//                                     <Typography
//                                       key={i}
//                                       variant="h6"
//                                       sx={{
//                                         fontWeight: 500,
//                                         fontSize: 14,
//                                         backgroundColor: '#F5F6F8',
//                                         padding: `${
//                                           unit?.waterTemp
//                                             ? '8px 12px 8px 0'
//                                             : '19px 12px 19px 0'
//                                         }`,
//                                         margin: '8px 0',
//                                         // marginBottom: "10px",
//                                         // padding: "21px",
//                                         textWrap: 'nowrap',
//                                       }}
//                                     >
//                                       {unit.waterTemp ?? ''}
//                                     </Typography>
//                                   );
//                                 },
//                               )}
//                           </TableCell>
//                           <TableCell
//                             className="table-padding"
//                             sx={{
//                               borderBottomWidth: 2,
//                               borderBottomColor: '#ececec',
//                               color: '#555555',
//                               fontWeight: 500,
//                               pl: 0,
//                             }}
//                           >
//                             {farm &&
//                               farm.units[0].WaterManageHistoryAvgrage &&
//                               farm.units[0].WaterManageHistoryAvgrage.map(
//                                 (unit, i) => {
//                                   return (
//                                     <Typography
//                                       key={i}
//                                       variant="h6"
//                                       sx={{
//                                         fontWeight: 500,
//                                         fontSize: 14,
//                                         backgroundColor: '#F5F6F8',
//                                         padding: `${
//                                           unit.DO
//                                             ? '8px 12px 8px 0'
//                                             : '19px 12px 19px 0'
//                                         }`,
//                                         margin: '8px 0',
//                                         textWrap: 'nowrap',
//                                       }}
//                                     >
//                                       {unit.DO ?? ''}
//                                     </Typography>
//                                   );
//                                 },
//                               )}
//                           </TableCell>
//                           <TableCell
//                             className="table-padding"
//                             sx={{
//                               borderBottomWidth: 2,
//                               borderBottomColor: '#ececec',
//                               color: '#555555',
//                               fontWeight: 500,
//                               pl: 0,
//                               p: 0,
//                             }}
//                           >
//                             {farm &&
//                               farm.units[0].WaterManageHistoryAvgrage &&
//                               farm.units[0].WaterManageHistoryAvgrage.map(
//                                 (unit, i) => {
//                                   return (
//                                     <Typography
//                                       key={i}
//                                       variant="h6"
//                                       sx={{
//                                         fontWeight: 500,
//                                         fontSize: 14,
//                                         padding: `${
//                                           unit.TSS
//                                             ? '8px 12px 8px 0'
//                                             : '19px 12px 19px 0'
//                                         }`,
//                                         backgroundColor: '#F5F6F8',
//                                         margin: '8px 0',

//                                         textWrap: 'nowrap',
//                                       }}
//                                     >
//                                       {unit.TSS ?? ''}
//                                     </Typography>
//                                   );
//                                 },
//                               )}
//                           </TableCell>
//                           <TableCell
//                             className="table-padding"
//                             sx={{
//                               borderBottomWidth: 2,
//                               borderBottomColor: '#ececec',
//                               color: '#555555',
//                               fontWeight: 500,
//                               pl: 0,
//                             }}
//                           >
//                             {farm &&
//                               farm.units[0].WaterManageHistoryAvgrage &&
//                               farm.units[0].WaterManageHistoryAvgrage.map(
//                                 (unit, i) => {
//                                   return (
//                                     <Typography
//                                       key={i}
//                                       variant="h6"
//                                       sx={{
//                                         fontWeight: 500,
//                                         fontSize: 14,
//                                         backgroundColor: '#F5F6F8',
//                                         padding: `${
//                                           unit?.NH4
//                                             ? '8px 12px 8px 0'
//                                             : '19px 12px 19px 0'
//                                         }`,
//                                         margin: '8px 0',
//                                         // marginBottom: "10px",
//                                         // padding: "21px",
//                                         textWrap: 'nowrap',
//                                       }}
//                                     >
//                                       {unit?.NH4 ?? ''}
//                                     </Typography>
//                                   );
//                                 },
//                               )}
//                           </TableCell>
//                           <TableCell
//                             className="table-padding"
//                             // align="center"
//                             sx={{
//                               borderBottomColor: '#ececec',
//                               borderBottomWidth: 2,
//                               color: '#555555',
//                               fontWeight: 500,
//                               pl: 0,
//                             }}
//                           >
//                             {farm &&
//                               farm.units[0].WaterManageHistoryAvgrage &&
//                               farm.units[0].WaterManageHistoryAvgrage.map(
//                                 (unit, i) => {
//                                   return (
//                                     <Typography
//                                       key={i}
//                                       variant="h6"
//                                       sx={{
//                                         fontWeight: 500,
//                                         fontSize: 14,
//                                         backgroundColor: '#F5F6F8',
//                                         padding: `${
//                                           unit?.NO3
//                                             ? '8px 12px 8px 0'
//                                             : '19px 12px 19px 0'
//                                         }`,
//                                         margin: '8px 0',
//                                         // marginBottom: "10px",
//                                         textWrap: 'nowrap',
//                                       }}
//                                     >
//                                       {unit.NO3 ?? ''}
//                                     </Typography>
//                                   );
//                                 },
//                               )}
//                           </TableCell>
//                           <TableCell
//                             className="table-padding"
//                             // align="center"
//                             sx={{
//                               borderBottomColor: '#ececec',
//                               borderBottomWidth: 2,
//                               color: '#555555',
//                               fontWeight: 500,
//                               pl: 0,
//                             }}
//                           >
//                             {farm &&
//                               farm.units[0].WaterManageHistoryAvgrage &&
//                               farm.units[0].WaterManageHistoryAvgrage.map(
//                                 (unit, i) => {
//                                   return (
//                                     <Typography
//                                       key={i}
//                                       variant="h6"
//                                       sx={{
//                                         fontWeight: 500,
//                                         fontSize: 14,
//                                         backgroundColor: '#F5F6F8',
//                                         padding: `${
//                                           unit?.NO2
//                                             ? '8px 12px 8px 0'
//                                             : '19px 12px 19px 0'
//                                         }`,
//                                         margin: '8px 0',
//                                         // marginBottom: "10px",
//                                         textWrap: 'nowrap',
//                                       }}
//                                     >
//                                       {unit.NO2 ?? ''}
//                                     </Typography>
//                                   );
//                                 },
//                               )}
//                           </TableCell>
//                           <TableCell
//                             className="table-padding"
//                             // align="center"
//                             sx={{
//                               borderBottomColor: '#ececec',
//                               borderBottomWidth: 2,
//                               color: '#555555',
//                               fontWeight: 500,
//                               pl: 0,
//                             }}
//                           >
//                             {farm &&
//                               farm.units[0].WaterManageHistoryAvgrage &&
//                               farm.units[0].WaterManageHistoryAvgrage.map(
//                                 (unit, i) => {
//                                   return (
//                                     <Typography
//                                       key={i}
//                                       variant="h6"
//                                       sx={{
//                                         fontWeight: 500,
//                                         fontSize: 14,
//                                         backgroundColor: '#F5F6F8',
//                                         padding: `${
//                                           unit?.ph
//                                             ? '8px 12px 8px 0'
//                                             : '19px 12px 19px 0'
//                                         }`,
//                                         margin: '8px 0',
//                                         // marginBottom: "10px",
//                                         textWrap: 'nowrap',
//                                       }}
//                                     >
//                                       {unit.ph ?? ''}
//                                     </Typography>
//                                   );
//                                 },
//                               )}
//                           </TableCell>
//                           <TableCell
//                             className="table-padding"
//                             // align="center"
//                             sx={{
//                               borderBottomColor: '#ececec',
//                               borderBottomWidth: 2,
//                               color: '#555555',
//                               fontWeight: 500,
//                               pl: 0,
//                             }}
//                           >
//                             {farm &&
//                               farm.units[0].WaterManageHistoryAvgrage &&
//                               farm.units[0].WaterManageHistoryAvgrage.map(
//                                 (unit, i) => {
//                                   return (
//                                     <Typography
//                                       key={i}
//                                       variant="h6"
//                                       sx={{
//                                         fontWeight: 500,
//                                         fontSize: 14,
//                                         backgroundColor: '#F5F6F8',
//                                         padding: `${
//                                           unit?.visibility
//                                             ? '8px 12px 8px 0'
//                                             : '19px 12px 19px 0'
//                                         }`,
//                                         margin: '8px 0',
//                                         // marginBottom: "10px",
//                                         textWrap: 'nowrap',
//                                       }}
//                                     >
//                                       {unit.visibility ?? ''}
//                                     </Typography>
//                                   );
//                                 },
//                               )}
//                           </TableCell>
//                         </TableRow>
//                       );
//                     },
//                   )
//                 ) : (
//                   <TableRow>
//                     <TableCell colSpan={6} sx={{ textAlign: 'center' }}>
//                       No Data Found
//                     </TableCell>
//                   </TableRow>
//                 )}
//               </TableBody>
//             </Table>
//           </TableContainer>
//         </Paper>

//         <WaterSampleHistoryModal
//           open={isWaterSampleHistory}
//           setOpen={setIsWaterSampleHistory}
//           tableData={waterSampleHistoryHead}
//           productions={productions}
//         />
//         <div className="charts-container ">
//           {/* {xAxisData?.length !== 0 && (
//             <WaterTempChart
//               key={`waterTempChart`}
//               xAxisData={xAxisData}
//               ydata={groupedData
//                 ?.flatMap((farm) =>
//                   farm.units?.flatMap((unit) =>
//                     unit.WaterManageHistoryAvgrage?.map(
//                       (history) => history.waterTemp
//                     )
//                   )
//                 )
//                 .filter(Boolean)}
//               title="Water Temperature"
//             />
//           )} */}

//           {/* {xAxisData?.length!==0 && (
//             <WaterTempChart
//               key={`dissolvedOxgChart`}
//               xAxisData={xAxisData}
//               ydata={groupedData
//                 ?.flatMap((farm) =>
//                   farm.units?.flatMap((unit) =>
//                     unit.WaterManageHistoryAvgrage?.map((history) => history.DO)
//                   )
//                 )
//                 .filter(Boolean)}
//               title="Dissolved Oxygen"
//             />
//           )} */}
//           {/* {xAxisData?.length!==0  && (
//             <WaterTempChart
//               key={`TSS`}
//               xAxisData={xAxisData}
//               ydata={groupedData
//                 ?.flatMap((farm) =>
//                   farm.units?.flatMap((unit) =>
//                     unit.WaterManageHistoryAvgrage?.map(
//                       (history) => history.TSS
//                     )
//                   )
//                 )
//                 .filter(Boolean)}
//               title="Total Suspended Solids"
//             />
//           )} */}
//           {/* {xAxisData?.length!==0  && (
//             <WaterTempChart
//               key={`ammonia`}
//               xAxisData={xAxisData}
//               ydata={groupedData
//                 ?.flatMap((farm) =>
//                   farm.units?.flatMap((unit) =>
//                     unit.WaterManageHistoryAvgrage?.map(
//                       (history) => history.NH4
//                     )
//                   )
//                 )
//                 .filter(Boolean)}
//               title="Ammonia"
//             />
//           )} */}
//           {/* {xAxisData?.length!==0  && (
//             <WaterTempChart
//               key={`nitrate`}
//               xAxisData={xAxisData}
//               ydata={groupedData
//                 ?.flatMap((farm) =>
//                   farm.units?.flatMap((unit) =>
//                     unit.WaterManageHistoryAvgrage?.map(
//                       (history) => history.NO3
//                     )
//                   )
//                 )
//                 .filter(Boolean)}
//               title="Nitrate"
//             />
//           )} */}
//           {/* {xAxisData?.length!==0  && (
//             <WaterTempChart
//               key={`nitrite`}
//               xAxisData={xAxisData}
//               ydata={groupedData
//                 ?.flatMap((farm) =>
//                   farm.units?.flatMap((unit) =>
//                     unit.WaterManageHistoryAvgrage?.map(
//                       (history) => history.NO2
//                     )
//                   )
//                 )
//                 .filter(Boolean)}
//               title="Nitrite"
//             />
//           )} */}
//           {/* {xAxisData?.length!==0  && (
//             <WaterTempChart
//               key={`ph`}
//               xAxisData={xAxisData}
//               ydata={groupedData
//                 ?.flatMap((farm) =>
//                   farm.units?.flatMap((unit) =>
//                     unit.WaterManageHistoryAvgrage?.map((history) => history.ph)
//                   )
//                 )
//                 .filter(Boolean)}
//               title="PH"
//             />
//           )} */}
//           {/* {xAxisData?.length!==0  && (
//             <WaterTempChart
//               key={`visibility`}
//               xAxisData={xAxisData}
//               ydata={groupedData
//                 ?.flatMap((farm) =>
//                   farm.units?.flatMap((unit) =>
//                     unit.WaterManageHistoryAvgrage?.map(
//                       (history) => history.visibility
//                     )
//                   )
//                 )
//                 .filter(Boolean)}
//               title="Visibility"
//             />
//           )} */}
//         </div>
//       </Stack>
//     </Modal>
//   );
// };

// export default WaterManageHistoryModal;
