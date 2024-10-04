import {
  feedingPhase,
  lifeStage,
  nutritionalClass,
  nutritionalGuarantee,
  nutritionalPurpose,
  ProductFormatCode,
  productionIntensity,
  species,
  units,
} from "@/app/_lib/utils";
import { useAppDispatch } from "@/lib/hooks";
import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { NextPage } from "next";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import Loader from "../Loader";
import { getCookie } from "cookies-next";
import toast from "react-hot-toast";
import * as validationPattern from "@/app/_lib/utils/validationPatterns/index";
import * as validationMessage from "@/app/_lib/utils/validationsMessage/index";
interface Props {
  setActiveStep: (val: number) => void;
  editFarm?: any;
}
interface nutritionalGuarantee {
  moisture: { kg: String; value: String };
  crudeProtein: { kg: String; value: String };
  crudeFat: { kg: String; value: String };
  crudeAsh: { kg: String; value: String };
  calcium: { kg: String; value: String };
  phosphorous: { kg: String; value: String };
  carbohydrates: { kg: String; value: String };
  metabolizableEnergy: { kg: String; value: String };
}
interface FormInputs {
  feedIngredients: String;
  feedingGuide: String;
  productionIntensity: String;
  unit: String;
  feedingPhase: String;
  lifeStage: String;
  shelfLife: String;
  productCode: String;
  feedSupplierCode: String;
  brandCode: String;
  productNameCode: String;
  productFormatCode: String;
  animalSizeInLength: String;
  animalSizeInWeight: String;
  specie: String;
  nutritionalPurpose: String;
  nutritionalClass: String;
  particleSize: String;
  productFormat: String;
  productName: String;
  brandName: String;
  feedSupplier: String;
  nutritionalGuarantee: nutritionalGuarantee;
}
const NewFeed: NextPage<Props> = ({ setActiveStep, editFarm }) => {
  const dispatch = useAppDispatch();
  const loggedUser: any = getCookie("logged-user");

  const [loading, setLoading] = useState<boolean>(false);
  const [feedSuppliers, setFeedSuppliers] = useState<any>();
  const {
    register,

    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormInputs>();
  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    const loggedUserData = JSON.parse(loggedUser);
    if (data) {
      const response = await fetch("/api/feed/new-feed", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          createdBy: String(loggedUserData.data.user.id),
        }),
      });
      const res = await response.json();
      if (res.status) {
        toast.success(res.message);
        reset();
      }
      console.log(res);
    }
  };

  const getFeedSuppliers = async () => {
    const response = await fetch(`/api/organisation/feedSuppliers`);
    const res = response.json();
    return res;
  };
  useEffect(() => {
    setLoading(true);
    const feedSupplierGetter = async () => {
      const res = await getFeedSuppliers();
      setFeedSuppliers(res.data);
      setLoading(false);
    };
    feedSupplierGetter();
  }, []);

  if (loading) {
    return <Loader />;
  }
  return (
    <>
      <Stack>
        <Typography
          variant="h6"
          fontWeight={700}
          sx={{
            fontSize: {
              md: 24,
              xs: 20,
            },
            marginBottom: 3,
          }}
        >
          Feed Specification
        </Typography>

        <Box>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2}>
              <Grid item md={6} xs={12}>
                <FormControl fullWidth className="form-input">
                  <InputLabel id="feed-supply-select-label1">
                    Feed Supplier
                  </InputLabel>
                  <Select
                    labelId="feed-supply-select-label1"
                    id="feed-supply-select1"
                    {...register("feedSupplier", {
                      required: true,
                    })}
                    label="Feed Supplier"
                  >
                    {feedSuppliers?.map((supplier: any) => {
                      return (
                        <MenuItem value={String(supplier.id)} key={supplier.id}>
                          {supplier.name}
                        </MenuItem>
                      );
                    })}
                  </Select>
                  {errors &&
                    errors.feedSupplier &&
                    errors.feedSupplier.type === "required" && (
                      <Typography
                        variant="body2"
                        color="red"
                        fontSize={13}
                        mt={0.5}
                      >
                        {validationMessage.required}
                      </Typography>
                    )}
                </FormControl>
              </Grid>

              <Grid item md={6} xs={12}>
                <TextField
                  label="Feed Supplier Code"
                  type="text"
                  className="form-input"
                  {...register("feedSupplierCode", {
                    required: true,
                  })}
                  // {...register("organisationName", {
                  //     required: true,
                  // })}
                  // focused={userData?.data.name ? true : false}
                  // value={userData?.data.name}
                  sx={{
                    width: "100%",
                  }}
                />
                {errors &&
                  errors.feedSupplierCode &&
                  errors.feedSupplierCode.type === "required" && (
                    <Typography
                      variant="body2"
                      color="red"
                      fontSize={13}
                      mt={0.5}
                    >
                      {validationMessage.required}
                    </Typography>
                  )}
              </Grid>

              <Grid item md={6} xs={12}>
                <TextField
                  label="Brand Name"
                  type="text"
                  className="form-input"
                  {...register("brandName", {
                    required: true,
                  })}
                  // {...register("organisationName", {
                  //     required: true,
                  // })}
                  // focused={userData?.data.name ? true : false}
                  // value={userData?.data.name}
                  sx={{
                    width: "100%",
                  }}
                />
                {errors &&
                  errors.brandName &&
                  errors.brandName.type === "required" && (
                    <Typography
                      variant="body2"
                      color="red"
                      fontSize={13}
                      mt={0.5}
                    >
                      {validationMessage.required}
                    </Typography>
                  )}
              </Grid>

              <Grid item md={6} xs={12}>
                <TextField
                  label="Brand Code"
                  type="text"
                  className="form-input"
                  {...register("brandCode", {
                    required: true,
                  })}
                  // {...register("organisationName", {
                  //     required: true,
                  // })}
                  // focused={userData?.data.name ? true : false}
                  // value={userData?.data.name}
                  sx={{
                    width: "100%",
                  }}
                />
                {errors &&
                  errors.brandCode &&
                  errors.brandCode.type === "required" && (
                    <Typography
                      variant="body2"
                      color="red"
                      fontSize={13}
                      mt={0.5}
                    >
                      {validationMessage.required}
                    </Typography>
                  )}
              </Grid>

              <Grid item md={6} xs={12}>
                <TextField
                  label="Product Name"
                  type="text"
                  className="form-input"
                  {...register("productName", {
                    required: true,
                  })}
                  // {...register("organisationName", {
                  //     required: true,
                  // })}
                  // focused={userData?.data.name ? true : false}
                  // value={userData?.data.name}
                  sx={{
                    width: "100%",
                  }}
                />
                {errors &&
                  errors.productName &&
                  errors.productName.type === "required" && (
                    <Typography
                      variant="body2"
                      color="red"
                      fontSize={13}
                      mt={0.5}
                    >
                      {validationMessage.required}
                    </Typography>
                  )}
              </Grid>

              <Grid item md={6} xs={12}>
                <TextField
                  label="Product Code"
                  type="text"
                  className="form-input"
                  {...register("productCode", {
                    required: true,
                  })}
                  // {...register("organisationName", {
                  //     required: true,
                  // })}
                  // focused={userData?.data.name ? true : false}
                  // value={userData?.data.name}
                  sx={{
                    width: "100%",
                  }}
                />
                {errors &&
                  errors.productCode &&
                  errors.productCode.type === "required" && (
                    <Typography
                      variant="body2"
                      color="red"
                      fontSize={13}
                      mt={0.5}
                    >
                      {validationMessage.required}
                    </Typography>
                  )}
              </Grid>

              <Grid item md={6} xs={12}>
                <TextField
                  label="Product Name Code"
                  type="text"
                  className="form-input"
                  {...register("productNameCode", {
                    required: true,
                  })}
                  // {...register("organisationName", {
                  //     required: true,
                  // })}
                  // focused={userData?.data.name ? true : false}
                  // value={userData?.data.name}
                  sx={{
                    width: "100%",
                  }}
                />
                {errors &&
                  errors.productNameCode &&
                  errors.productNameCode.type === "required" && (
                    <Typography
                      variant="body2"
                      color="red"
                      fontSize={13}
                      mt={0.5}
                    >
                      {validationMessage.required}
                    </Typography>
                  )}
              </Grid>

              <Grid item md={6} xs={12}>
                <FormControl fullWidth className="form-input">
                  <InputLabel id="feed-supply-select-label2">
                    Product Format
                  </InputLabel>
                  <Select
                    labelId="feed-supply-select-label2"
                    id="feed-supply-select2"
                    label="Product Format"
                    {...register("productFormat", {
                      required: true,
                    })}
                  >
                    {ProductFormatCode.map((format, i) => {
                      return (
                        <MenuItem value={format} key={i}>
                          {format}
                        </MenuItem>
                      );
                    })}
                  </Select>
                  {errors &&
                    errors.productFormat &&
                    errors.productFormat.type === "required" && (
                      <Typography
                        variant="body2"
                        color="red"
                        fontSize={13}
                        mt={0.5}
                      >
                        {validationMessage.required}
                      </Typography>
                    )}
                </FormControl>
              </Grid>

              <Grid item md={6} xs={12}>
                <TextField
                  label="Product Format Code"
                  type="text"
                  className="form-input"
                  {...register("productFormatCode", {
                    required: true,
                  })}
                  // {...register("organisationName", {
                  //     required: true,
                  // })}
                  // focused={userData?.data.name ? true : false}
                  // value={userData?.data.name}
                  sx={{
                    width: "100%",
                  }}
                />
                {errors &&
                  errors.productFormatCode &&
                  errors.productFormatCode.type === "required" && (
                    <Typography
                      variant="body2"
                      color="red"
                      fontSize={13}
                      mt={0.5}
                    >
                      {validationMessage.required}
                    </Typography>
                  )}
              </Grid>

              <Grid item md={6} xs={12}>
                <Box
                  display={"flex"}
                  gap={2}
                  alignItems={"center"}
                  position={"relative"}
                >
                  <TextField
                    label="Particle Size"
                    type="text"
                    className="form-input"
                    {...register("particleSize", {
                      required: true,
                    })}
                    // {...register("organisationName", {
                    //     required: true,
                    // })}
                    // focused={userData?.data.name ? true : false}
                    // value={userData?.data.name}
                    sx={{
                      width: "100%",
                    }}
                  />

                  <Typography
                    variant="body2"
                    color="#555555AC"
                    sx={{
                      position: "absolute",
                      right: 6,
                      top: "50%",
                      transform: "translate(-6px, -50%)",
                      backgroundColor: "#fff",
                      height: 30,
                      display: "grid",
                      placeItems: "center",
                      zIndex: 1,
                      pl: 1,
                    }}
                  >
                    mm
                  </Typography>
                </Box>
                {errors &&
                  errors.particleSize &&
                  errors.particleSize.type === "required" && (
                    <Typography
                      variant="body2"
                      color="red"
                      fontSize={13}
                      mt={0.5}
                    >
                      {validationMessage.required}
                    </Typography>
                  )}
              </Grid>

              <Grid item md={6} xs={12}>
                <FormControl fullWidth className="form-input">
                  <InputLabel id="feed-supply-select-label3">
                    Nutritional Class
                  </InputLabel>
                  <Select
                    labelId="feed-supply-select-label3"
                    id="feed-supply-select3"
                    label="Nutritional Class"
                    {...register("nutritionalClass", {
                      required: true,
                    })}
                  >
                    {nutritionalClass.map((nutritional, i) => {
                      return (
                        <MenuItem value={nutritional} key={i}>
                          {nutritional}
                        </MenuItem>
                      );
                    })}
                  </Select>
                  {errors &&
                    errors.nutritionalClass &&
                    errors.nutritionalClass.type === "required" && (
                      <Typography
                        variant="body2"
                        color="red"
                        fontSize={13}
                        mt={0.5}
                      >
                        {validationMessage.required}
                      </Typography>
                    )}
                </FormControl>
              </Grid>

              <Grid item md={6} xs={12}>
                <FormControl fullWidth className="form-input">
                  <InputLabel id="feed-supply-select-label4">
                    Nutritional Purpose
                  </InputLabel>
                  <Select
                    labelId="feed-supply-select-label4"
                    id="feed-supply-select4"
                    label="Nutritional Purpose"
                    {...register("nutritionalPurpose", {
                      required: true,
                    })}
                  >
                    {nutritionalPurpose.map((intensity, i) => {
                      return (
                        <MenuItem value={intensity} key={i}>
                          {intensity}
                        </MenuItem>
                      );
                    })}
                  </Select>
                  {errors &&
                    errors.nutritionalPurpose &&
                    errors.nutritionalPurpose.type === "required" && (
                      <Typography
                        variant="body2"
                        color="red"
                        fontSize={13}
                        mt={0.5}
                      >
                        {validationMessage.required}
                      </Typography>
                    )}
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle1" fontWeight={500}>
                  Suitability
                </Typography>
              </Grid>

              <Grid item md={6} xs={12}>
                <FormControl fullWidth className="form-input">
                  <InputLabel id="feed-supply-select-label5">
                    Species
                  </InputLabel>
                  <Select
                    labelId="feed-supply-select-label5"
                    id="feed-supply-select5"
                    label="Specie"
                    {...register("specie", {
                      required: true,
                    })}
                  >
                    {species.map((specie, i) => {
                      return (
                        <MenuItem value={specie} key={i}>
                          {specie}
                        </MenuItem>
                      );
                    })}
                  </Select>
                  {errors &&
                    errors.specie &&
                    errors.specie.type === "required" && (
                      <Typography
                        variant="body2"
                        color="red"
                        fontSize={13}
                        mt={0.5}
                      >
                        {validationMessage.required}
                      </Typography>
                    )}
                </FormControl>
              </Grid>

              <Grid item md={6} xs={12}>
                <Box
                  display={"flex"}
                  gap={2}
                  alignItems={"center"}
                  position={"relative"}
                >
                  <TextField
                    label="Animal Size (Length)"
                    type="text"
                    className="form-input"
                    {...register("animalSizeInLength", {
                      required: true,
                    })}
                    // {...register("organisationName", {
                    //     required: true,
                    // })}
                    // focused={userData?.data.name ? true : false}
                    // value={userData?.data.name}
                    sx={{
                      width: "100%",
                    }}
                  />

                  <Typography
                    variant="body2"
                    color="#555555AC"
                    sx={{
                      position: "absolute",
                      right: 6,
                      top: "50%",
                      transform: "translate(-6px, -50%)",
                      backgroundColor: "#fff",
                      height: 30,
                      display: "grid",
                      placeItems: "center",
                      zIndex: 1,
                      pl: 1,
                    }}
                  >
                    mm
                  </Typography>
                </Box>
                {errors &&
                  errors.animalSizeInLength &&
                  errors.animalSizeInLength.type === "required" && (
                    <Typography
                      variant="body2"
                      color="red"
                      fontSize={13}
                      mt={0.5}
                    >
                      {validationMessage.required}
                    </Typography>
                  )}
              </Grid>

              <Grid item md={6} xs={12}>
                <Box
                  display={"flex"}
                  gap={2}
                  alignItems={"center"}
                  position={"relative"}
                >
                  <TextField
                    label="Animal Size (Weight)"
                    type="text"
                    className="form-input"
                    {...register("animalSizeInWeight", {
                      required: true,
                    })}
                    // {...register("organisationName", {
                    //     required: true,
                    // })}
                    // focused={userData?.data.name ? true : false}
                    // value={userData?.data.name}
                    sx={{
                      width: "100%",
                    }}
                  />

                  <Typography
                    variant="body2"
                    color="#555555AC"
                    sx={{
                      position: "absolute",
                      right: 6,
                      top: "50%",
                      transform: "translate(-6px, -50%)",
                      backgroundColor: "#fff",
                      height: 30,
                      display: "grid",
                      placeItems: "center",
                      zIndex: 1,
                      pl: 1,
                    }}
                  >
                    g
                  </Typography>
                </Box>
                {errors &&
                  errors.animalSizeInWeight &&
                  errors.animalSizeInWeight.type === "required" && (
                    <Typography
                      variant="body2"
                      color="red"
                      fontSize={13}
                      mt={0.5}
                    >
                      {validationMessage.required}
                    </Typography>
                  )}
              </Grid>

              <Grid item md={6} xs={12}>
                <FormControl fullWidth className="form-input">
                  <InputLabel id="feed-supply-select-label6">
                    Production Intensity
                  </InputLabel>
                  <Select
                    labelId="feed-supply-select-label6"
                    id="feed-supply-select6"
                    {...register("productionIntensity", {
                      required: true,
                    })}
                    label="Production Intensity"
                  >
                    {productionIntensity.map((intensity, i) => {
                      return (
                        <MenuItem value={intensity} key={i}>
                          {intensity}
                        </MenuItem>
                      );
                    })}
                  </Select>
                  {errors &&
                    errors.animalSizeInWeight &&
                    errors.animalSizeInWeight.type === "required" && (
                      <Typography
                        variant="body2"
                        color="red"
                        fontSize={13}
                        mt={0.5}
                      >
                        {validationMessage.required}
                      </Typography>
                    )}
                </FormControl>
              </Grid>

              <Grid item md={6} xs={12}>
                <FormControl fullWidth className="form-input">
                  <InputLabel id="feed-supply-select-label7">Unit</InputLabel>
                  <Select
                    labelId="feed-supply-select-label7"
                    id="feed-supply-select7"
                    {...register("unit", {
                      required: true,
                    })}
                    label="Unit"
                  >
                    {units.map((unit, i) => {
                      return (
                        <MenuItem value={unit} key={i}>
                          {unit}
                        </MenuItem>
                      );
                    })}
                  </Select>
                  {errors && errors.unit && errors.unit.type === "required" && (
                    <Typography
                      variant="body2"
                      color="red"
                      fontSize={13}
                      mt={0.5}
                    >
                      {validationMessage.required}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              <Grid item md={6} xs={12}>
                <FormControl fullWidth className="form-input">
                  <InputLabel id="feed-supply-select-label8">
                    Feeding Phase
                  </InputLabel>
                  <Select
                    labelId="feed-supply-select-label8"
                    id="feed-supply-select8"
                    {...register("feedingPhase", {
                      required: true,
                    })}
                    label="Feeding Phase"
                  >
                    {feedingPhase.map((intensity, i) => {
                      return (
                        <MenuItem value={intensity} key={i}>
                          {intensity}
                        </MenuItem>
                      );
                    })}
                  </Select>
                  {errors &&
                    errors.feedingPhase &&
                    errors.feedingPhase.type === "required" && (
                      <Typography
                        variant="body2"
                        color="red"
                        fontSize={13}
                        mt={0.5}
                      >
                        {validationMessage.required}
                      </Typography>
                    )}
                </FormControl>
              </Grid>

              <Grid item md={6} xs={12}>
                <FormControl fullWidth className="form-input">
                  <InputLabel id="feed-supply-select-label9">
                    Life Stage
                  </InputLabel>
                  <Select
                    labelId="feed-supply-select-label9"
                    id="feed-supply-select9"
                    label="Life Stage"
                    {...register("lifeStage", {
                      required: true,
                    })}
                  >
                    {lifeStage.map((stage, i) => {
                      return (
                        <MenuItem value={stage} key={i}>
                          {stage}
                        </MenuItem>
                      );
                    })}
                  </Select>
                  {errors &&
                    errors.lifeStage &&
                    errors.lifeStage.type === "required" && (
                      <Typography
                        variant="body2"
                        color="red"
                        fontSize={13}
                        mt={0.5}
                      >
                        {validationMessage.required}
                      </Typography>
                    )}
                </FormControl>
              </Grid>

              <Grid item md={6} xs={12}>
                <Box
                  display={"flex"}
                  gap={2}
                  alignItems={"center"}
                  position={"relative"}
                >
                  <TextField
                    label="Shelf Live (from date of manufacturing)"
                    type="text"
                    className="form-input"
                    {...register("shelfLife", {
                      required: true,
                    })}
                    // {...register("organisationName", {
                    //     required: true,
                    // })}
                    // focused={userData?.data.name ? true : false}
                    // value={userData?.data.name}
                    sx={{
                      width: "100%",
                    }}
                  />

                  <Typography
                    variant="body2"
                    color="#555555AC"
                    sx={{
                      position: "absolute",
                      right: 6,
                      top: "50%",
                      transform: "translate(-6px, -50%)",
                      backgroundColor: "#fff",
                      height: 30,
                      display: "grid",
                      placeItems: "center",
                      zIndex: 1,
                      pl: 1,
                    }}
                  >
                    months
                  </Typography>
                </Box>
                {errors &&
                  errors.shelfLife &&
                  errors.shelfLife.type === "required" && (
                    <Typography
                      variant="body2"
                      color="red"
                      fontSize={13}
                      mt={0.5}
                    >
                      {validationMessage.required}
                    </Typography>
                  )}
              </Grid>

              <Grid item lg={6} xs={12}>
                <TextField
                  label="Feed Ingredients"
                  type="text"
                  multiline
                  rows={5}
                  className="form-input"
                  {...register("feedIngredients", {
                    required: true,
                  })}
                  sx={{
                    width: "100%",
                  }}
                />
                {errors &&
                  errors.feedIngredients &&
                  errors.feedIngredients.type === "required" && (
                    <Typography
                      variant="body2"
                      color="red"
                      fontSize={13}
                      mt={0.5}
                    >
                      {validationMessage.required}
                    </Typography>
                  )}
              </Grid>

              <Grid item lg={6} xs={12}>
                <TextField
                  label="Feeding Guide"
                  type="text"
                  multiline
                  rows={5}
                  className="form-input"
                  sx={{
                    width: "100%",
                  }}
                  {...register("feedingGuide", {
                    required: true,
                  })}
                />
                {errors &&
                  errors.feedingGuide &&
                  errors.feedingGuide.type === "required" && (
                    <Typography
                      variant="body2"
                      color="red"
                      fontSize={13}
                      mt={0.5}
                    >
                      {validationMessage.required}
                    </Typography>
                  )}
              </Grid>
            </Grid>

            <Stack>
              <Typography
                variant="h6"
                fontWeight={700}
                sx={{
                  fontSize: {
                    md: 20,
                    xs: 18,
                  },
                  marginBottom: 3,
                  marginTop: 5,
                }}
              >
                Nutritional Guarantee
              </Typography>

              <Box
                sx={{
                  borderRadius: 3,
                  boxShadow: "0px 0px 16px 5px #0000001A",
                  padding: 3,
                }}
              >
                <Grid container rowSpacing={2} columnSpacing={2}>
                  <Grid
                    item
                    xl={6}
                    xs={12}
                    sx={{
                      display: "flex",
                      gap: 1.5,
                      alignItems: "center",
                      minWidth: "200px",
                      overflowX: "auto",
                      pb: 1.5,
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      fontWeight={600}
                      sx={{
                        minWidth: "14px",
                      }}
                    >
                      1.{" "}
                    </Typography>

                    <Box
                      // display={"flex"}
                      // gap={2}
                      // alignItems={"center"}
                      position={"relative"}
                    >
                      <TextField
                        label="Moisture"
                        type="number"
                        className="form-input"
                        {...register("nutritionalGuarantee.moisture.kg", {
                          required: true,
                        })}
                        sx={{
                          width: "100%",
                          minWidth: 190,
                        }}
                      />

                      {errors &&
                        errors?.nutritionalGuarantee?.moisture?.kg &&
                        errors.nutritionalGuarantee.moisture.kg.type ===
                          "required" && (
                          <Typography
                            variant="body2"
                            color="red"
                            fontSize={13}
                            mt={0.5}
                          >
                            {validationMessage.required}
                          </Typography>
                        )}

                      <Typography
                        variant="body2"
                        color="#555555AC"
                        sx={{
                          position: "absolute",
                          right: 6,
                          top: errors?.nutritionalGuarantee?.moisture?.kg
                            ? "35%"
                            : "50%",
                          transform: "translate(-6px, -50%)",
                          backgroundColor: "#fff",
                          height: 30,
                          display: "grid",
                          placeItems: "center",
                          zIndex: 1,
                          pl: 1,
                        }}
                      >
                        g/kg
                      </Typography>
                    </Box>

                    <Box width={"100%"}>
                      <FormControl
                        fullWidth
                        className="form-input"
                        sx={{
                          minWidth: 110,
                        }}
                      >
                        <InputLabel id="feed-supply-select-label10">
                          Min
                        </InputLabel>
                        <Select
                          labelId="feed-supply-select-label10"
                          id="feed-supply-select10"
                          {...register("nutritionalGuarantee.moisture.value", {
                            required: true,
                          })}
                          label="Min"
                        >
                          {nutritionalGuarantee.map((guarantee, i) => {
                            return (
                              <MenuItem value={guarantee} key={i}>
                                {guarantee}
                              </MenuItem>
                            );
                          })}
                        </Select>
                      </FormControl>
                      {errors &&
                        errors?.nutritionalGuarantee?.moisture?.value &&
                        errors?.nutritionalGuarantee?.moisture?.value.type ===
                          "required" && (
                          <Typography
                            variant="body2"
                            color="red"
                            fontSize={13}
                            mt={0.5}
                          >
                            {validationMessage.required}
                          </Typography>
                        )}
                    </Box>

                    <Box
                      fontSize={14}
                      fontWeight={500}
                      width="fit-content"
                      // onClick={handleClear}
                      style={{ cursor: "pointer" }}
                      sx={
                        {
                          // visibility: "hidden"
                        }
                      }
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="1.5em"
                        height="1.5em"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill="red"
                          d="M12 20c-4.41 0-8-3.59-8-8s3.59-8 8-8s8 3.59 8 8s-3.59 8-8 8m0-18C6.47 2 2 6.47 2 12s4.47 10 10 10s10-4.47 10-10S17.53 2 12 2m2.59 6L12 10.59L9.41 8L8 9.41L10.59 12L8 14.59L9.41 16L12 13.41L14.59 16L16 14.59L13.41 12L16 9.41z"
                        />
                      </svg>
                    </Box>
                  </Grid>

                  <Grid
                    item
                    xl={6}
                    xs={12}
                    sx={{
                      display: "flex",
                      gap: 1.5,
                      alignItems: "center",
                      minWidth: "200px",
                      overflowX: "auto",
                      pb: 1.5,
                    }}
                  >
                    <Typography variant="subtitle1" fontWeight={600}>
                      2.{" "}
                    </Typography>

                    <Box
                      // display={"flex"}
                      // gap={2}
                      // alignItems={"center"}
                      position={"relative"}
                    >
                      <TextField
                        label="Crude Protein"
                        type="number"
                        className="form-input"
                        {...register("nutritionalGuarantee.crudeProtein.kg", {
                          required: true,
                        })}
                        sx={{
                          width: "100%",
                          minWidth: 190,
                        }}
                      />
                      {errors &&
                        errors?.nutritionalGuarantee?.crudeProtein?.kg &&
                        errors.nutritionalGuarantee.crudeProtein.kg.type ===
                          "required" && (
                          <Typography
                            variant="body2"
                            color="red"
                            fontSize={13}
                            mt={0.5}
                          >
                            {validationMessage.required}
                          </Typography>
                        )}
                      <Typography
                        variant="body2"
                        color="#555555AC"
                        sx={{
                          position: "absolute",
                          right: 6,
                          top: errors?.nutritionalGuarantee?.crudeProtein?.kg
                            ? "35%"
                            : "50%",
                          transform: "translate(-6px, -50%)",
                          backgroundColor: "#fff",
                          height: 30,
                          display: "grid",
                          placeItems: "center",
                          zIndex: 1,
                          pl: 1,
                        }}
                      >
                        g/kg
                      </Typography>
                    </Box>

                    <FormControl
                      fullWidth
                      className="form-input"
                      sx={{
                        minWidth: 110,
                      }}
                    >
                      <InputLabel id="feed-supply-select-label10">
                        Min
                      </InputLabel>
                      <Select
                        labelId="feed-supply-select-label10"
                        id="feed-supply-select10"
                        label="Min"
                        {...register(
                          "nutritionalGuarantee.crudeProtein.value",
                          {
                            required: true,
                          }
                        )}
                      >
                        {nutritionalGuarantee.map((guarantee, i) => {
                          return (
                            <MenuItem value={guarantee} key={i}>
                              {guarantee}
                            </MenuItem>
                          );
                        })}
                      </Select>
                      {errors &&
                        errors?.nutritionalGuarantee?.crudeProtein?.value &&
                        errors.nutritionalGuarantee.crudeProtein.value.type ===
                          "required" && (
                          <Typography
                            variant="body2"
                            color="red"
                            fontSize={13}
                            mt={0.5}
                          >
                            {validationMessage.required}
                          </Typography>
                        )}
                    </FormControl>

                    <Box
                      fontSize={14}
                      fontWeight={500}
                      width="fit-content"
                      // onClick={handleClear}
                      style={{ cursor: "pointer" }}
                      sx={{
                        visibility: "hidden",
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="1.5em"
                        height="1.5em"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill="red"
                          d="M12 20c-4.41 0-8-3.59-8-8s3.59-8 8-8s8 3.59 8 8s-3.59 8-8 8m0-18C6.47 2 2 6.47 2 12s4.47 10 10 10s10-4.47 10-10S17.53 2 12 2m2.59 6L12 10.59L9.41 8L8 9.41L10.59 12L8 14.59L9.41 16L12 13.41L14.59 16L16 14.59L13.41 12L16 9.41z"
                        />
                      </svg>
                    </Box>
                  </Grid>

                  <Grid
                    item
                    xl={6}
                    xs={12}
                    sx={{
                      display: "flex",
                      gap: 1.5,
                      alignItems: "center",
                      minWidth: "200px",
                      overflowX: "auto",
                      pb: 1.5,
                    }}
                  >
                    <Typography variant="subtitle1" fontWeight={600}>
                      3.{" "}
                    </Typography>

                    <Box
                      // display={"flex"}
                      // gap={2}
                      // alignItems={"center"}
                      position={"relative"}
                    >
                      <TextField
                        label="Crude Fat"
                        type="number"
                        className="form-input"
                        {...register("nutritionalGuarantee.crudeFat.kg", {
                          required: true,
                        })}
                        sx={{
                          width: "100%",
                          minWidth: 190,
                        }}
                      />
                      {errors &&
                        errors?.nutritionalGuarantee?.crudeFat?.kg &&
                        errors?.nutritionalGuarantee?.crudeFat?.kg.type ===
                          "required" && (
                          <Typography
                            variant="body2"
                            color="red"
                            fontSize={13}
                            mt={0.5}
                          >
                            {validationMessage.required}
                          </Typography>
                        )}
                      <Typography
                        variant="body2"
                        color="#555555AC"
                        sx={{
                          position: "absolute",
                          right: 6,
                          top: errors?.nutritionalGuarantee?.crudeFat?.kg
                            ? "35%"
                            : "50%",
                          transform: "translate(-6px, -50%)",
                          backgroundColor: "#fff",
                          height: 30,
                          display: "grid",
                          placeItems: "center",
                          zIndex: 1,
                          pl: 1,
                        }}
                      >
                        g/kg
                      </Typography>
                    </Box>

                    <FormControl
                      fullWidth
                      className="form-input"
                      sx={{
                        minWidth: 110,
                      }}
                    >
                      <InputLabel id="feed-supply-select-label10">
                        Min
                      </InputLabel>
                      <Select
                        labelId="feed-supply-select-label10"
                        id="feed-supply-select10"
                        label="Min"
                        {...register("nutritionalGuarantee.crudeFat.value", {
                          required: true,
                        })}
                      >
                        {nutritionalGuarantee.map((guarantee, i) => {
                          return (
                            <MenuItem value={guarantee} key={i}>
                              {guarantee}
                            </MenuItem>
                          );
                        })}
                      </Select>
                      {errors &&
                        errors?.nutritionalGuarantee?.crudeFat?.value &&
                        errors?.nutritionalGuarantee?.crudeFat?.value.type ===
                          "required" && (
                          <Typography
                            variant="body2"
                            color="red"
                            fontSize={13}
                            mt={0.5}
                          >
                            {validationMessage.required}
                          </Typography>
                        )}
                    </FormControl>

                    <Box
                      fontSize={14}
                      fontWeight={500}
                      width="fit-content"
                      // onClick={handleClear}
                      style={{ cursor: "pointer" }}
                      sx={{
                        visibility: "hidden",
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="1.5em"
                        height="1.5em"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill="red"
                          d="M12 20c-4.41 0-8-3.59-8-8s3.59-8 8-8s8 3.59 8 8s-3.59 8-8 8m0-18C6.47 2 2 6.47 2 12s4.47 10 10 10s10-4.47 10-10S17.53 2 12 2m2.59 6L12 10.59L9.41 8L8 9.41L10.59 12L8 14.59L9.41 16L12 13.41L14.59 16L16 14.59L13.41 12L16 9.41z"
                        />
                      </svg>
                    </Box>
                  </Grid>

                  <Grid
                    item
                    xl={6}
                    xs={12}
                    sx={{
                      display: "flex",
                      gap: 1.5,
                      alignItems: "center",
                      minWidth: "200px",
                      overflowX: "auto",
                      pb: 1.5,
                    }}
                  >
                    <Typography variant="subtitle1" fontWeight={600}>
                      4.{" "}
                    </Typography>

                    <Box
                      // display={"flex"}
                      // gap={2}
                      // alignItems={"center"}
                      position={"relative"}
                    >
                      <TextField
                        label="Crude Ash"
                        type="number"
                        className="form-input"
                        {...register("nutritionalGuarantee.crudeAsh.kg", {
                          required: true,
                        })}
                        sx={{
                          width: "100%",
                          minWidth: 190,
                        }}
                      />
                      {errors &&
                        errors?.nutritionalGuarantee?.crudeAsh?.kg &&
                        errors?.nutritionalGuarantee?.crudeAsh.kg.type ===
                          "required" && (
                          <Typography
                            variant="body2"
                            color="red"
                            fontSize={13}
                            mt={0.5}
                          >
                            {validationMessage.required}
                          </Typography>
                        )}
                      <Typography
                        variant="body2"
                        color="#555555AC"
                        sx={{
                          position: "absolute",
                          right: 6,
                          top: errors?.nutritionalGuarantee?.crudeAsh?.kg
                            ? "35%"
                            : "50%",
                          transform: "translate(-6px, -50%)",
                          backgroundColor: "#fff",
                          height: 30,
                          display: "grid",
                          placeItems: "center",
                          zIndex: 1,
                          pl: 1,
                        }}
                      >
                        g/kg
                      </Typography>
                    </Box>

                    <FormControl
                      fullWidth
                      className="form-input"
                      sx={{
                        minWidth: 110,
                      }}
                    >
                      <InputLabel id="feed-supply-select-label10">
                        Min
                      </InputLabel>
                      <Select
                        labelId="feed-supply-select-label10"
                        id="feed-supply-select10"
                        {...register("nutritionalGuarantee.crudeAsh.value", {
                          required: true,
                        })}
                        label="Min"
                        // onChange={handleChange}
                      >
                        {nutritionalGuarantee.map((guarantee, i) => {
                          return (
                            <MenuItem value={guarantee} key={i}>
                              {guarantee}
                            </MenuItem>
                          );
                        })}
                      </Select>
                      {errors &&
                        errors?.nutritionalGuarantee?.crudeAsh?.value &&
                        errors?.nutritionalGuarantee?.crudeAsh.value.type ===
                          "required" && (
                          <Typography
                            variant="body2"
                            color="red"
                            fontSize={13}
                            mt={0.5}
                          >
                            {validationMessage.required}
                          </Typography>
                        )}
                    </FormControl>

                    <Box
                      fontSize={14}
                      fontWeight={500}
                      width="fit-content"
                      // onClick={handleClear}
                      style={{ cursor: "pointer" }}
                      sx={{
                        visibility: "hidden",
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="1.5em"
                        height="1.5em"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill="red"
                          d="M12 20c-4.41 0-8-3.59-8-8s3.59-8 8-8s8 3.59 8 8s-3.59 8-8 8m0-18C6.47 2 2 6.47 2 12s4.47 10 10 10s10-4.47 10-10S17.53 2 12 2m2.59 6L12 10.59L9.41 8L8 9.41L10.59 12L8 14.59L9.41 16L12 13.41L14.59 16L16 14.59L13.41 12L16 9.41z"
                        />
                      </svg>
                    </Box>
                  </Grid>

                  <Grid
                    item
                    xl={6}
                    xs={12}
                    sx={{
                      display: "flex",
                      gap: 1.5,
                      alignItems: "center",
                      minWidth: "200px",
                      overflowX: "auto",
                      pb: 1.5,
                    }}
                  >
                    <Typography variant="subtitle1" fontWeight={600}>
                      5.{" "}
                    </Typography>

                    <Box
                      // display={"flex"}
                      // gap={2}
                      // alignItems={"center"}
                      position={"relative"}
                    >
                      <TextField
                        label="Calcium"
                        type="number"
                        className="form-input"
                        {...register("nutritionalGuarantee.calcium.kg", {
                          required: true,
                        })}
                        sx={{
                          width: "100%",
                          minWidth: 190,
                        }}
                      />
                      {errors &&
                        errors?.nutritionalGuarantee?.calcium?.kg &&
                        errors?.nutritionalGuarantee?.calcium.kg.type ===
                          "required" && (
                          <Typography
                            variant="body2"
                            color="red"
                            fontSize={13}
                            mt={0.5}
                          >
                            {validationMessage.required}
                          </Typography>
                        )}
                      <Typography
                        variant="body2"
                        color="#555555AC"
                        sx={{
                          position: "absolute",
                          right: 6,
                          top: errors?.nutritionalGuarantee?.calcium?.kg
                            ? "35%"
                            : "50%",
                          transform: "translate(-6px, -50%)",
                          backgroundColor: "#fff",
                          height: 30,
                          display: "grid",
                          placeItems: "center",
                          zIndex: 1,
                          pl: 1,
                        }}
                      >
                        g/kg
                      </Typography>
                    </Box>

                    <FormControl
                      fullWidth
                      className="form-input"
                      sx={{
                        minWidth: 110,
                      }}
                    >
                      <InputLabel id="feed-supply-select-label10">
                        Min
                      </InputLabel>
                      <Select
                        labelId="feed-supply-select-label10"
                        id="feed-supply-select10"
                        label="Min"
                        {...register("nutritionalGuarantee.calcium.value", {
                          required: true,
                        })}
                      >
                        {nutritionalGuarantee.map((guarantee, i) => {
                          return (
                            <MenuItem value={guarantee} key={i}>
                              {guarantee}
                            </MenuItem>
                          );
                        })}
                      </Select>
                      {errors &&
                        errors?.nutritionalGuarantee?.calcium?.value &&
                        errors?.nutritionalGuarantee?.calcium.value.type ===
                          "required" && (
                          <Typography
                            variant="body2"
                            color="red"
                            fontSize={13}
                            mt={0.5}
                          >
                            {validationMessage.required}
                          </Typography>
                        )}
                    </FormControl>

                    <Box
                      fontSize={14}
                      fontWeight={500}
                      width="fit-content"
                      // onClick={handleClear}
                      style={{ cursor: "pointer" }}
                      sx={{
                        visibility: "hidden",
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="1.5em"
                        height="1.5em"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill="red"
                          d="M12 20c-4.41 0-8-3.59-8-8s3.59-8 8-8s8 3.59 8 8s-3.59 8-8 8m0-18C6.47 2 2 6.47 2 12s4.47 10 10 10s10-4.47 10-10S17.53 2 12 2m2.59 6L12 10.59L9.41 8L8 9.41L10.59 12L8 14.59L9.41 16L12 13.41L14.59 16L16 14.59L13.41 12L16 9.41z"
                        />
                      </svg>
                    </Box>
                  </Grid>

                  <Grid
                    item
                    xl={6}
                    xs={12}
                    sx={{
                      display: "flex",
                      gap: 1.5,
                      alignItems: "center",
                      minWidth: "200px",
                      overflowX: "auto",
                      pb: 1.5,
                    }}
                  >
                    <Typography variant="subtitle1" fontWeight={600}>
                      6.{" "}
                    </Typography>

                    <Box
                      // display={"flex"}
                      // gap={2}
                      // alignItems={"center"}
                      position={"relative"}
                    >
                      <TextField
                        label="Phosphorous"
                        type="number"
                        className="form-input"
                        {...register("nutritionalGuarantee.phosphorous.kg", {
                          required: true,
                        })}
                        sx={{
                          width: "100%",
                          minWidth: 190,
                        }}
                      />
                      {errors &&
                        errors?.nutritionalGuarantee?.phosphorous?.kg &&
                        errors?.nutritionalGuarantee?.phosphorous.kg.type ===
                          "required" && (
                          <Typography
                            variant="body2"
                            color="red"
                            fontSize={13}
                            mt={0.5}
                          >
                            {validationMessage.required}
                          </Typography>
                        )}
                      <Typography
                        variant="body2"
                        color="#555555AC"
                        sx={{
                          position: "absolute",
                          right: 6,
                          top: errors?.nutritionalGuarantee?.phosphorous?.kg
                            ? "35%"
                            : "50%",
                          transform: "translate(-6px, -50%)",
                          backgroundColor: "#fff",
                          height: 30,
                          display: "grid",
                          placeItems: "center",
                          zIndex: 1,
                          pl: 1,
                        }}
                      >
                        g/kg
                      </Typography>
                    </Box>

                    {/* <Button
                    type="button"
                    variant="contained"
                    sx={{
                      background: "#06a19b",
                      color: "#fff",
                      fontWeight: 600,
                      padding: "6px 16px",
                      width: "fit-content",
                      textTransform: "capitalize",
                      borderRadius: "8px",
                      border: "1px solid #06A19B",
                      minWidth: 90,
                    }}
                    // onClick={() => handleCalculate(item, index)}
                  >
                    Calculate
                  </Button> */}

                    <FormControl
                      fullWidth
                      className="form-input"
                      sx={{
                        minWidth: 110,
                      }}
                    >
                      <InputLabel id="feed-supply-select-label10">
                        Min
                      </InputLabel>
                      <Select
                        labelId="feed-supply-select-label10"
                        id="feed-supply-select10"
                        label="Min"
                        {...register("nutritionalGuarantee.phosphorous.value", {
                          required: true,
                        })}
                      >
                        {nutritionalGuarantee.map((guarantee, i) => {
                          return (
                            <MenuItem value={guarantee} key={i}>
                              {guarantee}
                            </MenuItem>
                          );
                        })}
                      </Select>
                      {errors &&
                        errors?.nutritionalGuarantee?.phosphorous?.value &&
                        errors?.nutritionalGuarantee?.phosphorous.value.type ===
                          "required" && (
                          <Typography
                            variant="body2"
                            color="red"
                            fontSize={13}
                            mt={0.5}
                          >
                            {validationMessage.required}
                          </Typography>
                        )}
                    </FormControl>

                    <Box
                      fontSize={14}
                      fontWeight={500}
                      width="fit-content"
                      // onClick={handleClear}
                      style={{ cursor: "pointer" }}
                      sx={{
                        visibility: "hidden",
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="1.5em"
                        height="1.5em"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill="red"
                          d="M12 20c-4.41 0-8-3.59-8-8s3.59-8 8-8s8 3.59 8 8s-3.59 8-8 8m0-18C6.47 2 2 6.47 2 12s4.47 10 10 10s10-4.47 10-10S17.53 2 12 2m2.59 6L12 10.59L9.41 8L8 9.41L10.59 12L8 14.59L9.41 16L12 13.41L14.59 16L16 14.59L13.41 12L16 9.41z"
                        />
                      </svg>
                    </Box>
                  </Grid>

                  <Grid
                    item
                    xl={6}
                    xs={12}
                    sx={{
                      display: "flex",
                      gap: 1.5,
                      alignItems: "center",
                      minWidth: "200px",
                      overflowX: "auto",
                      pb: 1.5,
                    }}
                  >
                    <Typography variant="subtitle1" fontWeight={600}>
                      7.{" "}
                    </Typography>

                    <Box
                      // display={"flex"}
                      // gap={2}
                      // alignItems={"center"}
                      position={"relative"}
                    >
                      <TextField
                        label="Carbohydrates"
                        type="number"
                        className="form-input"
                        {...register("nutritionalGuarantee.carbohydrates.kg", {
                          required: true,
                        })}
                        sx={{
                          width: "100%",
                          minWidth: 190,
                        }}
                      />

                      <Typography
                        variant="body2"
                        color="#555555AC"
                        sx={{
                          position: "absolute",
                          right: 6,
                          top: errors?.nutritionalGuarantee?.carbohydrates?.kg
                            ? "35%"
                            : "50%",
                          transform: "translate(-6px, -50%)",
                          backgroundColor: "#fff",
                          height: 30,
                          display: "grid",
                          placeItems: "center",
                          zIndex: 1,
                          pl: 1,
                        }}
                      >
                        g/kg
                      </Typography>
                      {errors &&
                        errors?.nutritionalGuarantee?.carbohydrates?.kg &&
                        errors?.nutritionalGuarantee?.carbohydrates.kg.type ===
                          "required" && (
                          <Typography
                            variant="body2"
                            color="red"
                            fontSize={13}
                            mt={0.5}
                          >
                            {validationMessage.required}
                          </Typography>
                        )}
                    </Box>

                    <Button
                      type="button"
                      variant="contained"
                      sx={{
                        background: "#06a19b",
                        color: "#fff",
                        fontWeight: 600,
                        padding: "6px 16px",
                        width: "fit-content",
                        textTransform: "capitalize",
                        borderRadius: "8px",
                        border: "1px solid #06A19B",
                        minWidth: 90,
                      }}
                      // onClick={() => handleCalculate(item, index)}
                    >
                      Calculate
                    </Button>

                    <FormControl
                      fullWidth
                      className="form-input"
                      sx={{
                        minWidth: 110,
                      }}
                    >
                      <InputLabel id="feed-supply-select-label10">
                        Min
                      </InputLabel>
                      <Select
                        labelId="feed-supply-select-label10"
                        id="feed-supply-select10"
                        label="Min"
                        {...register(
                          "nutritionalGuarantee.carbohydrates.value",
                          {
                            required: true,
                          }
                        )}
                      >
                        {nutritionalGuarantee.map((guarantee, i) => {
                          return (
                            <MenuItem value={guarantee} key={i}>
                              {guarantee}
                            </MenuItem>
                          );
                        })}
                      </Select>
                      {errors &&
                        errors?.nutritionalGuarantee?.carbohydrates?.value &&
                        errors?.nutritionalGuarantee?.carbohydrates.value
                          .type === "required" && (
                          <Typography
                            variant="body2"
                            color="red"
                            fontSize={13}
                            mt={0.5}
                          >
                            {validationMessage.required}
                          </Typography>
                        )}
                    </FormControl>

                    <Box
                      fontSize={14}
                      fontWeight={500}
                      width="fit-content"
                      // onClick={handleClear}
                      style={{ cursor: "pointer" }}
                      sx={{
                        visibility: "hidden",
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="1.5em"
                        height="1.5em"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill="red"
                          d="M12 20c-4.41 0-8-3.59-8-8s3.59-8 8-8s8 3.59 8 8s-3.59 8-8 8m0-18C6.47 2 2 6.47 2 12s4.47 10 10 10s10-4.47 10-10S17.53 2 12 2m2.59 6L12 10.59L9.41 8L8 9.41L10.59 12L8 14.59L9.41 16L12 13.41L14.59 16L16 14.59L13.41 12L16 9.41z"
                        />
                      </svg>
                    </Box>
                  </Grid>

                  <Grid
                    item
                    xl={6}
                    xs={12}
                    sx={{
                      display: "flex",
                      gap: 1.5,
                      alignItems: "center",
                      minWidth: "200px",
                      overflowX: "auto",
                      pb: 1.5,
                    }}
                  >
                    <Typography variant="subtitle1" fontWeight={600}>
                      8.{" "}
                    </Typography>

                    <Box
                      // display={"flex"}
                      // gap={2}
                      // alignItems={"center"}
                      position={"relative"}
                    >
                      <TextField
                        label="Metabolizable Energy"
                        type="number"
                        className="form-input"
                        {...register(
                          "nutritionalGuarantee.metabolizableEnergy.kg",
                          {
                            required: true,
                          }
                        )}
                        sx={{
                          width: "100%",
                          minWidth: 190,
                        }}
                      />

                      <Typography
                        variant="body2"
                        color="#555555AC"
                        sx={{
                          position: "absolute",
                          right: 6,
                          top: errors?.nutritionalGuarantee?.metabolizableEnergy
                            ?.kg
                            ? "35%"
                            : "50%",
                          transform: "translate(-6px, -50%)",
                          backgroundColor: "#fff",
                          height: 30,
                          display: "grid",
                          placeItems: "center",
                          zIndex: 1,
                          pl: 1,
                        }}
                      >
                        MJ/kg
                      </Typography>
                      {errors &&
                        errors?.nutritionalGuarantee?.metabolizableEnergy?.kg &&
                        errors?.nutritionalGuarantee?.metabolizableEnergy.kg
                          .type === "required" && (
                          <Typography
                            variant="body2"
                            color="red"
                            fontSize={13}
                            mt={0.5}
                          >
                            {validationMessage.required}
                          </Typography>
                        )}
                    </Box>

                    <Button
                      type="button"
                      variant="contained"
                      sx={{
                        background: "#06a19b",
                        color: "#fff",
                        fontWeight: 600,
                        padding: "6px 16px",
                        width: "fit-content",
                        textTransform: "capitalize",
                        borderRadius: "8px",
                        border: "1px solid #06A19B",
                        minWidth: 90,
                      }}
                      // onClick={() => handleCalculate(item, index)}
                    >
                      Calculate
                    </Button>

                    <FormControl
                      fullWidth
                      className="form-input"
                      sx={{
                        minWidth: 110,
                      }}
                    >
                      <InputLabel id="feed-supply-select-label10">
                        Min
                      </InputLabel>
                      <Select
                        labelId="feed-supply-select-label10"
                        id="feed-supply-select10"
                        label="Min"
                        {...register(
                          "nutritionalGuarantee.metabolizableEnergy.value",
                          {
                            required: true,
                          }
                        )}
                      >
                        {nutritionalGuarantee.map((guarantee, i) => {
                          return (
                            <MenuItem value={guarantee} key={i}>
                              {guarantee}
                            </MenuItem>
                          );
                        })}
                      </Select>
                      {errors &&
                        errors?.nutritionalGuarantee?.metabolizableEnergy
                          ?.value &&
                        errors?.nutritionalGuarantee?.metabolizableEnergy.value
                          .type === "required" && (
                          <Typography
                            variant="body2"
                            color="red"
                            fontSize={13}
                            mt={0.5}
                          >
                            {validationMessage.required}
                          </Typography>
                        )}
                    </FormControl>

                    <Box
                      fontSize={14}
                      fontWeight={500}
                      width="fit-content"
                      // onClick={handleClear}
                      style={{ cursor: "pointer" }}
                      sx={{
                        visibility: "hidden",
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="1.5em"
                        height="1.5em"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill="red"
                          d="M12 20c-4.41 0-8-3.59-8-8s3.59-8 8-8s8 3.59 8 8s-3.59 8-8 8m0-18C6.47 2 2 6.47 2 12s4.47 10 10 10s10-4.47 10-10S17.53 2 12 2m2.59 6L12 10.59L9.41 8L8 9.41L10.59 12L8 14.59L9.41 16L12 13.41L14.59 16L16 14.59L13.41 12L16 9.41z"
                        />
                      </svg>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Stack>

            <Box>
              <Box
                display={"flex"}
                justifyContent={"flex-end"}
                alignItems={"center"}
                gap={3}
                mt={3}
              >
                <Button
                  type="submit"
                  variant="contained"
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
                  Add feed
                </Button>
                <Button
                  type="button"
                  variant="contained"
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
                  onClick={() => setActiveStep(0)}
                >
                  Previous
                </Button>
                <Button
                  type="button"
                  variant="contained"
                  sx={{
                    background: "#06A19B",
                    fontWeight: 600,
                    padding: "6px 16px",
                    width: "fit-content",
                    textTransform: "capitalize",
                    borderRadius: "8px",
                  }}
                  onClick={() => setActiveStep(2)}
                >
                  Next
                </Button>
              </Box>
            </Box>
          </form>
        </Box>
      </Stack>
    </>
  );
};

export default NewFeed;
