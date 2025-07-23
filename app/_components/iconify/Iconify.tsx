// import { Icon } from "@iconify/react";
// import { forwardRef } from "react";

// import { Box, BoxProps } from "@mui/material";

// import { IconifyProps } from "./types";

// interface Props extends BoxProps {
// 	icon: IconifyProps;
// }

// const Iconify = forwardRef<SVGElement, Props>(({ icon, width = 20, sx, ...other }, ref) => (
// 	<Box ref={ref} component={Icon} icon={icon} sx={{ width, height: width, ...sx }} {...other} />
// ));

// Iconify.displayName = "Iconify";

// export default Iconify;

import { Icon } from '@iconify/react';
import { forwardRef } from 'react';
import { Box, BoxProps } from '@mui/material';
import { IconifyProps } from './types';

interface Props extends BoxProps {
  icon: IconifyProps;
}

const Iconify = forwardRef<SVGElement, Props>(
  ({ icon, width = 20, sx, ...other }, ref) => (
    <Box ref={ref} sx={{ width, height: width, ...sx }} {...other}>
      <Icon icon={icon} />
    </Box>
  ),
);

Iconify.displayName = 'Iconify';

export default Iconify;
