"use client";
// import Typography from "@/app/_components/theme/overrides/Typography";
import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import logo from "@/public/static/img/logo.svg";
import { setCookie } from "cookies-next";

interface IFormInput {
  password: string;
  confirmPassword: string;
}

const Page = ({ params }: { params: { organisationId: string } }) => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<IFormInput>();

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    if (data.password && params.organisationId) {
      const response = await fetch("/api/add-new-user/setPassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: params.organisationId,
          password: data.password,
        }),
      });
      const responseData = await response.json();
      console.log(responseData);
      setCookie("logged-user", responseData);
      setCookie("role", responseData?.data?.user?.role);

      if (responseData.status && responseData.token) {
        router.push("/dashboard/organisation");
      }
    }
  };

  // Watch the password field to validate confirmPassword
  const password = watch("password");

  return (
    <Stack
      display={"flex"}
      justifyContent={"center"}
      alignItems={"center"}
      minHeight={"100vh"}
      sx={{
        background:
          "linear-gradient(349.33deg, rgba(6, 161, 155, 0.4) -27.15%, rgba(2, 59, 57, 0) 103.57%)",
      }}
    >
      <Box
        sx={{
          padding: {
            lg: 5,
            xs: 3,
          },
          border: "1px solid #06A19B",
          borderRadius: "14px",
          background: "#fff",
          marginX: {
            md: 0,
            xs: 3,
          },
        }}
      >
        <Image src={logo} alt="Logo" width={80} />
        <Typography
          mt={2}
          variant="h5"
          fontWeight={600}
          marginBottom={4}
          textTransform={"capitalize"}
          sx={{
            fontSize: {
              md: "24px",
              xs: "20px",
            },
          }}
        >
          Set Password
        </Typography>

        <Box position="relative" className="login-inputs">
          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              label="Password"
              type="password"
              // focused
              className="form-input"
              sx={{
                width: "100%",
                marginBottom: 4,
              }}
              id="password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
              })}
              required
            />
            {errors.password && <span>{errors.password.message}</span>}
            <TextField
              label="Confirm Password"
              type="password"
              className="form-input"
              // focused
              sx={{
                width: "100%",
                marginBottom: 3,
              }}
              id="confirmPassword"
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (value) =>
                  value === password || "Passwords do not match",
              })}
              required
            />
            {errors.confirmPassword && (
              <span>{errors.confirmPassword.message}</span>
            )}
            <Button
              variant="contained"
              sx={{
                background: "#06A19B",
                fontWeight: "600",
                padding: "10px 24px",
                width: "100%",
                textTransform: "capitalize",
                borderRadius: "8px",
                fontSize: 18,
              }}
              type="submit"
            >
              Continue
            </Button>
          </form>
        </Box>
      </Box>
    </Stack>
    // Set Password Section End
  );
};

export default Page;
