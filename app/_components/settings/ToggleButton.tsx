import { Tooltip } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { Theme } from '@mui/material/styles';

import Iconify from '../iconify';
import { IconButtonAnimate } from '../animate';
type Props = {
  open: boolean;
  notDefault: boolean;
  onToggle: VoidFunction;
};

export default function ToggleButton({ onToggle }: Props) {
  return (
    <Tooltip title="Settings" placement="left">
      <IconButtonAnimate
        color="inherit"
        onClick={onToggle}
        sx={{
          p: 1.25,
          transition: (theme: Theme) => theme.transitions.create('all'),
          '&:hover': {
            color: 'primary.main',
            bgcolor: (theme: Theme) =>
              alpha(
                theme.palette.primary.main,
                theme.palette.action.hoverOpacity,
              ),
          },
        }}
      >
        <Iconify icon="eva:options-2-fill" width={20} height={20} />
      </IconButtonAnimate>
    </Tooltip>
  );
}
