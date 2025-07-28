import { capitalCase } from 'change-case';

import { CardActionArea, Grid, RadioGroup, Typography } from '@mui/material';
import { alpha, styled } from '@mui/material/styles';

// import Iconify from "@/components/iconify";
// import useSettings from "@/hooks/useSettings";

import BoxMask from './BoxMask';
import Iconify from '../iconify';
import useSettings from '@/app/hooks/useSettings';

const BoxStyle = styled(CardActionArea)(({ theme }) => ({
  height: 72,
  padding: '8px 0',
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'column',
  justifyContent: 'space-around',
  color: theme.palette.text.disabled,
  border: `solid 1px ${alpha(theme.palette.grey[500], 0.12)}`,
  borderRadius: Number(theme.shape.borderRadius) * 1.25,
}));

export default function SettingMode() {
  const { themeMode, onChangeMode } = useSettings();

  return (
    <RadioGroup name="themeMode" value={themeMode} onChange={onChangeMode}>
      <Grid dir="ltr" container spacing={2.5}>
        {['system', 'light', 'dark'].map((mode) => {
          const isSelected = themeMode === mode;

          return (
            <Grid key={mode} item xs={4}>
              <BoxStyle
                sx={{
                  ...(isSelected && {
                    color: 'primary.main',
                    borderColor: 'primary.main',
                    boxShadow: (theme) => theme.customShadows.z20,
                  }),
                }}
              >
                <Iconify
                  icon={
                    mode === 'system'
                      ? 'ph:magic-wand-duotone'
                      : mode === 'light'
                        ? 'ph:sun-duotone'
                        : 'ph:moon-duotone'
                  }
                  width={28}
                  height={28}
                />
                <Typography variant="caption">{capitalCase(mode)}</Typography>
                <BoxMask value={mode} />
              </BoxStyle>
            </Grid>
          );
        })}
      </Grid>
    </RadioGroup>
  );
}
