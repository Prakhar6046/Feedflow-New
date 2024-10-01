"use client";
// import UploadFileOutlinedIcon from '@mui/icons-material/UploadFileOutlined';
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

import Select from "@mui/material/Select";

import { OrganisationType } from "@/app/_components/AddNewOrganisation";
import Loader from "@/app/_components/Loader";
import {
  Box,
  Button,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useEffect, useState } from "react";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { AddOrganizationFormInputs } from "@/app/_typeModels/Organization";
const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const steps = [
  {
    label: "Intro",
  },
  {
    label: "Farm",
  },
  {
    label: "Production Units",
  },
  {
    label: "Finished",
  },
];
const Page = ({ params }: { params: { organisationId: string } }) => {
  const [organisationData, setOrganisationData] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false);
  const [profilePic, setProfilePic] = useState<String>();
  const getOrganisation = async () => {
    setLoading(true);
    const data = await fetch(`/api/organisation/${params.organisationId}`, {
      method: "GET",
    });
    if (data) {
      setLoading(false);
    }
    return data.json();
  };

  const {
    register,
    setValue,
    handleSubmit,
    control,
    getValues,
    resetField,
    watch,
    formState: { errors },
  } = useForm<AddOrganizationFormInputs>({
    defaultValues: {
      contacts: [{ name: "", role: "", email: "", phone: "" }],
    },
  });
  const selectedOrganisationType = watch("organisationType");
  const onSubmit: SubmitHandler<AddOrganizationFormInputs> = async (data) => {
    const address: any = {
      address: data.address,
      city: data.city,
      province: data.province,
      postCode: data.postCode,
    };

    const formData = new FormData();
    formData.append("name", String(data.organisationName));
    formData.append("organisationCode", String(data.organisationCode));
    formData.append("organisationType", String(data.organisationType));
    formData.append("address", JSON.stringify(address));
    formData.append("contacts", JSON.stringify(data.contacts));
    formData.append("image", data.image[0]);
    const res = await fetch(`/api/organisation/${params.organisationId}`, {
      method: "PUT",
      body: formData,
    });
    if (res.ok) {
      const updatedOrganisation = await res.json();

      toast.success(updatedOrganisation.message);
      // resetField("confirmPassword");
      // resetField("password");
    }
  };
  const { fields, append, remove } = useFieldArray({
    control,
    name: "contacts",
  });
  const handleUpload = async (imagePath: FileList) => {
    const formData = new FormData();
    formData.append("image", imagePath[0]);
    formData.append("organisationId", params.organisationId);
    const oldImageName = profilePic?.split("/").pop()?.split(".")[0];

    formData.append("oldImageName", oldImageName || "");

    const response = await fetch(`/api/profile-pic/upload/organisation`, {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      const updatedUser = await response.json();
      setProfilePic(updatedUser.data.imageUrl);
      // toast.success(updatedUser.message);
      // resetField("confirmPassword");
      // resetField("password");
    }
  };
  useEffect(() => {
    const organisation = async () => {
      // setLoading(true);
      const data = await getOrganisation();

      setOrganisationData(data.data);

      // setUserData(data);
    };
    organisation();
  }, []);
  useEffect(() => {
    if (organisationData) {
      console.log(organisationData);

      setValue("organisationName", organisationData.name);
      setValue("organisationCode", organisationData.organisationCode);
      setValue("address", String(organisationData?.address?.name));
      setValue("city", String(organisationData.address?.city));
      setValue("street", String(organisationData.address?.street));
      setValue("province", String(organisationData.address?.province));
      setValue("postCode", String(organisationData.address?.postCode));
      setValue("contacts", organisationData?.contact);
      setValue("organisationType", organisationData?.organisationType);
      // setValue("email", String(organisationData.contact?.email));
      // setValue("phone", String(organisationData.contact?.phone));
      // setValue("role", String(organisationData.contact?.role));
      // setValue("name", String(organisationData.contact?.name));
      setProfilePic(organisationData.imageUrl);
      // setValue("email", organisationData.address?.city);
    }
  }, [organisationData]);

  if (loading) {
    return <Loader />;
  }

  return (
    <Stack
      sx={{
        borderRadius: "14px",
        boxShadow: "0px 0px 16px 5px #0000001A",
        mt: 4,
      }}
    >
      <Box
        sx={{
          p: {
            md: 3,
            xs: 2,
          },
          fontSize: 20,
          fontWeight: 600,
          borderColor: "#0000001A",
        }}
      >
        Information
      </Box>

      <Divider />

      <Grid
        container
        sx={{
          p: {
            md: 3,
            xs: 2,
          },
        }}
      >
        <Grid
          item
          xl={3}
          md={5}
          xs={12}
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            gap: 3,
            alignItems: {
              md: "flex-start",
              xs: "center",
            },
          }}
        >
          <Button
            component="label"
            role={undefined}
            variant="contained"
            tabIndex={-1}
            style={{
              backgroundImage: `url(${profilePic})`,
              backgroundSize: "contain",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              margin: "0 !important",
            }}
            startIcon={<CloudUploadIcon />}
            className="upload-file-input"
            sx={{
              textTransform: "unset",
              fontSize: 12,
              width: {
                md: "90%",
                xs: "100%",
              },
              height: 200,
              borderRadius: 3,
              border: "7px solid white",
              outline: "1px dashed rgba(145, 158, 171, 0.32)",
              backgroundColor: "rgb(244, 246, 248)",
              boxShadow: "none",
              color: "rgb(99, 115, 129)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Box>
              Drag file here or{" "}
              {/* <Link
                href="/"
                style={{
                  color: "#06a19b",
                }}
              > */}
              Upload from Device
              {/* </Link> */}
            </Box>
            <VisuallyHiddenInput
              type="file"
              {...register("image", {
                onChange: (e) => handleUpload(e.target.files),
              })}
              multiple
            />
          </Button>

          <Box
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
            flexDirection={"row"}
            sx={{
              width: {
                md: "90%",
                xs: "100%",
              },
            }}
          >
            <Typography
              variant="body1"
              fontSize={12}
              textAlign={"center"}
              margin="0 auto"
              color="#979797"
            >
              Allowed *.jpeg, *.jpg, *.png, *.gif <br />
              max size of 3.15M byte
            </Typography>
          </Box>
        </Grid>

        <Grid
          item
          xl={9}
          md={7}
          xs={12}
          sx={{
            mt: {
              md: 0,
              xs: 5,
            },
          }}
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box width={"100%"} mb={2}>
              <TextField
                label="Organisation Name"
                type="text"
                className="form-input"
                focused
                {...register("organisationName", {
                  required: true,
                })}
                // focused={userData?.data.name ? true : false}
                // value={userData?.data.name}
                sx={{
                  width: "100%",
                }}
              />
              {errors &&
                errors.organisationName &&
                errors.organisationName.type === "required" && (
                  <Typography
                    variant="body2"
                    color="red"
                    fontSize={13}
                    mt={0.5}
                  >
                    This field is required.
                  </Typography>
                )}
            </Box>
            <Stack
              display={"flex"}
              justifyContent={"flex-start"}
              direction={"row"}
              sx={{
                width: "100%",
                marginBottom: 2,
                gap: 1.5,
              }}
            >
              {/* <FormControl
                className="form-input"
                focused
                sx={{
                  width: {
                    md: "15%",
                    xs: "50%",
                  },
                }}
              >
                <InputLabel id="demo-simple-select-label">
                  Organisation Type
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Organisation Type"
                  //   onChange={handleChange}
                >
                  <MenuItem value={10}>Ten</MenuItem>
                  <MenuItem value={20}>Twenty</MenuItem>
                  <MenuItem value={30}>Thirty</MenuItem>
                </Select>
              </FormControl> */}

              <Box width={"100%"}>
                <TextField
                  label="Organisation Code"
                  type="text"
                  className="form-input"
                  {...register("organisationCode", {
                    required: true,
                  })}
                  // disabled
                  sx={{
                    width: "100%",
                  }}
                  focused
                  // focused={true}
                  // value={userData?.data.email ?? "Demo@gmail.com"}
                />
                {errors &&
                  errors.organisationCode &&
                  errors.organisationCode.type === "required" && (
                    <Typography
                      variant="body2"
                      color="red"
                      fontSize={13}
                      mt={0.5}
                    >
                      This field is required.
                    </Typography>
                  )}
              </Box>
            </Stack>
            <FormControl className="form-input" fullWidth>
              <InputLabel id="demo-simple-select-label">
                Organisation Type
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Production Unit Type"
                {...register("organisationType")}
                value={selectedOrganisationType || ""}
                // onChange={(e) => handleChange(e, item)}
                // sx={{
                //   px: {
                //     xl: 10,
                //     md: 5,
                //     xs: 3,
                //   },
                // }}
              >
                {OrganisationType.map((organisation, i) => {
                  return (
                    <MenuItem value={organisation} key={i}>
                      {organisation}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
            <Typography
              variant="h6"
              color="rgb(99, 115, 129)"
              fontSize={14}
              marginTop={3}
              marginBottom={2}
            >
              Address
            </Typography>

            <Stack
              display={"flex"}
              justifyContent={"flex-start"}
              direction={"row"}
              sx={{
                width: "100%",
                marginBottom: 2,
                gap: 1.5,
              }}
            >
              <Box width={"100%"}>
                <TextField
                  label="Address"
                  type="text"
                  className="form-input"
                  {...register("address", {
                    required: true,
                  })}
                  focused
                  sx={{
                    width: "100%",
                  }}
                />
                {errors &&
                  errors.address &&
                  errors.address.type === "required" && (
                    <Typography
                      variant="body2"
                      color="red"
                      fontSize={13}
                      mt={0.5}
                    >
                      This field is required.
                    </Typography>
                  )}
              </Box>

              <Box width={"100%"}>
                <TextField
                  label="City"
                  type="text"
                  className="form-input"
                  {...register("city", {
                    required: true,
                  })}
                  focused
                  sx={{
                    width: "100%",
                  }}
                />
                {errors && errors.city && errors.city.type === "required" && (
                  <Typography
                    variant="body2"
                    color="red"
                    fontSize={13}
                    mt={0.5}
                  >
                    This field is required.
                  </Typography>
                )}
              </Box>
            </Stack>

            <Stack
              display={"flex"}
              justifyContent={"flex-start"}
              direction={"row"}
              sx={{
                width: "100%",
                marginBottom: 2,
                gap: 1.5,
              }}
            >
              <Box width={"100%"}>
                <TextField
                  label="Province"
                  type="text"
                  className="form-input"
                  {...register("province", {
                    required: true,
                  })}
                  focused
                  sx={{
                    width: "100%",
                  }}
                />

                {errors &&
                  errors.province &&
                  errors.province.type === "required" && (
                    <Typography
                      variant="body2"
                      color="red"
                      fontSize={13}
                      mt={0.5}
                    >
                      This field is required.
                    </Typography>
                  )}
              </Box>

              <Box width={"100%"}>
                <TextField
                  label="Post Code"
                  type="text"
                  className="form-input"
                  {...register("postCode", {
                    required: true,
                  })}
                  focused
                  sx={{
                    width: "100%",
                  }}
                />
                {errors &&
                  errors.postCode &&
                  errors.postCode.type === "required" && (
                    <Typography
                      variant="body2"
                      color="red"
                      fontSize={13}
                      mt={0.5}
                    >
                      This field is required.
                    </Typography>
                  )}
              </Box>
            </Stack>

            <Typography
              variant="h6"
              color="rgb(99, 115, 129)"
              fontSize={14}
              marginTop={3}
              marginBottom={2}
            >
              Contacts
            </Typography>

            {/* {organisationData?.contact?.map((contact, i) => {
              return (
                <Stack
                  key={i}
                  display={"flex"}
                  justifyContent={"center"}
                  direction={"row"}
                  sx={{
                    width: "100%",
                    marginBottom: 2,
                    gap: 1.5,
                    flexWrap: {
                      lg: "nowrap",
                      xs: "wrap",
                    },
                  }}
                >
                  <TextField
                    label="Name"
                    type="text"
                    className="form-input"
                    {...register("name")}
                    focused
                    sx={{
                      width: {
                        lg: "100%",
                        md: "48.4%",
                        xs: "100%",
                      },
                    }}
                  />

                  <TextField
                    label="Role"
                    type="text"
                    className="form-input"
                    {...register("role")}
                    focused
                    sx={{
                      width: {
                        lg: "100%",
                        md: "48.4%",
                        xs: "100%",
                      },
                    }}
                  />

                  <TextField
                    label="Email"
                    type="email"
                    className="form-input"
                    {...register("email")}
                    focused
                    sx={{
                      width: {
                        lg: "100%",
                        md: "48.4%",
                        xs: "100%",
                      },
                    }}
                  />

                  <TextField
                    label="Phone"
                    type="text"
                    {...register("phone")}
                    className="form-input"
                    focused
                    sx={{
                      width: {
                        lg: "100%",
                        md: "48.4%",
                        xs: "100%",
                      },
                    }}
                  />

                  <Box
                    display={"flex"}
                    justifyContent={"center"}
                    alignItems={"center"}
                    width={150}
                    sx={{
                      cursor: "pointer",
                      width: {
                        lg: 150,
                        xs: "auto",
                      },
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="1.4em"
                      height="1.4em"
                      viewBox="0 0 24 24"
                    >
                      <g fill="none">
                        <path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z" />
                        <path
                          fill="#ff0000"
                          d="M14.28 2a2 2 0 0 1 1.897 1.368L16.72 5H20a1 1 0 1 1 0 2l-.003.071l-.867 12.143A3 3 0 0 1 16.138 22H7.862a3 3 0 0 1-2.992-2.786L4.003 7.07L4 7a1 1 0 0 1 0-2h3.28l.543-1.632A2 2 0 0 1 9.721 2zm3.717 5H6.003l.862 12.071a1 1 0 0 0 .997.929h8.276a1 1 0 0 0 .997-.929zM10 10a1 1 0 0 1 .993.883L11 11v5a1 1 0 0 1-1.993.117L9 16v-5a1 1 0 0 1 1-1m4 0a1 1 0 0 1 1 1v5a1 1 0 1 1-2 0v-5a1 1 0 0 1 1-1m.28-6H9.72l-.333 1h5.226z"
                        />
                      </g>
                    </svg>
                  </Box>
                </Stack>
              );
            })} */}
            {fields.map((item, index) => (
              <Stack
                key={item.id}
                display={"flex"}
                direction={"row"}
                sx={{
                  width: "100%",
                  marginBottom: 2,
                  gap: 1.5,
                  justifyContent: {
                    lg: "center",
                    xs: "end",
                  },
                  flexWrap: {
                    lg: "nowrap",
                    xs: "wrap",
                  },
                }}
              >
                <Box sx={{ width: "100%" }}>
                  <TextField
                    label="Name"
                    type="text"
                    className="form-input"
                    {...register(`contacts.${index}.name` as const, {
                      required: true,
                    })}
                    focused
                    sx={{
                      width: {
                        lg: "100%",
                        md: "48.4%",
                        xs: "100%",
                      },
                    }}
                  />
                  {errors &&
                    errors?.contacts &&
                    errors?.contacts[index] &&
                    errors?.contacts[index]?.name &&
                    errors?.contacts[index]?.name.type === "required" && (
                      <Typography
                        variant="body2"
                        color="red"
                        fontSize={13}
                        mt={0.5}
                      >
                        This field is required.
                      </Typography>
                    )}
                </Box>

                <Box width={"100%"}>
                  <TextField
                    label="Role"
                    type="text"
                    className="form-input"
                    {...register(`contacts.${index}.role` as const, {
                      required: true,
                    })}
                    focused
                    sx={{
                      width: {
                        lg: "100%",
                        md: "48.4%",
                        xs: "100%",
                      },
                    }}
                  />
                  {errors &&
                    errors?.contacts &&
                    errors?.contacts[index] &&
                    errors?.contacts[index]?.role &&
                    errors?.contacts[index]?.role.type === "required" && (
                      <Typography
                        variant="body2"
                        color="red"
                        fontSize={13}
                        mt={0.5}
                      >
                        This field is required.
                      </Typography>
                    )}
                </Box>

                <Box width={"100%"}>
                  <TextField
                    label="Email"
                    type="email"
                    className="form-input"
                    {...register(`contacts.${index}.email` as const, {
                      required: true,
                    })}
                    focused
                    sx={{
                      width: {
                        lg: "100%",
                        md: "48.4%",
                        xs: "100%",
                      },
                    }}
                  />
                  {errors &&
                    errors?.contacts &&
                    errors?.contacts[index] &&
                    errors?.contacts[index]?.email &&
                    errors?.contacts[index]?.email.type === "required" && (
                      <Typography
                        variant="body2"
                        color="red"
                        fontSize={13}
                        mt={0.5}
                      >
                        This field is required.
                      </Typography>
                    )}
                </Box>

                <Box width={"100%"}>
                  <TextField
                    label="Phone"
                    type="text"
                    className="form-input"
                    {...register(`contacts.${index}.phone` as const, {
                      required: true,
                    })}
                    focused
                    sx={{
                      width: {
                        lg: "100%",
                        md: "48.4%",
                        xs: "100%",
                      },
                    }}
                  />
                  {errors &&
                    errors?.contacts &&
                    errors?.contacts[index] &&
                    errors?.contacts[index]?.phone &&
                    errors?.contacts[index]?.phone.type === "required" && (
                      <Typography
                        variant="body2"
                        color="red"
                        fontSize={13}
                        mt={0.5}
                      >
                        This field is required.
                      </Typography>
                    )}
                </Box>

                <Box
                  display={"flex"}
                  justifyContent={"center"}
                  alignItems={"center"}
                  width={150}
                  sx={{
                    cursor: "pointer",
                    width: {
                      lg: 150,
                      xs: "auto",
                    },
                  }}
                  onClick={() => remove(index)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="1.4em"
                    height="1.4em"
                    viewBox="0 0 24 24"
                  >
                    <g fill="none">
                      <path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z" />
                      <path
                        fill="#ff0000"
                        d="M14.28 2a2 2 0 0 1 1.897 1.368L16.72 5H20a1 1 0 1 1 0 2l-.003.071l-.867 12.143A3 3 0 0 1 16.138 22H7.862a3 3 0 0 1-2.992-2.786L4.003 7.07L4 7a1 1 0 0 1 0-2h3.28l.543-1.632A2 2 0 0 1 9.721 2zm3.717 5H6.003l.862 12.071a1 1 0 0 0 .997.929h8.276a1 1 0 0 0 .997-.929zM10 10a1 1 0 0 1 .993.883L11 11v5a1 1 0 0 1-1.993.117L9 16v-5a1 1 0 0 1 1-1m4 0a1 1 0 0 1 1 1v5a1 1 0 1 1-2 0v-5a1 1 0 0 1 1-1m.28-6H9.72l-.333 1h5.226z"
                      />
                    </g>
                  </svg>
                </Box>
              </Stack>
            ))}

            <Divider
              sx={{
                borderColor: "#979797",
                my: 1,
              }}
            />

            <Stack
              p={1.5}
              direction={"row"}
              borderRadius={3}
              mt={2}
              color={"#06a19b"}
              fontSize={14}
              fontWeight={500}
              display={"flex"}
              alignItems={"center"}
              justifyContent={"center"}
              gap={0.5}
              border={"2px dashed #06a19b"}
              className="add-contact-btn"
              onClick={() =>
                append({ name: "", role: "", email: "", phone: "" })
              }
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1.4em"
                height="1.4em"
                viewBox="0 0 24 24"
              >
                <path
                  fill="#06a19b"
                  d="M12 4c4.411 0 8 3.589 8 8s-3.589 8-8 8s-8-3.589-8-8s3.589-8 8-8m0-2C6.477 2 2 6.477 2 12s4.477 10 10 10s10-4.477 10-10S17.523 2 12 2m5 9h-4V7h-2v4H7v2h4v4h2v-4h4z"
                />
              </svg>
              Add Contact
            </Stack>

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
                marginLeft: "auto",
                display: "block",
                marginTop: 2,
              }}
            >
              Save Changes
            </Button>
          </form>
        </Grid>
      </Grid>
    </Stack>
  );
};

export default Page;
