"use client";
import { getLocalItem, setLocalItem } from "@/app/_lib/utils";
import { ProductionParaMeterType } from "@/app/_typeModels/Farm";
import { selectFarm } from "@/lib/features/farm/farmSlice";
import { useAppSelector } from "@/lib/hooks";
import {
  Box,
  Button,
  FormControlLabel,
  IconButton,
  List,
  ListItem,
  Modal,
  Radio,
  Stack,
  Typography,
} from "@mui/material";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { getCookie } from "cookies-next";
import { useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { cellStyle, fishSizes, radioValueMap } from "../farm/FeedProfiles";
import { CloseIcon } from "../theme/overrides/CustomIcons";

interface Props {
  productionParaMeter?: ProductionParaMeterType[];
  editFarm?: any;
  setOpen: (open: boolean) => void;
  open: boolean;
  selectedUnitName: string;
  setSelectedUnitName: (val: string) => void;
}
interface FormData {
  [key: string]: string;
}
const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  padding: "5px 25px",
};

const ProductionUnitFeedProfile: React.FC<Props> = ({
  setOpen,
  open,
  editFarm,
  productionParaMeter,
  selectedUnitName,
  setSelectedUnitName,
}) => {
  const isEditFarm = getCookie("isEditFarm");

  const [formProductionFeedProfile, setFormProductionFeedProfile] =
    useState<any>();

  const { control, handleSubmit, watch, setValue } = useForm<FormData>();

  const onSubmit: SubmitHandler<FormData> = (formData) => {
    const productionUnitsFeedProfilesArray = getLocalItem(
      "productionUnitsFeedProfiles"
    );
    const { data, ...rest } = formData;

    const updatedData = productionUnitsFeedProfilesArray?.filter(
      (data: any) => data.unitName !== selectedUnitName
    );
    const payload = {
      unitName: selectedUnitName,
      feedProfile: {
        ...rest,
      },
    };

    updatedData.push(payload);
    setLocalItem("productionUnitsFeedProfiles", updatedData);
    setOpen(false);
    setSelectedUnitName("");
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const formData = getLocalItem("feedProfiles");
      setFormProductionFeedProfile(formData);
      Object?.entries(formData).forEach(([key, value]) => {
        setValue(key, String(value));
      });
    }
  }, []);

  useEffect(() => {
    const productionUnitsFeedProfilesArray = getLocalItem(
      "productionUnitsFeedProfiles"
    );

    const updatedData = productionUnitsFeedProfilesArray?.find(
      (data: any) => data.unitName === selectedUnitName
    );
    if (updatedData) {
      Object.entries(updatedData?.feedProfile).forEach(([key, value]) => {
        setValue(key, String(value));
      });
    }
  }, [formProductionFeedProfile, selectedUnitName, setValue]);

  useEffect(() => {
    const formProductionFeedProfileArray = getLocalItem(
      "productionUnitsFeedProfiles"
    );
    const currentUnit = formProductionFeedProfileArray?.find(
      (val: any) => val.unitName === selectedUnitName
    );
    if (
      isEditFarm &&
      editFarm &&
      formProductionFeedProfileArray &&
      !currentUnit
    ) {
      editFarm?.productionUnits.map((unit: any, i: number) => {
        if (
          unit.name === selectedUnitName &&
          unit.id === unit.FeedProfileProductionUnit[0]?.productionUnitId
        ) {
          Object.entries(unit?.FeedProfileProductionUnit[0]?.profiles).forEach(
            ([key, value]) => {
              setValue(key, String(value));
            }
          );
        }
      });
    } else if (formProductionFeedProfileArray?.length && currentUnit) {
      Object.entries(currentUnit?.feedProfile).forEach(([key, value]) => {
        setValue(key, String(value));
      });
    }
  }, [isEditFarm, editFarm, setValue, selectedUnitName]);
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
  const handleClose = () => {
    setOpen(false);
    setSelectedUnitName("");
  };
  return (
    <Modal
      open={open}
      // onClose={handleClose}
      aria-labelledby="parent-modal-title"
      aria-describedby="parent-modal-description"
      className="modal-positioning"
      BackdropProps={{
        onClick: (event) => event.stopPropagation(), // Prevents closing on backdrop click
      }}
    >
      <Stack sx={style}>
        <Box display="flex" justifyContent="flex-end" padding={2}>
          <IconButton
            onClick={handleClose}
            sx={{
              color: "inherit",
              background: "transparent",
              margin: "2",
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Paper
            sx={{
              width: "100%",
              overflow: "hidden",
              borderRadius: "14px",
              boxShadow: "0px 0px 16px 5px #0000001A",
            }}
          >
            <Stack>
              {/* <form onSubmit={handleSubmit(onSubmit)}> */}
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
                <TableContainer
                  component={Paper}
                  className="feed-profile-table"
                >
                  <Table stickyHeader={true}>
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

              {/* </form> */}
            </Stack>
          </Paper>

          <Box
            display={"flex"}
            justifyContent={"flex-end"}
            alignItems={"center"}
            gap={3}
            mt={4}
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
              }}
            >
              Save
            </Button>
          </Box>
        </form>
      </Stack>
    </Modal>
  );
};

export default ProductionUnitFeedProfile;
