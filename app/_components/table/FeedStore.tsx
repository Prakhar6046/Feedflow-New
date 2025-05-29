"use client";
import { feedStoreTableHead } from "@/app/_lib/utils/tableHeadData";
import { FeedProduct } from "@/app/_typeModels/Feed";
import { selectRole } from "@/lib/features/user/userSlice";
import { useAppSelector } from "@/lib/hooks";
import { Button, Divider, TableSortLabel, Typography } from "@mui/material";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
type Iprops = {
  data: FeedProduct[];
};

export default function FeedStoreTable({ data }: Iprops) {
  const role = useAppSelector(selectRole);
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("organisation");
  const [isApiCallInProgress, setIsApiCallInProgress] = React.useState(false);
  const [filteredStores, setFilteredStores] = React.useState<FeedProduct[]>();
  const { control, handleSubmit, setValue } = useForm<{
    feedProducts: FeedProduct[];
  }>({
    defaultValues: {
      feedProducts: [], // initialize with empty or populated via useEffect
    },
  });
  function EnhancedTableHead(data: any) {
    const { order, orderBy, onRequestSort } = data;
    const createSortHandler =
      (property: string) => (event: React.MouseEvent<HTMLButtonElement>) => {
        onRequestSort(event, property);
      };

    return (
      <TableHead>
        <TableRow>
          {(role !== "MEMBER" ? feedStoreTableHead : feedStoreTableHead).map(
            (headCell, idx, headCells) => (
              <TableCell
                key={headCell.id}
                sortDirection={
                  idx === headCells.length - 1
                    ? false
                    : orderBy === headCell.id
                    ? order
                    : false
                }
                sx={{
                  borderBottom: 0,
                  color: "#67737F",
                  background: "#F5F6F8",
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
                {idx === headCells.length - 1 ? (
                  headCell.label
                ) : (
                  <TableSortLabel
                    active={orderBy === headCell.id}
                    direction={orderBy === headCell.id ? order : "asc"}
                    onClick={createSortHandler(headCell.id)}
                  >
                    {headCell.label}
                  </TableSortLabel>
                )}
              </TableCell>
            )
          )}
        </TableRow>
      </TableHead>
    );
  }
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
                        px: 2,
                        whiteSpace: "nowrap",
                      }}
                    >
                      Specialised Aquatic Feeds
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
                        px: 2,
                        whiteSpace: "nowrap",
                      }}
                    >
                      SAF 6000
                    </Typography>
                  </TableCell>

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
                        px: 2,
                        whiteSpace: "nowrap",
                      }}
                    >
                      Specialised Aquatic Feeds
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
                        px: 2,
                        whiteSpace: "nowrap",
                      }}
                    >
                      SAF 6000
                    </Typography>
                  </TableCell>

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
                        px: 2,
                        whiteSpace: "nowrap",
                      }}
                    >
                      Specialised Aquatic Feeds
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
                        px: 2,
                        whiteSpace: "nowrap",
                      }}
                    >
                      SAF 6000
                    </Typography>
                  </TableCell>

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
                        px: 2,
                        whiteSpace: "nowrap",
                      }}
                    >
                      Specialised Aquatic Feeds
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
                        px: 2,
                        whiteSpace: "nowrap",
                      }}
                    >
                      SAF 6000
                    </Typography>
                  </TableCell>

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
                        px: 2,
                        whiteSpace: "nowrap",
                      }}
                    >
                      Specialised Aquatic Feeds
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
                        px: 2,
                        whiteSpace: "nowrap",
                      }}
                    >
                      SAF 6000
                    </Typography>
                  </TableCell>

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
                        px: 2,
                        whiteSpace: "nowrap",
                      }}
                    >
                      Specialised Aquatic Feeds
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
                        px: 2,
                        whiteSpace: "nowrap",
                      }}
                    >
                      SAF 6000
                    </Typography>
                  </TableCell>

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
                        px: 2,
                        whiteSpace: "nowrap",
                      }}
                    >
                      Specialised Aquatic Feeds
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
                        px: 2,
                        whiteSpace: "nowrap",
                      }}
                    >
                      SAF 6000
                    </Typography>
                  </TableCell>

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
                        px: 2,
                        whiteSpace: "nowrap",
                      }}
                    >
                      Specialised Aquatic Feeds
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
                        px: 2,
                        whiteSpace: "nowrap",
                      }}
                    >
                      SAF 6000
                    </Typography>
                  </TableCell>

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
                        px: 2,
                        whiteSpace: "nowrap",
                      }}
                    >
                      Specialised Aquatic Feeds
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
                        px: 2,
                        whiteSpace: "nowrap",
                      }}
                    >
                      SAF 6000
                    </Typography>
                  </TableCell>
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
              </TableBody>
            </Table>
          </form>
        </TableContainer>
      </Paper>

      <Paper
        sx={{
          width: "100%",
          overflow: "hidden",
          borderRadius: "14px",
          boxShadow: "0px 0px 16px 5px #0000001A",
          mt: 4,
        }}
      >
        <TableContainer
          sx={{
            maxHeight: "72.5vh",
          }}
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <button type="submit" disabled={filteredStores?.length === 0}>
              Save
            </button>
            <Table stickyHeader aria-label="sticky table">
              <EnhancedTableHead order={order} orderBy={orderBy} />
              <TableBody>
                {filteredStores && filteredStores?.length > 0 ? (
                  filteredStores?.map((data, idx) => (
                    <TableRow
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                      key={idx}
                    >
                      <TableCell
                        sx={{
                          borderBottomColor: "#F5F6F8",
                          borderBottomWidth: 2,
                          color: "#555555",
                          maxWidth: 250,
                          fontWeight: 500,
                          wordBreak: "break-all",
                          paddingLeft: {
                            lg: 10,
                            md: 7,
                            xs: 4,
                          },
                        }}
                        component="th"
                        scope="row"
                      >
                        <Controller
                          name={`feedProducts.${idx}.productName`}
                          control={control}
                          render={({ field }) => (
                            <Typography
                              variant="body1"
                              component={"p"}
                              contentEditable
                              suppressContentEditableWarning
                              onBlur={(e) =>
                                setValue(
                                  field.name,
                                  e.target.textContent || field.value
                                )
                              }
                            >
                              {field.value}
                            </Typography>
                          )}
                        />
                      </TableCell>
                      <TableCell
                        sx={{
                          borderBottomColor: "#F5F6F8",
                          borderBottomWidth: 2,
                          color: "#555555",
                          fontWeight: 500,
                          pl: 0,
                        }}
                      >
                        <Controller
                          name={`feedProducts.${idx}.productFormat`}
                          control={control}
                          render={({ field }) => (
                            <Typography
                              variant="body1"
                              component={"p"}
                              contentEditable
                              suppressContentEditableWarning
                              onBlur={(e) =>
                                setValue(
                                  field.name,
                                  e.target.textContent || field.value
                                )
                              }
                            >
                              {field.value}
                            </Typography>
                          )}
                        />
                        {/* {data.productFormat ?? ""} */}
                      </TableCell>
                      <TableCell
                        sx={{
                          borderBottomColor: "#F5F6F8",
                          borderBottomWidth: 2,
                          color: "#555555",
                          fontWeight: 500,
                          pl: 0,
                        }}
                      >
                        {/* {data.particleSize ?? ""} */}
                        <Controller
                          name={`feedProducts.${idx}.particleSize`}
                          control={control}
                          render={({ field }) => (
                            <Typography
                              variant="body1"
                              component={"p"}
                              contentEditable
                              suppressContentEditableWarning
                              onBlur={(e) =>
                                setValue(
                                  field.name,
                                  e.target.textContent || field.value
                                )
                              }
                            >
                              {field.value}
                            </Typography>
                          )}
                        />
                      </TableCell>
                      <TableCell
                        sx={{
                          borderBottomColor: "#F5F6F8",
                          borderBottomWidth: 2,
                          color: "#555555",
                          fontWeight: 500,
                          pl: 0,
                        }}
                      >
                        {/* {data.fishSizeG ?? ""} */}
                        <Controller
                          name={`feedProducts.${idx}.fishSizeG`}
                          control={control}
                          render={({ field }) => (
                            <Typography
                              variant="body1"
                              component={"p"}
                              contentEditable
                              suppressContentEditableWarning
                              onBlur={(e) =>
                                setValue(
                                  field.name,
                                  Number(e.target.textContent) ||
                                    Number(field.value)
                                )
                              }
                            >
                              {field.value}
                            </Typography>
                          )}
                        />
                      </TableCell>
                      <TableCell
                        sx={{
                          borderBottomColor: "#F5F6F8",
                          borderBottomWidth: 2,
                          color: "#555555",
                          fontWeight: 500,
                          pl: 0,
                        }}
                      >
                        {/* {data.nutritionalPurpose ?? ""} */}
                        <Controller
                          name={`feedProducts.${idx}.nutritionalPurpose`}
                          control={control}
                          render={({ field }) => (
                            <Typography
                              variant="body1"
                              component={"p"}
                              contentEditable
                              suppressContentEditableWarning
                              onBlur={(e) =>
                                setValue(
                                  field.name,
                                  e.target.textContent || field.value
                                )
                              }
                            >
                              {field.value}
                            </Typography>
                          )}
                        />
                      </TableCell>
                      <TableCell
                        sx={{
                          borderBottomColor: "#F5F6F8",
                          borderBottomWidth: 2,
                          color: "#555555",
                          fontWeight: 500,
                          pl: 0,
                        }}
                      >
                        {/* {data.suitableSpecies ?? ""} */}
                        <Controller
                          name={`feedProducts.${idx}.suitableSpecies`}
                          control={control}
                          render={({ field }) => (
                            <Typography
                              variant="body1"
                              component={"p"}
                              contentEditable
                              suppressContentEditableWarning
                              onBlur={(e) =>
                                setValue(
                                  field.name,
                                  e.target.textContent || field.value
                                )
                              }
                            >
                              {field.value}
                            </Typography>
                          )}
                        />
                      </TableCell>
                      <TableCell
                        sx={{
                          borderBottomColor: "#F5F6F8",
                          borderBottomWidth: 2,
                          color: "#555555",
                          fontWeight: 500,
                          pl: 0,
                        }}
                      >
                        {/* {data.suitabilityAnimalSize ?? ""} */}
                        <Controller
                          name={`feedProducts.${idx}.suitabilityAnimalSize`}
                          control={control}
                          render={({ field }) => (
                            <Typography
                              variant="body1"
                              component={"p"}
                              contentEditable
                              suppressContentEditableWarning
                              onBlur={(e) =>
                                setValue(
                                  field.name,
                                  e.target.textContent || field.value
                                )
                              }
                            >
                              {field.value}
                            </Typography>
                          )}
                        />
                      </TableCell>
                      <TableCell
                        sx={{
                          borderBottomColor: "#F5F6F8",
                          borderBottomWidth: 2,
                          color: "#555555",
                          fontWeight: 500,
                          pl: 0,
                        }}
                      >
                        {/* {data.productionIntensity ?? ""} */}
                        <Controller
                          name={`feedProducts.${idx}.productionIntensity`}
                          control={control}
                          render={({ field }) => (
                            <Typography
                              variant="body1"
                              component={"p"}
                              contentEditable
                              suppressContentEditableWarning
                              onBlur={(e) =>
                                setValue(
                                  field.name,
                                  e.target.textContent || field.value
                                )
                              }
                            >
                              {field.value}
                            </Typography>
                          )}
                        />
                      </TableCell>
                      <TableCell
                        sx={{
                          borderBottomColor: "#F5F6F8",
                          borderBottomWidth: 2,
                          color: "#555555",
                          fontWeight: 500,
                          pl: 0,
                        }}
                      >
                        {/* {data.suitabilityUnit ?? ""} */}
                        <Controller
                          name={`feedProducts.${idx}.suitabilityUnit`}
                          control={control}
                          render={({ field }) => (
                            <Typography
                              variant="body1"
                              component={"p"}
                              contentEditable
                              suppressContentEditableWarning
                              onBlur={(e) =>
                                setValue(
                                  field.name,
                                  e.target.textContent || field.value
                                )
                              }
                            >
                              {field.value}
                            </Typography>
                          )}
                        />
                      </TableCell>
                      <TableCell
                        sx={{
                          borderBottomColor: "#F5F6F8",
                          borderBottomWidth: 2,
                          color: "#555555",
                          fontWeight: 500,
                          pl: 0,
                        }}
                      >
                        {/* {data.feedingPhase ?? ""} */}
                        <Controller
                          name={`feedProducts.${idx}.feedingPhase`}
                          control={control}
                          render={({ field }) => (
                            <Typography
                              variant="body1"
                              component={"p"}
                              contentEditable
                              suppressContentEditableWarning
                              onBlur={(e) =>
                                setValue(
                                  field.name,
                                  e.target.textContent || field.value
                                )
                              }
                            >
                              {field.value}
                            </Typography>
                          )}
                        />
                      </TableCell>
                      <TableCell
                        sx={{
                          borderBottomColor: "#F5F6F8",
                          borderBottomWidth: 2,
                          color: "#555555",
                          fontWeight: 500,
                          pl: 0,
                        }}
                      >
                        {/* {data.lifeStage ?? ""} */}
                        <Controller
                          name={`feedProducts.${idx}.lifeStage`}
                          control={control}
                          render={({ field }) => (
                            <Typography
                              variant="body1"
                              component={"p"}
                              contentEditable
                              suppressContentEditableWarning
                              onBlur={(e) =>
                                setValue(
                                  field.name,
                                  e.target.textContent || field.value
                                )
                              }
                            >
                              {field.value}
                            </Typography>
                          )}
                        />
                      </TableCell>
                      <TableCell
                        sx={{
                          borderBottomColor: "#F5F6F8",
                          borderBottomWidth: 2,
                          color: "#555555",
                          fontWeight: 500,
                          pl: 0,
                        }}
                      >
                        {/* {data.shelfLifeMonths ?? ""} */}
                        <Controller
                          name={`feedProducts.${idx}.shelfLifeMonths`}
                          control={control}
                          render={({ field }) => (
                            <Typography
                              variant="body1"
                              component={"p"}
                              contentEditable
                              suppressContentEditableWarning
                              onBlur={(e) =>
                                setValue(
                                  field.name,
                                  Number(e.target.textContent) ||
                                    Number(field.value)
                                )
                              }
                            >
                              {field.value}
                            </Typography>
                          )}
                        />
                      </TableCell>
                      <TableCell
                        sx={{
                          borderBottomColor: "#F5F6F8",
                          borderBottomWidth: 2,
                          color: "#555555",
                          fontWeight: 500,
                          pl: 0,
                        }}
                      >
                        {/* {data.feedCost ?? ""} */}
                        <Controller
                          name={`feedProducts.${idx}.feedCost`}
                          control={control}
                          render={({ field }) => (
                            <Typography
                              variant="body1"
                              component={"p"}
                              contentEditable
                              suppressContentEditableWarning
                              onBlur={(e) =>
                                setValue(
                                  field.name,
                                  Number(e.target.textContent) ||
                                    Number(field.value)
                                )
                              }
                            >
                              {field.value}
                            </Typography>
                          )}
                        />
                      </TableCell>
                      <TableCell
                        sx={{
                          borderBottomColor: "#F5F6F8",
                          borderBottomWidth: 2,
                          color: "#555555",
                          fontWeight: 500,
                          pl: 0,
                        }}
                      >
                        {/* {data.feedIngredients ?? ""} */}
                        <Controller
                          name={`feedProducts.${idx}.feedIngredients`}
                          control={control}
                          render={({ field }) => (
                            <Typography
                              variant="body1"
                              component={"p"}
                              contentEditable
                              suppressContentEditableWarning
                              onBlur={(e) =>
                                setValue(
                                  field.name,
                                  e.target.textContent || field.value
                                )
                              }
                            >
                              {field.value}
                            </Typography>
                          )}
                        />
                      </TableCell>
                      <TableCell
                        sx={{
                          borderBottomColor: "#F5F6F8",
                          borderBottomWidth: 2,
                          color: "#555555",
                          fontWeight: 500,
                          pl: 0,
                        }}
                      >
                        {/* {data.moistureGPerKg ?? ""} */}
                        <Controller
                          name={`feedProducts.${idx}.moistureGPerKg`}
                          control={control}
                          render={({ field }) => (
                            <Typography
                              variant="body1"
                              component={"p"}
                              contentEditable
                              suppressContentEditableWarning
                              onBlur={(e) =>
                                setValue(
                                  field.name,
                                  Number(e.target.textContent) ||
                                    Number(field.value)
                                )
                              }
                            >
                              {field.value}
                            </Typography>
                          )}
                        />
                      </TableCell>
                      <TableCell
                        sx={{
                          borderBottomColor: "#F5F6F8",
                          borderBottomWidth: 2,
                          color: "#555555",
                          fontWeight: 500,
                          pl: 0,
                        }}
                      >
                        {/* {data.crudeProteinGPerKg ?? ""} */}
                        <Controller
                          name={`feedProducts.${idx}.crudeProteinGPerKg`}
                          control={control}
                          render={({ field }) => (
                            <Typography
                              variant="body1"
                              component={"p"}
                              contentEditable
                              suppressContentEditableWarning
                              onBlur={(e) =>
                                setValue(
                                  field.name,
                                  Number(e.target.textContent) ||
                                    Number(field.value)
                                )
                              }
                            >
                              {field.value}
                            </Typography>
                          )}
                        />
                      </TableCell>
                      <TableCell
                        sx={{
                          borderBottomColor: "#F5F6F8",
                          borderBottomWidth: 2,
                          color: "#555555",
                          fontWeight: 500,
                          pl: 0,
                        }}
                      >
                        {/* {data.crudeFatGPerKg ?? ""} */}
                        <Controller
                          name={`feedProducts.${idx}.crudeFatGPerKg`}
                          control={control}
                          render={({ field }) => (
                            <Typography
                              variant="body1"
                              component={"p"}
                              contentEditable
                              suppressContentEditableWarning
                              onBlur={(e) =>
                                setValue(
                                  field.name,
                                  Number(e.target.textContent) ||
                                    Number(field.value)
                                )
                              }
                            >
                              {field.value}
                            </Typography>
                          )}
                        />
                      </TableCell>
                      <TableCell
                        sx={{
                          borderBottomColor: "#F5F6F8",
                          borderBottomWidth: 2,
                          color: "#555555",
                          fontWeight: 500,
                          pl: 0,
                        }}
                      >
                        {/* {data.crudeFiberGPerKg ?? ""} */}
                        <Controller
                          name={`feedProducts.${idx}.crudeFiberGPerKg`}
                          control={control}
                          render={({ field }) => (
                            <Typography
                              variant="body1"
                              component={"p"}
                              contentEditable
                              suppressContentEditableWarning
                              onBlur={(e) =>
                                setValue(
                                  field.name,
                                  Number(e.target.textContent) ||
                                    Number(field.value)
                                )
                              }
                            >
                              {field.value}
                            </Typography>
                          )}
                        />
                      </TableCell>
                      <TableCell
                        sx={{
                          borderBottomColor: "#F5F6F8",
                          borderBottomWidth: 2,
                          color: "#555555",
                          fontWeight: 500,
                          pl: 0,
                        }}
                      >
                        {/* {data.crudeAshGPerKg ?? ""} */}
                        <Controller
                          name={`feedProducts.${idx}.crudeAshGPerKg`}
                          control={control}
                          render={({ field }) => (
                            <Typography
                              variant="body1"
                              component={"p"}
                              contentEditable
                              suppressContentEditableWarning
                              onBlur={(e) =>
                                setValue(
                                  field.name,
                                  Number(e.target.textContent) ||
                                    Number(field.value)
                                )
                              }
                            >
                              {field.value}
                            </Typography>
                          )}
                        />
                      </TableCell>
                      <TableCell
                        sx={{
                          borderBottomColor: "#F5F6F8",
                          borderBottomWidth: 2,
                          color: "#555555",
                          fontWeight: 500,
                          pl: 0,
                        }}
                      >
                        {/* {data.nfe ?? ""} */}
                        <Controller
                          name={`feedProducts.${idx}.nfe`}
                          control={control}
                          render={({ field }) => (
                            <Typography
                              variant="body1"
                              component={"p"}
                              contentEditable
                              suppressContentEditableWarning
                              onBlur={(e) =>
                                setValue(
                                  field.name,
                                  Number(e.target.textContent) ||
                                    Number(field.value)
                                )
                              }
                            >
                              {field.value}
                            </Typography>
                          )}
                        />
                      </TableCell>
                      <TableCell
                        sx={{
                          borderBottomColor: "#F5F6F8",
                          borderBottomWidth: 2,
                          color: "#555555",
                          fontWeight: 500,
                          pl: 0,
                        }}
                      >
                        {/* {data.calciumGPerKg ?? ""} */}
                        <Controller
                          name={`feedProducts.${idx}.calciumGPerKg`}
                          control={control}
                          render={({ field }) => (
                            <Typography
                              variant="body1"
                              component={"p"}
                              contentEditable
                              suppressContentEditableWarning
                              onBlur={(e) =>
                                setValue(
                                  field.name,
                                  Number(e.target.textContent) ||
                                    Number(field.value)
                                )
                              }
                            >
                              {field.value}
                            </Typography>
                          )}
                        />
                      </TableCell>
                      <TableCell
                        sx={{
                          borderBottomColor: "#F5F6F8",
                          borderBottomWidth: 2,
                          color: "#555555",
                          fontWeight: 500,
                          pl: 0,
                        }}
                      >
                        {data.phosphorusGPerKg ?? ""}
                        <Controller
                          name={`feedProducts.${idx}.phosphorusGPerKg`}
                          control={control}
                          render={({ field }) => (
                            <Typography
                              variant="body1"
                              component={"p"}
                              contentEditable
                              suppressContentEditableWarning
                              onBlur={(e) =>
                                setValue(
                                  field.name,
                                  Number(e.target.textContent) ||
                                    Number(field.value)
                                )
                              }
                            >
                              {field.value}
                            </Typography>
                          )}
                        />
                      </TableCell>
                      <TableCell
                        sx={{
                          borderBottomColor: "#F5F6F8",
                          borderBottomWidth: 2,
                          color: "#555555",
                          fontWeight: 500,
                          pl: 0,
                        }}
                      >
                        {/* {data.carbohydratesGPerKg ?? ""} */}
                        <Controller
                          name={`feedProducts.${idx}.carbohydratesGPerKg`}
                          control={control}
                          render={({ field }) => (
                            <Typography
                              variant="body1"
                              component={"p"}
                              contentEditable
                              suppressContentEditableWarning
                              onBlur={(e) =>
                                setValue(
                                  field.name,
                                  Number(e.target.textContent) ||
                                    Number(field.value)
                                )
                              }
                            >
                              {field.value}
                            </Typography>
                          )}
                        />
                      </TableCell>
                      <TableCell
                        sx={{
                          borderBottomColor: "#F5F6F8",
                          borderBottomWidth: 2,
                          color: "#555555",
                          fontWeight: 500,
                          pl: 0,
                        }}
                      >
                        {/* {data.metabolizableEnergy ?? ""} */}
                        <Controller
                          name={`feedProducts.${idx}.metabolizableEnergy`}
                          control={control}
                          render={({ field }) => (
                            <Typography
                              variant="body1"
                              component={"p"}
                              contentEditable
                              suppressContentEditableWarning
                              onBlur={(e) =>
                                setValue(
                                  field.name,
                                  Number(e.target.textContent) ||
                                    Number(field.value)
                                )
                              }
                            >
                              {field.value}
                            </Typography>
                          )}
                        />
                      </TableCell>
                      <TableCell
                        sx={{
                          borderBottomColor: "#F5F6F8",
                          borderBottomWidth: 2,
                          color: "#555555",
                          fontWeight: 500,
                          pl: 0,
                        }}
                      >
                        {/* {data.feedingGuide ?? ""} */}
                        <Controller
                          name={`feedProducts.${idx}.feedingGuide`}
                          control={control}
                          render={({ field }) => (
                            <Typography
                              variant="body1"
                              component={"p"}
                              contentEditable
                              suppressContentEditableWarning
                              onBlur={(e) =>
                                setValue(
                                  field.name,
                                  e.target.textContent || field.value
                                )
                              }
                            >
                              {field.value}
                            </Typography>
                          )}
                        />
                      </TableCell>
                      <TableCell
                        sx={{
                          borderBottomColor: "#F5F6F8",
                          borderBottomWidth: 2,
                          color: "#555555",
                          fontWeight: 500,
                          pl: 0,
                        }}
                      >
                        {/* {data.geCoeffCP ?? ""} */}
                        <Controller
                          name={`feedProducts.${idx}.geCoeffCP`}
                          control={control}
                          render={({ field }) => (
                            <Typography
                              variant="body1"
                              component={"p"}
                              contentEditable
                              suppressContentEditableWarning
                              onBlur={(e) =>
                                setValue(
                                  field.name,
                                  Number(e.target.textContent) ||
                                    Number(field.value)
                                )
                              }
                            >
                              {field.value}
                            </Typography>
                          )}
                        />
                      </TableCell>
                      <TableCell
                        sx={{
                          borderBottomColor: "#F5F6F8",
                          borderBottomWidth: 2,
                          color: "#555555",
                          fontWeight: 500,
                          pl: 0,
                        }}
                      >
                        {/* {data.geCoeffCF ?? ""} */}
                        <Controller
                          name={`feedProducts.${idx}.geCoeffCF`}
                          control={control}
                          render={({ field }) => (
                            <Typography
                              variant="body1"
                              component={"p"}
                              contentEditable
                              suppressContentEditableWarning
                              onBlur={(e) =>
                                setValue(
                                  field.name,
                                  Number(e.target.textContent) ||
                                    Number(field.value)
                                )
                              }
                            >
                              {field.value}
                            </Typography>
                          )}
                        />
                      </TableCell>
                      <TableCell
                        sx={{
                          borderBottomColor: "#F5F6F8",
                          borderBottomWidth: 2,
                          color: "#555555",
                          fontWeight: 500,
                          pl: 0,
                        }}
                      >
                        {/* {data.geCoeffNFE ?? ""} */}
                        <Controller
                          name={`feedProducts.${idx}.geCoeffNFE`}
                          control={control}
                          render={({ field }) => (
                            <Typography
                              variant="body1"
                              component={"p"}
                              contentEditable
                              suppressContentEditableWarning
                              onBlur={(e) =>
                                setValue(
                                  field.name,
                                  Number(e.target.textContent) ||
                                    Number(field.value)
                                )
                              }
                            >
                              {field.value}
                            </Typography>
                          )}
                        />
                      </TableCell>
                      <TableCell
                        sx={{
                          borderBottomColor: "#F5F6F8",
                          borderBottomWidth: 2,
                          color: "#555555",
                          fontWeight: 500,
                          pl: 0,
                        }}
                      >
                        {/* {data.ge ?? ""} */}
                        <Controller
                          name={`feedProducts.${idx}.ge`}
                          control={control}
                          render={({ field }) => (
                            <Typography
                              variant="body1"
                              component={"p"}
                              contentEditable
                              suppressContentEditableWarning
                              onBlur={(e) =>
                                setValue(
                                  field.name,
                                  Number(e.target.textContent) ||
                                    Number(field.value)
                                )
                              }
                            >
                              {field.value}
                            </Typography>
                          )}
                        />
                      </TableCell>
                      <TableCell
                        sx={{
                          borderBottomColor: "#F5F6F8",
                          borderBottomWidth: 2,
                          color: "#555555",
                          fontWeight: 500,
                          pl: 0,
                        }}
                      >
                        {/* {data.digCP ?? ""} */}
                        <Controller
                          name={`feedProducts.${idx}.digCP`}
                          control={control}
                          render={({ field }) => (
                            <Typography
                              variant="body1"
                              component={"p"}
                              contentEditable
                              suppressContentEditableWarning
                              onBlur={(e) =>
                                setValue(
                                  field.name,
                                  Number(e.target.textContent) ||
                                    Number(field.value)
                                )
                              }
                            >
                              {field.value}
                            </Typography>
                          )}
                        />
                      </TableCell>
                      <TableCell
                        sx={{
                          borderBottomColor: "#F5F6F8",
                          borderBottomWidth: 2,
                          color: "#555555",
                          fontWeight: 500,
                          pl: 0,
                        }}
                      >
                        {/* {data.digCF ?? ""} */}
                        <Controller
                          name={`feedProducts.${idx}.digCF`}
                          control={control}
                          render={({ field }) => (
                            <Typography
                              variant="body1"
                              component={"p"}
                              contentEditable
                              suppressContentEditableWarning
                              onBlur={(e) =>
                                setValue(
                                  field.name,
                                  Number(e.target.textContent) ||
                                    Number(field.value)
                                )
                              }
                            >
                              {field.value}
                            </Typography>
                          )}
                        />
                      </TableCell>
                      <TableCell
                        sx={{
                          borderBottomColor: "#F5F6F8",
                          borderBottomWidth: 2,
                          color: "#555555",
                          fontWeight: 500,
                          pl: 0,
                        }}
                      >
                        {/* {data.digNFE ?? ""} */}
                        <Controller
                          name={`feedProducts.${idx}.digNFE`}
                          control={control}
                          render={({ field }) => (
                            <Typography
                              variant="body1"
                              component={"p"}
                              contentEditable
                              suppressContentEditableWarning
                              onBlur={(e) =>
                                setValue(
                                  field.name,
                                  Number(e.target.textContent) ||
                                    Number(field.value)
                                )
                              }
                            >
                              {field.value}
                            </Typography>
                          )}
                        />
                      </TableCell>
                      <TableCell
                        sx={{
                          borderBottomColor: "#F5F6F8",
                          borderBottomWidth: 2,
                          color: "#555555",
                          fontWeight: 500,
                          pl: 0,
                        }}
                      >
                        {/* {data.deCP ?? ""} */}
                        <Controller
                          name={`feedProducts.${idx}.deCP`}
                          control={control}
                          render={({ field }) => (
                            <Typography
                              variant="body1"
                              component={"p"}
                              contentEditable
                              suppressContentEditableWarning
                              onBlur={(e) =>
                                setValue(
                                  field.name,
                                  Number(e.target.textContent) ||
                                    Number(field.value)
                                )
                              }
                            >
                              {field.value}
                            </Typography>
                          )}
                        />
                      </TableCell>
                      <TableCell
                        sx={{
                          borderBottomColor: "#F5F6F8",
                          borderBottomWidth: 2,
                          color: "#555555",
                          fontWeight: 500,
                          pl: 0,
                        }}
                      >
                        {/* {data.deCF ?? ""} */}
                        <Controller
                          name={`feedProducts.${idx}.deCF`}
                          control={control}
                          render={({ field }) => (
                            <Typography
                              variant="body1"
                              component={"p"}
                              contentEditable
                              suppressContentEditableWarning
                              onBlur={(e) =>
                                setValue(
                                  field.name,
                                  Number(e.target.textContent) ||
                                    Number(field.value)
                                )
                              }
                            >
                              {field.value}
                            </Typography>
                          )}
                        />
                      </TableCell>
                      <TableCell
                        sx={{
                          borderBottomColor: "#F5F6F8",
                          borderBottomWidth: 2,
                          color: "#555555",
                          fontWeight: 500,
                          pl: 0,
                        }}
                      >
                        {/* {data.deNFE ?? ""} */}
                        <Controller
                          name={`feedProducts.${idx}.deNFE`}
                          control={control}
                          render={({ field }) => (
                            <Typography
                              variant="body1"
                              component={"p"}
                              contentEditable
                              suppressContentEditableWarning
                              onBlur={(e) =>
                                setValue(
                                  field.name,
                                  Number(e.target.textContent) ||
                                    Number(field.value)
                                )
                              }
                            >
                              {field.value}
                            </Typography>
                          )}
                        />
                      </TableCell>
                      <TableCell
                        sx={{
                          borderBottomColor: "#F5F6F8",
                          borderBottomWidth: 2,
                          color: "#555555",
                          fontWeight: 500,
                          pl: 0,
                        }}
                      >
                        {data.de ?? ""}
                        <Controller
                          name={`feedProducts.${idx}.de`}
                          control={control}
                          render={({ field }) => (
                            <Typography
                              variant="body1"
                              component={"p"}
                              contentEditable
                              suppressContentEditableWarning
                              onBlur={(e) =>
                                setValue(
                                  field.name,
                                  Number(e.target.textContent) ||
                                    Number(field.value)
                                )
                              }
                            >
                              {field.value}
                            </Typography>
                          )}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow
                    key={"no table"}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    No Data Found
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </form>
        </TableContainer>
      </Paper>
    </>
  );
}
