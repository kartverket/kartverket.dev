import Tooltip, { TooltipProps } from '@mui/material/Tooltip';

export const CustomTooltip = ({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} slotProps={{ tooltip: { className: className } }} />
);
