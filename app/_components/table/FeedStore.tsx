"use client";
import { FeedProduct } from "@/app/_typeModels/Feed";
import { FeedSupplier } from "@/app/_typeModels/Organization";
import { selectRole } from "@/lib/features/user/userSlice";
import { useAppSelector } from "@/lib/hooks";
import {
  Box,
  Button,
  Divider,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { TransposedTable } from "./TransposedTable";
type Iprops = {
  data: FeedProduct[];
  feedSuppliers: FeedSupplier[];
};

export default function FeedStoreTable({ data, feedSuppliers }: Iprops) {
  console.log(data);

  const router = useRouter();
  const role = useAppSelector(selectRole);
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("organisation");
  const [isApiCallInProgress, setIsApiCallInProgress] = React.useState(false);
  const [filteredStores, setFilteredStores] = React.useState<FeedProduct[]>();
  const [selectedSupplierIds, setSelectedSupplierIds] = useState<
    FeedSupplier[]
  >([]);
  const { control, handleSubmit, setValue } = useForm<{
    feedProducts: FeedProduct[];
  }>({
    defaultValues: {
      feedProducts: [],
    },
  });

  const handleChange = (event: any) => {
    setSelectedSupplierIds(event.target.value);
  };
  const onSubmit = async (data: { feedProducts: FeedProduct[] }) => {
    if (isApiCallInProgress) return;
    setIsApiCallInProgress(true);
    const payload = {
      data: data.feedProducts,
    };
    console.log(payload);

    // try {
    //   const response = await fetch(`/api/feed-store `, {
    //     method: "PUT",
    //     body: JSON.stringify(payload),
    //   });

    //   if (response.ok) {
    //     const res = await response.json();
    //     toast.dismiss();

    //     toast.success(res.message);
    //   } else {
    //     toast.dismiss();
    //     toast.error("Somethig went wrong!");
    //   }
    // } catch (error) {
    //   toast.error("Something went wrong. Please try again.");
    // } finally {
    //   setIsApiCallInProgress(false);
    // }
  };

  useEffect(() => {
    setFilteredStores(data);
    if (data) {
      setValue("feedProducts", data);
    }
  }, [data]);

  useEffect(() => {
    router.refresh();
  }, [router]);
  console.log(filteredStores);

  return (
    <>
      <TransposedTable
        feedSuppliers={feedSuppliers}
        filteredStores={filteredStores}
        handleChange={handleChange}
        selectedSupplierIds={selectedSupplierIds}
      />
    </>
  );
}

// "use client";
// import { FeedProduct } from "@/app/_typeModels/Feed";
// import { selectRole } from "@/lib/features/user/userSlice";
// import { useAppSelector } from "@/lib/hooks";
// import { Button, Divider, Typography } from "@mui/material";
// import Paper from "@mui/material/Paper";
// import Table from "@mui/material/Table";
// import TableBody from "@mui/material/TableBody";
// import TableCell from "@mui/material/TableCell";
// import TableContainer from "@mui/material/TableContainer";
// import TableHead from "@mui/material/TableHead";
// import TableRow from "@mui/material/TableRow";
// import React, { useEffect, useState } from "react";
// import { useForm } from "react-hook-form";
// import toast from "react-hot-toast";
// import {
//   DndContext,
//   closestCenter,
//   useSensor,
//   useSensors,
//   PointerSensor,
// } from "@dnd-kit/core";
// import {
//   arrayMove,
//   SortableContext,
//   useSortable,
//   verticalListSortingStrategy,
//   horizontalListSortingStrategy,
// } from "@dnd-kit/sortable";

// import { CSS } from "@dnd-kit/utilities";
// type Iprops = {
//   data: FeedProduct[];
// };
// function SortableHeader({ id, label }: { id: string; label: string }) {
//   const { attributes, listeners, setNodeRef, transform, transition } =
//     useSortable({ id });

//   const style = {
//     transform: CSS.Transform.toString(transform),
//     transition,
//     cursor: "grab",
//     backgroundColor: "#f5f5f5",
//     padding: "12px",
//     fontWeight: 600,
//   };

//   return (
//     <TableCell
//       ref={setNodeRef}
//       style={style}
//       {...attributes}
//       {...listeners}
//       align="center"
//     >
//       {label}
//     </TableCell>
//   );
// }

// export default function FeedStoreTable({ data }: Iprops) {
//   const datas = [
//     { Name: "Alice", Age: 25, Email: "alice@example.com" },
//     { Name: "Bob", Age: 30, Email: "bob@example.com" },
//     { Name: "Charlie", Age: 35, Email: "charlie@example.com" },
//   ];

//   const role = useAppSelector(selectRole);
//   const [order, setOrder] = React.useState("asc");
//   const [orderBy, setOrderBy] = React.useState("organisation");
//   const [isApiCallInProgress, setIsApiCallInProgress] = React.useState(false);
//   const [filteredStores, setFilteredStores] = React.useState<FeedProduct[]>();
//   const { control, handleSubmit, setValue } = useForm<{
//     feedProducts: FeedProduct[];
//   }>({
//     defaultValues: {
//       feedProducts: [], // initialize with empty or populated via useEffect
//     },
//   });
//   const sensors = useSensors(useSensor(PointerSensor));
//   const columnOptions = [
//     { label: "Product Supplier", value: "ProductSupplier" },
//     { label: "Brand Name", value: "brandName" },
//     { label: "Product Name", value: "productName" },
//     { label: "Product Format", value: "productFormat" },
//     { label: "Particle Size", value: "particleSize" },
//     { label: "Fish Size (g)", value: "fishSizeG" },
//     { label: "Nutritional Class", value: "nutritionalClass" },
//     { label: "Nutritional Purpose", value: "nutritionalPurpose" },
//     { label: "Suitable Species", value: "suitableSpecies" },
//     { label: "Suitability Animal Size", value: "suitabilityAnimalSize" },
//     { label: "Production Intensity", value: "productionIntensity" },
//     { label: "Suitability Unit", value: "suitabilityUnit" },
//     { label: "Feeding Phase", value: "feedingPhase" },
//     { label: "Life Stage", value: "lifeStage" },
//     { label: "Shelf Life (Months)", value: "shelfLifeMonths" },
//     { label: "Feed Cost", value: "feedCost" },
//     { label: "Feed Ingredients", value: "feedIngredients" },
//     { label: "Moisture (g/kg)", value: "moistureGPerKg" },
//     { label: "Crude Protein (g/kg)", value: "crudeProteinGPerKg" },
//     { label: "Crude Fat (g/kg)", value: "crudeFatGPerKg" },
//     { label: "Crude Fiber (g/kg)", value: "crudeFiberGPerKg" },
//     { label: "Crude Ash (g/kg)", value: "crudeAshGPerKg" },
//     { label: "NFE", value: "nfe" },
//     { label: "Calcium (g/kg)", value: "calciumGPerKg" },
//     { label: "Phosphorus (g/kg)", value: "phosphorusGPerKg" },
//     { label: "Carbohydrates (g/kg)", value: "carbohydratesGPerKg" },
//     { label: "Metabolizable Energy", value: "metabolizableEnergy" },
//     { label: "Feeding Guide", value: "feedingGuide" },
//     { label: "GE Coeff CP", value: "geCoeffCP" },
//     { label: "GE Coeff CF", value: "geCoeffCF" },
//     { label: "GE Coeff NFE", value: "geCoeffNFE" },
//     { label: "GE", value: "ge" },
//     { label: "Dig CP", value: "digCP" },
//     { label: "Dig CF", value: "digCF" },
//     { label: "Dig NFE", value: "digNFE" },
//     { label: "DE CP", value: "deCP" },
//     { label: "DE CF", value: "deCF" },
//     { label: "DE NFE", value: "deNFE" },
//     { label: "DE", value: "de" },
//     { label: "Created At", value: "createdAt" },
//     { label: "Updated At", value: "updatedAt" },
//   ];

//   const [columns, setColumns] = useState(columnOptions);
//   const onSubmit = async (data: { feedProducts: FeedProduct[] }) => {
//     if (isApiCallInProgress) return;
//     setIsApiCallInProgress(true);
//     const payload = {
//       data: data.feedProducts,
//     };
//     try {
//       const response = await fetch(`/api/feed-store `, {
//         method: "PUT",
//         body: JSON.stringify(payload),
//       });

//       if (response.ok) {
//         const res = await response.json();
//         toast.dismiss();

//         toast.success(res.message);
//       } else {
//         toast.dismiss();
//         toast.error("Somethig went wrong!");
//       }
//     } catch (error) {
//       toast.error("Something went wrong. Please try again.");
//     } finally {
//       setIsApiCallInProgress(false);
//     }
//   };
//   console.log(filteredStores);

//   const handleDragEnd = (event: any) => {
//     const { active, over } = event;
//     if (active.id !== over?.id) {
//       const oldIndex = columns.findIndex((col) => col.value === active.id);
//       const newIndex = columns.findIndex((col) => col.value === over.id);
//       setColumns(arrayMove(columns, oldIndex, newIndex));
//     }
//   };

//   useEffect(() => {
//     setFilteredStores(data);
//     if (data) {
//       setValue("feedProducts", data);
//     }
//   }, [data]);

//   return (
//     <DndContext
//       sensors={sensors}
//       collisionDetection={closestCenter}
//       onDragEnd={handleDragEnd}
//     >
//       <Paper
//         sx={{
//           width: "100%",
//           overflow: "hidden",
//           borderRadius: "14px",
//           boxShadow: "0px 0px 16px 5px #0000001A",
//           mt: 4,
//         }}
//       >
//         <Button
//           type="submit"
//           variant="contained"
//           sx={{
//             background: "#06A19B",
//             fontWeight: 600,
//             padding: "6px 16px",
//             width: "fit-content",
//             textTransform: "capitalize",
//             borderRadius: "8px",
//             my: 2,
//             mr: 2,
//             ml: "auto",
//             display: "block",
//           }}
//           disabled={filteredStores?.length === 0}
//         >
//           Save
//         </Button>

//         <TableContainer
//           sx={{
//             maxHeight: "72.5vh",
//           }}
//         >
//           <form onSubmit={handleSubmit(onSubmit)}>
//             <Table stickyHeader aria-label="sticky table">
//               <TableHead>
//                 <SortableContext
//                   items={columns}
//                   strategy={horizontalListSortingStrategy}
//                 >
//                   <TableRow>
//                     {columns.map((col) => (
//                       <SortableHeader
//                         key={col.value}
//                         id={col.value}
//                         label={col.label}
//                       />
//                     ))}
//                     {/* <TableCell
//                       sx={{
//                         borderBottom: 0,
//                         color: "#67737F",
//                         background: "#F5F6F8",
//                         px: 0,
//                       }}
//                     >
//                       <Typography
//                         sx={{
//                           fontSize: {
//                             md: 14,
//                             xs: 12,
//                           },
//                           fontWeight: 600,
//                           paddingLeft: {
//                             lg: 10,
//                             md: 7,
//                             xs: 4,
//                           },
//                           pr: 2,
//                           whiteSpace: "nowrap",
//                         }}
//                       >
//                         Product supplier
//                       </Typography>

//                       <Divider
//                         sx={{
//                           borderBottomWidth: 1,
//                           my: 0.5,
//                         }}
//                       />

//                       <Typography
//                         sx={{
//                           fontSize: {
//                             md: 14,
//                             xs: 12,
//                           },
//                           fontWeight: 600,
//                           paddingLeft: {
//                             lg: 10,
//                             md: 7,
//                             xs: 4,
//                           },
//                           pr: 2,
//                           whiteSpace: "nowrap",
//                         }}
//                       >
//                         Brand Name
//                       </Typography>
//                     </TableCell>

//                     {Array.from({ length: 7 }, (_, i) => i).map((i) => {
//                       return (
//                         <TableCell
//                           key={i}
//                           sx={{
//                             borderBottom: 0,
//                             color: "#67737F",
//                             background: "#F5F6F8",
//                             px: 0,
//                           }}
//                         >
//                           <Typography
//                             sx={{
//                               fontSize: {
//                                 md: 14,
//                                 xs: 12,
//                               },
//                               fontWeight: 600,
//                               px: 2,
//                               whiteSpace: "nowrap",
//                             }}
//                           >
//                             {filteredStores
//                               ? filteredStores[i]?.ProductSupplier
//                               : ""}
//                           </Typography>

//                           <Divider
//                             sx={{
//                               borderBottomWidth: 1,
//                               my: 0.5,
//                             }}
//                           />

//                           <Typography
//                             sx={{
//                               fontSize: {
//                                 md: 14,
//                                 xs: 12,
//                               },
//                               fontWeight: 600,
//                               px: 2,
//                               whiteSpace: "nowrap",
//                             }}
//                           >
//                             {filteredStores ? filteredStores[i]?.brandName : 0}
//                           </Typography>
//                         </TableCell>
//                       );
//                     })} */}
//                   </TableRow>
//                 </SortableContext>
//               </TableHead>

//               <TableBody>
//                 {filteredStores?.map((row, idx) => (
//                   <TableRow key={row.id || idx}>
//                     {columns.map((col) => (
//                       <TableCell key={col.value}>
//                         {row[col.value as keyof FeedProduct] ?? "-"}
//                       </TableCell>
//                     ))}
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </form>
//         </TableContainer>
//       </Paper>
//     </DndContext>
//   );
// }
