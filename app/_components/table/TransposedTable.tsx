"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Divider,
  Box,
  Select,
  MenuItem,
  TextField,
  Button,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { useEffect } from "react";
import toast from "react-hot-toast";

interface Props {
  feedSuppliers: any;
  filteredStores: any;
}

export const TransposedTable = ({ feedSuppliers, filteredStores }: Props) => {
  const { control, handleSubmit, reset, setValue } = useForm();

  const excludedKeys = [
    "id",
    "createdAt",
    "updatedAt",
    "organaisationId",
    "ProductSupplier",
  ];

  useEffect(() => {
    if (filteredStores?.length) {
      // Prepare flat key-value for default values
      const defaultValues: Record<string, any> = {};
      filteredStores.forEach((item: any, colIndex: number) => {
        Object.entries(item).forEach(([key, value]) => {
          if (!["createdAt", "updatedAt", "organaisationId"].includes(key)) {
            defaultValues[`${key}-${colIndex}`] = value;
          }
        });
      });
      reset(defaultValues);
    }
  }, [filteredStores, reset]);

  useEffect(() => {
    if (filteredStores) {
      filteredStores?.map((store: any, i: number) => {
        return setValue(`suppliers[${i}].supplierIds`, store.ProductSupplier);
      });
    }
  }, [filteredStores]);
  if (!filteredStores || filteredStores.length === 0) return null;

  const keys = Object.keys(filteredStores[0]).filter(
    (key) => !excludedKeys.includes(key)
  );
  function transformFeedProductsWithSuppliers(flatData: Record<string, any>) {
    const result: any[] = [];
    const suppliersArray = flatData.suppliers || [];

    Object.keys(flatData).forEach((key) => {
      const match = key.match(/^(.+)-(\d+)$/);
      if (match) {
        const [, field, index] = match;
        const i = parseInt(index, 10);

        if (!result[i]) result[i] = {};
        result[i][field] = flatData[key];
      }
    });

    // Add corresponding supplierIds to each product
    return result.map((product, index) => ({
      ...product,
      supplierIds: suppliersArray[index]?.supplierIds || [],
    }));
  }

  const onSubmit = async (data: any) => {
    const payload = transformFeedProductsWithSuppliers(data);
    const updatedPayload = payload.map((feed) => {
      const { ProductSupplier, supplierIds, ...rest } = feed;
      return { ...rest, ProductSupplier: supplierIds };
    });

    try {
      const response = await fetch(`/api/feed-store `, {
        method: "PUT",
        body: JSON.stringify(updatedPayload),
      });

      if (response.ok) {
        const res = await response.json();
        toast.dismiss();

        toast.success(res.message);
      } else {
        toast.dismiss();
        toast.error("Somethig went wrong!");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 1 }}>
        <Button
          type="submit"
          variant="contained"
          sx={{
            color: "#fff",
            background: "#06A19B",
            fontWeight: 600,
            padding: "6px 16px",
            width: "fit-content",
            textTransform: "capitalize",
            borderRadius: "8px",
            border: "1px solid #06A19B",
          }}
        >
          Save
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {/* Static Field Column Title */}
              <TableCell
                sx={{
                  fontWeight: 500,
                  background: "#FAFAFA",
                  fontSize: 13,
                  py: 1.2,
                  px: 0,
                }}
              >
                <Typography
                  sx={{
                    fontWeight: 500,
                    background: "#FAFAFA",
                    fontSize: 13,
                    // py: 0.75,
                    px: 2,
                  }}
                >
                  Product Supplier
                </Typography>
              </TableCell>

              {/* Dynamic Store Columns */}

              {filteredStores.map((_: any, i: number) => (
                <TableCell
                  key={i}
                  sx={{
                    borderBottom: 0,
                    p: 0,
                  }}
                >
                  <Box
                    sx={{
                      px: 2,
                      py: 2,
                    }}
                  >
                    <Controller
                      name={`suppliers[${i}].supplierIds`}
                      control={control}
                      defaultValue={[]}
                      render={({ field }) => (
                        <Select
                          multiple
                          {...field}
                          sx={{
                            fontSize: { md: 14, xs: 12 },
                            fontWeight: 600,
                            px: 2,
                            whiteSpace: "nowrap",
                            maxWidth: "270px",
                            minWidth: "270px",
                            height: "40px",
                          }}
                          renderValue={(selected) =>
                            feedSuppliers
                              .filter((s: any) => selected.includes(s.id))
                              .map((s: any) => s.name)
                              .join(", ")
                          }
                        >
                          {feedSuppliers.map((supplier: any) => (
                            <MenuItem key={supplier.id} value={supplier.id}>
                              {supplier.name}
                            </MenuItem>
                          ))}
                        </Select>
                      )}
                    />
                  </Box>

                  <Divider
                    sx={{ borderBottomWidth: 1, transform: "translateY(1px)" }}
                  />

                  {/* <Controller
                    name={`suppliers[${i}].brandName`}
                    control={control}
                    defaultValue={store.brandName || ""}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        size="small"
                        variant="outlined"
                        fullWidth
                        sx={{ fontSize: 13, px: 2 }}
                      />
                    )}
                  /> */}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {keys.map((key) => (
              <TableRow key={key}>
                {/* Static Label Column */}
                <TableCell
                  sx={{
                    fontWeight: 500,
                    background: "#FAFAFA",
                    fontSize: 13,
                    py: 1.2,
                  }}
                >
                  {key}
                </TableCell>

                {filteredStores.map((_: any, colIndex: number) => (
                  <TableCell key={colIndex}>
                    <Controller
                      name={`${key}-${colIndex}`}
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          size="small"
                          variant="outlined"
                          fullWidth
                          sx={{ fontSize: 13 }}
                        />
                      )}
                    />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </form>
  );
};
