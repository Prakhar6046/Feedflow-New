import { setLocalItem } from "@/app/_lib/utils";
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  List,
  ListItem,
  Paper,
  Radio,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { NextPage } from "next";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
const cellStyle = {
  borderBottomColor: "#F5F6F8",
  borderBottomWidth: 2,
  color: "#555555",
  fontWeight: 500,
  whiteSpace: "nowrap",
  textAlign: "center",
};
const radioValueMap: Record<string, Record<string, string>> = {
  col1: {
    opt1: "Tilapia PreStarter #2 (1>5)-Feed Supplier 1",
    opt2: "Tilapia PreStarter #3 (5-20)-Feed Supplier 1",
    opt3: "Tilapia Grower 2mm (25-40)-Feed Supplier 1",
  },
  col2: {
    opt1: "Tilapia PreStarter #2 (1>5)-Feed Supplier 2",
    opt2: "Tilapia PreStarter #3 (5-20)-Feed Supplier 2",
    opt3: "Tilapia Grower 2mm (25-60)-Feed Supplier 2",
  },
  col3: {
    opt1: "Tilapia Grower (50-250)-Feed Supplier 3",
  },
  col4: {
    opt1: "Tilapia Finsher (200-500)-Feed Supplier 4",
  },
  col5: {
    opt1: "Tilapia Breeder (>600)-Feed Supplier 5",
  },
};

const fishSizes = [
  1, 2, 3, 4, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85,
  90, 95, 100, 120, 140, 160, 180,
];
interface Props {
  setActiveStep: (val: number) => void;
}
interface FormValues {
  [key: string]: string;
}
const FeedProfiles = ({ setActiveStep }: Props) => {
  const { control, handleSubmit, watch } = useForm<FormValues>();
  const allFeedprofiles = watch();
  console.log(allFeedprofiles);

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    setLocalItem("feedProfiles", data);
    setActiveStep(4);
  };

  const renderRadioGroup = (
    rowName: string,
    columnName: string,
    options: string[] = ["opt1", "opt2", "opt3"]
  ) => (
    <Controller
      name={rowName}
      control={control}
      defaultValue=""
      render={({ field }) => (
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          gap={2}
        >
          {options.map((opt) => {
            const value =
              radioValueMap[columnName]?.[opt] ?? `${columnName}_${opt}`;
            return (
              <FormControlLabel
                key={value}
                value={value}
                className="ic-radio"
                control={
                  <Radio
                    {...field}
                    checked={field.value === value}
                    onChange={() => field.onChange(value)}
                  />
                }
                label=""
              />
            );
          })}
        </Box>
      )}
    />
  );

  return (
    <>
      <Stack>
        <form onSubmit={handleSubmit(onSubmit)}>
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
          <Paper
            sx={{
              width: "100%",
              overflow: "hidden",
              borderRadius: "14px",
              boxShadow: "0px 0px 16px 5px #0000001A",
            }}
          >
            <TableContainer component={Paper} className="feed-profile-table">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={{
                        borderBottom: 0,
                        color: "#67737F",
                        background: "#F5F6F8",
                        textAlign: "center",
                        pr: "4px",
                        fontSize: {
                          md: 16,
                          xs: 14,
                        },
                        fontWeight: 600,
                        verticalAlign: "baseline",
                      }}
                    >
                      Fish Size <br />
                      (g)
                    </TableCell>

                    <TableCell
                      sx={{
                        borderBottom: 0,
                        color: "#67737F",
                        background: "#F5F6F8",
                        textAlign: "center",
                        pr: "4px",
                      }}
                    >
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
                          whiteSpace: "nowrap",
                        }}
                      >
                        Feed Supplier 1
                      </Typography>
                      <Box>
                        <List
                          sx={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-around",
                            alignItems: "center",
                            gap: 2,
                          }}
                        >
                          <ListItem
                            disablePadding
                            sx={{
                              width: "fit-content",
                            }}
                          >
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

                          <ListItem
                            disablePadding
                            sx={{
                              width: "fit-content",
                            }}
                          >
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

                          <ListItem
                            disablePadding
                            sx={{
                              width: "fit-content",
                            }}
                          >
                            <Typography
                              variant="body2"
                              fontWeight={500}
                              textAlign={"center"}
                              minWidth={100}
                            >
                              Tilapia Grower 2mm
                              <br />
                              (25-40)
                            </Typography>
                          </ListItem>
                        </List>
                      </Box>
                    </TableCell>

                    <TableCell
                      sx={{
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
                      }}
                    >
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
                          whiteSpace: "nowrap",
                        }}
                      >
                        Feed Supplier 2
                      </Typography>
                      <Box>
                        <List
                          sx={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-around",
                            alignItems: "center",
                            gap: 2,
                          }}
                        >
                          <ListItem
                            disablePadding
                            sx={{
                              width: "fit-content",
                            }}
                          >
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

                          <ListItem
                            disablePadding
                            sx={{
                              width: "fit-content",
                            }}
                          >
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

                          <ListItem
                            disablePadding
                            sx={{
                              width: "fit-content",
                            }}
                          >
                            <Typography
                              variant="body2"
                              fontWeight={500}
                              textAlign={"center"}
                              minWidth={100}
                            >
                              Tilapia Grower 2mm
                              <br />
                              (25-60)
                            </Typography>
                          </ListItem>
                        </List>
                      </Box>
                    </TableCell>

                    <TableCell
                      sx={{
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
                        verticalAlign: "baseline",
                      }}
                    >
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
                          whiteSpace: "nowrap",
                        }}
                      >
                        Feed Supplier 3
                      </Typography>
                      <Box>
                        <List
                          sx={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <ListItem
                            disablePadding
                            sx={{
                              width: "fit-content",
                            }}
                          >
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

                    <TableCell
                      sx={{
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
                        verticalAlign: "baseline",
                      }}
                    >
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
                          whiteSpace: "nowrap",
                        }}
                      >
                        Feed Supplier 4
                      </Typography>
                      <Box>
                        <List
                          sx={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <ListItem
                            disablePadding
                            sx={{
                              width: "fit-content",
                            }}
                          >
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

                    <TableCell
                      sx={{
                        borderBottom: 0,
                        color: "#67737F",
                        background: "#F5F6F8",
                        fontSize: {
                          md: 16,
                          xs: 14,
                        },
                        fontWeight: 600,
                        textAlign: "center",
                        verticalAlign: "baseline",
                      }}
                    >
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
                          whiteSpace: "nowrap",
                        }}
                      >
                        Feed Supplier 5
                      </Typography>
                      <Box>
                        <List
                          sx={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <ListItem
                            disablePadding
                            sx={{
                              width: "fit-content",
                            }}
                          >
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
                  {fishSizes?.map((size) => {
                    const rowName = `selection_${size}`;

                    return (
                      <TableRow key={size}>
                        <TableCell sx={cellStyle}>{size}</TableCell>

                        <TableCell sx={cellStyle}>
                          {renderRadioGroup(rowName, "col1", [
                            "opt1",
                            "opt2",
                            "opt3",
                          ])}
                        </TableCell>

                        <TableCell sx={cellStyle}>
                          {renderRadioGroup(rowName, "col2", [
                            "opt1",
                            "opt2",
                            "opt3",
                          ])}
                        </TableCell>

                        <TableCell sx={cellStyle}>
                          {renderRadioGroup(rowName, "col3", ["opt1"])}
                        </TableCell>

                        <TableCell sx={cellStyle}>
                          {renderRadioGroup(rowName, "col4", ["opt1"])}
                        </TableCell>

                        <TableCell sx={cellStyle}>
                          {renderRadioGroup(rowName, "col5", ["opt1"])}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>

          <Box
            display={"flex"}
            justifyContent={"flex-end"}
            alignItems={"center"}
            gap={3}
            mt={1}
          >
            <Button
              type="button"
              variant="contained"
              onClick={() => {
                setActiveStep(2);
                setLocalItem("feedProfiles", allFeedprofiles);
              }}
              sx={{
                background: "#fff",
                color: "#06A19B",
                fontWeight: 600,
                padding: "6px 16px",
                width: "fit-content",
                textTransform: "capitalize",
                borderRadius: "8px",
                border: "1px solid #06A19B",
              }}
            >
              Previous
            </Button>
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
              }}
            >
              Next
            </Button>
          </Box>
        </form>
      </Stack>
    </>
  );
};

export default FeedProfiles;
