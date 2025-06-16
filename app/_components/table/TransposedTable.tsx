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

interface Props {
  feedSuppliers: any;
  handleChange: any;
  selectedSupplierIds: any;
  filteredStores: any;
}

export const TransposedTable = ({
  feedSuppliers,
  filteredStores,
  handleChange,
  selectedSupplierIds,
}: Props) => {
  const { control, handleSubmit, reset } = useForm();

  useEffect(() => {
    if (filteredStores?.length) {
      // Prepare flat key-value for default values
      const defaultValues: Record<string, any> = {};
      filteredStores.forEach((item: any, colIndex: number) => {
        Object.entries(item).forEach(([key, value]) => {
          if (
            !["id", "createdAt", "updatedAt", "organaisationId"].includes(key)
          ) {
            defaultValues[`${key}-${colIndex}`] = value;
          }
        });
      });
      reset(defaultValues);
    }
  }, [filteredStores, reset]);

  if (!filteredStores || filteredStores.length === 0) return null;

  const excludedKeys = [
    "id",
    "createdAt",
    "updatedAt",
    "organaisationId",
    "ProductSupplier",
  ];
  const keys = Object.keys(filteredStores[0]).filter(
    (key) => !excludedKeys.includes(key)
  );
  function transformFeedProductsWithSuppliers(flatData: Record<string, any>) {
    const result: any[] = [];
    const suppliers = flatData.suppliers?.[0]?.supplierIds || [];

    Object.keys(flatData).forEach((key) => {
      const match = key.match(/^(.+)-(\d+)$/);
      if (match) {
        const [, field, index] = match;
        const i = parseInt(index, 10);

        if (!result[i]) result[i] = {};
        result[i][field] = flatData[key];
      }
    });

    // Add suppliers to each product object
    return result.map((product) => ({
      ...product,
      suppliers,
    }));
  }

  const onSubmit = (data: any) => {
    const payload = transformFeedProductsWithSuppliers(data);
    const updatedPayload = payload.map((feed) => {
      const { ProductSupplier, suppliers, ...rest } = feed;
      return { ...rest, ProductSupplier: suppliers };
    });
    console.log(updatedPayload);
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
                {/* <Divider sx={{ borderBottomWidth: 1, my: 0.5 }} /> */}
                {/* <Typography
                  sx={{
                    fontWeight: 500,
                    background: "#FAFAFA",
                    fontSize: 13,
                    py: 1.2,
                    px: 2,
                  }}
                >
                  Brand Name
                </Typography> */}
              </TableCell>

              {/* Dynamic Store Columns */}

              {filteredStores.map((store, i) => (
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
                              .filter((s) => selected.includes(s.id))
                              .map((s) => s.name)
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

                {filteredStores.map((_, colIndex: number) => (
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
