import { Box, Button } from "@mui/material";
interface Iprops {
  setActiveStep: (val: number) => void;
  steps: { label: String; id: number }[];
}
function FeedStore({ setActiveStep, steps }: Iprops) {
  return (
    <div>
      Feed Store
      {steps.length === 3 && (
        <Box>
          <Box
            display={"flex"}
            alignItems={"center"}
            mt={3}
            gap={2}
            flexWrap={"wrap"}
            justifyContent={"end"}
            width={"100%"}
          >
            <Box
              display={"flex"}
              justifyContent={"flex-end"}
              alignItems={"center"}
              gap={3}
            >
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
        </Box>
      )}
    </div>
  );
}

export default FeedStore;
