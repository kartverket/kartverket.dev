import Chip from '@mui/material/Chip';
import { RiscStatusData } from '../../typesFrontend';
import { riscColor, riscLabelText, riscTextColor } from './utils';

export const riscStatusLabel = (status: RiscStatusData) => {
  const backgroundColor = riscColor(status.lastPublishedRisc);
  const color = riscTextColor(backgroundColor);
  return (
    <Chip
      label={riscLabelText(status.lastPublishedRisc)}
      size="small"
      sx={{
        backgroundColor,
        color,
        mt: 0.5,
        mb: 0.5,
        borderRadius: 1,
      }}
    />
  );
};
