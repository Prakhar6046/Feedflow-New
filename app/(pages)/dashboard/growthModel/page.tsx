import BasicBreadcrumbs from "@/app/_components/Breadcrumbs";
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Stack,
  Typography,
  TextField,
} from "@mui/material";
export default async function Page() {
  return (
    <>
      <BasicBreadcrumbs
        heading={"Growth Parameter"}
        links={[
          { name: "Dashboard", link: "/dashboard" },
          { name: "Growth Parameter", link: "/dashboard/growthModel" },
        ]}
      />

      <Grid
        container
        sx={{
          width: "100%",
          overflow: "hidden",
          borderRadius: "14px",
          boxShadow: "0px 0px 16px 5px #0000001A",
          p: 3,
        }}
      >
        <Stack>
          <Typography
            variant="h6"
            fontWeight={700}
            sx={{
              fontSize: {
                md: 24,
                xs: 20,
              },
              marginBlock: 2,
            }}
          >
            Growth Model
          </Typography>

          <Box>
            <Typography variant="subtitle1" fontWeight={500} marginBottom={3}>
              Niloticus x Aureus-UNESP
            </Typography>
            <form>
              <Grid container spacing={2}>
                {/* div-1 */}
                <Grid item md={6} xs={12}>
                  <FormControl fullWidth className="form-input" focused>
                    <InputLabel id="feed-supply-select-label5">
                      Specie *
                    </InputLabel>
                    <Select
                      labelId="feed-supply-select-label5"
                      id="feed-supply-select5"
                      label="Species *"
                    >
                      <MenuItem value={1}>
                        Tilapia (Oreochromis Nilotic x Aureus)
                      </MenuItem>
                      <MenuItem value={2}>Supplier 2</MenuItem>
                      <MenuItem value={3}>Supplier 3</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                {/* grid-2 */}
                <Grid item md={6} xs={12}>
                  <TextField
                    label="Temperature Coefficient *"
                    type="text"
                    className="form-input"
                    focused
                    sx={{
                      width: "100%",
                    }}
                  />

                  <Typography
                    variant="body2"
                    color="red"
                    fontSize={13}
                    mt={0.5}
                  ></Typography>

                  <Typography
                    variant="body2"
                    color="red"
                    fontSize={13}
                    mt={0.5}
                  ></Typography>
                </Grid>

                {/* grid-3 */}
                <Grid item md={6} xs={12}>
                  <TextField
                    label="Growth equation - Length *"
                    type="text"
                    className="form-input"
                    focused
                    sx={{
                      width: "100%",
                    }}
                  />
                </Grid>

                {/* grid-4 */}
                <Grid item md={6} xs={12}>
                  <TextField
                    label="Growth equation (bodyweight) *"
                    type="text"
                    className="form-input"
                    focused
                    sx={{
                      width: "100%",
                    }}
                  />
                </Grid>

                {/* grid-5 */}
                <Grid item md={6} xs={12}>
                  <TextField
                    label="Condition Factor *"
                    type="text"
                    className="form-input"
                    focused
                    sx={{
                      width: "100%",
                    }}
                  />
                </Grid>

                {/* grid-6 */}
                <Grid item md={6} xs={12}>
                  <TextField
                    label="Condition Factor *"
                    type="text"
                    className="form-input"
                    focused
                    sx={{
                      width: "100%",
                    }}
                  />
                </Grid>
              </Grid>
            </form>
          </Box>

          {/* div-2 */}
          <Typography variant="subtitle1" fontWeight={500} marginBlock={3}>
            Niloticus x Aureus-UNESP
          </Typography>

          <Box>
            <form>
              <Grid container spacing={2}>
                <Grid item md={6} xs={12}>
                  <FormControl fullWidth className="form-input" focused>
                    <InputLabel id="feed-supply-select-label5">
                      Specie *
                    </InputLabel>
                    <Select
                      labelId="feed-supply-select-label5"
                      id="feed-supply-select5"
                      label="Species *"
                    >
                      <MenuItem value={1}>
                        Tilapia (Oreochromis Nilotic x Aureus)
                      </MenuItem>
                      <MenuItem value={2}>Supplier 2</MenuItem>
                      <MenuItem value={3}>Supplier 3</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                {/* grid-2 */}
                <Grid item md={6} xs={12}>
                  <TextField
                    label="Temperature Coefficient *"
                    type="text"
                    className="form-input"
                    focused
                    sx={{
                      width: "100%",
                    }}
                  />

                  <Typography
                    variant="body2"
                    color="red"
                    fontSize={13}
                    mt={0.5}
                  ></Typography>

                  <Typography
                    variant="body2"
                    color="red"
                    fontSize={13}
                    mt={0.5}
                  ></Typography>
                </Grid>

                {/* grid-3 */}
                <Grid item md={6} xs={12}>
                  <TextField
                    label="Growth equation - Length *"
                    type="text"
                    className="form-input"
                    focused
                    sx={{
                      width: "100%",
                    }}
                  />
                </Grid>

                {/* grid-4 */}
                <Grid item md={6} xs={12}>
                  <TextField
                    label="Growth equation (bodyweight) *"
                    type="text"
                    className="form-input"
                    focused
                    sx={{
                      width: "100%",
                    }}
                  />
                </Grid>

                {/* grid-5*/}
                <Grid item md={6} xs={12}>
                  <TextField
                    label="Condition Factor *"
                    type="text"
                    className="form-input"
                    focused
                    sx={{
                      width: "100%",
                    }}
                  />
                </Grid>

                {/* grid-6 */}
                <Grid item md={6} xs={12}>
                  <TextField
                    label="Condition Factor *"
                    type="text"
                    className="form-input"
                    focused
                    sx={{
                      width: "100%",
                    }}
                  />
                </Grid>
              </Grid>
            </form>
          </Box>
        </Stack>
      </Grid>
    </>
  );
}
