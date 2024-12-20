import { NextPage } from "next";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { Stack } from "@mui/material";
interface Props {}

const Loader: NextPage<Props> = ({}) => {
  return (
    <Stack
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
      }}
      className="loading-spinner"
    >
      <Box sx={{ display: "flex" }}>
        <div className="loader-container">
          <div className="loader-inner">
            <img src="../static/img/loader.png" className="loader" />
          </div>
          <div></div>
          <div></div>
        </div>
      </Box>
    </Stack>
  );
};

export default Loader;
