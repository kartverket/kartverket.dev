import Tooltip, { tooltipClasses, TooltipProps } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';

export const CustomTooltip: React.ComponentType<TooltipProps> = styled(
  Tooltip,
)<TooltipProps>(() => ({
  [`& .${tooltipClasses.tooltip}`]: {
    color: 'black',
    backgroundColor: 'white',
    fontSize: 16,
    maxWidth: 750,
    padding: 8,
    wordWrap: 'break-word',
    border: '1px solid black',
  },
}));
