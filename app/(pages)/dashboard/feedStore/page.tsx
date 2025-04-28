import { commonFilterAction } from "@/lib/features/commonFilters/commonFilters";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
  Radio,
  RadioGroup,
  Select,
  Stack,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { NextPage } from "next";
import { MultiSelect } from "primereact/multiselect";
import React from "react";

interface Props { }

const Page: NextPage<Props> = ({ }) => {
  return (
    // <div>Feed Store Coming Soon...</div>

    <>
      {/* Feed Profile Start */}
      <Stack>
        <Typography
          variant="h6"
          fontWeight={700}
          sx={{
            fontSize: {
              md: 24,
              xs: 20,
            },
            marginBottom: 2,
          }}
        >
          Feed Profile
        </Typography>


        <Paper sx={{
          width: "100%",
          overflow: "hidden",
          borderRadius: "14px",
          boxShadow: "0px 0px 16px 5px #0000001A",
        }}>
          <TableContainer
            component={Paper}
          >
            <Table>
              <TableHead>
                <TableRow>

                  <TableCell sx={{
                    borderBottom: 0,
                    color: "#67737F",
                    background: "#F5F6F8",
                    textAlign: "center",
                    pr: "4px"
                    , fontSize: {
                      md: 16,
                      xs: 14,
                    },
                    fontWeight: 600,
                    verticalAlign: "baseline",
                  }}>
                    Fish Size <br />
                    (g)
                  </TableCell>


                  <TableCell sx={{
                    borderBottom: 0,
                    color: "#67737F",
                    background: "#F5F6F8",
                    textAlign: "center",
                    pr: "4px"
                  }}>

                    <Typography
                      variant="body1"
                      sx={{
                        fontSize: {
                          md: 16,
                          xs: 14,
                        },
                        fontWeight: 600,
                        background: "#06a19b",
                        color: "#fff",
                        p: 1,
                        borderRadius: "8px",
                        whiteSpace: 'nowrap'

                      }}
                    >
                      Feed Supplier 1
                    </Typography>
                    <Box>
                      <List sx={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-around",
                        alignItems: "center",
                        gap: 2
                      }}>
                        <ListItem disablePadding sx={{
                          width: "fit-content"
                        }}>
                          <Typography
                            variant="body2"
                            fontWeight={500}
                            textAlign={"center"}
                            minWidth={100}
                          >
                            Tilapia PreStarter #2 <br />
                            (1&gt;5)
                          </Typography>
                        </ListItem>

                        <ListItem disablePadding sx={{
                          width: "fit-content"
                        }}>
                          <Typography
                            variant="body2"
                            fontWeight={500}
                            textAlign={"center"}
                            minWidth={100}

                          >
                            Tilapia PreStarter #3 <br />
                            (5-20)
                          </Typography>
                        </ListItem>

                        <ListItem disablePadding sx={{
                          width: "fit-content"
                        }}>
                          <Typography
                            variant="body2"
                            fontWeight={500}
                            textAlign={"center"}
                            minWidth={100}

                          >
                            Tilapia Grower 2mm<br />
                            (25-40)
                          </Typography>
                        </ListItem>


                      </List>
                    </Box>
                  </TableCell>

                  <TableCell sx={{
                    borderBottom: 0,
                    color: "#67737F",
                    background: "#F5F6F8",
                    fontSize: {
                      md: 16,
                      xs: 14,
                    },
                    fontWeight: 600,
                    textAlign: "center",
                    pr: "4px"
                  }}>
                    <Typography
                      variant="body1"
                      sx={{
                        fontSize: {
                          md: 16,
                          xs: 14,
                        },
                        fontWeight: 600,
                        background: "#06a19b",
                        color: "#fff",
                        p: 1,
                        borderRadius: "8px",
                        whiteSpace: 'nowrap'

                      }}
                    >
                      Feed Supplier 2
                    </Typography>
                    <Box>
                      <List sx={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-around",
                        alignItems: "center",
                        gap: 2
                      }}>
                        <ListItem disablePadding sx={{
                          width: "fit-content"
                        }}>
                          <Typography
                            variant="body2"
                            fontWeight={500}
                            textAlign={"center"}
                            minWidth={100}

                          >
                            Tilapia PreStarter #2 <br />
                            (1&gt;5)
                          </Typography>
                        </ListItem>

                        <ListItem disablePadding sx={{
                          width: "fit-content"
                        }}>
                          <Typography
                            variant="body2"
                            fontWeight={500}
                            textAlign={"center"}
                            minWidth={100}

                          >
                            Tilapia PreStarter #3 <br />
                            (5-20)
                          </Typography>
                        </ListItem>

                        <ListItem disablePadding sx={{
                          width: "fit-content"
                        }}>
                          <Typography
                            variant="body2"
                            fontWeight={500}
                            textAlign={"center"}
                            minWidth={100}

                          >
                            Tilapia Grower 2mm<br />
                            (25-60)
                          </Typography>
                        </ListItem>


                      </List>
                    </Box>
                  </TableCell>

                  <TableCell sx={{
                    borderBottom: 0,
                    color: "#67737F",
                    background: "#F5F6F8",
                    fontSize: {
                      md: 16,
                      xs: 14,
                    },
                    fontWeight: 600,
                    textAlign: "center",
                    pr: "4px",
                    verticalAlign: "baseline"
                  }}>
                    <Typography
                      variant="body1"
                      sx={{
                        fontSize: {
                          md: 16,
                          xs: 14,
                        },
                        fontWeight: 600,
                        background: "#06a19b",
                        color: "#fff",
                        p: 1,
                        borderRadius: "8px",
                        whiteSpace: 'nowrap'

                      }}
                    >
                      Feed Supplier 3
                    </Typography>
                    <Box>
                      <List sx={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                      }}>
                        <ListItem disablePadding sx={{
                          width: "fit-content"
                        }}>
                          <Typography
                            variant="body2"
                            fontWeight={500}
                            textAlign={"center"}
                            minWidth={100}

                          >
                            Tilapia Grower <br />
                            (50-250)
                          </Typography>
                        </ListItem>
                      </List>
                    </Box>
                  </TableCell>

                  <TableCell sx={{
                    borderBottom: 0,
                    color: "#67737F",
                    background: "#F5F6F8",
                    fontSize: {
                      md: 16,
                      xs: 14,
                    },
                    fontWeight: 600,
                    textAlign: "center",
                    pr: "4px",
                    verticalAlign: "baseline"
                  }}>
                    <Typography
                      variant="body1"
                      sx={{
                        fontSize: {
                          md: 16,
                          xs: 14,
                        },
                        fontWeight: 600,
                        background: "#06a19b",
                        color: "#fff",
                        p: 1,
                        borderRadius: "8px",
                        whiteSpace: 'nowrap'

                      }}
                    >
                      Feed Supplier 4
                    </Typography>
                    <Box>
                      <List sx={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                      }}>
                        <ListItem disablePadding sx={{
                          width: "fit-content"
                        }}>
                          <Typography
                            variant="body2"
                            fontWeight={500}
                            textAlign={"center"}
                            minWidth={100}

                          >
                            Tilapia Finsher <br />
                            (200-500)
                          </Typography>
                        </ListItem>
                      </List>
                    </Box>
                  </TableCell>

                  <TableCell sx={{
                    borderBottom: 0,
                    color: "#67737F",
                    background: "#F5F6F8",
                    fontSize: {
                      md: 16,
                      xs: 14,
                    },
                    fontWeight: 600,
                    textAlign: "center",
                    verticalAlign: "baseline"
                  }}>
                    <Typography
                      variant="body1"
                      sx={{
                        fontSize: {
                          md: 16,
                          xs: 14,
                        },
                        fontWeight: 600,
                        background: "#06a19b",
                        color: "#fff",
                        p: 1,
                        borderRadius: "8px",
                        whiteSpace: 'nowrap'
                      }}
                    >
                      Feed Supplier 5
                    </Typography>
                    <Box>
                      <List sx={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                      }}>
                        <ListItem disablePadding sx={{
                          width: "fit-content"
                        }}>
                          <Typography
                            variant="body2"
                            fontWeight={500}
                            textAlign={"center"}
                            minWidth={100}

                          >
                            Tilapia Breeder <br />
                            (&gt;600)
                          </Typography>
                        </ListItem>
                      </List>
                    </Box>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell sx={{
                    borderBottomColor: "#F5F6F8",
                    borderBottomWidth: 2,
                    color: "#555555",
                    fontWeight: 500,
                    whiteSpace: "nowrap",
                    textAlign: "center",
                  }}>1</TableCell>

                  <TableCell sx={{
                    borderBottomColor: "#F5F6F8",
                    borderBottomWidth: 2,
                    color: "#555555",
                    fontWeight: 500,
                    whiteSpace: "nowrap",
                    textAlign: "center",
                  }}>

                    <Box sx={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-around",
                      alignItems: "center",
                      gap: 2
                    }}>
                      <FormControl className="ic-radio">
                        <Radio />
                      </FormControl>

                      <FormControl className="ic-radio">
                        <Radio />
                      </FormControl>
                      <FormControl className="ic-radio">
                        <Radio />
                      </FormControl>
                    </Box>

                  </TableCell>

                  <TableCell sx={{
                    borderBottomColor: "#F5F6F8",
                    borderBottomWidth: 2,
                    color: "#555555",
                    fontWeight: 500,
                    whiteSpace: "nowrap",
                    textAlign: "center",
                  }}>

                    <Box sx={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-around",
                      alignItems: "center",
                      gap: 2
                    }}>
                      <FormControl className="ic-radio">
                        <Radio />
                      </FormControl>

                      <FormControl className="ic-radio">
                        <Radio />
                      </FormControl>
                      <FormControl className="ic-radio">
                        <Radio />
                      </FormControl>
                    </Box>

                  </TableCell>

                  <TableCell sx={{
                    borderBottomColor: "#F5F6F8",
                    borderBottomWidth: 2,
                    color: "#555555",
                    fontWeight: 500,
                    whiteSpace: "nowrap",
                    textAlign: "center",
                  }}>

                    <Box sx={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: 2
                    }}>
                      <FormControl className="ic-radio">
                        <Radio />
                      </FormControl>
                    </Box>

                  </TableCell>

                  <TableCell sx={{
                    borderBottomColor: "#F5F6F8",
                    borderBottomWidth: 2,
                    color: "#555555",
                    fontWeight: 500,
                    whiteSpace: "nowrap",
                    textAlign: "center",
                  }}>

                    <Box sx={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: 2
                    }}>
                      <FormControl className="ic-radio">
                        <Radio />
                      </FormControl>
                    </Box>

                  </TableCell>

                  <TableCell sx={{
                    borderBottomColor: "#F5F6F8",
                    borderBottomWidth: 2,
                    color: "#555555",
                    fontWeight: 500,
                    whiteSpace: "nowrap",
                    textAlign: "center",
                  }}>

                    <Box sx={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: 2
                    }}>
                      <FormControl className="ic-radio">
                        <Radio />
                      </FormControl>
                    </Box>

                  </TableCell>


                </TableRow>

                <TableRow>
                  <TableCell sx={{
                    borderBottomColor: "#F5F6F8",
                    borderBottomWidth: 2,
                    color: "#555555",
                    fontWeight: 500,
                    whiteSpace: "nowrap",
                    textAlign: "center",
                  }}>2</TableCell>

                  <TableCell sx={{
                    borderBottomColor: "#F5F6F8",
                    borderBottomWidth: 2,
                    color: "#555555",
                    fontWeight: 500,
                    whiteSpace: "nowrap",
                    textAlign: "center",
                  }}>

                    <Box sx={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-around",
                      alignItems: "center",
                      gap: 2
                    }}>
                      <FormControl className="ic-radio">
                        <Radio />
                      </FormControl>

                      <FormControl className="ic-radio">
                        <Radio />
                      </FormControl>
                      <FormControl className="ic-radio">
                        <Radio />
                      </FormControl>
                    </Box>

                  </TableCell>

                  <TableCell sx={{
                    borderBottomColor: "#F5F6F8",
                    borderBottomWidth: 2,
                    color: "#555555",
                    fontWeight: 500,
                    whiteSpace: "nowrap",
                    textAlign: "center",
                  }}>

                    <Box sx={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-around",
                      alignItems: "center",
                      gap: 2
                    }}>
                      <FormControl className="ic-radio">
                        <Radio />
                      </FormControl>

                      <FormControl className="ic-radio">
                        <Radio />
                      </FormControl>
                      <FormControl className="ic-radio">
                        <Radio />
                      </FormControl>
                    </Box>

                  </TableCell>

                  <TableCell sx={{
                    borderBottomColor: "#F5F6F8",
                    borderBottomWidth: 2,
                    color: "#555555",
                    fontWeight: 500,
                    whiteSpace: "nowrap",
                    textAlign: "center",
                  }}>

                    <Box sx={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: 2
                    }}>
                      <FormControl className="ic-radio">
                        <Radio />
                      </FormControl>
                    </Box>

                  </TableCell>

                  <TableCell sx={{
                    borderBottomColor: "#F5F6F8",
                    borderBottomWidth: 2,
                    color: "#555555",
                    fontWeight: 500,
                    whiteSpace: "nowrap",
                    textAlign: "center",
                  }}>

                    <Box sx={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: 2
                    }}>
                      <FormControl className="ic-radio">
                        <Radio />
                      </FormControl>
                    </Box>

                  </TableCell>

                  <TableCell sx={{
                    borderBottomColor: "#F5F6F8",
                    borderBottomWidth: 2,
                    color: "#555555",
                    fontWeight: 500,
                    whiteSpace: "nowrap",
                    textAlign: "center",
                  }}>

                    <Box sx={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: 2
                    }}>
                      <FormControl className="ic-radio">
                        <Radio />
                      </FormControl>
                    </Box>

                  </TableCell>


                </TableRow>

                <TableRow>
                  <TableCell sx={{
                    borderBottomColor: "#F5F6F8",
                    borderBottomWidth: 2,
                    color: "#555555",
                    fontWeight: 500,
                    whiteSpace: "nowrap",
                    textAlign: "center",
                  }}>3</TableCell>

                  <TableCell sx={{
                    borderBottomColor: "#F5F6F8",
                    borderBottomWidth: 2,
                    color: "#555555",
                    fontWeight: 500,
                    whiteSpace: "nowrap",
                    textAlign: "center",
                  }}>

                    <Box sx={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-around",
                      alignItems: "center",
                      gap: 2
                    }}>
                      <FormControl className="ic-radio">
                        <Radio />
                      </FormControl>

                      <FormControl className="ic-radio">
                        <Radio />
                      </FormControl>
                      <FormControl className="ic-radio">
                        <Radio />
                      </FormControl>
                    </Box>

                  </TableCell>

                  <TableCell sx={{
                    borderBottomColor: "#F5F6F8",
                    borderBottomWidth: 2,
                    color: "#555555",
                    fontWeight: 500,
                    whiteSpace: "nowrap",
                    textAlign: "center",
                  }}>

                    <Box sx={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-around",
                      alignItems: "center",
                      gap: 2
                    }}>
                      <FormControl className="ic-radio">
                        <Radio />
                      </FormControl>

                      <FormControl className="ic-radio">
                        <Radio />
                      </FormControl>
                      <FormControl className="ic-radio">
                        <Radio />
                      </FormControl>
                    </Box>

                  </TableCell>

                  <TableCell sx={{
                    borderBottomColor: "#F5F6F8",
                    borderBottomWidth: 2,
                    color: "#555555",
                    fontWeight: 500,
                    whiteSpace: "nowrap",
                    textAlign: "center",
                  }}>

                    <Box sx={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: 2
                    }}>
                      <FormControl className="ic-radio">
                        <Radio />
                      </FormControl>
                    </Box>

                  </TableCell>

                  <TableCell sx={{
                    borderBottomColor: "#F5F6F8",
                    borderBottomWidth: 2,
                    color: "#555555",
                    fontWeight: 500,
                    whiteSpace: "nowrap",
                    textAlign: "center",
                  }}>

                    <Box sx={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: 2
                    }}>
                      <FormControl className="ic-radio">
                        <Radio />
                      </FormControl>
                    </Box>

                  </TableCell>

                  <TableCell sx={{
                    borderBottomColor: "#F5F6F8",
                    borderBottomWidth: 2,
                    color: "#555555",
                    fontWeight: 500,
                    whiteSpace: "nowrap",
                    textAlign: "center",
                  }}>

                    <Box sx={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: 2
                    }}>
                      <FormControl className="ic-radio">
                        <Radio />
                      </FormControl>
                    </Box>

                  </TableCell>


                </TableRow>

                <TableRow>
                  <TableCell sx={{
                    borderBottomColor: "#F5F6F8",
                    borderBottomWidth: 2,
                    color: "#555555",
                    fontWeight: 500,
                    whiteSpace: "nowrap",
                    textAlign: "center",
                  }}>4</TableCell>

                  <TableCell sx={{
                    borderBottomColor: "#F5F6F8",
                    borderBottomWidth: 2,
                    color: "#555555",
                    fontWeight: 500,
                    whiteSpace: "nowrap",
                    textAlign: "center",
                  }}>

                    <Box sx={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-around",
                      alignItems: "center",
                      gap: 2
                    }}>
                      <FormControl className="ic-radio">
                        <Radio />
                      </FormControl>

                      <FormControl className="ic-radio">
                        <Radio />
                      </FormControl>
                      <FormControl className="ic-radio">
                        <Radio />
                      </FormControl>
                    </Box>

                  </TableCell>

                  <TableCell sx={{
                    borderBottomColor: "#F5F6F8",
                    borderBottomWidth: 2,
                    color: "#555555",
                    fontWeight: 500,
                    whiteSpace: "nowrap",
                    textAlign: "center",
                  }}>

                    <Box sx={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-around",
                      alignItems: "center",
                      gap: 2
                    }}>
                      <FormControl className="ic-radio">
                        <Radio />
                      </FormControl>

                      <FormControl className="ic-radio">
                        <Radio />
                      </FormControl>
                      <FormControl className="ic-radio">
                        <Radio />
                      </FormControl>
                    </Box>

                  </TableCell>

                  <TableCell sx={{
                    borderBottomColor: "#F5F6F8",
                    borderBottomWidth: 2,
                    color: "#555555",
                    fontWeight: 500,
                    whiteSpace: "nowrap",
                    textAlign: "center",
                  }}>

                    <Box sx={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: 2
                    }}>
                      <FormControl className="ic-radio">
                        <Radio />
                      </FormControl>
                    </Box>

                  </TableCell>

                  <TableCell sx={{
                    borderBottomColor: "#F5F6F8",
                    borderBottomWidth: 2,
                    color: "#555555",
                    fontWeight: 500,
                    whiteSpace: "nowrap",
                    textAlign: "center",
                  }}>

                    <Box sx={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: 2
                    }}>
                      <FormControl className="ic-radio">
                        <Radio />
                      </FormControl>
                    </Box>

                  </TableCell>

                  <TableCell sx={{
                    borderBottomColor: "#F5F6F8",
                    borderBottomWidth: 2,
                    color: "#555555",
                    fontWeight: 500,
                    whiteSpace: "nowrap",
                    textAlign: "center",
                  }}>

                    <Box sx={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: 2
                    }}>
                      <FormControl className="ic-radio">
                        <Radio />
                      </FormControl>
                    </Box>

                  </TableCell>


                </TableRow>

                <TableRow>
                  <TableCell sx={{
                    borderBottomColor: "#F5F6F8",
                    borderBottomWidth: 2,
                    color: "#555555",
                    fontWeight: 500,
                    whiteSpace: "nowrap",
                    textAlign: "center",
                  }}>5</TableCell>

                  <TableCell sx={{
                    borderBottomColor: "#F5F6F8",
                    borderBottomWidth: 2,
                    color: "#555555",
                    fontWeight: 500,
                    whiteSpace: "nowrap",
                    textAlign: "center",
                  }}>

                    <Box sx={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-around",
                      alignItems: "center",
                      gap: 2
                    }}>
                      <FormControl className="ic-radio">
                        <Radio />
                      </FormControl>

                      <FormControl className="ic-radio">
                        <Radio />
                      </FormControl>
                      <FormControl className="ic-radio">
                        <Radio />
                      </FormControl>
                    </Box>

                  </TableCell>

                  <TableCell sx={{
                    borderBottomColor: "#F5F6F8",
                    borderBottomWidth: 2,
                    color: "#555555",
                    fontWeight: 500,
                    whiteSpace: "nowrap",
                    textAlign: "center",
                  }}>

                    <Box sx={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-around",
                      alignItems: "center",
                      gap: 2
                    }}>
                      <FormControl className="ic-radio">
                        <Radio />
                      </FormControl>

                      <FormControl className="ic-radio">
                        <Radio />
                      </FormControl>
                      <FormControl className="ic-radio">
                        <Radio />
                      </FormControl>
                    </Box>

                  </TableCell>

                  <TableCell sx={{
                    borderBottomColor: "#F5F6F8",
                    borderBottomWidth: 2,
                    color: "#555555",
                    fontWeight: 500,
                    whiteSpace: "nowrap",
                    textAlign: "center",
                  }}>

                    <Box sx={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: 2
                    }}>
                      <FormControl className="ic-radio">
                        <Radio />
                      </FormControl>
                    </Box>

                  </TableCell>

                  <TableCell sx={{
                    borderBottomColor: "#F5F6F8",
                    borderBottomWidth: 2,
                    color: "#555555",
                    fontWeight: 500,
                    whiteSpace: "nowrap",
                    textAlign: "center",
                  }}>

                    <Box sx={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: 2
                    }}>
                      <FormControl className="ic-radio">
                        <Radio />
                      </FormControl>
                    </Box>

                  </TableCell>

                  <TableCell sx={{
                    borderBottomColor: "#F5F6F8",
                    borderBottomWidth: 2,
                    color: "#555555",
                    fontWeight: 500,
                    whiteSpace: "nowrap",
                    textAlign: "center",
                  }}>

                    <Box sx={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: 2
                    }}>
                      <FormControl className="ic-radio">
                        <Radio />
                      </FormControl>
                    </Box>

                  </TableCell>


                </TableRow>

                <TableRow>
                  <TableCell sx={{
                    borderBottomColor: "#F5F6F8",
                    borderBottomWidth: 2,
                    color: "#555555",
                    fontWeight: 500,
                    whiteSpace: "nowrap",
                    textAlign: "center",
                  }}>10</TableCell>

                  <TableCell sx={{
                    borderBottomColor: "#F5F6F8",
                    borderBottomWidth: 2,
                    color: "#555555",
                    fontWeight: 500,
                    whiteSpace: "nowrap",
                    textAlign: "center",
                  }}>

                    <Box sx={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-around",
                      alignItems: "center",
                      gap: 2
                    }}>
                      <FormControl className="ic-radio">
                        <Radio />
                      </FormControl>

                      <FormControl className="ic-radio">
                        <Radio />
                      </FormControl>
                      <FormControl className="ic-radio">
                        <Radio />
                      </FormControl>
                    </Box>

                  </TableCell>

                  <TableCell sx={{
                    borderBottomColor: "#F5F6F8",
                    borderBottomWidth: 2,
                    color: "#555555",
                    fontWeight: 500,
                    whiteSpace: "nowrap",
                    textAlign: "center",
                  }}>

                    <Box sx={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-around",
                      alignItems: "center",
                      gap: 2
                    }}>
                      <FormControl className="ic-radio">
                        <Radio />
                      </FormControl>

                      <FormControl className="ic-radio">
                        <Radio />
                      </FormControl>
                      <FormControl className="ic-radio">
                        <Radio />
                      </FormControl>
                    </Box>

                  </TableCell>

                  <TableCell sx={{
                    borderBottomColor: "#F5F6F8",
                    borderBottomWidth: 2,
                    color: "#555555",
                    fontWeight: 500,
                    whiteSpace: "nowrap",
                    textAlign: "center",
                  }}>

                    <Box sx={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: 2
                    }}>
                      <FormControl className="ic-radio">
                        <Radio />
                      </FormControl>
                    </Box>

                  </TableCell>

                  <TableCell sx={{
                    borderBottomColor: "#F5F6F8",
                    borderBottomWidth: 2,
                    color: "#555555",
                    fontWeight: 500,
                    whiteSpace: "nowrap",
                    textAlign: "center",
                  }}>

                    <Box sx={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: 2
                    }}>
                      <FormControl className="ic-radio">
                        <Radio />
                      </FormControl>
                    </Box>

                  </TableCell>

                  <TableCell sx={{
                    borderBottomColor: "#F5F6F8",
                    borderBottomWidth: 2,
                    color: "#555555",
                    fontWeight: 500,
                    whiteSpace: "nowrap",
                    textAlign: "center",
                  }}>

                    <Box sx={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: 2
                    }}>
                      <FormControl className="ic-radio">
                        <Radio />
                      </FormControl>
                    </Box>

                  </TableCell>


                </TableRow>

              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

      </Stack >
      {/* Feed Profile End */}
    </>
  );
};

export default Page;
