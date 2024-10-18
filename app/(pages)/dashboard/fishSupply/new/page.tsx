"use client";
import BasicBreadcrumbs from "@/app/_components/Breadcrumbs";
import Loader from "@/app/_components/Loader";
import { Status } from "@/app/_lib/utils";
import { Farm } from "@/app/_typeModels/Farm";
import { SingleOrganisation } from "@/app/_typeModels/Organization";
import {
  Box,
  Button,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { Dayjs } from "dayjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
interface FormInputs {
  organisation: String;
  hatchingDate: Dayjs | null;
  spawningDate: Dayjs | null;
  spawningNumber: String;
  age: String;
  broodstockMale: String;
  broodstockFemale: String;
  fishFarm: String;
  status: String;
}
export default function Page() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [allOrganisations, SetAllOrganisations] =
    useState<SingleOrganisation[]>();
  const [allFarms, setAllFarms] = useState<Farm[]>();
  const getOrganisation = async () => {
    const response = await fetch("/api/organisation/hatchery");
    return response.json();
  };
  const getFarms = async () => {
    const response = await fetch("/api/farm");
    return response.json();
  };
  const { register, handleSubmit, control } = useForm<FormInputs>({
    defaultValues: { hatchingDate: null },
  });

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    const { hatchingDate, spawningDate, spawningNumber, ...restData } = data;
    const payload = {
      hatchingDate: data.hatchingDate?.format("MM/DD/YYYY"),
      spawningDate: data.spawningDate?.format("MM/DD/YYYY"),
      spawningNumber: Number(data.spawningNumber),
      ...restData,
    };

    const response = await fetch(`/api/fish`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
    console.log(response);

    if (response.ok) {
      const res = await response.json();
      toast.success(res.message);
      router.push("/dashboard/fishSupply");
    }
  };
  useEffect(() => {
    setLoading(true);
    const organisations = async () => {
      const res = await getOrganisation();
      SetAllOrganisations(res.data);
      setLoading(false);
    };
    const farms = async () => {
      const res = await getFarms();
      setAllFarms(res.data);
    };
    organisations();
    farms();

    return () => {
      setLoading(false);
    };
  }, []);
  if (loading) {
    return <Loader />;
  }
  console.log(allFarms);

  return (
    <>
      <BasicBreadcrumbs
        heading={"Hatchery"}
        hideSearchInput={true}
        links={[
          { name: "Dashboard", link: "/dashboard" },
          { name: "Fish Supply", link: "/dashboard/fishSupply" },
          { name: "New", link: "/dashboard/fishSupply/new" },
        ]}
      />

      <Stack
        sx={{
          borderRadius: "14px",
          boxShadow: "0px 0px 16px 5px #0000001A",
          my: 4,
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

        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid
            container
            spacing={2}
            sx={{
              p: {
                md: 3,
                xs: 2,
              },
            }}
          >
            <Grid item sm={6} xs={12}>
              <Box width={"100%"}>
                <FormControl fullWidth className="form-input">
                  <InputLabel id="demo-simple-select-label">
                    Organisation *
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    {...register("organisation")}
                    // value={selectedOrganisation}
                    label="Organisation *"
                    // {...register("organisationId", {
                    //   required: true,
                    // })}
                    // onChange={handleChange}
                  >
                    {allOrganisations?.map((organisation, i) => {
                      return (
                        <MenuItem value={Number(organisation.id)} key={i}>
                          {organisation.name}
                        </MenuItem>
                      );
                    })}
                  </Select>
                  {/* {errors &&
                      errors.organisationId &&
                      errors.organisationId.type === "required" && (
                        <Typography
                          variant="body2"
                          color="red"
                          fontSize={13}
                          mt={0.5}
                        >
                          This field is required.
                        </Typography>
                      )} */}
                </FormControl>
                {/* {addUserError && (
                    <Typography
                      variant="body2"
                      color="red"
                      fontSize={13}
                      mt={0.5}
                    >
                      {addUserError}
                    </Typography>
                  )} */}
              </Box>
            </Grid>

            <Grid item sm={6} xs={12}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Controller
                  name="hatchingDate"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      {...field}
                      label="Hatching Date *"
                      className="form-input"
                      sx={{
                        width: "100%",
                      }}
                      onChange={(date) => field.onChange(date)}
                      value={field.value || null} // To handle the case when field.value is undefined
                      focused
                    />
                  )}
                />
              </LocalizationProvider>
            </Grid>

            <Grid item sm={6} xs={12}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Controller
                  name="spawningDate"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      {...field}
                      label="Spawning Date "
                      className="form-input"
                      sx={{
                        width: "100%",
                      }}
                      onChange={(date) => field.onChange(date)}
                      value={field.value || null} // To handle the case when field.value is undefined
                      focused
                    />
                  )}
                />
              </LocalizationProvider>
            </Grid>

            <Grid item sm={6} xs={12}>
              <Box width={"100%"}>
                <TextField
                  label="Spawning Number *"
                  {...register("spawningNumber")}
                  type="number"
                  className="form-input"
                  // {...register("organisationName", {
                  //   required: true,
                  // })}
                  // focused={userData?.data.name ? true : false}
                  // value={userData?.data.name}
                  sx={{
                    width: "100%",
                  }}
                />

                {/* {errors &&
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
)} */}
              </Box>
            </Grid>

            <Grid item sm={6} xs={12}>
              <Box width={"100%"}>
                <TextField
                  label="Age *"
                  type="number"
                  className="form-input"
                  {...register("age")}
                  // {...register("organisationName", {
                  //   required: true,
                  // })}
                  // focused={userData?.data.name ? true : false}
                  // value={userData?.data.name}
                  sx={{
                    width: "100%",
                  }}
                />

                {/* {errors &&
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
)} */}
              </Box>
            </Grid>

            <Grid item sm={6} xs={12}>
              <Box width={"100%"}>
                <TextField
                  label="Broodstock (Male) *"
                  type="text"
                  className="form-input"
                  {...register("broodstockMale")}
                  // {...register("organisationName", {
                  //   required: true,
                  // })}
                  // focused={userData?.data.name ? true : false}
                  // value={userData?.data.name}
                  sx={{
                    width: "100%",
                  }}
                />

                {/* {errors &&
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
)} */}
              </Box>
            </Grid>

            <Grid item sm={6} xs={12}>
              <Box width={"100%"}>
                <TextField
                  label="Broodstock (Female) *"
                  type="text"
                  className="form-input"
                  {...register("broodstockFemale")}
                  // {...register("organisationName", {
                  //   required: true,
                  // })}
                  // focused={userData?.data.name ? true : false}
                  // value={userData?.data.name}
                  sx={{
                    width: "100%",
                  }}
                />

                {/* {errors &&
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
)} */}
              </Box>
            </Grid>

            {/* <Grid item sm={6} xs={12}>
              <FormControl className="form-input" fullWidth>
                <InputLabel id="demo-simple-select-label">
                  Hatchery *
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Hatchery *"
                  
                >
              
                </Select>
              </FormControl>
            </Grid> */}

            <Grid item sm={6} xs={12}>
              <FormControl className="form-input" fullWidth>
                <InputLabel id="demo-simple-select-label">
                  Fish Farm *
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Fish Farm *"
                  {...register("fishFarm")}
                  // value={selectedOrganisationType || ""}
                  // onChange={(e) => handleChange(e, item)}
                  // sx={{
                  //   px: {
                  //     xl: 10,
                  //     md: 5,
                  //     xs: 3,
                  //   },
                  // }}
                >
                  {allFarms?.map((farm, i) => {
                    return (
                      <MenuItem value={String(farm.id)} key={i}>
                        {farm.name}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Grid>

            <Grid item sm={6} xs={12}>
              <FormControl className="form-input" fullWidth>
                <InputLabel id="demo-simple-select-label">Status *</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Status *"
                  {...register("status")}
                  // {...register("organisationType")}
                  // value={selectedOrganisationType || ""}
                  // onChange={(e) => handleChange(e, item)}
                  // sx={{
                  //   px: {
                  //     xl: 10,
                  //     md: 5,
                  //     xs: 3,
                  //   },
                  // }}
                >
                  {Status.map((status, i) => {
                    return (
                      <MenuItem value={status} key={i}>
                        {status}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Grid>
          </Grid>

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
              mb: 5,
              mr: {
                md: 3,
                xs: 2,
              },
            }}
          >
            Add Batch
          </Button>
        </form>
      </Stack>
    </>
  );
}
