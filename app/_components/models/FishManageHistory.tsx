// import {
//   FishManageHistoryGroup,
//   Production,
// } from '@/app/_typeModels/production';
// import { Close as CloseIcon } from '@mui/icons-material'; // Use Material-UI's Close icon directly
// import {
//   Box,
//   IconButton,
//   Modal,
//   Paper,
//   Stack,
//   TableBody,
//   TableSortLabel,
//   Typography,
// } from '@mui/material';
// import Table from '@mui/material/Table';
// import TableCell from '@mui/material/TableCell';
// import TableContainer from '@mui/material/TableContainer';
// import TableHead from '@mui/material/TableHead';
// import TableRow from '@mui/material/TableRow';
// import React from 'react';
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
// const FishManageHistoryModal: React.FC<Props> = ({
//   setOpen,
//   open,
//   tableData,
//   productions,
// }) => {
//   const handleClose = () => {
//     setOpen(false);
//   };

//   function EnhancedTableHead() {
//     return (
//       <TableHead className="prod-action">
//         <TableRow>
//           {tableData.map((headCell: any, idx: number, headCells: any) => (
//             <TableCell
//               key={headCell.id}
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
//                 <TableSortLabel>{headCell.label}</TableSortLabel>
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
//     });

//     return result;
//   }, []);
//   return (
//     <Modal
//       open={open}
//       onClose={handleClose}
//       aria-labelledby="parent-modal-titles"
//       aria-describedby="parent-modal-descriptions"
//       className="modal-positioning custom-padding"
//       data-bs-backdrop="static"
//       sx={{
//         px: 5,
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
//                 padding: '2',
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
//               // order={order}
//               // orderBy={orderBy}
//               // onRequestSort={handleRequestSort}
//               />
//               <TableBody>
//                 {groupedData && groupedData?.length > 0 ? (
//                   groupedData?.map(
//                     (farm: FishManageHistoryGroup, i: number) => {
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
//                                   <Box
//                                     sx={{
//                                       pr: 3,
//                                     }}
//                                   ></Box>
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
//                               farm.units[0].fishManageHistory &&
//                               farm.units[0].fishManageHistory.map((unit, i) => {
//                                 return (
//                                   <Typography
//                                     key={i}
//                                     variant="h6"
//                                     sx={{
//                                       fontWeight: 500,
//                                       fontSize: 14,
//                                       backgroundColor: '#F5F6F8',
//                                       padding: `${
//                                         unit?.fishCount
//                                           ? '8px 12px 8px 0'
//                                           : '19px 12px 19px 0'
//                                       }`,
//                                       margin: '8px 0',
//                                       // marginBottom: "10px",
//                                       // padding: "21px",
//                                       textWrap: 'nowrap',
//                                     }}
//                                   >
//                                     {unit.currentDate
//                                       ? unit.currentDate
//                                       : new Date(
//                                           String(unit?.updatedAt),
//                                         ).toLocaleDateString()}
//                                   </Typography>
//                                 );
//                               })}
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
//                               farm.units[0].fishManageHistory &&
//                               farm.units[0].fishManageHistory.map((unit, i) => {
//                                 return (
//                                   <Typography
//                                     key={i}
//                                     variant="h6"
//                                     sx={{
//                                       fontWeight: 500,
//                                       fontSize: 14,
//                                       backgroundColor: '#F5F6F8',
//                                       padding: `${
//                                         unit?.fishCount
//                                           ? '8px 12px 8px 0'
//                                           : '19px 12px 19px 0'
//                                       }`,
//                                       margin: '8px 0',
//                                       // marginBottom: "10px",
//                                       // padding: "21px",
//                                       textWrap: 'nowrap',
//                                     }}
//                                   >
//                                     {unit.field ? unit.field : 'Stock'}
//                                   </Typography>
//                                 );
//                               })}
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
//                               farm.units[0].fishManageHistory &&
//                               farm.units[0].fishManageHistory.map((unit, i) => {
//                                 return (
//                                   <Typography
//                                     key={i}
//                                     variant="h6"
//                                     sx={{
//                                       fontWeight: 500,
//                                       fontSize: 14,
//                                       backgroundColor: '#F5F6F8',
//                                       padding: `${
//                                         farm.units[0].fishSupply?.batchNumber
//                                           ? '8px 12px 8px 0'
//                                           : '19px 12px 19px 0'
//                                       }`,
//                                       margin: '8px 0',
//                                       textWrap: 'nowrap',
//                                     }}
//                                   >
//                                     {farm.units[0].fishSupply?.batchNumber ??
//                                       ''}
//                                   </Typography>
//                                 );
//                               })}
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
//                               farm.units[0].fishManageHistory &&
//                               farm.units[0].fishManageHistory.map((unit, i) => {
//                                 return (
//                                   <Typography
//                                     key={i}
//                                     variant="h6"
//                                     sx={{
//                                       fontWeight: 500,
//                                       fontSize: 14,
//                                       padding: `${
//                                         farm.units[0].fishSupply?.age
//                                           ? '8px 12px 8px 0'
//                                           : '19px 12px 19px 0'
//                                       }`,
//                                       backgroundColor: '#F5F6F8',
//                                       margin: '8px 0',

//                                       textWrap: 'nowrap',
//                                     }}
//                                   >
//                                     {farm.units[0].fishSupply?.age ?? ''}
//                                   </Typography>
//                                 );
//                               })}
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
//                               farm.units[0].fishManageHistory &&
//                               farm.units[0].fishManageHistory.map((unit, i) => {
//                                 return (
//                                   <Typography
//                                     key={i}
//                                     variant="h6"
//                                     sx={{
//                                       fontWeight: 500,
//                                       fontSize: 14,
//                                       backgroundColor: '#F5F6F8',
//                                       padding: `${
//                                         unit?.fishCount
//                                           ? '8px 12px 8px 0'
//                                           : '19px 12px 19px 0'
//                                       }`,
//                                       margin: '8px 0',
//                                       // marginBottom: "10px",
//                                       // padding: "21px",
//                                       textWrap: 'nowrap',
//                                     }}
//                                   >
//                                     {unit?.fishCount ?? ''}
//                                   </Typography>
//                                 );
//                               })}
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
//                               farm.units[0].fishManageHistory &&
//                               farm.units[0].fishManageHistory.map((unit, i) => {
//                                 return (
//                                   <Typography
//                                     key={i}
//                                     variant="h6"
//                                     sx={{
//                                       fontWeight: 500,
//                                       fontSize: 14,
//                                       backgroundColor: '#F5F6F8',
//                                       padding: `${
//                                         unit?.biomass
//                                           ? '8px 12px 8px 0'
//                                           : '19px 12px 19px 0'
//                                       }`,
//                                       margin: '8px 0',
//                                       // marginBottom: "10px",
//                                       textWrap: 'nowrap',
//                                     }}
//                                   >
//                                     {unit.biomass ? `${unit.biomass} kg` : ''}
//                                   </Typography>
//                                 );
//                               })}
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
//                               farm.units[0].fishManageHistory &&
//                               farm.units[0].fishManageHistory.map((unit, i) => {
//                                 return (
//                                   <Typography
//                                     key={i}
//                                     variant="h6"
//                                     sx={{
//                                       fontWeight: 500,
//                                       fontSize: 14,
//                                       backgroundColor: '#F5F6F8',
//                                       padding: `${
//                                         unit?.meanWeight
//                                           ? '8px 12px 8px 0'
//                                           : '19px 12px 19px 0'
//                                       }`,
//                                       margin: '8px 0',
//                                       // marginBottom: "10px",
//                                       textWrap: 'nowrap',
//                                     }}
//                                   >
//                                     {unit.meanWeight
//                                       ? `${unit.meanWeight} g`
//                                       : ''}
//                                   </Typography>
//                                 );
//                               })}
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
//                               farm.units[0].fishManageHistory &&
//                               farm.units[0].fishManageHistory.map((unit, i) => {
//                                 return (
//                                   <Typography
//                                     key={i}
//                                     variant="h6"
//                                     sx={{
//                                       fontWeight: 500,
//                                       fontSize: 14,
//                                       backgroundColor: '#F5F6F8',
//                                       padding: `${
//                                         unit?.meanLength
//                                           ? '8px 12px 8px 0'
//                                           : '19px 12px 19px 0'
//                                       }`,
//                                       margin: '8px 0',
//                                       // marginBottom: "10px",
//                                       textWrap: 'nowrap',
//                                     }}
//                                   >
//                                     {unit.meanLength
//                                       ? `${unit.meanLength} mm`
//                                       : ''}
//                                   </Typography>
//                                 );
//                               })}
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
//                               farm.units[0].fishManageHistory &&
//                               farm.units[0].fishManageHistory.map((unit, i) => {
//                                 return (
//                                   <Typography
//                                     key={i}
//                                     variant="h6"
//                                     sx={{
//                                       fontWeight: 500,
//                                       fontSize: 14,
//                                       backgroundColor: '#F5F6F8',
//                                       padding: '8px 12px 8px 0',
//                                       margin: '8px 0',
//                                       // marginBottom: "10px",
//                                       textWrap: 'nowrap',
//                                     }}
//                                   >
//                                     {Number(unit.stockingDensityKG).toFixed(
//                                       2,
//                                     ) ?? ''}
//                                   </Typography>
//                                 );
//                               })}
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
//                               farm.units[0].fishManageHistory &&
//                               farm.units[0].fishManageHistory.map((unit, i) => {
//                                 return (
//                                   <Typography
//                                     key={i}
//                                     variant="h6"
//                                     sx={{
//                                       fontWeight: 500,
//                                       fontSize: 14,
//                                       backgroundColor: '#F5F6F8',
//                                       padding: '8px 12px 8px 0',
//                                       margin: '8px 0',
//                                       // marginBottom: "10px",
//                                       textWrap: 'nowrap',
//                                     }}
//                                   >
//                                     {Number(unit.stockingDensityNM).toFixed(
//                                       2,
//                                     ) ?? ''}
//                                   </Typography>
//                                 );
//                               })}

//                             {/* {farm.meanWeight ? `${farm.meanWeight}g` : ""} */}
//                           </TableCell>{' '}
//                           <TableCell
//                             className="table-padding"
//                             sx={{
//                               borderBottomColor: '#ececec',
//                               borderBottomWidth: 2,
//                               color: '#555555',
//                               fontWeight: 500,
//                               pl: 0,
//                             }}
//                           >
//                             {farm &&
//                               farm.units[0].fishManageHistory &&
//                               farm.units[0].fishManageHistory.map((unit, i) => {
//                                 return (
//                                   <Typography
//                                     key={i}
//                                     variant="h6"
//                                     sx={{
//                                       fontWeight: 500,
//                                       fontSize: 14,
//                                       backgroundColor: '#F5F6F8',
//                                       padding: '8px 12px 8px 0',
//                                       margin: '8px 0',
//                                       // marginBottom: "10px",
//                                       textWrap: 'nowrap',
//                                     }}
//                                   >
//                                     {Number(unit.stockingLevel) ?? ''}
//                                   </Typography>
//                                 );
//                               })}
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
//       </Stack>
//     </Modal>
//   );
// };

// export default FishManageHistoryModal;
