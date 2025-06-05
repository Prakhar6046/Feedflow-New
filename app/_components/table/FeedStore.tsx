"use client";
import { FeedProduct } from "@/app/_typeModels/Feed";
import { selectRole } from "@/lib/features/user/userSlice";
import { useAppSelector } from "@/lib/hooks";
import { Button, Divider, Typography } from "@mui/material";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
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
                          {filteredStores
                            ? filteredStores[i]?.ProductSupplier
                            : ""}
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
