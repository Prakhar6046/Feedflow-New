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
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
type Iprops = {
  data: FeedProduct[];
  feedSuppliers: FeedSupplier[];
};

export default function FeedStoreTable({ data, feedSuppliers }: Iprops) {
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
      feedProducts: [], // initialize with empty or populated via useEffect
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
    try {
      const response = await fetch(`/api/feed-store `, {
        method: "PUT",
        body: JSON.stringify(payload),
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
    } finally {
      setIsApiCallInProgress(false);
    }
  };

  useEffect(() => {
    setFilteredStores(data);
    if (data) {
      setValue("feedProducts", data);
    }
  }, [data]);

  return (
    <>
      <Paper
        sx={{
          width: "100%",
          overflow: "hidden",
          borderRadius: "14px",
          boxShadow: "0px 0px 16px 5px #0000001A",
          mt: 4,
        }}
      >
        <Button
          type="submit"
          variant="contained"
          sx={{
            background: "#06A19B",
            fontWeight: 600,
            padding: "6px 16px",
            width: "fit-content",
            textTransform: "capitalize",
            borderRadius: "8px",
            my: 2,
            mr: 2,
            ml: "auto",
            display: "block",
          }}
          disabled={filteredStores?.length === 0}
        >
          Save
        </Button>

        <TableContainer
          sx={{
            maxHeight: "72.5vh",
          }}
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      borderBottom: 0,
                      color: "#67737F",
                      background: "#F5F6F8",
                      px: 0,
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: {
                          md: 14,
                          xs: 12,
                        },
                        fontWeight: 600,
                        paddingLeft: {
                          lg: 10,
                          md: 7,
                          xs: 4,
                        },
                        pr: 2,
                        py: 0.65,
                        whiteSpace: "nowrap",
                      }}
                    >
                      Product supplier
                    </Typography>

                    <Divider
                      sx={{
                        borderBottomWidth: 1,
                        my: 0.5,
                      }}
                    />

                    <Typography
                      sx={{
                        fontSize: {
                          md: 14,
                          xs: 12,
                        },
                        fontWeight: 600,
                        paddingLeft: {
                          lg: 10,
                          md: 7,
                          xs: 4,
                        },
                        pr: 2,
                        whiteSpace: "nowrap",
                      }}
                    >
                      Brand Name
                    </Typography>
                  </TableCell>

                  {Array.from({ length: 7 }, (_, i) => i).map((i) => {
                    return (
                      <TableCell
                        key={i}
                        sx={{
                          borderBottom: 0,
                          color: "#67737F",
                          background: "#F5F6F8",
                          px: 0,
                        }}
                      >
                        {/* <Typography
                          sx={{
                            fontSize: {
                              md: 14,
                              xs: 12,
                            },
                            fontWeight: 600,
                            px: 2,
                            whiteSpace: "nowrap",
                          }}
                        >
                          {filteredStores
                            ? filteredStores[i]?.ProductSupplier
                            : ""}
                        </Typography> */}
                        <Box
                          sx={{
                            px: 2,
                          }}
                        >
                          <Select
                            multiple
                            value={selectedSupplierIds}
                            onChange={handleChange}
                            sx={{
                              fontSize: { md: 14, xs: 12 },
                              fontWeight: 600,
                              px: 2,
                              whiteSpace: "nowrap",
                              maxWidth: "250px",
                              minWidth: "250px",
                              height: "32px",
                            }}
                            renderValue={(selected) =>
                              feedSuppliers
                                .filter((s) => selected.includes(s.id))
                                .map((s) => s.name)
                                .join(", ")
                            }
                          >
                            {feedSuppliers.map((supplier) => (
                              <MenuItem key={supplier.id} value={supplier.id}>
                                {supplier.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </Box>

                        <Divider
                          sx={{
                            borderBottomWidth: 1,
                            my: 0.5,
                          }}
                        />

                        <Typography
                          sx={{
                            fontSize: {
                              md: 14,
                              xs: 12,
                            },
                            fontWeight: 600,
                            px: 2,
                            whiteSpace: "nowrap",
                          }}
                        >
                          {filteredStores ? filteredStores[i]?.brandName : 0}
                        </Typography>
                      </TableCell>
                    );
                  })}
                </TableRow>
              </TableHead>

              <TableBody>
                <TableRow
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell
                    sx={{
                      borderBottomColor: "#F5F6F8",
                      borderBottomWidth: 2,
                      background: "#F5F6F8",
                      fontWeight: 500,
                      paddingLeft: {
                        lg: 10,
                        md: 7,
                        xs: 4,
                      },
                      pr: 2,
                      color: "#67737F",
                    }}
                  >
                    <Typography
                      variant="body1"
                      component={"p"}
                      sx={{
                        fontSize: {
                          md: 14,
                          xs: 12,
                        },
                        fontWeight: 600,
                      }}
                    >
                      Product Name
                    </Typography>
                  </TableCell>
                  {Array.from({ length: 7 }, (_, i) => i).map((i) => {
                    return (
                      <TableCell
                        key={i}
                        sx={{
                          borderBottomColor: "#F5F6F8",
                          borderBottomWidth: 2,
                          color: "#555555",
                          fontWeight: 500,
                          px: 2,
                        }}
                      >
                        <Typography
                          variant="body1"
                          component={"p"}
                          contentEditable
                          suppressContentEditableWarning
                          sx={{
                            fontSize: {
                              md: 14,
                              xs: 12,
                            },
                          }}
                        // onBlur={(e) =>
                        //   setValue(
                        //     field.name,
                        //     Number(e.target.textContent) ||
                        //     Number(field.value)
                        //   )
                        // }
                        >
                          {filteredStores ? filteredStores[i]?.productName : ""}
                        </Typography>
                      </TableCell>
                    );
                  })}
                </TableRow>
                <TableRow
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell
                    sx={{
                      borderBottomColor: "#F5F6F8",
                      borderBottomWidth: 2,
                      background: "#F5F6F8",
                      fontWeight: 500,
                      paddingLeft: {
                        lg: 10,
                        md: 7,
                        xs: 4,
                      },
                      pr: 2,
                      color: "#67737F",
                    }}
                  >
                    <Typography
                      variant="body1"
                      component={"p"}
                      sx={{
                        fontSize: {
                          md: 14,
                          xs: 12,
                        },
                        fontWeight: 600,
                      }}
                    >
                      Product format
                    </Typography>
                  </TableCell>

                  {Array.from({ length: 7 }, (_, i) => i).map((i) => {
                    return (
                      <TableCell
                        key={i}
                        sx={{
                          borderBottomColor: "#F5F6F8",
                          borderBottomWidth: 2,
                          color: "#555555",
                          fontWeight: 500,
                          px: 2,
                        }}
                      >
                        <Typography
                          variant="body1"
                          component={"p"}
                          contentEditable
                          suppressContentEditableWarning
                          sx={{
                            fontSize: {
                              md: 14,
                              xs: 12,
                            },
                          }}
                        // onBlur={(e) =>
                        //   setValue(
                        //     field.name,
                        //     Number(e.target.textContent) ||
                        //     Number(field.value)
                        //   )
                        // }
                        >
                          {filteredStores
                            ? filteredStores[i]?.productFormat
                            : ""}
                        </Typography>
                      </TableCell>
                    );
                  })}
                </TableRow>
                <TableRow
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell
                    sx={{
                      borderBottomColor: "#F5F6F8",
                      borderBottomWidth: 2,
                      background: "#F5F6F8",
                      fontWeight: 500,
                      paddingLeft: {
                        lg: 10,
                        md: 7,
                        xs: 4,
                      },
                      pr: 2,
                      color: "#67737F",
                    }}
                  >
                    <Typography
                      variant="body1"
                      component={"p"}
                      sx={{
                        fontSize: {
                          md: 14,
                          xs: 12,
                        },
                        fontWeight: 600,
                      }}
                    >
                      Particle size
                    </Typography>
                  </TableCell>

                  {Array.from({ length: 7 }, (_, i) => i).map((i) => {
                    return (
                      <TableCell
                        key={i}
                        sx={{
                          borderBottomColor: "#F5F6F8",
                          borderBottomWidth: 2,
                          color: "#555555",
                          fontWeight: 500,
                          px: 2,
                        }}
                      >
                        <Typography
                          variant="body1"
                          component={"p"}
                          contentEditable
                          suppressContentEditableWarning
                          sx={{
                            fontSize: {
                              md: 14,
                              xs: 12,
                            },
                          }}
                        // onBlur={(e) =>
                        //   setValue(
                        //     field.name,
                        //     Number(e.target.textContent) ||
                        //     Number(field.value)
                        //   )
                        // }
                        >
                          {filteredStores
                            ? filteredStores[i]?.particleSize
                            : ""}
                        </Typography>
                      </TableCell>
                    );
                  })}
                </TableRow>
                <TableRow
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell
                    sx={{
                      borderBottomColor: "#F5F6F8",
                      borderBottomWidth: 2,
                      background: "#F5F6F8",
                      fontWeight: 500,
                      paddingLeft: {
                        lg: 10,
                        md: 7,
                        xs: 4,
                      },
                      pr: 2,
                      color: "#67737F",
                    }}
                  >
                    <Typography
                      variant="body1"
                      component={"p"}
                      sx={{
                        fontSize: {
                          md: 14,
                          xs: 12,
                        },
                        fontWeight: 600,
                      }}
                    >
                      Bag size (kg)
                    </Typography>
                  </TableCell>

                  {Array.from({ length: 7 }, (_, i) => i).map((i) => {
                    return (
                      <TableCell
                        key={i}
                        sx={{
                          borderBottomColor: "#F5F6F8",
                          borderBottomWidth: 2,
                          color: "#555555",
                          fontWeight: 500,
                          px: 2,
                        }}
                      >
                        <Typography
                          variant="body1"
                          component={"p"}
                          contentEditable
                          suppressContentEditableWarning
                          sx={{
                            fontSize: {
                              md: 14,
                              xs: 12,
                            },
                          }}
                        // onBlur={(e) =>
                        //   setValue(
                        //     field.name,
                        //     Number(e.target.textContent) ||
                        //     Number(field.value)
                        //   )
                        // }
                        >
                          {filteredStores ? filteredStores[i]?.fishSizeG : ""}
                        </Typography>
                      </TableCell>
                    );
                  })}
                </TableRow>
                <TableRow
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell
                    sx={{
                      borderBottomColor: "#F5F6F8",
                      borderBottomWidth: 2,
                      background: "#F5F6F8",
                      fontWeight: 500,
                      paddingLeft: {
                        lg: 10,
                        md: 7,
                        xs: 4,
                      },
                      pr: 2,
                      color: "#67737F",
                    }}
                  >
                    <Typography
                      variant="body1"
                      component={"p"}
                      sx={{
                        fontSize: {
                          md: 14,
                          xs: 12,
                        },
                        fontWeight: 600,
                      }}
                    >
                      Min Fish size (g)
                    </Typography>
                  </TableCell>

                  <TableCell
                    sx={{
                      borderBottomColor: "#F5F6F8",
                      borderBottomWidth: 2,
                      color: "#555555",
                      fontWeight: 500,
                      px: 2,
                    }}
                  >
                    <Typography
                      variant="body1"
                      component={"p"}
                      contentEditable
                      suppressContentEditableWarning
                      sx={{
                        fontSize: {
                          md: 14,
                          xs: 12,
                        },
                      }}
                    // onBlur={(e) =>
                    //   setValue(
                    //     field.name,
                    //     Number(e.target.textContent) ||
                    //     Number(field.value)
                    //   )
                    // }
                    >
                      Tilapia starter #0
                    </Typography>
                  </TableCell>

                  <TableCell
                    sx={{
                      borderBottomColor: "#F5F6F8",
                      borderBottomWidth: 2,
                      color: "#555555",
                      fontWeight: 500,
                      px: 2,
                    }}
                  >
                    <Typography
                      variant="body1"
                      component={"p"}
                      contentEditable
                      suppressContentEditableWarning
                      sx={{
                        fontSize: {
                          md: 14,
                          xs: 12,
                        },
                      }}
                    // onBlur={(e) =>
                    //   setValue(
                    //     field.name,
                    //     Number(e.target.textContent) ||
                    //     Number(field.value)
                    //   )
                    // }
                    >
                      Tilapia starter #1
                    </Typography>
                  </TableCell>

                  <TableCell
                    sx={{
                      borderBottomColor: "#F5F6F8",
                      borderBottomWidth: 2,
                      color: "#555555",
                      fontWeight: 500,
                      px: 2,
                    }}
                  >
                    <Typography
                      variant="body1"
                      component={"p"}
                      contentEditable
                      suppressContentEditableWarning
                      sx={{
                        fontSize: {
                          md: 14,
                          xs: 12,
                        },
                      }}
                    // onBlur={(e) =>
                    //   setValue(
                    //     field.name,
                    //     Number(e.target.textContent) ||
                    //     Number(field.value)
                    //   )
                    // }
                    >
                      Tilapia starter #1
                    </Typography>
                  </TableCell>

                  <TableCell
                    sx={{
                      borderBottomColor: "#F5F6F8",
                      borderBottomWidth: 2,
                      color: "#555555",
                      fontWeight: 500,
                      px: 2,
                    }}
                  >
                    <Typography
                      variant="body1"
                      component={"p"}
                      contentEditable
                      suppressContentEditableWarning
                      sx={{
                        fontSize: {
                          md: 14,
                          xs: 12,
                        },
                      }}
                    // onBlur={(e) =>
                    //   setValue(
                    //     field.name,
                    //     Number(e.target.textContent) ||
                    //     Number(field.value)
                    //   )
                    // }
                    >
                      Tilapia starter #1
                    </Typography>
                  </TableCell>

                  <TableCell
                    sx={{
                      borderBottomColor: "#F5F6F8",
                      borderBottomWidth: 2,
                      color: "#555555",
                      fontWeight: 500,
                      px: 2,
                    }}
                  >
                    <Typography
                      variant="body1"
                      component={"p"}
                      contentEditable
                      suppressContentEditableWarning
                      sx={{
                        fontSize: {
                          md: 14,
                          xs: 12,
                        },
                      }}
                    // onBlur={(e) =>
                    //   setValue(
                    //     field.name,
                    //     Number(e.target.textContent) ||
                    //     Number(field.value)
                    //   )
                    // }
                    >
                      Tilapia starter #1
                    </Typography>
                  </TableCell>

                  <TableCell
                    sx={{
                      borderBottomColor: "#F5F6F8",
                      borderBottomWidth: 2,
                      color: "#555555",
                      fontWeight: 500,
                      px: 2,
                    }}
                  >
                    <Typography
                      variant="body1"
                      component={"p"}
                      contentEditable
                      suppressContentEditableWarning
                      sx={{
                        fontSize: {
                          md: 14,
                          xs: 12,
                        },
                      }}
                    // onBlur={(e) =>
                    //   setValue(
                    //     field.name,
                    //     Number(e.target.textContent) ||
                    //     Number(field.value)
                    //   )
                    // }
                    >
                      Tilapia starter #1
                    </Typography>
                  </TableCell>

                  <TableCell
                    sx={{
                      borderBottomColor: "#F5F6F8",
                      borderBottomWidth: 2,
                      color: "#555555",
                      fontWeight: 500,
                      px: 2,
                    }}
                  >
                    <Typography
                      variant="body1"
                      component={"p"}
                      contentEditable
                      suppressContentEditableWarning
                      sx={{
                        fontSize: {
                          md: 14,
                          xs: 12,
                        },
                      }}
                    // onBlur={(e) =>
                    //   setValue(
                    //     field.name,
                    //     Number(e.target.textContent) ||
                    //     Number(field.value)
                    //   )
                    // }
                    >
                      Tilapia starter #1
                    </Typography>
                  </TableCell>
                </TableRow>
                <TableRow
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell
                    sx={{
                      borderBottomColor: "#F5F6F8",
                      borderBottomWidth: 2,
                      background: "#F5F6F8",
                      fontWeight: 500,
                      paddingLeft: {
                        lg: 10,
                        md: 7,
                        xs: 4,
                      },
                      pr: 2,
                      color: "#67737F",
                    }}
                  >
                    <Typography
                      variant="body1"
                      component={"p"}
                      sx={{
                        fontSize: {
                          md: 14,
                          xs: 12,
                        },
                        fontWeight: 600,
                      }}
                    >
                      Max fish size
                    </Typography>
                  </TableCell>

                  <TableCell
                    sx={{
                      borderBottomColor: "#F5F6F8",
                      borderBottomWidth: 2,
                      color: "#555555",
                      fontWeight: 500,
                      px: 2,
                    }}
                  >
                    <Typography
                      variant="body1"
                      component={"p"}
                      contentEditable
                      suppressContentEditableWarning
                      sx={{
                        fontSize: {
                          md: 14,
                          xs: 12,
                        },
                      }}
                    // onBlur={(e) =>
                    //   setValue(
                    //     field.name,
                    //     Number(e.target.textContent) ||
                    //     Number(field.value)
                    //   )
                    // }
                    >
                      Tilapia starter #0
                    </Typography>
                  </TableCell>

                  <TableCell
                    sx={{
                      borderBottomColor: "#F5F6F8",
                      borderBottomWidth: 2,
                      color: "#555555",
                      fontWeight: 500,
                      px: 2,
                    }}
                  >
                    <Typography
                      variant="body1"
                      component={"p"}
                      contentEditable
                      suppressContentEditableWarning
                      sx={{
                        fontSize: {
                          md: 14,
                          xs: 12,
                        },
                      }}
                    // onBlur={(e) =>
                    //   setValue(
                    //     field.name,
                    //     Number(e.target.textContent) ||
                    //     Number(field.value)
                    //   )
                    // }
                    >
                      Tilapia starter #1
                    </Typography>
                  </TableCell>

                  <TableCell
                    sx={{
                      borderBottomColor: "#F5F6F8",
                      borderBottomWidth: 2,
                      color: "#555555",
                      fontWeight: 500,
                      px: 2,
                    }}
                  >
                    <Typography
                      variant="body1"
                      component={"p"}
                      contentEditable
                      suppressContentEditableWarning
                      sx={{
                        fontSize: {
                          md: 14,
                          xs: 12,
                        },
                      }}
                    // onBlur={(e) =>
                    //   setValue(
                    //     field.name,
                    //     Number(e.target.textContent) ||
                    //     Number(field.value)
                    //   )
                    // }
                    >
                      Tilapia starter #1
                    </Typography>
                  </TableCell>

                  <TableCell
                    sx={{
                      borderBottomColor: "#F5F6F8",
                      borderBottomWidth: 2,
                      color: "#555555",
                      fontWeight: 500,
                      px: 2,
                    }}
                  >
                    <Typography
                      variant="body1"
                      component={"p"}
                      contentEditable
                      suppressContentEditableWarning
                      sx={{
                        fontSize: {
                          md: 14,
                          xs: 12,
                        },
                      }}
                    // onBlur={(e) =>
                    //   setValue(
                    //     field.name,
                    //     Number(e.target.textContent) ||
                    //     Number(field.value)
                    //   )
                    // }
                    >
                      Tilapia starter #1
                    </Typography>
                  </TableCell>

                  <TableCell
                    sx={{
                      borderBottomColor: "#F5F6F8",
                      borderBottomWidth: 2,
                      color: "#555555",
                      fontWeight: 500,
                      px: 2,
                    }}
                  >
                    <Typography
                      variant="body1"
                      component={"p"}
                      contentEditable
                      suppressContentEditableWarning
                      sx={{
                        fontSize: {
                          md: 14,
                          xs: 12,
                        },
                      }}
                    // onBlur={(e) =>
                    //   setValue(
                    //     field.name,
                    //     Number(e.target.textContent) ||
                    //     Number(field.value)
                    //   )
                    // }
                    >
                      Tilapia starter #1
                    </Typography>
                  </TableCell>

                  <TableCell
                    sx={{
                      borderBottomColor: "#F5F6F8",
                      borderBottomWidth: 2,
                      color: "#555555",
                      fontWeight: 500,
                      px: 2,
                    }}
                  >
                    <Typography
                      variant="body1"
                      component={"p"}
                      contentEditable
                      suppressContentEditableWarning
                      sx={{
                        fontSize: {
                          md: 14,
                          xs: 12,
                        },
                      }}
                    // onBlur={(e) =>
                    //   setValue(
                    //     field.name,
                    //     Number(e.target.textContent) ||
                    //     Number(field.value)
                    //   )
                    // }
                    >
                      Tilapia starter #1
                    </Typography>
                  </TableCell>

                  <TableCell
                    sx={{
                      borderBottomColor: "#F5F6F8",
                      borderBottomWidth: 2,
                      color: "#555555",
                      fontWeight: 500,
                      px: 2,
                    }}
                  >
                    <Typography
                      variant="body1"
                      component={"p"}
                      contentEditable
                      suppressContentEditableWarning
                      sx={{
                        fontSize: {
                          md: 14,
                          xs: 12,
                        },
                      }}
                    // onBlur={(e) =>
                    //   setValue(
                    //     field.name,
                    //     Number(e.target.textContent) ||
                    //     Number(field.value)
                    //   )
                    // }
                    >
                      Tilapia starter #1
                    </Typography>
                  </TableCell>
                </TableRow>
                <TableRow
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell
                    sx={{
                      borderBottomColor: "#F5F6F8",
                      borderBottomWidth: 2,
                      background: "#F5F6F8",
                      fontWeight: 500,
                      paddingLeft: {
                        lg: 10,
                        md: 7,
                        xs: 4,
                      },
                      pr: 2,
                      color: "#67737F",
                    }}
                  >
                    <Typography
                      variant="body1"
                      component={"p"}
                      sx={{
                        fontSize: {
                          md: 14,
                          xs: 12,
                        },
                        fontWeight: 600,
                      }}
                    >
                      Nutrtional class
                    </Typography>
                  </TableCell>

                  {Array.from({ length: 7 }, (_, i) => i).map((i) => {
                    return (
                      <TableCell
                        key={i}
                        sx={{
                          borderBottomColor: "#F5F6F8",
                          borderBottomWidth: 2,
                          color: "#555555",
                          fontWeight: 500,
                          px: 2,
                        }}
                      >
                        <Typography
                          variant="body1"
                          component={"p"}
                          contentEditable
                          suppressContentEditableWarning
                          sx={{
                            fontSize: {
                              md: 14,
                              xs: 12,
                            },
                          }}
                        // onBlur={(e) =>
                        //   setValue(
                        //     field.name,
                        //     Number(e.target.textContent) ||
                        //     Number(field.value)
                        //   )
                        // }
                        >
                          {filteredStores
                            ? filteredStores[i]?.nutritionalClass
                            : ""}
                        </Typography>
                      </TableCell>
                    );
                  })}
                </TableRow>
                <TableRow
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell
                    sx={{
                      borderBottomColor: "#F5F6F8",
                      borderBottomWidth: 2,
                      background: "#F5F6F8",
                      fontWeight: 500,
                      paddingLeft: {
                        lg: 10,
                        md: 7,
                        xs: 4,
                      },
                      pr: 2,
                      color: "#67737F",
                    }}
                  >
                    <Typography
                      variant="body1"
                      component={"p"}
                      sx={{
                        fontSize: {
                          md: 14,
                          xs: 12,
                        },
                        fontWeight: 600,
                      }}
                    >
                      Nutritional purpose
                    </Typography>
                  </TableCell>

                  {Array.from({ length: 7 }, (_, i) => i).map((i) => {
                    return (
                      <TableCell
                        key={i}
                        sx={{
                          borderBottomColor: "#F5F6F8",
                          borderBottomWidth: 2,
                          color: "#555555",
                          fontWeight: 500,
                          px: 2,
                        }}
                      >
                        <Typography
                          variant="body1"
                          component={"p"}
                          contentEditable
                          suppressContentEditableWarning
                          sx={{
                            fontSize: {
                              md: 14,
                              xs: 12,
                            },
                          }}
                        // onBlur={(e) =>
                        //   setValue(
                        //     field.name,
                        //     Number(e.target.textContent) ||
                        //     Number(field.value)
                        //   )
                        // }
                        >
                          {filteredStores
                            ? filteredStores[i]?.nutritionalPurpose
                            : ""}
                        </Typography>
                      </TableCell>
                    );
                  })}
                </TableRow>
                <TableRow
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell
                    sx={{
                      borderBottomColor: "#F5F6F8",
                      borderBottomWidth: 2,
                      background: "#F5F6F8",
                      fontWeight: 500,
                      paddingLeft: {
                        lg: 10,
                        md: 7,
                        xs: 4,
                      },
                      pr: 2,
                      color: "#67737F",
                    }}
                  >
                    <Typography
                      variant="body1"
                      component={"p"}
                      sx={{
                        fontSize: {
                          md: 14,
                          xs: 12,
                        },
                        fontWeight: 600,
                      }}
                    >
                      Suitable: Species
                    </Typography>
                  </TableCell>

                  {Array.from({ length: 7 }, (_, i) => i).map((i) => {
                    return (
                      <TableCell
                        key={i}
                        sx={{
                          borderBottomColor: "#F5F6F8",
                          borderBottomWidth: 2,
                          color: "#555555",
                          fontWeight: 500,
                          px: 2,
                        }}
                      >
                        <Typography
                          variant="body1"
                          component={"p"}
                          contentEditable
                          suppressContentEditableWarning
                          sx={{
                            fontSize: {
                              md: 14,
                              xs: 12,
                            },
                          }}
                        // onBlur={(e) =>
                        //   setValue(
                        //     field.name,
                        //     Number(e.target.textContent) ||
                        //     Number(field.value)
                        //   )
                        // }
                        >
                          {filteredStores
                            ? filteredStores[i]?.suitableSpecies
                            : ""}
                        </Typography>
                      </TableCell>
                    );
                  })}
                </TableRow>
                <TableRow
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell
                    sx={{
                      borderBottomColor: "#F5F6F8",
                      borderBottomWidth: 2,
                      background: "#F5F6F8",
                      fontWeight: 500,
                      paddingLeft: {
                        lg: 10,
                        md: 7,
                        xs: 4,
                      },
                      pr: 2,
                      color: "#67737F",
                    }}
                  >
                    <Typography
                      variant="body1"
                      component={"p"}
                      sx={{
                        fontSize: {
                          md: 14,
                          xs: 12,
                        },
                        fontWeight: 600,
                      }}
                    >
                      Suitability :animal size (size/length)
                    </Typography>
                  </TableCell>

                  {Array.from({ length: 7 }, (_, i) => i).map((i) => {
                    return (
                      <TableCell
                        key={i}
                        sx={{
                          borderBottomColor: "#F5F6F8",
                          borderBottomWidth: 2,
                          color: "#555555",
                          fontWeight: 500,
                          px: 2,
                        }}
                      >
                        <Typography
                          variant="body1"
                          component={"p"}
                          contentEditable
                          suppressContentEditableWarning
                          sx={{
                            fontSize: {
                              md: 14,
                              xs: 12,
                            },
                          }}
                        // onBlur={(e) =>
                        //   setValue(
                        //     field.name,
                        //     Number(e.target.textContent) ||
                        //     Number(field.value)
                        //   )
                        // }
                        >
                          {filteredStores
                            ? filteredStores[i]?.suitabilityAnimalSize
                            : ""}
                        </Typography>
                      </TableCell>
                    );
                  })}
                </TableRow>{" "}
                <TableRow
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell
                    sx={{
                      borderBottomColor: "#F5F6F8",
                      borderBottomWidth: 2,
                      background: "#F5F6F8",
                      fontWeight: 500,
                      paddingLeft: {
                        lg: 10,
                        md: 7,
                        xs: 4,
                      },
                      pr: 2,
                      color: "#67737F",
                    }}
                  >
                    <Typography
                      variant="body1"
                      component={"p"}
                      sx={{
                        fontSize: {
                          md: 14,
                          xs: 12,
                        },
                        fontWeight: 600,
                      }}
                    >
                      Production intensity
                    </Typography>
                  </TableCell>

                  {Array.from({ length: 7 }, (_, i) => i).map((i) => {
                    return (
                      <TableCell
                        key={i}
                        sx={{
                          borderBottomColor: "#F5F6F8",
                          borderBottomWidth: 2,
                          color: "#555555",
                          fontWeight: 500,
                          px: 2,
                        }}
                      >
                        <Typography
                          variant="body1"
                          component={"p"}
                          contentEditable
                          suppressContentEditableWarning
                          sx={{
                            fontSize: {
                              md: 14,
                              xs: 12,
                            },
                          }}
                        // onBlur={(e) =>
                        //   setValue(
                        //     field.name,
                        //     Number(e.target.textContent) ||
                        //     Number(field.value)
                        //   )
                        // }
                        >
                          {filteredStores
                            ? filteredStores[i]?.productionIntensity
                            : ""}
                        </Typography>
                      </TableCell>
                    );
                  })}
                </TableRow>{" "}
                <TableRow
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell
                    sx={{
                      borderBottomColor: "#F5F6F8",
                      borderBottomWidth: 2,
                      background: "#F5F6F8",
                      fontWeight: 500,
                      paddingLeft: {
                        lg: 10,
                        md: 7,
                        xs: 4,
                      },
                      pr: 2,
                      color: "#67737F",
                    }}
                  >
                    <Typography
                      variant="body1"
                      component={"p"}
                      sx={{
                        fontSize: {
                          md: 14,
                          xs: 12,
                        },
                        fontWeight: 600,
                      }}
                    >
                      Suitability unit
                    </Typography>
                  </TableCell>

                  {Array.from({ length: 7 }, (_, i) => i).map((i) => {
                    return (
                      <TableCell
                        key={i}
                        sx={{
                          borderBottomColor: "#F5F6F8",
                          borderBottomWidth: 2,
                          color: "#555555",
                          fontWeight: 500,
                          px: 2,
                        }}
                      >
                        <Typography
                          variant="body1"
                          component={"p"}
                          contentEditable
                          suppressContentEditableWarning
                          sx={{
                            fontSize: {
                              md: 14,
                              xs: 12,
                            },
                          }}
                        // onBlur={(e) =>
                        //   setValue(
                        //     field.name,
                        //     Number(e.target.textContent) ||
                        //     Number(field.value)
                        //   )
                        // }
                        >
                          {filteredStores
                            ? filteredStores[i]?.suitabilityUnit
                            : ""}
                        </Typography>
                      </TableCell>
                    );
                  })}
                </TableRow>{" "}
                <TableRow
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell
                    sx={{
                      borderBottomColor: "#F5F6F8",
                      borderBottomWidth: 2,
                      background: "#F5F6F8",
                      fontWeight: 500,
                      paddingLeft: {
                        lg: 10,
                        md: 7,
                        xs: 4,
                      },
                      pr: 2,
                      color: "#67737F",
                    }}
                  >
                    <Typography
                      variant="body1"
                      component={"p"}
                      sx={{
                        fontSize: {
                          md: 14,
                          xs: 12,
                        },
                        fontWeight: 600,
                      }}
                    >
                      Feeding phase
                    </Typography>
                  </TableCell>

                  {Array.from({ length: 7 }, (_, i) => i).map((i) => {
                    return (
                      <TableCell
                        key={i}
                        sx={{
                          borderBottomColor: "#F5F6F8",
                          borderBottomWidth: 2,
                          color: "#555555",
                          fontWeight: 500,
                          px: 2,
                        }}
                      >
                        <Typography
                          variant="body1"
                          component={"p"}
                          contentEditable
                          suppressContentEditableWarning
                          sx={{
                            fontSize: {
                              md: 14,
                              xs: 12,
                            },
                          }}
                        // onBlur={(e) =>
                        //   setValue(
                        //     field.name,
                        //     Number(e.target.textContent) ||
                        //     Number(field.value)
                        //   )
                        // }
                        >
                          {filteredStores
                            ? filteredStores[i]?.feedingPhase
                            : ""}
                        </Typography>
                      </TableCell>
                    );
                  })}
                </TableRow>{" "}
                <TableRow
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell
                    sx={{
                      borderBottomColor: "#F5F6F8",
                      borderBottomWidth: 2,
                      background: "#F5F6F8",
                      fontWeight: 500,
                      paddingLeft: {
                        lg: 10,
                        md: 7,
                        xs: 4,
                      },
                      pr: 2,
                      color: "#67737F",
                    }}
                  >
                    <Typography
                      variant="body1"
                      component={"p"}
                      sx={{
                        fontSize: {
                          md: 14,
                          xs: 12,
                        },
                        fontWeight: 600,
                      }}
                    >
                      Life stage
                    </Typography>
                  </TableCell>

                  {Array.from({ length: 7 }, (_, i) => i).map((i) => {
                    return (
                      <TableCell
                        key={i}
                        sx={{
                          borderBottomColor: "#F5F6F8",
                          borderBottomWidth: 2,
                          color: "#555555",
                          fontWeight: 500,
                          px: 2,
                        }}
                      >
                        <Typography
                          variant="body1"
                          component={"p"}
                          contentEditable
                          suppressContentEditableWarning
                          sx={{
                            fontSize: {
                              md: 14,
                              xs: 12,
                            },
                          }}
                        // onBlur={(e) =>
                        //   setValue(
                        //     field.name,
                        //     Number(e.target.textContent) ||
                        //     Number(field.value)
                        //   )
                        // }
                        >
                          {filteredStores ? filteredStores[i]?.lifeStage : ""}
                        </Typography>
                      </TableCell>
                    );
                  })}
                </TableRow>{" "}
                <TableRow
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell
                    sx={{
                      borderBottomColor: "#F5F6F8",
                      borderBottomWidth: 2,
                      background: "#F5F6F8",
                      fontWeight: 500,
                      paddingLeft: {
                        lg: 10,
                        md: 7,
                        xs: 4,
                      },
                      pr: 2,
                      color: "#67737F",
                    }}
                  >
                    <Typography
                      variant="body1"
                      component={"p"}
                      sx={{
                        fontSize: {
                          md: 14,
                          xs: 12,
                        },
                        fontWeight: 600,
                      }}
                    >
                      Shelf Live
                    </Typography>
                  </TableCell>

                  {Array.from({ length: 7 }, (_, i) => i).map((i) => {
                    return (
                      <TableCell
                        key={i}
                        sx={{
                          borderBottomColor: "#F5F6F8",
                          borderBottomWidth: 2,
                          color: "#555555",
                          fontWeight: 500,
                          px: 2,
                        }}
                      >
                        <Typography
                          variant="body1"
                          component={"p"}
                          contentEditable
                          suppressContentEditableWarning
                          sx={{
                            fontSize: {
                              md: 14,
                              xs: 12,
                            },
                          }}
                        // onBlur={(e) =>
                        //   setValue(
                        //     field.name,
                        //     Number(e.target.textContent) ||
                        //     Number(field.value)
                        //   )
                        // }
                        >
                          {filteredStores
                            ? filteredStores[i]?.shelfLifeMonths
                            : ""}
                        </Typography>
                      </TableCell>
                    );
                  })}
                </TableRow>{" "}
                <TableRow
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell
                    sx={{
                      borderBottomColor: "#F5F6F8",
                      borderBottomWidth: 2,
                      background: "#F5F6F8",
                      fontWeight: 500,
                      paddingLeft: {
                        lg: 10,
                        md: 7,
                        xs: 4,
                      },
                      pr: 2,
                      color: "#67737F",
                    }}
                  >
                    <Typography
                      variant="body1"
                      component={"p"}
                      sx={{
                        fontSize: {
                          md: 14,
                          xs: 12,
                        },
                        fontWeight: 600,
                      }}
                    >
                      Feed costs
                    </Typography>
                  </TableCell>

                  {Array.from({ length: 7 }, (_, i) => i).map((i) => {
                    return (
                      <TableCell
                        key={i}
                        sx={{
                          borderBottomColor: "#F5F6F8",
                          borderBottomWidth: 2,
                          color: "#555555",
                          fontWeight: 500,
                          px: 2,
                        }}
                      >
                        <Typography
                          variant="body1"
                          component={"p"}
                          contentEditable
                          suppressContentEditableWarning
                          sx={{
                            fontSize: {
                              md: 14,
                              xs: 12,
                            },
                          }}
                        // onBlur={(e) =>
                        //   setValue(
                        //     field.name,
                        //     Number(e.target.textContent) ||
                        //     Number(field.value)
                        //   )
                        // }
                        >
                          {filteredStores ? filteredStores[i]?.feedCost : ""}
                        </Typography>
                      </TableCell>
                    );
                  })}
                </TableRow>{" "}
                <TableRow
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell
                    sx={{
                      borderBottomColor: "#F5F6F8",
                      borderBottomWidth: 2,
                      background: "#F5F6F8",
                      fontWeight: 500,
                      paddingLeft: {
                        lg: 10,
                        md: 7,
                        xs: 4,
                      },
                      pr: 2,
                      color: "#67737F",
                    }}
                  >
                    <Typography
                      variant="body1"
                      component={"p"}
                      sx={{
                        fontSize: {
                          md: 14,
                          xs: 12,
                        },
                        fontWeight: 600,
                      }}
                    >
                      Feed ingredients
                    </Typography>
                  </TableCell>
                  {Array.from({ length: 7 }, (_, i) => i).map((i) => {
                    return (
                      <TableCell
                        key={i}
                        sx={{
                          borderBottomColor: "#F5F6F8",
                          borderBottomWidth: 2,
                          color: "#555555",
                          fontWeight: 500,
                          px: 2,
                        }}
                      >
                        <Typography
                          variant="body1"
                          component={"p"}
                          contentEditable
                          suppressContentEditableWarning
                          sx={{
                            fontSize: {
                              md: 14,
                              xs: 12,
                            },
                          }}
                        // onBlur={(e) =>
                        //   setValue(
                        //     field.name,
                        //     Number(e.target.textContent) ||
                        //     Number(field.value)
                        //   )
                        // }
                        >
                          {filteredStores
                            ? filteredStores[i]?.feedIngredients
                            : ""}
                        </Typography>
                      </TableCell>
                    );
                  })}
                </TableRow>{" "}
                <TableRow
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell
                    sx={{
                      borderBottomColor: "#F5F6F8",
                      borderBottomWidth: 2,
                      background: "#F5F6F8",
                      fontWeight: 500,
                      paddingLeft: {
                        lg: 10,
                        md: 7,
                        xs: 4,
                      },
                      pr: 2,
                      color: "#67737F",
                    }}
                  >
                    <Typography
                      variant="body1"
                      component={"p"}
                      sx={{
                        fontSize: {
                          md: 14,
                          xs: 12,
                        },
                        fontWeight: 600,
                      }}
                    >
                      Moisture (g/kg)
                    </Typography>
                  </TableCell>

                  {Array.from({ length: 7 }, (_, i) => i).map((i) => {
                    return (
                      <TableCell
                        key={i}
                        sx={{
                          borderBottomColor: "#F5F6F8",
                          borderBottomWidth: 2,
                          color: "#555555",
                          fontWeight: 500,
                          px: 2,
                        }}
                      >
                        <Typography
                          variant="body1"
                          component={"p"}
                          contentEditable
                          suppressContentEditableWarning
                          sx={{
                            fontSize: {
                              md: 14,
                              xs: 12,
                            },
                          }}
                        // onBlur={(e) =>
                        //   setValue(
                        //     field.name,
                        //     Number(e.target.textContent) ||
                        //     Number(field.value)
                        //   )
                        // }
                        >
                          {filteredStores
                            ? filteredStores[i]?.moistureGPerKg
                            : ""}
                        </Typography>
                      </TableCell>
                    );
                  })}
                </TableRow>{" "}
                <TableRow
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell
                    sx={{
                      borderBottomColor: "#F5F6F8",
                      borderBottomWidth: 2,
                      background: "#F5F6F8",
                      fontWeight: 500,
                      paddingLeft: {
                        lg: 10,
                        md: 7,
                        xs: 4,
                      },
                      pr: 2,
                      color: "#67737F",
                    }}
                  >
                    <Typography
                      variant="body1"
                      component={"p"}
                      sx={{
                        fontSize: {
                          md: 14,
                          xs: 12,
                        },
                        fontWeight: 600,
                      }}
                    >
                      Crude Protien (g/kg)
                    </Typography>
                  </TableCell>

                  {Array.from({ length: 7 }, (_, i) => i).map((i) => {
                    return (
                      <TableCell
                        key={i}
                        sx={{
                          borderBottomColor: "#F5F6F8",
                          borderBottomWidth: 2,
                          color: "#555555",
                          fontWeight: 500,
                          px: 2,
                        }}
                      >
                        <Typography
                          variant="body1"
                          component={"p"}
                          contentEditable
                          suppressContentEditableWarning
                          sx={{
                            fontSize: {
                              md: 14,
                              xs: 12,
                            },
                          }}
                        // onBlur={(e) =>
                        //   setValue(
                        //     field.name,
                        //     Number(e.target.textContent) ||
                        //     Number(field.value)
                        //   )
                        // }
                        >
                          {filteredStores
                            ? filteredStores[i]?.crudeProteinGPerKg
                            : ""}
                        </Typography>
                      </TableCell>
                    );
                  })}
                </TableRow>{" "}
                <TableRow
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell
                    sx={{
                      borderBottomColor: "#F5F6F8",
                      borderBottomWidth: 2,
                      background: "#F5F6F8",
                      fontWeight: 500,
                      paddingLeft: {
                        lg: 10,
                        md: 7,
                        xs: 4,
                      },
                      pr: 2,
                      color: "#67737F",
                    }}
                  >
                    <Typography
                      variant="body1"
                      component={"p"}
                      sx={{
                        fontSize: {
                          md: 14,
                          xs: 12,
                        },
                        fontWeight: 600,
                      }}
                    >
                      Crude Fat (g/kg)
                    </Typography>
                  </TableCell>

                  {Array.from({ length: 7 }, (_, i) => i).map((i) => {
                    return (
                      <TableCell
                        key={i}
                        sx={{
                          borderBottomColor: "#F5F6F8",
                          borderBottomWidth: 2,
                          color: "#555555",
                          fontWeight: 500,
                          px: 2,
                        }}
                      >
                        <Typography
                          variant="body1"
                          component={"p"}
                          contentEditable
                          suppressContentEditableWarning
                          sx={{
                            fontSize: {
                              md: 14,
                              xs: 12,
                            },
                          }}
                        // onBlur={(e) =>
                        //   setValue(
                        //     field.name,
                        //     Number(e.target.textContent) ||
                        //     Number(field.value)
                        //   )
                        // }
                        >
                          {filteredStores
                            ? filteredStores[i]?.crudeFatGPerKg
                            : ""}
                        </Typography>
                      </TableCell>
                    );
                  })}
                </TableRow>{" "}
                <TableRow
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell
                    sx={{
                      borderBottomColor: "#F5F6F8",
                      borderBottomWidth: 2,
                      background: "#F5F6F8",
                      fontWeight: 500,
                      paddingLeft: {
                        lg: 10,
                        md: 7,
                        xs: 4,
                      },
                      pr: 2,
                      color: "#67737F",
                    }}
                  >
                    <Typography
                      variant="body1"
                      component={"p"}
                      sx={{
                        fontSize: {
                          md: 14,
                          xs: 12,
                        },
                        fontWeight: 600,
                      }}
                    >
                      Crude Fibre (g/kg)
                    </Typography>
                  </TableCell>

                  {Array.from({ length: 7 }, (_, i) => i).map((i) => {
                    return (
                      <TableCell
                        key={i}
                        sx={{
                          borderBottomColor: "#F5F6F8",
                          borderBottomWidth: 2,
                          color: "#555555",
                          fontWeight: 500,
                          px: 2,
                        }}
                      >
                        <Typography
                          variant="body1"
                          component={"p"}
                          contentEditable
                          suppressContentEditableWarning
                          sx={{
                            fontSize: {
                              md: 14,
                              xs: 12,
                            },
                          }}
                        // onBlur={(e) =>
                        //   setValue(
                        //     field.name,
                        //     Number(e.target.textContent) ||
                        //     Number(field.value)
                        //   )
                        // }
                        >
                          {filteredStores
                            ? filteredStores[i]?.crudeFiberGPerKg
                            : ""}
                        </Typography>
                      </TableCell>
                    );
                  })}
                </TableRow>{" "}
                <TableRow
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell
                    sx={{
                      borderBottomColor: "#F5F6F8",
                      borderBottomWidth: 2,
                      background: "#F5F6F8",
                      fontWeight: 500,
                      paddingLeft: {
                        lg: 10,
                        md: 7,
                        xs: 4,
                      },
                      pr: 2,
                      color: "#67737F",
                    }}
                  >
                    <Typography
                      variant="body1"
                      component={"p"}
                      sx={{
                        fontSize: {
                          md: 14,
                          xs: 12,
                        },
                        fontWeight: 600,
                      }}
                    >
                      Crude Ash (g/kg)
                    </Typography>
                  </TableCell>

                  {Array.from({ length: 7 }, (_, i) => i).map((i) => {
                    return (
                      <TableCell
                        key={i}
                        sx={{
                          borderBottomColor: "#F5F6F8",
                          borderBottomWidth: 2,
                          color: "#555555",
                          fontWeight: 500,
                          px: 2,
                        }}
                      >
                        <Typography
                          variant="body1"
                          component={"p"}
                          contentEditable
                          suppressContentEditableWarning
                          sx={{
                            fontSize: {
                              md: 14,
                              xs: 12,
                            },
                          }}
                        // onBlur={(e) =>
                        //   setValue(
                        //     field.name,
                        //     Number(e.target.textContent) ||
                        //     Number(field.value)
                        //   )
                        // }
                        >
                          {filteredStores
                            ? filteredStores[i]?.crudeAshGPerKg
                            : ""}
                        </Typography>
                      </TableCell>
                    );
                  })}
                </TableRow>{" "}
                <TableRow
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell
                    sx={{
                      borderBottomColor: "#F5F6F8",
                      borderBottomWidth: 2,
                      background: "#F5F6F8",
                      fontWeight: 500,
                      paddingLeft: {
                        lg: 10,
                        md: 7,
                        xs: 4,
                      },
                      pr: 2,
                      color: "#67737F",
                    }}
                  >
                    <Typography
                      variant="body1"
                      component={"p"}
                      sx={{
                        fontSize: {
                          md: 14,
                          xs: 12,
                        },
                        fontWeight: 600,
                      }}
                    >
                      NFE
                    </Typography>
                  </TableCell>

                  {Array.from({ length: 7 }, (_, i) => i).map((i) => {
                    return (
                      <TableCell
                        key={i}
                        sx={{
                          borderBottomColor: "#F5F6F8",
                          borderBottomWidth: 2,
                          color: "#555555",
                          fontWeight: 500,
                          px: 2,
                        }}
                      >
                        <Typography
                          variant="body1"
                          component={"p"}
                          contentEditable
                          suppressContentEditableWarning
                          sx={{
                            fontSize: {
                              md: 14,
                              xs: 12,
                            },
                          }}
                        // onBlur={(e) =>
                        //   setValue(
                        //     field.name,
                        //     Number(e.target.textContent) ||
                        //     Number(field.value)
                        //   )
                        // }
                        >
                          {filteredStores ? filteredStores[i]?.nfe : ""}
                        </Typography>
                      </TableCell>
                    );
                  })}
                </TableRow>{" "}
                <TableRow
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell
                    sx={{
                      borderBottomColor: "#F5F6F8",
                      borderBottomWidth: 2,
                      background: "#F5F6F8",
                      fontWeight: 500,
                      paddingLeft: {
                        lg: 10,
                        md: 7,
                        xs: 4,
                      },
                      pr: 2,
                      color: "#67737F",
                    }}
                  >
                    <Typography
                      variant="body1"
                      component={"p"}
                      sx={{
                        fontSize: {
                          md: 14,
                          xs: 12,
                        },
                        fontWeight: 600,
                      }}
                    >
                      Calcium (g/kg)
                    </Typography>
                  </TableCell>

                  {Array.from({ length: 7 }, (_, i) => i).map((i) => {
                    return (
                      <TableCell
                        key={i}
                        sx={{
                          borderBottomColor: "#F5F6F8",
                          borderBottomWidth: 2,
                          color: "#555555",
                          fontWeight: 500,
                          px: 2,
                        }}
                      >
                        <Typography
                          variant="body1"
                          component={"p"}
                          contentEditable
                          suppressContentEditableWarning
                          sx={{
                            fontSize: {
                              md: 14,
                              xs: 12,
                            },
                          }}
                        // onBlur={(e) =>
                        //   setValue(
                        //     field.name,
                        //     Number(e.target.textContent) ||
                        //     Number(field.value)
                        //   )
                        // }
                        >
                          {filteredStores
                            ? filteredStores[i]?.calciumGPerKg
                            : ""}
                        </Typography>
                      </TableCell>
                    );
                  })}
                </TableRow>{" "}
                <TableRow
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell
                    sx={{
                      borderBottomColor: "#F5F6F8",
                      borderBottomWidth: 2,
                      background: "#F5F6F8",
                      fontWeight: 500,
                      paddingLeft: {
                        lg: 10,
                        md: 7,
                        xs: 4,
                      },
                      pr: 2,
                      color: "#67737F",
                    }}
                  >
                    <Typography
                      variant="body1"
                      component={"p"}
                      sx={{
                        fontSize: {
                          md: 14,
                          xs: 12,
                        },
                        fontWeight: 600,
                      }}
                    >
                      Phosphorous (g/kg)
                    </Typography>
                  </TableCell>

                  {Array.from({ length: 7 }, (_, i) => i).map((i) => {
                    return (
                      <TableCell
                        key={i}
                        sx={{
                          borderBottomColor: "#F5F6F8",
                          borderBottomWidth: 2,
                          color: "#555555",
                          fontWeight: 500,
                          px: 2,
                        }}
                      >
                        <Typography
                          variant="body1"
                          component={"p"}
                          contentEditable
                          suppressContentEditableWarning
                          sx={{
                            fontSize: {
                              md: 14,
                              xs: 12,
                            },
                          }}
                        // onBlur={(e) =>
                        //   setValue(
                        //     field.name,
                        //     Number(e.target.textContent) ||
                        //     Number(field.value)
                        //   )
                        // }
                        >
                          {filteredStores
                            ? filteredStores[i]?.phosphorusGPerKg
                            : ""}
                        </Typography>
                      </TableCell>
                    );
                  })}
                </TableRow>
                <TableRow
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell
                    sx={{
                      borderBottomColor: "#F5F6F8",
                      borderBottomWidth: 2,
                      background: "#F5F6F8",
                      fontWeight: 500,
                      paddingLeft: {
                        lg: 10,
                        md: 7,
                        xs: 4,
                      },
                      pr: 2,
                      color: "#67737F",
                    }}
                  >
                    <Typography
                      variant="body1"
                      component={"p"}
                      sx={{
                        fontSize: {
                          md: 14,
                          xs: 12,
                        },
                        fontWeight: 600,
                      }}
                    >
                      Carbohydrates (g/kg)
                    </Typography>
                  </TableCell>

                  {Array.from({ length: 7 }, (_, i) => i).map((i) => {
                    return (
                      <TableCell
                        key={i}
                        sx={{
                          borderBottomColor: "#F5F6F8",
                          borderBottomWidth: 2,
                          color: "#555555",
                          fontWeight: 500,
                          px: 2,
                        }}
                      >
                        <Typography
                          variant="body1"
                          component={"p"}
                          contentEditable
                          suppressContentEditableWarning
                          sx={{
                            fontSize: {
                              md: 14,
                              xs: 12,
                            },
                          }}
                        // onBlur={(e) =>
                        //   setValue(
                        //     field.name,
                        //     Number(e.target.textContent) ||
                        //     Number(field.value)
                        //   )
                        // }
                        >
                          {filteredStores
                            ? filteredStores[i]?.carbohydratesGPerKg
                            : ""}
                        </Typography>
                      </TableCell>
                    );
                  })}
                </TableRow>
                <TableRow
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell
                    sx={{
                      borderBottomColor: "#F5F6F8",
                      borderBottomWidth: 2,
                      background: "#F5F6F8",
                      fontWeight: 500,
                      paddingLeft: {
                        lg: 10,
                        md: 7,
                        xs: 4,
                      },
                      pr: 2,
                      color: "#67737F",
                    }}
                  >
                    <Typography
                      variant="body1"
                      component={"p"}
                      sx={{
                        fontSize: {
                          md: 14,
                          xs: 12,
                        },
                        fontWeight: 600,
                      }}
                    >
                      Metabolisabble energy
                    </Typography>
                  </TableCell>

                  {Array.from({ length: 7 }, (_, i) => i).map((i) => {
                    return (
                      <TableCell
                        key={i}
                        sx={{
                          borderBottomColor: "#F5F6F8",
                          borderBottomWidth: 2,
                          color: "#555555",
                          fontWeight: 500,
                          px: 2,
                        }}
                      >
                        <Typography
                          variant="body1"
                          component={"p"}
                          contentEditable
                          suppressContentEditableWarning
                          sx={{
                            fontSize: {
                              md: 14,
                              xs: 12,
                            },
                          }}
                        // onBlur={(e) =>
                        //   setValue(
                        //     field.name,
                        //     Number(e.target.textContent) ||
                        //     Number(field.value)
                        //   )
                        // }
                        >
                          {filteredStores
                            ? filteredStores[i]?.metabolizableEnergy
                            : ""}
                        </Typography>
                      </TableCell>
                    );
                  })}
                </TableRow>
                <TableRow
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell
                    sx={{
                      borderBottomColor: "#F5F6F8",
                      borderBottomWidth: 2,
                      background: "#F5F6F8",
                      fontWeight: 500,
                      paddingLeft: {
                        lg: 10,
                        md: 7,
                        xs: 4,
                      },
                      pr: 2,
                      color: "#67737F",
                    }}
                  >
                    <Typography
                      variant="body1"
                      component={"p"}
                      sx={{
                        fontSize: {
                          md: 14,
                          xs: 12,
                        },
                        fontWeight: 600,
                      }}
                    >
                      Feeding guide
                    </Typography>
                  </TableCell>

                  {Array.from({ length: 7 }, (_, i) => i).map((i) => {
                    return (
                      <TableCell
                        key={i}
                        sx={{
                          borderBottomColor: "#F5F6F8",
                          borderBottomWidth: 2,
                          color: "#555555",
                          fontWeight: 500,
                          px: 2,
                        }}
                      >
                        <Typography
                          variant="body1"
                          component={"p"}
                          contentEditable
                          suppressContentEditableWarning
                          sx={{
                            fontSize: {
                              md: 14,
                              xs: 12,
                            },
                          }}
                        // onBlur={(e) =>
                        //   setValue(
                        //     field.name,
                        //     Number(e.target.textContent) ||
                        //     Number(field.value)
                        //   )
                        // }
                        >
                          {filteredStores
                            ? filteredStores[i]?.feedingGuide
                            : ""}
                        </Typography>
                      </TableCell>
                    );
                  })}
                </TableRow>
                <TableRow
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell
                    sx={{
                      borderBottomColor: "#F5F6F8",
                      borderBottomWidth: 2,
                      background: "#F5F6F8",
                      fontWeight: 500,
                      paddingLeft: {
                        lg: 10,
                        md: 7,
                        xs: 4,
                      },
                      pr: 2,
                      color: "#67737F",
                    }}
                  >
                    <Typography
                      variant="body1"
                      component={"p"}
                      sx={{
                        fontSize: {
                          md: 14,
                          xs: 12,
                        },
                        fontWeight: 600,
                      }}
                    >
                      GE coeff CP
                    </Typography>
                  </TableCell>

                  {Array.from({ length: 7 }, (_, i) => i).map((i) => {
                    return (
                      <TableCell
                        key={i}
                        sx={{
                          borderBottomColor: "#F5F6F8",
                          borderBottomWidth: 2,
                          color: "#555555",
                          fontWeight: 500,
                          px: 2,
                        }}
                      >
                        <Typography
                          variant="body1"
                          component={"p"}
                          contentEditable
                          suppressContentEditableWarning
                          sx={{
                            fontSize: {
                              md: 14,
                              xs: 12,
                            },
                          }}
                        // onBlur={(e) =>
                        //   setValue(
                        //     field.name,
                        //     Number(e.target.textContent) ||
                        //     Number(field.value)
                        //   )
                        // }
                        >
                          {filteredStores ? filteredStores[i]?.geCoeffCP : ""}
                        </Typography>
                      </TableCell>
                    );
                  })}
                </TableRow>
                <TableRow
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell
                    sx={{
                      borderBottomColor: "#F5F6F8",
                      borderBottomWidth: 2,
                      background: "#F5F6F8",
                      fontWeight: 500,
                      paddingLeft: {
                        lg: 10,
                        md: 7,
                        xs: 4,
                      },
                      pr: 2,
                      color: "#67737F",
                    }}
                  >
                    <Typography
                      variant="body1"
                      component={"p"}
                      sx={{
                        fontSize: {
                          md: 14,
                          xs: 12,
                        },
                        fontWeight: 600,
                      }}
                    >
                      GE coeff CF
                    </Typography>
                  </TableCell>

                  {Array.from({ length: 7 }, (_, i) => i).map((i) => {
                    return (
                      <TableCell
                        key={i}
                        sx={{
                          borderBottomColor: "#F5F6F8",
                          borderBottomWidth: 2,
                          color: "#555555",
                          fontWeight: 500,
                          px: 2,
                        }}
                      >
                        <Typography
                          variant="body1"
                          component={"p"}
                          contentEditable
                          suppressContentEditableWarning
                          sx={{
                            fontSize: {
                              md: 14,
                              xs: 12,
                            },
                          }}
                        // onBlur={(e) =>
                        //   setValue(
                        //     field.name,
                        //     Number(e.target.textContent) ||
                        //     Number(field.value)
                        //   )
                        // }
                        >
                          {filteredStores ? filteredStores[i]?.geCoeffCF : ""}
                        </Typography>
                      </TableCell>
                    );
                  })}
                </TableRow>
                <TableRow
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell
                    sx={{
                      borderBottomColor: "#F5F6F8",
                      borderBottomWidth: 2,
                      background: "#F5F6F8",
                      fontWeight: 500,
                      paddingLeft: {
                        lg: 10,
                        md: 7,
                        xs: 4,
                      },
                      pr: 2,
                      color: "#67737F",
                    }}
                  >
                    <Typography
                      variant="body1"
                      component={"p"}
                      sx={{
                        fontSize: {
                          md: 14,
                          xs: 12,
                        },
                        fontWeight: 600,
                      }}
                    >
                      GE coeff NFE
                    </Typography>
                  </TableCell>

                  {Array.from({ length: 7 }, (_, i) => i).map((i) => {
                    return (
                      <TableCell
                        key={i}
                        sx={{
                          borderBottomColor: "#F5F6F8",
                          borderBottomWidth: 2,
                          color: "#555555",
                          fontWeight: 500,
                          px: 2,
                        }}
                      >
                        <Typography
                          variant="body1"
                          component={"p"}
                          contentEditable
                          suppressContentEditableWarning
                          sx={{
                            fontSize: {
                              md: 14,
                              xs: 12,
                            },
                          }}
                        // onBlur={(e) =>
                        //   setValue(
                        //     field.name,
                        //     Number(e.target.textContent) ||
                        //     Number(field.value)
                        //   )
                        // }
                        >
                          {filteredStores ? filteredStores[i]?.geCoeffNFE : ""}
                        </Typography>
                      </TableCell>
                    );
                  })}
                </TableRow>
                <TableRow
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell
                    sx={{
                      borderBottomColor: "#F5F6F8",
                      borderBottomWidth: 2,
                      background: "#F5F6F8",
                      fontWeight: 500,
                      paddingLeft: {
                        lg: 10,
                        md: 7,
                        xs: 4,
                      },
                      pr: 2,
                      color: "#67737F",
                    }}
                  >
                    <Typography
                      variant="body1"
                      component={"p"}
                      sx={{
                        fontSize: {
                          md: 14,
                          xs: 12,
                        },
                        fontWeight: 600,
                      }}
                    >
                      GE
                    </Typography>
                  </TableCell>

                  {Array.from({ length: 7 }, (_, i) => i).map((i) => {
                    return (
                      <TableCell
                        key={i}
                        sx={{
                          borderBottomColor: "#F5F6F8",
                          borderBottomWidth: 2,
                          color: "#555555",
                          fontWeight: 500,
                          px: 2,
                        }}
                      >
                        <Typography
                          variant="body1"
                          component={"p"}
                          contentEditable
                          suppressContentEditableWarning
                          sx={{
                            fontSize: {
                              md: 14,
                              xs: 12,
                            },
                          }}
                        // onBlur={(e) =>
                        //   setValue(
                        //     field.name,
                        //     Number(e.target.textContent) ||
                        //     Number(field.value)
                        //   )
                        // }
                        >
                          {filteredStores ? filteredStores[i]?.ge : ""}
                        </Typography>
                      </TableCell>
                    );
                  })}
                </TableRow>
                <TableRow
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell
                    sx={{
                      borderBottomColor: "#F5F6F8",
                      borderBottomWidth: 2,
                      background: "#F5F6F8",
                      fontWeight: 500,
                      paddingLeft: {
                        lg: 10,
                        md: 7,
                        xs: 4,
                      },
                      pr: 2,
                      color: "#67737F",
                    }}
                  >
                    <Typography
                      variant="body1"
                      component={"p"}
                      sx={{
                        fontSize: {
                          md: 14,
                          xs: 12,
                        },
                        fontWeight: 600,
                      }}
                    >
                      Dig CP
                    </Typography>
                  </TableCell>

                  {Array.from({ length: 7 }, (_, i) => i).map((i) => {
                    return (
                      <TableCell
                        key={i}
                        sx={{
                          borderBottomColor: "#F5F6F8",
                          borderBottomWidth: 2,
                          color: "#555555",
                          fontWeight: 500,
                          px: 2,
                        }}
                      >
                        <Typography
                          variant="body1"
                          component={"p"}
                          contentEditable
                          suppressContentEditableWarning
                          sx={{
                            fontSize: {
                              md: 14,
                              xs: 12,
                            },
                          }}
                        // onBlur={(e) =>
                        //   setValue(
                        //     field.name,
                        //     Number(e.target.textContent) ||
                        //     Number(field.value)
                        //   )
                        // }
                        >
                          {filteredStores ? filteredStores[i]?.digCP : ""}
                        </Typography>
                      </TableCell>
                    );
                  })}
                </TableRow>
                <TableRow
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell
                    sx={{
                      borderBottomColor: "#F5F6F8",
                      borderBottomWidth: 2,
                      background: "#F5F6F8",
                      fontWeight: 500,
                      paddingLeft: {
                        lg: 10,
                        md: 7,
                        xs: 4,
                      },
                      pr: 2,
                      color: "#67737F",
                    }}
                  >
                    <Typography
                      variant="body1"
                      component={"p"}
                      sx={{
                        fontSize: {
                          md: 14,
                          xs: 12,
                        },
                        fontWeight: 600,
                      }}
                    >
                      Dig CF (MJ/kg)
                    </Typography>
                  </TableCell>
                  {Array.from({ length: 7 }, (_, i) => i).map((i) => {
                    return (
                      <TableCell
                        key={i}
                        sx={{
                          borderBottomColor: "#F5F6F8",
                          borderBottomWidth: 2,
                          color: "#555555",
                          fontWeight: 500,
                          px: 2,
                        }}
                      >
                        <Typography
                          variant="body1"
                          component={"p"}
                          contentEditable
                          suppressContentEditableWarning
                          sx={{
                            fontSize: {
                              md: 14,
                              xs: 12,
                            },
                          }}
                        // onBlur={(e) =>
                        //   setValue(
                        //     field.name,
                        //     Number(e.target.textContent) ||
                        //     Number(field.value)
                        //   )
                        // }
                        >
                          {filteredStores ? filteredStores[i]?.digCF : ""}
                        </Typography>
                      </TableCell>
                    );
                  })}
                </TableRow>
                <TableRow
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell
                    sx={{
                      borderBottomColor: "#F5F6F8",
                      borderBottomWidth: 2,
                      background: "#F5F6F8",
                      fontWeight: 500,
                      paddingLeft: {
                        lg: 10,
                        md: 7,
                        xs: 4,
                      },
                      pr: 2,
                      color: "#67737F",
                    }}
                  >
                    <Typography
                      variant="body1"
                      component={"p"}
                      sx={{
                        fontSize: {
                          md: 14,
                          xs: 12,
                        },
                        fontWeight: 600,
                      }}
                    >
                      Dig NFE (MJ/kg)
                    </Typography>
                  </TableCell>

                  {Array.from({ length: 7 }, (_, i) => i).map((i) => {
                    return (
                      <TableCell
                        key={i}
                        sx={{
                          borderBottomColor: "#F5F6F8",
                          borderBottomWidth: 2,
                          color: "#555555",
                          fontWeight: 500,
                          px: 2,
                        }}
                      >
                        <Typography
                          variant="body1"
                          component={"p"}
                          contentEditable
                          suppressContentEditableWarning
                          sx={{
                            fontSize: {
                              md: 14,
                              xs: 12,
                            },
                          }}
                        // onBlur={(e) =>
                        //   setValue(
                        //     field.name,
                        //     Number(e.target.textContent) ||
                        //     Number(field.value)
                        //   )
                        // }
                        >
                          {filteredStores ? filteredStores[i]?.digNFE : ""}
                        </Typography>
                      </TableCell>
                    );
                  })}
                </TableRow>
                <TableRow
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell
                    sx={{
                      borderBottomColor: "#F5F6F8",
                      borderBottomWidth: 2,
                      background: "#F5F6F8",
                      fontWeight: 500,
                      paddingLeft: {
                        lg: 10,
                        md: 7,
                        xs: 4,
                      },
                      pr: 2,
                      color: "#67737F",
                    }}
                  >
                    <Typography
                      variant="body1"
                      component={"p"}
                      sx={{
                        fontSize: {
                          md: 14,
                          xs: 12,
                        },
                        fontWeight: 600,
                      }}
                    >
                      DE CP (MJ/kg)
                    </Typography>
                  </TableCell>

                  {Array.from({ length: 7 }, (_, i) => i).map((i) => {
                    return (
                      <TableCell
                        key={i}
                        sx={{
                          borderBottomColor: "#F5F6F8",
                          borderBottomWidth: 2,
                          color: "#555555",
                          fontWeight: 500,
                          px: 2,
                        }}
                      >
                        <Typography
                          variant="body1"
                          component={"p"}
                          contentEditable
                          suppressContentEditableWarning
                          sx={{
                            fontSize: {
                              md: 14,
                              xs: 12,
                            },
                          }}
                        // onBlur={(e) =>
                        //   setValue(
                        //     field.name,
                        //     Number(e.target.textContent) ||
                        //     Number(field.value)
                        //   )
                        // }
                        >
                          {filteredStores ? filteredStores[i]?.deCP : ""}
                        </Typography>
                      </TableCell>
                    );
                  })}
                </TableRow>
                <TableRow
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell
                    sx={{
                      borderBottomColor: "#F5F6F8",
                      borderBottomWidth: 2,
                      background: "#F5F6F8",
                      fontWeight: 500,
                      paddingLeft: {
                        lg: 10,
                        md: 7,
                        xs: 4,
                      },
                      pr: 2,
                      color: "#67737F",
                    }}
                  >
                    <Typography
                      variant="body1"
                      component={"p"}
                      sx={{
                        fontSize: {
                          md: 14,
                          xs: 12,
                        },
                        fontWeight: 600,
                      }}
                    >
                      DE CF (MJ/kg)
                    </Typography>
                  </TableCell>

                  {Array.from({ length: 7 }, (_, i) => i).map((i) => {
                    return (
                      <TableCell
                        key={i}
                        sx={{
                          borderBottomColor: "#F5F6F8",
                          borderBottomWidth: 2,
                          color: "#555555",
                          fontWeight: 500,
                          px: 2,
                        }}
                      >
                        <Typography
                          variant="body1"
                          component={"p"}
                          contentEditable
                          suppressContentEditableWarning
                          sx={{
                            fontSize: {
                              md: 14,
                              xs: 12,
                            },
                          }}
                        // onBlur={(e) =>
                        //   setValue(
                        //     field.name,
                        //     Number(e.target.textContent) ||
                        //     Number(field.value)
                        //   )
                        // }
                        >
                          {filteredStores ? filteredStores[i]?.deCF : ""}
                        </Typography>
                      </TableCell>
                    );
                  })}
                </TableRow>
                <TableRow
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell
                    sx={{
                      borderBottomColor: "#F5F6F8",
                      borderBottomWidth: 2,
                      background: "#F5F6F8",
                      fontWeight: 500,
                      paddingLeft: {
                        lg: 10,
                        md: 7,
                        xs: 4,
                      },
                      pr: 2,
                      color: "#67737F",
                    }}
                  >
                    <Typography
                      variant="body1"
                      component={"p"}
                      sx={{
                        fontSize: {
                          md: 14,
                          xs: 12,
                        },
                        fontWeight: 600,
                      }}
                    >
                      DE NFE (MJ/kg)
                    </Typography>
                  </TableCell>

                  {Array.from({ length: 7 }, (_, i) => i).map((i) => {
                    return (
                      <TableCell
                        key={i}
                        sx={{
                          borderBottomColor: "#F5F6F8",
                          borderBottomWidth: 2,
                          color: "#555555",
                          fontWeight: 500,
                          px: 2,
                        }}
                      >
                        <Typography
                          variant="body1"
                          component={"p"}
                          contentEditable
                          suppressContentEditableWarning
                          sx={{
                            fontSize: {
                              md: 14,
                              xs: 12,
                            },
                          }}
                        // onBlur={(e) =>
                        //   setValue(
                        //     field.name,
                        //     Number(e.target.textContent) ||
                        //     Number(field.value)
                        //   )
                        // }
                        >
                          {filteredStores ? filteredStores[i]?.deNFE : ""}
                        </Typography>
                      </TableCell>
                    );
                  })}
                </TableRow>
                <TableRow
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell
                    sx={{
                      borderBottomColor: "#F5F6F8",
                      borderBottomWidth: 2,
                      background: "#F5F6F8",
                      fontWeight: 500,
                      paddingLeft: {
                        lg: 10,
                        md: 7,
                        xs: 4,
                      },
                      pr: 2,
                      color: "#67737F",
                    }}
                  >
                    <Typography
                      variant="body1"
                      component={"p"}
                      sx={{
                        fontSize: {
                          md: 14,
                          xs: 12,
                        },
                        fontWeight: 600,
                      }}
                    >
                      DE (MJ/kg)
                    </Typography>
                  </TableCell>

                  {Array.from({ length: 7 }, (_, i) => i).map((i) => {
                    return (
                      <TableCell
                        key={i}
                        sx={{
                          borderBottomColor: "#F5F6F8",
                          borderBottomWidth: 2,
                          color: "#555555",
                          fontWeight: 500,
                          px: 2,
                        }}
                      >
                        <Typography
                          variant="body1"
                          component={"p"}
                          contentEditable
                          suppressContentEditableWarning
                          sx={{
                            fontSize: {
                              md: 14,
                              xs: 12,
                            },
                          }}
                        // onBlur={(e) =>
                        //   setValue(
                        //     field.name,
                        //     Number(e.target.textContent) ||
                        //     Number(field.value)
                        //   )
                        // }
                        >
                          {filteredStores ? filteredStores[i]?.de : ""}
                        </Typography>
                      </TableCell>
                    );
                  })}
                </TableRow>
              </TableBody>
            </Table>
          </form>
        </TableContainer>
      </Paper>
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
